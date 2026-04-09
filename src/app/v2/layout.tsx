import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Christina Shi — 3D Artist Portfolio',
  description:
    'explore christina shi\'s interactive 3d flipbook portfolio featuring animation, modeling, digital art, and creative coding projects.',
  openGraph: {
    title: 'Christina Shi — 3D Artist Portfolio',
    description:
      'interactive 3d flipbook portfolio showcasing animation, modeling, digital art, and creative coding.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Christina Shi Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christina Shi — 3D Artist Portfolio',
    description:
      'interactive 3d flipbook portfolio showcasing animation, modeling, digital art, and creative coding.',
  },
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
