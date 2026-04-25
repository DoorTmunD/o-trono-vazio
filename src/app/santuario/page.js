'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cinzel, montserrat } from '@/lib/fonts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function SantuarioHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [emailAviso, setEmailAviso] = useState('');
  const [estadoAviso, setEstadoAviso] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'erro'

  useEffect(() => { setIsLoaded(true); }, []);

  const handleAviso = async (e) => {
    e.preventDefault();
    if (!emailAviso || estadoAviso === 'loading') return;
    setEstadoAviso('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAviso }),
      });
      const data = await res.json();
      if (data.ok) {
        setEstadoAviso('ok');
        setEmailAviso('');
      } else {
        setEstadoAviso('erro');
      }
    } catch {
      setEstadoAviso('erro');
    }
  };

  const personagens = [
    { nome: 'Sereth',         titulo: 'O Enigma',    desc: 'A bengala dita o ritmo de passos que escondem segredos profundos.', imagem: '/Sereth.jpg' },
    { nome: 'Ha-Neul (Hana)', titulo: 'A Lâmina',    desc: 'A precisão forjada nas sombras de um passado distante.',           imagem: '/Hana.jpg'   },
    { nome: 'Maria',          titulo: 'A Devota',    desc: 'A fé inabalável guiando o grupo pela escuridão.',                  imagem: null          },
    { nome: 'Thomas (Tom)',   titulo: 'O Protetor',  desc: 'A mente que calcula cada movimento no tabuleiro.',                 imagem: '/Tom.JPG'    },
    { nome: 'Leanor (Lea)',   titulo: 'A Sombra',    desc: 'Os passos silenciosos que ninguém vê chegar.',                    imagem: '/Lea.JPG'    },
  ];

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
    `}>
      <Nav />

      {/* HERO BANNER */}
      <section className="relative w-full min-h-screen flex items-center pt-20">

        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/capa-biblioteca.png"
            alt="Destaque"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 w-full max-w-6xl mx-auto px-6">
          <div className={`max-w-2xl space-y-6 transition-all duration-1000 delay-300
            ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
          `}>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-12 bg-amber-700" />
              <span className="text-amber-500 font-bold tracking-widest text-xs uppercase">
                Inicie a Jornada
              </span>
            </div>

            <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white leading-tight`}>
              O Tomo <br /> Principal
            </h1>

            <p className="text-neutral-300 text-lg leading-relaxed font-light">
              Mergulhe nas crônicas esquecidas. Acompanhe a jornada onde luz e sombras colidem, e descubra os segredos que aguardam nas entrelinhas da obra completa.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <Link
                href="/leitura"
                className="flex items-center gap-3 px-8 py-4 bg-red-900 hover:bg-red-800 text-white border border-red-700 rounded-sm font-bold tracking-widest text-sm uppercase transition-all shadow-lg"
              >
                <span className="text-amber-500">✦</span>
                Ler Agora
              </Link>

              <Link
                href="/codex"
                className="px-8 py-4 bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-600 rounded-sm font-bold tracking-widest text-sm uppercase transition-all backdrop-blur-sm"
              >
                O Códex
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAGENS */}
      <section className={`relative z-20 w-full max-w-6xl mx-auto px-6 pb-24 transition-all duration-1000 delay-500
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}>
        <div className="space-y-6">
          <h3 className={`${cinzel.className} text-2xl text-white tracking-widest border-l-2 border-red-800 pl-4`}>
            Os Peões no Tabuleiro
          </h3>

          <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {personagens.map((personagem, index) => (
              <div
                key={index}
                className="min-w-64 h-96 relative group cursor-pointer border border-neutral-800 rounded-md overflow-hidden bg-neutral-900 flex items-end p-6 hover:-translate-y-2 hover:border-red-900 transition-all duration-300"
              >
                {personagem.imagem && (
                  <Image
                    src={personagem.imagem}
                    alt={personagem.nome}
                    fill
                    className="object-cover object-top opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 z-10 group-hover:from-red-950/80 transition-colors duration-300" />

                <div className="relative z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-amber-600 uppercase tracking-widest mb-1">{personagem.titulo}</p>
                  <p className="text-white text-xl font-bold tracking-widest mb-3">{personagem.nome}</p>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-px w-full bg-red-900/50 mb-3" />
                    <p className="text-sm text-neutral-400 font-light leading-relaxed">{personagem.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* ME AVISE NO LANÇAMENTO */}
      <section className={`relative w-full py-32 overflow-hidden border-t border-neutral-900 transition-all duration-1000 delay-700
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-900/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-amber-800/40" />
            <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">Lançamento</span>
            <div className="h-px w-12 bg-amber-800/40" />
          </div>

          <h2 className={`${cinzel.className} text-4xl md:text-5xl text-white mb-6 leading-tight`}>
            Seja o Primeiro<br />a Saber
          </h2>

          <p className="text-neutral-500 font-light leading-relaxed mb-10 max-w-md mx-auto">
            O Trono Vazio está sendo forjado. Entre para a lista e receba a notícia no momento em que o livro estiver disponível.
          </p>

          {estadoAviso === 'ok' ? (
            <div className="flex items-center justify-center gap-3 text-amber-600">
              <span>✦</span>
              <span className="text-sm tracking-wider">Bem-vindo às sombras. Você será o primeiro a saber.</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleAviso} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailAviso}
                  onChange={(e) => setEmailAviso(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={estadoAviso === 'loading'}
                  className="flex-1 bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm px-4 py-3 placeholder-neutral-600 focus:outline-none focus:border-amber-700 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={estadoAviso === 'loading'}
                  className="px-7 py-3 bg-red-950 hover:bg-red-900 text-white text-xs font-bold tracking-widest uppercase border border-red-900 hover:border-red-700 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {estadoAviso === 'loading' ? 'Aguarde...' : 'Me Avise'}
                </button>
              </form>
              {estadoAviso === 'erro' && (
                <p className="text-red-700 text-xs mt-4 tracking-wider">Erro ao cadastrar. Tente novamente.</p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
