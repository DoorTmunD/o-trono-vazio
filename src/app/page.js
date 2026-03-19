'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Cinzel, Montserrat } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '500'] });

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      router.push('/santuario');
    }, 3000);
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center relative overflow-hidden bg-black antialiased">
      
      {/* FUNDO DA BIBLIOTECA */}
      <div 
        className={`absolute inset-0 z-0 w-full h-full transition-all ease-out
          ${!isLoaded ? 'scale-110 opacity-0 duration-0' : 'scale-100 opacity-100 duration-[15000ms]'}
          ${isEntering ? 'scale-[2.5] opacity-0 blur-md duration-[3000ms] ease-in-out' : ''}
        `}
      >
        <Image
          src="/capa-biblioteca.png"
          alt="Biblioteca do Trono Vazio"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/95 z-10"></div>
      </div>

      {/* CONTEÚDO CENTRAL */}
      <div 
        className={`z-20 flex flex-col items-center gap-16 text-center transition-all ease-out
          ${isEntering ? 'opacity-0 translate-y-[-100px] blur-md pointer-events-none duration-[1500ms]' : ''}
        `}
      >
        <div className="space-y-8 flex flex-col items-center">
          
          <h1 className={`${cinzel.className} text-6xl md:text-8xl lg:text-9xl text-white tracking-wider drop-shadow-[0_0_25px_rgba(0,0,0,1)] transition-all duration-[3000ms] ease-out
            ${isLoaded ? 'opacity-100 translate-y-0 delay-[2000ms]' : 'opacity-0 translate-y-10'}
          `}>
            O TRONO VAZIO
          </h1>
          
          <div className={`flex items-center gap-4 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-100 delay-[4000ms]' : 'opacity-0'}`}>
            <div className={`h-[1px] bg-amber-700/50 transition-all duration-[2000ms] ease-out ${isLoaded ? 'w-16 delay-[4500ms]' : 'w-0'}`}></div>
            <p className={`${montserrat.className} text-xl md:text-2xl font-light text-gray-300 tracking-[0.4em] uppercase drop-shadow-md`}>
              Os segredos aguardam
            </p>
            <div className={`h-[1px] bg-amber-700/50 transition-all duration-[2000ms] ease-out ${isLoaded ? 'w-16 delay-[4500ms]' : 'w-0'}`}></div>
          </div>
        </div>

        {/* O BOTÃO DEFINITIVO: Contraste Absoluto */}
        <button 
          onClick={handleEnter}
          className={`group relative px-10 py-5 mt-6 cursor-pointer overflow-hidden transition-all duration-[3000ms] ease-out 
            
            
            border-2 border-white/60 bg-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]
            
            
            hover:border-red-600 hover:bg-black hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] hover:duration-500
            
            ${!isLoaded ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0 delay-[6500ms] pointer-events-auto'}
          `}
        >
          {/* Fogo subindo (Visível apenas no hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-900/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
          
          {/* O TEXTO */}
          <span className={`${cinzel.className} relative z-20 text-lg md:text-2xl tracking-[0.3em] flex items-center justify-center gap-6 transition-all duration-500
            
            /* Texto Anjo: Branco puro com sombra preta para leitura perfeita */
            text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-bold
            
            /* Texto Demônio: Vermelho ardente, sombra brilhante, leve aumento de tamanho */
            group-hover:text-red-400 group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,1)] group-hover:scale-105
          `}>
            <span className="text-white/80 group-hover:text-red-600 transition-colors duration-500 text-sm">✧</span>
            ENTRAR NO SANTUÁRIO
            <span className="text-white/80 group-hover:text-red-600 transition-colors duration-500 text-sm">✧</span>
          </span>
        </button>
      </div>
      
    </main>
  );
}