import styles from './cinematic-intro.module.css';

/** A quiet silhouette remains visible before WebGL loads, or without JavaScript. */
export default function StillThrone() {
  return (
    <svg className={styles.still} viewBox="0 0 1000 900" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="throne-light"><stop stopColor="#776754" stopOpacity=".21" /><stop offset="1" stopColor="#10110f" stopOpacity="0" /></radialGradient>
        <linearGradient id="throne-wood"><stop stopColor="#60503b" /><stop offset=".28" stopColor="#322b21" /><stop offset="1" stopColor="#171813" /></linearGradient>
        <linearGradient id="throne-stone"><stop stopColor="#48473e" /><stop offset="1" stopColor="#161814" /></linearGradient>
        <linearGradient id="throne-carving"><stop stopColor="#8a7653" /><stop offset="1" stopColor="#3c3528" /></linearGradient>
      </defs>
      <ellipse cx="445" cy="355" rx="410" ry="380" fill="url(#throne-light)" />
      <path d="M120 120h42v470h-42z M825 120h35v470h-35z" fill="#302f27" opacity=".2" />
      <path d="m340 560 290 0 65 38-425 0z" fill="url(#throne-stone)" stroke="#555344" strokeOpacity=".35" />
      <path d="M270 598h425v23H270z" fill="#20231e" />
      <path d="m310 621 345 0 63 35H255z" fill="url(#throne-stone)" stroke="#555344" strokeOpacity=".2" />
      <path d="M255 656h463v22H255z" fill="#181b18" />
      <path d="M400 462V270c0-52 38-83 95-102 57 19 95 50 95 102v192z" fill="url(#throne-wood)" stroke="url(#throne-carving)" strokeWidth="5" />
      <path d="M423 432V278c0-38 26-63 72-82 46 19 72 44 72 82v154z" fill="#24251d" stroke="#5e513c" strokeWidth="3" />
      <path d="M443 418V295q0-24 20-37 20 13 20 37v123z M507 418V295q0-24 20-37 20 13 20 37v123z" fill="url(#throne-wood)" stroke="#65553c" strokeOpacity=".5" strokeWidth="2" />
      <path d="M393 438h207v30H393z" fill="url(#throne-wood)" stroke="#64563f" strokeOpacity=".55" />
      <path d="m393 438 27-35h150l30 35z" fill="#353328" />
      <path d="M382 369h23v191h-23z M585 369h23v191h-23z" fill="url(#throne-wood)" stroke="#63553f" strokeOpacity=".3" />
      <path d="m375 363 11-10 43 11v17h-54z M578 364l29-11 10 10v18h-39z" fill="url(#throne-wood)" stroke="#7e6a49" strokeOpacity=".5" strokeWidth="2" />
      <path d="M401 482h187v16H401z M373 548h42v13h-42z M578 548h39v13h-39z" fill="url(#throne-wood)" />
      <path d="M495 224v193 M429 278v131 M562 278v131" stroke="#887146" strokeOpacity=".12" />
    </svg>
  );
}
