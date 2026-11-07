import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, Github, Linkedin, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { data } from '@/mock'
import Lanyard from './Lanyard'

const DESKTOP = '(min-width: 1024px)'

function useIsDesktop() {
  const [match, setMatch] = useState(() => window.matchMedia(DESKTOP).matches)
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return match
}

const fade = (i, className) => ({ className: cn('animate-fadeUp', className), style: { animationDelay: `${i * 0.08}s` } })

const socials = [
  { label: 'GitHub',   icon: Github,   url: data.social.github.url },
  { label: 'LinkedIn', icon: Linkedin, url: data.social.linkedin.url },
]

export default function Hero() {
  const isDesktop = useIsDesktop()

  return (
    <section id="home" className="relative z-[1] flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-6 py-20 md:px-12">
      <div className="max-w-xl lg:max-w-[min(40rem,54vw)]">

        <span {...fade(0, 'mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm')}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          Disponível para novas oportunidades
        </span>

        <p {...fade(1, 'mb-4 font-mono text-sm text-muted-foreground')}>
          <span className="text-foreground">{data.name}</span>
          <span className="mx-2 text-foreground/25">/</span>
          {data.role}
        </p>

        <h1
          {...fade(2, 'mb-6 text-balance font-bold tracking-tight text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.08]')}
        >
          {data.headline}{' '}
          <span className="text-foreground/40">{data.headlineMuted}</span>
        </h1>

        <p {...fade(3, 'mb-9 max-w-lg text-base leading-relaxed text-muted-foreground')}>
          {data.pitch}
        </p>

        <div {...fade(4, 'mb-10 flex flex-wrap items-center gap-3')}>
          <Button size="lg" asChild className="group">
            <a href="#portfolio">
              Ver projetos
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#contact">Entrar em contato</a>
          </Button>

          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          {socials.map(({ label, icon: Icon, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <dl {...fade(5, 'flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground')}>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Localização</dt>
            <MapPin size={13} aria-hidden="true" />
            <dd>{data.location}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-foreground/30">Stack</dt>
            <dd>{data.tags.join(' · ')}</dd>
          </div>
        </dl>
      </div>

      {isDesktop && <Lanyard />}

      <a
        href="#about"
        aria-label="Rolar para a seção Sobre"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest text-foreground/25 transition-colors hover:text-foreground/60 sm:flex [@media(max-height:780px)]:hidden lg:left-12 lg:translate-x-0 lg:items-start"
      >
        Rolar
        <ChevronDown size={14} className="animate-scrollBounce" />
      </a>
    </section>
  )
}
