document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("a.fade-link");

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = this.href;
            }, 300);
        });
    });
});
