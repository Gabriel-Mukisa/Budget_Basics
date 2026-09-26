const goalForm = document.getElementById('goalForm');
const goalError = document.getElementById('goalError');
const goalResultBox = document.getElementById('goalResultBox');

if (goalForm) {
    goalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById('goalName').value.trim();
        const targetAmount = Number(document.getElementById('targetAmount').value);
        const currentAmount = Number(document.getElementById('currentSavings').value);
        const monthlyContribution = Number(document.getElementById('monthlyContribution').value);

        if (!name || !Number.isFinite(targetAmount) || !Number.isFinite(currentAmount) ||
            !Number.isFinite(monthlyContribution) || targetAmount <= 0 || currentAmount < 0 || monthlyContribution <= 0) {
            goalError.textContent = 'Please fill in all fields with valid values.';
            goalResultBox.style.display = 'none';
            return;
        }

        goalError.textContent = '';
        const remainingAmount = Math.max(targetAmount - currentAmount, 0);
        const monthsNeeded = remainingAmount === 0 ? 0 : Math.ceil(remainingAmount / monthlyContribution);
        const percent = Math.min((currentAmount / targetAmount) * 100, 100);

        document.getElementById('resGoalTitle').textContent = `Goal: ${name}`;
        document.getElementById('resRemaining').textContent = `$${remainingAmount.toFixed(2)}`;
        document.getElementById('resMonths').textContent = String(monthsNeeded);

        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent.toFixed(0));
        document.getElementById('progressPercent').textContent = `${percent.toFixed(0)}% achieved`;

        const tipElement = document.getElementById('savingsTip');
        if (remainingAmount === 0) {
            tipElement.textContent = 'You have reached this savings goal.';
        } else if (monthsNeeded <= 6) {
            tipElement.textContent = 'Great job! You are on track to reach your goal in a short time.';
        } else if (monthsNeeded <= 12) {
            tipElement.textContent = 'You are making good progress. Keep contributing to reach it within a year.';
        } else {
            tipElement.textContent = 'Consider increasing your monthly contribution or adjusting your goal to reach it sooner.';
        }

        goalResultBox.style.display = 'block';
    });
}