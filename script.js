// script.js — Epstein Island Premium

document.addEventListener('DOMContentLoaded', () => {

    // ---- Force scroll to top on refresh ----
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ---- Header scroll effect ----
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
    document.querySelectorAll('.section-header:not(.gallery-header)').forEach(el => {
        observer.observe(el);
    });

    // ---- Facts section close button ----
    const factsClose = document.getElementById('facts-close');
    const factsSection = document.getElementById('facts-section');

    if (factsClose && factsSection) {
        // Create the reopen button
        const reopenBtn = document.createElement('button');
        reopenBtn.className = 'facts-reopen';
        reopenBtn.textContent = '◆ WHAT WE OFFER';
        reopenBtn.style.display = 'none';
        factsSection.parentNode.insertBefore(reopenBtn, factsSection);

        factsClose.addEventListener('click', () => {
            factsSection.classList.add('hidden');
            setTimeout(() => {
                reopenBtn.style.display = 'flex';
            }, 800);
        });

        reopenBtn.addEventListener('click', () => {
            reopenBtn.style.display = 'none';
            factsSection.classList.remove('hidden');
        });
    }

    // ---- Dynamic Photo Gallery ----
    const galleryTrack = document.getElementById('gallery-track');
    const galleryCounter = document.getElementById('gallery-counter');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    // Track all loaded photo sources for lightbox navigation
    const loadedPhotos = [];

    if (galleryTrack) {
        // Try loading photos with various extensions
        const extensions = ['jpeg', 'jpg', 'png', 'webp', ''];
        let photoCount = 0;
        let maxCheck = 20; // Check up to photo20

        function tryLoadPhoto(index) {
            if (index > maxCheck) {
                // All done checking, update counter
                if (galleryCounter) {
                    galleryCounter.textContent = photoCount + ' PHOTOS';
                }
                if (photoCount === 0 && galleryTrack) {
                    galleryTrack.innerHTML = '<p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; letter-spacing: 2px;">No photos found. Add photo1.jpg, photo2.jpg, etc. to the project folder.</p>';
                }
                return;
            }

            let loaded = false;

            function tryExt(extIndex) {
                if (extIndex >= extensions.length) {
                    // None of the extensions worked for this index
                    tryLoadPhoto(index + 1);
                    return;
                }

                const ext = extensions[extIndex];
                const filename = ext ? `photo${index}.${ext}` : `photo${index}`;
                const img = new Image();

                img.onload = function () {
                    if (!loaded) {
                        loaded = true;
                        photoCount++;

                        const item = document.createElement('div');
                        item.className = 'gallery-item';

                        const displayImg = document.createElement('img');
                        displayImg.src = filename;
                        displayImg.alt = `Island Photo ${index}`;
                        displayImg.loading = 'lazy';

                        item.appendChild(displayImg);
                        galleryTrack.appendChild(item);
                        loadedPhotos.push(filename);

                        // Click to open lightbox
                        item.addEventListener('click', () => {
                            openLightbox(filename, loadedPhotos);
                        });

                        tryLoadPhoto(index + 1);
                    }
                };

                img.onerror = function () {
                    if (!loaded) {
                        tryExt(extIndex + 1);
                    }
                };

                img.src = filename;
            }

            tryExt(0);
        }

        tryLoadPhoto(1);

        // Gallery scroll controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                galleryTrack.scrollBy({ left: -420, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                galleryTrack.scrollBy({ left: 420, behavior: 'smooth' });
            });
        }
    }

    // ---- Lightbox with navigation ----
    function openLightbox(src, photos) {
        const existing = document.querySelector('.lightbox');
        if (existing) existing.remove();

        let currentIndex = photos.indexOf(src);

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.textContent = '✕';

        const prevArrow = document.createElement('button');
        prevArrow.className = 'lightbox-arrow lightbox-prev';
        prevArrow.innerHTML = '‹';

        const nextArrow = document.createElement('button');
        nextArrow.className = 'lightbox-arrow lightbox-next';
        nextArrow.innerHTML = '›';

        const img = document.createElement('img');
        img.src = src;

        const counter = document.createElement('span');
        counter.className = 'lightbox-counter';
        counter.textContent = `${currentIndex + 1} / ${photos.length}`;

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(prevArrow);
        lightbox.appendChild(nextArrow);
        lightbox.appendChild(img);
        lightbox.appendChild(counter);
        document.body.appendChild(lightbox);

        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });

        function navigate(direction) {
            currentIndex = (currentIndex + direction + photos.length) % photos.length;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.src = photos[currentIndex];
                img.style.opacity = '1';
                counter.textContent = `${currentIndex + 1} / ${photos.length}`;
            }, 200);
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 400);
            document.removeEventListener('keydown', onKey);
        }

        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(-1);
        });

        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(1);
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener('click', closeLightbox);

        img.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        function onKey(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        }
        document.addEventListener('keydown', onKey);
    }

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
