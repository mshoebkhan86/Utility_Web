/**
 * Plain Text Editor Utility
 * Provides advanced plain text editing with syntax highlighting and code features
 */
class PlainTextEditorUtility extends DocumentEditorUtility {
    constructor() {
        super();
        this.editorType = 'plaintext';
        this.editor = null;
        this.container = null;
        this.lineNumbers = null;
        this.showLineNumbers = true;
        this.syntaxHighlighting = true;
        this.currentLanguage = 'text';
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 50;
        this.findDialog = null;
        this.replaceDialog = null;
        this.currentSearchTerm = '';
        this.searchResults = [];
        this.currentSearchIndex = -1;
    }

    /**
     * Initialize the plain text editor
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
        this.createNewDocument('text');
        this.updateLineNumbers();
        console.log('Plain Text Editor initialized');
    }

    /**
     * Create the editor interface
     */
    createEditor() {
        this.container.innerHTML = `
            <div class="plaintext-editor">
                <div class="editor-header">
                    <div class="editor-toolbar" id="plaintextToolbar"></div>
                    <div class="editor-info">
                        <div class="editor-title">
                            <span class="document-title" contenteditable="true">Untitled Document</span>
                            <select class="language-selector" id="languageSelector">
                                <option value="text">Plain Text</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="json">JSON</option>
                                <option value="xml">XML</option>
                                <option value="sql">SQL</option>
                                <option value="bash">Bash</option>
                                <option value="powershell">PowerShell</option>
                                <option value="yaml">YAML</option>
                                <option value="markdown">Markdown</option>
                            </select>
                        </div>
                        <div class="editor-stats">
                            <span class="word-count">0 words</span>
                            <span class="char-count">0 characters</span>
                            <span class="line-count">0 lines</span>
                            <span class="cursor-position">Ln 1, Col 1</span>
                        </div>
                    </div>
                </div>
                <div class="editor-content">
                    <div class="editor-main">
                        <div class="line-numbers" id="lineNumbers"></div>
                        <div class="editor-wrapper">
                            <textarea class="plaintext-textarea" 
                                     id="plaintextEditor"
                                     spellcheck="false"
                                     autocomplete="off"
                                     autocorrect="off"
                                     autocapitalize="off"
                                     placeholder="Start typing your text here..."></textarea>
                            <div class="syntax-overlay" id="syntaxOverlay"></div>
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
            
            <!-- Find/Replace Dialog -->
            <div class="find-dialog" id="findDialog" style="display: none;">
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h3>Find & Replace</h3>
                        <button class="close-btn" id="closeFindDialog">×</button>
                    </div>
                    <div class="dialog-body">
                        <div class="search-row">
                            <label>Find:</label>
                            <input type="text" id="findInput" placeholder="Enter search term">
                            <button id="findPrevBtn">↑</button>
                            <button id="findNextBtn">↓</button>
                        </div>
                        <div class="search-row">
                            <label>Replace:</label>
                            <input type="text" id="replaceInput" placeholder="Enter replacement">
                            <button id="replaceBtn">Replace</button>
                            <button id="replaceAllBtn">Replace All</button>
                        </div>
                        <div class="search-options">
                            <label><input type="checkbox" id="caseSensitive"> Case sensitive</label>
                            <label><input type="checkbox" id="wholeWord"> Whole word</label>
                            <label><input type="checkbox" id="useRegex"> Regular expression</label>
                        </div>
                        <div class="search-results">
                            <span id="searchResultsText">No results</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.editor = document.getElementById('plaintextEditor');
        this.lineNumbers = document.getElementById('lineNumbers');
        this.syntaxOverlay = document.getElementById('syntaxOverlay');
        this.findDialog = document.getElementById('findDialog');
        
        // Add CSS styles
        this.addEditorStyles();
    }

    /**
     * Setup the toolbar
     */
    setupToolbar() {
        const toolbarButtons = [
            { id: 'undo', icon: '↶', title: 'Undo', action: 'undo' },
            { id: 'redo', icon: '↷', title: 'Redo', action: 'redo' },
            { type: 'separator' },
            { id: 'find', icon: '🔍', title: 'Find & Replace', action: 'find' },
            { id: 'selectAll', icon: '⊞', title: 'Select All', action: 'selectAll' },
            { type: 'separator' },
            { id: 'toggleLineNumbers', icon: '#', title: 'Toggle Line Numbers', action: 'toggleLineNumbers' },
            { id: 'toggleSyntax', icon: '</>', title: 'Toggle Syntax Highlighting', action: 'toggleSyntax' },
            { id: 'toggleWordWrap', icon: '↩', title: 'Toggle Word Wrap', action: 'toggleWordWrap' },
            { type: 'separator' },
            { id: 'increaseFontSize', icon: 'A+', title: 'Increase Font Size', action: 'increaseFontSize' },
            { id: 'decreaseFontSize', icon: 'A-', title: 'Decrease Font Size', action: 'decreaseFontSize' },
            { type: 'separator' },
            { id: 'gotoLine', icon: '→', title: 'Go to Line', action: 'gotoLine' },
            { id: 'duplicateLine', icon: '⧉', title: 'Duplicate Line', action: 'duplicateLine' },
            { id: 'deleteLine', icon: '⌫', title: 'Delete Line', action: 'deleteLine' }
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
                            data-action="${button.action}">
                        ${button.icon}
                    </button>
                `;
            }
        });

        document.getElementById('plaintextToolbar').innerHTML = toolbarHTML;
        this.setupToolbarEvents();
    }

    /**
     * Setup toolbar event listeners
     */
    setupToolbarEvents() {
        document.getElementById('plaintextToolbar').addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
                const action = e.target.dataset.action;
                this.executeAction(action);
            }
        });
    }

    /**
     * Execute toolbar actions
     */
    executeAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'find':
                this.showFindDialog();
                break;
            case 'selectAll':
                this.selectAll();
                break;
            case 'toggleLineNumbers':
                this.toggleLineNumbers();
                break;
            case 'toggleSyntax':
                this.toggleSyntaxHighlighting();
                break;
            case 'toggleWordWrap':
                this.toggleWordWrap();
                break;
            case 'increaseFontSize':
                this.changeFontSize(1);
                break;
            case 'decreaseFontSize':
                this.changeFontSize(-1);
                break;
            case 'gotoLine':
                this.showGotoLineDialog();
                break;
            case 'duplicateLine':
                this.duplicateLine();
                break;
            case 'deleteLine':
                this.deleteLine();
                break;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        super.setupEventListeners();
        
        // Editor content changes
        this.editor.addEventListener('input', () => {
            this.updateLineNumbers();
            this.updateSyntaxHighlighting();
            this.markAsModified();
            this.updateStats();
            this.saveState();
        });

        // Cursor position changes
        this.editor.addEventListener('selectionchange', () => {
            this.updateCursorPosition();
        });

        this.editor.addEventListener('keyup', () => {
            this.updateCursorPosition();
        });

        this.editor.addEventListener('click', () => {
            this.updateCursorPosition();
        });

        // Scroll synchronization
        this.editor.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.editor.scrollTop;
            this.syntaxOverlay.scrollTop = this.editor.scrollTop;
            this.syntaxOverlay.scrollLeft = this.editor.scrollLeft;
        });

        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        this.showFindDialog();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showFindDialog();
                        break;
                    case 'g':
                        e.preventDefault();
                        this.showGotoLineDialog();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.duplicateLine();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.deleteLine();
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case '=':
                        e.preventDefault();
                        this.changeFontSize(1);
                        break;
                    case '-':
                        e.preventDefault();
                        this.changeFontSize(-1);
                        break;
                }
            }
            
            // Tab handling
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab(e.shiftKey);
            }
        });

        // Language selector
        document.getElementById('languageSelector').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateSyntaxHighlighting();
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

        // Find dialog events
        this.setupFindDialogEvents();
    }

    /**
     * Setup find dialog events
     */
    setupFindDialogEvents() {
        document.getElementById('closeFindDialog').addEventListener('click', () => {
            this.hideFindDialog();
        });

        document.getElementById('findInput').addEventListener('input', (e) => {
            this.currentSearchTerm = e.target.value;
            this.performSearch();
        });

        document.getElementById('findNextBtn').addEventListener('click', () => {
            this.findNext();
        });

        document.getElementById('findPrevBtn').addEventListener('click', () => {
            this.findPrevious();
        });

        document.getElementById('replaceBtn').addEventListener('click', () => {
            this.replaceCurrent();
        });

        document.getElementById('replaceAllBtn').addEventListener('click', () => {
            this.replaceAll();
        });

        // Search options
        ['caseSensitive', 'wholeWord', 'useRegex'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.performSearch();
            });
        });
    }

    /**
     * Update line numbers
     */
    updateLineNumbers() {
        if (!this.showLineNumbers) return;
        
        const lines = this.editor.value.split('\n');
        const lineCount = lines.length;
        
        let lineNumbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumbersHTML += `<div class="line-number">${i}</div>`;
        }
        
        this.lineNumbers.innerHTML = lineNumbersHTML;
    }

    /**
     * Update syntax highlighting
     */
    updateSyntaxHighlighting() {
        if (!this.syntaxHighlighting || this.currentLanguage === 'text') {
            this.syntaxOverlay.innerHTML = '';
            return;
        }
        
        const content = this.editor.value;
        const highlightedContent = this.highlightSyntax(content, this.currentLanguage);
        this.syntaxOverlay.innerHTML = highlightedContent;
    }

    /**
     * Basic syntax highlighting
     */
    highlightSyntax(content, language) {
        let highlighted = this.escapeHtml(content);
        
        switch (language) {
            case 'javascript':
                highlighted = this.highlightJavaScript(highlighted);
                break;
            case 'python':
                highlighted = this.highlightPython(highlighted);
                break;
            case 'html':
                highlighted = this.highlightHTML(highlighted);
                break;
            case 'css':
                highlighted = this.highlightCSS(highlighted);
                break;
            case 'json':
                highlighted = this.highlightJSON(highlighted);
                break;
            case 'xml':
                highlighted = this.highlightXML(highlighted);
                break;
            case 'sql':
                highlighted = this.highlightSQL(highlighted);
                break;
            case 'bash':
            case 'powershell':
                highlighted = this.highlightShell(highlighted);
                break;
            case 'yaml':
                highlighted = this.highlightYAML(highlighted);
                break;
            case 'markdown':
                highlighted = this.highlightMarkdown(highlighted);
                break;
        }
        
        return highlighted.replace(/\n/g, '<br>');
    }

    /**
     * JavaScript syntax highlighting
     */
    highlightJavaScript(content) {
        const keywords = ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'import', 'export', 'default', 'async', 'await', 'typeof', 'instanceof'];
        const types = ['String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'RegExp', 'Promise', 'Map', 'Set'];
        
        // Keywords
        keywords.forEach(keyword => {
            content = content.replace(new RegExp(`\\b${keyword}\\b`, 'g'), `<span class="keyword">${keyword}</span>`);
        });
        
        // Types
        types.forEach(type => {
            content = content.replace(new RegExp(`\\b${type}\\b`, 'g'), `<span class="type">${type}</span>`);
        });
        
        // Strings
        content = content.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="string">$&</span>');
        
        // Numbers
        content = content.replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
        
        // Comments
        content = content.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        content = content.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        
        return content;
    }

    /**
     * Python syntax highlighting
     */
    highlightPython(content) {
        const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'break', 'continue', 'pass', 'lambda', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None'];
        
        keywords.forEach(keyword => {
            content = content.replace(new RegExp(`\\b${keyword}\\b`, 'g'), `<span class="keyword">${keyword}</span>`);
        });
        
        // Strings
        content = content.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="string">$&</span>');
        
        // Numbers
        content = content.replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
        
        // Comments
        content = content.replace(/#.*$/gm, '<span class="comment">$&</span>');
        
        return content;
    }

    /**
     * HTML syntax highlighting
     */
    highlightHTML(content) {
        // Tags
        content = content.replace(/<\/?[^>]+>/g, '<span class="tag">$&</span>');
        
        // Attributes
        content = content.replace(/\s([a-zA-Z-]+)=/g, ' <span class="attribute">$1</span>=');
        
        // Attribute values
        content = content.replace(/=(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '=<span class="string">$1$2$1</span>');
        
        return content;
    }

    /**
     * CSS syntax highlighting
     */
    highlightCSS(content) {
        // Selectors
        content = content.replace(/^[^{]+(?={)/gm, '<span class="selector">$&</span>');
        
        // Properties
        content = content.replace(/([a-zA-Z-]+)\s*:/g, '<span class="property">$1</span>:');
        
        // Values
        content = content.replace(/:([^;]+);/g, ':<span class="value">$1</span>;');
        
        // Comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        
        return content;
    }

    /**
     * JSON syntax highlighting
     */
    highlightJSON(content) {
        // Strings (keys and values)
        content = content.replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>');
        
        // Numbers
        content = content.replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
        
        // Booleans and null
        content = content.replace(/\b(true|false|null)\b/g, '<span class="keyword">$&</span>');
        
        return content;
    }

    /**
     * XML syntax highlighting
     */
    highlightXML(content) {
        return this.highlightHTML(content); // Similar to HTML
    }

    /**
     * SQL syntax highlighting
     */
    highlightSQL(content) {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'EXISTS'];
        
        keywords.forEach(keyword => {
            content = content.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), `<span class="keyword">${keyword}</span>`);
        });
        
        // Strings
        content = content.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="string">$&</span>');
        
        // Comments
        content = content.replace(/--.*$/gm, '<span class="comment">$&</span>');
        
        return content;
    }

    /**
     * Shell syntax highlighting
     */
    highlightShell(content) {
        // Commands
        content = content.replace(/^\s*([a-zA-Z][a-zA-Z0-9_-]*)/gm, '<span class="keyword">$1</span>');
        
        // Strings
        content = content.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="string">$&</span>');
        
        // Comments
        content = content.replace(/#.*$/gm, '<span class="comment">$&</span>');
        
        // Variables
        content = content.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, '<span class="variable">$&</span>');
        
        return content;
    }

    /**
     * YAML syntax highlighting
     */
    highlightYAML(content) {
        // Keys
        content = content.replace(/^\s*([^:]+):/gm, '<span class="property">$1</span>:');
        
        // Strings
        content = content.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="string">$&</span>');
        
        // Comments
        content = content.replace(/#.*$/gm, '<span class="comment">$&</span>');
        
        // Booleans and null
        content = content.replace(/\b(true|false|null|yes|no)\b/gi, '<span class="keyword">$&</span>');
        
        return content;
    }

    /**
     * Markdown syntax highlighting
     */
    highlightMarkdown(content) {
        // Headers
        content = content.replace(/^(#{1,6})\s+(.*)$/gm, '<span class="keyword">$1</span> <span class="header">$2</span>');
        
        // Bold
        content = content.replace(/\*\*(.*?)\*\*/g, '<span class="bold">**$1**</span>');
        
        // Italic
        content = content.replace(/\*(.*?)\*/g, '<span class="italic">*$1*</span>');
        
        // Code
        content = content.replace(/`([^`]+)`/g, '<span class="code">`$1`</span>');
        
        // Links
        content = content.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<span class="link">[$1]($2)</span>');
        
        return content;
    }

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update cursor position display
     */
    updateCursorPosition() {
        const textarea = this.editor;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const lineNumber = lines.length;
        const columnNumber = lines[lines.length - 1].length + 1;
        
        document.querySelector('.cursor-position').textContent = `Ln ${lineNumber}, Col ${columnNumber}`;
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
     * Toggle line numbers
     */
    toggleLineNumbers() {
        this.showLineNumbers = !this.showLineNumbers;
        this.lineNumbers.style.display = this.showLineNumbers ? 'block' : 'none';
        
        if (this.showLineNumbers) {
            this.updateLineNumbers();
        }
    }

    /**
     * Toggle syntax highlighting
     */
    toggleSyntaxHighlighting() {
        this.syntaxHighlighting = !this.syntaxHighlighting;
        this.syntaxOverlay.style.display = this.syntaxHighlighting ? 'block' : 'none';
        
        if (this.syntaxHighlighting) {
            this.updateSyntaxHighlighting();
        }
    }

    /**
     * Toggle word wrap
     */
    toggleWordWrap() {
        const currentWrap = this.editor.style.whiteSpace;
        this.editor.style.whiteSpace = currentWrap === 'nowrap' ? 'pre-wrap' : 'nowrap';
        this.syntaxOverlay.style.whiteSpace = this.editor.style.whiteSpace;
    }

    /**
     * Change font size
     */
    changeFontSize(delta) {
        const currentSize = parseInt(getComputedStyle(this.editor).fontSize);
        const newSize = Math.max(8, Math.min(32, currentSize + delta));
        
        this.editor.style.fontSize = newSize + 'px';
        this.syntaxOverlay.style.fontSize = newSize + 'px';
        this.lineNumbers.style.fontSize = newSize + 'px';
    }

    /**
     * Select all text
     */
    selectAll() {
        this.editor.select();
    }

    /**
     * Insert tab or spaces
     */
    insertTab(reverse = false) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        const tabSize = 4;
        const tab = ' '.repeat(tabSize);
        
        if (start === end) {
            // Single cursor - insert/remove tab
            if (reverse) {
                // Remove tab if at beginning of tab
                const lineStart = value.lastIndexOf('\n', start - 1) + 1;
                const beforeCursor = value.substring(lineStart, start);
                if (beforeCursor.endsWith(tab)) {
                    this.editor.value = value.substring(0, start - tabSize) + value.substring(start);
                    this.editor.setSelectionRange(start - tabSize, start - tabSize);
                }
            } else {
                this.editor.value = value.substring(0, start) + tab + value.substring(end);
                this.editor.setSelectionRange(start + tabSize, start + tabSize);
            }
        } else {
            // Selection - indent/outdent lines
            const selectedText = value.substring(start, end);
            const lines = selectedText.split('\n');
            
            if (reverse) {
                // Outdent
                const outdentedLines = lines.map(line => {
                    if (line.startsWith(tab)) {
                        return line.substring(tabSize);
                    }
                    return line;
                });
                const newText = outdentedLines.join('\n');
                this.editor.value = value.substring(0, start) + newText + value.substring(end);
                this.editor.setSelectionRange(start, start + newText.length);
            } else {
                // Indent
                const indentedLines = lines.map(line => tab + line);
                const newText = indentedLines.join('\n');
                this.editor.value = value.substring(0, start) + newText + value.substring(end);
                this.editor.setSelectionRange(start, start + newText.length);
            }
        }
        
        this.updateLineNumbers();
        this.updateSyntaxHighlighting();
    }

    /**
     * Show goto line dialog
     */
    showGotoLineDialog() {
        const lineNumber = prompt('Go to line number:');
        if (lineNumber) {
            this.gotoLine(parseInt(lineNumber));
        }
    }

    /**
     * Go to specific line
     */
    gotoLine(lineNumber) {
        const lines = this.editor.value.split('\n');
        if (lineNumber > 0 && lineNumber <= lines.length) {
            let position = 0;
            for (let i = 0; i < lineNumber - 1; i++) {
                position += lines[i].length + 1; // +1 for newline
            }
            this.editor.setSelectionRange(position, position);
            this.editor.focus();
        }
    }

    /**
     * Duplicate current line
     */
    duplicateLine() {
        const start = this.editor.selectionStart;
        const value = this.editor.value;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
        
        const insertPos = lineEnd === -1 ? value.length : lineEnd;
        this.editor.value = value.substring(0, insertPos) + '\n' + line + value.substring(insertPos);
        this.editor.setSelectionRange(insertPos + 1 + line.length, insertPos + 1 + line.length);
        
        this.updateLineNumbers();
        this.updateSyntaxHighlighting();
        this.saveState();
    }

    /**
     * Delete current line
     */
    deleteLine() {
        const start = this.editor.selectionStart;
        const value = this.editor.value;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        
        let deleteStart = lineStart;
        let deleteEnd = lineEnd === -1 ? value.length : lineEnd + 1;
        
        // If it's the first line and there are more lines, don't delete the newline
        if (lineStart === 0 && lineEnd !== -1) {
            deleteEnd = lineEnd;
        }
        
        this.editor.value = value.substring(0, deleteStart) + value.substring(deleteEnd);
        this.editor.setSelectionRange(deleteStart, deleteStart);
        
        this.updateLineNumbers();
        this.updateSyntaxHighlighting();
        this.saveState();
    }

    /**
     * Show find dialog
     */
    showFindDialog() {
        this.findDialog.style.display = 'block';
        document.getElementById('findInput').focus();
    }

    /**
     * Hide find dialog
     */
    hideFindDialog() {
        this.findDialog.style.display = 'none';
        this.clearSearchHighlights();
        this.editor.focus();
    }

    /**
     * Perform search
     */
    performSearch() {
        this.clearSearchHighlights();
        
        if (!this.currentSearchTerm) {
            document.getElementById('searchResultsText').textContent = 'No results';
            return;
        }
        
        const content = this.editor.value;
        const caseSensitive = document.getElementById('caseSensitive').checked;
        const wholeWord = document.getElementById('wholeWord').checked;
        const useRegex = document.getElementById('useRegex').checked;
        
        let searchPattern;
        
        if (useRegex) {
            try {
                searchPattern = new RegExp(this.currentSearchTerm, caseSensitive ? 'g' : 'gi');
            } catch (e) {
                document.getElementById('searchResultsText').textContent = 'Invalid regex';
                return;
            }
        } else {
            let pattern = this.escapeRegExp(this.currentSearchTerm);
            if (wholeWord) {
                pattern = `\\b${pattern}\\b`;
            }
            searchPattern = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
        }
        
        this.searchResults = [];
        let match;
        
        while ((match = searchPattern.exec(content)) !== null) {
            this.searchResults.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[0]
            });
            
            // Prevent infinite loop with zero-length matches
            if (match.index === searchPattern.lastIndex) {
                searchPattern.lastIndex++;
            }
        }
        
        if (this.searchResults.length > 0) {
            this.currentSearchIndex = 0;
            this.highlightSearchResults();
            this.jumpToSearchResult(0);
            document.getElementById('searchResultsText').textContent = 
                `${this.searchResults.length} result${this.searchResults.length > 1 ? 's' : ''}`;
        } else {
            document.getElementById('searchResultsText').textContent = 'No results';
        }
    }

    /**
     * Find next result
     */
    findNext() {
        if (this.searchResults.length === 0) return;
        
        this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length;
        this.jumpToSearchResult(this.currentSearchIndex);
    }

    /**
     * Find previous result
     */
    findPrevious() {
        if (this.searchResults.length === 0) return;
        
        this.currentSearchIndex = this.currentSearchIndex === 0 ? 
            this.searchResults.length - 1 : this.currentSearchIndex - 1;
        this.jumpToSearchResult(this.currentSearchIndex);
    }

    /**
     * Jump to search result
     */
    jumpToSearchResult(index) {
        if (index < 0 || index >= this.searchResults.length) return;
        
        const result = this.searchResults[index];
        this.editor.setSelectionRange(result.start, result.end);
        this.editor.focus();
        
        // Update result counter
        document.getElementById('searchResultsText').textContent = 
            `${index + 1} of ${this.searchResults.length}`;
    }

    /**
     * Replace current selection
     */
    replaceCurrent() {
        if (this.currentSearchIndex === -1 || this.searchResults.length === 0) return;
        
        const replacement = document.getElementById('replaceInput').value;
        const result = this.searchResults[this.currentSearchIndex];
        
        this.editor.setSelectionRange(result.start, result.end);
        document.execCommand('insertText', false, replacement);
        
        // Re-perform search to update results
        this.performSearch();
        this.saveState();
    }

    /**
     * Replace all occurrences
     */
    replaceAll() {
        if (this.searchResults.length === 0) return;
        
        const replacement = document.getElementById('replaceInput').value;
        let content = this.editor.value;
        let offset = 0;
        
        this.searchResults.forEach(result => {
            const start = result.start + offset;
            const end = result.end + offset;
            
            content = content.substring(0, start) + replacement + content.substring(end);
            offset += replacement.length - (result.end - result.start);
        });
        
        this.editor.value = content;
        this.performSearch();
        this.saveState();
        
        alert(`Replaced ${this.searchResults.length} occurrence${this.searchResults.length > 1 ? 's' : ''}`);
    }

    /**
     * Highlight search results
     */
    highlightSearchResults() {
        // This would require more complex implementation with overlays
        // For now, we'll just use the selection to highlight current result
    }

    /**
     * Clear search highlights
     */
    clearSearchHighlights() {
        this.searchResults = [];
        this.currentSearchIndex = -1;
    }

    /**
     * Escape regular expression characters
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
            this.updateLineNumbers();
            this.updateSyntaxHighlighting();
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
            this.updateLineNumbers();
            this.updateSyntaxHighlighting();
        }
    }

    /**
     * New document
     */
    newDocument() {
        if (this.isModified && !confirm('You have unsaved changes. Create new document anyway?')) {
            return;
        }
        
        this.createNewDocument('text');
        this.editor.value = '';
        document.querySelector('.document-title').textContent = 'Untitled Document';
        document.getElementById('languageSelector').value = 'text';
        this.currentLanguage = 'text';
        this.undoStack = [];
        this.redoStack = [];
        this.updateLineNumbers();
        this.updateSyntaxHighlighting();
        this.updateStats();
    }

    /**
     * Open document
     */
    openDocument() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.js,.py,.html,.css,.json,.xml,.sql,.sh,.ps1,.yml,.yaml,.md';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const doc = await this.loadDocument(file);
                    this.editor.value = doc.content;
                    document.querySelector('.document-title').textContent = doc.title;
                    
                    // Auto-detect language from file extension
                    const extension = file.name.split('.').pop().toLowerCase();
                    const languageMap = {
                        'js': 'javascript',
                        'py': 'python',
                        'html': 'html',
                        'css': 'css',
                        'json': 'json',
                        'xml': 'xml',
                        'sql': 'sql',
                        'sh': 'bash',
                        'ps1': 'powershell',
                        'yml': 'yaml',
                        'yaml': 'yaml',
                        'md': 'markdown'
                    };
                    
                    const detectedLanguage = languageMap[extension] || 'text';
                    document.getElementById('languageSelector').value = detectedLanguage;
                    this.currentLanguage = detectedLanguage;
                    
                    this.updateLineNumbers();
                    this.updateSyntaxHighlighting();
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
        const format = prompt('Export format (txt, js, py, html, css, json, xml, sql, sh, ps1, yml, md):', 'txt');
        if (format) {
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
        const editor = document.querySelector('.plaintext-editor');
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
            .plaintext-editor {
                display: flex;
                flex-direction: column;
                height: 100%;
                background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
                font-family: 'Courier New', monospace;
            }
            
            .plaintext-editor.fullscreen {
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
                font-family: inherit;
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
                gap: 10px;
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
                font-family: inherit;
            }
            
            .document-title:focus {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .language-selector {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                padding: 5px 10px;
                color: var(--text-color, #333);
                font-size: 12px;
                font-family: inherit;
            }
            
            .editor-stats {
                display: flex;
                gap: 15px;
                font-size: 12px;
                color: var(--text-color-secondary, #666);
                font-family: inherit;
            }
            
            .editor-content {
                flex: 1;
                overflow: hidden;
            }
            
            .editor-main {
                display: flex;
                height: 100%;
                position: relative;
            }
            
            .line-numbers {
                background: rgba(255, 255, 255, 0.05);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px 10px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-color-secondary, #666);
                text-align: right;
                user-select: none;
                overflow: hidden;
                min-width: 50px;
            }
            
            .line-number {
                height: 1.6em;
            }
            
            .editor-wrapper {
                flex: 1;
                position: relative;
                overflow: hidden;
            }
            
            .plaintext-textarea {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                border: none;
                padding: 20px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-color, #333);
                outline: none;
                resize: none;
                overflow: auto;
                white-space: pre;
                z-index: 2;
            }
            
            .plaintext-textarea::placeholder {
                color: var(--text-color-secondary, #999);
                font-style: italic;
            }
            
            .syntax-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 20px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                color: transparent;
                pointer-events: none;
                overflow: auto;
                white-space: pre;
                z-index: 1;
            }
            
            .syntax-overlay .keyword {
                color: #0066cc;
                font-weight: bold;
            }
            
            .syntax-overlay .string {
                color: #009900;
            }
            
            .syntax-overlay .number {
                color: #cc6600;
            }
            
            .syntax-overlay .comment {
                color: #999999;
                font-style: italic;
            }
            
            .syntax-overlay .tag {
                color: #cc0066;
            }
            
            .syntax-overlay .attribute {
                color: #6600cc;
            }
            
            .syntax-overlay .property {
                color: #0066cc;
            }
            
            .syntax-overlay .value {
                color: #009900;
            }
            
            .syntax-overlay .selector {
                color: #cc0066;
            }
            
            .syntax-overlay .type {
                color: #6600cc;
            }
            
            .syntax-overlay .variable {
                color: #cc6600;
            }
            
            .syntax-overlay .header {
                color: #0066cc;
                font-weight: bold;
            }
            
            .syntax-overlay .bold {
                font-weight: bold;
            }
            
            .syntax-overlay .italic {
                font-style: italic;
            }
            
            .syntax-overlay .code {
                background: rgba(0, 0, 0, 0.1);
                padding: 2px;
                border-radius: 3px;
            }
            
            .syntax-overlay .link {
                color: #0066cc;
                text-decoration: underline;
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
                font-family: inherit;
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
            
            .find-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--glass-bg, rgba(255, 255, 255, 0.95));
                border-radius: 10px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                min-width: 400px;
            }
            
            .dialog-content {
                padding: 0;
            }
            
            .dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .dialog-header h3 {
                margin: 0;
                color: var(--text-color, #333);
                font-family: inherit;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--text-color, #333);
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .dialog-body {
                padding: 20px;
            }
            
            .search-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .search-row label {
                min-width: 60px;
                color: var(--text-color, #333);
                font-family: inherit;
            }
            
            .search-row input[type="text"] {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color, #333);
                font-family: inherit;
            }
            
            .search-row button {
                padding: 8px 12px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color, #333);
                cursor: pointer;
                font-family: inherit;
            }
            
            .search-row button:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .search-options {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .search-options label {
                display: flex;
                align-items: center;
                gap: 5px;
                color: var(--text-color, #333);
                font-family: inherit;
                cursor: pointer;
            }
            
            .search-options input[type="checkbox"] {
                margin: 0;
            }
            
            .search-results {
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                font-size: 12px;
                color: var(--text-color-secondary, #666);
                font-family: inherit;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlainTextEditorUtility;
} else if (typeof window !== 'undefined') {
    window.PlainTextEditorUtility = PlainTextEditorUtility;
}