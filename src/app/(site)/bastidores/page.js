import { pageMetadata } from '@/config/site';
import Bastidores from '@/components/bastidores/Bastidores';
import styles from '@/components/layout/interior.module.css';

export const metadata = pageMetadata('Bastidores', 'Acompanhe o diário do autor Danilo Simões, artes e novidades de O Trono Vazio.', '/bastidores');

export default function Page() {
  return <div className={`${styles.interior} ${styles.journal}`}><Bastidores /></div>;
}
