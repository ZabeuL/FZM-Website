/**
 * FZM Renovations - Main Application Logic
 * Handles dynamic content injection and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure siteData is available
    if (typeof siteData === 'undefined') {
        console.error('Site data not loaded!');
        return;
    }

    initGlobalContent();
    initMobileMenu();
    initWhatsAppButton();

    // Page specific initializations
    if (document.querySelector('.hero')) initHero();
    if (document.querySelector('.benefits-grid')) initBenefits();
    if (document.querySelector('.testimonials')) initTestimonials();
    if (document.querySelector('.gallery-grid')) initGallery();
    if (document.querySelector('.contact-wrapper')) initContact();
});

/**
 * Initialize Global Content (Phone, Email, Location)
 */
function initGlobalContent() {
    const { general } = siteData;

    // Update all elements with data-content attribute matching specific keys
    document.querySelectorAll('[data-content="phone"]').forEach(el => {
        if (el.tagName === 'A') {
            el.href = `tel:${general.phone.replace(/[^0-9]/g, '')}`;
            // Only replace text if it's empty (like in footer)
            if (el.textContent.trim() === '') {
                el.textContent = general.phone;
            }
        } else {
            el.textContent = general.phone;
        }
    });

    document.querySelectorAll('[data-content="email"]').forEach(el => {
        if (el.tagName === 'A') {
            el.href = `mailto:${general.email}`;
            if (el.textContent.trim() === '') {
                el.textContent = general.email;
            }
        } else {
            el.textContent = general.email;
        }
    });

    document.querySelectorAll('[data-content="location"]').forEach(el => el.textContent = general.location);

    // Floating CTA
    const floatingCta = document.querySelector('.floating-cta');
    if (floatingCta) {
        floatingCta.href = `tel:${general.phone.replace(/[^0-9]/g, '')}`;
    }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
}

/**
 * Initialize Hero Section
 */
function initHero() {
    const { hero } = siteData;
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        heroSection.style.backgroundImage = `url('${hero.backgroundImage}')`;
        heroSection.innerHTML = `
            <div class="hero-content">
                <h1>${hero.title}</h1>
                <p>${hero.subtitle}</p>
                <a href="${hero.ctaLink}" class="btn">${hero.ctaText}</a>
            </div>
        `;
    }
}

/**
 * Initialize Benefits Section
 */
function initBenefits() {
    const container = document.querySelector('.benefits-grid');
    if (!container) return;

    siteData.benefits.forEach(benefit => {
        const card = document.createElement('div');
        card.className = 'benefit-card';
        card.innerHTML = `
            <div class="benefit-icon">${benefit.icon}</div>
            <h3>${benefit.title}</h3>
            <p>${benefit.description}</p>
        `;
        container.appendChild(card);
    });
}

/**
 * Initialize Testimonials Section (Carousel)
 */
function initTestimonials() {
    const container = document.querySelector('.testimonials .container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = `
        <h2 class="text-center">What Our Clients Say</h2>
        <div class="testimonials-carousel">
            <div class="testimonial-track"></div>
        </div>
        <div class="carousel-controls">
            <button class="carousel-btn prev-btn" aria-label="Previous Review">❮</button>
            <button class="carousel-btn next-btn" aria-label="Next Review">❯</button>
        </div>
        <div class="carousel-dots"></div>
    `;

    const track = container.querySelector('.testimonial-track');
    const dotsContainer = container.querySelector('.carousel-dots');

    siteData.testimonials.forEach((testimonial, index) => {
        // Create Slide
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-card">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-location">${testimonial.location}</div>
                <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}</div>
            </div>
        `;
        track.appendChild(slide);

        // Create Dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        updateCarousel();
    }

    // Event Listeners
    container.querySelector('.prev-btn').addEventListener('click', () => goToSlide(currentSlide - 1));
    container.querySelector('.next-btn').addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto Play
    setInterval(() => goToSlide(currentSlide + 1), 8000);
}

/**
 * Initialize Gallery Section
 */
function initGallery() {
    const container = document.querySelector('.gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!container) return;

    // Render all items initially
    renderGalleryItems('all');

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            renderGalleryItems(filter);
        });
    });

    function renderGalleryItems(filter) {
        container.innerHTML = '';

        const items = filter === 'all'
            ? siteData.gallery
            : siteData.gallery.filter(item => item.category === filter);

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="project-info">
                    <h3>${item.title}</h3>
                    <span class="text-gold">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

/**
 * Initialize Contact Section
 */
function initContact() {
    // Just ensuring dynamic data is there, form handling would go here
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will contact you shortly.');
            form.reset();
        });
    }
}

/**
 * Initialize WhatsApp Floating Button
 */
function initWhatsAppButton() {
    const whatsappNumber = '16478319449';
    const message = encodeURIComponent('Hello! I would like to know more about your renovation services.');

    const whatsappButton = document.createElement('a');
    whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    whatsappButton.target = '_blank';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.setAttribute('aria-label', 'Contact us on WhatsApp');
    whatsappButton.innerHTML = `
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.333c-2.547 0-5.053-0.727-7.2-2.093l-0.52-0.307-4.76 1.28 1.293-4.747-0.347-0.547c-1.5-2.373-2.293-5.12-2.293-7.92 0-7.36 5.987-13.333 13.333-13.333s13.333 5.973 13.333 13.333-5.987 13.333-13.333 13.333zM22.667 18.667c-0.373-0.187-2.2-1.093-2.547-1.213-0.347-0.133-0.6-0.187-0.853 0.187s-0.973 1.213-1.2 1.467c-0.213 0.253-0.44 0.28-0.813 0.093s-1.587-0.587-3.027-1.867c-1.12-0.987-1.867-2.213-2.093-2.587s-0.027-0.573 0.16-0.76c0.173-0.16 0.373-0.44 0.56-0.653 0.187-0.213 0.253-0.36 0.373-0.6 0.133-0.253 0.067-0.467-0.027-0.653s-0.853-2.053-1.173-2.813c-0.307-0.747-0.627-0.64-0.853-0.653-0.213-0.013-0.467-0.013-0.72-0.013s-0.667 0.093-1.013 0.467c-0.347 0.373-1.333 1.307-1.333 3.187s1.36 3.693 1.547 3.947c0.187 0.253 2.667 4.067 6.453 5.707 0.907 0.387 1.613 0.627 2.16 0.8 0.907 0.293 1.733 0.253 2.387 0.147 0.733-0.107 2.2-0.893 2.507-1.773s0.307-1.613 0.213-1.773c-0.080-0.187-0.333-0.293-0.707-0.48z"/>
        </svg>
    `;

    document.body.appendChild(whatsappButton);
}
