import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ExecutiveOS AI — Your AI Executive Board',
  description: 'CEO, CTO, CFO, COO, CMO, CHRO powered by Gemini AI. Free tier.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
