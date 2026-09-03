import { Badge } from 'react-bootstrap';
import styles from './EstadoBadge.module.scss';

const CLASE_POR_ESTADO = {
  ACT: styles.estadoActivo,
  INA: styles.estadoInactivo,
};

export function EstadoBadge({ codigo_estado, texto }) {
  return (
    <Badge className={CLASE_POR_ESTADO[codigo_estado]} pill>
      {texto}
    </Badge>
  );
}
