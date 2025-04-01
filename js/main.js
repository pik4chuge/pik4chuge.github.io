document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    highlightCurrentPage();
    
    if (document.querySelector('.hero-carousel')) initCarousel();
    if (document.getElementById('registrationForm')) initRegistration();
    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('logoutBtn')) initLogout();
    if (document.querySelector('.items-grid')) initStore();
    if (document.getElementById('editAvatarBtn')) initProfile();
    if (document.getElementById('transactionsList')) initTransactions();
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const protectedPages = ['profile.html', 'transactions.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!user) {
            window.location.href = 'login.html';
        }
    } else if (currentPage === 'login.html' || currentPage === 'register.html') {
        if (user) {
            window.location.href = 'profile.html';
        }
    }
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    let slideInterval = setInterval(nextSlide, 5000);
    
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    showSlide(currentSlide);
}

const storeItems = {
    featured: [
        { 
            id: 'super-incubator-2', 
            name: 'Super Incubator (2)', 
            price: 88, 
            description: '2 Super Incubators!', 
            image: 'images/super-incubator.webp',
            badge: 'POPULAR'
        },
        { 
            id: 'egg-incubator-3', 
            name: 'Egg Incubator (3)', 
            price: 88, 
            description: '3 Egg Incubators!', 
            image: 'images/egg-incubator.webp',
            badge: 'POPULAR'
        },
        { 
            id: 'max-revive-6', 
            name: 'Max Revive (6)', 
            price: 59, 
            description: 'Revive your Pokémon to full!', 
            image: 'images/max-revive.webp'
        },
        { 
            id: 'premium-battle-pass-3', 
            name: 'Premium Battle Pass (3)', 
            price: 99, 
            description: 'Join Battles at a Gym!', 
            image: 'images/battle-pass.webp'
        },
        { 
            id: 'max-particle-pack-6', 
            name: 'Max Particle Pack (6)', 
            price: 235, 
            description: 'Max your Particles!', 
            image: 'images/particle-pack.webp'
        },
        { 
            id: 'max-mushroom-3', 
            name: 'Max Mushroom (3)', 
            price: 289, 
            description: 'Max your Mushrooms!', 
            image: 'images/max-mushroom.webp'
        }
    ],
    boxes: [
        { 
            id: 'stunning-styles', 
            name: 'Stunning  Styles Ultra Ticket Box', 
            price: 59, 
            description: 'Can only be purchased 1 time.', 
            image: 'images/stunning-styles.webp',
            isRealMoney: true,
            badge: 'ONE TIME ONLY'
        },
        { 
            id: 'ultra-ticket-box', 
            name: 'Power Up Ticket Ultra Ticket Box', 
            price: 289, 
            description: 'Can only be purchased 1 time.', 
            image: 'images/ultra-ticket-box.webp',
            isRealMoney: true,
            badge: 'ONE TIME ONLY'
        },
        { 
            id: 'rocket-box', 
            name: 'GO Rocket Box', 
            price: 289, 
            description: 'Can only be purchased 1 time.', 
            image: 'images/rocket-box.webp',
            badge: 'LIMITED-TIME ONLY',
        },
        { 
            id: 'ultra-raid-box', 
            name: 'Ultra Raid Box', 
            price: 1280, 
            description: 'Can only be purchased 3 times.', 
            image: 'images/ultra-raid-box.webp',
            badge: 'LIMITED-TIME ONLY',
        },
        { 
            id: 'might-mastery-box', 
            name: 'Might and Mastery Box', 
            price: 149, 
            description: 'Can only be purchased 3 times.', 
            image: 'images/might-mastery-box.webp',
            badge: 'LIMITED-TIME ONLY',
        },
        { 
            id: 'lebron-box', 
            name: 'Lebron Box', 
            price: 23, 
            description: 'My sunshine, my only sunshine.', 
            image: 'images/lebron-box.jpg',
            badge: 'GOATED',
        }
    ],
    coins: [
        { 
            id: '110-coins', 
            name: '110 PokéCoins', 
            price: 29.00, 
            description: '10 Web Store Bonus Coins', 
            image: 'images/pokecoins-110.webp',
            isRealMoney: true
        },
        { 
            id: '600-coins', 
            name: '600 PokéCoins', 
            price: 149.00, 
            description: '50 Web Store Bonus Coins', 
            image: 'images/pokecoins-600.webp',
            isRealMoney: true,
            badge: 'BEST VALUE'
        },
        { 
            id: '1300-coins', 
            name: '1300 PokéCoins', 
            price: 289.00, 
            description: '100 Web Store Bonus Coins', 
            image: 'images/pokecoins-1300.webp',
            isRealMoney: true
        },
        { 
            id: '2700-coins', 
            name: '2,700 PokéCoins', 
            price: 589.00, 
            description: '200 Web Store Bonus Coins', 
            image: 'images/pokecoins-2700.webp',
            isRealMoney: true
        },
        { 
            id: '5600-coins', 
            name: '5,600 PokéCoins', 
            price: 1170.00, 
            description: '400 Web Store Bonus Coins', 
            image: 'images/pokecoins-5600.webp',
            isRealMoney: true
        },
        { 
            id: '15500-coins', 
            name: '15,500 PokéCoins', 
            price: 2950.00, 
            description: '1000 Web Store Bonus Coins', 
            image: 'images/pokecoins-15500.webp',
            isRealMoney: true
        },
    ],
};

function initStore() {
    loadStoreItems('featured', 'featuredItems');
    loadStoreItems('boxes', 'itemBoxes');
    loadStoreItems('coins', 'pokeCoins');
    loadStoreItems('bundles', 'dailyBundles');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart(cart);
    
    const tabs = document.querySelectorAll('.store-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.store-section').forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
    
    document.getElementById('cartToggle').addEventListener('click', showCart);
    document.querySelector('.close-cart').addEventListener('click', hideCart);
    
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
}


function loadStoreItems(category, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    container.innerHTML = '';
    
    storeItems[category].forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        let badge = '';
        if (item.badge) {
            badge = `<div class="item-badge">${item.badge}</div>`;
        }
        
        itemCard.innerHTML = `
            ${badge}
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.isRealMoney ? '$' + item.price.toFixed(2) : item.price + ' PokéCoins'}</div>
                <div class="item-description">${item.description}</div>
                <button class="add-to-cart" data-id="${item.id}" data-category="${category}">Add to Cart</button>
            </div>
        `;
        
        container.appendChild(itemCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.store-container')) initStore();
});
