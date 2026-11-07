export const data = {
  name:     'Breno Dias',
  logo:     'breno.dev',
  title:    'Desenvolvedor Frontend',
  role:     'Desenvolvedor Frontend Júnior',

  headline:      'Construo interfaces web',
  headlineMuted: 'limpas, responsivas e acessíveis.',
  pitch:    'Desenvolvedor frontend em início de carreira, focado em HTML, CSS e JavaScript. Crio páginas responsivas com código organizado e atenção aos detalhes — e estou sempre aprendendo algo novo.',

  bio:      'Sou um desenvolvedor júnior que gosta muito de aprender sobre tecnologia e sempre em busca de novos conhecimentos. Atualmente focado em aprender as fundamentações do desenvolvimento web com HTML, CSS e JavaScript. Tenho dedicado meu tempo estudando e praticando para construir uma base sólida na programação.',
  quote:    '"Cada linha de código é um passo a mais na jornada do aprendizado."',
  location: 'Rio de Janeiro, RJ',
  email:    'brenodias1039@gmail.com',
  phone:    '(21) 96952-1117',
  tags:     ['HTML', 'CSS', 'JavaScript'],

  social: {
    github:   { url: 'https://github.com/BrenoD235',                      handle: '@BrenoD235' },
    linkedin: { url: 'https://www.linkedin.com/in/breno-dias-525567306/', handle: '@breno-dias' },
  },

  // link: site no ar · repo: código no GitHub · image: import de src/assets (opcional)
  projects: [
    {
      id:    1,
      name:  'Portfólio Pessoal',
      desc:  'Site de portfólio pessoal desenvolvido para apresentar meus projetos e habilidades.',
      link:  null,
      repo:  null,
      image: null,
      tech:  ['HTML', 'CSS', 'JavaScript'],
    },
  ],

  techStack: [
    { name: 'HTML5',      icon: '🌐' },
    { name: 'CSS3',       icon: '🎨' },
    { name: 'JavaScript', icon: '⚡' },
    { name: 'Git',        icon: '📦' },
    { name: 'VS Code',    icon: '🖥️' },
    { name: 'Responsivo', icon: '📱' },
  ],
}

export const navLinks = [
  { label: 'Início',    id: 'home'      },
  { label: 'Sobre',     id: 'about'     },
  { label: 'Portfólio', id: 'portfolio' },
  { label: 'Contato',   id: 'contact'   },
]

export const phoneHref = `tel:+55${data.phone.replace(/\D/g, '')}`
