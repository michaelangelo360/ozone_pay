/**
 * OzonePay - Application Form
 * Version: 1.0.0
 * Author: Claude
 * Description: Controls the multi-step application form functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Application form elements
    const applicationForm = document.getElementById('application-form');
    const progressBar = document.getElementById('application-progress');
    const formSteps = document.querySelectorAll('.form-step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Product selection form elements
    const productCategory = document.getElementById('product-category');
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const financingAmount = document.getElementById('financing-amount');
    const selectedProductDetails = document.getElementById('selected-product-details');
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-price');
    
    // Financial details form elements
    const loanTerm = document.getElementById('loan-term');
    const paymentFrequency = document.getElementById('payment-frequency');
    const monthlyIncome = document.getElementById('monthly-income');
    const estimatedPayment = document.getElementById('estimated-payment');
    const estimatedCredits = document.getElementById('estimated-credits');
    
    // Check if we're on the application page
    if (!applicationForm) return;
    
    // Initialize application form
    let currentStep = 1;
    updateProgressBar();
    
    // Add event listeners for next/prev buttons
    if (nextButtons.length > 0) {
        nextButtons.forEach(button => {
            button.addEventListener('click', nextStep);
        });
    }
    
    if (prevButtons.length > 0) {
        prevButtons.forEach(button => {
            button.addEventListener('click', prevStep);
        });
    }
    
    // Product category selection changes available products
    if (productCategory) {
        productCategory.addEventListener('change', function() {
            const category = this.value;
            
            if (category) {
                // Enable product dropdown
                productSelect.disabled = false;
                
                // Clear current options
                while (productSelect.options.length > 1) {
                    productSelect.remove(1);
                }
                
                // Add new options based on category
                const products = getProductsByCategory(category);
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    productSelect.appendChild(option);
                });
            } else {
                productSelect.disabled = true;
            }
            
            // Hide product details
            selectedProductDetails.classList.add('hidden');
        });
    }
    
    // Product selection shows product details
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const productId = this.value;
            
            if (productId) {
                // Find selected product
                const product = findProductById(productId);
                
                if (product) {
                    // Update product details
                    productImage.src = product.image;
                    productName.textContent = product.name;
                    productDescription.textContent = product.description;
                    productPrice.textContent = `$${product.price}`;
                    
                    // Show product details
                    selectedProductDetails.classList.remove('hidden');
                    
                    // Update financing amount
                    updateFinancingAmount();
                }
            } else {
                // Hide product details
                selectedProductDetails.classList.add('hidden');
            }
        });
    }
    
    // Quantity changes financing amount
    if (quantityInput) {
        quantityInput.addEventListener('input', updateFinancingAmount);
    }
    
    // Financial calculations when term or frequency changes
    if (loanTerm) {
        loanTerm.addEventListener('change', calculatePayment);
    }
    
    if (paymentFrequency) {
        paymentFrequency.addEventListener('change', calculatePayment);
    }
    
    if (monthlyIncome) {
        monthlyIncome.addEventListener('input', calculatePayment);
    }
    
    // Check for URL parameters (for pre-filling the form)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('amount')) {
        // Pre-fill amount if coming from calculator
        const amount = urlParams.get('amount');
        if (financingAmount) {
            financingAmount.value = `$${amount}`;
        }
    }
    
    if (urlParams.has('product')) {
        // Pre-select product if specified in URL
        const productParam = urlParams.get('product');
        const product = findProductById(productParam);
        
        if (product && productCategory) {
            // Set category
            productCategory.value = product.category;
            // Trigger change event to populate products
            const event = new Event('change');
            productCategory.dispatchEvent(event);
            
            // Set product
            setTimeout(() => {
                if (productSelect) {
                    productSelect.value = productParam;
                    // Trigger change event to show product details
                    const productEvent = new Event('change');
                    productSelect.dispatchEvent(productEvent);
                }
            }, 100);
        }
    }
    
    /**
     * Move to the next step in the application form
     */
    function nextStep() {
        // Validate current step
        if (!validateStep(currentStep)) {
            return;
        }
        
        // Hide current step
        document.querySelector(`.step-content[id="step-${currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('completed');
        
        // Move to next step
        currentStep++;
        
        // Show next step
        document.querySelector(`.step-content[id="step-${currentStep}"]`).classList.add('active');
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Update progress bar
        updateProgressBar();
        
        // Scroll to top of form
        applicationForm.scrollIntoView({ behavior: 'smooth' });
        
        // If last step, generate application ID
        if (currentStep === 5) {
            generateApplicationId();
        }
    }
    
    /**
     * Move to the previous step in the application form
     */
    function prevStep() {
        // Hide current step
        document.querySelector(`.step-content[id="step-${currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Move to previous step
        currentStep--;
        
        // Show previous step
        document.querySelector(`.step-content[id="step-${currentStep}"]`).classList.add('active');
        
        // Update progress bar
        updateProgressBar();
        
        // Scroll to top of form
        applicationForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Update the progress bar based on current step
     */
    function updateProgressBar() {
        const progress = ((currentStep - 1) / (formSteps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    /**
     * Validate the current step
     * @param {number} step - The current step number
     * @returns {boolean} - Whether the step is valid
     */
    function validateStep(step) {
        const currentStepContent = document.querySelector(`.step-content[id="step-${step}"]`);
        const requiredFields = currentStepContent.querySelectorAll('[required]');
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('invalid');
                isValid = false;
            } else {
                field.classList.remove('invalid');
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields');
        }
        
        return isValid;
    }
    
    /**
     * Update the financing amount based on product and quantity
     */
    function updateFinancingAmount() {
        if (!productSelect || !quantityInput || !financingAmount) return;
        
        const productId = productSelect.value;
        const quantity = parseInt(quantityInput.value);
        
        if (productId && quantity > 0) {
            const product = findProductById(productId);
            
            if (product) {
                const amount = product.price * quantity;
                financingAmount.value = `$${amount.toFixed(2)}`;
                
                // Also update payment calculation
                calculatePayment();
            }
        }
    }
    
    /**
     * Calculate estimated payment and carbon credits
     */
    function calculatePayment() {
        if (!financingAmount || !loanTerm || !estimatedPayment || !estimatedCredits) return;
        
        // Get values
        const amount = parseFloat(financingAmount.value.replace('$', ''));
        const term = parseInt(loanTerm.value);
        const frequency = paymentFrequency.value;
        
        if (isNaN(amount) || !term || !frequency) return;
        
        // Calculate payment based on frequency
        const interestRate = 0.10; // 10% annual interest rate
        let paymentAmount = 0;
        
        switch (frequency) {
            case 'monthly':
                const monthlyRate = interestRate / 12;
                paymentAmount = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
                break;
            case 'bi-weekly':
                const biWeeklyRate = interestRate / 26;
                const biWeeklyTerm = term * 26/12;
                paymentAmount = (amount * biWeeklyRate) / (1 - Math.pow(1 + biWeeklyRate, -biWeeklyTerm));
                break;
            case 'weekly':
                const weeklyRate = interestRate / 52;
                const weeklyTerm = term * 52/12;
                paymentAmount = (amount * weeklyRate) / (1 - Math.pow(1 + weeklyRate, -weeklyTerm));
                break;
            case 'daily':
                const dailyRate = interestRate / 365;
                const dailyTerm = term * 365/12;
                paymentAmount = (amount * dailyRate) / (1 - Math.pow(1 + dailyRate, -dailyTerm));
                break;
        }
        
        // Calculate carbon credits (simplified example)
        let carbonAmount = 0;
        
        if (amount <= 500) {
            carbonAmount = 0.6;
        } else if (amount <= 1000) {
            carbonAmount = 1.2;
        } else if (amount <= 2000) {
            carbonAmount = 2.0;
        } else if (amount <= 3000) {
            carbonAmount = 2.8;
        } else {
            carbonAmount = 3.5;
        }
        
        // Update UI
        estimatedPayment.textContent = `$${paymentAmount.toFixed(2)} per ${frequency.replace('ly', '')}`;
        estimatedCredits.textContent = `${carbonAmount.toFixed(1)} tons CO₂`;
    }
    
    /**
     * Generate a random application ID
     */
    function generateApplicationId() {
        const applicationId = document.getElementById('application-id');
        if (!applicationId) return;
        
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        applicationId.textContent = `AP${year}${randomNum}`;
    }
    
    /**
     * Get products by category
     * @param {string} category - The product category
     * @returns {Array} - List of products in that category
     */
    function getProductsByCategory(category) {
        // This would typically come from an API or database
        // Using hardcoded data for the prototype
        const allProducts = [
            {
                id: 'solar-home-300w',
                name: 'Solar Home System - 300W',
                category: 'solar',
                price: 850,
                image: 'images/solar-panel.jpg',
                description: 'Complete solar power system with panels, inverter, and battery storage for reliable home electricity'
            },
            {
                id: 'solar-pump',
                name: 'Solar Water Pump',
                category: 'solar',
                price: 750,
                image: 'images/solar-pump.jpg',
                description: 'Efficient irrigation solution powered by solar energy, replacing diesel pumps for farmers'
            },
            {
                id: 'solar-fridge',
                name: 'Solar Refrigerator',
                category: 'solar',
                price: 980,
                image: 'images/solar-fridge.jpg',
                description: 'Energy-efficient refrigeration solution powered by solar energy, ideal for homes and small businesses'
            },
            {
                id: 'electric-motorcycle',
                name: 'Electric Motorcycle',
                category: 'ev',
                price: 1600,
                image: 'images/e-motorcycle.jpg',
                description: 'Eco-friendly motorcycle with 100km range per charge, perfect for ride-sharing and delivery services'
            },
            {
                id: 'e-tuktuk',
                name: 'Electric Tuk-Tuk',
                category: 'ev',
                price: 3200,
                image: 'images/e-tuktuk.jpg',
                description: 'Three-wheeled electric vehicle for passenger transport with lower operating costs than traditional tuk-tuks'
            },
            {
                id: 'clean-stove',
                name: 'Clean Cooking Stove',
                category: 'cooking',
                price: 120,
                image: 'images/cooking-stove.jpg',
                description: 'Energy-efficient cooking stove that reduces smoke, fuel consumption, and indoor air pollution'
            },
            {
                id: 'biogas',
                name: 'Home Biogas System',
                category: 'cooking',
                price: 520,
                image: 'images/biogas.jpg',
                description: 'Convert organic waste into cooking gas and liquid fertilizer, perfect for rural households'
            },
            {
                id: 'drought-seeds',
                name: 'Drought-Resistant Seed Package',
                category: 'agri',
                price: 85,
                image: 'images/seeds.jpg',
                description: 'Climate-resilient seed varieties that can withstand harsh weather conditions and improve crop yields'
            }
        ];
        
        return allProducts.filter(product => product.category === category);
    }
    
    /**
     * Find a product by its ID
     * @param {string} id - The product ID
     * @returns {Object|null} - The product object or null if not found
     */
    function findProductById(id) {
        const allCategories = ['solar', 'ev', 'cooking', 'agri'];
        let allProducts = [];
        
        allCategories.forEach(category => {
            allProducts = allProducts.concat(getProductsByCategory(category));
        });
        
        return allProducts.find(product => product.id === id) || null;
    }
});