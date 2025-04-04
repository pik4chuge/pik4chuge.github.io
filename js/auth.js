function initRegistration() {
    const registrationForm = document.getElementById('registrationForm');
    const playerIdDisplay = document.getElementById('playerIdDisplay');
    const emailInput = document.getElementById('email');
    const birthdateInput = document.getElementById('birthdate');
    
    function generatePlayerId() {
        let id = '';
        for (let i = 0; i < 3; i++) {
            id += Math.floor(1000 + Math.random() * 9000);
            if (i < 2) id += ' ';
        }
        return id;
    }
    
    const playerId = generatePlayerId();
    playerIdDisplay.textContent = `Player ID: ${playerId}`;
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    // Date validation function
    function isValidDate(dateString) {
        // Check if it's a valid date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) return false;
        
        // Check if it's a real date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        
        // Check if date is not in the future
        const today = new Date();
        if (date > today) return false;
        
        // Check if birth year is reasonable (e.g., not before 1900)
        const minYear = 1900;
        if (date.getFullYear() < minYear) return false;
        
        return true;
    }
    
    // Add validation to email input
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.setCustomValidity('Please enter a valid email address');
            this.reportValidity();
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Add validation to birthdate input
    birthdateInput.addEventListener('blur', function() {
        if (this.value && !isValidDate(this.value)) {
            this.setCustomValidity('Please enter a valid birth date (YYYY-MM-DD) that is not in the future');
            this.reportValidity();
        } else {
            this.setCustomValidity('');
        }
    });
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const birthdate = birthdateInput.value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate email
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address!");
            return;
        }
        
        // Validate birthdate
        if (!isValidDate(birthdate)) {
            alert("Please enter a valid birth date!");
            return;
        }
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        const user = {
            email: email,
            password: password,
            ign: document.getElementById('ign').value,
            playerId: playerId,
            birthdate: birthdate,
            gender: document.querySelector('input[name="gender"]:checked')?.value || 'not specified',
            joinDate: new Date().toLocaleDateString(),
            lastLogin: new Date().toISOString(),
            stats: {
                pokemonCaught: 0,
                gymsDefended: 0,
                itemsPurchased: 0,
                totalSpent: 0
            }
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        updateAuthUI();
        alert('Registration successful! Pika Pika!');
        window.location.href = 'profile.html';
    });
}

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.removeEventListener('submit', loginForm._submitHandler);
    
    loginForm._submitHandler = function(e) {
        e.preventDefault();
        
        const ign = document.getElementById('loginIgn').value;
        const password = document.getElementById('loginPassword').value;
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const user = users.find(u => u.ign === ign && u.password === password);
        
        if (user) {
            user.lastLogin = new Date().toISOString();
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            const userIndex = users.findIndex(u => u.ign === user.ign);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            updateAuthUI();
            alert(`Welcome back, ${user.ign}! Pika Pika!`);
            window.location.href = redirectUrl;
        } else {
            alert('Pika Pika! You have entered an Invalid IGN or password!');
        }
    };
    
    loginForm.addEventListener('submit', loginForm._submitHandler);
}


function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.removeEventListener('click', logoutBtn._clickHandler);
        
        logoutBtn._clickHandler = function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('currentUser');
                updateAuthUI();
                alert('Logged out successfully! Pika Pika!');
                window.location.href = 'index.html';
            }
        };
        
        logoutBtn.addEventListener('click', logoutBtn._clickHandler);
    }
}

function updateAuthUI() {
    const isLoggedIn = !!localStorage.getItem('currentUser');
    
    // Update navigation links
    document.querySelectorAll('.login-link').forEach(el => {
        el.style.display = isLoggedIn ? 'none' : 'block';
    });
    document.querySelectorAll('.profile-link').forEach(el => {
        el.style.display = isLoggedIn ? 'block' : 'none';
    });
    document.querySelectorAll('.logout-link').forEach(el => {
        el.style.display = isLoggedIn ? 'block' : 'none';
    });
    
    const mainNavLogin = document.querySelector('.nav-links a[href="login.html"]');
    if (mainNavLogin) {
        mainNavLogin.removeEventListener('click', mainNavLogin._clickHandler);
        
        if (isLoggedIn) {
            mainNavLogin.textContent = 'Logout';
            mainNavLogin.href = '#';
            
            mainNavLogin._clickHandler = function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('currentUser');
                    updateAuthUI();
                    window.location.href = 'index.html';
                }
            };
            
            mainNavLogin.addEventListener('click', mainNavLogin._clickHandler);
        } else {
            mainNavLogin.textContent = 'Login';
            mainNavLogin.href = 'login.html';
        }
    }
    
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.disabled = !isLoggedIn;
        btn.title = isLoggedIn ? '' : 'Please log in to purchase';
    });
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const lastLogin = new Date(currentUser.lastLogin);
        const daysSinceLogin = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
        if (daysSinceLogin > 30) {
            localStorage.removeItem('currentUser');
            updateAuthUI();
            return null;
        }
    }
    
    updateAuthUI();
    return currentUser;
}

function protectPage() {
    const currentUser = checkAuth();
    const protectedPages = ['profile.html', 'transactions.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!currentUser) {
            if (confirm('Pika! You need to log in first to access this page. Go to login page?')) {
                window.location.href = `login.html?redirect=${currentPage}`;
            } else {
                window.location.href = 'index.html';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    protectPage();
    
    if (document.getElementById('registrationForm')) initRegistration();
    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('logoutBtn')) initLogout();
    
    document.querySelectorAll('.purchase-btn').forEach(btn => {
        btn.removeEventListener('click', btn._clickHandler);
        
        btn._clickHandler = function(e) {
            if (!localStorage.getItem('currentUser')) {
                e.preventDefault();
                if (confirm('Pika! You need to log in first to make purchases. Go to login page?')) {
                    window.location.href = `login.html?redirect=${window.location.pathname.split('/').pop()}`;
                }
            }
        };
        
        btn.addEventListener('click', btn._clickHandler);
    });
});
