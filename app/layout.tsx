import type { Metadata } from 'next'
import './globals.css'
import { Press_Start_2P } from 'next/font/google'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lufutu.com'),
  title: {
    default: 'Lufutu OS - Retro Windows Portfolio Experience',
    template: '%s | Lufutu OS'
  },
  description: 'Experience a nostalgic Windows 95/98-inspired portfolio with interactive desktop, retro games, and pixel art aesthetics. Built with Next.js and modern web technologies.',
  generator: 'Next.js',
  applicationName: 'Lufutu OS',
  referrer: 'origin-when-cross-origin',
  keywords: ['portfolio', 'windows 95', 'windows 98', 'retro', 'pixel art', 'web development', 'react', 'nextjs', 'typescript', 'games', 'desktop', 'ui/ux', 'interactive'],
  authors: [{ name: 'Lufutu', url: 'https://lufutu.com' }],
  creator: 'Lufutu',
  publisher: 'Lufutu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lufutu.com',
    title: 'Lufutu OS - Retro Windows Portfolio Experience',
    description: 'Experience a nostalgic Windows 95/98-inspired portfolio with interactive desktop, retro games, and pixel art aesthetics.',
    siteName: 'Lufutu OS',
    images: [
      {
        url: '/assets/icons/lufutu.png',
        width: 1200,
        height: 630,
        alt: 'Lufutu OS Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lufutu OS - Retro Windows Portfolio Experience',
    description: 'Experience a nostalgic Windows 95/98-inspired portfolio with interactive desktop, retro games, and pixel art aesthetics.',
    images: ['/assets/icons/lufutu.png'],
    creator: '@lufutu',
    creatorId: '1467726470533754880',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/icons/lufutu.png',
    shortcut: '/assets/icons/lufutu.png',
    apple: '/assets/icons/lufutu.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/assets/icons/lufutu.png',
    },
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code', // Add your Google verification code
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={pixelFont.variable}>
      <body>{children}</body>
    </html>
  )
}
