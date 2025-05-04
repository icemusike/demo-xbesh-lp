document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            answer.style.display = isOpen ? 'none' : 'block';
            toggle.textContent = isOpen ? '+' : '-';
        });
    });

    // Platform Image Interactions
    const platformImages = document.querySelectorAll('.platform-image');
    
    // Check if device supports hover
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (hasHover) {
    platformImages.forEach(image => {
        // Removing the mousemove event that causes 3D rotation and zoom effects
        image.addEventListener('mousemove', (e) => {
            // Disabled transform to prevent zoom issues
            image.style.transform = '';
            
            const imgElement = image.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = '';
            }
        });
        
        image.addEventListener('mouseleave', () => {
            image.style.transform = '';
            
            const imgElement = image.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = '';
            }
        });
    });
    }
    
    // Enhance stat items with staggered animation
    const platformCards = document.querySelectorAll('.platform-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item');
                statItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, 100 * index);
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    // Observe platform cards for scroll animations
    platformCards.forEach(card => {
        observer.observe(card);
    });
}); 