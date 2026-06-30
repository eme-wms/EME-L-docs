---
title: "Класс Dialog"
sidebar:
  order: 31
---

# Класс Dialog

Класс `Dialog` в языке EME-L — класс для работы с диалоговыми окнами системы EME. Предоставляет программный доступ к созданию, открытию, управлению и закрытию диалоговых окон, привязанных к записям базы данных или работающих в независим режиме.

Объект класса `Dialog` создаётся через `Object()` и привязывается к текущему контексту выполнения, к шаблону по имени или к объекту/члену класса. В скриптах-обработчиках диалога (методы `Dialog_OnInit`, `Dialog_OnAfterUpdate` и т. п.) объект обычно уже доступен как неявная переменная `Dialog` — повторная конструкция `Object("Dialog")` в таких случаях используется для получения ссылки в полях класса.

## Возможности

- Открытие диалога на текущей, заданной или новой строке записи (`Show`, `ShowLine`, `ShowNewLine`).
- Управление доступностью элементов ввода и кнопок (`Disable`), закладок (`DisableTabItem`, `InvisibleTabItem`).
- Получение и изменение заголовка, флагов, состояния модификации диалога.
- Доступ к органам управления (`Control`), таблицам (`Table`), главному браузеру (`Browser`) и параметрам диалога.
- Запуск отчётов на экран, на принтер и отправка по электронной почте (`RunReport`, `RunReportIndirect`, `SendReportByEmail`).
- Установка серверных семафоров для защиты диалога от одновременного редактирования (`SetSemaphore`, `CheckSemaphore`, `DeleteSemaphore`).
- Вывод всплывающих сообщений (`ShowPopupMessage`), управление таймерами органов (`SetControlTimer`).
- Работа с переменными диалога, прерывание выполнения главных функций и позиционирование окна.

## Создание объекта

```EME-L
'Подключение к текущему контексту выполнения'
dlg = Object("Dialog");

'По имени шаблона диалога'
dlg = Object("Dialog", "GoodsReceipt");

'По имени объекта класса и имени члена класса'
dlg = Object("Dialog", "AccountEquipment.AskPrinter");
```

В обработчиках диалога объект доступен неявно как `Dialog` без вызова `Object()`.

## Конструкторы

| Конструктор | Аргументы | Описание |
|-------------|-----------|----------|
| `Dialog()` | — | Создаёт объект диалога, подключённый к текущему контексту выполнения. |
| `Dialog(name)` | name: String | Создаёт объект диалога по имени шаблона диалога. |
| `Dialog(object_name, member_name)` | object_name: String, member_name: String | Создаёт объект диалога по имени объекта класса и имени члена класса. |
| `Dialog(object_name, member_name, context)` | + context: Integer | То же с явным контекстом вызова. |
| `Dialog(object_name, member_name, context, soft_mode)` | + soft_mode: Boolean | То же; soft_mode=TRUE — игнорировать отсутствие диалога и вернуть пустой объект, FALSE (по умолчанию) — генерировать исключение. |

## Открытие и закрытие

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Show(mode)` | mode: Integer (0 — модальный, 1 — новый немодальный) | Integer / Empty | Открывает диалог на текущей строке. При модальном режиме — результат выполнения, при немодальном — пустое значение. |
| `Show(mode, run_code)` | + run_code: Integer | Integer / Empty | То же с кодом запуска модуля. |
| `Show(mode, run_code, params)` | + params: String | Integer / Empty | То же с дополнительными параметрами запуска. |
| `ShowLine(mode, line)` | + line: Integer (номер строки записи) | Integer / Empty | Открывает диалог на указанной строке записи. |
| `ShowLine(mode, line, run_code)` | + run_code: Integer | Integer / Empty | То же с кодом запуска модуля. |
| `ShowLine(mode, line, run_code, params)` | + params: String | Integer / Empty | То же с параметрами запуска. |
| `ShowNewLine(mode)` | mode: Integer | Integer / Empty | Открывает диалог и создаёт новую строку записи. |
| `ShowNewLine(mode, run_code)` | + run_code: Integer | Integer / Empty | То же с кодом запуска. |
| `ShowNewLine(mode, run_code, params)` | + params: String | Integer / Empty | То же с параметрами запуска. |
| `Close()` | — | Empty | Закрывает диалоговое окно. |
| `Activate()` | — | Integer | Находит открытое окно по имени, обновляет данные и активизирует его. |
| `Activate(line)` | line: Integer | Integer | То же с указанием строки записи. |
| `Hide(hide)` | hide: Boolean | Empty | TRUE — скрыть окно, FALSE — показать. |

Модальный диалог блокирует родительский интерфейс до закрытия; немодальный открывается как самостоятельное окно. `Show` и `ShowLine` можно комбинировать с `SetWndFlags` для управления внешним видом окна — флаги окна нужно выставлять **до** вызова `Show`/`ShowLine`.

## Строки и навигация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetLine(line)` | line: Integer | Empty | Переключает диалог на указанную строку записи. Если в диалоге есть дерево, выделяет соответствующую ветвь. При передаче `NULL_REF` переключение не выполняется. |
| `GetLine()` | — | Integer | Номер текущей строки записи, на которой открыт диалог. |
| `GetTemplateLine()` | — | Integer | Номер строки шаблона диалога в записи DialogTemplates. |
| `GetRecord()` | — | Integer | Номер записи базы данных, к которой привязан диалог. |
| `CreateLine()` | — | Empty | Создаёт новую строку записи в диалоге. Эквивалентно нажатию F6. |
| `DeleteLine()` | — | Empty | Удаляет текущую строку записи. Эквивалентно нажатию F8. |
| `IsNewLine()` | — | Boolean | TRUE, если диалог открыт на новой строке и это первое сохранение данных на диск. |

## Органы управления, таблицы, браузер

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetControl(name)` | name: String | Control | Объект органа управления по программному имени. |
| `GetControl(object_name, control_name)` | object_name: String, control_name: String | Control | Объект органа по имени объекта и имени органа. |
| `GetControl(object_name, control_name, soft_mode)` | + soft_mode: Boolean | Control / Empty | То же; soft_mode=TRUE — вернуть пустой объект, если орган не найден; FALSE — генерировать исключение. |
| `GetFirstControl()` | — | Control | Первый доступный орган управления в порядке табуляции. |
| `GetTable(object_name, table_name)` | object_name: String, table_name: String | Table | Объект таблицы по имени объекта и имени таблицы. |
| `GetFocusedTable()` | — | Table / Empty | Таблица диалога, имеющая фокус ввода, либо пустое значение. |
| `GetMainBrowser()` | — | Browser / Empty | Объект главного браузера диалога либо пустой объект, если браузер отсутствует. |
| `GetDBObject()` | — | CEMERec (dsDB) | Объект записи базы данных, к которой привязан диалог. |

## Состояние и флаги

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `IsModified()` | — | Boolean | TRUE — пользователь внёс изменения в данные диалога. |
| `SetModified(modified)` | modified: Boolean | Empty | Устанавливает или сбрасывает флаг модификации. |
| `GetFlags()` | — | Integer | Текущее значение поля флагов поведения диалога. |
| `SetFlags(flags)` | flags: Integer | Empty | Устанавливает поле флагов поведения, заменяя текущие флаги. |
| `AddFlags(flags, set)` | flags: Integer, set: Boolean | Empty | Устанавливает (set=TRUE) или сбрасывает (set=FALSE) указанные биты в поле флагов. |
| `IsWindow()` | — | Integer | Ненулевое значение, если реальное окно Windows существует; 0 — не существует. |

### Биты флагов диалога (`SetFlags`, `AddFlags`)

| Бит | Имя | Действие |
|-----|-----|----------|
| `0x00000001` | DF_DONT_ADD_NEWLINE | Запретить добавление новых строк. |
| `0x00000002` | DF_DONT_DELETE_LINE | Запретить удаление строк. |
| `0x00000004` | DF_OUT_BROWSE | Выводить основной браузер перед стартом. |
| `0x00000008` | DF_DONT_LISTING | Запретить листание строк. |
| `0x00000010` | DF_USE_REPORT | Разрешить использование отчётов. |
| `0x00000020` | DF_SHOW_HELP_BUTTON | Показывать кнопку справки. |
| `0x00000040` | DF_CLOSE_ALL_WINDOWS | Закрывать все отчёты при закрытии диалога. |
| `0x00000080` | DF_NO_TOOLBAR | Не показывать панель кнопок. |
| `0x00000100` | DF_NO_BROWSE | Скрыть браузер от пользователя. |
| `0x00000200` | DF_USE_PACKET_PRINT | Использовать пакетную печать. |
| `0x00000400` | DF_SHOW_REPORT_WITHOUT_CAPTION | Показывать отчёт без заголовка. |
| `0x00000800` | DF_ADD_LINE_AFTER_START | Создать новую строку сразу после запуска. |
| `0x00001000` | DF_NO_SND_UPDT_AFTER_CLOSE | Не рассылать сообщение об обновлении после закрытия. |
| `0x00002000` | DF_CHECK_USER_FINGER | Проверять отпечаток при запуске. |
| `0x00004000` | DF_NO_OWNER_CHANGE | Запретить смену владельца. |
| `0x00008000` | DF_AUTO_CONVERT_TO_EMEL | Автоматически конвертировать в EME-L при сохранении. |
| `0x00010000` | DF_DONT_SAVE | Запретить сохранение методом save_to_DB. |
| `0x00020000` | DF_USE_SEMAPHORE | Использовать серверные семафоры. |
| `0x00040000` | DF_USER_READ_ONLY | Полный запрет на изменение данных. |
| `0x00080000` | DF_RUN_ONLY | Разрешить только один запуск диалога. |
| `0x00100000` | DF_USE_MAIL_BUTTON | Разрешить почтовую рассылку. |
| `0x00200000` | DF_DIALOG_HAS_HOT_FUNCTIONS | Диалог имеет горячие функции. |
| `0x00400000` | DF_NO_SCREENSHOT | Запретить снимки экрана. |

### Внешний вид окна

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetCaption()` | — | String | Текущий заголовок диалогового окна. |
| `SetCaption(caption)` | caption: String | Empty | Устанавливает новый заголовок окна. |
| `GetName()` | — | String | Программное имя диалога (soft name). |
| `SetWndFlags(flags)` | flags: Integer | Empty | Флаги внешнего вида окна (комбинируются побитовым ИЛИ): `0x1` — без заголовка, `0x2` — маленький заголовок, `0x4` — фиксированный размер. Должен вызываться **до** `Show`/`ShowLine`. |
| `GetRect()` | — | Rect | Прямоугольник с экранными координатами окна. |
| `MoveWindow(parent, corner)` | parent: объект Dialog/Control/Table/Integrator, corner: Integer (0–3) | Empty | Располагает окно диалога в указанном углу родительского окна. Используется для окон-инструментов. |
| `Update()` | — | Empty | Обновляет данные всех органов управления из БД (таблицы — по умолчанию). |
| `Update(update_tables)` | update_tables: Boolean | Empty | TRUE — обновлять таблицы вместе с органами, FALSE — только органы. |
| `Disable(disable_fields)` | disable_fields: Boolean | Empty | TRUE — поля только для чтения, FALSE — для редактирования. |
| `Disable(disable_fields, disable_buttons)` | + disable_buttons: Boolean | Empty | То же; дополнительно блокирует/разблокирует кнопки функций. |

## Закладки

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `DisableTabItem(name, disable)` | name: String, disable: Boolean | Empty | TRUE — закладка недоступна, FALSE — доступна. |
| `DisableAllTabItems(disable)` | disable: Boolean | Empty | Блокирует/восстанавливает все закладки разом. |
| `IsTabItemActive(name)` | name: String | Boolean | TRUE, если указанная закладка является текущей активной. |
| `SetTabItemActive(name)` | name: String | Empty | Активизирует указанную закладку. |
| `InvisibleTabItem(name, invisible)` | name: String, invisible: Boolean | Empty | TRUE — скрыть закладку, FALSE — показать. |
| `SetTabItemTextColor(name, color)` | name: String, color: Integer (RGB) | Empty | Цвет текста заголовка закладки. |
| `SetTabItemText(name, caption)` | name: String, caption: String | Empty | Изменяет заголовок закладки. |
| `GetTabItemText(name)` | name: String | String / Empty | Текущий заголовок закладки либо пустое значение, если не найдена. |

## Отчёты и печать

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `RunReport(report_name)` | report_name: String | Empty | Запускает отчёт на экран из текущего диалога. |
| `RunReport(report_name, base_line)` | + base_line: Integer | Empty | То же с базовой строкой записи. |
| `RunReport(report_name, base_line, params)` | + params: String или Parameters | Empty | То же с параметрами. |
| `RunReportIndirect(report_name)` | report_name: String | Boolean | Выводит отчёт напрямую на принтер без предварительного просмотра. |
| `RunReportIndirect(report_name, base_line)` | + base_line: Integer | Boolean | То же с базовой строкой. |
| `RunReportIndirect(report_name, base_line, copies)` | + copies: Integer | Boolean | То же с числом копий. |
| `RunReportIndirect(report_name, base_line, copies, params)` | + params: String | Boolean | То же с параметрами. |
| `RunReportIndirectInPrinter(report_name, printer_name)` | + printer_name: String | Boolean | Выводит отчёт на указанный принтер. |
| `RunReportIndirectInPrinter(report_name, printer_name, base_line)` | + base_line: Integer | Boolean | То же с базовой строкой. |
| `RunReportIndirectInPrinter(report_name, printer_name, base_line, copies)` | + copies: Integer | Boolean | То же с числом копий. |
| `RunReportIndirectInPrinter(report_name, printer_name, base_line, copies, params)` | + params: String | Boolean | То же с параметрами. |
| `RunReportIndirectInPrinter(..., orientation)` | + orientation: Integer (1 — портрет, 2 — ландшафт) | Boolean | То же с ориентацией страницы (при поддержке ядром). |
| `RunReportIndirectInPrinter(..., orientation, duplex)` | + duplex: Boolean | Boolean | То же с режимом двухсторонней печати. |
| `SendReportByEmail(report_name, base_line, recipients)` | recipients: String (адреса через `;`) | Integer (1 — успех, 0 — ошибка) | Формирует отчёт в HTML и отправляет по электронной почте. |
| `SendReportByEmail(report_name, base_line, recipients, subject)` | + subject: String | Integer | То же с явной темой письма. |
| `SkipReports(report_names...)` | переменное число имён: String | Empty | Скрывает указанные отчёты из списка печатных форм диалога. |
| `ShowReports(reports, show)` | reports: Array (по ссылке), show: Boolean | Empty | Показывает (show=TRUE) или скрывает указанные в массиве отчёты. |

## Семафоры

Защита диалога от одновременного редактирования разными пользователями. Используется совместно с флагом `DF_USE_SEMAPHORE`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetSemaphore()` | — | Empty / String | Устанавливает серверный семафор. Возвращает пустое значение при успехе; текстовое описание пользователя-владельца, если блокировка уже есть. |
| `CheckSemaphore()` | — | Empty / String | Проверяет состояние семафора. Возвращает пустое значение, если свободно; описание владельца, если занято. |
| `DeleteSemaphore()` | — | Empty | Удаляет серверный семафор текущего диалога. |

## Параметры, переменные и контекст

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetParameters()` | — | Parameters | Параметры, переданные при запуске диалога. Пробелы из строки параметров удаляются по умолчанию. |
| `GetParameters(keep_spaces)` | keep_spaces: Boolean | Parameters | То же; TRUE — сохранить пробелы, FALSE (по умолчанию) — удалить. |
| `GetClassObject()` | — | Object (Dynamic) | Контейнер данных текущего диалога. |
| `GetClassObject(scope)` | scope: String (`'PARENT'` / `'DIALOG'` / `'GLOBAL'`) | Object (Dynamic) | Контейнер данных в указанной области видимости. |
| `PutDialogVariable(variable, object)` | variable: String, object: ссылка | Empty | Сохраняет ссылку на объект в переменную диалога. |
| `GetContext()` | — | ссылка | Внутренний контекст выполнения диалога (указатель на структуру параметров). |
| `GetParent()` | — | Dialog / Empty | Объект родительского диалога, из которого был открыт текущий; пустой объект, если родителя нет. |
| `BreakExecute()` | — | Empty | Прерывает выполнение главных функций диалога (`OnAfterUpdate` и аналогичных). |

## Прочее

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Save(confirm)` | confirm: Boolean | Integer | Низкоуровневое сохранение данных в БД без вызова автоматического `Update`. Результат: 0 — отмена операции, 1 — сохранено, 2 — сохранение не состоялось, 3 — отмена сохранения с продолжением, 4 — сохранение не потребовалось. |
| `GetHelpID()` | — | Integer | Идентификатор раздела справки, назначенного диалогу. |
| `PutHelpID(help_id)` | help_id: String или Integer | Integer (1 — успех, 0 — диалог отсутствует) | Устанавливает раздел справки. Строка — текстовый идентификатор учебника; число — номер строки записи «Учебник» или номер раздела файла справки. |
| `IsEnterSemaphore()` | — | Empty | Метод-заглушка для совместимости. Всегда возвращает пустое значение. |
| `ShowPopupMessage(text)` | text: String | Empty | Выводит всплывающее окно в левом верхнем углу диалога. |
| `ShowPopupMessage(text, x, y)` | + x: Integer, y: Integer | Empty | То же в заданных координатах. |
| `ShowPopupMessage(text, x, y, bg_color)` | + bg_color: Integer (RGB) | Empty | То же с цветом фона. |
| `ShowPopupMessage(text, x, y, bg_color, text_color)` | + text_color: Integer (RGB) | Empty | То же с цветом текста. |
| `ShowPopupMessage(text, x, y, bg_color, text_color, shadow_x, shadow_y)` | + shadow_x: Integer, shadow_y: Integer | Empty | То же с размерами тени. |
| `SetControlTimer(control, interval)` | control: String или Control, interval: Integer (мс) | Boolean | Устанавливает таймер для органа управления. |
| `KillControlTimer(control)` | control: String или Control | Boolean | Уничтожает таймер органа управления. |
| `SetControlDateRange(start_control, end_control)` | имена или объекты Control двух полей даты | Boolean | Включает для двух органов типа «Дата» один двойной календарь периода. |
| `LoadScannerDriver(driver)` | driver: Integer или String | Empty | Загружает драйвер сканера штрих-кодов. |
| `SendDriverRequest(request, param)` | request: String, param: Integer | Empty | Отправляет текстовый запрос на подключённое устройство (сканер). |
| `UnloadScannerDriver(driver)` | driver: Integer или String | Empty | Выгружает драйвер сканера штрих-кодов. |

## Примеры

Объект диалога в обработчике `Dialog_OnInit` — синхронизация текущей строки с записью:

```EME-L
'#DEV_INITIALS 27.06.2025 EME company
Класс-обработчик диалога: синхронизация строки диалога с записью'
Dialog_OnInit()
{
    m_r_ActivistTasks.SetLastLine();

    If (~m_r_ActivistTasks.IsValidLine())
        'm_r_ActivistTasks.AppendAndSetLine();'
    End If

    'Переключить диалог на строку записи'
    m_Dialog.SetLine(m_r_ActivistTasks.GetLine());
}
```

Диалог как самостоятельный объект с параметрами и родителем (пример из формы запроса комментария перед печатью):

```EME-L
'#DEV_INITIALS 27.06.2025 EME company
Диалог запроса комментария: использовать родителя и параметры запуска'
Parent = Dialog.GetParent();
Param = Dialog.GetParameters();

'Установить заголовок из параметров (значение по умолчанию)'
Dialog.SetCaption(Param.GetParam("Caption", "Введите комментарий"));

'При нажатии кнопки — закрыть диалог'
btnOpenForm_OnCommand()
{
    ReturnQuestion(0);
    Dialog.Close();
}
```

Модальный запуск другого диалога с кодом запуска и параметрами:

```EME-L
'Открыть диалог выбора склада модально на новой строке'
dlg = Object("Dialog", "WarehouseSelect");
result = dlg.ShowNewLine(0, 100, "mode=pick");
If (result = 1)
    'Пользователь подтвердил выбор'
End If
```

## См. также

- [Класс Control](/language/classes/control/) — программный доступ к органам управления диалога.
- [Класс Table](/language/classes/) — таблицы диалога.
- [Класс Browser](/language/classes/browser/) — главный браузер диалога.
- [Класс Parameters](/language/classes/) — разбор параметров запуска диалога.
