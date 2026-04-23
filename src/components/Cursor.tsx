import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type CursorMode = 'default' | 'hover' | 'down'

function isInteractive(el: Element | null) {
  if (!el) return false
  return Boolean(
    el.closest(
      'a,button,input,textarea,select,summary,[role="button"],[role="link"],[data-cursor="hover"]',
    ),
  )
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 })

  const tx = useSpring(x, { stiffness: 180, damping: 26, mass: 0.6 })
  const ty = useSpring(y, { stiffness: 180, damping: 26, mass: 0.6 })

  useEffect(() => {
    const mq = window.matchMedia?.('(pointer: fine)')
    const update = () => setEnabled(Boolean(mq?.matches))
    update()
    mq?.addEventListener?.('change', update)
    return () => mq?.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onDown = () => setMode('down')
    const onUp = () => setMode((m) => (m === 'down' ? 'default' : m))

    const onOver = (e: Event) => {
      const t = e.target as Element | null
      if (isInteractive(t)) setMode((m) => (m === 'down' ? 'down' : 'hover'))
    }
    const onOut = () => setMode((m) => (m === 'down' ? 'down' : 'default'))

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [enabled, x, y])

  const sizes = useMemo(() => {
    switch (mode) {
      case 'hover':
        return { ring: 72, dot: 7, opacity: 0.95, blur: 12 }
      case 'down':
        return { ring: 56, dot: 6, opacity: 0.9, blur: 10 }
      default:
        return { ring: 64, dot: 6, opacity: 0.82, blur: 12 }
    }
  }, [mode])

  if (!enabled) return null

  return (
    <div className="cursor-root" aria-hidden="true">
      <motion.div
        className="cursor-trail"
        style={{
          translateX: tx,
          translateY: ty,
          x: -(sizes.ring + 16) / 2,
          y: -(sizes.ring + 16) / 2,
          width: sizes.ring + 16,
          height: sizes.ring + 16,
          opacity: 0.24,
        }}
      />

      <motion.div
        className="cursor-ring"
        style={{
          translateX: sx,
          translateY: sy,
          x: -sizes.ring / 2,
          y: -sizes.ring / 2,
          width: sizes.ring,
          height: sizes.ring,
          opacity: sizes.opacity,
          filter: `blur(${sizes.blur}px)`,
        }}
      />

      <motion.div
        className="cursor-dot"
        style={{
          translateX: sx,
          translateY: sy,
          x: -sizes.dot / 2,
          y: -sizes.dot / 2,
          width: sizes.dot,
          height: sizes.dot,
          opacity: 0.95,
        }}
      />
    </div>
  )
}

