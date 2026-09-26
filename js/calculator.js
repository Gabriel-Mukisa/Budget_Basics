const form = document.getElementById('calForm');
const incomeInput = document.getElementById('IncomeInput');
const errorMessage = document.getElementById('errorMessage');
const resultBox = document.getElementById('resultBox');

const needsOutput = document.getElementById('needsOutput');
const wantsOutput = document.getElementById('wantsOutput');
const savingsOutput = document.getElementById('savingsOutput');

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        errorMessage.textContent = "";

        const income = Number(incomeInput.value);
        if (!Number.isFinite(income) || income <= 0) {
            errorMessage.textContent = "Please enter a valid income greater than 0.";
            resultBox.style.display = "none";
            return;
        }

        needsOutput.textContent = `$${(income * 0.5).toFixed(2)}`;
        wantsOutput.textContent = `$${(income * 0.3).toFixed(2)}`;
        savingsOutput.textContent = `$${(income * 0.2).toFixed(2)}`;
        resultBox.style.display = "block";
    });
}