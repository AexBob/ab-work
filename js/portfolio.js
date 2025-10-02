// ===== PORTFOLIO CONFIGURATION =====
const PORTFOLIO_CONFIG = {
    categories: [
        {
            id: 'static',
            nameKey: 'portfolio.tabs.static.text',
            path: 'assets/portfolio/static/page1/'
        },
        {
            id: 'video',
            nameKey: 'portfolio.tabs.video.text',
            path: 'assets/portfolio/video/'
        },
        {
            id: 'gif',
            nameKey: 'portfolio.tabs.gif.text',
            path: 'assets/portfolio/gif/'
        },
        {
            id: 'flash',
            nameKey: 'portfolio.tabs.flash.text',
            path: 'assets/portfolio/flash/'
        },
        {
            id: 'flexography',
            nameKey: 'portfolio.tabs.flexography.text',
            path: 'assets/portfolio/flexography/'
        }
    ],
    currentCategory: 'static'
};

// Глобальная переменная для переводов
let portfolioTranslations = null;

// ===== INITIALIZATION =====
function initPortfolio() {
    setTimeout(() => {
        portfolioTranslations = window.translations;
        renderCategoryMenu();
        loadPortfolioContent('static');
        setupEventListeners();
        setupPortfolioTabReset();
        setupPageVisibilityHandler();
        setupLeftMenuClickHandler();
    }, 200);
}

// ===== ЛЕВОЕ МЕНЮ =====
function setupLeftMenuClickHandler() {
    const leftMenuLinks = document.querySelectorAll('.side-nav a');

    leftMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            const targetSection = this.getAttribute('data-section');

            // Если уходим С портфолио на другую секцию - сбрасываем GIF
            if (targetSection !== 'portfolio') {
                if (PORTFOLIO_CONFIG.currentCategory === 'gif') {
                    resetAllGifs();
                }
            }
        });
    });
}

// ===== RENDER FUNCTIONS =====
function renderCategoryMenu() {
    const container = document.querySelector('.portfolio-tabs-nav');
    if (!container) return;

    container.innerHTML = PORTFOLIO_CONFIG.categories.map(category => `
        <button class="portfolio-tab-btn ${category.id === 'static' ? 'active' : ''}" 
                data-category="${category.id}">
            <i class="${getCategoryIcon(category.id)}"></i>
            <span>${getDisplayText(category.id)}</span>
        </button>
    `).join('');

    updateMenuFromTranslations();
}

function updateMenuFromTranslations() {
    if (!portfolioTranslations || !portfolioTranslations.portfolio || !portfolioTranslations.portfolio.tabs) {
        return;
    }

    const tabs = portfolioTranslations.portfolio.tabs;
    const container = document.querySelector('.portfolio-tabs-nav');

    PORTFOLIO_CONFIG.categories.forEach(category => {
        const tabData = tabs[category.id];
        if (!tabData) return;

        const button = container.querySelector(`[data-category="${category.id}"]`);
        if (!button) return;

        const iconElement = button.querySelector('i');
        if (iconElement && tabData.icon) {
            iconElement.className = tabData.icon;
        }

        const textElement = button.querySelector('span');
        if (textElement && tabData.text) {
            textElement.textContent = tabData.text;
        }
    });
}

function getCategoryIcon(categoryId) {
    const icons = {
        'static': 'fa-solid fa-image',
        'video': 'fas fa-video',
        'gif': 'fas fa-film',
        'flash': 'fas fa-archive',
        'flexography': 'fas fa-paint-roller'
    };
    return icons[categoryId] || 'fas fa-star';
}

function getDisplayText(categoryId) {
    const texts = {
        'static': 'Statiskais dizains',
        'video': 'Video materiāli',
        'gif': 'GIF animācija',
        'flash': 'Flash animācija',
        'flexography': 'Fleksogrāfijai'
    };
    return texts[categoryId] || categoryId;
}

function loadPortfolioContent(categoryId) {
    const container = document.getElementById('projects-list');
    if (!container) return;

    container.className = 'portfolio-grid';

    if (categoryId === 'static') {
        loadStaticPortfolio();
    } else if (categoryId === 'video') {
        container.classList.add('video-grid');
        loadVideoPortfolio();
    } else if (categoryId === 'gif') {
        container.classList.add('gif-grid');
        loadGifPortfolio();
    } else if (categoryId === 'flash') {
        loadFlashPortfolio();
    } else {
        showComingSoon();
    }
}

function loadStaticPortfolio() {
    const category = PORTFOLIO_CONFIG.categories.find(c => c.id === 'static');
    const imagePath = category.path;
    const container = document.getElementById('projects-list');

    if (!container) return;

    const firstSeven = Array.from({ length: 7 }, (_, i) =>
        `ab-portfolio-${i + 1}.jpg`
    );

    container.innerHTML = firstSeven.map((filename, index) => `
        <div class="portfolio-item">
            <img src="${imagePath}${filename}" 
                 alt="Design ${index + 1}" 
                 class="portfolio-image" 
                 loading="lazy">
        </div>
    `).join('') + `
    <div class="portfolio-item-double">
        <div class="portfolio-item-small">
            <img src="${imagePath}ab-portfolio-8.jpg" alt="Design 8" class="portfolio-image">
        </div>
        <div class="portfolio-item-small">
            <img src="${imagePath}ab-portfolio-9.jpg" alt="Design 9" class="portfolio-image">
        </div>
    </div>
    <div class="portfolio-item">
        <img src="${imagePath}ab-portfolio-10.jpg" alt="Design 10" class="portfolio-image">
    </div>`;
}

// ===== VIDEO PORTFOLIO FUNCTIONS =====
function loadVideoPortfolio() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    const videoProjects = [
        {
            id: 10,
            title: 'New Client Campaign',
            full: 'full/Akcija_newClient_1024x576_lowQ.webm',
            preview: 'short/Akcija_newClient-short.webm',
            poster: 'previews/Akcija_newClient.jpg'
        },
        {
            id: 5,
            title: 'Outside Sport',
            full: 'full/OutsideSport_1024x576_lowQ.webm',
            preview: 'short/OutsideSport-short.webm',
            poster: 'previews/OutsideSport.jpg'
        },
        {
            id: 2,
            title: 'Tennis Ostapenko',
            full: 'full/Tennis_Ostapenko_Wuhan2017_1024x576_lowQ.webm',
            preview: 'short/Tennis_Ostapenko_Wuhan2017-short.webm',
            poster: 'previews/Tennis_Ostapenko_Wuhan2017.jpg'
        },
        {
            id: 3,
            title: 'Basketball Lat-Lit',
            full: 'full/Bask_Lat-Lit_2017_1024x576_lowQ.webm',
            preview: 'short/Bask_Lat-Lit_2017-short.webm',
            poster: 'previews/Bask_Lat-Lit_2017.jpg'
        },
        {
            id: 1,
            title: 'WC 2018',
            full: 'full/WC2018_1024x576_lowQ.webm',
            preview: 'short/WC2018-short.webm',
            poster: 'previews/WC2018.jpg'
        },
        {
            id: 6,
            title: 'Hockey WC 2018',
            full: 'full/hockeyWC2018_Latvia-Germany_1024x576_lowQ.webm',
            preview: 'short/hockeyWC2018_Latvia-Germany-short.webm',
            poster: 'previews/hockeyWC2018_Latvia-Germany.jpg'
        },
        {
            id: 7,
            title: 'Football Latvia-Faroe',
            full: 'full/football_Latvija_Fareri_1024x576_lowQ.webm',
            preview: 'short/football_Latvija_Fareri-short.webm',
            poster: 'previews/football_Latvija_Fareri.jpg'
        },
        {
            id: 8,
            title: 'Split Dinamo R',
            full: 'full/Split_Lat-Aus_DinamoR_1024x576_lowQ.webm',
            preview: 'short/Split_Lat-Aus_DinamoR-short.webm',
            poster: 'previews/Split_Lat-Aus_DinamoR.jpg'
        },
        {
            id: 9,
            title: 'FA Cup Final',
            full: 'full/football_FaCupFinal_1024x576_lowQ.webm',
            preview: 'short/football_FaCupFinal-short.webm',
            poster: 'previews/football_FaCupFinal.jpg'
        },
        {
            id: 4,
            title: 'Premier League',
            full: 'full/PremierLeague_1024x576_lowQ.webm',
            preview: 'short/PremierLeague-short.webm',
            poster: 'previews/PremierLeague.jpg'
        }
    ];

    container.innerHTML = videoProjects.map(project => `
        <div class="portfolio-item video-item" 
             data-video-full="${project.full}" 
             data-video-preview="${project.preview}"
             data-poster="${project.poster}">
            <img src="assets/portfolio/video/${project.poster}" 
                 alt="${project.title}" 
                 class="video-poster"
                 loading="lazy">
            <video class="video-preview" loop muted preload="none">
                <source src="assets/portfolio/video/${project.preview}" type="video/webm">
            </video>
            <div class="play-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `).join('');

    setupVideoHoverEffects();
    setupVideoClickHandlers();
}

function setupVideoHoverEffects() {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
        const poster = item.querySelector('.video-poster');
        const preview = item.querySelector('.video-preview');

        item.addEventListener('mouseenter', function () {
            poster.style.opacity = '0';
            preview.style.opacity = '1';
            preview.play().catch(e => console.log('Auto-play prevented:', e));
        });

        item.addEventListener('mouseleave', function () {
            poster.style.opacity = '1';
            preview.style.opacity = '0';
            preview.pause();
            preview.currentTime = 0;
        });
    });
}

function setupVideoClickHandlers() {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
        item.addEventListener('click', function () {
            const fullVideo = this.getAttribute('data-video-full');
            openVideoModal(fullVideo);
        });
    });
}

function openVideoModal(videoSrc) {
    const modalHTML = `
        <div class="video-modal-overlay">
            <div class="video-modal-container">
                <button class="video-modal-close">&times;</button>
                <video class="video-modal-player" controls autoplay>
                    <source src="assets/portfolio/video/${videoSrc}" type="video/webm">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.querySelector('.video-modal-overlay');
    const closeBtn = document.querySelector('.video-modal-close');
    const video = document.querySelector('.video-modal-player');

    function closeModal() {
        video.pause();
        overlay.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
}

// ===== GIF PORTFOLIO FUNCTIONS =====
function loadGifPortfolio() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    const gifProjects = [
        {
            id: 1,
            title: 'Cemodans',
            filename: 'gif_cemodans.gif',
            preview: 'preview_gif_cemodans.jpg',
            alt: 'Cemodans анимация',
            type: 'square'
        },
        {
            id: 2,
            title: 'Fillinks',
            filename: 'gif_fillinks.gif',
            preview: 'preview_gif_fillinks.jpg',
            alt: 'Fillinks анимация',
            type: 'square'
        },
        {
            id: 3,
            title: 'Printer',
            filename: 'gif_printer.gif',
            preview: 'preview_gif_printer.jpg',
            alt: 'Printer анимация',
            type: 'ultra-wide'
        },
        {
            id: 4,
            title: 'Brivdienas',
            filename: 'gif_brivdienas.gif',
            preview: 'preview_gif_brivdienas.jpg',
            alt: 'Brivdienas анимация',
            type: 'wide'
        },
        {
            id: 5,
            title: 'Music School',
            filename: 'gif_music-school.gif',
            preview: 'preview_gif_music-school.jpg',
            alt: 'Music School анимация',
            type: 'wide'
        }
    ];

    container.innerHTML = gifProjects.map(gif => `
        <div class="portfolio-item gif-item ${gif.type}">
            <img src="assets/portfolio/gif/${gif.preview}" 
                 alt="${gif.alt}"
                 class="gif-preview"
                 loading="lazy">
            <img src="assets/portfolio/gif/${gif.filename}" 
                 alt="${gif.alt}"
                 class="gif-animation"
                 style="display: none;"
                 loading="lazy">
            <div class="gif-controls">
                <button class="play-btn" data-gif="${gif.filename}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        </div>
    `).join('');

    setupGifControls();
    resetAllGifs();
}

function resetAllGifs() {
    const gifItems = document.querySelectorAll('.gif-item');
    gifItems.forEach(item => {
        const preview = item.querySelector('.gif-preview');
        const animation = item.querySelector('.gif-animation');
        const controls = item.querySelector('.gif-controls');

        if (preview && animation && controls) {
            preview.style.display = 'block';
            animation.style.display = 'none';
            controls.style.display = 'flex';

            const originalSrc = animation.src.split('?')[0];
            animation.src = originalSrc + '?t=' + Date.now();
        }
    });
}

function setupGifControls() {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const gifItem = this.closest('.gif-item');
            const preview = gifItem.querySelector('.gif-preview');
            const animation = gifItem.querySelector('.gif-animation');
            const controls = gifItem.querySelector('.gif-controls');

            // Сначала перезагружаем GIF
            const originalSrc = animation.src.split('?')[0];
            animation.src = originalSrc + '?t=' + Date.now();

            // Потом показываем
            preview.style.display = 'none';
            animation.style.display = 'block';
            controls.style.display = 'none';
        });
    });

    document.querySelectorAll('.gif-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.querySelector('.gif-controls').style.opacity = '1';
        });

        item.addEventListener('mouseleave', function () {
            this.querySelector('.gif-controls').style.opacity = '0.8';
        });
    });
}

// ===== FLASH PORTFOLIO FUNCTIONS =====
function loadFlashPortfolio() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    container.classList.add('flash-grid');

    // Главный проект LDZ
    const featuredProject = {
        title: "Flash-projekts Latvijas Dzelzceļam",
        description: "Stacijas dežurantu apmācība rīcībai ārkārtas situācijās",
        features: [
            "Dispečera pults interaktīvā interfeisa izstrāde",
            "Diktora audio pavadījuma sinhronizācija ar vizuālajiem elementiem"
        ],
        image: "assets/portfolio/flash/ldz_portfolio_600x510.jpg"
    };

    container.innerHTML = `
        <!-- Главный проект -->
        <div class="flash-featured-project">
            <div class="flash-project-content">
                <div class="flash-image-container">
                    <img src="${featuredProject.image}" 
                         alt="LDZ projekts" 
                         class="flash-featured-image"
                         loading="lazy">
                </div>
                <div class="flash-text-container">
                    <h3 class="flash-project-title">${featuredProject.title}</h3>
                    <p class="flash-project-description">${featuredProject.description}</p>
                    <ul class="flash-features-list">
                        ${featuredProject.features.map(feature => `
                            <li>${feature}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>

 <!-- Flash баннеры -->
<div class="flash-banners-section">
      <h4 class="flash-banners-title">Flash-banneri internetam</h4>
    <p class="flash-banner-note">Flash tehnoloģija vairs netiek atbalstīta - demonstrēts video formātā</p>
    <div class="flash-banners-grid">
        <div class="flash-banner-item">
            <div class="flash-banner-content">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
                <img src="assets/portfolio/flash/Seminar_Fontys.jpg" 
                     alt="Seminar Fontys" 
                     class="flash-banner-preview"
                     loading="lazy">
                <video class="flash-banner-video" loop muted preload="none">
                    <source src="assets/portfolio/flash/Seminar_Fontys.webm" type="video/webm">
                </video>
            </div>
        </div>
        
        <div class="flash-banner-item">
            <div class="flash-banner-content">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
                <img src="assets/portfolio/flash/Seminar_Salzburg.jpg" 
                     alt="Seminar Salzburg" 
                     class="flash-banner-preview"
                     loading="lazy">
                <video class="flash-banner-video" loop muted preload="none">
                    <source src="assets/portfolio/flash/Seminar_Salzburg.webm" type="video/webm">
                </video>
            </div>
        </div>
        
        <div class="flash-banner-item">
            <div class="flash-banner-content">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
                <img src="assets/portfolio/flash/Baneris_Maclaren.jpg" 
                     alt="Baneris Maclaren" 
                     class="flash-banner-preview"
                     loading="lazy">
                <video class="flash-banner-video" loop muted preload="none">
                    <source src="assets/portfolio/flash/Baneris_Maclaren.webm" type="video/webm">
                </video>
            </div>
        </div>
    </div>
</div>
    `;

    setupFlashBanners();
}

function setupFlashBanners() {
    const bannerContents = document.querySelectorAll('.flash-banner-content');

    bannerContents.forEach(content => {
        const preview = content.querySelector('.flash-banner-preview');
        const video = content.querySelector('.flash-banner-video');
        let hasPlayed = false;

        content.addEventListener('mouseenter', function () {
            if (!hasPlayed) {
                video.style.opacity = '1';
                preview.style.opacity = '0';
                video.play().catch(e => console.log('Play prevented:', e));
                hasPlayed = true;
            } else {
                video.style.opacity = '1';
                video.play();
            }
        });

        content.addEventListener('mouseleave', function () {
            video.pause();
            // Превью не показываем!
        });
    });
}

function setupPortfolioTabReset() {
    const portfolioTabButtons = document.querySelectorAll('.portfolio-tab-btn');

    portfolioTabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const categoryId = this.getAttribute('data-category');

            if (categoryId === 'gif') {
                setTimeout(() => {
                    resetAllGifs();
                }, 100);
            }
        });
    });
}

function setupPageVisibilityHandler() {
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && PORTFOLIO_CONFIG.currentCategory === 'gif') {
            setTimeout(() => {
                resetAllGifs();
            }, 100);
        }
    });

    window.addEventListener('focus', function () {
        if (PORTFOLIO_CONFIG.currentCategory === 'gif') {
            setTimeout(() => {
                resetAllGifs();
            }, 100);
        }
    });
}

function showComingSoon() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    container.innerHTML = `
        <div class="portfolio-item coming-soon">
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-clock" style="font-size: 48px; color: #3498db; margin-bottom: 20px;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Drīzumā gaidāmais saturs</h3>
                <p style="color: #7f8c8d;">Šī sadaļa tiek izstrādāta</p>
            </div>
        </div>
    `;
}

// ===== EVENT HANDLERS =====
function setupEventListeners() {
    document.addEventListener('click', function (e) {
        if (e.target.closest('.portfolio-tab-btn')) {
            const button = e.target.closest('.portfolio-tab-btn');
            const categoryId = button.getAttribute('data-category');
            switchCategory(categoryId);
        }
    });
}

function switchCategory(categoryId) {
    document.querySelectorAll('.portfolio-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === categoryId);
    });

    PORTFOLIO_CONFIG.currentCategory = categoryId;
    loadPortfolioContent(categoryId);
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function () {
    initPortfolio();
});

// Функция для обновления переводов из основного скрипта
function updatePortfolioTranslations(newTranslations) {
    portfolioTranslations = newTranslations;
    updateMenuFromTranslations();
}