/**
 * Document Management System
 * Handles file operations, templates, version control, and editor integration
 */
class DocumentManagerUtility {
    constructor() {
        this.documents = new Map();
        this.templates = new Map();
        this.recentDocuments = [];
        this.maxRecentDocuments = 10;
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;
        this.storageKey = 'documentManager';
        this.templatesKey = 'documentTemplates';
        this.recentKey = 'recentDocuments';
        this.currentEditor = null;
        this.editors = new Map();
        this.container = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the document manager
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.loadFromStorage();
        this.createInterface();
        this.setupEventListeners();
        this.initializeDefaultTemplates();
        this.startAutoSave();
        this.isInitialized = true;
        
        console.log('Document Manager initialized');
    }

    /**
     * Register an editor with the document manager
     */
    registerEditor(type, editorClass) {
        this.editors.set(type, editorClass);
        console.log(`Registered editor: ${type}`);
    }

    /**
     * Create the document manager interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="document-manager">
                <div class="manager-header">
                    <div class="manager-title">
                        <h2>Document Manager</h2>
                        <div class="manager-stats">
                            <span class="doc-count">0 documents</span>
                            <span class="template-count">0 templates</span>
                        </div>
                    </div>
                    <div class="manager-actions">
                        <button class="btn-primary" id="newDocumentBtn">New Document</button>
                        <button class="btn-secondary" id="importDocumentBtn">Import</button>
                        <button class="btn-secondary" id="exportAllBtn">Export All</button>
                        <button class="btn-secondary" id="manageTemplatesBtn">Templates</button>
                    </div>
                </div>
                
                <div class="manager-content">
                    <div class="manager-sidebar">
                        <div class="sidebar-section">
                            <h3>Quick Actions</h3>
                            <div class="quick-actions">
                                <button class="action-btn" data-action="new-text">📄 Plain Text</button>
                                <button class="action-btn" data-action="new-rich">📝 Rich Text</button>
                                <button class="action-btn" data-action="new-markdown">📋 Markdown</button>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Recent Documents</h3>
                            <div class="recent-documents" id="recentDocuments">
                                <p class="no-documents">No recent documents</p>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Templates</h3>
                            <div class="template-list" id="templateList">
                                <p class="no-templates">No templates available</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="manager-main">
                        <div class="document-grid" id="documentGrid">
                            <div class="no-documents-message">
                                <div class="no-docs-icon">📁</div>
                                <h3>No Documents Yet</h3>
                                <p>Create your first document to get started</p>
                                <button class="btn-primary" id="createFirstDoc">Create Document</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="editor-container" id="editorContainer" style="display: none;">
                    <div class="editor-header">
                        <div class="editor-breadcrumb">
                            <button class="breadcrumb-btn" id="backToManager">← Back to Manager</button>
                            <span class="current-document">Untitled Document</span>
                        </div>
                        <div class="editor-actions">
                            <button class="btn-secondary" id="saveDocumentBtn">Save</button>
                            <button class="btn-secondary" id="saveAsTemplateBtn">Save as Template</button>
                            <button class="btn-secondary" id="exportDocumentBtn">Export</button>
                            <button class="btn-secondary" id="closeEditorBtn">Close</button>
                        </div>
                    </div>
                    <div class="editor-content" id="editorContent"></div>
                </div>
            </div>
        `;
        
        this.addManagerStyles();
    }

    /**
     * Add CSS styles for the document manager
     */
    addManagerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .document-manager {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
            }
            
            .manager-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .manager-title h2 {
                margin: 0 0 5px 0;
                color: var(--text-color, #333);
                font-size: 24px;
            }
            
            .manager-stats {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: var(--text-color-secondary, #666);
            }
            
            .manager-actions {
                display: flex;
                gap: 10px;
            }
            
            .manager-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .manager-sidebar {
                width: 300px;
                background: rgba(255, 255, 255, 0.05);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                overflow-y: auto;
            }
            
            .sidebar-section {
                margin-bottom: 30px;
            }
            
            .sidebar-section h3 {
                margin: 0 0 15px 0;
                color: var(--text-color, #333);
                font-size: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 5px;
            }
            
            .quick-actions {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .action-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 12px;
                color: var(--text-color, #333);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                text-align: left;
            }
            
            .action-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .btn-primary, .btn-secondary {
                padding: 10px 20px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
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
            
            .manager-main {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            
            .document-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .no-documents-message {
                text-align: center;
                padding: 60px 20px;
                color: var(--text-color-secondary, #666);
                grid-column: 1 / -1;
            }
            
            .no-docs-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            
            .no-documents-message h3 {
                margin: 0 0 10px 0;
                color: var(--text-color, #333);
            }
            
            .no-documents-message p {
                margin: 0 0 20px 0;
            }
            
            .editor-container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .editor-breadcrumb {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .breadcrumb-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 8px 12px;
                color: var(--text-color, #333);
                cursor: pointer;
                font-size: 14px;
            }
            
            .breadcrumb-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .current-document {
                font-size: 18px;
                font-weight: bold;
                color: var(--text-color, #333);
            }
            
            .editor-content {
                flex: 1;
                overflow: hidden;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            }
            
            .notification.success {
                background: #28a745;
            }
            
            .notification.error {
                background: #dc3545;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Editor actions
        document.getElementById('backToManager').addEventListener('click', () => this.showManager());
        document.getElementById('createFirstDoc').addEventListener('click', () => this.createQuickDocument('text'));
    }

    /**
     * Handle quick action buttons
     */
    handleQuickAction(action) {
        const actionMap = {
            'new-text': 'text',
            'new-rich': 'rich',
            'new-markdown': 'markdown'
        };
        
        const docType = actionMap[action];
        if (docType) {
            this.createQuickDocument(docType);
        }
    }

    /**
     * Create a quick document without dialog
     */
    createQuickDocument(type) {
        const title = `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)} Document`;
        const document = this.createDocument({
            title,
            type,
            content: '',
            description: ''
        });
        
        this.openDocument(document.id);
    }

    /**
     * Create a document object
     */
    createDocument(options) {
        const id = this.generateId();
        const now = new Date();
        
        const document = {
            id,
            title: options.title || 'Untitled Document',
            type: options.type || 'text',
            content: options.content || '',
            description: options.description || '',
            createdAt: now,
            modifiedAt: now,
            version: 1,
            tags: options.tags || [],
            metadata: options.metadata || {}
        };
        
        this.documents.set(id, document);
        this.addToRecentDocuments(document);
        this.updateDocumentGrid();
        this.updateStats();
        this.saveToStorage();
        
        return document;
    }

    /**
     * Open document in editor
     */
    openDocument(documentId) {
        const document = this.documents.get(documentId);
        if (!document) {
            console.error('Document not found:', documentId);
            return;
        }
        
        this.closeCurrentEditor();
        
        const EditorClass = this.editors.get(document.type);
        if (!EditorClass) {
            this.showNotification(`No editor available for document type: ${document.type}`, 'error');
            return;
        }
        
        // Show editor container
        document.querySelector('.manager-content').style.display = 'none';
        document.getElementById('editorContainer').style.display = 'flex';
        
        // Update breadcrumb
        document.querySelector('.current-document').textContent = document.title;
        
        // Initialize editor
        const editorContent = document.getElementById('editorContent');
        editorContent.innerHTML = '<div id="currentEditor"></div>';
        
        this.currentEditor = new EditorClass();
        this.currentEditor.init('currentEditor');
        
        // Load document content
        if (this.currentEditor.loadDocument) {
            this.currentEditor.loadDocument(document);
        } else if (this.currentEditor.editor) {
            this.currentEditor.editor.value = document.content;
        }
        
        this.addToRecentDocuments(document);
    }

    /**
     * Close current editor
     */
    closeCurrentEditor() {
        if (this.currentEditor) {
            if (this.currentEditor.destroy) {
                this.currentEditor.destroy();
            }
            this.currentEditor = null;
        }
    }

    /**
     * Show manager view
     */
    showManager() {
        this.closeCurrentEditor();
        document.getElementById('editorContainer').style.display = 'none';
        document.querySelector('.manager-content').style.display = 'flex';
    }

    /**
     * Update document grid
     */
    updateDocumentGrid() {
        const grid = document.getElementById('documentGrid');
        
        if (this.documents.size === 0) {
            grid.innerHTML = `
                <div class="no-documents-message">
                    <div class="no-docs-icon">📁</div>
                    <h3>No Documents Yet</h3>
                    <p>Create your first document to get started</p>
                    <button class="btn-primary" id="createFirstDoc">Create Document</button>
                </div>
            `;
            
            document.getElementById('createFirstDoc').addEventListener('click', () => this.createQuickDocument('text'));
            return;
        }
        
        let gridHTML = '';
        this.documents.forEach((doc, id) => {
            const typeIcon = this.getTypeIcon(doc.type);
            const modifiedDate = new Date(doc.modifiedAt).toLocaleDateString();
            
            gridHTML += `
                <div class="document-card" data-id="${id}" onclick="window.openDocument ? window.openDocument('${id}') : (window.documentEditorsIntegration && window.documentEditorsIntegration.openDocument('${id}'))">
                    <div class="doc-icon">${typeIcon}</div>
                    <div class="doc-info">
                        <h4 class="doc-title">${doc.title}</h4>
                        <p class="doc-description">${doc.description || 'No description'}</p>
                        <div class="doc-meta">
                            <span class="doc-type">${doc.type}</span>
                            <span class="doc-date">${modifiedDate}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = gridHTML;
    }

    /**
     * Get type icon
     */
    getTypeIcon(type) {
        const icons = {
            'text': '📄',
            'rich': '📝',
            'markdown': '📋'
        };
        return icons[type] || '📄';
    }

    /**
     * Add document to recent documents
     */
    addToRecentDocuments(document) {
        this.recentDocuments = this.recentDocuments.filter(doc => doc.id !== document.id);
        this.recentDocuments.unshift({
            id: document.id,
            title: document.title,
            type: document.type,
            modifiedAt: document.modifiedAt
        });
        
        if (this.recentDocuments.length > this.maxRecentDocuments) {
            this.recentDocuments = this.recentDocuments.slice(0, this.maxRecentDocuments);
        }
        
        this.saveToStorage();
    }

    /**
     * Update statistics
     */
    updateStats() {
        document.querySelector('.doc-count').textContent = `${this.documents.size} document${this.documents.size !== 1 ? 's' : ''}`;
        document.querySelector('.template-count').textContent = `${this.templates.size} template${this.templates.size !== 1 ? 's' : ''}`;
    }

    /**
     * Initialize default templates
     */
    initializeDefaultTemplates() {
        if (this.templates.size > 0) return;
        
        const defaultTemplates = [
            {
                name: 'Meeting Notes',
                type: 'markdown',
                content: `# Meeting Notes\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** \n\n## Agenda\n- \n\n## Discussion\n\n## Action Items\n- [ ] \n\n## Next Meeting\n**Date:** \n**Time:** `,
                description: 'Template for meeting notes'
            },
            {
                name: 'Project Plan',
                type: 'markdown',
                content: `# Project Plan\n\n## Overview\n\n## Objectives\n- \n\n## Timeline\n\n## Resources\n\n## Milestones\n- [ ] `,
                description: 'Template for project planning'
            }
        ];
        
        defaultTemplates.forEach(templateData => {
            const template = {
                id: this.generateId(),
                ...templateData,
                createdAt: new Date()
            };
            this.templates.set(template.id, template);
        });
        
        this.saveToStorage();
    }

    /**
     * Start auto-save
     */
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            if (this.currentEditor && this.currentEditor.isModified) {
                this.saveCurrentDocument();
            }
        }, this.autoSaveInterval);
    }

    /**
     * Stop auto-save
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Save current document
     */
    saveCurrentDocument() {
        if (!this.currentEditor) return;
        
        // Implementation would depend on current editor
        this.showNotification('Document saved successfully');
    }

    /**
     * Save to local storage
     */
    saveToStorage() {
        try {
            const data = {
                documents: Array.from(this.documents.entries()),
                templates: Array.from(this.templates.entries()),
                recentDocuments: this.recentDocuments
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    /**
     * Load from local storage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                
                if (parsed.documents) {
                    this.documents = new Map(parsed.documents);
                }
                
                if (parsed.templates) {
                    this.templates = new Map(parsed.templates);
                }
                
                if (parsed.recentDocuments) {
                    this.recentDocuments = parsed.recentDocuments;
                }
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Destroy the document manager
     */
    destroy() {
        this.stopAutoSave();
        this.closeCurrentEditor();
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.documents.clear();
        this.templates.clear();
        this.recentDocuments = [];
        this.editors.clear();
        this.currentEditor = null;
        this.isInitialized = false;
        
        console.log('Document Manager destroyed');
    }
}

// Global instance for easy access
let documentManager = null;

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentManagerUtility;
} else if (typeof window !== 'undefined') {
    window.DocumentManagerUtility = DocumentManagerUtility;
    
    // Auto-initialize if container exists
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('documentManager');
        if (container) {
            documentManager = new DocumentManagerUtility();
            documentManager.init('documentManager');
        }
    });
}