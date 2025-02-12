document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        // Hier kannst du später die Suchlogik implementieren
    });
});

// Intersection Observer für Animationen
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('fade-in-side')) {
                entry.target.querySelectorAll('.card').forEach(card => {
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = null;
                });
            }
            if (entry.target.classList.contains('scale-in')) {
                entry.target.querySelectorAll('.card').forEach(card => {
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = null;
                });
            }
        }
    });
}, {
    threshold: 0.2
});

// Beobachte alle Grids mit Animationen
document.querySelectorAll('.grid.fade-in-side, .grid.scale-in').forEach(grid => {
    observer.observe(grid);
});
