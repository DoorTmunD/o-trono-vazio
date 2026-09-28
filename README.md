# O Trono Vazio

Site da saga de Dark Fantasy de Danilo Simões. Next.js 16 (App Router), React 19, JavaScript com verificação estática e Tailwind CSS 4. Hospedagem da beta: **Cloudflare Workers**, com OpenNext e assets estáticos. A configuração anterior da Vercel permanece como alternativa.

Configuração Cloudflare pronta e validada localmente. A publicação pública aguarda a definição do endereço: `writer.workers.dev` está ocupado, e a URL atual do Wrangler ainda é provisória. Procedimento de publicação e validação: [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md).

## Requisitos e instalação

- Node.js **24.x** e npm **11.x** (`.nvmrc` e `package.json`).
- Rede disponível para instalar pacotes e baixar as fontes Google durante o build.
- Conta Brevo com chave de API e uma lista existente para habilitar a newsletter. Na beta, as inscrições estão desativadas e a interface informa a abertura futura. Não há banco local, autenticação, uploads nem envio de e-mails próprio.

```bash
npm ci
```

O `package-lock.json` fixa a instalação. Não use `npm audit fix --force` nem atualize versões sem revisar e validar. O cache npm fica em `.npm-cache/`, ignorado pelo Git.

## Configuração

Copie `.env.example` para `.env.local` na raiz:

```powershell
Copy-Item .env.example .env.local
```

Em macOS/Linux: `cp .env.example .env.local`.

| Variável | Obrigatoriedade | Uso |
| --- | --- | --- |
| `BREVO_API_KEY` | Obrigatória para cadastro real | Chave privada da API Brevo, somente no servidor. |
| `BREVO_LIST_ID` | Obrigatória para cadastro real | ID inteiro positivo de uma lista existente na mesma conta Brevo. Não há lista padrão. |
| `SITE_URL` | URL pública no build; opcional na Vercel | Origem HTTPS completa, sem caminho, query ou credenciais. Usada em canonical e imagens sociais. |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | `false` na beta | Flag pública de disponibilidade. Exige novo build para ativar inscrições; nunca contém credenciais. |

Nunca use `NEXT_PUBLIC_` para credenciais. `.env.local` não deve ser versionado. Nenhum segredo deve ser colocado no README, no frontend ou em `vercel.json`.

Sem configuração válida da Brevo, a API retorna **503**, e os formulários mostram erro; não há confirmação fictícia nem gravação de e-mails no console. Uma chave/lista com formato válido ainda precisa ser confirmada na conta Brevo.

Na Vercel, `SITE_URL` pode usar a URL real do projeto ou seu domínio já configurado. Se omitida, o build usa `VERCEL_PROJECT_PRODUCTION_URL` em produção e `VERCEL_URL` em preview, fornecidas pela plataforma. Fora da Vercel, o fallback local é `http://localhost:3000`; `check:production` rejeita esse fallback. Alterações de URL exigem novo build.

## Desenvolvimento e execução de produção

```bash
npm run dev
```

Desenvolvimento em `http://localhost:3000`.

```bash
npm run verify
npm run build
npm run start
```

O último comando inicia o **build de produção** em `http://localhost:3000`. Para outra porta/interface:

```bash
npm run start -- --hostname 127.0.0.1 --port 3100
```

A aplicação requer o runtime Next.js/Node. Não use exportação estática, hospedagem somente de arquivos ou rewrite de todas as rotas para `index.html`: isso quebra `/api/newsletter`. As páginas internas funcionam por acesso direto e atualização com o roteamento nativo do Next.js.

## Verificações

| Comando | O que verifica |
| --- | --- |
| `npm run lint` | ESLint e regras React/Next; nenhum aviso permitido. |
| `npm run typecheck` | Tipos do JavaScript em `src` e configuração Next, via `checkJs`; sem converter a stack para TypeScript. |
| `npm test` | Testes unitários de entrada da API, contrato Brevo, erros, conteúdo, leitura e URLs. |
| `npm run check:assets` | Imagens locais e diferenças de maiúsculas/minúsculas; informa pendências editoriais. |
| `npm run verify` | Lint, tipos, testes unitários e assets. |
| `npm run build` | Compilação e geração das páginas de produção. |
| `npm run check:production` | Rejeita configuração ausente, URL local, PDF referenciado ausente e perfis sociais placeholder. Lê `.env.local`, sem imprimir valores privados. |
| `npm audit` | Vulnerabilidades de produção e desenvolvimento. |

Teste de navegador, após o build:

```bash
npm run test:browser:install
npm run test:e2e
```

Playwright instala Chromium em `.playwright/`, inicia `next start` em **127.0.0.1:3100** e testa desktop (1440×900) e celular (390×664). Deixe essa porta livre. A suíte verifica rotas, reload, imagens, console, largura, entrada, menu, capítulos, filtros, modal, 404 e erro da newsletter. Relatório: `playwright-report/index.html`; capturas: `test-results/` (ambos ignorados).

Os testes de navegador desabilitam credenciais **somente no processo local de teste** para não cadastrar pessoas na Brevo. A integração real da aplicação continua intacta. Os testes unitários usam respostas controladas para cobrir o contrato 201/204 e falhas do provedor. A confirmação de cadastro na conta real deve ocorrer com um endereço autorizado, no ambiente de destino.

Se sua rede usa certificados corporativos confiáveis no Windows, o Node 24 pode precisar do repositório de certificados do sistema:

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npm run test:e2e
```

Isso mantém HTTPS validado. Nunca use `NODE_TLS_REJECT_UNAUTHORIZED=0`. Um bloqueio de política de rede (por exemplo, FortiGuard) precisa ser resolvido pelo responsável pela rede ou validado em um ambiente autorizado com acesso; os testes de recursos falham nesse caso.

## Organização

```text
src/
  app/
    (site)/             # Layout compartilhado e rotas públicas internas
    api/newsletter/     # Endpoint HTTP POST
    page.js             # Entrada da saga
    layout.js           # HTML, fontes e metadados gerais
    error.js            # Recuperação de falhas de renderização
    not-found.js        # 404
    globals.css         # Tailwind, animações e estilos básicos
  components/
    layout/             # Nav, Footer e transição de página
    newsletter/         # Formulário compartilhado
    santuario/          # Carrossel
    leitura/            # Leitor e navegação dos capítulos
    codex/              # Galeria, filtros e diálogo
    bastidores/         # Timeline e filtros
  content/              # Capítulos, personagens, lore, posts e redes sociais
  config/               # Fontes, links de navegação e metadados
  server/               # Integração Brevo e disponibilidade dos PDFs
  lib/                  # Cálculo do tempo de leitura
scripts/                # Validação editorial e de publicação
tests/                 # Testes unitários e de navegador
public/                 # Imagens e PDFs; URLs originais preservadas
```

O grupo `(site)` não faz parte das URLs. As rotas continuam sendo `/`, `/santuario`, `/leitura`, `/codex`, `/bastidores`, `/contato` e `POST /api/newsletter`.

## Manutenção do conteúdo

- **Capítulos:** `src/content/capitulos.js`. `status: 'disponivel'` libera o texto; `status: 'em-breve'` mantém bloqueado. `texto` é um array de parágrafos. `downloads.pdf` mantém a URL pública do arquivo. O botão só é liberado se o PDF existir no build; enquanto faltar, aparece “Capítulo Completo (PDF) — em breve”. Veja [DOWNLOAD_PDF.md](docs/DOWNLOAD_PDF.md).
- **Personagens:** `src/content/personagens.js`, compartilhado pelo Santuário e Códex. As imagens locais ficam em `public/`. `imagem: null` mantém o visual de sombra existente.
- **Lore e artefatos:** `src/content/codex.js`.
- **Bastidores:** `src/content/posts.js`; preserve IDs e tags existentes ao editar.
- **Redes sociais:** `src/content/redes-sociais.js`; substitua os placeholders pelos perfis reais.
- **Navegação:** `src/config/navigation.js`; mudanças de URL exigem revisão de links e testes.

Respeite a caixa dos nomes: `/Tom.JPG` e `/Sereth.jpg` têm grafias diferentes. Os arquivos públicos existentes foram preservados, inclusive os que ainda não são usados, para manter suas URLs. O visual usa imagens locais: o post de fundação utiliza a biblioteca, e Maria B e o registro da Noite das Cinzas ficam em sombra até receberem artes locais. As URLs externas anteriores foram preservadas em `imagemReferencia`, sem requisições durante a navegação. Cinzel, Montserrat, Lora e as fontes gerais usam `next/font`: são baixadas no build e servidas localmente ao navegador.

## Experiência visual

O redesign de setembro de 2026 mantém a identidade dark com marfim e ouro envelhecido. A entrada inclui uma coroa WebGL original e interativa, sem bibliotecas extras; o Santuário apresenta um livro em perspectiva CSS 3D. Navegação, cards, leitor, Códex, Bastidores, Contato e rodapé compartilham a direção visual. Detalhes de manutenção em [docs/REBUILD_VISUAL.md](docs/REBUILD_VISUAL.md).

## Publicar no Cloudflare

O deploy usa `@opennextjs/cloudflare` e Wrangler com versões fixadas no lockfile. As páginas prerenderizadas usam o cache de Static Assets; `/api/newsletter` continua sendo uma rota dinâmica. A beta não precisa de R2, D1, Durable Objects ou Cloudflare Images.

```bash
npm ci
npm run verify
npm run check:cloudflare
npm run build:cloudflare
npm run preview:cloudflare -- --port 8787
```

Após validar o preview, `npm run deploy:cloudflare` verifica a política da beta, reconstrói o Worker e publica na conta configurada em `wrangler.jsonc`. Requer `npx wrangler login` ou uma credencial de CI com permissão no Worker. No Windows, use WSL/CI Linux se o ambiente impedir o build ou os processos do Wrangler.

`vars.SITE_URL` no Wrangler é aplicado também ao build pelo script do projeto. As imagens locais são servidas diretamente como assets; a API de otimização da Vercel não é usada. Newsletter, perfis provisórios e PDF ausente não são apresentados como funcionalidades disponíveis. O gate `check:cloudflare` mantém erros de imagens/conteúdo e URL pública inválida como bloqueadores.

## Publicar na Vercel (alternativa)

1. Resolva as pendências abaixo e execute `npm run check:production` com as variáveis reais na sua máquina ou no ambiente de destino.
2. Execute `npm ci`, `npm run verify`, `npm run build` e `npm run test:e2e` em rede com acesso aos recursos externos.
3. Importe/conecte o repositório no projeto Vercel, selecionando a raiz deste repositório, preset **Next.js** e Node.js **24.x**.
4. Em **Settings → Environment Variables**, configure `BREVO_API_KEY` e `BREVO_LIST_ID` para os ambientes que devem cadastrar contatos. Configure `SITE_URL` com a URL real em Production, ou use as variáveis automáticas da Vercel. Preview deve usar sua própria URL e, se necessário, uma lista Brevo de teste autorizada.
5. O `vercel.json` define instalação `npm ci` e build `npm run verify && npm run check:vercel && npm run build`. Deixe o diretório de saída no padrão Next.js. Não são necessários redirects/rewrites adicionais.
6. Gere um Preview e confira as seis páginas, refresh em páginas internas, imagens, leitura, filtros e newsletter. **Antes de promover um Preview já construído**, execute a checagem com configuração de produção: a promoção pode reutilizar o artefato sem repetir o build. Prefira um novo build de Production para aplicar metadados e variáveis corretos.
7. No build de Production, `check:vercel` executa a checagem obrigatória de publicação. O build falha se faltar configuração ou houver pendência editorial conhecida. Faça a publicação pelo fluxo do projeto Vercel depois de revisar o resultado.
8. No endereço publicado, confirme que o e-mail autorizado aparece na lista Brevo correta e que o PDF baixa. Se alterar variáveis, conteúdo ou domínio, gere novo deployment.

Consulte [CLOUDFLARE.md](docs/CLOUDFLARE.md) para a publicação da beta; esta seção da Vercel descreve somente o fluxo alternativo.

## Pendências atuais

- Adicionar `public/capitulos/capitulo-1.pdf` (arquivo original não está no repositório).
- Preencher os quatro perfis sociais reais em `src/content/redes-sociais.js`.
- Configurar e validar chave/lista Brevo no ambiente de destino; não foram fornecidas nesta sessão.
- Confirmar a URL real do projeto Vercel/domínio e a geração dos metadados nesse ambiente.
- Adicionar artes locais de Maria B e da Noite das Cinzas quando disponíveis; as referências antigas estão preservadas no conteúdo.

Capítulos II–IV, artefatos vazios e a imagem de Lea são conteúdo futuro já sinalizado na interface e não impedem a operação técnica. O relatório da execução desta refatoração está em [docs/VALIDACAO.md](docs/VALIDACAO.md).

## Referências técnicas

- [Deploy Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Variáveis de ambiente do Next.js](https://nextjs.org/docs/app/guides/environment-variables)
- [Correções de segurança do Next.js 16.3.3](https://nextjs.org/blog/august-2026-security-release)
- [Contatos na Brevo](https://developers.brevo.com/docs/synchronise-contact-lists)
