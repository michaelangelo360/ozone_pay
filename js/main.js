/**
 * OzonePay - Main JavaScript
 * Version: 1.0.0
 * Author: Claude
 * Description: Main JavaScript functionality for the OzonePay green financing platform
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !event.target.closest('.nav-menu') && 
            !event.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabContainer = this.closest('.tab-container');
                const tabId = this.getAttribute('data-tab');
                
                // Active tab button
                tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Active tab content
                const tabContents = tabContainer.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                const activeContent = tabContainer.querySelector(`#tab-${tabId}`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQs first
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }
    
    // File upload display filename
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    if (fileInputs.length > 0) {
        fileInputs.forEach(input => {
            const fileInfo = document.getElementById(`${input.id}-info`);
            
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    fileInfo.textContent = this.files[0].name;
                } else {
                    fileInfo.textContent = 'No file chosen';
                }
            });
        });
    }
    
    // Sidebar links in dashboard
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                const dashboardContent = document.querySelector('.dashboard-content');
                
                if (dashboardContent) {
                    // Hide all tab contents
                    dashboardContent.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // Show the selected tab content
                    const activeTab = document.getElementById(`${tabId}-tab`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                }
                
                // Update URL hash
                window.location.hash = tabId;
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
    }
    
    // Payment option selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                paymentOptions.forEach(o => o.classList.remove('active'));
                
                // Add active class to selected option
                this.classList.add('active');
                
                // You would typically show/hide corresponding payment forms here
                // For simplicity, we're not implementing this in the prototype
            });
        });
    }
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('.logout-link');
    
    if (logoutLinks.length > 0) {
        logoutLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (confirm('Are you sure you want to log out?')) {
                    // In a real app, you would perform logout actions here
                    window.location.href = 'index.html';
                }
            });
        });
    }
    
    // Support for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.sidebar-link):not(.tab)');
    
    if (anchorLinks.length > 0) {
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Smooth scroll to target
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Adjust for navbar height
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Initialize any data attributes
    initializeDataAttributes();
});

/**
 * Initialize data attributes and dynamic content
 */
function initializeDataAttributes() {
    // Apply now button from calculator
    const applyNowBtn = document.getElementById('apply-now-btn');
    if (applyNowBtn) {
        applyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get values from calculator
            const loanAmount = document.getElementById('loan-amount').value;
            const loanTerm = document.getElementById('loan-term').value;
            
            // Redirect to apply page with parameters
            window.location.href = `apply.html?amount=${loanAmount}&term=${loanTerm}`;
        });
    }
    
    // Get started button in hero section
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'apply.html';
        });
    }
    
    // Learn more button in hero section
    const learnMoreBtn = document.getElementById('learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    }
}