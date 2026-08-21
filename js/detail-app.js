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
    fetch('/api/sync-likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list)
    }).catch(() => {});
  }

  // Application State
  const state = {
    allRepos: [],
    categories: [],
    activeCategory: 'all', // 'all', 'favorites', or category id
    searchQuery: '',
    sortMode: 'latest', // 'latest', 'stars', 'likes', 'demo', 'alpha'
    likedRepos: loadLikes(),
    currentLang: localStorage.getItem('detail_portfolio_lang') || 'zh',
    currentTheme: localStorage.getItem('detail_portfolio_theme') || 'dark',
    activeModalIndex: -1,
    filteredRepos: []
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
    DOM.searchKeyHint = document.getElementById('search-kbd-hint');
    DOM.pillsContainer = document.getElementById('category-pills');
    DOM.totalCounter = document.getElementById('total-counter');
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
    DOM.modalIframeContainer = document.getElementById('inspector-iframe-container');
    DOM.modalTitle = document.getElementById('inspector-title');
    DOM.modalDesc = document.getElementById('inspector-desc');
    DOM.modalCategoryTag = document.getElementById('inspector-category-tag');
    DOM.modalLangVal = document.getElementById('inspector-lang-val');
    DOM.modalDateVal = document.getElementById('inspector-date-val');
    DOM.modalStarsVal = document.getElementById('inspector-stars-val');
    DOM.modalLiveBtn = document.getElementById('inspector-live-btn');
    DOM.modalGithubBtn = document.getElementById('inspector-github-btn');
    DOM.ambientGlowLayer = document.getElementById('ambient-glow-layer');
  }

  // Bind Listeners
  function bindEvents() {
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

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const isInput = document.activeElement === DOM.searchInput;

      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !isInput) {
        e.preventDefault();
        DOM.searchInput.focus();
      } else if (e.key === 'Escape') {
        if (state.activeModalIndex >= 0) {
          closeInspectorModal();
        } else if (isInput) {
          DOM.searchInput.blur();
        }
      } else if (state.activeModalIndex >= 0) {
        if (e.key === 'ArrowLeft') {
          navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
          navigateModal(1);
        } else if (e.key.toLowerCase() === 'l' && !isInput) {
          const repo = state.filteredRepos[state.activeModalIndex];
          if (repo) toggleLike(repo.name);
        }
      }
    });

    // Sort Dropdown Toggle
    DOM.sortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.sortMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      DOM.sortMenu.classList.remove('open');
    });

    document.querySelectorAll('.sort-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-sort');
        setSortMode(mode);
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
  }

  // Load Data
  async function loadData() {
    if (window.store) {
      processLoadedData(window.store);
      return;
    }
    try {
      const response = await fetch('./data/repos.json');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      processLoadedData(data);
    } catch (err) {
      console.warn('Direct fetch failed:', err);
    }
  }

  function processLoadedData(data) {
    state.categories = data.categories || [];
    const flattened = [];

    state.categories.forEach(cat => {
      cat.repos.forEach(repo => {
        flattened.push({
          ...repo,
          categoryId: cat.id,
          categoryName: cat.name
        });
      });
    });

    state.allRepos = flattened;
    renderCategoryPills();
    renderFilteredRepos();
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
    const totalLikes = nowLiked ? 1 : 0;

    // Update matching card buttons
    document.querySelectorAll(`.card-like-btn[data-repo-name="${repoName}"]`).forEach(btn => {
      btn.classList.toggle('liked', nowLiked);
      const heart = btn.querySelector('.heart-icon');
      if (heart) {
        heart.setAttribute('fill', nowLiked ? '#ef4444' : 'none');
        heart.setAttribute('stroke', nowLiked ? '#ef4444' : 'currentColor');
      }
      const countEl = btn.querySelector('.like-count');
      if (countEl) countEl.textContent = totalLikes;
    });

    // Update modal button if open for this repo
    if (state.activeModalIndex >= 0) {
      const currentModalRepo = state.filteredRepos[state.activeModalIndex];
      if (currentModalRepo && currentModalRepo.name === repoName && DOM.modalLikeBtn) {
        DOM.modalLikeBtn.classList.toggle('liked', nowLiked);
        const heart = DOM.modalLikeBtn.querySelector('.heart-icon');
        if (heart) {
          heart.setAttribute('fill', nowLiked ? '#ef4444' : 'none');
          heart.setAttribute('stroke', nowLiked ? '#ef4444' : 'currentColor');
        }
        if (DOM.modalLikeCount) DOM.modalLikeCount.textContent = totalLikes;
      }
    }

    // Update favorites pill count
    const favCountBadge = document.getElementById('favorites-pill-count');
    const favPill = document.getElementById('favorites-pill-btn');
    if (favCountBadge) favCountBadge.textContent = state.likedRepos.size;
    if (favPill) favPill.classList.toggle('has-likes', state.likedRepos.size > 0);

    // If currently filtered on favorites, re-render
    if (state.activeCategory === 'favorites') {
      renderFilteredRepos();
    }
  };

  // Render Category Pills
  function renderCategoryPills() {
    DOM.pillsContainer.innerHTML = '';

    // 1. "All" Pill
    const allPill = document.createElement('button');
    allPill.className = `cat-pill-btn ${state.activeCategory === 'all' ? 'active' : ''}`;
    allPill.innerHTML = `
      <span class="cat-label" data-zh="全部" data-en="All">${state.currentLang === 'zh' ? '全部' : 'All'}</span>
      <span class="cat-count-badge">${state.allRepos.length}</span>
    `;
    allPill.addEventListener('click', () => setCategory('all'));
    DOM.pillsContainer.appendChild(allPill);

    // 2. "Favorites / Liked" Pill
    const favPill = document.createElement('button');
    favPill.id = 'favorites-pill-btn';
    favPill.className = `cat-pill-btn favorites-pill ${state.activeCategory === 'favorites' ? 'active' : ''} ${state.likedRepos.size > 0 ? 'has-likes' : ''}`;
    favPill.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:-1px;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <span class="cat-label" data-zh="已点赞" data-en="Liked">${state.currentLang === 'zh' ? '已点赞' : 'Liked'}</span>
      <span class="cat-count-badge" id="favorites-pill-count">${state.likedRepos.size}</span>
    `;
    favPill.addEventListener('click', () => setCategory('favorites'));
    DOM.pillsContainer.appendChild(favPill);

    // 3. Dynamic Category Pills
    state.categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = `cat-pill-btn ${state.activeCategory === cat.id ? 'active' : ''}`;
      const name = cat.name[state.currentLang] || cat.name.zh;
      pill.innerHTML = `
        <span class="cat-label">${name}</span>
        <span class="cat-count-badge">${cat.repos.length}</span>
      `;
      pill.addEventListener('click', () => setCategory(cat.id));
      DOM.pillsContainer.appendChild(pill);
    });
  }

  function setCategory(catId) {
    state.activeCategory = catId;
    document.querySelectorAll('.cat-pill-btn').forEach((btn, idx) => {
      if (idx === 0) {
        btn.classList.toggle('active', catId === 'all');
      } else if (idx === 1) {
        btn.classList.toggle('active', catId === 'favorites');
      } else {
        const cat = state.categories[idx - 2];
        btn.classList.toggle('active', cat && cat.id === catId);
      }
    });
    renderFilteredRepos();
  }

  function setSortMode(mode) {
    state.sortMode = mode;
    document.querySelectorAll('.sort-menu-item').forEach(item => {
      item.classList.toggle('selected', item.getAttribute('data-sort') === mode);
    });

    const labels = {
      zh: { latest: '最新优先', stars: '标星最多', likes: '点赞最多', demo: '在线演示优先', alpha: '名称排序 A-Z' },
      en: { latest: 'Latest first', stars: 'Most starred', likes: 'Most liked', demo: 'Live demo first', alpha: 'Name A-Z' }
    };
    DOM.sortLabel.textContent = labels[state.currentLang][mode] || mode;
    renderFilteredRepos();
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
        const nameMatch = repo.name.toLowerCase().includes(q);
        const zhMatch = (repo.desc.zh || '').toLowerCase().includes(q);
        const enMatch = (repo.desc.en || '').toLowerCase().includes(q);
        const langMatch = (repo.lang || '').toLowerCase().includes(q);
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
      } else if (state.sortMode === 'likes') {
        const likedA = state.likedRepos.has(a.name) ? 1 : 0;
        const likedB = state.likedRepos.has(b.name) ? 1 : 0;
        return likedB - likedA || (dateB - dateA);
      } else if (state.sortMode === 'demo') {
        const aHas = a.homepage ? 1 : 0;
        const bHas = b.homepage ? 1 : 0;
        if (aHas !== bHas) return bHas - aHas;
        return dateB - dateA;
      } else if (state.sortMode === 'alpha') {
        return a.name.localeCompare(b.name);
      } else {
        // Latest First: exact chronological timestamp descending
        return dateB - dateA;
      }
    });

    return list;
  }

  // Render Masonry Cards
  function renderFilteredRepos() {
    state.filteredRepos = getFilteredAndSortedRepos();
    DOM.totalCounter.textContent = `${state.filteredRepos.length} ${state.currentLang === 'zh' ? '项' : 'details'}`;

    if (state.filteredRepos.length === 0) {
      const isFavEmpty = state.activeCategory === 'favorites';
      DOM.grid.innerHTML = `
        <div class="empty-state-box">
          <div style="font-size: 32px;">${isFavEmpty ? '🤍' : '🔍'}</div>
          <div class="empty-state-title">${isFavEmpty 
            ? (state.currentLang === 'zh' ? '暂无已点赞的项目' : 'No liked projects yet')
            : (state.currentLang === 'zh' ? '未找到相关项目' : 'No matching repositories found')}</div>
          <div>${isFavEmpty 
            ? (state.currentLang === 'zh' ? '点击项目卡片右下角的爱心按钮即可收藏点赞' : 'Click the heart button on any card to like and save it here')
            : (state.currentLang === 'zh' ? '请尝试调整搜索关键词或选择其他分类' : 'Try adjusting your search terms or choosing another category')}</div>
        </div>
      `;
      return;
    }

    DOM.grid.innerHTML = '';

    const aspectClasses = ['aspect-16-10', 'aspect-16-9', 'aspect-4-3', 'aspect-16-10'];

    state.filteredRepos.forEach((repo, index) => {
      const card = document.createElement('article');
      card.className = 'detail-card';
      card.setAttribute('data-repo-index', index);

      const aspectClass = aspectClasses[index % aspectClasses.length];
      const descText = repo.desc[state.currentLang] || repo.desc.zh;
      const catName = repo.categoryName[state.currentLang] || repo.categoryName.zh;
      const isLiked = state.likedRepos.has(repo.name);
      const totalLikes = isLiked ? 1 : 0;

      // Status Badge
      let statusBadgeHtml = '';
      if (repo.stars && repo.stars > 0) {
        statusBadgeHtml = `<span class="card-status-badge star-badge">★ ${repo.stars > 1000 ? (repo.stars / 1000).toFixed(1) + 'k' : repo.stars}</span>`;
      } else if (repo.pushed_at && repo.pushed_at.startsWith('2026-08')) {
        statusBadgeHtml = `<span class="card-status-badge new-badge">NEW</span>`;
      }

      const mediaHtml = repo.screenshot
        ? `<img src="${repo.screenshot}" alt="${repo.name}" class="card-demo-image" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-name-placeholder\\'><span class=\\'placeholder-repo-name\\'>${repo.name}</span></div>'">`
        : `<div class="card-name-placeholder"><span class="placeholder-repo-name">${repo.name}</span></div>`;

      card.innerHTML = `
        <div class="card-media-box ${aspectClass}">
          <div class="visual-canvas-container">
            ${mediaHtml}
          </div>
          <div class="media-hover-overlay">
            <span class="overlay-action-pill">
              <span>Inspect</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta-header">
            <span class="card-category-tag">${catName}</span>
            ${statusBadgeHtml}
          </div>
          <h3 class="card-title">${repo.name}</h3>
          <p class="card-description">${descText}</p>
          <div class="card-footer-row">
            <div class="card-tech-pills">
              <span class="card-tech-pill">${repo.lang || 'Code'}</span>
              ${(repo.commit_time || repo.pushed_at) ? `<span class="card-tech-pill">${(repo.commit_time || repo.pushed_at).slice(0, 10)}</span>` : ''}
            </div>
            <div class="card-action-links">
              <!-- Like Button -->
              <button class="card-like-btn ${isLiked ? 'liked' : ''}" data-repo-name="${repo.name}" title="点赞/收藏" onclick="toggleLike('${repo.name}', event)">
                <svg class="heart-icon" width="13" height="13" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span class="like-count">${totalLikes}</span>
              </button>

              ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" class="card-link-icon-btn" title="Live Demo" onclick="event.stopPropagation();">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              ` : ''}
              <a href="${repo.url}" target="_blank" class="card-link-icon-btn" title="GitHub Repo" onclick="event.stopPropagation();">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openInspectorModal(index));
      DOM.grid.appendChild(card);
    });
  }

  // Detail Inspector Modal
  function openInspectorModal(index) {
    state.activeModalIndex = index;
    const repo = state.filteredRepos[index];
    if (!repo) return;

    const descText = repo.desc[state.currentLang] || repo.desc.zh;
    const catName = repo.categoryName[state.currentLang] || repo.categoryName.zh;
    const isLiked = state.likedRepos.has(repo.name);
    const totalLikes = isLiked ? 1 : 0;

    DOM.modalTitle.textContent = repo.name;
    DOM.modalDesc.textContent = descText;
    DOM.modalCategoryTag.textContent = catName;
    DOM.modalLangVal.textContent = repo.lang || 'TypeScript';
    DOM.modalDateVal.textContent = (repo.commit_time ? repo.commit_time.slice(0, 10) : repo.pushed_at) || 'Recently';
    DOM.modalStarsVal.textContent = repo.stars ? `★ ${repo.stars}` : '0';

    if (DOM.modalLikeBtn) {
      DOM.modalLikeBtn.classList.toggle('liked', isLiked);
      const heart = DOM.modalLikeBtn.querySelector('.heart-icon');
      if (heart) {
        heart.setAttribute('fill', isLiked ? '#ef4444' : 'none');
        heart.setAttribute('stroke', isLiked ? '#ef4444' : 'currentColor');
      }
      if (DOM.modalLikeCount) DOM.modalLikeCount.textContent = totalLikes;
    }

    DOM.modalGithubBtn.href = repo.url;

    // Consistency: Preview matches card image or clean placeholder
    DOM.modalIframeContainer.innerHTML = '';
    if (repo.screenshot) {
      DOM.modalIframeContainer.innerHTML = `<img src="${repo.screenshot}" alt="${repo.name}" class="inspector-demo-image" onerror="this.parentElement.innerHTML='<div class=\\'inspector-name-placeholder\\'><span class=\\'placeholder-repo-name\\'>${repo.name}</span></div>'">`;
    } else {
      DOM.modalIframeContainer.innerHTML = `<div class="inspector-name-placeholder"><span class="placeholder-repo-name">${repo.name}</span></div>`;
    }

    if (repo.homepage) {
      DOM.modalLiveBtn.style.display = 'inline-flex';
      DOM.modalLiveBtn.href = repo.homepage;
    } else {
      DOM.modalLiveBtn.style.display = 'none';
    }

    DOM.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeInspectorModal() {
    state.activeModalIndex = -1;
    DOM.modalBackdrop.classList.remove('open');
    DOM.modalIframeContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  function navigateModal(direction) {
    if (state.activeModalIndex < 0) return;
    let nextIdx = state.activeModalIndex + direction;
    if (nextIdx < 0) nextIdx = state.filteredRepos.length - 1;
    if (nextIdx >= state.filteredRepos.length) nextIdx = 0;
    openInspectorModal(nextIdx);
  }

  // Theme
  function applyTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('detail_portfolio_theme', theme);
    if (DOM.themeBtn) {
      DOM.themeBtn.innerHTML = theme === 'dark' 
        ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }

  // Language
  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('detail_portfolio_lang', lang);
    if (DOM.langLabel) {
      DOM.langLabel.textContent = lang === 'zh' ? 'EN' : '中文';
    }

    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    if (state.categories.length > 0) {
      renderCategoryPills();
      renderFilteredRepos();
    }
  }

})();
