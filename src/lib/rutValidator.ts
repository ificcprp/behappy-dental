/**
 * Utilidades para formateo y validación de RUT chileno (Cédula de Identidad)
 */

export function cleanRut(rut: string): string {
  return typeof rut === "string" ? rut.replace(/[^0-9kK]/g, "").toUpperCase() : "";
}

export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (!cleaned) return "";

  if (cleaned.length <= 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // Formato con puntos: 12.345.678
  let formattedBody = "";
  let count = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body[i] + formattedBody;
    count++;
    if (count === 3 && i > 0) {
      formattedBody = "." + formattedBody;
      count = 0;
    }
  }

  return `${formattedBody}-${dv}`;
}

export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^[0-9]+$/.test(body)) return false;

  // Algoritmo Módulo 11
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expectedDv = "";

  if (remainder === 11) {
    expectedDv = "0";
  } else if (remainder === 10) {
    expectedDv = "K";
  } else {
    expectedDv = remainder.toString();
  }

  return expectedDv === dv;
}
