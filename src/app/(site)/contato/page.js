import Link from 'next/link';
import { pageMetadata } from '@/config/site';
import { displayFont, interfaceFont } from '@/config/fonts';
import { redesSociaisPublicadas } from '@/content/redes-sociais';
import styles from '@/components/layout/interior.module.css';

export const metadata = pageMetadata('Contato', 'Canais oficiais de Danilo Simões, autor de O Trono Vazio.', '/contato');

export default function Contato() {
  return (
    <div className={`${styles.interior} ${styles.contact}`}>
      <main className={interfaceFont.className}>
        <section className={styles.contactHeader}>
          <div className={styles.contactIntro}>
            <span className={styles.kicker}><i /> Encontre o autor</span>
            <h1 className={displayFont.className}>Contato</h1>
            <p>{redesSociaisPublicadas.length ? <>Danilo Simões está nas sombras digitais.<br />Escolha seu portal de entrada.</> : <>Os caminhos até o autor estão sendo preparados.<br />Em breve, novos portais se abrirão.</>}</p>
          </div>
          <div className={styles.contactSeal} aria-hidden="true"><span className={displayFont.className}>D<span>✧</span>S</span></div>
        </section>
        <section className={styles.contactLinks} aria-label="Redes sociais do autor">
          <div className={styles.contactGrid}>
            {redesSociaisPublicadas.map((rede, index) => (
              <a key={rede.nome} href={rede.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                <div className={styles.contactCardTop}><span>0{index + 1} / Portal</span><span aria-hidden="true">↗</span></div>
                <h2 className={displayFont.className}>{rede.nome}</h2>
                <span className={styles.contactHandle}>{rede.usuario}</span>
                <p>{rede.descricao}</p>
                <span className={styles.contactVisit}>Abrir portal <span aria-hidden="true">→</span></span>
              </a>
            ))}
            {redesSociaisPublicadas.length === 0 && (
              <div className={`${styles.contactCard} col-span-full`}>
                <div className={styles.contactCardTop}><span>Beta / Em construção</span><span aria-hidden="true">✧</span></div>
                <h2 className={displayFont.className}>A conexão começa aqui.</h2>
                <p>Os canais oficiais serão divulgados em breve. Enquanto isso, descubra os registros da criação de O Trono Vazio.</p>
                <Link href="/bastidores" className={styles.contactVisit}>Explorar os bastidores <span aria-hidden="true">→</span></Link>
              </div>
            )}
          </div>
          <p className={styles.contactSignoff}><span aria-hidden="true">✧</span> Toda história começa com uma conexão.</p>
        </section>
      </main>
    </div>
  );
}
