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

        $link = '<a class="yform-quick-edit rex-link-expanded" style="white-space: nowrap; font-size: 12px; text-decoration: none;" title="QuickEdit" data-id="###id###" href="index.php?page=yform/manager/data_edit&table_name=' . $listParams['table_name'] . '&rex_yform_manager_popup=1&data_id=###id###&func=edit&list=' . $list->getName() . '&quick_edit=true"><i class="fa fa-pencil"></i> QuickEdit</a>';
        $list->addColumn('', $link, 1);
        $list->setRowAttributes(['class' => 'quick-edit-row-###id###']);
    });

}
