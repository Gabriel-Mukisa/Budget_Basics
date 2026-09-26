const slides = document.querySelectorAll(".heroSlide");
const dots = document.querySelectorAll(".carouselDot");
const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");

let currentSlide = 0;
let carouselTimer;

function showSlide(index) {
    if (!slides.length) {
        return;
    }

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
    });

    currentSlide = index;
}

function startCarousel() {
    if (slides.length <= 1) {
        return;
    }

    carouselTimer = setInterval(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);
}

function resetCarousel() {
    clearInterval(carouselTimer);
    startCarousel();
}

if (dots.length) {
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            resetCarousel();
        });
    });
}

if (slides.length) {
    showSlide(0);
    startCarousel();
}

if (chatToggle && chatWidget) {
    chatToggle.addEventListener("click", () => {
        chatWidget.classList.toggle("open");

        const inputField = document.getElementById("userInput") || document.getElementById("user-input");
        if (chatWidget.classList.contains("open") && inputField) {
            inputField.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!chatWidget.contains(event.target)) {
            chatWidget.classList.remove("open");
        }
    });
}

let faqData = [];

async function fetchFAQData() {
    try {
        const response = await fetch("data/faq.json");

        if (!response.ok) {
            throw new Error(`Failed to fetch FAQ data: ${response.status}`);
        }

        faqData = await response.json();
        console.log("FAQ data fetched successfully:", faqData);
    } catch (error) {
        console.error("Error fetching FAQ:", error);
        faqData = [
            {
                keywords: ["budget", "save", "spending"],
                answer: "Start by tracking your income, setting a savings goal, and keeping your spending below what you earn."
            },
            {
                keywords: ["needs", "wants"],
                answer: "Needs are essentials like rent, food, and transport, while wants are flexible purchases that can be reduced if needed."
            },
            {
                keywords: ["plan", "monthly"],
                answer: "A simple monthly plan separates income, fixed costs, savings, and a small amount for flexible spending."
            }
        ];
    }
}

function findAnswer(userMessage) {
    const message = userMessage.toLowerCase();

    for (const faq of faqData) {
        if (!faq || !Array.isArray(faq.keywords)) {
            continue;
        }

        for (const keyword of faq.keywords) {
            if (message.includes(String(keyword).toLowerCase())) {
                return faq.answer;
            }
        }
    }

    return "I'm sorry, I don't have an answer for that. Please try asking something else.";
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById("chatMessages") || document.getElementById("chat-messages");

    if (!chatMessages) {
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("userInput") || document.getElementById("user-input");

    if (!input) {
        return;
    }

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");
    addMessage(findAnswer(message), "bot");
    input.value = "";
    input.focus();
}

const sendButton = document.getElementById("sendButton") || document.getElementById("send-button");
const inputField = document.getElementById("userInput") || document.getElementById("user-input");

if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

if (inputField) {
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

fetchFAQData();

const themeSwitcher = document.querySelector(".themeSwitcher");
const themeTrigger = document.querySelector(".themeTrigger");
const themeOptions = document.querySelectorAll(".themeOption");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getSystemTheme() {
    return systemTheme.matches ? "dark" : "light";
}

function applyTheme(choice, animate = true) {
    const theme = choice === "system" ? getSystemTheme() : choice;

    if (animate) {
        document.documentElement.classList.add("themeChanging");
        setTimeout(() => {
            document.documentElement.classList.remove("themeChanging");
        }, 450);
    }

    document.documentElement.dataset.theme = theme;

    themeOptions.forEach((option) => {
        option.classList.toggle("active", option.dataset.themeChoice === choice);
    });
}

function closeThemeOptions() {
    if (!themeSwitcher || !themeTrigger) {
        return;
    }

    themeSwitcher.classList.remove("open");
    themeTrigger.setAttribute("aria-expanded", "false");
}

const savedTheme = localStorage.getItem("budgetBeeTheme") || "system";

if (themeSwitcher && themeTrigger && themeOptions.length) {
    applyTheme(savedTheme, false);

    themeTrigger.addEventListener("click", () => {
        const isOpen = themeSwitcher.classList.toggle("open");
        themeTrigger.setAttribute("aria-expanded", String(isOpen));
    });

    themeOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const choice = option.dataset.themeChoice;
            localStorage.setItem("budgetBeeTheme", choice);
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
        const savedChoice = localStorage.getItem("budgetBeeTheme");
        if (savedChoice === "system") {
            applyTheme("system");
        }
    });
}

