import { pageMetadata } from '@/config/site';
import { cinzel, montserrat } from '@/config/fonts';
import { redesSociais } from '@/content/redes-sociais';
import styles from '@/components/layout/interior.module.css';

export const metadata = pageMetadata('Contato', 'Encontre Danilo Simões, autor de O Trono Vazio, nas redes sociais.', '/contato');

export default function Contato() {
  return (
    <div className={`${styles.interior} ${styles.contact}`}>
      <main className={montserrat.className}>
        <section className={styles.contactHeader}>
          <div className={styles.contactIntro}>
            <span className={styles.kicker}><i /> Encontre o autor</span>
            <h1 className={cinzel.className}>Contato</h1>
            <p>Danilo Simões está nas sombras digitais.<br />Escolha seu portal de entrada.</p>
          </div>
          <div className={styles.contactSeal} aria-hidden="true"><span className={cinzel.className}>D<span>✧</span>S</span></div>
        </section>
        <section className={styles.contactLinks} aria-label="Redes sociais do autor">
          <div className={styles.contactGrid}>
            {redesSociais.map((rede, index) => (
              <a key={rede.nome} href={rede.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                <div className={styles.contactCardTop}><span>0{index + 1} / Portal</span><span aria-hidden="true">↗</span></div>
                <h2 className={cinzel.className}>{rede.nome}</h2>
                <span className={styles.contactHandle}>{rede.usuario}</span>
                <p>{rede.descricao}</p>
                <span className={styles.contactVisit}>Abrir portal <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
          <p className={styles.contactSignoff}><span aria-hidden="true">✧</span> Toda história começa com uma conexão.</p>
        </section>
      </main>
    </div>
  );
}
