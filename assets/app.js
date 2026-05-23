/* =====================================================================
   Smells Like AI Spirit — interactividad mínima
   ===================================================================== */

(function () {
  // ---------- TABS DE CASOS ----------
  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabPanels = document.querySelectorAll('[data-panel]');

  function activateTab(name) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === name);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === name);
    });
    // Move focus to panel for a11y
    const target = document.querySelector(`[data-panel="${name}"]`);
    if (target) target.setAttribute('tabindex', '-1');
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Activate first tab on load
  if (tabButtons.length) activateTab(tabButtons[0].dataset.tab);

  // ---------- DEEPLINK SUPPORT (#caso=02) ----------
  function applyHashTab() {
    const m = window.location.hash.match(/caso=(\d{2})/);
    if (m) activateTab(m[1]);
  }
  window.addEventListener('hashchange', applyHashTab);
  applyHashTab();

  // ---------- SMOOTH SCROLL NAV ----------
  document.querySelectorAll('nav.top a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', a.getAttribute('href'));
    });
  });
})();
