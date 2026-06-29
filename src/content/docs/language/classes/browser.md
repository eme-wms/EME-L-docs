---
title: "Класс Browser"
sidebar:
  order: 10
---

# Класс Browser

Класс `Browser` в языке EME-L инкапсулирует интерактивный просмотр табличных данных базы данных — диалоговый элемент «браузер» (grid). Предоставляет навигацию по строкам записи, одиночный и множественный выбор строк, фильтрацию и сортировку, управление колонками (ширина, заголовок, видимость, цвет), загрузку/выгрузку строк по условию, установку цепочек и индексов, а также экспорт в Excel и запуск модальных диалогов из контекста браузера.

Объект создаётся с привязкой к шаблону браузера по имени либо к текущему контексту выполнения (например, внутри обработчика `Browser_OnInit`). Класс поддерживает два типа браузеров: обычный (`CBrowse`) и древовидный (`CTreeBrowse`); ряд методов работает только с обычным и явно отвергает древовидный.

## Создание объекта

```EME-L
'Текущий браузер контекста (типичная форма в Browser_OnInit)'
brw = Object("Browser");

'По имени шаблона браузера'
brw = Object("Browser", "GoodsItems");

'По объекту класса и имени мембера (для браузера-члена EME-L класса)'
brw = Object("Browser", "LoadersClassifier", "SectorSelectionBrowser");
```

| Конструктор | Аргументы | Описание |
|-------------|-----------|----------|
| `Browser()` | — | Текущий активный браузер контекста выполнения. Используется в обработчиках сообщений браузера (`Browser_OnInit` и т. п.). |
| `Browser(name)` | name: String | Браузер по имени шаблона (запись справочника «Шаблоны BROWSE»). |
| `Browser(objectName, memberName)` | objectName: String, memberName: String | Браузер-член EME-L класса по имени объекта и имени мембера. |
| `Browser(objectName, memberName, context)` | + context: Integer | То же с явным контекстом вызова. |
| `Browser([name[, memberName[, context[, softMode]]]])` | см. таблицу | Гибкая форма. `softMode`: Boolean — при TRUE отсутствие шаблона не вызывает исключение (объект остаётся пустым). По умолчанию FALSE. |

При создании без аргументов вне контекста браузера/колонки выбрасывается исключение — используйте такую форму только внутри сообщений жизненного цикла браузера (`Browser_OnInit`, `OnTune` и т. п.).

## Жизненный цикл и запуск

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Run()` | — | Integer | Открывает браузер с одиночным выделением. Возвращает номер строки БД, на которой завершён просмотр. |
| `Run(multipleSelection)` | multipleSelection: Boolean | Integer | То же; TRUE — множественное выделение, FALSE (по умолчанию) — одиночное. |
| `RunWithFilter(bitBuffer)` | bitBuffer: BitBuffer (по ссылке) | Empty | Открывает браузер с множественным выделением, предварительно загрузив выделение из битового массива; после закрытия сохраняет выделение обратно. |
| `Close()` | — | Empty | Закрывает окно браузера. |
| `Delete()` | — | Empty | Принудительно удаляет объект-браузер, если его окно уже закрыто. Решает проблему циклических ссылок между браузером и породившим его EME-L классом. |
| `GetDialog()` | — | Dialog | Создаёт и возвращает объект диалога, связанного с текущим контекстом браузера. |
| `GetContext()` | — | Reference | Внутренний контекст параметров браузера (указатель). |

## Навигация по строкам

Методы позиционируют текущую строку браузера. Формы с необязательным `changeFocus` (Boolean, по умолчанию FALSE) только возвращают номер строки; при TRUE — также перемещают фокус.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetFirstLine()` / `SetFirstLine(changeFocus)` | changeFocus: Boolean (опц.) | Integer | Первая строка. |
| `SetLastLine()` / `SetLastLine(changeFocus)` | changeFocus: Boolean (опц.) | Integer | Последняя строка. |
| `SetNextLine()` / `SetNextLine(changeFocus)` | changeFocus: Boolean (опц.) | Integer | Следующая строка. |
| `SetPreviousLine()` / `SetPreviousLine(changeFocus)` | changeFocus: Boolean (опц.) | Integer | Предыдущая строка. |
| `GetCurrentLine()` | — | Integer | Номер текущей строки. |
| `SetCurrentLine(line)` | line: Integer | Integer | Устанавливает текущую строку; возвращает её номер. |
| `IsValidLine()` | — | Boolean | TRUE — текущая строка реальна (не NULL_REF). |
| `SetLine(line)` | line: Integer | Empty | Устанавливает стартовую строку БД для браузера. |
| `GetFocusLine()` | — | Integer | Фокусная строка БД. |
| `SetFocusLine(line)` | line: Integer | Empty | Устанавливает фокусную строку БД. |

## Выделение строк (mark)

Одиночные проверки и групповые операции над пометками.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Select(line, flag)` | line: Integer, flag: Integer | Empty | Ненулевой `flag` — пометить, 0 — снять пометку. |
| `IsSelected(line)` | line: Integer | Integer | 1 — строка помечена, 0 — нет. |
| `GetSelected(startLine)` | startLine: Integer | Integer | Номер первой помеченной строки начиная с `startLine`; NULL_REF, если таковой нет. |
| `IsAllMarked()` / `IsAllSelected()` | — | Integer | 1 — все помечены или ни одна, 0 — частичное выделение. Синонимы. |
| `UnMarkAll()` / `UnSelectAll()` | — | Empty | Снять все пометки. Синонимы. |
| `GetMarkedCount()` / `GetSelectedCount()` | — | Integer | Количество помеченных строк. Синонимы. |
| `LoadSelection(bitBuffer)` | bitBuffer: BitBuffer (по ссылке) | Empty | Загружает выделение из битового массива. |
| `SaveSelection(bitBuffer)` | bitBuffer: BitBuffer (по ссылке) | Empty | Сохраняет текущее выделение в битовый массив. |

### Обход помеченных строк

Перед обходом выбирается режим упорядочения, затем — цикл от `SetFirstSelectedLine()` до `NULL_REF` через `SetNextSelectedLine()`.

| Метод | Возвращает | Описание |
|-------|------------|----------|
| `SetRealSelectionMode()` | Empty | Обход по физическому порядку строк БД. |
| `SetSortSelectionMode()` / `SetSortSelectionMode(field)` | Empty | Обход по полю сортировки браузера (из настроек или явно: имя/номер поля). |
| `SetUserSelectionMode()` | Empty | Обход в порядке, который видит пользователь (с учётом наложенной пользователем сортировки). |
| `SetFirstSelectedLine()` | Integer | Первая помеченная строка в текущем режиме; NULL_REF, если помеченных нет. |
| `SetLastSelectedLine()` | Integer | Последняя помеченная строка. |
| `SetNextSelectedLine()` | Integer | Следующая помеченная строка; NULL_REF — конец. |
| `SetPreviousSelectedLine()` | Integer | Предыдущая помеченная строка; NULL_REF — начало. |
| `GetSelectedLine()` | Integer | Текущая помеченная строка режима обхода. |
| `IsValidSelectedLine()` | Boolean | TRUE — текущая помеченная строка реальна. |

## Запись и строки БД

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetDBObject()` | — | CEMERec | Объект записи, связанной с браузером, установленный на текущую строку. |
| `GetRecord()` | — | Integer | Номер записи БД браузера. |
| `SetRecord(record)` | record: Integer | Empty | Устанавливает браузер на указанную запись. |
| `GetName()` | — | String | Программное имя браузера. |
| `GetEMELClassName()` | — | String | Имя EME-L класса, связанного с браузером через прокси-функцию; пустая строка, если не задан. Только для недревовидных браузеров. |
| `GetMemberName()` | — | String | Имя члена объекта, извлечённое из программного имени браузера. |

## Загрузка/выгрузка строк

Управляет составом строк, отображаемых браузером (механика skip-режима записи).

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `LoadAllLines()` / `UnloadAllLines()` | — | Empty | Загрузить/выгрузить все строки. |
| `LoadLine(line)` / `UnloadLine(line)` | line: Integer | Empty | Загрузить/выгрузить одну строку по номеру БД. |
| `LoadLines(object)` / `UnloadLines(object)` | object: BitBuffer / Array / CEMERec (по ссылке) | Empty | Загрузить/выгрузить строки, помеченные в объекте-источнике. |
| `GetFilterStartLine()` | — | Integer | Стартовая строка предварительного фильтра. |
| `GetFilterLineCount()` | — | Integer | Количество строк предварительного фильтра. |

## Колонки

> Методы колонок не поддерживаются древовидными браузерами.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetNoOfColumns()` | — | Integer | Количество колонок. |
| `GetColumn(index)` | index: Integer | Browser.Column | Объект колонки по индексу (0…N-1). См. [класс Column](#класс-column). |
| `GetColumnNumber(columnName)` | columnName: String | Integer | Порядковый номер колонки по программному имени. |
| `GetCurrentColumn()` | — | Integer | Номер текущей (выделенной) колонки. |
| `GetCurrentColumnName()` | — | String | Программное имя текущей колонки. |
| `GetColumnWidth(column)` | column: Integer/String | Integer | Ширина в пикселях; -1, если колонка не найдена. |
| `SetColumnWidth(column, width)` | column: Integer/String, width: Integer | Integer | Устанавливает ширину; возвращает предыдущую (-1, если не найдена). |
| `SetColumnCaption(column, caption)` | column: Integer/String, caption: String | Empty | Заголовок колонки. |
| `ShowColumn(column, visible)` | column: Integer/String, visible: Boolean | Empty | Показать/скрыть колонку. |
| `RemoveColumn(column)` | column: Integer/String | Empty | Удалить колонку. |
| `GetCellRect(column, row)` | column: Integer/String, row: Integer | Rect | Прямоугольник ячейки в экранных координатах. |

Параметр `column` у методов колонок принимает **либо** порядковый номер, **либо** программное имя (строка).

## Цвет строк и ячеек

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `ResetColorLines()` | — | Empty | Создаёт внутренние структуры цвета строк и сбрасывает расцветки. Должен вызываться до `SetLineColor`/`SetLineSystemColor`. |
| `SetLineColor(line, textColor[, backColor])` | line: Integer, textColor: Integer, backColor: Integer (опц.) | Empty | Цвет текста (и фона) строки. Код цвета 0…15 (см. палитру). При двух аргументах — один цвет для текста и фона. |
| `SetLineSystemColor(line)` | line: Integer | Empty | Системные цвета строки (сброс к стандарту). |
| `SetPaletteColor(colorNum, rgbValue)` | colorNum: Integer (0…15), rgbValue: Integer (RGB) | Empty | Задаёт RGB значения для номера цвета палитры, используемого `SetLineColor`. |
| `SetCellColor(color)` | color: Integer (COLORREF) | Empty | Цвет фона ячеек. |
| `SetTextColor(color)` | color: Integer (COLORREF) | Empty | Цвет текста ячеек. |

Палитра кодов цвета для `SetLineColor`/`SetLineSystemColor`: 0 — системный, 1 — красный, 2 — зелёный, 3 — синий, 4 — жёлтый, 5 — тёмно-серый, 6 — розовый, 7 — пурпурно-фиолетовый, 8 — коричневый, 9 — светло-синий, 10 — серый, 11 — светло-зелёный, 12 — светло-коричневый, 13 — фиолетовый, 14 — светло-жёлтый, 15 — белый.

## Цепочки и индексы

> Только для недревовидных браузеров. `SetChain` допустим только в обработчике `OnTune`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetChain(field, ref)` | field: String, ref: Integer | Empty | Устанавливает цепочку по полю и строке-заголовку. Только в OnTune. |
| `SetChainArray(field, refArray)` | field: String, refArray: Array (по ссылке) | Empty | Несколько цепочек по массиву ссылок с общим полем. |
| `SetIndex(fieldName)` | fieldName: String | Empty | Поле индекса для поиска. Для индекса по ускорителю — имя ускоряемого поля. |
| `SetIndexKey([keyPart…])` | keyPart: любые | Empty | Ключ поиска по индексу (составной — несколько аргументов). |
| `SetIndexLowerKey([keyPart…])` | keyPart: любые | Empty | Нижняя граница диапазона поиска по индексу. |
| `SetIndexUpperKey([keyPart…])` | keyPart: любые | Empty | Верхняя граница диапазона поиска по индексу. |

Методы `SetIndex*` появились в ядре версии 24.6.

## Прочее

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetCaption(caption)` | caption: String | Empty | Текст заголовка окна браузера. |
| `SetPeriodCaptionField(fieldName)` | fieldName: String | Empty | Поле, по которому формируется заголовок кнопки переключения периодов. |
| `Redraw()` | — | Empty | Перерисовка содержимого (обновление текста элементов). |
| `Update()` | — | Empty | Пересчёт строкового буфера отображения. |
| `DeleteUserFilter()` | — | Empty | Снимает все пользовательские фильтры. Недревовидные браузеры. |
| `ConvertToExcel()` / `ConvertToExcel(fileName)` | fileName: String (опц.) | Empty | Экспорт в Excel (без аргумента — через диалог выбора файла). |
| `RunModalDialog(dialogName, startLine)` | dialogName: String, startLine: Integer | Empty | Запускает модальный диалог из контекста браузера с возможностью возврата. |
| `FillLineNumToDBLineArray(array)` | array: Array (по ссылке) | Integer | Заполняет массив соответствием номеров строк браузера → строки БД. Возвращает количество элементов. |
| `SetExtendedMenuFlag([flag])` | flag: Boolean (опц., по умолч. TRUE) | Empty | Признак наличия расширенного меню браузера. |
| `SetFindTextWithoutLaunch(editControl)` | editControl: Control (по ссылке) | Empty | Передаёт в браузер искомый текст из органа ввода для поиска без запуска. |
| `SetFillBrowseWithoutLaunch([flag])` | flag: Boolean (опц., по умолч. TRUE) | Empty | Формирование буфера браузера без визуального запуска. |
| `SetFilterPeriod([field[, mode[, dateFrom[, dateTo]]]])` | field: Integer, mode: Integer, dateFrom: Date, dateTo: Date | Empty | Фильтрация по полю типа Дата и коду периода. Без аргументов отключает фильтр. Ядро ≥ 32.1. |

`mode` для `SetFilterPeriod`: 0 — Сегодня, 1 — Завтра, 2 — Текущая неделя, 3 — Текущий месяц, 4 — Текущий квартал, 5 — Произвольный период (требует `dateFrom`/`dateTo`), 6 — Последняя неделя, 7 — Последний месяц, 8 — Последний квартал.

> **Расхождение реестра и реализации:** ядро (`i_Browser.cpp:2087,2093`) фактически обрабатывает произвольный период для `mode = 4` (а не 5) и отвергает `mode = 8` проверкой `nMode > 7`. Значения выше — по контракту реестра; для надёжной работы произвольного периода используйте `mode = 4` с `dateFrom`/`dateTo`.

## Класс Column

Объект вложенного класса `Browser.Column` возвращается методом `GetColumn(index)`. Предоставляет метаинформацию о колонке.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetName()` | — | String | Программное имя колонки. |
| `GetCaption()` | — | String | Заголовок (отображаемое название) колонки. |
| `GetMemberName()` | — | String | Имя члена объекта, извлечённое из программного имени колонки. |
| `GetFields(array)` | array: Array (по ссылке) | Empty | Заполняет массив номерами полей привязки колонки. |
| `GetEMELClassName()` | — | String | Имя EME-L класса, связанного с колонкой через прокси-функцию; пустая строка, если не задан. |

## Примеры

Создание браузера по имени шаблона и запуск с множественным выбором:

```EME-L
'Запустить браузер выбора секторов с множественным выделением'
brw = Object("Browser", "LoadersClassifier", "SectorSelectionBrowser");
brw.Run(TRUE);
```

Создание объекта текущего браузера в `Browser_OnInit` и загрузка строк по условию:

```EME-L
'Привязать объект к текущему браузеру контекста'
AllowedBrowser = Object("Browser");

'В OnSkipEx выгрузить все строки, затем загрузить только разрешённые'
AllowedBrowser.UnloadAllLines();
AllowedBrowser.LoadLines(Buffer);
```

Обход помеченных строк в порядке сортировки пользователя:

```EME-L
brw.SetUserSelectionMode();
For (line = brw.SetFirstSelectedLine(); line != NULL_REF; line = brw.SetNextSelectedLine())
    r_GoodsItem.SetLine(line);
    'обработать выбранную строку записи в системе EME.WMS'
    arr.Add(line);
End For
```

Раскраска строк (зелёный текст, красный фон для тревожных строк):

```EME-L
brw.ResetColorLines();
brw.SetLineColor(Index, 2, 1);
```

Получение объекта записи текущей строки:

```EME-L
r_Item = brw.GetDBObject();
If (r_Item.IsValidLine())
    Code = r_Item.GetCodeNumber();
End If
```

## См. также

- [Функции браузера](/language/basics/system-functions/browser/) — `is_*` функции группы Browser.
- [Класс BitBuffer](/language/classes/archive/) — объект битового массива для `LoadSelection`/`SaveSelection`.
- [События браузера](/language/basics/events/) — `Browser_OnInit`, `OnTune`, `OnSkipEx`.
