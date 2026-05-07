'use client';

import { useState, useEffect } from 'react';
import { cinzel, montserrat, lora } from '@/lib/fonts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

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
    titulo: 'O Despertar do Abismo',
    epigrafe: '"O primeiro passo para o abismo começa com uma escolha que parece insignificante."',
    status: 'disponivel',
    downloads: {
      pdf: '/capitulos/capitulo-1.pdf',
    },
    texto: [
      'Por dois milênios, o silêncio foi seu único companheiro, e a agonia, sua única certeza. No poço mais profundo do Inferno, onde a luz é um mito e a esperança um insulto, o Anjo Sereth foi forjado na tortura ininterrupta. Suas asas, outrora símbolos de glória, tornaram-se cicatrizes brancas de uma traição esquecida.',
      'Mas o destino tem mãos profanas.',
      'Resgatado pelas mãos de uma demônia e marcado pelo sangue de uma cruz invertida, Sereth caminha agora pelas ruas de uma Londres envolta em sombras e segredos. Com cabelos prateados manchados pela corrupção e olhos cinzentos como a névoa, ele não busca redenção, mas as respostas escondidas entre os livros da Biblioteca Maughan e os sussurros do submundo.',
      'Por que o anjo mais resiliente do cosmos foi condenado ao esquecimento? Que segredo seu Nome Verdadeiro esconde?',
      'Prepare-se para entrar em um mundo onde anjos queimam, demônios sangram e o vazio reclama seu trono. Conheça Sereth: o anjo que sobreviveu ao fim de todas as coisas para garantir que a sua jornada seja apenas o começo do caos.',
      'A ausência nunca pesou tanto. O Trono Vazio espera por você.',
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

const calcularTempo = (texto) => {
  if (!texto?.length) return null;
  const palavras = texto.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palavras / 200));
};

export default function Leitura() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [capituloAberto, setCapituloAberto] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => { setIsLoaded(true); }, []);

  useEffect(() => {
    if (!capituloAberto) { setScrollProgress(0); return; }
    const handleScroll = () => {
      const el = document.getElementById(`cap-${capituloAberto}`);
      if (!el) return;
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      const progress = Math.min(100, Math.max(0,
        ((window.scrollY - elTop) / el.offsetHeight) * 100
      ));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [capituloAberto]);

  const toggleCapitulo = (id) => {
    const abrindo = capituloAberto !== id;
    setCapituloAberto(abrindo ? id : null);
    if (abrindo) {
      setTimeout(() => {
        document.getElementById(`cap-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const abrirCapitulo = (id) => {
    setCapituloAberto(id);
    setTimeout(() => {
      document.getElementById(`cap-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

      {/* Barra de progresso de leitura */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-neutral-900 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-red-900 via-amber-700 to-amber-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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
        {capitulos.map((cap, index) => {
          const disponivel = cap.status === 'disponivel';
          const aberto     = capituloAberto === cap.id;
          const capPrev    = index > 0 ? capitulos[index - 1] : null;
          const capNext    = index < capitulos.length - 1 ? capitulos[index + 1] : null;
          const tempo      = disponivel ? calcularTempo(cap.texto) : null;

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

                <div className="flex items-center gap-4 shrink-0">
                  {disponivel && tempo && (
                    <span className="text-xs text-neutral-600 tracking-widest hidden sm:block">~{tempo} min</span>
                  )}
                  {disponivel ? (
                    <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${aberto ? 'text-amber-600' : 'text-red-700'}`}>
                      {aberto ? '— Fechar' : '+ Ler'}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-700 tracking-widest uppercase font-bold">
                      Em Breve
                    </span>
                  )}
                </div>
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

                  {/* Download do capítulo completo */}
                  {cap.downloads?.pdf && (
                    <div className="flex flex-wrap gap-3 mt-12">
                      <a
                        href={cap.downloads.pdf}
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-800 text-neutral-400 hover:border-amber-700 hover:text-amber-600 text-xs font-bold tracking-widest uppercase transition-all duration-300"
                      >
                        <span>↓</span> Capítulo Completo (PDF)
                      </a>
                    </div>
                  )}

                  {/* Navegação entre capítulos */}
                  <div className="flex justify-between items-start mt-16 pt-8 border-t border-neutral-800/40 gap-8">
                    <div>
                      {capPrev && capPrev.status === 'disponivel' && (
                        <button onClick={() => abrirCapitulo(capPrev.id)} className="text-left group">
                          <span className="text-xs text-neutral-600 tracking-widest uppercase block mb-1">← Anterior</span>
                          <span className={`${cinzel.className} text-sm text-neutral-400 group-hover:text-white transition-colors`}>
                            {capPrev.titulo}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      {capNext && (
                        capNext.status === 'disponivel' ? (
                          <button onClick={() => abrirCapitulo(capNext.id)} className="text-right group">
                            <span className="text-xs text-neutral-600 tracking-widest uppercase block mb-1">Próximo →</span>
                            <span className={`${cinzel.className} text-sm text-neutral-400 group-hover:text-white transition-colors`}>
                              {capNext.titulo}
                            </span>
                          </button>
                        ) : (
                          <div>
                            <span className="text-xs text-neutral-700 tracking-widest uppercase block mb-1">Próximo →</span>
                            <span className={`${cinzel.className} text-sm text-neutral-700 block`}>{capNext.titulo}</span>
                            <span className="text-xs text-red-900/60 tracking-widest uppercase block mt-1">Em Breve</span>
                          </div>
                        )
                      )}
                    </div>
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
