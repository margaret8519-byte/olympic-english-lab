import Link from "next/link";
export function Vzlet(){return <Link href="/" className="vzlet" aria-label="На главную"><span className="vmark">V</span><span><b>ВЗЛЁТ</b><small>Олимпиадные задания<br/>платформы Взлёт</small></span></Link>}
export function Signature(){return <span className="signature">Margarita Lebedeva</span>}
export function AppHeader({blue=false}:{blue?:boolean}){return <header className={`app-header ${blue?"blue":""}`}><Vzlet/><Link href="/" className="wordmark">OLYMPIC <em>ENGLISH LAB</em></Link><div className="header-right"><Signature/><ProfileBadgeDynamic/></div></header>}
import ProfileBadgeDynamic from "./ProfileBadge";
