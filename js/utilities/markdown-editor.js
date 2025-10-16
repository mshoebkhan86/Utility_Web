/**
 * Markdown Editor Utility
 * Provides markdown editing with live preview and syntax highlighting
 */
class MarkdownEditorUtility extends DocumentEditorUtility {
    constructor() {
        super();
        this.editorType = 'markdown';
        this.editor = null;
        this.preview = null;
        this.container = null;
        this.isPreviewMode = false;
        this.isSplitView = true;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
    }

    /**
     * Initialize the markdown editor
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
        this.createNewDocument('markdown');
        this.updatePreview();
        console.log('Markdown Editor initialized');
    }

    /**
     * Create the editor interface
     */
    createEditor() {
        this.container.innerHTML = `
            <div class="markdown-editor">
                <div class="editor-header">
                    <div class="editor-toolbar" id="markdownToolbar"></div>
                    <div class="editor-info">
                        <div class="editor-title">
                            <span class="document-title" contenteditable="true">Untitled Document</span>
                            <span class="file-extension">.md</span>
                        </div>
                        <div class="editor-stats">
                            <span class="word-count">0 words</span>
                            <span class="char-count">0 characters</span>
                            <span class="line-count">0 lines</span>
                        </div>
                    </div>
                </div>
                <div class="editor-content">
                    <div class="editor-panes">
                        <div class="editor-pane" id="editorPane">
                            <div class="pane-header">
                                <span class="pane-title">Markdown</span>
                                <div class="pane-controls">
                                    <button class="pane-btn" id="editorOnlyBtn" title="Editor Only">📝</button>
                                </div>
                            </div>
                            <textarea class="markdown-textarea" 
                                     id="markdownEditor"
                                     spellcheck="true"
                                     placeholder="# Start writing your markdown here...\n\nUse **bold**, *italic*, and [links](url) to format your text."></textarea>
                        </div>
                        <div class="editor-pane" id="previewPane">
                            <div class="pane-header">
                                <span class="pane-title">Preview</span>
                                <div class="pane-controls">
                                    <button class="pane-btn" id="previewOnlyBtn" title="Preview Only">👁</button>
                                    <button class="pane-btn" id="splitViewBtn" title="Split View">⚏</button>
                                </div>
                            </div>
                            <div class="markdown-preview" id="markdownPreview"></div>
                        </div>
                    </div>
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

        this.editor = document.getElementById('markdownEditor');
        this.preview = document.getElementById('markdownPreview');
        
        // Add CSS styles
        this.addEditorStyles();
    }

    /**
     * Setup the markdown toolbar
     */
    setupToolbar() {
        const toolbarButtons = [
            { id: 'undo', icon: '↶', title: 'Undo', action: 'undo' },
            { id: 'redo', icon: '↷', title: 'Redo', action: 'redo' },
            { type: 'separator' },
            { id: 'bold', icon: 'B', title: 'Bold', markdown: '**text**', style: 'font-weight: bold' },
            { id: 'italic', icon: 'I', title: 'Italic', markdown: '*text*', style: 'font-style: italic' },
            { id: 'strikethrough', icon: 'S', title: 'Strikethrough', markdown: '~~text~~', style: 'text-decoration: line-through' },
            { id: 'code', icon: '</>', title: 'Inline Code', markdown: '`code`' },
            { type: 'separator' },
            { id: 'h1', icon: 'H1', title: 'Heading 1', markdown: '# ' },
            { id: 'h2', icon: 'H2', title: 'Heading 2', markdown: '## ' },
            { id: 'h3', icon: 'H3', title: 'Heading 3', markdown: '### ' },
            { type: 'separator' },
            { id: 'quote', icon: '❝', title: 'Quote', markdown: '> ' },
            { id: 'unorderedList', icon: '•', title: 'Bullet List', markdown: '- ' },
            { id: 'orderedList', icon: '1.', title: 'Numbered List', markdown: '1. ' },
            { id: 'checkList', icon: '☑', title: 'Task List', markdown: '- [ ] ' },
            { type: 'separator' },
            { id: 'link', icon: '🔗', title: 'Link', markdown: '[text](url)' },
            { id: 'image', icon: '🖼', title: 'Image', markdown: '![alt](url)' },
            { id: 'table', icon: '⊞', title: 'Table', action: 'insertTable' },
            { id: 'codeBlock', icon: '{ }', title: 'Code Block', markdown: '```\ncode\n```' },
            { type: 'separator' },
            { id: 'horizontalRule', icon: '—', title: 'Horizontal Rule', markdown: '\n---\n' }
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
                            data-markdown="${button.markdown || ''}"
                            data-action="${button.action || 'insert'}"
                            ${button.style ? `style="${button.style}"` : ''}>
                        ${button.icon}
                    </button>
                `;
            }
        });

        document.getElementById('markdownToolbar').innerHTML = toolbarHTML;
        this.setupToolbarEvents();
    }

    /**
     * Setup toolbar event listeners
     */
    setupToolbarEvents() {
        document.getElementById('markdownToolbar').addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
                const action = e.target.dataset.action;
                const markdown = e.target.dataset.markdown;
                
                switch (action) {
                    case 'undo':
                        this.undo();
                        break;
                    case 'redo':
                        this.redo();
                        break;
                    case 'insertTable':
                        this.insertTable();
                        break;
                    default:
                        this.insertMarkdown(markdown);
                        break;
                }
            }
        });
    }

    /**
     * Insert markdown syntax at cursor position
     */
    insertMarkdown(markdown) {
        const textarea = this.editor;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let insertText = markdown;
        let cursorOffset = 0;
        
        // Handle different markdown patterns
        if (markdown.includes('text')) {
            if (selectedText) {
                insertText = markdown.replace('text', selectedText);
                cursorOffset = insertText.length;
            } else {
                cursorOffset = markdown.indexOf('text');
            }
        } else if (markdown.includes('url')) {
            if (selectedText) {
                insertText = markdown.replace('text', selectedText);
                cursorOffset = insertText.indexOf('url');
            } else {
                cursorOffset = markdown.indexOf('text');
            }
        } else if (markdown.startsWith('#') || markdown.startsWith('>') || markdown.startsWith('-') || markdown.startsWith('1.')) {
            // Line-based markdown (headings, quotes, lists)
            const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
            textarea.setSelectionRange(lineStart, lineStart);
            insertText = markdown;
            cursorOffset = markdown.length;
        } else {
            cursorOffset = insertText.length;
        }
        
        // Insert the markdown
        const newValue = textarea.value.substring(0, textarea.selectionStart) + 
                        insertText + 
                        textarea.value.substring(textarea.selectionEnd);
        
        textarea.value = newValue;
        
        // Set cursor position
        const newCursorPos = textarea.selectionStart + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        
        textarea.focus();
        this.updatePreview();
        this.saveState();
        this.markAsModified();
        this.updateStats();
    }

    /**
     * Insert a markdown table
     */
    insertTable() {
        const rows = prompt('Number of rows (including header):', '3');
        const cols = prompt('Number of columns:', '3');
        
        if (rows && cols) {
            const numRows = parseInt(rows);
            const numCols = parseInt(cols);
            
            let table = '';
            
            // Header row
            table += '|';
            for (let j = 0; j < numCols; j++) {
                table += ` Header ${j + 1} |`;
            }
            table += '\n';
            
            // Separator row
            table += '|';
            for (let j = 0; j < numCols; j++) {
                table += ' --- |';
            }
            table += '\n';
            
            // Data rows
            for (let i = 1; i < numRows; i++) {
                table += '|';
                for (let j = 0; j < numCols; j++) {
                    table += ` Cell ${i},${j + 1} |`;
                }
                table += '\n';
            }
            
            this.insertMarkdown(table);
        }
    }

    /**
     * Convert markdown to HTML
     */
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Strikethrough
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        
        // Task lists
        html = html.replace(/^- \[ \] (.*$)/gim, '<input type="checkbox" disabled> $1<br>');
        html = html.replace(/^- \[x\] (.*$)/gim, '<input type="checkbox" checked disabled> $1<br>');
        
        // Unordered lists
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/((<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
        
        // Ordered lists
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        
        // Tables
        html = this.convertTables(html);
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        // Clean up multiple br tags
        html = html.replace(/(<br>\s*){3,}/g, '<br><br>');
        
        return html;
    }

    /**
     * Convert markdown tables to HTML
     */
    convertTables(html) {
        const tableRegex = /^\|(.+)\|\s*\n\|([\s\S]*?)\|\s*\n((?:\|.*\|\s*\n?)*)/gm;
        
        return html.replace(tableRegex, (match, header, separator, rows) => {
            const headerCells = header.split('|').map(cell => `<th>${cell.trim()}</th>`).join('');
            const rowsHtml = rows.trim().split('\n').map(row => {
                const cells = row.replace(/^\|/, '').replace(/\|$/, '').split('|')
                    .map(cell => `<td>${cell.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            
            return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
        });
    }

    /**
     * Update the preview pane
     */
    updatePreview() {
        const markdown = this.editor.value;
        const html = this.markdownToHtml(markdown);
        this.preview.innerHTML = html;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        super.setupEventListeners();
        
        // Editor content changes
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.markAsModified();
            this.updateStats();
        });

        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        this.insertMarkdown('**text**');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.insertMarkdown('*text*');
                        break;
                    case 'k':
                        e.preventDefault();
                        this.insertMarkdown('[text](url)');
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
            
            // Tab handling for lists
            if (e.key === 'Tab') {
                const start = this.editor.selectionStart;
                const lineStart = this.editor.value.lastIndexOf('\n', start - 1) + 1;
                const line = this.editor.value.substring(lineStart, this.editor.value.indexOf('\n', start));
                
                if (line.match(/^\s*[-*+]\s/) || line.match(/^\s*\d+\.\s/)) {
                    e.preventDefault();
                    const indent = e.shiftKey ? this.outdentLine() : this.indentLine();
                }
            }
        });

        // View mode buttons
        document.getElementById('editorOnlyBtn').addEventListener('click', () => this.setViewMode('editor'));
        document.getElementById('previewOnlyBtn').addEventListener('click', () => this.setViewMode('preview'));
        document.getElementById('splitViewBtn').addEventListener('click', () => this.setViewMode('split'));

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
     * Indent current line
     */
    indentLine() {
        const start = this.editor.selectionStart;
        const lineStart = this.editor.value.lastIndexOf('\n', start - 1) + 1;
        
        this.editor.value = this.editor.value.substring(0, lineStart) + 
                           '  ' + 
                           this.editor.value.substring(lineStart);
        
        this.editor.setSelectionRange(start + 2, start + 2);
        this.updatePreview();
    }

    /**
     * Outdent current line
     */
    outdentLine() {
        const start = this.editor.selectionStart;
        const lineStart = this.editor.value.lastIndexOf('\n', start - 1) + 1;
        const line = this.editor.value.substring(lineStart);
        
        if (line.startsWith('  ')) {
            this.editor.value = this.editor.value.substring(0, lineStart) + 
                               line.substring(2);
            this.editor.setSelectionRange(start - 2, start - 2);
            this.updatePreview();
        }
    }

    /**
     * Set view mode (editor, preview, split)
     */
    setViewMode(mode) {
        const editorPane = document.getElementById('editorPane');
        const previewPane = document.getElementById('previewPane');
        
        editorPane.style.display = mode === 'preview' ? 'none' : 'flex';
        previewPane.style.display = mode === 'editor' ? 'none' : 'flex';
        
        if (mode === 'split') {
            editorPane.style.width = '50%';
            previewPane.style.width = '50%';
        } else {
            editorPane.style.width = '100%';
            previewPane.style.width = '100%';
        }
        
        this.isPreviewMode = mode === 'preview';
        this.isSplitView = mode === 'split';
    }

    /**
     * Save editor state for undo/redo
     */
    saveState() {
        const state = {
            content: this.editor.value,
            selectionStart: this.editor.selectionStart,
            selectionEnd: this.editor.selectionEnd
        };
        
        this.undoStack.push(state);
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        
        this.redoStack = [];
    }

    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length > 1) {
            const currentState = this.undoStack.pop();
            this.redoStack.push(currentState);
            
            const previousState = this.undoStack[this.undoStack.length - 1];
            this.editor.value = previousState.content;
            this.editor.setSelectionRange(previousState.selectionStart, previousState.selectionEnd);
            this.updatePreview();
        }
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.undoStack.push(state);
            
            this.editor.value = state.content;
            this.editor.setSelectionRange(state.selectionStart, state.selectionEnd);
            this.updatePreview();
        }
    }

    /**
     * Update document statistics
     */
    updateStats() {
        const content = this.editor.value;
        const stats = this.getDocumentStats(content);
        
        document.querySelector('.word-count').textContent = `${stats.words} words`;
        document.querySelector('.char-count').textContent = `${stats.characters} characters`;
        document.querySelector('.line-count').textContent = `${stats.lines} lines`;
    }

    /**
     * New document
     */
    newDocument() {
        if (this.isModified && !confirm('You have unsaved changes. Create new document anyway?')) {
            return;
        }
        
        this.createNewDocument('markdown');
        this.editor.value = '';
        document.querySelector('.document-title').textContent = 'Untitled Document';
        this.undoStack = [];
        this.redoStack = [];
        this.updatePreview();
        this.updateStats();
    }

    /**
     * Open document
     */
    openDocument() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.txt';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const doc = await this.loadDocument(file);
                    this.editor.value = doc.content;
                    document.querySelector('.document-title').textContent = doc.title;
                    this.updatePreview();
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
        
        const content = this.editor.value;
        const title = document.querySelector('.document-title').textContent;
        
        this.saveDocument(content, title);
        alert('Document saved successfully!');
    }

    /**
     * Show export dialog
     */
    showExportDialog() {
        const format = prompt('Export format (md, html, txt):', 'md');
        if (format) {
            let content = this.editor.value;
            
            if (format === 'html') {
                content = this.markdownToHtml(content);
                content = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>${this.currentDocument?.title || 'Document'}</title>\n<style>\nbody { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }\ncode { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }\npre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }\nblockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }\ntable { border-collapse: collapse; width: 100%; }\nth, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\nth { background-color: #f2f2f2; }\n</style>\n</head>\n<body>\n${content}\n</body>\n</html>`;
            }
            
            if (this.currentDocument) {
                this.currentDocument.content = this.editor.value;
            }
            
            this.exportDocument(format);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        const editor = document.querySelector('.markdown-editor');
        editor.classList.toggle('fullscreen');
        
        const btn = document.getElementById('fullscreenBtn');
        btn.textContent = editor.classList.contains('fullscreen') ? 'Exit Fullscreen' : 'Fullscreen';
    }

    /**
     * Add CSS styles for the editor
     */
    addEditorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .markdown-editor {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
            }
            
            .markdown-editor.fullscreen {
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
            
            .toolbar-separator {
                width: 1px;
                height: 25px;
                background: rgba(255, 255, 255, 0.3);
                margin: 0 5px;
            }
            
            .editor-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .editor-title {
                display: flex;
                align-items: center;
                gap: 5px;
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
            
            .file-extension {
                font-size: 12px;
                color: var(--text-color-secondary, #666);
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 3px;
            }
            
            .editor-stats {
                display: flex;
                gap: 15px;
                font-size: 12px;
                color: var(--text-color-secondary, #666);
            }
            
            .editor-content {
                flex: 1;
                overflow: hidden;
            }
            
            .editor-panes {
                display: flex;
                height: 100%;
            }
            
            .editor-pane {
                flex: 1;
                display: flex;
                flex-direction: column;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .editor-pane:last-child {
                border-right: none;
            }
            
            .pane-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .pane-title {
                font-weight: bold;
                color: var(--text-color, #333);
            }
            
            .pane-controls {
                display: flex;
                gap: 5px;
            }
            
            .pane-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                padding: 4px 8px;
                color: var(--text-color, #333);
                cursor: pointer;
                font-size: 12px;
            }
            
            .pane-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .markdown-textarea {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                padding: 20px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-color, #333);
                outline: none;
                resize: none;
                overflow-y: auto;
            }
            
            .markdown-textarea::placeholder {
                color: var(--text-color-secondary, #999);
                font-style: italic;
            }
            
            .markdown-preview {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                font-family: var(--font-family, 'Arial, sans-serif');
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-color, #333);
                overflow-y: auto;
            }
            
            .markdown-preview h1, .markdown-preview h2, .markdown-preview h3 {
                margin-top: 0;
                margin-bottom: 16px;
                color: var(--text-color, #333);
            }
            
            .markdown-preview h1 { font-size: 24px; }
            .markdown-preview h2 { font-size: 20px; }
            .markdown-preview h3 { font-size: 16px; }
            
            .markdown-preview p {
                margin-bottom: 16px;
            }
            
            .markdown-preview code {
                background: rgba(0, 0, 0, 0.1);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
            }
            
            .markdown-preview pre {
                background: rgba(0, 0, 0, 0.1);
                padding: 16px;
                border-radius: 5px;
                overflow-x: auto;
                margin-bottom: 16px;
            }
            
            .markdown-preview pre code {
                background: none;
                padding: 0;
            }
            
            .markdown-preview blockquote {
                border-left: 4px solid var(--primary-color, #007bff);
                margin: 0 0 16px 0;
                padding-left: 16px;
                color: var(--text-color-secondary, #666);
                font-style: italic;
            }
            
            .markdown-preview ul, .markdown-preview ol {
                margin-bottom: 16px;
                padding-left: 30px;
            }
            
            .markdown-preview li {
                margin-bottom: 4px;
            }
            
            .markdown-preview table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 16px;
            }
            
            .markdown-preview th, .markdown-preview td {
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px 12px;
                text-align: left;
            }
            
            .markdown-preview th {
                background: rgba(255, 255, 255, 0.1);
                font-weight: bold;
            }
            
            .markdown-preview a {
                color: var(--primary-color, #007bff);
                text-decoration: none;
            }
            
            .markdown-preview a:hover {
                text-decoration: underline;
            }
            
            .markdown-preview img {
                max-width: 100%;
                height: auto;
                border-radius: 5px;
                margin: 10px 0;
            }
            
            .markdown-preview hr {
                border: none;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                margin: 20px 0;
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
        `;
        document.head.appendChild(style);
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownEditorUtility;
} else if (typeof window !== 'undefined') {
    window.MarkdownEditorUtility = MarkdownEditorUtility;
}