// Navbar functionality
class Navbar {
    constructor() {
        this.isLoggedIn = true; // Default to logged in for demo
        this.currentUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: null
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUserInterface();
        this.setupDropdownBehavior();
    }
    
    setupEventListeners() {
        // Login button click
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }
        
        // Logout link click
        const logoutLink = document.querySelector('.dropdown-item[href="#"]:last-child');
        if (logoutLink && logoutLink.textContent.trim().includes('Logout')) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Profile link click
        const profileLink = document.querySelector('.dropdown-item[href="#"]:first-child');
        if (profileLink && profileLink.textContent.trim().includes('Profile')) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfileModal();
            });
        }
        
        // Settings link click
        const settingsLink = document.querySelector('.dropdown-item[href="#"]:nth-child(2)');
        if (settingsLink && settingsLink.textContent.trim().includes('Settings')) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSettingsModal();
            });
        }
        
        // Notification button click
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }
        
        // Navigation link clicks
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });
    }
    
    setupDropdownBehavior() {
        const dropdown = document.querySelector('.user-profile-dropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (dropdown && dropdownMenu) {
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
            
            // Toggle dropdown on click
            const profileBtn = dropdown.querySelector('.user-profile-btn');
            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = dropdownMenu.style.visibility === 'visible';
                    
                    if (isVisible) {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(-10px)';
                    } else {
                        dropdownMenu.style.opacity = '1';
                        dropdownMenu.style.visibility = 'visible';
                        dropdownMenu.style.transform = 'translateY(0)';
                    }
                });
            }
        }
    }
    
    updateUserInterface() {
        const userProfileDropdown = document.querySelector('.user-profile-dropdown');
        const loginBtn = document.querySelector('.login-btn');
        
        if (this.isLoggedIn) {
            if (userProfileDropdown) userProfileDropdown.style.display = 'block';
            if (loginBtn) loginBtn.style.display = 'none';
            this.updateUserInfo();
        } else {
            if (userProfileDropdown) userProfileDropdown.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'flex';
        }
    }
    
    updateUserInfo() {
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = this.currentUser.name;
        }
    }
    
    handleLogin() {
        // Simulate login process
        this.showLoginModal();
    }
    
    handleLogout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.updateUserInterface();
        this.showNotification('Successfully logged out', 'success');
    }
    
    handleNavigation(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Handle navigation based on link text
        const linkText = link.textContent.trim();
        
        switch (linkText) {
            case 'Dashboard':
                // Already on dashboard
                break;
            case 'Tools':
                this.showToolsSection();
                break;
            case 'About':
                this.showAboutModal();
                break;
            case 'Help':
                this.showHelpModal();
                break;
        }
    }
    
    showLoginModal() {
        const modal = this.createModal('Login', `
            <form class="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="this.closest('.navbar-modal').remove()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('.login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performLogin();
            modal.remove();
        });
    }
    
    showProfileModal() {
        this.createModal('User Profile', `
            <div class="profile-info">
                <div class="profile-avatar">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%236366f1'/%3E%3Cpath d='M40 40a12 12 0 1 0 0-24 12 12 0 0 0 0 24zm0 4c-13.33 0-20 6.67-20 20v4h40v-4c0-13.33-6.67-20-20-20z' fill='white'/%3E%3C/svg%3E" alt="Profile">
                </div>
                <h3>${this.currentUser.name}</h3>
                <p>${this.currentUser.email}</p>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-value">24</span>
                        <span class="stat-label">Tools Used</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">156</span>
                        <span class="stat-label">Tasks Completed</span>
                    </div>
                </div>
            </div>
        `);
    }
    
    showSettingsModal() {
        this.createModal('Settings', `
            <div class="settings-content">
                <div class="setting-group">
                    <h4>Appearance</h4>
                    <label class="setting-item">
                        <span>Dark Mode</span>
                        <input type="checkbox" class="toggle">
                    </label>
                </div>
                <div class="setting-group">
                    <h4>Notifications</h4>
                    <label class="setting-item">
                        <span>Email Notifications</span>
                        <input type="checkbox" class="toggle" checked>
                    </label>
                    <label class="setting-item">
                        <span>Push Notifications</span>
                        <input type="checkbox" class="toggle">
                    </label>
                </div>
            </div>
        `);
    }
    
    showAboutModal() {
        this.createModal('About UtilityHub', `
            <div class="about-content">
                <p>UtilityHub is a comprehensive collection of web-based tools designed to enhance your productivity and streamline your workflow.</p>
                <h4>Features:</h4>
                <ul>
                    <li>🔧 30+ Professional Tools</li>
                    <li>🎨 Modern, Responsive Design</li>
                    <li>⚡ Fast & Lightweight</li>
                    <li>🔒 Privacy-Focused</li>
                    <li>📱 Mobile-Friendly</li>
                </ul>
                <p><strong>Version:</strong> 2.0.0</p>
            </div>
        `);
    }
    
    showHelpModal() {
        this.createModal('Help & Support', `
            <div class="help-content">
                <h4>Getting Started</h4>
                <p>Browse through our collection of tools by clicking on any category card. Each tool is designed to be intuitive and easy to use.</p>
                
                <h4>Keyboard Shortcuts</h4>
                <ul>
                    <li><kbd>Ctrl + /</kbd> - Open help</li>
                    <li><kbd>Esc</kbd> - Close modals</li>
                    <li><kbd>Ctrl + K</kbd> - Quick search</li>
                </ul>
                
                <h4>Need More Help?</h4>
                <p>Contact us at <a href="mailto:support@utilityhub.com">support@utilityhub.com</a></p>
            </div>
        `);
    }
    
    showNotifications() {
        const notifications = [
            { id: 1, title: 'New Tool Available', message: 'QR Code Generator has been updated with new features', time: '2 min ago', type: 'info' },
            { id: 2, title: 'Maintenance Complete', message: 'All systems are now running smoothly', time: '1 hour ago', type: 'success' },
            { id: 3, title: 'Welcome!', message: 'Thanks for using UtilityHub', time: '2 hours ago', type: 'welcome' }
        ];
        
        const notificationHtml = notifications.map(notif => `
            <div class="notification-item ${notif.type}">
                <div class="notification-content">
                    <h5>${notif.title}</h5>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
            </div>
        `).join('');
        
        this.createModal('Notifications', `
            <div class="notifications-list">
                ${notificationHtml}
            </div>
        `);
    }
    
    performLogin() {
        this.isLoggedIn = true;
        this.currentUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: null
        };
        this.updateUserInterface();
        this.showNotification('Successfully logged in!', 'success');
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'navbar-modal';
        modal.innerHTML = `
            <div class="navbar-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="navbar-modal-content">
                <div class="navbar-modal-header">
                    <h3>${title}</h3>
                    <button class="navbar-modal-close" onclick="this.closest('.navbar-modal').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="navbar-modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        return modal;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
    
    showToolsSection() {
        // Scroll to tools section or show tools view
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (categoriesGrid) {
            categoriesGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});

// Add modal and toast styles
const additionalStyles = `
/* Navbar Modal Styles */
.navbar-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease;
}

.navbar-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.navbar-modal-content {
    position: relative;
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    animation: modalSlideIn 0.3s ease;
}

.navbar-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
}

.navbar-modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
}

.navbar-modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    color: #64748b;
    transition: all 0.2s;
}

.navbar-modal-close:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.navbar-modal-body {
    padding: 24px;
    overflow-y: auto;
    max-height: calc(80vh - 100px);
}

/* Toast Styles */
.toast {
    position: fixed;
    top: 90px;
    right: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #3b82f6;
    z-index: 10000;
    animation: toastSlideIn 0.3s ease;
}

.toast-success {
    border-left-color: #10b981;
}

.toast-error {
    border-left-color: #ef4444;
}

.toast-warning {
    border-left-color: #f59e0b;
}

.toast-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    gap: 12px;
}

.toast-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 4px;
    border-radius: 4px;
}

.toast-close:hover {
    background: #f1f5f9;
}

/* Form Styles */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

/* Profile Styles */
.profile-info {
    text-align: center;
}

.profile-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 16px;
}

.profile-stats {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-top: 24px;
}

.stat {
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #3b82f6;
}

.stat-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Settings Styles */
.setting-group {
    margin-bottom: 24px;
}

.setting-group h4 {
    margin-bottom: 12px;
    color: #374151;
    font-size: 16px;
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
}

.toggle {
    width: 44px;
    height: 24px;
    background: #d1d5db;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
}

.toggle:checked {
    background: #3b82f6;
}

/* Notification Styles */
.notifications-list {
    max-height: 400px;
    overflow-y: auto;
}

.notification-item {
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    border-left: 4px solid #3b82f6;
}

.notification-item.success {
    border-left-color: #10b981;
}

.notification-item.welcome {
    border-left-color: #8b5cf6;
}

.notification-item h5 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
}

.notification-item p {
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #64748b;
}

.notification-time {
    font-size: 12px;
    color: #9ca3af;
}

/* Animations */
@keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalSlideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes toastSlideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);