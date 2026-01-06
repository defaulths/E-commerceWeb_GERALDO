// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initProductFilter();
    initCart();
    initForms();
    initToast();
    setActiveNav();
    
    // Load products if on products page
    if (window.location.pathname.includes('products.html') || 
        window.location.pathname === '/') {
        loadProducts();
    }
    
    // Load product detail if on detail page
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetail();
    }
    
    // Load cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
    
    // Load checkout if on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckout();
    }
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
}

// Product Filter
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Load Products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    // Create product cards
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span>★</span>
                    <span>${product.rating}</span>
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">${formatPrice(product.price)} ${product.unit}</div>
                <a href="product-detail.html?id=${product.id}" class="btn btn-full">View Details</a>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Load Product Detail
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = getProductById(parseInt(productId));
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    // Update page title
    document.title = `${product.name} - Green Valley Farmers`;
    
    // Update product detail
    const productDetail = document.querySelector('.product-detail-container');
    if (productDetail) {
        productDetail.innerHTML = `
            <div class="product-detail-image">
                ${product.image}
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <div class="product-rating">
                    <span>★</span>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-price-large">${formatPrice(product.price)} ${product.unit}</div>
                <p>${product.description}</p>
                
                <div class="product-meta">
                    <div class="product-meta-item">
                        <span class="product-meta-label">Farm</span>
                        <span class="product-meta-value">${product.farm}</span>
                    </div>
                    <div class="product-meta-item">
                        <span class="product-meta-label">Harvest Date</span>
                        <span class="product-meta-value">${new Date(product.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div class="product-meta-item">
                        <span class="product-meta-label">Stock</span>
                        <span class="product-meta-value">${product.stock} available</span>
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <button class="quantity-btn" id="decrease-qty">-</button>
                    <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn" id="increase-qty">+</button>
                </div>
                
                <button class="btn btn-accent btn-large" id="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                
                <div class="product-description-full">
                    <h3>Product Details</h3>
                    <p>${product.details}</p>
                </div>
            </div>
        `;
        
        // Add event listeners for quantity controls
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('add-to-cart');
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseInt(quantityInput.value);
            if (value < product.stock) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', () => {
            let value = parseInt(quantityInput.value);
            if (value < 1) quantityInput.value = 1;
            if (value > product.stock) quantityInput.value = product.stock;
        });
        
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (addToCart(product.id, quantity)) {
                showToast('success', 'Product added to cart!');
                updateCartCount();
            } else {
                showToast('error', 'Failed to add product to cart. Please check stock availability.');
            }
        });
    }
}

// Cart Functions
function initCart() {
    // Update cart count on all pages
    updateCartCount();
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const emptyCartElement = document.querySelector('.cart-empty');
    const cartContainer = document.querySelector('.cart-container');
    
    if (cart.length === 0) {
        if (emptyCartElement) emptyCartElement.style.display = 'block';
        if (cartContainer) cartContainer.style.display = 'none';
        return;
    }
    
    if (emptyCartElement) emptyCartElement.style.display = 'none';
    if (cartContainer) cartContainer.style.display = 'block';
    
    let total = 0;
    let html = '';
    
    cart.forEach((item, index) => {
        const product = getProductById(item.id);
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">${formatPrice(item.price)} ${item.unit}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease-item">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-item">+</button>
                        <button class="remove-item" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <strong>${formatPrice(itemTotal)}</strong>
                </div>
            </div>
        `;
    });
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = html;
    if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
    if (cartCountElement) cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add event listeners for cart controls
    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.closest('.cart-item').getAttribute('data-index'));
            const item = cart[index];
            if (item.quantity > 1) {
                updateCartQuantity(item.id, item.quantity - 1);
                loadCart();
            }
        });
    });
    
    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.closest('.cart-item').getAttribute('data-index'));
            const item = cart[index];
            const product = getProductById(item.id);
            if (item.quantity < product.stock) {
                updateCartQuantity(item.id, item.quantity + 1);
                loadCart();
            } else {
                showToast('warning', 'Cannot add more items. Stock limit reached.');
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.closest('.cart-item').getAttribute('data-index'));
            const item = cart[index];
            if (confirm(`Remove ${item.name} from cart?`)) {
                removeFromCart(item.id);
                loadCart();
                showToast('success', 'Item removed from cart.');
            }
        });
    });
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length > 0 && confirm('Clear all items from cart?')) {
                clearCart();
                loadCart();
                showToast('success', 'Cart cleared.');
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showToast('warning', 'Your cart is empty.');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// Checkout Functions
function loadCheckout() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="checkout-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatPrice(itemTotal)}</span>
            </div>
        `;
    });
    
    if (checkoutItemsContainer) checkoutItemsContainer.innerHTML = html;
    if (checkoutTotalElement) checkoutTotalElement.textContent = formatPrice(total);
    
    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateCheckoutForm()) {
                return;
            }
            
            // Simulate order processing
            const orderId = 'ORD-' + Date.now().toString().slice(-8);
            
            // Show success message
            document.querySelector('.checkout-container').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
                    <p>You will receive an email confirmation shortly.</p>
                    <div style="margin-top: 30px;">
                        <a href="products.html" class="btn btn-accent">Continue Shopping</a>
                    </div>
                </div>
            `;
            
            // Clear cart
            clearCart();
            updateCartCount();
        });
    }
}

function validateCheckoutForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error-color)';
            isValid = false;
            
            // Show error message
            const errorMessage = field.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = 'var(--error-color)';
                error.style.fontSize = '0.9rem';
                error.style.marginTop = '5px';
                error.textContent = 'This field is required';
                field.parentNode.appendChild(error);
            }
        } else {
            field.style.borderColor = '';
            const errorMessage = field.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });
    
    // Validate email
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = 'var(--error-color)';
            isValid = false;
            
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.color = 'var(--error-color)';
            error.style.fontSize = '0.9rem';
            error.style.marginTop = '5px';
            error.textContent = 'Please enter a valid email address';
            emailField.parentNode.appendChild(error);
        }
    }
    
    if (!isValid) {
        showToast('error', 'Please fill in all required fields correctly.');
    }
    
    return isValid;
}

// Form Initialization
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }
            
            // Simulate processing delay
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit';
                }
            }, 1500);
        });
    });
}

// Toast Notification System
function initToast() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(type, message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = 'toast-' + Date.now();
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
    
    // Add close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toastId);
    });
}

function removeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Set Active Navigation
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes('product-detail') && href.includes('products')) ||
            (currentPage.includes('cart') && href.includes('cart')) ||
            (currentPage.includes('checkout') && href.includes('checkout'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Utility function to format price
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
        if (cartCount > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Expose functions to global scope for use in HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.showToast = showToast;