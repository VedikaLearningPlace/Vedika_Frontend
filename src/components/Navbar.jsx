import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import '../styles/navbar.css'

const NAV = [
  { to: '/', label: 'Home',      num: '01' },
  { to: '/gallery', label: 'Gallery',   num: '02' },
  { to: '/achievers', label: 'Achievers', num: '03' },
  { to: '/contact', label: 'Contact',   num: '04' },
]

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 2.5V4M12 20v1.5M2.5 12H4M20 12h1.5M5.64 5.64l1.06 1.06M17.3 17.3l1.06 1.06M5.64 18.36l1.06-1.06M17.3 6.7l1.06-1.06"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LogoSVG = ({ size = 36, id = 'nlg' }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="10" fill={`url(#${id})`}/>
    <path d="M9 12h12M9 17.5h12M9 23h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="25.5" cy="23" r="5" fill="white" opacity="0.92"/>
    <path d="M23.8 23l1.3 1.3 2.4-2.4" stroke="#5182FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="36" y2="36">
        <stop stopColor="#5182FF"/>
        <stop offset="1" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function Navbar() {
  const [solid, setSolid]     = useState(false)
  const [open, setOpen]       = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [hovered, setHovered] = useState(null)
  const { pathname }          = useLocation()
  const navigate              = useNavigate()
  const { theme, toggle }     = useTheme()
  const pillRef               = useRef(null)
  const linksRef              = useRef({})

  /* scroll — solid + progress */
  useEffect(() => {
    const fn = () => {
      setSolid(window.scrollY > 40)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* close drawer on route change */
  useEffect(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [pathname])

  /* slide active pill */
  useEffect(() => {
    const el = linksRef.current[pathname]
    if (!el || !pillRef.current) return
    const { offsetLeft: left, offsetWidth: width } = el
    pillRef.current.style.cssText = `left:${left}px;width:${width}px;opacity:1`
  }, [pathname, hovered])

  const openDrawer  = () => { setOpen(true);  document.body.style.overflow = 'hidden' }
  const closeDrawer = () => { setOpen(false); document.body.style.overflow = '' }

  return (
    <>
      {/* ── NAV BAR ── */}
      <header className={`nav ${solid ? 'nav--solid' : ''}`} role="banner">

        {/* Scroll progress line */}
        <div className="nav__progress">
          <div className="nav__progress-fill" style={{ width: `${scrollPct}%` }}/>
        </div>

        <div className="nav__wrap">

          {/* Logo */}
          <Link to="/" className="nav__logo" onClick={closeDrawer} aria-label="Vedika Learning Place – Home">
            <div className="nav__logo-icon">
              <LogoSVG size={36} id="nlg-main"/>
            </div>
            <div className="nav__logo-text">
              <span className="nav__logo-name">Vedika</span>
              <span className="nav__logo-sub">Learning Place</span>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="nav__links" aria-label="Main navigation">
            {/* Sliding pill bg */}
            <div className="nav__pill" ref={pillRef}/>

            {NAV.map(({ to, label, num }) => (
              <Link
                key={to}
                to={to}
                ref={el => linksRef.current[to] = el}
                className={`nav__link ${pathname === to ? 'nav__link--on' : ''}`}
                onMouseEnter={() => setHovered(to)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="nav__link-num">{num}</span>
                <span className="nav__link-label">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="nav__right">
            <button
              className="nav__theme"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="nav__theme-icon">
                {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
              </span>
            </button>

            <button className="nav__enroll" onClick={() => navigate('/contact')}>
              <span>Enroll Now</span>
              <ArrowIcon/>
            </button>

            <button
              className={`nav__burger ${open ? 'open' : ''}`}
              onClick={open ? closeDrawer : openDrawer}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="nav-drawer"
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </header>

      {/* ── DRAWER BACKDROP ── */}
      {open && (
        <div
          className="nav__backdrop"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        id="nav-drawer"
        className={`nav__drawer ${open ? 'open' : ''}`}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="nav__drawer-top">
          <Link to="/" className="nav__logo" onClick={closeDrawer}>
            <div className="nav__logo-icon">
              <LogoSVG size={30} id="nlg-drawer"/>
            </div>
            <div className="nav__logo-text">
              <span className="nav__logo-name">Vedika</span>
              <span className="nav__logo-sub">Learning Place</span>
            </div>
          </Link>
          <button className="nav__drawer-close" onClick={closeDrawer} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <nav className="nav__drawer-nav" aria-label="Mobile navigation links">
          {NAV.map(({ to, label, num }, i) => (
            <Link
              key={to}
              to={to}
              className={`nav__drawer-link ${pathname === to ? 'on' : ''}`}
              onClick={closeDrawer}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="nav__drawer-link-num">{num}</span>
              <span className="nav__drawer-link-label">{label}</span>
              <svg className="nav__drawer-link-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="nav__drawer-foot">
          <div className="nav__drawer-info">
            <div className="nav__drawer-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.45 18a19.45 19.45 0 0 1-6.19-6.19A19.79 19.79 0 0 1 2.12 3 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>+91 98765 43210</span>
            </div>
            <div className="nav__drawer-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>5:00 AM – 11:00 PM, Daily</span>
            </div>
          </div>

          <button
            className="nav__enroll nav__enroll--block"
            onClick={() => { closeDrawer(); navigate('/contact') }}
          >
            <span>Book Your Seat</span>
            <ArrowIcon/>
          </button>

          <button className="nav__theme-row" onClick={toggle}>
            <span className="nav__theme-row-icon">
              {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
            </span>
            <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}