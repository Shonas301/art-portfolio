'use client'

import { usePathname } from 'next/navigation'
import Box from '@mui/joy/Box'
import { Banner } from './Banner'
import { Footer } from './Footer'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isV2 = pathname?.startsWith('/v2')

  // v2 gets full immersive experience (no banner/footer)
  if (isV2) {
    return <>{children}</>
  }

  // v1 and other routes get banner and footer
  return (
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
  )
}
