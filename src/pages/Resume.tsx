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

export function Resume() {
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
                  Artist Name
                </Typography>
                <Typography level="body-md">
                  3D Artist & Animator
                </Typography>
                <Typography level="body-sm" sx={{ mt: 1 }}>
                  email@email.edu | New York, NY | linkedin.com/in/artist
                </Typography>
              </Box>

              {/* summary */}
              <Stack spacing={1.5}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Professional Summary
                </Typography>
                <Typography level="body-md">
                  3D artist and animator with a unique background in software engineering and technical art.
                  Specializing in Maya, Blender, and Unreal Engine, with expertise in creating engaging character
                  animations and immersive environments. Passionate about combining technical skills with artistic
                  vision to create compelling visual narratives.
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
                        3D Artist / Animator
                      </Typography>
                      <Typography level="body-sm">
                        2022 - Present
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                      Freelance, New York, NY
                    </Typography>
                    <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Created character animations and environmental assets for various client projects
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Developed custom Maya tools to streamline production pipeline
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Collaborated with directors and designers to bring creative visions to life
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                      <Typography level="title-md" sx={{ fontWeight: 600 }}>
                        Technical Artist
                      </Typography>
                      <Typography level="body-sm">
                        2020 - 2022
                      </Typography>
                    </Box>
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                      Animation Studio, Brooklyn, NY
                    </Typography>
                    <List size="sm" sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Bridged gap between art and engineering teams
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Optimized rendering workflows and developed procedural generation systems
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography level="body-sm">
                          Mentored junior artists on technical workflows and best practices
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
                      3D Software
                    </Typography>
                    <List size="sm">
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Autodesk Maya</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Blender</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Unreal Engine</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">ZBrush</Typography>
                      </ListItem>
                    </List>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-sm" sx={{ fontWeight: 600, mb: 1 }}>
                      Technical
                    </Typography>
                    <List size="sm">
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Python Scripting</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Houdini VEX</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Git Version Control</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography level="body-sm">Pipeline Development</Typography>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </Stack>

              {/* education */}
              <Stack spacing={1.5}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Education
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box>
                    <Typography level="title-md" sx={{ fontWeight: 600 }}>
                      Bachelor of Fine Arts in Animation
                    </Typography>
                    <Typography level="body-sm">
                      University Name
                    </Typography>
                  </Box>
                  <Typography level="body-sm">
                    2020
                  </Typography>
                </Box>
              </Stack>
            </Stack>
        </Sheet>
      </Container>
    </Box>
  )
}
