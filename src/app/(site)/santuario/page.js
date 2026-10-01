import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '@/config/site';
import { newsletterEnabled } from '@/config/features';
import { displayFont, interfaceFont } from '@/config/fonts';
import CharacterCarousel from '@/components/santuario/CharacterCarousel';
import AtmosphereBook from '@/components/santuario/AtmosphereBook';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import styles from '@/components/santuario/santuario.module.css';

export const metadata = pageMetadata('O Santuário', 'Conheça O Trono Vazio, seus personagens e acompanhe a criação deste universo de dark fantasy.', '/santuario');

export default function SantuarioHome() {
  return (
    <main className={`${styles.sanctuary} ${interfaceFont.className}`}>
      <section className={styles.hero} aria-labelledby="tomo-title">
        <div className={styles.heroBackdrop} aria-hidden="true">
          <Image src="/capa-biblioteca.png" alt="" fill sizes="100vw" className={styles.backdropImage} priority />
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> O Santuário <span className={styles.eyebrowDetail}>Vol. I</span></p>
            <p className={styles.overline}>Um romance de dark fantasy</p>
            <h1 id="tomo-title" className={`${displayFont.className} ${styles.heroTitle}`}>O Trono<br /><em>Vazio.</em></h1>
            <p className={styles.heroDescription}>
              Há destinos que se cruzam nas sombras e segredos que resistem ao tempo. Leia o primeiro capítulo de O Trono Vazio e conheça as vozes desta história.
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
          <h2 id="launch-title" className={`${displayFont.className} ${styles.launchTitle}`}>{newsletterEnabled ? <>Seja o primeiro<br /><em>a saber.</em></> : <>A história está<br /><em>sendo escrita.</em></>}</h2>
          <p className={styles.launchDescription}>{newsletterEnabled ? 'O Trono Vazio está sendo escrito. Entre para a lista e receba a notícia no momento em que o livro estiver disponível.' : 'O livro está em criação. Leia o primeiro capítulo, conheça os personagens e acompanhe a escrita de O Trono Vazio nos bastidores.'}</p>
          <NewsletterForm variant="launch" />
          <p className={styles.launchNote}>{newsletterEnabled ? 'Das sombras, diretamente para você.' : 'Este universo continua a crescer.'}</p>
        </div>
      </section>
    </main>
  );
}
