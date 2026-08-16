# Adaptive Training — Grade 7–8

## Банк

Создано 40 оригинальных объективных заданий с `source: original-olympic-english-lab`: 25 Use of English, 10 Reading questions в трёх неделимых Reading Sets и 5 Language Challenge. Распределение сложности: easy — 10 (25%), medium — 19 (47.5%), hard — 11 (27.5%). Официальный комплект 2022 с `source: official-vsosh-vzlet` не изменён и остаётся отдельным режимом.

## Subskills

Tenses, Articles, Prepositions, Pronouns, Modal Verbs, Comparison, Passive Voice, Conditionals, Word Order, Verb Patterns, Word Formation, Collocations, Phrasal Verbs, Compound Words, Contextual Vocabulary, Grammar in Context, Idioms, Main Idea, Reading Detail, Reading Inference, Vocabulary in Context.

## Выбор и защита от повторов

Вопросы объединяются в units по `groupId` (или собственному `id`), поэтому Reading Set выбирается только целиком. В приоритете никогда не встречавшиеся units. Последние 30 IDs понижаются в рейтинге и не выбираются при наличии альтернатив. После исчерпания новых вопросов разрешаются повторы, причём ранее ошибочные получают повышенный приоритет. Внутри сессии ID не дублируются. Options перемешиваются как объекты с постоянными IDs, поэтому правильный ответ не зависит от позиции.

## Статистика и слабые темы

`questionHistory` хранит seen, attempts, correct, incorrect, lastAttempt, skill и subskill. Точность считается как `correct / attempts × 100`. Subskill признаётся слабым только при attempts ≥ 3 и accuracy < 70%. Категории: 0–49 «Нужно повторить», 50–69 «Стоит потренироваться», 70–84 «Хороший результат», 85–100 «Сильная сторона».

## Adaptive mini-round

Мини-раунд содержит 5 заданий. Алгоритм стремится заполнить 70–80% вопросами слабого subskill, насколько позволяет текущий банк, и добавляет соседние навыки. Внутри целевого subskill порядок приоритета: новые, ранее ошибочные, затем старые правильные. Недавно решённый вопрос уступает новому по той же теме.

## Local storage

- `questionHistory` — агрегаты по каждому question ID.
- `trainingAttempts` — завершённые тренировки, результат и слабые навыки.
- `recentQuestionIds` — последние 30 вопросов для защиты от повторов.

Writing не участвует в автоматической accuracy, Speaking 9–11 полностью исключён из adaptive engine 7–8. Development reset очищает только эти три ключа и не удаляет `studentProfile`.
