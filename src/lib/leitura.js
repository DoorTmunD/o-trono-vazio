export const calcularTempo = (texto) => {
  if (!texto?.length) return null;
  const palavras = texto.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palavras / 200));
};
