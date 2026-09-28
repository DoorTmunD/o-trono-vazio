'use client';

import Link from 'next/link';
import { cinzel, montserrat } from '@/config/fonts';

export default function ErrorPage({ reset }) {
  return (
    <main className={`${montserrat.className} min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-6 px-6 text-center`}>
      <h1 className={`${cinzel.className} text-4xl text-white`}>Não foi possível abrir esta página</h1>
      <p className="text-neutral-400">Tente novamente para continuar sua jornada.</p>
      <button onClick={reset} className="px-8 py-4 bg-red-950 border border-red-900 text-white">Tentar novamente</button>
      <Link href="/santuario" className="text-amber-600">Voltar ao Santuário</Link>
    </main>
  );
}
