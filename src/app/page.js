'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cinzel, montserrat, lora } from '@/config/fonts';
import Nav from '@/components/layout/Nav';
import CrownScene from '@/components/experience/CrownScene';
import styles from './entrance.module.css';

const paths = [
  { number: 'I', name: 'A obra', text: 'Toda história começa com um chamado.', link: '/leitura', action: 'Começar a ler' },
  { number: 'II', name: 'O universo', text: 'Há segredos além das páginas.', link: '/codex', action: 'Explorar o Códex' },
  { number: 'III', name: 'A criação', text: 'Entre rascunhos, sombras e descobertas.', link: '/bastidores', action: 'Conhecer os bastidores' },
];

export default function Home() {
  const timer = useRef(null);
  const [entering, setEntering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('otv_visitou')) router.replace('/santuario');
    } catch { /* A entrada também funciona sem armazenamento. */ }
    return () => clearTimeout(timer.current);
  }, [router]);

  function enter() {
    if (entering) return;
    try { sessionStorage.setItem('otv_visitou', '1'); } catch { /* Opcional. */ }
    setEntering(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
    timer.current = setTimeout(() => router.push('/santuario'), delay);
  }

  return (
    <div className={`${styles.entrance} ${montserrat.className} ${entering ? styles.entering : ''}`}>
      <Nav />
      <main id="conteudo">
        <section className={styles.hero} aria-labelledby="saga-title">
          <div className={styles.backdrop} aria-hidden="true">
            <Image src="/capa-biblioteca.png" alt="" fill sizes="100vw" priority className={styles.library} />
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}><span /> Uma saga de dark fantasy</p>
              <h1 id="saga-title" className={`${cinzel.className} ${styles.title}`}><span>O TRONO</span><span>VAZIO<span className={styles.titlePeriod}>.</span></span></h1>
              <p className={`${lora.className} ${styles.tagline}`}>Os segredos aguardam.</p>
              <p className={styles.description}>Entre luz e sombras, cada destino esconde uma história. Atravesse o limiar e descubra o universo de O Trono Vazio.</p>
              <div className={styles.actions}>
                <button type="button" onClick={enter} disabled={entering} className={styles.enterButton} aria-label="ENTRAR NO SANTUÁRIO">
                  <span>{entering ? 'Atravessando o limiar' : 'Entrar no Santuário'}</span><span aria-hidden="true">↗</span>
                </button>
                <Link href="/leitura" className={styles.readLink}>Ler o primeiro capítulo <span aria-hidden="true">→</span></Link>
              </div>
              <p className={styles.author}><span /> Um universo de <strong>Danilo Simões</strong></p>
            </div>
            <div className={styles.artifact}>
              <CrownScene />
              <div className={styles.artifactCaption} aria-hidden="true"><span>O poder tem um preço.</span><span>O silêncio, também.</span></div>
            </div>
          </div>
          <div className={styles.heroFoot}><span>Fantasia sombria · Um universo a descobrir</span><a href="#explorar">Explore além do limiar <span aria-hidden="true">↓</span></a></div>
        </section>
        <section id="explorar" className={styles.paths} aria-label="Explore o universo">
          {paths.map(path => <Link href={path.link} key={path.number} className={styles.path}>
            <span className={styles.pathNumber}>{path.number}</span>
            <div><h2 className={cinzel.className}>{path.name}</h2><p>{path.text}</p><span className={styles.pathAction}>{path.action} <span aria-hidden="true">↗</span></span></div>
          </Link>)}
        </section>
      </main>
      <footer className={styles.footer}><span>© {new Date().getFullYear()} O Trono Vazio</span><span>Escrito nas sombras. Feito para ser descoberto.</span><Link href="/contato">Fale com o autor ↗</Link></footer>
    </div>
  );
}
