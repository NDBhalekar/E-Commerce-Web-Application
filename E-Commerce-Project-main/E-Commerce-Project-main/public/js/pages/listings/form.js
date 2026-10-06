(() => {
    const imageInput = document.getElementById("image");
    const preview = document.querySelector(".image-preview");

    if (imageInput && preview) {
        imageInput.addEventListener("change", (event) => {
            const [file] = event.target.files || [];

            if (!file) {
                preview.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-image fa-3x mb-2"></i>
                        <p class="mb-0">Image preview will appear here</p>
                    </div>
                `;
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            preview.innerHTML = `<img src="${objectUrl}" alt="Preview" />`;
        });
    }

    const forms = document.querySelectorAll("form.needs-validation");
    Array.from(forms).forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");
        });
    });
})();
