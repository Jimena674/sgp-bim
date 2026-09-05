import styles from './IconButton.module.scss';

export function IconButton({ icono, onClick, titulo, disabled = false }) {
  return (
    <button type="button" className={styles.boton} onClick={onClick} title={titulo} disabled={disabled} aria-label={titulo}>
      <i className={`bi ${icono}`} />
    </button>
  );
}