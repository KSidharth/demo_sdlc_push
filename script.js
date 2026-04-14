
/**
 * Multiplication Utility - Client-Side Logic
 * Pure vanilla JavaScript implementation with no external dependencies
 */

(function() {
    'use strict';

    // DOM element references - cached for performance
    const elements = {
        numberA: null,
        numberB: null,
        submitBtn: null,
        resultField: null,
        resultValue: null,
        errorMessage: null
    };

    /**
     * Initialize the application when DOM is ready
     */
    function init() {
        // Cache DOM element references
        elements.numberA = document.getElementById('numberA');
        elements.numberB = document.getElementById('numberB');
        elements.submitBtn = document.getElementById('submitBtn');
        elements.resultField = document.getElementById('resultField');
        elements.resultValue = document.getElementById('resultValue');
        elements.errorMessage = document.getElementById('errorMessage');

        // Verify all required elements exist
        if (!validateDOMElements()) {
            console.error('Required DOM elements are missing');
            return;
        }

        // Attach event listeners
        attachEventListeners();

        // Set initial focus for better UX
        elements.numberA.focus();
    }

    /**
     * Validate that all required DOM elements are present
     * @returns {boolean} True if all elements exist, false otherwise
     */
    function validateDOMElements() {
        return Object.values(elements).every(element => element !== null);
    }

    /**
     * Attach all event listeners
     */
    function attachEventListeners() {
        // Primary submit button click handler
        elements.submitBtn.addEventListener('click', handleSubmit);

        // Allow Enter key to trigger submission from input fields
        elements.numberA.addEventListener('keypress', handleKeyPress);
        elements.numberB.addEventListener('keypress', handleKeyPress);

        // Clear error message when user starts typing
        elements.numberA.addEventListener('input', clearError);
        elements.numberB.addEventListener('input', clearError);
    }

    /**
     * Handle Enter key press in input fields
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    }

    /**
     * Main submit handler - validates inputs and performs multiplication
     */
    function handleSubmit() {
        // Clear any previous error messages
        clearError();

        // Read and parse input values
        const valueA = elements.numberA.value.trim();
        const valueB = elements.numberB.value.trim();

        // Validate inputs
        const validation = validateInputs(valueA, valueB);
        if (!validation.isValid) {
            displayError(validation.errorMessage);
            return;
        }

        // Parse to numbers (already validated as numeric)
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);

        // Additional validation for special numeric cases
        if (!isFinite(numA) || !isFinite(numB)) {
            displayError('Please enter valid finite numbers.');
            return;
        }

        // Perform multiplication
        const product = calculateProduct(numA, numB);

        // Display result
        displayResult(product);
    }

    /**
     * Validate input values
     * @param {string} valueA - First input value
     * @param {string} valueB - Second input value
     * @returns {Object} Validation result with isValid flag and errorMessage
     */
    function validateInputs(valueA, valueB) {
        // Check for empty fields
        if (valueA === '' && valueB === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter values in both fields.'
            };
        }

        if (valueA === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter a value in the first field.'
            };
        }

        if (valueB === '') {
            return {
                isValid: false,
                errorMessage: 'Please enter a value in the second field.'
            };
        }

        // Check if values are valid numbers
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);

        if (isNaN(numA) || isNaN(numB)) {
            return {
                isValid: false,
                errorMessage: 'Please enter valid numeric values.'
            };
        }

        return { isValid: true };
    }

    /**
     * Calculate the product of two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The product of a and b
     */
    function calculateProduct(a, b) {
        return a * b;
    }

    /**
     * Display the calculation result
     * @param {number} product - The product to display
     */
    function displayResult(product) {
        // Format the result for display
        const formattedResult = formatNumber(product);

        // Update result value
        elements.resultValue.textContent = formattedResult;

        // Show result field with animation
        elements.resultField.style.display = 'block';

        // Force reflow to trigger CSS animation
        void elements.resultField.offsetWidth;

        // Announce result to screen readers
        announceToScreenReader(`Result calculated: ${formattedResult}`);
    }

    /**
     * Format number for display
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    function formatNumber(num) {
        // Handle special cases
        if (!isFinite(num)) {
            return 'Infinity';
        }

        // For very large or very small numbers, use exponential notation
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }

        // For regular numbers, format with appropriate decimal places
        // Remove trailing zeros and decimal point if not needed
        return num.toString();
    }

    /**
     * Display error message
     * @param {string} message - Error message to display
     */
    function displayError(message) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = 'block';
        
        // Hide result field when showing error
        elements.resultField.style.display = 'none';

        // Announce error to screen readers
        announceToScreenReader(`Error: ${message}`);
    }

    /**
     * Clear error message
     */
    function clearError() {
        elements.errorMessage.style.display = 'none';
        elements.errorMessage.textContent = '';
    }

    /**
     * Announce message to screen readers using ARIA live region
     * @param {string} message - Message to announce
     */
    function announceToScreenReader(message) {
        // Create or get existing live region
        let liveRegion = document.getElementById('aria-live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        // Update content to trigger announcement
        liveRegion.textContent = message;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
