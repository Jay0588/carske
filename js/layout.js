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
              <li><a href="${PREFIX}products.html">Shop</a></li>
              <li><a href="${PREFIX}orders.html">Orders</a></li>
              <li><a href="${PREFIX}contact.html">Contact</a></li>
            </ul>
          </nav>
          <a href="${PREFIX}cart.html" class="cart-icon" aria-label="View Cart">
            <span>🛒</span>
            <span class="cart-count">0</span>
          </a>
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
              <h3>Shop</h3>
              <ul>
                <li><a href="${PREFIX}products.html">All Products</a></li>
                <li><a href="#">New Arrivals</a></li>
              </ul>
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

  document.addEventListener('DOMContentLoaded', injectLayout);
})();