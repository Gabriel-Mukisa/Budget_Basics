const form = document.getElementById('calForm');
const incomeInput = document.getElementById('IncomeInput');
const errorMessage = document.getElementById('errorMessage');
const resultBox = document.getElementById('resultBox');

const needsOutput = document.getElementById('needsOutput');
const wantsOutput = document.getElementById('wantsOutput');
const savingsOutput = document.getElementById('savingsOutput');

if (form) {
    form.addEventListener("submit", function(event) {
    event.preventDefault();
    errorMessage.textContent = '';

    let income = Number(incomeInput.value);
    if (income <= 0 || isNaN(income)) {
        errorMessage.textContent = 'Please enter a valid income greater than 0.';
        resultBox.style.display = 'none';
        return;
    }

    let needs = income * 0.5;
    let wants = income * 0.3;
    let savings = income * 0.2;

    needsOutput.textContent = "$" + needs.toFixed(2);
    wantsOutput.textContent = "$" + wants.toFixed(2);
    savingsOutput.textContent = "$" + savings.toFixed(2);

        resultBox.style.display = 'block';
    });
}