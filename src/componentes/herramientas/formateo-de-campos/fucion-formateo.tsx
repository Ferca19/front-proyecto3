export const formatPrice = (value: number | string, currency?: "ARS" | "USD"): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  const formattedValue = numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Agregar el símbolo según la moneda seleccionada
  if (currency === "ARS") return `$ ${formattedValue}`;
  if (currency === "USD") return `US$ ${formattedValue}`;

  return formattedValue; // Si no se especifica moneda, se devuelve sin símbolo
};

export const formatPercentage = (value: number | string): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  return `${numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;
};

export const formatCantidades = (value: number | string): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  // Solo separa los miles, sin decimales
  return numberValue.toLocaleString("es-AR");
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "No tiene";

  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return "Fecha inválida";

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};

export const formatDateIso = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


export function formatearFechaLocal(fecha: Date): string {
  const fechaLocal = new Date(fecha);
  fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset());
  return fechaLocal.toISOString().split("T")[0];
}

export function getFechaLocalActual(): string {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // Ajuste para obtener fecha local real
  return hoy.toISOString().split("T")[0];
}