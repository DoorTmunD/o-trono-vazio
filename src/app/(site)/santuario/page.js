import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '@/config/site';
import { cinzel, montserrat } from '@/config/fonts';
import CharacterCarousel from '@/components/santuario/CharacterCarousel';
import AtmosphereBook from '@/components/santuario/AtmosphereBook';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import styles from '@/components/santuario/santuario.module.css';

export const metadata = pageMetadata('O Santuário', 'Conheça O Trono Vazio, seus personagens e receba novidades sobre o lançamento.', '/santuario');

export default function SantuarioHome() {
  return (
    <main className={`${styles.sanctuary} ${montserrat.className}`}>
      <section className={styles.hero} aria-labelledby="tomo-title">
        <div className={styles.heroBackdrop} aria-hidden="true">
          <Image src="/capa-biblioteca.png" alt="" fill sizes="100vw" className={styles.backdropImage} priority />
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> O Santuário <span className={styles.eyebrowDetail}>Vol. I</span></p>
            <p className={styles.overline}>Inicie a jornada</p>
            <h1 id="tomo-title" className={`${cinzel.className} ${styles.heroTitle}`}>O Tomo<br /><em>Principal.</em></h1>
            <p className={styles.heroDescription}>
              Mergulhe nas crônicas esquecidas. Acompanhe a jornada onde luz e sombras colidem, e descubra os segredos que aguardam nas entrelinhas da obra completa.
            </p>
            <div className={styles.heroActions}>
              <Link href="/leitura" className={styles.primaryAction}>Ler agora <span aria-hidden="true">↗</span></Link>
              <Link href="/codex" className={styles.secondaryAction}>Explorar o Códex <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.heroFootnote}><span aria-hidden="true">✧</span><span>Uma história de luz, sombras<br />e tudo o que existe entre elas.</span></div>
          </div>
          <AtmosphereBook />
        </div>
        <div className={styles.heroBottom}>
          <span>O Trono Vazio — Danilo Simões</span>
          <a href="#personagens">Conheça os personagens <span aria-hidden="true">↓</span></a>
          <span className={styles.chapterIndex}>01 / 03</span>
        </div>
      </section>

      <CharacterCarousel />

      <section className={styles.launch} aria-labelledby="launch-title">
        <div className={styles.launchOrnament} aria-hidden="true"><span>✧</span></div>
        <div className={styles.launchInner}>
          <p className={styles.eyebrow}>O próximo capítulo</p>
          <h2 id="launch-title" className={`${cinzel.className} ${styles.launchTitle}`}>Seja o primeiro<br /><em>a saber.</em></h2>
          <p className={styles.launchDescription}>O Trono Vazio está sendo forjado. Entre para a lista e receba a notícia no momento em que o livro estiver disponível.</p>
          <NewsletterForm variant="launch" />
          <p className={styles.launchNote}>Das sombras, diretamente para você.</p>
        </div>
      </section>
    </main>
  );
}
