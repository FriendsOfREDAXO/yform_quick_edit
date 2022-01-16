/* global rex */

$(document).on('rex:ready', function () {
  new QuickEdit()
});

class QuickEdit {
  constructor() {
    this.ADD_CLASS = 1;
    this.REMOVE_CLASS = 2;
    this.active = null;
    this.activeFrame = null;
    this.activeRowSelector = null;
    this.frameId = null;
    this.$rexAjaxLoader = $('#rex-js-ajax-loader');

    this.attachEventHandler();

    $(document).on('keyup', event => {
      if (event.key === 'Escape') {
        this.closeFrame();
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

      if (this.active === id) {
        this.closeFrame();
        this.hideLoading();
        return;
      }

      if (this.active !== id) {
        this.closeFrame();

        this.active = id;
        this.frameId = 'yform-quick-edit-frame-'+((Math.random() * 200).toString(36)).replace('.', '');
        this.activeRowSelector = 'tr.quick-edit-row-' + this.active;
        this.changeActiveRowClass('active', this.ADD_CLASS);
        $row.after('<tr><td style="padding: 0;" colspan="' + colspan + '"><iframe id="'+this.frameId+'" style="border: 0; width: 100%; height: 0; display: block"></iframe></td></tr>');
        $('#'+this.frameId).attr('src', $element.attr('href'));
        $(window).scrollTop($row.offset().top);

        this.setIframe();
      }
    })
  }

  setIframe() {
    this.showLoading();

    this.activeFrame = iFrameResize({
      heightCalculationMethod: 'bodyScroll',
      onMessage: this.receiveMessage.bind(this),
    }, '#'+this.frameId);
  }

  reload() {
    /**
     * reload iframe src
     */
    if (this.activeFrame) {
      $(this.activeFrame[0]).attr('src', (i, src) => {
        return src;
      });
    }
  }

  resize() {
    /**
     * resize iframe
     */
    if (this.activeFrame) {
      this.activeFrame[0].iFrameResizer.resize();
    }
  }

  closeFrame(updateRow) {
    if (this.activeFrame) {
      this.removeFrame();
      this.changeActiveRowClass('active', this.REMOVE_CLASS);
      this.changeActiveRowClass('error', this.REMOVE_CLASS);

      if(updateRow) {
        $.get(window.location.href, data => {
          const $updatedCells = $(data).find(this.activeRowSelector + ' > *');
          const $cells = $(this.activeRowSelector + ' > *');

          /**
           * replace cells without a-tags
           * TODO: find a better solution :|
           */
          for (let i = 0; i < $updatedCells.length; i++) {
            let $el;
            try {
              $el = $($cells.eq(i).html());

              if($el.prop('nodeName').toLowerCase() === 'a') {
                continue;
              }
            }
            catch(err) {
            }

            $cells.eq(i).html($updatedCells.eq(i).html());
          }

          this.reset();
        });
      }
      else {
        this.reset();
      }
    }
  }

  removeFrame() {
    if (this.activeFrame) {
      /**
       * remove frame
       */
      const $parent = $(this.activeFrame[0]).parents('tr');
      this.activeFrame[0].iFrameResizer.close();
      $parent.remove();
    }
  }

  reset() {
    /**
     * reset active elements
     */
    this.active = null;
    this.activeFrame = null;
    this.activeRowSelector = null;
  }

  addError() {
    this.changeActiveRowClass('error', this.ADD_CLASS);
  }

  changeActiveRowClass(rowClass, type) {
    if(type === this.ADD_CLASS) {
      $(this.activeRowSelector).addClass(rowClass);
    }
    else if(type === this.REMOVE_CLASS) {
      $(this.activeRowSelector).removeClass(rowClass);
    }
  }

  receiveMessage(frame) {
    /**
     * receive messages from iFrame
     */
    switch (frame.message) {
      case rex.yform_quick_edit_close:
        this.closeFrame(true);
        break
      case rex.yform_quick_edit_reload:
        this.reload();
        break
      case rex.yform_quick_edit_resize:
        this.resize();
        break
      case rex.yform_quick_edit_show_loading:
        this.showLoading()
        break
      case rex.yform_quick_edit_hide_loading:
        this.hideLoading();
        break
      case rex.yform_quick_edit_error:
        this.addError();
        break
    }
  }

  showLoading() {
    this.$rexAjaxLoader.addClass('rex-visible');
  }

  hideLoading() {
    this.$rexAjaxLoader.removeClass('rex-visible');
  }
}