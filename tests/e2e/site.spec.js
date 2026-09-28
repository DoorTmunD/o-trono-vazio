import { existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const pages = [
  ['/', 'O Trono Vazio'], ['/santuario', 'O Santuário | O Trono Vazio'],
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

test('entrada e visita já registrada mantêm navegação', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/santuario$/);
});

test('armazenamento bloqueado não impede a entrada', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'ENTRAR NO SANTUÁRIO' }).click();
  await expect(page).toHaveURL(/\/santuario$/);
});

test('cena 3D permite pausar e retomar; entrada permanece acessível por teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
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

test('preferência por movimento reduzido inicia a cena pausada e permite controle explícito', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
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

test('newsletter real sem configuração exibe erro nos dois formulários', async ({ page }) => {
  await page.goto('/santuario');
  for (const name of ['Aviso de lançamento', 'Novidades do livro']) {
    const form = page.getByRole('form', { name });
    await form.getByLabel('Seu e-mail').fill('teste@example.com');
    const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/newsletter') && response.request().method() === 'POST');
    await form.getByRole('button').click();
    expect((await responsePromise).status()).toBe(503);
    await expect(form.locator('..').getByRole('alert')).toHaveText('Erro ao cadastrar. Tente novamente.');
    await expect(form.getByRole('button')).toBeEnabled();
  }
  await expect(page.getByText(/Bem-vindo às sombras/)).toHaveCount(0);
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

test('conteúdo continua visível sem JavaScript e com movimento reduzido', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await context.newPage();
  await noJs.goto('http://127.0.0.1:3100/santuario');
  await expect(noJs.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(noJs.locator('main')).toHaveCSS('opacity', '1');
  await context.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
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
