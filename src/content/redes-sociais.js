// ============================================================
// REDES SOCIAIS — Fonte única de verdade.
// Consumido pelo Footer (lista compacta) e /contato (com descrição).
//
// Para adicionar uma rede, copie um bloco { } e cole abaixo.
// Perfis incompletos ficam no registro editorial, sem links públicos.
// ============================================================
export const redesSociais = [
  {
    nome: 'Instagram',
    usuario: '@seu_usuario',
    href: 'https://instagram.com/seu_usuario',
    descricao: 'Bastidores, artes conceituais e novidades do livro em tempo real.',
  },
  {
    nome: 'TikTok',
    usuario: '@seu_usuario',
    href: 'https://tiktok.com/@seu_usuario',
    descricao: 'Vídeos sobre o processo criativo e o universo de O Trono Vazio.',
  },
  {
    nome: 'Twitter / X',
    usuario: '@seu_usuario',
    href: 'https://x.com/seu_usuario',
    descricao: 'Pensamentos, atualizações e interação direta com os leitores.',
  },
  {
    nome: 'Goodreads',
    usuario: 'Danilo Simões',
    href: 'https://goodreads.com/user/show/seu_id',
    descricao: 'Adicione O Trono Vazio à sua lista de leituras e acompanhe o lançamento.',
  },
];

export const redesSociaisPublicadas = redesSociais.filter((rede) => {
  if (/seu_usuario|seu_id/i.test(rede.href)) return false;
  try {
    const url = new URL(rede.href);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
});
