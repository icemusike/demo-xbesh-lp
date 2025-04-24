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
    
    // Add mouse movement effect to images
    platformImages.forEach(image => {
        image.addEventListener('mousemove', (e) => {
            const rect = image.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage position
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            // Calculate rotation values
            const rotateX = (0.5 - yPercent) * 6; // Max 3 degree rotation
            const rotateY = (xPercent - 0.5) * 6; // Max 3 degree rotation
            
            // Apply transform to the image
            image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Position highlight reflection
            const imgElement = image.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = `scale(1.03)`;
            }
        });
        
        // Reset image on mouse leave
        image.addEventListener('mouseleave', () => {
            image.style.transform = '';
            
            const imgElement = image.querySelector('img');
            if (imgElement) {
                imgElement.style.transform = '';
            }
        });
    });
    
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