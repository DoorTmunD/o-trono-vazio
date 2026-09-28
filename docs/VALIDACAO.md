# Refatoração e validação — 08/09/2026

## Resultado

Preparação local implementada, mantendo Next.js, React, Tailwind, npm, conteúdo editorial e URLs. Nenhuma publicação, configuração de conta externa ou cadastro real na Brevo foi realizado.

## Estado anterior

- Branch `main`, diretório de trabalho limpo. Não havia `AGENTS.md` no repositório ou nas pastas ancestrais consultadas.
- Next.js declarado/travado em 16.2.4, mas `node_modules` continha 16.1.7. O lint usava `eslint-config-next` 16.1.7.
- `npm run lint`: 7 erros e 3 avisos.
- `npm run build`: aprovado usando a versão instalada, com aviso de `metadataBase` e metadados apontando para localhost.
- Não havia testes nem comando de verificação de tipos.
- `npm audit`: 9 vulnerabilidades (7 altas, 1 moderada e 1 baixa) na árvore anterior.
- A newsletter confirmava sucesso sem credenciais e registrava o endereço recebido no console. JSON malformado, falhas de rede e configuração incorreta não eram tratados adequadamente.
- Um link de PDF apontava para arquivo ausente. Quatro perfis sociais continham placeholders.

## Alterações

- Rotas internas agrupadas em `src/app/(site)`, sem alterar URLs. Navegação e rodapé em layout compartilhado.
- Conteúdo em `src/content`, configuração em `src/config`, interações em componentes por funcionalidade, API e acesso aos PDFs em `src/server`, cálculo de leitura em `src/lib`.
- Newsletter compartilhada com rótulo de e-mail, bloqueio de envios simultâneos, timeout e mensagens acessíveis. Payload de sucesso preservado como `{ ok: true }`.
- Brevo isolada no servidor com `server-only`, validação de entrada/lista, limite de tamanho e respostas JSON de erro. O envio real continua usando `POST /v3/contacts`, `listIds` e `updateEnabled: true`; sucesso apenas após HTTP 201/204 do provedor.
- PDF ausente identificado como “em breve”, sem link que leve a 404. O caminho original permanece no conteúdo e é ativado por um novo build após adicionar o arquivo.
- Controles de leitura e Códex acessíveis por teclado; modal com foco contido, Escape e restauração de foco; menu com estado expandido e links ocultos fora da navegação por Tab.
- Animações de entrada declaradas em CSS, conteúdo inicial visível sem depender de estado React, respeito a movimento reduzido e limpeza de timers/animações.
- Ajustes de largura de títulos, botão inicial, capítulos, formulário e modal para celular; `sizes` nas imagens. Conteúdo, paleta, imagens, fontes e composição geral preservados.
- Metadados específicos por página, URL configurável e suporte às URLs automáticas da Vercel; tratamento de erro de renderização e 404.
- Next e configuração de lint alinhados em **16.3.3** por segurança; correções compatíveis de dependências transitivas. React e Tailwind mantidos. Nova infraestrutura de testes e tipos apenas para desenvolvimento.
- `.env.example`, Node 24/npm 11, instalação reproduzível com `npm ci`, documentação e `vercel.json`. O build de Production recusa pendências conhecidas; previews permitem revisá-las.
- Removido somente o arquivo `tailwind.config.mjs` legado, sem personalizações e sem uso por `@config` no Tailwind 4. Nenhum arquivo de `public/` foi removido ou renomeado.

## Verificações finais

| Verificação | Resultado |
| --- | --- |
| `npm ci` | Aprovada após a atualização do lockfile. |
| `npm run lint` | Aprovado, sem erros ou avisos. |
| `npm run typecheck` | Aprovada a verificação estática do JavaScript. |
| `npm test` | **21 testes aprovados**. |
| `npm run check:assets` | Imagens locais e conteúdo disponível válidos; PDF ausente e quatro perfis placeholder informados. |
| `npm run build` | Aprovado com Next.js 16.3.3, seis páginas públicas, 404 e API dinâmica, sem aviso de metadados. |
| `npm audit` e `npm audit --omit=dev` | **Zero vulnerabilidades reportadas** na execução. |
| `npm run test:e2e` | **24 aprovados e 6 falhas por bloqueio externo**, descritas abaixo. |
| `npm run check:production` | Retorna código 1 corretamente pelas pendências reais. |
| `check:vercel` | Preview permitido; Production bloqueado com as pendências atuais. |
| `git diff --check` | Sem erros de whitespace. |
| Comparação editorial com `HEAD` | Personagens e redes iguais; capítulos, posts e lore extraídos preservando os dados/textos originais. |
| Revisão de informações sensíveis | Nenhum segredo identificado nos arquivos examinados; nenhum arquivo de credencial versionado. Chave/endpoint Brevo ausentes do bundle estático do frontend. Não é uma auditoria completa de todo o histórico Git. |

O build foi iniciado com `next start` em `127.0.0.1:3100` pela suíte Playwright. Chromium executou os cenários em desktop 1440×900 e celular 390×664. Acesso direto, atualização, títulos, ausência de overflow horizontal, assets locais, entrada/retorno de sessão, armazenamento bloqueado, menu, leitor, filtros, modal, 404, erro real da API sem credenciais e conteúdo sem JavaScript passaram. Capturas das páginas e do modal foram inspecionadas.

Os testes também detectaram e protegeram uma incompatibilidade de origem da newsletter: o Next normaliza a URL interna para localhost, enquanto o navegador pode acessar 127.0.0.1 ou o host público. A validação agora compara o Host real da requisição e rejeita outras origens.

## Limitações comprovadas

### Imagens externas

As seis falhas restantes são os testes de recursos de `/santuario`, `/codex` e `/bastidores`, nos dois tamanhos. As requisições do otimizador retornaram HTTP 403 ao buscar `images.unsplash.com`.

A resposta direta das três imagens foi a página **FortiGuard Intrusion Prevention — Web Page Blocked**, categoria “File Sharing and Storage”. O bloqueio persistiu fora do sandbox. O Node 24 usou os certificados do sistema (`NODE_USE_SYSTEM_CA=1`); a validação TLS permaneceu ativa. Não houve contorno do bloqueio, substituição de imagens, interceptação de respostas ou alteração de expectativas para aprovar os testes.

Reexecute a suíte em uma rede/ambiente autorizado com acesso ao domínio antes de publicar. Sem isso, a disponibilidade dessas imagens na Vercel ainda não está confirmada. Relatório local: `playwright-report/index.html`; capturas e traces: `test-results/`.

### Newsletter e conteúdo

Não há credenciais Brevo nem PDF original na sessão. O cadastro real e o download do arquivo final não podem ser confirmados. Testes unitários cobrem 201/204 e erros com transporte controlado; os testes de navegador exercitam a API real local sem configuração e verificam o erro 503. Isso não comprova acesso à conta/lista real da Brevo.

A conta/projeto remoto da Vercel não foi acessada. As instruções e a configuração seguem o destino já indicado pelo README original, sem inventar domínio ou serviços.

## Antes da publicação

1. Adicionar o PDF real do capítulo I e preencher os quatro perfis sociais.
2. Configurar chave e ID da lista Brevo na Vercel e confirmar um cadastro com endereço autorizado.
3. Definir a URL pública real ou usar as variáveis automáticas da Vercel no build de Production.
4. Repetir `check:production`, build e testes de navegador no ambiente autorizado.
5. Revisar Preview e publicar um novo build de Production conforme [README](../README.md#publicar-na-vercel).
