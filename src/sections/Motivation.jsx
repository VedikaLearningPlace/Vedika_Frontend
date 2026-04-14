import { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/motivation.css'

const QUOTES = [
  {
    text: 'The secret of getting ahead is getting started. Not tomorrow — today.',
    author: 'Mark Twain',
    field: 'Author & Humorist',
  },
  {
    text: 'Success is the sum of small efforts, repeated day in and day out, relentlessly.',
    author: 'Robert Collier',
    field: 'Self-Help Pioneer',
  },
  {
    text: "Don't count the days. Make the days count.",
    author: 'Muhammad Ali',
    field: '3× World Champion',
  },
  {
    text: "Believe you can and you're halfway there. The rest is pure execution.",
    author: 'Theodore Roosevelt',
    field: '26th U.S. President',
  },
  {
    text: 'Your future self is watching you right now through your memories. Choose wisely.',
    author: 'Hal Elrod',
    field: 'Best-Selling Author',
  },
]

const LAWS = [
  {
    num: '01',
    color: '#5182FF',
    title: 'Show Up Every Day',
    desc: 'Consistency beats talent. The student who shows up daily always outlasts the occasional genius.',
    val: '21',
    unit: 'days',
    lbl: 'to build a habit',
  },
  {
    num: '02',
    color: '#8B5CF6',
    title: 'Active Recall Wins',
    desc: 'Test yourself constantly. Spaced repetition and active recall are proven to triple your retention rate.',
    val: '3×',
    unit: '',
    lbl: 'better retention',
  },
  {
    num: '03',
    color: '#06D6A0',
    title: 'Target Daily Milestones',
    desc: 'Break your exam goal into daily targets. What gets measured gets managed — and gets achieved.',
    val: '100',
    unit: '%',
    lbl: 'goal clarity',
  },
  {
    num: '04',
    color: '#FFB700',
    title: 'Embrace Hard Days',
    desc: 'The days you least want to study are the days that define your result. Show up anyway — always.',
    val: '1',
    unit: 'day',
    lbl: 'at a time',
  },
]

/* ── Word-scatter quote engine ──────────────────────────────── */
function WordQuote({ text, active }) {
  const words = text.split(' ')
  return (
    <p className={`mot__words ${active ? 'mot__words--in' : 'mot__words--out'}`}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="mot__word"
          style={{ '--wi': i, '--wt': words.length }}
        >
          {w}&nbsp;
        </span>
      ))}
    </p>
  )
}

/* ── Main ───────────────────────────────────────────────────── */
export default function Motivation() {
  const [qi, setQi]           = useState(0)
  const [active, setActive]   = useState(true)
  const [progress, setProg]   = useState(0)
  const [paused, setPaused]   = useState(false)
  const sectionRef            = useRef(null)
  const rafRef                = useRef(null)
  const startRef              = useRef(null)
  const timerRef              = useRef(null)
  const DURATION              = 5500

  /* advance quote */
  const advance = useCallback((toIdx) => {
    setActive(false)
    setTimeout(() => {
      setQi(toIdx !== undefined ? toIdx : (i) => (i + 1) % QUOTES.length)
      setProg(0)
      startRef.current = null
      setActive(true)
    }, 500)
  }, [])

  /* auto-cycle timer */
  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => advance(), DURATION)
    return () => clearInterval(timerRef.current)
  }, [paused, qi, advance])

  /* progress rAF */
  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return }
    const tick = (now) => {
      if (!startRef.current) startRef.current = now
      setProg(Math.min((now - startRef.current) / DURATION, 1))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [qi, paused])

  /* law reveals */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.mot__law').forEach((el, i) =>
            setTimeout(() => el.classList.add('in'), i * 100)
          )
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const q = QUOTES[qi]

  return (
    <section className="mot" ref={sectionRef}>
      {/* ── AMBIENT BG ── */}
      <div className="mot__dots" aria-hidden="true" />
      <div className="mot__orb mot__orb--a" aria-hidden="true" />
      <div className="mot__orb mot__orb--b" aria-hidden="true" />
      <div className="mot__noise" aria-hidden="true" />

      <div className="mot__wrap">

        {/* ── SECTION HEAD ── */}
        <header className="mot__head">
          <span className="mot__eyebrow">
            <span className="mot__eyebrow-dot" aria-hidden="true" />
            Daily Fuel
          </span>
          <h2 className="mot__title">
            Forge Your
            <br />
            <em>Champion Mindset.</em>
          </h2>
        </header>

        {/* ── QUOTE THEATER ── */}
        <div
          className="mot__theater"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Quote by ${q.author}: ${q.text}`}
        >
          {/* Vertical accent rail */}
          <div className="mot__rail" aria-hidden="true">
            <div
              className="mot__rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>

          {/* Quote body */}
          <div className="mot__qbody">
            {/* decorative mark */}
            <div className="mot__qmark-large" aria-hidden="true">
              <svg viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 48V28.8C0 12.8 8.8 3.2 26.4 0L29.6 5.6C20.4 8.4 15.2 14.4 14.4 24H27V48H0ZM33 48V28.8C33 12.8 41.8 3.2 59.4 0L62.6 5.6C53.4 8.4 48.2 14.4 47.4 24H60V48H33Z"
                  fill="url(#qm)"
                />
                <defs>
                  <linearGradient id="qm" x1="0" y1="0" x2="60" y2="48">
                    <stop stopColor="#5182FF" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Quote text — word-scatter */}
            <WordQuote text={q.text} active={active} />

            {/* Author */}
            <div className={`mot__author ${active ? 'mot__author--in' : 'mot__author--out'}`}>
              <span className="mot__author-dash" aria-hidden="true" />
              <div>
                <span className="mot__author-name">{q.author}</span>
                <span className="mot__author-field">{q.field}</span>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="mot__nav" aria-label="Quote navigation">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                className={`mot__navbtn ${i === qi ? 'on' : ''}`}
                onClick={() => { clearInterval(timerRef.current); advance(i) }}
                aria-label={`Quote ${i + 1}${i === qi ? ' (current)' : ''}`}
                aria-current={i === qi ? 'true' : undefined}
              >
                <span className="mot__navbtn-num">0{i + 1}</span>
                {i === qi && (
                  <span
                    className="mot__navbtn-prog"
                    style={{ transform: `scaleX(${progress})` }}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* ── FOUR LAWS ── */}
        <div className="mot__laws-wrap">
          <h3 className="mot__laws-title">
            <span className="mot__laws-title-num">04</span>
            Laws of the Champion
          </h3>

          <ol className="mot__laws" aria-label="The four laws of the champion">
            {LAWS.map((law, i) => (
              <li
                key={i}
                className="mot__law"
                style={{ '--lc': law.color }}
                aria-label={`Law ${law.num}: ${law.title}`}
              >
                {/* Hover glow */}
                <div className="mot__law-glow" aria-hidden="true" />

                {/* Giant background ordinal */}
                <span className="mot__law-bg-num" aria-hidden="true">
                  {law.num}
                </span>

                {/* Number pill */}
                <span className="mot__law-pill">{law.num}</span>

                {/* Content */}
                <div className="mot__law-content">
                  <h4 className="mot__law-title">{law.title}</h4>
                  <p className="mot__law-desc">{law.desc}</p>
                </div>

                {/* Metric */}
                <div className="mot__law-metric" aria-label={`${law.val}${law.unit} — ${law.lbl}`}>
                  <div className="mot__law-val">
                    {law.val}
                    <span className="mot__law-unit">{law.unit}</span>
                  </div>
                  <div className="mot__law-lbl">{law.lbl}</div>
                </div>

                {/* Connector line */}
                <div className="mot__law-line" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  )
}