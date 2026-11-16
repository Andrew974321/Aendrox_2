import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import { Shell } from '@/components/shell';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_IMAGE, KEYWORDS, PAGES, organizationLd, jsonLd } from '@/lib/site';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: PAGES[''].title, template: '%s | AENDROX' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_US', url: '/', title: PAGES[''].title, description: SITE_DESCRIPTION, images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: PAGES[''].title, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
  category: 'technology',
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};
export const viewport: Viewport = { themeColor: '#050505', colorScheme: 'dark' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationLd)}/><Shell>{children}</Shell></body></html>}

