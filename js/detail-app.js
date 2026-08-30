/**
 * Detail.design Main Application Controller
 * Handles data fetching, filtering, sorting, likes/favorites, masonry rendering, detail inspector & shortcuts
 * For holynova Portfolio v2
 */

(function() {
  'use strict';

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

  const COPY = {
    zh: {
      searchPlaceholder: '搜索项目、描述或语言（按 / 聚焦）…',
      clearSearch: '清除搜索',
      sort: '排序',
      all: '全部',
      liked: '已点赞',
      detail: '查看 {name} 详情',
      viewDetails: '查看详情',
      imagePreview: '查看 {name} 的大图',
      favorite: '收藏 {name}',
      unfavorite: '取消收藏 {name}',
      liveDemo: '在线演示',
      github: 'GitHub 源码',
      closeDetails: '关闭详情',
      previous: '上一个项目',
      next: '下一个项目',
      projectPosition: '第 {current} / {total} 个项目',
      closeImage: '关闭大图预览',
      resultSummary: '显示 {shown} / {total} 个项目',
      noResults: '没有符合条件的项目',
      clearFilters: '清除筛选',
      loadMore: '加载更多项目',
      loading: '加载更多项目…',
      allShown: '已显示全部 {total} 个项目',
      new: '新近更新',
      code: '代码',
      recently: '最近更新',
      emptyFavoritesTitle: '暂无已点赞的项目',
      emptyFavoritesBody: '点击项目卡片右下角的爱心按钮即可收藏',
      emptySearchTitle: '未找到相关项目',
      emptySearchBody: '请尝试调整搜索关键词或选择其他分类',
      loadErrorTitle: '项目目录暂时无法加载',
      loadErrorBody: '请检查网络后重试。',
      retry: '重试',
      languageToEnglish: '切换为英文',
      languageToChinese: '切换为中文',
      themeToLight: '切换到浅色模式',
      themeToDark: '切换到深色模式',
      curatedBy: '精选自',
      heroSubtitle: '精选收录 {total} 个工程与设计项目，持续探索更好的产品。'
    },
    en: {
      searchPlaceholder: 'Search projects, descriptions, or languages (press / to focus)…',
      clearSearch: 'Clear search',
      sort: 'Sort projects',
      all: 'All',
      liked: 'Liked',
      detail: 'View details for {name}',
      viewDetails: 'View details',
      imagePreview: 'View a larger preview of {name}',
      favorite: 'Save {name}',
      unfavorite: 'Remove {name} from saved projects',
      liveDemo: 'Try Live Demo',
      github: 'GitHub Source',
      closeDetails: 'Close details',
      previous: 'Previous project',
      next: 'Next project',
      projectPosition: 'Project {current} of {total}',
      closeImage: 'Close image preview',
      resultSummary: 'Showing {shown} of {total} projects',
      noResults: 'No matching projects',
      clearFilters: 'Clear filters',
      loadMore: 'Load more projects',
      loading: 'Loading more projects…',
      allShown: 'All {total} curated projects displayed',
      new: 'Recently updated',
      code: 'Code',
      recently: 'Recently updated',
      emptyFavoritesTitle: 'No liked projects yet',
      emptyFavoritesBody: 'Use the heart button on any project card to save it here',
      emptySearchTitle: 'No matching repositories found',
      emptySearchBody: 'Try adjusting your search terms or choosing another category',
      loadErrorTitle: 'The project directory is temporarily unavailable',
      loadErrorBody: 'Check your connection and try again.',
      retry: 'Try again',
      languageToEnglish: 'Switch to English',
      languageToChinese: '切换为中文',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      curatedBy: 'Curated by',
      heroSubtitle: 'A curated collection of {total} fine-crafted engineering & design projects shaping better products.'
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

  function syncBodyScrollLock() {
    const modalOpen = state.activeModalIndex >= 0;
    const lightboxOpen = DOM.imageLightbox?.classList.contains('open');
    document.body.style.overflow = modalOpen || lightboxOpen ? 'hidden' : '';
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
    allRepos: [],
    categories: [],
    activeCategory: 'all', // 'all', 'favorites', or category id
    searchQuery: '',
    sortMode: 'latest', // 'latest', 'stars', 'alpha'
    likedRepos: loadLikes(),
    currentLang: localStorage.getItem('detail_portfolio_lang') || 'zh',
    currentTheme: localStorage.getItem('detail_portfolio_theme') || 'dark',
    activeModalIndex: -1,
    modalReturnFocus: null,
    imageReturnFocus: null,
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
    await loadData();
  }

  function cacheDOM() {
    DOM.grid = document.getElementById('masonry-grid');
    DOM.searchInput = document.getElementById('search-input');
    DOM.searchClearBtn = document.getElementById('search-clear-btn');
    DOM.searchKeyHint = document.getElementById('search-kbd-hint');
    DOM.pillsContainer = document.getElementById('category-pills');
    DOM.totalCounter = document.getElementById('total-counter');
    DOM.resultsSummary = document.getElementById('results-summary');
    DOM.clearFiltersBtn = document.getElementById('clear-filters-btn');
    DOM.sortBtn = document.getElementById('sort-dropdown-btn');
    DOM.sortMenu = document.getElementById('sort-menu');
    DOM.sortLabel = document.getElementById('sort-current-label');
    DOM.themeBtn = document.getElementById('theme-toggle-btn');
    DOM.langBtn = document.getElementById('lang-toggle-btn');
    DOM.langLabel = document.getElementById('lang-label');
    DOM.modalBackdrop = document.getElementById('detail-inspector');
    DOM.modalCard = document.getElementById('inspector-card');
    DOM.modalCloseBtn = document.getElementById('inspector-close-btn');
    DOM.modalPrevBtn = document.getElementById('inspector-prev-btn');
    DOM.modalNextBtn = document.getElementById('inspector-next-btn');
    DOM.modalLikeBtn = document.getElementById('inspector-like-btn');
    DOM.modalLikeCount = document.getElementById('inspector-like-count');
    DOM.modalPosition = document.getElementById('inspector-position');
    DOM.modalIframeContainer = document.getElementById('inspector-iframe-container');
    DOM.modalTitle = document.getElementById('inspector-title');
    DOM.modalDesc = document.getElementById('inspector-desc');
    DOM.modalCategoryTag = document.getElementById('inspector-category-tag');
    DOM.modalLangVal = document.getElementById('inspector-lang-val');
    DOM.modalDateVal = document.getElementById('inspector-date-val');
    DOM.modalStarsVal = document.getElementById('inspector-stars-val');
    DOM.modalLiveBtn = document.getElementById('inspector-live-btn');
    DOM.modalGithubBtn = document.getElementById('inspector-github-btn');
    DOM.imageLightbox = document.getElementById('image-lightbox');
    DOM.imageLightboxImage = document.getElementById('image-lightbox-image');
    DOM.imageLightboxCloseBtn = document.getElementById('image-lightbox-close');
    DOM.ambientGlowLayer = document.getElementById('ambient-glow-layer');
    DOM.scrollSentinel = document.getElementById('scroll-sentinel');
    DOM.scrollStatus = document.getElementById('scroll-status');
    DOM.stickyToolbar = document.querySelector('.sticky-toolbar-wrapper');
  }

  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => {
      const styles = window.getComputedStyle(element);
      return !element.hidden
        && element.getAttribute('aria-hidden') !== 'true'
        && styles.display !== 'none'
        && styles.visibility !== 'hidden'
        && element.getClientRects().length > 0;
    });
  }

  function trapFocus(container, event) {
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      event.preventDefault();
      focusElement(container);
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
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
    const total = state.allRepos.length || 84;
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t('heroSubtitle', { total });
  }

  function updateSortControls() {
    const labels = {
      zh: { latest: '最新', stars: 'Star', alpha: '字母顺序' },
      en: { latest: 'Latest', stars: 'Star', alpha: 'Name A-Z' }
    };
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

    // Mouse tracking for ambient background spotlight
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderFilteredRepos();
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
        DOM.searchInput.focus();
      });
    }

    // Global Keyboard Shortcuts and modal focus management
    window.addEventListener('keydown', (e) => {
      const isInput = document.activeElement === DOM.searchInput;
      const isLightboxOpen = DOM.imageLightbox.classList.contains('open');
      const isModalOpen = state.activeModalIndex >= 0;

      if (!isLightboxOpen && !isModalOpen && !isInput && ['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        state.userHasScrolled = true;
      }

      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeImageLightbox();
        } else if (e.key === 'Tab') {
          trapFocus(DOM.imageLightbox, e);
        }
        return;
      }

      if (isModalOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeInspectorModal();
        } else if (e.key === 'Tab') {
          trapFocus(DOM.modalCard, e);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateModal(1);
        } else if (e.key.toLowerCase() === 'l' && !isInput) {
          const repo = state.filteredRepos[state.activeModalIndex];
          if (repo) toggleLike(repo.name);
        }
        return;
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

    // Inspector Modal Controls
    DOM.modalCloseBtn.addEventListener('click', closeInspectorModal);
    DOM.modalPrevBtn.addEventListener('click', () => navigateModal(-1));
    DOM.modalNextBtn.addEventListener('click', () => navigateModal(1));
    if (DOM.modalLikeBtn) {
      DOM.modalLikeBtn.addEventListener('click', () => {
        const repo = state.filteredRepos[state.activeModalIndex];
        if (repo) toggleLike(repo.name);
      });
    }
    DOM.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === DOM.modalBackdrop) {
        closeInspectorModal();
      }
    });
    DOM.modalIframeContainer.addEventListener('click', (event) => {
      const previewButton = event.target.closest('.inspector-image-button');
      if (previewButton) {
        openImageLightbox(previewButton.dataset.previewSrc, previewButton.dataset.previewAlt, previewButton);
      }
    });
    DOM.imageLightboxCloseBtn.addEventListener('click', closeImageLightbox);
    DOM.imageLightbox.addEventListener('click', (event) => {
      if (event.target === DOM.imageLightbox) closeImageLightbox();
    });

    DOM.scrollStatus.addEventListener('click', (event) => {
      if (event.target.closest('#load-more-btn')) loadNextBatch();
    });

    DOM.grid.addEventListener('click', (event) => {
      if (event.target.closest('#retry-data-btn')) loadData();
    });

    // Initialize Infinite Scroll Intersection Observer
    initScrollObserver();
  }

  // Load Data
  async function loadData() {
    if (DOM.grid) DOM.grid.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('./data/repos.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      processLoadedData(data);
    } catch (err) {
      console.warn('Portfolio data fetch failed:', err);
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
    state.categories = Array.isArray(data.categories) ? data.categories : [];
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

    state.allRepos = flattened;
    updateHeroCopy();
    renderCategoryPills();
    renderFilteredRepos();
  }

  function updateLikeButton(button, repoName, isLiked) {
    if (!button) return;
    button.classList.toggle('liked', isLiked);
    button.setAttribute('aria-pressed', String(isLiked));
    button.setAttribute('aria-label', isLiked ? t('unfavorite', { name: repoName }) : t('favorite', { name: repoName }));
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

    // Update matching card buttons without relying on a selector built from user data.
    document.querySelectorAll('.card-like-btn').forEach(btn => {
      if (btn.dataset.repoName === repoName) updateLikeButton(btn, repoName, nowLiked);
    });

    // Update modal button if open for this repo.
    const currentModalRepo = state.filteredRepos[state.activeModalIndex];
    if (currentModalRepo && currentModalRepo.name === repoName) {
      updateLikeButton(DOM.modalLikeBtn, repoName, nowLiked);
    }

    // Re-render the filter controls so the saved count and state remain truthful.
    renderCategoryPills();

    // A project removed from the saved-only view no longer belongs in the open detail.
    if (state.activeCategory === 'favorites' && !nowLiked && currentModalRepo?.name === repoName) {
      closeInspectorModal();
    }

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
    DOM.pillsContainer.appendChild(favPill);

    // 3. Dynamic Category Pills
    state.categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.type = 'button';
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
  }

  function setCategory(catId) {
    state.activeCategory = catId;
    document.querySelectorAll('.cat-pill-btn').forEach((btn, idx) => {
      let isActive = false;
      if (idx === 0) {
        isActive = catId === 'all';
      } else if (idx === 1) {
        isActive = catId === 'favorites';
      } else {
        const cat = state.categories[idx - 2];
        isActive = Boolean(cat && cat.id === catId);
      }
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

  // Filter & Sort Logic
  function getFilteredAndSortedRepos() {
    let list = state.allRepos.filter(repo => {
      // Category Match
      if (state.activeCategory === 'favorites') {
        if (!state.likedRepos.has(repo.name)) return false;
      } else if (state.activeCategory !== 'all' && repo.categoryId !== state.activeCategory) {
        return false;
      }

      // Query Match
      if (state.searchQuery) {
        const q = state.searchQuery;
        const nameMatch = String(repo.name || '').toLowerCase().includes(q);
        const zhMatch = String(repo.desc?.zh || '').toLowerCase().includes(q);
        const enMatch = String(repo.desc?.en || '').toLowerCase().includes(q);
        const langMatch = String(repo.lang || '').toLowerCase().includes(q);
        return nameMatch || zhMatch || enMatch || langMatch;
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
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
    if (DOM.resultsSummary) {
      DOM.resultsSummary.textContent = total > 0
        ? t('resultSummary', { shown: safeShown, total })
        : t('noResults');
    }
    if (DOM.totalCounter) {
      DOM.totalCounter.textContent = `${total} ${state.currentLang === 'zh' ? '项' : 'details'}`;
    }
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.hidden = !state.searchQuery;
    }
    if (DOM.clearFiltersBtn) {
      const hasActiveFilters = Boolean(state.searchQuery) || state.activeCategory !== 'all';
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
        if (entry.isIntersecting && state.userHasScrolled && !state.isLoadingMore && state.renderedCount < state.filteredRepos.length) {
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

    const repoName = String(repo.name || 'Untitled project');
    const descText = repoDescription(repo);
    const catName = categoryName(repo);
    const isLiked = state.likedRepos.has(repo.name);
    const aspectClass = 'aspect-16-10';

    // Status Badge
    let statusBadgeHtml = '';
    if (repo.stars && repo.stars > 0) {
      statusBadgeHtml = `<span class="card-status-badge star-badge" aria-label="${escapeHtml(formatStars(repo.stars))} GitHub stars">★ ${escapeHtml(formatStars(repo.stars))}</span>`;
    } else if (repo.pushed_at && repo.pushed_at.startsWith('2026-08')) {
      statusBadgeHtml = `<span class="card-status-badge new-badge">${escapeHtml(t('new'))}</span>`;
    }

    const mediaHtml = repo.screenshot
      ? `<button type="button" class="card-image-preview" data-preview-src="${escapeHtml(repo.screenshot)}" data-preview-alt="${escapeHtml(t('imagePreview', { name: repoName }))}" aria-label="${escapeHtml(t('imagePreview', { name: repoName }))}"><img src="${escapeHtml(repo.screenshot)}" alt="${escapeHtml(repoName)}" class="card-demo-image" loading="lazy" decoding="async"></button>`
      : `<div class="card-name-placeholder"><span class="placeholder-repo-name">${escapeHtml(repoName)}</span></div>`;

    card.innerHTML = `
      <div class="card-media-box ${aspectClass}">
        <div class="visual-canvas-container">
          ${mediaHtml}
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta-header">
          <span class="card-category-tag">${escapeHtml(catName)}</span>
          ${statusBadgeHtml}
        </div>
        <h3 class="card-title">${escapeHtml(repoName)}</h3>
        <p class="card-description">${escapeHtml(descText)}</p>
        <button type="button" class="card-detail-trigger" data-detail-index="${index}" aria-label="${escapeHtml(t('detail', { name: repoName }))}">
          <span>${escapeHtml(t('viewDetails'))}</span>
          <span aria-hidden="true">→</span>
        </button>
        <div class="card-footer-row">
          <div class="card-tech-pills">
            <span class="card-tech-pill">${escapeHtml(repo.lang || t('code'))}</span>
            ${(repo.commit_time || repo.pushed_at) ? `<span class="card-tech-pill">${escapeHtml(String(repo.commit_time || repo.pushed_at).slice(0, 10))}</span>` : ''}
          </div>
          <div class="card-action-links">
            <!-- Like Button -->
            <button class="card-like-btn ${isLiked ? 'liked' : ''}" type="button" data-repo-name="${escapeHtml(repoName)}" title="${escapeHtml(isLiked ? t('unfavorite', { name: repoName }) : t('favorite', { name: repoName }))}" aria-label="${escapeHtml(isLiked ? t('unfavorite', { name: repoName }) : t('favorite', { name: repoName }))}" aria-pressed="${String(isLiked)}">
              <svg class="heart-icon" width="13" height="13" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span class="like-count">${isLiked ? '1' : '0'}</span>
            </button>

            ${repo.homepage ? `
              <a href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer" class="card-link-icon-btn" title="${escapeHtml(t('liveDemo'))}" aria-label="${escapeHtml(t('liveDemo'))}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            ` : ''}
            <a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer" class="card-link-icon-btn" title="${escapeHtml(t('github'))}" aria-label="${escapeHtml(t('github'))}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    const previewButton = card.querySelector('.card-image-preview');
    if (previewButton) {
      previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImageLightbox(previewButton.dataset.previewSrc, previewButton.dataset.previewAlt, previewButton);
      });

      const image = previewButton.querySelector('.card-demo-image');
      if (image) {
        image.addEventListener('error', () => {
          previewButton.replaceWith(createNamePlaceholder('card-name-placeholder', repoName));
        }, { once: true });
      }
    }

    const likeButton = card.querySelector('.card-like-btn');
    if (likeButton) {
      likeButton.addEventListener('click', event => window.toggleLike(repoName, event));
    }

    const detailButton = card.querySelector('.card-detail-trigger');
    if (detailButton) {
      detailButton.addEventListener('click', event => {
        event.stopPropagation();
        openInspectorModal(index, detailButton);
      });
    }

    // Preserve the fast mouse interaction on the card surface while leaving every nested action independent.
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      openInspectorModal(index, detailButton);
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
          <span class="scroll-progress-label">${escapeHtml(t('resultSummary', { shown: state.renderedCount, total: state.filteredRepos.length }))}</span>
          <button class="load-more-btn" id="load-more-btn" type="button">${escapeHtml(t('loadMore'))}</button>
        </div>
      `;
    }
  }

  // Filter & Initial Batch Trigger
  function renderFilteredRepos() {
    state.filteredRepos = getFilteredAndSortedRepos();

    DOM.grid.innerHTML = '';
    state.renderedCount = 0;
    state.isLoadingMore = false;
    updateResultsSummary(0, state.filteredRepos.length);

    if (state.filteredRepos.length === 0) {
      const isFavEmpty = state.activeCategory === 'favorites';
      DOM.grid.innerHTML = `
        <div class="empty-state-box">
          ${isFavEmpty
            ? '<svg class="empty-state-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 8.8 2.5Z"></path></svg>'
            : '<svg class="empty-state-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>'}
          <div class="empty-state-title">${escapeHtml(isFavEmpty ? t('emptyFavoritesTitle') : t('emptySearchTitle'))}</div>
          <div>${escapeHtml(isFavEmpty ? t('emptyFavoritesBody') : t('emptySearchBody'))}</div>
          ${!isFavEmpty && (state.searchQuery || state.activeCategory !== 'all')
            ? `<button class="empty-state-action" type="button" id="empty-clear-filters-btn">${escapeHtml(t('clearFilters'))}</button>`
            : ''}
        </div>
      `;
      if (DOM.scrollStatus) DOM.scrollStatus.innerHTML = '';
      if (DOM.scrollSentinel) DOM.scrollSentinel.style.display = 'none';
      const emptyClearButton = document.getElementById('empty-clear-filters-btn');
      if (emptyClearButton) emptyClearButton.addEventListener('click', () => DOM.clearFiltersBtn.click());
      return;
    }

    if (DOM.scrollSentinel) DOM.scrollSentinel.style.display = 'block';

    // Render Initial Batch of 12 Cards
    loadNextBatch(true);
  }

  // Detail Inspector Modal
  function populateInspector(index) {
    const repo = state.filteredRepos[index];
    if (!repo) return false;

    const repoName = String(repo.name || 'Untitled project');
    const isLiked = state.likedRepos.has(repo.name);
    const dateLabel = repo.commit_time
      ? String(repo.commit_time).slice(0, 10)
      : (repo.pushed_at ? String(repo.pushed_at).slice(0, 10) : t('recently'));

    DOM.modalTitle.textContent = repoName;
    DOM.modalDesc.textContent = repoDescription(repo);
    DOM.modalCategoryTag.textContent = categoryName(repo);
    DOM.modalLangVal.textContent = repo.lang || t('code');
    DOM.modalDateVal.textContent = dateLabel;
    DOM.modalStarsVal.textContent = repo.stars ? `★ ${formatStars(repo.stars)}` : '0';
    DOM.modalGithubBtn.href = repo.url || '#';
    DOM.modalGithubBtn.setAttribute('aria-label', t('github'));

    updateLikeButton(DOM.modalLikeBtn, repoName, isLiked);
    if (DOM.modalPosition) {
      DOM.modalPosition.textContent = `${index + 1} / ${state.filteredRepos.length}`;
      DOM.modalPosition.setAttribute('aria-label', t('projectPosition', {
        current: index + 1,
        total: state.filteredRepos.length
      }));
    }
    DOM.modalPrevBtn.disabled = state.filteredRepos.length <= 1;
    DOM.modalNextBtn.disabled = state.filteredRepos.length <= 1;
    DOM.modalPrevBtn.setAttribute('aria-label', t('previous'));
    DOM.modalNextBtn.setAttribute('aria-label', t('next'));
    DOM.modalCloseBtn.setAttribute('aria-label', t('closeDetails'));
    DOM.modalCloseBtn.title = `${t('closeDetails')} (ESC)`;

    // Consistency: preview matches the card image, and is itself an explicit image action.
    DOM.modalIframeContainer.innerHTML = '';
    if (repo.screenshot) {
      const previewButton = document.createElement('button');
      previewButton.type = 'button';
      previewButton.className = 'inspector-image-button';
      previewButton.dataset.previewSrc = repo.screenshot;
      previewButton.dataset.previewAlt = t('imagePreview', { name: repoName });
      previewButton.setAttribute('aria-label', previewButton.dataset.previewAlt);

      const image = document.createElement('img');
      image.src = repo.screenshot;
      image.alt = repoName;
      image.className = 'inspector-demo-image';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        previewButton.replaceWith(createNamePlaceholder('inspector-name-placeholder', repoName));
      }, { once: true });
      previewButton.appendChild(image);
      DOM.modalIframeContainer.appendChild(previewButton);
    } else {
      DOM.modalIframeContainer.appendChild(createNamePlaceholder('inspector-name-placeholder', repoName));
    }

    if (repo.homepage) {
      DOM.modalLiveBtn.hidden = false;
      DOM.modalLiveBtn.removeAttribute('aria-hidden');
      DOM.modalLiveBtn.href = repo.homepage;
      DOM.modalLiveBtn.setAttribute('aria-label', t('liveDemo'));
    } else {
      DOM.modalLiveBtn.hidden = true;
      DOM.modalLiveBtn.setAttribute('aria-hidden', 'true');
      DOM.modalLiveBtn.removeAttribute('href');
    }

    return true;
  }

  function openInspectorModal(index, trigger = null) {
    const repo = state.filteredRepos[index];
    if (!repo) return;

    if (state.activeModalIndex < 0) {
      state.modalReturnFocus = trigger || document.activeElement;
    }
    state.activeModalIndex = index;
    if (!populateInspector(index)) return;

    DOM.modalBackdrop.classList.add('open');
    DOM.modalBackdrop.setAttribute('aria-hidden', 'false');
    syncBodyScrollLock();
    focusElement(DOM.modalCloseBtn);
  }

  function closeInspectorModal() {
    const returnFocus = state.modalReturnFocus;
    state.activeModalIndex = -1;
    state.modalReturnFocus = null;
    DOM.modalBackdrop.classList.remove('open');
    DOM.modalBackdrop.setAttribute('aria-hidden', 'true');
    DOM.modalIframeContainer.innerHTML = '';
    syncBodyScrollLock();
    if (!focusElement(returnFocus)) focusElement(DOM.searchInput);
  }

  function openImageLightbox(src, alt, trigger = null) {
    if (!src) return;
    state.imageReturnFocus = trigger || document.activeElement;
    DOM.imageLightboxImage.src = src;
    DOM.imageLightboxImage.alt = alt || t('closeImage');
    DOM.imageLightboxCloseBtn.setAttribute('aria-label', t('closeImage'));
    DOM.imageLightbox.classList.add('open');
    DOM.imageLightbox.setAttribute('aria-hidden', 'false');
    syncBodyScrollLock();
    focusElement(DOM.imageLightboxCloseBtn);
  }

  function closeImageLightbox() {
    if (!DOM.imageLightbox.classList.contains('open')) return;
    const returnFocus = state.imageReturnFocus;
    state.imageReturnFocus = null;
    DOM.imageLightbox.classList.remove('open');
    DOM.imageLightbox.setAttribute('aria-hidden', 'true');
    DOM.imageLightboxImage.removeAttribute('src');
    syncBodyScrollLock();
    if (!focusElement(returnFocus)) {
      focusElement(state.activeModalIndex >= 0 ? DOM.modalCard : DOM.searchInput);
    }
  }

  function navigateModal(direction) {
    if (state.activeModalIndex < 0 || state.filteredRepos.length <= 1) return;
    let nextIdx = state.activeModalIndex + direction;
    if (nextIdx < 0) nextIdx = state.filteredRepos.length - 1;
    if (nextIdx >= state.filteredRepos.length) nextIdx = 0;
    openInspectorModal(nextIdx);
  }

  function refreshOpenModal() {
    if (state.activeModalIndex < 0) return;
    const currentRepo = state.filteredRepos[state.activeModalIndex];
    if (!currentRepo) {
      closeInspectorModal();
      return;
    }
    populateInspector(state.activeModalIndex);
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
    if (state.categories.length > 0) {
      renderCategoryPills();
      renderFilteredRepos();
    }
    updateResultsSummary();
    refreshOpenModal();
  }

})();
