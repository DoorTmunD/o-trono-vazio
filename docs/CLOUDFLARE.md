# Cloudflare — beta pública

Status: adaptação validada localmente; publicação remota em preparação. URL configurada: https://o-trono-vazio-beta.trono-writer.workers.dev

Em 28/09/2026, o subdomínio da conta foi renomeado de `doortmund` para `trono-writer` após autorização. O Worker existente `cs-arena` passa a responder em https://cs-arena.trono-writer.workers.dev; seu código e suas configurações não foram alterados.

Worker: `o-trono-vazio-beta`. A conta está fixada em `wrangler.jsonc`; o identificador da conta é público, não uma credencial. O projeto `cs-arena` existente na conta não participa deste deploy.

## Arquitetura

- Next.js 16.3.3 / React 19 mantidos; adaptador `@opennextjs/cloudflare@1.20.6` e Wrangler `4.143.0`.
- `open-next.config.ts` usa `staticAssetsIncrementalCache` com interceptação de cache para as páginas prerenderizadas. A API da newsletter continua dinâmica no runtime Node compatível do Workers.
- O build Cloudflare desativa `experimental.prefetchInlining` para evitar o loop de pré-carregamento de segmentos do Next 16/OpenNext ([issue 1212](https://github.com/opennextjs/opennextjs-aws/issues/1212)). O cache de páginas e a navegação continuam ativos; há teste E2E para limitar requisições repetidas.
- Assets em `.open-next/assets`; bundle em `.open-next/worker.js`. Diretórios gerados e `.dev.vars*` estão no `.gitignore`.
- Imagens locais servidas pela CDN de assets, sem binding IMAGES ou transformação paga. `public/_headers` define cache imutável para arquivos versionados do Next e cabeçalhos de segurança para assets.
- O fluxo atual não provisiona bancos, buckets ou filas. PDF depende de arquivo local presente durante o build; novo PDF exige rebuild.

## Disponibilidade na beta

`NEXT_PUBLIC_NEWSLETTER_ENABLED=false`: não há formulário nem coleta de e-mails. A rota permanece implementada, e responde 503 se chamada sem configuração Brevo. Para habilitar futuramente, configure `BREVO_API_KEY` como secret e `BREVO_LIST_ID` no runtime, valide o cadastro com e-mail autorizado, revise o gate da beta e refaça o build com a flag pública ativa. Nunca exponha a chave em `NEXT_PUBLIC_*`, no Wrangler versionado ou em logs.

Perfis sociais com placeholders não viram links. O Contato mostra abertura futura dos canais e acesso aos Bastidores. O PDF ausente e capítulos futuros permanecem explicitamente indisponíveis.

## Build e publicação

1. Instale Node 24/npm 11 e execute `npm ci`.
2. Autentique: `npx wrangler login`. Em ambiente remoto, `npx wrangler login --device` permite autenticar por código.
3. Confirme conta, nome e `vars.SITE_URL` em `wrangler.jsonc`.
4. Execute `npm run verify` e `npm run check:cloudflare`.
5. Gere com `npm run build:cloudflare` e teste com `npm run preview:cloudflare -- --port 8787`.
6. Publique com `npm run deploy:cloudflare`. O comando repete o build para impedir uso de metadados antigos e preserva vars do painel com `--keep-vars`.
7. Verifique as rotas, imagens, navegação, leitura e canonical na URL pública. O deploy é via CLI; push no GitHub sozinho não dispara publicação automaticamente.

`scripts/build-cloudflare.js` aplica as variáveis públicas do Wrangler ao Next no build, inclusive `SITE_URL`. Um `SITE_URL` explícito no ambiente tem precedência. Use a mesma URL no build e no runtime; alterar domínio exige rebuild.

Windows: o adaptador informa suporte parcial. Nesta máquina o build e o preview funcionaram fora do isolamento restrito. Para CI ou problemas de caminhos/permissões, use Linux/WSL. Não desative validação TLS.

## Testes no Workers

PowerShell, com preview local iniciado:

```powershell
$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:8787'
$env:PLAYWRIGHT_EXTERNAL_SERVER='1'
$env:PLAYWRIGHT_UNCONFIGURED_NEWSLETTER='1'
npm run test:e2e
```

Para smoke público, configure `PLAYWRIGHT_BASE_URL` com a URL HTTPS e remova `PLAYWRIGHT_UNCONFIGURED_NEWSLETTER`. A suíte impede POST com e-mail válido em destinos remotos. GET 405 e JSON inválido 400 continuam sendo verificados sem cadastrar contatos.

Verificação local da migração: lint, tipos e 21 testes unitários aprovados; build OpenNext concluído; 42 testes E2E aprovados no preview Workers, em desktop e celular. O `wrangler deploy --dry-run` aprovou o pacote (5.131,57 KiB; gzip 1.066,80 KiB). Após corrigir o pré-carregamento, uma visita ociosa de 8s passou de mais de 2.700 requisições de páginas para 22.

## Referências

- [Setup OpenNext](https://opennext.js.org/cloudflare/get-started)
- [Cache SSG sem R2](https://opennext.js.org/cloudflare/caching)
- [Variáveis de ambiente](https://opennext.js.org/cloudflare/howtos/env-vars)
- [Workers no Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
