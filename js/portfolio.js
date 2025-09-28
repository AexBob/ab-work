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
            path: 'assets/portfolio/flash-archive/'
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
    // Ждем немного чтобы основные переводы загрузились
    setTimeout(() => {
        portfolioTranslations = window.translations;
        renderCategoryMenu();
        loadPortfolioContent('static');
        setupEventListeners();
    }, 200);
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

    // Обновляем тексты из переводов если они доступны
    updateMenuFromTranslations();
}

function updateMenuFromTranslations() {
    if (!portfolioTranslations || !portfolioTranslations.portfolio || !portfolioTranslations.portfolio.tabs) {
        console.log('Translations not available, using fallback texts');
        return;
    }

    const tabs = portfolioTranslations.portfolio.tabs;
    const container = document.querySelector('.portfolio-tabs-nav');

    PORTFOLIO_CONFIG.categories.forEach(category => {
        const tabData = tabs[category.id];
        if (!tabData) return;

        const button = container.querySelector(`[data-category="${category.id}"]`);
        if (!button) return;

        // Обновляем иконку
        const iconElement = button.querySelector('i');
        if (iconElement && tabData.icon) {
            iconElement.className = tabData.icon;
        }

        // Обновляем текст
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
    // Fallback тексты на случай если переводы не загрузятся
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

    // Убираем все классы сетки
    container.className = 'portfolio-grid';

    if (categoryId === 'static') {
        loadStaticPortfolio();
    } else if (categoryId === 'video') {
        container.classList.add('video-grid');
        loadVideoPortfolio();
    } else {
        showComingSoon();
    }
}

function loadStaticPortfolio() {
    const category = PORTFOLIO_CONFIG.categories.find(c => c.id === 'static');
    const imagePath = category.path;
    const container = document.getElementById('projects-list');

    if (!container) return;

    // First 7 images
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
    // Create modal HTML
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

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Setup event listeners
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

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
}

function showComingSoon() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    container.innerHTML = `
        <div class="portfolio-item coming-soon">
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-clock" style="font-size: 48px; color: #3498db; margin-bottom: 20px;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Content Coming Soon</h3>
                <p style="color: #7f8c8d;">This section is under development</p>
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
    // Update active button
    document.querySelectorAll('.portfolio-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === categoryId);
    });

    // Load content
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