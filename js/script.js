let faqData = [];
async function fetchFAQData() {
    try{
        const response = await fetch("data/faq.json");

        faqData = await response.json();

        console.log("FAQ data fetched successfully:", faqData);
    } catch (error) {
        console.error("Error fetching FAQ ", error);
    }

}

function findAnswer(userMessage) {
    const message = userMessage.toLowerCase();
    
    for(const faq of faqData) {
        for (const keyword of faq.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                return faq.answer;
            }
}
    }
    return "I'm sorry, I don't have an answer for that. Please try asking something else.";
}


function addMessage(message, sender) { 
    const chatMessages = document.getElementById("chat-messages");

    const messageElement = document.createElement("div");

    messageElement.classList.add("message", sender);

    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function sendMessage(){
    const input = document.getElementById("user-input");

    const message = input.value.trim();

    if(message === ""){
        return;
    }

    addMessage(message, "user");

    const answer = findAnswer(message);

    addMessage(answer, "bot");

    input.value = "";

    input.focus();

}

document.getElementById("send-button").addEventListener("click", sendMessage);

document
    .getElementById("user-input")
    .addEventListener("keypress", function(event) {
        if(event.key === "Enter"){
            sendMessage();
        }
    });

    loadFAQ();