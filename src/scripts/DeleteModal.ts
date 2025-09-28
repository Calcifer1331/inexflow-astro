document.addEventListener("astro:page-load", () => {
    const exampleModal = document.getElementById("exampleModal");

    if (!exampleModal) return;

    const modalDeleteForm: HTMLFormElement | null =
        exampleModal.querySelector(
            ".modal-body form#form-delete-element",
        );

    if (!modalDeleteForm) return;

    const inputId: HTMLInputElement | null =
        modalDeleteForm.querySelector("input[name='id']");

    const modalMessage = exampleModal.querySelector(
        ".modal-body .modal-message",
    );

    exampleModal.addEventListener("show.bs.modal", (event) => {
        if (!modalMessage || !inputId) return;
        const button = event.relatedTarget;
        const id = button.getAttribute("data-bs-id");
        const name = button.getAttribute("data-bs-name");

        modalMessage.textContent = `¿Estas seguro de que deseas eliminar ${name}?`;

        inputId.value = id;
    });
    exampleModal.addEventListener("hide.bs.modal", () => {
        if (!modalMessage || !inputId) return;
        modalMessage.textContent = "";
        inputId.value = "";
    });
});