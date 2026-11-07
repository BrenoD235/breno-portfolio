import { ExternalLink, Github } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import { data } from '@/mock'

function ProjectCard({ project: p }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1">
      <div className="flex h-44 w-full items-center justify-center border-b border-border bg-accent">
        {p.image ? (
          <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-[76%] w-[70%] items-center justify-center rounded-lg border border-border bg-background">
            <span className="font-mono text-xs text-muted-foreground/30">em breve</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-semibold text-foreground">{p.name}</h3>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>

        <ul className="mb-5 flex flex-wrap gap-1.5">
          {p.tech.map(t => <li key={t}><Badge>{t}</Badge></li>)}
        </ul>

        <div className="mt-auto flex items-center gap-2">
          {p.link && (
            <Button size="sm" className="rounded-full px-4" asChild>
              <a href={p.link} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Ver site</a>
            </Button>
          )}
          {p.repo && (
            <Button variant="outline" size="sm" className="rounded-full px-4" asChild>
              <a href={p.repo} target="_blank" rel="noopener noreferrer"><Github size={13} /> Código</a>
            </Button>
          )}
          {!p.link && !p.repo && (
            <span className="font-mono text-xs text-muted-foreground/40">Link em breve</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative z-[1] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">

        <Reveal className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-foreground">Meu Portfólio</h2>
          <p className="text-sm text-muted-foreground">Explore minha jornada através de projetos e tecnologias</p>
        </Reveal>

        <Reveal>
          <Tabs defaultValue="projects">
            <div className="mb-10 flex justify-center">
              <TabsList className="max-w-xs">
                <TabsTrigger value="projects">Projetos</TabsTrigger>
                <TabsTrigger value="techstack">Tecnologias</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="projects">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {data.projects.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            </TabsContent>

            <TabsContent value="techstack">
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {data.techStack.map(t => (
                  <li key={t.name} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 transition-transform duration-200 hover:-translate-y-1">
                    <span className="text-3xl" aria-hidden="true">{t.icon}</span>
                    <span className="text-xs font-medium text-muted-foreground">{t.name}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </Reveal>

      </div>
    </section>
  )
}
