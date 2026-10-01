'use client';

import { displayFont } from '@/config/fonts';
import styles from './santuario.module.css';

export default function AtmosphereBook() {
  function moveBook(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--book-x', `${(0.5 - y) * 12}deg`);
    event.currentTarget.style.setProperty('--book-y', `${-20 + (x - 0.5) * 22}deg`);
    event.currentTarget.style.setProperty('--light-x', `${x * 100}%`);
  }

  function resetBook(event) {
    event.currentTarget.style.removeProperty('--book-x');
    event.currentTarget.style.removeProperty('--book-y');
    event.currentTarget.style.removeProperty('--light-x');
  }

  return (
    <div className={styles.bookStage} onPointerMove={moveBook} onPointerLeave={resetBook} aria-hidden="true">
      <div className={styles.bookHalo} />
      <div className={styles.orbit} />
      <div className={styles.bookShadow} />
      <div className={`${styles.book} ${displayFont.className}`}>
        <div className={styles.bookBack} />
        <div className={styles.bookPages} />
        <div className={styles.bookSpine}><span>O Trono Vazio</span><i>✦</i><small>D. Simões</small></div>
        <div className={styles.bookCover}>
          <div className={styles.coverFrame} />
          <span className={styles.coverEdition}>As crônicas do Santuário</span>
          <div className={styles.coverEmblem}>
            <div className={styles.emblemRing} />
            <svg viewBox="0 0 120 150" fill="none" className={styles.throneGlyph}>
              <path d="M39 109V57L28 37L44 45L60 14L76 45L92 37L81 57V109M39 61H81M46 67V100M60 55V99M74 67V100M32 106H88L94 130H26L32 106ZM21 88L32 94V114M99 88L88 94V114M23 139H97" stroke="currentColor" strokeWidth="1.5" />
              <path d="M60 4V0M17 34L10 29M103 34L110 29M13 63H4M107 63H116" stroke="currentColor" />
              <path d="M60 29L65 42L60 48L55 42L60 29Z" fill="currentColor" />
            </svg>
          </div>
          <div className={styles.coverTitle}>O Trono<br /><span>Vazio</span></div>
          <span className={styles.coverRule} />
          <span className={styles.coverAuthor}>Danilo Simões</span>
          <div className={styles.coverGlint} />
        </div>
      </div>
      <div className={styles.bookCaption}><span /> A escuridão guarda histórias.</div>
    </div>
  );
}
