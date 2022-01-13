$(document).on('rex:ready', function () {
  parent.quickEditLoaded();
  const $form = $('form.rex-yform');
  let success = false;
  const $fieldsToIgnore = $form.find('.yqe-ignore');
  const $formBtnToolbar = $form.find('.btn-toolbar');

  $formBtnToolbar.append('<a href="#" id="yqe-cancel"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#c9302c" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg></a>');

  $fieldsToIgnore.each((i, element) => {
    const $element = $(element);
    $element.closest('.form-group').css('display', 'none');
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
        //
      },
      complete: (e) => {
        parent.quickEditHideLoading();

        if(success) {
          parent.quickEditCloseFrame(true);
        }
      }
    });
  });
});
