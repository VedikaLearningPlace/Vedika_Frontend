import '../styles/footer.css'

const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/gallery',    label: 'Gallery' },
  { to: '/achievers',  label: 'Achievers' },
  { to: '/contact',    label: 'Contact' },
]

const FACILITIES = [
  'AC Environment','Silent Study Zone','Discussion Room',
  'Book Library','RO Drinking Water','Separate Washrooms',
  'Parking Space','Power Backup',
]

const CONTACT_ITEMS = [
  { color:'#5182FF', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>, label:'Address', value:'Char Dham Colony, Peepal Pokhra, 1 Fatehpur, Haldwani, UK 263139' },
  { color:'#06D6A0', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.45 18a19.45 19.45 0 0 1-6.19-6.19A19.79 19.79 0 0 1 2.12 3 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, label:'Phone', value:'+91 98765 43210' },
  { color:'#8B5CF6', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, label:'Email', value:'info@vedikalearning.com' },
  { color:'#FFB700', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, label:'Hours', value:'5:00 AM - 11:00 PM, Daily' },
]

const EXAMS = ['UPSC','SSC CGL','IBPS PO','Railway NTPC','UKPSC','NDA','CUET','Bank Clerk']

export default function Footer() {
  const y = new Date().getFullYear()

  const handleNav = (e, to) => {
    e.preventDefault()
    window.location.href = to
  }

  return (
    <footer className="foot" role="contentinfo">
      <div className="foot__top-glow" aria-hidden="true"/>

      <div className="foot__main">
        <div className="foot__wrap">

          <div className="foot__brand">
            <a href="/" className="foot__logo" onClick={e => handleNav(e,'/')} aria-label="Vedika Learning Place">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="url(#flg)"/>
                <path d="M9 12h12M9 17.5h12M9 23h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="25.5" cy="23" r="5" fill="white" opacity="0.95"/>
                <path d="M23.8 23l1.3 1.3 2.4-2.4" stroke="#5182FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="flg" x1="0" y1="0" x2="36" y2="36"><stop stopColor="#5182FF"/><stop offset="1" stopColor="#8B5CF6"/></linearGradient></defs>
              </svg>
              <div className="foot__logo-text">
                <span className="foot__logo-name">Vedika</span>
                <span className="foot__logo-sub">Learning Place</span>
              </div>
            </a>
            <p className="foot__brand-desc">Haldwani's most premium self-study center. Built for serious aspirants who refuse to settle for less.</p>
            <div className="foot__chips">
              {['Fully AC','Silent Zone','Library','RO Water'].map((c,i) => <span key={i} className="foot__chip">{c}</span>)}
            </div>
            <div className="foot__exams">
              <span className="foot__exams-label">We prepare you for</span>
              <div className="foot__exam-tags">
                {EXAMS.map((e,i) => <span key={i} className="foot__exam-tag">{e}</span>)}
              </div>
            </div>
          </div>

          <div className="foot__col">
            <h4 className="foot__col-head">Navigate</h4>
            <ul className="foot__col-list">
              {NAV_LINKS.map(({ to, label },i) => (
                <li key={i}>
                  <a href={to} className="foot__link" onClick={e => handleNav(e, to)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot__col">
            <h4 className="foot__col-head">Facilities</h4>
            <ul className="foot__col-list">
              {FACILITIES.map((f,i) => (
                <li key={i} className="foot__facility">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(0,212,138,0.15)"/><path d="M7 12l3.5 3.5L17 9" stroke="#00D48A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="foot__col">
            <h4 className="foot__col-head">Contact Us</h4>
            <div className="foot__contacts">
              {CONTACT_ITEMS.map((c,i) => (
                <div key={i} className="foot__ci">
                  <div className="foot__ci-icon" style={{ color: c.color, background: `${c.color}18`, borderColor: `${c.color}25` }}>{c.icon}</div>
                  <div>
                    <strong className="foot__ci-label">{c.label}</strong>
                    <p className="foot__ci-val">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="foot__bottom">
        <div className="foot__bottom-inner">
          <p className="foot__copy">&copy; {y} Vedika Learning Place. All rights reserved.</p>
          <div className="foot__bottom-divider" aria-hidden="true"/>
          <p className="foot__tagline">Crafted with dedication for serious aspirants of Haldwani</p>
        </div>
      </div>
    </footer>
  )
}