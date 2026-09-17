import type { QuestionBankItem, QuestionSet, QuestionType, Section } from "../types.ts";

export type Shared2024Grade = 9 | 10;

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2024/2025, 9–10 классы";

function item(
  grade: Shared2024Grade,
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
    id: `g${grade}-2024-${section}-${id}`,
    grade,
    year: 2024,
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
    acceptedAnswers: answer ? [answer.toLowerCase()] : [],
    points: 1,
    explanation: answer ? "Ответ подтверждён официальным ключом." : "Writing проверяется учителем по официальным критериям.",
    tags: ["official", "2024", "vzlet", "9-10-shared"],
    needsReview: !answer,
    ...extra,
  };
}

function set(id: string, title: string, section: Section, items: QuestionBankItem[], extra: Partial<QuestionSet> = {}): QuestionSet {
  return { id, title, section, instruction: `Выполни официальный раздел ${title}.`, items, ...extra };
}

const sportsPassage = `Unusual National Sports

A Glíma is by far the oldest form of wrestling in Iceland. The most widespread version of the sport is Brokartök glíma, in which two wrestlers attempt to trip and throw each other by grasping a belt worn by their opponent. To win, a wrestler must make his opponent touch the ground with a part of his body between the elbow and the knee. When they are fighting wrestlers should always look over each other’s shoulders, because it is considered more gentlemanly to wrestle by touch and feel than by sight. This form of glíma has always been a friendly recreational sport, but there are other versions which are played much more violently.

B Hurling is an outdoor sport played mainly in Ireland. Players use an axe-shaped wooden stick, called a hurley, to hit a small ball between the other team’s goalposts, either over or under the crossbar. Fewer points are scored if the ball goes over the crossbar. The ball can be caught in the hand and carried for no more than four steps, or hit in the air or on the ground with the stick, a foot or an open hand. A player who wants to carry the ball further than three steps has to bounce or balance it on the end of the stick. No special clothing or padding is worn by players, but a plastic helmet with a faceguard is recommended.

C The official national sport of Argentina is Pato, a game which is played on horseback and combines elements of two other sports: polo and basketball. The sport consists of two teams of four members each. Teams fight for possession of a ball which has six conveniently sized handles, and score by throwing the ball through vertically positioned rings, located at the top of three-metre-high poles. The winning team is the one with the most goals scored after six periods of eight minutes. The word “pato” is the Spanish for duck, as in the past, instead of using a ball, a live duck was used inside a basket.

D Lacrosse is an outdoor team sport in which players use netted sticks to pass and catch a hard rubber ball. The aim is to score goals by propelling the ball into the opponent’s goal. The team which scores more goals wins. Lacrosse is Canada’s national summer sport and is also becoming more and more popular in the USA. Each team is composed of ten players: three attackers, three midfielders, three defenders and one goaltender. In men’s lacrosse, players wear protective equipment on their heads, shoulders, arms and hands.

E Tejo is a Colombian sport in which players throw a metallic plate weighing around two kilograms through the air to try to hit a clay-filled box with gunpowder in the middle. When the disc hits this target, there is a loud explosion. Whichever team causes more explosions wins. Turmeque, a much more ancient version of the sport, has been played for over 500 years by the indigenous groups living in the different parts of Colombia. In the modern game players use a metal disc rather than one made of gold or stone. Nowadays in Colombia it is very common to find professional tejo teams in the major cities and towns. Most teams are sponsored by local companies.`;

const silkPassage = `The Silk Road is a network of ancient trade paths that was once the main route connecting the East to the West. 14.__________ To get into Europe, merchants and traders had to pass through hard-to-reach Russian locales, and these routes can still be retraced today. Here’s what you need to know to get the most out of one of the world’s most epic trips.

The trade route was formerly established sometime during BC times, and the journey could be treacherous at times. 15. __________ Originally, it started in Xi’an and traced the Great Wall of China into Afghanistan. From there, the road passed through Middle Eastern and Mediterranean countries and then onto Europe. Trading routes grew and adapted to the demands of trade. 16. __________ They then connected to maritime routes that joined Oceania, Africa and parts of Asia to the northern hemisphere.

It was initially created to transport goods and ideas between China and the Roman Empire, which then grew to encompass surrounding regions. Everything from silk to wool to precious metals to religion and disease travelled the network of roads. 17. __________ It is believed the Silk Route transported Christianity and Buddhism into China from India and transmitted the plague into Europe.

One of the ways to pass from Asia into Europe is through southern Russia, which is full of dramatic scenery that remains unchanged by time. It passes through the Great Steppes, which you should also pass on the Trans-Siberian. This vast belt of savanna and scrublands stretches across China into Hungary as well as parts of Siberia, Lake Baikal and the Urals. It then snakes through into the North Caucasus. 18. __________ This way you can discover the Silk Road’s nooks and crannies and get even further off the beaten track.

As the Silk Route snakes through Russia, it meanders into southern Siberia and then across to the region’s southwest. Lake Baikal sits to the west and the Altai Mountains border the south. Lake Baikal is the biggest freshwater lake in the world and is spectacular any time of year. 19. __________

Between southern Siberia and the North Caucasus, there is the Republic of Kalmykia in the Volga region. 20. __________ It is an under-explored region, and for those intrepid travellers, the republic has natural beauty and a unique culture to discover. Throughout the republic, there are pagodas and temples to unearth, and if you are lucky you could chance upon one of the many religious festivals that are celebrated in the region.

As it continues further south, the Silk Route reaches North Caucasus. This part of the Caucasus is boarded by the Sea of Azov and the Black Sea on the west and the Caspian Sea to the east. There are a handful of Caucasus Republics on the Silk Route’s path which are famous for their beautiful nature and unique traditions.`;

const silkOptions = [
  "A Southern Siberia is also home to one of the world’s oldest mountain ranges, the Urals, which have a wealth of hiking opportunities to explore.",
  "B It was also how culture, technology and belief systems were passed between cultures and countries along the Silk Road, which impacted on how civilisations evolved.",
  "C It was due to volatile international relations between nations along the way.",
  "D If you’re keen on retracing this ancient route in Russia, its best to do so by car and a solid pair of walking boots.",
  "E As it extended westwards from the ancient commercial centres of China, the overland, intercontinental Silk Road divided into northern and southern routes.",
  "F It is the only Buddhist republic in Russia.",
  "G The well-worn roads snake around hulking mountain ranges and through remote plains as they traverse centuries-old scenery in some of the most remote parts of the globe.",
  "H Eventually, a matrix of paths connected far-flung nations across Europe, the Middle East, Central Asia, and Southeast Asia.",
];

const aiPassage = `How AI is Helping Duolingo Democratize Education
by Sophie Wodzak

We believe AI is the best way to scale education and level the playing field for all, regardless of their circumstances. While one-on-one 4._______________ (teaching or giving help to someone in a specific subject to improve their skills) is out of reach for most people, AI enables Duolingo to offer a personalized experience that adapts to each learner.

It can help us create educational and testing content quickly, and 2._______________ (carefully select and organize items for display) and recommend resources for learners that are at a really specific difficulty level given a learner's ability. In the context of assessment, AI can create adaptive test experiences that 5._______________ (improve a skill or ability through practice and refinement over time) in on a test taker’s proficiency more efficiently than previously possible, making for a quicker, more streamlined testing experience.

This is not about replacing teachers, or 3._______________ (tearing something apart quickly and forcefully) things up and starting again. It’s about using technology to its fullest to improve 1._______________ (the results or effects of an action or an event). Using AI, Duolingo is able to provide access to quality education in places where students don't have access to good schools and teachers, and enables students to certify their English proficiency in places where accessing test centers is either challenging, or impossible.

Generative AI will evolve in ways we can’t yet imagine, but we know it will help push our vision to 8._______________ (create a copy or reproduction of something) the experience of a human tutor using AI. We are committed to 7._______________ (using something effectively for a specific purpose) its capabilities to improve the lives of learners and test takers all over the world, and those 6.__________ (the good aspects or advantages of a situation or thing) should not be forgotten!`;

const idiomOptions = [
  "A stick-in-the-mud",
  "B like an oven",
  "C a storm in a teacup",
  "D hit the hay",
  "E down-to-earth",
  "F steal our thunder",
  "G over the moon",
  "H can't see the forest for the trees",
  "I hit rock bottom",
  "J upper-crust",
];

const filmOptions = [
  "A Miss Peregrine’s Home for Peculiar Children",
  "B The Chronicles Of Narnia Films",
  "C Matilda",
  "D Pan’s Labyrinth",
  "E Lemony Snicket’s A Series Of Unfortunate Events",
  "F Fantastic Beasts",
  "G A Wrinkle In Time",
  "H Stardust",
];

export function official2024ForGrade(grade: Shared2024Grade) {
  const listeningRows: Array<[string, string, string[], string, QuestionType?]> = [
    ["01", "Most meat-eating animals find that it is more effective to hunt in ___.", [], "silence"],
    ["02", "Deaf children may have problems learning to speak if they have never been ___ to language.", [], "exposed"],
    ["03", "Children under four or five don’t need to make much ___ to learn a language.", [], "effort"],
    ["04", "Most young mammals can ___ their basic needs to their mother.", [], "communicate"],
    ["05", "Children in different ___ are likely to produce different kinds of babble.", [], "countries"],
    ["06", "The child’s ___ voluntary syllable may be a result of imitating sounds around them.", [], "first"],
    ["07", "The ___ between mother and child may have contributed to the development of language.", [], "relationship"],
    ["08", "The origins of human language are fully understood.", ["T", "F"], "f", "true-false"],
    ["09", "The first spoken languages were of much practical use.", ["T", "F"], "f", "true-false"],
    ["10", "There are some documented cases proving that people who never heard any kind of spoken language before the age of five cannot learn to speak at all.", ["T", "F"], "t", "true-false"],
    ["11", "Children who are born deaf may never be able to learn to speak.", ["T", "F"], "f", "true-false"],
    ["12", "Children under 5 years of age can only learn one language at a time.", ["T", "F"], "f", "true-false"],
    ["13", "Newborn babies use involuntary sounds to inform their mothers of their basic needs.", ["T", "F"], "t", "true-false"],
    ["14", "According to the speaker, in the past a solar eclipse was seen as a", ["A spiritual experience", "B scientific event", "C popular attraction"], "a"],
    ["15", "From the interview we learn that the dark spot of a solar eclipse is", ["A a randomly occurring event", "B hard to explain", "C the shadow of the earth’s satellite"], "c"],
    ["16", "Scientists view an eclipse as", ["A an exceptionally beautiful phenomenon", "B a chance for scientific study", "C an effect of the moon on the sun"], "b"],
    ["17", "The fact that eclipses occur rarely is explained by the size of the", ["A moon", "B sun", "C earth"], "a"],
    ["18", "English astronomer Edmund Halley was the first person who", ["A discovered a comet", "B predicted an eclipse accurately", "C calculated the date of the next eclipses"], "b"],
    ["19", "In 1868 Janssen and Lockyer ________ during the eclipse.", ["A discovered the sun’s atmosphere", "B discovered a new element, helium", "C discovered Mercury and Venice"], "b"],
    ["20", "During the eclipse of 1878 James Watson ________.", ["A discovered ‘Vulcan’, the so-called ‘lost’ planet", "B proved that Vulcan didn’t exist", "C made an erroneous claim"], "c"],
  ];

  const listening = set(
    `g${grade}-2024-listening`,
    "Listening · Official 2024",
    "listening",
    listeningRows.map(([id, text, options, answer, type]) => item(grade, "listening", id, text, options, answer, "Listening comprehension", { ...(type ? { type } : {}), groupId: id <= "13" ? `g${grade}-2024-listening-language` : `g${grade}-2024-listening-eclipse` })),
    { script: "source_materials/grade-9/2024/9-10 скрипт (текст) аудиозаписи.pdf" },
  );

  const sportQuestions = [
    "is based on a traditional native sport?",
    "makes the wearing of protective equipment optional?",
    "disapproves of players looking at what they are doing?",
    "often receives funding from business?",
    "is not played all the year round?",
    "has a version played mainly for pleasure and relaxation?",
    "has a ball which is designed to be picked up easily?",
  ];
  const sportAnswers = ["e", "b", "a", "e", "d", "a", "c"];
  const readingItems: QuestionBankItem[] = sportQuestions.map((text, index) => item(
    grade,
    "reading",
    String(index + 1).padStart(2, "0"),
    `Which sport ${text}`,
    ["A Glíma", "B Hurling", "C Pato", "D Lacrosse", "E Tejo"],
    sportAnswers[index],
    "multiple matching",
    { type: "matching", groupId: `g${grade}-2024-reading-sports`, ...(index === 0 ? { passage: sportsPassage } : {}) },
  ));
  readingItems.push(
    item(grade, "reading", "08", "What is the most popular form of wrestling in Iceland?", ["A Brokartök glíma", "B Glíma", "C Hurling", "D Pato"], "a", "reading comprehension", { groupId: `g${grade}-2024-reading-sports` }),
    item(grade, "reading", "09", "What is the objective of the Icelandic sport of Glíma?", ["A To trip and throw the opponent by grasping his belt", "B To score points by hitting a ball with a stick", "C To make the opponent touch the ground with a part of their body between the elbow and knee", "D To catch a ball in the air and carry it for four steps"], "c", "reading comprehension", { groupId: `g${grade}-2024-reading-sports` }),
    item(grade, "reading", "10", "Hurley is", ["A a small ball", "B a wooden stick", "C a crossbar", "D an outdoor sport"], "b", "vocabulary in context", { groupId: `g${grade}-2024-reading-sports` }),
    item(grade, "reading", "11", "In the sport of Pato, what is used to score goals?", ["A A live duck", "B A ball with six handles", "C A basket with a live duck inside", "D A goalpost with a crossbar"], "b", "reading comprehension", { groupId: `g${grade}-2024-reading-sports` }),
    item(grade, "reading", "12", "How many players are there on the field in Lacrosse?", ["A 5 players", "B 7 players", "C 10 players", "D 20 players"], "d", "reading comprehension", { groupId: `g${grade}-2024-reading-sports` }),
    item(grade, "reading", "13", "What is the main difference between the modern version of Tejo and the ancient version, Turmeque?", ["A The use of metal discs instead of gold or stone discs", "B The number of players on each team", "C The location where the game is played", "D The way the game is scored"], "a", "reading comprehension", { groupId: `g${grade}-2024-reading-sports` }),
  );
  const silkAnswers = ["g", "c", "h", "b", "d", "a", "f"];
  for (let index = 0; index < 7; index++) {
    readingItems.push(item(
      grade,
      "reading",
      String(index + 14),
      `Choose the sentence which fits gap ${index + 14}.`,
      silkOptions,
      silkAnswers[index],
      "gapped text",
      { type: "matching", groupId: `g${grade}-2024-reading-silk`, ...(index === 0 ? { passage: silkPassage } : {}) },
    ));
  }
  const reading = set(`g${grade}-2024-reading`, "Reading · Official 2024", "reading", readingItems);

  const uoeItems: QuestionBankItem[] = [];
  const aiAnswers = ["outcomes", "curate", "ripping", "tutoring", "hone", "positives", "harnessing", "replicate"];
  for (let index = 0; index < 8; index++) {
    uoeItems.push(item(
      grade,
      "use-of-english",
      String(index + 1).padStart(2, "0"),
      `Complete gap ${index + 1}.`,
      [],
      aiAnswers[index],
      "crossword vocabulary",
      { groupId: `g${grade}-2024-uoe-ai`, ...(index === 0 ? { passage: aiPassage } : {}) },
    ));
  }
  const idiomRows: Array<[string, string]> = [
    ["After a week of non-stop work, I was eager to __________ and catch up on some much-needed sleep.", "d"],
    ["The company's sales had been declining for months, and it seemed like they had finally __________.", "i"],
    ["The charity gala was attended by the __________ society, and we were thrilled to be a part of it.", "j"],
    ["My friend is always so negative and never wants to try new things - he's really a __________.", "a"],
    ["The rival company tried to __________ by announcing their new product launch before ours.", "f"],
    ["The city was __________ during the heatwave, with temperatures soaring over 100 degrees Fahrenheit and people struggling to find shade.", "b"],
  ];
  idiomRows.forEach(([text, answer], index) => uoeItems.push(item(grade, "use-of-english", String(index + 9).padStart(2, "0"), text, idiomOptions, answer, "idioms", { groupId: `g${grade}-2024-uoe-idioms` })));

  const filmRows: Array<[string, string]> = [
    ["It is about a young girl who is an absolute genius and is neglected by her parents. Her cruel principal makes her life miserable. However, things take a turn for the positive when she realizes that she has telekinetic powers.", "c"],
    ["The film follows Jacob, a teenager who finds a magical school where he encounters strange children who possess special abilities. He soon realizes that he is caught in a dangerous trap that is a cross between different worlds.", "a"],
    ["It is about a young man who has to retrieve a fallen star by venturing into unknown territory to impress his love. However, he quickly realizes that he has to protect a young woman from a king and an evil witch who are after her magic.", "h"],
    ["The movie involves three young orphans who are sent off to live with a distant relative. However, their relative turns out to be cruel and schemes to inherit what the eldest sibling is supposed to receive. As the children escape and decide to live with their uncle, their evil relative is not far behind. Watch how the orphans bounce from one caretaker to the next with hopes of living a normal life.", "e"],
    ["The movie follows British siblings as they unravel a magical world when they open a wardrobe. It is complete with a talking lion, friendly fauns, evil witches, and a beautiful prince. Experience the journey of the siblings as they grow older and make sense of the world while navigating the mysterious world.", "b"],
    ["It follows Meg, her friend, and her brother as they make their way through space and time to locate her father who happens to be a scientist. The movie is just as adventurous as Harry Potter and will not disappoint you.", "g"],
  ];
  filmRows.forEach(([text, answer], index) => uoeItems.push(item(grade, "use-of-english", String(index + 15), text, filmOptions, answer, "country studies / film matching", { type: "matching", groupId: `g${grade}-2024-uoe-films` })));
  const useOfEnglish = set(`g${grade}-2024-use-of-english`, "Use of English · Official 2024", "use-of-english", uoeItems);

  const writing = set(`g${grade}-2024-writing`, "Writing · Official 2024", "writing", [
    item(
      grade,
      "writing",
      "01",
      "Write a 200–250 word review of an amazing museum, art gallery or exhibition in your area. Include a headline, general information, what there is to see and do, and whether you recommend it to other teenagers.",
      [],
      "",
      "Writing",
      {
        type: "writing",
        points: 20,
        needsReview: true,
        wordLimit: { min: 200, max: 250 },
        requirements: [
          "Give a headline to your review",
          "Give general information: collections, location and opening hours",
          "Use and underline at least two passive structures",
          "Use and underline at least two idioms",
          "Give at least two reasons why teenagers should visit",
        ],
      },
    ),
  ]);

  return { listening, reading, "use-of-english": useOfEnglish, writing } as const;
}
