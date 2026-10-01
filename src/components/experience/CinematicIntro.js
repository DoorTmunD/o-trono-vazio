'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { displayFont, interfaceFont } from '@/config/fonts';
import ThroneScene from './ThroneScene';
import StillThrone from './StillThrone';
import SurfaceGrain from './SurfaceGrain';
import styles from './cinematic-intro.module.css';

function subscribeMotion(callback) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverMotion = () => true;

export default function CinematicIntro() {
  const router = useRouter();
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [motionOverride, setMotionOverride] = useState(null);
  const [exiting, setExiting] = useState(false);
  const timer = useRef(null);
  const leaving = useRef(false);
  const active = motionOverride ?? !reduced;

  useEffect(() => () => clearTimeout(timer.current), []);

  function enter(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (leaving.current) return;
    leaving.current = true;
    if (reduced) { router.push('/inicio'); return; }
    setExiting(true);
    timer.current = setTimeout(() => router.push('/inicio'), 850);
  }

  return (
    <main className={`${styles.intro} ${interfaceFont.className}`} data-testid="cinematic-intro" data-motion={active ? 'active' : 'paused'} data-exiting={exiting}>
      <div className={styles.world}>
        <StillThrone />
        <ThroneScene paused={!active} exiting={exiting && !reduced} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <SurfaceGrain />
      <header className={styles.header}>
        <div className={styles.wordmark} aria-label="O Trono Vazio, de Danilo Simões">
          <span className={displayFont.className}>O Trono Vazio</span>
        </div>
        <Link href="/inicio" className={styles.skip}>Pular abertura <span aria-hidden="true">↗</span></Link>
      </header>
      <div className={styles.content}>
        <p className={styles.prelude}>Antes da primeira página, o silêncio.</p>
        <h1 className={displayFont.className}>O trono está vazio.</h1>
        <p className={styles.description}>Algumas histórias esperam por quem ousa entrar.</p>
        <Link href="/inicio" onClick={enter} className={styles.enter} aria-disabled={exiting || undefined}>
          <span>Entrar no universo</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg>
        </Link>
      </div>
      <footer className={styles.footer}>
        <button type="button" className={styles.motion} onClick={() => setMotionOverride(!active)} aria-label={active ? 'Pausar abertura' : 'Ativar abertura'} aria-pressed={!active}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{active ? <path d="M5.5 4v8m5-8v8" stroke="currentColor" strokeWidth="1.2" /> : <path d="m6 4 6 4-6 4V4Z" stroke="currentColor" strokeWidth="1.2" />}</svg>
          <span>{active ? 'Pausar movimento' : 'Ativar movimento'}</span>
        </button>
        <span className={styles.credit}>Uma obra de Danilo Simões</span>
        <span className={styles.hint}>Fantasia sombria</span>
      </footer>
      <div className={styles.curtain} aria-hidden="true" />
    </main>
  );
}
