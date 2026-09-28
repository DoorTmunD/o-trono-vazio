export function getSiteUrl(env = process.env) {
  const vercelHost = env.VERCEL_ENV === 'production'
    ? env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
    : env.VERCEL_URL;
  const configured = env.SITE_URL?.trim() || (vercelHost ? `https://${vercelHost}` : null);
  const url = new URL(configured || 'http://localhost:3000');
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL deve ser uma URL pública completa, sem credenciais, caminho, query ou fragmento.');
  }
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('SITE_URL deve usar HTTPS fora do ambiente local.');
  }
  return url;
}

export function pageMetadata(title, description, pathname) {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { locale: 'pt_BR', type: 'website', title: `${title} | O Trono Vazio`, description, url: pathname, images: ['/capa-biblioteca.png'] },
    twitter: { card: 'summary_large_image', title: `${title} | O Trono Vazio`, description, images: ['/capa-biblioteca.png'] },
  };
}
