// script.js — Epstein Island Premium

document.addEventListener('DOMContentLoaded', () => {

    // ---- Force scroll to top on refresh ----
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ---- Subtle parallax on hero background ----
    const bg = document.querySelector('.background-container');
    if (bg) {
        bg.style.transform = 'scale(1)';
    }

    // ---- Header scroll effect ----
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax on background
        if (bg && currentScroll < window.innerHeight) {
            const parallaxOffset = currentScroll * 0.3;
            bg.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ---- Scroll animations (IntersectionObserver) ----
    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Observe fact cards
    document.querySelectorAll('.fact-card').forEach(card => {
        observer.observe(card);
    });

    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });

    // ---- Floating Particles ----
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.growing = Math.random() > 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.6) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.05) this.growing = true;
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles (fewer for performance)
        const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Pause particles when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // ---- Smooth reveal for scroll indicator ----
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.5s ease';
            }
        }, { passive: true });
    }
});
