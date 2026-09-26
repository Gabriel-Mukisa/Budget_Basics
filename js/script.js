const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".carousel-dot");
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
    if (!slides.length) {
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

