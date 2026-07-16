document.addEventListener('DOMContentLoaded', () => {
    
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Interactive 3D Tilt Effect (Only on Desktop & if motion allowed)
    if (!isMobile && !reducedMotion) {
        const cards = document.querySelectorAll('.interactive-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Max tilt is ~4-6 degrees
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset with easing class already applied in CSS
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });
    }

    // 2. Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (!reducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve if we only want it to happen once
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Stagger logic: If elements are in the same section, stagger them
        revealElements.forEach((el, index) => {
            // Apply subtle transition delay based on DOM order
            el.style.transitionDelay = `${(index % 3) * 80}ms`;
            revealObserver.observe(el);
        });
    } else {
        // Just make everything visible if reduced motion is preferred
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // 3. Active Nav Link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.pill-nav a');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');

            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.pill-nav a[href*=' + sectionId + ']').classList.add('active');
            } else {
                const link = document.querySelector('.pill-nav a[href*=' + sectionId + ']');
                if(link) link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', scrollActive);
});
