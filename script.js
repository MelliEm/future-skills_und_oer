// ===== Hauptinitialisierung =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeAnimations();
    initializeScrollFeatures();
    setupKeyboardNavigation();
    setupThemeToggle();
});

// ===== Suchfunktionalität =====
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const cards = document.querySelectorAll('.card');
    
    searchInput?.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = Array.from(cards).filter(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const content = card.querySelector('p')?.textContent.toLowerCase() || '';
            return title.includes(searchTerm) || content.includes(searchTerm);
        });

        displaySearchResults(results, searchTerm);
    }, 300));
}

// ==== Side Nav ====
// Menü Toggle Funktion
function toggleMenu() {
    document.querySelector('.nav-sidebar').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
}

// Links im Mobile-Menü schließen das Menü
document.querySelectorAll('.nav-sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    });
});

// Scroll to Top Funktion
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Nach-oben-Button Ein-/Ausblenden
window.onscroll = function() {
    const topBtn = document.getElementById('topBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topBtn.style.display = 'block';
    } else {
        topBtn.style.display = 'none';
    }
    
    // Aktiven Abschnitt in der Navigation markieren
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-sidebar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
};


// ===== Animations-Initialisierung =====
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const grid = entry.target;
                animateGrid(grid);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.grid.fade-in-side, .grid.scale-in').forEach(grid => {
        observer.observe(grid);
    });
}

// ===== Scroll-Features-Initialisierung =====
function initializeScrollFeatures() {
    const scrollButton = createScrollTopButton();
    const progressBar = createProgressBar();
    
    document.body.appendChild(scrollButton);
    document.body.appendChild(progressBar);
}

// ===== Hilfsfunktionen =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function displaySearchResults(results, searchTerm) {
    const searchResults = document.getElementById('searchResults');
    
    if (!results.length) {
        searchResults.innerHTML = `<p class="no-results">Keine Ergebnisse für "${searchTerm}" gefunden.</p>`;
    } else {
        searchResults.innerHTML = results.map(card => `
            <div class="search-result">
                <h4>${card.querySelector('h3').textContent}</h4>
                <p>${card.querySelector('p').textContent}</p>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

function animateGrid(grid) {
    const cards = grid.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = null;
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function createScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-top-btn';
    
    window.addEventListener('scroll', () => {
        button.classList.toggle('show', window.scrollY > 500);
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return button;
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    return progressBar;
}

// ===== Zusatzfunktionen =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const searchResults = document.getElementById('searchResults');
            const searchInput = document.getElementById('searchInput');
            if (searchResults.style.display === 'block') {
                searchResults.style.display = 'none';
                searchInput.value = '';
                searchInput.blur();
            }
        }
    });
}

function setupThemeToggle() {
    // Prüfe gespeicherte Theme-Einstellung
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }

    const themeSwitcher = document.createElement('button');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = '🌓';
    
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', 
            document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        );
    });
    
    document.body.appendChild(themeSwitcher);
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
});
