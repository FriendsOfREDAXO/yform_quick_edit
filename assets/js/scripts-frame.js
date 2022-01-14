$(document).on('rex:ready', function () {
  parent.quickEditLoaded();
  const $form = $('form.rex-yform');
  let success = false;
  const $fieldsToIgnore = $form.find('.yqe-ignore');
  const $formBtnToolbar = $form.find('.btn-toolbar');
  $formBtnToolbar.append('<a href="#" class="btn btn-danger" id="yqe-cancel">'+rex.yqeCancel+'</a>');
  const $cancelButton = $formBtnToolbar.find('#yqe-cancel');

  $cancelButton.on('click', event => {
    event.preventDefault();
    parent.quickEditCloseFrame(true);
  });

  $fieldsToIgnore.each((i, element) => {
    const $element = $(element);
    const $formGroup = $element.closest('.form-group');

    if($formGroup.length) {
      $formGroup.hide();
    }
    else {
      $element.hide();
    }
  });

  $form.on('submit', event => {
    event.preventDefault();

    parent.quickEditShowLoading();

    $.ajax({
      type: 'post',
      url: $form.attr('action'),
      data: $form.serialize(),
      success: (response) => {
        const $document = $(response);
        const $errorItems = $document.find('form.rex-yform .has-error');
        const $formErrorWrapper = $form.find('.alert-danger');
        const $errorWrapper = $document.find('form.rex-yform .alert-danger');

        if($errorItems.length) {
          $('.has-error').removeClass('has-error');

          $errorItems.each((i, element) => {
            const $element = $(element);
            $form.find('#' + $element.attr('id')).addClass('has-error');
          });

          if($formErrorWrapper.length){
            $formErrorWrapper.replaceWith($errorWrapper);
          }
          else {
            $form.prepend($errorWrapper);
          }

          parent.quickEditResize();
        }
        else {
          success = true;
        }
      },
      error: (e) => {
        console.error('YForm QuickEdit', '  ↴', '\n', e);
      },
      complete: () => {
        parent.quickEditHideLoading();

        if(success) {
          parent.quickEditCloseFrame(true);
        }
      }
    });
  });
});
