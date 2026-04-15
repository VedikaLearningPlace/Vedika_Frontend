import { useEffect, useRef, useState, useCallback } from 'react'
import '../styles/hero.css'

const PHRASES = [
  'Where toppers are forged.',
  'Silence is your secret weapon.',
  'Your focus. Your future.',
  'Where aspirants become officers.',
  'Pin-drop focus. Nation-level results.',
  'The environment that makes the difference.',
  'Built for those who refuse to settle.',
]

/* ── Typewriter ─────────────────────────────────────────────── */
function useTypewriter(phrases) {
  const [display, setDisplay] = useState('')
  const state = useRef({ wi: 0, ci: 0, deleting: false })
  useEffect(() => {
    let t
    const tick = () => {
      const { wi, ci, deleting } = state.current
      const word = phrases[wi]
      if (!deleting) {
        setDisplay(word.slice(0, ci + 1))
        if (ci + 1 === word.length) {
          t = setTimeout(() => { state.current = { wi, ci: word.length, deleting: true }; tick() }, 2600)
          return
        }
        state.current = { wi, ci: ci + 1, deleting: false }
        t = setTimeout(tick, ci === 0 ? 520 : 72)
      } else {
        setDisplay(word.slice(0, ci - 1))
        if (ci - 1 === 0) {
          state.current = { wi: (wi + 1) % phrases.length, ci: 0, deleting: false }
          t = setTimeout(tick, 420)
        } else {
          state.current = { wi, ci: ci - 1, deleting: true }
          t = setTimeout(tick, 28)
        }
      }
    }
    t = setTimeout(tick, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return display
}

/* ── Animated Counter ───────────────────────────────────────── */
function Counter({ to, suffix = '', dur = 2400 }) {
  const [n, setN] = useState(0)
  const ref = useRef(null), ran = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true
        let start = null
        const step = ts => {
          if (!start) start = ts
          const p = Math.min((ts - start) / dur, 1)
          setN(Math.floor((1 - Math.pow(1 - p, 4)) * to))
          if (p < 1) requestAnimationFrame(step); else setN(to)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, dur])
  return <span ref={ref}>{n}{suffix}</span>
}

/* ── Aurora Waves ───────────────────────────────────────────── */
function Aurora({ theme }) {
  const canvasRef = useRef(null)
  const themeRef  = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, W, H

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0
    const LAYERS = [
      { freq: 0.75, amp: 0.13, speed: 0.9,  y: 0.38, rgb: [43, 95, 255],    alpha: 0.055 },
      { freq: 0.55, amp: 0.10, speed: 0.65, y: 0.48, rgb: [200, 169, 110],  alpha: 0.038 },
      { freq: 1.05, amp: 0.08, speed: 1.25, y: 0.30, rgb: [100, 50, 210],   alpha: 0.040 },
      { freq: 0.45, amp: 0.14, speed: 0.50, y: 0.58, rgb: [200, 169, 110],  alpha: 0.028 },
    ]

    const draw = () => {
      t += 0.004
      ctx.clearRect(0, 0, W, H)
      const dark = themeRef.current !== 'light'

      LAYERS.forEach(({ freq, amp, speed, y, rgb, alpha }) => {
        const [r, g, b] = rgb
        const a = dark ? alpha : alpha * 0.6
        const yBase = H * y
        const ampPx = H * amp

        ctx.beginPath()
        ctx.moveTo(0, H)
        for (let x = 0; x <= W; x += 3) {
          const yVal = yBase
            + Math.sin(x * freq * 0.005 + t * speed) * ampPx
            + Math.sin(x * freq * 0.013 + t * speed * 1.5) * ampPx * 0.38
          ctx.lineTo(x, yVal)
        }
        ctx.lineTo(W, H)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, yBase - ampPx, 0, yBase + ampPx * 2.2)
        grad.addColorStop(0,   `rgba(${r},${g},${b},${a * 1.6})`)
        grad.addColorStop(0.45, `rgba(${r},${g},${b},${a})`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__aurora" aria-hidden="true" />
}

/* ── Premium Constellation ──────────────────────────────────── */
function Constellation({ theme, mouseX, mouseY }) {
  const canvasRef = useRef(null)
  const themeRef  = useRef(theme)
  const mouseRef  = useRef({ x: 0, y: 0 })

  useEffect(() => { themeRef.current = theme }, [theme])
  useEffect(() => { mouseRef.current = { x: mouseX, y: mouseY } }, [mouseX, mouseY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, W, H

    const COUNT = 100
    const nodes = Array.from({ length: COUNT }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const rand  = Math.random()
      const isGold = rand < 0.14
      const isStar = rand >= 0.14 && rand < 0.3
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
        pulse:  Math.random() * Math.PI * 2,
        pSpeed: 0.006 + Math.random() * 0.014,
        size:   isGold ? Math.random() * 2.2 + 2.6 : isStar ? Math.random() * 1.6 + 1.8 : Math.random() * 1.2 + 0.5,
        isGold, isStar,
      }
    })

    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].ox - nodes[j].ox
        const dy = nodes[i].oy - nodes[j].oy
        const dz = nodes[i].oz - nodes[j].oz
        if (dx*dx + dy*dy + dz*dz < 0.33) edges.push([i, j])
      }
    }

    const COUNT2 = 30
    const nodes2 = Array.from({ length: COUNT2 }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT2)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
        pSpeed: 0.009 + Math.random() * 0.012,
        size: Math.random() * 1.1 + 0.4,
      }
    })
    const edges2 = []
    for (let i = 0; i < nodes2.length; i++) {
      for (let j = i + 1; j < nodes2.length; j++) {
        const dx = nodes2[i].ox - nodes2[j].ox
        const dy = nodes2[i].oy - nodes2[j].oy
        const dz = nodes2[i].oz - nodes2[j].oz
        if (dx*dx + dy*dy + dz*dz < 0.55) edges2.push([i, j])
      }
    }

    const trails = Array.from({ length: 9 }, (_, i) => ({
      progress: Math.random(),
      speed:    0.0007 + Math.random() * 0.0011,
      edgeIdx:  Math.floor((i / 9) * edges.length),
      opacity:  Math.random() * 0.65 + 0.22,
      isGold:   Math.random() < 0.38,
    }))

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const rotY = (x, y, z, a) => ({ x: x*Math.cos(a)+z*Math.sin(a), y, z: -x*Math.sin(a)+z*Math.cos(a) })
    const rotX = (x, y, z, a) => ({ x, y: y*Math.cos(a)-z*Math.sin(a), z: y*Math.sin(a)+z*Math.cos(a) })

    const draw = ts => {
      ctx.clearRect(0, 0, W, H)
      const dark  = themeRef.current !== 'light'
      const mx    = mouseRef.current.x
      const my    = mouseRef.current.y
      const base  = ts * 0.00012
      const tiltX = 0.20 + my * 0.15
      const extraY = mx * 0.36

      const cx = W / 2, cy = H * 0.48
      const r  = Math.min(W, H) * 0.44

      const proj = nodes.map(n => {
        n.pulse += n.pSpeed
        let { x, y, z } = { x: n.ox, y: n.oy, z: n.oz }
        ;({ x, y, z } = rotX(x, y, z, tiltX))
        ;({ x, y, z } = rotY(x, y, z, base + extraY))
        const fov = 2.4, pz = z + fov
        const px = (x / pz) * r + cx
        const py = (y / pz) * r + cy
        const depth = (z + 1) / 2
        const alpha = (0.10 + depth * 0.78) * (dark ? 1.0 : 0.78)
        const size  = (n.size + 0.48 * Math.sin(n.pulse)) * (0.4 + depth * 0.95)
        return { px, py, depth, alpha, size, isGold: n.isGold, isStar: n.isStar }
      })

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.88)
      grd.addColorStop(0,   dark ? 'rgba(43,95,255,0.048)' : 'rgba(43,95,255,0.038)')
      grd.addColorStop(0.5, dark ? 'rgba(200,169,110,0.018)' : 'rgba(150,110,30,0.014)')
      grd.addColorStop(1,   'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()

      edges.forEach(([i, j]) => {
        const a = proj[i], b = proj[j]
        const avgD = (a.depth + b.depth) / 2
        const goldEdge = a.isGold || b.isGold
        const la = (goldEdge ? avgD * 0.15 : avgD * 0.11) * (dark ? 1 : 0.7)
        if (la < 0.01) return
        const grad = ctx.createLinearGradient(a.px, a.py, b.px, b.py)
        if (goldEdge && dark) {
          grad.addColorStop(0, `rgba(200,169,110,${la * 0.85})`)
          grad.addColorStop(1, `rgba(43,95,255,${la * 0.5})`)
        } else {
          grad.addColorStop(0, dark ? `rgba(43,95,255,${la})` : `rgba(43,95,255,${la})`)
          grad.addColorStop(1, dark ? `rgba(120,60,220,${la * 0.6})` : `rgba(100,60,200,${la * 0.6})`)
        }
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py)
        ctx.strokeStyle = grad; ctx.lineWidth = 0.62; ctx.stroke()
      })

      trails.forEach(tr => {
        tr.progress += tr.speed
        if (tr.progress >= 1) {
          tr.progress = 0
          tr.edgeIdx  = Math.floor(Math.random() * edges.length)
          tr.opacity  = Math.random() * 0.62 + 0.22
          tr.isGold   = Math.random() < 0.38
        }
        const [i, j] = edges[tr.edgeIdx]
        if (!proj[i] || !proj[j]) return
        const a = proj[i], b = proj[j]
        const tx = a.px + (b.px - a.px) * tr.progress
        const ty = a.py + (b.py - a.py) * tr.progress
        const depth = a.depth + (b.depth - a.depth) * tr.progress
        if (depth < 0.28) return
        const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 6)
        const al = tr.opacity * depth
        if (tr.isGold && dark) {
          tg.addColorStop(0, `rgba(240,208,128,${al})`); tg.addColorStop(1, 'transparent')
        } else {
          tg.addColorStop(0, dark ? `rgba(180,210,255,${al})` : `rgba(80,130,255,${al})`)
          tg.addColorStop(1, 'transparent')
        }
        ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2)
        ctx.fillStyle = tg; ctx.fill()
      })

      proj.slice().sort((a, b) => a.depth - b.depth).forEach(p => {
        if (p.alpha < 0.03) return
        if (p.isGold && p.depth > 0.6 && dark) {
          for (let ri = 0; ri < 6; ri++) {
            const ang = (ri / 6) * Math.PI * 2 + ts * 0.00028
            const len = p.size * 8 * p.depth
            ctx.beginPath()
            ctx.moveTo(p.px, p.py)
            ctx.lineTo(p.px + Math.cos(ang) * len, p.py + Math.sin(ang) * len)
            ctx.strokeStyle = `rgba(220,185,95,${p.alpha * 0.14})`
            ctx.lineWidth = 0.45; ctx.stroke()
          }
        }
        if ((p.isStar || p.isGold) && p.depth > 0.5) {
          const haloR = p.size * (p.isGold ? 6.5 : 4.8)
          const hg = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, haloR)
          if (p.isGold && dark) {
            hg.addColorStop(0, `rgba(240,208,128,${p.alpha * 0.38})`)
            hg.addColorStop(0.5, `rgba(200,160,80,${p.alpha * 0.12})`)
          } else {
            hg.addColorStop(0, dark ? `rgba(150,195,255,${p.alpha * 0.28})` : `rgba(43,95,255,${p.alpha * 0.18})`)
          }
          hg.addColorStop(1, 'transparent')
          ctx.beginPath(); ctx.arc(p.px, p.py, haloR, 0, Math.PI * 2)
          ctx.fillStyle = hg; ctx.fill()
        }
        ctx.beginPath(); ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        if (p.isGold && dark)
          ctx.fillStyle = `rgba(240,208,128,${p.alpha})`
        else
          ctx.fillStyle = dark
            ? p.isStar ? `rgba(180,210,255,${p.alpha})` : `rgba(110,155,255,${p.alpha})`
            : p.isStar ? `rgba(43,80,220,${p.alpha})` : `rgba(60,110,240,${p.alpha * 0.8})`
        ctx.fill()
      })

      const r2   = r * 0.31
      const s2cx = cx + r * 0.78 + mx * 18
      const s2cy = cy - r * 0.54 + my * 13
      const ang2 = base * 0.52 + 1.3

      const proj2 = nodes2.map(n => {
        n.pulse += n.pSpeed
        let { x, y, z } = { x: n.ox, y: n.oy, z: n.oz }
        ;({ x, y, z } = rotX(x, y, z, 0.42))
        ;({ x, y, z } = rotY(x, y, z, ang2))
        const fov = 2.2, pz = z + fov
        const px = (x / pz) * r2 + s2cx
        const py = (y / pz) * r2 + s2cy
        const depth = (z + 1) / 2
        const alpha = (0.07 + depth * 0.44) * (dark ? 0.8 : 0.62)
        const size  = (n.size + 0.3 * Math.sin(n.pulse)) * (0.38 + depth * 0.72)
        return { px, py, depth, alpha, size }
      })

      const sg = ctx.createRadialGradient(s2cx, s2cy, 0, s2cx, s2cy, r2 * 0.88)
      if (dark) { sg.addColorStop(0, 'rgba(200,169,110,0.038)'); sg.addColorStop(1, 'transparent') }
      else       { sg.addColorStop(0, 'rgba(100,60,200,0.04)');  sg.addColorStop(1, 'transparent') }
      ctx.beginPath(); ctx.arc(s2cx, s2cy, r2 * 0.88, 0, Math.PI * 2)
      ctx.fillStyle = sg; ctx.fill()

      edges2.forEach(([i, j]) => {
        const a = proj2[i], b = proj2[j]
        const la = ((a.depth + b.depth) / 2) * (dark ? 0.11 : 0.07)
        if (la < 0.01) return
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py)
        ctx.strokeStyle = dark ? `rgba(200,169,110,${la})` : `rgba(100,60,200,${la})`
        ctx.lineWidth = 0.48; ctx.stroke()
      })
      proj2.slice().sort((a, b) => a.depth - b.depth).forEach(p => {
        if (p.alpha < 0.02) return
        ctx.beginPath(); ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = dark ? `rgba(220,185,110,${p.alpha})` : `rgba(100,60,200,${p.alpha})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__constellation" aria-hidden="true" />
}

/* ── Floating Particles + Bokeh ─────────────────────────────── */
function Particles({ theme }) {
  const canvasRef = useRef(null)
  const themeRef  = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, W, H

    const particles = Array.from({ length: 55 }, () => ({
      x:      Math.random(),
      y:      Math.random() * 1.28,
      size:   Math.random() * 2.0 + 0.3,
      vy:     -(0.00007 + Math.random() * 0.00015),
      vx:     (Math.random() - 0.5) * 0.00008,
      pulse:  Math.random() * Math.PI * 2,
      pSpeed: 0.011 + Math.random() * 0.018,
      alpha:  Math.random() * 0.48 + 0.08,
      isGold: Math.random() < 0.42,
      isCross: Math.random() < 0.28,
    }))

    const bokeh = Array.from({ length: 14 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 75 + 28,
      pulse: Math.random() * Math.PI * 2,
      pSpeed: 0.0022 + Math.random() * 0.004,
      alpha: Math.random() * 0.036 + 0.008,
      isGold: Math.random() < 0.48,
    }))

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const dark = themeRef.current !== 'light'

      bokeh.forEach(b => {
        b.pulse += b.pSpeed
        const a  = b.alpha * (0.5 + 0.5 * Math.sin(b.pulse))
        const [r, g, bl] = b.isGold
          ? (dark ? [200, 169, 110] : [160, 120, 40])
          : (dark ? [43, 95, 255]   : [43, 95, 255])
        const g2 = ctx.createRadialGradient(b.x*W, b.y*H, 0, b.x*W, b.y*H, b.r)
        g2.addColorStop(0,   `rgba(${r},${g},${bl},${a})`)
        g2.addColorStop(0.55,`rgba(${r},${g},${bl},${a * 0.32})`)
        g2.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.arc(b.x*W, b.y*H, b.r, 0, Math.PI*2)
        ctx.fillStyle = g2; ctx.fill()
      })

      particles.forEach(p => {
        p.pulse += p.pSpeed
        p.x     += p.vx + Math.sin(p.pulse * 0.52) * 0.000075
        p.y     += p.vy
        if (p.y < -0.06) { p.y = 1.08; p.x = Math.random() }

        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse))
        const [r, g, b] = p.isGold
          ? (dark ? [240, 208, 128] : [200, 155, 45])
          : (dark ? [130, 175, 255] : [43, 95, 255])
        const color = `rgba(${r},${g},${b},${a})`

        ctx.beginPath(); ctx.arc(p.x*W, p.y*H, p.size, 0, Math.PI*2)
        ctx.fillStyle = color; ctx.fill()

        if (p.isCross && p.size > 1.1) {
          ctx.globalAlpha = a * 0.5
          ctx.strokeStyle = color; ctx.lineWidth = 0.45
          const len = p.size * 3.5
          ctx.beginPath()
          ctx.moveTo(p.x*W - len, p.y*H); ctx.lineTo(p.x*W + len, p.y*H)
          ctx.moveTo(p.x*W, p.y*H - len); ctx.lineTo(p.x*W, p.y*H + len)
          ctx.stroke(); ctx.globalAlpha = 1
        }
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />
}

/* ── Star Icon ──────────────────────────────────────────────── */
function StarIcon({ half }) {
  return (
    <svg className={`hero__star${half ? ' hero__star--half' : ''}`} width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
    </svg>
  )
}

/* ── Main Hero ──────────────────────────────────────────────── */
export default function Hero() {
  const typed      = useTypewriter(PHRASES)
  const sectionRef = useRef(null)
  const spotRef    = useRef(null)
  const orb1Ref    = useRef(null)
  const orb2Ref    = useRef(null)
  const orb3Ref    = useRef(null)
  const [seats]    = useState(() => Math.floor(Math.random() * 5) + 3)
  const [visible,  setVisible]  = useState(false)
  const [theme,    setTheme]    = useState('dark')
  const [mouse,    setMouse]    = useState({ x: 0, y: 0 })

  /* Track theme */
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme || 'dark')
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const onMouseMove = useCallback(e => {
    if (!sectionRef.current) return
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect()
    const mx = (e.clientX - left) / width  - 0.5
    const my = (e.clientY - top)  / height - 0.5
    setMouse({ x: mx, y: my })
    if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${mx*-44}px,${my*-32}px)`
    if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${mx*32}px,${my*26}px)`
    if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${mx*22}px,${my*-16}px)`
    if (spotRef.current) {
      spotRef.current.style.left = `${e.clientX - left}px`
      spotRef.current.style.top  = `${e.clientY - top}px`
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 })
    ;[orb1Ref, orb2Ref, orb3Ref].forEach(r => { if (r.current) r.current.style.transform = '' })
  }, [])

  const STATS = [
    { to: 500, suffix: '+', label: 'Students Enrolled' },
    { to: 150, suffix: '+', label: 'Govt. Selections' },
    { to: 3,   suffix: '+', label: 'Years of Trust' },
    { to: 18,  suffix: 'hr', label: 'Open Daily' },
  ]

  return (
    <section
      className={`hero hero--${theme} ${visible ? 'in' : ''}`}
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ── LAYERS ── */}
      <Aurora theme={theme} />
      <Constellation theme={theme} mouseX={mouse.x} mouseY={mouse.y} />
      <Particles theme={theme} />

      {/* ── SPOTLIGHT ── */}
      <div className="hero__spot" ref={spotRef} aria-hidden="true" />

      {/* ── ORBS ── */}
      <div className="hero__orbs" aria-hidden="true">
        <div className="hero__orb hero__orb--1" ref={orb1Ref} />
        <div className="hero__orb hero__orb--2" ref={orb2Ref} />
        <div className="hero__orb hero__orb--3" ref={orb3Ref} />
        <div className="hero__orb hero__orb--4" />
        <div className="hero__orb hero__orb--5" />
        <div className="hero__orb hero__orb--gold" />
      </div>

      {/* ── GRID ── */}
      <div className="hero__grid" aria-hidden="true" />

      {/* ── CONTENT ── */}
      <div className="hero__body">

        {/* Badge */}
        <div className="hero__badge" role="note">
          <span className="hero__pulse-dot" aria-hidden="true" />
          <span className="hero__badge-icon" aria-hidden="true">✦</span>
          <span>Haldwani's Premier Self-Study Destination</span>
          <span className="hero__badge-sep" aria-hidden="true" />
          <span className="hero__badge-tag">Est. 2021</span>
        </div>

        {/* Eyebrow */}
        <div className="hero__eyebrow" aria-hidden="true">
          <span className="hero__eyebrow-line" />
          <span>UTTARAKHAND'S FINEST</span>
          <span className="hero__eyebrow-line" />
        </div>

        {/* Headline */}
        <h1 className="hero__h1">
          <span className="hero__h1-a">
            {'Your Success'.split('').map((ch, i) => (
              <span key={i} className="hero__char" style={{ animationDelay: `${0.32 + i * 0.027}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </span>
          <span className="hero__h1-ornament" aria-hidden="true">
            <span className="hero__ornament-line" />
            <span className="hero__ornament-diamond">◆</span>
            <span className="hero__ornament-line" />
          </span>
          <em className="hero__h1-b">Starts Here.</em>
        </h1>

        {/* Typewriter */}
        <div className="hero__typed-row" aria-live="polite" aria-atomic="true" aria-label={typed}>
          <span className="hero__typed-quote" aria-hidden="true">"</span>
          <span className="hero__typed-word">{typed}</span>
          <span className="hero__caret" aria-hidden="true" />
          <span className="hero__typed-quote" aria-hidden="true">"</span>
        </div>

        {/* Sub */}
        <p className="hero__sub">
          A fully AC, pin-drop silent sanctuary built for serious aspirants —
          where distractions die and{' '}
          <em>ambitions are realized.</em>
        </p>

        {/* Rating */}
        <div className="hero__rating" aria-label="Rated 4.9 out of 5 stars">
          {[1,2,3,4,5].map(i => <StarIcon key={i} half={i === 5} />)}
          <span className="hero__rating-num">4.9</span>
          <span className="hero__rating-sep" aria-hidden="true">·</span>
          <span className="hero__rating-count">240+ Reviews</span>
        </div>

        {/* CTAs */}
        <div className="hero__ctas">
          <button className="hero__cta-main" onClick={() => { window.location.href = '/contact' }}>
            <span className="hero__cta-shine" aria-hidden="true" />
            <span className="hero__cta-text">Reserve Your Seat</span>
            <span className="hero__cta-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <button className="hero__cta-ghost" onClick={() => { window.location.href = '/gallery' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3"  y="3"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="3"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="3"  y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Tour the Space</span>
          </button>
        </div>

        {/* Urgency */}
        <div className="hero__seat-notice" role="status" aria-live="polite">
          <span className="hero__seat-dot" aria-hidden="true" />
          <span>Only <strong>{seats} seats</strong> remaining this month — act fast</span>
        </div>

        {/* Stats */}
        <div className="hero__stats-row" role="list">
          {STATS.map(({ to, suffix, label }, i) => (
            <div key={i} className="hero__stat" role="listitem">
              {i > 0 && <div className="hero__stat-sep" aria-hidden="true" />}
              <span className="hero__stat-num"><Counter to={to} suffix={suffix} /></span>
              <span className="hero__stat-lbl">{label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── MARQUEE ── */}
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {['UPSC','SSC CGL','IBPS PO','Railway NTPC','UKPSC','NDA','CUET','Bank Clerk',
            'UPSC','SSC CGL','IBPS PO','Railway NTPC','UKPSC','NDA','CUET','Bank Clerk']
            .map((item, i) => (
              <span key={i} className="hero__marquee-item">
                <span className="hero__mq-gem" aria-hidden="true">◆</span>
                {item}
              </span>
            ))}
        </div>
      </div>

    </section>
  )
}