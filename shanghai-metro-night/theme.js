(() => {
  let saved;
  try { saved = localStorage.getItem('metro-theme'); } catch {}
  document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light';
  function updateButtons() {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.textContent = dark ? '浅色' : '深色';
      button.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    updateButtons();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem('metro-theme', theme); } catch {}
        updateButtons();
      });
    });
  });
})();
