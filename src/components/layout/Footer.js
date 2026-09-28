import NewsletterForm from '@/components/newsletter/NewsletterForm';
import Link from 'next/link';
import { cinzel, montserrat } from '@/config/fonts';
import { navLinks } from '@/config/navigation';
import { redesSociais } from '@/content/redes-sociais';
import styles from './layout-shell.module.css';

export default function Footer() {
  return (
    <footer className={`${montserrat.className} ${styles.footer}`}>
      <div className={styles.footerInner}>
        <div className={styles.footerTopline}>
          <span>O fim é apenas o começo.</span>
          <span aria-hidden="true">✧</span>
          <span>Entre a luz e as sombras</span>
        </div>

        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/santuario" className={`${cinzel.className} ${styles.footerTitle}`}>O Trono<br />Vazio<span aria-hidden="true">.</span></Link>
            <p>Uma saga de dark fantasy. Um mundo marcado pela escuridão. Histórias que permanecem depois da última página.</p>
            <span className={styles.authorCredit}>Um universo de Danilo Simões</span>
          </div>

          <div className={styles.footerExplore}>
            <h3 className={styles.footerLabel}>Explore o universo</h3>
            <nav aria-label="Navegação do rodapé" className={styles.footerNav}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  {link.label}<span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.footerNewsletter}>
            <h3 className={styles.footerLabel}>Cartas das sombras</h3>
            <p>Há histórias que ainda não foram contadas. Receba novidades e acompanhe os próximos capítulos.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} O Trono Vazio — Danilo Simões.<br className={styles.mobileBreak} /> Todos os direitos reservados.</p>
          <div className={styles.socialLinks}>
            {redesSociais.map(rede => (
              <a key={rede.nome} href={rede.href} target="_blank" rel="noopener noreferrer" aria-label={rede.nome}>
                {rede.nome}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
