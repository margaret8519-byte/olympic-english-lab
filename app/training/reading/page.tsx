import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { readingSet } from "@/data/questions/grade-7-8/2022";
import { grade9Reading2022 } from "@/data/questions/grade-9/official/2022";
import { grade9Reading2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";

const grade9Reading2024=official2024ForGrade(9).reading;

export default function Page(){return <GradeOfficialSection junior={readingSet} grade9={[grade9Reading2022,grade9Reading2023,grade9Reading2024]}/>}
