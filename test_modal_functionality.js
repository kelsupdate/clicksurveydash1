// Test script to verify survey limit modal functionality
// This script can be run in the browser console to test the modal

console.log("Survey Limit Modal Test Script Loaded");

// Function to simulate reaching daily limit
function testSurveyLimitModal() {
    console.log("Testing Survey Limit Modal...");
    
    // Check if we're on the surveys page
    if (window.location.pathname !== '/surveys') {
        console.log("Please navigate to /surveys page first");
        return;
    }
    
    // Test the modal by directly calling the trigger
    const testModal = () => {
        // Find the SurveyLimitModal component
        const modalElement = document.querySelector('[data-testid="survey-limit-modal"]');
        if (modalElement) {
            console.log("Survey Limit Modal found!");
            return true;
        }
        
        // Alternative: Check if modal state is available
        console.log("Modal not visible - checking if trigger works...");
        
        // Simulate clicking a survey button when limit is reached
        const surveyButtons = document.querySelectorAll('button');
        surveyButtons.forEach(button => {
            if (button.textContent.includes('Start Survey') || button.textContent.includes('Limit Reached')) {
                console.log("Found survey button:", button.textContent);
            }
        });
    };
    
    testModal();
}

// Auto-run test
setTimeout(testSurveyLimitModal, 2000);

// Export for manual testing
window.testSurveyLimit = testSurveyLimitModal;
