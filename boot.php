<?php
$addon = \rex_addon::get('yform_quick_edit');

if (\rex::isBackend() && \rex::getUser()) {
    \rex_view::setJsProperty('yform_quick_edit_close', 0x100);
    \rex_view::setJsProperty('yform_quick_edit_reload', 0x101);
    \rex_view::setJsProperty('yform_quick_edit_show_loading', 0x102);
    \rex_view::setJsProperty('yform_quick_edit_hide_loading', 0x103);
    \rex_view::setJsProperty('yform_quick_edit_resize', 0x104);
    \rex_view::setJsProperty('yform_quick_edit_error', 0x105);

    if (rex_get('quick_edit') === 'true') {
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.contentWindow.min.js'));
        \rex_view::addJsFile($addon->getAssetsUrl('js/scripts-frame.js'));
        \rex_view::addCssFile($addon->getAssetsUrl('css/styles-frame.css'));
        \rex_view::setJsProperty('yform_quick_edit_cancel', $addon->i18n('yform_quick_edit_cancel'));
    }
    else {
        \rex_view::addCssFile($addon->getAssetsUrl('css/styles.css'));
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.min.js'));
        \rex_view::addJsFile($addon->getAssetsUrl('js/scripts.js'));
    }

    \rex_extension::register('YFORM_DATA_LIST', function (\rex_extension_point $ep) {
        /** @var rex_list $list */
        $list = $ep->getSubject();
        $listParams = $list->getParams();
        $listParams['rex_yform_manager_popup'] = 1;

        $params = [
            'func' => 'edit',
            'list' => $list->getName(),
            'quick_edit' => 'true',
            'rex_yform_manager_opener' => 1,
            'search' => false,
        ];

        /**
         * add csrf token -> yform >= 4
         */
        if(method_exists($ep->getParam('table'), 'getCSRFKey')) {
            $params['_csrf_token'] = \rex_csrf_token::factory($ep->getParam('table')->getCSRFKey())->getValue();
        }

        $urlParams = array_merge($listParams, $params);

        $link = '<a class="yform-quick-edit rex-link-expanded" style="white-space: nowrap; font-size: 12px; text-decoration: none;" title="QuickEdit" data-id="###id###" href="'.'index.php?' . http_build_query($urlParams).'&data_id=###id###"><i class="fa fa-pencil"></i> QuickEdit</a>';
        $list->addColumn('', $link, 1);
        $list->setRowAttributes(['class' => 'quick-edit-row-###id###']);
    });

}
