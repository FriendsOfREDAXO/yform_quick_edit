/* global rex */
$(document).one('rex:ready', function () {
    new QuickEdit();
});

class QuickEdit {
    constructor() {
        this.ADD_CLASS = 1;
        this.REMOVE_CLASS = 2;
        this.activeId = null;
        this.activeRowSelector = null;
        this.qeId = null;
        this.$activeQuickEdit = null;
        this.$activeForm = null;
        this.$rexAjaxLoader = $('#rex-js-ajax-loader');
        this.$fixedNavbar = $('.rex-nav-top-is-fixed');

        this.attachEventHandler();

        $(document).on('keyup', event => {
            if (event.key === 'Escape') {
                this.closeQuickEdit();
            }
        });
    }

    attachEventHandler() {
        const $quickEdit = $('a.yform-quick-edit');

        $quickEdit.off('click');
        $quickEdit.on('click', event => {
            event.preventDefault();
            const $element = $(event.currentTarget);
            const id = $element.data('id');
            const $row = $element.parents('tr');
            const colspan = $row.find('td').length;

            this.showLoading();

            if (this.activeId === id) {
                this.closeQuickEdit();
                this.hideLoading();
                return;
            }

            if (this.activeId !== id) {
                this.closeQuickEdit();
                this.activeId = id;
                this.qeId = 'yform-quick-edit-' + ((Math.random() * 200).toString(36)).replace('.', '');
                this.activeRowSelector = 'tr.quick-edit-row-' + this.activeId;
                this.changeActiveRowClass('active', this.ADD_CLASS);
                $row.after('<tr><td style="padding: 0;" colspan="' + colspan + '"><div class="yqu-wrapper" id="' + this.qeId + '"></div></td></tr>');

                this.showQuickEdit($element.attr('href'), $row);
            }
        })
    }

    showQuickEdit(url, $row) {
        this.showLoading();

        /**
         * get form
         */
        $.pjax({
            url: url,
            container: '#' + this.qeId,
            fragment: '#rex-yform',
            push: false,
        });

        this.$activeQuickEdit = $('#' + this.qeId);

        this.$activeQuickEdit.on('pjax:end', () => {
            this.$activeForm = this.$activeQuickEdit.find('form.rex-yform');
            this.attachSubmitHandler();

            let offset = $row.offset().top;
            if (this.$fixedNavbar.length) {
                offset -= this.$fixedNavbar.height();
            }
            $(window).scrollTop(offset);
        });

        this.$activeQuickEdit.on('pjax:beforeReplace', (event, contents) => {
            /**
             * remove fields to ignore
             */
            const $content = $(contents);
            $content.find('.yqe-ignore').each((i, element) => {
                const $element = $(element);
                const $formGroup = $element.closest('.form-group, .form-check-group');

                if ($formGroup.length) {
                    $formGroup.remove();
                } else {
                    $element.remove();
                }
            });

            /**
             * append cancel button
             */
            $content.find('.btn-toolbar').append('<a href="#" class="btn btn-danger" id="yqe-cancel">' + rex.yform_quick_edit_cancel + '</a>');
            const $cancelButton = $content.find('#yqe-cancel');

            $cancelButton.on('click', event => {
                event.preventDefault();
                this.closeQuickEdit();
            });
        });
    }

    attachSubmitHandler() {
        this.$activeForm.on('submit', event => {
            event.preventDefault();

            /**
             * ckeditor5 fix
             */
            if (typeof ckeditors !== 'undefined') {
                for (const ckeditorKey in ckeditors) {
                    ckeditors[ckeditorKey].updateSourceElement();
                }
            }

            /**
             * submit form
             */
            $.ajax({
                type: 'post',
                url: this.$activeForm.attr('action'),
                data: this.$activeForm.serialize(),
                success: (response) => {
                    const $document = $(response);
                    const $errorItems = $document.find('form.rex-yform .form-group.has-error');
                    const $formErrorWrapper = this.$activeForm.find('.alert-danger');
                    const $errorWrapper = $document.find('form.rex-yform .alert-danger');

                    /**
                     * get yform errors
                     */
                    if ($errorItems.length) {
                        $('.has-error').removeClass('has-error');
                        this.addError();

                        $errorItems.each((i, element) => {
                            const $element = $(element);
                            this.$activeForm.find('#' + $element.attr('id')).addClass('has-error');
                        });

                        if ($formErrorWrapper.length) {
                            $formErrorWrapper.replaceWith($errorWrapper);
                        } else {
                            this.$activeForm.prepend($errorWrapper);
                        }
                    } else {
                        this.success = true;
                    }
                },
                error: (e) => {
                    console.error('YForm QuickEdit', '  ↴', '\n', e);
                },
                complete: () => {
                    this.hideLoading();

                    if (this.success) {
                        this.closeQuickEdit(true);
                    }
                }
            });
        });
    }

    closeQuickEdit(updateRow) {
        if (this.$activeQuickEdit) {
            this.removeQuickEdit();
            this.changeActiveRowClass('active', this.REMOVE_CLASS);
            this.changeActiveRowClass('error', this.REMOVE_CLASS);

            if (updateRow) {
                $.get(window.location.href, data => {
                    const $updatedCells = $(data).find(this.activeRowSelector + ' > *');
                    const $cells = $(this.activeRowSelector + ' > *');

                    /**
                     * replace cells without a-tags
                     * TODO: find a better solution :|
                     */
                    for (let i = 0; i < $updatedCells.length; i++) {
                        let $cell = $cells.eq(i);
                        let $el = $($cell.html());

                        try {
                            if ($el.prop('nodeName').toLowerCase() === 'a' || $cell.hasClass('rex-table-action')) {
                                continue;
                            }
                        } catch (err) {
                        }

                        $cell.html($updatedCells.eq(i).html());
                    }

                    this.resetQuickEdit();
                });
            } else {
                this.resetQuickEdit();
            }
        }
    }

    removeQuickEdit() {
        if (this.$activeQuickEdit) {
            /**
             * remove quick edit
             */
            this.$activeQuickEdit.parents('tr').remove();
        }
    }

    resetQuickEdit() {
        /**
         * reset active elements
         */
        this.activeId = null;
        this.activeRowSelector = null;
        this.$activeForm = null;
        this.$activeQuickEdit = null;
    }

    addError() {
        this.changeActiveRowClass('error', this.ADD_CLASS);
    }

    changeActiveRowClass(rowClass, type) {
        if (type === this.ADD_CLASS) {
            $(this.activeRowSelector).addClass(rowClass);
        } else if (type === this.REMOVE_CLASS) {
            $(this.activeRowSelector).removeClass(rowClass);
        }
    }

    showLoading() {
        this.$rexAjaxLoader.addClass('rex-visible');
    }

    hideLoading() {
        this.$rexAjaxLoader.removeClass('rex-visible');
    }
}
