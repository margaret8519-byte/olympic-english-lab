import GradeOfficialSection from "@/components/training/GradeOfficialSection";
import { listeningSet } from "@/data/questions/grade-7-8/2022";
import { grade9Listening2022 } from "@/data/questions/grade-9/official/2022";
import { grade9Listening2023 } from "@/data/questions/grade-9/official/2023";
import { grade9Listening2024 } from "@/data/questions/grade-9/official/2024";
export default function Page(){return <GradeOfficialSection junior={listeningSet} grade9={[grade9Listening2022,grade9Listening2023,grade9Listening2024]}/>}
