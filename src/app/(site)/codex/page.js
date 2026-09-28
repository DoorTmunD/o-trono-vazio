import { pageMetadata } from '@/config/site';
import Codex from '@/components/codex/Codex';
import styles from '@/components/layout/interior.module.css';

export const metadata = pageMetadata('O Códex', 'Explore os personagens, a história e os artefatos do universo de O Trono Vazio.', '/codex');

export default function Page() {
  return <div className={`${styles.interior} ${styles.codex}`}><Codex /></div>;
}
