/* global rex */

$(document).on('rex:ready', function () {
  window.iFrameResizer = {
    onReady: () => {
      if ('parentIFrame' in window) {
        new QuickEditFrame()
      }
    }
  };
});

class QuickEditFrame {
  constructor() {
    this.$form = $('form.rex-yform');
    this.$fieldsToIgnore = this.$form.find('.yqe-ignore');
    this.$formBtnToolbar = this.$form.find('.btn-toolbar');
    this.$cancelButton = null;
    this.success = false;

    this.initFrame();
    this.attachSubmitHandler();
  }

  initFrame() {
    parentIFrame.sendMessage(rex.yqeHideLoading);

    this.$formBtnToolbar.append('<a href="#" class="btn btn-danger" id="yqe-cancel">'+rex.yqeCancel+'</a>');
    this.$cancelButton = this.$formBtnToolbar.find('#yqe-cancel');

    /**
     * append cancel button
     */
    this.$cancelButton.on('click', event => {
      event.preventDefault();
      parentIFrame.sendMessage(rex.yqeClose);
    });

    /**
     * hide fields to ignore
     */
    this.$fieldsToIgnore.each((i, element) => {
      const $element = $(element);
      const $formGroup = $element.closest('.form-group');

      if($formGroup.length) {
        $formGroup.hide();
      }
      else {
        $element.hide();
      }
    });
  }

  attachSubmitHandler() {
    this.$form.on('submit', event => {
      event.preventDefault();

      parentIFrame.sendMessage(rex.yqeShowLoading);

      $.ajax({
        type: 'post',
        url: this.$form.attr('action'),
        data: this.$form.serialize(),
        success: (response) => {
          const $document = $(response);
          const $errorItems = $document.find('form.rex-yform .has-error');
          const $formErrorWrapper = this.$form.find('.alert-danger');
          const $errorWrapper = $document.find('form.rex-yform .alert-danger');

          /**
           * get yform errors
           */
          if($errorItems.length) {
            $('.has-error').removeClass('has-error');

            $errorItems.each((i, element) => {
              const $element = $(element);
              this.$form.find('#' + $element.attr('id')).addClass('has-error');
            });

            if($formErrorWrapper.length){
              $formErrorWrapper.replaceWith($errorWrapper);
            }
            else {
              this.$form.prepend($errorWrapper);
            }

            parentIFrame.sendMessage(rex.yqeResize);
          }
          else {
            this.success = true;
          }
        },
        error: (e) => {
          console.error('YForm QuickEdit', '  ↴', '\n', e);
        },
        complete: () => {
          parentIFrame.sendMessage(rex.yqeHideLoading);

          if(this.success) {
            parentIFrame.sendMessage(rex.yqeClose);
          }
        }
      });
    });
  }
}
