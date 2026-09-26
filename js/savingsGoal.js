const goalForm = document.getElementById('goalForm');
const goalError = document.getElementById('goalError');
const goalResultBox = document.getElementById('goalResultBox');

goalForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById('goalName').value.trim();
    const TargetAmount = parseFloat(document.getElementById('targetAmount').value);
    const currentAmount = parseFloat(document.getElementById('currentSavings').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);

    if(!name || isNaN(TargetAmount) || isNaN(currentAmount) || isNaN(monthlyContribution) || TargetAmount <= 0 || currentAmount < 0 || monthlyContribution < 0) {
        goalError.textContent = 'Please fill in all fields with valid values.';
        goalResultBox.style.display = 'none';
        return;
    }

    if(currentAmount >= TargetAmount) {
        goalError.textContent = 'Current savings already meets or exceeds the target amount.';
        goalResultBox.style.display = 'none';
        return;
    }

    goalError.textContent = '';

    const remainingAmount = TargetAmount - currentAmount;
    const monthsNeeded = Math.ceil(remainingAmount / monthlyContribution);
    let percent = Math.min((currentAmount / TargetAmount) * 100, 100).toFixed(2);

    document.getElementById('resGoalTitle').textContent = 'Goal: ${name}';
    document.getElementById('resRemaining').textContent = remaining.toFixed(2);
    document.getElementById('resMonths').textContent = monthsNeeded;

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '${percent}%';
    document.getElementById('progressPercent').textContent = '${percent}% Achieved';

    const tipElement = document.getElementById('SavingsTip');

    if(monthsNeeded <= 6) {
        tipElement.textContent = 'Great job! You are on track to reach your goal in a short time.';
    }else if(monthsNeeded <= 12) {
        tipElement.textContent = 'You are making good progress. Keep contributing to reach your goal within a year.';
    }else {
        tipElement.textContent = 'Consider increasing your monthly contribution or adjusting your goal to reach it sooner.';
    }

    goalResultBox.style.display = 'block';
    
    
});