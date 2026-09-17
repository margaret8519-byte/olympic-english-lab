# Аудит официальных материалов «Взлёт» — муниципальный этап, английский язык

Цель: отделить официальный банк ВсОШ Московской области от авторского тренировочного банка OLYMPIC ENGLISH LAB и включать автопроверку только там, где задание и ключ подтверждены источником.

Главный архив: https://olympmo.ru/tasks-vsoh.html

## Статус по годам

| Учебный год | Официальная группировка | Статус в приложении |
| --- | --- | --- |
| 2019/2020 | 7–8; 9–11 | официальный Writing импортирован для обеих групп; objective и Listening ещё не импортированы |
| 2020/2021 | 7–8; 9–11 | официальный Writing импортирован для обеих групп; objective и Listening ещё не импортированы |
| 2021/2022 | 7–8, 9, 10, 11 | Writing и objective ещё требуют поэтапного импорта и сверки |
| 2022/2023 | 7–8, 9, 10, 11 | основной objective-банк восстановлен; остаются Listening 9 и финальная сверка 7–8 |
| 2023/2024 | 7–8, 9, 10, 11 | 9 objective готов; 10 Reading/UOE готов; 11 и Listening требуют доводки |
| 2024/2025 | 7–8, 9–10, 11 | общий 9–10 Reading/UOE/Writing подключён и в standalone, и в Full Olympiad; 11 objective keys подтверждены, но сокращённый Reading честно помечен как адаптированный; Listening 2024 не SAFE |
| 2025/2026 | 7–8, 9–10, 11 | структура и официальные источники зафиксированы; Writing импортирован; objective с автопроверкой ждёт разбора официальных ZIP-ключей |

## 2019/2020

Официальная группировка: один вариант 7–8 классов и один общий вариант 9–11 классов.

- Writing 7–8: advice email с выбором между поездкой в США и лондонской программой, 120–160 слов; manual review.
- Writing 9–11: общий story, 220–250 слов, обязательное начало, заданная лексика и идиомы, direct/indirect speech и emotional ending; в приложении представлены grade-specific wrappers с одинаковым официальным содержанием.
- Файл: `data/questions/writing-official-2019.ts`.
- В selector Writing официальный источник и учебный год показываются явно.
- Objective/Listening пока не импортированы: для них сначала нужны точные task + key и, для Listening, script + audio.

## 2020/2021

Официальная группировка: один вариант 7–8 классов и один общий вариант 9–11 классов.

- Writing 7–8: story `An Unforgettable Adventure`, 150–210 слов, обязательная структура scene → incident/main event → ending/reaction; manual review.
- Writing 9–11: общий article `A Special Photograph!`, 220–250 слов, headline, заданные слова/выражения, 2 idioms, direct/indirect speech, feelings/emotions и impressive ending; manual review.
- Файл: `data/questions/writing-official-2020.ts`.
- Официальные варианты отображаются отдельно от авторских тренировок.
- Objective/Listening пока не импортированы. Ключи 7–8 для objective найдены в официальном архиве, но passages и задания нельзя объявлять импортированными, пока они не перенесены целиком и не проверены.

## 2022/2023

### 7–8
- Listening, Reading, Use of English и Writing импортированы.
- Нужна финальная построчная сверка перед статусом «полностью проверено».

### 9
- Reading: 20 заданий, ключ восстановлен.
- Use of English: 40 заданий, ключ восстановлен.
- Listening: ключ восстановлен, но вариант пока не включён в SAFE playback.
- Writing: manual review.

### 10–11
- Официальный Listening 2022 подключён с исходным MP3.
- Reading: по 20 заданий, ключи восстановлены.
- Use of English: по 40 заданий; проблемный блок 11–20 исправлен по исходному варианту.
- Writing: manual review.

## 2023/2024

Официальная страница: https://reg.olympmo.ru/olymp-stage/tasks-vos-mun-2023

### 9
- Listening: 20 заданий с проверенным ключом, но не SAFE до строгой проверки MP3 → script → key.
- Reading: 20 заданий, ключи подключены.
- Use of English: 20 заданий, ключи подключены.
- Writing: story `When Max opened the letter...`, 220–250 слов, manual review.

### 10
- Reading: 20 заданий (`Belukha` + `Extreme sports`).
- Use of English: 20 заданий.
- Writing: story `When Max opened the letter...`, manual review.
- Listening: исходники есть, SAFE ещё не подтверждён.

### 11
- Исходные задания, скрипт и MP3 сохранены в `source_materials/grade-11/2023/`.
- Отдельная сверка: `docs/vzlet-2023-grade11-verification.md`.
- Verified official bank ещё не завершён: ключ нельзя объявлять официальным, пока ZIP ответов не разобран.

## 2024/2025

Официальная страница: https://reg.olympmo.ru/olymp-stage/tasks-vos-mun-2024

### 9–10 — единый официальный вариант
- Один общий комплект для 9 и 10 классов. Два разных содержания для этих классов в этом году недопустимы.
- Единый источник в коде: `data/questions/grade-9-10/official-2024.ts`.
- Reading: 20 заданий с полными passages `Unusual National Sports` и `The Silk Road`.
- Use of English: 20 заданий — Duolingo/AI vocabulary, idioms, film matching.
- Writing: review музея/галереи/выставки, 200–250 слов, passive structures, idioms, причины для подростков; manual review.
- Для Grade 9 старый отдельный wrapper заменён ссылкой на общий 9–10 банк.
- Для Grade 10 общий банк подключён и в самостоятельную тренировку, и в `objectiveBankForSeniorGrade`, поэтому Full Olympiad использует тот же официальный Reading/UOE.
- Listening: 20 вопросов и ключи сохранены, но вариант остаётся вне SAFE registry до подтверждения исходного MP3.

Официальные локальные материалы:
- `source_materials/grade-9/2024/24.pdf`
- `source_materials/grade-9/2024/9-10 ответы (ключи) к заданиям.pdf`
- `source_materials/grade-9/2024/9-10 скрипт (текст) аудиозаписи.pdf`

### 11
- Отдельный официальный комплект.
- 20 Listening + 20 Reading + 20 Use of English: опубликованный ключ подтверждает текущие ответы.
- Текущий Reading содержит сокращённый passage Helena, поэтому он больше **не маркируется как точная официальная копия «Взлёта»**: источник переключён на `original-olympic-english-lab`, stage `training`, platform `OLYMPIC ENGLISH LAB`, tag `adapted-source-excerpt`.
- После восстановления полного исходного passage можно вернуть официальный статус.
- Writing: 200–250 слов, headline, general information, 2 conditional sentences разных типов, 2 idioms, минимум 2 причины; manual review.
- Официальный MP3 опубликован, но пока не загружен и не проверен по хэшу, поэтому Listening 2024 остаётся вне SAFE registry.

## 2025/2026

Официальная страница: https://reg.olympmo.ru/olymp-stage/tasks-vos-mun-2025

- Группировка подтверждена: 7–8, общий 9–10, отдельный 11.
- Официальные задания, ответы, аудио и скрипты опубликованы для всех трёх групп.
- Подробный manifest: `docs/vzlet-2025-structure.md`.
- Официальный Writing уже импортирован для 7–8, общего 9–10 и 11; manual review.
- Файлы ответов опубликованы как ZIP. До разбора ZIP нельзя заполнять `acceptedAnswers` догадками или ключами другого региона.
- Поэтому objective 2025/2026 пока не участвует в автопроверке.

## Правила импорта

1. `source: official-vsosh-vzlet` — только для материала, сверенного с официальным источником.
2. Авторские/адаптированные материалы — `source: original-olympic-english-lab`, `stage: training`, `platformLabel: OLYMPIC ENGLISH LAB`.
3. Автопроверка разрешена только при подтверждённом ключе.
4. Writing — manual review, без выдуманного автоматического балла.
5. Listening считается SAFE только при совпадении task + key + script + исходного audio file/hash.
6. Официальная группировка конкретного года сохраняется без изменений.
7. Сокращённый или пересказанный passage не выдаётся за точную официальную копию.

## Следующая очередь

1. Импортировать и сверить Writing 2021/2022 отдельно для 7–8, 9, 10 и 11 классов.
2. Разобрать официальный ZIP ответов 2025/2026 и импортировать objective 7–8 → общий 9–10 → 11.
3. Довести SAFE Listening 2024/2025 после проверки официальных MP3.
4. Довести 11 класс 2023/2024.
5. Закрыть остатки 2022/2023 и 7–8 2024/2025.
6. После этого последовательно переносить objective/Listening 2019/2020, 2020/2021 и 2021/2022, сохраняя историческую группировку классов.
