// Product Data
const productsCatalog = [
    { id: 1, name: "Aurora Necklace", price: 89, priceStr: "$89", image: "https://images.pexels.com/photos/1456690/pexels-photo-1456690.jpeg?auto=compress&cs=tinysrgb&w=600", desc: "Gold-plated chain with moonstone pendant. Elegant and timeless." },
    { id: 2, name: "Onyx Stackable Rings", price: 49, priceStr: "$49", image: "Media/Onyx Stackable Rings.jpg", desc: "Set of 3 adjustable rings, black onyx. Modern minimalist style." },
    { id: 3, name: "Luna Hoop Earrings", price: 59, priceStr: "$59", image: "Media/Luna Hoop Earrings.jpg", desc: "14k gold filled, timeless huggie hoops. Daily essential." },
    { id: 4, name: "Celeste Bracelet", price: 69, priceStr: "$69", image: "Media/bracelet.jpg", desc: "Pearl and chain adjustable bracelet. Delicate and chic." },
    { id: 5, name: "Donia Signature Bangle", price: 119, priceStr: "$119", image: "Media/Donia Signature Bangle.jpg", desc: "Hand-engraved with semi-precious stones. Statement piece." }
];

const accessoriesCatalog = [
    { id: 101, name: "Luxury Silk Scarf", price: 45, priceStr: "$45", image: "Media/Silk Scarf.jpg", desc: "Hand-rolled edges, elegant floral print. 100% pure silk." },
    { id: 102, name: "Leather Cuff Watch", price: 79, priceStr: "$79", image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600", desc: "Minimalist genuine leather strap. Classic timeless design." },
    { id: 103, name: "Pearl Hair Clips Set", price: 28, priceStr: "$28", image: "Media/Pearl Hair Clips Set.jpg", desc: "Gold & pearl hair clips (set of 3). Vintage inspired beauty." },
    { id: 104, name: "Designer Sunglasses", price: 99, priceStr: "$99", image: "Media/Designer Sunglasses.jpg", desc: "Retro cat-eye, UV400 protection. Made for sunshine days." },
    { id: 105, name: "Cashmere Beanie", price: 55, priceStr: "$55", image: "Media/Cashmere Beanie.webp", desc: "Soft cashmere, winter essential. Cozy and warm elegance." }
];

const allItems = [...productsCatalog, ...accessoriesCatalog];
let cart = [];

// Helper Functions
function showToast(message) {
    const toast = document.getElementById('toastMsg');
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

function saveCart() {
    localStorage.setItem('doniaCart', JSON.stringify(cart));
    updateCartUI();
    updateCheckoutPopup();
}

function loadCart() {
    const saved = localStorage.getItem('doniaCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
    updateCartUI();
    updateCheckoutPopup();
}

function addToCart(productId) {
    const item = allItems.find(i => i.id === productId);
    if (!item) return;
    
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    showToast(`✓ ${item.name} added to cart`);
}

function updateQuantity(productId, delta) {
    const index = cart.findIndex(i => i.id === productId);
    if (index !== -1) {
        const newQty = cart[index].quantity + delta;
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }
        saveCart();
    }
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartCountSpan = document.getElementById('cartCount');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCountSpan.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">Your cart is empty ✨</div>';
        cartTotalSpan.textContent = '$0';
        return;
    }
    
    let total = 0;
    cartItemsDiv.innerHTML = '';
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="qty-minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    
    cartTotalSpan.textContent = `$${total}`;
    
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(parseInt(btn.dataset.id), -1);
        });
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(parseInt(btn.dataset.id), 1);
        });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeItem(parseInt(btn.dataset.id));
        });
    });
}

function updateCheckoutPopup() {
    const container = document.getElementById('checkoutItemsList');
    const totalSpan = document.getElementById('checkoutTotal');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#ab8a6b;">Your cart is empty. Add some beautiful items!</p>';
        totalSpan.textContent = '$0';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<span>${item.name} x ${item.quantity}</span><span>$${item.price * item.quantity}</span>`;
        container.appendChild(div);
    });
    totalSpan.textContent = `$${total}`;
}

function renderCardGrid(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${item.name}</h3>
                <div class="price">${item.priceStr}</div>
                <div class="desc">${item.desc}</div>
                <button class="add-to-cart" data-id="${item.id}"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
            </div>
        `;
        container.appendChild(card);
    });
    
    document.querySelectorAll(`#${containerId} .add-to-cart`).forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
}

function getBestsellers() {
    return [productsCatalog[0], productsCatalog[2], accessoriesCatalog[0], accessoriesCatalog[2], productsCatalog[3]];
}

// Navigation
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('currentPage', pageId);
}

// Checkout Popup Functions
function openCheckoutPopup() {
    const popup = document.getElementById('checkoutPopup');
    const overlay = document.getElementById('overlay');
    updateCheckoutPopup();
    popup.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutPopup() {
    const popup = document.getElementById('checkoutPopup');
    const overlay = document.getElementById('overlay');
    popup.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// WhatsApp Order Submission
function sendOrderViaWhatsApp(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showToast('❌ Your cart is empty! Add items first.');
        return;
    }
    
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    
    if (!name || !phone || !address) {
        showToast('⚠️ Please fill all required fields (Name, Phone, Address)');
        return;
    }
    
    let orderDetails = "🛍️ *NEW ORDER FROM DONIA STORE* 🛍️\n\n";
    orderDetails += `👤 *Customer:* ${name}\n`;
    orderDetails += `📞 *WhatsApp:* ${phone}\n`;
    orderDetails += `📍 *Address:* ${address}\n`;
    
    const notes = document.getElementById('custNotes').value.trim();
    if (notes) orderDetails += `📝 *Notes:* ${notes}\n`;
    
    orderDetails += `\n━━━━━━━━━━━━━━━━━━\n*ORDER ITEMS:*\n`;
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        orderDetails += `• ${item.name} x ${item.quantity} = $${subtotal}\n`;
    });
    orderDetails += `━━━━━━━━━━━━━━━━━━\n💰 *TOTAL: $${total}*\n`;

    
    const whatsappNumber = "256765673373";
    const encodedMsg = encodeURIComponent(orderDetails);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, '_blank');
    
    showToast(`📱 Opening WhatsApp to complete order...`);
    closeCheckoutPopup();
}

// Cart Sidebar
function initCartSidebar() {
    const cartIcon = document.getElementById('cartIcon');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const closeCart = document.getElementById('closeCart');
    const openCheckoutBtn = document.getElementById('openCheckoutPopupBtn');
    
    cartIcon.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('show');
    });
    
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
    
    closeCart.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    
    openCheckoutBtn.addEventListener('click', () => {
        closeSidebar();
        openCheckoutPopup();
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMsg').value;
            
            if (name && email && message) {
                showToast(`📨 Thanks ${name}! Your message has been sent to doniastore@gmail.com — we'll reply within 24 hours.`);
                contactForm.reset();
            } else {
                showToast('⚠️ Please fill all fields before sending.');
            }
        });
    }
}

// Navigation Buttons
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const pageId = btn.getAttribute('data-page');
        if (pageId) {
            btn.addEventListener('click', () => {
                navigateTo(pageId);
            });
        }
    });
    
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            navigateTo('products');
        });
    }
}

// Checkout Popup Initialization
function initCheckoutPopup() {
    const closeBtn = document.getElementById('closeCheckoutPopup');
    const overlay = document.getElementById('overlay');
    const checkoutForm = document.getElementById('checkoutForm');
    
    closeBtn.addEventListener('click', closeCheckoutPopup);
    overlay.addEventListener('click', () => {
        closeCheckoutPopup();
        // Also close cart sidebar if open
        const sidebar = document.getElementById('cartSidebar');
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', sendOrderViaWhatsApp);
    }
}

// Restore Last Page
function restoreLastPage() {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && document.getElementById(savedPage)) {
        navigateTo(savedPage);
    } else {
        navigateTo('home');
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    renderCardGrid('productsGrid', productsCatalog);
    renderCardGrid('accessoriesGrid', accessoriesCatalog);
    renderCardGrid('bestsellerGrid', getBestsellers());
    loadCart();
    initCartSidebar();
    initContactForm();
    initNavigation();
    initCheckoutPopup();
    restoreLastPage();
});