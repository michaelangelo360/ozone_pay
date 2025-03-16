/**
 * OzonePay - Dashboard
 * Version: 1.0.0
 * Author: Claude
 * Description: Handles dashboard functionality for OzonePay user accounts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;
    
    // Initialize dashboard charts and data
    initializeCharts();
    
    // Handle dashboard tab navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            sidebarLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Update URL hash
                window.location.hash = tabId;
            }
        });
    });
    
    // Check for hash in URL on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const hashLink = document.querySelector(`.sidebar-link[data-tab="${hash}"]`);
        
        if (hashLink) {
            hashLink.click();
        }
    }
    
    // Handle payment option selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(o => o.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show corresponding payment form
            // In a real app, you would show different payment forms here
        });
    });
    
    // Handle mobile sidebar toggle
    const mobileSidebarToggle = document.querySelector('.mobile-menu-btn');
    
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            
            if (sidebar) {
                sidebar.classList.toggle('mobile-active');
                
                // Adjust dashboard content margin
                const dashboardContent = document.querySelector('.dashboard-content');
                
                if (dashboardContent) {
                    if (sidebar.classList.contains('mobile-active')) {
                        dashboardContent.style.marginLeft = '250px';
                    } else {
                        dashboardContent.style.marginLeft = '0';
                    }
                }
            }
        });
    }
    
    // Initialize carbon calculator
    const carbonCalculatorBtn = document.getElementById('calculate-carbon');
    
    if (carbonCalculatorBtn) {
        carbonCalculatorBtn.addEventListener('click', calculateCarbon);
    }
    
    /**
     * Initialize dashboard charts
     */
    function initializeCharts() {
        // This would typically use a charting library like Chart.js or D3.js
        // For the prototype, we're using simplified visualizations
        
        // Payment progress bar
        const progressBar = document.querySelector('.payment-progress .progress-bar');
        
        if (progressBar) {
            // Set progress based on payments (8/12 = 66.67%)
            progressBar.style.width = '66.67%';
        }
        
        // Carbon tracker circle animation
        const trackerCircle = document.querySelector('.tracker-circle');
        
        if (trackerCircle) {
            // Animated fill effect
            setTimeout(() => {
                trackerCircle.style.borderColor = 'var(--primary-color)';
            }, 500);
        }
    }
    
    /**
     * Calculate carbon credits based on product and usage
     */
    function calculateCarbon() {
        const productSelect = document.getElementById('calculator-product');
        const usageInput = document.getElementById('calculator-usage');
        const carbonReduction = document.getElementById('carbon-reduction');
        const creditValue = document.getElementById('credit-value');
        
        if (!productSelect || !usageInput || !carbonReduction || !creditValue) return;
        
        const product = productSelect.value;
        const usage = parseInt(usageInput.value);
        
        if (!product) {
            alert('Please select a product');
            return;
        }
        
        // Calculate carbon reduction (simplified example values)
        let tons = 0;
        const creditRate = 50; // $50 per ton of CO2
        
        switch (product) {
            case 'solar':
                tons = usage * 0.05;
                break;
            case 'ev':
                tons = usage * 0.08;
                break;
            case 'stove':
                tons = usage * 0.03;
                break;
            case 'pump':
                tons = usage * 0.06;
                break;
        }
        
        // Update UI with results
        carbonReduction.textContent = `${tons.toFixed(1)} tons`;
        creditValue.textContent = `$${(tons * creditRate).toFixed(2)}`;
    }
    
    // Add event listeners for dashboard action buttons
    const actionButtons = document.querySelectorAll('.dashboard-card button, .dashboard-card .btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real app, these would trigger actual actions
            // For the prototype, show a simple feedback message
            alert('This action would be processed in the live application.');
        });
    });
});