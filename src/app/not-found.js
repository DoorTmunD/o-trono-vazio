import Link from 'next/link';
import { Cinzel, Montserrat } from 'next/font/google';
import Nav from '@/components/Nav';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400'] });

export const metadata = { title: 'Página não encontrada' };

export default function NotFound() {
  return (
    <main className={`min-h-screen bg-neutral-950 text-neutral-200 ${montserrat.className} flex flex-col`}>
      <Nav />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24">
        <div className="space-y-8 max-w-lg">

          <div className="text-red-900/30 text-[140px] leading-none select-none font-bold">
            ✦
          </div>

          <div className="space-y-3">
            <span className="text-amber-700 text-xs tracking-[0.4em] uppercase font-bold">Erro 404</span>
            <h1 className={`${cinzel.className} text-5xl md:text-6xl text-white tracking-widest leading-tight`}>
              Você se perdeu<br />nas sombras
            </h1>
          </div>

          <p className="text-neutral-500 font-light leading-relaxed text-lg">
            Esta rota não foi mapeada pelos escribas do Santuário.<br />
            A escuridão além daqui não tem nome.
          </p>

          <div className="h-px w-24 bg-amber-800/30 mx-auto" />

          <Link
            href="/santuario"
            className="inline-block px-8 py-4 bg-red-950 hover:bg-red-900 text-white border border-red-900 hover:border-red-700 text-sm font-bold tracking-widest uppercase transition-all"
          >
            Voltar ao Santuário
          </Link>
        </div>
      </div>
    </main>
  );
}
