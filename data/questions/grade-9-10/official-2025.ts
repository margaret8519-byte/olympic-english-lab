import type { QuestionBankItem, QuestionSet, QuestionType, Section } from "../types.ts";

export type Shared2025Grade = 9 | 10;

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2025/2026, 9–10 классы";
const taskUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4474_1764686276.pdf";
const answerUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4483_1764686578.zip";
const audioUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4477_1764686388.mp3";
const scriptUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4480_1764686480.pdf";

function item(
  grade: Shared2025Grade,
  section: Section,
  id: string,
  text: string,
  options: string[],
  answer: string,
  subskill: string,
  extra: Partial<QuestionBankItem> = {},
): QuestionBankItem {
  const type: QuestionType = extra.type || (options.length ? "multiple-choice" : "gap-fill");
  return {
    id: `g${grade}-2025-${section}-${id}`,
    grade,
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
    acceptedAnswers: [answer],
    points: 1,
    explanation: "Ответ подтверждён официальным ключом «Взлёта» 2025/2026.",
    tags: ["official", "2025", "vzlet", "9-10-shared"],
    needsReview: false,
    feedback: `Official task: ${taskUrl} · key: ${answerUrl}`,
    ...extra,
  };
}

function set(id: string, title: string, section: Section, items: QuestionBankItem[], extra: Partial<QuestionSet> = {}): QuestionSet {
  return { id, title, section, instruction: `Выполни официальный раздел ${title}.`, items, ...extra };
}

const cityPassage = `What’s in a Name?

A MOSCOW: The City on Seven Hills
Moscow is one of the rare cities in Russia that kept its name unchanged throughout the centuries. It also has several unofficial titles that reflect its special status and rich history. One of them is The City on Seven Hills. Moscow’s centre is situated on multiple hills. Actually, there are seven ‘main’ hills highlighted: Borovitsky, Sretensky, Tverskoy, Three Mountain, Tagansky, Lefortovsky, Vorobievy Hills. That’s why the landscape is so different around the city, which can make cycling commutes, or just plain walking, a real chore. What you get in return are some gorgeous views from atop those numerous hills.

B LONDON: The Big Smoke
The UK’s capital got its nickname because the city was frequently enveloped in thick smoke which billowed from thousands of residential and factory chimneys. Londoners in the 19th and early 20th centuries used coal to heat their homes, and the resulting smog, combined with typical dreary British weather, meant regular days of London “fog”.

C SINGAPORE: The Lion City
There’s a straightforward reason why Singapore is referred to as the Lion City. Its Malay name, Singapura, is derived from Sanskrit, with “singa” meaning “lion” and “pura” meaning “city”. Another suggestion, though, is based on a legend that tells a tale of a prince who decided to build the city after catching a glimpse of a lion, thought to be a sign of good fortune. Lions, however, have never lived in this part of the world, so the animal was most likely a Malayan tiger.

D PARIS: The City of Lights
Although often considered a romantic destination, the City of Love is also known as the City of Lights, but there’s some debate as to why. One theory evolves from the fact that Paris was the birthplace of the Age of Enlightenment. Another bases itself around the idea that the French capital was one of the first European cities to illuminate dark streets in the bid to prevent night-time crime. Whatever the truth, 20,000 light bulbs transform the Eiffel Tower in the evenings today.

E MUMBAI: The City of Dreams
The commercial capital of India and also the home of Bollywood’s movie industry, Mumbai attracts budding entrepreneurs, actors and, it would appear, anyone with a dream. People flock to the bustling city, despite its already huge population, believing anything is possible here. Optimistic that opportunities abound, hopefuls call their home the City of Dreams.

F NEW YORK: The Big Apple
This has little to do with healthy Americans eating one of their “five a day”, but refers more to horse racing. Back in the 1920s, a sports writer repetitively used the phrase in his newspaper column about jockeys and races. It became even more popular after a tourism campaign in the 1970s, which used the fruity name.

G ROME: The Eternal City
The nickname of Italy’s capital can be traced back to ancient times, when self-assured Romans convinced themselves that they’d always live in a thriving city. Inhabitants watched other empires rise and fall but refused to accept Rome would face a similar crushing fate. The empire was eternal, they insisted, and would last forever.`;

const tolstoyPassage = `Leo Tolstoy and the technological revolution: an uneasy embrace

The famous Russian writer Leo Tolstoy enjoyed using new inventions like cameras, gramophones, and telephones. However, he was never completely sure if the technological revolution was a positive development.

14)______ During his lifetime, he saw the arrival of railroads, photography, movies, sound recording, typewriters, and electricity. 15)______

Tolstoy was very excited about the first photographic experiments. In 1856, Sergey Levitsky, who is considered the father of Russian photography, made the first photos of Tolstoy, which were printed on paper. 16)______ They are Ivan Turgenev, Ivan Goncharov, Alexander Ostrovsky and others.

Later, Tolstoy visited photography studios and had formal portraits taken, which basically were the first “business cards” that he even attached to letters when exchanging photos with his pen pals, such as Alexander Herzen.

In 1862, Tolstoy took his first self-portrait. 17)______ His wife, Sofia Andreyevna, signed the card, “I took a picture of myself.”

Photography became an obsession for Tolstoy, and even today, no writer's archive can boast of so many pictures. 18)______ She was also very fond of taking photos and it was her preferred hobby for more than 20 years. She even developed the films herself.

An entire series of psychological portraits was made by Tolstoy's secretary and friend, Vladimir Chertkov. 19)______ Those were some of Tolstoy's last photos, taken in 1910, and turned into GIFs by the State Tolstoy Museum.

What was the great Russian writer and thinker’s opinion about technological innovations and their usefulness? Did he think they were an important part of mankind’s advancement? 20)______ He concluded that technical development is necessary only if its purpose is to benefit mankind. “When people’s lives are immoral and their relations are based not on love but on egoism, all technical improvements - the increase in human’s power over nature, such as steam, electricity, telegraph, all kinds of machines, gunpowder, dynamite - give the impression of dangerous toys placed into the hands of children,” Tolstoy wrote in his diary in 1903.`;

const tolstoyOptions = [
  "a) He was able to experience all these inventions for himself.",
  "b) To do this, he needed two horses to pull his huge and heavy camera equipment.",
  "c) Having lived to the age of 82, Tolstoy’s life crossed the turn of the 19th and 20th centuries, which was an era of industrialization and technological progress.",
  "d) The author of “War and Peace” was concerned about the moral aspect of progress.",
  "e) His main concern was whether art could truly represent human experience.",
  "f) Here, the still very young writer is depicted alone and in the company of other authors who wrote for the popular literary magazine, Sovremennik.",
  "g) The writer’s intense feelings are evident in them.",
  "h) In many ways Tolstoy's wife helped to feed his passion for photography.",
];

const foodPassage = `One of the many roles of a food photographer is to take pictures of delicious meals and fresh food for menus, advertisements, and the _______________(1 - the materials used to wrap or protect products for sale, often including boxes and plastic) that covers our goods in supermarkets. But how exactly do they keep ice cream _______________(2 - a state of matter that has a definite shape and volume) for hours on end during a photoshoot, and fresh produce such as apples and lemons shiny?

Perhaps not surprisingly, the food you see in most images _______________(3 - without doubt) wouldn’t taste as good as you’d expect it to. Much of it is fake, with alternative, _______________(4 - food that cannot be eaten because it is unsafe or unfit for consumption) products being used instead of real food. In fact, hours are often spent on preparing the ‘food’, so it looks as realistic as possible, while just minutes are spent on taking the actual pictures.

It is said some of the most _______________(5 - something that happens frequently or is widely accepted by many people) used tricks behind the scenes include using cardboard to add _______________(6 - the measurement of how tall something is) to burgers or replacing milk with white glue to _______________(7 - guarantee) it has the bright colour and creamy appearance consumers expect to see.`;

const landmarkOptions = [
  "A Windsor Castle",
  "B Hadrian’s Wall",
  "C Tower Bridge",
  "D Big Ben",
  "E Edinburgh Castle",
  "F The Giant’s Causeway",
  "G Clifton Suspension Bridge",
  "H Warwick Castle",
  "I Blackpool Tower",
];

export function official2025ForGrade(grade: Shared2025Grade) {
  const listeningItems = [
    ["01", "Which person associates the smell with a feeling of reassurance about their current life?", ["1","2","3","4","5"], "1", "speaker matching"],
    ["02", "Which person mentions that the smell is a combination of two distinct things?", ["1","2","3","4","5"], "4", "speaker matching"],
    ["03", "Which person links the smell to a memory of waiting for someone?", ["1","2","3","4","5"], "2", "speaker matching"],
    ["04", "Which person says the smell helps them regain a sense of self-confidence?", ["1","2","3","4","5"], "5", "speaker matching"],
    ["05", "Which person says the smell instantly brings back feelings of childhood exploration?", ["1","2","3","4","5"], "5", "speaker matching"],
    ["06", "Which person says that this smell helps them stop trying to impress others and be their real self?", ["1","2","3","4","5"], "3", "speaker matching"],
    ["07", "Which person connects the smell to a memory from their first job?", ["1","2","3","4","5"], "4", "speaker matching"],
    ["08", "Speaker 1 used to eat bread while doing their homework.", ["T","F"], "T", "true/false detail"],
    ["09", "Speaker 2 would often wait for their brother inside the temple.", ["T","F"], "F", "true/false detail"],
    ["10", "Speaker 2 feels the scent helps them slow down and relax.", ["T","F"], "T", "true/false detail"],
    ["11", "Speaker 3 links the smell to a single, specific memory.", ["T","F"], "F", "true/false detail"],
    ["12", "Speaker 3 believes the smell helps them to be less concerned about what other people think.", ["T","F"], "T", "true/false detail"],
    ["13", "Speaker 4 finds the combination of smells from their first job easy to forget.", ["T","F"], "F", "true/false detail"],
    ["14", "Speaker 5 currently lives in a rural area where they can often experience the smell.", ["T","F"], "F", "true/false detail"],
    ["15", "Farza gained her retail plant experience when she", ["a) worked in a shop in her hometown.","b) was employed on a farm in Australia.","c) realised there were not enough green spaces in her city."], "a", "multiple-choice detail"],
    ["16", "Farza says her business has grown quickly because", ["a) she spends a lot of money on marketing.","b) she posts a lot on social media.","c) she has a famous customer."], "c", "multiple-choice detail"],
    ["17", "When asked about starting a business, Farza says in her opinion, you should", ["a) be flexible.","b) be decisive.","c) have leadership skills."], "a", "multiple-choice detail"],
    ["18", "What does Farza enjoy most about running her own business?", ["a) Taking time off when she wants to.","b) Having a good income.","c) Learning new skills."], "c", "multiple-choice detail"],
    ["19", "What does Farza say is the most difficult thing for her about running a business?", ["a) Sometimes mistakes can be expensive.","b) It can be hard to trust her own decisions.","c) She often compares herself to others."], "b", "multiple-choice detail"],
    ["20", "What’s Farza’s next plan for her business?", ["a) To increase the number of staff.","b) To open a large shop in the city.","c) To sell a wider variety of products."], "c", "multiple-choice detail"],
  ] as const;

  const listening = set(`g${grade}-2025-listening`, "Listening · Взлёт 2025/2026", "listening",
    listeningItems.map(([id,text,options,answer,subskill], index) => item(grade, "listening", id, text, [...options], answer, subskill, {
      type: index < 7 ? "matching" : index < 14 ? "true-false" : "multiple-choice",
      instruction: index < 7
        ? "Task 1. Part 1. You will hear five speakers talking about scents. For questions 1–7, choose from the speakers (1–5)."
        : index < 14
          ? "Task 1. Part 2. Listen again. For questions 8–14, decide whether the statements are True (T) or False (F)."
          : "Task 2. Listen to an interview with Farza Abad. For questions 15–20, choose the best answer (a, b or c).",
      groupId: index < 14 ? `g${grade}-2025-listening-scents` : `g${grade}-2025-listening-farza`,
      feedback: `Official task: ${taskUrl} · key: ${answerUrl} · script: ${scriptUrl}`,
    })),
    { audioSrc: audioUrl, audioMode: "file" }
  );

  const cityQuestions = [
    ["01", "Which nickname refers to a city whose name has a direct translation from the ancient language?", ["A","B","C","D","E","F","G"], "C"],
    ["02", "Which nickname was inspired by the confidence of its ancient inhabitants in its permanent power?", ["A","B","C","D","E","F","G"], "G"],
    ["03", "Which nickname is built on a specific number of prominent geographical features?", ["A","B","C","D","E","F","G"], "A"],
    ["04", "Which nickname was named after a prince's likely mistaken sighting of an animal?", ["A","B","C","D","E","F","G"], "C"],
    ["05", "Which nickname originated from the world of sports journalism before being popularised by advertisers?", ["A","B","C","D","E","F","G"], "F"],
    ["06", "Which nickname was given to a city because of air pollution caused by burning a common fossil fuel for home heating?", ["A","B","C","D","E","F","G"], "B"],
    ["07", "Which nickname belongs to a city whose iconic landmark lights up every evening?", ["A","B","C","D","E","F","G"], "D"],
    ["08", "According to the text, what is a common challenge for commuters in Moscow due to its geography?", ["a) Frequent flooding in the city centre.","b) Navigating the complex network of seven rivers.","c) The strenuous nature of moving across its hilly terrain.","d) The high cost of living on the main hills."], "c"],
    ["09", "The nickname \"The Big Smoke\" for London primarily resulted from", ["a) the famous London fog that occurs naturally.","b) the smoke from the Great Fire of London in 1666.","c) the historical burning of waste in the city's outskirts.","d) the widespread domestic and industrial use of coal."], "d"],
    ["10", "What mismatch does the text point out regarding Singapore's nickname, \"The Lion City\"?", ["a) The name was chosen by colonists, not by the local population.","b) The animal seen by the prince could hardly be a lion.","c) The city's symbol is actually a merlion, a mythical creature.","d) Lions were once common but were hunted to extinction."], "b"],
    ["11", "According to the text, what are the two main theories behind Paris's nickname, \"The City of Lights\"?", ["a) Its romantic atmosphere and its beautiful sunsets.","b) Its famous artists and its intellectual history.","c) Its role in the Age of Enlightenment and its early use of street lighting.","d) The sparkling Eiffel Tower and its bright city squares."], "c"],
    ["12", "Mumbai's nickname, \"The City of Dreams,\" is most directly attributed to its role as", ["a) the political capital of India.","b) a centre for spiritual and religious enlightenment.","c) a capital of commerce and the Bollywood film industry.","d) the oldest continuously inhabited city in the country."], "c"],
    ["13", "According to the text, why did ancient Rome become known as \"The Eternal City\"?", ["a) Because its leaders promised it would have eternal power.","b) Because its people were convinced it would never fall or be destroyed.","c) Because it was the largest and most powerful city at the time.","d) Because it had more historical monuments than any other place."], "b"],
  ] as const;
  const tolstoyAnswers = ["c","a","f","b","h","g","d"];

  const reading = set(`g${grade}-2025-reading`, "Reading · Взлёт 2025/2026", "reading", [
    ...cityQuestions.map(([id,text,options,answer], index) => item(grade, "reading", id, text, [...options], answer, index < 7 ? "matching detail" : "multiple-choice detail", {
      type: index < 7 ? "matching" : "multiple-choice",
      instruction: index < 7
        ? "Task 1. Part 1. Read the texts about city nicknames. For questions 1–7, choose the correct text (A–G)."
        : "Task 1. Part 2. For questions 8–13, choose the answer (a, b, c or d) which fits best according to the texts.",
      groupId: `g${grade}-2025-reading-city-nicknames`,
      passage: cityPassage,
    })),
    ...tolstoyAnswers.map((answer, index) => item(grade, "reading", String(index + 14).padStart(2,"0"), `Gap ${index + 14}`, tolstoyOptions, answer, "text cohesion", {
      type: "matching",
      instruction: "Task 2. Seven sentences have been removed from the text about Leo Tolstoy. Choose from sentences a–h the one which fits each gap 14–20. There is one extra sentence.",
      groupId: `g${grade}-2025-reading-tolstoy`,
      passage: tolstoyPassage,
    })),
  ]);

  const foodAnswers = ["packaging","solid","certainly","inedible","commonly","height","ensure"];
  const idiomRows = [
    ["08", "As a lifelong city dweller, I felt ______ in the rural area.", "like a fish out of water"],
    ["09", "Finishing the entire project by tomorrow is______, but we'll do our best.", "a tall order"],
    ["10", "Let's ______ the living room by adding some colourful cushions and new artwork.", "jazz up"],
    ["11", "Our new online booking system has had a few ______, but the IT team is fixing them.", "teething problems"],
    ["12", "When I'm sad, it's great to have my sister as ______ .", "a shoulder to cry on"],
    ["13", "The children grew up______; it feels like just yesterday they were starting school.", "in the blink of an eye"],
  ] as const;
  const landmarks = [
    ["14", "It was inspired by the landmark in the capital of a European country and lets the visitors enjoy the skyline of the coastal resort. The maintenance of the construction is considered to be one of the most difficult jobs in the UK.", "I"],
    ["15", "The construction has a clearance of about 30 m to allow tall sailing ships to pass. It took over 30 years to build it, with numerous difficulties including protests and lack of money.", "G"],
    ["16", "The story goes that the landmark was built as a result of a competition between an Irish and a Scottish heroes. A lake and an island were also formed in that fight according to the legend. The geological version says that it was formed after a volcano eruption: the lava formed over 40,000 pillars.", "F"],
    ["17", "This landmark is about 19 centuries old and was built to the orders of the Roman emperor. One of its forts provides useful information about life at the time, which was inscribed on the wooden tablets.", "B"],
    ["18", "Built on top of an extinct volcano, the landmark dominates the skyline and attracts the tourists. One of the world’s biggest military shows takes place there. Part of it, the 12th Century Chapel, is today the oldest building in the city.", "E"],
    ["19", "The construction of the landmark took some years longer than it was planned. Located in the hustle and bustle of the city, it goes by the name of one of its parts, but in fact it bears the name of one of the monarchs.", "D"],
    ["20", "The landmark was built under William the Conqueror and occupied an advantageous position near the capital. It has been rebuilt and modified by succeeding monarchs many times. It was badly damaged in the blaze and it took several years and a large sum of money to undo the damage.", "A"],
  ] as const;

  const useOfEnglish = set(`g${grade}-2025-use-of-english`, "Use of English · Взлёт 2025/2026", "use-of-english", [
    ...foodAnswers.map((answer,index) => item(grade, "use-of-english", String(index+1).padStart(2,"0"), `Gap ${index+1}`, [], answer, "crossword vocabulary", {
      type: "gap-fill",
      instruction: "Task 1. Read the food photography text and fill gaps 1–7 with the words defined in the clues.",
      groupId: `g${grade}-2025-uoe-food-photography`,
      passage: foodPassage,
    })),
    ...idiomRows.map(([id,text,answer]) => item(grade, "use-of-english", id, text, [], answer, "idioms", {
      type: "gap-fill",
      instruction: "Task 2. Match the parts of the idioms and use the correct idiom in sentences 8–13. Two idioms are not needed.",
      groupId: `g${grade}-2025-uoe-idioms`,
      rule: "Complete the sentence with the full fixed idiomatic expression.",
    })),
    ...landmarks.map(([id,text,answer]) => item(grade, "use-of-english", id, text, landmarkOptions, answer, "cultural knowledge matching", {
      type: "matching",
      instruction: "Task 3. Match descriptions 14–20 to landmarks A–I. Two names are not needed.",
      groupId: `g${grade}-2025-uoe-landmarks`,
    })),
  ]);

  return { listening, reading, "use-of-english": useOfEnglish } as const;
}
