(() => {
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("ratingInput");

    if (!stars.length || !ratingInput) {
        return;
    }

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const value = Number(star.dataset.value);
            ratingInput.value = String(value);

            stars.forEach((currentStar, index) => {
                const isActive = index < value;
                currentStar.classList.toggle("active", isActive);
                currentStar.classList.toggle("fas", isActive);
                currentStar.classList.toggle("far", !isActive);
            });
        });
    });
})();
