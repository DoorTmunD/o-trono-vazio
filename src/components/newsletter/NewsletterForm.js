'use client';

import { useId, useRef, useState } from 'react';
import { newsletterEnabled } from '@/config/features';

export default function NewsletterForm({ variant = 'footer' }) {
  const id = useId();
  const pending = useRef(false);
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('idle');
  const launch = variant === 'launch';

  async function handleSubmit(event) {
    event.preventDefault();
    if (!newsletterEnabled || pending.current || !email.trim()) return;
    pending.current = true;
    setEstado('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true) throw new Error('Cadastro não confirmado');
      setEstado('ok');
      setEmail('');
    } catch {
      setEstado('erro');
    } finally {
      pending.current = false;
    }
  }

  if (!newsletterEnabled) {
    return (
      <p className={`border border-amber-900/40 bg-neutral-900/40 px-5 py-4 text-sm leading-relaxed text-neutral-300 ${launch ? 'mx-auto max-w-md text-center' : ''}`}>
        <span className="block text-amber-200/80">Inscrições em breve.</span>
        <span className="mt-1 block text-xs text-neutral-400">A lista de novidades será aberta em uma próxima atualização.</span>
      </p>
    );
  }

  return (
    <div aria-live="polite" aria-atomic="true">
      {estado === 'ok' ? (
        <div role="status" className={`flex items-center text-amber-600 ${launch ? 'justify-center gap-3' : 'gap-2 text-sm'}`}>
          <span aria-hidden="true">✦</span>
          <span className={launch ? 'text-sm tracking-wider' : undefined}>
            {launch ? 'Bem-vindo às sombras. Você será o primeiro a saber.' : 'Bem-vindo às sombras. Em breve terá notícias.'}
          </span>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} aria-label={launch ? 'Aviso de lançamento' : 'Novidades do livro'} aria-busy={estado === 'loading'} className={`flex flex-col gap-3 ${launch ? 'sm:flex-row max-w-md mx-auto' : ''}`}>
            <label htmlFor={id} className="sr-only">Seu e-mail</label>
            <input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
              disabled={estado === 'loading'}
              aria-describedby={estado === 'erro' ? `${id}-error` : undefined}
              className={`min-w-0 bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm px-4 py-3 placeholder-neutral-600 focus:outline-none focus:border-amber-700 transition-colors disabled:opacity-50 ${launch ? 'flex-1' : ''}`}
            />
            <button type="submit" disabled={estado === 'loading'} className={`${launch ? 'px-7 whitespace-nowrap' : 'px-6'} py-3 bg-red-950 hover:bg-red-900 text-white text-xs font-bold tracking-widest uppercase border border-red-900 hover:border-red-700 transition-all disabled:opacity-50`}>
              {estado === 'loading' ? 'Aguarde...' : launch ? 'Me Avise' : 'Quero Saber Primeiro'}
            </button>
          </form>
          {estado === 'erro' && (
            <p id={`${id}-error`} role="alert" className={`text-red-400 text-xs tracking-wider ${launch ? 'mt-4' : 'mt-3'}`}>
              Erro ao cadastrar. Tente novamente.
            </p>
          )}
        </>
      )}
    </div>
  );
}
