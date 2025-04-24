/**
 * Scarcity Engine - A cookie-based scarcity and social proof system
 * 
 * This engine maintains persistent counters for social proof and scarcity.
 * It uses cookies to store the state and provides methods to update and display the counters.
 */

class ScarcityEngine {
    constructor(options = {}) {
        // Default options
        this.options = {
            cookiePrefix: 'xbesh_',           // Prefix for cookie names
            startingClaimed: 214,            // Initial value for claimed keys
            startingJoined: 37,               // Initial value for today's joiners
            maxClaimed: 250,                 // Maximum number of keys available
            increaseInterval: 12000,          // Interval in ms to potentially increase counters
            increaseProbability: 0.65,        // Probability of increasing counters each interval
            claimedElementId: 'remainingKeys', // Element ID to update with claimed count
            joinedElementId: 'joinCount', // Element ID to update with joiners count
            syncRatio: 0.02,                  // Ratio of claimed to joined (2%)
            ...options
        };

        // Initialize counters
        this.claimed = this.getCookie(`${this.options.cookiePrefix}claimed`) || this.options.startingClaimed;
        this.joined = this.getCookie(`${this.options.cookiePrefix}joined`) || this.options.startingJoined;
        this.lastUpdate = this.getCookie(`${this.options.cookiePrefix}lastUpdate`) || Date.now();
        
        // Apply time-based updates if needed
        this.applyTimeBasedUpdates();
        
        // Timer reference
        this.timer = null;
    }
    
    // Initialize counters based on cookies or starting values
    initialize() {
        // Set cookies if they don't exist
        if (!this.getCookie(`${this.options.cookiePrefix}claimed`)) {
            this.setCookie(`${this.options.cookiePrefix}claimed`, this.claimed, 30);
        }
        
        if (!this.getCookie(`${this.options.cookiePrefix}joined`)) {
            this.setCookie(`${this.options.cookiePrefix}joined`, this.joined, 1);
        }
        
        // Update UI
        this.updateUI();
        
        // Start the engine
        this.start();
        
        return this;
    }
    
    // Apply time-based updates (resets, increases based on time passed)
    applyTimeBasedUpdates() {
        const now = Date.now();
        const lastUpdate = parseInt(this.lastUpdate);
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);
        
        // Reset joined counter if it's a new day
        const lastDate = new Date(lastUpdate);
        const currentDate = new Date();
        if (lastDate.getDate() !== currentDate.getDate() || 
            lastDate.getMonth() !== currentDate.getMonth() || 
            lastDate.getFullYear() !== currentDate.getFullYear()) {
            this.joined = this.options.startingJoined;
            this.setCookie(`${this.options.cookiePrefix}joined`, this.joined, 1);
        }
        
        // Update claimed based on time passed (slight increase over time)
        if (hoursPassed > 1) {
            const newClaims = Math.floor(hoursPassed * 2.5);
            this.claimed = Math.min(this.options.maxClaimed, parseInt(this.claimed) + newClaims);
            this.setCookie(`${this.options.cookiePrefix}claimed`, this.claimed, 30);
        }
        
        // Update last update time
        this.lastUpdate = now;
        this.setCookie(`${this.options.cookiePrefix}lastUpdate`, now, 30);
    }
    
    // Cookie utility functions
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Update UI elements with current counter values
    updateUI() {
        const claimedElement = document.getElementById(this.options.claimedElementId);
        const joinedElement = document.getElementById(this.options.joinedElementId);
        
        if (claimedElement) {
            claimedElement.textContent = this.claimed;
        }
        
        if (joinedElement) {
            joinedElement.textContent = this.joined;
        }
    }
    
    // Increment claimed counter
    incrementClaimed() {
        this.claimed = Math.min(this.options.maxClaimed, parseInt(this.claimed) + 1);
        this.setCookie(`${this.options.cookiePrefix}claimed`, this.claimed, 30);
        this.updateUI();
        
        return this.claimed;
    }
    
    // Increment joined counter
    incrementJoined() {
        this.joined = parseInt(this.joined) + 1;
        this.setCookie(`${this.options.cookiePrefix}joined`, this.joined, 1);
        this.updateUI();
        
        return this.joined;
    }
    
    // Start the engine - periodically update counters
    start() {
        if (this.timer) return;
        
        // Update UI immediately
        this.updateUI();
        
        // Set interval for periodic updates
        this.timer = setInterval(() => {
            if (Math.random() < this.options.increaseProbability) {
                // Only increase if we haven't reached max
                if (this.claimed < this.options.maxClaimed) {
                    // Increment claimed counter
                    this.claimed = Math.min(this.options.maxClaimed, parseInt(this.claimed) + 1);
                    this.setCookie(`${this.options.cookiePrefix}claimed`, this.claimed, 30);
                    
                    // Always increment joined counter simultaneously
                    this.joined = parseInt(this.joined) + 1;
                    this.setCookie(`${this.options.cookiePrefix}joined`, this.joined, 1);
                    
                    // Update UI
                    this.updateUI();
                }
            }
        }, this.options.increaseInterval);
    }
    
    // Stop the engine
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // Reset all cookie values to start fresh
    reset() {
        // Clear existing cookies
        this.setCookie(`${this.options.cookiePrefix}claimed`, "", -1);
        this.setCookie(`${this.options.cookiePrefix}joined`, "", -1);
        this.setCookie(`${this.options.cookiePrefix}lastUpdate`, "", -1);
        
        // Set new values
        this.claimed = this.options.startingClaimed;
        this.joined = this.options.startingJoined;
        this.lastUpdate = Date.now();
        
        // Set cookies with new values
        this.setCookie(`${this.options.cookiePrefix}claimed`, this.claimed, 30);
        this.setCookie(`${this.options.cookiePrefix}joined`, this.joined, 1);
        this.setCookie(`${this.options.cookiePrefix}lastUpdate`, this.lastUpdate, 30);
        
        // Update UI
        this.updateUI();
        
        return this;
    }
}

// Helper function to reset cookies on page load
function resetScarcityCookies() {
    // Delete existing cookies
    document.cookie = "xbesh_claimed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "xbesh_joined=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "xbesh_lastUpdate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Initialize scarcity engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reset cookies to ensure fresh start with correct values
    resetScarcityCookies();
    
    // Create global instance
    window.scarcityEngine = new ScarcityEngine({
        startingClaimed: 214,
        startingJoined: 37,
        maxClaimed: 250,
        syncRatio: 0.02,
        increaseInterval: 15000, // Slightly longer interval for less frequent updates
        increaseProbability: 0.50 // Slightly lower probability for less frequent updates
    }).initialize();
}); 