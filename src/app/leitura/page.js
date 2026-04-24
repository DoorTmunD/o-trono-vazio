'use client';

import { useState, useEffect } from 'react';
import { Cinzel, Montserrat, Lora } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const cinzel   = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'] });
const lora     = Lora({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] });

// ============================================================
// CAPÍTULOS — Adicione o conteúdo do seu livro aqui
//
// Para cada capítulo:
//   numero  → texto exibido no topo do card (ex: 'Capítulo I')
//   titulo  → título do capítulo
//   epigrafe → frase opcional antes do texto (pode remover)
//   status  → 'disponivel' para liberar | 'em-breve' para ocultar
//   texto   → array de strings; cada string = um parágrafo
//
// Para adicionar um novo capítulo, copie um bloco { } completo
// e cole abaixo do último, separado por vírgula.
// ============================================================
const capitulos = [
  {
    id: 1,
    numero: 'Capítulo I',
    titulo: 'O Início das Sombras',
    epigrafe: '"O primeiro passo para o abismo começa com uma escolha que parece insignificante."',
    status: 'disponivel',
    texto: [
      // Substitua cada string abaixo por um parágrafo real do seu capítulo
      'Adicione aqui o primeiro parágrafo do Capítulo I.',
      'Adicione aqui o segundo parágrafo. Cada string neste array será exibida como um parágrafo separado.',
      'Continue adicionando parágrafos conforme necessário. Quando terminar, salve o arquivo e a página será atualizada automaticamente.',
    ],
  },
  {
    id: 2,
    numero: 'Capítulo II',
    titulo: 'A Lâmina e o Enigma',
    status: 'em-breve',
  },
  {
    id: 3,
    numero: 'Capítulo III',
    titulo: 'O Preço da Redenção',
    status: 'em-breve',
  },
  {
    id: 4,
    numero: 'Capítulo IV',
    titulo: 'Sangue e Cinzas',
    status: 'em-breve',
  },
  // Adicione mais capítulos aqui seguindo o padrão acima
];

export default function Leitura() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [capituloAberto, setCapituloAberto] = useState(null);

  useEffect(() => { setIsLoaded(true); }, []);

  const toggleCapitulo = (id) => {
    const abrindo = capituloAberto !== id;
    setCapituloAberto(abrindo ? id : null);
    if (abrindo) {
      setTimeout(() => {
        document.getElementById(`cap-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Nav />

      {/* Cabeçalho */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center">
        <div className={`text-center space-y-4 px-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Obra Completa
            <div className="h-px w-8 bg-amber-700" />
          </span>
          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest`}>
            LEITURA
          </h1>
          <p className="text-neutral-500 font-light text-sm tracking-wider max-w-md mx-auto">
            Os capítulos são liberados conforme a obra avança. A escuridão se revela aos poucos.
          </p>
        </div>
      </section>

      {/* Lista de capítulos */}
      <section className={`max-w-3xl mx-auto px-6 pb-24 space-y-4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {capitulos.map((cap) => {
          const disponivel = cap.status === 'disponivel';
          const aberto     = capituloAberto === cap.id;

          return (
            <div
              key={cap.id}
              id={`cap-${cap.id}`}
              className={`border transition-all duration-300 ${
                disponivel
                  ? aberto
                    ? 'border-red-900/60 bg-neutral-900/40'
                    : 'border-neutral-800 hover:border-red-900/40 bg-neutral-900/20'
                  : 'border-neutral-900 opacity-40'
              }`}
            >
              {/* Cabeçalho do capítulo */}
              <div
                className={`p-6 flex items-center justify-between gap-4 ${disponivel ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => disponivel && toggleCapitulo(cap.id)}
              >
                <div className="flex items-center gap-6 min-w-0">
                  <span className="text-neutral-600 text-xs tracking-widest uppercase font-bold shrink-0">
                    {cap.numero}
                  </span>
                  <h3 className={`${cinzel.className} text-lg text-white truncate`}>
                    {cap.titulo}
                  </h3>
                </div>

                {disponivel ? (
                  <span className={`text-xs font-bold tracking-widest uppercase shrink-0 transition-colors duration-300 ${aberto ? 'text-amber-600' : 'text-red-700'}`}>
                    {aberto ? '— Fechar' : '+ Ler'}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-700 tracking-widest uppercase font-bold shrink-0">
                    Em Breve
                  </span>
                )}
              </div>

              {/* Texto do capítulo — expande quando aberto */}
              {disponivel && aberto && (
                <div className="border-t border-neutral-800/60 px-6 pb-12 pt-8">
                  {cap.epigrafe && (
                    <p className={`${lora.className} text-neutral-500 italic text-sm mb-10 pl-4 border-l border-amber-800/40 leading-relaxed`}>
                      {cap.epigrafe}
                    </p>
                  )}
                  <div className={`${lora.className} text-neutral-300 leading-[1.95] text-[1.05rem] space-y-6`}>
                    {cap.texto?.map((paragrafo, i) => (
                      <p key={i}>{paragrafo}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}
