import type { StudentProfile } from "@/lib/profile";
import { createClient } from "./client";

export type JoinedClass={class_id:string;class_name:string;grade:number|null;class_letter:string|null};
type SupabaseErrorLike={message?:unknown;details?:unknown;hint?:unknown;code?:unknown};

export function getClassJoinErrorMessage(error:unknown){
  const candidate=error&&typeof error==="object"?error as SupabaseErrorLike:null;
  const message=typeof candidate?.message==="string"?candidate.message.trim():"";
  const diagnostic=[message,candidate?.details,candidate?.hint,candidate?.code]
    .filter((value):value is string=>typeof value==="string").join(" ").toLowerCase();
  if(diagnostic.includes("класс с таким кодом не найден"))return"Класс с таким кодом не найден.";
  if(diagnostic.includes("требуется профиль ученика")||diagnostic.includes("student profile"))return"Не удалось подключить ученика к классу. Попробуйте ещё раз.";
  if(diagnostic.includes("failed to fetch")||diagnostic.includes("network")||diagnostic.includes("fetcherror"))return"Не удалось связаться с сервером.";
  return message||"Не удалось присоединиться к классу.";
}
export class StudentProfileConflict extends Error {
  constructor() {
    super("В этом браузере открыт другой ученический профиль. Нажмите «Сменить ученика».");
  }
}

const studentStorageKeys = new Set([
  "studentProfile", "studentProfileSync", "studentClass", "questionHistory",
  "recentQuestionIds", "trainingAttempts", "pendingCloudSync",
]);
const studentStoragePrefixes = [
  "olympic-full-", "olympic-standalone-", "olympic-writing-",
  "olympic-speaking-", "full-vzlet-",
];

export async function endStudentSession() {
  const { error } = await createClient().auth.signOut({ scope: "local" });
  if (error && error.name !== "AuthSessionMissingError") throw error;

  for (const key of Object.keys(localStorage)) {
    if (studentStorageKeys.has(key) || studentStoragePrefixes.some(prefix => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem("studentSessionChange", crypto.randomUUID());
}

export async function syncStudentProfile(profile: StudentProfile,joinCode="") {
  const supabase = createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    if (process.env.NODE_ENV === "development") console.error("[Supabase anonymous auth error]:", sessionError.message, sessionError);
    throw sessionError;
  }

  let user = sessionData.session?.user;
  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      if (process.env.NODE_ENV === "development") console.error("[Supabase anonymous auth error]:", error.message, error);
      throw error;
    }
    user = data.user ?? undefined;
  }
  if (!user) {
    const error = new Error("Anonymous sign-in returned no user");
    if (process.env.NODE_ENV === "development") console.error("[Supabase anonymous auth error]:", error.message, error);
    throw error;
  }
  if(process.env.NODE_ENV==="development")console.info("[Student Join] auth user:",user?"есть":"нет");

  const { data: existing, error: lookupError } = await supabase.from("students")
    .select("first_name,last_name,grade")
    .eq("id", user.id)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    const normalize = (value: string) => value.trim().toLowerCase();
    if (normalize(existing.first_name) !== normalize(profile.firstName)
      || normalize(existing.last_name) !== normalize(profile.lastName)
      || existing.grade !== Number(profile.grade)) {
      throw new StudentProfileConflict();
    }
  } else {
    const { error } = await supabase.from("students").insert({
      id: user.id,
      first_name: profile.firstName,
      last_name: profile.lastName,
      grade: Number(profile.grade),
      class_letter: profile.classLetter || null,
    });
    if (error) throw error;
  }

  let joinedClass:JoinedClass|null=null;
  const normalizedCode=joinCode.trim().toUpperCase();
  if(normalizedCode){
    if(process.env.NODE_ENV==="development"){console.info("[Student Join] code:",normalizedCode);console.info("[Student Join] rpc called")}
    const{data,error}=await supabase.rpc("join_class_by_code",{p_code:normalizedCode});
    if(error){
      if(process.env.NODE_ENV==="development"){console.info("[Student Join] rpc error");console.error("[Class Join Error]",error)}
      throw error;
    }
    joinedClass=(data?.[0] as JoinedClass|undefined)||null;
    if(process.env.NODE_ENV==="development"){console.info("[Student Join] rpc success");console.info("[Student Join] class:",joinedClass?`${joinedClass.grade??""}${joinedClass.class_letter??""}`:"не возвращён")}
  }
  return{userId:user.id,joinedClass};
}
