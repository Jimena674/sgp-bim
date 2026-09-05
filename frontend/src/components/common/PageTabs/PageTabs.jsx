import styles from './PageTabs.module.scss';

export function PageTabs({ pestanas, pestanaActiva, onChange }) {
  return (
    <div className={styles.contenedor}>
      {pestanas.map((p) => (
        <div
          key={p.clave}
          className={p.clave === pestanaActiva ? `${styles.tab} ${styles.activa}` : styles.tab}
          onClick={() => onChange(p.clave)}
        >
          {p.etiqueta}
        </div>
      ))}
    </div>
  );
}