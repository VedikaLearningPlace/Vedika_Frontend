import { useEffect, useRef, useCallback } from 'react'
import '../styles/whychooseus.css'

const POINTS = [
  {
    color: '#5182FF', rgb: '81,130,255',
    label: 'Focus',    stat: '#1',   statSub: 'in Haldwani',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity=".4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: 'Exam-Focused Design',
    desc: 'Built exclusively for competitive exam aspirants. Every element optimizes for deep work and laser focus.',
  },
  {
    color: '#8B5CF6', rgb: '139,92,246',
    label: 'Access',   stat: '18hr',  statSub: 'every single day',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: '18-Hour Access',
    desc: '5 AM to 11 PM, 365 days a year. We are always open whenever your grind demands it.',
  },
  {
    color: '#06D6A0', rgb: '6,214,160',
    label: 'Location', stat: '0km',   statSub: 'from city centre',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
    title: 'Prime Location',
    desc: 'Heart of Haldwani. Accessible from every corner of the city with ample parking.',
  },
  {
    color: '#FFB700', rgb: '255,183,0',
    label: 'Value',    stat: 'Best',  statSub: 'price in region',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    title: 'Student-Friendly Price',
    desc: 'Premium experience at the most affordable rates. No hidden costs, no compromises.',
  },
  {
    color: '#FF6B6B', rgb: '255,107,107',
    label: 'Safety',   stat: '24/7',  statSub: 'monitored',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>,
    title: 'Safe & Monitored',
    desc: 'CCTV surveillance and secure biometric entry. Your safety is non-negotiable.',
  },
  {
    color: '#5182FF', rgb: '81,130,255',
    label: 'Results',  stat: '150+',  statSub: 'selections',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M8 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 6v5a3 3 0 0 0 6 0V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 14v3M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: 'Proven Track Record',
    desc: '150+ exam selections across UPSC, SSC, Banking, Railways and more since 2021.',
  },
]

const BATTLE = [
  { f: 'AC Environment',       us: true,  them: false },
  { f: 'Pin-Drop Silent Zone', us: true,  them: false },
  { f: 'Discussion Room',      us: true,  them: false },
  { f: 'Library Access',       us: true,  them: false },
  { f: 'RO Drinking Water',    us: true,  them: true  },
  { f: 'Separate Washrooms',   us: true,  them: false },
  { f: 'Parking Space',        us: true,  them: false },
  { f: '24/7 Power Backup',    us: true,  them: false },
]

const usScore   = BATTLE.filter(r => r.us).length
const themScore = BATTLE.filter(r => r.them).length

/* ── Radar art for hero tile ────────────────────────────────── */
function RadarArt() {
  return (
    <svg className="wcu__hero-radar" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <circle cx="110" cy="110" r="90" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
      <circle cx="110" cy="110" r="70" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
      <circle cx="110" cy="110" r="50" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <circle cx="110" cy="110" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.28"/>
      <line x1="110" y1="20"  x2="110" y2="54"  stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <line x1="110" y1="166" x2="110" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <line x1="20"  y1="110" x2="54"  y2="110" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <line x1="166" y1="110" x2="200" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <path d="M110 110 L110 20 A90 90 0 0 1 183.6 65 Z"
        fill="url(#rg)" opacity="0.22" className="wcu__radar-sweep"/>
      <circle cx="110" cy="110" r="7" fill="currentColor" opacity="0.5"/>
      <circle cx="110" cy="110" r="3.5" fill="currentColor" opacity="0.9"/>
      <circle cx="110" cy="110" r="10" stroke="currentColor" strokeWidth="1.5"
        opacity="0.6" className="wcu__radar-ping"/>
      <defs>
        <radialGradient id="rg" cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(110 110) scale(90)">
          <stop stopColor="currentColor" stopOpacity="0.5"/>
          <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

/* ── 3D Duel Panel ───────────────────────────────────────────── */
function DuelPanel() {
  const wrapRef   = useRef(null)
  const panelRef  = useRef(null)
  const shineRef  = useRef(null)
  const rafRef    = useRef(null)
  const target    = useRef({ rx: 0, ry: 0 })
  const current   = useRef({ rx: 0, ry: 0 })
  const moving    = useRef(false)

  const lerp = (a, b, t) => a + (b - a) * t

  const tick = useCallback(() => {
    const c = current.current
    const t = target.current
    c.rx = lerp(c.rx, t.rx, 0.09)
    c.ry = lerp(c.ry, t.ry, 0.09)
    if (panelRef.current) {
      panelRef.current.style.transform =
        `perspective(1200px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
    }
    const d = Math.abs(c.rx - t.rx) + Math.abs(c.ry - t.ry)
    if (d > 0.015) rafRef.current = requestAnimationFrame(tick)
    else moving.current = false
  }, [])

  const onMouseMove = useCallback(e => {
    const rect = wrapRef.current.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width  - 0.5
    const cy = (e.clientY - rect.top)  / rect.height - 0.5
    target.current = { rx: cy * -7, ry: cx * 10 }
    if (shineRef.current) {
      shineRef.current.style.setProperty('--sx', `${(cx + 0.5) * 100}%`)
      shineRef.current.style.setProperty('--sy', `${(cy + 0.5) * 100}%`)
      shineRef.current.style.opacity = '1'
    }
    if (!moving.current) {
      moving.current = true
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  const onMouseLeave = useCallback(() => {
    target.current = { rx: 0, ry: 0 }
    if (shineRef.current) shineRef.current.style.opacity = '0'
    if (!moving.current) {
      moving.current = true
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  /* staggered row reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.wcu__duel-row').forEach((el, i) =>
          setTimeout(() => el.classList.add('in'), 100 + i * 70)
        )
        obs.disconnect()
      }
    }, { threshold: 0.04 })
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div
      className="wcu__duel-wrap"
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="wcu__duel" ref={panelRef}>
        {/* holographic shine */}
        <div className="wcu__duel-shine" ref={shineRef} aria-hidden="true" />

        {/* top gradient bar */}
        <div className="wcu__duel-topbar" aria-hidden="true" />

        {/* ── SCOREBOARD HEADER ── */}
        <div className="wcu__duel-head"
          aria-label={`Vedika ${usScore}/${BATTLE.length} vs Others ${themScore}/${BATTLE.length}`}>
          <div className="wcu__duel-side wcu__duel-side--us">
            <span className="wcu__duel-brand">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFB700" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Vedika Learning Place
            </span>
            <div className="wcu__duel-score wcu__duel-score--us">
              {usScore}<span className="wcu__duel-denom">/{BATTLE.length}</span>
            </div>
          </div>

          <div className="wcu__duel-vs" aria-hidden="true">VS</div>

          <div className="wcu__duel-side wcu__duel-side--them">
            <span className="wcu__duel-brand">Other Centers</span>
            <div className="wcu__duel-score wcu__duel-score--them">
              {themScore}<span className="wcu__duel-denom">/{BATTLE.length}</span>
            </div>
          </div>
        </div>

        {/* column labels */}
        <div className="wcu__duel-cols" aria-hidden="true">
          <div className="wcu__duel-col wcu__duel-col--us">Vedika ✦</div>
          <div className="wcu__duel-col wcu__duel-col--feat">Feature</div>
          <div className="wcu__duel-col wcu__duel-col--them">Others</div>
        </div>

        {/* ── FEATURE ROWS ── */}
        <div className="wcu__duel-rows" role="list">
          {BATTLE.map((row, i) => (
            <div
              key={i}
              className="wcu__duel-row"
              role="listitem"
              aria-label={`${row.f}: Vedika ${row.us ? 'yes' : 'no'}, Others ${row.them ? 'yes' : 'no'}`}
            >
              {/* Vedika cell */}
              <div className={`wcu__duel-cell wcu__duel-cell--us ${row.us ? 'pass' : 'fail'}`}>
                {row.us
                  ? <span className="wcu__icon-yes"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#00D48A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  : <span className="wcu__icon-no"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,87,87,0.55)" strokeWidth="2.2" strokeLinecap="round"/></svg></span>
                }
              </div>

              {/* Feature name */}
              <div className="wcu__duel-feat">{row.f}</div>

              {/* Others cell */}
              <div className={`wcu__duel-cell wcu__duel-cell--them ${row.them ? 'pass' : 'fail'}`}>
                {row.them
                  ? <span className="wcu__icon-yes"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#00D48A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  : <span className="wcu__icon-no"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,87,87,0.55)" strokeWidth="2.2" strokeLinecap="round"/></svg></span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* VERDICT */}
        <div className="wcu__duel-verdict">
          <span className="wcu__duel-verdict-text">The verdict is clear.</span>
          <div className="wcu__duel-verdict-score">
            <span className="wcu__v-us">{usScore}/{BATTLE.length}</span>
            <span className="wcu__v-dash">—</span>
            <span className="wcu__v-them">{themScore}/{BATTLE.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function WhyChooseUs() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.wcu__tile').forEach((el, i) =>
            setTimeout(() => el.classList.add('in'), i * 65)
          )
          obs.disconnect()
        }
      },
      { threshold: 0.04 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="wcu" ref={sectionRef}>
      <div className="wcu__grid-bg"  aria-hidden="true" />
      <div className="wcu__blob wcu__blob--a" aria-hidden="true" />
      <div className="wcu__blob wcu__blob--b" aria-hidden="true" />

      <div className="wcu__wrap">

        {/* ── HEADER ── */}
        <header className="wcu__header">
          <span className="wcu__eyebrow" role="note">
            <span className="wcu__eyebrow-dot" aria-hidden="true" />
            Why Vedika
          </span>
          <h2 className="wcu__title">
            Built for one thing.
            <em> Your selection.</em>
          </h2>
          <p className="wcu__sub">
            We don't just rent you a seat — we build an ecosystem for your success.
          </p>
        </header>

        {/* ── BENTO ── */}
        <div className="wcu__bento" role="list">
          {POINTS.map((p, i) => (
            <article
              key={i}
              className={`wcu__tile wcu__tile--${i + 1}`}
              style={{ '--tc': p.color, '--tc-rgb': p.rgb }}
              role="listitem"
            >
              <div className="wcu__tile-bar" aria-hidden="true" />

              {/* Hero tile gets radar, others get ghost number */}
              {i === 0
                ? <RadarArt />
                : <span className="wcu__tile-bg-stat" aria-hidden="true">{p.stat}</span>
              }

              <div className="wcu__tile-icon">{p.icon}</div>

              <div className="wcu__tile-body">
                <span className="wcu__tile-label">{p.label}</span>
                <h3 className="wcu__tile-title">{p.title}</h3>
                <p  className="wcu__tile-desc">{p.desc}</p>
              </div>

              <div className="wcu__tile-stat">
                <span className="wcu__tile-stat-val">{p.stat}</span>
                <span className="wcu__tile-stat-sub">{p.statSub}</span>
              </div>

              <div className="wcu__tile-glow" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* ── 3D DUEL ── */}
        <DuelPanel />

      </div>
    </section>
  )
}