function activateInputs(selector) {
    const inputs = document.querySelectorAll(selector);
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }

    const butSubmit = document.createElement('button');
    butSubmit.type = 'submit';
    butSubmit.className = 'btn btn-success me-2';
    butSubmit.innerHTML = 'Guardar Cambios';
    
    const butReload = document.createElement('a');  
    butReload.className = 'btn btn-secondary';
    butReload.innerHTML = 'Cancelar';
    butReload.href = location.href;

    document.querySelector('form div.buttons').append(butSubmit, butReload);
    document.querySelector('button.edit').remove();
}