import { readFileSync } from 'node:fs';

export function cloudflareBuildEnv() {
  const config = JSON.parse(readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8'));
  return {
    ...process.env,
    ...config.vars,
    SITE_URL: process.env.SITE_URL || config.vars.SITE_URL,
    NEXT_PUBLIC_NEWSLETTER_ENABLED: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED || config.vars.NEXT_PUBLIC_NEWSLETTER_ENABLED,
    CLOUDFLARE_BUILD: '1',
  };
}
