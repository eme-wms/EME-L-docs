---
title: "Класс ChunkContainer"
sidebar:
  order: 14
---

# Класс ChunkContainer

Класс `ChunkContainer` в языке EME-L — это контейнер для работы с Chunk-объектами (`ObjectChunk`, `PropChunk`), импортируемыми напрямую из ядра. Контейнер сохраняется в полях типа `CDataStorage` и используется для хранения структурированных данных модели (например, параметров склада, спецификаций документа) вне явных полей записи.

Объект класса `ChunkContainer` создаётся через `Object()` и не привязан к контексту диалога или браузера — это самостоятельный класс для управления набором Chunk-объектов. Сохранение и загрузка контейнера возможны как через объект `CDataStorage`, так и напрямую из поля базы данных по записи/полю/строке.

## Создание объекта

```EME-L
objChunk = Object("ChunkContainer");
```

Конструктор без аргументов создаёт пустой контейнер. Chunk-объекты добавляются методом `AddChunk`, а загрузка предварительно сохранённого контейнера выполняется методами `Load`.

## Управление содержимым

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Clear()` | — | Empty | Очищает контейнер, удаляя все Chunk-объекты из внутреннего хранилища. |
| `AddChunk()` | — | CObjectChunk (ссылка) | Создаёт новый объектный чанк (`CObjectChunk`) и добавляет его в контейнер. Возвращает ссылку на созданный объект. |
| `RemoveChunk(chunk)` | chunk: CObjectChunk (ссылка) | Integer | Удаляет указанный объектный чанк. 1 — объект успешно удалён, 0 — удаление не выполнено. |

## Перебор Chunk-объектов

Методы `GetFirstChunk` и `GetNextChunk` совместно используют внутренний итератор контейнера. После вызова `GetFirstChunk` итератор устанавливается на начало коллекции; последующие вызовы `GetNextChunk` продвигают его вперёд. При достижении конца коллекции возвращается `NULL`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetFirstChunk()` | — | CObjectChunk (ссылка) или NULL | Первый объектный чанк; устанавливает итератор на начало. NULL — контейнер пуст. |
| `GetNextChunk()` | — | CObjectChunk (ссылка) или NULL | Следующий объектный чанк, продвигая итератор. NULL — достигнут конец коллекции. |

## Загрузка и сохранение

Для загрузки и сохранения предусмотрены перегруженные формы: работа напрямую с базой (по записи, полю и строке) и работа через объект `CDataStorage`. Внутренне форма `Load(storage)` используется формой `Load(record, field, line)` после чтения поля в `CDataStorage`; аналогично для `Save`.

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `Load(record, field, line)` | record: String, field: String, line: Integer | Boolean | Загружает контейнер из поля БД по указанной записи, полю и строке. TRUE — успех, FALSE — ошибка. |
| `Load(storage)` | storage: CDataStorage (ссылка) | Boolean | Загружает контейнер из объекта `CDataStorage`, содержащего сериализованные данные. TRUE — успех, FALSE — ошибка. |
| `Save(record, field, line)` | record: String, field: String, line: Integer | Boolean | Сохраняет контейнер в поле БД по указанной записи, полю и строке. TRUE — успех, FALSE — ошибка. |

> Метода `Save(storage)` в классе не зарегистрировано — сохранение в `CDataStorage` выполняется внутренней реализацией `Save(record, field, line)` и недоступно из EME-L напрямую.

## Примеры

Создание контейнера, наполнение и сохранение в поле записи (синтезированный пример):

```EME-L
objChunk = Object("ChunkContainer");
objDataChunk = objChunk.AddChunk();
objChunk.Save("Warehouse", "ModelOptions", wareRef);
```

Реальный пример — чтение параметров модели склада из поля `ModelOptions` записи `Warehouse` с последующим перебором ObjectChunk-веток (`CommonWrhOptions`, `Sectors`), синтаксис EME-L адаптирован из класса `Visualisation3D`:

```EME-L
dbWare = Object("dsDB", "Warehouse");
dbWare.SetLine(wareRef);
Chunk = Object("ChunkContainer");
Chunk.Load(dbWare.GetModelOptions());
If (Chunk == NULL)
    Return;
End If

objChunk = Chunk.GetFirstChunk();
If (objChunk == NULL)
    Return;
End If

secChunk = objChunk.GetFirstObject();
While (secChunk != NULL)
    Prop = secChunk.GetFirstProperty();
    For (Prop = secChunk.GetFirstProperty(); Prop != NULL; Prop = secChunk.GetNextProperty())
        pName = Prop.GetName();
        pData = Prop.GetData();
    End For
    secChunk = objChunk.GetNextObject();
End While
```

## См. также

- [Класс Archive](./archive.md) — бинарная сериализация объектов в Base64; `Archive.PutRPC` принимает `DataStorage` того же формата, который используется для `Load(storage)`/`Save(record, field, line)`.
