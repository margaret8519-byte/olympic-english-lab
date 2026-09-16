import { grade10Listening2022 } from "../data/questions/grade-10-11/index.ts";
import { grade11Listening2022Verified } from "../data/questions/grade-10-11/official-2022.ts";
import { listeningGroupsFromSets, type ListeningGroup } from "./standalone-training.ts";

export type SafeListeningGroup = ListeningGroup & { audioSrc: string; audioMode: "file"; script: string; validation: { status: "safe"; playback: "source-mp3"; transcriptSource: string; taskSource: string; keySource: string; audioSource: string; audioSha256: string } };
export type DisabledListeningGroup = { grade: 9 | 10 | 11; year: 2022 | 2023 | 2024; reason: "missing-audio" | "missing-key" | "audio-transcript-mismatch"; audioSource: string | null };

type ListeningCandidate = ListeningGroup & { validation?: { status?: string; playback?: string; audioSource?: string | null; audioSha256?: string | null } };
const verifiedAudioSources: Readonly<Record<string, string>> = {
  "/audio/grade-10/2022/listening.mp3": "6C2841D41B6B893202A48A460503947D93C97DF6A6F9D3D3778E12F36F05D597",
  "/audio/grade-11/2022/listening.mp3": "9F902394448BEB51A13CF0D95F8DB637925CC434A0CABE549DE8D5C61D93E710",
};

export function isStrictlySafeListeningGroup(group: ListeningCandidate): group is SafeListeningGroup {
  return group.audioMode === "file" &&
    typeof group.audioSrc === "string" &&
    group.audioSrc.startsWith("/audio/") &&
    typeof group.script === "string" &&
    group.script.trim().length > 0 &&
    group.validation?.status === "safe" &&
    group.validation.playback === "source-mp3" &&
    typeof group.validation.audioSource === "string" &&
    group.validation.audioSource.length > 0 &&
    typeof group.validation.audioSha256 === "string" &&
    group.validation.audioSha256.length === 64 &&
    verifiedAudioSources[group.audioSrc] === group.validation.audioSha256 &&
    group.questions.length > 0 &&
    group.questions.every(question => Number(question.grade) === group.grade && !question.needsReview && question.acceptedAnswers.length === 1);
}

function safeListeningGroup(group: ListeningGroup | undefined, validation: SafeListeningGroup["validation"]): SafeListeningGroup {
  if (!group) throw new Error("Validated ListeningGroup is missing");
  const candidate = { ...group, validation };
  if (!isStrictlySafeListeningGroup(candidate)) throw new Error(`Unsafe ListeningGroup: ${group.id}`);
  return candidate;
}

const registry: Record<9 | 10 | 11, SafeListeningGroup[]> = {
  9: [],
  10: [safeListeningGroup(listeningGroupsFromSets([grade10Listening2022], 10)[0], {
    status: "safe",
    playback: "source-mp3",
    transcriptSource: "source_materials/grade-10/2022/script_52_1668763452.pdf",
    taskSource: "source_materials/grade-10/2022/tasks_52_1668763415.pdf",
    keySource: "source_materials/grade-10/2022/ans_52_1668763434.pdf",
    audioSource: "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_52_1755785414.7z#10",
    audioSha256: "6C2841D41B6B893202A48A460503947D93C97DF6A6F9D3D3778E12F36F05D597",
  })],
  11: [safeListeningGroup(listeningGroupsFromSets([grade11Listening2022Verified], 11)[0], {
    status: "safe",
    playback: "source-mp3",
    transcriptSource: "source_materials/grade-11/2022/script_52_1668763504.pdf",
    taskSource: "source_materials/grade-11/2022/tasks_52_1668763471.pdf",
    keySource: "source_materials/grade-11/2022/ans_52_1668763482.pdf",
    audioSource: "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_52_1755785414.7z#11",
    audioSha256: "9F902394448BEB51A13CF0D95F8DB637925CC434A0CABE549DE8D5C61D93E710",
  })],
};

export const disabledListeningGroups: DisabledListeningGroup[] = [
  { grade: 9, year: 2022, reason: "missing-audio", audioSource: null },
  { grade: 9, year: 2023, reason: "missing-key", audioSource: "source_materials/grade-9/2023/listening.mp3" },
  { grade: 9, year: 2024, reason: "audio-transcript-mismatch", audioSource: "source_materials/grade-9/2024/listening.mp3" },
  { grade: 10, year: 2023, reason: "missing-key", audioSource: "source_materials/grade-10/2023/listening.mp3" },
  { grade: 10, year: 2024, reason: "audio-transcript-mismatch", audioSource: "public/audio/grade-10/2024/listening.mp3" },
  { grade: 11, year: 2023, reason: "missing-key", audioSource: "source_materials/grade-11/2023/11_аудиозапись_для_конкурса_понимания_устной_речи.mp3" },
  { grade: 11, year: 2024, reason: "missing-audio", audioSource: null },
];

export function validatedListeningGroupsForGrade(grade: number): SafeListeningGroup[] {
  return registry[grade as 9 | 10 | 11] || [];
}
