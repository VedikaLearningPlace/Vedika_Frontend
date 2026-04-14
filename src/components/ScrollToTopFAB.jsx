import { useEffect, useState } from 'react'
import './ScrollToTopFAB.css'

export default function ScrollToTopFAB() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      className={`fab ${visible ? 'fab--visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}