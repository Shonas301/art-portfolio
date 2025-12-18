import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/styles/globals.css'
import { LayoutContent } from '@/components/LayoutContent'

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
    <html lang="en">
      <body>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
