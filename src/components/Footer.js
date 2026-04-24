'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cinzel, Montserrat } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400'] });

// ============================================================
// REDES SOCIAIS
// Substitua os valores de "href" e "usuario" pelos seus reais.
// Para adicionar mais redes, copie um bloco { } e cole abaixo.
// ============================================================
const redesSociais = [
  {
    nome: 'Instagram',
    usuario: '@seu_usuario',
    href: 'https://instagram.com/seu_usuario',
  },
  {
    nome: 'TikTok',
    usuario: '@seu_usuario',
    href: 'https://tiktok.com/@seu_usuario',
  },
  {
    nome: 'Twitter / X',
    usuario: '@seu_usuario',
    href: 'https://x.com/seu_usuario',
  },
  {
    nome: 'Goodreads',
    usuario: 'Danilo Simões',
    href: 'https://goodreads.com/user/show/seu_id',
  },
];

const navLinks = [
  { href: '/santuario',  label: 'A Obra' },
  { href: '/leitura',    label: 'Leitura' },
  { href: '/codex',      label: 'O Códex' },
  { href: '/bastidores', label: 'Bastidores' },
  { href: '/contato',    label: 'Contato' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;

    // ============================================================
    // NEWSLETTER — Integração com serviço de e-mail
    //
    // Opções gratuitas recomendadas:
    //   • Mailchimp  → mailchimp.com
    //   • Brevo      → brevo.com
    //   • ConvertKit → convertkit.com
    //
    // Substitua o console.log abaixo pela chamada à API do
    // serviço escolhido (geralmente um fetch POST com o email).
    // ============================================================
    console.log('Email para newsletter:', email);

    setEnviado(true);
    setEmail('');
  };

  return (
    <footer className={`${montserrat.className} bg-black border-t border-neutral-800/60 mt-24`}>

      {/* Linha decorativa */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-800/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Coluna 1 — Marca */}
        <div className="space-y-4">
          <h3 className={`${cinzel.className} text-xl tracking-widest text-white`}>O TRONO VAZIO</h3>
          <p className="text-neutral-500 text-sm leading-relaxed font-light">
            Uma saga de Dark Fantasy onde luz e sombras colidem. Acompanhe a jornada de personagens forjados pela escuridão.
          </p>
          <p className="text-neutral-600 text-xs tracking-widest">por Danilo Simões</p>
        </div>

        {/* Coluna 2 — Navegação */}
        <div className="space-y-4">
          <h4 className="text-neutral-400 text-xs tracking-widest uppercase font-bold">Explorar</h4>
          <nav className="flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-500 hover:text-amber-600 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Coluna 3 — Newsletter */}
        <div className="space-y-4">
          <h4 className="text-neutral-400 text-xs tracking-widest uppercase font-bold">Fique por Dentro</h4>
          <p className="text-neutral-500 text-sm font-light">
            Receba novidades sobre o livro antes de todo mundo.
          </p>

          {enviado ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <span>✦</span>
              <span>Bem-vindo às sombras. Em breve terá notícias.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm px-4 py-3 placeholder-neutral-600 focus:outline-none focus:border-amber-700 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-950 hover:bg-red-900 text-white text-xs font-bold tracking-widest uppercase border border-red-900 hover:border-red-700 transition-all"
              >
                Quero Saber Primeiro
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-neutral-900 max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-neutral-600 text-xs tracking-widest">
          © {new Date().getFullYear()} O Trono Vazio — Danilo Simões. Todos os direitos reservados.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {redesSociais.map(rede => (
            <a
              key={rede.nome}
              href={rede.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={rede.nome}
              className="text-neutral-600 hover:text-amber-600 text-xs tracking-widest uppercase transition-colors"
            >
              {rede.nome}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
