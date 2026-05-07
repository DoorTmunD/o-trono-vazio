# O Trono Vazio

Site oficial da saga de Dark Fantasy **O Trono Vazio**, escrita por Danilo Simões. Construído em Next.js com foco em experiência imersiva de leitura.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Estilização:** Tailwind CSS v4
- **Fontes:** Cinzel (títulos), Montserrat (corpo), Lora (texto de leitura)
- **Newsletter:** Brevo API
- **Deploy:** Vercel

---

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura de páginas

| Rota | Descrição |
|---|---|
| `/` | Landing com animação de entrada |
| `/santuario` | Home principal com personagens e newsletter |
| `/leitura` | Capítulos do livro (accordion) |
| `/codex` | Enciclopédia de personagens, lore e artefatos |
| `/bastidores` | Blog do autor (DevLog, Arte, Avisos) |
| `/contato` | Página de contato |

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```env
BREVO_API_KEY=sua_chave_aqui
BREVO_LIST_ID=2
```

Sem `BREVO_API_KEY`, a newsletter loga o e-mail no console e retorna sucesso (útil em dev).

No Vercel, configure as mesmas variáveis em **Settings → Environment Variables**.

---

## Como adicionar um capítulo

Abra `src/app/leitura/page.js` e localize o array `capitulos`. Copie um bloco existente e preencha:

```js
{
  id: 5,                          // número sequencial único
  numero: 'Capítulo V',
  titulo: 'Nome do Capítulo',
  epigrafe: '"Frase opcional."',  // pode omitir
  status: 'disponivel',           // 'disponivel' | 'em-breve'
  downloads: {                    // opcional — ativa o botão de download
    pdf: '/capitulos/capitulo-5.pdf',
  },
  texto: [
    'Primeiro parágrafo.',
    'Segundo parágrafo.',
    // cada string é um parágrafo separado
  ],
},
```

Mude `status` para `'em-breve'` para exibir o capítulo como bloqueado sem revelar o texto.

## Como adicionar o PDF de um capítulo

1. Coloque o arquivo em `public/capitulos/capitulo-N.pdf`
2. No bloco do capítulo correspondente, garanta que o campo `downloads.pdf` aponte para `/capitulos/capitulo-N.pdf`
3. O botão **"Capítulo Completo (PDF)"** aparece automaticamente no final do capítulo expandido

O arquivo é servido pela CDN do Vercel direto do seu domínio — sem dependência de Drive ou serviço externo. Detalhes em `docs/DOWNLOAD_PDF.md`.

---

## Como adicionar um personagem ao Códex

Abra `src/app/codex/page.js` e localize o array `personagens`. Adicione:

```js
{
  tipo: 'Personagem', id: 'id-unico',
  nome: 'Nome', titulo: 'O Título',
  imagem: '/NomeDoArquivo.jpg',   // coloque a imagem em /public
  idade: '???', altura: '1.80m',
  gostos: 'lista de gostos',
  desgostos: 'lista de desgostos',
  historia: 'Texto da história do personagem.',
},
```

Imagens sem URL devem ser colocadas em `/public`. Defina `imagem: null` para exibir o placeholder de sombra.

---

## Estado do projeto

### Já feito
- [x] Estrutura completa das páginas (Landing, Santuário, Leitura, Códex, Bastidores, Contato, 404)
- [x] Newsletter integrada com Brevo (com fallback dev)
- [x] Refatoração: `personagens`, `redesSociais` e `navLinks` em `src/lib/` (fonte única)
- [x] Capítulo I — texto introdutório no site ("O Despertar do Abismo")
- [x] Sistema de download de PDF por capítulo (botão renderiza quando `downloads.pdf` existe)
- [x] Pasta `public/capitulos/` pronta para receber os arquivos
- [x] Barra de progresso de leitura no scroll de cada capítulo

### Conteúdo pendente (você abastece)
- [ ] `public/capitulos/capitulo-1.pdf` — arquivo do Capítulo I
- [ ] Texto + PDF dos Capítulos II, III e IV
- [ ] Imagens reais da Lea e Maria (atualmente: Lea sem imagem, Maria com placeholder Unsplash)
- [ ] Redes sociais reais em `src/lib/redes-sociais.js` (todas placeholder `@seu_usuario`)

### Conteúdo a expandir
- [ ] Mais personagens e lore no Códex
- [ ] Artefatos no Códex (categoria existe, está vazia)
- [ ] Mais posts nos Bastidores

### Melhorias técnicas (opcionais)
- [ ] Definir `metadataBase` em `layout.js` quando o domínio final estiver definido (resolve aviso do build sobre OG/Twitter images)
- [ ] Componente `<NewsletterForm />` compartilhado (Footer + Santuário ainda duplicam a lógica)
- [ ] Hook `useFadeIn()` (padrão `isLoaded` está repetido em 4 páginas)
