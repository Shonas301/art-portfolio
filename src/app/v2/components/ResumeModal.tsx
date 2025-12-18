'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Stack from '@mui/joy/Stack'
import Divider from '@mui/joy/Divider'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { useFlipBook } from '../context/FlipBookContext'

export function ResumeModal() {
  const { state, dispatch } = useFlipBook()

  const handleClose = () => {
    dispatch({ type: 'CLOSE_RESUME' })
  }

  return (
    <AnimatePresence>
      {state.resumeOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
            }}
          />

          {/* resume paper */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 200,
            }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '90%',
              maxWidth: '800px',
              zIndex: 10001,
            }}
          >
            <Box
              sx={{
                height: '100%',
                backgroundColor: '#faf8f3',
                backgroundImage: `
                  linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
                  linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
                overflow: 'auto',
                p: { xs: 3, md: 6 },
              }}
            >
              {/* close button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                  level="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700,
                    color: '#000000',
                    textTransform: 'lowercase',
                  }}
                >
                  resume
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="lg"
                    variant="outlined"
                    sx={{
                      borderColor: '#9333ea',
                      color: '#9333ea',
                      '&:hover': {
                        bgcolor: '#f3e8ff',
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleClose}
                    size="lg"
                    sx={{
                      bgcolor: '#ec4899',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#db2777',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              <Stack spacing={4} divider={<Divider />}>
                {/* header */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    level="h3"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 700,
                      color: '#000000',
                      mb: 1,
                    }}
                  >
                    edward elric
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      color: '#262626',
                    }}
                  >
                    state alchemist - the fullmetal alchemist
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      mt: 1,
                      fontSize: '1rem',
                      color: '#525252',
                    }}
                  >
                    fullmetal@amestris.mil | central city, amestris | state alchemist license #10011
                  </Typography>
                </Box>

                {/* summary */}
                <Stack spacing={1.5}>
                  <Typography
                    level="title-lg"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    professional summary
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      color: '#262626',
                      lineHeight: 1.7,
                    }}
                  >
                    youngest state alchemist in amestrian history, certified at age 12. specialist in transmutation
                    without transmutation circles, combat alchemy, and alchemical theory. proven track record in
                    field operations, crisis response, and complex problem-solving. currently researching advanced
                    alchemical applications while serving the amestrian military. known for innovative approaches
                    to seemingly impossible challenges.
                  </Typography>
                </Stack>

                {/* experience */}
                <Stack spacing={2}>
                  <Typography
                    level="title-lg"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    experience
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                        <Typography level="title-md" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                          state alchemist - the fullmetal alchemist
                        </Typography>
                        <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                          1911 - present
                        </Typography>
                      </Box>
                      <Typography level="body-sm" sx={{ mb: 1, fontSize: '1rem', color: '#525252' }}>
                        amestrian state military, central command
                      </Typography>
                      <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            conducted field research on advanced alchemical theory and philosopher&apos;s stone applications
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            executed high-priority missions involving chimera threats, homunculus encounters, and national security
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            pioneered circle-free transmutation techniques, improving combat response time by 300%
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                        <Typography level="title-md" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                          independent alchemist / researcher
                        </Typography>
                        <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                          1909 - 1911
                        </Typography>
                      </Box>
                      <Typography level="body-sm" sx={{ mb: 1, fontSize: '1rem', color: '#525252' }}>
                        self-employed, resembool & eastern amestris
                      </Typography>
                      <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            researched human transmutation and its consequences alongside alphonse elric
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            traveled extensively to study with master alchemists and gather ancient texts
                          </Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                            developed expertise in automail integration and biomechanical adaptation
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </Stack>
                </Stack>

                {/* skills */}
                <Stack spacing={2}>
                  <Typography
                    level="title-lg"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    skills
                  </Typography>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1, fontSize: '1.125rem' }}>
                        alchemical abilities
                      </Typography>
                      <List size="sm">
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>transmutation without circles</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>combat alchemy</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>material transmutation</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>alchemical theory & research</Typography>
                        </ListItem>
                      </List>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1, fontSize: '1.125rem' }}>
                        combat & technical
                      </Typography>
                      <List size="sm">
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>hand-to-hand combat</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>automail maintenance</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>strategic planning</Typography>
                        </ListItem>
                        <ListItem sx={{ p: 0 }}>
                          <Typography level="body-sm" sx={{ fontSize: '1rem' }}>xingese alkahestry (basic)</Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </Stack>
                </Stack>

                {/* education */}
                <Stack spacing={1.5}>
                  <Typography
                    level="title-lg"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 700,
                      color: '#000000',
                    }}
                  >
                    education & certifications
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Box>
                      <Typography level="title-md" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                        state alchemist certification
                      </Typography>
                      <Typography level="body-sm" sx={{ fontSize: '1rem', color: '#525252' }}>
                        amestrian state military - youngest ever certified
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                      1911
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 1.5 }}>
                    <Box>
                      <Typography level="title-md" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                        self-directed alchemical studies
                      </Typography>
                      <Typography level="body-sm" sx={{ fontSize: '1rem', color: '#525252' }}>
                        trained under izumi curtis, master alchemist - resembool
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ fontSize: '1rem' }}>
                      1908 - 1909
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
