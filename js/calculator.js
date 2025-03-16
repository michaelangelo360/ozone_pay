/**
 * OzonePay - Loan Calculator
 * Version: 1.0.0
 * Author: Claude
 * Description: Green financing calculator functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Calculator elements
    const loanAmountSlider = document.getElementById('loan-amount');
    const loanTermSlider = document.getElementById('loan-term');
    const amountValue = document.getElementById('amount-value');
    const termValue = document.getElementById('term-value');
    const monthlyPayment = document.getElementById('monthly-payment');
    const carbonCredits = document.getElementById('carbon-credits');
    
    // Initialize calculator if elements exist
    if (loanAmountSlider && loanTermSlider) {
        // Update displayed values when sliders change
        loanAmountSlider.addEventListener('input', updateCalculator);
        loanTermSlider.addEventListener('input', updateCalculator);
        
        // Run initial calculation
        updateCalculator();
    }
    
    // Carbon calculator in dashboard
    const carbonCalculatorBtn = document.getElementById('calculate-carbon');
    if (carbonCalculatorBtn) {
        carbonCalculatorBtn.addEventListener('click', calculateCarbonCredits);
    }
    
    const calculatorUsage = document.getElementById('calculator-usage');
    if (calculatorUsage) {
        calculatorUsage.addEventListener('input', function() {
            document.getElementById('usage-value').textContent = `${this.value}h`;
        });
    }
    
    /**
     * Update loan calculator values
     */
    function updateCalculator() {
        // Get current values
        const amount = parseFloat(loanAmountSlider.value);
        const term = parseInt(loanTermSlider.value);
        
        // Update displayed values
        amountValue.textContent = `$${amount}`;
        termValue.textContent = `${term} months`;
        
        // Calculate monthly payment (simple calculation)
        // In a real app, you'd use a more complex formula with interest rates
        const interestRate = 0.10; // 10% annual interest rate
        const monthlyRate = interestRate / 12;
        const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
        
        // Update results
        monthlyPayment.textContent = `$${payment.toFixed(2)}`;
        
        // Calculate estimated carbon credits based on loan amount
        // This is a simplified example calculation
        let estimatedCredits;
        
        if (amount <= 500) {
            estimatedCredits = 0.6;
        } else if (amount <= 1000) {
            estimatedCredits = 1.2;
        } else if (amount <= 2000) {
            estimatedCredits = 2.0;
        } else if (amount <= 3000) {
            estimatedCredits = 2.8;
        } else {
            estimatedCredits = 3.5;
        }
        
        carbonCredits.textContent = `${estimatedCredits.toFixed(1)} tons CO₂ / year`;
    }
    
    /**
     * Calculate carbon credits for dashboard calculator
     */
    function calculateCarbonCredits() {
        const productSelect = document.getElementById('calculator-product');
        const usageSlider = document.getElementById('calculator-usage');
        const carbonReduction = document.getElementById('carbon-reduction');
        const creditValue = document.getElementById('credit-value');
        
        if (!productSelect || !usageSlider || !carbonReduction || !creditValue) {
            return;
        }
        
        const product = productSelect.value;
        const usage = parseInt(usageSlider.value);
        
        if (!product) {
            alert('Please select a product type');
            return;
        }
        
        // Calculate carbon reduction based on product and usage
        // These are example values only
        let annualReduction = 0;
        let creditValuePerTon = 50; // $50 per ton of CO2
        
        switch (product) {
            case 'solar':
                annualReduction = usage * 0.065 * 365 / 1000; // kWh to tons CO2
                break;
            case 'ev':
                annualReduction = usage * 0.12 * 365 / 1000; // km to tons CO2
                break;
            case 'stove':
                annualReduction = usage * 0.04 * 365 / 1000; // cooking hours to tons CO2
                break;
            case 'pump':
                annualReduction = usage * 0.08 * 365 / 1000; // pumping hours to tons CO2
                break;
        }
        
        // Update UI
        carbonReduction.textContent = `${annualReduction.toFixed(1)} tons`;
        creditValue.textContent = `$${(annualReduction * creditValuePerTon).toFixed(2)}`;
    }
});