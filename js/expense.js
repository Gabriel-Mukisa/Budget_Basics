let expenses = [];
let editingIndex = -1;

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpenseElement = document.getElementById('totalExpense');
const expError = document.getElementById('expError');
const expSubmitBtn = document.getElementById('expSubmitBtn');

if (expenseForm) {
    expenseForm.addEventListener('submit', function(e){
    e.preventDefault();

    const date = document.getElementById('expenseDate').value;
    const category = document.getElementById('expenseCategory').value;
    const desc = document.getElementById('expenseDesc').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (date === '' || category === '' || desc === '' || isNaN(amount) || amount <= 0) {
        expError.textContent = 'Please fill in all fields with valid values.';
        return;
    }

    expError.textContent = '';

    const newExpense = {
        date: date,
        category: category,
        description: desc,
        amount: amount
    };

    if (editingIndex === -1) {
        expenses.push(newExpense);
    }

    else {
        expenses[editingIndex] = newExpense;
        editingIndex = -1;
        expSubmitBtn.textContent = 'Add Expense';
    }

    expenseForm.reset();
        updateTable();
    });
}

function updateTable() {
    expenseList.innerHTML = '';
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${expenses[i].date}</td>
            <td>${expenses[i].category}</td>
            <td>${expenses[i].description}</td>
            <td>${expenses[i].amount.toFixed(2)}</td>
            <td>
                <button onclick="editExpense(${i})">Edit</button>
                <button onclick="deleteExpense(${i})">Delete</button>
            </td>
        `;

        expenseList.appendChild(row);
    }

    totalExpenseElement.textContent = total.toFixed(2);
}

function editExpense(index) {
    const expense = expenses[index];

    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDesc').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;

    editingIndex = index;
    expSubmitBtn.textContent = 'Update Expense';
}

function deleteExpense(index) {
    expenses.splice(index, 1);

    if (editingIndex === index) {
        editingIndex = -1;
        expSubmitBtn.textContent = 'Add Expense';
        expenseForm.reset();
    }

    updateTable();
}