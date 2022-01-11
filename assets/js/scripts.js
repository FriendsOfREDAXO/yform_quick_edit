let active = null;

$(document).on('rex:ready', function () {
  const $quickEdit = $('a.yform-quick-edit');

  $quickEdit.on('click', function (event) {
    event.preventDefault();
    const $element = $(event.currentTarget);
    const $row = $element.parents('tr');
    const colspan = $row.find('td').length;

    if (active) {
      $('tr.quick-edit-row-' + active).removeClass('active');
    }

    if (active !== $element.data('id')) {
      active = $element.data('id');
      $('tr.quick-edit-row-' + active).addClass('active');

      $('#yform-quick-edit-frame').remove();
      $row.after('<tr><td style="padding: 0" colspan="' + colspan + '"><iframe id="yform-quick-edit-frame" style="border: 0; width: 100%; height: 560px;"></iframe></td></tr>');
      $('#yform-quick-edit-frame').attr('src', $element.attr('href'));

      /**
       * TODO: wait until iframe src is loaded
       */
      setTimeout(() => {
        iFrameResize({
          log: true,
          heightCalculationMethod: 'bodyScroll'
        }, '#yform-quick-edit-frame');
      }, 500)
    }
  })
})
