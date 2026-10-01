'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { displayFont, interfaceFont, readingFont } from '@/config/fonts';
import Nav from '@/components/layout/Nav';
import CrownScene from '@/components/experience/CrownScene';
import SurfaceGrain from '@/components/experience/SurfaceGrain';
import styles from '../entrance.module.css';

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
    return () => clearTimeout(timer.current);
  }, []);

  function enter() {
    if (entering) return;
    setEntering(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
    timer.current = setTimeout(() => router.push('/santuario'), delay);
  }

  return (
    <div className={`${styles.entrance} ${interfaceFont.className} ${entering ? styles.entering : ''}`}>
      <Nav />
      <main id="conteudo">
        <section className={styles.hero} aria-labelledby="saga-title">
          <div className={styles.backdrop} aria-hidden="true">
            <Image src="/capa-biblioteca.png" alt="" fill sizes="100vw" priority className={styles.library} />
          </div>
          <SurfaceGrain />
          <div className={styles.heroGrid}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}><span /> Uma saga de dark fantasy</p>
              <h1 id="saga-title" className={`${displayFont.className} ${styles.title}`}><span>O Trono</span><span>Vazio</span></h1>
              <p className={`${readingFont.className} ${styles.tagline}`}>Os segredos aguardam.</p>
              <p className={styles.description}>Entre luz e sombras, cada destino esconde uma história. Conheça a obra, seus personagens e as palavras que dão vida a este mundo.</p>
              <div className={styles.actions}>
                <button type="button" onClick={enter} disabled={entering} className={styles.enterButton} aria-label="ENTRAR NO SANTUÁRIO">
                  <span>{entering ? 'Atravessando o limiar' : 'Entrar no Santuário'}</span><span aria-hidden="true">↗</span>
                </button>
                <Link href="/leitura" className={styles.readLink}>Ler o primeiro capítulo <span aria-hidden="true">→</span></Link>
              </div>
              <p className={styles.author}><span /> Escrito por <strong>Danilo Simões</strong></p>
            </div>
            <div className={styles.artifact}>
              <CrownScene />
              <div className={`${readingFont.className} ${styles.artifactCaption}`} aria-hidden="true"><span>O poder tem um preço.</span><span>O silêncio, também.</span></div>
            </div>
          </div>
          <div className={styles.heroFoot}><span>Uma história de poder, silêncio e segredos</span><a href="#explorar">Entre as páginas <span aria-hidden="true">↓</span></a></div>
        </section>
        <section id="explorar" className={styles.paths} aria-label="Explore o universo">
          {paths.map(path => <Link href={path.link} key={path.number} className={styles.path}>
            <span className={styles.pathNumber}>{path.number}</span>
            <div><h2 className={displayFont.className}>{path.name}</h2><p>{path.text}</p><span className={styles.pathAction}>{path.action} <span aria-hidden="true">↗</span></span></div>
          </Link>)}
        </section>
      </main>
      <footer className={styles.footer}><span>© {new Date().getFullYear()} O Trono Vazio</span><span>Escrito nas sombras. Feito para ser descoberto.</span><Link href="/contato">Fale com o autor ↗</Link></footer>
    </div>
  );
}
