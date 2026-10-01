'use client';

import { useState, useEffect, useRef } from 'react';
import { displayFont, interfaceFont, readingFont } from '@/config/fonts';
import { calcularTempo } from '@/lib/leitura';

export default function Leitura({ capitulos }) {
  const [capituloAberto, setCapituloAberto] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTimer = useRef(null);

  useEffect(() => () => clearTimeout(scrollTimer.current), []);


  useEffect(() => {
    if (!capituloAberto) return;
    const handleScroll = () => {
      const el = document.getElementById(`cap-${capituloAberto}`);
      if (!el) return;
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      const progress = Math.min(100, Math.max(0,
        ((window.scrollY + window.innerHeight - elTop) / el.offsetHeight) * 100
      ));
      setScrollProgress(progress);
    };
    const frame = requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [capituloAberto]);

  const abrirCapitulo = (id) => {
    clearTimeout(scrollTimer.current);
    setScrollProgress(0);
    setCapituloAberto(id);
    if (id !== null) {
      scrollTimer.current = setTimeout(() => {
        document.getElementById(`cap-${id}`)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        });
      }, 150);
    }
  };

  const toggleCapitulo = (id) => abrirCapitulo(capituloAberto === id ? null : id);

  return (
    <main className={`bg-neutral-950 text-neutral-200 ${interfaceFont.className} transition-opacity duration-1000 opacity-100 reveal`}>

      {/* Barra de progresso de leitura */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-neutral-900 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-red-900 via-amber-700 to-amber-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>


      {/* Cabeçalho */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center">
        <div className={`text-center space-y-4 px-6 transition-all duration-1000 delay-300 opacity-100 translate-y-0 reveal-up`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Obra Completa
            <div className="h-px w-8 bg-amber-700" />
          </span>
          <h1 className={`${displayFont.className} text-5xl md:text-7xl text-white tracking-widest`}>
            Leitura
          </h1>
          <p className="text-neutral-500 font-light text-sm tracking-wider max-w-md mx-auto">
            Os capítulos são liberados conforme a obra avança. A escuridão se revela aos poucos.
          </p>
        </div>
      </section>

      {/* Lista de capítulos */}
      <section className={`max-w-3xl mx-auto px-6 pb-24 space-y-4 transition-all duration-1000 delay-500 opacity-100 translate-y-0 reveal-up`}>
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
              className={`scroll-mt-24 border transition-all duration-300 ${
                disponivel
                  ? aberto
                    ? 'border-red-900/60 bg-neutral-900/40'
                    : 'border-neutral-800 hover:border-red-900/40 bg-neutral-900/20'
                  : 'border-neutral-900 opacity-40'
              }`}
            >
              {/* Cabeçalho do capítulo */}
              <button
                type="button"
                disabled={!disponivel}
                aria-expanded={aberto}
                aria-controls={aberto ? `texto-cap-${cap.id}` : undefined}
                className={`w-full text-left p-4 sm:p-6 flex items-center justify-between gap-4 ${disponivel ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => disponivel && toggleCapitulo(cap.id)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 min-w-0">
                  <span className="text-neutral-600 text-xs tracking-widest uppercase font-bold shrink-0">
                    {cap.numero}
                  </span>
                  <span className={`${displayFont.className} text-lg text-white`}>
                    {cap.titulo}
                  </span>
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
              </button>

              {/* Texto do capítulo — expande quando aberto */}
              {disponivel && aberto && (
                <div id={`texto-cap-${cap.id}`} className="border-t border-neutral-800/60 px-6 pb-12 pt-8">
                  {cap.epigrafe && (
                    <p className={`${readingFont.className} text-neutral-500 italic text-sm mb-10 pl-4 border-l border-amber-800/40 leading-relaxed`}>
                      {cap.epigrafe}
                    </p>
                  )}
                  <div className={`${readingFont.className} text-neutral-300 leading-[1.95] text-[1.05rem] space-y-6`}>
                    {cap.texto?.map((paragrafo, i) => (
                      <p key={i}>{paragrafo}</p>
                    ))}
                  </div>

                  {/* Download do capítulo completo */}
                  {cap.downloads?.pdf && (
                    <div className="flex flex-wrap gap-3 mt-12">
                      {cap.pdfDisponivel ? <a
                        href={cap.downloads.pdf}
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-800 text-neutral-400 hover:border-amber-700 hover:text-amber-600 text-xs font-bold tracking-widest uppercase transition-all duration-300"
                      >
                        <span>↓</span> Capítulo Completo (PDF)
                      </a> : (
                        <span className="text-neutral-500 text-xs tracking-widest uppercase" role="status">
                          Capítulo Completo (PDF) — em breve
                        </span>
                      )}
                    </div>
                  )}

                  {/* Navegação entre capítulos */}
                  <div className="flex justify-between items-start mt-16 pt-8 border-t border-neutral-800/40 gap-8">
                    <div>
                      {capPrev && capPrev.status === 'disponivel' && (
                        <button onClick={() => abrirCapitulo(capPrev.id)} className="text-left group">
                          <span className="text-xs text-neutral-600 tracking-widest uppercase block mb-1">← Anterior</span>
                          <span className={`${displayFont.className} text-sm text-neutral-400 group-hover:text-white transition-colors`}>
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
                            <span className={`${displayFont.className} text-sm text-neutral-400 group-hover:text-white transition-colors`}>
                              {capNext.titulo}
                            </span>
                          </button>
                        ) : (
                          <div>
                            <span className="text-xs text-neutral-700 tracking-widest uppercase block mb-1">Próximo →</span>
                            <span className={`${displayFont.className} text-sm text-neutral-700 block`}>{capNext.titulo}</span>
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

    </main>
  );
}
