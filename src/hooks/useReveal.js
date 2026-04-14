import { useEffect, useRef } from 'react'

export function useReveal(childSelector = null, step = 80) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      el.classList.add('in')

      el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach((child, i) => setTimeout(() => child.classList.add('in'), i * step))

      if (childSelector) {
        el.querySelectorAll(childSelector)
          .forEach((child, i) => setTimeout(() => child.classList.add('in'), i * step))
      }

      obs.disconnect()
    }, { threshold: 0.05 })  // ← fixed: was accidentally receiving `step` (90) as threshold

    obs.observe(el)
    return () => obs.disconnect()
  }, [childSelector, step])

  return ref
}