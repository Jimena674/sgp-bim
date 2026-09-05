import styles from './Pagination.module.scss';

export function Pagination({ pagina, total_paginas, total, onChange }) {
  const puedeAnterior = pagina > 1;
  const puedeSiguiente = pagina < total_paginas;

  return (
    <div className={styles.contenedor}>
      <span className={styles.info}>Página {pagina} de {total_paginas} · {total} registros</span>
      <div className={styles.controles}>
        <button type="button" className={styles.boton} disabled={!puedeAnterior} onClick={() => onChange(pagina - 1)}>‹</button>
        <span className={styles.actual}>{pagina}</span>
        <button type="button" className={styles.boton} disabled={!puedeSiguiente} onClick={() => onChange(pagina + 1)}>›</button>
      </div>
    </div>
  );
}