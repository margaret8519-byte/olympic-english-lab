import test from "node:test";import assert from "node:assert/strict";import {checkAnswer,checkTextAnswer} from "../lib/answer-checker.ts";
test("exact television is correct",()=>assert.equal(checkTextAnswer("television",["television"]),true));
test("TV alternative is correct",()=>assert.equal(checkTextAnswer("TV",["television","TV"]),true));
test("outer whitespace is ignored",()=>assert.equal(checkTextAnswer("  TV  ",["television","TV"]),true));
test("comparison is case insensitive",()=>assert.equal(checkTextAnswer("tv",["television","TV"]),true));
test("wrong word is incorrect",()=>assert.equal(checkTextAnswer("radio",["television","TV"]),false));
test("multiple choice is checked",()=>assert.equal(checkAnswer({type:"multiple-choice",acceptedAnswers:["D"]},"d"),true));
test("matching is checked",()=>assert.equal(checkAnswer({type:"matching",acceptedAnswers:["1:G","2:A"]},{"1":"G","2":"A"}),true));
