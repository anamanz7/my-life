// Funcionalidad del sitio web de Ana Manzanares
// Inspirado en patricia-bustos.com

document.addEventListener('DOMContentLoaded', function() {

    // ======================
    // CARRUSEL DE IMÁGENES
    // ======================
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentSlide = 0;
    let autoplayInterval;

    // Función para mostrar slide específico
    function showSlide(index) {
        // Asegurar que el índice esté en rango
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Remover clase active de todos los slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Añadir clase active al slide e indicador actual
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Función para siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Función para slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event listeners para controles
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Autoplay del carrusel
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Iniciar autoplay si hay slides
    if (slides.length > 0) {
        startAutoplay();

        // Pausar autoplay cuando el usuario pasa el mouse sobre el carrusel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoplay);
            carouselContainer.addEventListener('mouseleave', startAutoplay);
        }
    }

    // Soporte para navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Soporte para gestos táctiles (swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselSlides = document.querySelector('.carousel-slides');
    if (carouselSlides) {
        carouselSlides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselSlides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - siguiente
                nextSlide();
            } else {
                // Swipe right - anterior
                prevSlide();
            }
            resetAutoplay();
        }
    }

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

// ====================================
// DATOS DE PROYECTOS
// ====================================
const projectsData = {
    'mas-creation': {
        title: 'MAS Creation',
        year: '2018',
        category: 'Espacios Efímeros',
        heroImage: 'PORTFOLIO/MAS-CREATION/images/moodboard.jpg',
        description: `
            <p>Proyecto de espacio efímero desarrollado en 2018 para la marca de mobiliario Mas Creations (Masquespacio). El diseño propone un flagship store ubicado en un container marítimo de 12 metros, transformando su geometría rígida mediante formas orgánicas, vidrios coloreados y estructuras de acero.</p>
            <p>El concepto se inspira en la icónica silla "Too Much Chair" de la marca, traduciendo su lenguaje formal al espacio arquitectónico. Los elementos curvos y el uso del color rompen deliberadamente con la ortogonalidad del contenedor, creando una experiencia espacial única.</p>
            <p>El proyecto incluye documentación técnica completa: moodboards conceptuales, alzados en color, planos de cubierta, especificaciones de acabados y renderizados que muestran la propuesta tanto en ambientación diurna como nocturna.</p>
        `,
        renderizados: [
            {
                src: 'PORTFOLIO/MAS-CREATION/images/1 DIA HORIZ.jpg',
                caption: 'Renderizado Día - Vista panorámica'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/1 NOCHE.jpg',
                caption: 'Renderizado Noche - Iluminación exterior'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/2 DIA.jpg',
                caption: 'Vista Día - Espacio principal'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/2 NOCHE.jpg',
                caption: 'Vista Noche - Ambiente nocturno'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/3 DIA.jpg',
                caption: 'Detalle Día - Interior'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/3 NOCHE.jpg',
                caption: 'Detalle Noche - Iluminación interior'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/5 DIA.png',
                caption: 'Concepto Día - Perspectiva general'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/5 NOCHE.png',
                caption: 'Concepto Noche - Vista completa'
            }
        ],
        planos: [
            {
                src: 'PORTFOLIO/MAS-CREATION/images/moodboard.jpg',
                caption: 'Moodboard - Concepto y paleta de materiales'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzado-color-a.jpg',
                caption: 'Alzado Color A - Vista frontal'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzado-color-b.jpg',
                caption: 'Alzado Color B - Vista posterior'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzados-transv-color.jpg',
                caption: 'Alzados Transversales - Secciones'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/plano-cubierta-color.jpg',
                caption: 'Plano de Cubierta - Vista superior'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/plano-acabados-color.jpg',
                caption: 'Plano de Acabados - Especificaciones'
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/bocetos.jpg',
                caption: 'Bocetos - Proceso creativo'
            }
        ]
    }
};

// ====================================
// VISTA DE PROYECTO INDIVIDUAL
// ====================================
function openProject(event, projectId) {
    event.preventDefault();

    const project = projectsData[projectId];
    if (!project) {
        console.error('Proyecto no encontrado:', projectId);
        return;
    }

    // Obtener elementos del DOM
    const projectView = document.getElementById('project-view');
    const projectTitle = document.getElementById('project-title');
    const projectYear = document.getElementById('project-year');
    const projectCategory = document.getElementById('project-category');
    const projectDescription = document.getElementById('project-description');
    const projectHeroImage = document.getElementById('project-hero-image');
    const projectBreadcrumbTitle = document.getElementById('project-breadcrumb-title');
    const projectRenderizadosGrid = document.getElementById('project-renderizados-grid');
    const projectPlanosGrid = document.getElementById('project-planos-grid');

    // Rellenar información del proyecto
    projectTitle.textContent = project.title;
    projectYear.textContent = project.year;
    projectCategory.textContent = project.category;
    projectDescription.innerHTML = project.description;
    projectHeroImage.src = project.heroImage;
    projectHeroImage.alt = project.title;
    projectBreadcrumbTitle.textContent = project.title;

    // Limpiar y rellenar grid de renderizados
    projectRenderizadosGrid.innerHTML = '';
    if (project.renderizados) {
        project.renderizados.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'project-image-item';
            imageItem.innerHTML = `
                <img src="${image.src}" alt="${image.caption}" loading="lazy" class="project-thumbnail" data-index="${index}" data-type="renderizados">
                <p class="project-image-caption">${image.caption}</p>
            `;
            projectRenderizadosGrid.appendChild(imageItem);
        });
    }

    // Limpiar y rellenar grid de planos
    projectPlanosGrid.innerHTML = '';
    if (project.planos) {
        project.planos.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'project-image-item';
            imageItem.innerHTML = `
                <img src="${image.src}" alt="${image.caption}" loading="lazy" class="project-thumbnail" data-index="${index}" data-type="planos">
                <p class="project-image-caption">${image.caption}</p>
            `;
            projectPlanosGrid.appendChild(imageItem);
        });
    }

    // Añadir event listeners para abrir lightbox
    const allThumbnails = document.querySelectorAll('.project-thumbnail');
    allThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const type = this.dataset.type;
            const images = type === 'renderizados' ? project.renderizados : project.planos;
            openLightbox(images, index);
        });
        thumbnail.style.cursor = 'pointer';
    });

    // Mostrar vista del proyecto
    projectView.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Scroll al inicio de la vista del proyecto
    projectView.scrollTop = 0;

    // Actualizar URL sin recargar la página
    history.pushState({ projectId: projectId }, '', `#project/${projectId}`);
}

function closeProject() {
    const projectView = document.getElementById('project-view');
    projectView.classList.remove('show');
    document.body.style.overflow = '';

    // Actualizar URL
    history.pushState(null, '', '#portfolio');
}

// Cerrar proyecto con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const projectView = document.getElementById('project-view');
        if (projectView && projectView.classList.contains('show')) {
            closeProject();
        }
    }
});

// Manejar botón atrás del navegador
window.addEventListener('popstate', function(event) {
    const projectView = document.getElementById('project-view');
    if (projectView && projectView.classList.contains('show')) {
        closeProject();
    }
});

// Cargar proyecto si la URL tiene hash #project/
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash.startsWith('#project/')) {
        const projectId = hash.replace('#project/', '');
        if (projectsData[projectId]) {
            // Esperar a que el DOM esté completamente cargado
            setTimeout(() => {
                const fakeEvent = { preventDefault: () => {} };
                openProject(fakeEvent, projectId);
            }, 100);
        }
    }
});

// ====================================
// LIGHTBOX PARA IMÁGENES
// ====================================
let currentLightboxIndex = 0;
let lightboxImages = [];

function openLightbox(images, startIndex) {
    lightboxImages = images;
    currentLightboxIndex = startIndex;

    // Crear lightbox si no existe
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" onclick="closeLightbox()" aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <button class="lightbox-nav lightbox-prev" onclick="lightboxPrev()" aria-label="Anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="lightbox-nav lightbox-next" onclick="lightboxNext()" aria-label="Siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            <div class="lightbox-content">
                <img id="lightbox-image" src="" alt="">
                <p id="lightbox-caption"></p>
                <p class="lightbox-counter"><span id="lightbox-current">1</span> / <span id="lightbox-total">1</span></p>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    showLightboxImage(currentLightboxIndex);
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function showLightboxImage(index) {
    if (index < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    } else if (index >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else {
        currentLightboxIndex = index;
    }

    const image = lightboxImages[currentLightboxIndex];
    document.getElementById('lightbox-image').src = image.src;
    document.getElementById('lightbox-image').alt = image.caption;
    document.getElementById('lightbox-caption').textContent = image.caption;
    document.getElementById('lightbox-current').textContent = currentLightboxIndex + 1;
    document.getElementById('lightbox-total').textContent = lightboxImages.length;
}

function lightboxNext() {
    showLightboxImage(currentLightboxIndex + 1);
}

function lightboxPrev() {
    showLightboxImage(currentLightboxIndex - 1);
}

// Cerrar lightbox con tecla ESC y navegar con flechas
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('show')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            lightboxNext();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev();
        }
    }
});
