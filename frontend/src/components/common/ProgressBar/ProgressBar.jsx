import styles from './ProgressBar.module.scss';

const CLASE_POR_VARIANTE = { warn: styles.warn, ok: styles.ok };

export function ProgressBar({ valor, variante }) {
  const porcentaje = Math.min(Math.max(Number(valor) || 0, 0), 100);
  return (
    <div className={styles.pista}>
      <div className={`${styles.barra} ${CLASE_POR_VARIANTE[variante] ?? ''}`} style={{ width: `${porcentaje}%` }} />
    </div>
  );
}