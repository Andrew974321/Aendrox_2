import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import { Shell } from '@/components/shell';
export const metadata: Metadata = { metadataBase:new URL(process.env.SITE_URL || 'http://localhost:3000'), title:{default:'AENDROX — Engineering the Future.',template:'%s | AENDROX'},description:'Intelligent software, ambitious digital products, and extraordinary web experiences. Engineering the future with AENDROX.',openGraph:{title:'AENDROX — Engineering the Future.',description:'Intelligence. Innovation. Beyond Limits.',images:['/assets/wordmark.png']}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><Shell>{children}</Shell></body></html>}

