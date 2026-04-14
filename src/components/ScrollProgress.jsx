import { useEffect, useState } from 'react'
import './ScrollProgress.css'

export default function ScrollProgress() {
  const [pct, setPct]   = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => {
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0)
      setShow(scrolled > 320)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const r    = 22
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <>
      <div className="sp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Page scroll progress">
        <div className="sp-bar__fill" style={{ width: `${pct}%` }}/>
      </div>

      <div className={`sp-fab-wrap ${show ? 'show' : ''}`}>
        <div className="sp-ring-wrap" title={`${pct}% scrolled`} aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r={r} stroke="var(--border)" strokeWidth="2.5"/>
            <circle
              cx="28" cy="28" r={r}
              stroke="url(#spg)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ - dash}`}
              transform="rotate(-90 28 28)"
              style={{ transition: 'stroke-dasharray 0.15s linear' }}
            />
            <defs>
              <linearGradient id="spg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#5182FF"/>
                <stop offset="100%" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
          </svg>
          {/* Show percentage with % sign */}
          <span className="sp-pct">{pct}<span className="sp-pct-sign">%</span></span>
        </div>

        <button
          className="sp-fab"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  )
}