class XmlToJsonUtility {
    constructor() {
        this.container = null;
        this.settings = {
            preserveAttributes: true,
            preserveOrder: false,
            ignoreWhitespace: true,
            arrayMode: 'auto', // 'auto', 'force', 'never'
            attributePrefix: '@',
            textKey: '#text',
            cdataKey: '#cdata',
            commentKey: '#comment',
            prettyPrint: true,
            compactOutput: false
        };
        this.history = [];
        this.maxHistorySize = 10;
    }

    init() {
        this.loadSettings();
    }

    createInterface(container) {
        this.container = container;
        
        const interfaceHTML = `
            <div class="xml-to-json-converter">
                <div class="converter-header">
                    <h2><i class="fas fa-code"></i> XML to JSON Converter</h2>
                    <div class="header-actions">
                        <button id="settingsBtn" class="btn btn-secondary">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                        <button id="historyBtn" class="btn btn-secondary">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>

                <div class="converter-body">
                    <div class="input-section">
                        <div class="section-header">
                            <h3><i class="fas fa-file-code"></i> XML Input</h3>
                            <div class="input-actions">
                                <label for="xmlFileInput" class="btn btn-outline">
                                    <i class="fas fa-upload"></i> Upload XML
                                </label>
                                <input type="file" id="xmlFileInput" accept=".xml,.txt" style="display: none;">
                                <button id="clearInputBtn" class="btn btn-outline">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        </div>
                        <div class="input-container">
                            <textarea id="xmlTextInput" placeholder="Paste your XML content here or upload a file..." rows="15"></textarea>
                            <div class="input-info">
                                <span id="xmlCharCount">0 characters</span>
                                <span id="xmlLineCount">0 lines</span>
                            </div>
                        </div>
                    </div>

                    <div class="conversion-controls">
                        <button id="convertBtn" class="btn btn-primary" disabled>
                            <i class="fas fa-exchange-alt"></i> Convert to JSON
                        </button>
                        <button id="validateBtn" class="btn btn-secondary" disabled>
                            <i class="fas fa-check-circle"></i> Validate XML
                        </button>
                        <button id="previewBtn" class="btn btn-secondary" disabled>
                            <i class="fas fa-eye"></i> Preview Structure
                        </button>
                    </div>

                    <div class="output-section">
                        <div class="section-header">
                            <h3><i class="fas fa-file-alt"></i> JSON Output</h3>
                            <div class="output-actions">
                                <button id="copyJsonBtn" class="btn btn-outline" disabled>
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                                <button id="downloadJsonBtn" class="btn btn-outline" disabled>
                                    <i class="fas fa-download"></i> Download
                                </button>
                                <button id="formatJsonBtn" class="btn btn-outline" disabled>
                                    <i class="fas fa-indent"></i> Format
                                </button>
                                <button id="minifyJsonBtn" class="btn btn-outline" disabled>
                                    <i class="fas fa-compress"></i> Minify
                                </button>
                            </div>
                        </div>
                        <div class="output-container">
                            <pre id="jsonOutput" class="json-output"></pre>
                            <div class="output-info">
                                <span id="jsonSize">0 bytes</span>
                                <span id="conversionTime">0ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="messageContainer" class="message-container"></div>
            </div>

            <!-- Settings Modal -->
            <div id="settingsModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-cog"></i> Conversion Settings</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="settings-grid">
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="preserveAttributes" checked>
                                    Preserve XML Attributes
                                </label>
                                <small>Include XML attributes in the JSON output</small>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="preserveOrder">
                                    Preserve Element Order
                                </label>
                                <small>Maintain the order of XML elements</small>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="ignoreWhitespace" checked>
                                    Ignore Whitespace
                                </label>
                                <small>Remove unnecessary whitespace from text content</small>
                            </div>
                            <div class="setting-group">
                                <label>Array Handling:</label>
                                <select id="arrayMode">
                                    <option value="auto">Auto-detect</option>
                                    <option value="force">Force arrays</option>
                                    <option value="never">Never arrays</option>
                                </select>
                                <small>How to handle repeated elements</small>
                            </div>
                            <div class="setting-group">
                                <label>Attribute Prefix:</label>
                                <input type="text" id="attributePrefix" value="@" maxlength="5">
                                <small>Prefix for XML attributes in JSON</small>
                            </div>
                            <div class="setting-group">
                                <label>Text Content Key:</label>
                                <input type="text" id="textKey" value="#text" maxlength="20">
                                <small>Key name for text content</small>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="prettyPrint" checked>
                                    Pretty Print JSON
                                </label>
                                <small>Format JSON with indentation</small>
                            </div>
                            <div class="setting-group">
                                <label>
                                    <input type="checkbox" id="compactOutput">
                                    Compact Output
                                </label>
                                <small>Remove empty objects and arrays</small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="resetSettingsBtn" class="btn btn-secondary">Reset to Defaults</button>
                        <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
                    </div>
                </div>
            </div>

            <!-- History Modal -->
            <div id="historyModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-history"></i> Conversion History</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="historyList" class="history-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button id="clearHistoryBtn" class="btn btn-secondary">Clear History</button>
                    </div>
                </div>
            </div>

            <!-- Preview Modal -->
            <div id="previewModal" class="modal">
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h3><i class="fas fa-eye"></i> XML Structure Preview</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="xmlPreview" class="xml-preview"></div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = interfaceHTML;
        this.attachEventListeners();
        this.updateUI();
    }

    attachEventListeners() {
        // Input handling
        const xmlInput = document.getElementById('xmlTextInput');
        const fileInput = document.getElementById('xmlFileInput');
        
        xmlInput.addEventListener('input', () => {
            this.updateInputInfo();
            this.updateUI();
        });

        xmlInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                this.updateInputInfo();
                this.updateUI();
            }, 10);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Button handlers
        document.getElementById('convertBtn').addEventListener('click', () => {
            this.convertXmlToJson();
        });

        document.getElementById('validateBtn').addEventListener('click', () => {
            this.validateXml();
        });

        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showXmlPreview();
        });

        document.getElementById('clearInputBtn').addEventListener('click', () => {
            this.clearInput();
        });

        document.getElementById('copyJsonBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('downloadJsonBtn').addEventListener('click', () => {
            this.downloadJson();
        });

        document.getElementById('formatJsonBtn').addEventListener('click', () => {
            this.formatJson();
        });

        document.getElementById('minifyJsonBtn').addEventListener('click', () => {
            this.minifyJson();
        });

        // Modal handlers
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showHistory();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (!document.getElementById('convertBtn').disabled) {
                            this.convertXmlToJson();
                        }
                        break;
                    case 'Delete':
                        e.preventDefault();
                        this.clearInput();
                        break;
                }
            }
        });
    }

    handleFileUpload(file) {
        if (!file) return;

        if (!file.name.match(/\.(xml|txt)$/i)) {
            this.showMessage('Please select an XML or text file.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showMessage('File size too large. Please select a file smaller than 10MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('xmlTextInput').value = e.target.result;
            this.updateInputInfo();
            this.updateUI();
            this.showMessage(`File "${file.name}" loaded successfully.`, 'success');
        };
        reader.onerror = () => {
            this.showMessage('Error reading file.', 'error');
        };
        reader.readAsText(file);
    }

    convertXmlToJson() {
        const xmlText = document.getElementById('xmlTextInput').value.trim();
        if (!xmlText) {
            this.showMessage('Please enter XML content to convert.', 'warning');
            return;
        }

        const startTime = performance.now();
        
        try {
            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('XML parsing error: ' + parseError.textContent);
            }

            // Convert to JSON
            const jsonResult = this.xmlToJson(xmlDoc.documentElement);
            
            // Format output
            const jsonString = this.settings.prettyPrint ? 
                JSON.stringify(jsonResult, null, 2) : 
                JSON.stringify(jsonResult);

            // Display result
            const outputElement = document.getElementById('jsonOutput');
            outputElement.textContent = jsonString;
            this.highlightJson(outputElement);

            // Update info
            const endTime = performance.now();
            const conversionTime = Math.round(endTime - startTime);
            document.getElementById('jsonSize').textContent = this.formatBytes(new Blob([jsonString]).size);
            document.getElementById('conversionTime').textContent = `${conversionTime}ms`;

            // Add to history
            this.addToHistory({
                timestamp: new Date(),
                xmlLength: xmlText.length,
                jsonLength: jsonString.length,
                conversionTime: conversionTime,
                settings: { ...this.settings }
            });

            this.updateUI();
            this.showMessage('XML converted to JSON successfully!', 'success');

        } catch (error) {
            this.showMessage(`Conversion failed: ${error.message}`, 'error');
            console.error('XML to JSON conversion error:', error);
        }
    }

    xmlToJson(element) {
        const result = {};
        
        // Handle attributes
        if (this.settings.preserveAttributes && element.attributes.length > 0) {
            for (let attr of element.attributes) {
                result[this.settings.attributePrefix + attr.name] = attr.value;
            }
        }

        // Handle child nodes
        const children = Array.from(element.childNodes);
        const elementChildren = children.filter(node => node.nodeType === Node.ELEMENT_NODE);
        const textNodes = children.filter(node => node.nodeType === Node.TEXT_NODE);
        const cdataNodes = children.filter(node => node.nodeType === Node.CDATA_SECTION_NODE);
        const commentNodes = children.filter(node => node.nodeType === Node.COMMENT_NODE);

        // Handle text content
        const textContent = textNodes.map(node => node.textContent).join('');
        if (textContent.trim() || !this.settings.ignoreWhitespace) {
            const cleanText = this.settings.ignoreWhitespace ? textContent.trim() : textContent;
            if (cleanText) {
                if (elementChildren.length === 0 && Object.keys(result).length === 0) {
                    return this.convertValue(cleanText);
                } else {
                    result[this.settings.textKey] = this.convertValue(cleanText);
                }
            }
        }

        // Handle CDATA
        if (cdataNodes.length > 0) {
            const cdataContent = cdataNodes.map(node => node.textContent).join('');
            result[this.settings.cdataKey] = cdataContent;
        }

        // Handle comments
        if (commentNodes.length > 0) {
            const comments = commentNodes.map(node => node.textContent);
            result[this.settings.commentKey] = comments.length === 1 ? comments[0] : comments;
        }

        // Handle child elements
        const elementGroups = {};
        elementChildren.forEach(child => {
            const tagName = child.tagName;
            if (!elementGroups[tagName]) {
                elementGroups[tagName] = [];
            }
            elementGroups[tagName].push(this.xmlToJson(child));
        });

        // Process element groups
        Object.keys(elementGroups).forEach(tagName => {
            const elements = elementGroups[tagName];
            if (elements.length === 1 && this.settings.arrayMode !== 'force') {
                result[tagName] = elements[0];
            } else if (this.settings.arrayMode !== 'never') {
                result[tagName] = elements;
            } else {
                result[tagName] = elements[0]; // Take first element if arrays are disabled
            }
        });

        // Handle compact output
        if (this.settings.compactOutput) {
            return this.compactObject(result);
        }

        return result;
    }

    convertValue(value) {
        // Try to convert to appropriate type
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        if (value === '') return '';
        
        // Try number conversion
        const num = Number(value);
        if (!isNaN(num) && isFinite(num) && value.trim() === num.toString()) {
            return num;
        }
        
        return value;
    }

    compactObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.compactObject(item)).filter(item => 
                item !== null && item !== undefined && 
                !(typeof item === 'object' && Object.keys(item).length === 0)
            );
        }
        
        if (typeof obj === 'object' && obj !== null) {
            const compacted = {};
            Object.keys(obj).forEach(key => {
                const value = this.compactObject(obj[key]);
                if (value !== null && value !== undefined && 
                    !(typeof value === 'object' && Object.keys(value).length === 0)) {
                    compacted[key] = value;
                }
            });
            return compacted;
        }
        
        return obj;
    }

    validateXml() {
        const xmlText = document.getElementById('xmlTextInput').value.trim();
        if (!xmlText) {
            this.showMessage('Please enter XML content to validate.', 'warning');
            return;
        }

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error(parseError.textContent);
            }

            // Additional validation
            const stats = this.analyzeXml(xmlDoc);
            this.showMessage(
                `XML is valid! Found ${stats.elements} elements, ${stats.attributes} attributes, ${stats.depth} max depth.`,
                'success'
            );

        } catch (error) {
            this.showMessage(`XML validation failed: ${error.message}`, 'error');
        }
    }

    analyzeXml(xmlDoc) {
        let elements = 0;
        let attributes = 0;
        let maxDepth = 0;

        function traverse(node, depth = 0) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                elements++;
                attributes += node.attributes.length;
                maxDepth = Math.max(maxDepth, depth);
                
                Array.from(node.childNodes).forEach(child => {
                    traverse(child, depth + 1);
                });
            }
        }

        traverse(xmlDoc.documentElement);
        return { elements, attributes, depth: maxDepth };
    }

    showXmlPreview() {
        const xmlText = document.getElementById('xmlTextInput').value.trim();
        if (!xmlText) {
            this.showMessage('Please enter XML content to preview.', 'warning');
            return;
        }

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error(parseError.textContent);
            }

            const previewElement = document.getElementById('xmlPreview');
            previewElement.innerHTML = this.generateXmlTree(xmlDoc.documentElement);
            
            document.getElementById('previewModal').style.display = 'flex';

        } catch (error) {
            this.showMessage(`Preview failed: ${error.message}`, 'error');
        }
    }

    generateXmlTree(element, depth = 0) {
        const indent = '  '.repeat(depth);
        let html = `${indent}<div class="xml-node" style="margin-left: ${depth * 20}px;">`;
        
        // Element name
        html += `<span class="xml-tag">&lt;${element.tagName}</span>`;
        
        // Attributes
        if (element.attributes.length > 0) {
            Array.from(element.attributes).forEach(attr => {
                html += ` <span class="xml-attr">${attr.name}="<span class="xml-value">${attr.value}</span>"</span>`;
            });
        }
        
        html += `<span class="xml-tag">&gt;</span>`;
        
        // Text content
        const textContent = Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('');
            
        if (textContent) {
            html += `<span class="xml-text">${textContent}</span>`;
        }
        
        html += '</div>';
        
        // Child elements
        const childElements = Array.from(element.children);
        childElements.forEach(child => {
            html += this.generateXmlTree(child, depth + 1);
        });
        
        // Closing tag
        if (childElements.length > 0) {
            html += `${indent}<div class="xml-node" style="margin-left: ${depth * 20}px;">`;
            html += `<span class="xml-tag">&lt;/${element.tagName}&gt;</span></div>`;
        }
        
        return html;
    }

    clearInput() {
        document.getElementById('xmlTextInput').value = '';
        document.getElementById('jsonOutput').textContent = '';
        document.getElementById('xmlFileInput').value = '';
        this.updateInputInfo();
        this.updateUI();
        this.showMessage('Input cleared.', 'info');
    }

    copyToClipboard() {
        const jsonOutput = document.getElementById('jsonOutput').textContent;
        if (!jsonOutput) return;

        navigator.clipboard.writeText(jsonOutput).then(() => {
            this.showMessage('JSON copied to clipboard!', 'success');
        }).catch(() => {
            this.showMessage('Failed to copy to clipboard.', 'error');
        });
    }

    downloadJson() {
        const jsonOutput = document.getElementById('jsonOutput').textContent;
        if (!jsonOutput) return;

        const blob = new Blob([jsonOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('JSON file downloaded!', 'success');
    }

    formatJson() {
        const jsonOutput = document.getElementById('jsonOutput');
        const jsonText = jsonOutput.textContent;
        if (!jsonText) return;

        try {
            const parsed = JSON.parse(jsonText);
            const formatted = JSON.stringify(parsed, null, 2);
            jsonOutput.textContent = formatted;
            this.highlightJson(jsonOutput);
            this.showMessage('JSON formatted!', 'success');
        } catch (error) {
            this.showMessage('Invalid JSON format.', 'error');
        }
    }

    minifyJson() {
        const jsonOutput = document.getElementById('jsonOutput');
        const jsonText = jsonOutput.textContent;
        if (!jsonText) return;

        try {
            const parsed = JSON.parse(jsonText);
            const minified = JSON.stringify(parsed);
            jsonOutput.textContent = minified;
            this.highlightJson(jsonOutput);
            this.showMessage('JSON minified!', 'success');
        } catch (error) {
            this.showMessage('Invalid JSON format.', 'error');
        }
    }

    highlightJson(element) {
        // Simple JSON syntax highlighting
        let html = element.textContent
            .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
            .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/: (null)/g, ': <span class="json-null">$1</span>')
            .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>');
        
        element.innerHTML = html;
    }

    showSettings() {
        // Load current settings into modal
        document.getElementById('preserveAttributes').checked = this.settings.preserveAttributes;
        document.getElementById('preserveOrder').checked = this.settings.preserveOrder;
        document.getElementById('ignoreWhitespace').checked = this.settings.ignoreWhitespace;
        document.getElementById('arrayMode').value = this.settings.arrayMode;
        document.getElementById('attributePrefix').value = this.settings.attributePrefix;
        document.getElementById('textKey').value = this.settings.textKey;
        document.getElementById('prettyPrint').checked = this.settings.prettyPrint;
        document.getElementById('compactOutput').checked = this.settings.compactOutput;
        
        document.getElementById('settingsModal').style.display = 'flex';
    }

    saveSettings() {
        // Read settings from modal
        this.settings.preserveAttributes = document.getElementById('preserveAttributes').checked;
        this.settings.preserveOrder = document.getElementById('preserveOrder').checked;
        this.settings.ignoreWhitespace = document.getElementById('ignoreWhitespace').checked;
        this.settings.arrayMode = document.getElementById('arrayMode').value;
        this.settings.attributePrefix = document.getElementById('attributePrefix').value;
        this.settings.textKey = document.getElementById('textKey').value;
        this.settings.prettyPrint = document.getElementById('prettyPrint').checked;
        this.settings.compactOutput = document.getElementById('compactOutput').checked;
        
        // Save to localStorage
        localStorage.setItem('xmlToJsonSettings', JSON.stringify(this.settings));
        
        document.getElementById('settingsModal').style.display = 'none';
        this.showMessage('Settings saved!', 'success');
    }

    resetSettings() {
        this.settings = {
            preserveAttributes: true,
            preserveOrder: false,
            ignoreWhitespace: true,
            arrayMode: 'auto',
            attributePrefix: '@',
            textKey: '#text',
            cdataKey: '#cdata',
            commentKey: '#comment',
            prettyPrint: true,
            compactOutput: false
        };
        
        this.showSettings(); // Refresh modal
        this.showMessage('Settings reset to defaults!', 'info');
    }

    loadSettings() {
        const saved = localStorage.getItem('xmlToJsonSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        }
    }

    showHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No conversion history available.</p>';
        } else {
            historyList.innerHTML = this.history.map((entry, index) => `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-date">${entry.timestamp.toLocaleString()}</span>
                        <span class="history-time">${entry.conversionTime}ms</span>
                    </div>
                    <div class="history-details">
                        <span>XML: ${this.formatBytes(entry.xmlLength)}</span>
                        <span>JSON: ${this.formatBytes(entry.jsonLength)}</span>
                        <span>Compression: ${Math.round((1 - entry.jsonLength / entry.xmlLength) * 100)}%</span>
                    </div>
                </div>
            `).join('');
        }
        
        document.getElementById('historyModal').style.display = 'flex';
    }

    addToHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        // Save to localStorage
        localStorage.setItem('xmlToJsonHistory', JSON.stringify(this.history.map(h => ({
            ...h,
            timestamp: h.timestamp.toISOString()
        }))));
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('xmlToJsonHistory');
        document.getElementById('historyModal').style.display = 'none';
        this.showMessage('History cleared!', 'info');
    }

    updateInputInfo() {
        const xmlText = document.getElementById('xmlTextInput').value;
        const charCount = xmlText.length;
        const lineCount = xmlText.split('\n').length;
        
        document.getElementById('xmlCharCount').textContent = `${charCount.toLocaleString()} characters`;
        document.getElementById('xmlLineCount').textContent = `${lineCount.toLocaleString()} lines`;
    }

    updateUI() {
        const hasInput = document.getElementById('xmlTextInput').value.trim().length > 0;
        const hasOutput = document.getElementById('jsonOutput').textContent.length > 0;
        
        // Enable/disable buttons based on content
        document.getElementById('convertBtn').disabled = !hasInput;
        document.getElementById('validateBtn').disabled = !hasInput;
        document.getElementById('previewBtn').disabled = !hasInput;
        document.getElementById('copyJsonBtn').disabled = !hasOutput;
        document.getElementById('downloadJsonBtn').disabled = !hasOutput;
        document.getElementById('formatJsonBtn').disabled = !hasOutput;
        document.getElementById('minifyJsonBtn').disabled = !hasOutput;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="message-close">&times;</button>
        `;
        
        container.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
        
        // Manual close
        messageDiv.querySelector('.message-close').addEventListener('click', () => {
            messageDiv.remove();
        });
    }

    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// CSS Styles
const xmlToJsonStyles = `
<style>
.xml-to-json-converter {
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.converter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e9ecef;
}

.converter-header h2 {
    color: #333;
    font-size: 2em;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.converter-body {
    display: grid;
    gap: 30px;
}

.input-section, .output-section {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 25px;
    border: 1px solid #dee2e6;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h3 {
    color: #495057;
    font-size: 1.3em;
    margin: 0;
}

.input-actions, .output-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.input-container, .output-container {
    position: relative;
}

#xmlTextInput {
    width: 100%;
    min-height: 300px;
    padding: 15px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    background: white;
    transition: border-color 0.3s ease;
}

#xmlTextInput:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.json-output {
    width: 100%;
    min-height: 300px;
    padding: 15px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    background: white;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.input-info, .output-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9em;
    color: #6c757d;
}

.conversion-controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    margin: 20px 0;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    min-width: 120px;
    justify-content: center;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

.btn-primary {
    background: #667eea;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
}

.btn-secondary:hover:not(:disabled) {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
}

.btn-outline {
    background: transparent;
    color: #495057;
    border: 2px solid #dee2e6;
}

.btn-outline:hover:not(:disabled) {
    background: #495057;
    color: white;
    border-color: #495057;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-large {
    max-width: 900px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.4em;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f8f9fa;
    color: #495057;
}

.modal-body {
    padding: 25px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 25px;
    border-top: 1px solid #dee2e6;
}

.settings-grid {
    display: grid;
    gap: 20px;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.setting-group label {
    font-weight: 500;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 8px;
}

.setting-group input[type="checkbox"] {
    margin: 0;
}

.setting-group input[type="text"], .setting-group select {
    padding: 8px 12px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 14px;
}

.setting-group small {
    color: #6c757d;
    font-size: 0.85em;
}

.history-list {
    max-height: 400px;
    overflow-y: auto;
}

.history-item {
    padding: 15px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    margin-bottom: 10px;
    background: #f8f9fa;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.history-date {
    font-weight: 500;
    color: #495057;
}

.history-time {
    background: #667eea;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85em;
}

.history-details {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
    color: #6c757d;
}

.no-history {
    text-align: center;
    color: #6c757d;
    font-style: italic;
    padding: 40px;
}

.xml-preview {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    max-height: 500px;
    overflow: auto;
}

.xml-node {
    margin: 2px 0;
}

.xml-tag {
    color: #d73a49;
    font-weight: bold;
}

.xml-attr {
    color: #6f42c1;
}

.xml-value {
    color: #032f62;
}

.xml-text {
    color: #24292e;
    margin-left: 10px;
}

.json-key {
    color: #d73a49;
    font-weight: bold;
}

.json-string {
    color: #032f62;
}

.json-number {
    color: #005cc5;
}

.json-boolean {
    color: #d73a49;
    font-weight: bold;
}

.json-null {
    color: #6f42c1;
    font-style: italic;
}

.message-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
    max-width: 400px;
}

.message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease;
}

.message-success {
    background: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
}

.message-error {
    background: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
}

.message-warning {
    background: #fff3cd;
    color: #856404;
    border-left: 4px solid #ffc107;
}

.message-info {
    background: #d1ecf1;
    color: #0c5460;
    border-left: 4px solid #17a2b8;
}

.message-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.7;
    margin-left: auto;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-close:hover {
    opacity: 1;
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

@media (max-width: 768px) {
    .converter-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .section-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .input-actions, .output-actions {
        justify-content: center;
    }
    
    .conversion-controls {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 100%;
        max-width: 250px;
    }
    
    .modal-content {
        margin: 10px;
        max-width: calc(100% - 20px);
    }
    
    .history-details {
        flex-direction: column;
        gap: 5px;
    }
    
    .message-container {
        left: 20px;
        right: 20px;
        max-width: none;
    }
}
</style>
`;

// Inject styles
if (!document.querySelector('#xml-to-json-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'xml-to-json-styles';
    styleElement.innerHTML = xmlToJsonStyles;
    document.head.appendChild(styleElement);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XmlToJsonUtility;
}