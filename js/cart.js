const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(e) {
    const button = e.target;
    const itemId = button.getAttribute('data-id');
    const category = button.getAttribute('data-category');
    
    const item = storeItems[category].find(i => i.id === itemId);
    if (!item) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
    
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
    }, 1000);
}

function updateCart(cart) {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElement = document.getElementById('cartCount');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty. Pika Pika!</div>';
        cartTotalElement.textContent = '0 PokéCoins';
        cartCountElement.textContent = '0';
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const itemTotal = item.isRealMoney ? item.price * item.quantity : item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.isRealMoney ? '$' + item.price.toFixed(2) : item.price + ' PokéCoins'}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update total and count
    const hasRealMoneyItems = cart.some(item => item.isRealMoney);
    const hasPokeCoinItems = cart.some(item => !item.isRealMoney);
    
    if (hasRealMoneyItems && hasPokeCoinItems) {
        const pokeCoinTotal = cart.filter(item => !item.isRealMoney).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const moneyTotal = cart.filter(item => item.isRealMoney).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `${pokeCoinTotal} PokéCoins + $${moneyTotal.toFixed(2)}`;
    } else if (hasRealMoneyItems) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    } else {
        cartTotalElement.textContent = `${total} PokéCoins`;
    }
    
    cartCountElement.textContent = totalItems;
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function decreaseQuantity(e) {
    const itemId = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart(cart);
    }
}

function increaseQuantity(e) {
    const itemId = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart(cart);
    }
}

function removeItem(e) {
    const itemId = e.target.getAttribute('data-id');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
}

function showCart() {
    document.getElementById('cartSidebar').classList.add('open');
}

function hideCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty! Pika!");
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        if (confirm('Pika! You need to log in to complete your purchase. Go to login page?')) {
            window.location.href = 'login.html?redirect=cart.html';
        }
        return;
    }
    
    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        userId: user.playerId, 
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.isRealMoney ? '$' + item.price.toFixed(2) : item.price + ' PokéCoins',
            isRealMoney: item.isRealMoney
        })),
        total: document.getElementById('cartTotal').textContent
    };
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    transactions.push(transaction);
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    user.stats.itemsPurchased += cart.reduce((sum, item) => sum + item.quantity, 0);
    user.stats.totalSpent += cart
        .filter(item => !item.isRealMoney)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.playerId === user.playerId);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    localStorage.removeItem('cart');
    updateCart([]);
    
    alert('Pika! Purchase successful! Pika Pika!');
    window.location.href = 'transactions.html';
}

document.addEventListener('DOMContentLoaded', function() {
    updateCart(JSON.parse(localStorage.getItem('cart')) || []);
    
    // Add event listeners for cart buttons
    if (document.getElementById('cartBtn')) {
        document.getElementById('cartBtn').addEventListener('click', showCart);
    }
    
    if (document.getElementById('closeCart')) {
        document.getElementById('closeCart').addEventListener('click', hideCart);
    }
    
    if (document.getElementById('checkoutBtn')) {
        document.getElementById('checkoutBtn').addEventListener('click', checkout);
    }
});