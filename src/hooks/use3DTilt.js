import { useRef, useCallback } from 'react'

export function use3DTilt(intensity = 8) {
  const ref = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(8px) scale(1.02)`
    el.style.transition = 'transform 0.1s ease'
  }, [intensity])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}