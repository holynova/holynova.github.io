/**
 * Detail.design Main Application Controller
 * Handles data fetching, filtering, sorting, likes/favorites, progressive card rendering & shortcuts
 * For holynova Portfolio v2
 */

(function() {
  'use strict';

  async function fetchCatalog() {
    const response = await fetch('./data/repos.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load the project catalog');
    const data = await response.json();
    if (!Array.isArray(data?.categories)) throw new Error('Invalid project catalog');
    return data;
  }

  // Start the first request while the browser finishes parsing the document.
  const initialCatalog = fetchCatalog().catch(() => null);

  // Load Likes from localStorage
  function loadLikes() {
    try {
      const saved = localStorage.getItem('detail_portfolio_likes');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  }

  function saveLikes() {
    const list = Array.from(state.likedRepos);
    try {
      localStorage.setItem('detail_portfolio_likes', JSON.stringify(list));
    } catch (e) {}
    syncLikesToServer(list);
  }

  function syncLikesToServer(list) {
    // GitHub Pages is static. Only opt into syncing when a real API endpoint is configured.
    const endpoint = document.documentElement.dataset.likesApi;
    if (!endpoint) return;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list)
    }).catch(() => {});
  }

  const BATCH_SIZE = 12; // Keep the first paint light while making progress visible.

  const mobileLayout = window.matchMedia('(max-width: 768px)');

  const COPY = {
    zh: {
      searchPlaceholder: '搜索作品',
      clearSearch: '清除搜索',
      sort: '排序',
      all: '全部',
      liked: '已收藏',
      favorite: '收藏 {name}',
      unfavorite: '取消收藏 {name}',
      open: '打开作品', web: '在线体验', game: '开始游戏', read: '在线阅读',
      windows: '查看 Windows 版', mac: '查看 Mac 版', extension: '查看扩展', guide: '查看使用说明',
      github: '查看源码', filter: '筛选', showResults: '查看 {total} 个作品',
      loadingCatalog: '正在加载作品…', intro: '小桑的工程与设计作品',
      resultSummary: '显示 {shown} / {total} 个项目',
      noResults: '没有符合条件的项目',
      clearFilters: '清除筛选',
      loadMore: '再看 {count} 个作品',
      progress: '已看 {shown} / {total}',
      loading: '加载更多项目…',
      allShown: '已显示全部 {total} 个项目',
      emptyFavoritesTitle: '还没有收藏的作品',
      emptyFavoritesBody: '点击卡片顶部的爱心按钮即可收藏',
      emptySearchTitle: '未找到相关项目',
      emptySearchBody: '请尝试调整搜索关键词或选择其他分类',
      loadErrorTitle: '项目目录暂时无法加载',
      loadErrorBody: '请检查网络后重试。',
      retry: '重试',
      languageToEnglish: '切换为英文',
      languageToChinese: '切换为中文',
      themeToLight: '切换到浅色模式',
      themeToDark: '切换到深色模式',
      heroSubtitle: '小桑的 {total} 个工程与设计作品'
    },
    en: {
      searchPlaceholder: 'Search projects',
      clearSearch: 'Clear search',
      sort: 'Sort projects',
      all: 'All',
      liked: 'Saved',
      favorite: 'Save {name}',
      unfavorite: 'Remove {name} from saved projects',
      open: 'Open project', web: 'Try online', game: 'Play game', read: 'Read online',
      windows: 'View Windows version', mac: 'View Mac version', extension: 'View extension', guide: 'View guide',
      github: 'View source', filter: 'Filters', showResults: 'Show {total} projects',
      loadingCatalog: 'Loading projects…', intro: 'Engineering and design by Xiaosang',
      resultSummary: 'Showing {shown} of {total} projects',
      noResults: 'No matching projects',
      clearFilters: 'Clear filters',
      loadMore: 'Show {count} more',
      progress: 'Showing {shown} of {total}',
      loading: 'Loading more projects…',
      allShown: 'All {total} curated projects displayed',
      emptyFavoritesTitle: 'No saved projects yet',
      emptyFavoritesBody: 'Use the heart button at the top of any card to save it',
      emptySearchTitle: 'No matching projects',
      emptySearchBody: 'Try adjusting your search terms or choosing another category',
      loadErrorTitle: 'The project directory is temporarily unavailable',
      loadErrorBody: 'Check your connection and try again.',
      retry: 'Try again',
      languageToEnglish: 'Switch to English',
      languageToChinese: '切换为中文',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      heroSubtitle: '{total} engineering and design projects by Xiaosang'
    }
  };

  function t(key, values = {}) {
    let text = COPY[state.currentLang]?.[key] || COPY.en[key] || key;
    Object.entries(values).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Pull a tiny average palette from the local screenshot so its backplate can
  // borrow a restrained amount of color without changing the artwork itself.
  function applyMediaPalette(imageLink, image) {
    const sample = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;

      try {
        const size = 6;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, 0, 0, size, size);

        const pixels = context.getImageData(0, 0, size, size).data;
        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index + 3] < 16) continue;
          red += pixels[index];
          green += pixels[index + 1];
          blue += pixels[index + 2];
          count += 1;
        }

        if (!count) return;
        imageLink.style.setProperty(
          '--media-tint',
          `rgb(${Math.round(red / count)} ${Math.round(green / count)} ${Math.round(blue / count)})`
        );
      } catch (error) {
        // A failed canvas read must never prevent the card or its link from working.
      }
    };

    const scheduleSample = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(sample, { timeout: 1000 });
      } else {
        setTimeout(sample, 20);
      }
    };
    if (image.complete) {
      scheduleSample();
    } else {
      image.addEventListener('load', scheduleSample, { once: true });
    }
  }

  function repoDescription(repo) {
    const desc = repo?.desc || {};
    return desc[state.currentLang] || desc.zh || desc.en || '';
  }

  function categoryName(repo) {
    const name = repo?.categoryName || {};
    return name[state.currentLang] || name.zh || name.en || '';
  }

  function formatStars(stars) {
    const value = Number(stars) || 0;
    if (value <= 0) return '';
    return value > 1000 ? `${(value / 1000).toFixed(1).replace('.0', '')}k` : String(value);
  }

  function focusElement(element) {
    if (element && element.isConnected && typeof element.focus === 'function') {
      element.focus({ preventScroll: true });
      return true;
    }
    return false;
  }

  function createNamePlaceholder(className, name) {
    const placeholder = document.createElement('div');
    placeholder.className = className;
    const label = document.createElement('span');
    label.className = 'placeholder-repo-name';
    label.textContent = name;
    placeholder.appendChild(label);
    return placeholder;
  }

  // Application State
  const state = {
    catalogStatus: 'loading',
    allRepos: [],
    categories: [],
    activeCategory: 'all', // 'all', 'favorites', or category id
    searchQuery: '',
    sortMode: 'latest', // 'latest', 'stars', 'alpha'
    likedRepos: loadLikes(),
    currentLang: localStorage.getItem('detail_portfolio_lang') || 'zh',
    currentTheme: localStorage.getItem('detail_portfolio_theme') || 'dark',
    filteredRepos: [],
    renderedCount: 0,
    isLoadingMore: false,
    userHasScrolled: false
  };

  // DOM Cache
  const DOM = {};

  // Initialize
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    cacheDOM();
    applyTheme(state.currentTheme);
    applyLanguage(state.currentLang);
    bindEvents();
    if (state.likedRepos.size > 0) {
      syncLikesToServer(Array.from(state.likedRepos));
    }
    await loadData(initialCatalog);
  }

  function cacheDOM() {
    DOM.grid = document.getElementById('masonry-grid');
    DOM.searchInput = document.getElementById('search-input');
    DOM.searchClearBtn = document.getElementById('search-clear-btn');
    DOM.searchKeyHint = document.getElementById('search-kbd-hint');
    DOM.pillsContainer = document.getElementById('category-pills');
    DOM.filterSheet = document.getElementById('filter-sheet');
    DOM.filterTrigger = document.getElementById('filter-trigger');
    DOM.filterLabel = document.getElementById('filter-label');
    DOM.showResults = document.getElementById('show-results');
    DOM.mobileSort = document.getElementById('mobile-sort');
    DOM.contact = document.getElementById('author-contact');
    DOM.resultsSummary = document.getElementById('results-summary');
    DOM.clearFiltersBtn = document.getElementById('clear-filters-btn');
    DOM.sortBtn = document.getElementById('sort-dropdown-btn');
    DOM.sortMenu = document.getElementById('sort-menu');
    DOM.sortLabel = document.getElementById('sort-current-label');
    DOM.themeBtn = document.getElementById('theme-toggle-btn');
    DOM.langBtn = document.getElementById('lang-toggle-btn');
    DOM.langLabel = document.getElementById('lang-label');
    DOM.ambientGlowLayer = document.getElementById('ambient-glow-layer');
    DOM.scrollSentinel = document.getElementById('scroll-sentinel');
    DOM.scrollStatus = document.getElementById('scroll-status');
    DOM.stickyToolbar = document.querySelector('.sticky-toolbar-wrapper');
  }

  function setSortMenuOpen(isOpen) {
    DOM.sortMenu.classList.toggle('open', isOpen);
    DOM.sortBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function clearSearch() {
    if (!DOM.searchInput.value && !state.searchQuery) return;
    DOM.searchInput.value = '';
    state.searchQuery = '';
    renderFilteredRepos();
    DOM.searchInput.focus();
  }

  function updateHeroCopy() {
    document.querySelector('.hero-subtitle').textContent = state.catalogStatus === 'ready'
      ? t('heroSubtitle', { total: state.allRepos.length }) : t('intro');
  }

  function placeCategoryControls() {
    if (DOM.filterSheet.open) DOM.filterSheet.close();
    const container = document.getElementById(mobileLayout.matches ? 'mobile-categories' : 'desktop-categories');
    container.appendChild(DOM.pillsContainer);
    setSortMenuOpen(false);
  }

  function showFirstResult() {
    const top = DOM.grid.getBoundingClientRect().top;
    const toolbarHeight = DOM.stickyToolbar.offsetHeight;
    if (top < toolbarHeight) window.scrollBy({ top: top - toolbarHeight - 12, behavior: 'instant' });
  }

  function updateFilterTrigger() {
    const selected = DOM.pillsContainer.querySelector('[aria-pressed="true"]');
    let label = t('filter');
    if (selected && state.activeCategory !== 'all') {
      label = selected.querySelector('.cat-label').textContent + ' · ' + selected.querySelector('.cat-count-badge').textContent;
    } else if (state.sortMode !== 'latest') {
      label += ' · ' + DOM.sortLabel.textContent;
    }
    DOM.filterLabel.textContent = label;
    DOM.filterTrigger.setAttribute('aria-label', state.activeCategory === 'all' ? label : t('filter') + ' · ' + label);
    DOM.showResults.textContent = t('showResults', { total: state.filteredRepos.length });
  }

  function updateSortControls() {
    const labels = {
      zh: { latest: '最新', stars: '星标最多', alpha: '字母顺序' },
      en: { latest: 'Latest', stars: 'Most stars', alpha: 'Name A-Z' }
    };
    DOM.mobileSort.querySelectorAll('input').forEach(input => { input.checked = input.value === state.sortMode; });
    if (DOM.sortLabel) DOM.sortLabel.textContent = labels[state.currentLang][state.sortMode] || state.sortMode;
    document.querySelectorAll('.sort-menu-item').forEach(item => {
      const selected = item.getAttribute('data-sort') === state.sortMode;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-checked', String(selected));
      item.setAttribute('tabindex', selected ? '0' : '-1');
    });
  }

  // Bind Listeners
  function bindEvents() {
    // Scroll Shadow Motion on Sticky Toolbar
    let lastScrolled = false;
    function updateScrollShadow() {
      const isScrolled = window.scrollY > 16;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        if (DOM.stickyToolbar) {
          DOM.stickyToolbar.classList.toggle('is-scrolled', isScrolled);
        }
      }
    }
    window.addEventListener('scroll', updateScrollShadow, { passive: true });
    window.addEventListener('wheel', () => { state.userHasScrolled = true; }, { passive: true });
    window.addEventListener('touchmove', () => { state.userHasScrolled = true; }, { passive: true });
    updateScrollShadow();

    let categoryOnOpen;
    let sortOnOpen;
    placeCategoryControls();
    mobileLayout.addEventListener('change', placeCategoryControls);
    DOM.filterTrigger.addEventListener('click', () => {
      categoryOnOpen = state.activeCategory;
      sortOnOpen = state.sortMode;
      DOM.filterSheet.showModal();
      DOM.filterTrigger.setAttribute('aria-expanded', 'true');
    });
    DOM.filterSheet.addEventListener('close', () => {
      DOM.filterTrigger.setAttribute('aria-expanded', 'false');
      if (mobileLayout.matches) {
        focusElement(DOM.filterTrigger);
        if (categoryOnOpen !== state.activeCategory || sortOnOpen !== state.sortMode) showFirstResult();
      }
    });
    DOM.filterSheet.addEventListener('click', event => {
      if (event.target !== DOM.filterSheet) return;
      const rect = DOM.filterSheet.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right || event.clientY > rect.bottom) DOM.filterSheet.close();
    });
    DOM.mobileSort.addEventListener('change', event => setSortMode(event.target.value));
    document.addEventListener('click', event => {
      if (!DOM.contact.contains(event.target)) DOM.contact.open = false;
    });
    DOM.contact.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        DOM.contact.open = false;
        focusElement(DOM.contact.querySelector('summary'));
      }
    });

    // Mouse tracking for ambient background spotlight
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = normalizeSearch(e.target.value);
      renderFilteredRepos();
      showFirstResult();
    });

    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener('click', clearSearch);
    }

    if (DOM.clearFiltersBtn) {
      DOM.clearFiltersBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        DOM.searchInput.value = '';
        renderCategoryPills();
        renderFilteredRepos();
        focusElement(mobileLayout.matches ? DOM.filterTrigger : DOM.searchInput);
        showFirstResult();
      });
    }

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (DOM.filterSheet.open) return;
      const isInput = document.activeElement === DOM.searchInput;

      if (!isInput && ['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        state.userHasScrolled = true;
      }

      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !isInput) {
        e.preventDefault();
        DOM.searchInput.focus();
      } else if (e.key === 'Escape' && isInput) {
        if (DOM.searchInput.value) {
          clearSearch();
        } else {
          DOM.searchInput.blur();
        }
      }
    });

    // Sort Dropdown Toggle
    DOM.sortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !DOM.sortMenu.classList.contains('open');
      setSortMenuOpen(willOpen);
      if (willOpen) {
        const selected = DOM.sortMenu.querySelector('.sort-menu-item[aria-checked="true"]');
        focusElement(selected || DOM.sortMenu.querySelector('.sort-menu-item'));
      }
    });

    document.addEventListener('click', (event) => {
      if (!DOM.sortMenu.contains(event.target) && event.target !== DOM.sortBtn) {
        setSortMenuOpen(false);
      }
    });

    DOM.sortMenu.addEventListener('keydown', (event) => {
      const items = Array.from(DOM.sortMenu.querySelectorAll('.sort-menu-item'));
      const currentIndex = items.indexOf(event.target.closest('.sort-menu-item'));
      if (currentIndex < 0) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setSortMode(items[currentIndex].getAttribute('data-sort'));
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (currentIndex + direction + items.length) % items.length;
        focusElement(items[nextIndex]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSortMenuOpen(false);
        DOM.sortBtn.focus();
      }
    });

    document.querySelectorAll('.sort-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        setSortMode(e.currentTarget.getAttribute('data-sort'));
      });
    });

    // Theme Switcher
    DOM.themeBtn.addEventListener('click', () => {
      const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    // Language Switcher
    DOM.langBtn.addEventListener('click', () => {
      const nextLang = state.currentLang === 'zh' ? 'en' : 'zh';
      applyLanguage(nextLang);
    });

    DOM.scrollStatus.addEventListener('click', (event) => {
      if (!event.target.closest('#load-more-btn')) return;
      const firstNewIndex = state.renderedCount;
      loadNextBatch();
      if (event.detail === 0) focusElement(DOM.grid.children[firstNewIndex]?.querySelector('.card-title a'));
    });

    DOM.grid.addEventListener('click', (event) => {
      if (event.target.closest('#retry-data-btn')) loadData();
    });

    // Initialize Infinite Scroll Intersection Observer
    initScrollObserver();
  }

  // Load Data
  async function loadData(request = fetchCatalog()) {
    state.catalogStatus = 'loading';
    DOM.grid.replaceChildren();
    DOM.grid.setAttribute('aria-busy', 'true');
    updateResultsSummary();
    try {
      const data = await request;
      if (!data) throw new Error('Could not load the project catalog');
      processLoadedData(data);
    } catch (err) {
      console.warn('Portfolio data fetch failed:', err);
      state.catalogStatus = 'error';
      renderDataError();
    } finally {
      if (DOM.grid) DOM.grid.setAttribute('aria-busy', 'false');
    }
  }

  function renderDataError() {
    if (!DOM.grid) return;
    DOM.grid.innerHTML = `
      <div class="empty-state-box error-state-box">
        <svg class="empty-state-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5"></path>
          <path d="M12 16h.01"></path>
        </svg>
        <div class="empty-state-title">${escapeHtml(t('loadErrorTitle'))}</div>
        <div>${escapeHtml(t('loadErrorBody'))}</div>
        <button class="empty-state-action" id="retry-data-btn" type="button">${escapeHtml(t('retry'))}</button>
      </div>
    `;
    if (DOM.scrollSentinel) DOM.scrollSentinel.style.display = 'none';
    if (DOM.scrollStatus) DOM.scrollStatus.innerHTML = '';
    updateResultsSummary(0, 0);
  }

  function processLoadedData(data) {
    state.categories = (Array.isArray(data.categories) ? data.categories : []).map(category => ({
      ...category,
      repos: (Array.isArray(category.repos) ? category.repos : []).filter(repo => !repo.hidden)
    }));
    const flattened = [];

    state.categories.forEach(cat => {
      (Array.isArray(cat.repos) ? cat.repos : []).forEach(repo => {
        flattened.push({
          ...repo,
          categoryId: cat.id,
          categoryName: cat.name || {}
        });
      });
    });

    state.catalogStatus = 'ready';
    state.allRepos = flattened;
    updateHeroCopy();
    renderCategoryPills();
    renderFilteredRepos();
  }

  function updateLikeButton(button, repoName, isLiked) {
    if (!button) return;
    button.classList.toggle('liked', isLiked);
    button.setAttribute('aria-pressed', String(isLiked));
    button.setAttribute('aria-label', t(isLiked ? 'unfavorite' : 'favorite', { name: button.dataset.projectTitle || repoName }));
    button.title = button.getAttribute('aria-label');

    const heart = button.querySelector('.heart-icon');
    if (heart) {
      heart.setAttribute('fill', isLiked ? '#ef4444' : 'none');
      heart.setAttribute('stroke', isLiked ? '#ef4444' : 'currentColor');
    }
    const countEl = button.querySelector('.like-count');
    if (countEl) countEl.textContent = isLiked ? '1' : '0';
  }

  // Like Toggle Function (Strictly 0 or 1 based on real user actions)
  window.toggleLike = function(repoName, event) {
    if (event) event.stopPropagation();

    const isLiked = state.likedRepos.has(repoName);
    if (isLiked) {
      state.likedRepos.delete(repoName);
    } else {
      state.likedRepos.add(repoName);
    }
    saveLikes();

    const nowLiked = state.likedRepos.has(repoName);

    // Update the compact favorite control on every rendered copy of the card.
    document.querySelectorAll('.card-like-btn').forEach(btn => {
      if (btn.dataset.repoName === repoName) updateLikeButton(btn, repoName, nowLiked);
    });

    // Re-render the filter controls so the saved count and state remain truthful.
    renderCategoryPills();

    if (state.activeCategory === 'favorites') {
      renderFilteredRepos();
    } else {
      updateResultsSummary();
    }
  };

  // Render Category Pills
  function renderCategoryPills() {
    if (!DOM.pillsContainer) return;
    DOM.pillsContainer.innerHTML = '';

    // 1. "All" Pill
    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.dataset.category = 'all';
    allPill.className = `cat-pill-btn ${state.activeCategory === 'all' ? 'active' : ''}`;
    allPill.setAttribute('aria-pressed', String(state.activeCategory === 'all'));
    allPill.innerHTML = `
      <span class="cat-label">${escapeHtml(t('all'))}</span>
      <span class="cat-count-badge">${state.allRepos.length}</span>
    `;
    allPill.addEventListener('click', () => setCategory('all'));
    DOM.pillsContainer.appendChild(allPill);

    // 2. "Favorites / Liked" Pill
    const favPill = document.createElement('button');
    favPill.type = 'button';
    favPill.dataset.category = 'favorites';
    favPill.id = 'favorites-pill-btn';
    favPill.className = `cat-pill-btn favorites-pill ${state.activeCategory === 'favorites' ? 'active' : ''} ${state.likedRepos.size > 0 ? 'has-likes' : ''}`;
    favPill.setAttribute('aria-pressed', String(state.activeCategory === 'favorites'));
    favPill.setAttribute('aria-label', `${t('liked')} (${state.likedRepos.size})`);
    favPill.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <span class="cat-label">${escapeHtml(t('liked'))}</span>
      <span class="cat-count-badge" id="favorites-pill-count">${state.likedRepos.size}</span>
    `;
    favPill.addEventListener('click', () => setCategory('favorites'));


    // 3. Dynamic Category Pills
    state.categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.dataset.category = cat.id;
      pill.className = `cat-pill-btn ${state.activeCategory === cat.id ? 'active' : ''}`;
      pill.setAttribute('aria-pressed', String(state.activeCategory === cat.id));
      const name = cat.name?.[state.currentLang] || cat.name?.zh || cat.name?.en || cat.id;
      pill.innerHTML = `
        <span class="cat-label">${escapeHtml(name)}</span>
        <span class="cat-count-badge">${cat.repos.length}</span>
      `;
      pill.addEventListener('click', () => setCategory(cat.id));
      DOM.pillsContainer.appendChild(pill);
    });
    DOM.pillsContainer.appendChild(favPill);
    updateFilterTrigger();
  }

  function setCategory(catId) {
    if (catId === state.activeCategory) return;
    state.activeCategory = catId;
    DOM.pillsContainer.querySelectorAll('button').forEach(btn => {
      const isActive = btn.dataset.category === catId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    renderFilteredRepos();
  }

  function setSortMode(mode) {
    if (!['latest', 'stars', 'alpha'].includes(mode)) return;
    const menuWasOpen = DOM.sortMenu.classList.contains('open');
    state.sortMode = mode;
    updateSortControls();
    setSortMenuOpen(false);
    renderFilteredRepos();
    if (menuWasOpen) DOM.sortBtn.focus();
  }

  function normalizeSearch(value) {
    return String(value ?? '').normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function searchRank(repo, query) {
    const titles = [repo.name, repo.title?.zh, repo.title?.en].map(normalizeSearch);
    if (titles.includes(query)) return 0;
    if (titles.some(title => title.includes(query))) return 1;
    const details = [repo.desc?.zh, repo.desc?.en, repo.summary?.zh, repo.summary?.en, repo.lang];
    return details.some(value => normalizeSearch(value).includes(query)) ? 2 : 3;
  }

  // Filter & Sort Logic
  function getFilteredAndSortedRepos() {
    const ranks = new Map();
    const list = state.allRepos.filter(repo => {
      if (state.activeCategory === 'favorites') {
        if (!state.likedRepos.has(repo.name)) return false;
      } else if (state.activeCategory !== 'all' && repo.categoryId !== state.activeCategory) {
        return false;
      }
      if (!state.searchQuery) return true;
      const rank = searchRank(repo, state.searchQuery);
      ranks.set(repo, rank);
      return rank < 3;
    });

    list.sort((a, b) => {
      if (state.searchQuery && ranks.get(a) !== ranks.get(b)) return ranks.get(a) - ranks.get(b);
      const dateA = new Date(a.commit_time || a.pushed_at || 0).getTime() || 0;
      const dateB = new Date(b.commit_time || b.pushed_at || 0).getTime() || 0;

      if (state.sortMode === 'stars') {
        return (b.stars || 0) - (a.stars || 0) || (dateB - dateA);
      } else if (state.sortMode === 'alpha') {
        return a.name.localeCompare(b.name);
      } else {
        // Latest First: exact chronological timestamp descending
        return dateB - dateA;
      }
    });

    return list;
  }

  function updateResultsSummary(shown = state.renderedCount, total = state.filteredRepos.length) {
    const safeShown = Math.min(Math.max(Number(shown) || 0, 0), total);
    const ready = state.catalogStatus === 'ready';
    const loading = state.catalogStatus === 'loading';
    DOM.filterTrigger.disabled = !ready;
    if (loading) DOM.resultsSummary.textContent = t('loadingCatalog');
    else if (!ready) DOM.resultsSummary.textContent = '';
    else DOM.resultsSummary.textContent = total ? t('resultSummary', { shown: safeShown, total }) : t('noResults');
    updateFilterTrigger();
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.hidden = !state.searchQuery;
    }
    if (DOM.clearFiltersBtn) {
      const hasActiveFilters = ready && (Boolean(state.searchQuery) || state.activeCategory !== 'all');
      DOM.clearFiltersBtn.hidden = !hasActiveFilters;
      DOM.clearFiltersBtn.setAttribute('aria-hidden', String(!hasActiveFilters));
      DOM.clearFiltersBtn.textContent = t('clearFilters');
    }
  }

  // Scroll Observer for Progressive Infinite Scroll
  let scrollObserver = null;

  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) return;
    if (scrollObserver) scrollObserver.disconnect();

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Do not consume every batch on the first paint when the sentinel starts in the viewport.
        if (!mobileLayout.matches && entry.isIntersecting && state.userHasScrolled && !state.isLoadingMore && state.renderedCount < state.filteredRepos.length) {
          loadNextBatch();
        }
      });
    }, {
      root: null,
      rootMargin: '160px 0px',
      threshold: 0.01
    });

    if (DOM.scrollSentinel) {
      scrollObserver.observe(DOM.scrollSentinel);
    }
  }

  function projectAction(repo) {
    if (!repo.homepage || repo.homepage === repo.url) return 'github';
    if (repo.action) return repo.action;
    if (repo.categoryId === 'chrome-extensions') return 'extension';
    if (repo.categoryId === 'chinese-tools' || repo.categoryId === 'ai-tools') return 'web';
    return 'open';
  }

  // Render Card Element
  function createCardElement(repo, index, delayIndex = 0) {
    const card = document.createElement('article');
    card.className = 'detail-card card-appear';
    card.style.animationDelay = `${Math.min(delayIndex * 0.035, 0.35)}s`;
    card.setAttribute('data-repo-index', index);

    // Clean up animation class once completed so transform is fully unlocked for hover motion
    card.addEventListener('animationend', () => {
      card.classList.remove('card-appear');
      card.style.animationDelay = '';
    }, { once: true });

    const repoTitle = repo.title?.[state.currentLang] || repo.title?.zh || repo.title?.en || repo.name;
    const repoName = String(repo.name || 'Untitled project');
    const descText = repo.summary?.[state.currentLang] || repoDescription(repo);
    const catName = categoryName(repo);
    const isLiked = state.likedRepos.has(repo.name);
    const aspectClass = 'aspect-16-10';

    // Keep only useful status context in the card header. "Recently updated"
    // is intentionally omitted so the card stays focused on the project.
    let statusBadgeHtml = '';
    if (repo.stars && repo.stars > 0) {
      statusBadgeHtml = `<span class="card-status-badge star-badge" aria-label="${escapeHtml(formatStars(repo.stars))} GitHub stars">★ ${escapeHtml(formatStars(repo.stars))}</span>`;
    }

    const cardLikeButtonHtml = `
      <button class="card-like-btn ${isLiked ? 'liked' : ''}" type="button" data-repo-name="${escapeHtml(repoName)}" data-project-title="${escapeHtml(repoTitle)}" title="${escapeHtml(t(isLiked ? 'unfavorite' : 'favorite', { name: repoTitle }))}" aria-label="${escapeHtml(t(isLiked ? 'unfavorite' : 'favorite', { name: repoTitle }))}" aria-pressed="${String(isLiked)}">
        <svg class="heart-icon" width="13" height="13" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </button>
    `;

    const imageTarget = repo.homepage || repo.url;
    const target = escapeHtml(imageTarget);
    const action = escapeHtml(t(projectAction(repo)));
    const title = escapeHtml(repoTitle || repoName);
    const external = 'target="_blank" rel="noopener noreferrer"';
    const screenshot = repo.cover || repo.screenshot || '';
    const webp = /\.(png|jpe?g)$/i.test(screenshot) ? screenshot.replace(/\.(png|jpe?g)$/i, '.webp') : '';
    const loading = index < 2 ? 'loading="eager"' : 'loading="lazy" decoding="async"';
    const mediaHtml = screenshot && imageTarget
      ? `<a href="${target}" ${external} class="card-image-link" aria-label="${action} · ${title}"><picture class="card-picture">${webp ? `<source srcset="${escapeHtml(webp)}" type="image/webp">` : ''}<img src="${escapeHtml(screenshot)}" alt="" class="card-demo-image" width="400" height="250" ${loading} ${index === 0 ? 'fetchpriority="high"' : ''}></picture></a>`
      : `<div class="card-name-placeholder"><span class="placeholder-repo-name">${title}</span></div>`;

    card.innerHTML = `
      <div class="card-meta-header">
        <h2 class="card-title">${imageTarget ? `<a href="${target}" ${external}>${title} <span aria-hidden="true">↗</span></a>` : title}</h2>
        <span class="card-category-tag">${escapeHtml(catName)}</span>
        ${cardLikeButtonHtml}
      </div>
      <div class="card-media-box ${aspectClass}"><div class="visual-canvas-container">${mediaHtml}</div></div>
      <div class="card-body">
        <p class="card-description">${escapeHtml(descText)}</p>
        <div class="card-action-links">
          ${imageTarget ? `<a href="${target}" ${external} class="card-action-btn card-live-demo-btn">${action} <span aria-hidden="true">↗</span></a>` : ''}
          ${repo.homepage && repo.url && repo.homepage !== repo.url ? `<a href="${escapeHtml(repo.url)}" ${external} class="card-action-btn card-github-btn" aria-label="GitHub · ${title}">GitHub</a>` : ''}
          ${statusBadgeHtml}
        </div>
      </div>`;
    const imageLink = card.querySelector('.card-image-link');
    if (imageLink) {
      const image = imageLink.querySelector('.card-demo-image');
      if (image) {
        const updateImageEffect = () => {
          const imageSource = image.currentSrc || image.src;
          const cssSafeImageSource = imageSource.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
          imageLink.style.setProperty('--card-image', `url("${cssSafeImageSource}")`);
          applyMediaPalette(imageLink, image);
        };

        if (image.complete && image.naturalWidth) {
          updateImageEffect();
        } else {
          image.addEventListener('load', updateImageEffect, { once: true });
        }

        image.addEventListener('error', () => {
          const source = image.closest('picture')?.querySelector('source');
          if (source) {
            source.remove();
            return;
          }
          if (repo.cover && repo.screenshot && image.getAttribute('src') !== repo.screenshot) {
            image.src = repo.screenshot;
            return;
          }
          imageLink.replaceWith(createNamePlaceholder('card-name-placeholder', repoTitle));
        });
      }
    }

    const likeButton = card.querySelector('.card-like-btn');
    if (likeButton) {
      likeButton.addEventListener('click', event => window.toggleLike(repoName, event));
    }

    // Web Motion: project a cursor-tracked radial spotlight across the card
    // surface and its border. requestAnimationFrame keeps mousemove cheap.
    let spotlightFrame = 0;
    let spotlightPoint = { x: 0, y: 0 };
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      spotlightPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      if (spotlightFrame) return;
      spotlightFrame = window.requestAnimationFrame(() => {
        card.style.setProperty('--spotlight-x', `${spotlightPoint.x}px`);
        card.style.setProperty('--spotlight-y', `${spotlightPoint.y}px`);
        card.style.setProperty('--spotlight-opacity', '1');
        spotlightFrame = 0;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (spotlightFrame) window.cancelAnimationFrame(spotlightFrame);
      spotlightFrame = 0;
      card.style.setProperty('--spotlight-opacity', '0');
    });
    return card;
  }

  // Load Next Batch for Progressive Scroll
  function loadNextBatch(isInitial = false) {
    if (state.renderedCount >= state.filteredRepos.length) {
      updateScrollStatus(true);
      return;
    }

    state.isLoadingMore = true;
    if (!isInitial) {
      updateScrollStatus(false, true);
    }

    const startIndex = state.renderedCount;
    const endIndex = Math.min(startIndex + BATCH_SIZE, state.filteredRepos.length);
    const slice = state.filteredRepos.slice(startIndex, endIndex);

    const fragment = document.createDocumentFragment();
    slice.forEach((repo, i) => {
      const actualIndex = startIndex + i;
      const card = createCardElement(repo, actualIndex, i);
      fragment.appendChild(card);
    });

    DOM.grid.appendChild(fragment);
    state.renderedCount = endIndex;
    state.isLoadingMore = false;

    updateScrollStatus(state.renderedCount >= state.filteredRepos.length);
    updateResultsSummary();
  }

  // Update Status Indicator at Bottom
  function updateScrollStatus(isEnd, isLoading = false) {
    if (!DOM.scrollStatus) return;

    if (isLoading) {
      DOM.scrollStatus.innerHTML = `
        <div class="scroll-loading-spinner">
          <div class="spinner-icon"></div>
          <span>${escapeHtml(t('loading'))}</span>
        </div>
      `;
    } else if (isEnd) {
      if (state.filteredRepos.length > 0) {
        DOM.scrollStatus.innerHTML = `
          <div class="scroll-end-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>
            <span>${escapeHtml(t('allShown', { total: state.filteredRepos.length }))}</span>
          </div>
        `;
      } else {
        DOM.scrollStatus.innerHTML = '';
      }
    } else {
      DOM.scrollStatus.innerHTML = `
        <div class="scroll-progress-control">
          <span class="scroll-progress-label">${escapeHtml(t('progress', { shown: state.renderedCount, total: state.filteredRepos.length }))}</span>
          <button class="load-more-btn" id="load-more-btn" type="button">${escapeHtml(t('loadMore', { count: Math.min(BATCH_SIZE, state.filteredRepos.length - state.renderedCount) }))}</button>
        </div>
      `;
    }
  }

  // Filter & Initial Batch Trigger
  function renderFilteredRepos() {
    if (state.catalogStatus !== 'ready') { updateResultsSummary(); return; }
    state.filteredRepos = getFilteredAndSortedRepos();

    DOM.grid.innerHTML = '';
    state.renderedCount = 0;
    state.isLoadingMore = false;
    updateResultsSummary(0, state.filteredRepos.length);

    if (state.filteredRepos.length === 0) {
      const isFavEmpty = state.activeCategory === 'favorites' && !state.likedRepos.size && !state.searchQuery;
      DOM.grid.innerHTML = `
        <div class="empty-state-box">
          ${isFavEmpty
            ? '<svg class="empty-state-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 8.8 2.5Z"></path></svg>'
            : '<svg class="empty-state-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>'}
          <div class="empty-state-title">${escapeHtml(isFavEmpty ? t('emptyFavoritesTitle') : t('emptySearchTitle'))}</div>
          <div>${escapeHtml(isFavEmpty ? t('emptyFavoritesBody') : t('emptySearchBody'))}</div>

        </div>
      `;
      if (DOM.scrollStatus) DOM.scrollStatus.innerHTML = '';
      if (DOM.scrollSentinel) DOM.scrollSentinel.style.display = 'none';
      return;
    }

    if (DOM.scrollSentinel) DOM.scrollSentinel.style.display = 'block';

    // Render Initial Batch of 12 Cards
    loadNextBatch(true);
  }

  // Theme
  function applyTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('detail_portfolio_theme', theme);
    if (DOM.themeBtn) {
      DOM.themeBtn.setAttribute('aria-label', theme === 'dark' ? COPY[state.currentLang].themeToLight : COPY[state.currentLang].themeToDark);
      DOM.themeBtn.title = DOM.themeBtn.getAttribute('aria-label');
      DOM.themeBtn.innerHTML = theme === 'dark' 
        ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }

  // Language
  function applyLanguage(lang) {
    if (!COPY[lang]) lang = 'zh';
    state.currentLang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('detail_portfolio_lang', lang);
    if (DOM.langLabel) {
      DOM.langLabel.textContent = lang === 'zh' ? 'EN' : '中文';
    }
    if (DOM.langBtn) {
      DOM.langBtn.setAttribute('aria-label', lang === 'zh' ? COPY.zh.languageToEnglish : COPY.en.languageToChinese);
      DOM.langBtn.title = DOM.langBtn.getAttribute('aria-label');
    }
    if (DOM.searchInput) DOM.searchInput.placeholder = t('searchPlaceholder');
    if (DOM.searchClearBtn) DOM.searchClearBtn.setAttribute('aria-label', t('clearSearch'));
    if (DOM.sortBtn) {
      DOM.sortBtn.setAttribute('aria-label', t('sort'));
      DOM.sortMenu.setAttribute('aria-label', t('sort'));
    }

    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    applyTheme(state.currentTheme);
    updateHeroCopy();
    updateSortControls();
    if (state.catalogStatus === 'error') renderDataError();
    if (state.catalogStatus === 'ready') {
      renderCategoryPills();
      renderFilteredRepos();
    }
    updateResultsSummary();
  }

})();
