import { makeSet, official9 as q } from "../shared.ts";

const noKey = "";
const listeningPrompts = [
  "Gerald Durrell wrote more than ___ books about his life.",
  "Gerald thought other people didn’t take risks because they didn’t have enough ___.",
  "Although he was born in India, Gerald Durrell moved to Britain when his ___ died.",
  "From an early age, Durrell was a keen ___ of animals and insects.",
  "My Family and Other Animals is a book about Gerald Durrell's ___ adventures on Corfu.",
  "This best-selling book was later made into a TV ___.",
  "He was the founder of Jersey ___ as well as the World Wildlife Fund.",
  "His natural talent as a ___ and mimic helped his public speaking.",
  "Today’s ___ movement is largely the result of Gerald Durrell’s efforts.",
  "One side of his character was the good ___ which can be found in his books.",
  "Before travelling to another country, Anna always tries to talk to someone from that country.",
  "Anna used to pay serious attention to learning foreign languages at school.",
  "Anna is confident that she can communicate fairly easily.",
  "When visiting someone at home, it is fine to let them know you are anxious.",
  "Talking to people before visiting their country is always helpful because family traditions are similar.",
  "When Anna made a cultural mistake, she was grateful that her host was sympathetic.",
  "Anna’s mistake was to give a dozen roses, which turned out to be bad luck.",
  "To overcome culture shock, Anna tried to establish a routine.",
  "At the Lantern Festival, Anna wanted to participate and was not pleased merely to watch.",
  "After finishing her book about culture, Anna is keen to get feedback from people she knows.",
];
const listeningScript = `Gerald Durrell lived an extraordinary life and wrote about it in over 30 books. He said people did not have the courage to take a risk. Born in India, he moved with his family after the death of his father. From childhood he collected animals and insects. His adventures on Corfu were recorded in My Family and Other Animals, later made into a television series. He founded the World Wildlife Fund and Jersey Zoo. A natural storyteller with a gift for mimicry, he educated people through public speaking and books and helped inspire today’s ecology movement. His books are full of good humour.\n\nTravel writer Anna Bryant explains that guidebooks often focus on things to do rather than behaviour. Knowing someone from the country is ideal, but she rarely does. She tries local language, gestures or drawing and is confident messages usually get across. She sees little wrong with telling a host that you are nervous, but every family has its own traditions. Once she brought an unlucky number of flowers; an understanding host put her at ease. When living abroad, regular sleep and familiar food helped her overcome culture shock. At China’s Lantern Festival she wanted to join in but still enjoyed watching. She will not show anyone her unfinished book.`;
export const grade9Listening2022 = makeSet("g9-2022-listening", "Listening · Official 2022", "listening", listeningPrompts.map((text,index)=>q(2022,"listening",String(index+1).padStart(2,"0"),text,index<10?[]:["T","F","NS"],noKey,"Listening comprehension")),{script:listeningScript,audioMode:"speech"});

const fathersPassage = `What’s the best advice your father ever gave you?\nA Tony, racing driver: His father gave jokey advice, never blamed him for spins, comforted him when the car broke and told him to focus.\nB David, record producer: His father always believed in him, listened to his ideas, offered experienced career advice and left him free to choose whether to join the family business.\nC Andy, buyer: His father tried to teach him many things, urged immediate action and taught practical skills such as changing oil, tennis and skiing.\nD Simon, rugby player: His father’s advice about preparation made him work harder and persist when he was not selected for matches.`;
const fatherQuestions=["always had faith in his son’s abilities?","encouraged his son not to give up after disappointment?","gave advice in a light-hearted way?","made his son realise the need to try harder?","may not have passed on certain ideas?","never blamed his son for mistakes?","put no pressure on his son to follow in his footsteps?","comforted his son when equipment failed?","showed his son practical tasks?","was willing to listen to his son's suggestions?"];
const reading=fatherQuestions.map((text,index)=>q(2022,"reading",String(index+1).padStart(2,"0"),`Which person's father ${text}`,["A Tony","B David","C Andy","D Simon"],noKey,"Matching",{groupId:"g9-2022-reading-fathers",passage:index===0?fathersPassage:undefined}));
const costaPassage=`Eco-Adventure in Costa Rica is a three-week programme for groups of 10–14 with two leaders. Week 1 includes survival Spanish, local customs, rainforest hiking, rafting, zip lines and local recipes. Week 2 centres on sea-turtle conservation on Parismina, living with a host family, night monitoring and collecting eggs. Week 3 is a sailing adventure aboard the Olive Ridley with coastal wildlife exploration. Participants need good health and a physical examination but no previous activity experience. They need a passport, health and travel insurance and their own flights. Late payment after March 1 carries an extra fee.`;
const costaRows=[
  ["11","What is required in order to participate?",["A Safety training","B No asthma","C Previous experience","D A physical examination"]],
  ["12","What travel precaution is not mentioned?",["A Travel insurance","B Appropriate clothing","C A valid passport","D Layover time"]],
  ["13","What can participants do during the first week?",["A Cook","B Learn useful foreign phrases","C Glide without engine power","D All of the above"]],
  ["14","What is the main focus of Week 2?",["A Sea-turtle conservation","B Village foods","C Survival Spanish","D Rainforest animals"]],
  ["15","What can participants do during Week 3?",["A Raft and hike","B Learn village culture","C Sail and explore coastal areas","D None"]],
  ["16","Which accommodation is not mentioned?",["A Sailing yacht","B Tree house","C Campground","D Host family"]],
  ["17","How do participants help conserve the environment?",["A Support the company","B Help endangered species","C Donate money","D Buy crafts"]],
  ["18","What is true according to the text?",["A Everyone works at night","B Participants carry turtles","C Participants help choose activities","D Participants may see sloths"]],
  ["19","Why is previous sailing or rafting experience unnecessary?",["A Experts do all work","B Skills are irrelevant","C Activities are optional","D Leaders provide instruction"]],
  ["20","What is the consequence of registering late?",["A You pay more","B You cannot join","C You lose your date","D No airport meeting"]],
] as const;
costaRows.forEach(([id,text,options],index)=>reading.push(q(2022,"reading",id,text,[...options],noKey,"Reading comprehension",{groupId:"g9-2022-reading-costa-rica",passage:index===0?costaPassage:undefined})));
export const grade9Reading2022=makeSet("g9-2022-reading","Reading · Official 2022","reading",reading);

const uoe:ReturnType<typeof q>[]=[];
const cinco=["benefit","representative","highlight","government","respectively","showcases","commemorates","annually","significance","delicacy"];
cinco.forEach((word,index)=>uoe.push(q(2022,"use-of-english",String(index+1).padStart(2,"0"),`Complete the Cinco de Mayo crossword gap ${index+1}. Definition: ${word}.`,[],noKey,"Crossword vocabulary",{groupId:"g9-2022-uoe-cinco"})));
const photoOptions=[
  ["appeal","taste","interest","attraction"],["rejected","contradicted","denied","refused"],["trouble","care","effort","concern"],["characteristics","forms","qualities","aspects"],["seize","capture","grab","catch"],["motivates","renews","stimulates","reacts"],["manage","succeed","achieve","reach"],["reason","cause","source","means"],["glance","see","stare","look"],["utterly","completely","fully","absolutely"],
];
photoOptions.forEach((options,index)=>uoe.push(q(2022,"use-of-english",String(index+11),`Choose the best word for gap ${index+11} in “The joy of photography”.`,options.map((text,i)=>`${String.fromCharCode(65+i)} ${text}`),noKey,"Lexico-grammatical cloze",{groupId:"g9-2022-uoe-photography"})));
const cultureStatements=["The British Parliament consists of the House of Lords and the House of Representatives.","Australia Day is celebrated on 26 January, in winter.","King Charles III is Australia’s Head of State.","The Lake District contains the principal English lakes and highest English mountains.","There are two mottos in the Coat of Arms of the UK.","The Australian Coat of Arms features a red kangaroo and a kiwi.","Golf and basketball were invented in the UK and are national sports today.","The police nicknames ‘bobbies’ and ‘Peelers’ come from Robert Burns.","The London Eye was constructed to commemorate the millennium.","The first UK postage stamp featured Queen Elizabeth II."];
cultureStatements.forEach((text,index)=>uoe.push(q(2022,"use-of-english",String(index+21),text,["T","F"],noKey,"Cultural knowledge",{groupId:"g9-2022-uoe-culture"})));
const idioms=["Baby Jessica is the ___ of her father's eye.","Angelo is a hard ___ to crack.","Working at the library lets me have my ___ and eat it too.","That’s the way the ___ crumbles.","I was as cool as a ___ all the way to England.","My Granny is always full of ___.","Opera isn't exactly my cup of ___.","He is definitely the ___ of the crop.","Don't put all of your ___ in one basket.","Any teacher worth his ___ can inspire students."];
idioms.forEach((text,index)=>uoe.push(q(2022,"use-of-english",String(index+31),text,[],noKey,"Food idioms",{groupId:"g9-2022-uoe-idioms"})));
export const grade9UseOfEnglish2022=makeSet("g9-2022-use-of-english","Use of English · Official 2022","use-of-english",uoe);
export const grade9Writing2022=makeSet("g9-2022-writing","Writing · Official 2022","writing",[q(2022,"writing","01","Write a 220–250 word review of a book, movie or TV series you loved. Include general information, plot, main characters, at least two things you liked and at least two reasons to recommend it to teenagers.",[],noKey,"Writing",{type:"writing",points:20,wordLimit:{min:220,max:250},requirements:["Give a headline","Use and underline one phrasal verb","Give genre, time of action and themes","Introduce plot and main characters","Give at least two things you liked","Give at least two recommendations for teenagers"],needsReview:true})]);
export const grade9Official2022={listening:grade9Listening2022,reading:grade9Reading2022,"use-of-english":grade9UseOfEnglish2022,writing:grade9Writing2022};
