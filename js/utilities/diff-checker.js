/**
 * Diff Checker Utility
 * Compares two text inputs and highlights differences
 * Supports multiple diff algorithms and view modes
 */
class DiffCheckerUtility {
    constructor() {
        this.container = null;
        this.leftTextArea = null;
        this.rightTextArea = null;
        this.diffOutput = null;
        this.currentViewMode = 'side-by-side'; // 'side-by-side' or 'unified'
        this.currentAlgorithm = 'myers'; // 'myers', 'patience', 'histogram'
        this.ignoreWhitespace = false;
        this.ignoreCase = false;
        this.contextLines = 3;
        this.history = [];
        this.maxHistorySize = 50;
        
        this.settings = {
            showLineNumbers: true,
            highlightSyntax: false,
            wordWrap: true,
            theme: 'light',
            fontSize: 14,
            tabSize: 4
        };
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }

        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        this.loadSettings();
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="diff-checker">
                <div class="diff-header">
                    <div class="header-title">
                        <h2>📊 Diff Checker</h2>
                        <p>Compare two text inputs and visualize differences</p>
                    </div>
                    <div class="header-controls">
                        <select id="viewModeSelect" class="view-mode-select">
                            <option value="side-by-side">Side by Side</option>
                            <option value="unified">Unified View</option>
                        </select>
                        <select id="algorithmSelect" class="algorithm-select">
                            <option value="myers">Myers Algorithm</option>
                            <option value="patience">Patience Algorithm</option>
                            <option value="histogram">Histogram Algorithm</option>
                        </select>
                    </div>
                </div>

                <div class="diff-controls">
                    <div class="control-group">
                        <button id="compareBtn" class="btn btn-primary">🔍 Compare</button>
                        <button id="clearBtn" class="btn btn-secondary">🗑️ Clear All</button>
                        <button id="swapBtn" class="btn btn-outline">🔄 Swap</button>
                    </div>
                    
                    <div class="control-group">
                        <button id="loadFileLeftBtn" class="btn btn-outline">📁 Load Left</button>
                        <button id="loadFileRightBtn" class="btn btn-outline">📁 Load Right</button>
                        <button id="exportBtn" class="btn btn-info">💾 Export Diff</button>
                    </div>

                    <div class="control-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="ignoreWhitespaceCheck"> Ignore Whitespace
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="ignoreCaseCheck"> Ignore Case
                        </label>
                    </div>

                    <div class="control-group">
                        <button id="settingsBtn" class="btn btn-settings">⚙️ Settings</button>
                        <button id="historyBtn" class="btn btn-history">📋 History</button>
                    </div>
                </div>

                <div class="diff-status">
                    <div class="status-info">
                        <span class="status-text">Ready to compare</span>
                        <span id="diffStats" class="diff-stats"></span>
                    </div>
                    <div class="legend">
                        <span class="legend-item"><span class="legend-color added"></span> Added</span>
                        <span class="legend-item"><span class="legend-color removed"></span> Removed</span>
                        <span class="legend-item"><span class="legend-color modified"></span> Modified</span>
                    </div>
                </div>

                <div class="diff-content">
                    <div class="input-section">
                        <div class="input-panel">
                            <div class="panel-header">
                                <h3>Original Text</h3>
                                <div class="panel-controls">
                                    <button id="loadSampleLeftBtn" class="btn btn-small">📝 Sample</button>
                                    <span id="leftStats" class="text-stats"></span>
                                </div>
                            </div>
                            <div class="editor-container">
                                <div id="leftLineNumbers" class="line-numbers"></div>
                                <textarea id="leftText" class="diff-input" placeholder="Paste or type your original text here..."></textarea>
                            </div>
                        </div>

                        <div class="input-panel">
                            <div class="panel-header">
                                <h3>Modified Text</h3>
                                <div class="panel-controls">
                                    <button id="loadSampleRightBtn" class="btn btn-small">📝 Sample</button>
                                    <span id="rightStats" class="text-stats"></span>
                                </div>
                            </div>
                            <div class="editor-container">
                                <div id="rightLineNumbers" class="line-numbers"></div>
                                <textarea id="rightText" class="diff-input" placeholder="Paste or type your modified text here..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="output-section">
                        <div class="output-header">
                            <h3>Diff Results</h3>
                            <div class="output-controls">
                                <button id="copyDiffBtn" class="btn btn-small">📋 Copy</button>
                                <button id="downloadDiffBtn" class="btn btn-small">⬇️ Download</button>
                            </div>
                        </div>
                        <div id="diffOutput" class="diff-output"></div>
                    </div>
                </div>

                <!-- Settings Panel -->
                <div id="settingsPanel" class="settings-panel" style="display: none;">
                    <div class="panel-content">
                        <h3>Settings</h3>
                        <div class="setting-group">
                            <label>Context Lines:</label>
                            <input type="number" id="contextLinesInput" min="0" max="20" value="3">
                        </div>
                        <div class="setting-group">
                            <label>Font Size:</label>
                            <input type="range" id="fontSizeSlider" min="10" max="24" value="14">
                            <span id="fontSizeValue">14px</span>
                        </div>
                        <div class="setting-group">
                            <label>Tab Size:</label>
                            <input type="number" id="tabSizeInput" min="2" max="8" value="4">
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="showLineNumbersCheck" checked> Show Line Numbers
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="wordWrapCheck" checked> Word Wrap
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="highlightSyntaxCheck"> Syntax Highlighting
                            </label>
                        </div>
                        <div class="setting-actions">
                            <button id="saveSettingsBtn" class="btn btn-primary">Save</button>
                            <button id="resetSettingsBtn" class="btn btn-secondary">Reset</button>
                        </div>
                    </div>
                </div>

                <!-- History Panel -->
                <div id="historyPanel" class="history-panel" style="display: none;">
                    <div class="panel-content">
                        <h3>Comparison History</h3>
                        <div id="historyList" class="history-list"></div>
                        <div class="history-actions">
                            <button id="clearHistoryBtn" class="btn btn-secondary">Clear History</button>
                        </div>
                    </div>
                </div>

                <!-- File Input (Hidden) -->
                <input type="file" id="fileInputLeft" accept=".txt,.js,.html,.css,.json,.xml,.md" style="display: none;">
                <input type="file" id="fileInputRight" accept=".txt,.js,.html,.css,.json,.xml,.md" style="display: none;">
            </div>
        `;

        // Get references to key elements
        this.leftTextArea = document.getElementById('leftText');
        this.rightTextArea = document.getElementById('rightText');
        this.diffOutput = document.getElementById('diffOutput');
    }

    attachEventListeners() {
        // Main controls
        document.getElementById('compareBtn').addEventListener('click', () => this.performDiff());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('swapBtn').addEventListener('click', () => this.swapTexts());
        
        // View mode and algorithm
        document.getElementById('viewModeSelect').addEventListener('change', (e) => {
            this.currentViewMode = e.target.value;
            if (this.diffOutput.innerHTML) {
                this.performDiff();
            }
        });
        
        document.getElementById('algorithmSelect').addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            if (this.diffOutput.innerHTML) {
                this.performDiff();
            }
        });

        // Options
        document.getElementById('ignoreWhitespaceCheck').addEventListener('change', (e) => {
            this.ignoreWhitespace = e.target.checked;
        });
        
        document.getElementById('ignoreCaseCheck').addEventListener('change', (e) => {
            this.ignoreCase = e.target.checked;
        });

        // File operations
        document.getElementById('loadFileLeftBtn').addEventListener('click', () => this.loadFile('left'));
        document.getElementById('loadFileRightBtn').addEventListener('click', () => this.loadFile('right'));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportDiff());
        
        // Sample data
        document.getElementById('loadSampleLeftBtn').addEventListener('click', () => this.loadSample('left'));
        document.getElementById('loadSampleRightBtn').addEventListener('click', () => this.loadSample('right'));
        
        // Output controls
        document.getElementById('copyDiffBtn').addEventListener('click', () => this.copyDiff());
        document.getElementById('downloadDiffBtn').addEventListener('click', () => this.downloadDiff());
        
        // Settings and history
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.toggleHistory());
        
        // Text area events
        this.leftTextArea.addEventListener('input', () => this.updateStats('left'));
        this.rightTextArea.addEventListener('input', () => this.updateStats('right'));
        this.leftTextArea.addEventListener('scroll', () => this.syncScroll('left'));
        this.rightTextArea.addEventListener('scroll', () => this.syncScroll('right'));
        
        // File input events
        document.getElementById('fileInputLeft').addEventListener('change', (e) => this.handleFileLoad(e, 'left'));
        document.getElementById('fileInputRight').addEventListener('change', (e) => this.handleFileLoad(e, 'right'));
        
        // Settings events
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettingsBtn').addEventListener('click', () => this.resetSettings());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        // Settings controls
        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            this.updateFontSize(e.target.value);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Initialize stats
        this.updateStats('left');
        this.updateStats('right');
    }

    /**
     * Core Diff Methods
     */
    performDiff() {
        const leftText = this.leftTextArea.value;
        const rightText = this.rightTextArea.value;
        
        if (!leftText && !rightText) {
            this.showStatus('Please enter text in both panels to compare', 'warning');
            return;
        }
        
        this.showStatus('Computing differences...', 'info');
        
        try {
            const diff = this.computeDiff(leftText, rightText);
            this.displayDiff(diff, leftText, rightText);
            this.updateDiffStats(diff);
            this.addToHistory(leftText, rightText, diff);
            this.showStatus('Comparison completed', 'success');
        } catch (error) {
            this.showStatus('Error computing diff: ' + error.message, 'error');
            console.error('Diff computation error:', error);
        }
    }
    
    computeDiff(leftText, rightText) {
        // Preprocess text based on options
        let left = this.preprocessText(leftText);
        let right = this.preprocessText(rightText);
        
        // Split into lines
        const leftLines = left.split('\n');
        const rightLines = right.split('\n');
        
        // Choose algorithm
        switch (this.currentAlgorithm) {
            case 'myers':
                return this.myersDiff(leftLines, rightLines);
            case 'patience':
                return this.patienceDiff(leftLines, rightLines);
            case 'histogram':
                return this.histogramDiff(leftLines, rightLines);
            default:
                return this.myersDiff(leftLines, rightLines);
        }
    }
    
    preprocessText(text) {
        let processed = text;
        
        if (this.ignoreCase) {
            processed = processed.toLowerCase();
        }
        
        if (this.ignoreWhitespace) {
            processed = processed.replace(/\s+/g, ' ').trim();
        }
        
        return processed;
    }
    
    // Myers Diff Algorithm (LCS-based)
    myersDiff(leftLines, rightLines) {
        const lcs = this.longestCommonSubsequence(leftLines, rightLines);
        return this.buildDiffFromLCS(leftLines, rightLines, lcs);
    }
    
    longestCommonSubsequence(a, b) {
        const m = a.length;
        const n = b.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Backtrack to find LCS
        const lcs = [];
        let i = m, j = n;
        while (i > 0 && j > 0) {
            if (a[i - 1] === b[j - 1]) {
                lcs.unshift({ left: i - 1, right: j - 1, line: a[i - 1] });
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
    
    buildDiffFromLCS(leftLines, rightLines, lcs) {
        const diff = [];
        let leftIndex = 0;
        let rightIndex = 0;
        let lcsIndex = 0;
        
        while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
            if (lcsIndex < lcs.length && 
                leftIndex === lcs[lcsIndex].left && 
                rightIndex === lcs[lcsIndex].right) {
                // Common line
                diff.push({
                    type: 'equal',
                    leftLine: leftIndex + 1,
                    rightLine: rightIndex + 1,
                    content: leftLines[leftIndex]
                });
                leftIndex++;
                rightIndex++;
                lcsIndex++;
            } else if (lcsIndex < lcs.length && leftIndex === lcs[lcsIndex].left) {
                // Insertion
                diff.push({
                    type: 'insert',
                    leftLine: null,
                    rightLine: rightIndex + 1,
                    content: rightLines[rightIndex]
                });
                rightIndex++;
            } else if (lcsIndex < lcs.length && rightIndex === lcs[lcsIndex].right) {
                // Deletion
                diff.push({
                    type: 'delete',
                    leftLine: leftIndex + 1,
                    rightLine: null,
                    content: leftLines[leftIndex]
                });
                leftIndex++;
            } else {
                // Handle remaining lines
                if (leftIndex < leftLines.length && rightIndex < rightLines.length) {
                    // Modification
                    diff.push({
                        type: 'delete',
                        leftLine: leftIndex + 1,
                        rightLine: null,
                        content: leftLines[leftIndex]
                    });
                    diff.push({
                        type: 'insert',
                        leftLine: null,
                        rightLine: rightIndex + 1,
                        content: rightLines[rightIndex]
                    });
                    leftIndex++;
                    rightIndex++;
                } else if (leftIndex < leftLines.length) {
                    // Deletion
                    diff.push({
                        type: 'delete',
                        leftLine: leftIndex + 1,
                        rightLine: null,
                        content: leftLines[leftIndex]
                    });
                    leftIndex++;
                } else {
                    // Insertion
                    diff.push({
                        type: 'insert',
                        leftLine: null,
                        rightLine: rightIndex + 1,
                        content: rightLines[rightIndex]
                    });
                    rightIndex++;
                }
            }
        }
        
        return diff;
    }
    
    // Patience Diff Algorithm (simplified)
    patienceDiff(leftLines, rightLines) {
        // For simplicity, fall back to Myers for now
        // In a full implementation, this would use patience sorting
        return this.myersDiff(leftLines, rightLines);
    }
    
    // Histogram Diff Algorithm (simplified)
    histogramDiff(leftLines, rightLines) {
        // For simplicity, fall back to Myers for now
        // In a full implementation, this would use histogram-based matching
        return this.myersDiff(leftLines, rightLines);
    }
    
    /**
     * Display Methods
     */
    displayDiff(diff, leftText, rightText) {
        if (this.currentViewMode === 'side-by-side') {
            this.displaySideBySide(diff, leftText, rightText);
        } else {
            this.displayUnified(diff);
        }
    }
    
    displaySideBySide(diff, leftText, rightText) {
        const leftLines = leftText.split('\n');
        const rightLines = rightText.split('\n');
        
        let html = `
            <div class="diff-side-by-side">
                <div class="diff-column">
                    <div class="column-header">Original</div>
                    <div class="diff-content-left">
        `;
        
        let leftLineNum = 1;
        let rightLineNum = 1;
        
        for (const change of diff) {
            if (change.type === 'equal') {
                html += `
                    <div class="diff-line equal">
                        <span class="line-number">${leftLineNum}</span>
                        <span class="line-content">${this.escapeHtml(change.content)}</span>
                    </div>
                `;
                leftLineNum++;
            } else if (change.type === 'delete') {
                html += `
                    <div class="diff-line deleted">
                        <span class="line-number">${leftLineNum}</span>
                        <span class="line-content">${this.escapeHtml(change.content)}</span>
                    </div>
                `;
                leftLineNum++;
            } else {
                html += `
                    <div class="diff-line empty">
                        <span class="line-number"></span>
                        <span class="line-content"></span>
                    </div>
                `;
            }
        }
        
        html += `
                    </div>
                </div>
                <div class="diff-column">
                    <div class="column-header">Modified</div>
                    <div class="diff-content-right">
        `;
        
        for (const change of diff) {
            if (change.type === 'equal') {
                html += `
                    <div class="diff-line equal">
                        <span class="line-number">${rightLineNum}</span>
                        <span class="line-content">${this.escapeHtml(change.content)}</span>
                    </div>
                `;
                rightLineNum++;
            } else if (change.type === 'insert') {
                html += `
                    <div class="diff-line added">
                        <span class="line-number">${rightLineNum}</span>
                        <span class="line-content">${this.escapeHtml(change.content)}</span>
                    </div>
                `;
                rightLineNum++;
            } else {
                html += `
                    <div class="diff-line empty">
                        <span class="line-number"></span>
                        <span class="line-content"></span>
                    </div>
                `;
            }
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        this.diffOutput.innerHTML = html;
    }
    
    displayUnified(diff) {
        let html = '<div class="diff-unified">';
        
        for (const change of diff) {
            let lineClass = '';
            let prefix = ' ';
            
            switch (change.type) {
                case 'equal':
                    lineClass = 'equal';
                    prefix = ' ';
                    break;
                case 'delete':
                    lineClass = 'deleted';
                    prefix = '-';
                    break;
                case 'insert':
                    lineClass = 'added';
                    prefix = '+';
                    break;
            }
            
            html += `
                <div class="diff-line ${lineClass}">
                    <span class="line-prefix">${prefix}</span>
                    <span class="line-number-left">${change.leftLine || ''}</span>
                    <span class="line-number-right">${change.rightLine || ''}</span>
                    <span class="line-content">${this.escapeHtml(change.content)}</span>
                </div>
            `;
        }
        
        html += '</div>';
        this.diffOutput.innerHTML = html;
    }
    
    /**
     * Utility Methods
     */
    updateDiffStats(diff) {
        let added = 0;
        let deleted = 0;
        let modified = 0;
        
        for (const change of diff) {
            switch (change.type) {
                case 'insert':
                    added++;
                    break;
                case 'delete':
                    deleted++;
                    break;
            }
        }
        
        // Count modifications (consecutive delete/insert pairs)
        for (let i = 0; i < diff.length - 1; i++) {
            if (diff[i].type === 'delete' && diff[i + 1].type === 'insert') {
                modified++;
                deleted--;
                added--;
            }
        }
        
        const statsHtml = `
            <div class="diff-stats">
                <span class="stat-item added">+${added}</span>
                <span class="stat-item deleted">-${deleted}</span>
                <span class="stat-item modified">~${modified}</span>
            </div>
        `;
        
        this.statusDiv.innerHTML = statsHtml;
    }
    
    updateStats(side) {
        const textArea = side === 'left' ? this.leftTextArea : this.rightTextArea;
        const statsDiv = side === 'left' ? this.leftStats : this.rightStats;
        
        const text = textArea.value;
        const lines = text ? text.split('\n').length : 0;
        const chars = text.length;
        const words = text ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
        
        statsDiv.innerHTML = `
            <span>Lines: ${lines}</span>
            <span>Words: ${words}</span>
            <span>Chars: ${chars}</span>
        `;
    }
    
    showStatus(message, type = 'info') {
        this.statusDiv.innerHTML = `<div class="status-${type}">${message}</div>`;
        
        if (type === 'success' || type === 'warning') {
            setTimeout(() => {
                this.statusDiv.innerHTML = '';
            }, 3000);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * File Operations
     */
    loadFile(side) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.js,.html,.css,.json,.xml,.md';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const textArea = side === 'left' ? this.leftTextArea : this.rightTextArea;
                    textArea.value = e.target.result;
                    this.updateStats(side);
                    this.showStatus(`File loaded: ${file.name}`, 'success');
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    saveFile(side) {
        const textArea = side === 'left' ? this.leftTextArea : this.rightTextArea;
        const content = textArea.value;
        
        if (!content.trim()) {
            this.showStatus('No content to save', 'warning');
            return;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${side}-text.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showStatus('File saved', 'success');
    }
    
    exportDiff() {
        const diffContent = this.diffOutput.textContent || this.diffOutput.innerText;
        
        if (!diffContent.trim()) {
            this.showStatus('No diff to export', 'warning');
            return;
        }
        
        const blob = new Blob([diffContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff-result.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showStatus('Diff exported', 'success');
    }
    
    /**
     * History Management
     */
    addToHistory(leftText, rightText, diff) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            leftText: leftText.substring(0, 100) + (leftText.length > 100 ? '...' : ''),
            rightText: rightText.substring(0, 100) + (rightText.length > 100 ? '...' : ''),
            diff: diff,
            algorithm: this.currentAlgorithm,
            viewMode: this.currentViewMode
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 10 items
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        if (!this.historyList) return;
        
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">No comparison history</div>';
            return;
        }
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-header">
                    <span class="history-time">${item.timestamp}</span>
                    <button class="history-load" data-id="${item.id}">Load</button>
                </div>
                <div class="history-preview">
                    <div class="history-text">Left: ${item.leftText}</div>
                    <div class="history-text">Right: ${item.rightText}</div>
                </div>
            `;
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    loadFromHistory(id) {
        const item = this.history.find(h => h.id === parseInt(id));
        if (!item) return;
        
        // Note: In a full implementation, we'd store the full text
        // For now, just show a message
        this.showStatus('History item selected (full text not stored in this demo)', 'info');
    }
    
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.showStatus('History cleared', 'success');
    }
    
    /**
     * Settings Management
     */
    updateSettings() {
        // Settings are updated in real-time through event listeners
        this.showStatus('Settings updated', 'success');
    }
    
    resetSettings() {
        this.ignoreCase = false;
        this.ignoreWhitespace = false;
        this.currentAlgorithm = 'myers';
        this.currentViewMode = 'side-by-side';
        
        // Update UI
        const ignoreCaseCheckbox = this.container.querySelector('#ignoreCase');
        const ignoreWhitespaceCheckbox = this.container.querySelector('#ignoreWhitespace');
        const algorithmSelect = this.container.querySelector('#diffAlgorithm');
        const viewModeSelect = this.container.querySelector('#viewMode');
        
        if (ignoreCaseCheckbox) ignoreCaseCheckbox.checked = false;
        if (ignoreWhitespaceCheckbox) ignoreWhitespaceCheckbox.checked = false;
        if (algorithmSelect) algorithmSelect.value = 'myers';
        if (viewModeSelect) viewModeSelect.value = 'side-by-side';
        
        this.showStatus('Settings reset to defaults', 'success');
    }
    
    /**
     * CSS Styles
     */
    addStyles() {
        if (document.getElementById('diff-checker-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'diff-checker-styles';
        style.textContent = `
            .diff-checker {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 1400px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .diff-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                text-align: center;
            }
            
            .diff-header h2 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            
            .diff-controls {
                background: #f8f9fa;
                padding: 15px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .diff-controls select,
            .diff-controls button {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .diff-controls button:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }
            
            .diff-controls button.primary {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .diff-controls button.primary:hover {
                background: #0056b3;
                border-color: #0056b3;
            }
            
            .diff-input-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1px;
                background: #e9ecef;
            }
            
            .diff-input-panel {
                background: white;
                display: flex;
                flex-direction: column;
            }
            
            .diff-input-header {
                background: #f8f9fa;
                padding: 12px 15px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .diff-input-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #495057;
            }
            
            .diff-input-controls {
                display: flex;
                gap: 8px;
            }
            
            .diff-input-controls button {
                padding: 6px 10px;
                font-size: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .diff-input-controls button:hover {
                background: #e9ecef;
            }
            
            .diff-textarea {
                flex: 1;
                min-height: 300px;
                padding: 15px;
                border: none;
                resize: vertical;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
                outline: none;
            }
            
            .diff-textarea:focus {
                background: #f8f9ff;
            }
            
            .diff-stats {
                padding: 8px 15px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #6c757d;
                display: flex;
                gap: 15px;
            }
            
            .diff-output {
                background: white;
                min-height: 400px;
                max-height: 600px;
                overflow: auto;
                border-top: 1px solid #e9ecef;
            }
            
            .diff-side-by-side {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1px;
                background: #e9ecef;
            }
            
            .diff-column {
                background: white;
            }
            
            .column-header {
                background: #f8f9fa;
                padding: 10px 15px;
                font-weight: 600;
                border-bottom: 1px solid #e9ecef;
                text-align: center;
            }
            
            .diff-content-left,
            .diff-content-right {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .diff-line {
                display: flex;
                align-items: center;
                min-height: 20px;
                padding: 2px 0;
            }
            
            .diff-line.equal {
                background: white;
            }
            
            .diff-line.added {
                background: #d4edda;
                border-left: 3px solid #28a745;
            }
            
            .diff-line.deleted {
                background: #f8d7da;
                border-left: 3px solid #dc3545;
            }
            
            .diff-line.empty {
                background: #f8f9fa;
            }
            
            .line-number {
                display: inline-block;
                width: 50px;
                padding: 0 8px;
                text-align: right;
                color: #6c757d;
                background: #f8f9fa;
                border-right: 1px solid #e9ecef;
                user-select: none;
            }
            
            .line-content {
                flex: 1;
                padding: 0 10px;
                white-space: pre-wrap;
                word-break: break-all;
            }
            
            .diff-unified {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .line-prefix {
                display: inline-block;
                width: 20px;
                text-align: center;
                font-weight: bold;
            }
            
            .line-number-left,
            .line-number-right {
                display: inline-block;
                width: 40px;
                padding: 0 5px;
                text-align: right;
                color: #6c757d;
                background: #f8f9fa;
                border-right: 1px solid #e9ecef;
            }
            
            .diff-status {
                padding: 15px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .status-info { color: #17a2b8; }
            .status-success { color: #28a745; }
            .status-warning { color: #ffc107; }
            .status-error { color: #dc3545; }
            
            .stat-item {
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
                margin-right: 8px;
            }
            
            .stat-item.added {
                background: #d4edda;
                color: #155724;
            }
            
            .stat-item.deleted {
                background: #f8d7da;
                color: #721c24;
            }
            
            .stat-item.modified {
                background: #fff3cd;
                color: #856404;
            }
            
            .diff-settings,
            .diff-history {
                background: white;
                border-top: 1px solid #e9ecef;
                padding: 15px;
                display: none;
            }
            
            .diff-settings.active,
            .diff-history.active {
                display: block;
            }
            
            .settings-group {
                margin-bottom: 15px;
            }
            
            .settings-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
                color: #495057;
            }
            
            .settings-group input[type="checkbox"] {
                margin-right: 8px;
            }
            
            .history-item {
                border: 1px solid #e9ecef;
                border-radius: 6px;
                margin-bottom: 10px;
                padding: 10px;
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .history-time {
                font-size: 12px;
                color: #6c757d;
            }
            
            .history-load {
                padding: 4px 8px;
                font-size: 12px;
                border: 1px solid #007bff;
                background: #007bff;
                color: white;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .history-preview {
                font-size: 12px;
                color: #6c757d;
            }
            
            .history-text {
                margin-bottom: 4px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            }
            
            .history-empty {
                text-align: center;
                color: #6c757d;
                font-style: italic;
                padding: 20px;
            }
            
            @media (max-width: 768px) {
                .diff-input-section {
                    grid-template-columns: 1fr;
                }
                
                .diff-side-by-side {
                    grid-template-columns: 1fr;
                }
                
                .diff-controls {
                    flex-direction: column;
                    align-items: stretch;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiffCheckerUtility;
} else if (typeof window !== 'undefined') {
    window.DiffCheckerUtility = DiffCheckerUtility;
}