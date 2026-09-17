import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { useOfEnglishSet } from "@/data/questions/grade-7-8/2022";
import { grade9UseOfEnglish2022 } from "@/data/questions/grade-9/official/2022";
import { grade9UseOfEnglish2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";

const grade9UseOfEnglish2024=official2024ForGrade(9)["use-of-english"];

export default function Page(){return <GradeOfficialSection junior={useOfEnglishSet} grade9={[grade9UseOfEnglish2022,grade9UseOfEnglish2023,grade9UseOfEnglish2024]}/>}
