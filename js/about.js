// js/about.js - About Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Stat counter animation if stat elements exist
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.innerText.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(target)) {
                let current = 0;
                const increment = Math.ceil(target / 50);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    const prefix = stat.innerText.includes('+') ? '+' : '';
                    const suffix = stat.innerText.includes('%') ? '%' : (stat.innerText.includes('k') ? 'k' : '');
                    stat.innerText = prefix + current + suffix;
                }, 30);
            }
        });
    }
});
