// Calcula si un color de fondo requiere texto claro u oscuro,
// según la fórmula de luminancia relativa (WCAG 2.1)
export function colorTextoContraste(hexBg) {
  const hex = hexBg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // canal a espacio lineal (no es solo dividir entre 255)
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const luminancia = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

  // umbral estándar: fondo "claro" (luminancia alta) -> texto oscuro, y viceversa
  return luminancia > 0.5 ? '#0B0F18' : '#FFFFFF';
}