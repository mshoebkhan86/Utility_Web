/**
 * Rich Text Editor Utility
 * Provides WYSIWYG editing capabilities with formatting controls
 */
class RichTextEditorUtility extends DocumentEditorUtility {
    constructor() {
        super();
        this.editorType = 'rich';
        this.editor = null;
        this.toolbar = null;
        this.container = null;
        this.isFullscreen = false;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
    }

    /**
     * Initialize the rich text editor
     */
    init(containerId) {
        super.init();
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.createEditor();
        this.setupToolbar();
        this.setupEventListeners();
        this.createNewDocument('rich');
        console.log('Rich Text Editor initialized');
    }

    /**
     * Create the editor interface
     */
    createEditor() {
        this.container.innerHTML = `
            <div class="rich-text-editor">
                <div class="editor-header">
                    <div class="editor-toolbar" id="richTextToolbar"></div>
                    <div class="editor-info">
                        <span class="document-title" contenteditable="true">Untitled Document</span>
                        <div class="editor-stats">
                            <span class="word-count">0 words</span>
                            <span class="char-count">0 characters</span>
                        </div>
                    </div>
                </div>
                <div class="editor-content">
                    <div class="editor-area" 
                         contenteditable="true" 
                         id="richTextEditor"
                         spellcheck="true"
                         data-placeholder="Start typing your document..."></div>
                </div>
                <div class="editor-footer">
                    <div class="editor-actions">
                        <button class="btn-secondary" id="newDocBtn">New</button>
                        <button class="btn-secondary" id="openDocBtn">Open</button>
                        <button class="btn-primary" id="saveDocBtn">Save</button>
                        <button class="btn-secondary" id="exportDocBtn">Export</button>
                        <button class="btn-secondary" id="fullscreenBtn">Fullscreen</button>
                    </div>
                </div>
            </div>
        `;

        this.editor = document.getElementById('richTextEditor');
        this.toolbar = document.getElementById('richTextToolbar');
        
        // Add CSS styles
        this.addEditorStyles();
    }

    /**
     * Setup the formatting toolbar
     */
    setupToolbar() {
        const toolbarButtons = [
            { id: 'undo', icon: '↶', title: 'Undo', command: 'undo' },
            { id: 'redo', icon: '↷', title: 'Redo', command: 'redo' },
            { type: 'separator' },
            { id: 'bold', icon: 'B', title: 'Bold', command: 'bold', style: 'font-weight: bold' },
            { id: 'italic', icon: 'I', title: 'Italic', command: 'italic', style: 'font-style: italic' },
            { id: 'underline', icon: 'U', title: 'Underline', command: 'underline', style: 'text-decoration: underline' },
            { id: 'strikethrough', icon: 'S', title: 'Strikethrough', command: 'strikeThrough', style: 'text-decoration: line-through' },
            { type: 'separator' },
            { id: 'alignLeft', icon: '⬅', title: 'Align Left', command: 'justifyLeft' },
            { id: 'alignCenter', icon: '⬌', title: 'Align Center', command: 'justifyCenter' },
            { id: 'alignRight', icon: '➡', title: 'Align Right', command: 'justifyRight' },
            { id: 'alignJustify', icon: '⬍', title: 'Justify', command: 'justifyFull' },
            { type: 'separator' },
            { id: 'insertOrderedList', icon: '1.', title: 'Numbered List', command: 'insertOrderedList' },
            { id: 'insertUnorderedList', icon: '•', title: 'Bullet List', command: 'insertUnorderedList' },
            { id: 'outdent', icon: '⬅', title: 'Decrease Indent', command: 'outdent' },
            { id: 'indent', icon: '➡', title: 'Increase Indent', command: 'indent' },
            { type: 'separator' },
            { id: 'createLink', icon: '🔗', title: 'Insert Link', command: 'createLink' },
            { id: 'insertImage', icon: '🖼', title: 'Insert Image', command: 'insertImage' },
            { id: 'insertTable', icon: '⊞', title: 'Insert Table', command: 'insertTable' },
            { type: 'separator' },
            { id: 'removeFormat', icon: '🧹', title: 'Clear Formatting', command: 'removeFormat' },
            { id: 'selectAll', icon: '⬜', title: 'Select All', command: 'selectAll' }
        ];

        let toolbarHTML = '';
        toolbarButtons.forEach(button => {
            if (button.type === 'separator') {
                toolbarHTML += '<div class="toolbar-separator"></div>';
            } else {
                toolbarHTML += `
                    <button class="toolbar-btn" 
                            id="${button.id}" 
                            title="${button.title}" 
                            data-command="${button.command}"
                            ${button.style ? `style="${button.style}"` : ''}>
                        ${button.icon}
                    </button>
                `;
            }
        });

        // Add font and size selectors
        toolbarHTML += `
            <div class="toolbar-separator"></div>
            <select class="toolbar-select" id="fontFamily">
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
            </select>
            <select class="toolbar-select" id="fontSize">
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px" selected>14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
                <option value="32px">32px</option>
            </select>
            <input type="color" class="toolbar-color" id="textColor" title="Text Color" value="#000000">
            <input type="color" class="toolbar-color" id="backgroundColor" title="Background Color" value="#ffffff">
        `;

        this.toolbar.innerHTML = toolbarHTML;
        this.setupToolbarEvents();
    }

    /**
     * Setup toolbar event listeners
     */
    setupToolbarEvents() {
        // Command buttons
        this.toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeCommand(command);
            });
        });

        // Font family
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.executeCommand('fontName', e.target.value);
        });

        // Font size
        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.executeCommand('fontSize', e.target.value);
        });

        // Text color
        document.getElementById('textColor').addEventListener('change', (e) => {
            this.executeCommand('foreColor', e.target.value);
        });

        // Background color
        document.getElementById('backgroundColor').addEventListener('change', (e) => {
            this.executeCommand('backColor', e.target.value);
        });
    }

    /**
     * Execute formatting commands
     */
    executeCommand(command, value = null) {
        this.editor.focus();
        
        switch (command) {
            case 'createLink':
                const url = prompt('Enter URL:');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
            case 'insertImage':
                const imgUrl = prompt('Enter image URL:');
                if (imgUrl) {
                    document.execCommand('insertImage', false, imgUrl);
                }
                break;
            case 'insertTable':
                this.insertTable();
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            default:
                document.execCommand(command, false, value);
                break;
        }
        
        this.updateToolbarState();
        this.saveState();
        this.markAsModified();
        this.updateStats();
    }

    /**
     * Insert a table
     */
    insertTable() {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');
        
        if (rows && cols) {
            let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
            for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>';
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</table>';
            
            document.execCommand('insertHTML', false, tableHTML);
        }
    }

    /**
     * Update toolbar button states
     */
    updateToolbarState() {
        const commands = ['bold', 'italic', 'underline', 'strikeThrough'];
        commands.forEach(command => {
            const btn = document.getElementById(command);
            if (btn) {
                btn.classList.toggle('active', document.queryCommandState(command));
            }
        });
    }

    /**
     * Save editor state for undo/redo
     */
    saveState() {
        const state = {
            content: this.editor.innerHTML,
            selection: this.saveSelection()
        };
        
        this.undoStack.push(state);
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        
        this.redoStack = []; // Clear redo stack when new action is performed
    }

    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length > 1) {
            const currentState = this.undoStack.pop();
            this.redoStack.push(currentState);
            
            const previousState = this.undoStack[this.undoStack.length - 1];
            this.editor.innerHTML = previousState.content;
            this.restoreSelection(previousState.selection);
        }
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.undoStack.push(state);
            
            this.editor.innerHTML = state.content;
            this.restoreSelection(state.selection);
        }
    }

    /**
     * Save current selection
     */
    saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0).cloneRange();
        }
        return null;
    }

    /**
     * Restore selection
     */
    restoreSelection(range) {
        if (range) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * Setup editor event listeners
     */
    setupEventListeners() {
        super.setupEventListeners();
        
        // Editor content changes
        this.editor.addEventListener('input', () => {
            this.markAsModified();
            this.updateStats();
        });

        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.executeCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.executeCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.executeCommand('underline');
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                }
            }
        });

        // Selection changes
        document.addEventListener('selectionchange', () => {
            this.updateToolbarState();
        });

        // Action buttons
        document.getElementById('newDocBtn').addEventListener('click', () => this.newDocument());
        document.getElementById('openDocBtn').addEventListener('click', () => this.openDocument());
        document.getElementById('saveDocBtn').addEventListener('click', () => this.saveCurrentDocument());
        document.getElementById('exportDocBtn').addEventListener('click', () => this.showExportDialog());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Document title editing
        document.querySelector('.document-title').addEventListener('blur', (e) => {
            if (this.currentDocument) {
                this.currentDocument.title = e.target.textContent;
                this.markAsModified();
            }
        });
    }

    /**
     * Update document statistics
     */
    updateStats() {
        const content = this.getPlainTextContent();
        const stats = this.getDocumentStats(content);
        
        document.querySelector('.word-count').textContent = `${stats.words} words`;
        document.querySelector('.char-count').textContent = `${stats.characters} characters`;
    }

    /**
     * Get plain text content from HTML
     */
    getPlainTextContent() {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.editor.innerHTML;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    /**
     * New document
     */
    newDocument() {
        if (this.isModified && !confirm('You have unsaved changes. Create new document anyway?')) {
            return;
        }
        
        this.createNewDocument('rich');
        this.editor.innerHTML = '';
        document.querySelector('.document-title').textContent = 'Untitled Document';
        this.undoStack = [];
        this.redoStack = [];
        this.updateStats();
    }

    /**
     * Open document
     */
    openDocument() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm,.rtf,.txt';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const doc = await this.loadDocument(file);
                    this.editor.innerHTML = doc.content;
                    document.querySelector('.document-title').textContent = doc.title;
                    this.updateStats();
                    this.saveState();
                } catch (error) {
                    alert('Error loading document: ' + error.message);
                }
            }
        };
        input.click();
    }

    /**
     * Save current document
     */
    saveCurrentDocument() {
        if (!this.currentDocument) return;
        
        const content = this.editor.innerHTML;
        const title = document.querySelector('.document-title').textContent;
        
        this.saveDocument(content, title);
        alert('Document saved successfully!');
    }

    /**
     * Show export dialog
     */
    showExportDialog() {
        const format = prompt('Export format (html, txt, rtf, md):', 'html');
        if (format) {
            // Convert HTML content to plain text for non-HTML formats
            let content = this.editor.innerHTML;
            if (format !== 'html') {
                content = this.getPlainTextContent();
            }
            
            // Update current document content
            if (this.currentDocument) {
                this.currentDocument.content = content;
            }
            
            this.exportDocument(format);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        const editor = document.querySelector('.rich-text-editor');
        
        if (this.isFullscreen) {
            editor.classList.add('fullscreen');
            document.getElementById('fullscreenBtn').textContent = 'Exit Fullscreen';
        } else {
            editor.classList.remove('fullscreen');
            document.getElementById('fullscreenBtn').textContent = 'Fullscreen';
        }
    }

    /**
     * Add CSS styles for the editor
     */
    addEditorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rich-text-editor {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
            }
            
            .rich-text-editor.fullscreen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                border-radius: 0;
            }
            
            .editor-header {
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding: 10px;
            }
            
            .editor-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 10px;
                align-items: center;
            }
            
            .toolbar-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 8px 12px;
                color: var(--text-color, #333);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                min-width: 35px;
            }
            
            .toolbar-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .toolbar-btn.active {
                background: var(--primary-color, #007bff);
                color: white;
            }
            
            .toolbar-separator {
                width: 1px;
                height: 25px;
                background: rgba(255, 255, 255, 0.3);
                margin: 0 5px;
            }
            
            .toolbar-select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 5px 8px;
                color: var(--text-color, #333);
                cursor: pointer;
            }
            
            .toolbar-color {
                width: 35px;
                height: 35px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                cursor: pointer;
                background: none;
            }
            
            .editor-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .document-title {
                font-size: 18px;
                font-weight: bold;
                color: var(--text-color, #333);
                background: none;
                border: none;
                outline: none;
                padding: 5px;
                border-radius: 5px;
            }
            
            .document-title:focus {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .editor-stats {
                display: flex;
                gap: 15px;
                font-size: 12px;
                color: var(--text-color-secondary, #666);
            }
            
            .editor-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            
            .editor-area {
                min-height: 400px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 20px;
                font-family: var(--font-family, 'Arial, sans-serif');
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-color, #333);
                outline: none;
                overflow-y: auto;
            }
            
            .editor-area:empty:before {
                content: attr(data-placeholder);
                color: var(--text-color-secondary, #999);
                font-style: italic;
            }
            
            .editor-footer {
                background: rgba(255, 255, 255, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding: 10px;
            }
            
            .editor-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .btn-primary, .btn-secondary {
                padding: 8px 16px;
                border-radius: 5px;
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
            
            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .editor-area table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
            }
            
            .editor-area table td, .editor-area table th {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            
            .editor-area table th {
                background-color: rgba(0, 0, 0, 0.1);
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RichTextEditorUtility;
} else if (typeof window !== 'undefined') {
    window.RichTextEditorUtility = RichTextEditorUtility;
}