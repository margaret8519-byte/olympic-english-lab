import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { useOfEnglishSet } from "@/data/questions/grade-7-8/2022";
import { grade9UseOfEnglish2022 } from "@/data/questions/grade-9/official/2022";
import { grade9UseOfEnglish2023 } from "@/data/questions/grade-9/official/2023";
import { grade9UseOfEnglish2024 } from "@/data/questions/grade-9/official/2024";
export default function Page(){return <GradeOfficialSection junior={useOfEnglishSet} grade9={[grade9UseOfEnglish2022,grade9UseOfEnglish2023,grade9UseOfEnglish2024]}/>}
