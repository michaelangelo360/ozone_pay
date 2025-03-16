/**
 * OzonePay - Products Page
 * Version: 1.0.0
 * Author: Claude
 * Description: Handles product filtering and display on the products page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Product page elements
    const productTabs = document.querySelectorAll('.tab');
    const allProducts = document.querySelectorAll('.product-card');
    
    // Check if we're on the products page
    if (productTabs.length === 0 || allProducts.length === 0) return;
    
    // Filter products by tab
    productTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-tab');
            
            // Handle 'all' category differently
            if (category === 'all') {
                // Show all products
                allProducts.forEach(product => {
                    product.style.display = 'block';
                });
            } else {
                // Filter products by category
                allProducts.forEach(product => {
                    const productCategories = product.getAttribute('data-category');
                    
                    if (productCategories && productCategories.includes(category)) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
            
            // Also populate category-specific tabs
            populateCategoryTab(category);
        });
    });
    
    // Check for hash in URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const tabElement = document.querySelector(`.tab[data-tab="${hash}"]`);
        
        if (tabElement) {
            // Click the tab to filter products
            tabElement.click();
        }
    }
    
    // Handle links to specific product categories
    const categoryLinks = document.querySelectorAll('[data-tab]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't interfere with tabs that are already handled
            if (!this.classList.contains('tab')) {
                e.preventDefault();
                
                const category = this.getAttribute('data-tab');
                const tab = document.querySelector(`.tab[data-tab="${category}"]`);
                
                if (tab) {
                    // Scroll to products section
                    const productsSection = document.querySelector('.products');
                    if (productsSection) {
                        window.scrollTo({
                            top: productsSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Click the tab to filter products
                    setTimeout(() => {
                        tab.click();
                    }, 500);
                }
            }
        });
    });
    
    // Initial population of category tabs
    populateCategoryTabs();
    
    /**
     * Populate products in category-specific tabs
     */
    function populateCategoryTabs() {
        const categories = ['solar', 'ev', 'cooking', 'agri'];
        
        categories.forEach(category => {
            populateCategoryTab(category);
        });
    }
    
    /**
     * Populate products for a specific category tab
     * @param {string} category - The product category
     */
    function populateCategoryTab(category) {
        if (category === 'all') return;
        
        const categoryTab = document.getElementById(`${category}-products`);
        if (!categoryTab) return;
        
        // Clear existing content
        categoryTab.innerHTML = '';
        
        // Find all products in this category
        const categoryProducts = Array.from(allProducts).filter(product => {
            const productCategories = product.getAttribute('data-category');
            return productCategories && productCategories.includes(category);
        });
        
        // If no products found
        if (categoryProducts.length === 0) {
            categoryTab.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }
        
        // Clone and append products to category tab
        categoryProducts.forEach(product => {
            const clone = product.cloneNode(true);
            clone.style.display = 'block';
            categoryTab.appendChild(clone);
        });
    }
});