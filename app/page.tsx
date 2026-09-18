import Image from "next/image";
import Link from "next/link";

export default function Landing(){
  return <main className="wow-landing">
    <div className="wow-landing-frame">
      <Image
        src="/landing-wow.webp"
        alt="Olympic English Lab — интерактивный олимпиадный тренажёр"
        fill
        priority
        sizes="100vw"
        className="wow-landing-art"
      />
      <Link
        href="/start"
        className="wow-landing-hit wow-landing-hit-student"
        aria-label="Пройти тренировку"
      />
      <Link
        href="/teacher/login"
        className="wow-landing-hit wow-landing-hit-teacher"
        aria-label="Учителям"
      />
    </div>
  </main>
}
