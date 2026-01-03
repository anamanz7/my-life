// Funcionalidad del sitio web de Ana Manzanares
// Inspirado en patricia-bustos.com

document.addEventListener('DOMContentLoaded', function() {

    // ======================
    // INICIALIZAR SISTEMA DE IDIOMAS
    // ======================
    // Cargar idioma preferido del localStorage o usar español por defecto
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    currentLanguage = savedLanguage;

    // Aplicar idioma guardado al cargar la página
    if (savedLanguage !== 'es') {
        switchLanguage(savedLanguage);
    } else {
        updateLanguageButton('es');
    }

    // Event listener para el botón de cambio de idioma
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Alternar entre español e inglés
            const newLang = currentLanguage === 'es' ? 'en' : 'es';
            switchLanguage(newLang);
        });
    }

    // Event listeners para las opciones de idioma individuales
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const selectedLang = this.dataset.lang;
            if (selectedLang !== currentLanguage) {
                switchLanguage(selectedLang);
            }
        });
    });

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

    // Función para detectar si el header está sobre un fondo claro
    function updateHeaderStyle() {
        const currentScroll = window.pageYOffset;
        const headerHeight = header.offsetHeight;

        // Reducir header al hacer scroll
        if (currentScroll > 200) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Detectar el color de fondo de la sección actual
        const sections = document.querySelectorAll('section, #carousel-hero');
        let isOverLightBackground = false;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Si la sección está en el área del header (primeros 100px)
            if (rect.top < headerHeight && rect.bottom > 0) {
                const bgColor = window.getComputedStyle(section).backgroundColor;
                const sectionId = section.id;

                // Detectar si es una sección con fondo claro
                // Secciones claras: #about, #portfolio, #cv, y secciones pares
                if (sectionId === 'about' ||
                    sectionId === 'portfolio' ||
                    sectionId === 'cv' ||
                    section.classList.contains('cv-section') ||
                    bgColor.includes('248, 246, 244') || // --cream
                    bgColor.includes('235, 230, 227') || // --light-beige
                    bgColor.includes('255, 255, 255')) { // --white
                    isOverLightBackground = true;
                }
            }
        });

        // Aplicar o remover clase según el fondo
        if (isOverLightBackground) {
            header.classList.add('light-bg');
        } else {
            header.classList.remove('light-bg');
        }

        lastScroll = currentScroll;
    }

    // Ejecutar al hacer scroll
    window.addEventListener('scroll', updateHeaderStyle);

    // Ejecutar al cargar la página
    updateHeaderStyle();

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
// SISTEMA DE TRADUCCIÓN
// ====================================
let currentLanguage = 'es'; // Idioma por defecto: español

const projectsData = {
    'bom': {
        title: 'BOM',
        year: '2024',
        category: {
            es: 'Espacios Comerciales',
            en: 'Commercial Spaces'
        },
        heroImage: 'PORTFOLIO/BOM/imagenes/render-escaparate-1-ok.png',
        description: {
            es: `
                <p>Diseño de bombonería boutique de nivel medio-alto en el centro de Almería, Calle Gerona. Espacio comercial en edificio protegido por patrimonio que fusiona tradición y contemporaneidad con influencias Art Déco.</p>
                <p>El diseño integra zona de venta, exposición, taller artesanal, degustación y cámara frigorífica. Inspirado en la semilla del cacao y moldes de bombones, el proyecto crea volúmenes orgánicos con paleta tierra-rosa, terrazo y elementos esféricos.</p>
                <p>Elegancia, sostenibilidad y funcionalidad convergen en un espacio envolvente para productos exclusivos. El proyecto incluye documentación completa: planos de planta, secciones técnicas, detalles constructivos del mostrador, bocetos conceptuales y renderizados que muestran diferentes perspectivas del espacio interior.</p>
            `,
            en: `
                <p>Design of a medium-high level boutique chocolate shop in the center of Almería, Gerona Street. Commercial space in a heritage-protected building that merges tradition and contemporary design with Art Déco influences.</p>
                <p>The design integrates sales area, exhibition, artisan workshop, tasting area and cold storage. Inspired by cocoa seeds and chocolate molds, the project creates organic volumes with an earth-rose palette, terrazzo and spherical elements.</p>
                <p>Elegance, sustainability and functionality converge in an enveloping space for exclusive products. The project includes complete documentation: floor plans, technical sections, counter construction details, conceptual sketches and renderings showing different perspectives of the interior space.</p>
            `
        },
        renderizados: [
            {
                src: 'PORTFOLIO/BOM/imagenes/render-1.png',
                caption: { es: 'Interior - Vista general', en: 'Interior - General view' }
            },
            {
                src: 'PORTFOLIO/BOM/imagenes/render-2.png',
                caption: { es: 'Interior - Detalle espacial', en: 'Interior - Spatial detail' }
            },
            {
                src: 'PORTFOLIO/BOM/imagenes/render-escaparate-1-ok.png',
                caption: { es: 'Vista escaparate - Perspectiva principal', en: 'Storefront view - Main perspective' }
            },
            {
                src: 'PORTFOLIO/BOM/imagenes/render-escaparate-2.png',
                caption: { es: 'Vista escaparate - Ambiente nocturno', en: 'Storefront view - Night ambiance' }
            }
        ],
        planos: [
            {
                src: 'PORTFOLIO/BOM/planos/logo.jpg',
                caption: { es: 'Logo y Branding del Proyecto', en: 'Project Logo and Branding' }
            },
            {
                src: 'PORTFOLIO/BOM/planos/plano-planta.jpg',
                caption: { es: 'Planta General - Distribución del Espacio', en: 'General Floor Plan - Space Distribution' }
            },
            {
                src: 'PORTFOLIO/BOM/planos/secciones.jpg',
                caption: { es: 'Secciones del Proyecto', en: 'Project Sections' }
            },
            {
                src: 'PORTFOLIO/BOM/planos/seccion-2.jpg',
                caption: { es: 'Sección Detallada', en: 'Detailed Section' }
            },
            {
                src: 'PORTFOLIO/BOM/planos/plano-técnico-mostrador.jpg',
                caption: { es: 'Detalle Técnico del Mostrador', en: 'Counter Technical Detail' }
            },
            {
                src: 'PORTFOLIO/BOM/planos/bocetos.jpg',
                caption: { es: 'Bocetos Conceptuales', en: 'Conceptual Sketches' }
            }
        ]
    },
    'mas-creation': {
        title: 'MAS Creation',
        year: '2018',
        category: {
            es: 'Espacios Efímeros',
            en: 'Ephemeral Spaces'
        },
        heroImage: 'PORTFOLIO/MAS-CREATION/images/moodboard.jpg',
        description: {
            es: `
                <p>Diseño de flagship store para la marca de mobiliario Mas Creations (Masquespacio) ubicado en un container marítimo de 12 metros. El proyecto transforma la geometría rígida del contenedor mediante formas orgánicas, vidrios coloreados y estructuras de acero.</p>
                <p>El concepto se inspira en la icónica silla "Too Much Chair" de la marca, traduciendo su lenguaje formal al espacio arquitectónico. Los elementos curvos y el uso del color rompen deliberadamente con la ortogonalidad del contenedor, creando una experiencia espacial única.</p>
                <p>El proyecto incluye documentación técnica completa: moodboards conceptuales, alzados en color, planos de cubierta, especificaciones de acabados y renderizados que muestran la propuesta tanto en ambientación diurna como nocturna.</p>
            `,
            en: `
                <p>Flagship store design for furniture brand Mas Creations (Masquespacio) located in a 12-meter maritime container. The project transforms the rigid geometry of the container through organic forms, colored glass and steel structures.</p>
                <p>The concept is inspired by the brand's iconic "Too Much Chair", translating its formal language into architectural space. Curved elements and the use of color deliberately break with the orthogonality of the container, creating a unique spatial experience.</p>
                <p>The project includes complete technical documentation: conceptual moodboards, color elevations, roof plans, finish specifications and renderings showing the proposal in both daytime and nighttime settings.</p>
            `
        },
        renderizados: [
            {
                src: 'PORTFOLIO/MAS-CREATION/images/1 DIA HORIZ.jpg',
                caption: { es: 'Renderizado Día - Vista panorámica', en: 'Day Rendering - Panoramic view' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/1 NOCHE.jpg',
                caption: { es: 'Renderizado Noche - Iluminación exterior', en: 'Night Rendering - Exterior lighting' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/2 DIA.jpg',
                caption: { es: 'Vista Día - Espacio principal', en: 'Day View - Main space' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/2 NOCHE.jpg',
                caption: { es: 'Vista Noche - Ambiente nocturno', en: 'Night View - Night ambiance' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/3 DIA.jpg',
                caption: { es: 'Detalle Día - Interior', en: 'Day Detail - Interior' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/3 NOCHE.jpg',
                caption: { es: 'Detalle Noche - Iluminación interior', en: 'Night Detail - Interior lighting' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/5 DIA.png',
                caption: { es: 'Concepto Día - Perspectiva general', en: 'Day Concept - General perspective' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/5 NOCHE.png',
                caption: { es: 'Concepto Noche - Vista completa', en: 'Night Concept - Complete view' }
            }
        ],
        planos: [
            {
                src: 'PORTFOLIO/MAS-CREATION/images/moodboard.jpg',
                caption: { es: 'Moodboard - Concepto y paleta de materiales', en: 'Moodboard - Concept and material palette' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzado-color-a.jpg',
                caption: { es: 'Alzado Color A - Vista frontal', en: 'Color Elevation A - Front view' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzado-color-b.jpg',
                caption: { es: 'Alzado Color B - Vista posterior', en: 'Color Elevation B - Rear view' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/alzados-transv-color.jpg',
                caption: { es: 'Alzados Transversales - Secciones', en: 'Cross Elevations - Sections' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/plano-cubierta-color.jpg',
                caption: { es: 'Plano de Cubierta - Vista superior', en: 'Roof Plan - Top view' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/plano-acabados-color.jpg',
                caption: { es: 'Plano de Acabados - Especificaciones', en: 'Finishes Plan - Specifications' }
            },
            {
                src: 'PORTFOLIO/MAS-CREATION/images/bocetos.jpg',
                caption: { es: 'Bocetos - Proceso creativo', en: 'Sketches - Creative process' }
            }
        ]
    },
    'residencial': {
        title: 'Casa Mijas',
        year: '2024',
        category: {
            es: 'Interiorismo Residencial',
            en: 'Residential Interior Design'
        },
        heroImage: 'PORTFOLIO/ECI/mijas/comedor.png',
        description: {
            es: `
                <p>Diseño de interiores para vivienda residencial en Mijas, Costa del Sol. El proyecto combina elegancia contemporánea con el carácter cálido del estilo mediterráneo, creando espacios que fusionan funcionalidad y sofisticación.</p>
                <p>El concepto se desarrolla entorno a la luz natural, materiales nobles y paletas neutras que dialogan con el entorno. Cada espacio ha sido cuidadosamente diseñado para ofrecer confort y distinción, manteniendo coherencia visual en toda la vivienda.</p>
                <p>El proyecto incluye visualizaciones fotorrealistas de los espacios principales: salón, comedor, dormitorios y entrada, mostrando la propuesta integral de interiorismo con acabados de alto nivel y diseño contemporáneo mediterráneo.</p>
            `,
            en: `
                <p>Interior design for a residential home in Mijas, Costa del Sol. The project combines contemporary elegance with the warm character of Mediterranean style, creating spaces that merge functionality and sophistication.</p>
                <p>The concept develops around natural light, noble materials and neutral palettes that dialogue with the surroundings. Each space has been carefully designed to offer comfort and distinction, maintaining visual coherence throughout the home.</p>
                <p>The project includes photorealistic visualizations of the main spaces: living room, dining room, bedrooms and entrance, showing the comprehensive interior design proposal with high-end finishes and contemporary Mediterranean design.</p>
            `
        },
        renderizados: [
            {
                src: 'PORTFOLIO/ECI/mijas/entrada.png',
                caption: { es: 'Entrada - Recibidor elegante', en: 'Entrance - Elegant foyer' }
            },
            {
                src: 'PORTFOLIO/ECI/mijas/comedor.png',
                caption: { es: 'Comedor - Espacio de reunión familiar', en: 'Dining Room - Family gathering space' }
            },
            {
                src: 'PORTFOLIO/ECI/mijas/salon.png',
                caption: { es: 'Salón - Vista general con luz natural', en: 'Living Room - General view with natural light' }
            },
            {
                src: 'PORTFOLIO/ECI/mijas/dormitorio-ppal.png',
                caption: { es: 'Dormitorio Principal - Suite con vestidor', en: 'Master Bedroom - Suite with walk-in closet' }
            },
            {
                src: 'PORTFOLIO/ECI/mijas/dormitorio-2-.PNG',
                caption: { es: 'Dormitorio Secundario - Diseño contemporáneo', en: 'Secondary Bedroom - Contemporary design' }
            },
            {
                src: 'PORTFOLIO/ECI/mijas/dormitorio-3.jpeg',
                caption: { es: 'Dormitorio Infantil - Espacio acogedor', en: "Children's Bedroom - Cozy space" }
            }
        ],
        planos: []
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
    projectCategory.textContent = typeof project.category === 'object' ? project.category[currentLanguage] : project.category;
    projectDescription.innerHTML = typeof project.description === 'object' ? project.description[currentLanguage] : project.description;
    projectHeroImage.src = project.heroImage;
    projectHeroImage.alt = project.title;
    projectBreadcrumbTitle.textContent = project.title;

    // Limpiar y rellenar grid de renderizados
    projectRenderizadosGrid.innerHTML = '';
    if (project.renderizados) {
        project.renderizados.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'project-image-item';
            const caption = typeof image.caption === 'object' ? image.caption[currentLanguage] : image.caption;
            imageItem.innerHTML = `
                <img src="${image.src}" alt="${caption}" loading="lazy" class="project-thumbnail" data-index="${index}" data-type="renderizados">
                <p class="project-image-caption">${caption}</p>
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
            const caption = typeof image.caption === 'object' ? image.caption[currentLanguage] : image.caption;

            // Si es PDF, mostrar con un ícono especial
            const isPDF = image.src.toLowerCase().endsWith('.pdf');
            const pdfLabel = currentLanguage === 'es' ? 'Ver plano técnico' : 'View technical plan';
            const thumbnailHTML = isPDF
                ? `<div class="pdf-thumbnail" data-index="${index}" data-type="planos" data-pdf="${image.src}">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                       <polyline points="14 2 14 8 20 8"></polyline>
                       <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="6" font-weight="600">PDF</text>
                     </svg>
                     <span class="pdf-label">${pdfLabel}</span>
                   </div>`
                : `<img src="${image.src}" alt="${caption}" loading="lazy" class="project-thumbnail" data-index="${index}" data-type="planos">`;

            imageItem.innerHTML = `
                ${thumbnailHTML}
                <p class="project-image-caption">${caption}</p>
            `;
            projectPlanosGrid.appendChild(imageItem);
        });
    }

    // Añadir event listeners para abrir lightbox o PDF
    const allThumbnails = document.querySelectorAll('.project-thumbnail, .pdf-thumbnail');
    allThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Si tiene atributo data-pdf, abrir el PDF directamente
            if (this.dataset.pdf) {
                window.open(this.dataset.pdf, '_blank');
                return;
            }

            const index = parseInt(this.dataset.index);
            const type = this.dataset.type;
            const images = type === 'renderizados' ? project.renderizados : project.planos;
            const item = images[index];

            // Si es un PDF, abrirlo en nueva pestaña
            if (item.src.toLowerCase().endsWith('.pdf')) {
                window.open(item.src, '_blank');
            } else {
                // Si es imagen, abrir en lightbox
                openLightbox(images, index);
            }
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

// ====================================
// SISTEMA DE CAMBIO DE IDIOMA
// ====================================

// Función para cambiar el idioma de todos los elementos
function switchLanguage(lang) {
    currentLanguage = lang;

    // Guardar preferencia en localStorage
    localStorage.setItem('preferredLanguage', lang);

    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;

    // Actualizar todos los elementos con atributos data-es y data-en
    const translatableElements = document.querySelectorAll('[data-es][data-en]');
    translatableElements.forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            // Si es un enlace o botón, actualizar textContent
            if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'SPAN' || element.tagName === 'STRONG') {
                element.textContent = translation;
            } else {
                // Para otros elementos, usar innerHTML para preservar HTML entities
                element.innerHTML = translation;
            }
        }
    });

    // Actualizar botón de idioma
    updateLanguageButton(lang);

    // Si hay un proyecto abierto, recargarlo con el nuevo idioma
    const projectView = document.getElementById('project-view');
    if (projectView && projectView.classList.contains('show')) {
        const hash = window.location.hash;
        if (hash.startsWith('#project/')) {
            const projectId = hash.replace('#project/', '');
            if (projectsData[projectId]) {
                const fakeEvent = { preventDefault: () => {} };
                openProject(fakeEvent, projectId);
            }
        }
    }
}

// Función para actualizar el estado visual del botón de idioma
function updateLanguageButton(lang) {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

