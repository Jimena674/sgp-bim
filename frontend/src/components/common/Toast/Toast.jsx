import { Toast as BsToast, ToastContainer } from 'react-bootstrap';
import styles from './Toast.module.scss';

export function Toast({ mensaje, visible, onClose, tipo = 'ok' }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <BsToast show={visible} onClose={onClose} delay={3000} autohide className={styles.toast}>
        <BsToast.Body className={styles.cuerpo}>
          <i className={`bi ${tipo === 'error' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'} ${styles[tipo]} me-2`} />
          {mensaje}
        </BsToast.Body>
      </BsToast>
    </ToastContainer>
  );
}