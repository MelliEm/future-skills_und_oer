// ===== Hauptinitialisierung =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeAnimations();
    initializeScrollFeatures();
    setupKeyboardNavigation();
    setupThemeToggle();
    initializeNavigation(); // Neue Funktion
});

// ===== Navigation Initialisierung =====
function initializeNavigation() {
    // Verbesserte Scroll-to-Section Funktion
    document.querySelectorAll('.nav-sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            const section = document.querySelector(sectionId);
            
            if (section) {
                const offset = 20;
                const bodyRect = document.body.getBoundingClientRect().top;
                const sectionRect = section.getBoundingClientRect().top;
                const sectionPosition = sectionRect - bodyRect;
                const offsetPosition = sectionPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // Nur auf Mobile das Menü schließen
            if (window.innerWidth < 768) {
                toggleMenu();
            }
        });
    });

    // Desktop Navigation Hover-Effekt
    const nav = document.querySelector('.nav-sidebar');
    const body = document.body;

    if (window.matchMedia('(min-width: 768px)').matches) {
        nav.addEventListener('mouseenter', () => {
            body.classList.add('nav-open');
        });

        nav.addEventListener('mouseleave', () => {
            body.classList.remove('nav-open');
        });
    }
}

// ===== Suchfunktionalität =====
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return; // Frühe Rückgabe wenn Elemente nicht existieren

    const cards = document.querySelectorAll('.card');
    
    searchInput.addEventListener('input', debounce(function(e) {
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

// ==== Menü Funktionen ====
function toggleMenu() {
    const nav = document.querySelector('.nav-sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (!nav || !overlay) return;

    nav.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ===== Scroll Funktionen =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Verbessertes Scroll-Event-Handling
const handleScroll = debounce(() => {
    const topBtn = document.getElementById('topBtn');
    const scrollPosition = window.scrollY;
    
    // Nach-oben-Button Handling
    if (topBtn) {
        topBtn.style.display = scrollPosition > 20 ? 'block' : 'none';
    }
    
    // Aktive Navigation markieren
    let currentSection = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollPosition >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-sidebar a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSection);
    });
}, 100);

window.addEventListener('scroll', handleScroll);

// [Rest des Codes bleibt gleich...]

// ===== Verbesserte Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, '\nLine:', e.lineno, '\nFile:', e.filename);
    
    // Optional: Benutzerfreundliche Fehlermeldung
    if (process.env.NODE_ENV !== 'production') {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #ff5252;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 9999;
        `;
        errorMessage.textContent = `Ein Fehler ist aufgetreten: ${e.message}`;
        document.body.appendChild(errorMessage);
        
        setTimeout(() => errorMessage.remove(), 5000);
    }
});

// Verbesserte Performance durch RequestAnimationFrame
function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, targetPosition, duration);
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}
