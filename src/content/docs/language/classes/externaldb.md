---
title: "Класс ExternalDB"
sidebar:
  order: 37
---

# Класс ExternalDB

Класс `ExternalDB` в языке EME-L обеспечивает подключение к внешним базам данных и выполнение SQL-запросов через драйверы ODBC и .NET (а также PSQL/PostgreSQL при условной компиляции с включённым `POSTGRESQL_IS_AVAILABLE`). Предоставляет методы для выполнения запросов, создания и изменения структуры таблиц, вставки и обновления строк, массового копирования данных, управления транзакциями, перечисления таблиц и колонок, а также получения метаданных СУБД.

Объект класса `ExternalDB` создаётся через `Object()` и не привязан к контексту диалога или браузера — это самостоятельный клиент внешней БД. Подключение не выполняется в конструкторе: для установки соединения необходимо вызвать метод `Connect`, передав строку подключения с префиксом типа драйвера.

## Создание объекта

```EME-L
objExternalDB = Object("ExternalDB");
```

Конструктор без аргументов создаёт неподключённый объект клиента. После создания необходимо вызвать `Connect` с строкой подключения формата `"<ТИП>:<параметры>"` (например, `"ODBC:Dsn=...;Uid=...;Pwd=...;"`).

## Подключение и проверка состояния

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Connect(arg0)` | arg0: String | String | Устанавливает соединение по строке подключения. Формат: `"<ТИП>:<параметры>"`. Поддерживаемые типы: `"ODBC"`, `".NET"` (требуется MetC_CLR.dll), `"PSQL"` (PostgreSQL, доступен при включённой условной компиляции `POSTGRESQL_IS_AVAILABLE`). Типы `"OLEDB"` и `"QT"` не поддерживаются и возвращают ошибку. Пустая строка — успех, иначе текст ошибки. Если клиент уже подключен — ошибка. При ошибке подключения освобождает созданный драйвер. |
| `Disconnect()` | — | String | Разрывает соединение и освобождает драйвер. Если клиент не подключен — ошибка. Пустая строка — успех, иначе текст ошибки. |
| `IsConnected()` | — | Boolean | TRUE — активное соединение установлено, иначе FALSE. |

## Выполнение запросов

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Execute(arg0, arg1)` | arg0: String или String-объект (SQL), arg1: Query (по ссылке) | String | Выполняет SQL-запрос и помещает результат в объект Query. Пустая строка — успех, иначе текст ошибки. |
| `Execute(arg0, arg1, arg2)` | arg0: SQL, arg1: Query, arg2: String (алиасы) | String | То же с переименованием колонок SQL в поля Query. Формат `arg2`: `"<ИмяКолонки1>=<ИмяПоля1>\n<ИмяКолонки2>=<ИмяПоля2>\n..."`. Позволяет заполнить существующий Query с полями данными с сервера. |
| `ExecuteWithTopLimit(arg0, arg1, arg2)` | arg0: SQL, arg1: Query, arg2: Integer (лимит строк) | String | Выполняет SQL-запрос с ограничением максимального числа возвращаемых строк. Пустая строка — успех, иначе текст ошибки. |
| `GetRowCount()` | — | Integer | Количество строк, затронутых последней инструкцией UPDATE, INSERT или DELETE. |

## Создание и изменение структуры таблиц

Метод `CreateTable` создаёт новую таблицу во внешней БД на основе структуры полей объекта Query. Методы `AddColumns` и `AlterColumns` соответственно добавляют и изменяют колонки существующей таблицы. Методы `PrepareCreateTableScript` формируют SQL-скрипт `CREATE TABLE` без выполнения.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `CreateTable(arg0, arg1)` | arg0: String (имя таблицы), arg1: Query | String | Создаёт таблицу по шаблону полей Query. Пустая строка — успех, иначе текст ошибки. |
| `CreateTable(arg0, arg1, arg2)` | arg0: String, arg1: Query, arg2: String или Array (первичный ключ) | String | То же с указанием первичного ключа. arg2 — имя одной колонки (строка) или массив имён для составного ключа. |
| `PrepareCreateTableScript(arg0, arg1, arg2)` | arg0: String (по ссылке), arg1: String (таблица), arg2: Query | String | Формирует SQL-скрипт CREATE TABLE и добавляет его в объект String. Скрипт не выполняется. |
| `PrepareCreateTableScript(arg0, arg1, arg2, arg3)` | arg0: String, arg1: String, arg2: Query, arg3: String или Array (первичный ключ) | String | То же с указанием первичного ключа. |
| `AddColumns(arg0, arg1)` | arg0: String (таблица), arg1: Query | String | Добавляет новые колонки в существующую таблицу по шаблону полей Query. |
| `AlterColumns(arg0, arg1)` | arg0: String (таблица), arg1: Query | String | Изменяет структуру существующих колонок по шаблону полей Query. |

## Вставка строк

Методы `InsertLine` и `InsertLines` вставляют строки из объекта Query в таблицу внешней БД. Методы `PrepareInsertLineScript` и `PrepareInsertLinesScript` формируют SQL-скрипты INSERT без выполнения.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `InsertLine(arg0, arg1, arg2)` | arg0: String (таблица), arg1: Query, arg2: Integer (индекс строки, 0-based) | String | Вставляет одну строку Query в таблицу. |
| `InsertLines(arg0, arg1, arg2)` | arg0: String, arg1: Query, arg2: Array (индексы строк) | String | Вставляет указанные строки Query в таблицу. |
| `InsertLines(arg0, arg1)` | arg0: String, arg1: Query | String | Вставляет все строки Query в таблицу. |
| `PrepareInsertLineScript(arg0, arg1, arg2, arg3)` | arg0: String (по ссылке), arg1: String (таблица), arg2: Query, arg3: Integer (индекс строки) | String | Формирует SQL-скрипт INSERT для одной строки и добавляет его в объект String. |
| `PrepareInsertLinesScript(arg0, arg1, arg2, arg3)` | arg0: String, arg1: String, arg2: Query, arg3: Array (индексы строк) | String | Формирует SQL-скрипт INSERT для указанных строк и добавляет его в объект String. |
| `PrepareInsertLinesScript(arg0, arg1, arg2)` | arg0: String, arg1: String, arg2: Query | String | Формирует SQL-скрипт INSERT для всех строк Query и добавляет его в объект String. |

## Обновление строк

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `UpdateLine(arg0, arg1, arg2, arg3)` | arg0: String (таблица), arg1: Query, arg2: Integer (индекс строки), arg3: String или Array (ключевые колонки) | String | Обновляет одну строку в таблице данными из Query. Поиск строки выполняется по ключевым колонкам arg3 (имя одной колонки или массив имён). |
| `PrepareUpdateLineScript(arg0, arg1, arg2, arg3, arg4)` | arg0: String (по ссылке), arg1: String (таблица), arg2: Query, arg3: Integer (индекс строки), arg4: String или Array (ключевые колонки) | String | Формирует SQL-скрипт UPDATE для одной строки и добавляет его в объект String. |

## Массовое копирование

Метод `BulkCopy` выполняет массовое копирование данных из объекта Query в таблицу внешней БД. Для ODBC-драйвера требуется настройка директории для CSV-файлов (модули — Предпочтения — Репликация — Директория csv-файлов); директория должна быть доступна и клиенту, и серверу СУБД. По умолчанию используется `C:\Users\Public`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `BulkCopy(arg0, arg1)` | arg0: String (таблица), arg1: Query | String | Копирует все данные из Query в таблицу внешней БД. |
| `BulkCopy(arg0, arg1, arg2)` | arg0: String, arg1: Query, arg2: Array (имена полей) | String | Копирует указанные колонки из Query в таблицу внешней БД. |

## Перечисление таблиц и колонок

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `EnumTables(arg0)` | arg0: Query (по ссылке) | String | Заполняет Query списком таблиц внешней БД. Структура результата: `TABLE_NAME : TEXT[64]` — имя таблицы; `TABLE_TYPE : TEXT[16]` — тип (`"TABLE"`, `"VIEW"`, `"SYSTEM TABLE"`). |
| `EnumColumns(arg0, arg1)` | arg0: String (таблица), arg1: Query (по ссылке) | String | Заполняет Query списком колонок указанной таблицы. Структура результата: `COLUMN_NAME : TEXT[64]` — имя колонки; `COLUMN_TYPE : TEXT[32]` — тип (`"varchar(N)"`, `"integer"`, `"float"`, `"date"`, `"time"`, `"datetime"`). |

## Транзакции

Все методы транзакций требуют активного подключения. Уровни изоляции передаются строкой: `"READ_UNCOMMITTED"`, `"READ_COMMITTED"`, `"REPEATABLE_READ"`, `"SERIALIZABLE"`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `BeginTransaction(arg0)` | arg0: String (уровень изоляции) | String | Начинает новую транзакцию с указанным уровнем изоляции. |
| `CommitTransaction()` | — | String | Фиксирует текущую транзакцию. |
| `RollbackTransaction()` | — | String | Отменяет текущую транзакцию. |
| `IsAutoCommit()` | — | Boolean | TRUE — СУБД в режиме auto-commit (каждая команда фиксируется автоматически), иначе FALSE. |
| `GetIsolationLevel()` | — | String | Текущий уровень изоляции транзакций. Пустое значение, если уровень неизвестен. |
| `SetIsolationLevel(arg0)` | arg0: String (уровень изоляции) | String | Устанавливает уровень изоляции для соединения. |

## Параметры выполнения

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetInsertBatchSize()` | — | Integer | Размер пакета команд INSERT при массовой вставке `InsertLines`. |
| `SetInsertBatchSize(arg0)` | arg0: Integer | Empty | Устанавливает размер пакета команд INSERT. |
| `GetQueryTimeout()` | — | Integer | Текущий таймаут выполнения запроса в секундах. |
| `SetQueryTimeout(arg0)` | arg0: Integer (секунды) | Empty | Устанавливает таймаут выполнения запроса. |

## Метаданные СУБД

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetDBMSName()` | — | String | Наименование СУБД внешней базы данных. |
| `GetDBMSVersion()` | — | String | Версия СУБД внешней базы данных. |

## Примеры

Подключение к внешней БД через ODBC и выполнение SELECT-запроса в объект Query:

```EME-L
objExternalDB = Object("ExternalDB");
Error = objExternalDB.Connect("ODBC:Dsn=MyDsn;Uid=user;Pwd=pass;");
If (Error != "")
    is_message(tr("Ошибка"), Error, "OK", "STOP");
    Return;
End If

Query = Object("Query");
Query.Create();
Error = objExternalDB.Execute("select * from Customers", Query);
If (Error == "")
    'перебор строк результата через Loop'
    Loop (Query)
        Name = Query.GetName();
    End Loop
End If

objExternalDB.Disconnect();
```

Выполнение SQL-запроса без возврата данных (обновление внешней таблицы):

```EME-L
objExternalDB = Object("ExternalDB");
objExternalDB.Connect("ODBC:Dsn=incity;Uid=ExTest;Pwd=ExTest99;");
resultQuery = Object("Query");
objExternalDB.Execute("update IFC_ExchangeQueueImport set eqi_TypeID = 1 where eqi_ID = 845428", resultQuery);
objExternalDB.Disconnect();
```

Передача объекта `ExternalDB` во вспомогательные функции через `AsExternal` — для повторного использования подключения:

```EME-L
'передать ExternalDB как внешний объект в функцию Connect и Execute'
Connect(ExternalDB AS "ExternalDB")
{
    Error = ExternalDB.Connect(
        "ODBC:Dsn=" + dsDIALOG.GetName() + ";Uid=" + dsDIALOG.GetLogin() + ";Pwd=" + dsDIALOG.GetPassword() + ";");
    If (Error != "")
        is_message(tr("ВНИМАНИЕ!!!"), tr("Не удалось подключиться:\n\n") + Error, "OK", "STOP");
        Return FALSE;
    End If
    Return TRUE;
}
```

Перечисление таблиц внешней БД:

```EME-L
objExternalDB = Object("ExternalDB");
objExternalDB.Connect("ODBC:Dsn=MyDsn;Uid=user;Pwd=pass;");
TablesQuery = Object("Query");
TablesQuery.Create();
objExternalDB.EnumTables(TablesQuery);
Loop (TablesQuery)
    TableName = TablesQuery.GetData("TABLE_NAME");
    TableType = TablesQuery.GetData("TABLE_TYPE");
End Loop
objExternalDB.Disconnect();
```

## См. также

- [Класс Query](/language/advanced/api-and-patterns/) — объект Query, в который `Execute` помещает результаты SQL-запроса.
- [Класс String](/language/advanced/api-and-patterns/) — объект String, в который методы `Prepare*Script` добавляют сформированный SQL-текст.
- [Класс Array](/language/advanced/api-and-patterns/) — массив индексов строк для `InsertLines` и массив имён колонок для `BulkCopy`.
