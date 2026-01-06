// Cart-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart on pages that need it
    if (document.querySelector('.cart-page') || 
        document.querySelector('.checkout-page') ||
        document.querySelector('.product-detail')) {
        initCartFunctionality();
    }
});

function initCartFunctionality() {
    // Update cart display
    updateCartDisplay();
    
    // Add event listeners for cart actions
    document.addEventListener('click', function(e) {
        // Add to cart buttons
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-product-id');
            const quantity = button.getAttribute('data-quantity') || 1;
            
            handleAddToCart(productId, parseInt(quantity), button);
        }
        
        // Remove from cart buttons
        if (e.target.closest('.remove-item')) {
            const button = e.target.closest('.remove-item');
            const productId = button.getAttribute('data-product-id');
            
            handleRemoveFromCart(productId);
        }
        
        // Update quantity buttons
        if (e.target.closest('.update-quantity')) {
            const button = e.target.closest('.update-quantity');
            const productId = button.getAttribute('data-product-id');
            const change = parseInt(button.getAttribute('data-change'));
            
            handleUpdateQuantity(productId, change);
        }
    });
}

function handleAddToCart(productId, quantity, button) {
    const originalText = button.innerHTML;
    const originalBackground = button.style.backgroundColor;
    
    if (addToCart(productId, quantity)) {
        // Visual feedback
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.backgroundColor = 'var(--success-color)';
        
        // Show toast notification
        showToast('success', 'Product added to cart!');
        
        // Update cart count
        updateCartCount();
        
        // Restore button after delay
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = originalBackground;
        }, 1500);
    } else {
        showToast('error', 'Failed to add product to cart.');
    }
}

function handleRemoveFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        removeFromCart(productId);
        updateCartDisplay();
        updateCartCount();
        showToast('success', 'Item removed from cart.');
    }
}

function handleUpdateQuantity(productId, change) {
    const item = cart.find(item => item.id === parseInt(productId));
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            updateCartQuantity(productId, newQuantity);
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartDisplay() {
    // This function updates the cart display on cart page
    // Implementation depends on the specific page structure
}