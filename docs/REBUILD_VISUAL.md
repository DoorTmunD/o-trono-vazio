# Rebuild visual — setembro de 2026

Identidade: tinta escura, marfim e bronze discreto, com linguagem de edição literária. Cormorant Garamond nos títulos, Source Sans 3 na interface e Lora nos trechos de leitura. Os papéis `displayFont`, `interfaceFont` e `readingFont` ficam em `src/config/fonts.js`; cores e intensidade da textura ficam em `src/app/globals.css`.

## Implementação

- `/`: abertura cinematográfica em `CinematicIntro.js`, com trono de carvalho escurecido, base de pedra e iluminação lateral, sem halo emissivo. O botão Entrar leva a `/inicio` após transição de 850ms; movimento reduzido torna a navegação imediata. Pular abertura é um link direto. Nenhum redirecionamento acontece por tempo ou visita anterior.
- `ThroneScene.js`, `throne-renderer.js`, `throne-geometry.js` e `throne-material.js`: componente React, ciclo de renderização, geometria e materiais separados. Encosto arqueado, painéis entalhados, braços torneados e degraus de pedra são geometria WebGL; veio da madeira, desgaste e resposta à luz são procedurais, sem arquivos de modelo ou vídeo. Câmera sutil orientada pelo ponteiro fino, pausa, interrupção quando oculta/fora da tela, recuperação de contexto e liberação de recursos. Até 30fps e 3840×2160; DPR máximo 2 e orçamento de 1,4 milhão de pixels em larguras até 760px. A tela pode permanecer estática, com um desenho SVG como alternativa quando WebGL não está disponível. Os links continuam utilizáveis sem JavaScript.
- `src/app/inicio/InicioExperience.js` e `entrance.module.css`: página inicial editorial, atalhos de leitura e exploração e transição de 650ms para o Santuário (imediata com movimento reduzido). Canonical próprio em `/inicio`; o antigo salto automático via sessionStorage foi removido.
- `src/components/experience/CrownScene.js`: coroa em WebGL com aro baixo, bordas arredondadas, folhas curvas, gravação e pequenas granadas. Geometria, material e renderização ficam em `crown-geometry.js`, `crown-material.js` e `crown-renderer.js`. Pátina em coordenadas do objeto e movimento quase estático preservam a aparência de metal artesanal. O controle de pausa preserva a posição. A animação para quando a cena sai da tela ou a aba fica oculta. DPR limitado a 1,7. Sem suporte a WebGL, permanece uma ilustração SVG estática.
- `src/components/experience/crown-scene.module.css`: luz ambiente discreta, sombra de contato, controles e adaptação mobile, sem órbitas ou rótulos decorativos.
- `SurfaceGrain.js` e `surface-grain.module.css`: textura estática compartilhada pelas duas aberturas. Usa `public/textures/paper-grain.svg`, com intensidade em `--surface-grain-opacity`, sem animação ou trabalho de canvas. Não intercepta interação e desaparece em contraste elevado. A pátina dos objetos 3D fica nos respectivos materiais, independente desta textura de página.
- `StillThrone.js`: ilustração alternativa alinhada à nova forma do trono, visível sem JavaScript ou WebGL.
- `src/components/santuario/AtmosphereBook.js` e `santuario.module.css`: livro com capas, lombada e páginas em planos CSS 3D; luz orientada pelo ponteiro. Sem halo ou órbitas; capas e lombada têm acabamento fosco. Resumos do carrossel sempre visíveis, inclusive no toque.
- `src/components/layout/layout-shell.module.css`: menu responsivo e rodapé. Header de 88px em desktop e 76px no mobile.
- `src/components/layout/interior.module.css`: identidade compartilhada por Leitura, Códex, Bastidores e Contato.

A cena respeita `prefers-reduced-motion`, com opção explícita de ativar a coroa. Tilt do livro por ponteiro fica desabilitado no toque; cartões não usam inclinação. Livro e transições respeitam movimento reduzido. Filtros, diálogo com foco/Escape, formulário de newsletter e estado dos capítulos permanecem funcionais. Nenhuma dependência foi adicionada.

## Imagens

Imagens externas falhavam na rede de validação. O post da fundação agora utiliza a biblioteca local. Maria B e a Noite das Cinzas usam a apresentação em sombra; não foi atribuído o retrato de outro personagem. As três URLs originais continuam em `imagemReferencia` para consulta editorial. Para inserir arte definitiva, salve em `public/` e atualize `imagem` no registro correspondente.

## Verificação

Revisão de 30/09/2026: linguagem editorial, fontes, coroa e trono revisados visualmente em desktop e celular. `npm run verify` aprovado (lint, tipos, 21 testes unitários e assets disponíveis); `npm run build:cloudflare` aprovado. No preview local do Workers, **59 testes E2E passaram**, com apenas o caso 4K ignorado no perfil mobile. Capturas de desktop, celular e 3840×2160 revisadas. Pausa, movimento reduzido, navegação por teclado, ausência de JavaScript/WebGL e funções existentes preservadas. A coroa também foi verificada após resize fora da tela e perda/restauração de contexto WebGL. Publicada na beta a partir do commit `f15c8a4`, versão Cloudflare `0d426ca6-ebe3-434b-972a-1cfc4737a5dd`; registro em [CLOUDFLARE.md](CLOUDFLARE.md).

Atualização de 29/09/2026: abertura cinematográfica validada no runtime Workers em desktop, celular e 3840×2160. A suíte principal teve 57 testes aprovados e um caso 4K ignorado no perfil mobile; os dois testes adicionais sem WebGL passaram separadamente. Lint, tipos, 21 testes unitários e build Cloudflare aprovados. Capturas revisadas em desktop, celular e 4K.

`npm run verify`, `npm run build` e `npm run test:e2e` validam o projeto. A suíte cobre desktop e celular, rotas, imagens, largura, entrada, navegação, leitura, filtros, diálogo, carrossel, erros da newsletter e a inicialização/pausa da cena WebGL. As capturas ficam em `test-results/` e o relatório em `playwright-report/`.

Validação realizada em 28/09/2026: lint e tipos aprovados; 21 testes unitários aprovados; build de produção concluído. Os 24 casos de interação passaram em desktop/mobile. Após corrigir o teste para carregar retratos lazy fora da área visível do carrossel, os 12 casos de rotas/imagens/layout passaram na reexecução. O servidor de teste foi encerrado explicitamente ao fim para liberar o teardown do Playwright no Windows; a reexecução terminou com código 0. Preview local verificado com HTTP 200.

PDF do capítulo, perfis sociais reais e credenciais Brevo continuam sendo pendências editoriais já existentes. O procedimento e o registro da publicação estão em [CLOUDFLARE.md](CLOUDFLARE.md).
