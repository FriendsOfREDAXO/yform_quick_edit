let active = null;
let activeFrame = null;

$(document).on('rex:ready', function () {
  const $quickEdit = $('a.yform-quick-edit');

  $quickEdit.on('click', function (event) {
    event.preventDefault();
    const $element = $(event.currentTarget);
    const $row = $element.parents('tr');
    const colspan = $row.find('td').length;

    if (active) {
      $('tr.quick-edit-row-' + active).removeClass('active');
      const $parent = $(activeFrame[0]).parents('tr');
      activeFrame[0].iFrameResizer.close();
      $parent.remove();
    }

    if (active !== $element.data('id')) {
      active = $element.data('id');
      $('tr.quick-edit-row-' + active).addClass('active');
      $row.after('<tr><td style="padding: 0" colspan="' + colspan + '"><iframe id="yform-quick-edit-frame" style="border: 0; width: 100%; height: 560px;"></iframe></td></tr>');
      $('#yform-quick-edit-frame').attr('src', $element.attr('href'));
    }
  })
})

function quickEditLoaded() {
  setTimeout(() => {
    activeFrame = iFrameResize({
      heightCalculationMethod: 'bodyScroll'
    }, '#yform-quick-edit-frame');
  }, 250)
}
