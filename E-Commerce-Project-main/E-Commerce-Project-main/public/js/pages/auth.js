(() => {
    document.querySelectorAll(".password-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.target);
            const icon = button.querySelector("i");

            if (!target || !icon) {
                return;
            }

            const nextType = target.type === "password" ? "text" : "password";
            target.type = nextType;
            icon.classList.toggle("fa-eye", nextType === "password");
            icon.classList.toggle("fa-eye-slash", nextType === "text");
        });
    });

    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("passwordConfirm");
    const submitButton = document.querySelector("button[type='submit']");

    if (!password || !passwordConfirm || !submitButton) {
        return;
    }

    const syncPasswordState = () => {
        const matches = password.value === passwordConfirm.value;
        passwordConfirm.setCustomValidity(matches ? "" : "Passwords must match");
        submitButton.disabled = !matches;
    };

    submitButton.disabled = true;
    password.addEventListener("input", syncPasswordState);
    passwordConfirm.addEventListener("input", syncPasswordState);
})();
