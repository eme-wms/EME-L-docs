---
title: "Класс Report"
description: "Управление шаблоном отчёта EME DB: построение, отображение, печать, экспорт, параметры и биндинг данных"
sidebar:
  order: 91.5
---

# Класс Report

Класс `Report` в языке EME-L — класс для управления шаблоном отчёта EME DB и его жизненным циклом. Предоставляет программный доступ к построению отчёта, отображению окна, печати, экспорту в различные форматы, управлению параметрами, масштабом и заголовком, а также к связыванию бандов и ячеек с источниками данных (`Query`).

Основные возможности:

- Запуск построения отчёта по имени шаблона с управлением видимостью окна, параметрами и дополнительным объектом `lParam`.
- Перестройка текущего отчёта с возможностью смены шаблона и передачей тега (`Update`, `UpdateReport`, `Rebuild`).
- Управление окном отчёта: вывод на экран (`ShowWindow`), закрытие (`Close`, `CloseReportByCaption`), изменение заголовка (`SetCaption`).
- Печать (`Print`) и экспорт в Excel (`ExportExcel`), HTML (`ExportHtml`), PDF (`ExportPDF`), XLSX (`ExportXlsx`).
- Управление масштабом отображения (`GetScale`, `SetScale`).
- Работа с параметрами шаблона (`GetParam`, `PutParam`).
- Биндинг: связывание горизонтальных бандов и ячеек с источниками данных (`BindBand`, `BindCell`).
- Управление бандами: сворачивание/разворачивание (`Collapse`, `Uncollapse`, `GetCollapsedBands`, `SetCollapsedBands`), сдвиг ячеек по вертикальному банду (`ShiftToVIndex`).
- Навигация и поиск по ячейкам (`SearchCell`, `VScroll`, `FixArea`).

Класс `Report` наследует `Range` (`CIReport : public CIRange`). Это означает, что через объект `Report` доступны также методы класса `Range`: чтение и запись значений ячеек, управление оформлением, навигация по строкам/столбцам, доступ к источникам данных ячеек и т.д.

Класс доступен только при включённой поддержке отчётов (C++ compile flag `I_REPORT`).

## Создание объекта

Класс `Report` имеет пять конструкторных перегрузок.

```EME-L
'Привязка к текущему отчёту из контекста выполнения'
rep = Object("Report");
```

```EME-L
'Привязка к отчёту по имени шаблона'
rep = Object("Report", "MyReport");
```

```EME-L
'Привязка через объект и мембер класса'
rep = Object("Report", "MyObject", "MyMember");
```

```EME-L
'Явное указание контекста вызова'
rep = Object("Report", "MyObject", "MyMember", 0);
```

```EME-L
'softMode = TRUE — не генерировать исключение, если отчёт отсутствует'
rep = Object("Report", "MyObject", "MyMember", 0, TRUE);
```

## Идентификация и заголовок

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetReportName()` | — | String | Имя шаблона текущего отчёта. Пустая строка, если шаблон недоступен. |
| `GetCaption()` | — | String | Заголовок окна текущего отчёта. Пустая строка, если шаблон недоступен. |
| `SetCaption(caption)` | caption: String | String | Устанавливает новый заголовок окна. Возвращает предыдущий заголовок. |
| `GetBandLine(bandName)` | bandName: String | Integer | Номер текущей строки указанного банда. Для вертикального банда — вертикальная строка текущей ячейки. `NULL_REF` (-1), если банд не найден или отчёт не готов. |

## Флаги и режимы

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `IsReportReady()` | — | Boolean | `TRUE`, если отчёт построен. |
| `IsSelectionMode()` | — | Boolean | `TRUE`, если включён режим выделения ячеек («муравьи»). |
| `IsFixedArea()` | — | Boolean | `TRUE`, если активен режим фиксации областей. |
| `IsDisabled()` | — | Boolean | `TRUE`, если редактирование ячеек отключено. |
| `Enable([flag])` | flag: Boolean, по умолчанию `TRUE` | Integer | Включает (`TRUE`) или отключает (`FALSE`) редактирование. Без аргументов — включает. Возвращает 1 при успехе, 0 при неверных аргументах. |
| `Disable([flag])` | flag: Boolean, по умолчанию `TRUE` | Integer | Обратное действие `Enable`. |
| `IsFrameInternal()` | — | Boolean | `TRUE`, если включено внутреннее отображение границ ячеек. |
| `SetFrameInternal()` | — | Boolean | Включает внутренние границы. |
| `SetFrameInternal(flag)` | flag: Boolean | Boolean | Включает/выключает внутренние границы. |

## Масштабирование

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetScale()` | — | Real | Текущий масштаб отображения; `1.0`, если окно/шаблон недоступны. |
| `SetScale(scale)` | scale: Real (0.0 < scale ≤ 10.0) | Real | Устанавливает масштаб. Возвращает установленное значение или `0.0`, если значение вне диапазона. |
| `PutScale(scale)` | scale: Real | Real | Синоним `SetScale`. |

## Перестройка отчёта

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `UpdateReport()` | — | Boolean | Перестраивает текущий отчёт без смены шаблона. |
| `UpdateReport(newReportName)` | newReportName: String | Boolean | Перестраивает отчёт с возможной сменой шаблона. |
| `UpdateReport(newReportName, tag)` | newReportName, tag: String | Boolean | Перестраивает отчёт со сменой шаблона и тегом. |
| `Update([newReportName])` | newReportName: String (необязательно) | Boolean | Синоним `UpdateReport`. |
| `Rebuild([newReportName])` | newReportName: String (необязательно) | Boolean | Синоним `UpdateReport`. |
| `GetUpdateTag()` | — | String | Тег последней перестройки. |
| `GetRebuildTag()` | — | String | Синоним `GetUpdateTag`. |

## Параметры отчёта

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetParam(name)` | name: String | String | Значение строкового параметра. `Empty`, если параметр не найден. |
| `GetParam(name, defaultValue)` | name: String, defaultValue: Any | Any | Значение параметра или `defaultValue`, если параметр не найден. |
| `PutParam(name, value)` | name: String, value: Any | Boolean | Записывает строковый параметр отчёта. |

## Связывание данных (биндинг)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `BindBand(bandName, source)` | bandName: String, source: Query | Boolean | Простое связывание горизонтального банда с источником данных. |
| `BindBand(bandName, aliasName, source, fieldName[, dynamic[, saveable]])` | bandName, aliasName, fieldName: String; source: Query; dynamic, saveable: Boolean (по умолчанию `FALSE`) | Boolean | Расширенное связывание банда. |
| `BindCell(cellName, fieldName[, saveable[, noDbSave[, check[, saveAlways]]]])` | cellName, fieldName: String; saveable, noDbSave, check, saveAlways: Boolean (по умолчанию `FALSE`) | Boolean | Связывание ячейки с полем источника данных. |
| `ShiftToVIndex(bandName, vIndex)` | bandName: String, vIndex: Integer | Boolean | Сдвигает шаблонные ячейки вправо на ширину вертикального банда, умноженную на `vIndex` (0 — без сдвига). Применимо, когда в отчёте ровно один вертикальный банд. |
| `ShiftToVIndex(bandName, vBandName, vIndex)` | bandName, vBandName: String, vIndex: Integer | Boolean | То же с явным указанием вертикального банда. |

## Печать и экспорт

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Print()` | — | Boolean | Печать на принтере по умолчанию, одна копия. |
| `Print(printerName)` | printerName: String | Boolean | Печать на указанном принтере, одна копия. |
| `Print(printerName, copies)` | printerName: String, copies: Integer | Boolean | Печать с заданным числом копий (`copies` ≥ 1). |
| `ExportExcel(fileName)` | fileName: String | Boolean | Экспорт в Excel с форматированием. `FALSE`, если файл уже существует. |
| `ExportExcel(fileName, formatted)` | formatted: Boolean (по умолчанию `TRUE`) | Boolean | Экспорт с управлением форматированием. |
| `ExportExcel(fileName, formatted, overwrite)` | overwrite: Boolean (по умолчанию `FALSE`) | Boolean | Экспорт с форматированием и перезаписью. |
| `ExportHtml(fileName)` | fileName: String | Boolean | Экспорт в HTML. |
| `ExportHtml(fileName, overwrite)` | overwrite: Boolean (по умолчанию `FALSE`) | Boolean | Экспорт в HTML с перезаписью. |
| `ExportPDF(fileName)` | fileName: String | Boolean | Экспорт в PDF формата A4 с ориентацией из шаблона. |
| `ExportPDF(fileName, overwrite)` | overwrite: Boolean | Boolean | Экспорт в PDF формата A4. |
| `ExportPDF(fileName, overwrite, pageSize)` | pageSize: String (`A4`/`A3`/`A5`) | Boolean | Экспорт с заданным форматом страницы. |
| `ExportPDF(fileName, overwrite, pageSize, orientation)` | orientation: Integer (0 — портрет, 1 — ландшафт) | Boolean | Экспорт с форматом и ориентацией. |
| `ExportXlsx(fileName)` | fileName: String | Boolean | Экспорт в XLSX без использования Excel. |
| `ExportXlsx(fileName, openAfter)` | openAfter: Boolean (по умолчанию `FALSE`) | Boolean | Экспорт в XLSX с возможностью открыть файл после экспорта. |

## Управление окном и жизненным циклом

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `ShowWindow()` | — | Report (ссылка) | Выводит отчёт в отдельное окно. Возвращает объект `Report` или `NULL`. |
| `ShowWindow([maximize])` | maximize: Boolean (по умолчанию `FALSE`) | Report (ссылка) | Вывод окна с управлением разворотом. |
| `Create(reportName)` | reportName: String | Report (ссылка) | Создаёт неглобальный объект отчёта без отображения окна. |
| `OpenFile(fileName)` | fileName: String | Report (ссылка) | Загружает отчёт из файла и отображает окно. |
| `OpenFile(fileName, visible)` | visible: Boolean (по умолчанию `TRUE`) | Report (ссылка) | Загрузка из файла с управлением видимостью. |
| `Close()` | — | Boolean | Закрывает окно отчёта. |
| `CloseReportByCaption(caption)` | caption: String | Boolean | Закрывает окно отчёта с указанным заголовком. |
| `DisableFixedArea()` | — | Boolean | Отключает режим фиксации областей. |
| `SaveToFile(fileName)` | fileName: String | Boolean | Сохраняет отчёт в файл. |
| `SetUpdateOnResize(updateOnResize)` | updateOnResize: Boolean | Empty | Включает/отключает автоматическую перестройку при изменении размеров окна. |

## Запуск отчёта

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Run(reportName)` | reportName: String | Report (ссылка) | Запускает построение отчёта с отображением окна. |
| `Run(reportName, visible)` | visible: Boolean (по умолчанию `TRUE`) | Report (ссылка) | Запуск с управлением видимостью. |
| `Run(reportName, visible, params)` | params: String или Parameters | Report (ссылка) | Запуск с параметрами. |
| `Run(reportName, visible, params, lParam)` | lParam: Any (ссылка) | Report (ссылка) | Запуск с параметрами и дополнительным объектом. |
| `Run(reportName, visible, params, lParam, useDialog)` | useDialog: Boolean (по умолчанию `FALSE`) | Report (ссылка) | Запуск с учётом текущего диалога. |

## Управление бандами и навигация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Collapse()` | — | Boolean | Сворачивает все банды, поддерживающие сворачивание. |
| `Uncollapse()` | — | Boolean | Разворачивает все свёрнутые банды. |
| `GetCollapsedBands(mapResults)` | mapResults: Map | Boolean | Заполняет `Map` состоянием сворачивания бандов. |
| `GetCollapsedBands(mapResults, mapCells)` | mapCells: Map | Boolean | То же с фильтром по ячейкам. |
| `SetCollapsedBands(mapResults)` | mapResults: Map | Boolean | Сворачивает/разворачивает банды по данным из `GetCollapsedBands`. |
| `SetCollapsedBands(mapResults, mapCells)` | mapCells: Map | Boolean | То же с фильтром по ячейкам. |
| `SearchCell(findText[, flags])` | findText: String, flags: Integer (необязательно) | Boolean | Поиск ячейки с текстом и установка фокуса. `flags`: 1 — назад, 2 — учитывать регистр, 4 — целое слово, 8 — с начала. |
| `VScroll(command)` | command: Integer | Boolean | Вертикальная прокрутка окна (константы `SB_*`). |
| `FixArea(cellName)` | cellName: String | Boolean | Фиксирует области отчёта по указанной ячейке. Для отчётов на диалоге вызывать в `Dialog_OnAfterUpdate`. |

## Утилиты

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `EnumAllReports()` | — | Collection | Коллекция объектов `Report` для всех открытых отчётов. |
| `EnumAllReports(array)` | array: Array | Integer | Заполняет массив объектами `Report`; возвращает количество. |
| `EnableToolTips()` | — | Boolean | Включает всплывающие подсказки. |
| `EnableToolTips(enable)` | enable: Boolean | Boolean | Включает/отключает подсказки. |
| `SetSelectedCellColor(colorIndex, color)` | colorIndex: Integer (1 — фокусная ячейка, 2 — выделенная ячейка), color: Integer | Boolean | Устанавливает цвет рамки. |
| `GetRect()` | — | Rect | Прямоугольник клиентской области окна отчёта. |

## Примеры

Запуск отчёта без отображения окна:

```EME-L
'Построить отчёт и получить объект Report для дальнейшей обработки'
rep = Object("Report").Run("MyReport", 0);
```

Установка заголовка окна текущего отчёта:

```EME-L
'Установить заголовок отчёта в обработчике построения'
Object("Report").SetCaption(tr("Операции для клиентов"));
```

Получение параметра отчёта со значением по умолчанию:

```EME-L
'Получить строковый параметр; если не задан — значение по умолчанию'
printer = Object("Report").GetParam("Printer", "");
```

Экспорт отчёта в PDF формата A4 с перезаписью:

```EME-L
'Экспортировать отчёт в PDF, перезаписав файл при необходимости'
Object("Report").ExportPDF("C:\\Reports\\MyReport.pdf", TRUE, "A4");
```

Сохранение и восстановление состояния свёрнутых бандов:

```EME-L
'Запомнить состояние бандов в Map'
mapState = Object("Map");
Object("Report").GetCollapsedBands(mapState);
'... позже — восстановить состояние'
Object("Report").SetCollapsedBands(mapState);
```

## См. также

- [Класс Range](./range.md) — родительский класс `Report` для работы с ячейками шаблона отчёта.
- [Класс Rect](./rect.md) — результат метода `GetRect()`.
- [Класс Query](./query.md) — источник данных, передаваемый в методы `BindBand`.
- [Класс Collection](./collection.md) — тип результата `EnumAllReports()`.
- [Класс Map](./map.md) — тип аргумента `GetCollapsedBands` / `SetCollapsedBands`.
- [Класс Parameters](./parameters.md) — тип аргумента `params` перегрузок `Run`.
