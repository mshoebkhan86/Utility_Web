/**
 * Unified Code Formatter Utility
 * A comprehensive code formatting tool supporting multiple programming languages
 * Features: Format, minify, validate, syntax highlighting, language detection
 * Supported: JSON, SQL, HTML, CSS, JavaScript, Python, XML, YAML, Markdown
 */

class CodeFormatterUtility {
    constructor() {
        this.container = null;
        this.inputArea = null;
        this.outputArea = null;
        this.errorDisplay = null;
        this.statusDisplay = null;
        this.languageSelector = null;
        this.history = [];
        this.maxHistorySize = 50;
        this.currentLanguage = 'auto';
        this.settings = {
            indentSize: 2,
            theme: 'light',
            autoDetect: true,
            autoFormat: false,
            syntaxHighlighting: true,
            lineNumbers: true,
            wordWrap: true,
            // Language-specific settings
            json: {
                sortKeys: false,
                escapeUnicode: false,
                compactArrays: false
            },
            sql: {
                keywordCase: 'upper',
                identifierCase: 'preserve',
                commaPosition: 'trailing',
                maxLineLength: 120
            },
            html: {
                preserveNewlines: true,
                maxPreserveNewlines: 2,
                indentInnerHtml: true
            },
            css: {
                selectorSeparateLines: true,
                bracesOnNewLine: false
            },
            javascript: {
                semicolons: true,
                quotes: 'single',
                trailingCommas: true
            }
        };
        
        // Language definitions
        this.languages = {
            json: {
                name: 'JSON',
                icon: '📄',
                extensions: ['.json'],
                mimeTypes: ['application/json'],
                keywords: [],
                patterns: {
                    detect: /^\s*[{\[].*[}\]]\s*$/s,
                    validate: (text) => {
                        try {
                            JSON.parse(text);
                            return true;
                        } catch {
                            return false;
                        }
                    }
                }
            },
            sql: {
                name: 'SQL',
                icon: '🗄️',
                extensions: ['.sql'],
                mimeTypes: ['application/sql'],
                keywords: [
                    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
                    'TABLE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'DATABASE', 'SCHEMA',
                    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON', 'USING',
                    'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT',
                    'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'EXISTS', 'BETWEEN', 'CASE',
                    'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'WHILE', 'FOR', 'LOOP', 'BEGIN', 'COMMIT'
                ],
                patterns: {
                    detect: /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i
                }
            },
            html: {
                name: 'HTML',
                icon: '🌐',
                extensions: ['.html', '.htm'],
                mimeTypes: ['text/html'],
                keywords: [],
                patterns: {
                    detect: /<\/?[a-z][\s\S]*>/i
                }
            },
            css: {
                name: 'CSS',
                icon: '🎨',
                extensions: ['.css'],
                mimeTypes: ['text/css'],
                keywords: [],
                patterns: {
                    detect: /[a-z-]+\s*:\s*[^;]+;|[a-z-]+\s*{[^}]*}/i
                }
            },
            javascript: {
                name: 'JavaScript',
                icon: '⚡',
                extensions: ['.js', '.mjs'],
                mimeTypes: ['application/javascript'],
                keywords: [
                    'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch',
                    'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally',
                    'throw', 'new', 'this', 'super', 'class', 'extends', 'import', 'export'
                ],
                patterns: {
                    detect: /\b(function|var|let|const|class|import|export)\b/
                }
            },
            python: {
                name: 'Python',
                icon: '🐍',
                extensions: ['.py'],
                mimeTypes: ['text/x-python'],
                keywords: [
                    'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally',
                    'import', 'from', 'as', 'return', 'yield', 'lambda', 'with', 'pass', 'break', 'continue'
                ],
                patterns: {
                    detect: /\b(def|class|import|from)\b.*:/
                }
            },
            xml: {
                name: 'XML',
                icon: '📋',
                extensions: ['.xml'],
                mimeTypes: ['application/xml', 'text/xml'],
                keywords: [],
                patterns: {
                    detect: /<\?xml|<\/?[a-z][\s\S]*>/i
                }
            },
            yaml: {
                name: 'YAML',
                icon: '📝',
                extensions: ['.yml', '.yaml'],
                mimeTypes: ['application/x-yaml'],
                keywords: [],
                patterns: {
                    detect: /^\s*[a-z_][a-z0-9_]*\s*:/im
                }
            },
            markdown: {
                name: 'Markdown',
                icon: '📖',
                extensions: ['.md', '.markdown'],
                mimeTypes: ['text/markdown'],
                keywords: [],
                patterns: {
                    detect: /^#{1,6}\s+|\*\*.*\*\*|\*.*\*|`.*`|\[.*\]\(.*\)/m
                }
            }
        };
        
        this.loadSettings();
    }

    /**
     * Initialize the Code Formatter
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID '${containerId}' not found`);
        }

        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        
        console.log('Code Formatter Utility initialized successfully');
    }

    /**
     * Create the main interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="code-formatter">
                <div class="formatter-header">
                    <div class="header-title">
                        <h2>🔧 Universal Code Formatter</h2>
                        <p>Format, validate, and beautify code in multiple languages</p>
                    </div>
                    <div class="language-selector">
                        <label for="languageSelect">Language:</label>
                        <select id="languageSelect" class="language-select">
                            <option value="auto">🔍 Auto Detect</option>
                            ${Object.entries(this.languages).map(([key, lang]) => 
                                `<option value="${key}">${lang.icon} ${lang.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="formatter-controls">
                    <div class="control-group">
                        <button class="btn btn-primary" id="formatBtn" title="Format Code (Ctrl+F)">
                            <i class="fas fa-magic"></i> Format
                        </button>
                        <button class="btn btn-success" id="autoFormatBtn" title="Auto-detect and Format (Ctrl+A)">
                            <i class="fas fa-wand-magic-sparkles"></i> Auto Format
                        </button>
                        <button class="btn btn-secondary" id="minifyBtn" title="Minify Code (Ctrl+M)">
                            <i class="fas fa-compress-alt"></i> Minify
                        </button>
                        <button class="btn btn-info" id="validateBtn" title="Validate Code (Ctrl+V)">
                            <i class="fas fa-check-circle"></i> Validate
                        </button>
                    </div>
                    <div class="control-group">
                        <button class="btn btn-outline" id="clearBtn" title="Clear All (Ctrl+Del)">
                            <i class="fas fa-trash"></i> Clear
                        </button>
                        <button class="btn btn-outline" id="copyBtn" title="Copy Output (Ctrl+C)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <button class="btn btn-outline" id="downloadBtn" title="Download (Ctrl+S)">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                    <div class="control-group">
                        <button class="btn btn-settings" id="settingsBtn" title="Settings">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                        <button class="btn btn-history" id="historyBtn" title="History">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>
                
                <div class="formatter-status" id="statusDisplay">
                    <div class="status-info">
                        <span class="status-text">Ready</span>
                        <span class="detected-language" id="detectedLanguage"></span>
                    </div>
                    <div class="code-stats" id="codeStats"></div>
                </div>
                
                <div class="formatter-content">
                    <div class="input-section">
                        <div class="section-header">
                            <h3>Input Code</h3>
                            <div class="input-controls">
                                <button class="btn btn-small" id="loadSampleBtn">Load Sample</button>
                                <button class="btn btn-small" id="loadFileBtn">Load File</button>
                                <input type="file" id="fileInput" style="display: none;">
                            </div>
                        </div>
                        <div class="editor-container">
                            <div class="line-numbers" id="inputLineNumbers"></div>
                            <textarea id="codeInput" class="code-input" placeholder="Paste your code here..."></textarea>
                        </div>
                    </div>
                    
                    <div class="output-section">
                        <div class="section-header">
                            <h3>Formatted Output</h3>
                            <div class="output-controls">
                                <button class="btn btn-small" id="highlightToggleBtn">Toggle Highlighting</button>
                                <button class="btn btn-small" id="lineNumbersToggleBtn">Toggle Line Numbers</button>
                            </div>
                        </div>
                        <div class="editor-container">
                            <div class="line-numbers" id="outputLineNumbers"></div>
                            <div id="codeOutput" class="code-output"></div>
                        </div>
                    </div>
                </div>
                
                <div class="error-display" id="errorDisplay" style="display: none;"></div>
                
                <!-- Settings Panel -->
                <div class="settings-panel" id="settingsPanel" style="display: none;">
                    <div class="settings-content">
                        <h3>Formatter Settings</h3>
                        <div class="settings-grid">
                            <div class="setting-group">
                                <label>Indent Size:</label>
                                <select id="indentSize">
                                    <option value="2">2 spaces</option>
                                    <option value="4">4 spaces</option>
                                    <option value="8">8 spaces</option>
                                    <option value="\t">Tab</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>Theme:</label>
                                <select id="themeSelect">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="autoDetectCheck"> Auto-detect language
                                </label>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="autoFormatCheck"> Auto-format on input
                                </label>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="syntaxHighlightCheck"> Syntax highlighting
                                </label>
                            </div>
                        </div>
                        <div class="settings-actions">
                            <button class="btn btn-primary" id="saveSettingsBtn">Save Settings</button>
                            <button class="btn btn-secondary" id="resetSettingsBtn">Reset to Default</button>
                        </div>
                    </div>
                </div>
                
                <!-- History Panel -->
                <div class="history-panel" id="historyPanel" style="display: none;">
                    <div class="history-content">
                        <h3>Format History</h3>
                        <div class="history-list" id="historyList"></div>
                        <div class="history-actions">
                            <button class="btn btn-secondary" id="clearHistoryBtn">Clear History</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Store references
        this.inputArea = document.getElementById('codeInput');
        this.outputArea = document.getElementById('codeOutput');
        this.errorDisplay = document.getElementById('errorDisplay');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.languageSelector = document.getElementById('languageSelect');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Control buttons
        document.getElementById('formatBtn').addEventListener('click', () => this.formatCode());
        document.getElementById('autoFormatBtn').addEventListener('click', () => this.autoFormat());
        document.getElementById('minifyBtn').addEventListener('click', () => this.minifyCode());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateCode());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyOutput());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCode());
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.toggleHistory());
        
        // Input controls
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSample());
        document.getElementById('loadFileBtn').addEventListener('click', () => this.loadFile());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));
        
        // Output controls
        document.getElementById('highlightToggleBtn').addEventListener('click', () => this.toggleSyntaxHighlighting());
        document.getElementById('lineNumbersToggleBtn').addEventListener('click', () => this.toggleLineNumbers());
        
        // Language selector
        this.languageSelector.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateLanguageDisplay();
            if (this.inputArea.value.trim()) {
                this.formatCode();
            }
        });
        
        // Input area
        this.inputArea.addEventListener('input', () => {
            this.onInputChange();
            this.updateLineNumbers('input');
        });
        
        this.inputArea.addEventListener('scroll', () => {
            this.syncScroll('input');
        });
        
        // Settings panel
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettingsBtn').addEventListener('click', () => this.resetSettings());
        
        // Settings checkboxes - update settings in real-time
        document.getElementById('autoDetectCheck').addEventListener('change', (e) => {
            this.settings.autoDetect = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('autoFormatCheck').addEventListener('change', (e) => {
            this.settings.autoFormat = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('syntaxHighlightCheck').addEventListener('change', (e) => {
            this.settings.syntaxHighlighting = e.target.checked;
            this.saveSettings();
            // Re-apply highlighting if output exists
            if (this.outputArea.textContent) {
                const language = this.outputArea.getAttribute('data-language') || 'plain';
                const content = this.outputArea.textContent;
                this.displayOutput(content, language);
            }
        });
        
        // History panel
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Initialize
        this.updateLanguageDisplay();
        this.updateLineNumbers('input');
    }

    /**
     * Handle input changes
     */
    onInputChange() {
        const input = this.inputArea.value.trim();
        
        if (input && this.settings.autoDetect && this.currentLanguage === 'auto') {
            const detectedLang = this.detectLanguage(input);
            this.updateDetectedLanguage(detectedLang);
            
            // Auto-format if enabled in settings
            if (this.settings.autoFormat) {
                clearTimeout(this.autoFormatTimeout);
                this.autoFormatTimeout = setTimeout(() => {
                    this.formatCode();
                }, 1000); // Delay to avoid formatting while typing
            }
        }
        
        this.updateStats(input);
        this.clearErrors();
        
        // Update line numbers
        this.updateLineNumbers('input');
        
        // Clear previous output if input changes significantly
        if (this.lastInputLength && Math.abs(input.length - this.lastInputLength) > 10) {
            this.outputArea.innerHTML = '';
            this.updateLineNumbers('output');
        }
        
        this.lastInputLength = input.length;
    }

    /**
     * Auto-format code based on detected language
     */
    autoFormat() {
        const code = this.inputArea.value;
        if (!code.trim()) {
            this.showStatus('Please enter some code to format', 'error');
            return;
        }
        
        const detectedLanguage = this.detectLanguage(code);
        
        if (detectedLanguage !== 'plain') {
            // Update language selector
            this.currentLanguage = detectedLanguage;
            this.updateLanguageDisplay();
            this.updateDetectedLanguage(detectedLanguage);
            
            // Auto-format with detected language
            this.formatCode();
            
            // Show success message
            this.showStatus(`Auto-detected ${detectedLanguage.toUpperCase()} and formatted successfully`, 'success');
        } else {
            // If auto-detection fails, try to format as plain text or show options
            this.showStatus('Could not detect language automatically. Please select manually.', 'info');
            
            // Highlight the language selector to draw attention
            const languageSelect = this.container.querySelector('.language-select');
            if (languageSelect) {
                languageSelect.style.border = '2px solid #ffc107';
                setTimeout(() => {
                    languageSelect.style.border = '';
                }, 2000);
            }
        }
    }

    /**
     * Detect programming language from code content
     */
    detectLanguage(code) {
        if (!code || !code.trim()) return 'plain';
        
        const trimmed = code.trim();
        const lines = trimmed.split('\n');
        const firstLine = lines[0].trim();
        
        // Enhanced JSON detection
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                JSON.parse(trimmed);
                return 'json';
            } catch (e) {
                // Check for JSON-like structure even if invalid
                if (/^\s*[{\[]/.test(trimmed) && /[}\]]\s*$/.test(trimmed) &&
                    /"[^"]*"\s*:/.test(trimmed)) {
                    return 'json';
                }
            }
        }
        
        // Enhanced HTML detection
        if (trimmed.includes('<!DOCTYPE') || 
            trimmed.includes('<html') ||
            /<\/?[a-z][\s\S]*>/i.test(trimmed) ||
            /<(div|span|p|h[1-6]|body|head|title|meta|link|script|style)/i.test(trimmed)) {
            return 'html';
        }
        
        // Enhanced XML detection
        if (trimmed.startsWith('<?xml') || 
            (trimmed.startsWith('<') && !trimmed.includes('<!DOCTYPE') && 
             !/<(div|span|p|h[1-6]|body|head|title|meta|link|script|style)/i.test(trimmed))) {
            return 'xml';
        }
        
        // Enhanced CSS detection
        if ((/\.[a-zA-Z][a-zA-Z0-9_-]*\s*\{/.test(trimmed) ||
             /#[a-zA-Z][a-zA-Z0-9_-]*\s*\{/.test(trimmed) ||
             /[a-zA-Z][a-zA-Z0-9_-]*\s*\{/.test(trimmed)) &&
            /[a-zA-Z-]+\s*:\s*[^;]+;/.test(trimmed)) {
            return 'css';
        }
        
        // Enhanced SQL detection
        if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE)\b/i.test(trimmed) ||
            /\b(FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|UNION)\b/i.test(trimmed) ||
            /\b(TABLE|DATABASE|INDEX|VIEW|PROCEDURE|FUNCTION)\b/i.test(trimmed)) {
            return 'sql';
        }
        
        // Enhanced JavaScript detection
        if (/\b(function|const|let|var|=>|class|import|export|require)\b/.test(trimmed) ||
            /console\.(log|error|warn|info)/.test(trimmed) ||
            /document\.(getElementById|querySelector|createElement)/.test(trimmed) ||
            /window\.|localStorage\.|sessionStorage\./.test(trimmed) ||
            /\$\(/.test(trimmed) || // jQuery
            /React\.|useState|useEffect/.test(trimmed)) { // React
            return 'javascript';
        }
        
        // Enhanced Python detection
        if (/\b(def|import|from|class|if __name__|elif|except|finally|with|as)\b/.test(trimmed) ||
            /print\s*\(/.test(trimmed) ||
            /\brange\s*\(/.test(trimmed) ||
            /\blen\s*\(/.test(trimmed) ||
            /^\s*#.*python/i.test(firstLine) ||
            /^#!/.test(firstLine) && /python/i.test(firstLine)) {
            return 'python';
        }
        
        // Enhanced YAML detection
        if ((/^[a-zA-Z_][a-zA-Z0-9_]*:\s*/.test(trimmed) ||
             /^\s*-\s+[a-zA-Z_]/.test(trimmed)) &&
            !trimmed.includes('{') && !trimmed.includes('<') &&
            !trimmed.includes(';') && lines.length > 1) {
            return 'yaml';
        }
        
        // Enhanced Markdown detection
        if (/^#{1,6}\s/.test(trimmed) || 
            trimmed.includes('```') ||
            /\*\*.*\*\*/.test(trimmed) || 
            /_.*_/.test(trimmed) ||
            /\[.*\]\(.*\)/.test(trimmed) || // Links
            /^\s*[-*+]\s/.test(trimmed) || // Lists
            /^\s*\d+\.\s/.test(trimmed) || // Numbered lists
            /^>\s/.test(trimmed)) { // Blockquotes
            return 'markdown';
        }
        
        // Fallback to original scoring system for edge cases
        const scores = {};
        
        // Initialize scores
        Object.keys(this.languages).forEach(lang => {
            scores[lang] = 0;
        });
        
        // Test patterns
        Object.entries(this.languages).forEach(([key, lang]) => {
            if (lang.patterns && lang.patterns.detect && lang.patterns.detect.test(code)) {
                scores[key] += 10;
            }
            
            // Test validation for specific languages
            if (lang.patterns && lang.patterns.validate && lang.patterns.validate(code)) {
                scores[key] += 20;
            }
            
            // Test keywords
            if (lang.keywords && lang.keywords.length > 0) {
                const keywordMatches = lang.keywords.filter(keyword => 
                    new RegExp(`\\b${keyword}\\b`, 'i').test(code)
                ).length;
                scores[key] += keywordMatches * 2;
            }
        });
        
        // Find language with highest score
        const bestMatch = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        );
        
        return bestMatch[1] > 0 ? bestMatch[0] : 'plain';
    }

    /**
     * Format code based on detected/selected language
     */
    formatCode() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showError('Please enter some code to format.');
            return;
        }
        
        this.clearErrors();
        this.showStatus('Formatting code...', 'info');
        
        try {
            const language = this.currentLanguage === 'auto' ? this.detectLanguage(input) : this.currentLanguage;
            let formatted;
            
            switch (language) {
                case 'json':
                    formatted = this.formatJSON(input);
                    break;
                case 'sql':
                    formatted = this.formatSQL(input);
                    break;
                case 'html':
                    formatted = this.formatHTML(input);
                    break;
                case 'css':
                    formatted = this.formatCSS(input);
                    break;
                case 'javascript':
                    formatted = this.formatJavaScript(input);
                    break;
                case 'python':
                    formatted = this.formatPython(input);
                    break;
                case 'xml':
                    formatted = this.formatXML(input);
                    break;
                case 'yaml':
                    formatted = this.formatYAML(input);
                    break;
                case 'markdown':
                    formatted = this.formatMarkdown(input);
                    break;
                default:
                    formatted = this.formatPlainText(input);
            }
            
            this.displayOutput(formatted, language);
            this.addToHistory('format', input, formatted, language);
            this.showStatus(`Code formatted successfully as ${this.languages[language]?.name || 'Plain Text'}`, 'success');
            
        } catch (error) {
            this.showError('Formatting failed: ' + error.message);
        }
    }

    /**
     * Minify code
     */
    minifyCode() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showError('Please enter some code to minify.');
            return;
        }
        
        this.clearErrors();
        this.showStatus('Minifying code...', 'info');
        
        try {
            const language = this.currentLanguage === 'auto' ? this.detectLanguage(input) : this.currentLanguage;
            let minified;
            
            switch (language) {
                case 'json':
                    minified = this.minifyJSON(input);
                    break;
                case 'sql':
                    minified = this.minifySQL(input);
                    break;
                case 'html':
                    minified = this.minifyHTML(input);
                    break;
                case 'css':
                    minified = this.minifyCSS(input);
                    break;
                case 'javascript':
                    minified = this.minifyJavaScript(input);
                    break;
                default:
                    minified = this.minifyGeneric(input);
            }
            
            this.displayOutput(minified, language);
            this.addToHistory('minify', input, minified, language);
            this.showStatus(`Code minified successfully`, 'success');
            
        } catch (error) {
            this.showError('Minification failed: ' + error.message);
        }
    }

    /**
     * Validate code
     */
    validateCode() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showError('Please enter some code to validate.');
            return;
        }
        
        this.clearErrors();
        this.showStatus('Validating code...', 'info');
        
        try {
            const language = this.currentLanguage === 'auto' ? this.detectLanguage(input) : this.currentLanguage;
            let validation;
            
            switch (language) {
                case 'json':
                    validation = this.validateJSON(input);
                    break;
                case 'sql':
                    validation = this.validateSQL(input);
                    break;
                case 'html':
                    validation = this.validateHTML(input);
                    break;
                case 'css':
                    validation = this.validateCSS(input);
                    break;
                case 'javascript':
                    validation = this.validateJavaScript(input);
                    break;
                case 'xml':
                    validation = this.validateXML(input);
                    break;
                case 'yaml':
                    validation = this.validateYAML(input);
                    break;
                default:
                    validation = { valid: true, message: 'Basic syntax check passed' };
            }
            
            if (validation.valid) {
                this.showStatus(`✅ ${validation.message}`, 'success');
            } else {
                this.showError(`❌ ${validation.message}`);
            }
            
        } catch (error) {
            this.showError('Validation failed: ' + error.message);
        }
    }

    /**
     * JSON Formatting Methods
     */
    formatJSON(input) {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, this.settings.indentSize);
    }

    minifyJSON(input) {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed);
    }

    validateJSON(input) {
        try {
            JSON.parse(input);
            return { valid: true, message: 'Valid JSON syntax' };
        } catch (error) {
            return { valid: false, message: `Invalid JSON: ${error.message}` };
        }
    }

    highlightJSON(content) {
        let highlighted = this.escapeHtml(content);
        
        // Highlight JSON keys
        highlighted = highlighted.replace(/"([^"]+)"\s*:/g, '<span class="json-key">"$1"</span>:');
        
        // Highlight string values
        highlighted = highlighted.replace(/:\s*"([^"]*)"/g, ': <span class="json-string">"$1"</span>');
        
        // Highlight numbers (integers and floats)
        highlighted = highlighted.replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>');
        
        // Highlight boolean and null values
        highlighted = highlighted.replace(/:\s*(true|false|null)/g, ': <span class="json-literal">$1</span>');
        
        // Highlight array/object brackets
        highlighted = highlighted.replace(/([\[\]{}])/g, '<span class="json-bracket">$1</span>');
        
        // Highlight commas
        highlighted = highlighted.replace(/(,)/g, '<span class="json-comma">$1</span>');
        
        return highlighted;
    }

    /**
     * SQL Formatting Methods
     */
    formatSQL(input) {
        const keywords = this.languages.sql.keywords;
        let formatted = input;
        
        // Basic SQL formatting
        formatted = formatted.replace(/\s+/g, ' ').trim();
        
        // Add line breaks after major keywords
        const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'];
        majorKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        });
        
        // Indent subqueries and conditions
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const indentStr = ' '.repeat(this.settings.indentSize);
        
        return lines.map(line => {
            line = line.trim();
            if (line.includes('(')) indentLevel++;
            const result = indentStr.repeat(Math.max(0, indentLevel)) + line;
            if (line.includes(')')) indentLevel--;
            return result;
        }).join('\n');
    }

    minifySQL(input) {
        return input.replace(/\s+/g, ' ').trim();
    }

    validateSQL(input) {
        // Basic SQL validation
        const hasKeywords = this.languages.sql.keywords.some(keyword => 
            new RegExp(`\\b${keyword}\\b`, 'i').test(input)
        );
        
        if (!hasKeywords) {
            return { valid: false, message: 'No SQL keywords detected' };
        }
        
        // Check for balanced parentheses
        const openParens = (input.match(/\(/g) || []).length;
        const closeParens = (input.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
            return { valid: false, message: 'Unbalanced parentheses' };
        }
        
        return { valid: true, message: 'Basic SQL syntax appears valid' };
    }

    highlightSQL(content) {
        let highlighted = content;
        
        // Highlight keywords
        this.languages.sql.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-keyword">${keyword.toUpperCase()}</span>`);
        });
        
        // Highlight strings
        highlighted = highlighted.replace(/'([^']*)'/g, '<span class="sql-string">\"$1\"</span>');
        
        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="sql-number">$1</span>');
        
        return highlighted;
    }

    /**
     * HTML Formatting Methods
     */
    formatHTML(input) {
        let formatted = input;
        const indentStr = ' '.repeat(this.settings.indentSize);
        let indentLevel = 0;
        
        // Remove extra whitespace
        formatted = formatted.replace(/\s+/g, ' ').trim();
        
        // Add line breaks around tags
        formatted = formatted.replace(/></g, '>\n<');
        
        const lines = formatted.split('\n');
        return lines.map(line => {
            line = line.trim();
            if (line.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            const result = indentStr.repeat(indentLevel) + line;
            if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
                indentLevel++;
            }
            return result;
        }).join('\n');
    }

    minifyHTML(input) {
        return input.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
    }

    validateHTML(input) {
        // Basic HTML validation
        const parser = new DOMParser();
        const doc = parser.parseFromString(input, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        
        if (errors.length > 0) {
            return { valid: false, message: 'HTML parsing errors detected' };
        }
        
        return { valid: true, message: 'HTML structure appears valid' };
    }

    highlightHTML(content) {
        content = this.escapeHtml(content);
        
        return content
            // HTML comments
            .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="html-comment">$1</span>')
            // DOCTYPE declarations
            .replace(/(&lt;!DOCTYPE[^&gt;]*&gt;)/gi, '<span class="html-doctype">$1</span>')
            // Opening and closing tags
            .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^&gt;]*)?)(&gt;)/g, 
                '<span class="html-tag">$1</span><span class="html-tag-name">$2</span>$3<span class="html-tag">$4</span>')
            // Attributes (name="value" or name='value')
            .replace(/(\s+)([a-zA-Z-]+)(=)(["'])([^"']*?)\4/g, 
                '$1<span class="html-attr">$2</span>$3$4<span class="html-attr-value">$5</span>$4')
            // Self-closing tag indicators
            .replace(/(\/)(&gt;)/g, '<span class="html-tag">$1$2</span>');
    }

    /**
     * CSS Formatting Methods
     */
    formatCSS(input) {
        let formatted = input;
        const indentStr = ' '.repeat(this.settings.indentSize);
        
        // Add line breaks and indentation
        formatted = formatted.replace(/\{/g, ' {\n');
        formatted = formatted.replace(/\}/g, '\n}\n');
        formatted = formatted.replace(/;/g, ';\n');
        
        const lines = formatted.split('\n');
        let indentLevel = 0;
        
        return lines.map(line => {
            line = line.trim();
            if (line === '}') {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            const result = line ? indentStr.repeat(indentLevel) + line : '';
            if (line.includes('{')) {
                indentLevel++;
            }
            return result;
        }).filter(line => line.trim()).join('\n');
    }

    minifyCSS(input) {
        return input.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
    }

    validateCSS(input) {
        // Basic CSS validation
        const hasSelectors = /[a-z-]+\s*\{/.test(input);
        const hasProperties = /[a-z-]+\s*:\s*[^;]+;/.test(input);
        
        if (!hasSelectors && !hasProperties) {
            return { valid: false, message: 'No CSS selectors or properties detected' };
        }
        
        return { valid: true, message: 'CSS syntax appears valid' };
    }

    highlightCSS(content) {
        content = this.escapeHtml(content);
        
        return content
            // CSS comments
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="css-comment">$1</span>')
            // CSS selectors (class, id, element, pseudo)
            .replace(/([.#]?[a-zA-Z][a-zA-Z0-9_-]*(?:::[a-zA-Z-]+|:[a-zA-Z-]+(?:\([^)]*\))?)?(?:\s*,\s*[.#]?[a-zA-Z][a-zA-Z0-9_-]*(?:::[a-zA-Z-]+|:[a-zA-Z-]+(?:\([^)]*\))?)?)*)\s*\{/g, 
                '<span class="css-selector">$1</span> {')
            // CSS properties
            .replace(/(\s+)([a-zA-Z-]+)(\s*:)/g, '$1<span class="css-property">$2</span>$3')
            // CSS values
            .replace(/(:\s*)([^;{}]+)(;)/g, '$1<span class="css-value">$2</span>$3')
            // CSS units and numbers
            .replace(/(<span class="css-value">[^<]*)(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)([^<]*<\/span>)/g, 
                '$1<span class="css-number">$2$3</span>$4')
            // CSS strings
            .replace(/(<span class="css-value">[^<]*)("[^"]*"|'[^']*')([^<]*<\/span>)/g, 
                '$1<span class="css-string">$2</span>$3');
    }

    /**
     * JavaScript Formatting Methods
     */
    formatJavaScript(input) {
        // Basic JavaScript formatting
        let formatted = input;
        const indentStr = ' '.repeat(this.settings.indentSize);
        
        // Add line breaks
        formatted = formatted.replace(/\{/g, ' {\n');
        formatted = formatted.replace(/\}/g, '\n}\n');
        formatted = formatted.replace(/;/g, ';\n');
        
        const lines = formatted.split('\n');
        let indentLevel = 0;
        
        return lines.map(line => {
            line = line.trim();
            if (line === '}' || line.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            const result = line ? indentStr.repeat(indentLevel) + line : '';
            if (line.includes('{')) {
                indentLevel++;
            }
            return result;
        }).filter(line => line.trim()).join('\n');
    }

    minifyJavaScript(input) {
        return input.replace(/\s+/g, ' ').trim();
    }

    validateJavaScript(input) {
        try {
            new Function(input);
            return { valid: true, message: 'JavaScript syntax appears valid' };
        } catch (error) {
            return { valid: false, message: `JavaScript error: ${error.message}` };
        }
    }

    highlightJavaScript(content) {
        let highlighted = content;
        
        // Highlight keywords
        this.languages.javascript.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="js-keyword">${keyword}</span>`);
        });
        
        // Highlight operators
        highlighted = highlighted.replace(/([+\-*\/=<>!&|%^~?:]+)/g, '<span class="js-operator">$1</span>');
        
        // Highlight function names
        highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="js-function">$1</span>');
        
        // Highlight brackets and parentheses
        highlighted = highlighted.replace(/([\[\]{}()])/g, '<span class="js-bracket">$1</span>');
        
        return highlighted;
    }

    /**
     * Python Formatting Methods
     */
    formatPython(input) {
        // Basic Python formatting
        const lines = input.split('\n');
        const indentStr = ' '.repeat(this.settings.indentSize);
        let indentLevel = 0;
        
        return lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.endsWith(':')) {
                const result = indentStr.repeat(indentLevel) + trimmed;
                indentLevel++;
                return result;
            } else if (trimmed === '' || trimmed.startsWith('#')) {
                return trimmed;
            } else {
                return indentStr.repeat(indentLevel) + trimmed;
            }
        }).join('\n');
    }

    highlightPython(content) {
        let highlighted = this.escapeHtml(content);
        
        // Highlight comments
        highlighted = highlighted.replace(/#.*$/gm, '<span class="python-comment">$&</span>');
        
        // Highlight triple-quoted strings (docstrings)
        highlighted = highlighted.replace(/"""[\s\S]*?"""/g, '<span class="python-docstring">$&</span>');
        highlighted = highlighted.replace(/'''[\s\S]*?'''/g, '<span class="python-docstring">$&</span>');
        
        // Highlight strings (single and double quotes)
        highlighted = highlighted.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="python-string">\"$1\"</span>');
        highlighted = highlighted.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="python-string">\"$1\"</span>');
        
        // Highlight f-strings
        highlighted = highlighted.replace(/f'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="python-fstring">f\"$1\"</span>');
        highlighted = highlighted.replace(/f"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="python-fstring">f\"$1\"</span>');
        
        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+\.?\d*|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g, '<span class="python-number">$1</span>');
        
        // Highlight keywords
        this.languages.python.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="python-keyword">${keyword}</span>`);
        });
        
        // Highlight decorators
        highlighted = highlighted.replace(/@\w+/g, '<span class="python-decorator">$&</span>');
        
        // Highlight function definitions
        highlighted = highlighted.replace(/\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'def <span class="python-function">$1</span>');
        
        // Highlight class definitions
        highlighted = highlighted.replace(/\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'class <span class="python-class">$1</span>');
        
        // Highlight operators
        highlighted = highlighted.replace(/([+\-*\/=<>!&|%^~]|\*\*|\/\/|==|!=|<=|>=|and|or|not|in|is)/g, '<span class="python-operator">$1</span>');
        
        return highlighted;
    }

    /**
     * XML Formatting Methods
     */
    formatXML(input) {
        return this.formatHTML(input); // Similar to HTML
    }

    validateXML(input) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, 'application/xml');
            const errors = doc.querySelectorAll('parsererror');
            
            if (errors.length > 0) {
                return { valid: false, message: 'XML parsing errors detected' };
            }
            
            return { valid: true, message: 'XML structure appears valid' };
        } catch (error) {
            return { valid: false, message: `XML error: ${error.message}` };
        }
    }

    highlightXML(content) {
        content = this.escapeHtml(content);
        
        return content
            // XML comments
            .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>')
            // XML processing instructions
            .replace(/(&lt;\?[\s\S]*?\?&gt;)/g, '<span class="xml-processing">$1</span>')
            // CDATA sections
            .replace(/(&lt;!\[CDATA\[[\s\S]*?\]\]&gt;)/g, '<span class="xml-cdata">$1</span>')
            // XML tags
            .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9:_-]*)((?:\s+[^&gt;]*)?)(&gt;)/g, 
                '<span class="xml-tag">$1</span><span class="xml-tag-name">$2</span>$3<span class="xml-tag">$4</span>')
            // XML attributes
            .replace(/(\s+)([a-zA-Z:_][a-zA-Z0-9:_-]*)(=)(["'])([^"']*?)\4/g, 
                '$1<span class="xml-attr">$2</span>$3$4<span class="xml-attr-value">$5</span>$4')
            // Self-closing tag indicators
            .replace(/(\/)(&gt;)/g, '<span class="xml-tag">$1$2</span>');
    }

    /**
     * YAML Formatting Methods
     */
    formatYAML(input) {
        // Basic YAML formatting
        const lines = input.split('\n');
        const indentStr = ' '.repeat(this.settings.indentSize);
        
        return lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('-')) {
                return trimmed;
            }
            return trimmed;
        }).join('\n');
    }

    validateYAML(input) {
        // Basic YAML validation
        const hasYamlStructure = /^\s*[a-z_][a-z0-9_]*\s*:/im.test(input);
        
        if (!hasYamlStructure) {
            return { valid: false, message: 'No YAML structure detected' };
        }
        
        return { valid: true, message: 'YAML structure appears valid' };
    }

    highlightYAML(content) {
        content = this.escapeHtml(content);
        
        return content
            // YAML comments
            .replace(/(#.*$)/gm, '<span class="yaml-comment">$1</span>')
            // YAML document separators
            .replace(/^(---|\.\.\.)/gm, '<span class="yaml-separator">$1</span>')
            // YAML keys (including nested keys)
            .replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)(\s*:)(?=\s|$)/gm, '$1<span class="yaml-key">$2</span>$3')
            // YAML quoted strings
            .replace(/(:\s*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '$1<span class="yaml-string">$2</span>')
            // YAML unquoted strings (after colon)
            .replace(/(:\s*)([^\s#][^#\n]*?)(?=\s*(?:#|$))/g, function(match, colon, value) {
                // Don't highlight if it's already highlighted or if it's a number/boolean
                if (value.includes('<span') || /^\d+(\.\d+)?$/.test(value.trim()) || /^(true|false|null|~)$/i.test(value.trim())) {
                    return match;
                }
                return colon + '<span class="yaml-string">' + value + '</span>';
            })
            // YAML numbers
            .replace(/(:\s*)(\d+(?:\.\d+)?)/g, '$1<span class="yaml-number">$2</span>')
            // YAML booleans and null
            .replace(/(:\s*)(true|false|null|~)\b/gi, '$1<span class="yaml-literal">$2</span>')
            // YAML list indicators
            .replace(/^(\s*)(-)(?=\s)/gm, '$1<span class="yaml-list">$2</span>');
    }

    /**
     * Markdown Formatting Methods
     */
    formatMarkdown(input) {
        // Basic Markdown formatting - mostly preserve structure
        return input.split('\n').map(line => line.trimRight()).join('\n');
    }

    highlightMarkdown(content) {
        content = this.escapeHtml(content);
        
        return content
            // Headers
            .replace(/^(#{1,6})\s+(.+)$/gm, '<span class="md-header">$1</span> <span class="md-header-text">$2</span>')
            // Code blocks (fenced)
            .replace(/```([\s\S]*?)```/g, '<span class="md-code-block">```$1```</span>')
            // Inline code
            .replace(/`([^`]+)`/g, '<span class="md-code">`$1`</span>')
            // Bold text
            .replace(/\*\*([^*]+)\*\*/g, '<span class="md-bold">**$1**</span>')
            .replace(/__([^_]+)__/g, '<span class="md-bold">__$1__</span>')
            // Italic text
            .replace(/\*([^*]+)\*/g, '<span class="md-italic">*$1*</span>')
            .replace(/_([^_]+)_/g, '<span class="md-italic">_$1_</span>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">[</span><span class="md-link-text">$1</span><span class="md-link">](</span><span class="md-link-url">$2</span><span class="md-link">)</span>')
            // Images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="md-image">![</span><span class="md-image-alt">$1</span><span class="md-image">](</span><span class="md-image-url">$2</span><span class="md-image">)</span>')
            // Unordered lists
            .replace(/^(\s*)([-*+])\s+/gm, '$1<span class="md-list">$2</span> ')
            // Ordered lists
            .replace(/^(\s*)(\d+\.)\s+/gm, '$1<span class="md-list">$2</span> ')
            // Blockquotes
            .replace(/^(\s*&gt;\s*)/gm, '<span class="md-blockquote">$1</span>')
            // Horizontal rules
            .replace(/^(\s*)(---+|\*\*\*+|___+)\s*$/gm, '$1<span class="md-hr">$2</span>');
    }

    /**
     * Generic/Plain Text Methods
     */
    formatPlainText(input) {
        return input.trim();
    }

    minifyGeneric(input) {
        return input.replace(/\s+/g, ' ').trim();
    }

    /**
     * Display formatted output
     */
    displayOutput(content, language) {
        if (this.settings.syntaxHighlighting) {
            const highlighted = this.applySyntaxHighlighting(content, language);
            this.outputArea.innerHTML = `<pre><code>${highlighted}</code></pre>`;
        } else {
            this.outputArea.innerHTML = `<pre><code>${this.escapeHtml(content)}</code></pre>`;
        }
        
        this.outputArea.setAttribute('data-language', language);
        this.updateLineNumbers('output');
    }

    /**
     * Add CSS styles for the Code Formatter
     */
    addStyles() {
        const styleId = 'code-formatter-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .code-formatter {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f8f9fa;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .formatter-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .header-title h2 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.8rem;
            }
            
            .header-title p {
                margin: 5px 0 0 0;
                color: #6c757d;
                font-size: 0.9rem;
            }
            
            .language-selector {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .language-select {
                padding: 8px 12px;
                border: 2px solid #dee2e6;
                border-radius: 6px;
                background: white;
                font-size: 0.9rem;
                min-width: 180px;
            }
            
            .formatter-controls {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            
            .control-group {
                display: flex;
                gap: 8px;
            }
            
            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .btn-primary {
                background: #007bff;
                color: white;
            }
            
            .btn-primary:hover {
                background: #0056b3;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #545b62;
            }
            
            .btn-info {
                background: #17a2b8;
                color: white;
            }
            
            .btn-info:hover {
                background: #117a8b;
            }
            
            .btn-outline {
                background: white;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }
            
            .btn-outline:hover {
                background: #f8f9fa;
                border-color: #adb5bd;
            }
            
            .btn-settings {
                background: #28a745;
                color: white;
            }
            
            .btn-settings:hover {
                background: #1e7e34;
            }
            
            .btn-history {
                background: #ffc107;
                color: #212529;
            }
            
            .btn-history:hover {
                background: #e0a800;
            }
            
            .btn-small {
                padding: 4px 8px;
                font-size: 0.75rem;
            }
            
            .formatter-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: white;
                border-radius: 6px;
                border: 1px solid #dee2e6;
                margin-bottom: 20px;
            }
            
            .status-info {
                display: flex;
                gap: 15px;
                align-items: center;
            }
            
            .status-text {
                font-weight: 500;
            }
            
            .status-success {
                color: #28a745;
            }
            
            .status-error {
                color: #dc3545;
            }
            
            .status-info {
                color: #17a2b8;
            }
            
            .detected-language {
                color: #6c757d;
                font-size: 0.85rem;
            }
            
            .code-stats {
                display: flex;
                gap: 15px;
                font-size: 0.8rem;
                color: #6c757d;
            }
            
            .formatter-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .input-section, .output-section {
                background: white;
                border-radius: 8px;
                border: 1px solid #dee2e6;
                overflow: hidden;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
            }
            
            .section-header h3 {
                margin: 0;
                font-size: 1rem;
                color: #495057;
            }
            
            .input-controls, .output-controls {
                display: flex;
                gap: 8px;
            }
            
            .editor-container {
                position: relative;
                display: flex;
                height: 400px;
            }
            
            .line-numbers {
                background: #f8f9fa;
                border-right: 1px solid #dee2e6;
                padding: 10px 8px;
                font-family: 'Courier New', monospace;
                font-size: 0.8rem;
                color: #6c757d;
                text-align: right;
                user-select: none;
                overflow: hidden;
                white-space: pre;
                min-width: 40px;
            }
            
            .code-input {
                flex: 1;
                border: none;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 0.85rem;
                resize: none;
                outline: none;
                background: white;
                overflow: auto;
            }
            
            .code-output {
                flex: 1;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 0.85rem;
                background: white;
                overflow: auto;
                white-space: pre-wrap;
            }
            
            .code-output pre {
                margin: 0;
                white-space: pre-wrap;
            }
            
            .error-display {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 20px;
                color: #721c24;
            }
            
            .error-content h4 {
                margin: 0 0 8px 0;
                color: #721c24;
            }
            
            .settings-panel, .history-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .settings-content, .history-content {
                padding: 20px;
            }
            
            .settings-content h3, .history-content h3 {
                margin: 0 0 20px 0;
                color: #2c3e50;
            }
            
            .settings-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .setting-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .setting-group label {
                font-weight: 500;
                color: #495057;
            }
            
            .setting-group select, .setting-group input {
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: 4px;
            }
            
            .settings-actions, .history-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .history-list {
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            
            .history-item {
                border: 1px solid #dee2e6;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 10px;
                background: #f8f9fa;
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .history-action {
                font-weight: 500;
                color: #007bff;
                text-transform: capitalize;
            }
            
            .history-language {
                color: #6c757d;
                font-size: 0.85rem;
            }
            
            .history-time {
                color: #6c757d;
                font-size: 0.8rem;
            }
            
            .history-preview {
                font-family: 'Courier New', monospace;
                font-size: 0.8rem;
                color: #495057;
                background: white;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .history-actions {
                text-align: right;
            }
            
            /* Syntax Highlighting */
            /* JSON */
            .json-key { color: #0066cc; font-weight: bold; }
            .json-string { color: #009900; }
            .json-number { color: #cc6600; }
            .json-literal { color: #990099; font-weight: bold; }
            .json-bracket { color: #666; font-weight: bold; }
            .json-comma { color: #666; }
            
            /* SQL */
            .sql-keyword { color: #0066cc; font-weight: bold; }
            .sql-string { color: #009900; }
            .sql-number { color: #cc6600; }
            
            /* HTML */
            .html-tag { color: #0066cc; }
            .html-tag-name { color: #990000; font-weight: bold; }
            .html-attr { color: #cc6600; }
            .html-attr-value { color: #009900; }
            .html-comment { color: #999; font-style: italic; }
            .html-doctype { color: #990099; font-weight: bold; }
            
            /* CSS */
            .css-selector { color: #990000; font-weight: bold; }
            .css-property { color: #0066cc; }
            .css-value { color: #009900; }
            .css-comment { color: #999; font-style: italic; }
            .css-number { color: #cc6600; }
            .css-string { color: #009900; }
            
            /* JavaScript */
            .js-keyword { color: #0066cc; font-weight: bold; }
            .js-string { color: #009900; }
            .js-template { color: #009900; background: #f0f8f0; }
            .js-number { color: #cc6600; }
            .js-comment { color: #999; font-style: italic; }
            .js-operator { color: #666; }
            .js-function { color: #990000; font-weight: bold; }
            .js-bracket { color: #666; }
            
            /* Python */
            .python-keyword { color: #0066cc; font-weight: bold; }
            .python-string { color: #009900; }
            .python-fstring { color: #009900; background: #f0f8f0; }
            .python-docstring { color: #666; font-style: italic; }
            .python-number { color: #cc6600; }
            .python-comment { color: #999; font-style: italic; }
            .python-decorator { color: #990099; font-weight: bold; }
            .python-function { color: #990000; font-weight: bold; }
            .python-class { color: #990000; font-weight: bold; }
            .python-operator { color: #666; }
            
            /* XML */
            .xml-tag { color: #0066cc; }
            .xml-tag-name { color: #990000; font-weight: bold; }
            .xml-attr { color: #cc6600; }
            .xml-attr-value { color: #009900; }
            .xml-comment { color: #999; font-style: italic; }
            .xml-processing { color: #990099; font-weight: bold; }
            .xml-cdata { color: #666; background: #f8f9fa; }
            
            /* YAML */
            .yaml-key { color: #0066cc; font-weight: bold; }
            .yaml-string { color: #009900; }
            .yaml-number { color: #cc6600; }
            .yaml-comment { color: #999; font-style: italic; }
            .yaml-literal { color: #990099; }
            .yaml-separator { color: #666; font-weight: bold; }
            .yaml-list { color: #666; font-weight: bold; }
            
            /* Markdown */
            .md-header { color: #0066cc; font-weight: bold; }
            .md-header-text { color: #333; font-weight: bold; }
            .md-bold { color: #333; font-weight: bold; }
            .md-italic { color: #666; font-style: italic; }
            .md-code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; color: #990000; }
            .md-code-block { background: #f8f9fa; padding: 8px; border-radius: 4px; color: #333; display: block; }
            .md-link { color: #0066cc; }
            .md-link-text { color: #0066cc; }
            .md-link-url { color: #009900; }
            .md-image { color: #990099; }
            .md-image-alt { color: #666; }
            .md-image-url { color: #009900; }
            .md-list { color: #666; font-weight: bold; }
            .md-blockquote { color: #666; font-style: italic; }
            .md-hr { color: #999; font-weight: bold; }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .formatter-content {
                    grid-template-columns: 1fr;
                }
                
                .formatter-header {
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }
                
                .formatter-controls {
                    flex-direction: column;
                }
                
                .control-group {
                    flex-wrap: wrap;
                }
                
                .editor-container {
                    height: 300px;
                }
                
                .settings-panel, .history-panel {
                    width: 95%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Apply syntax highlighting
     */
    applySyntaxHighlighting(content, language) {
        switch (language) {
            case 'json':
                return this.highlightJSON(content);
            case 'sql':
                return this.highlightSQL(content);
            case 'html':
                return this.highlightHTML(content);
            case 'css':
                return this.highlightCSS(content);
            case 'javascript':
                return this.highlightJavaScript(content);
            case 'python':
                return this.highlightPython(content);
            case 'xml':
                return this.highlightXML(content);
            case 'yaml':
                return this.highlightYAML(content);
            case 'markdown':
                return this.highlightMarkdown(content);
            default:
                return this.escapeHtml(content);
        }
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showStatus(message, type = 'info') {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = message;
            statusText.className = `status-text status-${type}`;
        }
    }

    showError(message) {
        this.errorDisplay.innerHTML = `
            <div class="error-content">
                <h4>Error</h4>
                <p>${message}</p>
            </div>
        `;
        this.errorDisplay.style.display = 'block';
    }

    clearErrors() {
        this.errorDisplay.style.display = 'none';
    }

    clearAll() {
        this.inputArea.value = '';
        this.outputArea.innerHTML = '';
        this.clearErrors();
        this.showStatus('Ready', 'info');
        this.updateStats('');
        this.updateLineNumbers('input');
        this.updateLineNumbers('output');
    }

    /**
     * Update line numbers for input or output areas
     */
    updateLineNumbers(area) {
        const element = area === 'input' ? this.inputArea : this.outputArea;
        const lineNumbersElement = document.getElementById(area === 'input' ? 'inputLineNumbers' : 'outputLineNumbers');
        
        if (!element || !lineNumbersElement) return;
        
        const content = area === 'input' ? element.value : element.textContent || '';
        const lines = content.split('\n');
        const lineNumbers = lines.map((_, index) => index + 1).join('\n');
        
        lineNumbersElement.textContent = lineNumbers;
    }

    /**
     * Sync scroll between line numbers and content
     */
    syncScroll(area) {
        const element = area === 'input' ? this.inputArea : this.outputArea;
        const lineNumbersElement = document.getElementById(area === 'input' ? 'inputLineNumbers' : 'outputLineNumbers');
        
        if (element && lineNumbersElement) {
            lineNumbersElement.scrollTop = element.scrollTop;
        }
    }

    /**
     * Update detected language display
     */
    updateDetectedLanguage(language) {
        const detectedElement = document.getElementById('detectedLanguage');
        if (detectedElement && language && this.languages[language]) {
            detectedElement.textContent = `Detected: ${this.languages[language].icon} ${this.languages[language].name}`;
        }
    }

    /**
     * Update language display
     */
    updateLanguageDisplay() {
        const detectedElement = document.getElementById('detectedLanguage');
        if (detectedElement) {
            if (this.currentLanguage === 'auto') {
                detectedElement.textContent = 'Auto-detection enabled';
            } else if (this.languages[this.currentLanguage]) {
                detectedElement.textContent = `Selected: ${this.languages[this.currentLanguage].icon} ${this.languages[this.currentLanguage].name}`;
            }
        }
    }

    /**
     * Update code statistics
     */
    updateStats(content) {
        const statsElement = document.getElementById('codeStats');
        if (statsElement) {
            const lines = content.split('\n').length;
            const chars = content.length;
            const words = content.trim() ? content.trim().split(/\s+/).length : 0;
            
            statsElement.innerHTML = `
                <span>Lines: ${lines}</span>
                <span>Characters: ${chars}</span>
                <span>Words: ${words}</span>
            `;
        }
    }

    /**
     * Copy output to clipboard
     */
    async copyOutput() {
        const output = this.outputArea.textContent || this.outputArea.innerText || '';
        if (!output.trim()) {
            this.showError('No output to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(output);
            this.showStatus('Output copied to clipboard!', 'success');
        } catch (error) {
            this.showError('Failed to copy to clipboard');
        }
    }

    /**
     * Download formatted code
     */
    downloadCode() {
        const output = this.outputArea.textContent || this.outputArea.innerText || '';
        if (!output.trim()) {
            this.showError('No output to download');
            return;
        }
        
        const language = this.currentLanguage === 'auto' ? this.detectLanguage(this.inputArea.value) : this.currentLanguage;
        const extension = this.languages[language]?.extensions?.[0] || '.txt';
        const filename = `formatted-code${extension}`;
        
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus(`Downloaded as ${filename}`, 'success');
    }

    /**
     * Load sample code
     */
    loadSample() {
        const samples = {
            json: `{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York",\n  "hobbies": ["reading", "coding", "traveling"]\n}`,
            sql: `SELECT u.name, u.email, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2023-01-01' GROUP BY u.id ORDER BY order_count DESC;`,
            html: `<div class="container"><h1>Welcome</h1><p>This is a sample HTML document.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`,
            css: `.container{max-width:1200px;margin:0 auto;padding:20px;}.header{background:#333;color:white;padding:1rem;}`,
            javascript: `function calculateTotal(items){return items.reduce((sum,item)=>sum+item.price,0);}const cart=[{name:'Product 1',price:29.99},{name:'Product 2',price:19.99}];console.log(calculateTotal(cart));`,
            python: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(fibonacci(i))`,
            xml: `<?xml version="1.0" encoding="UTF-8"?><root><user id="1"><name>John Doe</name><email>john@example.com</email></user></root>`,
            yaml: `name: My Application\nversion: 1.0.0\ndependencies:\n  - express: ^4.18.0\n  - mongoose: ^6.0.0\nscripts:\n  start: node server.js`,
            markdown: `# My Project\n\n## Features\n\n- **Fast**: Built for performance\n- **Reliable**: Thoroughly tested\n- **Easy**: Simple to use\n\n\`\`\`javascript\nconsole.log('Hello World');\n\`\`\``
        };
        
        const currentLang = this.currentLanguage === 'auto' ? 'json' : this.currentLanguage;
        const sample = samples[currentLang] || samples.json;
        
        this.inputArea.value = sample;
        this.onInputChange();
        this.updateLineNumbers('input');
        
        if (this.currentLanguage === 'auto') {
            this.languageSelector.value = currentLang;
            this.currentLanguage = currentLang;
            this.updateLanguageDisplay();
        }
    }

    /**
     * Load file
     */
    loadFile() {
        document.getElementById('fileInput').click();
    }

    /**
     * Handle file load
     */
    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputArea.value = e.target.result;
            this.onInputChange();
            this.updateLineNumbers('input');
            
            // Try to detect language from file extension
            if (this.currentLanguage === 'auto') {
                const extension = '.' + file.name.split('.').pop().toLowerCase();
                const detectedLang = Object.entries(this.languages).find(([key, lang]) => 
                    lang.extensions && lang.extensions.includes(extension)
                );
                
                if (detectedLang) {
                    this.languageSelector.value = detectedLang[0];
                    this.currentLanguage = detectedLang[0];
                    this.updateLanguageDisplay();
                }
            }
            
            this.showStatus(`File "${file.name}" loaded successfully`, 'success');
        };
        
        reader.readAsText(file);
    }

    /**
     * Toggle syntax highlighting
     */
    toggleSyntaxHighlighting() {
        this.settings.syntaxHighlighting = !this.settings.syntaxHighlighting;
        const btn = document.getElementById('highlightToggleBtn');
        btn.textContent = this.settings.syntaxHighlighting ? 'Disable Highlighting' : 'Enable Highlighting';
        
        // Re-display output if exists
        if (this.outputArea.textContent) {
            const language = this.outputArea.getAttribute('data-language') || 'plain';
            const content = this.outputArea.textContent;
            this.displayOutput(content, language);
        }
        
        this.saveSettings();
    }

    /**
     * Toggle line numbers
     */
    toggleLineNumbers() {
        this.settings.lineNumbers = !this.settings.lineNumbers;
        const btn = document.getElementById('lineNumbersToggleBtn');
        btn.textContent = this.settings.lineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers';
        
        const inputLineNumbers = document.getElementById('inputLineNumbers');
        const outputLineNumbers = document.getElementById('outputLineNumbers');
        
        if (this.settings.lineNumbers) {
            inputLineNumbers.style.display = 'block';
            outputLineNumbers.style.display = 'block';
        } else {
            inputLineNumbers.style.display = 'none';
            outputLineNumbers.style.display = 'none';
        }
        
        this.saveSettings();
    }

    /**
     * Toggle settings panel
     */
    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        const isVisible = panel.style.display !== 'none';
        
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Populate current settings
            document.getElementById('indentSize').value = this.settings.indentSize;
            document.getElementById('themeSelect').value = this.settings.theme;
            document.getElementById('autoDetectCheck').checked = this.settings.autoDetect;
            document.getElementById('autoFormatCheck').checked = this.settings.autoFormat;
            document.getElementById('syntaxHighlightCheck').checked = this.settings.syntaxHighlighting;
        }
    }

    /**
     * Toggle history panel
     */
    toggleHistory() {
        const panel = document.getElementById('historyPanel');
        const isVisible = panel.style.display !== 'none';
        
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.displayHistory();
        }
    }

    /**
     * Display history
     */
    displayHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p>No history available</p>';
            return;
        }
        
        historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-header">
                    <span class="history-action">${item.action}</span>
                    <span class="history-language">${this.languages[item.language]?.icon || ''} ${this.languages[item.language]?.name || item.language}</span>
                    <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="history-preview">${item.input.substring(0, 100)}${item.input.length > 100 ? '...' : ''}</div>
                <div class="history-actions">
                    <button class="btn btn-small" onclick="codeFormatter.loadFromHistory(${index})">Load</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, language) {
        const historyItem = {
            action,
            input,
            output,
            language,
            timestamp: Date.now()
        };
        
        this.history.unshift(historyItem);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        this.saveSettings();
    }

    /**
     * Load from history
     */
    loadFromHistory(index) {
        const item = this.history[index];
        if (!item) return;
        
        this.inputArea.value = item.input;
        this.languageSelector.value = item.language;
        this.currentLanguage = item.language;
        
        this.onInputChange();
        this.updateLanguageDisplay();
        this.updateLineNumbers('input');
        
        // Close history panel
        document.getElementById('historyPanel').style.display = 'none';
        
        this.showStatus(`Loaded from history: ${item.action}`, 'success');
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.displayHistory();
        this.saveSettings();
        this.showStatus('History cleared', 'success');
    }

    /**
     * Save settings
     */
    saveSettings() {
        const settingsToSave = {
            ...this.settings,
            history: this.history
        };
        
        try {
            localStorage.setItem('codeFormatterSettings', JSON.stringify(settingsToSave));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Load settings
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('codeFormatterSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
                this.history = parsed.history || [];
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    /**
     * Reset settings
     */
    resetSettings() {
        this.settings = {
            indentSize: 2,
            theme: 'light',
            autoDetect: true,
            syntaxHighlighting: true,
            lineNumbers: true,
            wordWrap: true,
            json: {
                sortKeys: false,
                escapeUnicode: false,
                compactArrays: false
            },
            sql: {
                keywordCase: 'upper',
                identifierCase: 'preserve',
                commaPosition: 'trailing',
                maxLineLength: 120
            },
            html: {
                preserveNewlines: true,
                maxPreserveNewlines: 2,
                indentInnerHtml: true
            },
            css: {
                selectorSeparateLines: true,
                bracesOnNewLine: false
            },
            javascript: {
                semicolons: true,
                quotes: 'single',
                trailingCommas: true
            }
        };
        
        this.saveSettings();
        this.showStatus('Settings reset to default', 'success');
        
        // Update UI
        document.getElementById('indentSize').value = this.settings.indentSize;
        document.getElementById('themeSelect').value = this.settings.theme;
        document.getElementById('autoDetectCheck').checked = this.settings.autoDetect;
        document.getElementById('syntaxHighlightCheck').checked = this.settings.syntaxHighlighting;
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case 'f':
                    event.preventDefault();
                    this.formatCode();
                    break;
                case 'a':
                    event.preventDefault();
                    this.autoFormat();
                    break;
                case 'm':
                    event.preventDefault();
                    this.minifyCode();
                    break;
                case 'v':
                    if (event.shiftKey) {
                        event.preventDefault();
                        this.validateCode();
                    }
                    break;
                case 's':
                    event.preventDefault();
                    this.downloadCode();
                    break;
                case 'delete':
                    event.preventDefault();
                    this.clearAll();
                    break;
            }
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeFormatterUtility;
} else if (typeof window !== 'undefined') {
    window.CodeFormatterUtility = CodeFormatterUtility;
}