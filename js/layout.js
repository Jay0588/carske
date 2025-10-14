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

  function injectLayout() {
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = `
        <div class="container header-container">
          <a href="${PREFIX}index.html" class="logo"><img src="${PREFIX}Carske001.png" alt="CarsKe" style="height:54px"></a>
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
                <a href="https://www.instagram.com" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png" alt="Instagram" style="width: 20px; height: 20px; vertical-align: middle;"></a>
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
            <p>&copy; 2023 Carske. All rights reserved.</p>
          </div>
        </div>
      `;
    }

    updateCartCount();
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

  document.addEventListener('DOMContentLoaded', function() {
    injectLayout();
    injectFloatingCartButton();
  });
})();