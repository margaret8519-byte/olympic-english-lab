import { makeSet, official9 as q } from "../shared.ts";

const unknown = "";

const listeningRows = [
  ["01", "Anne used to shoot arrows from a bow made of ___ when she was a child.", []],
  ["02", "Anne only had time to read about the ___ of archery before the beginner’s course.", []],
  ["03", "Anne’s archery course took place in a ___.", []],
  ["04", "Anne was surprised that learning to ___ properly was so difficult.", []],
  ["05", "The teacher told Anne she needed to relax her ___.", []],
  ["06", "During the breaks, Anne was happy to look at the ___ and talk to other people.", []],
  ["07", "Anne is trying to persuade her ___ to do an archery course with her.", []],
  ["08", "In former days kitesurfers didn’t pay so much attention to protection equipment as at present.", ["T", "F"]],
  ["09", "The competition in Fiji is a yearly event.", ["T", "F"]],
  ["10", "During one of her distance events Maggie met a lot of boats on her way.", ["T", "F"]],
  ["11", "Maggie’s parents were her first kitesurfing trainers.", ["T", "F"]],
  ["12", "According to Maggie’s opinion, kitesurfing needs step-by-step advancing.", ["T", "F"]],
  ["13", "Maggie’s partner works as a kitesurfing coach at a local club.", ["T", "F"]],
  ["14", "Maggie says it took her a long time to learn to kitesurf because", ["A the equipment wasn't widely available.", "B it was hard to find the right assistance.", "C she needed to build up her strength."]],
  ["15", "In Maggie’s opinion, since she began kitesurfing", ["A suitable locations have been more clearly identified.", "B attitudes to some aspects of safety have changed.", "C participants have become better informed about sea conditions."]],
  ["16", "Maggie hopes that by competing in Fiji, she will", ["A encourage others to take up the sport.", "B have the chance to pick up some new moves.", "C be invited to start organising future events."]],
  ["17", "During one distance event, Maggie became slightly worried when", ["A she had to switch to different equipment.", "B she experienced a great deal of pain.", "C she lost sight of the people helping her."]],
  ["18", "Maggie thinks her success is due to the fact that", ["A the sport suits her character very well.", "B her family have given her a lot of support.", "C she has the opportunity to practise regularly."]],
  ["19", "Maggie says that some new kitesurfers she's met", ["A are likely to develop the sport in interesting ways.", "B are unwilling to focus on basic techniques first of all.", "C are too worried about the rules of the sport."]],
  ["20", "What does Maggie hope to do in the future?", ["A find sources of investment for her sport", "B continue to compete at a high level", "C set up a kitesurfing school"]],
] as const;

export const grade9Listening2023 = makeSet(
  "g9-2023-listening",
  "Listening · Official 2023",
  "listening",
  listeningRows.map(([id, text, options]) => q(2023, "listening", id, text, [...options], unknown, "Listening comprehension")),
  { audioMode: "file", audioSrc: "/audio/grade-9/2023/listening.mp3", script: "/audio/grade-9/2023/listening.mp3" },
);

const technologyPassage = `Student life and technology, by Debra Mallin.\nA Last Saturday, as my grandfather drove me and my sister home from a dinner to celebrate his birthday, he got frustrated at not being able to remember the name of the singer of a song he’d just heard on the radio. Without a second thought I grabbed my smartphone, searched for the song and found the name, Bob Dylan. For me and my friends, this is a completely natural course of action, but it totally astonished my grandfather, who didn’t understand how I had checked the information so quickly. My sister and I laughed and explained, but afterwards, it made me think about how much I depend on technology.\nB The list of the ways I use technology is endless: writing, planning, socialising, communicating and shopping, to name a few. When I reflected on its impact on my education, I saw that, for my fellow students and me, technology had been significant in many ways. Returning to the story of my grandfather and the smartphone, he asked me more about how I used it and about university life. He said he thought we had an easy life compared to previous generations. My sister caught my eye and we exchanged a smile. But whereas she was thinking our grandfather was just being a typical 65-year-old, I could see his point.\nC Not only are we lucky enough to have the same educational benefits as those of previous generations, we have so many more as well. We still have walk-in libraries available to us, and I can see why some students choose to find and use resources in these distraction-free locations. However, the only option for studying used to be sitting in these libraries with as many books from your reading list as you could find. At universities, interaction between students and university staff is another area that has changed considerably with developments in technology. We can have face-to-face time with our tutors when we need it, and also communicate using our electronic gadgets from the comfort of our homes, or on the bus. The most popular means of doing this is via instant messaging or social media — email is often considered too slow, and it has become unacceptable for messages to be unanswered for any length of time. While this puts an extra strain on the university's academic support team, who usually have to answer the queries as they come in, we students are greatly benefitted.\nD It’s important that we remember to appreciate how much the advances in technology have given us. Electronic devices such as tablets, smartphones, and laptops are now standard equipment in most classrooms and lecture halls, and why shouldn’t they be? The replacement of textbooks with tablets allows students the luxury of having up-to-date, interactive and even personalised learning materials, with the added benefit of them not costing the earth.\nE When we compare the student life of the past and that of the present day, it is tempting to focus on the obvious differences when it comes to technology. In actual fact, students are doing what they've always done: embracing the resources available and adapting them in ways which allow them to work more efficiently and to live more enjoyably. The pace of change in technology continuously gathers speed, so we have to value each innovation as it happens.`;

const matchQuestions = [
  "a personal opinion drawing a change in lifestyle?",
  "other possibilities for the younger generation besides those used by people in the past?",
  "a variety of means of utilising technology in everyday life?",
  "easy access to different modern educational resources for students nowadays?",
  "a situation that provoked the writer’s consideration about the importance of technology in her life?",
  "the widening and simplifying of communication between students and their teachers?",
  "a skill that surprised her relative greatly?",
];
const reading = matchQuestions.map((text, index) => q(2023, "reading", String(index + 1).padStart(2, "0"), `Which paragraph relates to ${text}`, ["A", "B", "C", "D", "E"], unknown, "Paragraph matching", { groupId: "g9-2023-reading-technology", passage: index === 0 ? technologyPassage : undefined }));
const technologyMc = [
  ["What does the writer illustrate by describing the incident in the car?", ["A The older generation’s frustration at people's dependence on technology", "B The difference in attitudes to technology between two generations", "C How technology helps different generations communicate"]],
  ["What did the writer think of her grandfather's comment in Paragraph B?", ["A It showed how out-of-date he was.", "B It had an element of truth in it.", "C It made her feel sorry for him."]],
  ["What does the writer say about getting study resources from libraries?", ["A She considers libraries more preferable places for study than home.", "B She thinks libraries are limited by the quantity of resources they can store.", "C She appreciates that people can still study in libraries if they want to."]],
  ["What disadvantage of new technology does the writer mention in Paragraph C?", ["A Students cannot escape from dealing with university issues.", "B Sometimes slow internet connections make communication difficult.", "C A heavier workload is created for teaching staff at the university."]],
  ["What is the purpose of the question ‘Why shouldn't they be?’ in Paragraph D?", ["A To express an opinion", "B To indicate uncertainty", "C To make a criticism"]],
  ["What is the writer’s conclusion about students today in the final paragraph?", ["A Their lives are too different to compare.", "B They behave similarly to previous generations of students.", "C They take advantage of resources more quickly than previous generations."]],
] as const;
technologyMc.forEach(([text, options], index) => reading.push(q(2023, "reading", String(index + 8).padStart(2, "0"), text, [...options], unknown, "Reading comprehension", { groupId: "g9-2023-reading-technology" })));

const theatrePassage = `Technical Theatre. When we go to the theatre, we go to see the actors and their performance; the stage is the central focus point. But there is a whole team of people whom we never see and without whom no production would be possible. Stage manager Adam James explains how he became involved.\nI was 12 when I first saw a show in my local leisure centre. Everything came in about ten lorries and they built a theatre from scratch. (14) ___ I got to know the stage management team and shadowed them while they worked. After watching the team and talking to the stage manager I decided that was what I wanted to do. (15) ___ However, I really wanted to start working as part of a stage management team. Once I was 14 I got work experience and sometimes missed school to work at the theatre.\nI left school at 16 and got a job as an assistant stage manager in London. Later I did freelance work in Cornwall and toured the country. (16) ___ Touring was intense but fun. On Mondays we arrived at eight, opened the lorries and spent the day building the show. In the afternoon the cast arrived and I showed them where to make quick costume changes. (17) ___ Once the show started, I watched, supervised and let it happen around us. As stage manager I was first and last on stage. After the show I checked everything and noted what needed repairing.\nAfter two years touring I returned to London to study technical theatre, but realised it wasn't useful to me. I had learnt more from working. (18) ___ I was already established, so I left college and got a theatre job. Firsthand experience is more important than qualifications. (19) ___ I did more freelance work and now work for a production company.\nUp to 20 people can work on a performance, in lighting, sound, wardrobe, wigs, props, carpentry and stage management. We also look after the actors. The hardest thing I have done was control 2,500 primary schoolchildren. I like my work, although I dislike the hours and disruption to my personal life. (20) ___ But I recommend it: it is enjoyable, always different and there is something exciting and beautiful about live theatre.`;
const theatreOptions = [
  "A It was a course for people who didn’t know anything about the theatre.",
  "B The more I found out about technical theatre the more interested I became.",
  "C Also there's quite a lot of instability and insecurity to the job and the money is not always good.",
  "D While the cast were getting ready, we would get on with any necessary maintenance jobs.",
  "E I was very curious as I watched the whole thing being put together and I found it hugely exciting.",
  "F Working in a large theatre is much more difficult because there are so many more people to organise.",
  "G The work was quite sporadic but the money was good; in one month I could earn enough to last me six months.",
  "H Theatres want people with proven ability; what interests them most on your CV is your last job.",
];
for (let index = 0; index < 7; index++) reading.push(q(2023, "reading", String(index + 14), `Choose the sentence for gap ${index + 14}.`, theatreOptions, unknown, "Missing sentences", { groupId: "g9-2023-reading-theatre", passage: index === 0 ? theatrePassage : undefined }));
export const grade9Reading2023 = makeSet("g9-2023-reading", "Reading · Official 2023", "reading", reading);

const uoe: ReturnType<typeof q>[] = [];
const idiomGaps = ["expanding by leaps and ___", "full ___ ahead", "put their noses to the ___", "___ for the moon", "___ or swim", "drive hard ___", "ears to the ___", "starting from ___"];
idiomGaps.forEach((text, index) => uoe.push(q(2023, "use-of-english", String(index + 1).padStart(2, "0"), `Complete the idiom: ${text}.`, [], unknown, "Idioms", { groupId: "g9-2023-uoe-idioms" })));
const ravenPassage = `A life with birds. For nearly 17 years David Cope has worked as one of the Tower of London’s Yeoman Warders. The Tower is famous for its ravens. David was fascinated by the birds and when he was (9) ___ the post of Raven Master he had no (10) ___ in accepting it. He is aware that he is (11) ___ a tradition. David (12) ___ about four hours a day to their care. He can (13) ___ a close eye on them all the time. (14) ___, David’s wife was not keen on life in the Tower, but she too will be sad to leave.`;
const ravenRows = [
  ["09", "Complete gap 9.", ["A awarded", "B applied", "C presented", "D offered"]],
  ["10", "Complete gap 10.", ["A regret", "B delay", "C hesitation", "D choice"]],
  ["11", "Complete gap 11.", ["A holding", "B maintaining", "C surviving", "D lasting"]],
  ["12", "Complete gap 12.", ["A devotes", "B spends", "C passes", "D provides"]],
  ["13", "Complete gap 13.", ["A hold", "B have", "C keep", "D put"]],
  ["14", "Complete gap 14.", ["A Firstly", "B First of all", "C At first", "D First"]],
] as const;
ravenRows.forEach(([id, text, options], index) => uoe.push(q(2023, "use-of-english", id, text, [...options], unknown, "Lexico-grammatical cloze", { groupId: "g9-2023-uoe-ravens", passage: index === 0 ? ravenPassage : undefined })));
const monarchs = ["A William I (1066–1087)", "B Queen Victoria (1837–1901)", "C Queen Elizabeth I (1558–1603)", "D James I (1603–1625)", "E George VI (1936–1952)", "F Henry VIII (1509–1547)", "G Queen Anne (1702–1714)", "H Charles I (1625–1649)"];
const monarchRows = [
  "Came to the throne when a brother abdicated; provided leadership during the Second World War; the Commonwealth replaced the British Empire.",
  "Born in Normandy; won the crown at Hastings; imposed a French-speaking aristocracy and commissioned the White Tower.",
  "Presided over the English Renaissance and Reformation; separated England from Rome; had six spouses.",
  "Became King of Scotland at 12 and later gained the English throne; the Gunpowder Plot occurred during this reign.",
  "Loved the arts, rejected constitutional monarchy, fought Parliament and was executed for high treason.",
  "Ruled an empire on which the sun never set; the reign is associated with industrialisation and imperial expansion.",
];
monarchRows.forEach((text, index) => uoe.push(q(2023, "use-of-english", String(index + 15), text, monarchs, unknown, "Cultural knowledge", { groupId: "g9-2023-uoe-monarchs" })));
export const grade9UseOfEnglish2023 = makeSet("g9-2023-use-of-english", "Use of English · Official 2023", "use-of-english", uoe);

export const grade9Writing2023 = makeSet("g9-2023-writing", "Writing · Official 2023", "writing", [q(2023, "writing", "01", "Write a story beginning: ‘When Max opened the letter, he was so excited that he started dancing around the room.’ The story must include a journey and a meeting.", [], unknown, "Writing", { type: "writing", points: 20, wordLimit: { min: 220, max: 250 }, requiredOpening: "When Max opened the letter, he was so excited that he started dancing around the room.", requirements: ["Give the story a title", "Use and underline one phrasal verb", "Include direct and indirect speech", "Give at least two details about the journey", "Give at least two facts about the meeting", "Describe feelings and emotions more than once"], needsReview: true })]);

export const grade9Official2023 = { listening: grade9Listening2023, reading: grade9Reading2023, "use-of-english": grade9UseOfEnglish2023, writing: grade9Writing2023 };
