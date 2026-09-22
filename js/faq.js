// js/faq.js - FAQ Page Specific Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Accordion expand / collapse logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            
            // Close other active accordions
            document.querySelectorAll('.faq-item').forEach(faq => {
                if (faq !== parent) {
                    faq.classList.remove('active');
                }
            });
            
            // Toggle clicked item
            parent.classList.toggle('active');
        });
    });
});
