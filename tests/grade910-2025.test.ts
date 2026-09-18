import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { official2025ForGrade } from "../data/questions/grade-9-10/official-2025.ts";

const answers=(items:{acceptedAnswers:string[]}[])=>items.map(item=>item.acceptedAnswers[0]);

test("Vzlet 2025 Grade 9-10 objective sections match official sizes and keys",()=>{
  const expectedListening=["1","4","2","5","5","3","4","T","F","T","F","T","F","F","a","c","a","c","b","c"];
  const expectedReading=["C","G","A","C","F","B","D","c","d","b","c","c","b","c","a","f","b","h","g","d"];
  const expectedUse=["packaging","solid","certainly","inedible","commonly","height","ensure","like a fish out of water","a tall order","jazz up","teething problems","a shoulder to cry on","in the blink of an eye","I","G","F","B","E","D","A"];
  for(const grade of [9,10] as const){
    const bank=official2025ForGrade(grade);
    assert.equal(bank.listening.items.length,20);
    assert.equal(bank.reading.items.length,20);
    assert.equal(bank["use-of-english"].items.length,20);
    assert.deepEqual(answers(bank.listening.items),expectedListening);
    assert.deepEqual(answers(bank.reading.items),expectedReading);
    assert.deepEqual(answers(bank["use-of-english"].items),expectedUse);
    for(const set of [bank.listening,bank.reading,bank["use-of-english"]]){
      assert.ok(set.items.every(item=>item.grade===grade&&item.year===2025&&item.source==="official-vsosh-vzlet"&&!item.needsReview&&item.acceptedAnswers.length===1));
    }
  }
});

test("Vzlet 2025 Grade 9-10 Listening uses the official MP3 and exact lower-case answer choices",()=>{
  const listening=official2025ForGrade(9).listening;
  assert.equal(listening.audioSrc,"https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4477_1764686388.mp3");
  assert.equal(listening.audioMode,"file");
  assert.equal(listening.items[14].options[0],"a) worked in a shop in her hometown.");
  assert.equal(listening.items[19].acceptedAnswers[0],"c");
});

test("official UI accepts lower-case a-d option labels from the 2025 paper",()=>{
  const source=readFileSync("components/training/OfficialSection.tsx","utf8");
  assert.match(source,/A-Ia-i/);
  assert.match(source,/\\s\.\)/);
});
