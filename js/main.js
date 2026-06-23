/**
 * Modern Portfolio - Main JavaScript
 * Replaces jQuery with vanilla ES6+
 */
(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentLang: 'zh',
        activeCategory: 'all',
        searchQuery: '',
        data: null,
        filteredCategories: []
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        searchInput: document.getElementById('search-input'),
        searchClear: document.getElementById('search-clear'),
        filterTags: document.getElementById('filter-tags'),
        categoriesGrid: document.getElementById('categories-grid'),
        noResults: document.getElementById('no-results'),
        langToggle: document.getElementById('lang-toggle'),
        backToTop: document.getElementById('back-to-top'),
        repoCount: document.getElementById('repo-count'),
        lastUpdate: document.getElementById('last-update')
    };

    // ============================================
    // Language Management
    // ============================================
    function initLanguage() {
        const savedLang = localStorage.getItem('portfolio-lang') || 'zh';
        state.currentLang = savedLang;
        updateLanguageUI();
    }

    function toggleLanguage() {
        state.currentLang = state.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('portfolio-lang', state.currentLang);
        updateLanguageUI();
        renderCategories();
    }

    function updateLanguageUI() {
        const isZh = state.currentLang === 'zh';

        // Update toggle button
        elements.langToggle.querySelector('.lang-text').textContent = isZh ? 'EN' : '中';

        // Update title
        document.getElementById('site-title').textContent = isZh
            ? '小桑前端作品集'
            : 'Xiaosang Frontend Portfolio';

        // Update all elements with data-zh/data-en attributes
        document.querySelectorAll('[data-zh]').forEach(el => {
            el.textContent = isZh ? el.dataset.zh : el.dataset.en;
        });

        // Update placeholders
        document.querySelectorAll('[data-zh-placeholder]').forEach(el => {
            el.placeholder = isZh ? el.dataset.zhPlaceholder : el.dataset.enPlaceholder;
        });

        // Update last update text
        if (state.data) {
            elements.lastUpdate.textContent = isZh
                ? `最后更新: ${state.data.lastUpdated}`
                : `Last updated: ${state.data.lastUpdated}`;
        }
    }

    // ============================================
    // Data Loading
    // ============================================
    async function loadData() {
        try {
            const response = await fetch('data/repos.json');
            if (!response.ok) throw new Error('Failed to load data');
            state.data = await response.json();

            // Calculate total repos
            let totalRepos = 0;
            state.data.categories.forEach(cat => {
                totalRepos += cat.repos.length;
            });

            // Update UI
            elements.repoCount.textContent = totalRepos;
            elements.lastUpdate.textContent = state.currentLang === 'zh'
                ? `最后更新: ${state.data.lastUpdated}`
                : `Last updated: ${state.data.lastUpdated}`;

            // Initialize filters
            initFilters();

            // Render categories
            renderCategories();

        } catch (error) {
            console.error('Error loading data:', error);
            elements.categoriesGrid.innerHTML = `
                <div class="no-results">
                    <p>Failed to load project data. Please try again later.</p>
                </div>
            `;
        }
    }

    // ============================================
    // Filter Management
    // ============================================
    function initFilters() {
        if (!state.data) return;

        const filterTags = elements.filterTags;
        const isZh = state.currentLang === 'zh';

        // Clear existing tags (keep "All" button)
        filterTags.innerHTML = '';

        // Add "All" button
        const allBtn = createTagButton('all', isZh ? '全部' : 'All', countAllRepos());
        filterTags.appendChild(allBtn);

        // Add category buttons
        state.data.categories.forEach(category => {
            const btn = createTagButton(
                category.id,
                isZh ? category.name.zh : category.name.en,
                category.repos.length
            );
            filterTags.appendChild(btn);
        });
    }

    function createTagButton(id, label, count) {
        const btn = document.createElement('button');
        btn.className = `tag-btn${id === state.activeCategory ? ' active' : ''}`;
        btn.dataset.category = id;
        btn.innerHTML = `
            ${label}
            <span class="tag-count">${count}</span>
        `;
        btn.addEventListener('click', () => filterByCategory(id));
        return btn;
    }

    function countAllRepos() {
        if (!state.data) return 0;
        return state.data.categories.reduce((sum, cat) => sum + cat.repos.length, 0);
    }

    function filterByCategory(categoryId) {
        state.activeCategory = categoryId;

        // Update active state
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === categoryId);
        });

        renderCategories();
    }

    // ============================================
    // Search Management
    // ============================================
    function initSearch() {
        let searchTimeout;

        elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                state.searchQuery = e.target.value.toLowerCase().trim();
                renderCategories();
            }, 300);
        });

        elements.searchClear.addEventListener('click', () => {
            elements.searchInput.value = '';
            state.searchQuery = '';
            renderCategories();
        });
    }

    function filterRepos(repos) {
        if (!state.searchQuery) return repos;

        const query = state.searchQuery;
        const isZh = state.currentLang === 'zh';

        return repos.filter(repo => {
            const name = repo.name.toLowerCase();
            const desc = isZh
                ? (repo.desc?.zh || '').toLowerCase()
                : (repo.desc?.en || '').toLowerCase();
            const lang = (repo.lang || '').toLowerCase();

            return name.includes(query) ||
                   desc.includes(query) ||
                   lang.includes(query);
        });
    }

    // ============================================
    // Rendering
    // ============================================
    function renderCategories() {
        if (!state.data) return;

        const grid = elements.categoriesGrid;
        const isZh = state.currentLang === 'zh';
        let hasResults = false;

        // Filter categories
        const filteredCategories = state.data.categories.filter(category => {
            // Filter by active category
            if (state.activeCategory !== 'all' && category.id !== state.activeCategory) {
                return false;
            }

            // Filter repos by search
            const filteredRepos = filterRepos(category.repos);
            return filteredRepos.length > 0;
        });

        // Render
        grid.innerHTML = '';

        filteredCategories.forEach((category, index) => {
            const filteredRepos = filterRepos(category.repos);
            if (filteredRepos.length === 0) return;

            hasResults = true;

            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.animationDelay = `${index * 0.05}s`;

            // Expand by default if filtering or if there are few categories
            const shouldExpand = state.searchQuery ||
                                state.activeCategory !== 'all' ||
                                filteredCategories.length <= 3;

            if (shouldExpand) {
                card.classList.add('expanded');
            }

            card.innerHTML = `
                <div class="category-header">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-title">${isZh ? category.name.zh : category.name.en}</span>
                    <span class="category-count">${filteredRepos.length}</span>
                    <span class="category-arrow">▼</span>
                </div>
                <div class="category-content">
                    <ul class="repo-list">
                        ${filteredRepos.map(repo => renderRepoItem(repo)).join('')}
                    </ul>
                </div>
            `;

            // Add click handler for accordion
            const header = card.querySelector('.category-header');
            header.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });

            grid.appendChild(card);
        });

        // Show/hide no results
        elements.noResults.style.display = hasResults ? 'none' : 'block';
    }

    function renderRepoItem(repo) {
        const isZh = state.currentLang === 'zh';
        const desc = isZh ? (repo.desc?.zh || '') : (repo.desc?.en || '');
        const starsHtml = repo.stars ? `<span class="repo-stars">⭐ ${repo.stars}</span>` : '';

        // Determine link - prefer homepage if available
        const linkUrl = repo.url || '#';
        const isExternal = linkUrl.startsWith('http');
        const linkTarget = isExternal ? 'target="_blank" rel="noopener"' : '';

        return `
            <li class="repo-item">
                <div class="repo-icon">${getLanguageIcon(repo.lang)}</div>
                <div class="repo-info">
                    <a href="${linkUrl}" class="repo-name" ${linkTarget}>${repo.name}</a>
                    <div class="repo-desc">${desc}</div>
                </div>
                <div class="repo-meta">
                    ${repo.lang ? `<span class="repo-lang">${repo.lang}</span>` : ''}
                    ${starsHtml}
                    <a href="${linkUrl}" class="repo-link" ${linkTarget}>→</a>
                </div>
            </li>
        `;
    }

    function getLanguageIcon(lang) {
        const icons = {
            'JavaScript': '📜',
            'TypeScript': '🔷',
            'Python': '🐍',
            'HTML': '🌐',
            'HTML5': '🌐',
            'CSS': '🎨',
            'CSS3': '🎨',
            'React': '⚛️',
            'Vue': '💚',
            'Angular': '🅰️',
            'Node.js': '💚',
            'Rust': '🦀',
            'Svelte': '🔥',
            'Java': '☕',
            'Scheme': '📖',
            'Bootstrap': '🅱️',
            'Canvas': '🖼️',
            'Chrome Extension': '🔌'
        };
        return icons[lang] || '📁';
    }

    // ============================================
    // Scroll Management
    // ============================================
    function initScroll() {
        // Back to top button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        });

        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Initialize language
        initLanguage();

        // Initialize search
        initSearch();

        // Initialize scroll
        initScroll();

        // Load data
        loadData();

        // Language toggle
        elements.langToggle.addEventListener('click', toggleLanguage);

        // Update page title
        document.title = state.currentLang === 'zh'
            ? '小桑前端作品集 | Xiaosang Frontend Portfolio'
            : 'Xiaosang Frontend Portfolio | 小桑前端作品集';
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
