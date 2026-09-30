import { useId } from 'react';

/** Original scalable illustrations: no network assets or emoji. */
export default function StudyArt({ kind, className }: { kind: string; className?: string }) {
  const id = useId().replace(/:/g, '');
  return <svg className={className} viewBox="0 0 300 230" fill="none" aria-hidden="true">
    <defs><linearGradient id={id} x1="30" y1="20" x2="270" y2="230" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset="1" stopColor="#becdff"/></linearGradient><filter id={`${id}shadow`}><feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#443489" floodOpacity=".18"/></filter></defs>
    <ellipse cx="163" cy="205" rx="108" ry="14" fill="#6576b7" opacity=".12"/>
    <g filter={`url(#${id}shadow)`}>
    {kind === 'hero' || kind === 'culture' ? <>
      <path d="M33 190V116l18-16 18 16v74M76 190V130h67v60M155 190V75h55v115M215 190v-63h53v63" fill="#e8b46d" stroke="#c78b48" strokeWidth="3"/>
      <path d="M151 77l31-50 32 50z" fill="#3b91ba"/><path d="M178 28V9h7v19" fill="#f5c05c"/>
      <path d="M161 101h43v43h-43z" fill="#f9dfad"/><circle cx="182" cy="122" r="17" fill="white" stroke="#c89150" strokeWidth="3"/><path d="M182 110v13l8 5" stroke="#293965" strokeWidth="3" strokeLinecap="round"/>
      {[46,83,104,125,164,181,198,225,244,261].map((x,i)=><path key={x} d={`M${x} ${i<4?145:159}v22`} stroke="#66587a" strokeWidth="6"/>)}
      <path d="M22 193h259" stroke="#e1aa65" strokeWidth="9"/>
      <path d="M32 91l18-29 19 29zM216 115l11-24 11 24M250 115l11-24 11 24" fill="#479aba"/>
      <path d="M230 194c-26-24-4-55 8-36 7-34 35-28 26-5 30-9 39 17 15 24 20 26-16 36-49 17" fill="#51cdb5"/>
      <path d="M30 209c62-20 163-9 241-33" stroke="#fff" strokeWidth="12" strokeLinecap="round"/>
    </> : kind === 'film' ? <>
      <g transform="rotate(-12 150 120)"><rect x="48" y="54" width="198" height="136" rx="15" fill={`url(#${id})`}/>{[91,107,123,139,155].map(y=><path key={y} d={`M65 ${y}h160`} stroke="#93b6e5" strokeWidth="2"/>)}<path d="M108 134V74l31-7v54M184 151V89l31-7v54" stroke="#448dff" strokeWidth="7"/><ellipse cx="97" cy="138" rx="15" ry="10" fill="#448dff"/><ellipse cx="129" cy="124" rx="15" ry="10" fill="#448dff"/><ellipse cx="174" cy="155" rx="15" ry="10" fill="#7461ef"/><ellipse cx="204" cy="139" rx="15" ry="10" fill="#7461ef"/></g>
      <rect x="197" y="26" width="57" height="54" rx="12" fill="#417dfa"/><path d="M215 43l22 10-22 11z" fill="white"/>
    </> : kind === 'mistakes' ? <>
      <g transform="rotate(-12 156 125)"><rect x="73" y="40" width="154" height="164" rx="13" fill="white"/>{[78,104,130,156].map(y=><path key={y} d={`M99 ${y}h95`} stroke="#ebbcdb" strokeWidth="4"/>)}<path d="M96 101l11 11 20-24M96 153l11 11 20-24" stroke="#eb5799" strokeWidth="4" strokeLinecap="round"/><circle cx="177" cy="158" r="18" stroke="#ed6594" strokeWidth="3"/><path d="M168 150l17 17m0-17l-17 17" stroke="#ed6594" strokeWidth="3"/></g><path d="M219 146l27-92 11 3-27 93-10 14z" fill="#fc718d"/><path d="M246 54l4-14 11 3-4 14" fill="#ffbc7e"/>
    </> : kind === 'mixed' ? <>
      <path d="M59 83h51c-17-29 28-42 31-15v15h43v47c29-18 43 23 16 29h-16v43h-49c18-28-25-43-30-14v14H59v-48c-28 16-42-23-16-29h16z" fill="#39cbae"/><path d="M157 65h38c-12-27 26-38 32-13v13h43v43c26-14 36 22 12 27h-12v38h-44c12-26-25-37-30-13v13h-39v-44c-27 13-38-23-13-27h13z" fill="#ffc65e"/><path d="M83 132h40c-11-22 23-35 28-10v10h40v41c24-11 34 23 11 28h-11v24h-41c11-23-22-34-27-10v10H83v-41c-24 11-34-22-11-27h11z" fill="#7472f6"/>
    </> : <>
      <g transform="rotate(-13 148 135)"><rect x="44" y="54" width="204" height="49" rx="24" fill="white"/><rect x="65" y="112" width="194" height="49" rx="24" fill="#f5eeff"/><rect x="91" y="170" width="166" height="44" rx="22" fill="white"/><text x="67" y="84" fill="#9355e9" fontSize="18" fontWeight="700">out of the blue</text><text x="85" y="142" fill="#7865d7" fontSize="18" fontWeight="700">a piece of cake</text><text x="109" y="198" fill="#527cd1" fontSize="17" fontWeight="700">once in a while</text></g>
    </>}
    </g>
    <path d="M266 20v21m-10-10h20M27 51v15m-7-7h14" stroke="#a18aef" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}
