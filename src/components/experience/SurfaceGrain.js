import styles from './surface-grain.module.css';

/** One static, tiled texture. No animation, canvas work or interference with input. */
export default function SurfaceGrain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
