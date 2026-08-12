// =============================================
// LENIS SMOOTH SCROLL
// =============================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// =============================================
// GSAP + SCROLLTRIGGER REVEAL ANIMATIONS
// =============================================
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.reveal').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            }
        }
    );
});

// =============================================
// MAGNETIC BUTTONS
// =============================================
document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.4,
            ease: 'power2.out',
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)',
        });
    });
});

// =============================================
// CUSTOM CURSOR
// =============================================
const glow = document.getElementById('cursorGlow');
const dot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll('a, button, .work-card, .service-card, .about-card, .skill-pill').forEach((el) => {
    el.addEventListener('mouseenter', () => {
        glow.classList.add('hover');
        dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        glow.classList.remove('hover');
        dot.classList.remove('hover');
    });
});

// =============================================
// NUMBER COUNTING ANIMATION
// =============================================
function animateNumbers() {
    const stats = [
        { id: 'stat1', target: 5, suffix: '+' },
        { id: 'stat2', target: 45, suffix: '+' },
        { id: 'stat3', target: 3, suffix: '+' },
    ];

    stats.forEach((stat) => {
        const el = document.getElementById(stat.id);
        if (!el) return;

        el.textContent = '0';

        ScrollTrigger.create({
            trigger: el.closest('.stat'),
            start: 'top 85%',
            onEnter: () => {
                let current = 0;
                const duration = 1800;
                const steps = 60;
                const increment = stat.target / steps;
                const stepTime = duration / steps;

                const interval = setInterval(() => {
                    current += increment;
                    if (current >= stat.target) {
                        current = stat.target;
                        el.textContent = current + stat.suffix;
                        clearInterval(interval);
                    } else {
                        el.textContent = Math.floor(current) + stat.suffix;
                    }
                }, stepTime);
            },
            once: true,
        });
    });
}
animateNumbers();

// =============================================
// TYPEWRITER EFFECT
// =============================================
const typewriterEl = document.getElementById('typewriterText');

if (typewriterEl) {
    const phrases = [
        'Operational Excellence',
        'Administrative Systems',
        'Strategic Support',
        'Scalable Operations',
        'Founder\'s Ally',
        'Efficient Workflows'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isWaiting = true;
            speed = 2500;
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                typeWriter();
            }, speed);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
            setTimeout(typeWriter, speed);
            return;
        }

        if (!isWaiting) {
            setTimeout(typeWriter, speed);
        }
    }

    setTimeout(typeWriter, 800);
}

// =============================================
// TESTIMONIAL CAROUSEL (3.5s — unchanged)
// =============================================
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let currentIndex = 0;
let totalSlides = 0;
let slidesPerView = 1;
let autoSlideInterval = null;
const autoSlideDelay = 3500;

function getSlidesPerView() {
    return window.innerWidth >= 992 ? 2 : 1;
}

function updateCarousel() {
    slidesPerView = getSlidesPerView();
    const cards = track.querySelectorAll('.testimonial-card');
    totalSlides = cards.length;

    if (currentIndex > totalSlides - slidesPerView) {
        currentIndex = Math.max(0, totalSlides - slidesPerView);
    }

    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 24;
    const slideWidth = cardWidth + gap;
    const offset = currentIndex * slideWidth;

    gsap.to(track, {
        x: -offset,
        duration: 0.6,
        ease: 'power3.out',
    });

    const dots = dotsContainer.querySelectorAll('.dot');
    const totalDots = Math.ceil(totalSlides / slidesPerView);
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
    });
}

function createDots() {
    const cards = track.querySelectorAll('.testimonial-card');
    totalSlides = cards.length;
    const totalDots = Math.ceil(totalSlides / getSlidesPerView());

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(index) {
    const totalDots = Math.ceil(totalSlides / getSlidesPerView());
    if (index < 0) index = totalDots - 1;
    if (index >= totalDots) index = 0;
    currentIndex = index;
    updateCarousel();
}

function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
}

function resetAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

function initCarousel() {
    createDots();
    currentIndex = 0;
    updateCarousel();
    startAutoSlide();
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            createDots();
            currentIndex = 0;
            updateCarousel();
            resetAutoSlide();
        } else {
            updateCarousel();
        }
    }, 200);
});

if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

document.addEventListener('DOMContentLoaded', initCarousel);

// =============================================
// WORK CAROUSEL — CONTINUOUS SLOW SCROLL ✨
// =============================================
const workTrack = document.getElementById('workTrack');
const workDots = document.getElementById('workDots');
const workPrev = document.getElementById('workPrev');
const workNext = document.getElementById('workNext');

// Hide dots and navigation for work carousel
if (workDots) workDots.style.display = 'none';
if (workPrev) workPrev.style.display = 'none';
if (workNext) workNext.style.display = 'none';

function initWorkContinuousScroll() {
    const cards = workTrack.querySelectorAll('.work-card');
    const totalCards = cards.length;

    console.log(`✅ Work continuous scroll initializing with ${totalCards} cards`);

    if (totalCards === 0) {
        console.warn('⚠️ No work cards found!');
        return;
    }

    // Clone cards for seamless looping
    const cardsArray = Array.from(cards);
    cardsArray.forEach(card => {
        const clone = card.cloneNode(true);
        // Remove any potential ID conflicts
        clone.id = '';
        workTrack.appendChild(clone);
    });

    // Get the width of the original set (half of total track width)
    const totalWidth = workTrack.scrollWidth / 2;

    // Set up the animation
    const duration = 28; // seconds for a full cycle — nice and slow

    // Kill any existing animations on this element
    gsap.killTweensOf(workTrack);

    // Animate continuously from right to left
    gsap.to(workTrack, {
        x: -totalWidth,
        duration: duration,
        ease: 'none',
        repeat: -1,
        modifiers: {
            x: (x) => {
                // Keep the value within bounds for smooth looping
                const parsed = parseFloat(x);
                if (parsed <= -totalWidth * 1.5) {
                    return '0px';
                }
                return x;
            }
        }
    });

    // Optional: Pause on hover for better UX
    const wrapper = workTrack.closest('.work-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            gsap.to(workTrack, {
                animationPlayState: 'paused',
                duration: 0.3,
                ease: 'power2.out',
                onUpdate: function() {
                    workTrack.style.animationPlayState = 'paused';
                }
            });
            // Actually, with GSAP we need to pause the tween directly
            const tweens = gsap.getTweensOf(workTrack);
            tweens.forEach(t => t.pause());
        });

        wrapper.addEventListener('mouseleave', () => {
            const tweens = gsap.getTweensOf(workTrack);
            tweens.forEach(t => t.resume());
        });
    }
}

// Initialize work carousel on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkContinuousScroll);
} else {
    // Small delay to ensure layout is complete
    setTimeout(initWorkContinuousScroll, 100);
}

// Handle resize for work carousel
let workResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(workResizeTimeout);
    workResizeTimeout = setTimeout(() => {
        // Recalculate and restart animation
        const tweens = gsap.getTweensOf(workTrack);
        tweens.forEach(t => t.kill());

        // Reclone and restart
        // Remove clones first
        const cards = workTrack.querySelectorAll('.work-card');
        const cardsArray = Array.from(cards);
        const originalCount = 9; // we know there are 9 originals

        // Remove clones (keep first 9)
        if (cardsArray.length > originalCount) {
            cardsArray.slice(originalCount).forEach(clone => {
                if (clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }
            });
        }

        // Re-initialize
        initWorkContinuousScroll();
    }, 300);
});

// =============================================
// SPOTLIGHT ON WORK CARDS (still works)
// =============================================
document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// =============================================
// MOBILE NAV TOGGLE
// =============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('show');
            }
        });
    });
}

// =============================================
// SMOOTH SCROLL FOR NAV LINKS (with Lenis)
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.2,
                });
            }
        }
    });
});

// =============================================
// CONTACT FORM
// =============================================
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        const btn = this.querySelector('.btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = '#8FAD9A';
            btn.disabled = false;
            this.reset();
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// =============================================
// CONSOLE
// =============================================
console.log('✨ Gbemisola Odekeye · Premium Portfolio ready!');
console.log('🔥 Features: Lenis, GSAP, Custom Cursor, Glassmorphism, Blob, Grain, Number Counting, Typewriter Effect');
console.log('📊 Carousel Speeds: Work = continuous slow scroll (28s per cycle) | Testimonials = 3.5s');
console.log('📄 Download CV buttons added in About & Booking sections');
