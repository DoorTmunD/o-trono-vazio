import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capitulos } from '../../src/content/capitulos.js';
import { personagens } from '../../src/content/personagens.js';
import { calcularTempo } from '../../src/lib/leitura.js';
import { getCapitulos } from '../../src/server/capitulos.js';
import { getSiteUrl } from '../../src/config/site.js';
import { publicAssetIssue } from '../../scripts/lib/content-checks.js';

test('identificadores e estados editoriais são válidos', () => {
  for (const collection of [capitulos, personagens]) {
    assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  }
  for (const chapter of capitulos) {
    assert.ok(['disponivel', 'em-breve'].includes(chapter.status));
    if (chapter.status === 'disponivel') assert.ok(chapter.texto?.length);
  }
});

test('download só fica disponível quando o arquivo existe com o nome exato', () => {
  for (const chapter of getCapitulos()) {
    assert.equal(chapter.pdfDisponivel, Boolean(chapter.downloads?.pdf && !publicAssetIssue(chapter.downloads.pdf)));
  }
  assert.match(publicAssetIssue('/tom.jpg'), /Maiúsculas/);
  assert.equal(publicAssetIssue('/Tom.JPG'), null);
});

test('tempo de leitura respeita limite mínimo e conta palavras', () => {
  assert.equal(calcularTempo(), null);
  assert.equal(calcularTempo([]), null);
  assert.equal(calcularTempo([' Uma palavra ']), 1);
  assert.equal(calcularTempo([Array(201).fill('palavra').join(' ')]), 2);
});

test('URL de metadados usa configuração explícita e URLs reais da Vercel', () => {
  assert.equal(getSiteUrl({}).origin, 'http://localhost:3000');
  assert.equal(getSiteUrl({ SITE_URL: 'https://site.example' }).origin, 'https://site.example');
  assert.equal(getSiteUrl({ VERCEL_URL: 'preview.example' }).origin, 'https://preview.example');
  assert.equal(getSiteUrl({ VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'production.example', VERCEL_URL: 'preview.example' }).origin, 'https://production.example');
  for (const SITE_URL of ['https://site.example/path', 'https://user:pass@site.example', 'http://site.example', 'javascript:alert(1)', 'https://site.example?key=1']) assert.throws(() => getSiteUrl({ SITE_URL }));
});
