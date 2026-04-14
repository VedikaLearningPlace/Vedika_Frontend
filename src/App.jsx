import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Achievers from './pages/Achievers'
import Contact from './pages/Contact'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App() {
  return (
    <Router>
      <ScrollReset />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/achievers" element={<Achievers />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}