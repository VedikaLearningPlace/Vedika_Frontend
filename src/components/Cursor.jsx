import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dot    = useRef(null)
  const ring   = useRef(null)
  const trail  = useRef(null)
  const pos    = useRef({ x: -200, y: -200 })
  const rpos   = useRef({ x: -200, y: -200 })
  const tpos   = useRef({ x: -200, y: -200 })
  const raf    = useRef(null)
  const state  = useRef('default') // 'default' | 'hover' | 'text' | 'drag'

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const move = e => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move, { passive: true })

    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      const { x, y } = pos.current

      if (dot.current) {
        dot.current.style.transform = `translate(${x - 4}px,${y - 4}px)`
      }

      rpos.current.x = lerp(rpos.current.x, x, 0.13)
      rpos.current.y = lerp(rpos.current.y, y, 0.13)
      if (ring.current) {
        ring.current.style.transform = `translate(${rpos.current.x - 20}px,${rpos.current.y - 20}px)`
      }

      tpos.current.x = lerp(tpos.current.x, x, 0.06)
      tpos.current.y = lerp(tpos.current.y, y, 0.06)
      if (trail.current) {
        trail.current.style.transform = `translate(${tpos.current.x - 28}px,${tpos.current.y - 28}px)`
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    const setState = (el) => {
      if (!ring.current || !dot.current || !trail.current) return
      const target = el?.closest('a,button,[data-cursor]')
      const cursor = target?.dataset?.cursor

      // Reset all
      ring.current.className  = 'cur-ring'
      dot.current.className   = 'cur-dot'
      trail.current.className = 'cur-trail'

      if (!target) {
        state.current = 'default'
        return
      }

      const tag = target.tagName.toLowerCase()
      if (cursor === 'text' || tag === 'input' || tag === 'textarea') {
        state.current = 'text'
        ring.current.classList.add('text')
        dot.current.classList.add('hidden')
      } else if (cursor === 'drag') {
        state.current = 'drag'
        ring.current.classList.add('drag')
        dot.current.classList.add('hidden')
      } else {
        state.current = 'hover'
        ring.current.classList.add('grow')
        dot.current.classList.add('hidden')
        trail.current.classList.add('show')
      }
    }

    const onOver = e => setState(e.target)
    const onOut  = () => setState(null)

    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)

    const onDown = () => ring.current?.classList.add('click')
    const onUp   = () => ring.current?.classList.remove('click')
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <>
      <div className="cur-dot"   ref={dot}/>
      <div className="cur-ring"  ref={ring}/>
      <div className="cur-trail" ref={trail}/>
    </>
  )
}