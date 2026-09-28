import { readdirSync } from 'node:fs';
import path from 'node:path';
import { capitulos } from '../../src/content/capitulos.js';
import { personagens } from '../../src/content/personagens.js';
import { lores } from '../../src/content/codex.js';
import { posts } from '../../src/content/posts.js';
import { redesSociais } from '../../src/content/redes-sociais.js';

export function publicAssetIssue(url) {
  if (!url?.startsWith('/')) return null;
  let directory = path.resolve('public');
  for (const part of url.slice(1).split('/')) {
    if (!part || part === '..' || part === '.') return `Caminho inválido: ${url}`;
    let entries;
    try { entries = readdirSync(directory); } catch { return `Arquivo ausente: ${url}`; }
    if (!entries.includes(part)) {
      return entries.some((entry) => entry.toLowerCase() === part.toLowerCase())
        ? `Maiúsculas/minúsculas divergentes: ${url}`
        : `Arquivo ausente: ${url}`;
    }
    directory = path.join(directory, part);
  }
  return null;
}

export function checkContent() {
  const errors = [];
  const pending = [];
  const images = ['/capa-biblioteca.png', ...[...personagens, ...lores, ...posts].map((item) => item.imagem).filter(Boolean)];
  for (const image of new Set(images)) {
    const issue = publicAssetIssue(image);
    if (issue) errors.push(issue);
  }
  for (const chapter of capitulos) {
    if (chapter.status === 'disponivel' && !chapter.texto?.length) errors.push(`Capítulo ${chapter.id} disponível sem texto.`);
    if (chapter.downloads?.pdf) {
      const issue = publicAssetIssue(chapter.downloads.pdf);
      if (issue) pending.push(issue);
    }
  }
  for (const profile of redesSociais) {
    if (/seu_usuario|seu_id/.test(profile.href)) pending.push(`Perfil social ainda é placeholder: ${profile.nome}`);
  }
  return { errors, pending };
}
