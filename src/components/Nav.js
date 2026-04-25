'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cinzel } from '@/lib/fonts';

const links = [
  { href: '/santuario', label: 'A Obra' },
  { href: '/leitura',   label: 'Leitura' },
  { href: '/codex',     label: 'O Códex' },
  { href: '/bastidores',label: 'Bastidores' },
  { href: '/contato',   label: 'Contato' },
];

export default function Nav() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  // Fecha o menu mobile ao trocar de página
  useEffect(() => { setMenuAberto(false); }, [pathname]);

  const ativo = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

        <Link
          href="/santuario"
          className={`${cinzel.className} text-xl tracking-widest text-neutral-100 hover:text-amber-600 transition-colors`}
        >
          O TRONO VAZIO
        </Link>

        {/* Links — desktop */}
        <div className="hidden md:flex gap-8 text-xs tracking-widest font-medium uppercase">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={ativo(link.href)
                ? 'text-red-600'
                : 'text-neutral-400 hover:text-red-500 transition-colors'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hambúrguer — mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuAberto(prev => !prev)}
          aria-label="Abrir menu"
        >
          <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 origin-center ${menuAberto ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 ${menuAberto ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 origin-center ${menuAberto ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Dropdown mobile */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuAberto ? 'max-h-72' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-6 py-6 text-xs tracking-widest font-medium uppercase border-t border-neutral-800/50">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={ativo(link.href)
                ? 'text-red-600'
                : 'text-neutral-400 hover:text-red-500 transition-colors'}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
