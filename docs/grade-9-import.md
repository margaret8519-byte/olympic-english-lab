# Grade 9 import

## Sources inspected

- `source_materials/grade-9/2022`: official task PDF and listening script PDF.
- `source_materials/grade-9/2024`: task PDF/DOCX, listening script DOCX/PDF, official answer key, assessment documents and MP3.
- `source_materials/grade-9/Speaking`: participant 1/2 assignments and fact files; the second-stream directory contains duplicate speaking files.

## Connected material

- Official 2024: 20 Listening, 20 Reading, 20 Use of English and one Writing task.
- All 60 objective answers come from the supplied official 2024 key.
- Writing is marked `needsReview` because it requires expert assessment.
- The supplied 2024 MP3 is served from `public/audio/grade-9/2024/listening.mp3`; the browser uses file playback, not speech synthesis.
- Official 2022 is available as a separate unscored variant: 20 Listening, 20 Reading, 40 Use of English and one Writing task. The supplied directory has no answer key, so all 81 items are marked `needsReview`; no answers were invented. There is no MP3, so Listening uses the existing speech architecture with the script hidden from the learner.
- Speaking remains in its existing separate 9–11 workflow.

## Official 2023

Files found in `source_materials/grade-9/2023`:

- `9 текст заданий.docx` — the main task booklet;
- `9 скрипт (текст) аудиозаписи.docx` — the official Listening script;
- `9_аудиозапись_для_конкурса_понимания_устной_речи.mp3` — the official Listening audio.

Imported counts: 20 Listening, 20 Reading, 20 Use of English and one Writing task. No separate official answer key or Writing criteria file is present, and neither document contains an answer section. Therefore, confirmed official objective answers: 0; `needsReview`: 61. No answer was inferred from the script or task wording. The MP3 is present and is served in file mode from `public/audio/grade-9/2023/listening.mp3`. Reading questions remain in their two complete source groups. Writing stores the response and formal requirements but does not produce an automatic score.

## Original Grade 9 bank

There are 40 independent items: 25 Use of English, 10 Reading questions in two indivisible five-question text groups, and 5 Language Challenge items. The bank covers tense contrast, passive voice, modals, conditionals, relative clauses, reported speech, verb patterns, articles, prepositions, inversion, word formation, collocations, phrasal verbs, idioms, contextual vocabulary, main idea, detail, inference and author attitude.

The reviewed difficulty distribution is 10 easy, 20 medium and 10 hard. Easy items were simplified within their original subskills rather than merely relabelled. Questions are tagged with `grade: 9` and `source: original-olympic-english-lab`; the grade router never falls back to the 7–8 bank.

## Modes and verification

Grade 9 is available in quick, olympiad, challenge and weak-area adaptive modes. Quick targets a 3/5/2 easy-medium-hard mix for a ten-question session; Challenge draws from the hard pool. Official Listening, Reading, Use of English and Writing expose isolated 2022, 2023 and 2024 choices. Only the 60 objective items from 2024 are automatically scored from a supplied official key; 2022 and 2023 never display an automatic official result. Automated checks cover year isolation, counts, difficulty balance, grade safety, reading-group integrity, answer provenance and audio assets.
