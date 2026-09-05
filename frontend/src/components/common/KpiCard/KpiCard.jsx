import styles from './KpiCard.module.scss';

const CLASE_POR_VARIANTE = { accent: styles.accent, warn: styles.warn, ok: styles.ok };

export function KpiCard({ etiqueta, valor, subtexto, variante }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{etiqueta}</div>
      <div className={`${styles.value} ${CLASE_POR_VARIANTE[variante] ?? ''}`}>{valor}</div>
      {subtexto && <div className={styles.sub}>{subtexto}</div>}
    </div>
  );
}