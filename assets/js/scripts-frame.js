$(document).on('rex:ready', function () {
  parent.quickEditLoaded();
  const $form = $('form.rex-yform');

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

        if($errorItems.length) {
          $errorItems.each((i, element) => {
            const $element = $(element);
            $form.find('#' + $element.attr('id')).addClass('has-error');
          });

          $form.prepend($document.find('form.rex-yform .alert-danger'));

          parent.quickEditResize();
        }
        else {
          parent.quickEditHideLoading();
          parent.quickEditCloseFrame();
        }
      },
      error: (e) => {
      }
    });
  });
});
