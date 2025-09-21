const dialog = document.querySelector('dialog.delete');
function openDialog(route, id) {
    dialog.showModal();
    document.querySelector('dialog.delete form').action = route + id;
    document.querySelector('dialog.delete form input[name="id"]').value = id;
}
function closeDialog(element, event) {
    event.preventDefault()
    dialog.close();
}