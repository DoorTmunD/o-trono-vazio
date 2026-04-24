import { Cinzel, Montserrat } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const cinzel     = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = { title: 'Contato' };

// ============================================================
// REDES SOCIAIS — Preencha com seus dados reais
//
// Para cada rede:
//   plataforma → nome exibido no card
//   usuario    → seu @ ou nome de usuário
//   href       → URL completa do seu perfil
//   descricao  → texto curto descrevendo o que você posta lá
//
// Para adicionar uma nova rede, copie um bloco { } e cole abaixo.
// ============================================================
const contatos = [
  {
    plataforma: 'Instagram',
    usuario: '@seu_usuario',                          // ← Substitua
    href: 'https://instagram.com/seu_usuario',         // ← Substitua
    descricao: 'Bastidores, artes conceituais e novidades do livro em tempo real.',
  },
  {
    plataforma: 'TikTok',
    usuario: '@seu_usuario',                          // ← Substitua
    href: 'https://tiktok.com/@seu_usuario',           // ← Substitua
    descricao: 'Vídeos sobre o processo criativo e o universo de O Trono Vazio.',
  },
  {
    plataforma: 'Twitter / X',
    usuario: '@seu_usuario',                          // ← Substitua
    href: 'https://x.com/seu_usuario',                 // ← Substitua
    descricao: 'Pensamentos, atualizações e interação direta com os leitores.',
  },
  {
    plataforma: 'Goodreads',
    usuario: 'Danilo Simões',                         // ← Substitua
    href: 'https://goodreads.com/user/show/seu_id',    // ← Substitua
    descricao: 'Adicione O Trono Vazio à sua lista de leituras e acompanhe o lançamento.',
  },
  // Adicione mais redes aqui:
  // {
  //   plataforma: 'YouTube',
  //   usuario: '@seu_canal',
  //   href: 'https://youtube.com/@seu_canal',
  //   descricao: 'Descrição do canal.',
  // },
];

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
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contatos.map((contato) => (
            <a
              key={contato.plataforma}
              href={contato.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-neutral-800 hover:border-amber-700/50 bg-neutral-900/30 hover:bg-neutral-900/70 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`${cinzel.className} text-xl text-white group-hover:text-amber-500 transition-colors duration-300`}>
                    {contato.plataforma}
                  </h3>
                  <span className="text-red-700 text-xs tracking-widest">{contato.usuario}</span>
                </div>
                <span className="text-neutral-700 group-hover:text-amber-600 text-xl transition-colors duration-300">
                  →
                </span>
              </div>
              <p className="text-neutral-500 text-sm font-light leading-relaxed">
                {contato.descricao}
              </p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
