import test from "node:test";
import assert from "node:assert/strict";
import {challenge10} from "../data/challenge-10-preview.ts";

test("grade 10 preview matches the approved 60-item paper",()=>{
  assert.equal(challenge10.sections.length,4);
  assert.deepEqual(challenge10.sections.map(s=>s.tasks.length),[3,3,4,1]);
  assert.deepEqual(challenge10.sections.map(s=>s.title),[
    "LISTENING (20 points)","READING (20 points)","USE OF ENGLISH (20 points)","WRITING (20 points)"
  ]);
  const ranges=challenge10.sections.flatMap(section=>section.tasks.filter(task=>task.from>0).map(task=>[task.from,task.to]));
  assert.deepEqual(ranges,[[1,6],[7,13],[14,20],[21,27],[28,33],[34,40],[41,45],[46,50],[51,55],[56,60]]);
  const covered=ranges.flatMap(([a,b])=>Array.from({length:b-a+1},(_,i)=>i+a));
  assert.deepEqual(covered,Array.from({length:60},(_,i)=>i+1));
  assert.equal(Object.keys(challenge10.keys).length,60);
  for(let n=1;n<=60;n++)assert.ok(challenge10.keys[String(n) as keyof typeof challenge10.keys]?.trim(),"Missing answer "+n);
});

test("Listening scripts and objective keys are present",()=>{
  assert.equal(challenge10.scripts.length,3);
  for(const script of challenge10.scripts){
    assert.ok(script.text.length>1000);
    assert.ok(script.title.startsWith("Recording "));
  }
  assert.equal(challenge10.keys["1"],"B");
  assert.equal(challenge10.keys["14"],"F");
  assert.equal(challenge10.keys["21"],"VI");
  assert.equal(challenge10.keys["36"],"NG");
  assert.equal(challenge10.keys["41"],"resistance");
  assert.equal(challenge10.keys["51"],"had been translated did");
  assert.equal(challenge10.keys["60"],"F");
});

test("Writing is a teacher-reviewed task with the required opening",()=>{
  const writing=challenge10.sections[3].tasks[0];
  assert.equal(writing.from,0);
  assert.ok(writing.body.includes("180–250 words"));
  assert.ok(writing.body.includes("At first, I thought the letter had been sent to the wrong address."));
  assert.ok(writing.body.includes("two different idioms"));
  assert.ok(writing.body.includes("two different phrasal verbs"));
});
