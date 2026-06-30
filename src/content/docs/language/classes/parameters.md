---
title: "Класс Parameters"
sidebar:
  order: 77
---

# Класс Parameters

Класс `Parameters` в языке EME-L — набор произвольных параметров в формате `Имя=Значение`. Предоставляет инкапсулированный доступ к коллекции именованных значений произвольных типов: строк, целых чисел, дат, времени и логических значений.

Объект может быть создан пустым, инициализирован строкой в формате `Имя=Значение`, разделённых переводом строки, или скопирован из контекстного набора параметров. Поддерживает типизированный доступ к параметрам, работу с дочерними группами подпараметров, перебор параметров в наборе, а также сериализацию в объект `Archive` и восстановление из него.

Используется в прикладных скриптах EME-L для передачи произвольных настроек, аргументов и дополнительных данных между методами, диалогами и внешними системами.

Объект класса `Parameters` создаётся через `Object()` и не привязан к контексту диалога или браузера — это самостоятельный класс для работы с именованными значениями.

## Создание объекта

Класс `Parameters` имеет один конструктор с переменным числом аргументов. Допустимы формы с 0, 1 или 2 аргументами.

```EME-L
'Пустой набор параметров'
Params = Object("Parameters");
```

```EME-L
'Набор параметров, разобранный из строки'
Params = Object("Parameters", "Name=Value\nCount=10");
```

```EME-L
'Та же строка с сохранением пробелов'
Params = Object("Parameters", "Name = Value\nCount = 10", TRUE);
```

Конструктор без аргументов создаёт пустой набор параметров. Конструктор с одним аргументом разбирает переданную строку в формате `Имя=Значение`, разделённых переводом строки; при этом пробелы во входной строке удаляются. Конструктор с двумя аргументами позволяет сохранить пробелы: если второй аргумент равен `TRUE`, входная строка разбирается без удаления пробелов.

Если конструктору передаётся контекстный набор параметров, объект инициализируется его копией.

## Чтение параметров

Методы возвращают значение параметра по имени. Если параметр не найден, возвращается значение по умолчанию: пустая строка, `0`, пустая дата, пустое время или `FALSE`. Двухаргументные формы позволяют задать значение по умолчанию явно.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetParam(name)` | name: String | String | Значение параметра как строка. Если параметр не найден — пустая строка. |
| `GetParam(name, defaultValue)` | name: String, defaultValue: String | String | Значение параметра; при отсутствии возвращается `defaultValue`. |
| `GetParamValue(name)` | name: String | Variant | Вычисленное значение параметра: строка, целое число, вещественное число, дата, время или boolean. При отсутствии — пустое значение. |
| `GetParamValue(name, defaultValue)` | name: String, defaultValue: Variant | Variant | Вычисленное значение параметра; при отсутствии возвращается `defaultValue`. |
| `GetLongParam(name)` | name: String | Integer | Значение параметра как целое число. При отсутствии — `0`. |
| `GetLongParam(name, defaultValue)` | name: String, defaultValue: Integer | Integer | Значение параметра как целое число; при отсутствии возвращается `defaultValue`. |
| `GetDateParam(name)` | name: String | DateTime | Значение параметра как дата. При отсутствии — пустая дата. |
| `GetDateParam(name, defaultValue)` | name: String, defaultValue: DateTime | DateTime | Значение параметра как дата; при отсутствии возвращается `defaultValue`. |
| `GetTimeParam(name)` | name: String | DateTime | Значение параметра как время. При отсутствии — пустое время. |
| `GetTimeParam(name, defaultValue)` | name: String, defaultValue: DateTime | DateTime | Значение параметра как время; при отсутствии возвращается `defaultValue`. |
| `GetBoolParam(name)` | name: String | Boolean | Значение параметра как логическое значение. При отсутствии — `FALSE`. |
| `GetBoolParam(name, defaultValue)` | name: String, defaultValue: Boolean | Boolean | Значение параметра как логическое значение; при отсутствии возвращается `defaultValue`. |

## Запись параметров

Методы добавляют новый параметр или изменяют значение существующего. Типизированные методы сохраняют значение с явным приведением к соответствующему типу.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `PutParam(name, value)` | name: String, value: String | Empty | Записывает текстовое значение параметра. |
| `PutLongParam(name, value)` | name: String, value: Integer | Empty | Записывает целочисленное значение параметра. |
| `PutDateParam(name, value)` | name: String, value: DateTime | Empty | Записывает значение параметра как дату. |
| `PutTimeParam(name, value)` | name: String, value: DateTime | Empty | Записывает значение параметра как время. |
| `PutBoolParam(name, value)` | name: String, value: Boolean | Empty | Записывает логическое значение параметра. |

## Разбор и формирование строки

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `AsString()` | — | String | Преобразует текущий набор параметров в форматированную строку. |
| `GetContent()` | — | String | Возвращает форматированное строковое представление содержимого набора; синоним `AsString`. Используется для отладки. |
| `SetString(parametersString)` | parametersString: String | Empty | Удаляет все имеющиеся параметры и строит набор из строки. Пробелы во входной строке удаляются. |
| `SetString(parametersString, addToExisting)` | parametersString: String, addToExisting: Boolean | Empty | Строит набор из строки. Если `addToExisting` равен `TRUE`, параметры добавляются к существующему набору; иначе набор предварительно очищается. Пробелы удаляются. |
| `SetString(parametersString, addToExisting, keepSpaces)` | parametersString: String, addToExisting: Boolean, keepSpaces: Boolean | Empty | Строит или дополняет набор из строки с возможностью сохранения пробелов: `keepSpaces=TRUE` оставляет пробелы, `FALSE` удаляет. |

## Группы подпараметров

Группы позволяют выделять вложенные наборы параметров по имени группы. Имя группы используется как префикс при хранении параметров внутри набора.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `SubParams(groupName)` | groupName: String | Parameters | Возвращает новый объект `Parameters`, содержащий параметры указанной группы. |
| `AddParams(paramsObject)` | paramsObject: Parameters (по ссылке) | Empty | Добавляет все параметры из другого объекта `Parameters` в текущий набор. |
| `AddParams(paramsObject, groupName)` | paramsObject: Parameters (по ссылке), groupName: String | Empty | Добавляет параметры из другого объекта в текущий набор в виде дочерней группы с указанным именем. |
| `RemoveParams(groupName)` | groupName: String | Boolean | Удаляет из набора все параметры указанной группы. Возвращает `TRUE`, если параметры удалены, и `FALSE`, если группа не найдена или удаление не выполнено. |
| `RemoveParam(name)` | name: String | Boolean | Удаляет параметр по имени. Возвращает `TRUE`, если параметр удалён, и `FALSE`, если параметр не найден. |

## Перебор параметров

Перебор параметров в наборе выполняется последовательно. Перед началом перебора вызывается `GetFirstParam`, затем — `GetNextParam` до тех пор, пока `IsValidParam` возвращает `TRUE`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFirstParam()` | — | String | Имя первого параметра в наборе. Если набор пуст — пустая строка. |
| `IsValidParam()` | — | Boolean | `TRUE` — текущая позиция перечисления указывает на действительный параметр; `FALSE` — достигнут конец перечисления. |
| `GetNextParam()` | — | String | Переходит к следующему параметру и возвращает его имя. Если параметров больше нет — пустая строка. |

## Управление набором

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `IsEmpty()` | — | Boolean | `TRUE` — набор не содержит параметров; `FALSE` — в наборе есть хотя бы один параметр. |
| `Empty()` | — | Empty | Удаляет все параметры из набора. |

## Сериализация

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Load(archive)` | archive: Archive (по ссылке) | Empty | Загружает набор параметров из объекта архива `Archive`. |
| `Store(archive)` | archive: Archive (по ссылке) | Empty | Сохраняет набор параметров в объект архива `Archive`. |

## Примеры

Передача параметров веб-запроса:

```EME-L
'Собрать параметры HTTP-запроса'
Params = Object("Parameters");
Params.PutParam("Request.URL", "/v1/chat/completions");
Params.PutParam("Header.Content-Type", "application/json");
Params.PutParam("", JSONBody);

'Выполнить запрос, передав объект Parameters'
Result = Object("System").WEBRequest(IP, Port, TimeOut, Params, AnswerString);
```

Чтение параметров отчёта:

```EME-L
'Получить строковый и логический параметры отчёта'
p_Caller = Report.GetParam("p_Caller");
paramShowSCD = Report.GetBoolParam("p_paramShowSCD");
```

Работа с группами подпараметров:

```EME-L
'Создать дочернюю группу настроек'
ChildParams = Object("Parameters");
ChildParams.PutParam("Host", "10.0.0.1");
ChildParams.PutLongParam("Port", 8080);

'Добавить группу под именем Connection в родительский набор'
ParentParams = Object("Parameters");
ParentParams.AddParams(ChildParams, "Connection");

'Извлечь группу обратно'
ConnectionParams = ParentParams.SubParams("Connection");
Host = ConnectionParams.GetParam("Host");
```

Перебор всех параметров в наборе:

```EME-L
'Вывести имена и значения всех параметров'
Key = Params.GetFirstParam();
While (Params.IsValidParam())
    Value = Params.GetParam(Key);
    is_message(tr("Параметр"), Key + "=" + Value, 1);
    Key = Params.GetNextParam();
End While
```

## См. также

- [Класс Archive](./archive.md) — бинарная сериализация; методы `Load` и `Store` работают с объектом `Archive`.
- [Класс String](./string.md) — строковый объект, значения которого можно передавать в параметры.
