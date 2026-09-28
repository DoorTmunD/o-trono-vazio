import { getSiteUrl } from '../src/config/site.js';
import { checkContent } from './lib/content-checks.js';
import { cloudflareBuildEnv } from './lib/cloudflare-config.js';

const env = cloudflareBuildEnv();
const { errors, pending } = checkContent();
try {
  const url = getSiteUrl(env);
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || /\.(invalid|example|test)$/.test(url.hostname)) {
    errors.push('Defina a URL HTTPS real da beta em wrangler.jsonc (vars.SITE_URL) antes de publicar.');
  }
} catch (error) {
  errors.push(error.message);
}
if (env.NEXT_PUBLIC_NEWSLETTER_ENABLED !== 'false') {
  errors.push('Esta publicação beta exige NEXT_PUBLIC_NEWSLETTER_ENABLED=false; configure e valide a Brevo antes de habilitar inscrições.');
}
for (const note of pending) console.log(`CONTEÚDO FUTURO (indisponível na beta): ${note}`);
for (const error of errors) console.error(`BLOQUEIO: ${error}`);
if (errors.length) process.exitCode = 1;
else console.log('Beta Cloudflare: URL e conteúdo disponíveis válidos; newsletter e perfis não publicados permanecem desativados.');
