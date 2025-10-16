/**
 * Base64 Encoder/Decoder Utility
 * A comprehensive Base64 encoding and decoding tool with file support
 * Features: Text encoding/decoding, file encoding/decoding, URL-safe Base64, validation
 */

class Base64EncoderUtility {
    constructor() {
        this.container = null;
        this.textInput = null;
        this.textOutput = null;
        this.fileInput = null;
        this.fileOutput = null;
        this.history = [];
        this.maxHistorySize = 50;
        this.settings = {
            urlSafe: false,
            lineBreaks: false,
            chunkSize: 76,
            preserveLineBreaks: true
        };
    }

    /**
     * Initialize the Base64 encoder
     */
    init() {
        console.log('Base64 Encoder Utility initialized');
        return true;
    }

    /**
     * Create the main interface
     */
    createInterface(container) {
        this.container = container;
        
        const interfaceHTML = `
            <div class="base64-encoder">
                ${this.createStyles()}
                
                <div class="encoder-header">
                    <h2><i class="fas fa-lock"></i> Base64 Encoder/Decoder</h2>
                    <div class="header-controls">
                        <button id="settingsBtn" class="btn btn-secondary" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button id="historyBtn" class="btn btn-secondary" title="History">
                            <i class="fas fa-history"></i>
                        </button>
                        <button id="clearAllBtn" class="btn btn-danger" title="Clear All">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="encoder-tabs">
                    <button class="tab-btn active" data-tab="text">Text Encoder</button>
                    <button class="tab-btn" data-tab="file">File Encoder</button>
                </div>

                <div class="tab-content">
                    <!-- Text Encoder Tab -->
                    <div id="textTab" class="tab-pane active">
                        <div class="encoder-section">
                            <div class="input-section">
                                <div class="section-header">
                                    <h3>Input Text</h3>
                                    <div class="section-controls">
                                        <button id="pasteBtn" class="btn btn-sm btn-outline">
                                            <i class="fas fa-paste"></i> Paste
                                        </button>
                                        <button id="clearInputBtn" class="btn btn-sm btn-outline">
                                            <i class="fas fa-times"></i> Clear
                                        </button>
                                    </div>
                                </div>
                                <textarea id="textInput" placeholder="Enter text to encode or Base64 string to decode..." rows="8"></textarea>
                                <div class="input-info">
                                    <span id="inputLength">0 characters</span>
                                    <span id="inputBytes">0 bytes</span>
                                </div>
                            </div>

                            <div class="encoder-controls">
                                <div class="control-buttons">
                                    <button id="encodeBtn" class="btn btn-primary">
                                        <i class="fas fa-arrow-down"></i> Encode to Base64
                                    </button>
                                    <button id="decodeBtn" class="btn btn-secondary">
                                        <i class="fas fa-arrow-up"></i> Decode from Base64
                                    </button>
                                    <button id="swapBtn" class="btn btn-outline" title="Swap input and output">
                                        <i class="fas fa-exchange-alt"></i>
                                    </button>
                                </div>
                                <div class="format-options">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="urlSafeCheck"> URL-Safe Base64
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="lineBreaksCheck"> Add Line Breaks
                                    </label>
                                </div>
                            </div>

                            <div class="output-section">
                                <div class="section-header">
                                    <h3>Output</h3>
                                    <div class="section-controls">
                                        <button id="copyBtn" class="btn btn-sm btn-success">
                                            <i class="fas fa-copy"></i> Copy
                                        </button>
                                        <button id="downloadTextBtn" class="btn btn-sm btn-primary">
                                            <i class="fas fa-download"></i> Download
                                        </button>
                                        <button id="clearOutputBtn" class="btn btn-sm btn-outline">
                                            <i class="fas fa-times"></i> Clear
                                        </button>
                                    </div>
                                </div>
                                <textarea id="textOutput" placeholder="Encoded/decoded result will appear here..." rows="8" readonly></textarea>
                                <div class="output-info">
                                    <span id="outputLength">0 characters</span>
                                    <span id="outputBytes">0 bytes</span>
                                    <span id="compressionRatio"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- File Encoder Tab -->
                    <div id="fileTab" class="tab-pane">
                        <div class="file-encoder-section">
                            <div class="file-input-section">
                                <div class="section-header">
                                    <h3>File Input</h3>
                                </div>
                                <div class="file-drop-zone" id="fileDropZone">
                                    <div class="drop-zone-content">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <h4>Drop files here or click to browse</h4>
                                        <p>Supports all file types for Base64 encoding</p>
                                        <input type="file" id="fileInput" multiple accept="*/*">
                                    </div>
                                </div>
                                <div class="file-list" id="fileList"></div>
                            </div>

                            <div class="file-controls">
                                <button id="encodeFilesBtn" class="btn btn-primary">
                                    <i class="fas fa-lock"></i> Encode Files
                                </button>
                                <button id="decodeFileBtn" class="btn btn-secondary">
                                    <i class="fas fa-unlock"></i> Decode Base64 to File
                                </button>
                                <button id="clearFilesBtn" class="btn btn-outline">
                                    <i class="fas fa-trash"></i> Clear Files
                                </button>
                            </div>

                            <div class="file-output-section">
                                <div class="section-header">
                                    <h3>Encoded Files</h3>
                                </div>
                                <div class="encoded-files" id="encodedFiles"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Panel -->
                <div id="settingsPanel" class="settings-panel">
                    <div class="settings-content">
                        <div class="settings-header">
                            <h3>Settings</h3>
                            <button id="closeSettingsBtn" class="btn btn-sm btn-outline">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="settings-body">
                            <div class="setting-group">
                                <label>Line Break Chunk Size:</label>
                                <input type="number" id="chunkSizeInput" min="0" max="200" value="76">
                                <small>Characters per line (0 = no breaks)</small>
                            </div>
                            <div class="setting-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="preserveLineBreaksCheck" checked>
                                    Preserve input line breaks when encoding
                                </label>
                            </div>
                            <div class="setting-group">
                                <button id="resetSettingsBtn" class="btn btn-outline">Reset to Defaults</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Panel -->
                <div id="historyPanel" class="history-panel">
                    <div class="history-content">
                        <div class="history-header">
                            <h3>Conversion History</h3>
                            <div class="history-controls">
                                <button id="clearHistoryBtn" class="btn btn-sm btn-outline">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                                <button id="closeHistoryBtn" class="btn btn-sm btn-outline">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="history-body" id="historyBody">
                            <p class="no-history">No conversion history yet</p>
                        </div>
                    </div>
                </div>

                <div id="messageDisplay" class="message-display"></div>
            </div>
        `;
        
        container.innerHTML = interfaceHTML;
        this.bindEvents();
        this.loadSettings();
    }

    /**
     * Create CSS styles
     */
    createStyles() {
        return `
            <style>
            .base64-encoder {
                max-width: 1200px;
                margin: 0 auto;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
            }

            .encoder-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .encoder-header h2 {
                margin: 0;
                font-size: 1.8em;
                font-weight: 600;
            }

            .header-controls {
                display: flex;
                gap: 10px;
            }

            .encoder-tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }

            .tab-btn {
                padding: 12px 24px;
                border: none;
                background: none;
                color: #6c757d;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .tab-btn.active {
                color: #667eea;
                border-bottom-color: #667eea;
            }

            .tab-btn:hover {
                color: #667eea;
                background: rgba(102, 126, 234, 0.1);
            }

            .tab-content {
                min-height: 500px;
            }

            .tab-pane {
                display: none;
            }

            .tab-pane.active {
                display: block;
            }

            .encoder-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .input-section, .output-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .section-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.2em;
            }

            .section-controls {
                display: flex;
                gap: 8px;
            }

            textarea {
                width: 100%;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
                resize: vertical;
                transition: border-color 0.3s ease;
            }

            textarea:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .input-info, .output-info {
                display: flex;
                gap: 20px;
                margin-top: 10px;
                font-size: 12px;
                color: #6c757d;
            }

            .encoder-controls {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }

            .control-buttons {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }

            .format-options {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #495057;
                cursor: pointer;
            }

            .checkbox-label input[type="checkbox"] {
                width: 16px;
                height: 16px;
                accent-color: #667eea;
            }

            /* File Encoder Styles */
            .file-encoder-section {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .file-input-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }

            .file-drop-zone {
                border: 3px dashed #dee2e6;
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            }

            .file-drop-zone:hover,
            .file-drop-zone.dragover {
                border-color: #667eea;
                background: rgba(102, 126, 234, 0.05);
            }

            .drop-zone-content i {
                font-size: 3em;
                color: #667eea;
                margin-bottom: 15px;
            }

            .drop-zone-content h4 {
                margin: 0 0 10px 0;
                color: #333;
            }

            .drop-zone-content p {
                margin: 0;
                color: #6c757d;
            }

            #fileInput {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .file-list {
                margin-top: 20px;
            }

            .file-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 8px;
                border: 1px solid #e9ecef;
            }

            .file-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .file-icon {
                width: 24px;
                height: 24px;
                background: #667eea;
                color: white;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }

            .file-details {
                display: flex;
                flex-direction: column;
            }

            .file-name {
                font-weight: 500;
                color: #333;
            }

            .file-size {
                font-size: 12px;
                color: #6c757d;
            }

            .file-controls {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }

            .file-output-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }

            .encoded-files {
                min-height: 200px;
            }

            .encoded-file-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                border: 1px solid #e9ecef;
            }

            .encoded-file-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .encoded-file-name {
                font-weight: 500;
                color: #333;
            }

            .encoded-file-controls {
                display: flex;
                gap: 8px;
            }

            .encoded-content {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                max-height: 150px;
                overflow-y: auto;
                word-break: break-all;
            }

            /* Button Styles */
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
            }

            .btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .btn-primary {
                background: #667eea;
                color: white;
            }

            .btn-primary:hover:not(:disabled) {
                background: #5a6fd8;
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover:not(:disabled) {
                background: #5a6268;
                transform: translateY(-1px);
            }

            .btn-success {
                background: #28a745;
                color: white;
            }

            .btn-success:hover:not(:disabled) {
                background: #218838;
                transform: translateY(-1px);
            }

            .btn-danger {
                background: #dc3545;
                color: white;
            }

            .btn-danger:hover:not(:disabled) {
                background: #c82333;
                transform: translateY(-1px);
            }

            .btn-outline {
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
            }

            .btn-outline:hover:not(:disabled) {
                background: #667eea;
                color: white;
            }

            .btn-sm {
                padding: 6px 12px;
                font-size: 12px;
            }

            /* Panel Styles */
            .settings-panel, .history-panel {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100vh;
                background: white;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                transition: right 0.3s ease;
                z-index: 1000;
                overflow-y: auto;
            }

            .settings-panel.open, .history-panel.open {
                right: 0;
            }

            .settings-content, .history-content {
                padding: 20px;
            }

            .settings-header, .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }

            .settings-header h3, .history-header h3 {
                margin: 0;
                color: #333;
            }

            .history-controls {
                display: flex;
                gap: 8px;
            }

            .setting-group {
                margin-bottom: 20px;
            }

            .setting-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }

            .setting-group input[type="number"] {
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                font-size: 14px;
            }

            .setting-group small {
                color: #6c757d;
                font-size: 12px;
            }

            .history-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                border: 1px solid #e9ecef;
            }

            .history-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .history-operation {
                font-weight: 500;
                color: #667eea;
            }

            .history-time {
                font-size: 12px;
                color: #6c757d;
            }

            .history-preview {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #495057;
                background: white;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #dee2e6;
                max-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .no-history {
                text-align: center;
                color: #6c757d;
                font-style: italic;
                padding: 40px 20px;
            }

            /* Message Display */
            .message-display {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1100;
                max-width: 300px;
            }

            .message {
                padding: 12px 16px;
                border-radius: 6px;
                margin-bottom: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.3s ease;
            }

            .message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }

            .message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }

            .message.info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
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

            /* Responsive Design */
            @media (max-width: 768px) {
                .base64-encoder {
                    padding: 10px;
                }

                .encoder-header {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }

                .control-buttons {
                    flex-direction: column;
                }

                .format-options {
                    flex-direction: column;
                    gap: 10px;
                }

                .settings-panel, .history-panel {
                    width: 100vw;
                    right: -100vw;
                }

                .file-controls {
                    flex-direction: column;
                }

                .section-controls {
                    flex-wrap: wrap;
                }
            }
            </style>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Tab switching
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Text input events
        this.textInput = this.container.querySelector('#textInput');
        this.textOutput = this.container.querySelector('#textOutput');
        
        this.textInput.addEventListener('input', () => {
            this.updateInputInfo();
            this.enableButtons();
        });

        // Control buttons
        this.container.querySelector('#encodeBtn').addEventListener('click', () => this.encodeText());
        this.container.querySelector('#decodeBtn').addEventListener('click', () => this.decodeText());
        this.container.querySelector('#swapBtn').addEventListener('click', () => this.swapTextContent());
        this.container.querySelector('#copyBtn').addEventListener('click', () => this.copyOutput());
        this.container.querySelector('#downloadTextBtn').addEventListener('click', () => this.downloadText());
        this.container.querySelector('#pasteBtn').addEventListener('click', () => this.pasteText());
        this.container.querySelector('#clearInputBtn').addEventListener('click', () => this.clearInput());
        this.container.querySelector('#clearOutputBtn').addEventListener('click', () => this.clearOutput());
        this.container.querySelector('#clearAllBtn').addEventListener('click', () => this.clearAll());

        // Settings
        this.container.querySelector('#settingsBtn').addEventListener('click', () => this.toggleSettings());
        this.container.querySelector('#closeSettingsBtn').addEventListener('click', () => this.toggleSettings());
        this.container.querySelector('#resetSettingsBtn').addEventListener('click', () => this.resetSettings());
        
        // History
        this.container.querySelector('#historyBtn').addEventListener('click', () => this.toggleHistory());
        this.container.querySelector('#closeHistoryBtn').addEventListener('click', () => this.toggleHistory());
        this.container.querySelector('#clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // Format options
        this.container.querySelector('#urlSafeCheck').addEventListener('change', (e) => {
            this.settings.urlSafe = e.target.checked;
            this.saveSettings();
        });
        
        this.container.querySelector('#lineBreaksCheck').addEventListener('change', (e) => {
            this.settings.lineBreaks = e.target.checked;
            this.saveSettings();
        });

        // Settings inputs
        this.container.querySelector('#chunkSizeInput').addEventListener('change', (e) => {
            this.settings.chunkSize = parseInt(e.target.value) || 76;
            this.saveSettings();
        });
        
        this.container.querySelector('#preserveLineBreaksCheck').addEventListener('change', (e) => {
            this.settings.preserveLineBreaks = e.target.checked;
            this.saveSettings();
        });

        // File handling
        this.fileInput = this.container.querySelector('#fileInput');
        const fileDropZone = this.container.querySelector('#fileDropZone');
        
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        
        // Drag and drop
        fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });
        
        fileDropZone.addEventListener('dragleave', () => {
            fileDropZone.classList.remove('dragover');
        });
        
        fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files);
        });

        // File control buttons
        this.container.querySelector('#encodeFilesBtn').addEventListener('click', () => this.encodeFiles());
        this.container.querySelector('#decodeFileBtn').addEventListener('click', () => this.decodeFileFromBase64());
        this.container.querySelector('#clearFilesBtn').addEventListener('click', () => this.clearFiles());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (this.textInput.value.trim()) {
                            this.encodeText();
                        }
                        break;
                    case 'Delete':
                        e.preventDefault();
                        this.clearAll();
                        break;
                    case 'c':
                        if (e.target === this.textOutput) {
                            e.preventDefault();
                            this.copyOutput();
                        }
                        break;
                    case 's':
                        if (this.textOutput.value.trim()) {
                            e.preventDefault();
                            this.downloadText();
                        }
                        break;
                }
            }
        });
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        this.container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.container.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        this.container.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        this.container.querySelector(`#${tabName}Tab`).classList.add('active');
    }

    /**
     * Encode text to Base64
     */
    encodeText() {
        const input = this.textInput.value;
        if (!input) {
            this.showMessage('Please enter text to encode', 'error');
            return;
        }

        try {
            let encoded = btoa(unescape(encodeURIComponent(input)));
            
            // Apply URL-safe encoding if enabled
            if (this.settings.urlSafe) {
                encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            }
            
            // Add line breaks if enabled
            if (this.settings.lineBreaks && this.settings.chunkSize > 0) {
                encoded = encoded.match(new RegExp(`.{1,${this.settings.chunkSize}}`, 'g')).join('\n');
            }
            
            this.textOutput.value = encoded;
            this.updateOutputInfo();
            this.addToHistory('encode', input, encoded);
            this.showMessage('Text encoded successfully!', 'success');
            
        } catch (error) {
            this.showMessage('Error encoding text: ' + error.message, 'error');
        }
    }

    /**
     * Decode Base64 to text
     */
    decodeText() {
        const input = this.textInput.value.trim();
        if (!input) {
            this.showMessage('Please enter Base64 string to decode', 'error');
            return;
        }

        try {
            let base64 = input.replace(/\s/g, ''); // Remove whitespace
            
            // Handle URL-safe Base64
            base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
            
            // Add padding if needed
            while (base64.length % 4) {
                base64 += '=';
            }
            
            const decoded = decodeURIComponent(escape(atob(base64)));
            this.textOutput.value = decoded;
            this.updateOutputInfo();
            this.addToHistory('decode', input, decoded);
            this.showMessage('Base64 decoded successfully!', 'success');
            
        } catch (error) {
            this.showMessage('Error decoding Base64: Invalid format', 'error');
        }
    }

    /**
     * Swap input and output content
     */
    swapTextContent() {
        const inputValue = this.textInput.value;
        const outputValue = this.textOutput.value;
        
        this.textInput.value = outputValue;
        this.textOutput.value = inputValue;
        
        this.updateInputInfo();
        this.updateOutputInfo();
        this.enableButtons();
        
        this.showMessage('Input and output swapped', 'info');
    }

    /**
     * Copy output to clipboard
     */
    async copyOutput() {
        const output = this.textOutput.value;
        if (!output) {
            this.showMessage('No output to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            this.showMessage('Output copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            this.textOutput.select();
            document.execCommand('copy');
            this.showMessage('Output copied to clipboard!', 'success');
        }
    }

    /**
     * Download text output as file
     */
    downloadText() {
        const output = this.textOutput.value;
        if (!output) {
            this.showMessage('No output to download', 'error');
            return;
        }

        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'base64_output.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('File downloaded successfully!', 'success');
    }

    /**
     * Paste text from clipboard
     */
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.textInput.value = text;
            this.updateInputInfo();
            this.enableButtons();
            this.showMessage('Text pasted from clipboard!', 'success');
        } catch (error) {
            this.showMessage('Unable to paste from clipboard', 'error');
        }
    }

    /**
     * Clear input
     */
    clearInput() {
        this.textInput.value = '';
        this.updateInputInfo();
        this.enableButtons();
    }

    /**
     * Clear output
     */
    clearOutput() {
        this.textOutput.value = '';
        this.updateOutputInfo();
    }

    /**
     * Clear all content
     */
    clearAll() {
        this.clearInput();
        this.clearOutput();
        this.clearFiles();
        this.showMessage('All content cleared', 'info');
    }

    /**
     * Handle file selection
     */
    handleFileSelect(files) {
        const fileList = this.container.querySelector('#fileList');
        fileList.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
        
        this.selectedFiles = files;
        this.enableFileButtons();
    }

    /**
     * Encode selected files
     */
    async encodeFiles() {
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
            this.showMessage('Please select files to encode', 'error');
            return;
        }

        const encodedFilesContainer = this.container.querySelector('#encodedFiles');
        encodedFilesContainer.innerHTML = '';
        
        for (const file of this.selectedFiles) {
            try {
                const base64 = await this.fileToBase64(file);
                this.displayEncodedFile(file.name, base64, file.type);
                this.addToHistory('file_encode', file.name, `${base64.substring(0, 50)}...`);
            } catch (error) {
                this.showMessage(`Error encoding ${file.name}: ${error.message}`, 'error');
            }
        }
        
        this.showMessage(`${this.selectedFiles.length} file(s) encoded successfully!`, 'success');
    }

    /**
     * Convert file to Base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Remove data URL prefix
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Display encoded file
     */
    displayEncodedFile(fileName, base64Content, mimeType) {
        const encodedFilesContainer = this.container.querySelector('#encodedFiles');
        
        const fileItem = document.createElement('div');
        fileItem.className = 'encoded-file-item';
        fileItem.innerHTML = `
            <div class="encoded-file-header">
                <div class="encoded-file-name">${fileName}</div>
                <div class="encoded-file-controls">
                    <button class="btn btn-sm btn-success" onclick="this.copyEncodedContent('${fileName}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="this.downloadEncodedFile('${fileName}', '${base64Content}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
            <div class="encoded-content">${base64Content}</div>
        `;
        
        // Bind copy and download functions to the buttons
        const copyBtn = fileItem.querySelector('.btn-success');
        const downloadBtn = fileItem.querySelector('.btn-primary');
        
        copyBtn.onclick = () => this.copyEncodedContent(base64Content);
        downloadBtn.onclick = () => this.downloadEncodedFile(fileName, base64Content);
        
        encodedFilesContainer.appendChild(fileItem);
    }

    /**
     * Copy encoded content
     */
    async copyEncodedContent(content) {
        try {
            await navigator.clipboard.writeText(content);
            this.showMessage('Base64 content copied to clipboard!', 'success');
        } catch (error) {
            this.showMessage('Failed to copy content', 'error');
        }
    }

    /**
     * Download encoded file
     */
    downloadEncodedFile(fileName, base64Content) {
        const blob = new Blob([base64Content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.base64`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Base64 file downloaded!', 'success');
    }

    /**
     * Decode Base64 to file
     */
    decodeFileFromBase64() {
        const base64Input = this.textInput.value.trim();
        if (!base64Input) {
            this.showMessage('Please enter Base64 content in the text input to decode to file', 'error');
            return;
        }

        try {
            // Clean the Base64 string
            let base64 = base64Input.replace(/\s/g, '');
            base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
            
            while (base64.length % 4) {
                base64 += '=';
            }

            // Convert to binary
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Create and download file
            const blob = new Blob([bytes]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'decoded_file';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('File decoded and downloaded successfully!', 'success');
            this.addToHistory('file_decode', 'Base64 content', 'decoded_file');
            
        } catch (error) {
            this.showMessage('Error decoding Base64 to file: Invalid format', 'error');
        }
    }

    /**
     * Clear selected files
     */
    clearFiles() {
        this.selectedFiles = null;
        this.container.querySelector('#fileList').innerHTML = '';
        this.container.querySelector('#encodedFiles').innerHTML = '';
        this.fileInput.value = '';
        this.enableFileButtons();
    }

    /**
     * Update input information
     */
    updateInputInfo() {
        const input = this.textInput.value;
        const length = input.length;
        const bytes = new Blob([input]).size;
        
        this.container.querySelector('#inputLength').textContent = `${length} characters`;
        this.container.querySelector('#inputBytes').textContent = `${bytes} bytes`;
    }

    /**
     * Update output information
     */
    updateOutputInfo() {
        const output = this.textOutput.value;
        const length = output.length;
        const bytes = new Blob([output]).size;
        
        this.container.querySelector('#outputLength').textContent = `${length} characters`;
        this.container.querySelector('#outputBytes').textContent = `${bytes} bytes`;
        
        // Calculate compression ratio for Base64
        const input = this.textInput.value;
        if (input && output) {
            const inputBytes = new Blob([input]).size;
            const outputBytes = new Blob([output]).size;
            const ratio = ((outputBytes / inputBytes) * 100).toFixed(1);
            this.container.querySelector('#compressionRatio').textContent = `Ratio: ${ratio}%`;
        } else {
            this.container.querySelector('#compressionRatio').textContent = '';
        }
    }

    /**
     * Enable/disable buttons based on content
     */
    enableButtons() {
        const hasInput = this.textInput.value.trim().length > 0;
        const hasOutput = this.textOutput.value.trim().length > 0;
        
        this.container.querySelector('#encodeBtn').disabled = !hasInput;
        this.container.querySelector('#decodeBtn').disabled = !hasInput;
        this.container.querySelector('#swapBtn').disabled = !hasInput && !hasOutput;
        this.container.querySelector('#copyBtn').disabled = !hasOutput;
        this.container.querySelector('#downloadTextBtn').disabled = !hasOutput;
        this.container.querySelector('#clearInputBtn').disabled = !hasInput;
        this.container.querySelector('#clearOutputBtn').disabled = !hasOutput;
    }

    /**
     * Enable/disable file buttons
     */
    enableFileButtons() {
        const hasFiles = this.selectedFiles && this.selectedFiles.length > 0;
        const hasTextInput = this.textInput.value.trim().length > 0;
        
        this.container.querySelector('#encodeFilesBtn').disabled = !hasFiles;
        this.container.querySelector('#decodeFileBtn').disabled = !hasTextInput;
        this.container.querySelector('#clearFilesBtn').disabled = !hasFiles;
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Add to conversion history
     */
    addToHistory(operation, input, output) {
        const historyItem = {
            operation,
            input: input.substring(0, 100),
            output: output.substring(0, 100),
            timestamp: new Date().toLocaleString(),
            settings: { ...this.settings }
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyBody = this.container.querySelector('#historyBody');
        
        if (this.history.length === 0) {
            historyBody.innerHTML = '<p class="no-history">No conversion history yet</p>';
            return;
        }
        
        historyBody.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-operation">${this.getOperationName(item.operation)}</span>
                    <span class="history-time">${item.timestamp}</span>
                </div>
                <div class="history-preview">${item.input}${item.input.length > 100 ? '...' : ''}</div>
            </div>
        `).join('');
    }

    /**
     * Get operation display name
     */
    getOperationName(operation) {
        const names = {
            'encode': 'Text → Base64',
            'decode': 'Base64 → Text',
            'file_encode': 'File → Base64',
            'file_decode': 'Base64 → File'
        };
        return names[operation] || operation;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.showMessage('History cleared', 'info');
    }

    /**
     * Toggle settings panel
     */
    toggleSettings() {
        const panel = this.container.querySelector('#settingsPanel');
        panel.classList.toggle('open');
    }

    /**
     * Toggle history panel
     */
    toggleHistory() {
        const panel = this.container.querySelector('#historyPanel');
        panel.classList.toggle('open');
    }

    /**
     * Load settings
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('base64EncoderSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
        
        // Apply settings to UI
        this.container.querySelector('#urlSafeCheck').checked = this.settings.urlSafe;
        this.container.querySelector('#lineBreaksCheck').checked = this.settings.lineBreaks;
        this.container.querySelector('#chunkSizeInput').value = this.settings.chunkSize;
        this.container.querySelector('#preserveLineBreaksCheck').checked = this.settings.preserveLineBreaks;
    }

    /**
     * Save settings
     */
    saveSettings() {
        try {
            localStorage.setItem('base64EncoderSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.settings = {
            urlSafe: false,
            lineBreaks: false,
            chunkSize: 76,
            preserveLineBreaks: true
        };
        
        this.loadSettings();
        this.saveSettings();
        this.showMessage('Settings reset to defaults', 'info');
    }

    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        const messageDisplay = this.container.querySelector('#messageDisplay');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        messageDisplay.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Base64EncoderUtility;
} else if (typeof window !== 'undefined') {
    window.Base64EncoderUtility = Base64EncoderUtility;
}