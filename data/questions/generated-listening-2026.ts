import type {QuestionBankItem,QuestionSet} from "../types.ts";

type Grade = "7-8"|9|10|11;
type MCQ = {text:string;options:string[];answer:string;explanation:string};

const meta=(grade:Grade,id:string):Omit<QuestionBankItem,"text"|"options"|"acceptedAnswers"|"explanation">=>({
  id,grade,year:2026,stage:"training",source:"original-olympic-english-lab",
  sourceLabel:"OLYMPIC ENGLISH LAB · авторская олимпиадная тренировка 2026",
  platformLabel:"OLYMPIC ENGLISH LAB",section:"listening",skill:"Listening",
  subskill:"detail and inference",difficulty:"advanced",type:"multiple-choice",
  instruction:"Listen to the recording and choose the best answer.",
  points:1,tags:["original","generated-olympiad","2026"],needsReview:false
});

function set(grade:Grade,slug:string,title:string,script:string,questions:MCQ[]):QuestionSet{
  const groupId=`generated-${grade}-${slug}`;
  return{
    id:groupId,title,section:"listening",
    instruction:"Listen to the recording twice. Choose the best answer for questions 1–10.",
    script,audioMode:"speech",
    items:questions.map((q,index)=>({
      ...meta(grade,`${groupId}-${String(index+1).padStart(2,"0")}`),
      groupId,text:q.text,options:q.options,acceptedAnswers:[q.answer],
      explanation:q.explanation
    }))
  };
}

const grade78A=set("7-8","eco-club","Listening · New Olympiad A",
`Presenter: Today we are visiting Green Corner, an after-school eco-club started by pupils at Hillview School. The club began when twelve-year-old Mia noticed how much paper was being thrown away after art lessons. She asked a science teacher, Mr Evans, whether students could collect clean scraps for reuse. At first the group only met once a month, but more pupils joined after they built a small book-swap shelf from old wooden boxes. The club now meets every Wednesday. Members repair school supplies, grow herbs near the canteen and run short campaigns about saving water. Mia says their most successful project was not the herb garden but a "no-new-notebooks week", when students decorated unused pages from old exercise books and turned them into new notebooks. The head teacher liked the idea so much that the school office began using reused paper for internal notes. Mia admits that some projects failed. Their first compost bin smelled terrible because they added cooked food. A local gardener later showed them how to use only fruit and vegetable scraps. This year the club wants to create a quiet outdoor reading area. They have enough recycled wood for benches, but still need weatherproof paint and help from adults with tools.`,
[
{text:"Why did Mia first start thinking about an eco-club?",options:["A She wanted to grow herbs","B She saw paper being wasted","C Her teacher gave her homework","D The school needed new furniture"],answer:"b",explanation:"Mia noticed large amounts of paper being thrown away."},
{text:"How often did the club meet at the beginning?",options:["A Every day","B Every week","C Once a month","D Twice a month"],answer:"c",explanation:"At first, the group met once a month."},
{text:"What helped attract more pupils?",options:["A A book-swap shelf","B A school competition","C A new canteen","D Free art materials"],answer:"a",explanation:"More pupils joined after the book-swap shelf was built."},
{text:"Which project does Mia call the most successful?",options:["A The herb garden","B The compost bin","C The reading area","D The no-new-notebooks week"],answer:"d",explanation:"Mia explicitly says the notebook project was the most successful."},
{text:"What changed in the school office?",options:["A It stopped printing","B It began using reused paper","C It collected old books","D It bought recycled furniture"],answer:"b",explanation:"The office started using reused paper for internal notes."},
{text:"Why did the first compost bin cause a problem?",options:["A It was too small","B It was put indoors","C Cooked food was added","D Nobody watered it"],answer:"c",explanation:"Cooked food caused the bad smell."},
{text:"Who helped the students improve the compost bin?",options:["A A parent","B A local gardener","C The head teacher","D A canteen worker"],answer:"b",explanation:"A local gardener showed them what to put in it."},
{text:"What does the club want to build next?",options:["A A greenhouse","B A bicycle shed","C An outdoor reading area","D A larger art room"],answer:"c",explanation:"Their next goal is a quiet outdoor reading area."},
{text:"What material do they already have?",options:["A Paint","B Recycled wood","C Metal tools","D New books"],answer:"b",explanation:"They already have enough recycled wood for benches."},
{text:"What do they still need from adults?",options:["A Help using tools","B Help growing herbs","C Help collecting paper","D Help organising meetings"],answer:"a",explanation:"They need adults to help safely with tools."}
]);

const grade78B=set("7-8","museum-day","Listening · New Olympiad B",
`Interviewer: Leo, you volunteer at the Riverside Science Museum. What do you do there?
Leo: I joined last autumn because I wanted to practise speaking to groups. At first I thought volunteers only handed out maps, but I soon learned we also help with demonstrations. My favourite station is the wind tunnel, where visitors test paper shapes and see which ones stay in the air longest. Children often expect the heaviest shape to fall first, so it is fun to watch them change their minds. I volunteer two Saturdays a month, usually from ten until two. The museum gives us training before each new exhibition. Last month the training was about electricity, and we had to learn how to explain circuits without using difficult vocabulary. The hardest part is answering unexpected questions. Once a six-year-old asked whether lightning could charge a mobile phone. I did not know, so I wrote the question down and asked one of the scientists later. The answer became part of a new question board near the entrance. Next month, the museum is opening an exhibition about sound. I hope to help there because I play the drums and already know a little about vibration. Eventually, I would like to study engineering, but for now the museum is helping me become more confident.`,
[
{text:"Why did Leo originally become a volunteer?",options:["A To earn money","B To practise speaking to groups","C To study electricity","D To meet engineers"],answer:"b",explanation:"He joined because he wanted to practise speaking to groups."},
{text:"What surprised Leo about volunteers?",options:["A They design exhibitions","B They work every weekend","C They help with demonstrations","D They must be scientists"],answer:"c",explanation:"He discovered volunteers also help with demonstrations."},
{text:"Which station does Leo like best?",options:["A Electricity lab","B Wind tunnel","C Sound room","D Robot workshop"],answer:"b",explanation:"He names the wind tunnel as his favourite."},
{text:"How often does Leo volunteer?",options:["A Every Saturday","B Twice a month","C Once a month","D Every Sunday"],answer:"b",explanation:"He volunteers two Saturdays a month."},
{text:"What was the most recent training about?",options:["A Sound","B Engineering","C Electricity","D Weather"],answer:"c",explanation:"Last month's training focused on electricity."},
{text:"What did volunteers need to practise?",options:["A Building circuits","B Using technical terms","C Explaining simply","D Drawing maps"],answer:"c",explanation:"They learned to explain circuits without difficult vocabulary."},
{text:"What does Leo find hardest?",options:["A Long working hours","B Unexpected questions","C Remembering names","D Using the wind tunnel"],answer:"b",explanation:"He says unexpected questions are the hardest part."},
{text:"What happened to the lightning question?",options:["A It was ignored","B It became part of a question board","C Leo answered it immediately","D It was used in a test"],answer:"b",explanation:"The answer was added to a question board near the entrance."},
{text:"Why is Leo interested in the sound exhibition?",options:["A He plays the drums","B He wants a new phone","C He dislikes electricity","D He helped design it"],answer:"a",explanation:"His drumming gives him some knowledge of vibration."},
{text:"What has volunteering mainly helped Leo develop?",options:["A Confidence","B Musical skill","C Drawing ability","D Computer skills"],answer:"a",explanation:"He says the museum is helping him become more confident."}
]);

const grade910A=set(9,"digital-break","Listening · New Olympiad A",
`Host: We asked three teenagers to try a forty-eight-hour break from non-essential phone use.
Speaker 1: I expected to feel bored, but the strange thing was how often I reached for my phone without thinking. On Saturday morning I left it in a drawer and went to the market with my dad. Normally I would photograph everything, but this time I noticed more because I was not planning what to post. By Sunday evening I did miss messaging my friends, though.
Speaker 2: The experiment was easier than I expected because my football team already has a rule: no phones during training or meals after matches. The difficult moment was travelling by bus. I usually listen to music and check maps, so I had to plan the route before leaving home. I ended up reading the free newspaper on the bus, which I had never done before.
Speaker 3: I failed after about six hours. My grandmother sent a message asking for help with an online form, and I decided family messages counted as essential. After that I started replying to everyone. Still, I learned something useful: most notifications were not urgent. I have now turned off alerts for games and shopping apps.
Host: Psychologist Dr Patel says the point of a digital break is not to prove phones are harmful. Instead, it helps people notice automatic habits and decide which ones are genuinely useful.`,
[
{text:"What surprised Speaker 1 most?",options:["A The market was crowded","B She kept reaching for her phone automatically","C Her father used his phone","D She became bored immediately"],answer:"b",explanation:"She noticed how often she reached for the phone without thinking."},
{text:"What did Speaker 1 notice at the market?",options:["A More details around her","B Better prices","C More tourists","D Fewer people"],answer:"a",explanation:"She says she noticed more because she was not thinking about posting."},
{text:"What did Speaker 1 miss by Sunday evening?",options:["A Games","B Music","C Messaging friends","D Taking photos"],answer:"c",explanation:"She explicitly missed messaging friends."},
{text:"Why was the experiment easier for Speaker 2?",options:["A He had lost his phone","B His football team already limited phone use","C He stayed at home","D He never uses maps"],answer:"b",explanation:"His team already has phone-free rules."},
{text:"What caused Speaker 2 the most difficulty?",options:["A Training","B Eating after matches","C Travelling by bus","D Reading the newspaper"],answer:"c",explanation:"The bus journey was the difficult moment."},
{text:"What did Speaker 2 do instead of using his phone on the bus?",options:["A Slept","B Talked to the driver","C Read a newspaper","D Played cards"],answer:"c",explanation:"He read the free newspaper."},
{text:"Why did Speaker 3 first use the phone again?",options:["A A shopping alert","B A game invitation","C A family request for help","D A school message"],answer:"c",explanation:"His grandmother asked for help with an online form."},
{text:"What change did Speaker 3 make afterwards?",options:["A Deleted every app","B Turned off some notifications","C Bought a simpler phone","D Stopped messaging family"],answer:"b",explanation:"He disabled alerts for games and shopping apps."},
{text:"According to Dr Patel, what is the purpose of a digital break?",options:["A To prove phones are dangerous","B To improve battery life","C To notice habits and choose more deliberately","D To stop using phones permanently"],answer:"c",explanation:"The aim is awareness and deliberate choice."},
{text:"Which idea is shared by the whole recording?",options:["A Phones should be banned at school","B A short break can reveal unnoticed habits","C Social media is always harmful","D Teenagers need more newspapers"],answer:"b",explanation:"All parts focus on becoming aware of automatic phone use."}
]);

const grade910B=set(9,"city-lab","Listening · New Olympiad B",
`Presenter: Our guest today is urban planner Maya Chen, who works on temporary street experiments.
Maya: A street experiment is a low-cost way to test an idea before rebuilding a road permanently. For example, instead of immediately constructing a cycle lane, a city can use removable barriers and paint for several weeks. Then planners observe traffic, speak to residents and measure how people actually use the space. The biggest mistake is to treat the experiment as a public-relations event. If the city has already decided what the final design will be, people quickly realise their feedback changes nothing. Another mistake is measuring only car journey times. A project may slow cars by two minutes but make walking safer for hundreds of pupils. We therefore collect several kinds of evidence: travel times, pedestrian counts, noise levels, near-miss reports and short interviews. One recent project outside a library created extra seating and a small delivery zone. Shop owners were worried customers would lose parking spaces, but after six weeks footfall had increased. The final design kept the seating but moved the delivery zone twenty metres. Temporary projects are useful precisely because they can fail cheaply and be adjusted.`,
[
{text:"What is the main purpose of a street experiment?",options:["A To avoid public consultation","B To test an idea before permanent construction","C To reduce all traffic","D To advertise a city"],answer:"b",explanation:"Maya defines it as a low-cost test before permanent rebuilding."},
{text:"What can be used for a temporary cycle lane?",options:["A Concrete walls","B Removable barriers and paint","C New traffic lights only","D Underground tunnels"],answer:"b",explanation:"She gives removable barriers and paint as examples."},
{text:"What does Maya call the biggest mistake?",options:["A Collecting too much data","B Treating the trial as public relations","C Asking residents questions","D Changing a design"],answer:"b",explanation:"She says the biggest mistake is using it as a PR event."},
{text:"Why might residents stop trusting the process?",options:["A Experiments are too short","B The city has already made the decision","C Parking is always removed","D Interviews are too long"],answer:"b",explanation:"Feedback feels meaningless if the outcome is predetermined."},
{text:"Why is car journey time alone insufficient?",options:["A Cars are too difficult to measure","B Other users and benefits may matter more","C It never changes","D Residents dislike numbers"],answer:"b",explanation:"Safety and pedestrian benefits can outweigh a small delay."},
{text:"Which of these is NOT mentioned as evidence?",options:["A Noise levels","B Pedestrian counts","C Air-ticket prices","D Near-miss reports"],answer:"c",explanation:"Air-ticket prices are unrelated and not mentioned."},
{text:"Where was one recent experiment located?",options:["A Outside a library","B Beside an airport","C At a stadium","D Near a factory"],answer:"a",explanation:"Maya describes a project outside a library."},
{text:"What worried shop owners?",options:["A Noise","B Loss of parking spaces","C Delivery times","D Library opening hours"],answer:"b",explanation:"They feared customers would lose parking."},
{text:"What happened after six weeks?",options:["A Footfall increased","B The library closed","C All seating was removed","D Car speeds doubled"],answer:"a",explanation:"Footfall had increased."},
{text:"Why does Maya value temporary projects?",options:["A They never fail","B They avoid measurement","C Failure is cheaper and designs can change","D They require no public input"],answer:"c",explanation:"Their temporary nature allows cheap failure and adjustment."}
]);

const grade11A=set(11,"creative-ai","Listening · New Olympiad A",
`Moderator: Our panel is discussing whether generative AI changes what creativity means.
Dr Ellis: I think the useful distinction is between producing material and making creative decisions. A system can produce dozens of images or phrases quickly, but a human still chooses the purpose, rejects weak options and decides what is worth developing. That does not make the machine irrelevant; it changes where effort is spent.
Composer Lena Ortiz: In music, I use AI to create rough variations of a melody. Most are unusable. Occasionally one contains an unexpected rhythm that pushes me in a new direction. I never publish the generated output as it is. For me, the tool is closer to a strange improvisation partner than an automatic composer.
Designer Arun Shah: I am more cautious. When organisations use generated work because it is cheap, junior designers lose opportunities to practise basic tasks. Those tasks may look routine, but they are where people learn judgement. If we remove the apprenticeship stage, we may later discover there are fewer experienced designers able to supervise the systems.
Dr Ellis: That is a labour question as much as a creativity question. We should not assume technical efficiency automatically creates good professional development.
Moderator: So the disagreement is not simply "AI good" or "AI bad". It concerns which decisions should remain human, how people develop expertise, and how generated material should be acknowledged.`,
[
{text:"What distinction does Dr Ellis make?",options:["A Art and music","B Producing material and making creative decisions","C Experts and beginners","D Fast and slow software"],answer:"b",explanation:"He separates production from creative decision-making."},
{text:"According to Dr Ellis, what remains a human role?",options:["A Generating every option","B Choosing purpose and rejecting weak options","C Increasing computer speed","D Avoiding all tools"],answer:"b",explanation:"He lists purpose, selection and development as human decisions."},
{text:"How does Lena use AI?",options:["A To publish finished songs automatically","B To create rough melodic variations","C To copy other composers","D To replace live musicians"],answer:"b",explanation:"She uses it for rough variations."},
{text:"Why can an unusable output still be valuable to Lena?",options:["A It lowers copyright fees","B It may contain an unexpected idea","C It is always shorter","D It teaches software coding"],answer:"b",explanation:"Unexpected rhythms can inspire a new direction."},
{text:"What comparison does Lena make?",options:["A A search engine","B A strange improvisation partner","C A strict teacher","D A recording studio"],answer:"b",explanation:"She calls it like a strange improvisation partner."},
{text:"What is Arun mainly worried about?",options:["A Computers becoming slower","B Junior designers losing practice opportunities","C Clients refusing cheap work","D Music becoming repetitive"],answer:"b",explanation:"He focuses on lost entry-level learning opportunities."},
{text:"Why are routine tasks important according to Arun?",options:["A They are highly paid","B They help people develop judgement","C They require no supervision","D They cannot be automated"],answer:"b",explanation:"They are part of how beginners learn judgement."},
{text:"What future risk does Arun identify?",options:["A Fewer experienced people able to supervise systems","B Too many apprentices","C No generated images","D Higher printing costs"],answer:"a",explanation:"Removing the learning stage could reduce future expertise."},
{text:"How does Dr Ellis reframe Arun's concern?",options:["A As a labour and professional-development issue","B As a music problem","C As a legal ban","D As a hardware issue"],answer:"a",explanation:"He says it is a labour question too."},
{text:"What is the moderator's final point?",options:["A The debate has a simple yes-or-no answer","B AI should be banned from creative work","C The real debate concerns decisions, expertise and acknowledgement","D Only experts should use technology"],answer:"c",explanation:"The conclusion identifies those three issues."}
]);

const grade11B=set(11,"urban-nature","Listening · New Olympiad B",
`Interviewer: Professor Malik, your team studies biodiversity in cities. Why focus on small urban spaces?
Professor Malik: Because size is not the only thing that matters. A tiny courtyard with flowering plants can act as a stepping stone between larger habitats. For insects, especially, a chain of small spaces may be more useful than one isolated park.
Interviewer: Does that mean every green roof or flower bed helps?
Professor Malik: Not automatically. We found many decorative plantings used species that produce little nectar, or were replaced before they flowered. Maintenance schedules can cancel out ecological benefits. The most successful sites were designed with gardeners, residents and ecologists together.
Interviewer: Your latest study also used microphones.
Professor Malik: Yes. We placed low-cost acoustic sensors in twenty locations. They recorded short samples at dawn and after sunset. We were not trying to identify every species perfectly. Instead, changes in the variety of sound gave us a quick signal that a site might deserve closer investigation.
Interviewer: Were there privacy concerns?
Professor Malik: Absolutely. The devices were programmed not to store continuous human speech, and signs explained what was being recorded. Good environmental research has to consider people as part of the environment, not as an inconvenience.
Interviewer: What would you like cities to do next?
Professor Malik: Connect existing projects. A school garden, a roadside strip and a housing courtyard can form a network if planners coordinate them.`,
[
{text:"Why can a small courtyard be ecologically useful?",options:["A It replaces every large park","B It can connect larger habitats","C It needs no maintenance","D It attracts only birds"],answer:"b",explanation:"Small spaces can serve as stepping stones."},
{text:"For which group does Professor Malik especially mention chains of small spaces?",options:["A Insects","B Large mammals","C Fish","D Domestic pets"],answer:"a",explanation:"He especially mentions insects."},
{text:"Why do some decorative plantings provide little benefit?",options:["A They are too expensive","B Plants may produce little nectar or be replaced too soon","C Residents dislike flowers","D Roofs are always dry"],answer:"b",explanation:"He gives both reasons."},
{text:"What can cancel out ecological benefits?",options:["A Maintenance schedules","B Public signs","C Larger parks","D School lessons"],answer:"a",explanation:"Poor maintenance timing can remove the benefit."},
{text:"Who worked together on the most successful sites?",options:["A Drivers and tourists","B Gardeners, residents and ecologists","C Only scientists","D Architects and police"],answer:"b",explanation:"Those three groups collaborated."},
{text:"Why did the team use microphones?",options:["A To record interviews","B To monitor changes in environmental sound","C To play bird calls","D To measure traffic speed"],answer:"b",explanation:"Sound variety was used as an ecological signal."},
{text:"When were samples recorded?",options:["A At noon only","B At dawn and after sunset","C During school hours","D Once a month"],answer:"b",explanation:"Sensors recorded at dawn and after sunset."},
{text:"What did the researchers NOT aim to do?",options:["A Identify every species perfectly","B Find sites needing closer study","C Compare sound variety","D Use low-cost sensors"],answer:"a",explanation:"Perfect species identification was not the goal."},
{text:"How were privacy concerns addressed?",options:["A Devices were hidden","B Continuous human speech was not stored and signs were posted","C Recording happened only indoors","D Residents were excluded"],answer:"b",explanation:"Both technical limits and clear signage were used."},
{text:"What does Professor Malik want cities to do next?",options:["A Build only huge parks","B Connect existing small projects into networks","C Remove roadside planting","D Stop school gardening"],answer:"b",explanation:"He wants coordinated networks of existing projects."}
]);

function cloneForGrade(set:QuestionSet,grade:9|10):QuestionSet{
  return{
    ...set,
    id:set.id.replace("generated-9-",`generated-${grade}-`),
    items:set.items.map(item=>({
      ...item,
      id:item.id.replace("generated-9-",`generated-${grade}-`),
      groupId:item.groupId?.replace("generated-9-",`generated-${grade}-`),
      grade
    }))
  };
}

export function generatedListeningSetsForGrade(grade:number):QuestionSet[]{
  if(grade===7||grade===8)return[grade78A,grade78B];
  if(grade===9)return[grade910A,grade910B];
  if(grade===10)return[cloneForGrade(grade910A,10),cloneForGrade(grade910B,10)];
  if(grade===11)return[grade11A,grade11B];
  return[];
}
