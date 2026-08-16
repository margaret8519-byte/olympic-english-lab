# Grade 9 original training bank

This report covers only `source = original-olympic-english-lab`, `grade = 9`. Official variants are separate and are not counted here.

## Summary

- Before expansion: **40** objective questions.
- Added: **52** objective questions.
- Current total: **92** unique objective questions.
- Sections: **57 Use of English**, **20 Reading**, **15 Language Challenge**.
- Difficulty: **24 easy**, **44 medium**, **24 hard**.
- Every diagnostic subskill below has at least four unique questions.
- The original 40 question IDs and content remain unchanged.

## Coverage

Difficulty is shown as E (easy), M (medium), and H (hard).

| Subskill | Questions | Question IDs | Difficulty | ≥ 4 unique |
|---|---:|---|---|:---:|
| Articles | 4 | g9-uoe-15, g9-uoe-16, g9-x-uoe-01, g9-x-uoe-02 | E 1 / M 2 / H 1 | Yes |
| Author attitude | 4 | g9-r1-05, g9-r2-05, g9-x-r3-05, g9-x-r4-05 | E 1 / M 1 / H 2 | Yes |
| Collocations | 4 | g9-uoe-22, g9-lc-05, g9-x-v-01, g9-x-v-02 | E 1 / M 2 / H 1 | Yes |
| Complex structures | 4 | g9-uoe-25, g9-x-uoe-27, g9-x-uoe-28, g9-x-uoe-29 | E 1 / M 2 / H 1 | Yes |
| Compound words | 4 | g9-lc-04, g9-x-v-05, g9-x-v-06, g9-x-v-07 | E 1 / M 2 / H 1 | Yes |
| Conditionals | 4 | g9-uoe-07, g9-uoe-08, g9-x-uoe-03, g9-x-uoe-04 | E 1 / M 2 / H 1 | Yes |
| Contextual synonyms | 4 | g9-lc-03, g9-x-v-08, g9-x-v-09, g9-x-v-10 | E 1 / M 2 / H 1 | Yes |
| Detail | 4 | g9-r1-03, g9-r2-02, g9-x-r3-02, g9-x-r4-02 | E 2 / M 1 / H 1 | Yes |
| Gerund and infinitive | 4 | g9-uoe-13, g9-x-uoe-30, g9-x-uoe-31, g9-x-uoe-32 | E 1 / M 2 / H 1 | Yes |
| Idioms | 4 | g9-lc-01, g9-lc-02, g9-x-v-03, g9-x-v-04 | E 1 / M 2 / H 1 | Yes |
| Inference | 4 | g9-r1-02, g9-r2-03, g9-x-r3-03, g9-x-r4-03 | E 1 / M 2 / H 1 | Yes |
| Main idea | 4 | g9-r1-01, g9-r2-01, g9-x-r3-01, g9-x-r4-01 | E 1 / M 2 / H 1 | Yes |
| Modal verbs | 4 | g9-uoe-05, g9-uoe-06, g9-x-uoe-07, g9-x-uoe-08 | E 1 / M 2 / H 1 | Yes |
| Passive voice | 4 | g9-uoe-03, g9-uoe-04, g9-x-uoe-05, g9-x-uoe-06 | E 1 / M 2 / H 1 | Yes |
| Phrasal verbs | 4 | g9-uoe-23, g9-uoe-24, g9-x-uoe-19, g9-x-uoe-20 | E 1 / M 2 / H 1 | Yes |
| Prepositions | 4 | g9-uoe-17, g9-uoe-18, g9-x-uoe-09, g9-x-uoe-10 | E 1 / M 2 / H 1 | Yes |
| Relative clauses | 4 | g9-uoe-09, g9-uoe-10, g9-x-uoe-11, g9-x-uoe-12 | E 1 / M 2 / H 1 | Yes |
| Reported speech | 4 | g9-uoe-11, g9-uoe-12, g9-x-uoe-13, g9-x-uoe-14 | E 1 / M 2 / H 1 | Yes |
| Tense contrast | 4 | g9-uoe-01, g9-uoe-02, g9-x-uoe-15, g9-x-uoe-16 | E 1 / M 2 / H 1 | Yes |
| Verb patterns | 4 | g9-uoe-14, g9-x-uoe-21, g9-x-uoe-22, g9-x-uoe-23 | E 1 / M 2 / H 1 | Yes |
| Vocabulary in context | 4 | g9-r1-04, g9-r2-04, g9-x-r3-04, g9-x-r4-04 | E 1 / M 2 / H 1 | Yes |
| Word formation | 4 | g9-uoe-20, g9-uoe-21, g9-x-uoe-17, g9-x-uoe-18 | E 1 / M 2 / H 1 | Yes |
| Word order | 4 | g9-uoe-19, g9-x-uoe-24, g9-x-uoe-25, g9-x-uoe-26 | E 1 / M 2 / H 1 | Yes |

## Adaptive selection guarantees

- A skill-stat row with `attempts === 2` and `accuracy < 70` is a confirmation candidate.
- Quick Training reserves up to three confirmation observations and prefers an unseen question ID from that subskill.
- Seen IDs are excluded while an unseen ID for the same subskill remains available. Reuse is allowed only after the unique supply is exhausted.
- The rest of a ten-question Quick session remains varied and targets a 3 easy / 5 medium / 2 hard mix.
- The weak-area rule remains `attempts >= 3 && accuracy < 70`.
- Weak Area Training targets approximately 80% weak subskills and 20% neighbouring material.
- All selection is made from the current grade registry; grade 9 cannot receive grade 7–8 questions.

Reading questions remain in complete five-question source groups. Selecting one question from a group selects its full passage group.
