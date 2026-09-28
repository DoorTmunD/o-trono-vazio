import { getBrevoConfig } from '../src/server/newsletter.js';
import { getSiteUrl } from '../src/config/site.js';
import { checkContent } from './lib/content-checks.js';

const { errors, pending } = checkContent();
const blockers = [...errors, ...pending];
if (!getBrevoConfig()) blockers.push('Defina BREVO_API_KEY e BREVO_LIST_ID válidos no servidor.');
try {
  const url = getSiteUrl();
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) blockers.push('Defina SITE_URL real ou execute na Vercel com as URLs automáticas disponíveis.');
} catch (error) {
  blockers.push(error.message);
}
for (const blocker of blockers) console.error(`PENDENTE: ${blocker}`);
if (blockers.length) process.exitCode = 1;
else console.log('Configuração local e conteúdo: OK. Confirme a lista Brevo e o cadastro real no ambiente de destino.');
