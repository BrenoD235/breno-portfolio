import { useState } from 'react'
import { AlertCircle, Briefcase, CheckCircle2, GraduationCap, Github, Linkedin, Loader2, Mail, MapPin, MessageSquare, Phone, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Reveal from '@/components/Reveal'
import { data, phoneHref } from '@/mock'

const socials = [
  { label: 'LinkedIn', icon: Linkedin, ...data.social.linkedin },
  { label: 'GitHub',   icon: Github,   ...data.social.github   },
]

const info = [
  { icon: MapPin,        label: 'Localização', value: data.location },
  { icon: Mail,          label: 'Email',       value: data.email, href: `mailto:${data.email}` },
  { icon: Phone,         label: 'Telefone',    value: data.phone, href: phoneHref },
  { icon: Briefcase,     label: 'Disponível',  value: 'Para freelas e oportunidades' },
  { icon: GraduationCap, label: 'Estudando',   value: 'Desenvolvimento web' },
]

const iconClass = 'pointer-events-none absolute left-3.5 text-muted-foreground/50'

// Chave do Web3Forms vem do .env.local (fora do código). Sem ela, cai no mailto.
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const EMPTY = { name: '', email: '', message: '', botcheck: false }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const subject = `Contato pelo portfólio — ${form.name}`
  const mailto = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.message)}`

  const send = async e => {
    e.preventDefault()
    if (!FORM_KEY) { window.location.href = mailto; return }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: FORM_KEY, subject, from_name: 'Portfólio breno.dev', ...form }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message)
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      console.error('Falha ao enviar contato:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative z-[1] px-6 py-28 md:px-12">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">

        <Reveal>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Entre em Contato</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Entre em contato para colaborações, projetos ou apenas para dizer olá!
          </p>

          <form onSubmit={send} className="mb-8 flex flex-col gap-3">
            <label className="relative flex items-center">
              <span className="sr-only">Seu nome</span>
              <User size={16} className={iconClass} />
              <Input name="name" value={form.name} onChange={set} required autoComplete="name" placeholder="Seu Nome" className="pl-10" />
            </label>
            {FORM_KEY && (
              <label className="relative flex items-center">
                <span className="sr-only">Seu e-mail</span>
                <Mail size={16} className={iconClass} />
                <Input name="email" type="email" value={form.email} onChange={set} required autoComplete="email" placeholder="Seu E-mail" className="pl-10" />
              </label>
            )}
            <label className="relative flex">
              <span className="sr-only">Sua mensagem</span>
              <MessageSquare size={16} className={`${iconClass} top-3.5`} />
              <Textarea name="message" value={form.message} onChange={set} required placeholder="Sua Mensagem" className="min-h-[110px] pl-10" />
            </label>

            {/* Armadilha anti-spam: invisível para pessoas, robôs costumam marcar */}
            <input type="checkbox" name="botcheck" checked={form.botcheck} onChange={set} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <Button type="submit" variant="secondary" disabled={status === 'sending'} className="mt-1 w-full border border-border text-muted-foreground hover:text-foreground">
              {status === 'sending'
                ? <><Loader2 size={14} className="animate-spin" /> Enviando…</>
                : <><Send size={14} /> Enviar Mensagem</>}
            </Button>

            <div aria-live="polite" className="min-h-5 text-sm">
              {status === 'sent' && (
                <p className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={15} /> Mensagem enviada! Responderei em breve.
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={15} />
                  <span>Não consegui enviar agora. <a href={mailto} className="underline underline-offset-2 hover:text-red-300">Mande por e-mail</a>.</span>
                </p>
              )}
            </div>
          </form>

          <p className="mb-4 text-sm font-medium text-foreground">Me Encontre em</p>
          <div className="flex flex-col gap-2.5">
            {socials.map(({ label, icon: Icon, url, handle }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/20">
                <Icon size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="font-mono text-xs text-muted-foreground/50">{handle}</p>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <div className="h-full rounded-2xl border border-border bg-card p-8">
            <h3 className="mb-4 text-xl font-bold text-foreground">Vamos conversar!</h3>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Estou sempre aberto a novas oportunidades e conversas interessantes.
              Se tiver alguma dúvida ou proposta, não hesite em me enviar uma mensagem.
            </p>
            <dl className="flex flex-col gap-5">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={18} className="w-7 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground/50">{label}</dt>
                    <dd className="text-sm text-foreground/70">
                      {href ? <a href={href} className="transition-colors hover:text-foreground">{value}</a> : value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
