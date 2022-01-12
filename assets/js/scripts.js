let active = null;
let activeFrame = null;
let activeRowSelector = null;
let $rexAjaxLoader;

$(document).on('rex:ready', function () {
  quickEditAttachEventHandler();
  $rexAjaxLoader = $('#rex-js-ajax-loader');

  $(document).on('keyup', function(event) {
    if (event.key === 'Escape') {
      quickEditCloseFrame();
    }
  });
});

function quickEditAttachEventHandler() {
  const $quickEdit = $('a.yform-quick-edit');

  $quickEdit.off('click');
  $quickEdit.on('click', function (event) {
    event.preventDefault();
    const $element = $(event.currentTarget);
    const id = $element.data('id');
    const $row = $element.parents('tr');
    const colspan = $row.find('td').length;

    quickEditShowLoading();

    if (active === id) {
      quickEditCloseFrame();
      quickEditHideLoading();
      return;
    }

    if (active !== id) {
      quickEditCloseFrame();

      active = id;
      activeRowSelector = 'tr.quick-edit-row-' + active;
      $(activeRowSelector).addClass('active');
      $row.after('<tr><td style="padding: 0" colspan="' + colspan + '"><iframe id="yform-quick-edit-frame" style="border: 0; width: 100%; height: 0"></iframe></td></tr>');
      $('#yform-quick-edit-frame').attr('src', $element.attr('href'));
      $(window).scrollTop($row.offset().top);
    }
  })
}

function quickEditLoaded() {
  /**
   * wait until iframe src is loaded
   * timeout - wait for wysiwyg editors...
   */
  setTimeout(() => {
    activeFrame = iFrameResize({
      heightCalculationMethod: 'bodyScroll'
    }, '#yform-quick-edit-frame');

    quickEditHideLoading();
  }, 250)
}

function quickEditReload() {
  /**
   * reload iframe src
   */
  if (activeFrame) {
    $(activeFrame[0]).attr('src', (i, src) => {
      return src;
    });
  }
}

function quickEditResize() {
  /**
   * resize iframe
   */
  if (activeFrame) {
    activeFrame[0].iFrameResizer.resize();
  }
}

function quickEditCloseFrame(updateRow) {
  if (activeFrame) {
    /**
     * replace row
     * reset active elements
     */
    quickEditRemoveFrame();
    $(activeRowSelector).removeClass('active');

    if(updateRow) {
      $(activeRowSelector).load(window.location.href + ' ' + activeRowSelector + ' > *', () => {
        quickEditAttachEventHandler();
      });
    }

    active = null;
    activeFrame = null;
    activeRowSelector = null;
  }
}

function quickEditRemoveFrame() {
  if (activeFrame) {
    /**
     * remove frame
     */
    const $parent = $(activeFrame[0]).parents('tr');
    activeFrame[0].iFrameResizer.close();
    $parent.remove();
  }
}

function quickEditShowLoading() {
  $rexAjaxLoader.addClass('rex-visible');
}

function quickEditHideLoading() {
  $rexAjaxLoader.removeClass('rex-visible');
}
