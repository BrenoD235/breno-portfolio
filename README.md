# Breno Dias — Portfólio

Meu portfólio pessoal, feito com React, Vite e Tailwind CSS. Tema escuro, grade de fundo e um crachá interativo pendurado numa corda com física.

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # testa o build localmente
```

## Estrutura

```
public/
└── favicon.svg
src/
├── components/
│   ├── ui/           ← Button, Badge, Input, Textarea, Tabs
│   ├── Navbar.jsx    ← menu fixo e versão mobile
│   ├── Hero.jsx      ← título e crachá (só em telas ≥ 1024px)
│   ├── Lanyard.jsx   ← corda com física
│   ├── About.jsx     ← bio, foto e números
│   ├── Portfolio.jsx ← abas de projetos e tecnologias
│   ├── Contact.jsx   ← formulário de contato e redes
│   ├── Reveal.jsx    ← animação ao rolar
│   └── Footer.jsx
├── assets/           ← foto.webp, lanyard-tile.webp
├── lib/utils.js      ← cn()
├── mock.js           ← dados pessoais
├── App.jsx
├── main.jsx
└── index.css         ← cores e grade de fundo
```

## Formulário de contato

As mensagens chegam por e-mail via [Web3Forms](https://web3forms.com).

No deploy (Vercel, Netlify etc.), a mesma variável `VITE_WEB3FORMS_KEY` entra nas configurações de ambiente. Sem a chave, o formulário abre o e-mail do visitante.

## Dados e projetos

Tudo mora em `src/mock.js`:

Em cada projeto, `link` (site no ar) e `repo` (GitHub) mostram os botões correspondentes, e `image` aceita uma imagem importada de `src/assets`.
