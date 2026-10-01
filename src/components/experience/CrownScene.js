'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './crown-scene.module.css';
import { createCrownRenderer } from './crown-renderer';

function subscribeMotion(callback) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const serverMotion = () => true;

export default function CrownScene() {
  const canvas = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pose = useRef({ elapsed: 0, x: 0, y: 0 });
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [override, setOverride] = useState(null);
  const active = override ?? !reduced;

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let cleanup = () => {};
    function initialize() { cleanup(); cleanup = createCrownRenderer(element, !active, pointer, pose); }
    function contextLost(event) { event.preventDefault(); cleanup(); }
    initialize();
    element.addEventListener('webglcontextlost', contextLost);
    element.addEventListener('webglcontextrestored', initialize);
    return () => {
      cleanup();
      element.removeEventListener('webglcontextlost', contextLost);
      element.removeEventListener('webglcontextrestored', initialize);
    };
  }, [active]);

  function move(event) {
    if (!active || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 };
  }

  return (
    <div className={`crown-scene ${styles.scene}`} data-motion={active ? 'active' : 'paused'} onPointerMove={move} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}>
      <div className={styles.light} aria-hidden="true" />
      <svg className={styles.fallback} viewBox="0 0 420 270" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="crown-metal" x1="90" y1="70" x2="305" y2="235" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8d7b55" /><stop offset=".44" stopColor="#594c35" /><stop offset="1" stopColor="#29261e" />
          </linearGradient>
        </defs>
        <ellipse cx="210" cy="190" rx="125" ry="43" fill="#13130f" stroke="#74654a" strokeWidth="5" />
        <path d="M90 173 91 135C69 129 69 110 81 111 92 112 92 123 96 125 89 104 91 91 101 83 113 93 115 109 107 126 115 110 128 111 128 120 128 130 115 135 113 136L119 184M181 156 181 117C155 111 153 90 166 90 177 90 181 105 185 108 175 84 178 66 191 55 205 68 208 86 198 107 207 88 223 87 223 99 223 111 205 117 204 119L207 161M282 161 285 126C263 118 265 101 276 102 284 103 289 115 292 117 286 96 290 85 301 77 312 89 313 102 302 119 313 104 326 110 323 118 320 128 309 131 307 132L304 173" fill="url(#crown-metal)" stroke="#877452" strokeWidth="1.5" />
        <path d="M86 178C108 219 309 230 335 177L329 219C298 254 111 249 92 214Z" fill="url(#crown-metal)" stroke="#8e7a54" strokeWidth="3" />
        <path d="M91 190C137 232 290 229 331 192M94 208C144 242 281 240 329 208" stroke="#94815b" strokeWidth="1" opacity=".55" />
        <g fill="#361f1b" stroke="#9a855b" strokeWidth="2"><ellipse cx="142" cy="218" rx="6" ry="9" transform="rotate(-14 142 218)" /><ellipse cx="216" cy="228" rx="7" ry="9" /><ellipse cx="289" cy="218" rx="6" ry="9" transform="rotate(14 289 218)" /></g>
      </svg>
      <canvas ref={canvas} className={styles.canvas} data-testid="crown-canvas" aria-hidden="true" />
      <div className={styles.shadow} aria-hidden="true" />
      <div className={styles.sceneControls}>
        <button type="button" onClick={() => setOverride(!active)} aria-label={active ? 'Pausar animação' : 'Ativar animação'} aria-pressed={!active} className={styles.motionButton}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{active ? <path d="M5.5 4v8m5-8v8" stroke="currentColor" strokeWidth="1.3" /> : <path d="m6 4 6 4-6 4V4Z" stroke="currentColor" />}</svg>
          <span>{active ? 'Pausar' : 'Animar'}</span>
        </button>
      </div>
    </div>
  );
}
