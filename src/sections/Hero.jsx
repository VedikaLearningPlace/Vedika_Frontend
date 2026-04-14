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
          t = setTimeout(() => { state.current = { wi, ci: word.length, deleting: true }; tick() }, 2400)
          return
        }
        state.current = { wi, ci: ci + 1, deleting: false }
        t = setTimeout(tick, ci === 0 ? 500 : 68)
      } else {
        setDisplay(word.slice(0, ci - 1))
        if (ci - 1 === 0) { state.current = { wi: (wi + 1) % phrases.length, ci: 0, deleting: false }; t = setTimeout(tick, 380) }
        else { state.current = { wi, ci: ci - 1, deleting: true }; t = setTimeout(tick, 32) }
      }
    }
    t = setTimeout(tick, 700)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return display
}

/* ── Animated Counter ───────────────────────────────────────── */
function Counter({ to, suffix = '', dur = 2200 }) {
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

/* ── Epic Constellation ─────────────────────────────────────── */
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

    /* ── PRIMARY SPHERE — 90 nodes ── */
    const COUNT = 90
    const nodes = Array.from({ length: COUNT }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const isStar = Math.random() < 0.12        // bright "star" nodes
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
        pSpeed: 0.008 + Math.random() * 0.016,
        size: isStar ? Math.random() * 1.6 + 2.2 : Math.random() * 1.4 + 0.5,
        isStar,
      }
    })

    /* ── SECONDARY SMALL SPHERE — 28 nodes, offset + slower orbit ── */
    const COUNT2 = 28
    const nodes2 = Array.from({ length: COUNT2 }, (_, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT2)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
        pSpeed: 0.01 + Math.random() * 0.01,
        size: Math.random() * 1.2 + 0.4,
      }
    })

    /* ── SHOOTING PARTICLES ── */
    const trails = Array.from({ length: 6 }, () => ({
      progress: Math.random(),
      speed: 0.0008 + Math.random() * 0.0012,
      edgeIdx: 0,
      opacity: Math.random() * 0.6 + 0.2,
    }))

    /* Pre-compute edges — primary sphere */
    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].ox - nodes[j].ox
        const dy = nodes[i].oy - nodes[j].oy
        const dz = nodes[i].oz - nodes[j].oz
        if (dx*dx + dy*dy + dz*dz < 0.35) edges.push([i, j])
      }
    }

    /* Pre-compute edges — secondary sphere */
    const edges2 = []
    for (let i = 0; i < nodes2.length; i++) {
      for (let j = i + 1; j < nodes2.length; j++) {
        const dx = nodes2[i].ox - nodes2[j].ox
        const dy = nodes2[i].oy - nodes2[j].oy
        const dz = nodes2[i].oz - nodes2[j].oz
        if (dx*dx + dy*dy + dz*dz < 0.55) edges2.push([i, j])
      }
    }

    /* Assign trail edges from primary */
    trails.forEach((tr, i) => {
      tr.edgeIdx = Math.floor((i / trails.length) * edges.length)
      tr.progress = Math.random()
    })

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
      const dark = themeRef.current !== 'light'
      const mx = mouseRef.current.x   // -0.5 → 0.5
      const my = mouseRef.current.y

      const baseAngle = ts * 0.00014
      const tiltX     = 0.22 + my * 0.18
      const extraY    = mx * 0.4

      const cx = W / 2, cy = H / 2
      const r  = Math.min(W, H) * 0.42

      /* ── Project primary sphere ── */
      const proj = nodes.map(n => {
        n.pulse += n.pSpeed
        let { x, y, z } = { x: n.ox, y: n.oy, z: n.oz }
        ;({ x, y, z } = rotX(x, y, z, tiltX))
        ;({ x, y, z } = rotY(x, y, z, baseAngle + extraY))
        const fov = 2.2
        const pz = z + fov
        const px = (x / pz) * r + cx
        const py = (y / pz) * r + cy
        const depth = (z + 1) / 2
        const alphaMult = dark ? 0.9 : 0.75
        const alpha = (0.12 + depth * 0.72) * alphaMult
        const size  = (n.size + 0.4 * Math.sin(n.pulse)) * (0.45 + depth * 0.9)
        return { px, py, depth, alpha, size, isStar: n.isStar }
      })

      /* ── Soft sphere glow behind ── */
      const glowR = r * 0.85
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
      if (dark) {
        grd.addColorStop(0,   'rgba(81,130,255,0.055)')
        grd.addColorStop(0.5, 'rgba(81,130,255,0.022)')
        grd.addColorStop(1,   'transparent')
      } else {
        grd.addColorStop(0,   'rgba(45,90,220,0.06)')
        grd.addColorStop(0.5, 'rgba(45,90,220,0.02)')
        grd.addColorStop(1,   'transparent')
      }
      ctx.beginPath()
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      /* ── Draw edges (primary, depth-faded) ── */
      edges.forEach(([i, j]) => {
        const a = proj[i], b = proj[j]
        const avgD = (a.depth + b.depth) / 2
        const la = dark ? avgD * 0.16 : avgD * 0.1
        if (la < 0.01) return
        const grad = ctx.createLinearGradient(a.px, a.py, b.px, b.py)
        const ca = dark ? `rgba(81,130,255,${la})` : `rgba(45,90,220,${la})`
        const cb = dark ? `rgba(139,92,246,${la * 0.6})` : `rgba(100,60,200,${la * 0.6})`
        grad.addColorStop(0, ca)
        grad.addColorStop(1, cb)
        ctx.beginPath()
        ctx.moveTo(a.px, a.py)
        ctx.lineTo(b.px, b.py)
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.65
        ctx.stroke()
      })

      /* ── Shooting-light trails along edges ── */
      trails.forEach(tr => {
        tr.progress += tr.speed
        if (tr.progress >= 1) {
          tr.progress = 0
          tr.edgeIdx  = Math.floor(Math.random() * edges.length)
          tr.opacity  = Math.random() * 0.55 + 0.25
        }
        const [i, j] = edges[tr.edgeIdx]
        if (!proj[i] || !proj[j]) return
        const a = proj[i], b = proj[j]
        const tx = a.px + (b.px - a.px) * tr.progress
        const ty = a.py + (b.py - a.py) * tr.progress
        const depth = a.depth + (b.depth - a.depth) * tr.progress
        if (depth < 0.3) return

        const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 5)
        const alpha = tr.opacity * depth
        tg.addColorStop(0, dark
          ? `rgba(200,220,255,${alpha})`
          : `rgba(100,140,255,${alpha})`)
        tg.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(tx, ty, 5, 0, Math.PI * 2)
        ctx.fillStyle = tg
        ctx.fill()
      })

      /* ── Draw nodes (back-to-front) ── */
      proj.slice().sort((a, b) => a.depth - b.depth).forEach(p => {
        if (p.alpha < 0.03) return

        /* Halo on star nodes */
        if (p.isStar && p.depth > 0.55) {
          const haloR = p.size * 4.5
          const hg = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, haloR)
          hg.addColorStop(0, dark
            ? `rgba(160,200,255,${p.alpha * 0.3})`
            : `rgba(60,110,255,${p.alpha * 0.2})`)
          hg.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.px, p.py, haloR, 0, Math.PI * 2)
          ctx.fillStyle = hg
          ctx.fill()
        }

        /* Core dot */
        ctx.beginPath()
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = dark
          ? p.isStar
            ? `rgba(200,225,255,${p.alpha})`
            : `rgba(130,170,255,${p.alpha})`
          : p.isStar
            ? `rgba(40,80,220,${p.alpha})`
            : `rgba(60,110,240,${p.alpha * 0.85})`
        ctx.fill()
      })

      /* ── Secondary sphere (top-right, smaller, violet-tinted, offset) ── */
      const r2     = r * 0.32
      const s2cx   = cx + r * 0.78 + mx * 20
      const s2cy   = cy - r * 0.55 + my * 14
      const angle2 = baseAngle * 0.55 + 1.2

      const proj2 = nodes2.map(n => {
        n.pulse += n.pSpeed
        let { x, y, z } = { x: n.ox, y: n.oy, z: n.oz }
        ;({ x, y, z } = rotX(x, y, z, 0.4))
        ;({ x, y, z } = rotY(x, y, z, angle2))
        const fov = 2.2
        const pz = z + fov
        const px = (x / pz) * r2 + s2cx
        const py = (y / pz) * r2 + s2cy
        const depth = (z + 1) / 2
        const alpha = (0.08 + depth * 0.45) * (dark ? 0.8 : 0.65)
        const size  = (n.size + 0.3 * Math.sin(n.pulse)) * (0.4 + depth * 0.75)
        return { px, py, depth, alpha, size }
      })

      /* Secondary sphere glow */
      const sg = ctx.createRadialGradient(s2cx, s2cy, 0, s2cx, s2cy, r2 * 0.9)
      if (dark) { sg.addColorStop(0, 'rgba(139,92,246,0.04)'); sg.addColorStop(1, 'transparent') }
      else       { sg.addColorStop(0, 'rgba(100,60,200,0.05)'); sg.addColorStop(1, 'transparent') }
      ctx.beginPath(); ctx.arc(s2cx, s2cy, r2 * 0.9, 0, Math.PI * 2)
      ctx.fillStyle = sg; ctx.fill()

      /* Secondary edges */
      edges2.forEach(([i, j]) => {
        const a = proj2[i], b = proj2[j]
        const avgD = (a.depth + b.depth) / 2
        const la = dark ? avgD * 0.12 : avgD * 0.07
        if (la < 0.01) return
        ctx.beginPath()
        ctx.moveTo(a.px, a.py)
        ctx.lineTo(b.px, b.py)
        ctx.strokeStyle = dark ? `rgba(139,92,246,${la})` : `rgba(100,60,200,${la})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      /* Secondary nodes */
      proj2.slice().sort((a, b) => a.depth - b.depth).forEach(p => {
        if (p.alpha < 0.02) return
        ctx.beginPath()
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = dark
          ? `rgba(180,150,255,${p.alpha})`
          : `rgba(100,60,200,${p.alpha})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__constellation" aria-hidden="true" />
}

/* ── Realistic Petals + Dust ────────────────────────────────── */
function Petals({ theme }) {
  const canvasRef = useRef(null)
  const themeRef  = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, W, H

    /* ── PETALS — realistic cherry-blossom / lotus style ── */
    /* Each petal has: position, drift, tumble (3D tilt via scaleY), color variant */
    const PCOUNT = 22
    const petals = Array.from({ length: PCOUNT }, (_, i) => {
      const hue = i % 5  // 0=blush-pink, 1=soft-blue, 2=lavender, 3=white-blue, 4=gold
      return {
        x:  Math.random(),
        y:  Math.random() * 1.4 - 0.2,   // spread above and below screen
        size: Math.random() * 18 + 12,    // 12-30px — real enough to see shape
        rot:  Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.018,
        vy:  -(0.00014 + Math.random() * 0.00018),  // slow upward drift
        vx:  (Math.random() - 0.5) * 0.00010,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.007 + Math.random() * 0.010,
        // 3D tumble: scaleY oscillates to fake spinning through space
        tilt:      Math.random() * Math.PI * 2,
        tiltSpeed: 0.014 + Math.random() * 0.018,
        alpha: Math.random() * 0.32 + 0.14,
        hue,
      }
    })

    /* ── DUST SPARKLES ── */
    const DCOUNT = 36
    const dust = Array.from({ length: DCOUNT }, () => ({
      x:  Math.random(),
      y:  Math.random() * 1.2,
      r:  Math.random() * 1.6 + 0.4,
      vy: -(0.00007 + Math.random() * 0.00012),
      vx: (Math.random() - 0.5) * 0.00007,
      pulse:  Math.random() * Math.PI * 2,
      pSpeed: 0.016 + Math.random() * 0.022,
      alpha:  Math.random() * 0.4 + 0.1,
    }))

    /* ── BOKEH halos ── */
    const BCOUNT = 10
    const bokeh = Array.from({ length: BCOUNT }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 55 + 25,
      pulse: Math.random() * Math.PI * 2, pSpeed: 0.003 + Math.random() * 0.005,
      alpha: Math.random() * 0.04 + 0.012,
      hue: Math.floor(Math.random() * 3),
    }))

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /* Petal color sets — [inner highlight, mid, outer edge] */
    const PETAL_COLORS = {
      dark: [
        ['255,200,220', '220,130,180', '180,80,150'],   // blush-pink
        ['160,200,255', '100,150,255', '70,110,240'],    // soft-blue
        ['210,170,255', '170,120,255', '130,80,230'],    // lavender
        ['220,235,255', '150,190,255', '90,140,240'],    // white-blue
        ['255,230,130', '255,190,70',  '220,150,30'],    // gold
      ],
      light: [
        ['255,160,190', '220,80,140',  '180,40,110'],   // deeper pink
        ['80,130,255',  '50,90,240',   '30,60,210'],     // blue
        ['160,100,255', '130,60,230',  '100,30,200'],    // purple
        ['100,160,255', '60,120,240',  '30,80,210'],     // mid blue
        ['220,160,20',  '190,130,10',  '160,100,5'],     // gold
      ],
    }

    /* Draw a realistic petal — 5-bezier-point organic oval with pointed base */
    const drawPetal = (cx, cy, size, rot, tiltY, alpha, colorSet) => {
      const [inner, mid, edge] = colorSet
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      // 3D tumble: squash on Y axis  (cos gives -1→1, map to 0.15→1)
      ctx.scale(1, Math.max(0.15, Math.abs(Math.cos(tiltY))))

      const w = size * 0.52   // petal half-width
      const h = size          // petal full height

      /* Petal outline — realistic rounded-tip teardrop */
      ctx.beginPath()
      ctx.moveTo(0, -h * 0.5)               // pointed base (top in rotated space)
      ctx.bezierCurveTo(
        w * 0.9, -h * 0.4,
        w,        h * 0.1,
        w * 0.55, h * 0.42
      )
      ctx.bezierCurveTo(
        w * 0.25, h * 0.65,
        0,        h * 0.5,
        0,        h * 0.5
      )
      ctx.bezierCurveTo(
        0,        h * 0.5,
        -w * 0.25, h * 0.65,
        -w * 0.55, h * 0.42
      )
      ctx.bezierCurveTo(
        -w,       h * 0.1,
        -w * 0.9, -h * 0.4,
        0,        -h * 0.5
      )
      ctx.closePath()

      /* Fill: radial gradient from bright inner → soft edge */
      const grad = ctx.createRadialGradient(0, h * 0.05, 0, 0, h * 0.1, size * 1.1)
      grad.addColorStop(0,   `rgba(${inner},${alpha})`)
      grad.addColorStop(0.45,`rgba(${mid},${alpha * 0.85})`)
      grad.addColorStop(1,   `rgba(${edge},${alpha * 0.3})`)
      ctx.fillStyle = grad
      ctx.fill()

      /* Translucency: subtle lighter sheen on one side (fake light catch) */
      const sheen = ctx.createLinearGradient(-w, -h*0.3, w*0.4, h*0.3)
      sheen.addColorStop(0,   `rgba(255,255,255,${alpha * 0.22})`)
      sheen.addColorStop(0.5, `rgba(255,255,255,0)`)
      sheen.addColorStop(1,   `rgba(255,255,255,0)`)
      ctx.fillStyle = sheen
      ctx.fill()

      /* Center vein — thin line down middle */
      ctx.beginPath()
      ctx.moveTo(0, -h * 0.42)
      ctx.quadraticCurveTo(0.5, 0, 0, h * 0.44)
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`
      ctx.lineWidth = 0.6
      ctx.stroke()

      /* Thin edge outline for definition */
      ctx.beginPath()
      ctx.moveTo(0, -h * 0.5)
      ctx.bezierCurveTo( w*0.9,-h*0.4,  w, h*0.1,  w*0.55, h*0.42)
      ctx.bezierCurveTo( w*0.25,h*0.65, 0, h*0.5,  0,       h*0.5)
      ctx.bezierCurveTo(-w*0.25,h*0.65,-w*0.55,h*0.42, -w, h*0.1)
      ctx.bezierCurveTo(-w*0.9,-h*0.4,  0,-h*0.5,  0,      -h*0.5)
      ctx.strokeStyle = `rgba(${edge},${alpha * 0.35})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const dark = themeRef.current !== 'light'
      const palette = dark ? PETAL_COLORS.dark : PETAL_COLORS.light

      /* ── BOKEH halos ── */
      const bokehRgb = dark
        ? [['81,130,255'],['139,92,246'],['6,214,160']]
        : [['60,110,255'],['110,60,200'],['0,160,120']]
      bokeh.forEach(b => {
        b.pulse += b.pSpeed
        const a = b.alpha * (0.6 + 0.4 * Math.sin(b.pulse))
        const rgb = bokehRgb[b.hue] || bokehRgb[0]
        const g = ctx.createRadialGradient(b.x*W, b.y*H, 0, b.x*W, b.y*H, b.r)
        g.addColorStop(0,   `rgba(${rgb},${a})`)
        g.addColorStop(0.6, `rgba(${rgb},${a * 0.3})`)
        g.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.arc(b.x*W, b.y*H, b.r, 0, Math.PI*2)
        ctx.fillStyle = g; ctx.fill()
      })

      /* ── PETALS ── */
      petals.forEach(p => {
        p.wobble   += p.wobbleSpeed
        p.tilt     += p.tiltSpeed
        p.rot      += p.rotSpeed
        p.x        += p.vx + Math.sin(p.wobble) * 0.00011
        p.y        += p.vy + Math.cos(p.wobble * 0.6) * 0.00004

        if (p.y < -0.15) { p.y = 1.1 + Math.random() * 0.1; p.x = Math.random() }

        const cols = palette[p.hue]
        const a    = dark ? p.alpha : p.alpha * 0.82
        drawPetal(p.x * W, p.y * H, p.size, p.rot, p.tilt, a, cols)
      })

      /* ── DUST SPARKLES ── */
      dust.forEach(d => {
        d.pulse += d.pSpeed; d.x += d.vx; d.y += d.vy
        if (d.y < -0.05) { d.y = 1.05; d.x = Math.random() }
        const a     = d.alpha * (0.5 + 0.5 * Math.sin(d.pulse))
        const color = dark ? `rgba(200,220,255,${a})` : `rgba(60,100,220,${a * 0.75})`
        ctx.beginPath()
        ctx.arc(d.x*W, d.y*H, d.r, 0, Math.PI*2)
        ctx.fillStyle = color; ctx.fill()
        if (d.r > 1.1) {
          ctx.globalAlpha = a * 0.35
          ctx.strokeStyle = color; ctx.lineWidth = 0.55
          ctx.beginPath()
          ctx.moveTo(d.x*W-d.r*2.8, d.y*H); ctx.lineTo(d.x*W+d.r*2.8, d.y*H)
          ctx.moveTo(d.x*W, d.y*H-d.r*2.8); ctx.lineTo(d.x*W, d.y*H+d.r*2.8)
          ctx.stroke(); ctx.globalAlpha = 1
        }
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero__petals" aria-hidden="true" />
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
  const [visible, setVisible]   = useState(false)
  const [theme, setTheme]       = useState('dark')
  const [mouse, setMouse]       = useState({ x: 0, y: 0 })

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
      {/* ── CONSTELLATION ── */}
      <Constellation theme={theme} mouseX={mouse.x} mouseY={mouse.y} />

      {/* ── PETALS + BOKEH + DUST ── */}
      <Petals theme={theme} />

      {/* ── SPOTLIGHT ── */}
      <div className="hero__spot" ref={spotRef} aria-hidden="true" />

      {/* ── ORBS ── */}
      <div className="hero__orbs" aria-hidden="true">
        <div className="hero__orb hero__orb--1" ref={orb1Ref} />
        <div className="hero__orb hero__orb--2" ref={orb2Ref} />
        <div className="hero__orb hero__orb--3" ref={orb3Ref} />
        <div className="hero__orb hero__orb--4" />
        <div className="hero__orb hero__orb--5" />
      </div>

      {/* ── GRID ── */}
      <div className="hero__grid" aria-hidden="true" />

      {/* ── CONTENT ── */}
      <div className="hero__body">

        <div className="hero__badge" role="note">
          <span className="hero__pulse-dot" aria-hidden="true" />
          <span>Haldwani's #1 Premium Self-Study Center</span>
          <span className="hero__badge-sep" aria-hidden="true" />
          <span className="hero__badge-tag">Est. 2021</span>
        </div>

        <h1 className="hero__h1">
          <span className="hero__h1-a">
            {'Your Success'.split('').map((ch, i) => (
              <span key={i} className="hero__char" style={{ animationDelay: `${0.28 + i * 0.026}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </span>
          <em className="hero__h1-b">Starts Here.</em>
        </h1>

        <div className="hero__typed-row" aria-live="polite" aria-atomic="true" aria-label={typed}>
          <span className="hero__typed-word">{typed}</span>
          <span className="hero__caret" aria-hidden="true" />
        </div>

        <p className="hero__sub">
          A fully AC, pin-drop silent sanctuary built for serious aspirants.
          Join the students who stopped making excuses and{' '}
          <em>started making history.</em>
        </p>

        <div className="hero__ctas">
          <button className="hero__cta-main" onClick={() => { window.location.href = '/contact' }}>
            <span>Reserve Your Seat</span>
            <span className="hero__cta-arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <button className="hero__cta-ghost" onClick={() => { window.location.href = '/gallery' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3"  y="3"  width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3"  width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3"  y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>See Inside</span>
          </button>
        </div>

        <div className="hero__seat-notice" role="status" aria-live="polite">
          <span className="hero__seat-dot" aria-hidden="true" />
          <span>Only <strong>{seats} seats</strong> remaining this month — act fast</span>
        </div>

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
            .map((item, i) => <span key={i} className="hero__marquee-item">✦ {item}</span>)}
        </div>
      </div>

      {/* ── SCROLL CUE ── */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-mouse"><div className="hero__scroll-wheel" /></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}