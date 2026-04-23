'use client'; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Cinzel, Montserrat } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

export default function Codex() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('Personagens');
  const [itemSelecionado, setItemSelecionado] = useState(null); // Controla a Janela Flutuante (Modal)

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categorias = ['Personagens', 'Lore', 'Artefatos'];

  // BANCO DE DADOS: PERSONAGENS
  const personagens = [
    {
      tipo: 'Personagem',
      id: 'sereth',
      nome: 'Sereth',
      titulo: 'O Enigma',
      imagem: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', // Temporária
      idade: 'Desconhecida',
      altura: '2,03m',
      gostos: 'Silêncio, xadrez, leitura',
      desgostos: 'Perguntas indiscretas, multidões',
      historia: 'Pouco se sabe sobre o passado de Sereth antes de sua chegada. Ele carrega consigo segredos antigos e um olhar que parece ler a alma daqueles que ousam encará-lo por muito tempo.'
    },
    {
      tipo: 'Personagem',
      id: 'hana',
      nome: 'Ha-Neul (Hana)',
      titulo: 'A Lâmina',
      imagem: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Temporária
      idade: '24',
      altura: '1.65m',
      gostos: 'café, musica, tatuagem, filmes de terror',
      desgostos: 'Hesitação, traição',
      historia: 'Forjada nas sombras de um passado que ela tenta esquecer, Hana é a precisão em forma humana. Cada movimento seu é calculado, cada palavra é letal. Ela encontrou no grupo uma utilidade para suas habilidades, mas a lealdade verdadeira ainda é algo que ela guarda a sete chaves.'
    },
    {
      tipo: 'Personagem',
      id: 'maria',
      nome: 'Maria B',
      titulo: 'A Devota',
      imagem: 'https://images.unsplash.com/photo-1519068737630-e5db30e12e42?q=80&w=800&auto=format&fit=crop', // Temporária
      idade: '27',
      altura: '1.69m',
      gostos: 'leitura, terror, adrenalina, liberdade',
      desgostos: 'Solidão, esquecimento, confinamento',
      historia: 'Sua linhagem remonta aos mais antigos reis ingleses, um passado não muito colorido marca sua história, sua vida salva e guiada pelo Anjo Prateado, tem tudo para ir no rumo que ela sempre quis.'
    },
    {
      tipo: 'Personagem',
      id: 'lea',
      nome: 'Leanor (Lea)',
      titulo: 'A Sombra',
      imagem: 'https://images.unsplash.com/photo-1705405740030-2d78f67b4b9a?q=80&w=800&auto=format&fit=crop', // Temporária
      idade: '157',
      altura: '1.75m',
      gostos: 'Mar, Atletismo, Pessoas Inteligentes, Deus',
      desgostos: 'Prisão, correntes, ser posta à mostra (modelo)',
      historia: 'Leanor busca somente uma coisa, paz. A paz que ela nunca teve na vida, o trabalho de caçadora foi um meio que ela encontrou de tentar uma redenção pelo que é, e um dia enfim poder obter a paz que tanto almeja.'
    },
    {
      tipo: 'Personagem',
      id: 'tom',
      nome: 'Thomas (Tom)',
      titulo: 'O Escudo',
      imagem: 'https://images.unsplash.com/photo-1738697216532-aae28e6dffaa?q=80&w=800&auto=format&fit=crop', // Temporária
      idade: '157',
      altura: '1.89m',
      gostos: 'Cerveja, animais, esportes, dinheiro',
      desgostos: 'Maldade, violência, guerra',
      historia: 'Tom já foi ambicioso, já quis ter sucesso, mas hoje a felicidade da irmã basta para ele, o trauma de guerras vividas mudou sua forma de enxergar o mundo.'
    }
    // Adicionei apenas 2 completos para você ver o exemplo, depois você preenche os outros!
  ];

  // BANCO DE DADOS: LORE (Histórias Paralelas)
  const lores = [
    {
      tipo: 'Lore',
      id: 'a-queda',
      nome: 'A Noite das Cinzas',
      titulo: 'Evento Histórico',
      imagem: 'https://images.unsplash.com/photo-1473654729513-2070f7f3296c?q=80&w=800&auto=format&fit=crop', // Temporária
      historia: 'Antes de O Trono Vazio, houve a Noite das Cinzas. Foi quando as velhas alianças foram queimadas e a escuridão reivindicou seu espaço. Este evento moldou as regras do tabuleiro em que nossos heróis (e vilões) jogam hoje.'
    }
  ];

  // Define qual lista mostrar na tela
  const conteudoAtual = filtroAtivo === 'Personagens' ? personagens : filtroAtivo === 'Lore' ? lores : [];

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out pb-32
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
    `}>
      
      {/* 1. MENU SUPERIOR */}
      <nav className={`fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-neutral-800 transition-transform duration-1000 delay-300 ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="/santuario" className={`${cinzel.className} text-xl tracking-widest text-neutral-100 hover:text-amber-600 transition-colors`}>O TRONO VAZIO</a>
          <div className="hidden md:flex gap-8 text-xs tracking-widest text-neutral-400 font-medium uppercase">
            <a href="/santuario" className="hover:text-red-500 transition-colors">A Obra</a>
            <a href="/codex" className="text-red-600 transition-colors">O Códex</a>
            <a href="/bastidores" className="hover:text-red-500 transition-colors">Bastidores</a>
          </div>
        </div>
      </nav>

      {/* 2. CABEÇALHO & FILTROS */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center justify-center">
        <div className={`relative z-20 text-center space-y-6 px-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700"></div>
            Enciclopédia
            <div className="h-px w-8 bg-amber-700"></div>
          </span>
          
          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest drop-shadow-lg`}>
            O CÓDEX
          </h1>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {categorias.map((categoria) => (
              <button 
                key={categoria}
                onClick={() => setFiltroAtivo(categoria)}
                className={`px-8 py-3 border rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
                  ${filtroAtivo === categoria 
                    ? 'border-red-700 bg-red-900/20 text-white shadow-[0_0_15px_rgba(153,27,27,0.4)]' 
                    : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-500 hover:text-neutral-300'
                  }
                `}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GALERIA (Grades de Cartas) */}
      <section className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {conteudoAtual.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => setItemSelecionado(item)}
              className={`group relative h-96 cursor-pointer overflow-hidden border border-neutral-800 rounded-sm bg-neutral-900 transition-all duration-700 hover:-translate-y-2 hover:border-amber-600/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
              `}
              style={{ transitionDelay: `${500 + (index * 150)}ms` }}
            >
              <Image
                src={item.imagem}
                alt={item.nome}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
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

      {/* 4. JANELA FLUTUANTE (MODAL DE DETALHES) */}
      {itemSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Fundo escuro que fecha ao clicar */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setItemSelecionado(null)}
          ></div>

          {/* O Cartão do Modal */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] animate-zoom-in-95">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setItemSelecionado(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 border border-neutral-700 text-white flex items-center justify-center hover:bg-red-900 hover:border-red-500 transition-colors"
            >
              ✕
            </button>

            {/* Imagem Completa (Esquerda) */}
            <div className="relative w-full md:w-2/5 h-64 md:h-auto">
              <Image
                src={itemSelecionado.imagem}
                alt={itemSelecionado.nome}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent"></div>
            </div>

            {/* Informações (Direita) */}
            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto scrollbar-hide">
              <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-2 block">
                {itemSelecionado.titulo}
              </span>
              <h2 className={`${cinzel.className} text-4xl text-white mb-8 border-b border-neutral-800 pb-4`}>
                {itemSelecionado.nome}
              </h2>

              {/* Ficha Técnica (Apenas para Personagens) */}
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

              {/* História / Texto Livre */}
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

    </main>
  );
}