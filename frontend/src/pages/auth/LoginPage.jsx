import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.scss';

function LoginPage() {
  const [numero_id, setNumeroId] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(numero_id, password);
      navigate('/usuarios', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'No fue posible iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        <div className={styles.encabezado}>
          <div className={styles.icono}><i className="bi bi-layers" /></div>
          <div className={styles.titulo}>SGP</div>
          <div className={styles.subtitulo}>Sistema de Gestión de Proyectos</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Número de identificación</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person" /></span>
              <input
                type="text"
                className="form-control"
                value={numero_id}
                onChange={(e) => setNumeroId(e.target.value)}
                placeholder="Ej. 12345678"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock" /></span>
              <input
                type={verPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="input-group-text" onClick={() => setVerPassword((v) => !v)}>
                <i className={`bi ${verPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
            {cargando ? 'Ingresando…' : (<><i className="bi bi-box-arrow-in-right me-2" />Ingresar</>)}
          </button>
        </form>

        <div className={styles.nota}>
          Después de 3 intentos fallidos la cuenta quedará inactiva.<br />
          La sesión expira tras 20 minutos de inactividad.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;