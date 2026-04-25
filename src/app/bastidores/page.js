'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cinzel, montserrat } from '@/lib/fonts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function Bastidores() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  useEffect(() => { setIsLoaded(true); }, []);

  const categorias = ['Todos', 'DevLog', 'Arte', 'Avisos'];

  const posts = [
    {
      id: 1,
      data: '20 de Março, 2026',
      tag: 'DevLog',
      titulo: 'A Fundação do Santuário',
      imagem: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2000&auto=format&fit=crop',
      texto: `Olá Criaturas! Quem vos escreve é Danilo Simões, autor de O Trono Vazio e também o desenvolvedor que está construindo este site linha por linha. \n\nMinha jornada na escrita começou recentemente. Após um longo período afastado dos livros, o chamado da fantasia falou mais alto. Voltei a ler e isso acendeu a faísca que eu precisava para finalmente tirar as minhas próprias histórias da cabeça e colocá-las no papel (ou melhor, na tela). \n\nEste espaço servirá como nosso diário de bordo. Aqui vou compartilhar os rascunhos, as artes conceituais, as noites em claro lutando contra o código e, claro, os segredos dos bastidores do livro. Puxem uma cadeira, a fogueira acabou de ser acesa.`,
    },
    {
      id: 2,
      data: '25 de Março, 2026',
      tag: 'Arte',
      titulo: 'O Rosto do Enigma',
      imagem: '',
      texto: `Hoje passei a madrugada testando os prompts para chegar na arte conceitual definitiva de Sereth. A bengala e o olhar precisavam transmitir o peso dos segredos que ele carrega. Em breve adicionarei a versão em alta resolução na Enciclopédia (Códex), mas já adianto: o resultado ficou além do que eu imaginava.`,
    },
  ];

  const postsFiltrados = filtroAtivo === 'Todos'
    ? posts
    : posts.filter(post => post.tag === filtroAtivo);

  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} transition-opacity duration-1000 ease-in-out pb-0
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
    `}>
      <Nav />

      {/* CABEÇALHO */}
      <section className="relative w-full pt-40 pb-20 flex flex-col items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className={`relative z-20 text-center space-y-6 px-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Diário do Autor
            <div className="h-px w-8 bg-amber-700" />
          </span>

          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest drop-shadow-lg`}>
            BASTIDORES
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltroAtivo(categoria)}
                className={`px-6 py-2 border rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
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

      {/* LINHA DO TEMPO */}
      <section className="relative max-w-6xl mx-auto px-6 mt-10 pb-24">
        <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-900/80 via-neutral-800 to-transparent -translate-x-1/2 z-0 origin-top transition-transform duration-[2000ms] delay-700 ${isLoaded ? 'scale-y-100' : 'scale-y-0'}`} />

        <div className="space-y-32 relative z-10">
          {postsFiltrados.map((post, index) => (
            <div
              key={post.id}
              className={`relative flex flex-col md:flex-row items-center md:justify-between group transition-all duration-1000
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
              `}
              style={{ transitionDelay: `${800 + index * 200}ms` }}
            >
              <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-black border-2 border-red-800 rounded-full -translate-x-1/2 mt-6 md:mt-0 z-20 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all duration-500" />

              <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16 md:order-last'}`}>
                <span className={`${cinzel.className} text-neutral-400 text-xl tracking-widest block mb-4 md:mb-0 mt-4 md:mt-0 group-hover:text-white transition-colors duration-500`}>
                  {post.data}
                </span>
              </div>

              <div className="w-full md:w-[45%] pl-10 md:pl-0 mt-4 md:mt-0">
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-1 hover:border-red-900/50 hover:bg-neutral-900/80 transition-all duration-500 rounded-sm shadow-xl hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]">

                  {post.imagem && (
                    <div className="relative w-full h-72 overflow-hidden mb-4 rounded-t-sm">
                      <Image
                        src={post.imagem}
                        alt={post.titulo}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="p-8 pt-4">
                    <span className="inline-block px-3 py-1 bg-red-950/40 text-red-500 border border-red-900/30 text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">
                      {post.tag}
                    </span>
                    <h3 className={`${cinzel.className} text-2xl text-white mb-6 group-hover:text-amber-500 transition-colors duration-500`}>
                      {post.titulo}
                    </h3>
                    <div className="text-neutral-400 font-light leading-loose text-sm space-y-4">
                      {post.texto.split('\n\n').map((paragrafo, i) => (
                        <p key={i}>{paragrafo}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
