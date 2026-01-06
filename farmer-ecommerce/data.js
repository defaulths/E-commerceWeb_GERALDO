// Product data for the entire application
const products = [
    {
        id: 1,
        name: "Organic Carrots",
        category: "vegetables",
        price: 2.99,
        description: "Freshly harvested, sweet and crunchy organic carrots grown in nutrient-rich soil without any pesticides or chemicals.",
        details: "Our organic carrots are grown using sustainable farming methods. They're rich in beta-carotene, fiber, and antioxidants. Perfect for salads, soups, or as a healthy snack.",
        image: "🥕",
        stock: 50,
        rating: 4.5,
        reviews: 24,
        farm: "Green Valley Organic Farm",
        harvestDate: "2023-10-15",
        unit: "per lb"
    },
    {
        id: 2,
        name: "Honeycrisp Apples",
        category: "fruits",
        price: 3.49,
        description: "Crisp, juicy apples with the perfect balance of sweetness and tartness, ideal for snacking or baking.",
        details: "Honeycrisp apples are known for their exceptional crispness and juiciness. Grown in our orchard with natural pollination methods. These apples maintain their texture when baked.",
        image: "🍎",
        stock: 35,
        rating: 4.8,
        reviews: 42,
        farm: "Sunny Orchard",
        harvestDate: "2023-10-10",
        unit: "per lb"
    },
    {
        id: 3,
        name: "Farmhouse Cheese",
        category: "dairy",
        price: 6.99,
        description: "Aged cheddar cheese made from grass-fed cow's milk, with rich flavor and smooth texture.",
        details: "Our farmhouse cheese is aged for 6 months to develop its distinctive flavor. Made from the milk of pasture-raised cows. Contains no artificial preservatives or additives.",
        image: "🧀",
        stock: 20,
        rating: 4.7,
        reviews: 18,
        farm: "Happy Cow Dairy",
        harvestDate: "2023-09-20",
        unit: "per block"
    },
    {
        id: 4,
        name: "Whole Wheat Flour",
        category: "grains",
        price: 4.99,
        description: "Stone-ground whole wheat flour perfect for baking bread, cookies, and other baked goods.",
        details: "Made from locally grown wheat, stone-ground to preserve nutrients and flavor. Contains all parts of the wheat kernel—bran, germ, and endosperm. High in fiber and protein.",
        image: "🌾",
        stock: 40,
        rating: 4.4,
        reviews: 31,
        farm: "Golden Grain Mill",
        harvestDate: "2023-10-01",
        unit: "per lb"
    },
    {
        id: 5,
        name: "Bell Peppers",
        category: "vegetables",
        price: 3.25,
        description: "Colorful bell peppers in red, green, and yellow varieties, packed with vitamins and flavor.",
        details: "These bell peppers are grown in our greenhouse using organic methods. Rich in vitamins A and C. Available in mixed color packs or individual colors.",
        image: "🫑",
        stock: 30,
        rating: 4.3,
        reviews: 19,
        farm: "Rainbow Greenhouse",
        harvestDate: "2023-10-12",
        unit: "per lb"
    },
    {
        id: 6,
        name: "Fresh Lemons",
        category: "fruits",
        price: 2.75,
        description: "Juicy, tart lemons perfect for cooking, baking, and beverages.",
        details: "Grown in our coastal lemon grove, these lemons are known for their thin skin and high juice content. Great for lemonade, dressings, and zesting.",
        image: "🍋",
        stock: 60,
        rating: 4.6,
        reviews: 27,
        farm: "Coastal Citrus Grove",
        harvestDate: "2023-10-05",
        unit: "per lb"
    },
    {
        id: 7,
        name: "Organic Tomatoes",
        category: "vegetables",
        price: 3.99,
        description: "Vine-ripened organic tomatoes with rich flavor and firm texture.",
        details: "Our tomatoes are grown on the vine until fully ripe, ensuring maximum flavor and nutrition. Perfect for salads, sauces, and sandwiches.",
        image: "🍅",
        stock: 25,
        rating: 4.7,
        reviews: 38,
        farm: "Green Valley Organic Farm",
        harvestDate: "2023-10-08",
        unit: "per lb"
    },
    {
        id: 8,
        name: "Farm Fresh Eggs",
        category: "dairy",
        price: 5.99,
        description: "Free-range eggs from happy chickens, with rich orange yolks and superior taste.",
        details: "Our chickens roam freely on pasture, resulting in eggs with higher nutrient content. Each egg is hand-collected daily and carefully packed.",
        image: "🥚",
        stock: 45,
        rating: 4.9,
        reviews: 56,
        farm: "Happy Hen Haven",
        harvestDate: "2023-10-14",
        unit: "per dozen"
    }
];

// Cart data structure
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return false;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        if (existingItem.quantity > product.stock) {
            existingItem.quantity = product.stock;
            return false;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            unit: product.unit
        });
    }
    
    saveCart();
    return true;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    const product = getProductById(productId);
    
    if (item && product) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else if (quantity <= product.stock) {
            item.quantity = quantity;
            saveCart();
            return true;
        }
    }
    return false;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = getCartCount();
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Initialize cart count on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
    updateCartCount();
}