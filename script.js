// Hauptinitialisierung
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeAnimations();
    initializeScrollFeatures();
    setupKeyboardNavigation();
    setupThemeToggle();
    initializeNavigation();
    
    // Button-Funktionalität für "Jetzt lesen"
    const readButton = document.querySelector('.btn-primary');
    if (readButton) {
        readButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToDefinitions();
        });
    }

    // Download-Button Funktionalität
    const downloadButton = document.querySelector('.download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            downloadPDF(this);
        });
    }
});

    try {
        const pdfUrl = 'https://github.com/MelliEm/future-skills_und_oer/blob/main/download/pdf_download.pdf';
        
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'pdf_download.pdf';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download fehlgeschlagen:', error);
        alert('Download fehlgeschlagen. Bitte versuchen Sie es später erneut.');
    } finally {
        spinner.classList.add('hidden');
        button.disabled = false;
    }
}




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

// ===== Scroll Features Initialisierung =====
function initializeScrollFeatures() {
    const topBtn = document.getElementById('topBtn');
    if (!topBtn) return;

    // Scroll Event Handler für Back to Top Button
    window.addEventListener('scroll', debounce(() => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    }, 100));

    // Click Event für Back to Top Button
    topBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTop();
    });

    // Scroll Spy für Navigation
    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-sidebar a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

// ===== Suchfunktionalität =====
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;

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

// ===== Animation Initialisierung =====
function initializeAnimations() {
    // Hier können Animationen initialisiert werden
    // Zum Beispiel mit IntersectionObserver für Scroll-Animationen
}

// ===== Keyboard Navigation =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const nav = document.querySelector('.nav-sidebar');
            const overlay = document.querySelector('.overlay');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });
}

// ===== Theme Toggle =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

// ===== Utility Funktionen =====
function toggleMenu() {
    const nav = document.querySelector('.nav-sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (!nav || !overlay) return;

    nav.classList.toggle('active');
    overlay.classList.toggle('active');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

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

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, '\nLine:', e.lineno, '\nFile:', e.filename);
    
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

// ===== Suchresultate anzeigen =====
function displaySearchResults(results, searchTerm) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        searchResults.style.display = 'block';
        return;
    }

    const resultsHtml = results.map(card => `
        <div class="search-result">
            <h4>${card.querySelector('h3').textContent}</h4>
            <p>${card.querySelector('p').textContent}</p>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHtml;
    searchResults.style.display = 'block';
}


// ===== Scroll zu Definitionen =====
function scrollToDefinitions() {
    const definitionSection = document.getElementById('definitions');
    if (definitionSection) {
        const offset = 20; // Abstand von der Oberseite
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = definitionSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } else {
        console.error('Section with ID "definitions" not found');
    }
}

// Füge dies zur Hauptinitialisierung hinzu
document.addEventListener('DOMContentLoaded', function() {
    // ... bestehender Code ...
    
    // Button-Funktionalität initialisieren
    const readButton = document.querySelector('.btn-primary');
    if (readButton) {
        readButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToDefinitions();
        });
    }
});
