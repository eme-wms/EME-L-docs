---
title: "Класс Query"
sidebar:
  order: 81
---

# Класс Query

Класс `Query` в языке EME-L — обёртка над внутренним объектом `CEMEQuery`. Предоставляет скриптам EME-L возможность формировать, выполнять, модифицировать и анализировать двумерные наборы данных, состоящие из полей (колонок) и строк. Это основной инструмент для получения выборок из базы данных, временного хранения промежуточных результатов, подготовки данных для отчётов и обмена информацией между подсистемами.

Основные возможности:

- Создание пустого запроса программно или выполнение именованного запроса проекта с параметрами, классом, индикатором прогресса, кэшированием, блочным чтением и оптимизацией EME-L.
- Программное построение структуры: добавление полей типа строка, целое, вещественное, дата, время, дата-время, деньги, int64, ссылочных полей, а также полей по образцу поля БД.
- Заполнение и изменение данных по номеру поля и строки или в текущей строке; копирование, объединение, сравнение запросов и построение/применение патчей.
- Сортировка и группировка по одному или нескольким полям, управление сохранёнными сортировками и быстрый поиск по значениям сортировочных полей.
- Получение метаданных полей (имя, тип, длина, ссылочная запись) и навигация по строкам.
- Подключение полей запроса к полям записи БД для блочной записи, выгрузка в XML/CSV/дамп, просмотр результатов в браузере запросов.
- Работа с кэшем запросов, переменными диалога и отчёта.

Объект создаётся пустым, по имени запроса проекта или с указанием контейнера и контекста.

## Создание объекта

Класс `Query` имеет четыре конструктора — по числу аргументов. Все аргументы опциональны: пустой вызов создаёт локальный запрос EME-L, не кэшируемый и не привязанный к именованному запросу проекта.

```EME-L
'Без аргументов — пустой запрос EME-L, не кэшируется'
q = Object("Query");
```

```EME-L
'По имени запроса проекта — контейнер и контекст наследуются из параметров вызова'
q = Object("Query", "MyProjectQuery");
```

```EME-L
'С явным контейнером (родительским объектом)'
q = Object("Query", "MyProjectQuery", container);
```

```EME-L
'С контейнером и контекстом вызова'
q = Object("Query", "MyProjectQuery", container, context);
```

Если имя запроса не задано (`Object("Query")`), запрос должен быть построен программно через `Create` и `Add*`-методы, после чего он не помещается в кэш автоматически. Если контейнер невалиден, он обнуляется.

## Выполнение и жизненный цикл

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Execute()` | — | Empty | Выполняет именованный запрос проекта с параметрами по умолчанию. Если предварительно вызван `SetWithoutIndicator()`, выполнение идёт без индикатора прогресса. |
| `Execute(singleThread)` | arg0: Boolean | Empty | Запрос выполняется в одном потоке. В текущей реализации ядро всегда выполняет запрос в одном потоке, поэтому параметр фактически не меняет поведения — перегрузка оставлена для совместимости. |
| `Execute(params, className)` | arg0: String (параметры), arg1: String (класс) | Empty | Явные параметры и класс, например `"Входной фильтр"`. |
| `Execute(params, className, withoutIndicator)` | + arg2: Boolean | Empty | Отключает индикатор прогресса. |
| `Execute(params, className, withoutIndicator, cache)` | + arg3: Boolean | Empty | Управляет кэшированием (FALSE отключает). |
| `Execute(params, className, withoutIndicator, cache, blockRead)` | + arg4: Boolean | Empty | Включает блочное чтение данных БД. |
| `Execute(params, className, withoutIndicator, cache, blockRead, optimizeEMEL)` | + arg5: Boolean | Empty | Включает оптимизатор EME-L. |
| `Create()` | — | Empty | Создаёт структуру запроса без выполнения, с кэшированием по умолчанию. |
| `Create(enableCache)` | arg0: Boolean | Empty | То же; FALSE отключает кэширование при создании. |
| `Delete()` | — | Empty | Удаляет данные запроса. Запрос в кэше не затрагивается. |
| `Delete(clearCache)` | arg0: Boolean | Empty | При TRUE дополнительно удаляет запрос из кэша. |
| `AddToCache()` | — | Empty | Помещает запрос в кэш под своим именем. Не применим к безымянным. |
| `AddToCache(cacheName)` | arg0: String | Empty | Помещает запрос в кэш под указанным именем. |
| `SetWithoutIndicator()` | — | Empty | Эквивалент `Execute(..., TRUE)` для индикатора; действует до выполнения. |
| `SetMemorySize(bytes)` | arg0: Integer | Empty | Устанавливает размер буфера памяти запроса в байтах. |
| `Dump(fileName)` | arg0: String | Empty | Выводит данные запроса в дамп-файл. |
| `RunViewer()` | — | Empty | Открывает браузер запросов. |
| `RunViewer(templateName)` | arg0: String | Empty | Открывает браузер запросов по шаблону. |
| `IsEmpty()` | — | Boolean | TRUE — запрос не создан или не содержит строк. |
| `Backup(targetQuery)` | arg0: Query (по ссылке) | Empty | Выводит данные текущего запроса в целевой запрос. |

`Execute` без параметров и `Create` различаются: `Create` строит структуру без обращения к БД, `Execute` обращается к БД и заполняет строки. Установка `m_nMemorySize` через `SetMemorySize` учитывается как при `Create`, так и при `Execute`.

## Структура и поля

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetNoOfLines()` | — | Integer | Количество строк. |
| `SetNoOfLines(count)` | arg0: Integer | Empty | Устанавливает количество строк; усекает запрос. |
| `GetNoOfFields()` | — | Integer или Empty | Количество полей в структуре. Empty, если запрос не создан. |
| `FindField(field)` | arg0: String/Integer | Integer | Номер поля по имени или номеру. -1, если не найдено. |
| `TryFindField(field)` | arg0: String/Integer | Integer | Номер поля. `NULL_FIELD` (-100), если не найдено. |
| `GetFieldNarrative(field)` | arg0: Integer | String или Empty | Имя поля по его номеру. |
| `GetFieldAttribute(field)` | arg0: String/Integer | Integer или Empty | Код атрибута (типа) поля. |
| `GetFieldLength(field)` | arg0: String/Integer | Integer | Длина поля в байтах. 0, если поле не найдено. |
| `GetFieldLengthInChars(field)` | arg0: String/Integer | Integer | Длина текстового поля в символах; для остальных — в байтах. 0, если поле не найдено. |
| `GetFieldReference(field)` | arg0: String/Integer | Integer | Номер ссылочной записи. `NULL_RECORD`, если поле не ссылочное. |
| `GetFieldGroup(field)` | arg0: String/Integer | Integer | Индекс поля в текущей группировке. -1, если поле не группировочное. |
| `GetFieldSum(field)` | arg0: String/Integer | Integer/Real/Money | Сумма значений поля по всем строкам. -1, если тип поля не поддерживает суммирование. |
| `GetFields()` | — | Byte array | Сериализованная структура полей. |
| `AddFields(fields)` | arg0: Byte array | Empty | Загружает структуру полей из сериализованного массива. |
| `GetName()` | — | String или Empty | Имя запроса. |
| `SetName(name)` | arg0: String | Empty | Устанавливает имя запроса. |
| `GetContainer()` | — | Object | Контейнер (родительский объект), связанный с запросом. |
| `SetContainer(container)` | arg0: Object (по ссылке) | Empty | Устанавливает контейнер. |
| `SetContext(context)` | arg0: Context (по ссылке) | Empty | Устанавливает новый контекст вызова. |
| `PutDialogVariable(varName)` | arg0: String | Boolean | Сохраняет указатель на запрос в переменную диалога. FALSE, если диалог недоступен. |
| `PutReportVariable(varName)` | arg0: String | Empty | Сохраняет указатель на запрос в переменную отчёта. |

Константы:

- `NULL_FIELD` = **-100** — возвращается `TryFindField`, если поле не найдено.
- `NULL_RECORD` — возвращается `GetFieldReference`, если поле не ссылочное; используется как заглушка записи в `AddREF`/`AddVVR`.
- `NULL_REF` — возвращается `AddLine`, если запрос не создан.

## Добавление полей

Методы `Add*` предназначены для запросов EME-L (`Object("Query")`). При работе с именованным запросом проекта они возвращают `NULL_FIELD` и оставляют структуру нетронутой. Все методы возвращают номер добавленного поля (`Integer`) или Empty, если запрос не создан.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `AddTEXT(fieldName)` | arg0: String | Integer или Empty | Текстовое поле переменной длины. |
| `AddTEXT(fieldName, size)` | + arg1: Integer | Integer или Empty | Текстовое поле заданной длины. Размер 0 = переменная длина. Отрицательный размер вызывает ошибку. |
| `AddINT(fieldName)` | arg0: String | Integer или Empty | Целочисленное поле. |
| `AddINT(fieldName, statFunction)` | + arg1: String | Integer или Empty | Целочисленное поле со статистической функцией. |
| `AddFLOAT(fieldName)` | arg0: String | Integer или Empty | Вещественное поле. |
| `AddFLOAT(fieldName, statFunction)` | + arg1: String | Integer или Empty | Вещественное поле со статистической функцией. |
| `AddDATE(fieldName)` | arg0: String | Integer или Empty | Поле типа дата. |
| `AddTIME(fieldName)` | arg0: String | Integer или Empty | Поле типа время. |
| `AddDATETIME(fieldName)` | arg0: String | Integer или Empty | Поле типа дата-время. |
| `AddMONEY(fieldName)` | arg0: String | Integer или Empty | Поле типа деньги. |
| `AddMONEY(fieldName, statFunction)` | + arg1: String | Integer или Empty | Поле деньги со статистической функцией. |
| `AddINT64(fieldName)` | arg0: String | Integer или Empty | Целое 64 бита. |
| `AddINT64(fieldName, statFunction)` | + arg1: String | Integer или Empty | Целое 64 бита со статистической функцией. |
| `AddREF(fieldName, record)` | arg0: String, arg1: String/Integer | Integer или Empty | Ссылочное поле, привязанное к записи. |
| `AddVVR(fieldName)` | arg0: String | Integer или Empty | Ссылочное поле типа VVR без записи по умолчанию. |
| `AddVVR(fieldName, record)` | arg0: String, arg1: String/Integer | Integer или Empty | Ссылочное поле типа VVR с записью. |
| `AddField(dbField)` | arg0: Field БД (по ссылке) | Integer или Empty | Поле, эквивалентное указанному полю БД. |
| `AddField(dbField, statFunction)` | + arg1: String | Integer или Empty | То же со статистической функцией. |
| `AddConnectedField(dbField)` | arg0: Field БД (по ссылке) | Integer или Empty | Поле по образцу поля БД с немедленным подключением для блочной записи. |

`statFunction` — имя статистической функции (`afTYPES`), получаемое через `CEMEQuery::GetStatisticType`. По умолчанию `afNONE` (без функции).

При добавлении поля в запрос, уже содержащий строки, данные переносятся в новый запрос с пустыми значениями в новом поле. Добавление «на-лету» работает только для EME-L запросов — для именованных вызывается ошибка.

## Данные и строки

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetData()` | — | CEMEQuery (по ссылке) | Внутренний объект данных запроса. |
| `GetData(field, line)` | arg0: String/Integer, arg1: Integer | Variant | Значение поля в строке. |
| `PutData(field, line, value)` | arg0: String/Integer, arg1: Integer, arg2: Variant | Empty | Записывает значение в поле и строку. |
| `PutTextData(field, line, value)` | arg0: String/Integer, arg1: Integer, arg2: Variant | Empty | Преобразует значение в строку и записывает в текстовое поле. Поле обязано быть текстовым. |
| `Get(field)` | arg0: String/Integer | Variant | Значение поля текущей строки. |
| `Put(field, value)` | arg0: String/Integer, arg1: Variant | Empty | Записывает значение в текущую строку. |
| `GetDataAsSqlValue(field, line, syntax)` | arg0: String/Integer, arg1: Integer, arg2: String | String | Значение поля в SQL-формате. `syntax`: `"ODBC_SYNTAX"` или `"ANSI_SQL_92_SYNTAX"`. |
| `AddLine()` | — | Integer или Empty | Добавляет пустую строку; возвращает её номер. `NULL_REF`, если запрос не создан. |
| `CopyLine(sourceLine, targetLine)` | arg0: Integer, arg1: Integer | Empty | Копирует данные между строками текущего запроса. |
| `CopyLine(sourceQuery, sourceLine, targetLine)` | arg0: Query (по ссылке), arg1: Integer, arg2: Integer | Empty | Копирует строку из другого запроса по совпадению имён и типов полей. |
| `Copy(sourceQuery, startLine, endLine, createFields)` | arg0: Query, arg1..arg3 опциональны | Empty | Копирует диапазон строк из исходного запроса. По умолчанию: `startLine=0`, `endLine=-1` (до конца), `createFields=TRUE`. |
| `Merge(sourceQuery)` | arg0: Query (по ссылке) | Empty | Объединяет данные исходного запроса с текущим. Структура копируется при пустом приёмнике. |
| `DeleteAllLines()` | — | Empty | Удаляет все строки, сохраняя структуру полей. |
| `GetLineData(line)` | arg0: Integer | Byte array | Сериализованные данные строки. |
| `PutLineData(line, data)` | arg0: Integer, arg1: Byte array | Empty | Загружает данные строки из сериализованного массива. |
| `CompareQueries(oldQuery, idField, resultQuery)` | 3 аргумента Query/Field/Query | Empty | Сравнивает текущий запрос со старым по полю-идентификатору; результат — в третий запрос. |
| `CreatePatch(oldQuery, idField, patchQuery)` | 3 аргумента | Empty | Формирует запрос-патч изменений. |
| `ApplyPatch(oldQuery, idField, patchQuery)` | 3 аргумента | Empty | Применяет патч к старому запросу, восстанавливая новые данные в текущем. |

## Навигация по строкам

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetLine()` | — | Integer | Номер текущей строки. |
| `SetLine(line)` | arg0: Integer | Empty | Устанавливает текущую строку. |
| `SetFirstLine()` | — | Empty | Переходит к первой строке. |
| `SetNextLine()` | — | Empty | Переходит к следующей строке. |
| `IsValidLine()` | — | Boolean | Допустима ли текущая строка. |
| `IsValidLine(line)` | arg0: Integer | Boolean | Существует ли строка с указанным номером. |
| `NextBand(groupFields)` | arg0+: String (список) | Boolean | Переход к следующей строке группы по полям группировки. |
| `GetDBObject(field)` | arg0: String/Integer | CEMERec | Объект записи БД для ссылочного поля текущей строки. |
| `GetDBObject(field, line)` | arg0: String/Integer, arg1: Integer | CEMERec | То же для указанной строки. |

`Get` и `Put` работают с `m_lCurLine` (текущей строкой). До первого вызова `SetLine`/`SetFirstLine`/`AddLine` номер строки равен -1 — вызов `Get`/`Put` в этом состоянии вызывает `crushOnEmpty` (исключение).

`NextBand` требует, чтобы переданные поля были полями группировки, причём в правильном порядке. Первый вызов для поля возвращает первую строку группы, последующие переходят к следующей. Возврат FALSE означает конец группы. Передача поля, не входящего в группировку, или поля группировки не на своём месте вызывает `smart_error` с диагностическим сообщением.

## Сортировка и группировка

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Sort(fields)` | arg0+: String (список) или Array | Empty | Сортировка по полям. `DESC:` перед именем — по убыванию. |
| `Sort2(fields)` | arg0: String (поля через `;`) | Empty | То же, поля в одной строке через `;`. |
| `Group(fields)` | arg0+: String (список) или Array | Empty | Группировка по полям. `DESC:` поддерживается. |
| `Group2(fields)` | arg0: String (поля через `;`) | Empty | То же, поля в одной строке через `;`. |
| `FixOrder()` | — | Integer | Фиксирует текущую сортировку и возвращает её индекс. -1, если запрос не создан. |
| `GetCurrentOrder()` | — | Integer | Индекс текущей сортировки. -1, если не создан. |
| `SetCurrentOrder(orderIndex)` | arg0: Integer | Empty | Устанавливает сортировку по индексу. |
| `TrySetCurrentOrder(orderIndex)` | arg0: Integer | Boolean | То же; FALSE при неудаче. |
| `GetCurrentOrderField(index)` | arg0: Integer | Integer | Номер поля по индексу в текущей сортировке. -1 при ошибке. |
| `GetCurrentOrderFieldType(index)` | arg0: Integer | Integer | 0 — возрастание, 1 — убывание, -1 — ошибка. |
| `GetCurrentSort2()` | — | String | Текущая сортировка в формате `Sort2` (поля через `;`, с префиксом `DESC:`). |
| `GetNoOfOrderFields()` | — | Integer | Количество полей в текущей сортировке. -1, если не создан. |
| `FastFind(orderIndex, values)` | arg0: Integer (-1/Empty = текущая), arg1+ значения | Integer | Номер найденной строки. -1, если не найдена. |
| `FastFind2(result, orderIndex, values)` | arg0: ByRef Integer, arg1: Integer, arg2+ значения | Integer | То же; `result`: 0 — совпадение, 1 — строка меньше или равна, -1 — больше или равна. |
| `MarkUp(mode)` | arg0: Integer | Empty | Разметка запроса в заданном режиме. Применима только к запросам EME-L (`Object("Query")`); для именованных запросов метод игнорируется. |
| `SetTransformQuery(crossQuery)` | arg0: Query (по ссылке) | Empty | Устанавливает перекрёстный запрос. |

`Sort` и `Group` принимают либо список аргументов-строк, либо один аргумент типа `Array`. В обоих случаях `DESC:` (с двоеточием, без пробела) перед именем поля инвертирует порядок. `Sort` сбрасывает временную сортировку (`ClearOrder`) до и после выполнения — после `Sort` текущий порядок не сохраняется. `Group` не сбрасывает сортировку и не возвращает индекс; для фиксации порядка используйте `FixOrder` отдельно.

## Подключение к БД и экспорт

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `ConnectFields(dbField)` | arg0: Field БД (по ссылке) | Empty | Подключает источник по имени поля БД. |
| `ConnectFields(dbField, sourceField)` | + arg1: String/Integer | Empty | Подключает указанный источник к полю БД. |
| `ConnectAllFields(dbRecord)` | arg0: Record БД (по ссылке) | Empty | Подключает все поля-источники к записи-приёмнику. |
| `PutConnectData(line)` | arg0: Integer | Empty | Копирует подключённые данные для строки. |
| `PutAllConnectData()` | — | Empty | Копирует подключённые данные по всем строкам. |
| `DisconnectFields()` | — | Empty | Отключает источники и сбрасывает остаток данных. |
| `CreateXML(target, parentElement)` | arg0: String или HTMLDocument, arg1 опционально | Integer | XML-представление запроса. Код результата, 0 при ошибке. |
| `CreateCSV(fileName)` | arg0: String | Integer | Сохранение в CSV. |
| `CreateCSV(fileName, useLocale)` | + arg1: Boolean (по умолч. FALSE) | Integer | То же с локальными настройками. |
| `CreateCSV(fileName, useLocale, wrapText)` | + arg2: Boolean (по умолч. FALSE) | Integer | То же; `wrapText` заключает текстовые поля в кавычки. |
| `Load(bitBuffer, recordName)` | arg0: BitBuffer (по ссылке), arg1: String | Empty | Загружает данные из буфера, добавляя служебное поле со ссылками. |

## Примеры

Программное создание запроса EME-L, заполнение строк и сортировка (паттерн по мотивам `ActivistIncomingGoodsForgotten.Activity_GetDetails` и `ActivistOpenDialogTask`):

```EME-L
'Построение запроса для списка зависших размещений в памяти'
q = Object("Query");
q.Create();
q.AddTEXT(tr("Документ Приход"), 64);
q.AddTEXT(tr("Поставщик"), 64);
q.AddTEXT(tr("SSCC"), 64);
q.AddDATETIME(tr("Дата создания"));

line = q.AddLine();
q.Put(tr("Документ Приход"), "ПК-00123");
q.Put(tr("Поставщик"), "ООО Ромашка");
q.Put(tr("SSCC"), "460456789012345611");
q.Put(tr("Дата создания"), is_now());

'Сортировка по наименованию документа'
q.Sort(tr("Документ Приход"));
```

Выполнение именованного запроса проекта и передача результата в отчёт (паттерн по мотивам `ActIncomingProduction.RunReport`):

```EME-L
'Передача результата запроса в отчёт через переменную диалога'
Object("System").InitQueryCache(TRUE);
q = Object("Query", "Приход.Формы.Акт.Результат");
q.Execute();
If (q.GetNoOfLines() == 0)
    is_message(tr("Операция отменена!"),
        tr("На закладке \"Размещение\" нет строк."), 1, 3);
    Return 1;
End If

'Привязка запроса к переменной диалога отчёта'
q.PutDialogVariable("Результат");
Object("Dialog").RunReport("Акт приёмки продукции");
Object("System").ClearQueryCache();
```

Сравнение двух запросов и формирование результата (паттерн по мотивам `DataStore.CompareQueries`):

```EME-L
'Сравнение новой и старой версии данных'
ResultQuery = Object("Query");
ResultQuery.Create();

If (OldQuery.GetNoOfLines() > 0 & NewQuery.GetNoOfLines() > 0)
    'Результат — матрица различий по каждому полю'
    NewQuery.CompareQueries(OldQuery, "ID", ResultQuery);
End If
```

## См. также

- [Системные функции](/language/basics/system-functions/) — функции `is_query*` для работы с запросами без класса.
- [Класс BitBuffer](/language/classes/bitbuffer/) — использование `Load` для загрузки отмеченных строк.
- [Класс Array](/language/classes/array/) — передача массива имён полей в `Sort`/`Group`.
- [Класс DataStore](/language/classes/datastore/) — `GetQuery` выгружает сохранённые запросы в объекты `Query`.
