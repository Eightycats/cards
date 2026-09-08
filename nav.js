(function() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'cards-index.html', label: 'Cards' },
    { href: 'numbers-index.html', label: 'Numbers' },
    { href: 'stacks-index.html', label: 'Stacks' },
    { href: 'preflop-index.html', label: 'Preflop' },
  ];

  // Free, open-source typefaces from Google Fonts. The system fallbacks below
  // keep the app usable when it is installed or opened offline.
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;700&family=Rye&display=swap';
  document.head.appendChild(fontLink);

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    :root {
      color-scheme: light;
      --bg-color: #caa66a !important;
      --text-color: #2a160d !important;
      --accent: #d9b97e !important;
      --accent-hover: #e8cd96 !important;
      --bg: #ffffff !important;
      --bg2: #f3dfb2 !important;
      --text: #2a160d !important;
      --muted: #513c2a !important;
      --border: #8f7048 !important;
      --highlight: #f7e8bf !important;
      --highlight-border: #a86a24 !important;
      --suit-h: #a51f18 !important;
      --suit-d: #a51f18 !important;
      --suit-c: #2a160d !important;
      --suit-s: #2a160d !important;
      --western-paper: #e2c58c;
      --western-paper-light: #efd7a4;
      --western-ink: #2a160d;
      --western-red: #9a4332;
      --western-gold: #ad7734;
      --western-shadow: #6e5940;
    }
    html {
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100%;
      display: block !important;
      background-color: var(--bg2) !important;
      background-image: radial-gradient(circle at 20% 30%, rgba(72,55,34,.05) 0 1px, transparent 1.5px);
    }
    body {
      position: relative;
      min-height: 100vh;
      height: auto !important;
      width: min(100%, 760px);
      margin: 0 auto !important;
      padding-top: 64px !important;
      padding-left: clamp(18px, 4vw, 38px) !important;
      padding-right: clamp(18px, 4vw, 38px) !important;
      padding-bottom: 40px !important;
      box-sizing: border-box;
      background-color: var(--western-paper) !important;
      background-image:
        radial-gradient(circle at 12% 18%, rgba(91, 49, 23, .13) 0 1px, transparent 2px),
        radial-gradient(circle at 78% 72%, rgba(91, 49, 23, .11) 0 1px, transparent 2px),
        repeating-linear-gradient(97deg, rgba(255,255,255,.035) 0 2px, rgba(70,35,13,.025) 2px 4px),
        linear-gradient(90deg, rgba(83,44,20,.22), transparent 8%, transparent 92%, rgba(83,44,20,.22));
      color: var(--western-ink) !important;
      font-family: Georgia, 'Times New Roman', serif !important;
      box-shadow: 0 0 28px rgba(58, 45, 29, .16);
    }
    h1, h2, h3, .prompt, .number-display, .index-display {
      color: var(--western-ink) !important;
      font-family: 'Rye', Rockwell, 'Roboto Slab', 'Courier New', serif !important;
      font-weight: 400 !important;
      letter-spacing: .025em;
      text-transform: uppercase;
      text-align: center;
      text-shadow: 0 1px 0 rgba(255,255,255,.35);
    }
    h1::after {
      content: '◆ ───── ◆';
      display: block;
      width: 100%;
      margin-top: .45rem;
      color: var(--western-red);
      font-size: .38em;
      letter-spacing: .04em;
      text-align: center;
    }
    p, label, .feedback, .score, .progress, .peg-word, .memory-aid {
      color: var(--western-ink) !important;
    }
    a { color: var(--western-red); }
    button, input, select, .menu a, .filter-btn, .step-btn, .card-option {
      box-sizing: border-box;
      border: 2px solid var(--western-ink) !important;
      border-radius: 2px !important;
      background: var(--western-paper-light) !important;
      color: var(--western-ink) !important;
      font-family: 'Roboto Slab', Rockwell, 'Courier New', serif !important;
      font-weight: 700 !important;
      letter-spacing: .025em;
      box-shadow: inset 0 0 0 3px rgba(122, 36, 27, .12), 3px 4px 0 rgba(66, 33, 15, .28) !important;
    }
    button:hover, .menu a:hover, .filter-btn:hover, .step-btn:hover, .card-option:hover {
      background: #f2dca9 !important;
      color: var(--western-red) !important;
      transform: translate(-1px, -1px);
      box-shadow: inset 0 0 0 3px rgba(122, 36, 27, .17), 5px 6px 0 rgba(66, 33, 15, .25) !important;
    }
    button:active, .menu a:active, .filter-btn:active, .step-btn:active {
      transform: translate(2px, 2px) !important;
      box-shadow: inset 0 0 0 3px rgba(122, 36, 27, .2), 1px 1px 0 rgba(66, 33, 15, .3) !important;
    }
    button.active, .filter-btn.active, .selected {
      background: var(--western-red) !important;
      color: #f5dfad !important;
    }
    .suit-buttons button {
      background: var(--western-paper-light) !important;
      color: var(--western-ink) !important;
    }
    .suit-buttons #btn-H, .suit-buttons #btn-D {
      color: #a51f18 !important;
    }
    .suit-buttons button.active {
      background: #fff5d7 !important;
      color: var(--western-ink) !important;
      border-color: var(--western-ink) !important;
      outline: 3px solid #b87a2c;
      outline-offset: 2px;
      box-shadow: inset 0 0 0 3px rgba(184, 122, 44, .22), 3px 4px 0 rgba(66, 33, 15, .28) !important;
    }
    .suit-buttons #btn-H.active, .suit-buttons #btn-D.active {
      color: #a51f18 !important;
    }
    .filter-btn, .filter-btn:hover, .filter-btn:active, .filter-btn.active {
      background: var(--filter-color) !important;
      color: #fff !important;
    }
    .filter-btn.active {
      outline: 3px solid var(--western-ink) !important;
      outline-offset: 2px;
    }
    .card, .num-card, .example-box, .final-screen, .quiz-area, .grid-wrapper {
      border-color: var(--western-ink) !important;
      border-radius: 2px !important;
      box-shadow: 4px 5px 0 rgba(66, 33, 15, .25) !important;
    }
    table, th, td, .cell, .header-cell {
      border-color: rgba(42, 22, 13, .7) !important;
    }
    th, .header-cell { background: rgba(122, 36, 27, .16) !important; }
    .correct { color: #28552d !important; }
    .incorrect, .red, .hearts, .diamonds { color: var(--western-red) !important; }
    thead th, .suit-label, .royal-rank, .examples, .memory-aid,
    .example-box .breakdown {
      color: var(--muted) !important;
    }
    .menu, .suit-buttons, .card-grid, .image-grid, .buttons, #quiz,
    .card-container, #result, #pegWord, #cardImage {
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .suit-buttons, .card-grid { width: 100%; }
    #scoreDisplay {
      right: max(18px, calc((100vw - 760px) / 2 + 18px)) !important;
    }
    .hamburger-btn {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 1000;
      background: var(--accent, #f0f0f0);
      border: 1px solid var(--text-color, var(--text, #000));
      min-width: 46px;
      border-radius: 9px !important;
      padding: 8px 12px;
      font-size: 19px;
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
      background: rgba(31,15,7,0.62);
      z-index: 1001;
    }
    .nav-overlay.open { display: block; }
    .nav-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 260px;
      height: 100%;
      background-color: var(--western-paper);
      background-image: repeating-linear-gradient(95deg, transparent 0 3px, rgba(76,36,15,.035) 3px 5px);
      color: var(--text-color, var(--text, #000));
      z-index: 1002;
      transition: transform 0.25s ease, visibility 0.25s;
      transform: translateX(-100%);
      visibility: hidden;
      padding: 16px 20px;
      overflow-y: auto;
      border-right: 5px double var(--western-ink);
      box-shadow: 5px 0 18px rgba(31,15,7,.42);
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
      border-radius: 0;
      border-bottom: 1px solid rgba(42,22,13,.35);
      text-decoration: none;
      color: var(--text-color, var(--text, #000));
      font-family: Rockwell, 'Roboto Slab', 'Courier New', serif;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: .05em;
      text-transform: uppercase;
    }
    .nav-sidebar a:first-of-type { margin-top: 40px; }
    .nav-sidebar a:hover {
      background: var(--accent-hover, var(--accent, #e0e0e0));
    }
    .nav-sidebar a.nav-active {
      background: var(--western-red);
      color: #f5dfad;
      font-weight: 900;
    }
    @media (max-width: 600px) {
      h1 { letter-spacing: .035em; }
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
