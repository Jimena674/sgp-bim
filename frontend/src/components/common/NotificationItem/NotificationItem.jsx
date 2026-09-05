import styles from './NotificationItem.module.scss';

const CONFIG_POR_TIPO = {
  error: { icono: 'bi-exclamation-triangle', clase: 'error' },
  warn:  { icono: 'bi-alarm',                clase: 'warn' },
  info:  { icono: 'bi-arrow-repeat',         clase: 'info' },
  ok:    { icono: 'bi-check-circle',         clase: 'ok' },
};

export function NotificationItem({ tipo = 'info', texto, meta, icono }) {
  const config = CONFIG_POR_TIPO[tipo] ?? CONFIG_POR_TIPO.info;
  return (
    <div className={styles.item}>
      <div className={`${styles.icono} ${styles[config.clase]}`}>
        <i className={`bi ${icono ?? config.icono}`} />
      </div>
      <div>
        <div className={styles.texto}>{texto}</div>
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
    </div>
  );
}