import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'
import Box from '@mui/joy/Box'
import '@/styles/globals.css'

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
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Banner />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}
