import type { QuestionBankItem, QuestionSet, Section } from "../types.ts";

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2023/2024, 10 класс";

function item(
  section: Section,
  id: string,
  text: string,
  options: string[],
  answer: string,
  subskill: string,
  extra: Partial<QuestionBankItem> = {},
): QuestionBankItem {
  return {
    id: `g10-2023-${section}-${id}`,
    grade: 10,
    year: 2023,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section,
    skill: section === "use-of-english" ? "Use of English" : "Reading",
    subskill,
    difficulty: "advanced",
    type: options.length ? "multiple-choice" : "gap-fill",
    instruction: "Complete the official task in its original order.",
    text,
    options,
    acceptedAnswers: answer ? [answer.toLowerCase()] : [],
    points: 1,
    explanation: answer ? "Ответ сверён с исходным заданием и подтверждённым ключом/источником задания." : "Требуется проверка.",
    tags: ["official", "2023", "vzlet", "grade-10"],
    needsReview: !answer,
    ...extra,
  };
}

function set(id: string, title: string, section: Section, items: QuestionBankItem[]): QuestionSet {
  return { id, title, section, instruction: `Выполни официальный раздел ${title}.`, items };
}

const belukhaPassage = `Mount Belukha, located in the Altai Mountains of Siberia, is a place of immense intrigue and fascination. Renowned as one of the most enigmatic locations in the region, it is widely regarded as a gateway to Shambala, an elusive kingdom believed to exist beyond the Himalayas. This association with a mystical realm adds to the allure of the mountain and attracts a multitude of tourists and explorers each year.

Standing at an impressive altitude of over 4,500 metres, Belukha is the tallest peak in the Altai Mountains. Its name, derived from the local language, signifies its snow-covered peak that remains intact throughout the year. This striking beauty, surrounded by unspoiled forests, rivers, and lakes, has made it a favoured destination for outdoor enthusiasts. Hiking, skiing, and other activities are popular among visitors who seek adventure and a connection with nature.

However, what truly sets Belukha apart is its association with Shambala. According to ancient legends, Shambala is a concealed realm of serenity and enlightenment, accessible only to those with pure intentions. It is said to be governed by a wise and benevolent king possessing extraordinary spiritual powers. Many individuals firmly believe that Belukha serves as a portal to this mystical kingdom, offering a potential pathway to Shambala to those who ascend it with virtuous motives.

Scaling Belukha is no easy feat. It demands considerable physical endurance, technical expertise, and adequate preparation along with the appropriate equipment. The journey to its summit is challenging but rewarding. The panoramic view from the top is awe-inspiring, with breathtaking vistas of the surrounding landscape. The sense of accomplishment that comes with reaching the summit is beyond words.

Beyond its spiritual and natural significance, Belukha boasts a rich cultural heritage. Indigenous communities have revered it as a sacred site for countless generations, attributing numerous myths and legends to its existence. These stories add to the mystique and intrigue surrounding the mountain, further fueling the fascination of those who visit.

In conclusion, Belukha is a place that captivates the imagination. Whether one seeks spiritual enlightenment, thrills as an adventurer, or simply an appreciation for nature's wonders, this destination is an absolute must-visit. Its association with Shambala, its striking beauty, and its rich cultural heritage make it an enigmatic and alluring location in Siberia. Belukha offers an opportunity for exploration, self-discovery, and a connection with something greater than ourselves.`;

const belukhaQuestions: Array<[string, string[], string]> = [
  ['What does the name "Belukha" mean in the local language?', ["A Sacred", "B Mysterious", "C White", "D Enchanted"], "c"],
  ["What kind of activities can tourists do in the area of the mountain?", ["A Shopping and sightseeing", "B Sunbathing and swimming", "C Hiking and skiing", "D Fishing and hunting"], "c"],
  ["What is the connection between Belukha and Shambala?", ["A The mountain is considered a portal to the mystical realm of Shambala.", "B The mountain is located in the same area as Shambala.", "C The mountain is named after the ruler of Shambala.", "D The mountain is a symbol of peace and enlightenment like Shambala."], "a"],
  ["What is required to climb Belukha?", ["A A lot of money", "B Proper equipment and preparation", "C A special permit from the government", "D A guide who knows the way"], "b"],
  ["Why is the view from the top of Belukha breathtaking?", ["A Because it is the highest peak in the Altai Mountains.", "B Because it is covered in snow all year round.", "C Because it is a portal to Shambala.", "D Because it offers a panoramic view of the surrounding area."], "d"],
  ["What is the significance of Belukha to the local indigenous people?", ["A It is a popular tourist destination.", "B It is a sacred site.", "C It is a place of great natural beauty.", "D It is a symbol of their cultural heritage."], "b"],
  ["What kind of myths and legends are associated with Belukha?", ["A Stories of brave adventurers who climbed the mountain", "B Tales of mythical creatures that live on the mountain", "C Legends of the mountain's spiritual significance", "D Folktales about the local indigenous people"], "c"],
  ["Who will enjoy coming up Belukha?", ["A Only spiritual seekers", "B Only adventurers", "C Only nature lovers", "D Anyone who appreciates mystery and wonder"], "d"],
];

const extremePassage = `A. Wingsuit jumping, for the uninitiated, is a little like transforming yourself into a human flying squirrel: the suit has parachute-like flaps of fabric under the arms and between the legs that allow the wearer to ‘fly’ along with the wind. It’s a form of BASE jumping – BASE standing for building, antenna, span and Earth (as in the broad categories of very high things from which one can jump) – which is in itself incredibly risky, to phrase it mildly. One recent study found, for example, that 72 percent of the 106 BASE jumpers interviewed had witnessed an accident involving a fellow jumper.

B. So it makes sense to think that people who engage in these activities are taking foolish risks purely for the exhilaration of it all. But this isn’t an accurate depiction of the individuals Doctor Eric Brymer, a psychologist at Queensland University of Technology in Brisbane, Australia, has encountered in more than a decade of studying experienced extreme athletes. On the contrary, Brymer says his work has suggested that many extreme athletes are the opposite of impulsive; not only are they careful and thoughtful planners, but they actually avoid thrill-seekers ‘like the plague’.

C. When he began his work, he explained, most of the scientific literature on psychology and extreme sports linked the activity to a certain set of characteristics, ‘and not very good ones at that – thrill-seeking, hedonism, that they were doing this because they liked risk’. And yet, none of these things accurately described the people he’d met at the outdoor adventure company where he worked while in grad school. As he looked into it further, he found that the bulk of the research up to that point had been done on teenagers and young adults, who tend to be high in impulsivity and poor decision-making, anyway.

D. But when he conducted research specifically on experienced extreme sports enthusiasts, he found little evidence that participants are reckless. Brymer has found that ‘older’ extreme athletes – those who are past their mid-20s – exercise deep care in equal proportion to the high risk involved. ‘A lot of these people are highly intelligent people, methodological and systematical,’ Brymer said. Those he’s interviewed don’t take one spontaneous trip to the outdoor clothing store REI and then jump off a cliff; rather, they spend years studying the environment and the mechanics of, for example, parachutes, before taking any action, ‘in order to make it as safe as it possibly can be.’ If the approach is more thoughtful for these athletes than the rest of us might suspect, so are the motivations that drive them to extreme sports in the first place. They’re not just seeking an adrenaline rush, Brymer said: rather, what keeps many of them coming back is something akin to the flow-like state achieved through mindful meditation, one in which ‘you’re so in the moment that everything else drops away. You’re focused on the here and now.’

E. Dean Potter, a famous BASE jumper, once described it this way to sports channel ESPN: ‘My vision is sharper, and I’m more sensitive to sounds, my sense of balance and the beauty all around me … Something sparkles in my mind, and then nothing else in life matters.’ Athletes interviewed by Brymer have expressed similar sentiments. ‘The activity itself enables experiences that are beyond the everyday,’ Brymer said. ‘People talk about their senses being alive, about being able to see things much more clearly. It gives them a glimpse of what it means to be human, as in the capacities they have that we don’t tap into in everyday life.’ Another common misconception about extreme athletes is that they must have a weaker fear response than the rest of us, who might feel woozy just watching a video of Potter slack-lining in a Yosemite mountain range. ‘People assume because you’re doing things like BASE jumping, you have no fear,’ Brymer said. ‘In reality, fear is an important part of the experience.’ It isn’t about the absence of fear, or ignoring it when the feeling does creep in – rather, it’s about learning to use that feeling.

F. People tend to divide emotions into ‘good’ and ‘bad,’ and the unpleasant anxiety of fear means it gets placed in the ‘bad’ category. But that’s probably not the best way to think about the feeling. Fear wakes you up, making you more alert to the potential threats or things that could go wrong – all things that are very useful in a potentially dangerous situation. Brymer has interviewed BASE jumpers who say they don’t like to jump with people who aren’t afraid. If, when standing at the edge of a cliff, the jumper gets a little scared, this becomes a time to check in with the preparation work: their physical readiness, the environmental conditions, the equipment itself. If something isn’t quite right – if the wind isn’t blowing correctly, for instance – the seasoned extreme athlete will stop and come back another time.

G. But if, after ticking through that mental list, everything checks out, it’s time to push past that fear. ‘There seems to be a link between that experience of fear and being able to move through it with the proper knowledge and expertise and training,’ Brymer said. ‘Instead of fear stopping them, it gets turned into this way of saying, “Okay, I need to really pay attention and be serious here.”’ The presence of fear is, counterintuitively, what ultimately gives athletes ‘the ability to move through fear … it’s part of what allows them to have these experiences.’`;

const extremeParagraphOptions = ["A", "B", "C", "D", "E", "F", "G"];
const trueFalseNs = ["T", "F", "NS"];

const readingItems: QuestionBankItem[] = [
  ...belukhaQuestions.map(([text, options, answer], index) => item("reading", String(index + 1).padStart(2, "0"), text, options, answer, "reading comprehension", { groupId: "g10-2023-reading-belukha", ...(index === 0 ? { passage: belukhaPassage } : {}) })),
  item("reading", "09", "Choose the best title for the text about extreme sports.", ["A How to Be Fearless: The Key to Extreme-Sports Success", "B Controlling Fear Positively", "C The Psychology of Daredevils: Why They Seek Danger", "D The History of Extreme Sports"], "b", "main idea", { groupId: "g10-2023-reading-extreme", passage: extremePassage }),
  ...[
    ["10", "people’s views of extreme athletes do not match the reality", "b"],
    ["11", "experienced jumpers research a jump in great detail", "d"],
    ["12", "jumpers feel more alive and powerful", "e"],
    ["13", "early research into the personality of extreme sports people did not look at a wide range of people", "c"],
    ["14", "jumping helps people live in the moment", "d"],
  ].map(([id, text, answer]) => item("reading", id, `Which paragraph (A-G) contains: ${text}?`, extremeParagraphOptions, answer, "paragraph matching", { groupId: "g10-2023-reading-extreme", type: "matching" })),
  ...[
    ["15", "Wingsuit jumping is more dangerous than other forms of BASE jumping.", "ns"],
    ["16", "All people who enjoy extreme sports make quick and risky decisions.", "f"],
    ["17", "Poor decision-making is typical of young people.", "t"],
    ["18", "Extreme sports athletes are physically fit.", "ns"],
    ["19", "Extreme sports athletes do not suffer from fear.", "f"],
    ["20", "There are plenty of extreme sports videos online.", "ns"],
  ].map(([id, text, answer]) => item("reading", id, text, trueFalseNs, answer, "true / false / not stated", { groupId: "g10-2023-reading-extreme", type: "true-false" })),
];

export const grade10Reading2023Verified = set("g10-2023-reading", "Reading · Official 2023", "reading", readingItems);

const britainPassage = `The 19th Century Britain

The 19th century was a time of rapid change and progress. Great Britain was expanding by leaps and (1) _____, with new technologies and industries emerging at the drop of a hat. It was a time when people were starting from (8) _____ and taking risks to strike it rich.

One of the key industries that emerged during this time was the railway industry. The early birds who invested in this industry were able to get the jump on others and make a fortune. They knew the industry inside out and were able to drive hard (6) _____ when negotiating deals.

However, not everyone was successful in their ventures. Some start-ups failed due to stumbling blocks such as a lack of funding or competition from copycat businesses. But those who were able to fit the bill and adapt to changing circumstances were able to put their noses to the (3) _____ and succeed.

The country was full (2) _____ ahead with its industrial revolution, but there were also challenges to overcome. Workers faced difficult working conditions and long hours, and many had to (5) _____ or swim in order to survive. Despite these challenges, the country continued to (4) _____ for the moon and push forward with its progress.

In order to succeed, it was important to have one's ears to the (7) _____ and know what was happening in the industry and the market. Those who were able to take the bull by the horns and play things by ear were often the most successful.

Overall, the 19th century in Britain was a time when people had to work hard and be creative in order to succeed. Today, we can learn from the lessons of the past and continue to drive progress and innovation in our own lives and industries.`;

const jobPassage = `How do you choose the right job?

A few people decide early in life what they want to do and then follow a prescribed path of training to reach their 9) _________. More often, a young person takes the best job available, and that leads to a lifetime in a particular field. Of course, both who you know and what you know are important. Frequently an individual finds a job through a friend, relative or another helpful person. However, with a university degree as the minimum 10) _______ for many jobs and advanced training and qualifications a must in most professional fields what you know can be the ticket to a good job.

There is probably no single ‘right’ job for anybody. Out of the 11) ______ 20,000 types of occupations available in modern society, there are probably hundreds that you could perform well and find rewarding. Although circumstances 12) ______ one’s choices, there are still more possibilities than most people realise. Chance always plays a part in finding a job you like, but vocational counsellors believe that a person can improve the 13) _______ by analysing his or her ambitions, interests and 14) _______. One person may want to earn a lot of money. Others may set priority to being active, helping people or having a low risk of becoming unemployed. Personal interests, such as love of the outdoors or a fascination with computers, may point the way to a job a person enjoys and respects.`;

const monarchOptions = [
  "A William I (1066-1087)",
  "B Queen Victoria (1837-1901)",
  "C Queen Elizabeth I (1558-1603)",
  "D James I (1603-1625)",
  "E George VI (1936-1952)",
  "F Henry VIII (1509-1547)",
  "G Queen Anne (1702-1714)",
  "H Charles I (1625-1649)",
];

const uoeItems: QuestionBankItem[] = [];
const crosswordAnswers = ["bounds", "steam", "grindstone", "reach", "sink", "bargains", "ground", "scratch"];
const crosswordClues = [
  "long or high jumps (a noun in the plural form)",
  "the hot mist that forms when water boils",
  "a large round stone that turns like a wheel and is used for sharpening knives and tools",
  "to move your arm and hand to take or touch something",
  "to disappear below the surface of a mass of water",
  "something bought or offered at a low price (a noun in the plural form)",
  "the surface of the earth",
  "a small shallow cut",
];
crosswordAnswers.forEach((answer, index) => uoeItems.push(item("use-of-english", String(index + 1).padStart(2, "0"), `Complete gap ${index + 1}. Crossword clue: ${crosswordClues[index]}.`, [], answer, "idioms / crossword", { groupId: "g10-2023-uoe-britain", ...(index === 0 ? { passage: britainPassage } : {}) })));

const jobOptions = [
  ["A plan", "B goal", "C end", "D success"],
  ["A necessity", "B obligation", "C offer", "D requirement"],
  ["A expected", "B assessed", "C estimated", "D calculated"],
  ["A shorten", "B press", "C shrink", "D narrow"],
  ["A odds", "B difference", "C angles", "D favour"],
  ["A faculties", "B aptitudes", "C inclinations", "D tendencies"],
];
const jobAnswers = ["b", "d", "c", "d", "a", "b"];
jobOptions.forEach((options, index) => uoeItems.push(item("use-of-english", String(index + 9).padStart(2, "0"), `Choose the best word for gap ${index + 9}.`, options, jobAnswers[index], "lexico-grammatical cloze", { groupId: "g10-2023-uoe-job", ...(index === 0 ? { passage: jobPassage } : {}) })));

const monarchRows: Array<[string, string]> = [
  ["He/she came to the throne when their brother unexpectedly abdicated; provided leadership and strength during the Second World War; during his/her reign the Commonwealth of Nations replaced the British Empire.", "e"],
  ["Born in Normandy, a northern region of France, he/she later became one of Britain’s most influential monarchs; won his/her crown at the Battle of Hastings, thus putting an end to the Anglo-Saxon era; imposed a new aristocracy on England that was French in language and culture; during his/her early reign commissioned the White Tower, the central structure of the Tower of London.", "a"],
  ["Presided over the beginnings of the English Renaissance and the English Reformation; separated England from the Catholic church and declared himself/herself Head of the Church; notorious for having six spouses two of whom were executed; left a dangerously complicated succession problem.", "f"],
  ["At the age of 12, he became King of Scotland; later on gained the English throne; struggled throughout his reign to create a united and prosperous realm of Great Britain under the Stuart dynasty. The Gunpowder Plot took place during his reign.", "d"],
  ["He/she was a great lover of the arts and spent large sums on paintings; refused to accept the demands for a constitutional monarchy; fought the armies of English and Scottish parliaments in the English Civil War; became the first British monarch in history to be tried, convicted and executed for high treason.", "h"],
  ["He/she was said to own an empire so large that the sun never set on it; his/her reign was one of the longest in British history; the era of this monarch is associated with the Industrial Revolution, economic progress and the expansion of the British Empire.", "b"],
];
monarchRows.forEach(([text, answer], index) => uoeItems.push(item("use-of-english", String(index + 15), text, monarchOptions, answer, "cultural knowledge / matching", { groupId: "g10-2023-uoe-monarchs", type: "matching" })));

export const grade10UseOfEnglish2023Verified = set("g10-2023-use-of-english", "Use of English · Official 2023", "use-of-english", uoeItems);
