const slides = document.querySelectorAll(".heroSlide");
const dots = document.querySelectorAll(".carouselDot");

let currentSlide = 0;
let carouselTimer;


function showSlide(index) {
    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle(
            "active",
            slideIndex === index
        );
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle(
            "active",
            dotIndex === index
        );
    });

    currentSlide = index;
}


function startCarousel() {
    if (slides.length <= 1) {
        return;
    }

    carouselTimer = setInterval(() => {
        const nextSlide =
            (currentSlide + 1) % slides.length;

        showSlide(nextSlide);
    }, 5000);
}


function resetCarousel() {
    clearInterval(carouselTimer);
    startCarousel();
}


dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        resetCarousel();
    });
});


if (slides.length > 0) {
    showSlide(0);
    startCarousel();
}


/* Theme */

const themeSwitcher =
    document.querySelector(".themeSwitcher");

const themeTrigger =
    document.querySelector(".themeTrigger");

const themeOptions =
    document.querySelectorAll(".themeOption");

const systemTheme =
    window.matchMedia("(prefers-color-scheme: dark)");


function getSystemTheme() {
    return systemTheme.matches
        ? "dark"
        : "light";
}


function applyTheme(choice, animate = true) {

    const theme =
        choice === "system"
            ? getSystemTheme()
            : choice;


    if (animate) {

        document.documentElement.classList.add(
            "themeChanging"
        );


        setTimeout(() => {

            document.documentElement.classList.remove(
                "themeChanging"
            );

        }, 450);

    }


    document.documentElement.dataset.theme =
        theme;


    themeOptions.forEach((option) => {

        option.classList.toggle(
            "active",
            option.dataset.themeChoice === choice
        );

    });

}


function closeThemeOptions() {

    themeSwitcher.classList.remove("open");

    themeTrigger.setAttribute(
        "aria-expanded",
        "false"
    );

}


const savedTheme =
    localStorage.getItem("budgetBeeTheme") || "system";


applyTheme(savedTheme, false);


themeTrigger.addEventListener("click", () => {

    const isOpen =
        themeSwitcher.classList.toggle("open");


    themeTrigger.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


themeOptions.forEach((option) => {

    option.addEventListener("click", () => {

        const choice =
            option.dataset.themeChoice;


        localStorage.setItem(
            "budgetBeeTheme",
            choice
        );


        applyTheme(choice);

        closeThemeOptions();

    });

});


document.addEventListener("click", (event) => {

    if (!themeSwitcher.contains(event.target)) {
        closeThemeOptions();
    }

});


systemTheme.addEventListener("change", () => {

    const savedChoice =
        localStorage.getItem("budgetBeeTheme");


    if (savedChoice === "system") {
        applyTheme("system");
    }

});