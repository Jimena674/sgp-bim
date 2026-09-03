import { Badge } from 'react-bootstrap';
import { colorTextoContraste } from '../../utils/contraste';
import { colorDeterministico } from '../../utils/colorPorTexto';

export function RolBadge({ nombre_rol, codigo_rol, bg_color }) {
  const bg = bg_color ?? colorDeterministico(codigo_rol);
  const texto = colorTextoContraste(bg);

  return (
    <Badge style={{ backgroundColor: bg, color: texto }} pill>
      {nombre_rol}
    </Badge>
  );
}