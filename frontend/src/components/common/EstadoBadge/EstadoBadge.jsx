import { Badge } from 'react-bootstrap';
import styles from './EstadoBadge.module.scss';

const ESTILO_POR_CODIGO = {
  ACT: 'activo',
  INA: 'inactivo',
  PROC: 'proceso',
  FIN: 'finalizado',
  RETR: 'retrasado',
  SUSP: 'suspendido',
  PEND: 'pendiente',
  CANC: 'cancelado',
  ANAL: 'analisis',
  APR: 'aprobado',
  RECH: 'rechazado',
  CERR: 'cerrado',
};

export function EstadoBadge({ codigo_estado, texto }) {
  const clave = ESTILO_POR_CODIGO[codigo_estado] ?? 'default';
  return (
    <Badge className={`${styles.badge} ${styles[clave]}`} pill>
      {texto}
    </Badge>
  );
}