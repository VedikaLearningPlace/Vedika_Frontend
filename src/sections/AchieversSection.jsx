import { useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import '../styles/achievers.css'

const DATA = [
  {
    name: 'Priya Sharma', exam: 'UPSC Civil Services', result: 'AIR 234',
    rank: 'All India Rank', year: '2024', batch: 'Morning Batch',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    color: '#5182FF',
    q: 'Vedika gave me the focused environment I desperately needed. The silence policy is strictly enforced and it changed everything.',
  },
  {
    name: 'Rahul Bisht', exam: 'SSC CGL', result: 'Inspector (CBI)',
    rank: 'Group B Officer', year: '2024', batch: 'Evening Batch',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    color: '#8B5CF6',
    q: 'The discussion room was a game changer. Best study center in Haldwani without a single doubt.',
  },
  {
    name: 'Anjali Pant', exam: 'IBPS PO', result: 'PNB Bank PO',
    rank: 'Bank Officer', year: '2023', batch: 'Morning Batch',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    color: '#06D6A0',
    q: 'Walking into Vedika daily became my ritual. The professional environment automatically activates study mode.',
  },
  {
    name: 'Amit Joshi', exam: 'Railway NTPC', result: 'Junior Clerk',
    rank: 'RRB Selected', year: '2023', batch: 'Full Day',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    color: '#FFB700',
    q: 'Cleared NTPC in my very first attempt. The AC, silence, and clean environment made 10-hour sessions effortless.',
  },
  {
    name: 'Neha Rawat', exam: 'UKPSC', result: 'Sub Inspector',
    rank: 'State Police', year: '2024', batch: 'Morning Batch',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    color: '#FF6B6B',
    q: 'The library saved me thousands on books. Everything I needed for UKPSC was already there.',
  },
  {
    name: 'Deepak Arya', exam: 'NDA Exam', result: 'Selected NDA 152',
    rank: 'Defence Forces', year: '2023', batch: 'Evening Batch',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    color: '#5182FF',
    q: '8 hours of daily study felt easy here. Cooperative staff, pristine environment, zero distractions.',
  },
]

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const TrophyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 6v5a3 3 0 0 0 6 0V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 14v3M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export default function AchieversSection({ fullPage }) {
  const ref = useReveal('.ac', 90)
  const [hovered, setHovered] = useState(null)

  return (
    <section className={`ach ${fullPage ? 'ach--full' : ''}`} ref={ref}>
      <div className="ach__bg-grid"        aria-hidden="true"/>
      <div className="ach__orb ach__orb--1" aria-hidden="true"/>
      <div className="ach__orb ach__orb--2" aria-hidden="true"/>

      <div className="ach__wrap">

        <header className="s-head">
          <div className="s-badge">
            <span className="s-badge-dot"/>
            Our Pride
          </div>
          <h2 className="s-title">Students Who<br/><em>Made History</em></h2>
          <p className="s-sub">Real aspirants. Real results. Real stories from Vedika.</p>
        </header>

        <div className="ach__stats" aria-label="Achievement statistics">
          {[
            { val: '150+', label: 'Total Selections' },
            { val: '6+',   label: 'Exam Categories' },
            { val: '100%', label: 'Real Students' },
            { val: '3+',   label: 'Years of Results' },
          ].map((s, i) => (
            <div key={i} className="ach__stat">
              <span className="ach__stat-val">{s.val}</span>
              <span className="ach__stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="ach__grid" role="list">
          {DATA.map((a, i) => (
            <article
              key={i}
              className="ac"
              style={{ '--ac': a.color }}
              role="listitem"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="ac__glow" aria-hidden="true"/>

              <div className="ac__head">
                <div className="ac__head-bg" aria-hidden="true"/>
<div className="ac__avatar-wrap">
  <div className="ac__img">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z" 
        fill="white"
        opacity="0.9"
      />
      <path 
        d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" 
        fill="white"
        opacity="0.9"
      />
    </svg>
  </div>

  <div className="ac__avatar-ring" aria-hidden="true"/>
</div>
                <div className="ac__meta">
                  <h3 className="ac__name">{a.name}</h3>
                  <p className="ac__exam">{a.exam}</p>
                  <p className="ac__batch">{a.batch}</p>
                </div>
                <span className="ac__year">{a.year}</span>
              </div>

              <div className="ac__body">
                <div className="ac__result-row">
                  <div className="ac__result">
                    <TrophyIcon/>
                    <span>{a.result}</span>
                  </div>
                  <span className="ac__rank">{a.rank}</span>
                </div>

                <blockquote className="ac__quote">
                  <span className="ac__qmark" aria-hidden="true">"</span>
                  <p>{a.q}</p>
                </blockquote>

                <div className="ac__foot">
                  <div className="ac__stars" aria-label="5 stars">
                    {[...Array(5)].map((_, j) => <StarIcon key={j}/>)}
                  </div>
                  <span className="ac__verified">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </span>
                </div>
              </div>

              <div className="ac__line" aria-hidden="true"/>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}