import { q9 } from "./shared.ts";

const uoeRows = [
  ["x-uoe-01","Articles","medium","After lunch, we visited ___ British Museum.",["a","an","the","—"],"c","Names of museums normally take the definite article."],
  ["x-uoe-02","Articles","hard","She was elected ___ chair of the committee in May.",["a","an","the","—"],"d","No article is used when a role follows elect, appoint, or make."],
  ["x-uoe-03","Conditionals","easy","If water reaches 100°C, it ___.",["boils","will boil","would boil","boiled"],"a","A zero conditional uses the present simple for a general fact."],
  ["x-uoe-04","Conditionals","medium","Unless you ___ now, you will miss the opening speech.",["leave","will leave","left","would leave"],"a","Unless introduces a real condition and takes the present simple."],
  ["x-uoe-05","Passive voice","medium","The missing documents ___ by a cleaner yesterday.",["found","were found","have found","were finding"],"b","A completed past passive action uses was or were plus a past participle."],
  ["x-uoe-06","Passive voice","medium","The new sports centre ___ by the end of next year.",["will complete","will have completed","will have been completed","has been completing"],"c","The future perfect passive describes completion before a future deadline."],
  ["x-uoe-07","Modal verbs","medium","You ___ have told me; I already knew about the change.",["mustn't","needn't","couldn't","wouldn't"],"b","Needn't have means that a completed action was unnecessary."],
  ["x-uoe-08","Modal verbs","hard","The lights are off, so they ___ have left already.",["should","must","can","need"],"b","Must have expresses a strong deduction about a past event."],
  ["x-uoe-09","Prepositions","medium","The award was presented ___ recognition of her voluntary work.",["in","at","by","with"],"a","In recognition of is the fixed expression."],
  ["x-uoe-10","Prepositions","hard","His conclusion was based ___ evidence gathered over a decade.",["at","from","on","with"],"c","The fixed combination is based on."],
  ["x-uoe-11","Relative clauses","medium","The laboratory ___ the discovery was made has reopened.",["which","where","whose","whom"],"b","Where refers to the place in which something happened."],
  ["x-uoe-12","Relative clauses","hard","The novelist, ___ latest book won the prize, thanked her editor.",["who","whom","whose","which"],"c","Whose expresses possession in a relative clause."],
  ["x-uoe-13","Reported speech","easy","‘I am tired,’ Leo said. Leo said that he ___ tired.",["is","was","has been","will be"],"b","Present simple normally backshifts to past simple in reported speech."],
  ["x-uoe-14","Reported speech","medium","The coach warned us ___ late for the final.",["not be","not to be","to not being","do not be"],"b","Warn someone is followed by a to-infinitive; the negative is not to."],
  ["x-uoe-15","Tense contrast","medium","By the time we arrived, the lecture ___.",["started","has started","had started","was starting"],"c","Past perfect marks an action completed before another past event."],
  ["x-uoe-16","Tense contrast","hard","This is the first time I ___ such a convincing argument.",["hear","heard","have heard","had heard"],"c","This is the first time is followed by the present perfect."],
  ["x-uoe-17","Word formation","easy","The instructions were clear and ___.",["help","helpful","helpfully","helplessly"],"b","An adjective is needed after were and alongside clear."],
  ["x-uoe-18","Word formation","hard","The measures proved surprisingly ___ in reducing waste.",["effect","effective","effectively","effectiveness"],"b","An adjective complements proved and is modified by surprisingly."],
  ["x-uoe-19","Phrasal verbs","medium","Please ___ the form carefully before signing it.",["fill in","take in","bring in","turn in"],"a","Fill in means complete a form with information."],
  ["x-uoe-20","Phrasal verbs","hard","The researchers decided to ___ the experiment despite the setback.",["carry on with","look down on","come up against","get away with"],"a","Carry on with means continue doing something."],
  ["x-uoe-21","Verb patterns","easy","We agreed ___ outside the library at noon.",["meet","meeting","to meet","to meeting"],"c","Agree is followed by a to-infinitive."],
  ["x-uoe-22","Verb patterns","medium","The teacher encouraged us ___ more widely.",["read","reading","to read","to reading"],"c","Encourage takes an object followed by a to-infinitive."],
  ["x-uoe-23","Verb patterns","medium","I remember ___ the door, so it cannot be open.",["lock","locking","to lock","to locking"],"b","Remember doing refers to a memory of a completed action."],
  ["x-uoe-24","Word order","easy","Which sentence has the correct word order?",["She always is punctual.","She is always punctual.","Always she is punctual.","She is punctual always."],"b","A frequency adverb normally follows the verb be."],
  ["x-uoe-25","Word order","medium","Which sentence is correct?",["I don't know where is the station.","I don't know where the station is.","I don't know where does the station is.","I don't know is where the station."],"b","An indirect question uses statement word order."],
  ["x-uoe-26","Word order","medium","Rarely ___ such careful work from a new team.",["we see","do we see","we do see","see we"],"b","A negative-frequency adverb at the beginning triggers inversion."],
  ["x-uoe-27","Complex structures","easy","___ feeling tired, Nina finished the report.",["Although","Despite","Because","Unless"],"b","Despite is followed by a noun or gerund phrase."],
  ["x-uoe-28","Complex structures","medium","The task was ___ difficult for us to finish on time.",["so","such","too","enough"],"c","Too plus adjective plus to-infinitive means excessively difficult."],
  ["x-uoe-29","Complex structures","hard","Not until the final page ___ the identity of the narrator.",["we discovered","did we discover","we had discovered","had we discover"],"b","Not until at the beginning triggers auxiliary-subject inversion."],
  ["x-uoe-30","Gerund and infinitive","easy","Mia enjoys ___ historical novels.",["read","reading","to reading","to have read"],"b","Enjoy is followed by a gerund."],
  ["x-uoe-31","Gerund and infinitive","medium","We stopped ___ some water before continuing the hike.",["drink","drinking","to drink","to drinking"],"c","Stop to do means pause one action in order to do another."],
  ["x-uoe-32","Gerund and infinitive","hard","The old theatre is believed ___ in the eighteenth century.",["to build","to have been built","being built","to be building"],"b","A perfect passive infinitive refers to an earlier passive event."],
] as const;

export const grade9ExpansionUseOfEnglish = uoeRows.map(([id,subskill,difficulty,text,options,answer,explanation]) =>
  q9(id,"use-of-english","Use of English",subskill,difficulty,"multiple-choice",text,[...options],answer,explanation),
);

const vocabularyRows = [
  ["x-v-01","Collocations","medium","The new evidence may ___ doubt on the original conclusion.",["throw","cast","send","put"],"b","Cast doubt on is the standard collocation."],
  ["x-v-02","Collocations","hard","The two accounts are in ___ contradiction.",["direct","straight","plain","close"],"a","Direct contradiction is the established collocation."],
  ["x-v-03","Idioms","easy","Before deciding, let's sleep ___ it.",["at","on","with","over"],"b","Sleep on it means delay a decision until the next day."],
  ["x-v-04","Idioms","medium","Although nervous, Amir managed to keep a cool ___.",["mind","brain","head","face"],"c","Keep a cool head means remain calm."],
  ["x-v-05","Compound words","easy","Which word means a place where books may be borrowed?",["bookcase","bookshop","library","bookshelf"],"c","A library lends books to readers."],
  ["x-v-06","Compound words","medium","Which compound noun means information supplied after a performance?",["feedback","fallback","feedstock","backdrop"],"a","Feedback is a response evaluating performance."],
  ["x-v-07","Compound words","hard","A temporary solution that avoids a problem is a ___.",["breakthrough","workaround","turnover","showdown"],"b","A workaround is a practical way around a difficulty."],
  ["x-v-08","Contextual synonyms","easy","The path was narrow, so we walked in a single line. ‘Narrow’ means ___.",["not wide","not long","not straight","not steep"],"a","Narrow means having little width."],
  ["x-v-09","Contextual synonyms","medium","The editor asked for a concise summary. ‘Concise’ means ___.",["detailed and long","brief and clear","personal and emotional","uncertain and vague"],"b","Concise writing expresses information briefly and clearly."],
  ["x-v-10","Contextual synonyms","medium","The rules are flexible enough to suit different teams. ‘Flexible’ means ___.",["easy to adapt","hard to explain","likely to fail","strictly fixed"],"a","Flexible rules can be adapted to different circumstances."],
] as const;

export const grade9ExpansionVocabulary = vocabularyRows.map(([id,subskill,difficulty,text,options,answer,explanation]) =>
  q9(id,"language-challenge","Vocabulary",subskill,difficulty,"multiple-choice",text,[...options],answer,explanation),
);

const passage3 = `For years, Westford Library measured success by counting borrowed books. When borrowing declined, staff assumed that interest in reading had fallen. A survey suggested a different explanation: residents were reading digital books but still wanted a quiet public place to study and discuss ideas. The library removed two rarely used storage rooms and created flexible work areas. It also began lending recording equipment and hosting short research workshops. Book loans did not immediately rise, yet total visits doubled within a year. Some critics called the changes a distraction from the library's traditional purpose. The director disagreed, arguing that libraries have always helped people gain access to knowledge; only the form of that access has changed.`;
const passage4 = `A school in Northbridge replaced part of its lawn with a wildflower meadow. At first, several parents complained that the grounds looked untidy. The science department asked them to wait until the end of the growing season before judging the project. By autumn, students had recorded twelve butterfly species, compared with four the previous year. Maintaining the meadow also required less frequent mowing, although removing invasive plants took more time than expected. The school has now installed a sign explaining that the apparently unplanned landscape is carefully managed. Complaints have declined, and two neighbouring schools are considering similar projects. The experiment suggests that visible evidence can be more persuasive than an abstract environmental argument.`;

export const grade9ExpansionReading = [
  q9("x-r3-01","reading","Reading","Main idea","easy","multiple-choice","What is the passage mainly about?",["Why printed books are disappearing","How a library redefined the way it serves its community","Why surveys produce unreliable results","How to design recording equipment"],"b","The passage explains how the library responded to changing forms of access to knowledge.",{groupId:"g9-reading-library",passage:passage3}),
  q9("x-r3-02","reading","Reading","Detail","medium","multiple-choice","What happened within a year of the changes?",["Book loans doubled","All storage rooms were removed","Total visits doubled","The survey was repeated"],"c","The passage explicitly states that total visits doubled.",{groupId:"g9-reading-library"}),
  q9("x-r3-03","reading","Reading","Inference","easy","multiple-choice","Why had book borrowing probably declined?",["Residents had stopped reading","The library had become too noisy","Many residents used digital books","Workshops replaced every bookshelf"],"c","The survey showed that residents were reading digitally rather than abandoning reading.",{groupId:"g9-reading-library"}),
  q9("x-r3-04","reading","Reading","Vocabulary in context","easy","multiple-choice","In the passage, ‘flexible’ most nearly means",["able to serve different uses","cheap to construct","reserved for staff","difficult to move"],"a","The work areas can be adapted to different activities.",{groupId:"g9-reading-library"}),
  q9("x-r3-05","reading","Reading","Author attitude","easy","multiple-choice","How does the writer present the library's changes?",["As a reasonable response to community needs","As an expensive failure","As proof that books are unnecessary","As a temporary publicity campaign"],"a","The evidence and director's explanation support the changes as a sensible adaptation.",{groupId:"g9-reading-library"}),
  q9("x-r4-01","reading","Reading","Main idea","hard","multiple-choice","Which statement best expresses the passage's main point?",["School grounds should never contain lawns","Environmental projects succeed only when maintenance is easy","Observable results can change attitudes toward unfamiliar environmental choices","Parents should design all school science projects"],"c","The meadow's visible outcomes persuaded people who had initially objected.",{groupId:"g9-reading-meadow",passage:passage4}),
  q9("x-r4-02","reading","Reading","Detail","hard","multiple-choice","Which task proved more demanding than anticipated?",["Counting butterflies","Mowing the remaining lawn","Making the information sign","Removing invasive plants"],"d","The passage says removing invasive plants took more time than expected.",{groupId:"g9-reading-meadow"}),
  q9("x-r4-03","reading","Reading","Inference","medium","multiple-choice","Why did the science department ask parents to wait?",["The project needed time to produce evidence of its value","The school intended to restore the lawn","Students had not chosen the flower species","Complaints were forbidden during the summer"],"a","A full growing season was needed before the meadow's benefits could be assessed.",{groupId:"g9-reading-meadow"}),
  q9("x-r4-04","reading","Reading","Vocabulary in context","hard","multiple-choice","The word ‘abstract’ contrasts most directly with",["expensive","visible","traditional","carefully managed"],"b","The conclusion contrasts a theoretical argument with evidence people can see.",{groupId:"g9-reading-meadow"}),
  q9("x-r4-05","reading","Reading","Author attitude","medium","multiple-choice","The writer's attitude toward the meadow is",["cautiously favourable","entirely dismissive","openly amused","deeply uncertain"],"a","The writer highlights benefits while acknowledging an unexpected maintenance cost.",{groupId:"g9-reading-meadow"}),
];

export const grade9ExpansionQuestionBank = [
  ...grade9ExpansionUseOfEnglish,
  ...grade9ExpansionVocabulary,
  ...grade9ExpansionReading,
];
