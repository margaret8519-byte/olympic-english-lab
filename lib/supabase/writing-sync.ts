import type { QuestionBankItem } from "../../data/questions/types.ts";
import { checkAnswer } from "../answer-checker.ts";
import {
  FULL_ACTIVE_KEY,
  resolveSessionQuestions,
  type FullSession,
} from "../full-olympiad.ts";
import { createClient } from "./client.ts";

type SupabaseClient = ReturnType<typeof createClient>;
type StorageLike = Pick<Storage, "getItem" | "setItem">;
type ObjectivePayload = ReturnType<typeof buildFullObjectiveAnswerPayloads>[number];

export type WritingSubmissionInput = {
  attemptId: string;
  startedAt: string;
  completedAt: string;
  task: QuestionBankItem;
  text: string;
  wordCount: number;
  headlinePresent: boolean;
};

export type WritingSubmissionMarker = {
  attemptId: string;
  taskId: string;
  year: number;
  wordCount: number;
  submittedAt: string;
  reviewStatus: "pending" | "reviewed";
  score?: number;
  maxScore?: number;
  teacherComment?: string | null;
};

export const writingSubmissionKey = (taskId: string) =>
  `olympic-writing-submission-v2-${taskId}`;

export function getWritingSubmissionErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();
  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("fetcherror")
  )
    return "Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.";
  if (normalized.includes("no active supabase session"))
    return "Профиль сохранён локально, поэтому отправка учителю сейчас недоступна.";
  return message || "Не удалось сохранить работу.";
}

export const needsWritingAnswerInsert = (
  existing: { id: unknown }[] | null | undefined,
) => !existing?.length;

export function buildWritingAttemptPayload(
  input: WritingSubmissionInput,
  studentId: string,
  objectivePayloads: ObjectivePayload[] = [],
) {
  const { task } = input;
  const inLimit =
    !!task.wordLimit &&
    input.wordCount >= task.wordLimit.min &&
    input.wordCount <= task.wordLimit.max;
  const fullOlympiad = objectivePayloads.length > 0;
  const objectiveScore = objectivePayloads.reduce(
    (sum, row) => sum + Number(row.points || 0),
    0,
  );
  const objectiveMax = objectivePayloads.reduce(
    (sum, row) => sum + Number(row.max_points || 0),
    0,
  );
  return {
    id: input.attemptId,
    student_id: studentId,
    mode: fullOlympiad ? "olympiad" : "official",
    section: "writing",
    source: task.source,
    started_at: input.startedAt,
    completed_at: input.completedAt,
    score: null,
    max_score: null,
    percentage: null,
    total_questions: objectivePayloads.length + 1,
    correct_answers: fullOlympiad
      ? objectivePayloads.filter((row) => row.is_correct === true).length
      : null,
    incorrect_answers: fullOlympiad
      ? objectivePayloads.filter((row) => row.is_correct === false).length
      : null,
    weak_subskill: null,
    metadata: {
      grade: task.grade,
      year: task.year,
      variant: task.tags?.includes("generated-olympiad") ? "generated" : "official",
      authorVariant: task.tags?.find(tag=>tag.startsWith("generated-set:"))?.split(":")[1] || null,
      reviewStatus: "pending",
      fullOlympiad,
      objectiveScore,
      objectiveMax,
      objectiveQuestions: objectivePayloads.length,
      wordCount: input.wordCount,
      requirementsMet: {
        wordCountInLimit: inLimit,
        headlinePresent: input.headlinePresent,
      },
      detectedRequirements: {
        wordCount: input.wordCount,
        headlinePresent: input.headlinePresent,
      },
      needsExpertReview: task.requirements || ["writing task requirements"],
    },
  };
}

export function buildWritingAnswerPayload(
  input: WritingSubmissionInput,
  studentId: string,
) {
  return {
    attempt_id: input.attemptId,
    student_id: studentId,
    question_id: input.task.id,
    section: "writing",
    skill: "Writing",
    subskill: input.task.subskill,
    answer_text: input.text,
    is_correct: null,
    points: null,
    max_points: null,
  };
}

export function buildFullObjectiveAnswerPayloads(
  storage: StorageLike,
  attemptId: string,
  studentId: string,
) {
  try {
    const raw = storage.getItem(FULL_ACTIVE_KEY);
    if (!raw) return [];
    const session = JSON.parse(raw) as FullSession;
    if (!session || session.id !== attemptId) return [];
    return resolveSessionQuestions(session).map((question) => {
      const answer = session.answers[question.id] || "";
      const correct = checkAnswer(question, answer) === true;
      return {
        attempt_id: attemptId,
        student_id: studentId,
        question_id: question.id,
        section: question.section,
        skill: question.skill,
        subskill: question.subskill,
        answer_text: answer,
        is_correct: correct,
        points: correct ? question.points : 0,
        max_points: question.points,
      };
    });
  } catch {
    return [];
  }
}

export async function saveWritingSubmission(
  input: WritingSubmissionInput,
  {
    supabase = createClient(),
    storage = window.localStorage,
  }: { supabase?: SupabaseClient; storage?: StorageLike } = {},
): Promise<{ status: "submitted" | "error"; error?: string }> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session)
      throw new Error("No active Supabase session for the current student");

    const studentId = session.user.id;
    const objectivePayloads = buildFullObjectiveAnswerPayloads(
      storage,
      input.attemptId,
      studentId,
    );
    const { error: attemptError } = await supabase
      .from("attempts")
      .upsert(buildWritingAttemptPayload(input, studentId, objectivePayloads), {
        onConflict: "id",
      });
    if (attemptError) throw attemptError;

    const { data: existing, error: readError } = await supabase
      .from("attempt_answers")
      .select("question_id")
      .eq("attempt_id", input.attemptId);
    if (readError) throw readError;

    const existingIds = new Set((existing || []).map((row) => row.question_id));
    const payloads = [
      ...objectivePayloads,
      buildWritingAnswerPayload(input, studentId),
    ].filter((payload) => !existingIds.has(payload.question_id));

    if (payloads.length) {
      const { error: answerError } = await supabase
        .from("attempt_answers")
        .insert(payloads);
      if (answerError) throw answerError;
    }

    const marker: WritingSubmissionMarker = {
      attemptId: input.attemptId,
      taskId: input.task.id,
      year: input.task.year,
      wordCount: input.wordCount,
      submittedAt: input.completedAt,
      reviewStatus: "pending",
    };
    storage.setItem(writingSubmissionKey(input.task.id), JSON.stringify(marker));
    return { status: "submitted" };
  } catch (error) {
    return { status: "error", error: getWritingSubmissionErrorMessage(error) };
  }
}
