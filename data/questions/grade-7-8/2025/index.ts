import type { QuestionBankItem, QuestionSet, Section } from "../../types.ts";

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2025/2026";
const officialTaskUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/task_4473_1764686259.pdf";
const officialAnswerUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/answer_4482_1764686555.zip";
const officialAudioUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4476_1764686336.mp3";
const officialScriptUrl = "https://reg.storage.yandexcloud.net/public/olymp_tasks/script_4479_1764686465.pdf";

type ItemInput = Omit<QuestionBankItem, "grade" | "year" | "stage" | "source" | "sourceLabel" | "platformLabel" | "section">;

function item(section: Section, data: ItemInput): QuestionBankItem {
  return {
    grade: "7-8",
    year: 2025,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section,
    ...data,
  };
}

const keyExplanation = "Ответ подтверждён официальным ключом «Взлёта» 2025/2026.";
const officialTags = ["official", "vzlet", "2025", "grade-7-8"];

const museumsInstruction = "Task 1. Listen to a talk about visiting museums and mark statements 1–7 with T if they are true and F if they are false. You will hear the recording twice.";
const museumsRows: Array<[string, string]> = [
  ["The man used to think that museums were enjoyable places.", "F"],
  ["Amanda believes that museums should allow visitors to interact with the exhibits.", "T"],
  ["The Louisiana museum is located far from the sea.", "F"],
  ["The Louisiana museum is a place where you can relax outdoors.", "T"],
  ["The Experimentarium focuses on science and technology.", "T"],
  ["Visitors to the music museum in Brussels are not given any equipment.", "F"],
  ["When visitors come to a musical instrument, they can hear it play.", "T"],
];

const actorInstruction = "Task 2. Listen to an interview with Anna, who has just finished Drama School. For questions 8–15, choose the best answer (A, B or C). You will hear the recording twice.";
const actorRows: Array<[string, string[], string]> = [
  ["What does Anna say about her decision to become an actor?", ["A She made a sudden decision.", "B It happened gradually over time.", "C She decided to become an actor after her first school play."], "B"],
  ["What is a drawback of performing at her school?", ["A The plays are too simple.", "B Critical feedback is limited.", "C She doesn’t get enough stage time."], "B"],
  ["How did Anna learn to speak multiple languages?", ["A She studied them at Drama School.", "B She took special language courses.", "C She learned them within her family environment."], "C"],
  ["What is the advantage of speaking multiple languages?", ["A It helps Anna understand different acting techniques.", "B It allows her to read scripts in their original language.", "C It increases the number of places where she can work."], "C"],
  ["What is the main advantage of working as an actor?", ["A It is enjoyable and creative.", "B It is rewarding.", "C It is easy to find a job."], "A"],
  ["What kind of acting career interests Anna most?", ["A Being a theatre actress.", "B Film and television acting.", "C Directing plays."], "A"],
  ["What does Anna think about directing compared to acting?", ["A She prefers directing to acting.", "B She enjoys both directing and acting.", "C She has tried directing and she likes acting more."], "C"],
  ["What is Anna’s parents’ reaction to her interest in stunt performing?", ["A They are happy for her.", "B They are worried.", "C They are indifferent."], "B"],
];

export const grade78Listening2025: QuestionSet = {
  id: "vsosh-7-8-2025-listening",
  title: "Listening · Взлёт 2025/2026",
  section: "listening",
  instruction: "Complete both official Listening tasks. The original official audio is played twice.",
  audioSrc: officialAudioUrl,
  audioMode: "file",
  items: [
    ...museumsRows.map(([text, answer], index) => item("listening", {
      id: `vsosh-7-8-2025-listening-${index + 1}`,
      skill: "Listening",
      subskill: "true/false detail comprehension",
      difficulty: "medium",
      type: "true-false",
      instruction: museumsInstruction,
      text,
      options: ["T", "F"],
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "museums", "true-false"],
      needsReview: false,
      groupId: "g78-2025-listening-museums",
      feedback: `Official task: ${officialTaskUrl} · key: ${officialAnswerUrl} · script: ${officialScriptUrl}`,
    })),
    ...actorRows.map(([text, options, answer], index) => item("listening", {
      id: `vsosh-7-8-2025-listening-${index + 8}`,
      skill: "Listening",
      subskill: "multiple-choice detail comprehension",
      difficulty: "medium",
      type: "multiple-choice",
      instruction: actorInstruction,
      text,
      options,
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "young-actor", "multiple-choice"],
      needsReview: false,
      groupId: "g78-2025-listening-young-actor",
      feedback: `Official task: ${officialTaskUrl} · key: ${officialAnswerUrl} · script: ${officialScriptUrl}`,
    })),
  ],
};

const sportsInstruction = "Task 1. Read texts A–H about sports competitions and match pictures 1–6 to the texts. There are two texts you do not need to use. The on-screen sports drawings are a visual recreation of the official paper pictures; the texts and key are official.";
const sportsOptions = [
  "A We were behind from the start because our strongest rower was out due to injury. The other team kept a steady rhythm and pulled ahead, maintaining perfect timing with their strokes. Our coach shouted instructions to keep us focused, and we all dug deeper, pushing our limits. In the final stretch, we increased our stroke rate but still finished second.",
  "B Watching the sport was thrilling from beginning to end. The winner cleared the bar at an impressive height on his third try after two close attempts. One competitor’s pole snapped mid-jump, causing disappointment, but he applauded his opponents with sportsmanship. The spectators were silent before each jump.",
  "C The competition went on for hours with athletes trying to clear greater heights each time. Many missed their jumps once or twice before succeeding. The gold medalist cleared the bar on her last try, celebrating wildly with the crowd. This sport amazes because so much depends on technique and timing. Even a small mistake can mean failure.",
  "D It was a close contest. Our best athlete was nervous, but he steadied his aim and finally scored a perfect bullseye. The opposing team complained about the wind, but our shots were true. When the judge announced the final scores, we had won by just two points. Everyone cheered.",
  "E It was exciting to see the athletes in action! One athlete made an incredible leap, landing nearly a meter farther than everyone else on the runway. Another athlete fouled by stepping outside the takeoff zone and was eliminated from the competition. The winner showed both power and speed, combining strength with perfect timing.",
  "F The competition was dramatic and intense. Our best thrower launched the spear farther than anyone expected. His confident opponent failed in his final attempt. The event requires strength, technique, and accuracy; athletes run to build momentum before throwing, aiming for the perfect angle and release. The flying spear adds excitement and suspense.",
  "G It was a challenging match from the start. Our best player was struggling after a hard week, but we believed she could win. Laura started strong, serving three aces in the first game, showing great power. Her opponent responded well, winning the second game. However, the backhands really belonged to Laura. When the umpire called “game, set, match to Miss Wood,” everyone, including me, was almost in tears. I hope Laura will do well in future matches.",
  "H Our team had a bad start because the first runner lost valuable time passing the baton. The second runner made up ground with a smooth handover and strong sprint. In the final leg, our fastest runner sprinted past the competitors in dramatic fashion. We won by just a fraction of a second!",
];
const sportsAnswers = ["A", "C", "E", "H", "F", "B"];
const sportsAlts = [
  "Rowing race: two rowers in a racing boat on the water.",
  "High jump: an athlete clearing a horizontal bar without a pole.",
  "Long jump: an athlete jumping from the runway into a sand pit.",
  "Relay race: runners exchanging a baton on the track.",
  "Javelin: an athlete throwing a long spear-shaped implement.",
  "Pole vault: an athlete using a long pole to clear a high bar.",
];

const bolshoiPassage = `THE BOLSHOI THEATRE\n\nThe Bolshoi Theatre is located in the centre of Moscow. It is one of the most famous and respected opera and ballet theatres in the world. The building is very beautiful and large. It has eight large columns in front and looks over Theatre Square. The history of the Bolshoi Theatre is interesting and shows how Moscow grew as a cultural and historical city.\n\nThe construction of the theatre dates back to 1776. Prince Peter Urusov built it after Empress Catherine II allowed him to organize theatrical performances and masquerades. At first, the theatre was called the Petrovsky Theatre because it was near Petrovka Street. Sadly, the building was destroyed by fire three times: in 1780, 1805, and 1853. It had to be rebuilt several times since.\n\nThe current building was constructed between 1821 and 1824 by architects Andrei Mikhailov and Joseph Bové and reconstructed in 1853. There is a statue of Apollo in a chariot on top of the building’s front. Inside, the walls are decorated with red and gold. There are beautiful paintings on the ceiling and a large crystal chandelier. The theatre can hold over 2,100 people and is famous for its amazing acoustics, which are perfect for opera and ballet shows.\n\nThroughout its history, the Bolshoi Theatre faced challenges. It was damaged during the Napoleonic War in 1812 and needed important repairs. The theatre was very important for Russian culture because it hosted the first performances of many famous operas and ballets, showing Russian artistic talent to the rest of the world.\n\nThe latest renovation of the Bolshoi Theatre carried out at the beginning of the 21st century made the building beautiful again and also added modern equipment for artists and visitors. Today, the Bolshoi Theatre is a symbol of Russian culture. It hosts world-famous opera and ballet shows and attracts visitors from all over the world.\n\nVisiting the Bolshoi Theatre is a special experience. The performances are excellent, and the building itself is beautiful. Its history and style show the heart of Russian culture. The Bolshoi Theatre remains a place where tradition and creativity meet in the centre of Moscow.`;

const bolshoiTf: Array<[string, string]> = [
  ["The Bolshoi Theatre is situated on the outskirts of Moscow.", "F"],
  ["The theatre was originally named after a nearby street.", "T"],
  ["It took more than two years to construct the present building of the Bolshoi Theatre.", "T"],
  ["The theatre’s interior has a modern design with minimal decoration.", "F"],
  ["The theatre is known for carrying excellent sound, making it ideal for performances.", "T"],
  ["The Bolshoi Theatre has been renovated only once in its history.", "F"],
];

const bolshoiMc: Array<[string, string[], string]> = [
  ["What is the main function of the Bolshoi Theatre?", ["A Staging plays.", "B Performing opera and ballet.", "C Holding music festivals."], "B"],
  ["Who allowed Prince Peter Urusov to create the theatre?", ["A Empress Catherine I.", "B Empress Catherine II.", "C Tsar Nicholas II."], "B"],
  ["When was the current building of the Bolshoi Theatre constructed?", ["A Between 1776 and 1780.", "B After the Napoleonic War in 1812.", "C In the early 19th century."], "C"],
  ["What challenge did the Bolshoi Theatre face in its early history?", ["A Political opposition.", "B Lack of funding.", "C Destruction by fire."], "C"],
  ["What decorative element is located on the front top of the building?", ["A A statue of a Greek god in a chariot.", "B The Russian imperial eagle.", "C A golden dome."], "A"],
  ["What does the interior decoration of the theatre look like?", ["A Modern minimalist design with bright colours.", "B Red and gold decorations with ceiling paintings.", "C Byzantine mosaics and marble columns."], "B"],
  ["What is the role of the Bolshoi Theatre in Russian culture?", ["A It has been an important showcase for Russian artistic achievements.", "B It has served as a symbol of military strength.", "C It has been significant mainly for its architecture."], "A"],
  ["How has the Bolshoi Theatre adapted to modern times?", ["A By completely changing its architectural style.", "B By focusing mainly on contemporary performances.", "C By adding modern equipment while preserving its beauty."], "C"],
];

export const grade78Reading2025: QuestionSet = {
  id: "vsosh-7-8-2025-reading",
  title: "Reading · Взлёт 2025/2026",
  section: "reading",
  instruction: "Complete all three official Reading tasks.",
  items: [
    ...sportsAnswers.map((answer, index) => item("reading", {
      id: `vsosh-7-8-2025-reading-${index + 1}`,
      skill: "Reading",
      subskill: "matching visual context to text",
      difficulty: "medium",
      type: "matching",
      instruction: sportsInstruction,
      text: `Picture ${index + 1}`,
      options: sportsOptions,
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "sports", "matching", "visual-adaptation"],
      needsReview: false,
      groupId: "g78-2025-reading-sports",
      imageSrc: `/images/vzlet/2025/grade-7-8/sports-${index + 1}.svg`,
      imageAlt: sportsAlts[index],
      feedback: "The six sports drawings are an accessibility-friendly visual recreation; the official texts, numbering and key are unchanged.",
    })),
    ...bolshoiTf.map(([text, answer], index) => item("reading", {
      id: `vsosh-7-8-2025-reading-${index + 7}`,
      skill: "Reading",
      subskill: "true/false detail comprehension",
      difficulty: "medium",
      type: "true-false",
      instruction: "Task 2. Read the text about the Bolshoi Theatre and for questions 7–12 choose T (True) or F (False).",
      text,
      options: ["T", "F"],
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "bolshoi", "true-false"],
      needsReview: false,
      groupId: "g78-2025-reading-bolshoi-tf",
      passage: bolshoiPassage,
    })),
    ...bolshoiMc.map(([text, options, answer], index) => item("reading", {
      id: `vsosh-7-8-2025-reading-${index + 13}`,
      skill: "Reading",
      subskill: "multiple-choice detail comprehension",
      difficulty: "medium",
      type: "multiple-choice",
      instruction: "Task 3. Read the text about the Bolshoi Theatre again and for questions 13–20 choose the best answer (A, B or C) according to the text.",
      text,
      options,
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "bolshoi", "multiple-choice"],
      needsReview: false,
      groupId: "g78-2025-reading-bolshoi-mc",
      passage: bolshoiPassage,
    })),
  ],
};

const beaversPassage = `BEAVERS\n\nBeavers are really gifted creatures with an 1. ________________ (USUAL) ability to transform their environment. They build dams with 2. _______________ (CREATIVE), using sticks, mud, and stones to create safe homes in rivers and streams. Their dam-building process begins by 3. _______________ (CAREFUL) selecting trees and branches, which they cut down using their strong teeth. Then they use these materials to block the flow of water, creating a base for their dam. They make the dam stronger by adding layers of mud, leaves, grass, and stones. These dams can be very big, sometimes several feet high and hundreds of feet long, capable of holding back water to form a pond that protects them from predators.\n\nBuilding such dams is not an easy task, and beavers face many difficulties, including finding enough 4. ________________ (SUIT) materials and fixing the dam when it gets damaged. Despite these challenges, beavers show incredible problem-solving abilities. Their talent is so impressive that 5. ________________ (SCIENCE) have officially recognized their dam-building as a form of 6. ________________ (NATURE) engineering. Watching beavers work shows us how creative and smart these animals can be. The animals’ ability to shape their habitat is 7. _______________ (TRUE) exceptional.`;
const beaverRows: Array<[string, string]> = [
  ["1. (USUAL)", "unusual"],
  ["2. (CREATIVE)", "creativity"],
  ["3. (CAREFUL)", "carefully"],
  ["4. (SUIT)", "suitable"],
  ["5. (SCIENCE)", "scientists"],
  ["6. (NATURE)", "natural"],
  ["7. (TRUE)", "truly"],
];

const idiomRows: Array<[string, string]> = [
  ["The boss told him to stop dragging his ___________ and finish the project quickly.", "feet"],
  ["I have a notebook to keep ___________ of all my meetings and deadlines.", "track"],
  ["After that unexpected meeting, my thoughts were all over the ___________, and I couldn’t focus on my homework.", "place"],
  ["The word ___________ fast that the new cafe in town serves excellent coffee.", "spread"],
  ["If you think I’m responsible for the mistake, you’re barking up the ___________ tree.", "wrong"],
  ["Using a flip phone is considered old ___________ these days.", "hat"],
  ["Steve’s new job was confusing and no one had time to help him learn, so he had to sink or ___________.", "swim"],
];

const famousPeople = [
  "A Alexander Fleming",
  "B Alexander Graham Bell",
  "C Robert Falcon Scott",
  "D Francis Drake",
  "E Geoffrey Chaucer",
  "F Charles Dickens",
  "G David Livingstone",
  "H William Shakespeare",
];
const biographyRows: Array<[string, string]> = [
  ["This person was a famous English writer during the Victorian era. He was born in Portsmouth and began working at the age of 12 because his family had financial problems. He wrote stories about difficult lives of poor people in 19th-century England. His stories had interesting characters, humor, and important lessons about society’s problems.", "F"],
  ["This person was a Scottish scientist who discovered penicillin in 1928. This antibiotic revolutionized medicine by effectively treating bacterial infections. His discovery saved countless lives and he was awarded the Nobel Prize in Physiology or Medicine in 1945.", "A"],
  ["This person was a British Royal Navy officer and explorer who led expeditions to Antarctica. He is famous for his heroic but tragic 1912 expedition to the South Pole, where he and his team reached the pole but died on the return journey. His explorations contributed greatly to polar science.", "C"],
  ["This person was a Scottish-born inventor, scientist, and teacher. He is best known for inventing the first practical telephone in 1876. He also contributed to many other inventions in communication, medical devices, and aeronautics.", "B"],
  ["This person was an English playwright, poet, and actor, widely considered the greatest writer in the English language and one of the world’s most influential dramatists. He began his successful career in London at the Globe Theatre, writing around 39 plays, 154 sonnets, and several poems. Much about his personal life remains a mystery.", "H"],
  ["This person was an English sea captain and explorer. He was the first Englishman to sail around the globe (1577–1580). He played a key role in naval battles against the Spanish Armada and expanded English influence overseas.", "D"],
];

export const grade78UseOfEnglish2025: QuestionSet = {
  id: "vsosh-7-8-2025-use-of-english",
  title: "Use of English · Взлёт 2025/2026",
  section: "use-of-english",
  instruction: "Complete all three official Use of English tasks.",
  items: [
    ...beaverRows.map(([text, answer], index) => item("use-of-english", {
      id: `vsosh-7-8-2025-uoe-${index + 1}`,
      skill: "Use of English",
      subskill: "word formation",
      difficulty: "medium",
      type: "gap-fill",
      instruction: "Task 1. Fill in the correct word derived from the word in brackets.",
      text,
      options: [],
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "beavers", "word-formation"],
      needsReview: false,
      groupId: "g78-2025-uoe-beavers",
      passage: beaversPassage,
      rule: "Transform the word in brackets so that it fits the grammar and meaning of the sentence.",
    })),
    ...idiomRows.map(([text, answer], index) => item("use-of-english", {
      id: `vsosh-7-8-2025-uoe-${index + 8}`,
      skill: "Use of English",
      subskill: "idioms",
      difficulty: "medium",
      type: "gap-fill",
      instruction: "Task 2. For items 8–14, fill in the gaps with the missing parts of the idioms. In the paper version the words are hidden in a word search; the online trainer keeps the same seven official gaps and key.",
      text,
      options: [],
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "idioms", "visual-adaptation"],
      needsReview: false,
      groupId: "g78-2025-uoe-idioms",
      rule: "Complete the fixed idiomatic expression with the missing word.",
    })),
    ...biographyRows.map(([text, answer], index) => item("use-of-english", {
      id: `vsosh-7-8-2025-uoe-${index + 15}`,
      skill: "Use of English",
      subskill: "cultural knowledge matching",
      difficulty: "medium",
      type: "matching",
      instruction: "Task 3. For questions 15–20, match the names of the famous people (A–H) to their biographies. There are two names you do not need to use.",
      text,
      options: famousPeople,
      acceptedAnswers: [answer],
      points: 1,
      explanation: keyExplanation,
      tags: [...officialTags, "famous-people", "matching"],
      needsReview: false,
      groupId: "g78-2025-uoe-famous-people",
    })),
  ],
};

export const grade782025Sets = {
  listening: grade78Listening2025,
  reading: grade78Reading2025,
  "use-of-english": grade78UseOfEnglish2025,
} as const;
