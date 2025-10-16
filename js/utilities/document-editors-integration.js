/**
 * Document Editors Integration
 * Integrates all document editors with the document manager
 */

// Import all editor utilities
// Note: In a real application, you would use proper module imports
// For this demo, we assume all scripts are loaded in the correct order

class DocumentEditorsIntegration {
    constructor() {
        this.documentManager = null;
        this.isInitialized = false;
        this.editorInstances = new Map();
    }

    /**
     * Initialize the document editors integration
     */
    init(containerId) {
        try {
            // Set container reference
            this.container = document.getElementById(containerId);
            if (!this.container) {
                throw new Error(`Container element with ID '${containerId}' not found`);
            }

            // Initialize document manager
            this.documentManager = new DocumentManagerUtility();
            this.documentManager.init(containerId);

            // Register all available editors
            this.registerEditors();

            // Setup integration event listeners
            this.setupIntegrationEvents();

            // Initialize collaborative features
            this.initializeCollaborativeFeatures();

            this.isInitialized = true;
            console.log('Document Editors Integration initialized successfully');
            
            // Make instance globally available for onclick handlers
            window.documentEditorsIntegration = this;
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Document Editors Integration:', error);
            return false;
        }
    }

    /**
     * Register all available editors with the document manager
     */
    registerEditors() {
        // Register Plain Text Editor
        if (typeof PlainTextEditorUtility !== 'undefined') {
            this.documentManager.registerEditor('text', PlainTextEditorUtility);
            console.log('Registered Plain Text Editor');
        } else {
            console.warn('PlainTextEditorUtility not found');
        }

        // Register Rich Text Editor
        if (typeof RichTextEditorUtility !== 'undefined') {
            this.documentManager.registerEditor('rich', RichTextEditorUtility);
            console.log('Registered Rich Text Editor');
        } else {
            console.warn('RichTextEditorUtility not found');
        }

        // Register Markdown Editor
        if (typeof MarkdownEditorUtility !== 'undefined') {
            this.documentManager.registerEditor('markdown', MarkdownEditorUtility);
            console.log('Registered Markdown Editor');
        } else {
            console.warn('MarkdownEditorUtility not found');
        }
    }

    /**
     * Setup integration-specific event listeners
     */
    setupIntegrationEvents() {
        // Listen for document save events
        document.addEventListener('documentSaved', (event) => {
            this.handleDocumentSaved(event.detail);
        });

        // Listen for editor switch events
        document.addEventListener('editorSwitch', (event) => {
            this.handleEditorSwitch(event.detail);
        });

        // Listen for template creation events
        document.addEventListener('templateCreated', (event) => {
            this.handleTemplateCreated(event.detail);
        });
    }

    /**
     * Handle document saved event
     */
    handleDocumentSaved(documentData) {
        console.log('Document saved:', documentData.title);
        
        // Update document in manager
        if (this.documentManager && documentData.id) {
            const document = this.documentManager.documents.get(documentData.id);
            if (document) {
                document.content = documentData.content;
                document.modifiedAt = new Date();
                document.version += 1;
                
                this.documentManager.saveToStorage();
                this.documentManager.showNotification('Document saved successfully');
            }
        }
    }

    /**
     * Handle editor switch event
     */
    handleEditorSwitch(switchData) {
        console.log('Editor switch requested:', switchData);
        
        if (this.documentManager && switchData.documentId && switchData.newEditorType) {
            // Save current content before switching
            if (this.documentManager.currentEditor) {
                const currentContent = this.getCurrentEditorContent();
                if (currentContent !== null) {
                    const document = this.documentManager.documents.get(switchData.documentId);
                    if (document) {
                        document.content = currentContent;
                        document.type = switchData.newEditorType;
                        this.documentManager.saveToStorage();
                    }
                }
            }
            
            // Reopen document with new editor type
            this.documentManager.openDocument(switchData.documentId);
        }
    }

    /**
     * Handle template created event
     */
    handleTemplateCreated(templateData) {
        console.log('Template created:', templateData.name);
        
        if (this.documentManager) {
            const template = {
                id: this.documentManager.generateId(),
                name: templateData.name,
                type: templateData.type,
                content: templateData.content,
                description: templateData.description || '',
                createdAt: new Date()
            };
            
            this.documentManager.templates.set(template.id, template);
            this.documentManager.saveToStorage();
            this.documentManager.showNotification('Template created successfully');
        }
    }

    /**
     * Get current editor content
     */
    getCurrentEditorContent() {
        if (!this.documentManager || !this.documentManager.currentEditor) {
            return null;
        }

        const editor = this.documentManager.currentEditor;
        
        // Try different methods to get content based on editor type
        if (editor.getContent) {
            return editor.getContent();
        } else if (editor.editor && editor.editor.value !== undefined) {
            return editor.editor.value;
        } else if (editor.editor && editor.editor.innerHTML !== undefined) {
            return editor.editor.innerHTML;
        } else if (editor.container) {
            const textarea = editor.container.querySelector('textarea');
            const contentDiv = editor.container.querySelector('[contenteditable]');
            
            if (textarea) {
                return textarea.value;
            } else if (contentDiv) {
                return contentDiv.innerHTML;
            }
        }
        
        return null;
    }

    /**
     * Create a new document with specific type
     */
    createDocument(type, title, content = '') {
        if (!this.documentManager) {
            console.error('Document manager not initialized');
            return null;
        }

        const document = this.documentManager.createDocument({
            title: title || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Document`,
            type,
            content,
            description: `Created with ${type} editor`
        });

        return document;
    }

    /**
     * Open document by ID
     */
    openDocument(documentId) {
        if (!this.documentManager) {
            console.error('Document manager not initialized');
            return false;
        }

        this.documentManager.openDocument(documentId);
        return true;
    }

    /**
     * Get all documents
     */
    getAllDocuments() {
        if (!this.documentManager) {
            return [];
        }

        return Array.from(this.documentManager.documents.values());
    }

    /**
     * Get all templates
     */
    getAllTemplates() {
        if (!this.documentManager) {
            return [];
        }

        return Array.from(this.documentManager.templates.values());
    }

    /**
     * Export document in various formats
     */
    exportDocument(documentId, format = 'json') {
        if (!this.documentManager) {
            console.error('Document manager not initialized');
            return null;
        }

        const document = this.documentManager.documents.get(documentId);
        if (!document) {
            console.error('Document not found:', documentId);
            return null;
        }

        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(document, null, 2);
            
            case 'html':
                return this.convertToHTML(document);
            
            case 'markdown':
                return this.convertToMarkdown(document);
            
            case 'txt':
                return this.convertToPlainText(document);
            
            default:
                console.warn('Unsupported export format:', format);
                return document.content;
        }
    }

    /**
     * Convert document to HTML
     */
    convertToHTML(document) {
        let content = document.content;
        
        if (document.type === 'markdown') {
            // Basic markdown to HTML conversion
            content = content
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        } else if (document.type === 'text') {
            content = content.replace(/\n/g, '<br>');
        }
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>${document.title}</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>${document.title}</h1>
    <div>${content}</div>
</body>
</html>`;
    }

    /**
     * Convert document to Markdown
     */
    convertToMarkdown(document) {
        if (document.type === 'markdown') {
            return document.content;
        }
        
        let content = document.content;
        
        if (document.type === 'rich') {
            // Basic HTML to markdown conversion
            content = content
                .replace(/<h1>(.*?)<\/h1>/g, '# $1')
                .replace(/<h2>(.*?)<\/h2>/g, '## $1')
                .replace(/<h3>(.*?)<\/h3>/g, '### $1')
                .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                .replace(/<em>(.*?)<\/em>/g, '*$1*')
                .replace(/<br>/g, '\n')
                .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
        }
        
        return `# ${document.title}\n\n${content}`;
    }

    /**
     * Convert document to plain text
     */
    convertToPlainText(document) {
        let content = document.content;
        
        if (document.type === 'rich') {
            // Remove HTML tags
            content = content.replace(/<[^>]*>/g, '');
        } else if (document.type === 'markdown') {
            // Remove markdown formatting
            content = content
                .replace(/^#+\s/gm, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        }
        
        return `${document.title}\n${'='.repeat(document.title.length)}\n\n${content}`;
    }

    /**
     * Search documents
     */
    searchDocuments(query, options = {}) {
        if (!this.documentManager) {
            return [];
        }

        const {
            searchInContent = true,
            searchInTitle = true,
            searchInDescription = true,
            caseSensitive = false,
            exactMatch = false
        } = options;

        const searchTerm = caseSensitive ? query : query.toLowerCase();
        const results = [];

        this.documentManager.documents.forEach((document, id) => {
            let matches = false;
            const matchDetails = {
                titleMatch: false,
                contentMatch: false,
                descriptionMatch: false
            };

            // Prepare text for searching
            const prepareText = (text) => {
                return caseSensitive ? text : text.toLowerCase();
            };

            // Search in title
            if (searchInTitle && document.title) {
                const titleText = prepareText(document.title);
                if (exactMatch ? titleText === searchTerm : titleText.includes(searchTerm)) {
                    matches = true;
                    matchDetails.titleMatch = true;
                }
            }

            // Search in content
            if (searchInContent && document.content) {
                const contentText = prepareText(document.content);
                if (exactMatch ? contentText === searchTerm : contentText.includes(searchTerm)) {
                    matches = true;
                    matchDetails.contentMatch = true;
                }
            }

            // Search in description
            if (searchInDescription && document.description) {
                const descriptionText = prepareText(document.description);
                if (exactMatch ? descriptionText === searchTerm : descriptionText.includes(searchTerm)) {
                    matches = true;
                    matchDetails.descriptionMatch = true;
                }
            }

            if (matches) {
                results.push({
                    document,
                    matchDetails
                });
            }
        });

        return results;
    }

    /**
     * Get document statistics
     */
    getStatistics() {
        if (!this.documentManager) {
            return null;
        }

        const stats = {
            totalDocuments: this.documentManager.documents.size,
            totalTemplates: this.documentManager.templates.size,
            documentsByType: {},
            totalWords: 0,
            totalCharacters: 0,
            recentDocuments: this.documentManager.recentDocuments.length
        };

        // Count documents by type and calculate word/character counts
        this.documentManager.documents.forEach(document => {
            // Count by type
            if (!stats.documentsByType[document.type]) {
                stats.documentsByType[document.type] = 0;
            }
            stats.documentsByType[document.type]++;

            // Count words and characters
            if (document.content) {
                const plainText = document.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
                stats.totalCharacters += plainText.length;
                stats.totalWords += plainText.split(/\s+/).filter(word => word.length > 0).length;
            }
        });

        return stats;
    }

    /**
     * Initialize collaborative features
     */
    initializeCollaborativeFeatures() {
        // Check if CollaborativeFeatures is available
        if (typeof CollaborativeFeatures !== 'undefined') {
            this.collaborativeFeatures = new CollaborativeFeatures();
            
            // Add collaboration toggle button
            this.addCollaborationToggle();
            
            console.log('Collaborative features available');
        } else {
            console.log('Collaborative features not available - CollaborativeFeatures class not found');
        }
    }

    /**
     * Add collaboration toggle button
     */
    addCollaborationToggle() {
        if (!this.container) {
            console.warn('Container not available for collaboration toggle');
            return;
        }
        
        // Look for the manager actions area in the document manager header
        const managerActions = this.container.querySelector('.manager-actions');
        if (managerActions) {
            const collaborationBtn = document.createElement('button');
            collaborationBtn.className = 'btn-secondary collaboration-btn';
            collaborationBtn.innerHTML = '👥 Collaborate';
            collaborationBtn.title = 'Enable collaborative features';
            
            collaborationBtn.addEventListener('click', () => {
                this.toggleCollaboration();
            });
            
            managerActions.appendChild(collaborationBtn);
        } else {
            console.warn('Manager actions area not found for collaboration toggle');
        }
    }

    /**
     * Toggle collaboration features
     */
    toggleCollaboration() {
        if (!this.collaborativeFeatures) {
            this.showNotification('Collaborative features not available', 'error');
            return;
        }

        const collaborationBtn = this.container.querySelector('.collaboration-btn');
        
        if (!this.collaborativeFeatures.isEnabled) {
            // Enable collaboration
            const documentId = this.generateDocumentId();
            const currentEditor = this.getCurrentEditor();
            
            if (currentEditor) {
                const success = this.collaborativeFeatures.init({
                    documentId: documentId,
                    editor: currentEditor,
                    currentUser: {
                        id: this.generateUserId(),
                        name: this.getUserName(),
                        color: this.generateUserColor()
                    },
                    enableComments: true,
                    enablePresence: true,
                    enableRealTimeSync: true
                });
                
                if (success) {
                    collaborationBtn.innerHTML = '👥 Collaboration On';
                    collaborationBtn.classList.add('active');
                    this.showNotification('Collaboration enabled', 'success');
                } else {
                    this.showNotification('Failed to enable collaboration', 'error');
                }
            } else {
                this.showNotification('Please select an editor first', 'error');
            }
        } else {
            // Disable collaboration
            this.collaborativeFeatures.destroy();
            collaborationBtn.innerHTML = '👥 Collaborate';
            collaborationBtn.classList.remove('active');
            this.showNotification('Collaboration disabled', 'info');
        }
    }

    /**
     * Generate document ID
     */
    generateDocumentId() {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate user ID
     */
    generateUserId() {
        let userId = localStorage.getItem('documentEditor_userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('documentEditor_userId', userId);
        }
        return userId;
    }

    /**
     * Get user name
     */
    getUserName() {
        let userName = localStorage.getItem('documentEditor_userName');
        if (!userName) {
            userName = prompt('Enter your name for collaboration:') || 'Anonymous User';
            localStorage.setItem('documentEditor_userName', userName);
        }
        return userName;
    }

    /**
     * Generate user color
     */
    generateUserColor() {
        let userColor = localStorage.getItem('documentEditor_userColor');
        if (!userColor) {
            const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
            userColor = colors[Math.floor(Math.random() * colors.length)];
            localStorage.setItem('documentEditor_userColor', userColor);
        }
        return userColor;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `editor-notification ${type}`;
        notification.textContent = message;
        
        // Add notification styles if not already added
        if (!document.querySelector('#editorNotificationStyles')) {
            const style = document.createElement('style');
            style.id = 'editorNotificationStyles';
            style.textContent = `
                .editor-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 16px;
                    border-radius: 6px;
                    color: white;
                    font-size: 14px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                .editor-notification.success { background: #28a745; }
                .editor-notification.error { background: #dc3545; }
                .editor-notification.info { background: #17a2b8; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Destroy the integration
     */
    destroy() {
        if (this.documentManager) {
            this.documentManager.destroy();
            this.documentManager = null;
        }

        this.editorInstances.clear();
        this.isInitialized = false;

        console.log('Document Editors Integration destroyed');
    }
}

// Global instance for easy access
let documentEditorsIntegration = null;

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentEditorsIntegration;
} else if (typeof window !== 'undefined') {
    window.DocumentEditorsIntegration = DocumentEditorsIntegration;
    
    // Auto-initialize if container exists
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('documentEditorsContainer');
        if (container) {
            documentEditorsIntegration = new DocumentEditorsIntegration();
            documentEditorsIntegration.init('documentEditorsContainer');
        }
    });
}

// Utility functions for easy access
if (typeof window !== 'undefined') {
    window.createDocument = (type, title, content) => {
        if (documentEditorsIntegration) {
            return documentEditorsIntegration.createDocument(type, title, content);
        }
        console.error('Document editors integration not initialized');
        return null;
    };

    window.openDocument = (documentId) => {
        if (documentEditorsIntegration) {
            return documentEditorsIntegration.openDocument(documentId);
        }
        console.error('Document editors integration not initialized');
        return false;
    };

    window.searchDocuments = (query, options) => {
        if (documentEditorsIntegration) {
            return documentEditorsIntegration.searchDocuments(query, options);
        }
        console.error('Document editors integration not initialized');
        return [];
    };

    window.getDocumentStats = () => {
        if (documentEditorsIntegration) {
            return documentEditorsIntegration.getStatistics();
        }
        console.error('Document editors integration not initialized');
        return null;
    };
}