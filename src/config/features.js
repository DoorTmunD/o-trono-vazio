// Disponibilidade pública definida no build; habilitar requer novo deploy.
// Credenciais da newsletter permanecem exclusivamente no servidor.
export const newsletterEnabled = process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true';
