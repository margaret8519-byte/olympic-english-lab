import type { QuestionBankItem, QuestionSet, Section } from "../types.ts";

type Grade = 10 | 11;
const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2022/2023";

const item = (
  grade: Grade,
  section: Section,
  id: string,
  text: string,
  options: string[],
  answers: string | string[],
  subskill: string,
  extra: Partial<QuestionBankItem> = {},
): QuestionBankItem => {
  const acceptedAnswers = (Array.isArray(answers) ? answers : answers ? [answers] : []).map(value => value.toLowerCase());
  return {
    id: `g${grade}-2022-${section}-${id}`,
    grade,
    year: 2022,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section,
    skill: section === "use-of-english" ? "Use of English" : section[0].toUpperCase() + section.slice(1),
    subskill,
    difficulty: "advanced",
    type: options.length ? "multiple-choice" : "gap-fill",
    instruction: "Complete the official task in its original order.",
    text,
    options,
    acceptedAnswers,
    points: 1,
    explanation: acceptedAnswers.length ? "Ответ подтверждён официальным ключом Взлёта." : "Требуется проверка учителем.",
    tags: ["official", "2022", "vzlet"],
    needsReview: acceptedAnswers.length === 0,
    ...extra,
  };
};

const set = (id: string, title: string, section: Section, items: QuestionBankItem[], extra: Partial<QuestionSet> = {}): QuestionSet => ({
  id,
  title,
  section,
  instruction: `Выполни официальный раздел ${title}.`,
  items,
  ...extra,
});

const penwoodOptions = ["A too large", "B boring", "C more convenient", "D exciting", "E well-constructed", "F still looked fashionable"];
const penwood = [
  ["01", "The yearly competition is held", ["A together with the museum's educational department", "B as part of the museum's autumn show", "C along with the summer exhibition"], "c"],
  ["02", "The subject of this year's competition is using technology", ["A to involve young people in the museum's activities", "B to form better links between local people and the museum", "C to improve the local community's engagement with the art"], "b"],
  ["03", "The competition was limited to those aged", ["A 11-15", "B 13-17", "C 15-19"], "c"],
  ["04", "During the preparation for the entry the competitors were", ["A able to use the museum's educational facilities", "B helped by the education staff at the museum", "C allowed to buy any of the equipment they needed"], "a"],
  ["05", "According to the speaker, the prize-winning exhibits have", ["A led to traffic jams outside the museum", "B led to a reduction in attendances", "C increased interest in the museum"], "c"],
] as const;
const penwoodMatching = [
  ["06", "early wooden-framed TV", "f"],
  ["07", "early radios", "a"],
  ["08", "microwave ovens", "c"],
  ["09", "laptops", "d"],
  ["10", "old cameras", "e"],
] as const;

const grade11ListeningItems: QuestionBankItem[] = [
  ...penwood.map(([id, text, options, answer]) => item(11, "listening", id, text, [...options], answer, "multiple choice", { groupId: "g11-2022-listening-penwood" })),
  ...penwoodMatching.map(([id, text, answer]) => item(11, "listening", id, text, penwoodOptions, answer, "matching", { groupId: "g11-2022-listening-penwood", type: "matching" })),
];
const siestaStatements = [
  "Spaniards stop working from 1 p.m. to 4 p.m. every day.",
  "Nowadays, when productivity is the main religion of the modern world, the tradition of siesta is no longer important in Spain.",
  "Pier Roberts recalls he could find only a few restaurants open in the afternoon in Madrid.",
  "Studies have shown that it’s natural for people to feel sleepy in the middle of the day.",
  "According to sleep researchers, it is the food we eat for lunch that makes us feel drowsy.",
  "During the midday break in Spain, people go home for lunch and then meet with their friends and family.",
  "Night life is a crucial part of the siesta lifestyle.",
  "It is a common thing in Spain to have dinner after 8 p.m.",
  "The siesta tradition is reflected in Spanish architecture.",
  "The siesta tradition today is driven by practical reasons as it allows people to work more effectively in the hot climate.",
];
const siestaAnswers = ["f", "f", "f", "t", "f", "f", "t", "t", "f", "f"];
siestaStatements.forEach((text, index) => grade11ListeningItems.push(item(11, "listening", String(index + 11), text, ["T", "F"], siestaAnswers[index], "true / false", { groupId: "g11-2022-listening-siesta", type: "true-false" })));

export const grade11Listening2022Verified = set("g11-2022-listening-verified", "Listening", "listening", grade11ListeningItems, {
  audioMode: "file",
  audioSrc: "/audio/grade-11/2022/listening.mp3",
  script: "source_materials/grade-11/2022/script_52_1668763504.pdf",
});

const cincoAnswers = ["benefit", "representative", "highlight", "government", "respectively", "showcases", "commemorates", "annually", "significance", "delicacies"];
const photoOptions = [
  ["A appeal", "B taste", "C interest", "D attraction"],
  ["A rejected", "B contradicted", "C denied", "D refused"],
  ["A trouble", "B care", "C effort", "D concern"],
  ["A characteristics", "B forms", "C qualities", "D aspects"],
  ["A seize", "B capture", "C grab", "D catch"],
  ["A motivates", "B renews", "C stimulates", "D reacts"],
  ["A manage", "B succeed", "C achieve", "D reach"],
  ["A reason", "B cause", "C source", "D means"],
  ["A glance", "B see", "C stare", "D look"],
  ["A utterly", "B completely", "C fully", "D absolutely"],
];
const seniorPhotoAnswers = ["c", "b", "b", "a", "d", "b", "c", "b", "a", "d"];
const cultureStatements = [
  "The British Parliament consists of the House of Lords and the House of Representatives.",
  "Australia Day is celebrated on 26 January, in winter.",
  "King Charles III is Australia’s Head of State.",
  "The Lake District contains the principal English lakes and highest English mountains.",
  "There are two mottos in the Coat of Arms of the UK.",
  "The Australian Coat of Arms features a red kangaroo and a kiwi.",
  "Golf and basketball were invented in the UK and are national sports today.",
  "The police nicknames ‘bobbies’ and ‘Peelers’ come from Robert Burns.",
  "The London Eye was constructed to commemorate the millennium.",
  "The first UK postage stamp featured Queen Elizabeth II.",
];
const cultureAnswers = ["f", "f", "t", "t", "t", "f", "f", "f", "t", "f"];
const idiomPrompts = [
  "Baby Jessica is the ___ of her father's eye.",
  "Angelo is a hard ___ to crack.",
  "Working at the library lets me have my ___ and eat it too.",
  "That’s the way the ___ crumbles.",
  "I was as cool as a ___ all the way to England.",
  "My Granny is always full of ___.",
  "Opera isn't exactly my cup of ___.",
  "He is definitely the ___ of the crop.",
  "Don't put all of your ___ in one basket.",
  "Any teacher worth his ___ can inspire students.",
];
const idiomAnswers = ["apple", "nut", "cake", "cookie", "cucumber", "beans", "tea", "cream", "eggs", "salt"];

function seniorUseOfEnglish(grade: Grade): QuestionSet {
  const items: QuestionBankItem[] = [];
  cincoAnswers.forEach((answer, index) => items.push(item(grade, "use-of-english", String(index + 1).padStart(2, "0"), `Complete the Cinco de Mayo crossword gap ${index + 1}.`, [], answer, "crossword vocabulary", { groupId: `g${grade}-2022-uoe-cinco` })));
  photoOptions.forEach((options, index) => items.push(item(grade, "use-of-english", String(index + 11), `Choose the best word for gap ${index + 11} in “The joy of photography”.`, options, seniorPhotoAnswers[index], "lexico-grammatical cloze", { groupId: `g${grade}-2022-uoe-photography` })));
  cultureStatements.forEach((text, index) => items.push(item(grade, "use-of-english", String(index + 21), text, ["T", "F"], cultureAnswers[index], "cultural knowledge", { groupId: `g${grade}-2022-uoe-culture`, type: "true-false" })));
  idiomPrompts.forEach((text, index) => items.push(item(grade, "use-of-english", String(index + 31), text, [], idiomAnswers[index], "food idioms", { groupId: `g${grade}-2022-uoe-idioms` })));
  return set(`g${grade}-2022-use-of-english-verified`, "Use of English", "use-of-english", items);
}

export const grade10UseOfEnglish2022Verified = seniorUseOfEnglish(10);
export const grade11UseOfEnglish2022Verified = seniorUseOfEnglish(11);

const bookReviewText = "Write a 220–250 word review of a book, movie or TV series you loved. Include general information, plot, main characters, at least two things you liked and at least two reasons to recommend it to teenagers.";
export const grade10Writing2022Verified = set("g10-2022-writing-verified", "Writing", "writing", [item(10, "writing", "01", bookReviewText, [], "", "Writing", { type: "writing", points: 20, needsReview: true, wordLimit: { min: 220, max: 250 }, requirements: ["Give a headline", "Use and underline two phrasal verbs", "Give general information", "Describe the plot and main characters", "Give at least two things you liked", "Give at least two reasons to recommend it to teenagers"] })]);
export const grade11Writing2022Verified = set("g11-2022-writing-verified", "Writing", "writing", [item(11, "writing", "01", bookReviewText, [], "", "Writing", { type: "writing", points: 20, needsReview: true, wordLimit: { min: 220, max: 250 }, requirements: ["Give a headline", "Use and underline one idiom and two phrasal verbs", "Give general information", "Describe the plot and main characters", "Give at least two things you liked", "Give at least two reasons to recommend it to teenagers"] })]);
