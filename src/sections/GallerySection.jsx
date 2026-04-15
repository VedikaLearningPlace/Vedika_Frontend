import { useState, useEffect, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal'
import '../styles/gallery.css'

const IMGS = [
  { id:1, title:'Main Study Hall',    cat:'study-zone',      url:'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=85' },
  { id:2, title:'Discussion Room',    cat:'discussion-room', url:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85' },
  { id:3, title:'Reading Corner',     cat:'study-zone',      url:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=85' },
  { id:4, title:'AC Infrastructure',  cat:'facilities',      url:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=85' },
  { id:5, title:'Book Library',       cat:'facilities',      url:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=85' },
  { id:6, title:'Study Pods',         cat:'study-zone',      url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85' },
  { id:7, title:'Group Session',      cat:'events',          url:'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=85' },
  { id:8, title:'Parking Area',       cat:'facilities',      url:'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=85' },
  { id:9, title:'Reception',          cat:'facilities',      url:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85' },
]

const CATS = [
  { key:'all',             label:'All Spaces' },
  { key:'study-zone',      label:'Study Zone' },
  { key:'discussion-room', label:'Discussion' },
  { key:'facilities',      label:'Facilities' },
  { key:'events',          label:'Events' },
]

const CAT_ICONS = {
  all:             <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>,
  'study-zone':    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  'discussion-room':<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  facilities:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  events:          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
}

export default function GallerySection({ fullPage }) {
  const [cat, setCat]         = useState('all')
  const [lb, setLb]           = useState(null)
  const [lbIdx, setLbIdx]     = useState(0)
  const [imgLoaded, setImgLoaded] = useState({})
  const ref = useReveal()

  const filtered = cat === 'all' ? IMGS : IMGS.filter(i => i.cat === cat)

  const handleKey = useCallback(e => {
    if (!lb) return
    if (e.key === 'Escape')      { setLb(null); return }
    if (e.key === 'ArrowRight')  setLbIdx(i => (i + 1) % filtered.length)
    if (e.key === 'ArrowLeft')   setLbIdx(i => (i - 1 + filtered.length) % filtered.length)
  }, [lb, filtered.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (lb) setLb(filtered[lbIdx])
  }, [lbIdx])

  const openLb = img => {
    setLb(img)
    setLbIdx(filtered.indexOf(img))
  }

  return (
    <section id="gallery" className={`gal ${fullPage ? 'gal--full' : ''}`} ref={ref}>
      <div className="gal__bg-grid"    aria-hidden="true"/>
      <div className="gal__orb gal__orb--1" aria-hidden="true"/>
      <div className="gal__orb gal__orb--2" aria-hidden="true"/>

      <div className="gal__wrap">

        <header className="s-head">
          <div className="s-badge">
            <span className="s-badge-dot"/>
            Inside Vedika
          </div>
          <h2 className="s-title">A Glimpse of Our<br/><em>Premium Space</em></h2>
          <p className="s-sub">Explore the environment where Haldwani's toppers study every day.</p>
        </header>

        <div className="gal__filters" role="tablist" aria-label="Filter gallery by category">
          {CATS.map(c => (
            <button
              key={c.key}
              role="tab"
              aria-selected={cat === c.key}
              className={`gal__fbtn ${cat === c.key ? 'on' : ''}`}
              onClick={() => setCat(c.key)}
            >
              <span className="gal__fbtn-icon">{CAT_ICONS[c.key]}</span>
              <span>{c.label}</span>
              {cat === c.key && (
                <span className="gal__fbtn-count">
                  {(c.key === 'all' ? IMGS : IMGS.filter(i => i.cat === c.key)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="gal__grid" role="list">
          {filtered.map((img, i) => (
            <button
              key={`${img.id}-${cat}`}
              className="gal__item"
              style={{ animationDelay: `${i * 55}ms` }}
              onClick={() => openLb(img)}
              role="listitem"
              aria-label={`View ${img.title}`}
            >
              {!imgLoaded[img.id] && <div className="gal__skeleton" aria-hidden="true"/>}
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                onLoad={() => setImgLoaded(p => ({ ...p, [img.id]: true }))}
                style={{ opacity: imgLoaded[img.id] ? 1 : 0 }}
              />
              <span className="gal__item-cat">{img.cat.replace('-', ' ')}</span>
              <div className="gal__overlay">
                <div className="gal__overlay-content">
                  <span className="gal__item-title">{img.title}</span>
                  <span className="gal__item-expand" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lb && (
        <div className="gal__lb" onClick={() => setLb(null)} role="dialog" aria-modal="true" aria-label={`Viewing: ${lb.title}`}>
          <div className="gal__lb-inner" onClick={e => e.stopPropagation()}>
            <button className="gal__lb-close" onClick={() => setLb(null)} aria-label="Close lightbox">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="gal__lb-nav gal__lb-nav--prev" onClick={e => { e.stopPropagation(); setLbIdx(i => (i - 1 + filtered.length) % filtered.length) }} aria-label="Previous image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <img src={lb.url.replace('w=800', 'w=1400')} alt={lb.title}/>
            <button className="gal__lb-nav gal__lb-nav--next" onClick={e => { e.stopPropagation(); setLbIdx(i => (i + 1) % filtered.length) }} aria-label="Next image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="gal__lb-foot">
              <p className="gal__lb-cap">{lb.title}</p>
              <span className="gal__lb-counter">{lbIdx + 1} / {filtered.length}</span>
            </div>
            <div className="gal__lb-dots" aria-hidden="true">
              {filtered.map((_, i) => (
                <button key={i} className={`gal__lb-dot ${i === lbIdx ? 'on' : ''}`} onClick={e => { e.stopPropagation(); setLbIdx(i) }}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}