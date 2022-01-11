<?php
$addon = \rex_addon::get('yform_quick_edit');

if (\rex::isBackend() && \rex::getUser()) {
    if (rex_get('quick_edit') === 'true') {
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.contentWindow.min.js'));
        \rex_view::addCssFile($addon->getAssetsUrl('css/style.css'));
    }
    else {
        \rex_view::addJsFile($addon->getAssetsUrl('js/vendor/iframeResizer.min.js'));
    }

    \rex_view::addJsFile($addon->getAssetsUrl('js/scripts.js'));

    \rex_extension::register("YFORM_DATA_LIST", function ($ep) {
        /** @var rex_list $list */
        $list = $ep->getSubject();
        $listParams = $list->getParams();

        $link = '<div style="text-align: center;"><a class="yform-quick-edit" data-id="###id###" href="index.php?page=yform/manager/data_edit&table_name=' . $listParams['table_name'] . '&rex_yform_manager_popup=1&data_id=###id###&func=edit&list=' . $list->getName() . '&quick_edit=true"><svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></a></div>';
        $list->addColumn('Quick Edit', $link, 1);
        $list->setRowAttributes(['class' => 'quick-edit-row-###id###']);
    });

}
