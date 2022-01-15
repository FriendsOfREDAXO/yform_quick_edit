<?php
$addon = \rex_addon::get('yform_quick_edit');

if (\rex::isBackend() && \rex::getUser()) {
    \rex_view::setJsProperty('yform_quick_edit_close', 0x100);
    \rex_view::setJsProperty('yform_quick_edit_reload', 0x101);
    \rex_view::setJsProperty('yform_quick_edit_show_loading', 0x102);
    \rex_view::setJsProperty('yform_quick_edit_hide_loading', 0x103);
    \rex_view::setJsProperty('yform_quick_edit_resize', 0x104);

    if (rex_get('quick_edit') === 'true') {
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.contentWindow.min.js'));
        \rex_view::addJsFile($addon->getAssetsUrl('js/scripts-frame.js'));
        \rex_view::addCssFile($addon->getAssetsUrl('css/style.css'));
        \rex_view::setJsProperty('yform_quick_edit_cancel', $addon->i18n('yform_quick_edit_cancel'));
    }
    else {
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.min.js'));
        \rex_view::addJsFile($addon->getAssetsUrl('js/scripts.js'));
    }

    \rex_extension::register('YFORM_DATA_LIST', function ($ep) {
        /** @var rex_list $list */
        $list = $ep->getSubject();
        $listParams = $list->getParams();

        $link = '<a class="yform-quick-edit rex-link-expanded" title="QuickEdit" data-id="###id###" href="index.php?page=yform/manager/data_edit&table_name=' . $listParams['table_name'] . '&rex_yform_manager_popup=1&data_id=###id###&func=edit&list=' . $list->getName() . '&quick_edit=true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stopwatch" viewBox="0 0 16 16"><path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/><path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"/></svg> QuickEdit</a>';
        $list->addColumn('', $link, 1);
        $list->setRowAttributes(['class' => 'quick-edit-row-###id###']);
    });

}
