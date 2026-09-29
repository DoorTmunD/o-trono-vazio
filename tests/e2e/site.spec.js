import { existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const pages = [
  ['/', 'O Trono Vazio'], ['/inicio', 'O Trono Vazio'],
  ['/santuario', 'O Santuário | O Trono Vazio'],
  ['/leitura', 'Leitura | O Trono Vazio'], ['/codex', 'O Códex | O Trono Vazio'],
  ['/bastidores', 'Bastidores | O Trono Vazio'], ['/contato', 'Contato | O Trono Vazio'],
];

for (const [url, title] of pages) {
  test(`acesso direto, atualização, recursos e largura: ${url}`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', (request) => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(request.url()); });
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(url);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.reload().then((result) => result.status())).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    // Exercita imagens lazy e rodapé antes de examinar os recursos.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    });
    const failedImages = await page.locator('img').evaluateAll(async (images) => {
      return (await Promise.all(images.map(async (image) => {
        // Inclui retratos fora da área visível do carrossel horizontal.
        // decode() sozinho não dispara o carregamento de uma imagem lazy.
        image.loading = 'eager';
        try { await image.decode(); return null; } catch { return image.currentSrc; }
      }))).filter(Boolean);
    });
    errors.push(...failedImages);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(async () => {
      // A atmosfera pode continuar animada; aguarda apenas as entradas finitas.
      const entrances = document.getAnimations().filter((animation) =>
        animation.playState !== 'paused' && Number.isFinite(animation.effect?.getComputedTiming().endTime)
      );
      await Promise.all(entrances.map((animation) => animation.finished.catch(() => {})));
    });
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('abertura cinematográfica entra na página inicial pelo botão', async ({ page }) => {
  await page.goto('/');
  const enter = page.getByRole('link', { name: 'Entrar no universo', exact: true });
  await expect(enter).toHaveAttribute('href', '/inicio');
  await enter.click();
  await expect(page).toHaveURL(/\/inicio$/);
  await expect(page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' })).toBeVisible();
});

test('abertura cinematográfica entra por teclado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Entrar no universo', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/inicio$/);
});

test('visita já registrada mantém a abertura e a página inicial disponíveis', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('otv_visitou', '1'));
  await page.goto('/');
  await page.getByRole('link', { name: 'Entrar no universo', exact: true }).click();
  await expect(page).toHaveURL(/\/inicio$/);
  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
  await page.goto('/inicio');
  await expect(page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' })).toBeVisible();
  await expect(page).toHaveURL(/\/inicio$/);
});

test('armazenamento bloqueado não impede a entrada', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Entrar no universo', exact: true }).click();
  await expect(page).toHaveURL(/\/inicio$/);
  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
});

test('abertura 3D permite pausar e retomar pelo teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const scene = page.getByTestId('cinematic-intro');
  await expect(page.getByTestId('throne-canvas')).toBeVisible();
  await expect(page.getByTestId('throne-canvas')).toHaveAttribute('data-ready', 'true');
  await expect(scene).toHaveAttribute('data-motion', 'active');
  await page.getByRole('button', { name: 'Pausar abertura', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(page.getByRole('button', { name: 'Ativar abertura', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(scene).toHaveAttribute('data-motion', 'active');
});

test('abertura respeita movimento reduzido e permite ativação explícita', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const scene = page.getByTestId('cinematic-intro');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await page.getByRole('button', { name: 'Ativar abertura', exact: true }).click();
  await expect(scene).toHaveAttribute('data-motion', 'active');
  await page.getByRole('button', { name: 'Pausar abertura', exact: true }).click();
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(page.getByRole('link', { name: 'Entrar no universo', exact: true })).toBeVisible();
});

test('abertura aguarda a escolha do visitante sem avançar automaticamente', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('cinematic-intro')).toBeVisible();
  await page.waitForTimeout(5000);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Entrar no universo', exact: true })).toBeVisible();
});

test('abertura pode ser pulada sem JavaScript', async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false, baseURL,
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  });
  try {
    const noJs = await context.newPage();
    await noJs.goto('/');
    await expect(noJs.getByRole('heading', { level: 1 })).toBeVisible();
    const skip = noJs.getByRole('link', { name: 'Pular abertura', exact: true });
    await expect(skip).toHaveAttribute('href', '/inicio');
    await skip.click();
    await expect(noJs).toHaveURL(/\/inicio$/);
    await expect(noJs.getByRole('heading', { level: 1 })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('abertura preserva o conteúdo e a entrada quando WebGL está indisponível', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(type)) {
        document.documentElement.dataset.webglUnavailable = 'true';
        return null;
      }
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-webgl-unavailable', 'true');
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByTestId('throne-canvas')).not.toHaveAttribute('data-ready', 'true');
  const enter = page.getByRole('link', { name: 'Entrar no universo', exact: true });
  await expect(enter).toBeVisible();
  await enter.click();
  await expect(page).toHaveURL(/\/inicio$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test('abertura renderiza em 4K com resolução e orçamento de pixels adequados', async ({ browser, baseURL, isMobile }, testInfo) => {
  test.skip(isMobile, 'A verificação 4K usa uma tela de desktop.');
  const context = await browser.newContext({
    baseURL, viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  try {
    const screen = await context.newPage();
    await screen.goto('/');
    const canvas = screen.getByTestId('throne-canvas');
    await expect(canvas).toHaveAttribute('data-ready', 'true');
    const resolution = await canvas.evaluate((element) => ({ width: element.width, height: element.height }));
    expect(resolution.width).toBeGreaterThanOrEqual(3800);
    expect(resolution.height).toBeGreaterThanOrEqual(2100);
    expect(resolution.width * resolution.height).toBeLessThanOrEqual(8300000);
    expect(await screen.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(screen.getByRole('link', { name: 'Entrar no universo', exact: true })).toBeVisible();
    await screen.screenshot({ path: testInfo.outputPath('abertura-4k.png'), animations: 'disabled' });
  } finally {
    await context.close();
  }
});

test('cena da coroa permite pausar e retomar; entrada permanece acessível por teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/inicio');
  const scene = page.locator('.crown-scene');
  await expect(page.getByTestId('crown-canvas')).toBeVisible();
  await expect(page.getByTestId('crown-canvas')).toHaveAttribute('data-ready', 'true');
  await expect(scene).toHaveAttribute('data-motion', 'active');

  await page.getByRole('button', { name: 'Pausar animação', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  const resume = page.getByRole('button', { name: 'Ativar animação', exact: true });
  await expect(resume).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(scene).toHaveAttribute('data-motion', 'active');

  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/santuario$/);
});

test('preferência por movimento reduzido inicia a coroa pausada e permite controle explícito', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/inicio');
  const scene = page.locator('.crown-scene');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await page.getByRole('button', { name: 'Ativar animação', exact: true }).click();
  await expect(scene).toHaveAttribute('data-motion', 'active');
  await page.getByRole('button', { name: 'Pausar animação', exact: true }).click();
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' })).toBeEnabled();
});

test('menu navega e fecha; links ativos são identificados', async ({ page, isMobile }) => {
  await page.goto('/santuario');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  if (isMobile) {
    const toggle = page.getByRole('button', { name: 'Abrir menu' });
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
  }
  await nav.getByRole('link', { name: 'Leitura', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/leitura$/);
  if (isMobile) await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  else await expect(nav.getByRole('link', { name: 'Leitura', exact: true }).filter({ visible: true })).toHaveAttribute('aria-current', 'page');
});

test('pré-carregamento de páginas estabiliza sem repetir requisições continuamente', async ({ page }) => {
  let prefetches = 0;
  page.on('request', request => {
    if (request.headers()['next-router-prefetch'] === '1') prefetches += 1;
  });
  await page.goto('/santuario');
  // Captura o loop Next 16/OpenNext que ultrapassava 2.700 requests em 8s.
  await page.waitForTimeout(4000);
  expect(prefetches).toBeLessThan(40);
});

test('capítulos abrem por teclado, fecham e mantêm os bloqueados', async ({ page, request }) => {
  await page.goto('/leitura');
  const chapter = page.getByRole('button', { name: /Capítulo I O Despertar/ });
  await chapter.focus();
  await page.keyboard.press('Enter');
  await expect(chapter).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Mas o destino tem mãos profanas.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Capítulo II A Lâmina/ })).toBeDisabled();
  if (existsSync('public/capitulos/capitulo-1.pdf')) {
    await expect(page.getByRole('link', { name: 'Capítulo Completo (PDF)' })).toBeVisible();
    const pdf = await request.get('/capitulos/capitulo-1.pdf');
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('application/pdf');
  } else {
    await expect(page.getByText('Capítulo Completo (PDF) — em breve')).toBeVisible();
  }
  await chapter.click();
  await expect(chapter).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Mas o destino tem mãos profanas.')).toHaveCount(0);
});

test('Códex filtra, abre modal, mantém foco e fecha com Escape', async ({ page }, testInfo) => {
  await page.goto('/codex');
  const card = page.getByRole('button', { name: 'O Enigma Sereth', exact: true });
  await card.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Sereth' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Registros Históricos')).toBeVisible();
  await dialog.screenshot({ path: testInfo.outputPath('dialog.png') });
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
  await page.getByRole('button', { name: 'Lore', exact: true }).click();
  await page.getByRole('button', { name: 'Evento Histórico A Noite das Cinzas' }).click();
  await expect(page.getByRole('dialog', { name: 'A Noite das Cinzas' })).toBeVisible();
  await page.getByRole('button', { name: 'Fechar', exact: true }).click();
});

test('Bastidores filtra posts e informa categoria vazia', async ({ page }) => {
  await page.goto('/bastidores');
  await page.getByRole('button', { name: 'Arte', exact: true }).click();
  await expect(page.getByText('O Rosto do Enigma')).toBeVisible();
  await expect(page.getByText('A Fundação do Santuário')).toHaveCount(0);
  await page.getByRole('button', { name: 'Avisos', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Nenhum registro nesta categoria por enquanto.');
});

test('beta informa abertura futura da newsletter sem coletar e-mails', async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true', 'A newsletter foi habilitada neste build.');
  await page.goto('/santuario');
  await expect(page.getByText('Inscrições em breve.', { exact: true })).toHaveCount(2);
  await expect(page.getByRole('form', { name: 'Aviso de lançamento' })).toHaveCount(0);
  await expect(page.getByRole('form', { name: 'Novidades do livro' })).toHaveCount(0);
  await expect(page.getByLabel('Seu e-mail')).toHaveCount(0);
  await expect(page.getByText(/Bem-vindo às sombras/)).toHaveCount(0);
});

test('contato e rodapé não publicam perfis provisórios', async ({ page }) => {
  await page.goto('/contato');
  await expect(page.locator('a[href*="seu_usuario"], a[href*="seu_id"]')).toHaveCount(0);
  const profiles = page.getByRole('region', { name: 'Redes sociais do autor' }).locator('a[target="_blank"]');
  if (await profiles.count() === 0) {
    await expect(page.getByText('Os canais oficiais serão divulgados em breve.', { exact: false })).toBeVisible();
    await page.getByRole('link', { name: 'Explorar os bastidores' }).click();
    await expect(page).toHaveURL(/\/bastidores$/);
  }
});

test('API local sem configuração recusa o cadastro', async ({ request, baseURL }) => {
  const localTarget = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname);
  test.skip(!localTarget || process.env.PLAYWRIGHT_UNCONFIGURED_NEWSLETTER !== '1', 'Exige servidor local sem credenciais e confirmação explícita de teste.');
  const response = await request.post('/api/newsletter', { data: { email: 'teste@example.com' } });
  expect(response.status()).toBe(503);
  expect((await response.json()).ok).toBeUndefined();
});

test('404 e contratos HTTP da API', async ({ page, request }) => {
  expect((await page.goto('/rota-inexistente')).status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Você se perdeu');
  await page.getByRole('link', { name: 'Voltar ao Santuário' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
  expect((await request.get('/api/newsletter')).status()).toBe(405);
  const malformed = await request.post('/api/newsletter', { data: '{', headers: { 'Content-Type': 'application/json' } });
  expect(malformed.status()).toBe(400);
  expect(await malformed.json()).toEqual({ error: 'Email inválido.' });
});

test('conteúdo continua visível sem JavaScript e com movimento reduzido', async ({ browser, page, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const noJs = await context.newPage();
  await noJs.goto('/santuario');
  await expect(noJs.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(noJs.locator('main')).toHaveCSS('opacity', '1');
  await context.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/inicio');
  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
});


test('carrossel preserva os textos e navega nos dois sentidos', async ({ page }, testInfo) => {
  await page.goto('/santuario');
  await expect(page.getByRole('heading', { name: 'Os Peões no Tabuleiro' })).toBeVisible();
  const carousel = page.locator('[aria-label="Personagens"]');
  const previous = page.getByRole('button', { name: 'Anterior', exact: true });
  const next = page.getByRole('button', { name: 'Próximo', exact: true });
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.click();
  await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await previous.click();
  await expect.poll(() => carousel.evaluate((element) => element.scrollLeft)).toBe(0);
  await expect(previous).toBeDisabled();
  await carousel.locator('../..').screenshot({ path: testInfo.outputPath('carousel.png') });
});
