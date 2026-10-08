// guide-route-deploy-retry
import Link from"next/link";
import{ArrowLeft,BookOpenCheck,CheckCircle2,ClipboardCheck,GraduationCap,Headphones,KeyRound,Mic2,PenLine,School,Target,Trophy,Users}from"lucide-react";

const studentSteps=[
  {icon:GraduationCap,title:"1. Введи данные и выбери класс",text:"Нажми «Пройти тренировку», введи имя и фамилию и выбери класс. Если учитель дал тебе код класса — введи его. Если кода нет, ничего в это поле не вводи и продолжай. Класс определяет уровень заданий."},
  {icon:Trophy,title:"2. Выбери режим",text:"Для 10 класса кнопка «Начать полную тренировку» запускает новый авторский вариант по образцу муниципального этапа «Взлёт» (60 заданий и Writing). Настоящие задания прошлых лет доступны в отдельном архиве. В других классах пока остаются прежние режимы."},
  {icon:Headphones,title:"3. Выполни письменные разделы",text:"Проходи Listening, Reading, Use of English и Writing. В полном раунде ответы сохраняются по ходу работы."},
  {icon:Mic2,title:"4. Speaking — отдельно",text:"Для 9–11 классов устная часть открывается отдельной тренировкой и не входит в письменный раунд."},
  {icon:CheckCircle2,title:"5. Разбери результат",text:"После завершения увидишь баллы, ошибки, правильные ответы и объяснения. Writing проверяет учитель, если ученик подключён к классу."},
  {icon:Target,title:"6. Тренируй слабые зоны",text:"Используй отдельные разделы и тренировку по слабым зонам, чтобы возвращаться к тем навыкам, где было больше ошибок."}
];

const teacherSteps=[
  {icon:School,title:"1. Войди как учитель",text:"На главной нажми «Учителям». Если аккаунта ещё нет — зарегистрируйся, затем открой рабочий кабинет."},
  {icon:Users,title:"2. Создай класс",text:"В разделе «Классы» создай группу. Для класса появится код подключения, который можно дать ученикам."},
  {icon:KeyRound,title:"3. Передай ученикам код",text:"Ученик вводит код класса. Выбранный им класс должен совпадать с классом группы — сайт не даст случайно подключиться к другому уровню."},
  {icon:BookOpenCheck,title:"4. Следи за результатами",text:"В кабинете видно попытки учеников, проценты, историю тренировок и слабые темы."},
  {icon:PenLine,title:"5. Проверяй Writing",text:"Письменная работа отображается прямо в попытке ученика и в очереди Writing. Можно поставить балл и оставить комментарий."},
  {icon:ClipboardCheck,title:"6. Проверяй Speaking",text:"Устные задания собраны в отдельном разделе Speaking. Результаты и проверка остаются в учительском кабинете."}
];

function StepGrid({items}:{items:typeof studentSteps}){return <div className="guide-step-grid">{items.map(({icon:Icon,title,text})=><article className="guide-step" key={title}><span><Icon/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>}

export default function GuidePage(){return <main className="guide-page">
  <header className="guide-top">
    <Link href="/" className="guide-back"><ArrowLeft/> На главную</Link>
    <div className="guide-brand">OLYMPIC <em>ENGLISH LAB</em></div>
    <span/>
  </header>

  <section className="guide-hero">
    <small>КРАТКАЯ ИНСТРУКЦИЯ</small>
    <h1>Как пользоваться Olympic English Lab</h1>
    <p>Выбери свою роль — и пройди по шагам. Всё самое важное без длинной справки.</p>
    <nav className="guide-role-nav">
      <a href="#student">🎓 Ученику</a>
      <a href="#teacher">👩‍🏫 Учителю</a>
    </nav>
  </section>

  <section id="student" className="guide-section guide-student">
    <div className="guide-section-head">
      <div><small>ДЛЯ УЧЕНИКА</small><h2>От первого входа до разбора ошибок</h2></div>
      <Link href="/start">Начать тренировку →</Link>
    </div>
    <StepGrid items={studentSteps}/>
    <aside className="guide-note"><b>Важно:</b> в 10 классе новый полный формат — авторская работа по образцу олимпиады, а не официальный вариант «Взлёта». Сейчас доступен один комплект, поэтому после завершения повтор будет с теми же заданиями. <Link href="/training/official-archive">Официальные задания прошлых лет →</Link></aside>
  </section>

  <section id="teacher" className="guide-section guide-teacher">
    <div className="guide-section-head">
      <div><small>ДЛЯ УЧИТЕЛЯ</small><h2>Класс, результаты и проверка работ</h2></div>
      <Link href="/teacher/login">Войти как учитель →</Link>
    </div>
    <StepGrid items={teacherSteps}/>
    <aside className="guide-note"><b>Подсказка:</b> Writing можно открыть прямо из попытки ученика — не обязательно переходить в отдельную очередь «Требует проверки».</aside>
  </section>
</main>}
