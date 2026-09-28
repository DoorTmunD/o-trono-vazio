import { defineConfig, devices } from '@playwright/test';

// InstalaÃ§Ã£o e execuÃ§Ã£o portÃ¡veis, sem gravar navegadores fora do projeto.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '.playwright';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3100';
const target = new URL(baseURL);
const localTarget = ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1' || !localTarget;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  // Workers local: personalize o comando ou use PLAYWRIGHT_EXTERNAL_SERVER=1.
  // URL pública: o servidor já existe e não é iniciado pela suíte.
  webServer: externalServer ? undefined : {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND || `node node_modules/next/dist/bin/next start --hostname ${target.hostname} --port ${target.port || (target.protocol === 'https:' ? '443' : '80')}`,
    url: baseURL,
    reuseExistingServer: false,
    env: { BREVO_API_KEY: '', BREVO_LIST_ID: '' },
  },
});
