import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'christina shi - portfolio flipbook',
  description: 'interactive 3d flip book portfolio',
}

export default function V2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
