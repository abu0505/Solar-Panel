// FAQ Accordion Toggle Function

function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('[data-lucide="chevron-down"]');
    const allItems = document.querySelectorAll('.faq-item');

    // Close all other FAQs
    allItems.forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('[data-lucide="chevron-down"]');
            otherAnswer.style.maxHeight = '0px';
            otherIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Toggle current FAQ
    if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
        answer.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }

    else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Savings Calculator Logic
function calculateSavings() {
    // Get slider values
    const monthlyBill = parseFloat(document.getElementById('bill-slider').value);
    const roofSize = parseFloat(document.getElementById('roof-slider').value);
    const sunHours = parseFloat(document.getElementById('sun-slider').value);

    // Update display values
    document.getElementById('bill-value').textContent = '$' + monthlyBill;
    document.getElementById('roof-value').textContent = roofSize;
    document.getElementById('sun-value').textContent = sunHours;

    // Solar panel calculations
    // Average solar panel is ~17.5 sq ft and produces ~350W
    const panelsCanFit = Math.floor(roofSize / 17.5);
    const systemSizeKW = (panelsCanFit * 350) / 1000; // Convert to kW

    // Daily production (kWh) = System Size (kW) × Sun Hours × 0.75 (efficiency factor)
    const dailyProduction = systemSizeKW * sunHours * 0.75;
    const monthlyProduction = dailyProduction * 30;
    const annualProduction = dailyProduction * 365;

    // Assume average electricity rate of $0.13 per kWh
    const electricityRate = 0.13;

    // Calculate savings (capped at monthly bill)
    const monthlySavingsCalc = Math.min(monthlyProduction * electricityRate, monthlyBill);
    const monthlySavings = Math.round(monthlySavingsCalc);
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * 25;

    // Environmental impact
    // 1 kWh = 0.92 lbs CO2, convert to tons
    const co2ReductionLbs = annualProduction * 0.92;
    const co2ReductionTons = (co2ReductionLbs / 2000).toFixed(1);

    // Average tree absorbs ~48 lbs CO2/year
    const treesEquivalent = Math.round(co2ReductionLbs / 48);

    // Update display
    document.getElementById('monthly-savings').textContent = '$' + monthlySavings.toLocaleString();
    document.getElementById('annual-savings').textContent = '$' + annualSavings.toLocaleString();
    document.getElementById('lifetime-savings').textContent = '$' + lifetimeSavings.toLocaleString();
    document.getElementById('co2-savings').textContent = co2ReductionTons + ' tons/year';
    document.getElementById('trees-equivalent').textContent = treesEquivalent + ' trees';

    // Update slider track colors
    updateSliderBackground('bill-slider');
    updateSliderBackground('roof-slider');
    updateSliderBackground('sun-slider');
}

function updateSliderBackground(sliderId) {
    const slider = document.getElementById(sliderId);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #eab308 0%, #eab308 ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    calculateSavings();
});

lucide.createIcons();

// ===== LENIS SMOOTH SCROLL =====
// Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
    duration: 1.2,           // Scroll animation duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function (easeOutExpo)
    orientation: 'vertical', // Scroll orientation
    gestureOrientation: 'vertical',
    smoothWheel: true,       // Smooth mouse wheel scrolling
    wheelMultiplier: 1,      // Mouse wheel speed multiplier
    touchMultiplier: 2,      // Touch scroll speed multiplier
    infinite: false,         // No infinite scroll
    autoResize: true,        // Auto resize on window resize
});

// Lenis animation frame loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ScrollTrigger for buttery smooth animations
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

console.log('🧈 Lenis smooth scroll initialized!');

// Scroll reveal animation
// Scroll reveal animation using GSAP
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

scrollRevealElements.forEach((el) => {
    // Check for stagger classes
    let delay = 0;
    if (el.classList.contains('stagger-1')) delay = 0.1;
    if (el.classList.contains('stagger-2')) delay = 0.2;
    if (el.classList.contains('stagger-3')) delay = 0.3;
    if (el.classList.contains('stagger-4')) delay = 0.4;
    if (el.classList.contains('stagger-5')) delay = 0.5;

    gsap.fromTo(el,
        { autoAlpha: 0, y: 50 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: delay,
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Image reveal animation
const imageRevealElements = document.querySelectorAll('.image-reveal');
imageRevealElements.forEach((el) => {
    gsap.fromTo(el,
        { clipPath: "inset(0 100% 0 0)" },
        {
            clipPath: "inset(0 0 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// About section image animation
const aboutContainer = document.querySelector('.scroll-reveal-about');
const aboutImages = document.querySelectorAll('.about-img');

const revealAboutImages = () => {
    if (aboutContainer) {
        const rect = aboutContainer.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            aboutImages.forEach(img => {
                img.classList.add('revealed');
            });
        }
    }
};

window.addEventListener('scroll', revealAboutImages);
revealAboutImages();

// Counter animation
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

const animateCounters = () => {
    if (counterAnimated) return;

    counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            counterAnimated = true;
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 50;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
        }
    });
};

window.addEventListener('scroll', animateCounters);
animateCounters();

// Back to top button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
    } else {
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.animate-float');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Navbar background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('bg-black/95');
    } else {
        nav.classList.remove('bg-black/95');
    }
});

// Bento Grid Spotlight Effect
const bentoCards = document.querySelectorAll('.bento-card');

bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 3D Stacked Testimonial Carousel
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('#testimonial-dots span');
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');
let currentTestimonial = 0;
const totalTestimonials = testimonialCards.length;

function updateTestimonialCarousel() {
    testimonialCards.forEach((card, index) => {
        card.classList.remove('center', 'left', 'right', 'hidden-left', 'hidden-right');

        const diff = (index - currentTestimonial + totalTestimonials) % totalTestimonials;

        if (diff === 0) {
            card.classList.add('center');
        } else if (diff === 1 || diff === -totalTestimonials + 1) {
            card.classList.add('right');
        } else if (diff === totalTestimonials - 1 || diff === -1) {
            card.classList.add('left');
        } else if (diff <= totalTestimonials / 2) {
            card.classList.add('hidden-right');
        } else {
            card.classList.add('hidden-left');
        }
    });

    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('bg-yellow-400', index === currentTestimonial);
        dot.classList.toggle('bg-gray-600', index !== currentTestimonial);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialCarousel();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialCarousel();
}

nextBtn.addEventListener('click', nextTestimonial);
prevBtn.addEventListener('click', prevTestimonial);

// Click on side cards to bring to center
testimonialCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (card.classList.contains('left')) {
            prevTestimonial();
        } else if (card.classList.contains('right')) {
            nextTestimonial();
        }
    });
});

// Arrow key support for testimonials
document.addEventListener('keydown', (e) => {
    const carousel = document.getElementById('testimonial-carousel');
    const rect = carousel.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    }
});

// Auto-play testimonials
let testimonialInterval = setInterval(nextTestimonial, 5000);

document.getElementById('testimonial-carousel').addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

document.getElementById('testimonial-carousel').addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(nextTestimonial, 5000);
});

// Initialize testimonial carousel
updateTestimonialCarousel();

// GSAP Horizontal Scroll for Projects Section (Buttery Smooth)
const projectTrack = document.getElementById('project-track');
const projectsContainer = document.getElementById('projects-container');

function setupHorizontalScroll() {
    // Clear any existing ScrollTrigger for this element
    ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === projectsContainer) {
            st.kill();
        }
    });

    const trackWidth = projectTrack.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = trackWidth - viewportWidth + 100;

    // Set container height based on scroll distance
    projectsContainer.style.height = `${scrollDistance + window.innerHeight}px`;

    // Apply GPU acceleration to project track
    gsap.set(projectTrack, {
        willChange: 'transform',
        force3D: true
    });

    gsap.to(projectTrack, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
            trigger: projectsContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,              // Smoother scrub value
            pin: ".sticky",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            preventOverlaps: true,
        }
    });
}

// Initialize horizontal scroll
setupHorizontalScroll();

// Recalculate on resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

// Particle animation for hero section
function createParticle() {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random horizontal position
    const startX = Math.random() * 100;
    particle.style.left = `${startX}%`;
    particle.style.bottom = '0';

    // Random animation duration between 6s and 12s
    const duration = Math.random() * 6 + 6;
    particle.style.animationDuration = `${duration}s`;

    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    particle.style.setProperty('--drift', `${drift}px`);

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

// Create particles at intervals
setInterval(createParticle, 300);

// Create initial batch of particles
for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, i * 150);
}

// Typewriter effect for rotating words
const words = ['Future', 'Business', 'Home', 'Planet'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 150;
const deletingSpeed = 100;
const delayBetweenWords = 2000;

function typeWriter() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        // Remove characters
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeWriter, 500);
            return;
        }
    } else {
        // Add characters
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeWriter, delayBetweenWords);
            return;
        }
    }

    setTimeout(typeWriter, isDeleting ? deletingSpeed : typingSpeed);
}

// Start typewriter effect
setTimeout(typeWriter, 1000);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Open menu
mobileMenuBtn.addEventListener('click', openMobileMenu);

// Close menu - close button
mobileMenuClose.addEventListener('click', closeMobileMenu);

// Close menu - overlay click
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

// Close menu - link click
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close menu - escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ===== TOUCH/SWIPE SUPPORT FOR TESTIMONIALS =====
let touchStartX = 0;
let touchEndX = 0;
const testimonialCarousel = document.getElementById('testimonial-carousel');

if (testimonialCarousel) {
    testimonialCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleTestimonialSwipe();
    });

    function handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    }
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    // Reinitialize lucide icons after theme is applied
    setTimeout(() => lucide.createIcons(), 10);
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    // Save preference to localStorage
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }

    // Reinitialize lucide icons to update the toggle button icon
    setTimeout(() => lucide.createIcons(), 50);
});

// ===== PREMIUM CURSOR FOLLOWER =====
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    // Instant dot follow
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow with lerp
    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .bento-card, .project-card, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
    });
}


// ===== ENHANCED MICROINTERACTIONS =====


// 3D Card Tilt Effect
const tiltCards = document.querySelectorAll('.card-tilt');

// Apple TV-Style 3D Card Tilt Effect
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Percentage-based rotation (50% of ±20deg = ±10deg max)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        // Instant transition for responsive feel
        card.style.transition = 'transform 0.1s ease-out';

        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);

        // Dynamic lighting position (percentage)
        const mouseXPercent = (x / rect.width) * 100;
        const mouseYPercent = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
        card.style.setProperty('--mouse-y', `${mouseYPercent}%`);
    });

    card.addEventListener('mouseleave', () => {
        // Smooth transition for elegant return
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';

        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// Enhanced Parallax Effect with Mouse Movement
let parallaxEnabled = true;

document.addEventListener('mousemove', (e) => {
    if (!parallaxEnabled) return;

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Slow parallax elements
    document.querySelectorAll('.parallax-slow').forEach((el) => {
        const speed = 15;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Medium parallax elements
    document.querySelectorAll('.parallax-medium').forEach((el) => {
        const speed = 25;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Fast parallax elements
    document.querySelectorAll('.parallax-fast').forEach((el) => {
        const speed = 35;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Disable parallax on mobile for performance
if (window.innerWidth < 768) {
    parallaxEnabled = false;
}

// Ripple Effect on Button Click
document.querySelectorAll('.ripple-container').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Magnetic Button Effect
const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// Smooth scroll with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        return;
    }

    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        lastScrollY = window.scrollY;
    }, 10);
}, { passive: true });

console.log('✨ Enhanced microinteractions loaded successfully!');

// ===== PRELOADER =====
const preloader = document.getElementById('preloader');
if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger navbar entrance after preloader
            const mainNav = document.getElementById('main-nav');
            if (mainNav) {
                mainNav.classList.remove('navbar-hidden');
            }
        }, 2000); // Wait for preloader animation to complete
    });
}

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ===== STICKY SECTION INDICATOR =====
const sectionIndicator = document.getElementById('section-indicator');
if (sectionIndicator) {
    const indicatorItems = sectionIndicator.querySelectorAll('.section-indicator-item');
    const sections = [];

    // Gather sections that correspond to indicator items
    indicatorItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href) {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ element: section, indicator: item, id: href });
            }
        }
    });

    // Create IntersectionObserver to detect which section is in view
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near center of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all indicators
                indicatorItems.forEach(item => item.classList.remove('active'));

                // Add active to the corresponding indicator
                const activeSection = sections.find(s => s.element === entry.target);
                if (activeSection) {
                    activeSection.indicator.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section.element);
    });

    // Also handle the hero section (which may not have an ID always)
    const heroSection = document.querySelector('#home') || document.querySelector('section:first-of-type');
    if (heroSection && !sections.find(s => s.element === heroSection)) {
        sectionObserver.observe(heroSection);
    }

    console.log('📍 Section indicator initialized with', sections.length, 'sections');
}

// ===== HERO FLOATING ELEMENTS ANIMATION (GSAP) =====
const heroFloat1 = document.querySelector('.hero-float-1');
const heroFloat2 = document.querySelector('.hero-float-2');

if (heroFloat1) {
    gsap.to(heroFloat1, {
        y: -30,
        x: 15,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
}

if (heroFloat2) {
    gsap.to(heroFloat2, {
        y: 20,
        x: -20,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
}

// ===== ANNOUNCEMENT BAR =====
const announcementBar = document.getElementById('announcement-bar');
const announcementClose = document.getElementById('announcement-close');

if (announcementBar && announcementClose) {
    // Check if already dismissed
    if (localStorage.getItem('announcement-dismissed') === 'true') {
        announcementBar.classList.add('hidden');
    }

    announcementClose.addEventListener('click', () => {
        announcementBar.classList.add('hidden');
        localStorage.setItem('announcement-dismissed', 'true');
    });
}

// ===== COOKIE CONSENT =====
const cookieConsent = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');

if (cookieConsent) {
    const cookieChoice = localStorage.getItem('cookie-consent');

    if (!cookieChoice) {
        // Show cookie consent after 2 seconds
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            cookieConsent.classList.remove('show');
            setTimeout(() => cookieConsent.classList.add('hidden'), 400);
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'declined');
            cookieConsent.classList.remove('show');
            setTimeout(() => cookieConsent.classList.add('hidden'), 400);
        });
    }
}

// ===== VIDEO MODAL =====
const videoModal = document.getElementById('video-modal');
const videoModalClose = document.getElementById('video-modal-close');
const watchVideoBtn = document.getElementById('hero-btn-secondary');

if (videoModal) {
    // Open modal when "Watch Video" button is clicked
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (videoModalClose) {
        videoModalClose.addEventListener('click', () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== LIVE CHAT WIDGET =====
const chatWidget = document.getElementById('chat-widget');
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');

if (chatWidget && chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
    });

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWidget.classList.remove('open');
        });
    }
}

// ===== SOCIAL PROOF NOTIFICATIONS =====
const socialProof = document.getElementById('social-proof');
const socialProofText = document.getElementById('social-proof-text');
const socialProofClose = document.getElementById('social-proof-close');

if (socialProof && socialProofText) {
    const proofMessages = [
        { name: 'John', location: 'California', savings: '$2,400' },
        { name: 'Sarah', location: 'Texas', savings: '$3,100' },
        { name: 'Michael', location: 'Arizona', savings: '$2,850' },
        { name: 'Emily', location: 'Florida', savings: '$2,200' },
        { name: 'David', location: 'Nevada', savings: '$3,500' }
    ];

    let currentIndex = 0;
    let proofInterval;
    let isProofVisible = false;

    function showProof() {
        const msg = proofMessages[currentIndex];
        socialProofText.textContent = `${msg.name} from ${msg.location} just saved ${msg.savings}/year!`;
        socialProof.classList.add('show');
        isProofVisible = true;

        // Hide after 5 seconds
        setTimeout(() => {
            socialProof.classList.remove('show');
            isProofVisible = false;
            currentIndex = (currentIndex + 1) % proofMessages.length;
        }, 5000);
    }

    // Start showing proofs after 5 seconds
    setTimeout(() => {
        showProof();
        proofInterval = setInterval(showProof, 12000); // Show every 12 seconds
    }, 5000);

    if (socialProofClose) {
        socialProofClose.addEventListener('click', () => {
            socialProof.classList.remove('show');
            clearInterval(proofInterval);
        });
    }
}

console.log('🚀 Preloader, scroll progress, navbar animations, and professional elements initialized!');