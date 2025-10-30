// Configuration
const CONFIG = {
    defaultLanguage: 'lv',
    contentPath: 'content'
};

// Current language
let currentLanguage = CONFIG.defaultLanguage;

// Global variable for translations
window.translations = null;

// Load content
async function loadContent(lang) {
    try {
        console.log('Loading:', `${CONFIG.contentPath}/${lang}.json`);
        const response = await fetch(`${CONFIG.contentPath}/${lang}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('JSON loaded successfully');
        return data;

    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
}

// Update page content
function updateContent(data) {
    if (!data) return;

    // Save translations for portfolio.js
    window.translations = data;

    // If portfolio.js is already loaded, update translations
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
        // Add new fields:
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
        // Flexography data will be picked up automatically via portfolioTranslations
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

// Helper functions
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
                ${exp.additionalInfo ? `
                    <div class="experience-additional">
                        <button class="experience-toggle">
                            <i class="fas fa-chevron-down"></i>
                            Papildus informācija
                        </button>
                        <div class="experience-additional-content">
                            <div class="experience-additional-content-inner">
                                ${Array.isArray(exp.additionalInfo) ?
                exp.additionalInfo.map(item => {
                    // Old format (simple strings)
                    if (typeof item === 'string') {
                        return `<div class="experience-text">${item}</div>`;
                    }
                    // New format (objects with type)
                    else if (item.type === 'text') {
                        return `<div class="experience-text">${item.content}</div>`;
                    } else if (item.type === 'list') {
                        return `
                                                <ul class="experience-additional-list">
                                                    ${item.items.map(listItem => `
                                                        <li class="experience-additional-item">${listItem}</li>
                                                    `).join('')}
                                                </ul>
                                            `;
                    }
                    return '';
                }).join('')
                : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    setupExperienceToggles();
    // If this is active tab - start animation
    if (document.getElementById('work-tab')?.classList.contains('active')) {
        setupExperienceAttention();
    }
}

function renderEducation(educationItems) {
    const container = document.getElementById('education-list');
    if (!container) return;

    container.innerHTML = educationItems.map((edu) => `
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
                            ${edu.additionalInfo.map((item, itemIndex) => {
        const isGrantSubitem = itemIndex === 2 || itemIndex === 3;
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

    // Setup toggles
    setupEducationToggles();

    // If this is active tab - start animation
    if (document.getElementById('education-tab')?.classList.contains('active')) {
        setupEducationAttention();
    }
}

// Handlers for additional information expansion
function setupEducationToggles() {
    const toggles = document.querySelectorAll('.education-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all others
            document.querySelectorAll('.education-additional-content').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.education-toggle').forEach(btn => {
                btn.classList.remove('active');
            });

            // Open/close current
            if (!isActive) {
                content.classList.add('active');
                this.classList.add('active');
            }
        });
    });
}

let educationAnimationShown = false;


function setupEducationAttention() {
    // Check if animation was already shown in this session
    if (educationAnimationShown) {
        return;
    }

    // Wait a second after entering education tab
    setTimeout(() => {
        const firstEducationToggle = document.querySelector('#education-tab .education-toggle');

        if (firstEducationToggle) {
            // Animate scaling and return
            firstEducationToggle.style.transition = 'all 0.1s ease';

            // First scale up
            setTimeout(() => {
                firstEducationToggle.style.transform = 'scale(1.05)';
            }, 100);

            // Return to normal size
            setTimeout(() => {
                firstEducationToggle.style.transform = 'scale(1.0)';
            }, 300);

            // Second scale up
            setTimeout(() => {
                firstEducationToggle.style.transform = 'scale(1.05)';
            }, 500);

            // Final return
            setTimeout(() => {
                firstEducationToggle.style.transform = 'scale(1.0)';
                // Mark that animation was shown
                educationAnimationShown = true;
            }, 700);
        }
    }, 2500);
}

let experienceAnimationShown = false;

function setupExperienceAttention() {
    if (experienceAnimationShown) {
        return;
    }

    setTimeout(() => {
        const firstExperienceToggle = document.querySelector('#work-tab .experience-toggle');

        if (firstExperienceToggle) {
            firstExperienceToggle.style.transition = 'all 0.1s ease';

            setTimeout(() => {
                firstExperienceToggle.style.transform = 'scale(1.05)';
            }, 100);

            setTimeout(() => {
                firstExperienceToggle.style.transform = 'scale(1.0)';
            }, 300);

            setTimeout(() => {
                firstExperienceToggle.style.transform = 'scale(1.05)';
            }, 500);

            setTimeout(() => {
                firstExperienceToggle.style.transform = 'scale(1.0)';
                sessionStorage.setItem('experienceAnimationShown', 'true');
            }, 700);
        }
    }, 2500);
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

    // Add animation on load
    setTimeout(() => {
        const bars = container.querySelectorAll('.language-bar');
        bars.forEach(bar => bar.classList.add('animated'));
    }, 100);
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    if (!container) return;

    // Icons for each category
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

    // Single items (family, languages)
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

    // Categories (sports)
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

// Skills hover functionality with persistent active category
function setupSkillsHover() {
    const categoryBtns = document.querySelectorAll('.skill-category-btn');
    const contentPanes = document.querySelectorAll('.skills-content-pane');

    let activeCategory = 'management'; // Track active category

    categoryBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            contentPanes.forEach(p => p.classList.remove('active'));

            // Add active to current
            this.classList.add('active');

            // Show corresponding pane
            const categoryName = this.getAttribute('data-category');
            const targetPane = document.getElementById(`pane-${categoryName}`);
            if (targetPane) {
                targetPane.classList.add('active');
                activeCategory = categoryName; // Update active category
            }
        });

        // Click for additional reliability
        btn.addEventListener('click', function () {
            const categoryName = this.getAttribute('data-category');
            activeCategory = categoryName;
        });
    });

    // Restore active category on mouse leave
    const sidebarLayout = document.querySelector('.skills-sidebar-layout');
    sidebarLayout.addEventListener('mouseleave', function () {
        categoryBtns.forEach(b => b.classList.remove('active'));
        contentPanes.forEach(p => p.classList.remove('active'));

        // Activate last active category
        const activeBtn = document.querySelector(`.skill-category-btn[data-category="${activeCategory}"]`);
        const activePane = document.getElementById(`pane-${activeCategory}`);

        if (activeBtn) activeBtn.classList.add('active');
        if (activePane) activePane.classList.add('active');
    });

    // Keep content visible when mouse inside content area
    const contentArea = document.querySelector('.skills-content-area');
    contentArea.addEventListener('mouseenter', function () {
        // Do nothing - maintain current active pane
    });
}

// Section navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to current
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Language switching
function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', async function () {
            const lang = this.getAttribute('data-lang');
            currentLanguage = lang;

            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const data = await loadContent(lang);
            if (data) {
                updateContent(data);
            }
        });
    });

    // Activate current language button
    const currentLangBtn = document.querySelector(`.lang-btn[data-lang="${currentLanguage}"]`);
    if (currentLangBtn) {
        currentLangBtn.classList.add('active');
    }
}

// Tabs in About section
function setupAboutTabs() {
    const tabBtns = document.querySelectorAll('.about-tab-btn');
    const tabPanes = document.querySelectorAll('.about-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Hide all tab panes
            tabPanes.forEach(p => p.classList.remove('active'));

            // Activate clicked button
            this.classList.add('active');

            // Get target tab ID and show corresponding pane
            const tabId = this.getAttribute('data-tab');
            const targetPane = document.getElementById(`${tabId}-tab`);

            if (targetPane) {
                targetPane.classList.add('active');

                // Trigger attention animations for specific tabs
                if (tabId === 'work') {
                    setupExperienceAttention();
                }
                if (tabId === 'education') {
                    setupEducationAttention();
                }
            }
        });
    });
}

// UX improvement for contact form
function setupFormFeedback() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                // Change text and add spinner
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sūta...';
                // Disable button
                submitBtn.disabled = true;

                // Auto restore button after 10 seconds (in case of error)
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sūtīt ziņu';
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Page loaded, starting initialization');

    // First setup navigation (so menu works immediately)
    setupNavigation();
    // setupLanguageSwitcher(); // Temporarily disabled

    // Then load content
    const data = await loadContent(currentLanguage);

    if (data) {
        updateContent(data);
    }

    // Setup tabs
    setupAboutTabs();

    // Setup contact form
    setupFormFeedback();

    console.log('Initialization completed');
});

function setupExperienceToggles() {
    const toggles = document.querySelectorAll('.experience-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all others
            document.querySelectorAll('.experience-additional-content').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.experience-toggle').forEach(btn => {
                btn.classList.remove('active');
            });

            // Open/close current
            if (!isActive) {
                content.classList.add('active');
                this.classList.add('active');
            }
        });
    });
}

// ===== HOME PAGE ANIMATION =====
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video-player');

    // Set video to first frame and pause
    video.currentTime = 0;
    video.pause();

    setTimeout(() => {
        // After 2 seconds start playing
        video.play();
    }, 3000);
});

// ===== VIDEO RESTART ON HOME NAVIGATION =====
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const targetSection = this.getAttribute('data-section');

            // Restart video when returning to home section
            if (targetSection === 'home') {
                restartHomeVideo();
            }
        });
    });
});

function restartHomeVideo() {
    const video = document.getElementById('video-player');
    if (video) {
        // Reset video to beginning and pause
        video.currentTime = 0;
        video.pause();

        // Wait 2 seconds before playing
        setTimeout(() => {
            video.play().catch(error => {
                console.log('Video play prevented:', error);
            });
        }, 3000); // 2 second delay
    }
}


