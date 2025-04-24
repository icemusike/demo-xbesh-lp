/**
 * Notification Engine for Golden Key Landing Page
 * Creates real-time notifications showing recent key activations
 */

class NotificationEngine {
    constructor(options = {}) {
        this.container = null;
        this.maxNotifications = options.maxNotifications || 3;
        this.duration = options.duration || 5000;
        this.notifications = [];
        this.playSounds = options.playSounds || false;
        this.notificationQueue = [];
        this.lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
        this.notificationSound = null;
        
        this.init();
    }
    
    init() {
        // Create container for notifications
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
        
        // Add styles
        this.addStyles();
        
        // Initialize sound if enabled
        if (this.playSounds) {
            this.notificationSound = new Audio('notification-sound.mp3');
            this.notificationSound.volume = 0.5;
        }
    }
    
    addStyles() {
        // Add CSS if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .notification {
                    padding: 12px 16px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    color: #333;
                    font-size: 14px;
                    max-width: 320px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(100%);
                    opacity: 0;
                    animation: slide-in 0.3s forwards;
                }
                
                .notification.leaving {
                    animation: slide-out 0.3s forwards;
                }
                
                .notification-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .notification-success .notification-icon {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27AE60;
                }
                
                .notification-error .notification-icon {
                    background: rgba(235, 87, 87, 0.1);
                    color: #EB5757;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .notification-message {
                    color: #666;
                    line-height: 1.4;
                }
                
                .notification-close {
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                }
                
                .notification-close:hover {
                    opacity: 0.8;
                }
                
                @keyframes slide-in {
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slide-out {
                    100% {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createNotification(type, title, message, duration = this.duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            <div class="notification-icon">
                ${type === 'success' ? '✓' : '✗'}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close">×</div>
        `;
        
        // Add event listener to close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        return notification;
    }
    
    show(options) {
        const { type = 'success', title, message, duration = this.duration } = options;
        
        // If we're at max capacity, queue the notification
        if (this.notifications.length >= this.maxNotifications) {
            this.notificationQueue.push(options);
            return;
        }
        
        // Create notification
        const notification = this.createNotification(type, title, message, duration);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Play sound if enabled
        if (this.playSounds && this.notificationSound) {
            this.notificationSound.play().catch(() => {
                // Handle autoplay restrictions
                console.log('Could not play notification sound due to browser restrictions');
            });
        }
        
        // Remove after duration
        setTimeout(() => {
            if (this.container.contains(notification)) {
                this.removeNotification(notification);
            }
        }, duration);
    }
    
    removeNotification(notification) {
        notification.classList.add('leaving');
        
        // Wait for animation to finish
        setTimeout(() => {
            if (this.container.contains(notification)) {
                this.container.removeChild(notification);
                this.notifications = this.notifications.filter(n => n !== notification);
                
                // Show next notification from queue if available
                if (this.notificationQueue.length > 0) {
                    const next = this.notificationQueue.shift();
                    this.show(next);
                }
            }
        }, 300);
    }
    
    generateRandomEmail() {
        const names = ['john', 'jane', 'dave', 'sarah', 'mike', 'lisa', 'mark', 'amy', 'tom', 'emily'];
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
        
        const name = names[Math.floor(Math.random() * names.length)];
        const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)].toLowerCase();
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const randomNum = Math.floor(Math.random() * 100);
        
        return `${name}.${lastName}${randomNum}@${domain}`;
    }
    
    showKeyAttempt(email, isSuccess = Math.random() > 0.3) {
        if (!email) {
            email = this.generateRandomEmail();
        }
        
        // Show notification based on success/failure
        if (isSuccess) {
            this.show({
                type: 'success',
                title: 'Key Activated',
                message: `${this.formatEmail(email)} has successfully activated a Golden Key!`
            });
        } else {
            this.show({
                type: 'error',
                title: 'Invalid Key',
                message: `${this.formatEmail(email)} attempted to use an invalid key.`
            });
        }
    }
    
    formatEmail(email) {
        // Obfuscate part of the email for privacy
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        
        const username = parts[0];
        const domain = parts[1];
        
        // Keep first 3 chars and last char, replace rest with *
        const firstPart = username.substring(0, 3);
        const lastPart = username.substring(username.length - 1);
        const stars = '*'.repeat(Math.max(1, Math.min(3, username.length - 4)));
        
        return `${firstPart}${stars}${lastPart}@${domain}`;
    }
    
    startRandomNotifications(interval = 60000) {
        // Show a random notification every interval milliseconds
        setInterval(() => {
            // 70% chance of showing a notification each interval
            if (Math.random() < 0.7) {
                const email = this.generateRandomEmail();
                const isSuccess = Math.random() > 0.3; // 70% success rate
                this.showKeyAttempt(email, isSuccess);
            }
        }, interval);
    }
}

// Auto-initialize if page is already loaded
if (document.readyState === 'complete') {
    window.notificationEngine = new NotificationEngine({
        maxNotifications: 3,
        duration: 5000,
        playSounds: true
    });
} 