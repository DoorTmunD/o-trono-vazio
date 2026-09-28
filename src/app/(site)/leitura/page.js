import { pageMetadata } from '@/config/site';
import Leitura from '@/components/leitura/Leitura';
import { getCapitulos } from '@/server/capitulos';
import styles from '@/components/layout/interior.module.css';

export const metadata = pageMetadata('Leitura', 'Leia os capítulos disponíveis de O Trono Vazio e acompanhe a jornada de Sereth.', '/leitura');

export default function Page() {
  return <div className={`${styles.interior} ${styles.reading}`}><Leitura capitulos={getCapitulos()} /></div>;
}
