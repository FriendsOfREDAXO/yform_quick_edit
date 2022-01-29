<?php
$addon = \rex_addon::get('yform_quick_edit');

if (\rex::isBackend() && \rex::getUser() && ('index.php?page=yform/manager/data_edit' == rex_url::currentBackendPage())) {
    \rex_view::setJsProperty('yform_quick_edit_cancel', $addon->i18n('yform_quick_edit_cancel'));
    \rex_view::addCssFile($addon->getAssetsUrl('css/styles.css'));
    \rex_view::addJsFile($addon->getAssetsUrl('js/scripts.js'));

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
            'yqe' => 'true',
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

    if (\rex_get('yqe') === 'true') {
        \rex_extension::register('YFORM_MANAGER_DATA_PAGE', function (\rex_extension_point $ep) {
            /** @var rex_yform_manager $manager */
            $manager = $ep->getSubject();

            /**
             * remove search
             */
            if (($key = array_search('search', $manager->dataPageFunctions)) !== false) {
                unset($manager->dataPageFunctions[$key]);
            }
        });
    }
}
