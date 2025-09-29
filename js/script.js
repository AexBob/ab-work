// Конфигурация
const CONFIG = {
    defaultLanguage: 'lv',
    contentPath: 'content'
};

// Текущий язык
let currentLanguage = CONFIG.defaultLanguage;

// Глобальная переменная для переводов
window.translations = null;

// Загрузка контента
async function loadContent(lang) {
    try {
        console.log('Пытаюсь загрузить:', `${CONFIG.contentPath}/${lang}.json`);
        const response = await fetch(`${CONFIG.contentPath}/${lang}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('JSON успешно загружен');
        return data;

    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
}

// Обновление контента на странице
function updateContent(data) {
    if (!data) return;

    // Сохраняем переводы для portfolio.js
    window.translations = data;

    // Если portfolio.js уже загружен, обновляем переводы
    if (window.updatePortfolioTranslations) {
        window.updatePortfolioTranslations(data);
    }

    console.log('Updating content with data');

    // Update meta tags (with check)
    if (data.meta) {
        document.title = data.meta.title || 'Aleksejs Babenko | Portfolio';
        document.documentElement.lang = data.meta.language || 'lv';
    }

    // Update navigation (with check)
    if (data.nav) {
        updateElementsByDataAttr('nav.home', data.nav.home);
        updateElementsByDataAttr('nav.about', data.nav.about);
        updateElementsByDataAttr('nav.portfolio', data.nav.portfolio);
        updateElementsByDataAttr('nav.contact', data.nav.contact);
    }

    // Home page (with check)
    if (data.home) {
        updateElementsByDataAttr('home.name', data.home.name);
        updateElementsByDataAttr('home.title', data.home.title);
        // Добавляем новые поля:
        updateElementsByDataAttr('home.mainTitle', data.home.mainTitle);
        updateElementsByDataAttr('home.description', data.home.description);
    }

    // About section - with existence checks
    if (data.about) {
        // Tab titles (with check)
        if (data.about.work) updateElementsByDataAttr('about.work.title', data.about.work.title);
        if (data.about.education) updateElementsByDataAttr('about.education.title', data.about.education.title);
        if (data.about.languages) updateElementsByDataAttr('about.languages.title', data.about.languages.title);
        if (data.about.skills) updateElementsByDataAttr('about.skills.title', data.about.skills.title);
        if (data.about.interests) updateElementsByDataAttr('about.interests.title', data.about.interests.title);

        // Data (with check)
        if (data.about.experience) renderExperience(data.about.experience);
        if (data.about.education && data.about.education.items) renderEducation(data.about.education.items);
        if (data.about.languages && data.about.languages.items) renderLanguages(data.about.languages.items);
        if (data.about.skills) renderSkills(data.about.skills);
        if (data.about.interests) renderInterests(data.about.interests);
    }

    // Portfolio section (with check)
    if (data.portfolio) {
        updateElementsByDataAttr('portfolio.title', data.portfolio.title);
    }

    // Contacts (with check)
    if (data.contact) {
        updateElementsByDataAttr('contact.title', data.contact.title);
        updateElementsByDataAttr('contact.description', data.contact.description);
        updateElementsByDataAttr('contact.email', data.contact.email);
        updateElementsByDataAttr('contact.phone', data.contact.phone);
        updateElementsByDataAttr('contact.address', data.contact.address);
    }
}

// Вспомогательные функции
function updateElementsByDataAttr(attr, value) {
    const elements = document.querySelectorAll(`[data-i18n="${attr}"]`);
    elements.forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.value = value;
        } else {
            element.textContent = value;
        }
    });
}

function renderExperience(experience) {
    const container = document.getElementById('experience-cards');
    if (!container) return;

    container.innerHTML = experience.map(exp => `
        <div class="experience-item">
            <div class="experience-item-period-container">
                <div class="experience-item-period">${exp.period}</div>
                <div class="experience-item-duration">${exp.duration}</div>
            </div>
            <div class="experience-item-content">
                <div class="experience-item-company">${exp.company}</div>
                <div class="experience-item-position">${exp.position}</div>
            </div>
        </div>
    `).join('');
}

function renderEducation(educationItems) {
    const container = document.getElementById('education-list');
    if (!container) return;

    container.innerHTML = educationItems.map(edu => `
        <div class="education-item">
            <h4>${edu.degree}</h4>
            <p class="education-meta">${edu.institution} • ${edu.period}</p>
            ${edu.additionalInfo ? `
                <div class="education-additional">
                    <button class="education-toggle">
                        <i class="fas fa-chevron-down"></i>
                        Papildus informācija
                    </button>
                    <div class="education-additional-content">
                        <ul class="education-additional-list">
                            ${edu.additionalInfo.map((item, index) => {
        // Определяем подпункты грантов (3-й и 4-й элементы для магистра)
        const isGrantSubitem = index === 2 || index === 3;
        if (isGrantSubitem) {
            return `<li class="education-additional-item subitem">${item}</li>`;
        } else {
            return `<li class="education-additional-item">${item}</li>`;
        }
    }).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');

    // Добавляем обработчики для кнопок
    setupEducationToggles();
}

// Обработчики для раскрытия дополнительной информации
function setupEducationToggles() {
    const toggles = document.querySelectorAll('.education-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Закрываем все остальные
            document.querySelectorAll('.education-additional-content').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.education-toggle').forEach(btn => {
                btn.classList.remove('active');
            });

            // Открываем/закрываем текущий
            if (!isActive) {
                content.classList.add('active');
                this.classList.add('active');
            }
        });
    });
}

function renderLanguages(languagesItems) {
    const container = document.getElementById('languages-list');
    if (!container) return;

    container.innerHTML = languagesItems.map(lang => `
        <div class="language-bar">
            <div class="language-name">
                <span class="language-text">${lang.name}</span>
                <span class="language-level">${lang.level}</span>
            </div>
            <div class="language-progress">
                <div class="language-progress-fill" style="width: ${lang.percentage}%"></div>
            </div>
        </div>
    `).join('');

    // Добавляем анимацию при загрузке
    setTimeout(() => {
        const bars = container.querySelectorAll('.language-bar');
        bars.forEach(bar => bar.classList.add('animated'));
    }, 100);
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    if (!container) return;

    // Иконки для каждой категории
    const categoryIcons = {
        'Vadības un komunikācijas prasmes': 'fas fa-users-cog',
        'Datorprasmes': 'fas fa-laptop-code',
        'Tehniskās prasmes': 'fas fa-tools',
        'Poligrāfijas prasmes': 'fas fa-print',
        'Datorgrafika un dizains': 'fas fa-palette',
        'Papildu informācija': 'fas fa-info-circle'
    };

    container.innerHTML = `
        <div class="skills-sidebar-layout">
            <div class="skills-categories-sidebar">
                ${skills.categories.map((category, index) => `
                    <button class="skill-category-btn ${index === 0 ? 'active' : ''}" 
                            data-category="${category.name}">
                        <i class="${categoryIcons[category.name] || 'fas fa-star'}"></i>
                        <span>${category.name}</span>
                    </button>
                `).join('')}
            </div>
            <div class="skills-content-area">
                ${skills.categories.map((category, index) => `
                    <div class="skills-content-pane ${index === 0 ? 'active' : ''}" 
                         id="pane-${category.name}">
                        <ul class="skills-items-sidebar">
                            ${category.items.map(item => `
                                <li class="skill-item-sidebar">${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    setupSkillsHover();
}

function renderInterests(interests) {
    const container = document.querySelector('#interests-tab .interests-container');
    if (!container) return;

    let html = '';

    // Одиночные элементы (семья, языки)
    if (interests.singleItems && interests.singleItems.length > 0) {
        interests.singleItems.forEach(item => {
            html += `
                <div class="interest-single ${item.name === 'Laiks ar ģimeni' ? 'family-item' : ''}">
                    <i class="${item.icon} interest-single-icon"></i>
                    <div class="interest-single-text">${item.name}</div>
                </div>
            `;
        });
    }

    // Категории (спорт)
    if (interests.categories && interests.categories.length > 0) {
        interests.categories.forEach(category => {
            html += `
                <div class="interest-category">
                    <h3 class="interest-category-title">${category.name}</h3>
                    <div class="interest-items">
                        ${category.items.map(item => `
                            <div class="interest-item">
                                <i class="${item.icon} interest-item-icon"></i>
                                <span class="interest-item-text">${item.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

function setupSkillsHover() {
    const categoryBtns = document.querySelectorAll('.skill-category-btn');
    const contentPanes = document.querySelectorAll('.skills-content-pane');

    categoryBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            // Убираем активный класс у всех кнопок и панелей
            categoryBtns.forEach(b => b.classList.remove('active'));
            contentPanes.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Показываем соответствующую панель
            const categoryName = this.getAttribute('data-category');
            const targetPane = document.getElementById(`pane-${categoryName}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Чтобы контент не пропадал при перемещении мыши внутри панели
    const contentArea = document.querySelector('.skills-content-area');
    contentArea.addEventListener('mouseenter', function () {
        // Не делаем ничего - оставляем текущую панель активной
    });

    // Восстанавливаем первую панель при уходе мыши из всего блока
    const sidebarLayout = document.querySelector('.skills-sidebar-layout');
    sidebarLayout.addEventListener('mouseleave', function () {
        categoryBtns.forEach(b => b.classList.remove('active'));
        contentPanes.forEach(p => p.classList.remove('active'));

        // Активируем первую кнопку и панель
        if (categoryBtns[0]) categoryBtns[0].classList.add('active');
        if (contentPanes[0]) contentPanes[0].classList.add('active');
    });
}

// Навигация по разделам
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Убираем активный класс у всех
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Добавляем активный класс текущей
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Переключение языков
function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', async function () {
            const lang = this.getAttribute('data-lang');
            currentLanguage = lang;

            // Обновляем активную кнопку
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const data = await loadContent(lang);
            if (data) {
                updateContent(data);
            }
        });
    });

    // Активируем кнопку текущего языка
    const currentLangBtn = document.querySelector(`.lang-btn[data-lang="${currentLanguage}"]`);
    if (currentLangBtn) {
        currentLangBtn.classList.add('active');
    }
}

// Вкладки в разделе "Обо мне"
function setupAboutTabs() {
    const tabBtns = document.querySelectorAll('.about-tab-btn');
    const tabPanes = document.querySelectorAll('.about-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Убираем активный класс у всех кнопок и вкладок
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Показываем соответствующую вкладку
            const tabId = this.getAttribute('data-tab');
            const targetPane = document.getElementById(`${tabId}-tab`);

            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Улучшение UX для формы обратной связи
function setupFormFeedback() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                // Меняем текст и добавляем спиннер
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sūta...';
                // Блокируем кнопку
                submitBtn.disabled = true;

                // Автоматическое восстановление кнопки через 10 секунд (на случай ошибки)
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sūtīt ziņu';
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Страница загружена, начинаем инициализацию');

    // Сначала настраиваем навигацию (чтобы меню работало сразу)
    setupNavigation();
    // setupLanguageSwitcher(); // Временно отключено

    // Затем загружаем контент
    const data = await loadContent(currentLanguage);

    if (data) {
        updateContent(data);
    }

    // Настраиваем табы
    setupAboutTabs();

    // Настраиваем форму обратной связи
    setupFormFeedback();

    console.log('Инициализация завершена');
});