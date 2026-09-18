import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { listeningSet } from "@/data/questions/grade-7-8/2022";
import { grade78Listening2025 } from "@/data/questions/grade-7-8/2025";
import { grade9Listening2022 } from "@/data/questions/grade-9/official/2022";
import { grade9Listening2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";
import { official2025ForGrade } from "@/data/questions/grade-9-10/official-2025";

const grade9Listening2024=official2024ForGrade(9).listening;
const grade9Listening2025=official2025ForGrade(9).listening;

export default function Page(){return <GradeOfficialSection junior={[listeningSet,grade78Listening2025]} grade9={[grade9Listening2022,grade9Listening2023,grade9Listening2024,grade9Listening2025]}/>}
