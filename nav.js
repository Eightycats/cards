(function() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'cards-index.html', label: 'Cards' },
    { href: 'numbers-index.html', label: 'Numbers' },
  ];

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .hamburger-btn {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 1000;
      background: var(--accent, #f0f0f0);
      border: 1px solid var(--text-color, var(--text, #000));
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 20px;
      cursor: pointer;
      color: var(--text-color, var(--text, #000));
      line-height: 1;
    }
    .nav-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      z-index: 1001;
    }
    .nav-overlay.open { display: block; }
    .nav-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 260px;
      height: 100%;
      background: var(--bg-color, var(--bg, #fff));
      color: var(--text-color, var(--text, #000));
      z-index: 1002;
      transition: transform 0.25s ease, visibility 0.25s;
      transform: translateX(-100%);
      visibility: hidden;
      padding: 16px 20px;
      overflow-y: auto;
      box-shadow: 2px 0 12px rgba(0,0,0,0.2);
    }
    .nav-sidebar.open { transform: translateX(0); visibility: visible; }
    .nav-close {
      position: absolute;
      top: 10px;
      right: 14px;
      font-size: 22px;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--text-color, var(--text, #000));
      padding: 4px 8px;
    }
    .nav-sidebar a {
      display: block;
      padding: 12px 10px;
      margin: 4px 0;
      border-radius: 6px;
      text-decoration: none;
      color: var(--text-color, var(--text, #000));
      font-size: 1.1rem;
    }
    .nav-sidebar a:first-of-type { margin-top: 40px; }
    .nav-sidebar a:hover {
      background: var(--accent-hover, var(--accent, #e0e0e0));
    }
    .nav-sidebar a.nav-active {
      background: var(--accent, #e8e8e8);
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  // Build sidebar HTML
  let linksHtml = '';
  for (const link of links) {
    const active = (link.href === currentPage) ? ' nav-active' : '';
    linksHtml += `<a href="${link.href}" class="${active}">${link.label}</a>`;
  }

  // Inject elements
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="hamburger-btn" aria-label="Menu">\u2630</button>
    <div class="nav-overlay"></div>
    <div class="nav-sidebar">
      <button class="nav-close" aria-label="Close menu">\u2715</button>
      ${linksHtml}
    </div>
  `;
  while (wrapper.firstChild) {
    document.body.insertBefore(wrapper.firstChild, document.body.firstChild);
  }

  // Event handlers
  const btn = document.querySelector('.hamburger-btn');
  const overlay = document.querySelector('.nav-overlay');
  const sidebar = document.querySelector('.nav-sidebar');
  const closeBtn = document.querySelector('.nav-close');

  function openMenu() { overlay.classList.add('open'); sidebar.classList.add('open'); }
  function closeMenu() { overlay.classList.remove('open'); sidebar.classList.remove('open'); }

  btn.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  closeBtn.addEventListener('click', closeMenu);
})();
