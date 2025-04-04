// Product data
const products = [
    {
        id: 1,
        name: "Premium Headphones",
        price: 99.99,
        image: "https://m.media-amazon.com/images/I/41dH162raPL._AC_UF1000,1000_QL80_.jpg",
        category: "electronics",
        description: "High-quality over-ear headphones with noise cancellation and premium sound quality."
    },
    {
        id: 2,
        name: "Wireless Speaker",
        price: 79.99,
        image: "https://www.sony.co.in/image/e6c64548ff9844b62832b1816a1aa3a4?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
        category: "electronics",
        description: "Portable Bluetooth speaker with 20 hours of battery life and waterproof design."
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 129.99,
        image: "https://www.jiomart.com/images/product/original/rvczsoocvi/punnkfunnk-gen-9-bluetooth-calling-smart-watch-specially-made-for-girl-women-free-rose-golden-strap-1-6-inch-full-sunlight-proof-display-product-images-orvczsoocvi-p608456897-0-202403141918.jpg?im=Resize=(1000,1000)",
        category: "electronics",
        description: "Advanced smartwatch with fitness tracking, heart rate monitoring, and smartphone notifications."
    },
    {
        id: 4,
        name: "Cotten T-Shirt",
        price: 24.99,
        image: "https://yourdesignstore.s3.amazonaws.com/uploads/yds/productImages/full/1677835469508816639907562718organic-tee_website-final-1.png",
        category: "clothing",
        description: "Comfortable 100% cotton t-shirt available in multiple colors."
    },
    {
        id: 5,
        name: "Denim Jeans",
        price: 49.99,
        image: "https://assets.ajio.com/medias/sys_master/root/20240801/T52A/66abb7906f60443f31e1e335/-473Wx593H-442031523-denimblue-MODEL5.jpg",
        category: "clothing",
        description: "Classic denim jeans with straight fit and durable construction."
    },
    {
        id: 6,
        name: "Stainless Steel Water Bottle",
        price: 19.99,
        image: "https://atlasware.in/cdn/shop/products/Weblist_3_1200x.jpg?v=1646465437",
        category: "home",
        description: "Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours."
    },
    {
        id: 7,
        name: "LED Desk Lamp",
        price: 39.99,
        image: "https://m.media-amazon.com/images/I/61QPRxJk3dL.jpg",
        category: "home",
        description: "Adjustable desk lamp with different brightness levels and color temperatures."
    },
    {
        id: 8,
        name: "Leather Wallet",
        price: 34.99,
        image: "https://godbolegear.com/cdn/shop/files/SingleCashPocket-ClassicWallet-StuffedwithCardsandCash.jpg?v=1722840632",
        category: "accessories",
        description: "Genuine leather wallet with multiple card slots and RFID protection."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on based on the active nav link
    const activePage = document.querySelector('nav ul li a.active');
    
    if (!activePage) return;
    
    const pageName = activePage.getAttribute('href');
    
    if (pageName === 'index.html' || pageName === './index.html' || pageName === '/') {
        // Homepage specific code if needed
    } else if (pageName === 'products.html') {
        loadProducts();
    } else if (pageName === 'cart.html') {
        updateCartDisplay();
    } else if (pageName === 'contact.html') {
        setupContactForm();
    }
    
    // Setup cart count on all pages
    updateCartCount();
});

// Function to redirect to product details
function redirectToProduct(productId) {
    // In a real application, this would redirect to a product detail page
    // For this simple example, we'll add the product to cart directly
    addToCart(productId);
}

// Products page functionality
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    let filteredProducts = [...products];
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Add all products to the grid
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to apply filters on the products page
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredProducts = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Apply price filter
    if (priceFilter !== 'all') {
        if (priceFilter === 'under50') {
            filteredProducts = filteredProducts.filter(product => product.price < 50);
        } else if (priceFilter === '50to100') {
            filteredProducts = filteredProducts.filter(product => product.price >= 50 && product.price <= 100);
        } else if (priceFilter === 'over100') {
            filteredProducts = filteredProducts.filter(product => product.price > 100);
        }
    }
    
    // Clear and reload the product grid
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products match your filters.</p>';
        return;
    }
    
    // Add filtered products to the grid
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show notification
    alert(`${product.name} added to your cart!`);
}

function updateCartCount() {
    // This would update a cart count indicator in the header
    // For this simple example, we're not implementing this UI element
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    console.log(`Cart updated: ${totalItems} items`);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItems || !emptyCart || !cartSummary) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add each cart item
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update summary
    updateCartSummary();
}

function updateQuantity(index, change) {
    if (!cart[index]) return;
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

function updateCartSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (!subtotalEl || !shippingEl || !totalEl) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0; // Flat shipping rate
    const total = subtotal + shipping;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) return;
    
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, this would send the order to a server
            alert('Thank you for your order! It has been processed successfully.');
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartDisplay();
            
            // Close modal
            closeModal();
        });
    }
}

function closeModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.style.display = 'none';
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, this would send the form data to a server
        
        // Show success message
        const modal = document.getElementById('messageModal');
        if (modal) modal.style.display = 'flex';
        
        // Reset form
        contactForm.reset();
    });
}

function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    if (modal) modal.style.display = 'none';
}