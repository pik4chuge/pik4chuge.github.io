document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
    animateStats();
});

function loadUserData() {
    const isLoggedIn = true; 

    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        console.warn("No user data found.");
        return;
    }

    document.getElementById('username').textContent = user.ign.toUpperCase();
    document.getElementById('profilePlayerId').textContent = `ID: ${user.playerId}`;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileBirthdate').textContent = new Date(user.birthdate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    }) || 'Not specified';
    document.getElementById('profileGender').textContent = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
    document.getElementById('joinDate').textContent = user.joinDate;
    document.getElementById('userBio').textContent = user.bio || "No bio available.";

    // Set stats for animation
    document.getElementById('pokemonCaught').dataset.value = 524;
    document.getElementById('gymsDefended').dataset.value = 23;
    document.getElementById('itemsPurchased').dataset.value = 5023;
    document.getElementById('totalSpent').dataset.value = 25242;

    // Load avatar if exists
    if (user.avatar) {
        document.getElementById('userAvatar').src = user.avatar;
    }
}

function setupEventListeners() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            alert('Edit profile functionality would open a form here, if it was actually implemented! Pika!');
        });
    }

    const editAvatarBtn = document.getElementById('editAvatarBtn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        document.getElementById('userAvatar').src = e.target.result;

                        // Save to localStorage
                        let user = JSON.parse(localStorage.getItem('currentUser'));
                        if (user) {
                            user.avatar = e.target.result;
                            localStorage.setItem('currentUser', JSON.stringify(user));
                        }
                    };

                    reader.readAsDataURL(this.files[0]);
                }
            });

            input.click();
        });
    }

    const editBioBtn = document.getElementById('editBioBtn');
    if (editBioBtn) {
        editBioBtn.addEventListener('click', function() {
            const bioText = document.getElementById('userBio').textContent;
            const newBio = prompt('Update your bio:', bioText);

            if (newBio !== null && newBio.trim() !== '') {
                document.getElementById('userBio').textContent = newBio;

                let user = JSON.parse(localStorage.getItem('currentUser'));
                if (user) {
                    user.bio = newBio;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            alert('Logging out...');
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('add-pokemon')) {
                alert('Sorry, you cannot add any more Pokémon! Pika Pi!');
            } else {
                const pokemonName = this.querySelector('h4').textContent;
                alert(`Viewing details for ${pokemonName}`);
            }
        });
    });

    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.card').querySelector('h2').textContent.trim();
            alert(`Viewing all ${section}`);
        });
    });
}

function animateStats() {
    const statElements = [
        document.getElementById('pokemonCaught'),
        document.getElementById('gymsDefended'),
        document.getElementById('itemsPurchased'),
        document.getElementById('totalSpent')
    ];

    statElements.forEach(element => {
        if (!element) return;

        const finalValue = parseInt(element.dataset.value);
        const duration = 2000; 
        const stepTime = 50; 
        const totalSteps = duration / stepTime;
        const stepValue = finalValue / totalSteps;

        let currentValue = 0;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            currentValue += stepValue;

            if (currentStep >= totalSteps) {
                clearInterval(interval);
                element.textContent = finalValue;
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    });
}
