export type GradeAwareQuestion={grade?:string|number|number[];gradeRange?:number[]};
export const questionRegistryByGrade={7:"grade-7-8",8:"grade-7-8",9:"grade-9",10:"grade-10",11:"grade-11"} as const;
export function isQuestionAllowedForGrade(question:GradeAwareQuestion,grade:string|number){const studentGrade=Number(grade);if(question.gradeRange)return question.gradeRange.includes(studentGrade);if(Array.isArray(question.grade))return question.grade.includes(studentGrade);if(typeof question.grade==="number")return question.grade===studentGrade;if(question.grade==="7-8")return studentGrade===7||studentGrade===8;return false}
export function registryForGrade(grade:string|number){return questionRegistryByGrade[Number(grade) as keyof typeof questionRegistryByGrade]??null}
export function eligibleQuestionsForGrade<T extends GradeAwareQuestion>(questions:T[],grade:string|number){return questions.filter(question=>isQuestionAllowedForGrade(question,grade))}
