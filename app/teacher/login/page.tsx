import Link from"next/link";import TeacherAuthForm from"@/components/teacher/TeacherAuthForm";
export default function Page(){return <main className="teacher-auth"><Link href="/">← На главную</Link><section><small>OLYMPIC ENGLISH LAB</small><h1>Teacher Workspace</h1><p>Войдите в кабинет учителя</p><TeacherAuthForm mode="login"/></section></main>}
