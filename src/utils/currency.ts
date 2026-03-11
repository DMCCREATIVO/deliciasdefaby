/**
 * Utilidades para formateo de moneda chilena
 */

/**
 * Formatea un número como peso chileno
 * @param amount - Cantidad a formatear
 * @returns String formateado como peso chileno
 */
export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un número como peso chileno para WhatsApp (sin símbolo)
 * @param amount - Cantidad a formatear
 * @returns String formateado sin símbolo de moneda
 */
export const formatCLPForWhatsApp = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un número como peso chileno simple
 * @param amount - Cantidad a formatear
 * @returns String formateado simple
 */
export const formatPrice = (amount: number): string => {
  return `$${new Intl.NumberFormat('es-CL').format(amount)}`;
}; 