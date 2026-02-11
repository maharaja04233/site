CART ============ -->
    
        // ============ PRODUCT DATABASE WITH STOCK ============
        const products = [
            { id: 1, name: "Discus Fish", description: "Premium imported Discus - King of aquarium", price: 1999, category: "featured", icon: "🐠", stock: 15 },
            { id: 2, name: "Cherry Shrimp", description: "Red Cherry Shrimp - 10 pcs, algae cleaners", price: 499, category: "featured", icon: "🦐", stock: 50 },
            { id: 3, name: "Aquarium Plants", description: "Live aquatic plants bundle - 5 species", price: 799, category: "featured", icon: "🌿", stock: 30 },
            { id: 4, name: "LED Light", description: "Full spectrum RGB aquarium light", price: 2499, category: "featured", icon: "💡", stock: 20 },
            { id: 5, name: "Angelfish", description: "Freshwater Angelfish - Pair, Marble variety", price: 899, category: "fish", icon: "🐟", stock: 25 },
            { id: 6, name: "Betta Fish", description: "Halfmoon Betta - Premium colors", price: 399, category: "fish", icon: "🐡", stock: 40 },
            { id: 7, name: "Amano Shrimp", description: "Algae eating shrimp - 5 pcs", price: 599, category: "fish", icon: "🦐", stock: 35 },
            { id: 8, name: "Nerite Snails", description: "Algae control snails - 3 pcs", price: 299, category: "fish", icon: "🐌", stock: 60 },
            { id: 9, name: "Guppy Fish", description: "Fancy Guppy - 6 pcs, mixed colors", price: 349, category: "fish", icon: "🐠", stock: 45 },
            { id: 10, name: "Neon Tetra", description: "School of 10 fish", price: 399, category: "fish", icon: "🐟", stock: 55 },
            { id: 11, name: "Aquarium Filter", description: "Hang-on-back filter, 1000L/H", price: 1299, category: "equipment", icon: "🔍", stock: 18 },
            { id: 12, name: "Heater", description: "Adjustable 100W aquarium heater", price: 899, category: "equipment", icon: "🌡️", stock: 22 },
            { id: 13, name: "Aquarium Substrate", description: "Nutrient-rich plant soil - 5kg", price: 649, category: "equipment", icon: "🏝️", stock: 28 },
            { id: 14, name: "Driftwood", description: "Natural Malaysian driftwood", price: 449, category: "equipment", icon: "🎭", stock: 15 },
            { id: 15, name: "Air Pump", description: "Silent air pump, dual outlet", price: 599, category: "equipment", icon: "💨", stock: 25 },
            { id: 16, name: "Water Conditioner", description: "500ml, removes chlorine", price: 299, category: "equipment", icon: "💧", stock: 40 }
        ];

        const services = [
            { id: 1, name: "Custom Tank Building", description: "Custom sized aquariums with premium glass & silicone", icon: "🏗️" },
            { id: 2, name: "Aquascaping Design", description: "Nature aquarium, Iwagumi, Dutch style layouts", icon: "🎨" },
            { id: 3, name: "Installation Service", description: "Complete setup with plumbing and electrical", icon: "🛠️" },
            { id: 4, name: "Maintenance Service", description: "Weekly/bi-weekly aquarium maintenance", icon: "🧹" },
            { id: 5, name: "Fish Health Care", description: "Professional treatment for fish diseases", icon: "🐠" },
            { id: 6, name: "Aquarium Workshop", description: "Learn aquascaping from master artists", icon: "📚" }
        ];

        // ============ CART SYSTEM ============
        let cart = [];

        function loadCart() {
            const savedCart = localStorage.getItem('aquariumCart');
            if (savedCart) cart = JSON.parse(savedCart);
            updateCartUI();
        }

        function saveCart() {
            localStorage.setItem('aquariumCart', JSON.stringify(cart));
            updateCartUI();
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Check stock
            if (product.stock <= 0) {
                showNotification('❌ Out of stock!');
                return;
            }

            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            // Reduce stock
            product.stock -= 1;
            
            saveCart();
            showNotification(`✨ ${product.name} added to cart!`);
            
            // Refresh product display
            renderProducts();
        }

        function removeFromCart(productId) {
            const item = cart.find(i => i.id === productId);
            if (!item) return;
            
            // Restore stock
            const product = products.find(p => p.id === productId);
            if (product) {
                product.stock += item.quantity;
            }
            
            cart = cart.filter(i => i.id !== productId);
            saveCart();
            showNotification(`🗑️ ${item.name} removed from cart`);
            
            // Refresh product display
            renderProducts();
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) cartCountElement.textContent = totalItems;

            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotalElement = document.getElementById('cartTotal');
            
            if (!cartItemsContainer || !cartTotalElement) return;
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: #666;">🛒 Your cart is empty</div>';
                cartTotalElement.textContent = 'Total: ₹0';
            } else {
                let html = '';
                let total = 0;
                
                cart.forEach(item => {
                    total += item.price * item.quantity;
                    html += `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f8f8; border-radius: 10px; margin-bottom: 1rem;">
                            <div style="font-size: 2rem;">${item.icon}</div>
                            <div style="flex: 1;">
                                <div style="font-weight: bold; color: var(--primary-dark);">${item.name}</div>
                                <div style="color: var(--primary);">₹${item.price} x ${item.quantity}</div>
                            </div>
                            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #ff4444;">✕</button>
                        </div>
                    `;
                });
                
                cartItemsContainer.innerHTML = html;
                cartTotalElement.textContent = `Total: ₹${total}`;
            }
        }

        // ============ RENDER PRODUCTS ============
        function renderProducts() {
            // Featured Products
            const featuredContainer = document.getElementById('featuredProducts');
            if (featuredContainer) {
                featuredContainer.innerHTML = products.filter(p => p.category === 'featured').map(p => `
                    <div class="product-card">
                        <div class="product-img">${p.icon}</div>
                        <div class="product-info">
                            <h4>${p.name}</h4>
                            <p style="color: #666; font-size: 0.9rem;">${p.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div class="product-price">₹${p.price}</div>
                                <span style="color: ${p.stock > 0 ? '#2e7d32' : '#ff4444'}; font-size: 0.8rem;">
                                    ${p.stock > 0 ? `✓ ${p.stock} in stock` : '✗ Out of stock'}
                                </span>
                            </div>
                            <button class="product-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled style="opacity:0.5;"' : ''}>
                                ${p.stock > 0 ? '🛒 Add to Cart' : '❌ Out of Stock'}
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Fish Products
            const fishContainer = document.getElementById('fishProducts');
            if (fishContainer) {
                fishContainer.innerHTML = products.filter(p => p.category === 'fish').map(p => `
                    <div class="product-card">
                        <div class="product-img">${p.icon}</div>
                        <div class="product-info">
                            <h4>${p.name}</h4>
                            <p style="color: #666; font-size: 0.9rem;">${p.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div class="product-price">₹${p.price}</div>
                                <span style="color: ${p.stock > 0 ? '#2e7d32' : '#ff4444'}; font-size: 0.8rem;">
                                    ${p.stock > 0 ? `✓ ${p.stock} in stock` : '✗ Out of stock'}
                                </span>
                            </div>
                            <button class="product-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled style="opacity:0.5;"' : ''}>
                                ${p.stock > 0 ? '🛒 Add to Cart' : '❌ Out of Stock'}
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Equipment Products
            const equipmentContainer = document.getElementById('equipmentProducts');
            if (equipmentContainer) {
                equipmentContainer.innerHTML = products.filter(p => p.category === 'equipment').map(p => `
                    <div class="product-card">
                        <div class="product-img">${p.icon}</div>
                        <div class="product-info">
                            <h4>${p.name}</h4>
                            <p style="color: #666; font-size: 0.9rem;">${p.description}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div class="product-price">₹${p.price}</div>
                                <span style="color: ${p.stock > 0 ? '#2e7d32' : '#ff4444'}; font-size: 0.8rem;">
                                    ${p.stock > 0 ? `✓ ${p.stock} in stock` : '✗ Out of stock'}
                                </span>
                            </div>
                            <button class="product-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled style="opacity:0.5;"' : ''}>
                                ${p.stock > 0 ? '🛒 Add to Cart' : '❌ Out of Stock'}
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Services
            const servicesContainer = document.getElementById('servicesGrid');
            if (servicesContainer) {
                servicesContainer.innerHTML = services.map(s => `
                    <div class="service-card">
                        <div class="service-icon">${s.icon}</div>
                        <h4 style="font-size: 1.3rem; margin-bottom: 1rem;">${s.name}</h4>
                        <p style="color: #666; margin-bottom: 1.5rem;">${s.description}</p>
                        <button class="btn" onclick="showNotification('📞 Thank you! We will contact you soon.')">Book Now</button>
                    </div>
                `).join('');
            }
        }

        // ============ SEARCH FUNCTIONALITY ============
        
        function handleSearchKeyUp(event) {
            const query = event.target.value.trim();
            if (query.length >= 2) {
                performLiveSearch(query);
            } else {
                const resultsDiv = document.getElementById('searchResults');
                if (resultsDiv) resultsDiv.classList.remove('active');
            }
        }

        function performLiveSearch(query) {
            query = query.toLowerCase();
            
            const results = products.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            
            displaySearchResults(results, query);
        }

        function displaySearchResults(results, query) {
            const resultsDiv = document.getElementById('searchResults');
            if (!resultsDiv) return;
            
            if (results.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <span style="font-size: 40px;">🐟❓</span>
                        <h3>No fish found for "${query}"</h3>
                        <p style="margin-top: 10px; color: #666;">Try searching for: Discus, Betta, Guppy, Tetra...</p>
                    </div>
                `;
                resultsDiv.classList.add('active');
                return;
            }
            
            let html = '';
            results.slice(0, 5).forEach(item => {
                const stockStatus = item.stock > 0 ? 
                    `<span style="color: #2e7d32;">✓ In Stock (${item.stock})</span>` : 
                    `<span style="color: #ff4444;">✗ Out of Stock</span>`;
                
                html += `
                    <div class="result-item" onclick="selectProduct(${item.id})">
                        <div class="result-icon">${item.icon}</div>
                        <div class="result-info">
                            <div class="result-name">${highlightMatch(item.name, query)}</div>
                            <div style="color: #666; font-size: 13px;">${highlightMatch(item.description, query)}</div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                                <span class="result-price">₹${item.price}</span>
                                ${stockStatus}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            if (results.length > 5) {
                html += `
                    <div style="padding: 12px; text-align: center; background: #f5f5f5; border-radius: 0 0 20px 20px;">
                        <span style="color: var(--primary); font-weight: bold;">
                            + ${results.length - 5} more results
                        </span>
                    </div>
                `;
            }
            
            resultsDiv.innerHTML = html;
            resultsDiv.classList.add('active');
        }

        function highlightMatch(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<span style="background: #ffd700; color: #003f5c; padding: 2px 6px; border-radius: 3px; font-weight: bold;">$1</span>');
        }

        // ✅ FIXED: Click search result = Add to cart + Open cart
        function selectProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // Close search results
            const resultsDiv = document.getElementById('searchResults');
            if (resultsDiv) resultsDiv.classList.remove('active');
            
            // Clear search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = product.name;
            
            // ✅ ADD TO CART AUTOMATICALLY
            addToCart(productId);
            
            // ✅ OPEN CART SIDEBAR
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) cartSidebar.classList.add('active');
            
            // Switch to products page to show the item
            showSection('products');
            
            showNotification(`🔍 Found & Added: ${product.name} - ₹${product.price}`);
        }

        function performSearch() {
            const input = document.getElementById('searchInput');
            if (!input) return;
            
            const query = input.value.trim();
            
            if (query.length === 0) {
                showNotification('🔍 Please enter what you want to search');
                return;
            }
            
            if (query.length >= 2) {
                performLiveSearch(query);
            } else {
                showNotification('🔍 Please enter at least 2 characters');
            }
        }

        // ============ OTHER FUNCTIONS ============
        function showSection(sectionId) {
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
            
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function scrollToBuildTank() {
            const buildTank = document.getElementById('buildTank');
            if (buildTank) buildTank.scrollIntoView({ behavior: 'smooth' });
        }

        function submitTankQuote() {
            const fields = ['tankName', 'tankEmail', 'tankPhone', 'tankShape', 'tankDetails'];
            const empty = fields.some(f => {
                const element = document.getElementById(f);
                return !element || !element.value;
            });
            
            if (empty) {
                showNotification('⚠️ Please fill in all fields');
                return;
            }
            
            showNotification('✅ Quote request sent! We\'ll reply within 24 hours.');
            fields.forEach(f => {
                const element = document.getElementById(f);
                if (element) element.value = '';
            });
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            if (!notification) return;
            
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }

        // ============ EVENT LISTENERS ============
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts();
            loadCart();

            // Mobile menu
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    const navLinks = document.getElementById('navLinks');
                    if (navLinks) navLinks.classList.toggle('active');
                });
            }

            // Cart
            const cartIcon = document.getElementById('cartIcon');
            if (cartIcon) {
                cartIcon.addEventListener('click', function() {
                    const cartSidebar = document.getElementById('cartSidebar');
                    if (cartSidebar) cartSidebar.classList.add('active');
                });
            }

            const closeCart = document.getElementById('closeCart');
            if (closeCart) {
                closeCart.addEventListener('click', function() {
                    const cartSidebar = document.getElementById('cartSidebar');
                    if (cartSidebar) cartSidebar.classList.remove('active');
                });
            }

            // Navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        showSection(href.substring(1));
                    }
                });
            });

            // Contact form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    showNotification('📧 Message sent! We\'ll reply within 24 hours.');
                    this.reset();
                });
            }

            // Checkout
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', function() {
                    if (cart.length === 0) {
                        showNotification('🛒 Your cart is empty');
                    } else {
                        showNotification('🔒 Redirecting to secure checkout...');
                    }
                });
            }

            // Close search results when clicking outside
            document.addEventListener('click', function(e) {
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer && !searchContainer.contains(e.target)) {
                    const resultsDiv = document.getElementById('searchResults');
                    if (resultsDiv) resultsDiv.classList.remove('active');
                }
                
                // Close mobile menu when clicking outside
                if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
                    const navLinks = document.getElementById('navLinks');
                    if (navLinks) navLinks.classList.remove('active');
                }
            });
        });

        // Make functions globally available
        window.addToCart = addToCart;
        window.removeFromCart = removeFromCart;
        window.showSection = showSection;
        window.scrollToBuildTank = scrollToBuildTank;
        window.submitTankQuote = submitTankQuote;
        window.showNotification = showNotification;
        window.handleSearchKeyUp = handleSearchKeyUp;
        window.performSearch = performSearch;
        window.selectProduct = selectProduct;
        window.highlightMatch = highlightMatch;
    
