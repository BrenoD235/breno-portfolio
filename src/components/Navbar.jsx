import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { data, navLinks } from '@/mock'

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    )
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const linkClass = id => cn(
    'relative text-sm font-medium transition-colors',
    active === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="flex h-16 items-center justify-between px-6 md:px-12" aria-label="Principal">
        <a href="#home" className="rounded-md border border-border px-3 py-1 font-mono text-sm text-foreground/70">
          {data.logo}
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={linkClass(id)}>
                {label}
                {active === id && <span className="absolute inset-x-0 -bottom-1 h-px bg-foreground" />}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className="-mr-2 p-2 text-muted-foreground hover:text-foreground md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-border px-6 py-4 md:hidden">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setOpen(false)} className={cn(linkClass(id), 'block py-2')}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
