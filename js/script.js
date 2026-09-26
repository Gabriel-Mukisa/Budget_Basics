const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".carousel-dot");

let currentSlide = 0;
let carouselTimer;

function showSlide(index) {
    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
    });

    currentSlide = index;
}

function startCarousel() {
    carouselTimer = setInterval(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
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

showSlide(0);
startCarousel();