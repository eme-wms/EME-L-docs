---
title: "Класс Table"
sidebar:
  order: 30.5
---

# Класс Table

Класс `Table` в языке EME-L — это программный доступ к таблице диалога. Через объект `Table` можно читать и изменять строки и ячейки, управлять доступностью, цветом и видимостью, помечать строки, перезагружать данные из БД, сортировать и экспортировать содержимое.

Объект создаётся функцией `Object("Table", ...)` и **привязан к контексту** — либо к текущей таблице диалога (в обработчиках диалога), либо к таблице по имени, либо по имени объекта и члена класса. Конструктор поддерживает пять перегрузок.

> Создание `Object("Table", ...)` вне конструктора класса (например, в цикле) противоречит правилам управления памятью. В конструкторе класса такие объекты следует инициализировать сразу через `Const`.

Таблица может быть **привязана к БД** (имеет базовую запись `CEMERec` и строковую нумерацию БД) или **не привязана** (хранит данные только в диалоге). Ряд методов (`GetDBObject`, `GetRecord`, `GetDBLine`, `DeleteRow` с подтверждением) ведут себя по-разному в этих режимах.

## Создание объекта

```EME-L
'Подключение к текущей таблице диалога'
tbl = Object("Table");

'По имени таблицы диалога'
tbl = Object("Table", "GoodsTable");

'По имени объекта класса и имени члена класса'
tbl = Object("Table", "AccountEquipment.AskPrinter");

'С режимом soft_mode: не бросать исключение, если таблица не найдена'
tbl = Object("Table",, "Info",, TRUE);
```

| Конструктор | Контекст | Описание |
|-------------|----------|----------|
| `Table()` | текущий | Подключается к текущей таблице диалога по контексту выполнения. |
| `Table(name)` | текущий | Подключается к таблице диалога по её имени. |
| `Table(objectName, memberName)` | объект класса | Подключается к таблице по имени объекта EME-L класса и имени члена (метода). |
| `Table(objectName, memberName, context)` | объект класса | То же с явным указанием контекста вызова (целое число). |
| `Table(objectName, memberName, context, softMode)` | объект класса | То же с режимом обработки отсутствия таблицы: `softMode=TRUE` — игнорировать отсутствие (объект с пустой ссылкой), `FALSE` — генерировать исключение. |

## Строки и навигация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetNoOfLines()` | — | Integer | Количество строк в таблице. |
| `GetCurrentRow()` | — | Integer | Номер текущей строки таблицы. |
| `SetCurrentRow(row)` | row: Integer | Empty | Устанавливает текущую строку таблицы. |
| `AddRow()` | — | Integer | Добавляет пустую строку (не привязанную к записи БД). Возвращает номер добавленной строки. |
| `AddRow(line)` | line: Integer — номер строки базовой записи | Integer | Добавляет в таблицу уже существующую строку записи БД. Возвращает номер загруженной строки. |
| `DeleteRow(row, confirm)` | row: Integer, confirm: Boolean/Integer | Integer/Boolean | Удаляет строку. `confirm=TRUE` — вывести диалог подтверждения (недопустимо в открытой транзакции); `FALSE` — удалить без подтверждения. Возвращает `FALSE`, если удаление отменено пользователем, иначе строка удалена. |
| `Clear()` | — | Empty | Удаляет все строки. Для таблицы, привязанной к БД — через механизм сохранения; для таблицы без привязки — без рассылки сообщений. |
| `Reset()` | — | Empty | Очищает таблицу без удаления строк из БД. |
| `LoadLine(line)` | line: Integer — номер строки базовой записи | Integer | Загружает строку в таблицу. Возвращает номер загруженной строки. |
| `LoadLines(lines)` | lines: CIBitBuffer / CIArray / CEMERec (ссылка) | Empty | Загружает группу строк: биты буфера, массив номеров или строки записи. |
| `Update()` | — | Empty | Перезагружает таблицу из БД. |
| `UpdateRow([row[, param]])` | row: Integer, param: Integer (необязательные) | Empty | Перезагружает строку таблицы из БД. |
| `Reskip()` | — | Empty | Перезагружает буфер строк таблицы. |
| `IsValidRow()` | — | Boolean | TRUE, если текущая строка в диапазоне `0 .. GetNoOfLines()-1`. |
| `IsValidRow(row)` | row: Integer | Boolean | TRUE, если указанная строка в допустимом диапазоне. |

## Связь с записью БД

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetDBObject()` | — | CEMERec / NULL | Объект записи БД для таблицы, привязанной к БД. Для таблицы без привязки возвращает `NULL`. |
| `GetDBObject(mode)` | mode: String — `"dsDB"` (по умолчанию) или `"dsDIALOG"` | CEMERec / NULL | То же с указанием источника данных: `dsDB` — по данным БД, `dsDIALOG` — по данным диалога. |
| `GetRecord()` | — | Integer | Номер записи БД, к которой привязана таблица. |
| `GetDBLine()` | — | Integer | Номер строки БД для текущей строки таблицы. |
| `GetDBLine(row)` | row: Integer | Integer | Номер строки БД для указанной строки таблицы. |
| `SetDBLine(line)` | line: Integer — номер строки БД | Integer | Устанавливает текущую строку таблицы по номеру строки БД. Если не найдена — возвращает `GetNoOfLines()`. |
| `GetRow(line)` | line: Integer — номер строки базовой записи | Integer | Номер строки таблицы по номеру строки базовой записи БД. |
| `HasFieldsToWriteToDB(row)` | row: Integer | Integer | `1`, если строка содержит изменённые поля для записи в БД, иначе `0`. |

## Доступность и флаги строк

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Disable(disable)` | disable: Boolean | Empty | Устанавливает флаг `READ_ONLY` для всех строк. `TRUE` — только для чтения, `FALSE` — доступна для редактирования. |
| `SetReadOnly(readOnly)` | readOnly: Boolean | Empty | Запрещает/разрешает редактирование таблицы пользователем. |
| `IsReadOnly()` | — | Boolean | TRUE, если таблица доступна пользователю только для чтения. |
| `DisableRow(row, disable)` | row: Integer, disable: Boolean | Empty | Делает указанную строку только для чтения (`TRUE`) или доступной (`FALSE`). |
| `IsDisableRow(row)` | row: Integer | Boolean | TRUE, если строка задизейблена (только для чтения). |
| `DisableColumn(column, priority)` | column: CIControl, priority: Boolean | Empty | Управляет доступностью ячеек столбца. `priority=FALSE` — определяется доступностью столбца; `TRUE` — доступностью строк, если столбец доступен. |
| `DisableAddDelRows(disable)` | disable: Boolean | Empty | `TRUE` — запретить добавление и удаление строк, `FALSE` — разрешить. |
| `SetModified(row, modified)` | row: Integer, modified: Boolean | Empty | Устанавливает/снимает флаг модификации строки пользователем. |
| `IsModified()` | — | Boolean | TRUE, если хотя бы одна строка модифицирована пользователем. |
| `IsModified(row)` | row: Integer | Boolean | TRUE, если указанная строка модифицирована. |

## Колонки

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetNoOfColumns()` | — | Integer | Количество столбцов в таблице. |
| `GetCurrentColumn()` | — | Integer | Номер текущего столбца. |
| `GetColumnName()` | — | String | Имя текущей колонки. |
| `GetColumnName(number)` | number: Integer | String | Имя колонки по её номеру. |
| `GetColumnCaption()` | — | String | Заголовок текущей колонки. |
| `GetColumnCaption(number)` | number: Integer | String | Заголовок колонки по её номеру. |
| `GetColumnNumber(name)` | name: String | Integer | Номер колонки по её имени. |
| `GetControl(number)` | number: Integer | CIControl | Объект `CIControl` колонки по номеру столбца. |
| `GetControl([objectName], memberName)` | objectName: String (необязательный), memberName: String | CIControl | Объект `CIControl` колонки по имени объекта и мембера. |
| `SortColumn(name)` | name: String — имя колонки | Empty | Сортирует таблицу по колонке в прямом направлении. |
| `SortColumn(name, direction)` | name: String, direction: Integer (`1` — прямая, `0` — обратная) | Empty | Сортирует таблицу с заданным направлением. Требует ядро ≥ 21.4. |
| `EnableSorting(enable)` | enable: Boolean | Boolean/Integer | Разрешает/запрещает сортировку. Возвращает предыдущее значение. |
| `UniteColumns(firstColumn, lastColumn, caption)` | firstColumn: CIControl/String, lastColumn: CIControl/String, caption: String | Empty | Объединяет колонки. Колонки должны существовать и быть на одном этаже заголовка. Пустой `caption` — текст из первой колонки. |
| `DeleteColumnsUnion(column)` | column: CIControl/String | Empty | Разрушает объединение колонок, в которое попадает переданная колонка. |

## Цвет и внешний вид строк/ячеек

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetMarkColor(color)` | color: Integer (RGB, `0xBBGGRR`) | Empty | Устанавливает цвет помеченных строк. |
| `MarkRow(row)` | row: Integer | Empty | Помечает указанную строку. |
| `MarkRow(row, mark)` | row: Integer, mark: Boolean | Empty | `TRUE` — установить пометку, `FALSE` — снять. |
| `HaveMarkedLine()` | — | Boolean | TRUE, если в таблице есть хотя бы одна отмеченная строка. |
| `IsLineMarked(row)` | row: Integer | Boolean | TRUE, если строка отмечена. |
| `SetRowTextColor(row, color)` | row: Integer, color: Integer (RGB) | Empty | Устанавливает цвет текста строки. |
| `GetRowTextColor(row)` | row: Integer | Integer | Цвет текста строки (RGB). Если не задан — `0`. |
| `ResetRowTextColor(row)` | row: Integer | Empty | Сбрасывает цвет текста строки. |
| `SetRowColor(row, color)` | row: Integer, color: Integer (RGB) | Empty | Устанавливает цвет фона строки. |
| `GetRowColor(row)` | row: Integer | Integer | Цвет фона строки (RGB). Если не задан — `-1`. |
| `IsRowColorExists(row)` | row: Integer | Integer | `1`, если цвет фона строки был установлен, иначе `0`. |
| `GetRowColor(row, ignored)` | row: Integer, ignored: любой | Integer | **Устаревший.** Аналог `IsRowColorExists`; второй параметр игнорируется. Не использовать. |
| `ResetRowColor(row)` | row: Integer | Empty | Сбрасывает цвет фона строки. |
| `SetCellColor(column, row, color)` | column: String/Integer, row: Integer, color: Integer (RGB) | Empty | Устанавливает цвет фона ячейки. |
| `SetCellTextColor(column, row, color)` | column: String/Integer, row: Integer, color: Integer (RGB) | Empty | Устанавливает цвет текста ячейки. |
| `ResetCellColor(column, row)` | column: String/Integer, row: Integer | Empty | Сбрасывает цвет фона ячейки. |
| `ResetCellTextColor(column, row)` | column: String/Integer, row: Integer | Empty | Сбрасывает цвет текста ячейки. |
| `SetColumnColor(column, color)` | column: String/Integer, color: Integer (RGB) | Empty | Устанавливает цвет фона колонки. |

## Окно таблицы и фокус

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetFocus()` | — | Empty | Устанавливает фокус ввода на таблицу. |
| `SetFocus([column[, row]])` | column: String/Integer (необязательный), row: Integer (необязательный) | Empty | Устанавливает фокус на ячейку. Без аргументов — на таблицу в целом. |
| `IsFocused()` | — | Boolean | TRUE, если фокус находится на таблице. |
| `Invisible(invisible)` | invisible: Boolean | Empty | `TRUE` — сделать таблицу невидимой, `FALSE` — видимой. |
| `GetName()` | — | String | Имя таблицы. |
| `SetRedraw(redraw)` | redraw: Boolean | Empty | `TRUE` — разрешить перерисовку (с коррекцией прокрутки и принудительной перерисовкой), `FALSE` — запретить. |
| `GetNoOfInfoLines()` | — | Integer | Количество нескроллируемых (информационных) строк. |
| `SetNoOfInfoLines(count)` | count: Integer | Integer | Задаёт число информационных строк. Возвращает предыдущее значение. |
| `GetCellRect(column, row)` | column: String/Integer, row: Integer | CIRect | Объект `CIRect` ячейки в экранных координатах. |
| `SetOriginalRect(rect)` | rect: CIRect (ссылка) | Boolean | Устанавливает размеры и положение окна таблицы (в единицах редактора диалогов). TRUE при успехе. |
| `GetOriginalRect()` | — | CIRect | Объект `CIRect` с размерами окна таблицы (в единицах редактора диалогов). |

## Экспорт и удалённые строки

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `ExportExcel(fileName, openAfter)` | fileName: String, openAfter: Boolean | Boolean | **Ядро ≥ 50.0.** Экспорт в XLSX. `TRUE` — открыть после экспорта. TRUE при успехе. |
| `ExportExcel([fileName[, formatted[, forPrint]]])` | fileName: String, formatted: Boolean (по умолч. TRUE), forPrint: Boolean (по умолч. TRUE) | Boolean | **Ядро < 50.0.** Экспорт в Excel. TRUE при успехе. |
| `GetFirstDeletedLine()` | — | Integer/NULL_REF | Первая удаляемая строка БД. Используется в `OnCheck`/`OnBeforeSave`. `NULL_REF`, если удаляемых строк нет. |
| `GetNextDeletedLine()` | — | Integer/NULL_REF | Следующая удаляемая строка БД. `NULL_REF`, если больше нет. |

## Примеры

### Получение объекта таблицы и доступ к органу колонки

```EME-L
'Подключение к текущей таблице диалога'
history = Object("Table");

'Получить объект записи БД, привязанной к таблице'
line = history.GetDBObject();
If (line.GetLine() == NULL_REF)
    'Добавить новую строку и заполнить ячейки через GetControl'
    HistoryEquipment.AddRow();
    HistoryEquipment.GetControl(0).Put(is_dos_date());
    HistoryEquipment.GetControl(1).Disable(False);
End If
```

### Пометка строк и проверка

```EME-L
tbl = Object("Table", "GoodsTable");

'Пометить строки с признаком'
For (i = 0; i < tbl.GetNoOfLines(); i = i + 1)
    tbl.MarkRow(i, True);
End For

If (tbl.HaveMarkedLine())
    'Есть хотя бы одна помеченная строка'
End If
```

### Перебор удаляемых строк в OnCheck

```EME-L
tbl = Object("Table");

'Перебрать строки БД, которые будут удалены при сохранении'
line = tbl.GetFirstDeletedLine();
While (line != NULL_REF)
    'Проверить ограничения для удаляемой строки line'
    line = tbl.GetNextDeletedLine();
End While
```
