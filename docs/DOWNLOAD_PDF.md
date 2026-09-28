# PDFs dos capítulos

A leitura inline permanece no site. O PDF é a versão completa opcional para leitura offline.

## Adicionar ou substituir um arquivo

1. Coloque o arquivo real em `public/capitulos/capitulo-N.pdf`, usando a caixa exata do nome.
2. Em `src/content/capitulos.js`, adicione ou mantenha a referência no capítulo:

```js
downloads: {
  pdf: '/capitulos/capitulo-1.pdf',
},
```

3. Execute `npm run check:assets`, `npm run check:production` e `npm run build`.
4. Confira o download em `/leitura` usando `npm run start`.
5. Publique um novo build na Vercel após revisar as alterações.

`src/server/capitulos.js` verifica a presença do arquivo durante a geração da página. O leitor só renderiza o link de download se ele existir. Se faltar, a URL é preservada no conteúdo, a interface informa “em breve”, e `check:production` acusa a pendência. Adicionar o arquivo exige outro build para ativar o botão.

O arquivo é servido em `/capitulos/capitulo-N.pdf`, pelo mesmo domínio da aplicação. O atributo HTML `download` solicita ao navegador o salvamento do PDF; o comportamento final depende do navegador. Este projeto usa PDFs locais, sem integração com Drive ou armazenamento externo.

Não substitua o PDF ausente por um documento fictício. O arquivo `public/capitulos/capitulo-1.pdf` ainda deve ser fornecido pelo autor. Os limites de tamanho do repositório e do deployment devem ser conferidos no plano de hospedagem vigente antes de adicionar arquivos grandes.
