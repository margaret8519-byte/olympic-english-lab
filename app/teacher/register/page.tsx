import Link from"next/link";import TeacherAuthForm from"@/components/teacher/TeacherAuthForm";
export default function Page(){return <main className="teacher-auth"><Link href="/">← На главную</Link><section><small>OLYMPIC ENGLISH LAB</small><h1>Регистрация учителя</h1><p>Создайте отдельный постоянный аккаунт</p><TeacherAuthForm mode="register"/></section></main>}
