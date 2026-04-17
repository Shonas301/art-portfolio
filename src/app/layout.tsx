import type { Metadata, Viewport } from 'next'
import { Cormorant } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/styles/globals.css'
import { LayoutContent } from '@/components/LayoutContent'

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'christina shi - 3d artist portfolio',
  description: '3d artist portfolio showcasing animation, modeling, and creative work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
