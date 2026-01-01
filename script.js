// Funcionalidad del sitio web de Ana Manzanares
// Inspirado en patricia-bustos.com

document.addEventListener('DOMContentLoaded', function() {

    // ======================
    // MENÚ HAMBURGUESA MÓVIL
    // ======================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            body.classList.toggle('menu-open');
            mobileMenu.classList.toggle('show-menu');
            mobileMenuToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                body.classList.remove('menu-open');
                mobileMenu.classList.remove('show-menu');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                body.classList.remove('menu-open');
                mobileMenu.classList.remove('show-menu');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // ====================================
    // HEADER CON EFECTO AL HACER SCROLL
    // ====================================
    const header = document.querySelector('header');
    const headerTitle = document.querySelector('header h1');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Reducir header al hacer scroll
        if (currentScroll > 200) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ====================
    // SMOOTH SCROLL
    // ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorar enlaces vacíos o solo "#"
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // ANIMACIONES AL HACER SCROLL (FADE IN)
    // ====================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.portfolio-item, .fade-in-element').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Observar secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // ====================================
    // EFECTO PARALLAX SUAVE EN HERO
    // ====================================
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // ====================================
    // CONTADOR ANIMADO (si hay números)
    // ====================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // ====================================
    // LAZY LOADING DE IMÁGENES
    // ====================================
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ====================================
    // DETECCIÓN DE MÓVIL
    // ====================================
    const isMobile = window.innerWidth <= 768;

    // Ajustar comportamiento según dispositivo
    if (isMobile) {
        // Deshabilitar parallax en móvil
        if (hero) {
            hero.style.transform = 'none';
        }
    }

    // ====================================
    // RESIZE HANDLER
    // ====================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Cerrar menú móvil si se redimensiona a desktop
            if (window.innerWidth > 768) {
                body.classList.remove('menu-open');
                if (mobileMenu) {
                    mobileMenu.classList.remove('show-menu');
                }
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        }, 250);
    });

    // ====================================
    // ANIMACIÓN DE ENTRADA INICIAL
    // ====================================
    setTimeout(function() {
        body.classList.add('loaded');
    }, 100);

});
