import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Topbar.module.scss';

function Topbar({ titulo, breadcrumb }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.titulo}>{titulo}</div>
        {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
      </div>

      <div className={styles.acciones}>
        <button type="button" className={styles.iconBtn} title="Notificaciones">
          <i className="bi bi-bell" />
          <span className={styles.puntoAlerta} />
        </button>
        <button type="button" className={styles.iconBtn} title="Ayuda">
          <i className="bi bi-question-circle" />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;