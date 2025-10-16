/**
 * Document Editor Utility
 * Provides base functionality for various document editors
 */
class DocumentEditorUtility {
    constructor() {
        this.currentDocument = null;
        this.documentHistory = [];
        this.autoSaveInterval = null;
        this.isModified = false;
        this.editorType = 'plain'; // 'plain', 'rich', 'markdown'
        this.settings = {
            autoSave: true,
            autoSaveDelay: 5000, // 5 seconds
            maxHistory: 50,
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            theme: 'light'
        };
    }

    /**
     * Initialize the document editor
     */
    init() {
        this.loadSettings();
        this.setupEventListeners();
        console.log('Document Editor initialized');
    }

    /**
     * Create a new document
     */
    createNewDocument(type = 'plain') {
        this.currentDocument = {
            id: this.generateId(),
            title: 'Untitled Document',
            content: '',
            type: type,
            created: new Date(),
            modified: new Date(),
            wordCount: 0,
            characterCount: 0
        };
        this.editorType = type;
        this.isModified = false;
        this.addToHistory('create', 'New document created');
        return this.currentDocument;
    }

    /**
     * Load document from file
     */
    async loadDocument(file) {
        try {
            const content = await this.readFile(file);
            const type = this.detectDocumentType(file.name);
            
            this.currentDocument = {
                id: this.generateId(),
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                content: content,
                type: type,
                created: new Date(file.lastModified || Date.now()),
                modified: new Date(),
                wordCount: this.countWords(content),
                characterCount: content.length
            };
            
            this.editorType = type;
            this.isModified = false;
            this.addToHistory('load', `Document loaded: ${file.name}`);
            return this.currentDocument;
        } catch (error) {
            throw new Error(`Failed to load document: ${error.message}`);
        }
    }

    /**
     * Save document content
     */
    saveDocument(content, title = null) {
        if (!this.currentDocument) {
            throw new Error('No document to save');
        }

        this.currentDocument.content = content;
        this.currentDocument.modified = new Date();
        this.currentDocument.wordCount = this.countWords(content);
        this.currentDocument.characterCount = content.length;
        
        if (title) {
            this.currentDocument.title = title;
        }

        this.isModified = false;
        this.addToHistory('save', 'Document saved');
        
        // Store in localStorage
        this.saveToLocalStorage();
        
        return this.currentDocument;
    }

    /**
     * Export document in various formats
     */
    exportDocument(format = 'txt') {
        if (!this.currentDocument) {
            throw new Error('No document to export');
        }

        const content = this.currentDocument.content;
        const title = this.currentDocument.title;
        let exportContent = content;
        let mimeType = 'text/plain';
        let extension = 'txt';

        switch (format.toLowerCase()) {
            case 'html':
                exportContent = this.convertToHtml(content);
                mimeType = 'text/html';
                extension = 'html';
                break;
            case 'markdown':
            case 'md':
                exportContent = this.convertToMarkdown(content);
                mimeType = 'text/markdown';
                extension = 'md';
                break;
            case 'rtf':
                exportContent = this.convertToRtf(content);
                mimeType = 'application/rtf';
                extension = 'rtf';
                break;
            case 'json':
                exportContent = JSON.stringify(this.currentDocument, null, 2);
                mimeType = 'application/json';
                extension = 'json';
                break;
            default:
                // Plain text
                break;
        }

        const filename = `${title}.${extension}`;
        this.downloadFile(exportContent, filename, mimeType);
        this.addToHistory('export', `Document exported as ${format.toUpperCase()}`);
    }

    /**
     * Auto-save functionality
     */
    enableAutoSave(content) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        if (this.settings.autoSave) {
            this.autoSaveInterval = setInterval(() => {
                if (this.isModified && this.currentDocument) {
                    this.saveDocument(content());
                    console.log('Document auto-saved');
                }
            }, this.settings.autoSaveDelay);
        }
    }

    /**
     * Disable auto-save
     */
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    /**
     * Mark document as modified
     */
    markAsModified() {
        this.isModified = true;
        if (this.currentDocument) {
            this.currentDocument.modified = new Date();
        }
    }

    /**
     * Get document statistics
     */
    getDocumentStats(content) {
        const wordCount = this.countWords(content);
        const characterCount = content.length;
        const characterCountNoSpaces = content.replace(/\s/g, '').length;
        const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim()).length;
        const lineCount = content.split('\n').length;

        return {
            words: wordCount,
            characters: characterCount,
            charactersNoSpaces: characterCountNoSpaces,
            paragraphs: paragraphCount,
            lines: lineCount
        };
    }

    /**
     * Search and replace functionality
     */
    searchAndReplace(content, searchTerm, replaceTerm, replaceAll = false) {
        if (!searchTerm) return content;

        if (replaceAll) {
            const regex = new RegExp(this.escapeRegex(searchTerm), 'gi');
            return content.replace(regex, replaceTerm);
        } else {
            const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (index !== -1) {
                return content.substring(0, index) + replaceTerm + content.substring(index + searchTerm.length);
            }
        }
        return content;
    }

    /**
     * Utility methods
     */
    generateId() {
        return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    countWords(text) {
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }

    detectDocumentType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'md':
            case 'markdown':
                return 'markdown';
            case 'html':
            case 'htm':
                return 'rich';
            case 'rtf':
                return 'rich';
            default:
                return 'plain';
        }
    }

    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    convertToHtml(content) {
        // Basic text to HTML conversion
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>\n')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    convertToMarkdown(content) {
        // Basic text to Markdown conversion
        return content;
    }

    convertToRtf(content) {
        // Basic RTF format
        return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${content.replace(/\n/g, '\\par ')} }`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveToLocalStorage() {
        if (this.currentDocument) {
            const saved = JSON.parse(localStorage.getItem('documentEditor_documents') || '[]');
            const existing = saved.findIndex(doc => doc.id === this.currentDocument.id);
            
            if (existing !== -1) {
                saved[existing] = this.currentDocument;
            } else {
                saved.push(this.currentDocument);
            }
            
            localStorage.setItem('documentEditor_documents', JSON.stringify(saved));
        }
    }

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('documentEditor_documents') || '[]');
    }

    loadSettings() {
        const saved = localStorage.getItem('documentEditor_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('documentEditor_settings', JSON.stringify(this.settings));
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        if (this.currentDocument) {
                            // Trigger save event
                            document.dispatchEvent(new CustomEvent('documentEditor:save'));
                        }
                        break;
                    case 'n':
                        e.preventDefault();
                        document.dispatchEvent(new CustomEvent('documentEditor:new'));
                        break;
                    case 'o':
                        e.preventDefault();
                        document.dispatchEvent(new CustomEvent('documentEditor:open'));
                        break;
                }
            }
        });
    }

    addToHistory(action, description) {
        this.documentHistory.unshift({
            timestamp: new Date(),
            action: action,
            description: description
        });
        
        // Keep only the last maxHistory items
        if (this.documentHistory.length > this.settings.maxHistory) {
            this.documentHistory = this.documentHistory.slice(0, this.settings.maxHistory);
        }
    }

    getHistory() {
        return this.documentHistory;
    }

    clearHistory() {
        this.documentHistory = [];
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentEditorUtility;
} else if (typeof window !== 'undefined') {
    window.DocumentEditorUtility = DocumentEditorUtility;
}