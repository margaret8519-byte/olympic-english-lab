import test from "node:test";import assert from "node:assert/strict";import {eligibleQuestionsForGrade,isQuestionAllowedForGrade,registryForGrade} from "../lib/training-grade.ts";
const junior={grade:"7-8"};
test("grades 7 and 8 can use the 7-8 bank",()=>{assert.equal(isQuestionAllowedForGrade(junior,7),true);assert.equal(isQuestionAllowedForGrade(junior,8),true)});
test("grades 9, 10 and 11 cannot use the 7-8 bank",()=>{for(const grade of[9,10,11])assert.equal(isQuestionAllowedForGrade(junior,grade),false)});
test("grades 9, 10 and 11 have isolated registries without junior fallback",()=>{assert.equal(registryForGrade(9),"grade-9");assert.equal(registryForGrade(10),"grade-10");assert.equal(registryForGrade(11),"grade-11");for(const grade of[10,11])assert.deepEqual(eligibleQuestionsForGrade([junior],grade),[])});
test("grade range metadata is enforced",()=>{const speaking={gradeRange:[9,10,11]};assert.equal(isQuestionAllowedForGrade(speaking,9),true);assert.equal(isQuestionAllowedForGrade(speaking,8),false)});
