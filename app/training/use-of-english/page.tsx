import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { useOfEnglishSet } from "@/data/questions/grade-7-8/2022";
import { grade78UseOfEnglish2025 } from "@/data/questions/grade-7-8/2025";
import { grade9UseOfEnglish2022 } from "@/data/questions/grade-9/official/2022";
import { grade9UseOfEnglish2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";
import { official2025ForGrade } from "@/data/questions/grade-9-10/official-2025";

const grade9UseOfEnglish2024=official2024ForGrade(9)["use-of-english"];
const grade9UseOfEnglish2025=official2025ForGrade(9)["use-of-english"];

export default function Page(){return <GradeOfficialSection junior={[useOfEnglishSet,grade78UseOfEnglish2025]} grade9={[grade9UseOfEnglish2022,grade9UseOfEnglish2023,grade9UseOfEnglish2024,grade9UseOfEnglish2025]}/>}
