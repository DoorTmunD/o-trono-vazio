import { checkContent } from './lib/content-checks.js';

const { errors, pending } = checkContent();
for (const issue of pending) console.warn(`PENDENTE: ${issue}`);
for (const issue of errors) console.error(`ERRO: ${issue}`);
if (errors.length) process.exitCode = 1;
else console.log('Imagens locais e conteúdo disponível: OK. Pendências editoriais são bloqueadas por check:production.');
