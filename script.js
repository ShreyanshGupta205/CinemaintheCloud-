// your code goes here
document.addEventListener('DOMContentLoaded', function() {

    // ======== SMOOTH SCROLL FOR NAV LINKS ========
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ======== FADE-IN ON SCROLL ANIMATION ========
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // ======== HERO SECTION 3D PARALLAX EFFECT ON MOUSE MOVE ========
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content-wrapper');

    heroSection.addEventListener('mousemove', function(e) {
        // Get mouse position relative to the center of the screen
        const x = (window.innerWidth / 2 - e.pageX) / 25; // Divide for less dramatic effect
        const y = (window.innerHeight / 2 - e.pageY) / 25;

        // Apply a 3D transform to the hero content
        // rotateY controls left-right tilt, rotateX controls top-bottom tilt
        heroContent.style.transform = `rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    });

    // Reset transform when mouse leaves the hero section
    heroSection.addEventListener('mouseleave', function() {
        heroContent.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

});