/**
 * Collaborative Features Utility
 * Adds real-time editing, comments, and collaboration features to document editors
 */
class CollaborativeFeatures {
    constructor() {
        this.isEnabled = false;
        this.currentUser = null;
        this.activeUsers = new Map();
        this.comments = new Map();
        this.documentId = null;
        this.editor = null;
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.lastSyncTime = null;
        this.pendingChanges = [];
        this.isConnected = false;
        this.collaborationContainer = null;
        this.commentSystem = null;
        this.userPresence = null;
    }

    /**
     * Initialize collaborative features
     */
    init(options = {}) {
        const {
            documentId,
            editor,
            currentUser = { id: this.generateUserId(), name: 'Anonymous User', color: this.generateUserColor() },
            websocketUrl = null, // For demo purposes, we'll simulate WebSocket
            enableComments = true,
            enablePresence = true,
            enableRealTimeSync = true
        } = options;

        this.documentId = documentId;
        this.editor = editor;
        this.currentUser = currentUser;
        this.enableComments = enableComments;
        this.enablePresence = enablePresence;
        this.enableRealTimeSync = enableRealTimeSync;

        try {
            this.createCollaborationInterface();
            
            if (this.enableComments) {
                this.initializeCommentSystem();
            }
            
            if (this.enablePresence) {
                this.initializeUserPresence();
            }
            
            if (this.enableRealTimeSync) {
                this.initializeRealTimeSync(websocketUrl);
            }
            
            this.setupEventListeners();
            this.isEnabled = true;
            
            console.log('Collaborative features initialized for document:', documentId);
            this.showNotification('Collaborative features enabled', 'success');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize collaborative features:', error);
            this.showNotification('Failed to enable collaboration', 'error');
            return false;
        }
    }

    /**
     * Create collaboration interface
     */
    createCollaborationInterface() {
        // Find the editor container
        const editorContainer = this.editor.container || document.getElementById('currentEditor');
        if (!editorContainer) {
            throw new Error('Editor container not found');
        }

        // Create collaboration panel
        this.collaborationContainer = document.createElement('div');
        this.collaborationContainer.className = 'collaboration-panel';
        this.collaborationContainer.innerHTML = `
            <div class="collaboration-header">
                <h3>👥 Collaboration</h3>
                <div class="collaboration-status">
                    <span class="status-indicator offline" id="connectionStatus">Offline</span>
                </div>
            </div>
            
            <div class="collaboration-content">
                <div class="active-users-section">
                    <h4>Active Users</h4>
                    <div class="active-users-list" id="activeUsersList">
                        <div class="user-item current-user">
                            <div class="user-avatar" style="background-color: ${this.currentUser.color}">
                                ${this.currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <span class="user-name">${this.currentUser.name} (You)</span>
                        </div>
                    </div>
                </div>
                
                <div class="comments-section">
                    <h4>Comments</h4>
                    <div class="comments-list" id="commentsList">
                        <p class="no-comments">No comments yet</p>
                    </div>
                    <div class="add-comment">
                        <textarea id="newCommentText" placeholder="Add a comment..." rows="2"></textarea>
                        <button id="addCommentBtn" class="btn-primary">Add Comment</button>
                    </div>
                </div>
                
                <div class="collaboration-actions">
                    <button id="shareDocumentBtn" class="btn-secondary">📤 Share Document</button>
                    <button id="exportWithCommentsBtn" class="btn-secondary">💾 Export with Comments</button>
                    <button id="collaborationSettingsBtn" class="btn-secondary">⚙️ Settings</button>
                </div>
            </div>
        `;

        // Insert collaboration panel
        const parentContainer = editorContainer.parentNode;
        parentContainer.style.display = 'flex';
        parentContainer.appendChild(this.collaborationContainer);
        
        this.addCollaborationStyles();
    }

    /**
     * Add CSS styles for collaboration features
     */
    addCollaborationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .collaboration-panel {
                width: 300px;
                background: rgba(255, 255, 255, 0.1);
                border-left: 1px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .collaboration-header {
                padding: 15px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .collaboration-header h3 {
                margin: 0;
                color: var(--text-color, #333);
                font-size: 16px;
            }
            
            .status-indicator {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .status-indicator.online {
                background: #28a745;
                color: white;
            }
            
            .status-indicator.offline {
                background: #6c757d;
                color: white;
            }
            
            .status-indicator.connecting {
                background: #ffc107;
                color: #212529;
            }
            
            .collaboration-content {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
            }
            
            .collaboration-content h4 {
                margin: 0 0 10px 0;
                color: var(--text-color, #333);
                font-size: 14px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 5px;
            }
            
            .active-users-section {
                margin-bottom: 25px;
            }
            
            .user-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                border-radius: 6px;
                margin-bottom: 5px;
                transition: background-color 0.2s ease;
            }
            
            .user-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .user-item.current-user {
                background: rgba(255, 255, 255, 0.15);
            }
            
            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
            }
            
            .user-name {
                color: var(--text-color, #333);
                font-size: 14px;
            }
            
            .user-cursor {
                position: absolute;
                width: 2px;
                height: 20px;
                z-index: 1000;
                pointer-events: none;
                transition: all 0.1s ease;
            }
            
            .user-cursor::after {
                content: attr(data-user);
                position: absolute;
                top: -25px;
                left: 0;
                background: inherit;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                white-space: nowrap;
                font-weight: bold;
            }
            
            .comments-section {
                margin-bottom: 25px;
            }
            
            .comment-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
                border-left: 3px solid var(--primary-color, #007bff);
            }
            
            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .comment-author {
                font-weight: bold;
                color: var(--text-color, #333);
                font-size: 13px;
            }
            
            .comment-time {
                color: var(--text-color-secondary, #666);
                font-size: 11px;
            }
            
            .comment-text {
                color: var(--text-color, #333);
                font-size: 13px;
                line-height: 1.4;
                margin: 0;
            }
            
            .comment-actions {
                margin-top: 8px;
                display: flex;
                gap: 8px;
            }
            
            .comment-action {
                background: none;
                border: none;
                color: var(--text-color-secondary, #666);
                cursor: pointer;
                font-size: 11px;
                padding: 2px 4px;
                border-radius: 3px;
                transition: background-color 0.2s ease;
            }
            
            .comment-action:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .add-comment {
                margin-top: 15px;
            }
            
            .add-comment textarea {
                width: 100%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                padding: 8px;
                color: var(--text-color, #333);
                font-size: 13px;
                resize: vertical;
                margin-bottom: 8px;
            }
            
            .add-comment textarea:focus {
                outline: none;
                border-color: var(--primary-color, #007bff);
                background: rgba(255, 255, 255, 0.15);
            }
            
            .collaboration-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .collaboration-actions button {
                padding: 8px 12px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .btn-primary {
                background: var(--primary-color, #007bff);
                color: white;
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color, #333);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .btn-primary:hover {
                background: var(--primary-color-dark, #0056b3);
                transform: translateY(-1px);
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .no-comments {
                color: var(--text-color-secondary, #666);
                font-style: italic;
                text-align: center;
                padding: 20px;
                margin: 0;
            }
            
            .collaboration-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 6px;
                color: white;
                font-size: 14px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            
            .collaboration-notification.success {
                background: #28a745;
            }
            
            .collaboration-notification.error {
                background: #dc3545;
            }
            
            .collaboration-notification.info {
                background: #17a2b8;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .collaboration-panel {
                    width: 100%;
                    position: fixed;
                    top: 0;
                    right: -100%;
                    height: 100vh;
                    z-index: 1000;
                    transition: right 0.3s ease;
                }
                
                .collaboration-panel.open {
                    right: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Initialize comment system
     */
    initializeCommentSystem() {
        this.commentSystem = {
            comments: new Map(),
            nextId: 1
        };
        
        // Load existing comments from storage
        this.loadCommentsFromStorage();
        
        // Setup comment event listeners
        document.getElementById('addCommentBtn').addEventListener('click', () => {
            this.addComment();
        });
        
        document.getElementById('newCommentText').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.addComment();
            }
        });
        
        this.updateCommentsDisplay();
    }

    /**
     * Initialize user presence
     */
    initializeUserPresence() {
        this.userPresence = {
            users: new Map(),
            cursors: new Map()
        };
        
        // Add current user
        this.userPresence.users.set(this.currentUser.id, {
            ...this.currentUser,
            lastSeen: new Date(),
            isActive: true
        });
        
        // Simulate other users for demo
        this.simulateOtherUsers();
        
        this.updateActiveUsersDisplay();
    }

    /**
     * Initialize real-time sync (simulated for demo)
     */
    initializeRealTimeSync(websocketUrl) {
        // In a real implementation, this would connect to a WebSocket server
        // For demo purposes, we'll simulate real-time sync
        
        this.updateConnectionStatus('connecting');
        
        setTimeout(() => {
            this.isConnected = true;
            this.updateConnectionStatus('online');
            this.showNotification('Connected to collaboration server', 'success');
            
            // Simulate periodic sync
            this.startPeriodicSync();
        }, 2000);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Share document
        document.getElementById('shareDocumentBtn').addEventListener('click', () => {
            this.shareDocument();
        });
        
        // Export with comments
        document.getElementById('exportWithCommentsBtn').addEventListener('click', () => {
            this.exportWithComments();
        });
        
        // Collaboration settings
        document.getElementById('collaborationSettingsBtn').addEventListener('click', () => {
            this.showCollaborationSettings();
        });
        
        // Listen for editor changes
        if (this.editor && this.editor.editor) {
            this.editor.editor.addEventListener('input', () => {
                this.handleContentChange();
            });
        }
    }

    /**
     * Add a comment
     */
    addComment() {
        const textarea = document.getElementById('newCommentText');
        const text = textarea.value.trim();
        
        if (!text) {
            this.showNotification('Please enter a comment', 'error');
            return;
        }
        
        const comment = {
            id: this.commentSystem.nextId++,
            author: this.currentUser.name,
            authorId: this.currentUser.id,
            text: text,
            timestamp: new Date(),
            documentId: this.documentId,
            position: this.getCurrentCursorPosition()
        };
        
        this.commentSystem.comments.set(comment.id, comment);
        this.comments.set(comment.id, comment);
        
        textarea.value = '';
        this.updateCommentsDisplay();
        this.saveCommentsToStorage();
        
        this.showNotification('Comment added', 'success');
        
        // Simulate broadcasting to other users
        this.broadcastComment(comment);
    }

    /**
     * Update comments display
     */
    updateCommentsDisplay() {
        const commentsList = document.getElementById('commentsList');
        
        if (this.commentSystem.comments.size === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet</p>';
            return;
        }
        
        const commentsArray = Array.from(this.commentSystem.comments.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        commentsList.innerHTML = commentsArray.map(comment => `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                </div>
                <p class="comment-text">${this.escapeHtml(comment.text)}</p>
                <div class="comment-actions">
                    <button class="comment-action" onclick="collaborativeFeatures.replyToComment(${comment.id})">Reply</button>
                    ${comment.authorId === this.currentUser.id ? `<button class="comment-action" onclick="collaborativeFeatures.deleteComment(${comment.id})">Delete</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * Update active users display
     */
    updateActiveUsersDisplay() {
        const usersList = document.getElementById('activeUsersList');
        const currentUserHtml = `
            <div class="user-item current-user">
                <div class="user-avatar" style="background-color: ${this.currentUser.color}">
                    ${this.currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span class="user-name">${this.currentUser.name} (You)</span>
            </div>
        `;
        
        let otherUsersHtml = '';
        if (this.userPresence) {
            this.userPresence.users.forEach((user, id) => {
                if (id !== this.currentUser.id && user.isActive) {
                    otherUsersHtml += `
                        <div class="user-item">
                            <div class="user-avatar" style="background-color: ${user.color}">
                                ${user.name.charAt(0).toUpperCase()}
                            </div>
                            <span class="user-name">${user.name}</span>
                        </div>
                    `;
                }
            });
        }
        
        usersList.innerHTML = currentUserHtml + otherUsersHtml;
    }

    /**
     * Update connection status
     */
    updateConnectionStatus(status) {
        const statusIndicator = document.getElementById('connectionStatus');
        statusIndicator.className = `status-indicator ${status}`;
        statusIndicator.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    /**
     * Share document
     */
    shareDocument() {
        const shareUrl = `${window.location.origin}${window.location.pathname}?doc=${this.documentId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Collaborative Document',
                text: 'Join me in editing this document',
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Share link copied to clipboard', 'success');
            }).catch(() => {
                // Fallback: show share dialog
                prompt('Share this link:', shareUrl);
            });
        }
    }

    /**
     * Export document with comments
     */
    exportWithComments() {
        const document = {
            id: this.documentId,
            content: this.editor.getContent ? this.editor.getContent() : this.editor.editor.value,
            comments: Array.from(this.commentSystem.comments.values()),
            collaborators: Array.from(this.userPresence.users.values()),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-with-comments-${this.documentId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Document exported with comments', 'success');
    }

    /**
     * Show collaboration settings
     */
    showCollaborationSettings() {
        const settings = {
            enableComments: this.enableComments,
            enablePresence: this.enablePresence,
            enableRealTimeSync: this.enableRealTimeSync,
            userName: this.currentUser.name,
            userColor: this.currentUser.color
        };
        
        const settingsJson = JSON.stringify(settings, null, 2);
        const newSettings = prompt('Collaboration Settings (JSON):', settingsJson);
        
        if (newSettings) {
            try {
                const parsed = JSON.parse(newSettings);
                this.applySettings(parsed);
                this.showNotification('Settings updated', 'success');
            } catch (error) {
                this.showNotification('Invalid settings format', 'error');
            }
        }
    }

    /**
     * Apply settings
     */
    applySettings(settings) {
        if (settings.userName) {
            this.currentUser.name = settings.userName;
        }
        if (settings.userColor) {
            this.currentUser.color = settings.userColor;
        }
        
        this.updateActiveUsersDisplay();
    }

    /**
     * Simulate other users for demo
     */
    simulateOtherUsers() {
        const demoUsers = [
            { id: 'user_2', name: 'Alice Johnson', color: '#e74c3c' },
            { id: 'user_3', name: 'Bob Smith', color: '#2ecc71' },
            { id: 'user_4', name: 'Carol Davis', color: '#f39c12' }
        ];
        
        // Randomly add some demo users
        demoUsers.forEach((user, index) => {
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    this.userPresence.users.set(user.id, {
                        ...user,
                        lastSeen: new Date(),
                        isActive: true
                    });
                    this.updateActiveUsersDisplay();
                    this.showNotification(`${user.name} joined the document`, 'info');
                }, (index + 1) * 3000);
            }
        });
    }

    /**
     * Start periodic sync
     */
    startPeriodicSync() {
        setInterval(() => {
            if (this.isConnected) {
                this.syncChanges();
            }
        }, 5000);
    }

    /**
     * Sync changes
     */
    syncChanges() {
        // Simulate syncing changes
        this.lastSyncTime = new Date();
        
        // Randomly simulate receiving changes from other users
        if (Math.random() > 0.8) {
            this.simulateRemoteChange();
        }
    }

    /**
     * Simulate remote change
     */
    simulateRemoteChange() {
        const activeUsers = Array.from(this.userPresence.users.values())
            .filter(user => user.id !== this.currentUser.id && user.isActive);
        
        if (activeUsers.length > 0) {
            const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
            
            // Simulate a comment from another user
            if (Math.random() > 0.7) {
                const comment = {
                    id: this.commentSystem.nextId++,
                    author: randomUser.name,
                    authorId: randomUser.id,
                    text: this.getRandomComment(),
                    timestamp: new Date(),
                    documentId: this.documentId,
                    position: Math.floor(Math.random() * 100)
                };
                
                this.commentSystem.comments.set(comment.id, comment);
                this.updateCommentsDisplay();
                this.showNotification(`New comment from ${randomUser.name}`, 'info');
            }
        }
    }

    /**
     * Get random comment for simulation
     */
    getRandomComment() {
        const comments = [
            'Great work on this section!',
            'Could we expand on this point?',
            'I think this needs clarification.',
            'Excellent idea!',
            'What do you think about this approach?',
            'This looks good to me.',
            'Should we add more details here?',
            'Nice formatting!'
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    /**
     * Handle content change
     */
    handleContentChange() {
        if (this.isConnected) {
            // In a real implementation, this would send changes to the server
            this.pendingChanges.push({
                timestamp: new Date(),
                userId: this.currentUser.id,
                type: 'content_change'
            });
        }
    }

    /**
     * Get current cursor position
     */
    getCurrentCursorPosition() {
        if (this.editor && this.editor.editor) {
            return this.editor.editor.selectionStart || 0;
        }
        return 0;
    }

    /**
     * Broadcast comment to other users
     */
    broadcastComment(comment) {
        // In a real implementation, this would send the comment to the server
        console.log('Broadcasting comment:', comment);
    }

    /**
     * Reply to comment
     */
    replyToComment(commentId) {
        const comment = this.commentSystem.comments.get(commentId);
        if (comment) {
            const textarea = document.getElementById('newCommentText');
            textarea.value = `@${comment.author} `;
            textarea.focus();
        }
    }

    /**
     * Delete comment
     */
    deleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment?')) {
            this.commentSystem.comments.delete(commentId);
            this.comments.delete(commentId);
            this.updateCommentsDisplay();
            this.saveCommentsToStorage();
            this.showNotification('Comment deleted', 'success');
        }
    }

    /**
     * Save comments to storage
     */
    saveCommentsToStorage() {
        try {
            const commentsData = {
                documentId: this.documentId,
                comments: Array.from(this.commentSystem.comments.entries())
            };
            localStorage.setItem(`comments_${this.documentId}`, JSON.stringify(commentsData));
        } catch (error) {
            console.error('Error saving comments:', error);
        }
    }

    /**
     * Load comments from storage
     */
    loadCommentsFromStorage() {
        try {
            const data = localStorage.getItem(`comments_${this.documentId}`);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.comments) {
                    this.commentSystem.comments = new Map(parsed.comments);
                    this.commentSystem.nextId = Math.max(...Array.from(this.commentSystem.comments.keys())) + 1;
                }
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    /**
     * Generate user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate user color
     */
    generateUserColor() {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Format time
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) {
            return 'Just now';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `collaboration-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Destroy collaborative features
     */
    destroy() {
        if (this.websocket) {
            this.websocket.close();
        }
        
        if (this.collaborationContainer) {
            this.collaborationContainer.remove();
        }
        
        this.isEnabled = false;
        this.isConnected = false;
        this.activeUsers.clear();
        this.comments.clear();
        
        console.log('Collaborative features destroyed');
    }
}

// Global instance for easy access
let collaborativeFeatures = null;

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollaborativeFeatures;
} else if (typeof window !== 'undefined') {
    window.CollaborativeFeatures = CollaborativeFeatures;
}