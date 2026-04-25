'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cinzel, montserrat } from '@/lib/fonts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function Codex() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('Personagens');
  const [itemSelecionado, setItemSelecionado] = useState(null);

  useEffect(() => { setIsLoaded(true); }, []);

  // Fecha modal com Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setItemSelecionado(null);
    };
    if (itemSelecionado) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [itemSelecionado]);

  const artefatos = [];

  const personagens = [
    {
      tipo: 'Personagem', id: 'sereth',
      nome: 'Sereth', titulo: 'O Enigma',
      imagem: '/Sereth.jpg',
      idade: 'Desconhecida', altura: '2,03m',
      gostos: 'Silêncio, xadrez, leitura',
      desgostos: 'Perguntas indiscretas, multidões',
      historia: 'Pouco se sabe sobre o passado de Sereth antes de sua chegada. Ele carrega consigo segredos antigos e um olhar que parece ler a alma daqueles que ousam encará-lo por muito tempo.',
    },
    {
      tipo: 'Personagem', id: 'hana',
      nome: 'Ha-Neul (Hana)', titulo: 'A Lâmina',
      imagem: '/Hana.jpg',
      idade: '24', altura: '1.65m',
      gostos: 'café, musica, tatuagem, filmes de terror',
      desgostos: 'Hesitação, traição',
      historia: 'Forjada nas sombras de um passado que ela tenta esquecer, Hana é a precisão em forma humana. Cada movimento seu é calculado, cada palavra é letal. Ela encontrou no grupo uma utilidade para suas habilidades, mas a lealdade verdadeira ainda é algo que ela guarda a sete chaves.',
    },
    {
      tipo: 'Personagem', id: 'maria',
      nome: 'Maria B', titulo: 'A Devota',
      imagem: 'https://images.unsplash.com/photo-1519068737630-e5db30e12e42?q=80&w=800&auto=format&fit=crop',
      idade: '27', altura: '1.69m',
      gostos: 'leitura, terror, adrenalina, liberdade',
      desgostos: 'Solidão, esquecimento, confinamento',
      historia: 'Sua linhagem remonta aos mais antigos reis ingleses, um passado não muito colorido marca sua história, sua vida salva e guiada pelo Anjo Prateado, tem tudo para ir no rumo que ela sempre quis.',
    },
    {
      tipo: 'Personagem', id: 'lea',
      nome: 'Leanor (Lea)', titulo: 'A Sombra',
      imagem: '/Lea.JPG',
      idade: '157', altura: '1.75m',
      gostos: 'Mar, Atletismo, Pessoas Inteligentes, Deus',
      desgostos: 'Prisão, correntes, ser posta à mostra (modelo)',
      historia: 'Leanor busca somente uma coisa, paz. A paz que ela nunca teve na vida, o trabalho de caçadora foi um meio que ela encontrou de tentar uma redenção pelo que é, e um dia enfim poder obter a paz que tanto almeja.',
    },
    {
      tipo: 'Personagem', id: 'tom',
      nome: 'Thomas (Tom)', titulo: 'O Escudo',
      imagem: '/Tom.JPG',
      idade: '157', altura: '1.89m',
      gostos: 'Cerveja, animais, esportes, dinheiro',
      desgostos: 'Maldade, violência, guerra',
      historia: 'Tom já foi ambicioso, já quis ter sucesso, mas hoje a felicidade da irmã basta para ele, o trauma de guerras vividas mudou sua forma de enxergar o mundo.',
    },
  ];

  const lores = [
    {
      tipo: 'Lore', id: 'a-queda',
      nome: 'A Noite das Cinzas', titulo: 'Evento Histórico',
      imagem: 'https://images.unsplash.com/photo-1473654729513-2070f7f3296c?q=80&w=800&auto=format&fit=crop',
      historia: 'Antes de O Trono Vazio, houve a Noite das Cinzas. Foi quando as velhas alianças foram queimadas e a escuridão reivindicou seu espaço. Este evento moldou as regras do tabuleiro em que nossos heróis (e vilões) jogam hoje.',
    },
  ];

  const todasCategorias = [
    { label: 'Personagens', itens: personagens },
    { label: 'Lore', itens: lores },
    { label: 'Artefatos', itens: artefatos },
  ];
  const categorias = todasCategorias.filter(c => c.itens.length > 0);
  const conteudoAtual = todasCategorias.find(c => c.label === filtroAtivo)?.itens ?? [];

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out pb-0
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
    `}>
      <Nav />

      {/* CABEÇALHO & FILTROS */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center justify-center">
        <div className={`relative z-20 text-center space-y-6 px-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Enciclopédia
            <div className="h-px w-8 bg-amber-700" />
          </span>

          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest drop-shadow-lg`}>
            O CÓDEX
          </h1>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {categorias.map(({ label }) => (
              <button
                key={label}
                onClick={() => setFiltroAtivo(label)}
                className={`px-8 py-3 border rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
                  ${filtroAtivo === label
                    ? 'border-red-700 bg-red-900/20 text-white shadow-[0_0_15px_rgba(153,27,27,0.4)]'
                    : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-500 hover:text-neutral-300'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {conteudoAtual.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setItemSelecionado(item)}
              className={`group relative h-96 cursor-pointer overflow-hidden border border-neutral-800 rounded-sm bg-neutral-900 transition-all duration-700 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
              `}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              <Image
                src={item.imagem}
                alt={item.nome}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-amber-500 text-xs font-bold tracking-widest uppercase block mb-1">{item.titulo}</span>
                <h3 className={`${cinzel.className} text-2xl text-white`}>{item.nome}</h3>
              </div>
            </div>
          ))}

          {conteudoAtual.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-600 font-light tracking-widest uppercase">
              Registros não encontrados.
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE DETALHES */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setItemSelecionado(null)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] animate-zoom-in-95">

            <button
              onClick={() => setItemSelecionado(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 border border-neutral-700 text-white flex items-center justify-center hover:bg-red-900 hover:border-red-500 transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div className="relative w-full md:w-2/5 h-64 md:h-auto">
              <Image src={itemSelecionado.imagem} alt={itemSelecionado.nome} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent" />
            </div>

            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto scrollbar-hide">
              <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                {itemSelecionado.titulo}
              </span>
              <h2 className={`${cinzel.className} text-4xl text-white mb-8 border-b border-neutral-800 pb-4`}>
                {itemSelecionado.nome}
              </h2>

              {itemSelecionado.tipo === 'Personagem' && (
                <div className="grid grid-cols-2 gap-6 mb-8 bg-neutral-900/50 p-6 border border-neutral-800/50">
                  <div>
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Idade</span>
                    <span className="text-white text-sm">{itemSelecionado.idade}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Altura</span>
                    <span className="text-white text-sm">{itemSelecionado.altura}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Gostos</span>
                    <span className="text-white text-sm">{itemSelecionado.gostos}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-1">Desgostos</span>
                    <span className="text-red-400 text-sm">{itemSelecionado.desgostos}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-neutral-500 text-xs uppercase tracking-widest block mb-4 border-l-2 border-red-800 pl-3">
                  Registros Históricos
                </span>
                <p className="text-neutral-300 font-light leading-relaxed text-sm">
                  {itemSelecionado.historia}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
