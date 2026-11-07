import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function Reveal({ as: Tag = 'div', delay = 0, className, style, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      el.classList.add('is-visible')
      io.disconnect()
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
      {...props}
    />
  )
}
