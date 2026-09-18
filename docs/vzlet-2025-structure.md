# «Взлёт» 2025/2026 — муниципальный этап, английский язык

Официальная страница: https://reg.olympmo.ru/olymp-stage/tasks-vos-mun-2025

## Официальная группировка

- 7–8 классы — единый комплект.
- 9–10 классы — единый комплект.
- 11 класс — отдельный комплект.

В приложении нельзя создавать разные официальные варианты 9 и 10 класса для этого учебного года: источник «Взлёта» общий.

## Официальные файлы

### 7–8 классы
- Задания: https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4473_1764686259.pdf
- Ответы: https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4482_1764686555.zip
- Аудио: https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4476_1764686336.mp3
- Скрипт: https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4479_1764686465.pdf

Структура письменного тура:
- Listening — 15 баллов: Museums (T/F 1–7) + A Young Actor (multiple choice 8–15).
- Reading — 20 баллов: sports competitions + Bolshoi Theatre.
- Use of English — 20 баллов: word formation + idioms + famous people.
- Writing — 120–200 слов: science-fiction story, обязательное начало про Oliver, встреча с aliens, spacecraft, 2 idioms, happy ending. Заголовок входит в объём.

Статус: официальный ZIP ответов разобран 18.09.2026. Ключи Listening, Reading и Use of English перенесены в `data/questions/grade-7-8/2025/` и покрыты regression-тестом. Writing остаётся manual review. Для Reading Task 1 спортивные рисунки в интерфейсе являются визуальной реконструкцией и явно помечены как adaptation; тексты, нумерация и ключ не изменены. Для Use of English Task 2 бумажный word-search адаптирован в онлайн gap-fill с теми же семью пропусками и официальным ключом.

### 9–10 классы
- Задания: https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4474_1764686276.pdf
- Ответы: https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4483_1764686578.zip
- Аудио: https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4477_1764686388.mp3
- Скрипт: https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4480_1764686480.pdf

Структура письменного тура:
- Listening — 20 баллов: five speakers / scents (1–14) + Farza Abad / house-plant business (15–20).
- Reading — 20 баллов: city nicknames (1–13) + Leo Tolstoy and technological innovations (14–20).
- Use of English — 20 баллов: food photography crossword (1–7) + idioms (8–13) + UK landmarks (14–20).
- Writing — 180–250 слов: story с обязательным началом `The old man in the park told me the statue would make one wish come true, but he never told me what it would cost.`; title, wish + unexpected cost, 2 modal verbs, 2 phrasal verbs, moral. Заголовок входит в объём.

Статус: официальный ZIP ответов разобран 18.09.2026. Ключи Listening, Reading и Use of English перенесены в `data/questions/grade-9-10/official-2025.ts` и покрыты regression-тестом для обоих классов. Listening использует официальный MP3 «Взлёта». Бумажный crossword в Use of English Task 1 адаптирован в онлайн gap-fill по тем же определениям и официальному ключу; Task 2 сохраняет полные официальные идиомы.

### 11 класс
- Задания: https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4475_1764686292.pdf
- Ответы: https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4484_1764686590.zip
- Аудио: https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4478_1764686443.mp3
- Скрипт: https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4481_1764686497.pdf

Структура Listening подтверждена по официальному PDF:
- Farza Abad / house-plant business — 1–6;
- adult learning experiences — 7–13;
- podcast host Brian Felthmore — 14–20.

Структура письменного тура:
- Listening — 20 баллов: Farza Abad / house-plant business (1–6) + adult learning experiences (7–13) + podcast host Brian Felthmore (14–20).
- Reading — 20 баллов: Leo Tolstoy and technological innovations (1–7) + Pacific Northwest Tree Octopus (8–20).
- Use of English — 20 баллов: food photography crossword (1–7) + idioms / The Bottom Line (8–14) + Greatest Britons (15–20).
- Writing — 180–250 слов: то же обязательное начало про statue/wish, но языковое требование 11 класса — минимум 2 случая reported speech + 2 разных phrasal verbs; заголовок входит в объём.

Статус: официальный ZIP ответов разобран 18.09.2026. Ключи Listening, Reading и Use of English перенесены в `data/questions/grade-11/official-2025.ts`; подключены официальный MP3 и Full Olympiad. В Listening 9–10 и 11–12 допускается любой порядок двух официальных ответов, при этом интерфейс не позволяет выбрать один и тот же вариант дважды для одной пары. Бумажный crossword адаптирован в онлайн gap-fill.

## Статус импорта

- **7–8 классы:** objective 2025/2026 импортирован по официальному ZIP-ключу; Writing — manual review.
- **9–10 классы:** objective 2025/2026 импортирован по официальному ZIP-ключу для общего варианта 9–10 классов; Writing — manual review.
- **11 класс:** objective 2025/2026 импортирован по официальному ZIP-ключу; Writing — manual review; полный вариант 2025/2026 подключён в Full Olympiad.

Правило импорта:
1. Сначала точный текст задания.
2. Затем официальный ключ из соответствующего ZIP.
3. Для Listening дополнительно используются официальный script и исходный MP3.
4. Только после этого набор получает `source: official-vsosh-vzlet` и допускается к автоматической проверке.
5. Writing остаётся manual review.
