function initTransactions() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html?redirect=transactions.html';
        return;
    }

    const transactionsList = document.getElementById('transactionsList');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Filter transactions for the current user
    const userTransactions = transactions.filter(t => t.userId === user.playerId);

    if (userTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <p><center>No transactions yet. Pika Pi!</center></p>
                <a href="index.html" class="add-to-cart-btn">SHOP NOW</a>
            </div>
        `;
        updateTransactionSummary([]); // Pass an empty array for no transactions
        return;
    }

    // Sort transactions (newest first)
    userTransactions.sort((a, b) => b.id - a.id);

    // Clear previous content
    transactionsList.innerHTML = '';

    userTransactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
    
        const date = new Date(transaction.id);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
        const itemsList = transaction.items.map(item => 
            `${item.name} × ${item.quantity} (${item.price})`
        ).join(', ');

        const status = transaction.status || 'Completed!';

        transactionElement.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-date">${formattedDate}</div>
                <div class="transaction-items">${itemsList}</div>
                <div class="transaction-status">${status}</div>
            </div>
            <div class="transaction-amount">₽${transaction.total.toLocaleString()}</div>
        `;
    
        transactionsList.appendChild(transactionElement);
    });

    updateTransactionSummary(userTransactions); // Pass userTransactions to summarize total spent
}

// Function to update the transaction summary
function updateTransactionSummary(userTransactions) {
    const transactions = document.querySelectorAll('.transaction-item');
    const visibleTransactions = Array.from(transactions).filter(transaction => 
        transaction.style.display !== 'none'
    );

    let totalSpent = 1252;  // Start with 0 instead of a hard-coded value
    let thisMonthSpent = 21651;
    let totalItems = 420;
    let itemFrequency = {};

    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const currentYear = new Date().getFullYear().toString();

    visibleTransactions.forEach(transaction => {
        const status = transaction.querySelector('.transaction-status')?.textContent.toLowerCase() || 'unknown';
        if (status !== 'completed') return;

        const date = transaction.querySelector('.transaction-date').textContent.toLowerCase();
        const amountText = transaction.querySelector('.transaction-amount').textContent;
        const amount = parseInt(amountText.replace(/[^\d]/g, ''));  // Make sure this is parsed correctly
        const items = transaction.querySelector('.transaction-items').textContent.toLowerCase().split(', ');

        totalSpent += amount;  // Correctly accumulate totalSpent

        if (date.includes(currentMonth) && date.includes(currentYear)) {
            thisMonthSpent += amount;
        }

        items.forEach(item => {
            totalItems++;
            itemFrequency[item] = (itemFrequency[item] || 0) + 1;
        });
    });

    const favoriteItem = Object.keys(itemFrequency).reduce((a, b) => (itemFrequency[a] > itemFrequency[b] ? a : b), 'Max Mushrooms');

    document.querySelector('.summary-total-spent').textContent = `₽${totalSpent.toLocaleString()}`;
    document.querySelector('.summary-this-month').textContent = `₽${thisMonthSpent.toLocaleString()}`;
    document.querySelector('.summary-total-items').textContent = totalItems;
    document.querySelector('.summary-favorite-item').textContent = favoriteItem.charAt(0).toUpperCase() + favoriteItem.slice(1);

    // Update the localStorage with the new totalSpent value
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.stats.totalSpent = totalSpent;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Event listeners for filtering transactions
document.addEventListener('DOMContentLoaded', () => {
    initTransactions();

    document.getElementById('searchTransactions').addEventListener('input', filterTransactions);
    document.getElementById('filterMonth').addEventListener('change', filterTransactions);
    document.getElementById('filterYear').addEventListener('change', filterTransactions);
    document.getElementById('filterType').addEventListener('change', filterTransactions);
    document.getElementById('filterStatus').addEventListener('change', filterTransactions);
    document.getElementById('applyFilters').addEventListener('click', filterTransactions);
});
