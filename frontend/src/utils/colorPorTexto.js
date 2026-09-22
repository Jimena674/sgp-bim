// Genera un color hexadecimal determinístico a partir de un texto (ej. codigo_rol),
// para roles que no tienen bg_color asignado explícitamente en la BD.
export function colorDeterministico(texto) {
  if (!texto) return '#8B93A1'; // color neutro por defecto

  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  const tono = Math.abs(hash) % 360;
  return hslAHex(tono, 55, 40);
}

// Convierte HSL a hex para que el resultado sea compatible con
// colorTextoContraste, que solo acepta formato hexadecimal.
function hslAHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120)  { r = x; g = c; b = 0; }
  else if (h < 180)  { r = 0; g = c; b = x; }
  else if (h < 240)  { r = 0; g = x; b = c; }
  else if (h < 300)  { r = x; g = 0; b = c; }
  else               { r = c; g = 0; b = x; }

  const aHex = (valor) => {
    const entero = Math.round((valor + m) * 255);
    return entero.toString(16).padStart(2, '0');
  };

  return `#${aHex(r)}${aHex(g)}${aHex(b)}`;
}