// js para las tablas dinamicas
document.addEventListener('astro:page-load', () => {
    const showtableCells = document.querySelectorAll('#showtable tbody td');
    if (showtableCells && showtableCells.length > 1) {
        new DataTable('#showtable', {
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.3.2/i18n/es-ES.json'
            }
        });
    }
})