'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cinzel, Montserrat } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

export default function SantuarioHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const personagens = [
    { nome: 'Sereth', titulo: 'O Enigma', desc: 'A bengala dita o ritmo de passos que escondem segredos profundos.' },
    { nome: 'Ha-Neul (Hana)', titulo: 'A Lâmina', desc: 'A precisão forjada nas sombras de um passado distante.' },
    { nome: 'Maria', titulo: 'A Devota', desc: 'A fé inabalável guiando o grupo pela escuridão.' },
    { nome: 'Thomas (Tom)', titulo: 'O Protetor', desc: 'A mente que calcula cada movimento no tabuleiro.' },
    { nome: 'Leanor (Lea)', titulo: 'A Sombra', desc: 'Os passos silenciosos que ninguém vê chegar.' },
  ];

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
    `}>

      {/* 1. O MENU SUPERIOR */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/santuario" className={`${cinzel.className} text-xl tracking-widest text-neutral-100 hover:text-amber-600 transition-colors`}>
            O TRONO VAZIO
          </Link>

          {/* Links — desktop */}
          <div className="hidden md:flex gap-8 text-xs tracking-widest text-neutral-400 font-medium uppercase">
            <Link href="/santuario" className="text-red-600">A Obra</Link>
            <Link href="/codex" className="hover:text-red-500 transition-colors">O Códex</Link>
            <Link href="/bastidores" className="hover:text-red-500 transition-colors">Bastidores</Link>
          </div>

          {/* Hambúrguer — mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
          >
            <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 origin-center ${menuAberto ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 ${menuAberto ? 'opacity-0 scale-x-0' : ''}`}></span>
            <span className={`block w-6 h-px bg-neutral-400 transition-all duration-300 origin-center ${menuAberto ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>

        {/* Menu mobile — dropdown animado */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuAberto ? 'max-h-48' : 'max-h-0'}`}>
          <div className="flex flex-col items-center gap-6 py-6 text-xs tracking-widest font-medium uppercase border-t border-neutral-800/50">
            <Link href="/santuario" className="text-red-600" onClick={() => setMenuAberto(false)}>A Obra</Link>
            <Link href="/codex" className="text-neutral-400 hover:text-red-500 transition-colors" onClick={() => setMenuAberto(false)}>O Códex</Link>
            <Link href="/bastidores" className="text-neutral-400 hover:text-red-500 transition-colors" onClick={() => setMenuAberto(false)}>Bastidores</Link>
          </div>
        </div>
      </nav>

      {/* 2. O HERO BANNER */}
      <section className="relative w-full min-h-screen flex items-center pt-20">

        {/* Fundo da Biblioteca */}
        <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/capa-biblioteca.png"
              alt="Destaque"
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10"></div>
        </div>

        {/* Textos e Botões */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl space-y-6 transition-all duration-1000 delay-300
            ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
          `}>

            <div className="flex items-center gap-4">
                <div className="h-0.5 w-12 bg-amber-700"></div>
                <span className="text-amber-500 font-bold tracking-widest text-xs uppercase">
                  Inicie a Jornada
                </span>
            </div>

            <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white leading-tight`}>
              O Tomo <br/> Principal
            </h1>

            <p className="text-neutral-300 text-lg leading-relaxed font-light">
              Mergulhe nas crônicas esquecidas. Acompanhe a jornada onde luz e sombras colidem, e descubra os segredos que aguardam nas entrelinhas da obra completa.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <button className="flex items-center gap-3 px-8 py-4 bg-red-900 hover:bg-red-800 text-white border border-red-700 rounded-sm font-bold tracking-widest text-sm uppercase transition-all shadow-lg">
                <span className="text-amber-500">✦</span>
                Ler Agora
              </button>

              <button className="px-8 py-4 bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-600 rounded-sm font-bold tracking-widest text-sm uppercase transition-all backdrop-blur-sm">
                Mais Detalhes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRILHAS DE CONTEÚDO */}
      <section className={`relative z-20 w-full max-w-6xl mx-auto px-6 pb-24 transition-all duration-1000 delay-500
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}>

        <div className="space-y-6">
          <h3 className={`${cinzel.className} text-2xl text-white tracking-widest border-l-2 border-red-800 pl-4`}>
            Os Peões no Tabuleiro
          </h3>

          <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {personagens.map((personagem, index) => (
              <div key={index} className="min-w-64 h-96 relative group cursor-pointer border border-neutral-800 rounded-md overflow-hidden bg-neutral-900 flex items-end p-6 hover:-translate-y-2 hover:border-red-900 transition-all duration-300">

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 group-hover:from-red-950/80 transition-colors duration-300"></div>

                <div className="relative z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-amber-600 uppercase tracking-widest mb-1">{personagem.titulo}</p>
                  <p className="text-white text-xl font-bold tracking-widest mb-3">{personagem.nome}</p>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-px w-full bg-red-900/50 mb-3"></div>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed">
                      {personagem.desc}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
