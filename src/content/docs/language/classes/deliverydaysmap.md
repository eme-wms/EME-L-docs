---
title: "Класс DeliveryDaysMap"
sidebar:
  order: 28
---

# Класс DeliveryDaysMap

Класс `DeliveryDaysMap` в языке EME-L — это класс-оболочка над ассоциативным массивом (картой) сроков доставки. Предоставляет доступ к данным сроков доставки в EME-L-скриптах и используется для работы с картой сроков доставки, в частности для получения количества записей.

Объект класса `DeliveryDaysMap` создаётся через `Object()` и выступает как вспомогательный контекстный объект: его создание необходимо для корректной работы ряда методов записей (например, `IsStockStatusExpired`, `GetDeliveryDays`), которые обращаются к карте сроков доставки внутри системы EME.WMS.

> Класс `DeliveryDaysMap` не предназначен для самостоятельного редактирования карты сроков доставки — это объект только для чтения, который предоставляет информацию о загруженной карте. Изменение сроков доставки выполняется через справочник сроков доставки.

## Создание объекта

```EME-L
'Создание карты сроков доставки для работы методов записей'
mapDeliveryDays = Object("DeliveryDaysMap");
```

Конструктор без аргументов создаёт объект, связанный с текущей картой сроков доставки. Конструктор с аргументами также допустим, но аргументы не обрабатываются — оба конструктора создают эквивалентный объект.

## Методы

| Метод | Аргументы | Возвращает | Описание |
|-------|-----------|------------|----------|
| `GetCount()` | — | Integer | Возвращает количество записей в карте сроков доставки. |

## Примеры

Создание объекта `DeliveryDaysMap` перед обходом строк — реальный паттерн из системы EME.WMS, где карта сроков доставки необходима для работы метода `IsStockStatusExpired` записи ячейки:

```EME-L
'Создание карты сроков доставки перед обработкой строк'
mapDeliveryDays = Object("DeliveryDaysMap");
'необходим для работы r_Cell.IsStockStatusExpired'

For (i_line = 0; i_line < Table.GetNoOfLines(); i_line = i_line + 1)
    dsLine.SetLine(Table.GetDBLine(i_line));
    If (dsLine.IsValidLine())
        'Метод IsStockStatusExpired обращается к mapDeliveryDays внутренне'
        If (dsLine.IsStockStatusExpired())
            'Строка просрочена по статусу складского учёта'
        End If
    End If
End For
```

Получение количества записей в карте сроков доставки:

```EME-L
mapDeliveryDays = Object("DeliveryDaysMap");
Count = mapDeliveryDays.GetCount();
'Count — количество записей в карте сроков доставки'
```

Карта сроков доставки в расчёте сроков доставки клиента — объект создаётся в методе `FillTables` перед вычислением сроков, чтобы метод `GetDeliveryDays` регистра мог обращаться к карте:

```EME-L
'Регистр нужен, ибо из его функции просчитывается срок доставки для клиента'
dbReg = Document.GetWarehouse().GetRegisters();
mapDeliveryDays = Object("DeliveryDaysMap");
'необходим для работы r_Reg.GetDeliveryDays'

For (i_line = 0; i_line < Table.GetNoOfLines(); i_line = i_line + 1)
    dsOrderLines.SetLine(Table.GetDBLine(i_line));
    If (dsOrderLines.IsValidLine())
        DeliveryDays = dbReg.GetDeliveryDays(lAddressRef, lVehicleRef, NULL_REF);
    End If
End For
```

## См. также

- [Справочник сроков доставки](/language/classes/deliverydaysmap/) — класс `Guide.DeliveryDays` для редактирования сроков доставки.
