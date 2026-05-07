import { cinzel, montserrat } from '@/lib/fonts';
import { redesSociais } from '@/lib/redes-sociais';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = { title: 'Contato' };

export default function Contato() {
  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className}`}>
      <Nav />

      {/* Cabeçalho */}
      <section className="relative w-full pt-40 pb-16 flex flex-col items-center">
        <div className="text-center space-y-4 px-6">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-amber-700" />
            Encontre o Autor
            <div className="h-px w-8 bg-amber-700" />
          </span>
          <h1 className={`${cinzel.className} text-5xl md:text-7xl text-white tracking-widest`}>
            CONTATO
          </h1>
          <p className="text-neutral-500 font-light text-sm max-w-md mx-auto">
            Danilo Simões está nas sombras digitais. Escolha seu portal de entrada.
          </p>
        </div>
      </section>

      {/* Grid de redes */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {redesSociais.map((rede) => (
            <a
              key={rede.nome}
              href={rede.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-neutral-800 hover:border-amber-700/50 bg-neutral-900/30 hover:bg-neutral-900/70 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`${cinzel.className} text-xl text-white group-hover:text-amber-500 transition-colors duration-300`}>
                    {rede.nome}
                  </h3>
                  <span className="text-red-700 text-xs tracking-widest">{rede.usuario}</span>
                </div>
                <span className="text-neutral-700 group-hover:text-amber-600 text-xl transition-colors duration-300">
                  →
                </span>
              </div>
              <p className="text-neutral-500 text-sm font-light leading-relaxed">
                {rede.descricao}
              </p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
