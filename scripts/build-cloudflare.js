import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cloudflareBuildEnv } from './lib/cloudflare-config.js';

const cli = fileURLToPath(new URL('../node_modules/@opennextjs/cloudflare/dist/cli/index.js', import.meta.url));
const result = spawnSync(process.execPath, [cli, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: cloudflareBuildEnv(),
});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
