// utils/format.ts
export const currencyFormatter = new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: 'PAB', // o 'USD' si quieres mostrar dólares
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// utils/format.ts
export const dateFormatter = new Intl.DateTimeFormat('es-PA', {
    year: 'numeric',
    month: 'long', // '2-digit' para 01, 'short' para 'ene'
    day: '2-digit',
    weekday: 'long', // opcional: para "lunes", "martes", etc.
});

export const shortDateFormatter = new Intl.DateTimeFormat('es-PA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});
export const systemDateFormatter = {
    formatInput: (date: Date) => date.toISOString().slice(0, 10)
} 