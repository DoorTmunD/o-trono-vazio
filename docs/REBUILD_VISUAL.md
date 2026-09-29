# Rebuild visual — setembro de 2026

Identidade: preto profundo `#08090a`, marfim `#eee8dc`, ouro envelhecido `#b9a078`, detalhes em granada. Tipografia Cinzel para títulos, Montserrat para interface e Lora para a frase da entrada.

## Implementação

- `/`: abertura cinematográfica em `CinematicIntro.js`, com trono de basalto, halo, colunas, névoa e granulação. O botão Entrar leva a `/inicio` após transição de 850ms; movimento reduzido torna a navegação imediata. Pular abertura é um link direto. Nenhum redirecionamento acontece por tempo ou visita anterior.
- `ThroneScene.js` e `throne-renderer.js`: geometria e materiais procedurais em WebGL, sem arquivos de modelo, vídeo ou texturas externas. Câmera sutil orientada pelo ponteiro fino, pausa, interrupção quando oculta/fora da tela, recuperação de contexto e liberação de recursos. Até 30fps e 3840×2160; DPR máximo 2 e orçamento de 1,4 milhão de pixels em larguras até 760px. A tela pode permanecer estática, com um desenho SVG como alternativa quando WebGL não está disponível. Os links continuam utilizáveis sem JavaScript.
- `src/app/inicio/InicioExperience.js` e `entrance.module.css`: página inicial editorial anterior, atalhos de exploração e transição de 650ms para o Santuário (imediata com movimento reduzido). Canonical próprio em `/inicio`; o antigo salto automático via sessionStorage foi removido.
- `src/components/experience/CrownScene.js`: coroa geométrica em WebGL com material facetado, iluminação, rotação suave e resposta ao ponteiro. O controle de pausa preserva a posição. A animação para quando a cena sai da tela ou a aba fica oculta. DPR limitado a 1,7. Sem suporte a WebGL, permanece um símbolo de coroa estático.
- `src/components/experience/crown-scene.module.css`: halo, órbitas, controles e adaptação mobile.
- `src/components/santuario/AtmosphereBook.js` e `santuario.module.css`: livro com capas, lombada e páginas em planos CSS 3D; luz orientada pelo ponteiro. Resumos do carrossel sempre visíveis, inclusive no toque.
- `src/components/layout/layout-shell.module.css`: menu responsivo e rodapé. Header de 88px em desktop e 76px no mobile.
- `src/components/layout/interior.module.css`: identidade compartilhada por Leitura, Códex, Bastidores e Contato.

A cena respeita `prefers-reduced-motion`, com opção explícita de ativar a coroa. Tilt por ponteiro fica desabilitado no toque; livro e cartões respeitam movimento reduzido. Filtros, diálogo com foco/Escape, formulário de newsletter e estado dos capítulos permanecem funcionais. Nenhuma dependência foi adicionada.

## Imagens

Imagens externas falhavam na rede de validação. O post da fundação agora utiliza a biblioteca local. Maria B e a Noite das Cinzas usam a apresentação em sombra; não foi atribuído o retrato de outro personagem. As três URLs originais continuam em `imagemReferencia` para consulta editorial. Para inserir arte definitiva, salve em `public/` e atualize `imagem` no registro correspondente.

## Verificação

Atualização de 29/09/2026: abertura cinematográfica validada no runtime Workers em desktop, celular e 3840×2160. A suíte principal teve 57 testes aprovados e um caso 4K ignorado no perfil mobile; os dois testes adicionais sem WebGL passaram separadamente. Lint, tipos, 21 testes unitários e build Cloudflare aprovados. Capturas revisadas em desktop, celular e 4K.

`npm run verify`, `npm run build` e `npm run test:e2e` validam o projeto. A suíte cobre desktop e celular, rotas, imagens, largura, entrada, navegação, leitura, filtros, diálogo, carrossel, erros da newsletter e a inicialização/pausa da cena WebGL. As capturas ficam em `test-results/` e o relatório em `playwright-report/`.

Validação realizada em 28/09/2026: lint e tipos aprovados; 21 testes unitários aprovados; build de produção concluído. Os 24 casos de interação passaram em desktop/mobile. Após corrigir o teste para carregar retratos lazy fora da área visível do carrossel, os 12 casos de rotas/imagens/layout passaram na reexecução. O servidor de teste foi encerrado explicitamente ao fim para liberar o teardown do Playwright no Windows; a reexecução terminou com código 0. Preview local verificado com HTTP 200.

PDF do capítulo, perfis sociais reais e credenciais Brevo continuam sendo pendências editoriais/de publicação já existentes. O rebuild visual não publica o site nem configura serviços externos.
