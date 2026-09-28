import 'server-only';

const MAX_BODY_BYTES = 1024;
const errorResponse = (error, status) => Response.json({ error }, {
  status,
  headers: { 'Cache-Control': 'no-store' },
});

export function getBrevoConfig(env = process.env) {
  const apiKey = env.BREVO_API_KEY?.trim();
  const rawListId = env.BREVO_LIST_ID?.trim();
  const listId = Number(rawListId);
  if (!apiKey || !/^\d+$/.test(rawListId ?? '') || !Number.isSafeInteger(listId) || listId <= 0) return null;
  return { apiKey, listId };
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return { tooLarge: true };
  const reader = request.body?.getReader();
  if (!reader) return { invalid: true };
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true };
      }
      body += decoder.decode(value, { stream: true });
    }
    return { data: JSON.parse(body + decoder.decode()) };
  } catch {
    return { invalid: true };
  } finally {
    reader.releaseLock();
  }
}

export async function subscribeToNewsletter(request, { env = process.env, fetchImpl = fetch } = {}) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const originUrl = new URL(origin);
      // Next pode normalizar request.url para localhost atrás do servidor/proxy.
      // Host preserva o destino público; não confiar em X-Forwarded-Host arbitrário.
      const host = request.headers.get('host') || new URL(request.url).host;
      if (!['http:', 'https:'].includes(originUrl.protocol) || originUrl.host !== host) {
        return errorResponse('Origem não permitida.', 403);
      }
    } catch {
      return errorResponse('Origem não permitida.', 403);
    }
  }
  const body = await readBody(request);
  if (body.tooLarge) return errorResponse('Requisição muito grande.', 413);
  const email = typeof body.data?.email === 'string' ? body.data.email.trim() : '';
  if (body.invalid || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse('Email inválido.', 400);
  }
  const config = getBrevoConfig(env);
  if (!config) {
    // Nunca registrar endereços, chaves ou corpos de resposta do provedor.
    console.error('[newsletter] Configuração Brevo ausente ou inválida.');
    return errorResponse('Cadastro temporariamente indisponível. Tente novamente mais tarde.', 503);
  }
  try {
    const response = await fetchImpl('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json', 'api-key': config.apiKey },
      body: JSON.stringify({ email, listIds: [config.listId], updateEnabled: true }),
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    if (response.status === 201 || response.status === 204) {
      return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    }
    console.error('[newsletter] Falha do provedor. Status:', response.status);
    return errorResponse('Erro ao cadastrar. Tente novamente.', response.status === 429 ? 503 : 500);
  } catch {
    console.error('[newsletter] Falha de conexão ou timeout no provedor.');
    return errorResponse('Erro ao cadastrar. Tente novamente.', 502);
  }
}
