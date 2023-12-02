# REDAXO-Addon: YForm QuickEdit

Mit QuickEdit lassen sich YForm-Datensätze ein wenig schneller, direkt aus der Datentabelle bearbeiten. Innerhalb der Datentabelle wird der eigentliche Datensatz in einer kompakteren Ansicht angezeigt und kann editiert werden ohne die Seite zu wechseln.

Das kann nützlich sein wenn z.B. in mehreren Datensätzen nur schnell ein Wert geändert werden soll.

Einzelne Felder können mit der Klasse `.yqe-ignore` ausgeblendet werden.

Über den EP `YQE_IGNORE_TABLES` lässt sich QuickEdit auf den angegebenen Tabellennamen entfernen. Hierfür einfach ein Array mit Tabellennamen als String übergeben.

```php
rex_extension::register('YQE_IGNORE_TABLES', function (rex_extension_point $ep) {
    $ep->setSubject(['rex_event','rex_event_categories']);
});
```

Über den EP `YQE_IS_ALLOWED` lässt sich QuickEdit auf bestimmten Seiten aktivieren. Erwartet wird `true` oder `false`. `true` bedeutet, dass QuickEdit geladen wird. Normalerweise wird QuickEdit nur auf der Seite `index.php?page=yform/manager/data_edit` geladen.

```php
rex_extension::register('YQE_IS_ALLOWED', function (rex_extension_point $ep) {
    $ep->setSubject('index.php?page=yform/manager/data_edit' === rex_url::currentBackendPage());
});
```

![yqe](https://user-images.githubusercontent.com/2708231/151661458-65e1b0e4-ef53-48f1-bc46-3c55712f7494.png)
