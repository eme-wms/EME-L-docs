---
title: "Класс Robot"
sidebar:
  order: 100
---

# Класс Robot

Класс `Robot` в языке EME-L — класс для автоматизации имитации действий пользователя при функциональном тестировании приложения. Предоставляет программный интерфейс для управления диалогами, браузерами, меню, вводом данных, нажатием кнопок и клавиш, работы с таблицами и интеграторами.

Поддерживает создание всплывающих окон с подсказками, ведение журнала тестирования, контроль выполнения шагов сценария, а также передачу данных между роботами через контейнеры. Все действия ставятся в очередь и выполняются в интерфейсном потоке приложения. Робот может запускать другие роботы, управлять задержками и пошаговым режимом, а также проверять корректность записей базы данных. Используется для создания автоматизированных тестовых сценариев и демонстрационных режимов.

CI-имя класса — `CRobotPopupStyle` (внутренний C++ класс `CIRobot`). В языке EME-L класс регистрируется под именем `Robot`.

## Создание объекта

Самостоятельное создание объектов класса `Robot` через `Object("Robot")` **не допускается**. Объект `Robot` предоставляется системой автоматически при выполнении тестовых сценариев — он доступен в теле методов EME-L-класса робота как предопределённая переменная.

```EME-L
'Переменная Robot уже доступна системой — Object() не вызывается'
Robot.Log("Начало теста");
```

Конструктор без аргументов существует в реализации, но вызывается системой при запуске тестового сценария. Разработчик не вызывает его явно.

## Всплывающие окна и подсказки

Методы этой группы управляют всплывающими информационными окнами (popup) в демонстрационном режиме. Стиль окна настраивается через вспомогательный объект `CRobotPopupStyle`, получаемый методом `GetPopupStyle`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetPopupStyle(name)` | name: String | CRobotPopupStyle | Возвращает объект стиля всплывающего окна по имени. Если стиль с таким именем ещё не создан, он создаётся автоматически. |
| `Popup(style, text)` | style: String, text: String | Empty | Выводит всплывающее окно с заданным текстом. Продолжительность рассчитывается автоматически на основе количества слов и текущей задержки робота. |
| `Popup(style, text, duration)` | style: String, text: String, duration: Integer (секунды) | Empty | То же с явной продолжительностью отображения в секундах. |
| `StartPopup(style, text)` | style: String, text: String | Reference | Начинает отображение всплывающего окна. Возвращает указатель на объект окна для передачи в `EndPopup`. |
| `EndPopup(window_ptr)` | window_ptr: Reference | Empty | Закрывает всплывающее окно по указателю от `StartPopup`. Выполняет `Wait` перед закрытием. |
| `SetFocusPopupStyle(style)` | style: String | CRobotPopupStyle | Устанавливает имя стиля для подсказок, выводимых методом `FocusPopup`. |
| `FocusPopup(place, text)` | place: String, text: String | Empty | Выводит всплывающую подсказку рядом с элементом интерфейса. Продолжительность: 1 секунда × количество слов / 2. |
| `FocusPopup(place, text, row)` | place: String, text: String, row: Integer | Empty | То же для элемента в указанной строке таблицы. |

Параметр `place` в `FocusPopup` задаёт место вывода: имя органа управления (например, `GoodsItem.Name`) или имя колонки таблицы с номером бита через `#` (например, `Признаки#3`).

### Класс CRobotPopupStyle

Вспомогательный класс для настройки визуального оформления всплывающих окон. Объект получается из `Robot` методом `GetPopupStyle` или `SetFocusPopupStyle`. Позволяет настраивать размеры окна, цвета текста и фона, параметры рамки, позицию на экране, а также шрифт текста.

#### Размеры и позиция

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetWidth(width)` | width: Integer | Empty | Ширина окна в пикселях. |
| `SetHeight(height)` | height: Integer | Empty | Высота окна в пикселях. |
| `SetPos(position)` | position: String | Empty | Позиция окна на экране (см. константы позиций ниже). |

#### Цвета и рамка

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetTextColor(color)` | color: Integer (RGB) | Empty | Цвет текста. |
| `SetBkColor(color)` | color: Integer (RGB) | Empty | Цвет фона. |
| `SetBorderColor(color)` | color: Integer (RGB) | Empty | Цвет рамки. |
| `SetBorderWidth(width)` | width: Integer | Empty | Толщина рамки в пикселях. |

#### Шрифт

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetFontName(name)` | name: String | Empty | Имя шрифта. |
| `SetFontHeight(height)` | height: Integer | Empty | Высота шрифта в пикселях. |
| `SetFontBold()` | — | Empty | Жирное начертание. |
| `SetFontItalic()` | — | Empty | Курсивное начертание. |
| `SetFontUnderline()` | — | Empty | Подчёркнутое начертание. |

#### Указатель (хвост) окна

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetLeaderPos(position)` | position: String | Empty | Позиция указателя (хвоста) для фокусных элементов. Значения: `LB` — слева снизу, `RB` — справа снизу, `LLT` — лево лево верх. |

#### Константы позиций SetPos

Метод `SetPos` принимает строковый код позиции. Недопустимое значение вызывает ошибку через `Robot.Stop`.

| Код | Значение |
|-----|---------|
| `F` | Фокус на текущем элементе |
| `FD` | Фокус на диалоге |
| `FM` | Фокус на пункте меню |
| `C` | Центр экрана |
| `TL` | Верхний левый угол |
| `TR` | Верхний правый угол |
| `TC` | Верхний центр |
| `BL` | Нижний левый угол |
| `BR` | Нижний правый угол |
| `BC` | Нижний центр |
| `CL` | Центр левый |
| `CR` | Центр правый |
| `RB` | Справа снизу |
| `LB` | Слева снизу |
| `LLT` | Лево лево верх |

## Журнал и контроль выполнения

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Log(format_string[, arg1[, ...]])` | format_string: String, argN: любой | Empty | Добавляет запись в журнал тестирования с текущей датой и временем. Поддерживает форматную строку с подстановкой аргументов (через `is_format`). |
| `LogError(format_string[, arg1[, ...]])` | format_string: String, argN: любой | Empty | Добавляет запись об ошибке в журнал. Сообщение сохраняется во внутреннем списке ошибок. |
| `EmptyLog()` | — | Empty | Очищает журнал тестирования и удаляет все действия из очереди. |
| `Stop(format_string[, arg1[, ...]])` | format_string: String, argN: любой | Empty | Останавливает выполнение сценария с выводом сообщения. Если включён `StopIfNotComplete` — безвозвратно; иначе генерирует исключение. |
| `GetErrorQty()` | — | Integer | Количество ошибок, накопленных с момента последнего тестирования. |
| `IsComplete()` | — | Boolean | TRUE — все действия в очереди выполнены. |
| `IsComplete(index)` | index: Integer | Boolean | TRUE — указанное действие по номеру выполнено. |
| `RemoveAllFalses()` | — | Empty | Очищает все незавершённые действия, помечая их как выполненные. Используется для продолжения цепочки роботов после ошибок. |

## Ожидание и синхронизация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Sleep(milliseconds)` | milliseconds: Integer | Empty | Приостанавливает выполнение на указанное время в миллисекундах. |
| `Sleep(milliseconds, message)` | milliseconds: Integer, message: String | Empty | То же с записью сообщения в журнал. |
| `Wait()` | — | Empty | Точка синхронизации. Ожидает завершения всех действий всех роботов. Если действия не выполнены — поведение зависит от `StopIfNotComplete`. |
| `Wait(comment)` | comment: String | Empty | То же с записью в журнал информации о проверяемом объекте. |
| `WaitForWindow()` | — | Integer | Ожидает появления модального диалога. Возвращает номер действия в очереди. |
| `WaitForWindow(info)` | info: String | Integer | То же с описанием ожидаемого окна для записи в журнал. |
| `WaitForLastAction()` | — | Empty | Ожидает завершения только последнего действия текущего робота (для работы с модальными диалогами). |
| `EnterStepMode(enabled)` | enabled: Boolean | Empty | Включает/отключает пошаговый режим (пауза после каждого действия). |
| `SetTimeOut(seconds)` | seconds: Integer | Boolean | Устанавливает таймаут ожидания выполнения команды. Всегда возвращает FALSE. |

## Информация об окнах

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetWindowText()` | — | String | Текст активного модального окна (MessageBox), если оно было активно при `Wait` или `WaitForWindow`. |
| `GetWindowCaption()` | — | String | Заголовок активного окна. |
| `CloseReportByCaption(caption)` | caption: String | Boolean | Закрывает окно отчёта по заголовку. TRUE — окно найдено и закрыто. |

## Меню и навигация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SelectMenuDialog(dialog_name)` | dialog_name: String | Integer | Воспроизводит выбор пункта меню для открытия диалога. |
| `SelectMenuDialog(dialog_name, launch_code)` | dialog_name: String, launch_code: Integer | Integer | То же с кодом запуска диалога. |
| `SelectMenuModule(module_name)` | module_name: String | Integer | Воспроизводит выбор пункта меню для открытия модуля. Имя должно соответствовать записи в «Конфигурации системы». |
| `MenuModuleFocus(module_name)` | module_name: String | Integer | Устанавливает фокус на пункт меню модуля без активации. |
| `MenuDialogFocus(dialog_name)` | dialog_name: String | Integer | Устанавливает фокус на пункт меню диалога без активации. |
| `MenuDialogFocus(dialog_name, launch_code)` | dialog_name: String, launch_code: Integer | Integer | То же с кодом запуска. |
| `GetLastOpenedMenu()` | — | CIMenu | Объект последнего открытого меню в главном окне. |

## Диалоги и браузеры

Методы для установки текущего контекста диалога/браузера и навигации в них.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SetDialog(dialog_name)` | dialog_name: String | Empty | Задаёт имя текущего диалога для последующих операций. |
| `SetModuleDialog(module_dialog_name)` | module_dialog_name: String | Empty | Задаёт имя текущего диалога модуля (имя модуля преобразуется к имени диалога). |
| `SetBrowser(browser_name)` | browser_name: String | Empty | Задёт имя текущего браузера для последующих операций. |
| `DialogClose()` | — | Boolean | Закрывает текущий активный диалог. |
| `CentreDialog()` | — | Empty | Центрирует текущий диалог с размером по умолчанию. |
| `ActivateTabItem(tab_name)` | tab_name: String | Boolean | Открывает указанную закладку на диалоге. |
| `BrowserColumnFocus(column_name)` | column_name: String | Integer | Устанавливает фокус на колонку в текущем браузере. |

## Ввод данных и нажатие клавиш

### Прямые методы (с явным указанием строки)

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `EditItemInput(control, value)` | control: String, value: любой | Integer | Вводит значение в орган управления. Тип данных определяется автоматически по типу поля. |
| `EditItemInputToRow(control, value, row)` | control: String, value: любой, row: Integer | Integer | То же в указанной строке таблицы. |
| `EditItemKeydown(control, key_code)` | control: String, key_code: String | Integer | Нажатие клавиши в органе управления. Перед нажатием устанавливает фокус. |
| `EditItemKeydownToRow(control, key_code, row)` | control: String, key_code: String, row: Integer | Integer | То же в указанной строке таблицы. |
| `EditItemFocus(control)` | control: String | Integer | Устанавливает фокус ввода в орган управления. |
| `EditItemFocusToRow(control, row)` | control: String, row: Integer | Integer | То же в указанной строке таблицы. |
| `CheckBoxClick(control, bit)` | control: String, bit: Integer | Integer | Щелчок в чекбокс на текущей строке. |
| `CheckBoxClickToRow(control, bit, row)` | control: String, bit: Integer, row: Integer | Integer | Щелчок в чекбокс в указанной строке таблицы. |
| `ButtonClick(control)` | control: String | Integer | Имитирует нажатие кнопки. |

### Контекстные методы (через SetRow)

Методы `Input`, `CheckBox`, `Keydown` используют текущую строку, заданную методом `SetRow`. Если текущая строка ≥ 0, вызывается вариант `ToRow`, иначе — обычный вариант.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Input(control, value)` | control: String, value: любой | Integer | Ввод значения в орган управления (с учётом текущей строки). |
| `CheckBox(control, bit)` | control: String, bit: Integer | Integer | Щелчок в чекбокс (с учётом текущей строки). |
| `Keydown(control, key_code)` | control: String, key_code: String | Integer | Нажатие клавиши (с учётом текущей строки). |
| `SetRow(row)` | row: Integer | Empty | Устанавливает текущую строку таблицы. Значение -1 — работа с диалогом, а не с таблицей. |
| `GetRow()` | — | Integer | Возвращает текущую строку. -1 означает работу с диалогом. |

### Нажатие клавиш на уровнях диалога, браузера, окна и приложения

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `DialogKeydown(key_code)` | key_code: String | Integer | Нажатие комбинации клавиш в текущем диалоге. |
| `BrowserKeydown(key_code)` | key_code: String | Integer | Нажатие клавиши в текущем браузере. |
| `FocusWindowKeydown(key_code)` | key_code: String | Integer | Нажатие клавиши в текущем фокусном (модальном) окне. |
| `FocusWindowKeydown(key_code, caption)` | key_code: String, caption: String | Integer | То же в окне с указанным заголовком. |
| `FocusWindowInput(text)` | text: String | Integer | Ввод текста в текущее фокусное модальное окно. |
| `FocusWindowInput(text, caption)` | text: String, caption: String | Integer | То же в окне с указанным заголовком. |
| `AppKeydown(key_code)` | key_code: String | Integer | Нажатие клавиши на уровне приложения. |
| `AppKeydown()` | — | Integer | Сбрасывает состояние клавиатуры (отпускает все клавиши). |

### Коды клавиш

Параметр `key_code` во всех методах нажатия клавиш — строка. Поддерживаются комбинации с модификаторами `Ctrl+`, `Shift+`, `Alt+`.

| Код | Клавиша |
|-----|---------|
| `ESC` | Escape |
| `ENTER` | Enter |
| `TAB` | Tab |
| `PGDN` | Page Down |
| `PGUP` | Page Up |
| `DOWN`, `UP`, `LEFT`, `RIGHT` | Стрелки |
| `DEL` | Delete |
| `SPACE` | Пробел |
| `HOME` | Home |
| `END` | End |
| `F1`–`F12` | Функциональные клавиши |
| `ADD` | Плюс (numpad +, выделение всех строк в браузере) |
| `Ctrl+S`, `Alt+F4`, `Shift+Tab` | Комбинации |

### Раскладка клавиатуры

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `ActivateKeyboardLayout(language)` | language: String | Integer | Устанавливает активную раскладку. Значения: `Russian` — русская, `English (United States)` — английская. |

## Ввод ссылок из браузера

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `InputRefFromBrowser(control, browser, reference)` | control: String, browser: String, reference: Reference | Empty | Вписывает ссылку в поле через браузер добавления: открывает браузер, выбирает ссылку, подтверждает. |
| `InputRefFromBrowserToRow(control, row, browser, reference)` | control: String, row: Integer, browser: String, reference: Reference | Empty | То же в указанной строке таблицы. |

## Чтение данных из диалога и браузера

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFromControl(control)` | control: String | любой | Текущее значение из органа управления. Если орган — колонка таблицы, возвращает значение для текущей строки. |
| `GetFromControl(control, row)` | control: String, row: Integer | любой | Значение из ячейки таблицы по указанной строке. |
| `GetDialogRecord()` | — | Integer | Номер текущей записи (RECORD) открытого диалога. Если не найден — `NULL_RECORD`. |
| `GetDialogRecordObj(source_type)` | source_type: String | CEMERec | Объект записи диалога. Значения `source_type`: `dsDIALOG` (только чтение) или `dsDB`. Если не найден — NULL. |
| `GetDialogLine()` | — | Integer | Номер текущей строки (LINE) открытого диалога. Если не найден — `NULL_REF`. |
| `GetTableRecord(table_name)` | table_name: String | Integer | Номер текущей записи (D_RECORD) указанной таблицы. Если не найдена — `NULL_RECORD`. |
| `GetTableLine(table_name)` | table_name: String | Integer | Номер строки БД для текущей строки таблицы. Если не найдена — `NULL_REF`. |
| `GetTableLine(table_name, row)` | table_name: String, row: Integer | Integer | Номер строки БД для указанной строки таблицы. |
| `GetBrowserLine()` | — | Integer | Номер строки БД для текущей строки браузера. |
| `GetBrowserRecord()` | — | Integer | Номер текущей записи (BR_RECORD) браузера. |
| `GetNoOfRows(table_name)` | table_name: String | Integer | Количество строк в таблице. Если не найдена — -1. |
| `CheckValidLine(record, error_message)` | record: CEMERec, error_message: String | Boolean | Проверяет, что запись на валидной строке. Если невалидна — записывает ошибку в журнал. |

## Интегратор

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `IntegratorSelect(control, record)` | control: String, record: CEMERec | Integer | Находит и выделяет элемент в интеграторе по объекту записи БД. Поиск по полному адресу записи. |

## Контейнеры данных

Контейнеры позволяют передавать данные между роботами в цепочке через строковые ключи.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `IsHasContainer(name)` | name: String | Boolean | TRUE — контейнер с указанным именем существует. |
| `CreateContainer(name)` | name: String | CRobotDataContainer | Создаёт контейнер. Если существует — очищает содержимое. |
| `GetContainer(name)` | name: String | CRobotDataContainer | Возвращает контейнер по имени. Если не существует — создаёт автоматически. |
| `GetOrCreateContainer(name)` | name: String | CRobotDataContainer | Возвращает или создаёт контейнер по имени. |
| `GetDataFromContainer(container, key, default_value)` | container: String, key: String, default_value: любой | любой | Возвращает данные из контейнера по ключу без явного создания переменной контейнера. |
| `DeleteContainer(name)` | name: String | Boolean | Удаляет контейнер и освобождает память. |
| `DeleteAllContainers()` | — | Boolean | Удаляет все контейнеры и освобождает память. |
| `DeleteAllContainersWithout(name1[, name2[, ...]])` | nameN: String | Boolean | Удаляет все контейнеры, кроме перечисленных. |
| `IsLogContainerOperations(enabled)` | enabled: Boolean | Boolean | Включает/отключает логирование операций записи (Put) в контейнеры. Всегда возвращает FALSE. |

## Управление роботом

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `RobotGo(class_name[, container[, method_name]])` | class_name: String, container: Reference, method_name: String | любой | Выполняет другой робот (EME-L класс) как подпрограмму. Первый аргумент — объект Robot. Метод по умолчанию — `RobotGo`. |
| `GetDelay()` | — | Integer | Текущая задержка между шагами робота в миллисекундах. |
| `SetDelay(milliseconds)` | milliseconds: Integer | Integer | Устанавливает задержку. Возвращает предыдущее значение. |
| `IsSchoolBookMode()` | — | Boolean | TRUE — активен режим учебника (пошаговых подсказок). |

## Отчёты диалога

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetDialogReportsQty()` | — | Integer | Инициализирует список отчётов текущего диалога и возвращает их количество. |
| `GetDialogReportName(index)` | index: Integer | String | Имя отчёта по позиции в списке. Требует предварительного вызова `GetDialogReportsQty`. |

## Примеры

Ввод данных в диалог и сохранение:

```EME-L
'Установить контекст диалога'
Robot.SetDialog("GoodsItem");

'Заполнить поле наименования товара'
Robot.EditItemInput("Name", "Тестовый товар");

'Перейти на первую строку таблицы и заполнить ячейку'
Robot.SetRow(0);
Robot.Input("Qty", 10);

'Нажать кнопку сохранения'
Robot.ButtonClick("SaveButton");
Robot.Wait("Проверка сохранения товара");
```

Проверка значения и работа с модальным окном:

```EME-L
'Открыть браузер выбора и вписать ссылку'
Robot.InputRefFromBrowser("GoodsItem", "GoodsBrowser", nGoodsRef);
Robot.Wait();

'Проверить значение в поле после выбора'
sValue = Robot.GetFromControl("Name");
If (sValue != "Ожидаемое наименование")
    Robot.LogError("Ожидалось: %s, получено: %s", "Ожидаемое", sValue);
End If

'Обработать модальное окно подтверждения'
Robot.WaitForWindow("Диалог подтверждения");
Robot.FocusWindowKeydown("Enter");
Robot.Wait();
```

## См. также

- [Класс RobotStockWMS](/language/classes/robotstockwms/) — вспомогательный класс для тестирования складских операций
- [Тестирование](/testing/) — общие сведения о тестовых сценариях
