class UrlEncoderUtility {
    constructor() {
        this.container = null;
        this.history = [];
        this.settings = {
            encodeSpaces: 'percent', // 'percent' or 'plus'
            encodeReserved: false,
            preserveCase: false,
            customChars: '',
            batchMode: false
        };
        this.loadSettings();
    }

    init(container) {
        this.container = container;
        this.createInterface();
        this.attachEventListeners();
        this.loadHistory();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="url-encoder-container">
                <div class="url-encoder-header">
                    <h2>URL Encoder/Decoder</h2>
                    <div class="header-controls">
                        <button class="btn-secondary" id="settingsBtn">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                        <button class="btn-secondary" id="historyBtn">
                            <i class="fas fa-history"></i> History
                        </button>
                    </div>
                </div>

                <div class="url-encoder-tabs">
                    <button class="tab-btn active" data-tab="text">Text Mode</button>
                    <button class="tab-btn" data-tab="component">URL Components</button>
                    <button class="tab-btn" data-tab="batch">Batch Mode</button>
                </div>

                <div class="tab-content active" id="textTab">
                    <div class="input-section">
                        <div class="input-header">
                            <label>Input Text/URL</label>
                            <div class="input-controls">
                                <button class="btn-small" id="pasteBtn">
                                    <i class="fas fa-paste"></i> Paste
                                </button>
                                <button class="btn-small" id="clearInputBtn">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        </div>
                        <textarea id="inputText" placeholder="Enter text or URL to encode/decode..."></textarea>
                        <div class="input-info" id="inputInfo">0 characters</div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-primary" id="encodeBtn">
                            <i class="fas fa-lock"></i> Encode
                        </button>
                        <button class="btn-primary" id="decodeBtn">
                            <i class="fas fa-unlock"></i> Decode
                        </button>
                        <button class="btn-secondary" id="swapBtn">
                            <i class="fas fa-exchange-alt"></i> Swap
                        </button>
                    </div>

                    <div class="output-section">
                        <div class="output-header">
                            <label>Output</label>
                            <div class="output-controls">
                                <button class="btn-small" id="copyBtn">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                                <button class="btn-small" id="downloadBtn">
                                    <i class="fas fa-download"></i> Download
                                </button>
                                <button class="btn-small" id="clearOutputBtn">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        </div>
                        <textarea id="outputText" readonly></textarea>
                        <div class="output-info" id="outputInfo">0 characters</div>
                    </div>
                </div>

                <div class="tab-content" id="componentTab">
                    <div class="component-grid">
                        <div class="component-item">
                            <label>Protocol</label>
                            <input type="text" id="protocol" placeholder="https">
                        </div>
                        <div class="component-item">
                            <label>Host</label>
                            <input type="text" id="host" placeholder="example.com">
                        </div>
                        <div class="component-item">
                            <label>Port</label>
                            <input type="text" id="port" placeholder="8080">
                        </div>
                        <div class="component-item">
                            <label>Path</label>
                            <input type="text" id="path" placeholder="/api/users">
                        </div>
                        <div class="component-item full-width">
                            <label>Query Parameters</label>
                            <textarea id="queryParams" placeholder="name=John Doe&age=30&city=New York"></textarea>
                        </div>
                        <div class="component-item full-width">
                            <label>Fragment</label>
                            <input type="text" id="fragment" placeholder="section1">
                        </div>
                    </div>
                    
                    <div class="component-actions">
                        <button class="btn-primary" id="buildUrlBtn">
                            <i class="fas fa-link"></i> Build URL
                        </button>
                        <button class="btn-secondary" id="parseUrlBtn">
                            <i class="fas fa-unlink"></i> Parse URL
                        </button>
                    </div>

                    <div class="component-result">
                        <label>Complete URL</label>
                        <textarea id="completeUrl" readonly></textarea>
                    </div>
                </div>

                <div class="tab-content" id="batchTab">
                    <div class="batch-input">
                        <label>Batch Input (one URL per line)</label>
                        <textarea id="batchInput" placeholder="Enter multiple URLs, one per line..."></textarea>
                    </div>
                    
                    <div class="batch-actions">
                        <button class="btn-primary" id="batchEncodeBtn">
                            <i class="fas fa-lock"></i> Encode All
                        </button>
                        <button class="btn-primary" id="batchDecodeBtn">
                            <i class="fas fa-unlock"></i> Decode All
                        </button>
                    </div>

                    <div class="batch-output">
                        <label>Batch Output</label>
                        <textarea id="batchOutput" readonly></textarea>
                    </div>
                </div>

                <!-- Settings Panel -->
                <div class="settings-panel" id="settingsPanel">
                    <div class="panel-header">
                        <h3>Settings</h3>
                        <button class="close-btn" id="closeSettings">&times;</button>
                    </div>
                    <div class="panel-content">
                        <div class="setting-group">
                            <label>Space Encoding</label>
                            <select id="encodeSpaces">
                                <option value="percent">Percent (%20)</option>
                                <option value="plus">Plus (+)</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="encodeReserved"> Encode Reserved Characters
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="preserveCase"> Preserve Case in Hex
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>Custom Characters to Encode</label>
                            <input type="text" id="customChars" placeholder="e.g., @#$">
                        </div>
                    </div>
                </div>

                <!-- History Panel -->
                <div class="history-panel" id="historyPanel">
                    <div class="panel-header">
                        <h3>Conversion History</h3>
                        <div class="panel-controls">
                            <button class="btn-small" id="clearHistoryBtn">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                            <button class="close-btn" id="closeHistory">&times;</button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <div id="historyList"></div>
                    </div>
                </div>

                <div class="overlay" id="overlay"></div>
            </div>

            <style>
                .url-encoder-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: #333;
                }

                .url-encoder-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .url-encoder-header h2 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 28px;
                    font-weight: 600;
                }

                .header-controls {
                    display: flex;
                    gap: 10px;
                }

                .url-encoder-tabs {
                    display: flex;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 10px;
                    padding: 5px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .tab-btn {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    color: #666;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .tab-content {
                    display: none;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                }

                .tab-content.active {
                    display: block;
                }

                .input-section, .output-section {
                    margin-bottom: 20px;
                }

                .input-header, .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .input-controls, .output-controls {
                    display: flex;
                    gap: 8px;
                }

                label {
                    font-weight: 600;
                    color: #2c3e50;
                    font-size: 14px;
                }

                textarea, input[type="text"] {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e1e8ed;
                    border-radius: 8px;
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    background: #fafbfc;
                }

                textarea {
                    min-height: 120px;
                    resize: vertical;
                }

                textarea:focus, input[type="text"]:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    background: white;
                }

                .input-info, .output-info {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }

                .action-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin: 25px 0;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .btn-secondary {
                    background: #f8f9fa;
                    color: #495057;
                    border: 2px solid #dee2e6;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                }

                .btn-small {
                    background: #f8f9fa;
                    color: #495057;
                    border: 1px solid #dee2e6;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s ease;
                }

                .btn-small:hover {
                    background: #e9ecef;
                }

                .component-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .component-item {
                    display: flex;
                    flex-direction: column;
                }

                .component-item.full-width {
                    grid-column: 1 / -1;
                }

                .component-actions, .batch-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin: 20px 0;
                }

                .component-result, .batch-input, .batch-output {
                    margin-top: 20px;
                }

                .settings-panel, .history-panel {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
                    transition: right 0.3s ease;
                    z-index: 1001;
                    overflow-y: auto;
                }

                .settings-panel.open, .history-panel.open {
                    right: 0;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .panel-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: white;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .panel-content {
                    padding: 20px;
                }

                .setting-group {
                    margin-bottom: 20px;
                }

                .setting-group label {
                    display: block;
                    margin-bottom: 8px;
                }

                .setting-group input[type="checkbox"] {
                    margin-right: 8px;
                }

                .setting-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .history-item {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .history-item:hover {
                    background: #f8f9fa;
                }

                .history-item .timestamp {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }

                .history-item .operation {
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }

                .history-item .content {
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 12px;
                    color: #666;
                    word-break: break-all;
                }

                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    display: none;
                }

                .overlay.active {
                    display: block;
                }

                @media (max-width: 768px) {
                    .url-encoder-container {
                        padding: 10px;
                    }

                    .url-encoder-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }

                    .action-buttons, .component-actions, .batch-actions {
                        flex-direction: column;
                    }

                    .component-grid {
                        grid-template-columns: 1fr;
                    }

                    .settings-panel, .history-panel {
                        width: 100vw;
                        right: -100vw;
                    }
                }
            </style>
        `;
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Text mode events
        document.getElementById('encodeBtn').addEventListener('click', () => this.encodeText());
        document.getElementById('decodeBtn').addEventListener('click', () => this.decodeText());
        document.getElementById('swapBtn').addEventListener('click', () => this.swapInputOutput());
        document.getElementById('pasteBtn').addEventListener('click', () => this.pasteFromClipboard());
        document.getElementById('clearInputBtn').addEventListener('click', () => this.clearInput());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadOutput());
        document.getElementById('clearOutputBtn').addEventListener('click', () => this.clearOutput());

        // Component mode events
        document.getElementById('buildUrlBtn').addEventListener('click', () => this.buildUrl());
        document.getElementById('parseUrlBtn').addEventListener('click', () => this.parseUrl());

        // Batch mode events
        document.getElementById('batchEncodeBtn').addEventListener('click', () => this.batchEncode());
        document.getElementById('batchDecodeBtn').addEventListener('click', () => this.batchDecode());

        // Settings and history
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.openHistory());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('closeHistory').addEventListener('click', () => this.closeHistory());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('overlay').addEventListener('click', () => this.closeAllPanels());

        // Settings changes
        document.getElementById('encodeSpaces').addEventListener('change', (e) => {
            this.settings.encodeSpaces = e.target.value;
            this.saveSettings();
        });
        document.getElementById('encodeReserved').addEventListener('change', (e) => {
            this.settings.encodeReserved = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('preserveCase').addEventListener('change', (e) => {
            this.settings.preserveCase = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('customChars').addEventListener('input', (e) => {
            this.settings.customChars = e.target.value;
            this.saveSettings();
        });

        // Input monitoring
        document.getElementById('inputText').addEventListener('input', () => this.updateInputInfo());
        document.getElementById('outputText').addEventListener('input', () => this.updateOutputInfo());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.encodeText();
                        break;
                    case 'c':
                        if (e.target.id === 'outputText') {
                            e.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.downloadOutput();
                        break;
                    case 'Delete':
                        e.preventDefault();
                        this.clearInput();
                        this.clearOutput();
                        break;
                }
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    encodeText() {
        const input = document.getElementById('inputText').value;
        if (!input.trim()) {
            this.showMessage('Please enter text to encode', 'warning');
            return;
        }

        try {
            let encoded;
            if (this.settings.encodeSpaces === 'plus') {
                encoded = encodeURIComponent(input).replace(/%20/g, '+');
            } else {
                encoded = encodeURIComponent(input);
            }

            // Apply custom character encoding
            if (this.settings.customChars) {
                for (const char of this.settings.customChars) {
                    const regex = new RegExp(this.escapeRegex(char), 'g');
                    encoded = encoded.replace(regex, encodeURIComponent(char));
                }
            }

            // Handle case preservation
            if (!this.settings.preserveCase) {
                encoded = encoded.toLowerCase();
            }

            document.getElementById('outputText').value = encoded;
            this.updateOutputInfo();
            this.addToHistory('Encode', input, encoded);
            this.showMessage('Text encoded successfully', 'success');
        } catch (error) {
            this.showMessage('Error encoding text: ' + error.message, 'error');
        }
    }

    decodeText() {
        const input = document.getElementById('inputText').value;
        if (!input.trim()) {
            this.showMessage('Please enter text to decode', 'warning');
            return;
        }

        try {
            let decoded;
            if (this.settings.encodeSpaces === 'plus') {
                decoded = decodeURIComponent(input.replace(/\+/g, '%20'));
            } else {
                decoded = decodeURIComponent(input);
            }

            document.getElementById('outputText').value = decoded;
            this.updateOutputInfo();
            this.addToHistory('Decode', input, decoded);
            this.showMessage('Text decoded successfully', 'success');
        } catch (error) {
            this.showMessage('Error decoding text: ' + error.message, 'error');
        }
    }

    swapInputOutput() {
        const input = document.getElementById('inputText');
        const output = document.getElementById('outputText');
        const temp = input.value;
        input.value = output.value;
        output.value = temp;
        this.updateInputInfo();
        this.updateOutputInfo();
    }

    buildUrl() {
        const protocol = document.getElementById('protocol').value || 'https';
        const host = document.getElementById('host').value;
        const port = document.getElementById('port').value;
        const path = document.getElementById('path').value;
        const queryParams = document.getElementById('queryParams').value;
        const fragment = document.getElementById('fragment').value;

        if (!host) {
            this.showMessage('Host is required to build URL', 'warning');
            return;
        }

        try {
            let url = `${protocol}://${host}`;
            if (port) url += `:${port}`;
            if (path) url += path.startsWith('/') ? path : `/${path}`;
            if (queryParams) {
                const encodedParams = this.encodeQueryParams(queryParams);
                url += `?${encodedParams}`;
            }
            if (fragment) url += `#${encodeURIComponent(fragment)}`;

            document.getElementById('completeUrl').value = url;
            this.addToHistory('Build URL', 'Components', url);
            this.showMessage('URL built successfully', 'success');
        } catch (error) {
            this.showMessage('Error building URL: ' + error.message, 'error');
        }
    }

    parseUrl() {
        const urlText = document.getElementById('completeUrl').value;
        if (!urlText.trim()) {
            this.showMessage('Please enter a URL to parse', 'warning');
            return;
        }

        try {
            const url = new URL(urlText);
            document.getElementById('protocol').value = url.protocol.replace(':', '');
            document.getElementById('host').value = url.hostname;
            document.getElementById('port').value = url.port;
            document.getElementById('path').value = url.pathname;
            document.getElementById('queryParams').value = url.search.replace('?', '');
            document.getElementById('fragment').value = url.hash.replace('#', '');

            this.addToHistory('Parse URL', urlText, 'Components');
            this.showMessage('URL parsed successfully', 'success');
        } catch (error) {
            this.showMessage('Error parsing URL: ' + error.message, 'error');
        }
    }

    batchEncode() {
        const input = document.getElementById('batchInput').value;
        if (!input.trim()) {
            this.showMessage('Please enter URLs for batch encoding', 'warning');
            return;
        }

        const lines = input.split('\n').filter(line => line.trim());
        const results = lines.map(line => {
            try {
                return encodeURIComponent(line.trim());
            } catch (error) {
                return `ERROR: ${error.message}`;
            }
        });

        document.getElementById('batchOutput').value = results.join('\n');
        this.addToHistory('Batch Encode', `${lines.length} URLs`, `${results.length} results`);
        this.showMessage(`Batch encoded ${lines.length} URLs`, 'success');
    }

    batchDecode() {
        const input = document.getElementById('batchInput').value;
        if (!input.trim()) {
            this.showMessage('Please enter URLs for batch decoding', 'warning');
            return;
        }

        const lines = input.split('\n').filter(line => line.trim());
        const results = lines.map(line => {
            try {
                return decodeURIComponent(line.trim());
            } catch (error) {
                return `ERROR: ${error.message}`;
            }
        });

        document.getElementById('batchOutput').value = results.join('\n');
        this.addToHistory('Batch Decode', `${lines.length} URLs`, `${results.length} results`);
        this.showMessage(`Batch decoded ${lines.length} URLs`, 'success');
    }

    encodeQueryParams(params) {
        return params.split('&').map(param => {
            const [key, value] = param.split('=');
            if (value !== undefined) {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
            return encodeURIComponent(key);
        }).join('&');
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('inputText').value = text;
            this.updateInputInfo();
            this.showMessage('Text pasted from clipboard', 'success');
        } catch (error) {
            this.showMessage('Failed to paste from clipboard', 'error');
        }
    }

    async copyToClipboard() {
        const output = document.getElementById('outputText').value;
        if (!output) {
            this.showMessage('No output to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            this.showMessage('Output copied to clipboard', 'success');
        } catch (error) {
            this.showMessage('Failed to copy to clipboard', 'error');
        }
    }

    downloadOutput() {
        const output = document.getElementById('outputText').value;
        if (!output) {
            this.showMessage('No output to download', 'warning');
            return;
        }

        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'url-encoded-output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showMessage('Output downloaded successfully', 'success');
    }

    clearInput() {
        document.getElementById('inputText').value = '';
        this.updateInputInfo();
    }

    clearOutput() {
        document.getElementById('outputText').value = '';
        this.updateOutputInfo();
    }

    updateInputInfo() {
        const input = document.getElementById('inputText').value;
        const charCount = input.length;
        const byteSize = new Blob([input]).size;
        document.getElementById('inputInfo').textContent = `${charCount} characters, ${this.formatBytes(byteSize)}`;
    }

    updateOutputInfo() {
        const output = document.getElementById('outputText').value;
        const charCount = output.length;
        const byteSize = new Blob([output]).size;
        document.getElementById('outputInfo').textContent = `${charCount} characters, ${this.formatBytes(byteSize)}`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    openSettings() {
        document.getElementById('settingsPanel').classList.add('open');
        document.getElementById('overlay').classList.add('active');
        this.loadSettingsToUI();
    }

    closeSettings() {
        document.getElementById('settingsPanel').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    openHistory() {
        document.getElementById('historyPanel').classList.add('open');
        document.getElementById('overlay').classList.add('active');
        this.renderHistory();
    }

    closeHistory() {
        document.getElementById('historyPanel').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    closeAllPanels() {
        this.closeSettings();
        this.closeHistory();
    }

    loadSettingsToUI() {
        document.getElementById('encodeSpaces').value = this.settings.encodeSpaces;
        document.getElementById('encodeReserved').checked = this.settings.encodeReserved;
        document.getElementById('preserveCase').checked = this.settings.preserveCase;
        document.getElementById('customChars').value = this.settings.customChars;
    }

    saveSettings() {
        localStorage.setItem('urlEncoderSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('urlEncoderSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    addToHistory(operation, input, output) {
        const entry = {
            timestamp: new Date().toLocaleString(),
            operation,
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
            fullInput: input,
            fullOutput: output
        };
        
        this.history.unshift(entry);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        if (this.history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No conversion history yet</p>';
            return;
        }

        historyList.innerHTML = this.history.map(entry => `
            <div class="history-item" onclick="urlEncoder.useHistoryEntry('${entry.fullInput}', '${entry.fullOutput}')">
                <div class="timestamp">${entry.timestamp}</div>
                <div class="operation">${entry.operation}</div>
                <div class="content">Input: ${entry.input}</div>
                <div class="content">Output: ${entry.output}</div>
            </div>
        `).join('');
    }

    useHistoryEntry(input, output) {
        document.getElementById('inputText').value = input;
        document.getElementById('outputText').value = output;
        this.updateInputInfo();
        this.updateOutputInfo();
        this.closeHistory();
        this.switchTab('text');
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
        this.showMessage('History cleared', 'success');
    }

    saveHistory() {
        localStorage.setItem('urlEncoderHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('urlEncoderHistory');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.querySelector('.url-encoder-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'url-encoder-message';
            this.container.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `url-encoder-message ${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;

        // Show message
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Hide message after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// Global instance
window.urlEncoder = new UrlEncoderUtility();