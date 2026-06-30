---
title: "Класс Control"
sidebar:
  order: 18
---

# Класс Control

Класс `Control` в языке EME-L — это программный доступ к органу диалога, колонке браузера или ячейке отчёта. Через объект `Control` можно читать и записывать значения, управлять доступностью и видимостью, настраивать внешний вид, работать с битами (чекбоксами/радиокнопками), таблицами и RichEdit.

Объект создаётся функцией `Object("Control", ...)` и **привязан к контексту** — либо к текущему органу (колонке/ячейке), либо к органу по имени. Конструктор поддерживает пять перегрузок с разным числом аргументов.

> Создание `Object("Control", ...)` вне конструктора класса (например, в цикле) противоречит правилам управления памятью. В конструкторе класса такие объекты следует инициализировать сразу через `Const`.

## Создание объекта

```EME-L
ctrl = Object("Control");
ctrl = Object("Control", "WrhCode");
ctrl = Object("Control", "WrhTable", "WrhCode");
ctrl = Object("Control",, "Info",, TRUE);
```

| Конструктор | Контекст | Описание |
|-------------|----------|----------|
| `Control()` | текущий | Подключается к текущему органу (колонке браузера, ячейке отчёта, органу диалога) по контексту выполнения. |
| `Control(name)` | текущий | Подключается к органу по его имени. |
| `Control(objectName, memberName)` | объект класса | Подключается к органу по имени объекта EME-L класса и имени члена (метода). |
| `Control(objectName, memberName, context)` | объект класса | То же с явным указанием контекста вызова (целое число). |
| `Control(objectName, memberName, context, softMode)` | объект класса | То же с режимом обработки отсутствия органа: `softMode=TRUE` — игнорировать отсутствие (объект с пустой ссылкой), `FALSE` — генерировать исключение. |

Четырёхаргументная форма с `softMode=TRUE` удобна для безопасного кэширования членов класса, орган для которых может отсутствовать на диалоге в определённых конфигурациях:

```EME-L
m_InfoControl = Object("Control",, "Info",, TRUE);
```

## Чтение и запись значения

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Get()` | — | значение органа | Текущее значение (тип зависит от атрибута поля). |
| `Put(arg0)` | arg0: значение | Empty | Записывает значение. Для таблицы — в строку с фокусом. |
| `PutToCell(arg0, arg1)` | arg0: значение, arg1: Integer | Empty | Записывает значение в ячейку отчёта с вертикальным индексом `vIndex`. |
| `GetText()` | — | String | Текстовое представление значения (только `ctEDIT`). |
| `PutText(arg0)` | arg0: String | Empty | Записывает строку текста (только `ctEDIT`). |
| `Empty()` | — | Empty | Очищает текущее значение. |
| `IsEmpty()` | — | Boolean | TRUE — значение пусто. |
| `WasChanged()` | — | Boolean | TRUE — орган изменён пользователем в текущем цикле (обычно для `OnCheck`). |
| `IsModified()` | — | Boolean | TRUE — орган модифицирован пользователем. |
| `SetModified(arg0)` | arg0: Boolean | Empty | Устанавливает/снимает флаг модификации. |

## Браузер (ctBROWSE)

Методы для работы со строками колонки браузера.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFromLine(arg0)` | arg0: Integer (номер строки) | значение | Значение из указанной строки колонки браузера. |
| `PutToLine(arg0, arg1)` | arg0: значение, arg1: Integer (номер строки) | Empty | Запись в указанную строку колонки браузера. |

## Таблица (ctEDIT в таблице)

Методы для работы со строками таблицы диалога.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFromRow(arg0)` | arg0: Integer (номер строки) | значение | Значение из указанной строки таблицы. |
| `PutToRow(arg0, arg1)` | arg0: значение, arg1: Integer (номер строки) | Empty | Запись в указанную строку таблицы. |
| `GetTextFromRow(arg0)` | arg0: Integer (номер строки) | String | Текстовое значение из строки таблицы. |
| `PutTextToRow(arg0, arg1)` | arg0: String (текст), arg1: Integer (номер строки) | Empty | Запись текста в строку таблицы. |
| `IsEmptyRow(arg0)` | arg0: Integer (номер строки) | Boolean | TRUE — значение в строке пусто. |
| `EmptyRow(arg0)` | arg0: Integer (номер строки) | Empty | Очищает значение в строке таблицы. |
| `IsModified(arg0)` | arg0: Integer (номер строки) | Boolean | TRUE — ячейка в указанной строке модифицирована. |
| `SetModified(arg0, arg1)` | arg0: Boolean, arg1: Integer (номер строки) | Empty | Устанавливает/снимает флаг модификации ячейки. |

## Биты (чекбоксы и радиокнопки)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetBit([arg0])` | arg0: Integer (номер бита, необязательно) | Boolean | Состояние бита. |
| `PutBit(arg0[, arg1])` | arg0: Boolean, arg1: Integer (номер бита, необязательно) | Control | Устанавливает/сбрасывает бит. Возвращает ссылку на объект — поддерживает цепочечный вызов: `ctrl.PutBit(TRUE, 0).PutBit(TRUE, 1)`. |
| `SetDefaultBit(arg0)` | arg0: Integer (номер бита) | Empty | Бит по умолчанию для последующих вызовов `GetBit`/`PutBit` без явного номера. |

## Доступность и видимость

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Disable(arg0)` | arg0: Boolean | Empty | Только чтение (TRUE) или редактирование (FALSE). **Устаревшая** 1-аргументная форма. |
| `Disable(arg0[, arg1])` | arg0: Boolean, arg1: String (текст причины) или Integer (номер бита) | Empty | Только чтение с указанием причины блокировки. Для битовых групп `arg1` — номер бита. |
| `Disable(arg0, arg1, arg2)` | arg0: Boolean, arg1: Integer (номер бита), arg2: String (причина) | Empty | Только чтение для отдельного бита в группе. |
| `BitMaskDisable(arg0, arg1)` | arg0: Boolean, arg1: Integer (маска) | Empty | Доступность группы чекбоксов по битовой маске. **Устаревшая** форма. |
| `BitMaskDisable(arg0, arg1, arg2)` | arg0: Boolean, arg1: Integer (маска), arg2: String (причина) | Empty | То же с указанием причины. |
| `EnableIfDialogDisabled()` | — | Empty | Разблокирует орган в обход флага `DF_USER_READ_ONLY`, если весь диалог заблокирован. |
| `BitMaskEnableIfDialogDisabled(arg0)` | arg0: Integer (маска) | Empty | То же для группы чекбоксов по маске. |
| `Invisible(arg0)` | arg0: Boolean | Empty | Скрыть (TRUE) или показать (FALSE) орган, ячейку отчёта или кнопку. |
| `Invisible(arg0, arg1)` | arg0: Boolean, arg1: Integer (номер бита/значение) | Empty | Видимость отдельного бита в группе. |
| `IsReadOnly()` | — | Boolean | TRUE — текстовый редактор в режиме только чтения. |
| `IsVisible()` | — | Boolean | TRUE — колонка таблицы видима. |
| `SetRequireFill(arg0)` | arg0: Boolean (1 — сбросить флаг, 0 — установить) | Empty | Управление флагом обязательности заполнения. |
| `SetFocus()` | — | Empty | Устанавливает фокус ввода на орган. |
| `SetFocus(arg0)` | arg0: Integer (номер строки) | Empty | Фокус в ячейку таблицы. |

## Цвет, шрифт и оформление (в основном для ячеек отчёта)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetColorText(arg0)` | arg0: Integer (COLORREF) | Empty | Цвет текста. Используйте `is_RGB(r, g, b)`. |
| `SetColorBk(arg0)` | arg0: Integer (COLORREF) | Empty | Цвет фона. |
| `SetColorBord(arg0)` | arg0: Integer (COLORREF) | Empty | Цвет рамки ячейки отчёта. |
| `SetFontBold(arg0)` | arg0: Boolean | Empty | Полужирный шрифт. |
| `SetFontItalic(arg0)` | arg0: Boolean | Empty | Курсив. |
| `SetFontUnderline(arg0)` | arg0: Boolean | Empty | Подчёркивание. |
| `SetAlign(arg0)` | arg0: Integer (флаги `TCellAlign`) | Empty | Выравнивание текста в ячейке отчёта. |
| `SetBorder(arg0)` | arg0: Integer (флаги `TBorderMask`) | Empty | Вид рамки ячейки отчёта. |
| `CellGoAway(arg0)` | arg0: Boolean | Empty | Скрыть ячейку отчёта, сдвинув правые ячейки влево. |

## Колонки таблицы/браузера

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetColumnCaption()` | — | String | Текст заголовка колонки. |
| `SetColumnCaption(arg0)` | arg0: String | String | Устанавливает заголовок. Возвращает предыдущий текст. |
| `GetColumnNumber()` | — | Integer | Номер столбца таблицы; -1 для нетабличных органов. |
| `SetColumnColor(arg0, arg1)` | arg0: Integer (COLORREF), arg1: Integer (приоритет) | Empty | Цвет фона колонки с приоритетом. |
| `ResetColumnColor()` | — | Empty | Сброс цвета колонки. |
| `UniteColumns(arg0[, arg1])` | arg0: Control или String (имя), arg1: String (надпись) | Empty | Объединяет текущую колонку с указанной. Колонки должны быть на одном этаже. |
| `DeleteColumnsUnion()` | — | Empty | Разрушает объединение колонок, в которое входит текущая. |

## Подсказки, справка и надписи

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetCaption()` | — | String | Заголовок органа или текст кнопки. |
| `SetCaption(arg0)` | arg0: String | Empty | Текст надписи на кнопке. |
| `SetIcon(arg0, arg1)` | arg0: String (DLL), arg1: Integer (ID иконки) | Empty | Иконка на кнопке из DLL-ресурса. Пустая строка — удалить иконку. |
| `SetIcon(arg0, arg1, arg2)` | arg0: String (DLL), arg1: Integer (ID), arg2: String ("LEFT"/"RIGHT"/"CENTER") | Empty | То же с выравниванием. |
| `SetTooltipText(arg0)` | arg0: String | String | Текст всплывающей подсказки. Возвращает предыдущий текст. |
| `SetTooltipText(arg0, arg1)` | arg0: String, arg1: Integer (номер бита) | String | Подсказка для отдельного бита. |
| `GetTooltipText()` | — | String | Текущая подсказка. |
| `GetTooltipText(arg0)` | arg0: Integer (номер бита) | String | Подсказка для отдельного бита. |
| `ShowTooltipInControl(arg0)` | arg0: Boolean | Boolean | Подсказки внутри редактора. Возвращает предыдущее значение. |
| `SetHelp(arg0)` | arg0: String | Empty | Текст справки (также в подсказке и контекстной справке). |
| `SetHelp(arg0, arg1)` | arg0: String, arg1: Integer (номер бита) | Empty | Текст справки для отдельного бита. |

## Информация об органе

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetName()` | — | String | Программное имя (soft name). |
| `GetMemberName()` | — | String | Имя члена объекта EME-L класса, связанного с органом. |
| `GetAttribute()` | — | Integer | Код атрибута (тип данных) органа. |
| `GetRecordName()` | — | String | Наименование записи БД, к которой привязан орган. |
| `GetFieldName()` | — | String | Наименование поля БД, к которому привязан орган. |
| `GetColumn()` | — | Integer | Текущий столбец в RichEdit. -1, если недоступен. |
| `GetLine()` | — | Integer | Текущая строка в RichEdit. -1, если недоступен. |
| `GetCursorPos()` | — | Integer | Позиция курсора в `CEdit`. |
| `GetSearchString()` | — | String | Текст, введённый пользователем в ссылочный орган при поиске. |
| `GetAutocompleteText()` | — | String | Выбранный в списке автозаполнения текст. |

## Связанные объекты

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetDialog()` | — | Dialog | Объект диалога, к которому относится орган. |
| `GetTable()` | — | Table | Объект таблицы для табличного органа; NULL иначе. |
| `GetTable(arg0)` | arg0: Boolean (строгий режим) | Table | Объект таблицы; при `strictMode=TRUE` и нет диалогового органа — NULL. |
| `GetDBObject()` | — | dsDB | Объект записи БД (CEMERec) для ссылочного органа; NULL, если орган не ссылочный. |
| `GetRect()` | — | Rect | Прямоугольник органа в экранных координатах. |
| `GetRect(arg0)` | arg0: Integer (номер строки) | Rect | Прямоугольник ячейки таблицы в указанной строке. |
| `GetOriginalRect()` | — | Rect | Размеры/положение органа в единицах редактора диалогов. |
| `SetRect(arg0[, arg1])` | arg0: Rect, arg1: Boolean (экранные координаты, по умолч. FALSE) | Empty | Размеры/положение ячейки отчёта. |
| `SetOriginalRect(arg0)` | arg0: Rect | Boolean | Размеры/положение органа в единицах редактора диалогов. |

## База данных (для ссылочных и привязанных органов)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFromDBLine(arg0)` | arg0: Integer (номер строки БД) | значение | Значение из указанной строки поля БД, к которому привязан орган. |
| `FindDBValue(arg0)` | arg0: значение | Integer или Empty | Номер строки БД для заданного значения поля; Empty — не найдено. |
| `FindRefInList(arg0)` | arg0: Integer (ссылка) | Integer | Номер строки в LISTBOX, содержащей ссылку; -1, если не найдена. |

## Комбобокс и таблица без БД

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Add(arg0[, arg1])` | arg0: String (комбобокс) или значение (таблица), arg1: Integer (значение комбобокса) | для таблицы — Integer (номер строки), для комбобокса — Empty | Добавляет строку. Для комбобокса заполнять на `Dialog_OnLoad()` или позже — на `Dialog_OnInit()` он ещё не создан. |
| `Clear()` | — | Empty | Очищает комбобокс. |

## Текстовый редактор (CEdit / RichEdit)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetToken()` | — | String | Слово под курсором в `CEdit` или выделенный текст в `CRichEditCtrl`. |
| `PasteInText(arg0)` | arg0: String | Empty | Вставляет текст с текущей позиции курсора (с заменой выделения). |
| `ReplaceText(arg0, arg1, arg2)` | arg0: Integer (начало), arg1: Integer (конец), arg2: String | Empty | Заменяет текст в диапазоне позиций. |
| `Select()` | — | Empty | Выделяет весь текст в `CEdit`. |
| `SetCursorPos(arg0, arg1)` | arg0: Integer (столбец), arg1: Integer (строка) | Boolean | Позиция курсора в RichEdit. |
| `SetLength(arg0)` | arg0: Integer (макс. длина) | Empty | Ограничение длины вводимого текста. -1 эквивалентно 256. |
| `SetEnterKeyMessage([arg0])` | arg0: Boolean | Boolean | Флаг отправки `TSM_ENTER_KEY_DOWN` при нажатии Enter (только `CMEdit`). Доступно с версии ядра 24.4. |
| `SetRicheditType(arg0)` | arg0: Integer (0=ET_UNKNOWN, 1=ET_EMEL_METHODS, 2=ET_EMEL_CONSTRUCT, 3=ET_EMEL_SQL, 4=ET_KNOWLEDGE_BASE) | Boolean | Тип редактируемого текста для RichEdit. |
| `RequestAutocompleteData()` | — | Empty | Запрос списка автозаполнения. |
| `ScrollToText(arg0, arg1, arg2)` | arg0: Integer (ссылка строки), arg1: Integer (номер строки), arg2: String (текст) | Boolean | Прокрутка RichEdit на текст. |
| `ScrollToBottom()` | — | Boolean | Прокрутка RichEdit на последнюю строку (для журналов). |
| `Update()` | — | Empty | Перерисовка (только для дерева). |
| `ContextSearch()` | — | Boolean | Открывает окно поиска (аналог Ctrl+F). |

## Умный календарь

Методы для органа типа «Дата».

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `AddSmartDate(arg0, arg1)` | arg0: Date, arg1: String (подсказка) | Empty | Подсветка даты цветом ядра. |
| `AddSmartDate(arg0, arg1, arg2, arg3)` | arg0: Date, arg1: String (подсказка), arg2: Integer (фон), arg3: Integer (текст) | Empty | Подсветка с явными цветами. |
| `RemoveSmartDate(arg0)` | arg0: Date | Boolean | Удаляет умную дату. TRUE — удалено. |
| `RemoveAllSmartDates()` | — | Empty | Удаляет все умные даты. |
| `AllowNullDate([arg0])` | arg0: Boolean (по умолч. TRUE) | Boolean | Разрешение ввода нулевой даты. Возвращает предыдущее значение. |
| `SetRoundedMode(arg0)` | arg0: Boolean | Empty | Округление при чтении/записи значения. |

## Информационные строки таблицы

Нескроллируемая (информационная) часть таблицы.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFromInfoRow(arg0)` | arg0: Integer (номер строки с 0) | String | Текст из ячейки информационной строки. |
| `PutToInfoRow(arg0, arg1)` | arg0: Integer (номер строки с 0), arg1: String | String | Запись текста в ячейку информационной строки. Возвращает предыдущее значение. |

## События

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `FireEvent(arg0[, arg1[, arg2[, arg3[, ...]]]])` | arg0: String (имя события, например `"OnInput"`), arg1: Integer (0/Empty — вернуть Empty если метода нет, 1 — исключение), arg2/arg3: Empty (зарезервированы), argN: дополнительные параметры | результат вызванного метода или Empty | Эмулирует событие в органе, вызывая соответствующий обработчик EME-L класса. |

## Примеры

Чтение значения из колонки браузера по номеру строки и запись обратно:

```EME-L
'Прочитать значение из строки 5 колонки браузера'
value = ctrlWrhCode.GetFromLine(5);
'Записать новое значение в ту же строку'
ctrlWrhCode.PutToLine("NW001", 5);
```

Инициализация членов класса безопасной 4-аргументной формой `Control(objectName, memberName, context, softMode)` — если орган `Info` отсутствует на диалоге, исключение не генерируется:

```EME-L
m_InfoControl = Object("Control",, "Info",, TRUE);
m_StateControl = Object("Control",, "State",, TRUE);
```

Связывание органа диалога с колонкой таблицы `WarehousesSettings` (форма `Control(objectName, memberName)`):

```EME-L
ctrlWrhCode = Object("Control",, "WrhCode");
ctrlWrhName = Object("Control",, "WrhName");
ctrlSettingValue = Object("Control",, "SettingValue");
```

Цепочечный вызов `PutBit` для группы чекбоксов — возвращает ссылку на тот же объект:

```EME-L
ctrlBits.PutBit(TRUE, 0).PutBit(TRUE, 1).PutBit(TRUE, 3);
```

Блокировка органа с указанием причины (отображается как подсказка):

```EME-L
ctrlSettingValue.Disable(TRUE, "Настройка недоступна в режиме просмотра");
```

Вызов обработчика `OnInput` с эмуляцией события:

```EME-L
result = ctrl.FireEvent("OnInput", 0);
'result = возвращённое значение метода OnInput или Empty'
```

## См. также

- [Класс Table](/language/classes/table/) — работа с табличной частью диалога.
- [Класс Dialog](/language/classes/dialog/) — объект диалога в целом.
- [Класс Rect](/language/classes/rect/) — координаты и размеры органов.
- [События диалога](/language/basics/events/) — `Dialog_OnInit`, `OnCheck`, `OnLoad` и др.
