// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Epstein Island loaded.');

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Simple fade-in animation for hero content
    const content = document.querySelector('.hero-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'all 1.5s ease-out';

        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 500);
    }

    // Scroll animation for fact cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Reset styles when scrolling away so it animates again
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fact-card').forEach(card => {
        observer.observe(card);
    });
});
