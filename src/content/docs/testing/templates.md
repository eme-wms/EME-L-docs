---
title: "Шаблоны тестов"
description: "Готовые заготовки для создания новых тестов в EME-L"
sidebar:
  order: 5
---

## Шаблон юнит-теста (для объекта Json)

Создайте новый класс в пространстве имён `Tests.TestJson`:

```eme-l
Tests.TestJson.TestJson_XXX__MethodName
************************             Флаги             ************************
ДЛ: Нет
НК: Да
ВЗ: Нет
************************          Конструктор          ************************

************************             Методы            ************************
RunTest()
{
    ' Создаём тестовый объект '
    json = Object("Json", "{ \"key\": \"value\", \"num\": 42 }");

    ' Проверяем метод '
    CHECK_EQ( json.MethodName()        , expectedValue1 );
    CHECK_EQ( json.MethodName("arg")   , expectedValue2 );

    ' Проверяем крайние случаи '
    emptyJson = Object("Json", "{}");
    CHECK_EQ( emptyJson.MethodName()   , defaultValue );
}
```

**Правила именования:**
- Формат: `TestJson_XXX__MethodName`
- `XXX` — трёхзначный номер (001, 002, ...)
- `MethodName` — имя тестируемого метода
- Двойное подчёркивание `__` разделяет номер и имя

## Шаблон ERP-теста

Создайте класс в пространстве имён `ERPSolution.ERPTests` или отдельный класс:

```eme-l
ERPSolution.ERPTests
************************             Флаги             ************************
ДЛ: Нет
НК: Да
ВЗ: Нет
************************          Конструктор          ************************

************************             Методы            ************************
TestMyIntegration()
{
    ' 1. Подключаемся к внешней БД '
    ExternalDB = Object("ExternalDB");
    If (~Connect(ExternalDB))
        Return;
    End If

    ' 2. Подготавливаем данные '
    Query = Object("Query");
    Query.Create();

    ' 3. Выполняем тестируемую операцию '
    Error = ExternalDB.Execute("SELECT * FROM my_table", Query);
    If (Error != "")
        is_message("TestMyIntegration", "Error: " + Error, "OK", "STOP");
        Return;
    End If

    ' 4. Проверяем результаты '
    If (Query.GetNoOfLines() > 0)
        is_message("TestMyIntegration", "OK: " + Query.GetNoOfLines() + " rows", "OK", "INFORMATION");
    Else
        is_message("TestMyIntegration", "No data found", "OK", "EXCLAMATION");
    End If

    ' 5. Отключаемся '
    ExternalDB.Disconnect();
}
```

## Шаблон самодиагностики (healClass)

Создайте класс в пространстве имён `RobotHealer.healClasses`:

```eme-l
RobotHealer.healClasses.testMyFeature
************************             Флаги             ************************
ДЛ: Нет
НК: Нет
ВЗ: Нет
************************          Конструктор          ************************

************************             Методы            ************************

/* Возвращает название тестируемой функции */
describe()
{
    return tr("Проверка моей фичи");
}

/* Выполняет тест и возвращает оценку 1–10 */
test()
{
    rating = 10;

    ' Проверяем условие '
    r_Record = Object("dsDB", "MyRecord");
    r_Record.SetSkipMode();
    If (r_Record.GetNoOfLines() == 0)
        rating = 1;  ' Проблема: нет данных '
    End If

    Return rating;
}

/* Выполняет исправление проблем */
heal()
{
    strResult = "";

    is_transaction(1, tr("Исправление моей фичи"));

    ' Выполняем исправляющий код '
    strResult = strResult + tr("Исправление выполнено");

    is_transaction(-1);

    Return strResult;
}
```

## Шаблон SQL-теста (запрос)

Создайте файл в директории `Запросы/`:

```sql
Tests.MySqlTest
************************             Флаги             ************************
ДЛ: Нет
НК: Да
ВЗ: Нет
************************          Конструктор          ************************

************************             Методы            ************************
RunTest()
{
    Select (Query)
        SELECT
            [Поле],
            COUNT(*) AS [Количество]
        FROM
            [Таблица]
        GROUP BY
            [Поле]
        HAVING
            {is_query(,"Количество") > 1}
    End Select

    If (Query.GetNoOfLines() > 0)
        is_message("MySqlTest", "Найдено дубликатов: " + Query.GetNoOfLines(), "OK", "EXCLAMATION");
    Else
        is_message("MySqlTest", "Дубликатов не найдено", "OK", "INFORMATION");
    End If
}
```

## Шаблон теста с использованием `dsDB`

```eme-l
Tests.TestMyRecord
************************             Флаги             ************************
ДЛ: Нет
НК: Да
ВЗ: Нет
************************          Конструктор          ************************
r_Record = Object("dsDB", "MyRecord");

************************             Методы            ************************
TestFindLine()
{
    ' Настраиваем фильтр '
    r_Record.SetSkipMode();
    r_Record.GetCodeFld().MustBeEQ("TEST001");
    r_Record.SetFirstLine();

    ' Проверяем результат '
    If (r_Record.IsValidLine())
        is_message("TestFindLine", "Найдена строка: " + r_Record.GetCode(), "OK", "INFORMATION");
    Else
        is_message("TestFindLine", "Строка не найдена", "OK", "STOP");
    End If
}

TestUpdate()
{
    r_Record.SetLineByCode("TEST001");
    If (r_Record.IsValidLine())
        is_transaction(1);
        r_Record.PutName("Новое название");
        is_transaction(-1);
        is_message("TestUpdate", "Обновлено", "OK", "INFORMATION");
    End If
}
```

## Контрольный список при создании теста

### Юнит-тест
- [ ] Класс в правильном пространстве имён (`Tests.TestJson.*`)
- [ ] Метод `RunTest()` переопределён
- [ ] Используется `CHECK_EQ` для проверок
- [ ] Проверены крайние случаи (пустые значения, границы)
- [ ] Тест добавлен в раннер (если нужно)

### ERP-тест
- [ ] Проверка подключения перед операциями
- [ ] Корректное отключение (`Disconnect()`)
- [ ] Обработка ошибок через `is_message`
- [ ] Транзакции оформлены правильно
- [ ] Нет захардкоженных паролей в коммите

### Самодиагностика
- [ ] Реализованы три метода: `describe()`, `test()`, `heal()`
- [ ] `test()` возвращает оценку 1–10
- [ ] `heal()` использует транзакцию
- [ ] Есть описание проблемы в `tr()`

## Полезные объекты для тестов

| Объект | Создание | Назначение |
|--------|----------|------------|
| `Console` | `Object("Console")` | Вывод текста в консоль |
| `Json` | `Object("Json", строка)` | Работа с JSON |
| `PropertyTree` | `Object("PropertyTree")` | Древовидная структура данных |
| `Query` | `Object("Query")` | SQL-запросы |
| `dsDB` | `Object("dsDB", "ИмяЗаписи")` | Записи базы данных |
| `ExternalDB` | `Object("ExternalDB")` | Подключение к внешней БД |
| `Array` | `Object("Array")` | Динамический массив |
| `Map` | `Object("Map")` | Ассоциативный массив |
| `System` | `Object("System")` | Системные функции |
| `File` | `Object("File", путь)` | Работа с файлами |
| `Automation` | `Object("Automation", ProgID)` | COM-автоматизация |
| `IClass` | `Object("IClass", имя, имя)` | Динамический вызов класса |
