import { Github, Linkedin, Mail } from 'lucide-react'
import { data, navLinks, phoneHref } from '@/mock'

const iconLink = 'text-muted-foreground transition-colors hover:text-foreground'

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-border px-6 py-12 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">

        <div>
          <span className="mb-4 inline-block rounded-md border border-border px-3 py-1 font-mono text-sm text-foreground/60">
            {data.logo}
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Desenvolvedor Frontend Jr em constante aprendizado,
            buscando sempre melhorar e crescer na área de tecnologia.
          </p>
        </div>

        <nav aria-label="Links rápidos">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Links Rápidos</h4>
          <ul className="flex flex-col gap-2">
            {navLinks.map(({ label, id }) => (
              <li key={id}>
                <a href={`#${id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Contato</h4>
          <address className="mb-5 flex flex-col gap-1.5 text-sm not-italic text-muted-foreground">
            <p>{data.location}</p>
            <a href={`mailto:${data.email}`} className="transition-colors hover:text-foreground">{data.email}</a>
            <a href={phoneHref} className="transition-colors hover:text-foreground">{data.phone}</a>
          </address>
          <div className="flex gap-3">
            <a href={data.social.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}><Github size={18} /></a>
            <a href={data.social.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLink}><Linkedin size={18} /></a>
            <a href={`mailto:${data.email}`} aria-label="E-mail" className={iconLink}><Mail size={18} /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-center">
        <p className="font-mono text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} {data.name} — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
