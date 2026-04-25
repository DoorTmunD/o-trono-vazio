export async function POST(request) {
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID ?? 2);

  // Sem chave configurada: loga localmente e retorna ok (dev/staging)
  if (!apiKey) {
    console.log('[newsletter] BREVO_API_KEY não configurada. Email recebido:', email);
    return Response.json({ ok: true });
  }

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  // 201 = criado, 204 = atualizado
  if (res.status === 201 || res.status === 204) {
    return Response.json({ ok: true });
  }

  const data = await res.json().catch(() => ({}));

  // Contato já existe (sem updateEnabled)
  if (data.code === 'duplicate_parameter') {
    return Response.json({ ok: true });
  }

  console.error('[newsletter] Brevo error:', data);
  return Response.json({ error: 'Erro ao cadastrar. Tente novamente.' }, { status: 500 });
}
