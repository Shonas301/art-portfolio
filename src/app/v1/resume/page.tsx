import type { Metadata } from 'next'
import Box from '@mui/joy/Box'
import Container from '@mui/joy/Container'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import Divider from '@mui/joy/Divider'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import DownloadIcon from '@mui/icons-material/Download'

export const metadata: Metadata = {
  title: 'resume - christina shi',
  description: '3d artist and animator resume',
}

export default function Resume() {
  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="md" sx={{ px: 4, py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography level="h2" sx={{ fontWeight: 700 }}>
            Resume
          </Typography>
          <Button variant="outlined" startDecorator={<DownloadIcon />}>
            Download PDF
          </Button>
        </Box>

        <Sheet variant="outlined" sx={{ p: 6, borderRadius: 'lg' }}>
            <Stack spacing={4} divider={<Divider />}>
              {/* header */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Edward Elric
                </Typography>
                <Typography level="body-md">
                  State Alchemist - The Fullmetal Alchemist
                </Typography>
                <Typography level="body-sm" sx={{ mt: 1 }}>
                  fullmetal@amestris.mil | Central City, Amestris | State Alchemist License #10011
                </Typography>
              </Box>

              {/* summary */}
              <Stack spacing={1.5}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Professional Summary
                </Typography>
                <Typography level="body-md">
                  youngest state alchemist in amestrian history, certified at age 12. specialist in transmutation
                  without transmutation circles, combat alchemy, and alchemical theory. proven track record in
                  field operations, crisis response, and complex problem-solving. currently researching advanced
                  alchemical applications while serving the amestrian military. known for innovative approaches
                  to seemingly impossible challenges.
                </Typography>
              </Stack>

              {/* experience */}
              <Stack spacing={2}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Experience
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                      <Typography level="title-md" sx={{ fontWeight: 600 }}>
                        state alchemist - the fullmetal alchemist
                      </Typography>
                      <Typography level="body-sm">
                        1911 - present
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                      amestrian state military, central command
                    </Typography>
                    <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          conducted field research on advanced alchemical theory and philosopher&apos;s stone applications
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          executed high-priority missions involving chimera threats, homunculus encounters, and national security
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          pioneered circle-free transmutation techniques, improving combat response time by 300%
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                      <Typography level="title-md" sx={{ fontWeight: 600 }}>
                        independent alchemist / researcher
                      </Typography>
                      <Typography level="body-sm">
                        1909 - 1911
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                      self-employed, resembool & eastern amestris
                    </Typography>
                    <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          researched human transmutation and its consequences alongside alphonse elric
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          traveled extensively to study with master alchemists and gather ancient texts
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          developed expertise in automail integration and biomechanical adaptation
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </Stack>

              {/* skills */}
              <Stack spacing={2}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Skills
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1 }}>
                      alchemical abilities
                    </Typography>
                    <List size="sm">
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">transmutation without circles</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">combat alchemy</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">material transmutation</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">alchemical theory & research</Typography>
                      </ListItem>
                    </List>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1 }}>
                      combat & technical
                    </Typography>
                    <List size="sm">
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">hand-to-hand combat</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">automail maintenance</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">strategic planning</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">xingese alkahestry (basic)</Typography>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </Stack>

              {/* education */}
              <Stack spacing={1.5}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  education & certifications
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box>
                    <Typography level="title-md" sx={{ fontWeight: 600 }}>
                      state alchemist certification
                    </Typography>
                    <Typography level="body-sm">
                      amestrian state military - youngest ever certified
                    </Typography>
                  </Box>
                  <Typography level="body-sm">
                    1911
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 1.5 }}>
                  <Box>
                    <Typography level="title-md" sx={{ fontWeight: 600 }}>
                      self-directed alchemical studies
                    </Typography>
                    <Typography level="body-sm">
                      trained under izumi curtis, master alchemist - resembool
                    </Typography>
                  </Box>
                  <Typography level="body-sm">
                    1908 - 1909
                  </Typography>
                </Box>
              </Stack>
            </Stack>
        </Sheet>
      </Container>
    </Box>
  )
}
