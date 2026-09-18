import type { QuestionBankItem, QuestionSet, QuestionType, Section } from "../types.ts";
import { official2025ForGrade } from "../grade-9-10/official-2025.ts";

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2025/2026, 11 класс";
const taskUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4475_1764686292.pdf";
const answerUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4484_1764686590.zip";
const audioUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4478_1764686443.mp3";
const scriptUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4481_1764686497.pdf";
const shared910 = official2025ForGrade(9);

function item(
  section: Section,
  id: string,
  text: string,
  options: string[],
  answers: string | string[],
  subskill: string,
  extra: Partial<QuestionBankItem> = {},
): QuestionBankItem {
  const type: QuestionType = extra.type || (options.length ? "multiple-choice" : "gap-fill");
  return {
    id: `g11-2025-${section}-${id}`,
    grade: 11,
    year: 2025,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section,
    skill: section === "use-of-english" ? "Use of English" : section[0].toUpperCase() + section.slice(1),
    subskill,
    difficulty: "advanced",
    type,
    instruction: "Complete the official task in its original order.",
    text,
    options,
    acceptedAnswers: Array.isArray(answers) ? answers : [answers],
    points: 1,
    explanation: "Ответ подтверждён официальным ключом «Взлёта» 2025/2026.",
    tags: ["official", "2025", "vzlet", "grade-11"],
    needsReview: false,
    feedback: `Official task: ${taskUrl} · key: ${answerUrl}`,
    ...extra,
  };
}

function set(id: string, title: string, section: Section, items: QuestionBankItem[], extra: Partial<QuestionSet> = {}): QuestionSet {
  return { id, title, section, instruction: `Выполни официальный раздел ${title}.`, items, ...extra };
}

function cloneShared(question: QuestionBankItem, id: string, extra: Partial<QuestionBankItem> = {}): QuestionBankItem {
  return {
    ...question,
    id: `g11-2025-${question.section}-${id}`,
    grade: 11,
    sourceLabel,
    tags: ["official", "2025", "vzlet", "grade-11", "shared-task"],
    feedback: `Official task: ${taskUrl} · key: ${answerUrl}`,
    ...extra,
  };
}

const farza = shared910.listening.items.slice(14, 20).map((question, index) =>
  cloneShared(question, String(index + 1).padStart(2, "0"), {
    instruction: "Task 1. Listen to the interview with Farza Abad. For questions 1–6, choose the best answer (a, b or c).",
    groupId: "g11-2025-listening-farza",
  }),
);

const adultLearningOptions = [
  "a) memorising new vocabulary",
  "b) working with other people",
  "c) balancing work, studies and family life",
  "d) dealing with an unusual method of learning",
  "e) being as adaptable as when they were young",
  "f) building a relationship with the teacher",
  "g) maintaining high energy levels",
  "h) attracting the teacher’s attention",
];

const adultRows: Array<[string, string, string | string[], string?]> = [
  ["07", "Speaker 1", "g"],
  ["08", "Speaker 2", "a"],
  ["09", "Speaker 3 · first difficulty", ["f", "h"], "exclusive-pair:listening-speaker-3"],
  ["10", "Speaker 3 · second difficulty", ["f", "h"], "exclusive-pair:listening-speaker-3"],
  ["11", "Speaker 4 · first difficulty", ["c", "e"], "exclusive-pair:listening-speaker-4"],
  ["12", "Speaker 4 · second difficulty", ["c", "e"], "exclusive-pair:listening-speaker-4"],
  ["13", "Speaker 5", "d"],
];

const adultLearning = adultRows.map(([id, text, answers, exclusive]) =>
  item("listening", id, text, adultLearningOptions, answers, "multiple matching", {
    type: "matching",
    instruction: "Task 2. Listen to five people talking about learning as adults. For questions 7–13, choose what each speaker found difficult. One option is extra.",
    groupId: "g11-2025-listening-adult-learning",
    tags: ["official", "2025", "vzlet", "grade-11", ...(exclusive ? [exclusive] : [])],
    rule: exclusive ? "For this speaker, use the two official answers once each; their order may be reversed." : undefined,
    feedback: `Official task: ${taskUrl} · key: ${answerUrl} · script: ${scriptUrl}`,
  }),
);

const brianRows: Array<[string, string, string]> = [
  ["14", "Brian started a podcast because he knew his colleagues would listen to it.", "F"],
  ["15", "Brian gets most of his information from face-to-face interviews.", "T"],
  ["16", "Hosting his podcast Brian enjoys most talking to his guests.", "F"],
  ["17", "Brian finds it really hard to plan the content of the episodes.", "T"],
  ["18", "Brian believes that people who want to start a podcast will have to spend money.", "T"],
  ["19", "Brian records his podcast episodes in a home office.", "F"],
  ["20", "On his next podcast episode, Brian will ask listeners to call the show with questions.", "F"],
];

const brian = brianRows.map(([id, text, answer]) =>
  item("listening", id, text, ["T", "F"], answer, "true/false detail", {
    type: "true-false",
    instruction: "Task 3. Listen to the interview with podcast host Brian Felthmore. Mark statements 14–20 True (T) or False (F).",
    groupId: "g11-2025-listening-brian",
    feedback: `Official task: ${taskUrl} · key: ${answerUrl} · script: ${scriptUrl}`,
  }),
);

export const grade11Listening2025 = set(
  "g11-2025-listening",
  "Listening · Взлёт 2025/2026 · 11 класс",
  "listening",
  [...farza, ...adultLearning, ...brian],
  { audioSrc: audioUrl, audioMode: "file" },
);

const tolstoyPassage = (shared910.reading.items[13].passage || "")
  .replace(/14\)/g, "1)")
  .replace(/15\)/g, "2)")
  .replace(/16\)/g, "3)")
  .replace(/17\)/g, "4)")
  .replace(/18\)/g, "5)")
  .replace(/19\)/g, "6)")
  .replace(/20\)/g, "7)");

const tolstoy = shared910.reading.items.slice(13, 20).map((question, index) =>
  cloneShared(question, String(index + 1).padStart(2, "0"), {
    text: `Gap ${index + 1}`,
    instruction: "Task 1. Seven sentences have been removed from the text about Leo Tolstoy. Choose from sentences a–h the one which fits each gap 1–7. There is one extra sentence.",
    groupId: "g11-2025-reading-tolstoy",
    passage: tolstoyPassage,
  }),
);

const treeOctopusPassage = `The Pacific Northwest Tree Octopus

A
It is extremely common for people to turn to the internet to learn about what is happening in the world. This is increasingly true of teenagers, who may well go on to use online information (along with more traditional sources such as textbooks) for their studies when they later enter college. Information literacy – the ability to understand whether a text, article or news story is composed of reliable facts – is very important at university level. However, according to some research, there is worrying evidence that many of us often accept the information we read at face value. In other words, we often seem to trust what we are reading without really asking questions about who wrote it and why.

B
In 1998, a writer going by the name of Lyle Zapato set up a detailed and quite sophisticated website which seemed to give information about the Pacific Northwest Tree Octopus. According to the website (which still exists), this apparently shy animal can only be found in the vast forests of the north-western USA. Reaching a size of 33 centimetres, it is as happy jumping from branch to branch as it is in the normal octopus home of water. However, because of the Tree Octopus’s natural habitats being cut down, and other threats such as eagles and cats, their numbers are low, and they are at risk of dying out completely. The website suggests that people help protect the octopus by writing to celebrities to take action, or even by going on Tree Octopus awareness marches.

C
The Tree Octopus has never existed, of course, and the website contains nothing more than fake information. It has, however, been used in a number of interesting experiments. In 2007 and 2017, two separate ones were done on school pupils aged 11–13 in the US and the Netherlands. They were either asked to summarize the most important information from the website in a few sentences or were asked questions to test whether they understood the information about the Tree Octopus. After further questions, it was found in the American study that only 11% thought the website was in any way suspicious. In the Dutch study, a similarly low number (7%) thought the same. It is possible that the rather emotional topic of the website (an animal in danger) could have made it appear more reliable than it really was.

D
These results may not be too surprising. It could be argued that as long ago as 2007 – or even 2017 – the idea of ‘fake news’ was much less widely known about than it is now. Even today, we should probably not be astonished if 11-year-olds have little awareness of unreliable information online compared to older teenagers who have started university and have more experience of the internet. For that reason, many of us might not be too worried about children being deceived by what they see on the internet. It could even be argued that no one as young as 11 should even be spending much time online.

E
In 2020, however, a new experiment was carried out on a group of first-year university students in the US studying biology – the type of people who would be expected to have developed the intelligence to know what is objective information and what is not. In one task, the students were asked to visit the website of the Pacific Northwest Tree Octopus as part of a project on ‘interesting organisms’. As part of the first task, they were asked to use the website to find out the scientific name of the octopus, where it lived and why this species was at risk. Interestingly, at this point, 90% of students failed to recognize that the octopus – and the whole website – was a carefully crafted joke. In a follow-up task, the students were shown a video which made it clear that the octopus was a comedy invention and were then asked what they thought about the initial task. The vast majority now saw the website for what it was, making such comments as, ‘I answered the questions without giving them much thought,’ or ‘I didn’t think it was necessary to find any extra evidence about this animal.’

F
As studies like these suggest, even science students can be influenced by fake news, and could benefit from developing their critical-thinking skills. Given this, it is probably sensible to start teaching young teenagers about the nature of online information as soon as they are allowed to access it. They should – at the very least – know that there is much that is inaccurate, if not deliberately designed to make us believe something which is untrue. But perhaps more importantly, they should be encouraged to continually ask themselves questions about what they find online. Rather than learning to rely on a single source of information, we should all be taught to read up on important subjects and check for additional evidence, if necessary, rather than simply accepting something as soon as we see it.`;

const headingOptions = [
  "a) Most children trust online information",
  "b) Recommendations for schools",
  "c) The usefulness of online information",
  "d) Experienced scientists can be fooled, too",
  "e) Don’t expect children to understand the internet",
  "f) Why ‘fake news’ works",
  "g) A strange creature",
  "h) The earliest example of ‘fake news’",
  "i) Why ‘fake news’ is aimed at children",
];

const headingAnswers = ["c", "g", "a", "e", "f", "b"];
const headings = headingAnswers.map((answer, index) =>
  item("reading", String(index + 8).padStart(2, "0"), `Paragraph ${String.fromCharCode(65 + index)}`, headingOptions, answer, "matching headings", {
    type: "matching",
    instruction: "Task 2.1. Choose the correct heading for each paragraph A–F. Three headings are extra.",
    groupId: "g11-2025-reading-tree-octopus",
    passage: treeOctopusPassage,
  }),
);

const treeStatements: Array<[string, string, string]> = [
  ["14", "The author believes that nowadays teenagers use mainly online information which is unreliable.", "F"],
  ["15", "Lyle Zapato created the website about the Tree Octopus to check how many people will take action to protect the animal.", "F"],
  ["16", "The experiments mentioned in the text involved only teenagers in the Netherlands and the USA.", "T"],
  ["17", "According to the author teenagers should not be allowed to spend much time online.", "F"],
  ["18", "Students participating in the experiment in 2020 were expected to have a certain level of information literacy.", "T"],
  ["19", "The experiments of 2007, 2017 and 2020 proved that an emotional topic of a website can make people believe it’s reliable.", "F"],
  ["20", "The author claims that it’s necessary to teach people to seek further confirmation of the information we read online.", "T"],
];

const treeTrueFalse = treeStatements.map(([id, text, answer]) =>
  item("reading", id, text, ["T", "F"], answer, "true/false reading", {
    type: "true-false",
    instruction: "Task 2.2. Read the Tree Octopus text again and choose T (True) or F (False) for statements 14–20.",
    groupId: "g11-2025-reading-tree-octopus",
    passage: treeOctopusPassage,
  }),
);

export const grade11Reading2025 = set(
  "g11-2025-reading",
  "Reading · Взлёт 2025/2026 · 11 класс",
  "reading",
  [...tolstoy, ...headings, ...treeTrueFalse],
);

const food = shared910["use-of-english"].items.slice(0, 7).map((question, index) =>
  cloneShared(question, String(index + 1).padStart(2, "0"), {
    instruction: "Task 1. Read the food-photography text and fill gaps 1–7 with the words defined in the clues.",
    groupId: "g11-2025-uoe-food-photography",
  }),
);

const bottomLinePassage = `The Bottom Line

The project was 8 ___________ from the very beginning. As the lead investigator for Global Tech, my mission was to 9 ___________ a series of bizarre financial discrepancies. My colleague, Leo, was a wizard with data, but even he couldn’t just 10 ___________ and make the answers appear.

For weeks, we kept on working, checking endless accounts, emails and reports, digging deeper into the figures. We hardly had any sleep and lived on coffee and junk food, so by the end of the month Leo and I felt exhausted. No matter how many facts we discovered, the puzzle refused to 11 ___________. We had fragments — odd transactions, ghost companies — but no cohesive picture.

The breakthrough came from the most unlikely place. A junior accountant named Sarah discovered a few encrypted emails that our sophisticated software had missed: just a single encrypted email chain. That was 12 ___________. As we decrypted the messages, the shocking truth began to 13 ___________. The discrepancies weren’t a glitch; they were a deliberate embezzlement scheme.

With Sarah’s key evidence, we presented our findings, and the news 14 ___________. The scandal broke out. No matter how deep a secret is buried, the truth always has a way of coming out.`;

const idiomOptions = [
  "make do with",
  "come to light",
  "get to the bottom of",
  "the answer to our prayers",
  "fall into place",
  "touch base",
  "spread like wildfire",
  "wave a magic wand",
  "under wraps",
  "keep something under our hat",
];

const idiomRows: Array<[string, string]> = [
  ["08", "under wraps"],
  ["09", "get to the bottom of"],
  ["10", "wave a magic wand"],
  ["11", "fall into place"],
  ["12", "the answer to our prayers"],
  ["13", "come to light"],
  ["14", "spread like wildfire"],
];

const idioms = idiomRows.map(([id, answer]) =>
  item("use-of-english", id, `Gap ${Number(id)}`, idiomOptions, answer, "idioms", {
    type: "matching",
    instruction: "Task 2. Match the parts of the idioms and use the correct idiom in gaps 8–14. Three idioms are extra.",
    groupId: "g11-2025-uoe-bottom-line",
    passage: bottomLinePassage,
    rule: "Use the full fixed idiomatic expression.",
  }),
);

const britonOptions = [
  "a) Duke of Wellington",
  "b) Ernest Henry Shackleton",
  "c) Horatio Nelson",
  "d) Robert Falcon Scott",
  "e) Isambard Kingdom Brunel",
  "f) Robert Baden-Powell",
  "g) Douglas Bader",
  "h) George Stephenson",
];

const britonRows: Array<[string, string, string]> = [
  ["15", "Born on February 15, 1874, in Kilkea, County Kildare, Ireland, he was the second of 10 children. His father was a doctor. The family moved to London when he was about 10. He left school at 16 and became a sailor. He is known for his leadership in the Heroic Age of Antarctic Exploration and joined the Discovery Expedition of 1901–1904, where he set a southern latitude record before being sent home for health reasons.", "b"],
  ["16", "He was an English civil and mechanical engineer widely regarded as the “Father of Railways.” Born in Wylam, Northumberland, he came from a humble background and largely taught himself engineering skills. He gained experience in coal mines and became known for innovations in locomotive design, railway construction and safety, including a miners’ safety lamp.", "h"],
  ["17", "Born in 1806, he is celebrated as a visionary who reshaped modern transport and civil engineering. His achievements included the Great Western Railway linking London and Bristol, great steamships, the Thames Tunnel, Paddington Station and Clifton Suspension Bridge.", "e"],
  ["18", "Born in 1857, he is remembered as a British Army officer, a national hero of the Second Boer War, and the founder of the modern Scouting movement. After seeing the popularity of his military manual with boys and youth groups, he adapted its ideas for young people and ran an experimental camp on Brownsea Island in 1907.", "f"],
  ["19", "He was one of the first to explore Antarctica by land. On his second expedition he tried to become the first to reach the South Pole, but on January 17, 1912 found that Roald Amundsen had arrived about a month earlier. His party died on the disastrous return journey before reaching their supply depot.", "d"],
  ["20", "This aviation legend (1910–1982) became famous for his courage and skill during World War II despite losing both legs in a 1931 flying accident. He fought in the Battle of France and the Battle of Britain, was shot down and captured in 1941, and became known for daring escape attempts and resilience.", "g"],
];

const britons = britonRows.map(([id, text, answer]) =>
  item("use-of-english", id, text, britonOptions, answer, "cultural knowledge matching", {
    type: "matching",
    instruction: "Task 3. Match the Greatest Britons in questions 15–20 to names a–h. Two names are extra.",
    groupId: "g11-2025-uoe-greatest-britons",
  }),
);

export const grade11UseOfEnglish2025 = set(
  "g11-2025-use-of-english",
  "Use of English · Взлёт 2025/2026 · 11 класс",
  "use-of-english",
  [...food, ...idioms, ...britons],
);

export const grade11Official2025 = {
  listening: grade11Listening2025,
  reading: grade11Reading2025,
  "use-of-english": grade11UseOfEnglish2025,
} as const;
