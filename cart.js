// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = 0;

// Update cart count display
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Add item to cart
function addToCart(productId, productName, price, image, size) {
    // Check if product already exists in cart
    const selectedSize = (size && typeof size === 'string') ? size : 'M';
    const existingItemIndex = cart.findIndex(item => item.id === productId && (item.size || 'M') === selectedSize);
    
    if (existingItemIndex > -1) {
        // Increase quantity if product already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            quantity: 1,
            size: selectedSize
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Trigger cart icon animation instead of alert
    triggerCartAnimation();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        }
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Ensure animation styles are present
function ensureCartAnimationStyles() {
    const styleId = 'cart-animation-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        @keyframes cartPulse {
            0% { transform: scale(1); }
            30% { transform: scale(1.2); }
            60% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        .cart-icon.cart-pulse { animation: cartPulse 600ms ease-in-out; }
        .cart-icon { position: relative; }
        .cart-icon .cart-fly { position: absolute; top: -8px; right: -8px; background: #28a745; color: #fff; font-size: 12px; border-radius: 10px; padding: 1px 6px; opacity: 0; pointer-events: none; }
        @keyframes cartFlyUp { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-18px); opacity: 0; } }
        .cart-icon .cart-fly.animate { animation: cartFlyUp 800ms ease-in-out; }
    `;
    document.head.appendChild(style);
}

// Animate the cart icon to show item added
function triggerCartAnimation() {
    ensureCartAnimationStyles();
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    // Pulse animation
    cartIcon.classList.add('cart-pulse');
    setTimeout(() => { cartIcon.classList.remove('cart-pulse'); }, 700);
    // Floating +1 near the cart count
    const fly = document.createElement('span');
    fly.className = 'cart-fly';
    fly.textContent = '+1';
    cartIcon.appendChild(fly);
    // Start animation on next frame
    requestAnimationFrame(() => { fly.classList.add('animate'); });
    fly.addEventListener('animationend', () => { fly.remove(); });
}

// Display cart items on cart page
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="index.html" class="btn">Continue Shopping</a></div>';
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">KSh ${item.price.toFixed(0)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', parseInt(this.value))">
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    KSh ${itemTotal.toFixed(0)}
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    if (cartSummary) {
        cartSummary.style.display = 'block';
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = `KSh ${subtotal.toFixed(0)}`;
        if (totalElement) totalElement.textContent = `KSh ${subtotal.toFixed(0)}`;
    }
}

// Display cart items on checkout page
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    if (!checkoutItemsContainer) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let checkoutHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        checkoutHTML += `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <span class="checkout-item-quantity">${item.quantity}x</span>
                    <span class="checkout-item-name">${item.name}</span>
                </div>
                <span class="checkout-item-price">KSh ${itemTotal.toFixed(0)}</span>
            </div>
        `;
    });
    
    checkoutItemsContainer.innerHTML = checkoutHTML;
    
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    if (subtotalElement) subtotalElement.textContent = `KSh ${subtotal.toFixed(0)}`;
    if (totalElement) totalElement.textContent = `KSh ${subtotal.toFixed(0)}`;
}

// Continue shopping button
function continueShopping() {
    window.location.href = 'index.html';
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Check if we're on the cart page
    if (window.location.href.includes('cart.html')) {
        displayCart();
        
        // Add event listener for clear cart button
        const clearCartBtn = document.querySelector('.clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        // Add event listener for continue shopping button
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', continueShopping);
        }
    }
    
    // Check if we're on the checkout page
    if (window.location.href.includes('checkout.html')) {
        displayCheckoutItems();
    }
    
    // Add to cart buttons on product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            const container = this.closest('.product-info') || this.closest('.product-card') || document;
            let selectedSize = 'M';
            // Prefer pill buttons selection
            const selectedBtn = container.querySelector('.size-group .size-option.selected');
            if (selectedBtn) {
                selectedSize = selectedBtn.getAttribute('data-size') || 'M';
            } else {
                // Fallback to select if present
                const sizeSelect = container.querySelector('.size-select');
                if (sizeSelect) selectedSize = sizeSelect.value;
            }

            addToCart(productId, productName, productPrice, productImage, selectedSize);
        });
    });

    // Wire up pill button interactions (toggle selection and styles)
    const sizeGroups = document.querySelectorAll('.size-group');
    sizeGroups.forEach(group => {
        const buttons = group.querySelectorAll('.size-option');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('selected');
                    b.style.background = '#fff';
                    b.style.color = '#333';
                    b.style.borderColor = '#ddd';
                });
                btn.classList.add('selected');
                btn.style.background = '#e63946';
                btn.style.color = '#fff';
                btn.style.borderColor = '#e63946';
            });
        });
        // Ensure initial selected button has active style
        const preselected = group.querySelector('.size-option.selected');
        if (preselected) {
            preselected.style.background = '#e63946';
            preselected.style.color = '#fff';
            preselected.style.borderColor = '#e63946';
        }
    });
});