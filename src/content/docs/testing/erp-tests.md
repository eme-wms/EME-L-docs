---
title: "ERP-тесты"
description: "Интеграционные и нагрузочные тесты обмена данными между WMS и ERP-системой"
sidebar:
  order: 3
---

## Что такое ERP-тесты

**ERP-тесты** — это интеграционные тесты подсистемы обмена данными между WMS и внешней ERP-системой (1С, SAP, учётные системы заказчика). Они собраны в классе `ERPSolution.ERPTests` (`ERPTests.txt`).

В отличие от юнит-тестов, ERP-тесты:
- Требуют подключения к внешней базе данных через ODBC
- Проверяют канал связи, форматы сообщений и движок обмена
- Запускаются вручную (кнопкой) разработчиком
- Не используют классические `assert` — результат проверяется визуально или через логи

## Цели ERP-тестов

1. **Проверить канал связи** — подключение к внешней БД через ODBC (`ExternalDB`), скорость запросов
2. **Проверить движок обмена** — C#-компонент `EME.ERPEngine` (создание сообщений `goods`, `orders`, `clients`, `asn`, `receipt`, `change`, `quality_change`)
3. **Проверить форматы** — корректность выгрузки/загрузки в JSON и XML через `PropertyTree` + `IDoc`
4. **Проверить маппинг полей** — что все поля, используемые в обработчиках `ERP*Component`, зарегистрированы и не противоречат друг другу (`TestOnErrors`)
5. **Проверить импорт плоских файлов** — загрузка номенклатуры из CSV/TXT через `EMEQueryTextFile`

## Структура ERP-тестов

### Основной класс: `ERPSolution.ERPTests`

Файл: `ERPTests.txt`

```eme-l
ERPSolution.ERPTests
************************             Флаги             ************************
ДЛ: Нет
НК: Да
ВЗ: Нет
************************          Конструктор          ************************

************************             Методы            ************************
```

### Подключение к внешней БД

```eme-l
Connect(ExternalDB As "ExternalDB")
{
    'Error = ExternalDB.Connect(
        "ODBC:Driver={PostgreSQL ODBC Driver(ANSI)};Server=localhost;Port=5432;Database=WMS_ERP;Uid=postgres;Pwd=123;");'
    'Error = ExternalDB.Connect(
        "ODBC:Driver={SQL Server};Server=AMP-NOTEBOOK\\SQL2005;Database=WMS_KINEL;Uid=sa;Pwd=123;");'
    'Error = ExternalDB.Connect(
        "ODBC:DSN=WMS_YONA;Uid=system;Pwd=123;");'
    Error = ExternalDB.Connect(
        "ODBC:driver={EME DB};server=amp-syktyvkar;port=80;uid=amp;pwd=bnfl;");
    If (Error != "")
        is_message(
            "ExternalDBTest",
            tr("Не удалось подключить клиента к внешней базе данных:\n\n") + Error, "OK", "STOP");
        Return FALSE;
    End If

    Return TRUE;
}
```

**Поддерживаемые СУБД:** PostgreSQL, SQL Server, EME DB.

### Создание таблиц во внешней БД

```eme-l
Test()
{
    System = Object("System");
    ExternalDB = Object("ExternalDB");

    If (~Connect(ExternalDB))
        Return;
    End If

    LinesPrimaryKeys = Object("Array");
    LinesPrimaryKeys.Add("id");
    LinesPrimaryKeys.Add("header_id");

    i_ERPGoodsComponent = Object("IClass", "ERPGoodsComponentObject", "ERPGoodsComponent");
    HeaderQuery = Object("Query");
    MuLinesQuery = Object("Query");
    BarCodesQuery = Object("Query");
    HeaderQuery.Create();
    MuLinesQuery.Create();
    BarCodesQuery.Create();
    i_ERPGoodsComponent.ERPMarkup(HeaderQuery, MuLinesQuery, BarCodesQuery);

    Execute(ExternalDB, "DROP TABLE \"erp_goods_header\"", );
    Execute(ExternalDB, "DROP TABLE \"erp_goods_mu_lines\"", );
    Execute(ExternalDB, "DROP TABLE \"erp_goods_bar_codes\"", );
    CreateTable(ExternalDB, "erp_goods_header", HeaderQuery, "id");
    CreateTable(ExternalDB, "erp_goods_mu_lines", MuLinesQuery, LinesPrimaryKeys);
    CreateTable(ExternalDB, "erp_goods_bar_codes", BarCodesQuery, LinesPrimaryKeys);

    ' ... экспорт данных ... '

    UpdateTable(ExternalDB, "erp_goods_header", HeaderQuery);
    UpdateTable(ExternalDB, "erp_goods_mu_lines", MuLinesQuery);
    UpdateTable(ExternalDB, "erp_goods_bar_codes", BarCodesQuery);

    ExternalDB.Disconnect();

    is_message("ERPInterface::Test", "Ok", "OK", "INFORMATION");
}
```

### Тест движка `EME.ERPEngine` (C#)

```eme-l
TestERPEngineSharp()
{
    erp = Object("Automation", "EME.ERPEngine");
    Timeout = erp.GetQueryTimeout();
    erp.SetQueryTimeout(60);

    Error = erp.Connect();
    If (Error != "")
        is_message("TestERPEngineSharp", tr("Ошибка при запуске движка:\n") + Error, "OK", "STOP");
        Return;
    End If

    erp.BeginExport("erp", "wms", "goods");

    erp.AppendHeaderLine();
    erp.PutHeaderData("id", "12222258");
    erp.PutHeaderData("article", "12222258");
    erp.PutHeaderData("name", "РОССИЙСКИЙ Шоколад Горький70% 27(5х90г)");
    ' ... ещё поля ... '

    erp.SelectChild("packs");

    erp.AppendChildLine();
    erp.PutChildData("id", "Штука");
    erp.PutChildData("mu_code", "EA");
    erp.PutChildData("factor", 1);
    ' ... ещё строки ... '

    Error = erp.CommitExport();
    If (Error != "")
        erp.Disconnect();
        is_message("TestERPEngineSharp", tr("Ошибка при экспорте сообщения:\n") + Error, "OK", "STOP");
        Return;
    End If

    erp.Disconnect();

    is_message("TestERPEngineSharp", tr("Тест завершен!"), "OK", "INFORMATION");
}
```

**Паттерн работы с `ERPEngine`:**
1. `Connect()` — подключение к движку
2. `BeginExport(источник, назначение, тип_сообщения)` — начало экспорта
3. `AppendHeaderLine()` + `PutHeaderData(...)` — заполнение заголовка
4. `SelectChild("имя_дочерней_таблицы")` + `AppendChildLine()` + `PutChildData(...)` — заполнение строк
5. `CommitExport()` — фиксация сообщения
6. `Disconnect()` — отключение

### Формирование сообщений разных типов

| Метод | Тип сообщения | Назначение |
|-------|---------------|------------|
| `CreateQualityChangeMessage()` | `quality_change` | Изменение качества товара |
| `CreateChangeMessage()` | `change` | Смена статуса/аналитики |
| `CreateClientsMessage()` | `clients` | Клиенты и адреса доставки |
| `CreateOrdersMessage()` | `orders` | Заказы |

### Импорт сообщений

```eme-l
TestImportReceipts()
{
    ERPEngine = Object("Automation", "EME.ERPEngine");

    Error = ERPEngine.Connect();
    If (Error != "")
        is_message("", Error);
        Return;
    End If

    ERPEngine.BeginImport("wms", "erp", "receipt");
    Try (Error)
        is_transaction(1, tr("Тест импорта уведомлений о приемке"));
        Try (Error)
            While (ERPEngine.NextHeaderLine())
                Id = ERPEngine.GetHeaderData("id");

                'Проверки на первом проходе'
                Switch (is_random(4))
                Case 0:
                    ERPEngine.ErrorHeader("TSTBAD");
                Case 1:
                    ERPEngine.WarningHeader("DCMNTBAD");
                Case 2:
                    ERPEngine.Success();
                Default:
                End Switch

                ERPEngine.SelectChild("lines");
                While (ERPEngine.NextChildLine())
                    GoodsCode = ERPEngine.GetChildData("goods_code");
                End While
            End While

            is_transaction(-1);
        Catch
        If (~is_empty(Error))
            is_transaction(0);
            is_error(1, Error);
        End If
        ERPEngine.CommitImport();
    Catch
    If (~is_empty(Error))
        ERPEngine.RollbackImport();
        is_message("", Error);
    End If

    ERPEngine.Disconnect();
}
```

### Работа с JSON и XML

```eme-l
' Выгрузка в JSON через PropertyTree + IDoc
TestJsonUpload()
{
    Json = Object("PropertyTree");
    IDoc = Object("IDoc", "TestJSON", Json);

    Message = IDoc.AddERPMessage();
    Header = Message.AddHeaderEdit();

    Prices = Header.AddPrices();
    Prices.Put(3.14);

    Header.PutDocDate(is_dos_date());
    Header.PutDocTime(is_dos_time());

    Lines = Header.AddLines();
    Lines.PutId(1);
    Lines.PutHeaderId(2);

    File = Object("File", "E:\\Json\\Test.json");
    File.CreateFile();
    File.PutEndFileData(Json.GetJSON());
}

' Загрузка из JSON
TestJsonLoad()
{
    File = Object("File", "E:\\Json\\Test.json");
    Json = Object("PropertyTree");
    Json.PutJSON(File.GetData().AsString());
    IDoc = Object("IDoc", "TestJSON", Json);
    IsERPMessage = IDoc.TuneERPMessage();
    Message = IDoc.GetERPMessage();
    Header = Message.GetHeaderEdit();

    IsDocDate = Header.TuneDocDate();
    DocDate = Header.GetDocDate();

    Lines = Header.GetLines();
    Loop (Lines)
        Id = Lines.GetId();
        HeaderId = Lines.GetHeaderId();
    End Loop
}
```

## ERP-стресс-тесты

Класс `ERPSolution.ERPStressTest` (`ERPStressTest.txt`) — расширение ERP-тестов для массовой выгрузки:

- `UploadErpWmsMessages()` — 16 пунктов меню для массовой выгрузки ERP→WMS
- `UploadWmsErpMessages()` — 16 пунктов меню для массовой выгрузки WMS→ERP
- `VerifyMessages()` — 13 верификаторов по каждому типу сообщений

## Связанные классы

| Класс | Назначение |
|-------|------------|
| `XsdSchemas.XsdTestCDATA` | Тестовый XSD-обработчик формата `CDATA` |
| `XsdSchemas.XsdTestDateTime` | Тестовый формат даты-времени |
| `PortalsAPI.DIADOC.DIADOCTestRequests` | Запросы к API Диадок |
| `EANCOM.EANCOMTest` | Тест экспортного EANCOM-сообщения |
| `PortalsAPI.VET.VETDialog.VETTest` | Тест кнопки ВЕТИС |
| `Utilities.ExportToTHQ.TestExportToTHQ` | Выгрузка в ЦУП |
| `AAATrash.OneC.TestOrderFrom1C` | Заказ из 1С через COM |
