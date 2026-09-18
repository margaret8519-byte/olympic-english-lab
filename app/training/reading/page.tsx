import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { readingSet } from "@/data/questions/grade-7-8/2022";
import { grade78Reading2025 } from "@/data/questions/grade-7-8/2025";
import { grade9Reading2022 } from "@/data/questions/grade-9/official/2022";
import { grade9Reading2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";
import { official2025ForGrade } from "@/data/questions/grade-9-10/official-2025";

const grade9Reading2024=official2024ForGrade(9).reading;
const grade9Reading2025=official2025ForGrade(9).reading;

export default function Page(){return <GradeOfficialSection junior={[readingSet,grade78Reading2025]} grade9={[grade9Reading2022,grade9Reading2023,grade9Reading2024,grade9Reading2025]}/>}
