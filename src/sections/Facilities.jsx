import { useEffect, useRef } from 'react'
import '../styles/facilities.css'

const ITEMS = [
  {
    color: '#5182FF', label: 'Comfort',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h1m16 0h1M12 3v1m0 16v1M5.6 5.6l.7.7m11.4-.7-.7.7M5.6 18.4l.7-.7m11.4.7-.7-.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>,
    title: 'Fully AC Environment',
    desc: 'Powerful air conditioning keeps you comfortable and focused — no matter the season outside.',
    tag: 'Year-round',
  },
  {
    color: '#8B5CF6', label: 'Focus',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4"/><path d="M12 8v1m0 6v1M8 12h1m6 0h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    title: 'Silent Study Zone',
    desc: 'Pin-drop silence enforced at all times. Phones on silent, conversations strictly outside.',
    tag: 'Zero noise',
  },
  {
    color: '#06D6A0', label: 'Collaboration',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    title: 'Discussion Room',
    desc: 'Separate soundproofed room for group sessions, doubt-clearing, and peer study without disturbing others.',
    tag: 'Soundproofed',
  },
  {
    color: '#FFB700', label: 'Resources',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    title: 'Library Access',
    desc: 'Curated collection of UPSC, SSC, Banking, Railway and State exam books — all free to use.',
    tag: '500+ books',
  },
  {
    color: '#5182FF', label: 'Health',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="1" fill="#5182FF"/></svg>,
    title: 'RO Purified Water',
    desc: 'Chilled, clean RO drinking water available all day. Stay hydrated, stay sharp and focused.',
    tag: 'Always cold',
  },
  {
    color: '#8B5CF6', label: 'Hygiene',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    title: 'Separate Washrooms',
    desc: 'Pristine, hygienic, separate male and female washroom facilities maintained throughout the day.',
    tag: 'Pristine daily',
  },
  {
    color: '#06D6A0', label: 'Parking',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Secure Parking',
    desc: 'Dedicated parking for bikes and cars. Your vehicle is safe while you focus on your goals.',
    tag: 'Bikes & cars',
  },
  {
    color: '#FFB700', label: 'Uptime',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Power Backup',
    desc: 'UPS and generator backup ensure your study sessions never face a single minute of disruption.',
    tag: '100% uptime',
  },
]

export default function Facilities() {
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.fc').forEach((el, i) =>
          setTimeout(() => el.classList.add('in'), i * 70)
        )
        obs.disconnect()
      }
    }, { threshold: 0.06 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="fac" ref={ref}>
      <div className="fac__bg-grid"    aria-hidden="true"/>
      <div className="fac__orb fac__orb--1" aria-hidden="true"/>
      <div className="fac__orb fac__orb--2" aria-hidden="true"/>
      <div className="fac__orb fac__orb--3" aria-hidden="true"/>

      <div className="fac__wrap">

        <header className="s-head">
          <div className="s-badge">
            <span className="s-badge-dot"/>
            What We Offer
          </div>
          <h2 className="s-title">
            World-Class Facilities<br/>
            For <em>Serious Aspirants</em>
          </h2>
          <p className="s-sub">
            Everything you need to study at your absolute best — all under one roof.
          </p>
        </header>

        <div className="fac__grid" role="list">
          {ITEMS.map((f, i) => (
            <article
              key={i}
              className="fc"
              style={{ '--fc': f.color }}
              role="listitem"
            >
              <div className="fc__glow"   aria-hidden="true"/>
              <div className="fc__shine"  aria-hidden="true"/>

              <div className="fc__top">
                <div className="fc__icon-box">
                  {f.icon}
                </div>
                <span className="fc__tag">{f.tag}</span>
              </div>

              <span className="fc__label">{f.label}</span>
              <h3 className="fc__title">{f.title}</h3>
              <p  className="fc__desc">{f.desc}</p>

              <div className="fc__line" aria-hidden="true"/>
              <div className="fc__num"  aria-hidden="true">0{i + 1}</div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}