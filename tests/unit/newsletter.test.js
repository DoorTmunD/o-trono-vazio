import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subscribeToNewsletter, getBrevoConfig } from '../../src/server/newsletter.js';

const env = { BREVO_API_KEY: 'unit-test-placeholder', BREVO_LIST_ID: '7' };
const request = (body, headers = {}) => new Request('https://site.example/api/newsletter', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body),
});
const unavailableFetch = async () => { throw new Error('O provedor não deve ser chamado'); };

for (const body of ['{', 'null', '[]', {}, { email: null }, { email: ['test@example.com'] }, { email: 123 }, { email: 'invalid' }, { email: 'x'.repeat(255) + '@example.com' }]) {
  test(`rejeita entrada inválida: ${JSON.stringify(body).slice(0, 65)}`, async () => {
    const response = await subscribeToNewsletter(request(body), { env, fetchImpl: unavailableFetch });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Email inválido.' });
  });
}

test('limita tamanho inclusive sem Content-Length', async () => {
  for (const headers of [{}, { 'Content-Length': '99999' }]) {
    const response = await subscribeToNewsletter(request({ email: 'x'.repeat(2048) }, headers), { env, fetchImpl: unavailableFetch });
    assert.equal(response.status, 413);
  }
});

test('rejeita origem de outro site', async () => {
  const response = await subscribeToNewsletter(request({ email: 'test@example.com' }, { Origin: 'https://other.example' }), { env, fetchImpl: unavailableFetch });
  assert.equal(response.status, 403);
});

test('aceita Host público mesmo quando Next normaliza a URL interna', async () => {
  const internalRequest = new Request('http://localhost:3100/api/newsletter', {
    method: 'POST',
    headers: { Host: '127.0.0.1:3100', Origin: 'http://127.0.0.1:3100', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' }),
  });
  const response = await subscribeToNewsletter(internalRequest, { env, fetchImpl: async () => new Response(null, { status: 204 }) });
  assert.equal(response.status, 200);
});

test('configuração ausente ou lista inválida nunca confirma cadastro', async () => {
  for (const invalidEnv of [{}, { ...env, BREVO_LIST_ID: '0' }, { ...env, BREVO_LIST_ID: 'abc' }, { ...env, BREVO_LIST_ID: '1.5' }, { ...env, BREVO_LIST_ID: '1e2' }, { ...env, BREVO_LIST_ID: '9007199254740992' }]) {
    assert.equal(getBrevoConfig(invalidEnv), null);
    const response = await subscribeToNewsletter(request({ email: 'test@example.com' }), { env: invalidEnv, fetchImpl: unavailableFetch });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, undefined);
  }
});

for (const status of [201, 204]) {
  test(`preserva contrato Brevo e confirma status ${status}`, async () => {
    let calls = 0;
    const response = await subscribeToNewsletter(request({ email: ' test@example.com ' }, { Origin: 'https://site.example' }), {
      env,
      fetchImpl: async (url, options) => {
        calls++;
        assert.equal(url, 'https://api.brevo.com/v3/contacts');
        assert.equal(options.method, 'POST');
        assert.equal(options.headers['api-key'], env.BREVO_API_KEY);
        assert.deepEqual(JSON.parse(options.body), { email: 'test@example.com', listIds: [7], updateEnabled: true });
        assert.ok(options.signal instanceof AbortSignal);
        return new Response(null, { status });
      },
    });
    assert.equal(calls, 1);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });
}

test('falhas, rate limit e respostas não JSON do provedor não vazam dados', async () => {
  for (const status of [400, 401, 429, 500]) {
    const response = await subscribeToNewsletter(request({ email: 'test@example.com' }), {
      env, fetchImpl: async () => new Response('private provider response', { status }),
    });
    assert.equal(response.status, status === 429 ? 503 : 500);
    assert.equal((await response.text()).includes('private'), false);
  }
});

test('erro de rede e timeout retornam JSON sem dados privados', async () => {
  for (const error of [new Error('private'), new DOMException('private', 'TimeoutError')]) {
    const response = await subscribeToNewsletter(request({ email: 'test@example.com' }), { env, fetchImpl: async () => { throw error; } });
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: 'Erro ao cadastrar. Tente novamente.' });
  }
});
