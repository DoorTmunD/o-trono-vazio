'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cinzel, montserrat } from '@/config/fonts';
import { todasCategorias } from '@/content/codex';
import CodexDialog from './CodexDialog';

export default function Codex() {
  const [filtroAtivo, setFiltroAtivo] = useState('Personagens');
  const [itemSelecionado, setItemSelecionado] = useState(null);


  const conteudoAtual = todasCategorias.find(c => c.label === filtroAtivo)?.itens ?? [];

  return (
    <main className={`bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out pb-0
      opacity-100 reveal
    `}>

      {/* CABEÇALHO & FILTROS */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center justify-center">
        <div className={`relative z-20 text-center space-y-6 px-6 transition-all duration-1000 delay-500 opacity-100 translate-y-0 reveal-up`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Enciclopédia
            <div className="h-px w-8 bg-amber-700" />
          </span>

          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest drop-shadow-lg`}>
            O CÓDEX
          </h1>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {todasCategorias.map(({ label, itens }) => {
              const vazia = itens.length === 0;
              return (
                <button
                  key={label}
                  onClick={() => !vazia && setFiltroAtivo(label)}
                  aria-pressed={filtroAtivo === label}
                  disabled={vazia}
                  className={`px-8 py-3 border rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
                    ${vazia
                      ? 'border-neutral-900 text-neutral-700 cursor-not-allowed'
                      : filtroAtivo === label
                        ? 'border-red-700 bg-red-900/20 text-white shadow-[0_0_15px_rgba(153,27,27,0.4)]'
                        : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-500 hover:text-neutral-300'
                    }
                  `}
                >
                  {label}
                  {vazia && <span className="ml-1.5 font-normal normal-case tracking-normal text-neutral-700">· em breve</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {conteudoAtual.map((item, index) => (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`${item.titulo} ${item.nome}`}
              key={item.id}
              onClick={() => setItemSelecionado(item)}
              className={`group text-left relative h-96 cursor-pointer overflow-hidden border border-neutral-800 rounded-sm bg-neutral-900 transition-all duration-700 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]
                opacity-100 translate-y-0 reveal-up
              `}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              {item.imagem ? (
                <Image
                  src={item.imagem}
                  alt={item.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/10 via-neutral-900 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-48 bg-gradient-to-b from-neutral-600/10 via-neutral-700/5 to-transparent rounded-[40%] blur-3xl" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-amber-500 text-xs font-bold tracking-widest uppercase block mb-1">{item.titulo}</span>
                <h3 className={`${cinzel.className} text-2xl text-white`}>{item.nome}</h3>
              </div>
            </button>
          ))}

          {conteudoAtual.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-600 font-light tracking-widest uppercase">
              Registros não encontrados.
            </div>
          )}
        </div>
      </section>

      {itemSelecionado && (
        <CodexDialog itemSelecionado={itemSelecionado} onClose={() => setItemSelecionado(null)} />
      )}

    </main>
  );
}
