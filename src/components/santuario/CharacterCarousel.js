'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cinzel } from '@/config/fonts';
import { personagens } from '@/content/personagens';
import styles from './santuario.module.css';

export default function CharacterCarousel() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef(null);

  const checkScroll = () => {
    const element = carouselRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 4);
  };

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    const observer = new ResizeObserver(checkScroll);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scrollCarousel = (direction) => {
    const element = carouselRef.current;
    if (!element) return;
    const card = element.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 22 : 310;
    element.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <section id="personagens" className={styles.characters} aria-labelledby="characters-title">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}><span /> Destinos entrelaçados <span className={styles.eyebrowDetail}>02 / 03</span></p>
          <h2 id="characters-title" className={`${cinzel.className} ${styles.sectionTitle}`}>Os Peões no Tabuleiro</h2>
        </div>
        <Link href="/codex" className={styles.textLink}>Todos os registros <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.carouselShell}>
        <div ref={carouselRef} onScroll={checkScroll} tabIndex={0} aria-label="Personagens" className={styles.carousel}>
          {personagens.map((personagem, index) => (
            <article key={personagem.id} tabIndex={0} className={styles.characterCard}>
              {personagem.imagem ? (
                <Image src={personagem.imagem} alt={personagem.nome} fill sizes="(max-width: 640px) 78vw, 300px" className={styles.characterImage} />
              ) : (
                <div className={styles.characterPlaceholder} aria-hidden="true"><span>✧</span></div>
              )}
              <div className={styles.characterShade} />
              <span className={styles.characterNumber}>{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.characterContent}>
                <p className={styles.characterRole}>{personagem.titulo}</p>
                <h3 className={`${cinzel.className} ${styles.characterName}`}>{personagem.nome}</h3>
                <p className={styles.characterDescription}>{personagem.resumo}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.carouselFooter}>
          <p>Cada alma carrega uma história.</p>
          <div className={styles.carouselControls}>
            <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Anterior" disabled={!canScrollLeft}>←</button>
            <span aria-hidden="true">✧</span>
            <button type="button" onClick={() => scrollCarousel(1)} aria-label="Próximo" disabled={!canScrollRight}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
