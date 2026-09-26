//logic to export expenses to CSV
function exportToCSV() {

    if (expenses.length === 0) {
        alert('No expenses to export.');
        return;
    }

    let csvData = 'Date,Category,Description,Amount\n';

    for (let i = 0; i < expenses.length; i++) {
        csvData += `${expenses[i].date},${expenses[i].category},${expenses[i].description},${expenses[i].amount.toFixed(2)}\n`;
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//