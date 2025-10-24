// Shared header and footer injection for consistent layout across pages
(function() {
  function getPrefix() {
    try {
      const p = String(window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
      return p.includes('/mpesa/') ? '../' : '';
    } catch(e) { return ''; }
  }
  const PREFIX = getPrefix();
  function getCartItems() {
    let items = [];
    try { items = JSON.parse(localStorage.getItem('cart')) || []; } catch(e) {}
    if (!Array.isArray(items) || items.length === 0) {
      try { items = JSON.parse(localStorage.getItem('carskeCart')) || []; } catch(e) {}
    }
    return Array.isArray(items) ? items : [];
  }

  function updateCartCount() {
    const count = getCartItems().reduce((t, i) => t + (i.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = String(count); });
  }

  function setupHamburger() {
    try {
      const btn = document.querySelector('.menu-toggle');
      const nav = document.querySelector('header nav');
      if (!btn || !nav) return;
      btn.addEventListener('click', () => {
        const open = document.body.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      // Close when clicking a nav link
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
      }));
      // Close when clicking outside the header
      document.addEventListener('click', (e) => {
        const header = document.querySelector('header');
        if (!header) return;
        if (document.body.classList.contains('nav-open') && !header.contains(e.target)) {
          document.body.classList.remove('nav-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    } catch(e) { /* noop */ }
  }

  function injectLayout() {
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = `
        <div class="container header-container">
          <a href="${PREFIX}index.html" class="logo"><img src="${PREFIX}Carske001.png" alt="CarsKe" style="height:54px"></a>
          <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
          <nav>
            <ul>
              <li><a href="${PREFIX}index.html">Home</a></li>
              <li><a href="${PREFIX}orders.html">Orders</a></li>
              <li><a href="${PREFIX}contact.html">Contact</a></li>
            </ul>
          </nav>
        </div>
      `;
    }

    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = `
        <div class="container">
          <div class="footer-container">
            <div class="footer-col">
              <h3>Carske</h3>
              <p>Premium quality t-shirts for everyday comfort and style.</p>
              <div class="social-links">
                <a href="https://www.instagram.com/carske.shop/" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png" alt="Instagram" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;"></a>
              </div>
            </div>
            
            <div class="footer-col">
              <h3>Customer Care</h3>
              <ul>
                <li><a href="${PREFIX}contact.html">Contact Us</a></li>
                <li><a href="https://www.instagram.com" target="_blank">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2025 Carske. All rights reserved.</p>
          </div>
        </div>
      `;
    }

    updateCartCount();
  }

  function injectHeaderPaddingStyles() {
    try {
      if (document.getElementById('header-padding-style')) return;
      const style = document.createElement('style');
      style.id = 'header-padding-style';
      style.textContent = `
        /* Add comfortable horizontal padding to header on desktop */
        @media (min-width: 769px) {
          .container.header-container { padding: 20px 32px; }
        }
      `;
      document.head.appendChild(style);
    } catch (e) { /* noop */ }
  }

  function injectFloatingCartButton() {
    try {
      const path = String(window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
      const isCartPage = path.endsWith('/cart.html') || path.includes('/cart.html');
      if (isCartPage) return;

      // Inject styles once
      if (!document.getElementById('floating-cart-style')) {
        const style = document.createElement('style');
        style.id = 'floating-cart-style';
        style.textContent = `
          .floating-cart-btn { position: fixed; right: 16px; bottom: 16px; background: #e63946; color: #fff; border-radius: 9999px; padding: 12px 16px; font-size: 0.95rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: inline-flex; align-items: center; gap: 8px; text-decoration: none; z-index: 9999; }
          .floating-cart-btn:hover { background: #c1121f; transform: translateY(-1px); }
          @media (max-width: 768px) {
            .floating-cart-btn { padding: 10px 14px; font-size: 0.9rem; bottom: 12px; right: 12px; }
          }
        `;
        document.head.appendChild(style);
      }

      // Avoid duplicate button
      if (document.getElementById('floating-cart-btn')) return;
      const a = document.createElement('a');
      a.id = 'floating-cart-btn';
      a.href = PREFIX + 'cart.html';
      a.className = 'floating-cart-btn';
      a.setAttribute('aria-label', 'View Cart');
      a.textContent = 'View Cart';
      document.body.appendChild(a);
    } catch (e) { /* noop */ }
  }

  function injectStabilityStyles() {
    try {
      if (document.getElementById('stability-styles')) return;
      const style = document.createElement('style');
      style.id = 'stability-styles';
      style.textContent = `
        html { scrollbar-gutter: stable both-edges; }
        body { overflow-x: hidden; overscroll-behavior-x: none; touch-action: pan-y; }
        .container { width: 100%; max-width: none; margin: 0; padding-left: 15px; padding-right: 15px; }
        /* Mobile: match index header layout and container padding */
        /* Hamburger defaults */
        .menu-toggle { display: none; background: none; border: none; font-size: 24px; line-height: 1; padding: 8px; cursor: pointer; }
        @media (max-width: 768px) {
          .container { padding-left: 15px; padding-right: 15px; }
          header { padding-bottom: 8px; position: relative; }
          .header-container { flex-direction: row; justify-content: space-between; text-align: initial; align-items: center; flex-wrap: nowrap; }
          .logo img { height: 48px; }
          .menu-toggle { display: inline-flex; align-items: center; justify-content: center; margin-left: auto; }
          nav { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-top: 1px solid #eee; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 1000; }
          body.nav-open nav { display: block; }
          nav ul { margin-top: 0; flex-direction: column; justify-content: flex-start; }
          nav ul li { margin: 0; border-bottom: 1px solid #eee; }
          nav ul li a { display: block; padding: 12px 16px; }
        }
        /* Extra-small width safety: 344px devices */
        @media (max-width: 360px) {
          .logo img { height: 44px; }
        }
        /* Prevent horizontal overscroll gaps on common containers */
        .shop-container, .checkout-container, .cart-container, .orders-list, .footer-container, .products-grid, .products, .logo-grid, .header-container, section.container, section { overflow-x: hidden; }
        /* Contact page mobile stability */
        .contact-section, .contact-container, .contact-info { overflow: visible; }
        @media (max-width: 768px) {
          .contact-section { padding-top: 50px; padding-bottom: 96px; }
          .contact-container { display: block; }
          .contact-info { justify-content: flex-start; }
          /* Normalize Instagram embed widths to prevent horizontal jitter */
          .instagram-embed-card { max-width: 100% !important; overflow: hidden; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; align-items: center; }
          .instagram-embed-card h3 { text-align: center; }
          .instagram-embed-card .instagram-media,
          .instagram-embed-card blockquote.instagram-media { width: auto !important; max-width: 100% !important; margin-left: auto !important; margin-right: auto !important; }
          /* Make all info cards consistent width on mobile */
          .contact-info .info-card { width: 100%; }
        }
        /* Prevent zoom effects from causing layout jitter */
        .product-card { overflow: hidden; }
        .product-img, .variation-img { display: block; width: 100%; }
        /* Ensure major sections fill width consistently */
        header, footer, .hero, .page-title, .breadcrumb, .checkout-section { width: 100%; }
        /* Robust base header layout on desktop */
        .header-container { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: nowrap; }
        .logo { display: inline-flex; align-items: center; }
        nav ul { display: flex; align-items: center; gap: 20px; flex-wrap: nowrap; margin: 0; padding: 0; list-style: none; }
        /* Standardize section titles to match index */
        .section-title { text-align: center; margin-bottom: 50px; }
        .section-title h1, .section-title h2 { font-size: 2.5rem; margin-bottom: 15px; }
        .section-title p { color: #666; max-width: 600px; margin: 0 auto; }
        /* Standardize page title (Orders, etc.) to mirror index section header */
        .page-title { background: #f0f0f0; padding: 60px 0; text-align: center; margin-bottom: 50px; }
        .page-title h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .page-title .meta { color: #666; max-width: 600px; margin: 0 auto; }
        /* Consistent breadcrumb styling across pages */
        .breadcrumb { padding: 20px 0; background-color: #f0f0f0; }
        .breadcrumb ul { display: flex; list-style: none; }
        .breadcrumb ul li { margin-right: 10px; }
        .breadcrumb ul li a { color: #666; text-decoration: none; }
        .breadcrumb ul li a:hover { color: #000; }
        /* Remove circles from footer social icons */
        .social-links a, .footer-social-links a { background: none !important; width: auto; height: auto; border-radius: 0; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
        .social-links a:hover, .footer-social-links a:hover { background: none !important; }
      `;
      document.head.appendChild(style);
    } catch (e) { /* noop */ }
  }
  function injectDesktopGridStyles() {
    try {
      if (document.getElementById('desktop-grid-style')) return;
      const style = document.createElement('style');
      style.id = 'desktop-grid-style';
      style.textContent = `
        /* Desktop: ensure 4-up grids align neatly */
        @media (min-width: 992px) {
          .products-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 30px; }
          .products { grid-template-columns: repeat(4, 1fr) !important; gap: 30px; }
        }
      `;
      document.head.appendChild(style);
    } catch (e) { /* noop */ }
  }
  document.addEventListener('DOMContentLoaded', function() {
    injectLayout();
    injectHeaderPaddingStyles();
    injectStabilityStyles();
    injectDesktopGridStyles();
    setupHamburger();
    injectFloatingCartButton();
  });
})();