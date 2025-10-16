/**
 * JSON Formatter Utility
 * A comprehensive JSON formatting, validation, and manipulation tool
 * Features: Format, minify, validate, syntax highlighting, error detection
 */

class JSONFormatterUtility {
    constructor() {
        this.container = null;
        this.inputArea = null;
        this.outputArea = null;
        this.errorDisplay = null;
        this.statusDisplay = null;
        this.history = [];
        this.maxHistorySize = 50;
        this.settings = {
            indentSize: 2,
            sortKeys: false,
            escapeUnicode: false,
            compactArrays: false,
            theme: 'light'
        };
    }

    /**
     * Initialize the JSON Formatter
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID '${containerId}' not found`);
        }

        this.loadSettings();
        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        
        console.log('JSON Formatter Utility initialized successfully');
    }

    /**
     * Create the main interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="json-formatter">
                <div class="formatter-header">
                    <h2>🔧 JSON Formatter</h2>
                    <div class="formatter-controls">
                        <button class="btn btn-primary" id="formatBtn">Format</button>
                        <button class="btn btn-secondary" id="minifyBtn">Minify</button>
                        <button class="btn btn-info" id="validateBtn">Validate</button>
                        <button class="btn btn-warning" id="clearBtn">Clear</button>
                        <button class="btn btn-success" id="copyBtn">Copy Output</button>
                        <button class="btn btn-settings" id="settingsBtn">⚙️</button>
                    </div>
                </div>
                
                <div class="formatter-status" id="statusDisplay">
                    <span class="status-text">Ready</span>
                    <span class="json-stats"></span>
                </div>
                
                <div class="formatter-content">
                    <div class="input-section">
                        <div class="section-header">
                            <h3>Input JSON</h3>
                            <div class="input-controls">
                                <button class="btn btn-small" id="loadSampleBtn">Load Sample</button>
                                <button class="btn btn-small" id="loadFileBtn">Load File</button>
                                <input type="file" id="fileInput" accept=".json" style="display: none;">
                            </div>
                        </div>
                        <textarea id="jsonInput" class="json-input" placeholder="Paste your JSON here..."></textarea>
                    </div>
                    
                    <div class="output-section">
                        <div class="section-header">
                            <h3>Formatted Output</h3>
                            <div class="output-controls">
                                <button class="btn btn-small" id="downloadBtn">Download</button>
                                <button class="btn btn-small" id="shareBtn">Share</button>
                            </div>
                        </div>
                        <div id="jsonOutput" class="json-output"></div>
                    </div>
                </div>
                
                <div class="error-display" id="errorDisplay" style="display: none;"></div>
                
                <div class="formatter-features">
                    <div class="feature-grid">
                        <div class="feature-card" onclick="jsonFormatter.showFeatureInfo('format')">
                            <span class="feature-icon">✨</span>
                            <h4>Format & Beautify</h4>
                            <p>Pretty-print JSON with proper indentation</p>
                        </div>
                        <div class="feature-card" onclick="jsonFormatter.showFeatureInfo('validate')">
                            <span class="feature-icon">✅</span>
                            <h4>Validate & Check</h4>
                            <p>Validate JSON syntax and structure</p>
                        </div>
                        <div class="feature-card" onclick="jsonFormatter.showFeatureInfo('minify')">
                            <span class="feature-icon">📦</span>
                            <h4>Minify & Compress</h4>
                            <p>Remove whitespace to reduce size</p>
                        </div>
                        <div class="feature-card" onclick="jsonFormatter.showFeatureInfo('analyze')">
                            <span class="feature-icon">📊</span>
                            <h4>Analyze & Stats</h4>
                            <p>Get detailed JSON statistics</p>
                        </div>
                    </div>
                </div>
                
                <div class="settings-panel" id="settingsPanel" style="display: none;">
                    <div class="settings-content">
                        <h3>Formatter Settings</h3>
                        <div class="setting-group">
                            <label>Indent Size:</label>
                            <select id="indentSize">
                                <option value="2">2 spaces</option>
                                <option value="4">4 spaces</option>
                                <option value="\t">Tab</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="sortKeys"> Sort Keys
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="escapeUnicode"> Escape Unicode
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="compactArrays"> Compact Arrays
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>Theme:</label>
                            <select id="themeSelect">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div class="settings-actions">
                            <button class="btn btn-primary" id="saveSettingsBtn">Save Settings</button>
                            <button class="btn btn-secondary" id="resetSettingsBtn">Reset</button>
                            <button class="btn btn-secondary" id="closeSettingsBtn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.inputArea = document.getElementById('jsonInput');
        this.outputArea = document.getElementById('jsonOutput');
        this.errorDisplay = document.getElementById('errorDisplay');
        this.statusDisplay = document.getElementById('statusDisplay');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Main action buttons
        document.getElementById('formatBtn').addEventListener('click', () => this.formatJSON());
        document.getElementById('minifyBtn').addEventListener('click', () => this.minifyJSON());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateJSON());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyOutput());
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());

        // Input controls
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSampleJSON());
        document.getElementById('loadFileBtn').addEventListener('click', () => this.loadFile());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));

        // Output controls
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadJSON());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareJSON());

        // Settings
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettingsBtn').addEventListener('click', () => this.resetSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.toggleSettings());

        // Input area events
        this.inputArea.addEventListener('input', () => this.onInputChange());
        this.inputArea.addEventListener('paste', () => {
            setTimeout(() => this.onInputChange(), 10);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    /**
     * Handle input changes
     */
    onInputChange() {
        const input = this.inputArea.value.trim();
        if (input) {
            this.updateStats(input);
            this.validateJSON(false); // Silent validation
        } else {
            this.clearStats();
            this.clearErrors();
        }
    }

    /**
     * Format JSON with proper indentation
     */
    formatJSON() {
        try {
            const input = this.inputArea.value.trim();
            if (!input) {
                this.showError('Please enter JSON to format');
                return;
            }

            const parsed = JSON.parse(input);
            let formatted;

            if (this.settings.sortKeys) {
                formatted = JSON.stringify(this.sortObjectKeys(parsed), null, this.settings.indentSize);
            } else {
                formatted = JSON.stringify(parsed, null, this.settings.indentSize);
            }

            if (this.settings.escapeUnicode) {
                formatted = this.escapeUnicode(formatted);
            }

            this.displayOutput(formatted, 'formatted');
            this.showStatus('JSON formatted successfully', 'success');
            this.addToHistory(input, formatted, 'format');
            this.clearErrors();

        } catch (error) {
            this.showError(`Invalid JSON: ${error.message}`);
        }
    }

    /**
     * Minify JSON by removing whitespace
     */
    minifyJSON() {
        try {
            const input = this.inputArea.value.trim();
            if (!input) {
                this.showError('Please enter JSON to minify');
                return;
            }

            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);

            this.displayOutput(minified, 'minified');
            this.showStatus(`JSON minified successfully. Reduced by ${input.length - minified.length} characters`, 'success');
            this.addToHistory(input, minified, 'minify');
            this.clearErrors();

        } catch (error) {
            this.showError(`Invalid JSON: ${error.message}`);
        }
    }

    /**
     * Validate JSON and show detailed results
     */
    validateJSON(showSuccess = true) {
        try {
            const input = this.inputArea.value.trim();
            if (!input) {
                this.showError('Please enter JSON to validate');
                return false;
            }

            const parsed = JSON.parse(input);
            const analysis = this.analyzeJSON(parsed, input);

            if (showSuccess) {
                this.displayValidationResult(analysis);
                this.showStatus('JSON is valid', 'success');
            }
            
            this.clearErrors();
            return true;

        } catch (error) {
            const errorInfo = this.parseJSONError(error, this.inputArea.value);
            this.showError(`Invalid JSON: ${errorInfo.message}`, errorInfo);
            return false;
        }
    }

    /**
     * Parse JSON error and provide helpful information
     */
    parseJSONError(error, input) {
        const message = error.message;
        let line = 1;
        let column = 1;
        let suggestion = '';

        // Try to extract position information
        const positionMatch = message.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            const lines = input.substring(0, position).split('\n');
            line = lines.length;
            column = lines[lines.length - 1].length + 1;
        }

        // Provide suggestions based on common errors
        if (message.includes('Unexpected token')) {
            suggestion = 'Check for missing commas, quotes, or brackets';
        } else if (message.includes('Unexpected end')) {
            suggestion = 'Check for missing closing brackets or braces';
        } else if (message.includes('Unexpected string')) {
            suggestion = 'Check for missing commas between properties';
        }

        return {
            message: message,
            line: line,
            column: column,
            suggestion: suggestion
        };
    }

    /**
     * Analyze JSON structure and provide statistics
     */
    analyzeJSON(parsed, originalText) {
        const analysis = {
            type: Array.isArray(parsed) ? 'array' : typeof parsed,
            size: originalText.length,
            depth: this.getMaxDepth(parsed),
            keys: this.countKeys(parsed),
            values: this.countValues(parsed),
            arrays: this.countArrays(parsed),
            objects: this.countObjects(parsed),
            nulls: this.countNulls(parsed),
            booleans: this.countBooleans(parsed),
            numbers: this.countNumbers(parsed),
            strings: this.countStrings(parsed)
        };

        return analysis;
    }

    /**
     * Get maximum depth of nested objects/arrays
     */
    getMaxDepth(obj, currentDepth = 0) {
        if (obj === null || typeof obj !== 'object') {
            return currentDepth;
        }

        let maxDepth = currentDepth;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const depth = this.getMaxDepth(obj[key], currentDepth + 1);
                maxDepth = Math.max(maxDepth, depth);
            }
        }

        return maxDepth;
    }

    /**
     * Count different types of values in JSON
     */
    countKeys(obj) {
        let count = 0;
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            count += Object.keys(obj).length;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countKeys(obj[key]);
                }
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countKeys(item);
            }
        }
        return count;
    }

    countValues(obj) {
        let count = 0;
        if (Array.isArray(obj)) {
            count += obj.length;
            for (const item of obj) {
                count += this.countValues(item);
            }
        } else if (obj && typeof obj === 'object') {
            count += Object.keys(obj).length;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countValues(obj[key]);
                }
            }
        }
        return count;
    }

    countArrays(obj) {
        let count = 0;
        if (Array.isArray(obj)) {
            count = 1;
            for (const item of obj) {
                count += this.countArrays(item);
            }
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countArrays(obj[key]);
                }
            }
        }
        return count;
    }

    countObjects(obj) {
        let count = 0;
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            count = 1;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countObjects(obj[key]);
                }
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countObjects(item);
            }
        }
        return count;
    }

    countNulls(obj) {
        let count = 0;
        if (obj === null) {
            return 1;
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countNulls(item);
            }
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countNulls(obj[key]);
                }
            }
        }
        return count;
    }

    countBooleans(obj) {
        let count = 0;
        if (typeof obj === 'boolean') {
            return 1;
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countBooleans(item);
            }
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countBooleans(obj[key]);
                }
            }
        }
        return count;
    }

    countNumbers(obj) {
        let count = 0;
        if (typeof obj === 'number') {
            return 1;
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countNumbers(item);
            }
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countNumbers(obj[key]);
                }
            }
        }
        return count;
    }

    countStrings(obj) {
        let count = 0;
        if (typeof obj === 'string') {
            return 1;
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                count += this.countStrings(item);
            }
        } else if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    count += this.countStrings(obj[key]);
                }
            }
        }
        return count;
    }

    /**
     * Sort object keys recursively
     */
    sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.sortObjectKeys(item));
        } else if (obj && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = this.sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    /**
     * Escape unicode characters
     */
    escapeUnicode(str) {
        return str.replace(/[\u0080-\uFFFF]/g, function(match) {
            return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).substr(-4);
        });
    }

    /**
     * Display formatted output with syntax highlighting
     */
    displayOutput(content, type) {
        const highlighted = this.highlightJSON(content);
        this.outputArea.innerHTML = `<pre><code>${highlighted}</code></pre>`;
        this.outputArea.setAttribute('data-type', type);
    }

    /**
     * Display validation results
     */
    displayValidationResult(analysis) {
        const result = `
            <div class="validation-result">
                <h4>✅ JSON is Valid</h4>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <span class="label">Type:</span>
                        <span class="value">${analysis.type}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Size:</span>
                        <span class="value">${analysis.size} characters</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Max Depth:</span>
                        <span class="value">${analysis.depth} levels</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Keys:</span>
                        <span class="value">${analysis.keys}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Objects:</span>
                        <span class="value">${analysis.objects}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Arrays:</span>
                        <span class="value">${analysis.arrays}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Strings:</span>
                        <span class="value">${analysis.strings}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Numbers:</span>
                        <span class="value">${analysis.numbers}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Booleans:</span>
                        <span class="value">${analysis.booleans}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Nulls:</span>
                        <span class="value">${analysis.nulls}</span>
                    </div>
                </div>
            </div>
        `;
        this.outputArea.innerHTML = result;
    }

    /**
     * Highlight JSON syntax
     */
    highlightJSON(json) {
        return json
            .replace(/"([^"\\]|\\.)*"/g, '<span class="json-string">$&</span>')
            .replace(/\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g, '<span class="json-number">$&</span>')
            .replace(/\b(true|false)\b/g, '<span class="json-boolean">$&</span>')
            .replace(/\bnull\b/g, '<span class="json-null">$&</span>')
            .replace(/([{}\[\]])/g, '<span class="json-bracket">$1</span>')
            .replace(/:/g, '<span class="json-colon">:</span>')
            .replace(/,/g, '<span class="json-comma">,</span>');
    }

    /**
     * Update statistics display
     */
    updateStats(input) {
        const stats = document.querySelector('.json-stats');
        if (stats) {
            stats.textContent = `${input.length} characters, ${input.split('\n').length} lines`;
        }
    }

    /**
     * Clear statistics display
     */
    clearStats() {
        const stats = document.querySelector('.json-stats');
        if (stats) {
            stats.textContent = '';
        }
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'info') {
        const statusText = this.statusDisplay.querySelector('.status-text');
        statusText.textContent = message;
        statusText.className = `status-text status-${type}`;
        
        setTimeout(() => {
            statusText.textContent = 'Ready';
            statusText.className = 'status-text';
        }, 3000);
    }

    /**
     * Show error message
     */
    showError(message, errorInfo = null) {
        this.errorDisplay.innerHTML = `
            <div class="error-content">
                <h4>❌ Error</h4>
                <p>${message}</p>
                ${errorInfo ? `
                    <div class="error-details">
                        <p><strong>Line:</strong> ${errorInfo.line}, <strong>Column:</strong> ${errorInfo.column}</p>
                        ${errorInfo.suggestion ? `<p><strong>Suggestion:</strong> ${errorInfo.suggestion}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        this.errorDisplay.style.display = 'block';
    }

    /**
     * Clear error display
     */
    clearErrors() {
        this.errorDisplay.style.display = 'none';
    }

    /**
     * Clear all content
     */
    clearAll() {
        this.inputArea.value = '';
        this.outputArea.innerHTML = '';
        this.clearErrors();
        this.clearStats();
        this.showStatus('Cleared all content', 'info');
    }

    /**
     * Copy output to clipboard
     */
    async copyOutput() {
        const outputText = this.outputArea.textContent || this.outputArea.innerText;
        if (!outputText.trim()) {
            this.showError('No output to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText);
            this.showStatus('Output copied to clipboard', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = outputText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('Output copied to clipboard', 'success');
        }
    }

    /**
     * Load sample JSON
     */
    loadSampleJSON() {
        const samples = [
            {
                name: "User Profile",
                data: {
                    "id": 12345,
                    "name": "John Doe",
                    "email": "john.doe@example.com",
                    "age": 30,
                    "isActive": true,
                    "address": {
                        "street": "123 Main St",
                        "city": "New York",
                        "zipCode": "10001",
                        "country": "USA"
                    },
                    "hobbies": ["reading", "swimming", "coding"],
                    "preferences": {
                        "theme": "dark",
                        "notifications": true,
                        "language": "en"
                    },
                    "lastLogin": "2024-01-15T10:30:00Z",
                    "metadata": null
                }
            },
            {
                name: "API Response",
                data: {
                    "status": "success",
                    "code": 200,
                    "message": "Data retrieved successfully",
                    "data": [
                        {
                            "id": 1,
                            "title": "First Post",
                            "content": "This is the content of the first post",
                            "author": {
                                "name": "Alice Smith",
                                "id": 101
                            },
                            "tags": ["technology", "programming"],
                            "published": true,
                            "publishedAt": "2024-01-10T08:00:00Z"
                        },
                        {
                            "id": 2,
                            "title": "Second Post",
                            "content": "This is the content of the second post",
                            "author": {
                                "name": "Bob Johnson",
                                "id": 102
                            },
                            "tags": ["design", "ui/ux"],
                            "published": false,
                            "publishedAt": null
                        }
                    ],
                    "pagination": {
                        "page": 1,
                        "limit": 10,
                        "total": 2,
                        "hasNext": false
                    }
                }
            }
        ];

        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        this.inputArea.value = JSON.stringify(randomSample.data, null, 2);
        this.onInputChange();
        this.showStatus(`Loaded sample: ${randomSample.name}`, 'info');
    }

    /**
     * Load JSON from file
     */
    loadFile() {
        document.getElementById('fileInput').click();
    }

    /**
     * Handle file loading
     */
    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            this.showError('Please select a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputArea.value = e.target.result;
            this.onInputChange();
            this.showStatus(`Loaded file: ${file.name}`, 'success');
        };
        reader.onerror = () => {
            this.showError('Error reading file');
        };
        reader.readAsText(file);
    }

    /**
     * Download formatted JSON
     */
    downloadJSON() {
        const outputText = this.outputArea.textContent || this.outputArea.innerText;
        if (!outputText.trim()) {
            this.showError('No output to download');
            return;
        }

        const blob = new Blob([outputText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('JSON downloaded successfully', 'success');
    }

    /**
     * Share JSON (placeholder for future implementation)
     */
    shareJSON() {
        const outputText = this.outputArea.textContent || this.outputArea.innerText;
        if (!outputText.trim()) {
            this.showError('No output to share');
            return;
        }

        // For now, just copy to clipboard
        this.copyOutput();
        this.showStatus('JSON ready to share (copied to clipboard)', 'info');
    }

    /**
     * Toggle settings panel
     */
    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.loadSettingsToUI();
        }
    }

    /**
     * Load settings to UI
     */
    loadSettingsToUI() {
        document.getElementById('indentSize').value = this.settings.indentSize;
        document.getElementById('sortKeys').checked = this.settings.sortKeys;
        document.getElementById('escapeUnicode').checked = this.settings.escapeUnicode;
        document.getElementById('compactArrays').checked = this.settings.compactArrays;
        document.getElementById('themeSelect').value = this.settings.theme;
    }

    /**
     * Save settings
     */
    saveSettings() {
        this.settings.indentSize = document.getElementById('indentSize').value === '\t' ? '\t' : parseInt(document.getElementById('indentSize').value);
        this.settings.sortKeys = document.getElementById('sortKeys').checked;
        this.settings.escapeUnicode = document.getElementById('escapeUnicode').checked;
        this.settings.compactArrays = document.getElementById('compactArrays').checked;
        this.settings.theme = document.getElementById('themeSelect').value;

        localStorage.setItem('jsonFormatter_settings', JSON.stringify(this.settings));
        this.applyTheme();
        this.showStatus('Settings saved successfully', 'success');
        this.toggleSettings();
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.settings = {
            indentSize: 2,
            sortKeys: false,
            escapeUnicode: false,
            compactArrays: false,
            theme: 'light'
        };
        this.loadSettingsToUI();
        this.showStatus('Settings reset to defaults', 'info');
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('jsonFormatter_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        }
    }

    /**
     * Apply theme
     */
    applyTheme() {
        document.body.setAttribute('data-theme', this.settings.theme);
    }

    /**
     * Add to history
     */
    addToHistory(input, output, action) {
        const entry = {
            timestamp: new Date().toISOString(),
            action: action,
            input: input.substring(0, 1000), // Limit size
            output: output.substring(0, 1000),
            inputSize: input.length,
            outputSize: output.length
        };

        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }

        localStorage.setItem('jsonFormatter_history', JSON.stringify(this.history));
    }

    /**
     * Show feature information
     */
    showFeatureInfo(feature) {
        const info = {
            format: 'Format & Beautify: Pretty-print JSON with proper indentation, making it easy to read and understand.',
            validate: 'Validate & Check: Verify JSON syntax and structure, providing detailed error messages and suggestions.',
            minify: 'Minify & Compress: Remove unnecessary whitespace to reduce file size for production use.',
            analyze: 'Analyze & Stats: Get comprehensive statistics about your JSON structure, including depth, types, and counts.'
        };

        alert(info[feature] || 'Feature information not available.');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'f':
                case 'F':
                    event.preventDefault();
                    this.formatJSON();
                    break;
                case 'm':
                case 'M':
                    event.preventDefault();
                    this.minifyJSON();
                    break;
                case 'v':
                case 'V':
                    if (event.shiftKey) {
                        event.preventDefault();
                        this.validateJSON();
                    }
                    break;
                case 'l':
                case 'L':
                    event.preventDefault();
                    this.clearAll();
                    break;
                case 's':
                case 'S':
                    if (event.shiftKey) {
                        event.preventDefault();
                        this.loadSampleJSON();
                    }
                    break;
            }
        }
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('jsonFormatterStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'jsonFormatterStyles';
        styles.textContent = `
            .json-formatter {
                max-width: 1200px;
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

            .formatter-header h2 {
                margin: 0;
                color: #495057;
                font-size: 1.8em;
                font-weight: 600;
            }

            .formatter-controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 5px;
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

            .btn-warning {
                background: #ffc107;
                color: #212529;
            }

            .btn-warning:hover {
                background: #e0a800;
            }

            .btn-success {
                background: #28a745;
                color: white;
            }

            .btn-success:hover {
                background: #1e7e34;
            }

            .btn-settings {
                background: #6f42c1;
                color: white;
                padding: 8px 12px;
            }

            .btn-settings:hover {
                background: #5a32a3;
            }

            .btn-small {
                padding: 6px 12px;
                font-size: 12px;
            }

            .formatter-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: #e9ecef;
                border-radius: 6px;
                margin-bottom: 20px;
                font-size: 14px;
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

            .json-stats {
                color: #6c757d;
                font-size: 12px;
            }

            .formatter-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }

            .input-section,
            .output-section {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e9ecef;
            }

            .section-header h3 {
                margin: 0;
                color: #495057;
                font-size: 1.2em;
                font-weight: 600;
            }

            .input-controls,
            .output-controls {
                display: flex;
                gap: 8px;
            }

            .json-input {
                width: 100%;
                height: 300px;
                padding: 12px;
                border: 1px solid #ced4da;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
                resize: vertical;
                background: #f8f9fa;
            }

            .json-input:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
            }

            .json-output {
                min-height: 300px;
                max-height: 500px;
                overflow: auto;
                padding: 12px;
                border: 1px solid #ced4da;
                border-radius: 6px;
                background: #f8f9fa;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
            }

            .json-output pre {
                margin: 0;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .json-output code {
                background: none;
                padding: 0;
                font-size: inherit;
            }

            /* JSON Syntax Highlighting */
            .json-string {
                color: #d73a49;
            }

            .json-number {
                color: #005cc5;
            }

            .json-boolean {
                color: #e36209;
            }

            .json-null {
                color: #6f42c1;
            }

            .json-bracket {
                color: #24292e;
                font-weight: bold;
            }

            .json-colon {
                color: #24292e;
            }

            .json-comma {
                color: #24292e;
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
                margin: 0 0 10px 0;
                color: #721c24;
            }

            .error-details {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #f5c6cb;
                font-size: 14px;
            }

            .validation-result {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 6px;
                padding: 15px;
                color: #155724;
            }

            .validation-result h4 {
                margin: 0 0 15px 0;
                color: #155724;
            }

            .analysis-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }

            .analysis-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid #c3e6cb;
            }

            .analysis-item:last-child {
                border-bottom: none;
            }

            .analysis-item .label {
                font-weight: 600;
            }

            .analysis-item .value {
                color: #0f5132;
            }

            .formatter-features {
                margin-bottom: 30px;
            }

            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }

            .feature-card {
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .feature-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-color: #007bff;
            }

            .feature-icon {
                font-size: 2em;
                margin-bottom: 10px;
                display: block;
            }

            .feature-card h4 {
                margin: 0 0 10px 0;
                color: #495057;
                font-size: 1.1em;
            }

            .feature-card p {
                margin: 0;
                color: #6c757d;
                font-size: 14px;
                line-height: 1.4;
            }

            .settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 1px solid #ced4da;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 400px;
            }

            .settings-content {
                padding: 20px;
            }

            .settings-content h3 {
                margin: 0 0 20px 0;
                color: #495057;
                font-size: 1.3em;
            }

            .setting-group {
                margin-bottom: 15px;
            }

            .setting-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #495057;
            }

            .setting-group select,
            .setting-group input[type="checkbox"] {
                margin-right: 8px;
            }

            .setting-group select {
                padding: 6px 10px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                background: white;
                font-size: 14px;
            }

            .settings-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e9ecef;
            }

            /* Dark Theme */
            [data-theme="dark"] .json-formatter {
                background: #2d3748;
                color: #e2e8f0;
            }

            [data-theme="dark"] .formatter-header {
                border-bottom-color: #4a5568;
            }

            [data-theme="dark"] .formatter-header h2 {
                color: #e2e8f0;
            }

            [data-theme="dark"] .formatter-status {
                background: #4a5568;
                color: #e2e8f0;
            }

            [data-theme="dark"] .input-section,
            [data-theme="dark"] .output-section {
                background: #1a202c;
                border-color: #4a5568;
            }

            [data-theme="dark"] .section-header {
                border-bottom-color: #4a5568;
            }

            [data-theme="dark"] .section-header h3 {
                color: #e2e8f0;
            }

            [data-theme="dark"] .json-input,
            [data-theme="dark"] .json-output {
                background: #2d3748;
                border-color: #4a5568;
                color: #e2e8f0;
            }

            [data-theme="dark"] .feature-card {
                background: #1a202c;
                border-color: #4a5568;
            }

            [data-theme="dark"] .feature-card h4 {
                color: #e2e8f0;
            }

            [data-theme="dark"] .feature-card p {
                color: #a0aec0;
            }

            /* Dark theme JSON syntax highlighting */
            [data-theme="dark"] .json-string {
                color: #f56565;
            }

            [data-theme="dark"] .json-number {
                color: #4299e1;
            }

            [data-theme="dark"] .json-boolean {
                color: #ed8936;
            }

            [data-theme="dark"] .json-null {
                color: #9f7aea;
            }

            [data-theme="dark"] .json-bracket {
                color: #e2e8f0;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .json-formatter {
                    padding: 15px;
                }

                .formatter-header {
                    flex-direction: column;
                    gap: 15px;
                    align-items: flex-start;
                }

                .formatter-controls {
                    width: 100%;
                    justify-content: flex-start;
                }

                .formatter-content {
                    grid-template-columns: 1fr;
                }

                .feature-grid {
                    grid-template-columns: 1fr;
                }

                .settings-panel {
                    min-width: 90vw;
                    max-width: 90vw;
                }

                .analysis-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 480px) {
                .formatter-controls {
                    flex-direction: column;
                }

                .btn {
                    width: 100%;
                    justify-content: center;
                }

                .input-controls,
                .output-controls {
                    flex-direction: column;
                }

                .settings-actions {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(styles);
        this.applyTheme();
    }
}

// Global instance
let jsonFormatter = null;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('jsonFormatterContainer');
    if (container) {
        jsonFormatter = new JSONFormatterUtility();
        jsonFormatter.init('jsonFormatterContainer');
    }
});