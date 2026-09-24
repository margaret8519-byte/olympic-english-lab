import type { Metadata } from "next";
import BasePathAssetFix from "@/components/BasePathAssetFix";
import "./globals.css";
export const metadata:Metadata={title:"Olympic English Lab",description:"Интерактивный тренажёр для подготовки к олимпиадам"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body><BasePathAssetFix/>{children}</body></html>}
