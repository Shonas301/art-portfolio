import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DownloadIcon from '@mui/icons-material/Download'

export function Resume() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="md" sx={{ px: 4, py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Resume
            </Typography>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Download PDF
            </Button>
          </Box>

          <Paper elevation={2} sx={{ p: 6 }}>
            <Stack spacing={4} divider={<Divider />}>
              {/* header */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Artist Name
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  3D Artist & Animator
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  email@email.edu | New York, NY | linkedin.com/in/artist
                </Typography>
              </Box>

              {/* summary */}
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Professional Summary
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  3D artist and animator with a unique background in software engineering and technical art.
                  Specializing in Maya, Blender, and Unreal Engine, with expertise in creating engaging character
                  animations and immersive environments. Passionate about combining technical skills with artistic
                  vision to create compelling visual narratives.
                </Typography>
              </Stack>

              {/* experience */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Experience
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        3D Artist / Animator
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        2022 - Present
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Freelance, New York, NY
                    </Typography>
                    <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Created character animations and environmental assets for various client projects
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Developed custom Maya tools to streamline production pipeline
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Collaborated with directors and designers to bring creative visions to life
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Technical Artist
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        2020 - 2022
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Animation Studio, Brooklyn, NY
                    </Typography>
                    <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Bridged gap between art and engineering teams
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Optimized rendering workflows and developed procedural generation systems
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ display: 'list-item', p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          Mentored junior artists on technical workflows and best practices
                        </Typography>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </Stack>

              {/* skills */}
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Skills
                </Typography>
                <Stack direction="row" spacing={4}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      3D Software
                    </Typography>
                    <List dense>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Autodesk Maya</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Blender</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Unreal Engine</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">ZBrush</Typography>
                      </ListItem>
                    </List>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Technical
                    </Typography>
                    <List dense>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Python Scripting</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Houdini VEX</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Git Version Control</Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body2" color="text.secondary">Pipeline Development</Typography>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </Stack>

              {/* education */}
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Education
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Bachelor of Fine Arts in Animation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      University Name
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    2020
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Fade>
  )
}
