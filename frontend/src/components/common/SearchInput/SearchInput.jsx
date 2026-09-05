import styles from './SearchInput.module.scss';

export function SearchInput({ valor, onChange, placeholder = 'Buscar…' }) {
  return (
    <div className={styles.grupo}>
      <span className={styles.icono}><i className="bi bi-search" /></span>
      <input
        type="text"
        className={styles.input}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}