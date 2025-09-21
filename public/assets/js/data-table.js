// js para las tablas dinamicas
const showtableCells = document.querySelectorAll('#showtable tbody td');
if (showtableCells.length > 1) {
    new DataTable('#showtable', {
        language: {
            url: 'https://cdn.datatables.net/plug-ins/2.3.2/i18n/es-ES.json'
        }
    });
}