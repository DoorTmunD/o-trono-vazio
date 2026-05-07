# Download de PDF por Capítulo

## Status

**Implementado.** Cada capítulo na `/leitura` exibe um botão "Capítulo Completo (PDF)" no final do texto expandido, que baixa o arquivo direto do domínio do site.

A leitura inline permanece como experiência principal — o texto curto na página é uma "pequena história" de cada capítulo. O PDF é a versão completa, opcional, para quem quer ler offline.

---

## Como funciona

- PDFs ficam em `public/capitulos/` no repositório
- O Next.js serve `/public` como conteúdo estático na raiz do domínio
- `public/capitulos/capitulo-1.pdf` → acessível em `https://seu-dominio/capitulos/capitulo-1.pdf`
- O atributo `download` no `<a>` força o salvamento em disco em vez de abrir inline no navegador
- Servido pela CDN do Vercel — rápido em qualquer região, sem dependência externa

---

## Adicionar o PDF de um capítulo

**Passo 1 — Coloque o arquivo:**

```
public/capitulos/capitulo-1.pdf
public/capitulos/capitulo-2.pdf
...
```

Convenção: `capitulo-N.pdf` em arábico (não romano). URL fica previsível.

**Passo 2 — Garanta que o capítulo tem o campo `downloads.pdf`:**

Em `src/app/leitura/page.js`, no array `capitulos`:

```js
{
  id: 1,
  numero: 'Capítulo I',
  titulo: 'O Despertar do Abismo',
  status: 'disponivel',
  downloads: {
    pdf: '/capitulos/capitulo-1.pdf',
  },
  texto: [ /* ... */ ],
},
```

O botão renderiza automaticamente quando `cap.downloads?.pdf` existe. Capítulos `'em-breve'` ou sem `downloads` simplesmente não mostram o botão.

**Passo 3 — Commit e deploy.** O Vercel redeploya e o PDF passa a ser servido.

---

## Limites práticos

- **Vercel Free:** 100 MB total por deploy (todos os arquivos em `/public` + bundle). Um PDF só com texto deve ter 1–5 MB; cabe 20–50 capítulos antes de ser problema.
- **Repo cresce com o tempo.** Quando ficar grande, opções: Git LFS, ou mover capítulos antigos pro Drive (link externo no `downloads.pdf`).
- O atributo HTML `download` força download apenas em **same-origin**. Se um dia trocar pra link externo (Drive, S3), o navegador talvez abra o PDF inline em vez de baixar — depende da resposta do servidor.

---

## EPUB (futuro)

A estrutura suporta — basta adicionar `downloads.epub` no capítulo e o botão equivalente no JSX. Não está implementado porque o objetivo atual é só PDF.
