const expenseStorageKey = 'budgetBeeExpenses';
let expenses = loadExpenses();
let editingIndex = -1;

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpenseElement = document.getElementById('totalExpense');
const expError = document.getElementById('expError');
const expSubmitBtn = document.getElementById('expSubmitBtn');
const exportButton = document.getElementById('exportButton');
const expenseEmpty = document.getElementById('expenseEmpty');

function loadExpenses() {
    try {
        const savedExpenses = JSON.parse(localStorage.getItem(expenseStorageKey) || '[]');
        if (!Array.isArray(savedExpenses)) {
            return [];
        }

        return savedExpenses.filter((expense) =>
            expense &&
            typeof expense.date === 'string' &&
            typeof expense.category === 'string' &&
            typeof expense.description === 'string' &&
            Number.isFinite(Number(expense.amount)) &&
            Number(expense.amount) > 0
        ).map((expense) => ({ ...expense, amount: Number(expense.amount) }));
    } catch {
        return [];
    }
}

function saveExpenses() {
    try {
        localStorage.setItem(expenseStorageKey, JSON.stringify(expenses));
        return true;
    } catch {
        expError.textContent = 'Expenses could not be saved on this device.';
        return false;
    }
}

if (expenseForm) {
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('expenseDate').value;
        const category = document.getElementById('expenseCategory').value;
        const description = document.getElementById('expenseDesc').value.trim();
        const amount = Number(document.getElementById('expenseAmount').value);

        if (!date || !category || !description || !Number.isFinite(amount) || amount <= 0) {
            expError.textContent = 'Please fill in all fields with valid values.';
            return;
        }

        expError.textContent = '';
        const expense = { date, category, description, amount };

        if (editingIndex === -1) {
            expenses.push(expense);
        } else {
            expenses[editingIndex] = expense;
        }

        editingIndex = -1;
        expSubmitBtn.textContent = 'Add expense';
        expenseForm.reset();
        saveExpenses();
        updateTable();
    });
}

if (expenseList) {
    expenseList.addEventListener('click', (event) => {
        const actionButton = event.target.closest('button[data-action]');
        if (!actionButton) {
            return;
        }

        const index = Number(actionButton.dataset.index);
        if (!Number.isInteger(index) || !expenses[index]) {
            return;
        }

        if (actionButton.dataset.action === 'edit') {
            const expense = expenses[index];
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseDesc').value = expense.description;
            document.getElementById('expenseAmount').value = expense.amount;
            editingIndex = index;
            expSubmitBtn.textContent = 'Update expense';
            document.getElementById('expenseDate').focus();
            return;
        }

        if (actionButton.dataset.action === 'delete') {
            expenses.splice(index, 1);
            saveExpenses();
            if (editingIndex === index) {
                editingIndex = -1;
                expenseForm.reset();
                expSubmitBtn.textContent = 'Add expense';
            } else if (editingIndex > index) {
                editingIndex -= 1;
            }
            updateTable();
        }
    });
}

if (exportButton) {
    exportButton.addEventListener('click', exportToCSV);
}

function updateTable() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach((expense, index) => {
        total += expense.amount;
        const row = document.createElement('tr');
        [expense.date, expense.category, expense.description, `$${expense.amount.toFixed(2)}`].forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement('td');
        const actions = document.createElement('div');
        actions.className = 'tableActions';
        ['edit', 'delete'].forEach((action) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tableAction';
            button.dataset.action = action;
            button.dataset.index = String(index);
            button.textContent = action === 'edit' ? 'Edit' : 'Delete';
            button.setAttribute('aria-label', `${action === 'edit' ? 'Edit' : 'Delete'} ${expense.description}`);
            actions.appendChild(button);
        });
        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);
        expenseList.appendChild(row);
    });

    totalExpenseElement.textContent = `$${total.toFixed(2)}`;
    expenseEmpty.hidden = expenses.length > 0;
}

updateTable();