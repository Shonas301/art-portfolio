import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { DemoReel } from './pages/DemoReel'
import { ThreeDWork } from './pages/ThreeDWork'
import { PandySeries } from './pages/PandySeries'
import { Code } from './pages/Code'
import { TwoDWork } from './pages/TwoDWork'
import { Resume } from './pages/Resume'
import { Contact } from './pages/Contact'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo-reel" element={<DemoReel />} />
            <Route path="/3d-work" element={<ThreeDWork />} />
            <Route path="/pandy-series" element={<PandySeries />} />
            <Route path="/code" element={<Code />} />
            <Route path="/2d-work" element={<TwoDWork />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
