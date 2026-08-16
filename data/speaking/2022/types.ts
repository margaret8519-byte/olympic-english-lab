export type FactFileSection = { title: string; content: string };
export type SpeakingCriterion = { id: string; title: string; maxScore: number; description: string };
export type SpeakingSet = {
  id: string; year: number; gradeRange: number[]; title: string; location: string; source: string;
  preparationTime: number; monologueMinTime: number; monologueMaxTime: number; qaTime: string;
  instructions: string; requiredAspects: string[]; factFile: FactFileSection[] | null;
  needsFactFile: boolean; criteria: SpeakingCriterion[];
  grade?: number; topic?: string; speakingPoints?: string[]; followUpQuestions?: string[];
  skill?: string; subskill?: string;
};
