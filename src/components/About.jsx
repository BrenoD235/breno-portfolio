import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import { data } from '@/mock'
import foto from '@/assets/foto.webp'

const stats = [
  { value: data.projects.length,  label: 'Projetos',    href: '#portfolio' },
  { value: data.techStack.length, label: 'Tecnologias', href: '#portfolio' },
]

export default function About() {
  return (
    <section id="about" className="relative z-[1] flex min-h-screen items-center px-6 py-28 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:items-start md:justify-between md:gap-16">

        <Reveal className="flex-1">
          <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground">Sobre Mim</p>

          <h2 className="mb-5 font-bold leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
            {data.name.split(' ').map(word => <span key={word} className="block">{word}</span>)}
          </h2>

          <p className="mb-5 max-w-md text-sm leading-relaxed text-muted-foreground">{data.bio}</p>

          <blockquote className="mb-8 max-w-md border-l-2 border-border pl-4 text-sm italic text-muted-foreground/50">
            {data.quote}
          </blockquote>

          <div className="mb-12 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#portfolio">↗ Ver Projetos</a>
            </Button>
          </div>

          <div className="inline-grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {stats.map(s => (
              <a key={s.label} href={s.href} className="group relative flex min-w-[140px] flex-col gap-1 bg-card px-6 py-5 transition-colors hover:bg-accent">
                <span className="text-base text-muted-foreground">&lt;/&gt;</span>
                <span className="text-3xl font-bold text-foreground">{s.value}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <span className="absolute right-4 top-4 text-xs text-muted-foreground/30 transition-colors group-hover:text-muted-foreground">↗</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex-shrink-0">
          <div
            className="h-[300px] w-[260px] overflow-hidden border-2 border-border"
            style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
          >
            <img src={foto} alt={data.name} width={260} height={300} loading="lazy" decoding="async"
              className="h-full w-full object-cover object-top" />
          </div>
        </Reveal>

      </div>
    </section>
  )
}
