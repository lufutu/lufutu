import type { Metadata } from 'next'
import './globals.css'
import { Press_Start_2P } from 'next/font/google'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Lufutu OS',
  description: 'A retro-style digital experience',
  generator: 'v0.dev',
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
