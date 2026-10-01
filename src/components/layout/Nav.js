'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { displayFont } from '@/config/fonts';
import { navLinks } from '@/config/navigation';
import styles from './layout-shell.module.css';

function CrownMark() {
  return (
    <svg width="32" height="34" viewBox="0 0 32 34" fill="none" aria-hidden="true">
      <path d="M6 13 11 18 16 7 21 18 26 13 23 25H9L6 13Z" stroke="currentColor" strokeWidth="1" />
      <path d="M10 29H22M16 1V4M1 10 4 12M28 12 31 10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }) {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuAberto(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ativo = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav aria-label="Navegação principal" className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/santuario" className={styles.brand} aria-label="O Trono Vazio — início">
          <span className={styles.brandMark}><CrownMark /></span>
          <span className={styles.brandText}>
            <span className={`${displayFont.className} ${styles.brandTitle}`}>O Trono Vazio</span>
            <span className={styles.brandSubline}>Uma saga de dark fantasy</span>
          </span>
        </Link>

        <div className={styles.desktopLinks}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={ativo(link.href) ? 'page' : undefined}
              className={`${styles.navLink} ${ativo(link.href) ? styles.activeLink : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/leitura" className={styles.readLink}>
          Comece a ler <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className={`${styles.menuToggle} ${menuAberto ? styles.menuToggleOpen : ''}`}
          onClick={() => setMenuAberto(prev => !prev)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
        >
          <span />
          <span />
        </button>
      </div>

      {menuAberto && (
        <div className={styles.menuBackdrop} onClick={() => setMenuAberto(false)} aria-hidden="true" />
      )}

      <div
        id="menu-mobile"
        inert={!menuAberto}
        aria-hidden={!menuAberto}
        className={`${styles.mobileMenu} ${menuAberto ? styles.mobileMenuOpen : ''}`}
      >
        <div className={styles.mobileLinks}>
          <span className={styles.menuCaption}>Explore o universo</span>
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={ativo(link.href) ? 'page' : undefined}
              onClick={() => setMenuAberto(false)}
              className={`${styles.mobileLink} ${ativo(link.href) ? styles.activeLink : ''}`}
            >
              <span className={styles.linkNumber} aria-hidden="true">0{index + 1}</span>
              <span className={displayFont.className}>{link.label}</span>
              <span className={styles.linkArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/leitura" className={styles.mobileReadLink} onClick={() => setMenuAberto(false)}>
            Comece a ler <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
