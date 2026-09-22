// Calcula si el texto debe ser blanco o negro según el brillo relativo (WCAG)
// del color de fondo, para garantizar legibilidad.
function obtenerLuminanciaRelativa(hex) {
  const rgb = hexANumeros(hex);
  const [r, g, b] = rgb.map((valor) => {
    const canal = valor / 255;
    return canal <= 0.03928
      ? canal / 12.92
      : Math.pow((canal + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexANumeros(hex) {
  const limpio = hex.replace('#', '');
  const valor = limpio.length === 3
    ? limpio.split('').map((c) => c + c).join('')
    : limpio;
  const num = parseInt(valor, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function colorTextoContraste(bgHex) {
  if (!bgHex || !/^#[0-9A-Fa-f]{3,6}$/.test(bgHex)) return '#FFFFFF';
  const luminancia = obtenerLuminanciaRelativa(bgHex);
  // Umbral estándar WCAG: fondos claros -> texto oscuro, fondos oscuros -> texto claro
  return luminancia > 0.5 ? '#0D1117' : '#FFFFFF';
}