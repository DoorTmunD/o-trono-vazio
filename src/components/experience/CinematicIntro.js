'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cinzel, montserrat } from '@/config/fonts';
import ThroneScene from './ThroneScene';
import styles from './cinematic-intro.module.css';

function subscribeMotion(callback) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverMotion = () => true;

function StillThrone() {
  return (
    <svg className={styles.still} viewBox="0 0 1000 900" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="throne-aura"><stop stopColor="#c6a671" stopOpacity=".23" /><stop offset="1" stopColor="#080b0d" stopOpacity="0" /></radialGradient>
        <linearGradient id="throne-stone"><stop stopColor="#566064" /><stop offset=".25" stopColor="#252d31" /><stop offset="1" stopColor="#0b1013" /></linearGradient>
        <linearGradient id="throne-edge"><stop stopColor="#cbb790" /><stop offset="1" stopColor="#524b3c" /></linearGradient>
      </defs>
      <ellipse cx="500" cy="340" rx="460" ry="420" fill="url(#throne-aura)" />
      <circle cx="500" cy="325" r="225" stroke="#b19769" strokeWidth="2" opacity=".5" />
      <circle cx="500" cy="325" r="233" stroke="#82755a" strokeWidth=".6" opacity=".4" />
      <path d="M310 610 690 610 750 640 250 640Z M335 580 665 580 690 610 310 610Z M360 555 640 555 665 580 335 580Z" fill="url(#throne-stone)" stroke="#525044" strokeOpacity=".5" />
      <path d="M396 470 397 236 421 205 454 216 500 170 546 216 579 205 603 236 604 470Z" fill="url(#throne-stone)" stroke="url(#throne-edge)" strokeWidth="2" />
      <path d="M430 444V258L454 246 500 205 546 246 570 258V444Z" fill="#11191d" stroke="#6a6251" strokeWidth="1" />
      <path d="M375 415 420 430 420 480 580 480 580 430 625 415 625 555 594 564 581 509 419 509 406 564 375 555Z" fill="url(#throne-stone)" stroke="#5d5849" />
      <path d="m420 480 20-28h120l20 28Z" fill="#3b4240" /><path d="M500 227V426" stroke="#aa9160" strokeOpacity=".4" />
    </svg>
  );
}

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
    <main className={`${styles.intro} ${montserrat.className}`} data-testid="cinematic-intro" data-motion={active ? 'active' : 'paused'} data-exiting={exiting}>
      <div className={styles.world}>
        <StillThrone />
        <ThroneScene paused={!active} exiting={exiting && !reduced} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.wordmark} aria-label="O Trono Vazio, de Danilo Simões">
          <svg viewBox="0 0 36 38" fill="none" aria-hidden="true"><path d="m6 15 6 5 6-12 6 12 6-5-4 14H10L6 15ZM11 33h14M18 2v2" stroke="currentColor" strokeWidth="1" /></svg>
          <span className={cinzel.className}>O Trono Vazio</span>
        </div>
        <Link href="/inicio" className={styles.skip}>Pular abertura <span aria-hidden="true">↗</span></Link>
      </header>
      <div className={styles.content}>
        <p className={styles.prelude}>Antes da primeira página, o silêncio.</p>
        <h1 className={cinzel.className}>O trono está vazio.</h1>
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
        <span className={styles.credit}>Um universo de Danilo Simões</span>
        <span className={styles.hint}>Mova o cursor. Sinta a presença.</span>
      </footer>
      <div className={styles.curtain} aria-hidden="true" />
    </main>
  );
}
