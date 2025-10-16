/**
 * CSV to JSON Converter Utility
 * A specialized utility for converting CSV files to JSON format with advanced parsing options
 */

class CsvToJsonUtility {
    constructor() {
        this.conversionHistory = [];
        this.settings = {
            delimiter: ',',
            hasHeaders: true,
            trimWhitespace: true,
            skipEmptyRows: true,
            customHeaders: [],
            dataTypes: 'auto' // 'auto', 'string', 'number', 'mixed'
        };
    }

    /**
     * Initialize the CSV to JSON converter
     */
    init() {
        try {
            console.log('CSV to JSON Converter initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize CSV to JSON Converter:', error);
            return false;
        }
    }

    /**
     * Create the converter interface
     */
    createInterface(container) {
        const interfaceHTML = `
            <div class="csv-converter-interface">
                <div class="converter-header">
                    <h2><i class="fas fa-exchange-alt"></i> CSV to JSON Converter</h2>
                    <p>Convert CSV files to JSON format with customizable options</p>
                </div>

                <div class="converter-main">
                    <div class="input-section">
                        <div class="file-upload-area" id="csvUploadArea">
                            <div class="upload-icon">📊</div>
                            <h3>Upload CSV File</h3>
                            <p>Drop your CSV file here or click to browse</p>
                            <input type="file" id="csvFileInput" accept=".csv,.txt" style="display: none;">
                            <button class="upload-btn" onclick="document.getElementById('csvFileInput').click()">
                                <i class="fas fa-upload"></i> Choose File
                            </button>
                        </div>

                        <div class="text-input-area">
                            <h3>Or Paste CSV Data</h3>
                            <textarea id="csvTextInput" placeholder="Paste your CSV data here...\n\nExample:\nName,Age,City\nJohn,25,New York\nJane,30,Los Angeles"></textarea>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3><i class="fas fa-cog"></i> Conversion Settings</h3>
                        <div class="settings-grid">
                            <div class="setting-item">
                                <label for="delimiter">Delimiter:</label>
                                <select id="delimiter">
                                    <option value=",">Comma (,)</option>
                                    <option value=";">Semicolon (;)</option>
                                    <option value="\t">Tab</option>
                                    <option value="|">Pipe (|)</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <input type="text" id="customDelimiter" placeholder="Enter custom delimiter" style="display: none;">
                            </div>

                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="hasHeaders" checked>
                                    First row contains headers
                                </label>
                            </div>

                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="trimWhitespace" checked>
                                    Trim whitespace
                                </label>
                            </div>

                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="skipEmptyRows" checked>
                                    Skip empty rows
                                </label>
                            </div>

                            <div class="setting-item">
                                <label for="dataTypes">Data Types:</label>
                                <select id="dataTypes">
                                    <option value="auto">Auto-detect</option>
                                    <option value="string">All strings</option>
                                    <option value="number">All numbers</option>
                                    <option value="mixed">Mixed types</option>
                                </select>
                            </div>
                        </div>

                        <div class="custom-headers-section" id="customHeadersSection" style="display: none;">
                            <h4>Custom Headers</h4>
                            <div id="customHeadersContainer"></div>
                            <button id="addHeaderBtn" class="add-btn">+ Add Header</button>
                        </div>
                    </div>

                    <div class="action-section">
                        <button id="convertBtn" class="convert-btn" disabled>
                            <i class="fas fa-magic"></i> Convert to JSON
                        </button>
                        <button id="previewBtn" class="preview-btn" disabled>
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button id="clearBtn" class="clear-btn">
                            <i class="fas fa-trash"></i> Clear
                        </button>
                    </div>
                </div>

                <div class="output-section" id="outputSection" style="display: none;">
                    <div class="output-header">
                        <h3><i class="fas fa-code"></i> JSON Output</h3>
                        <div class="output-actions">
                            <button id="copyJsonBtn" class="action-btn">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button id="downloadJsonBtn" class="action-btn">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button id="formatJsonBtn" class="action-btn">
                                <i class="fas fa-indent"></i> Format
                            </button>
                            <button id="minifyJsonBtn" class="action-btn">
                                <i class="fas fa-compress"></i> Minify
                            </button>
                        </div>
                    </div>
                    <div class="json-output-container">
                        <pre id="jsonOutput"></pre>
                    </div>
                    <div class="conversion-stats" id="conversionStats"></div>
                </div>

                <div class="preview-section" id="previewSection" style="display: none;">
                    <h3><i class="fas fa-table"></i> Data Preview</h3>
                    <div id="dataPreview"></div>
                </div>

                <div class="history-section">
                    <h3><i class="fas fa-history"></i> Conversion History</h3>
                    <div id="historyContainer"></div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        container.innerHTML = interfaceHTML;
        this.setupEventListeners();
        this.updateHistoryDisplay();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('csvFileInput');
        const uploadArea = document.getElementById('csvUploadArea');
        const textInput = document.getElementById('csvTextInput');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });

        // Text input
        textInput.addEventListener('input', () => {
            this.enableButtons(textInput.value.trim().length > 0);
        });

        // Settings
        document.getElementById('delimiter').addEventListener('change', (e) => {
            const customDelimiterInput = document.getElementById('customDelimiter');
            if (e.target.value === 'custom') {
                customDelimiterInput.style.display = 'block';
                customDelimiterInput.focus();
            } else {
                customDelimiterInput.style.display = 'none';
                this.settings.delimiter = e.target.value === '\t' ? '\t' : e.target.value;
            }
        });

        document.getElementById('customDelimiter').addEventListener('input', (e) => {
            this.settings.delimiter = e.target.value;
        });

        document.getElementById('hasHeaders').addEventListener('change', (e) => {
            this.settings.hasHeaders = e.target.checked;
            this.toggleCustomHeaders();
        });

        ['trimWhitespace', 'skipEmptyRows'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.settings[id] = e.target.checked;
            });
        });

        document.getElementById('dataTypes').addEventListener('change', (e) => {
            this.settings.dataTypes = e.target.value;
        });

        // Action buttons
        document.getElementById('convertBtn').addEventListener('click', () => this.convertToJson());
        document.getElementById('previewBtn').addEventListener('click', () => this.previewData());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());

        // Output actions
        document.getElementById('copyJsonBtn')?.addEventListener('click', () => this.copyJson());
        document.getElementById('downloadJsonBtn')?.addEventListener('click', () => this.downloadJson());
        document.getElementById('formatJsonBtn')?.addEventListener('click', () => this.formatJson());
        document.getElementById('minifyJsonBtn')?.addEventListener('click', () => this.minifyJson());
    }

    /**
     * Handle file upload
     */
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    /**
     * Process uploaded file
     */
    async processFile(file) {
        try {
            if (!this.isValidCsvFile(file)) {
                throw new Error('Please select a valid CSV file (.csv or .txt)');
            }

            const content = await this.readFileContent(file);
            document.getElementById('csvTextInput').value = content;
            this.enableButtons(true);
            
            // Auto-detect delimiter
            this.autoDetectDelimiter(content);
            
            this.showMessage('File loaded successfully!', 'success');
        } catch (error) {
            this.showMessage('Error loading file: ' + error.message, 'error');
        }
    }

    /**
     * Validate CSV file
     */
    isValidCsvFile(file) {
        const validExtensions = ['.csv', '.txt'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return validExtensions.includes(fileExtension);
    }

    /**
     * Read file content
     */
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Auto-detect delimiter
     */
    autoDetectDelimiter(content) {
        const delimiters = [',', ';', '\t', '|'];
        const firstLine = content.split('\n')[0];
        
        let bestDelimiter = ',';
        let maxCount = 0;
        
        delimiters.forEach(delimiter => {
            const count = (firstLine.match(new RegExp(delimiter === '\t' ? '\t' : '\\' + delimiter, 'g')) || []).length;
            if (count > maxCount) {
                maxCount = count;
                bestDelimiter = delimiter;
            }
        });
        
        this.settings.delimiter = bestDelimiter;
        document.getElementById('delimiter').value = bestDelimiter;
    }

    /**
     * Parse CSV content
     */
    parseCsv(content) {
        const lines = content.split('\n');
        const result = [];
        let headers = [];
        
        // Filter empty lines if setting is enabled
        const filteredLines = this.settings.skipEmptyRows ? 
            lines.filter(line => line.trim().length > 0) : lines;
        
        if (filteredLines.length === 0) {
            throw new Error('No data found in CSV');
        }
        
        // Parse headers
        if (this.settings.hasHeaders) {
            headers = this.parseCsvLine(filteredLines[0]);
            filteredLines.shift(); // Remove header line
        } else {
            // Generate default headers or use custom ones
            const firstLine = this.parseCsvLine(filteredLines[0]);
            headers = this.settings.customHeaders.length > 0 ? 
                this.settings.customHeaders : 
                firstLine.map((_, index) => `Column${index + 1}`);
        }
        
        // Parse data rows
        filteredLines.forEach((line, index) => {
            if (line.trim().length === 0 && this.settings.skipEmptyRows) return;
            
            const values = this.parseCsvLine(line);
            const row = {};
            
            headers.forEach((header, i) => {
                let value = values[i] || '';
                
                if (this.settings.trimWhitespace) {
                    value = value.trim();
                }
                
                // Apply data type conversion
                row[header] = this.convertDataType(value);
            });
            
            result.push(row);
        });
        
        return { data: result, headers, totalRows: result.length };
    }

    /**
     * Parse a single CSV line
     */
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let i = 0;
        
        while (i < line.length) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i += 2;
                    continue;
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === this.settings.delimiter && !inQuotes) {
                // End of field
                result.push(current);
                current = '';
                i++;
                continue;
            } else {
                current += char;
            }
            
            i++;
        }
        
        // Add the last field
        result.push(current);
        
        return result;
    }

    /**
     * Convert data type based on settings
     */
    convertDataType(value) {
        if (this.settings.dataTypes === 'string') {
            return value;
        }
        
        if (this.settings.dataTypes === 'number') {
            const num = parseFloat(value);
            return isNaN(num) ? value : num;
        }
        
        if (this.settings.dataTypes === 'auto') {
            // Auto-detect type
            if (value === '') return null;
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
            
            const num = parseFloat(value);
            if (!isNaN(num) && isFinite(num) && value.toString() === num.toString()) {
                return num;
            }
        }
        
        return value;
    }

    /**
     * Convert CSV to JSON
     */
    convertToJson() {
        try {
            const csvContent = document.getElementById('csvTextInput').value.trim();
            if (!csvContent) {
                throw new Error('Please provide CSV data');
            }
            
            const parsed = this.parseCsv(csvContent);
            const jsonString = JSON.stringify(parsed.data, null, 2);
            
            // Display output
            document.getElementById('jsonOutput').textContent = jsonString;
            document.getElementById('outputSection').style.display = 'block';
            
            // Show conversion stats
            this.showConversionStats(parsed);
            
            // Add to history
            this.addToHistory({
                timestamp: new Date().toISOString(),
                rowCount: parsed.totalRows,
                headers: parsed.headers,
                settings: { ...this.settings }
            });
            
            this.showMessage('Conversion completed successfully!', 'success');
            
        } catch (error) {
            this.showMessage('Conversion failed: ' + error.message, 'error');
        }
    }

    /**
     * Preview CSV data
     */
    previewData() {
        try {
            const csvContent = document.getElementById('csvTextInput').value.trim();
            if (!csvContent) {
                throw new Error('Please provide CSV data');
            }
            
            const parsed = this.parseCsv(csvContent);
            const previewData = parsed.data.slice(0, 10); // Show first 10 rows
            
            let tableHTML = '<table class="preview-table"><thead><tr>';
            
            // Headers
            parsed.headers.forEach(header => {
                tableHTML += `<th>${this.escapeHtml(header)}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';
            
            // Data rows
            previewData.forEach(row => {
                tableHTML += '<tr>';
                parsed.headers.forEach(header => {
                    const value = row[header];
                    tableHTML += `<td>${this.escapeHtml(String(value || ''))}</td>`;
                });
                tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            if (parsed.data.length > 10) {
                tableHTML += `<p class="preview-note">Showing first 10 rows of ${parsed.data.length} total rows</p>`;
            }
            
            document.getElementById('dataPreview').innerHTML = tableHTML;
            document.getElementById('previewSection').style.display = 'block';
            
        } catch (error) {
            this.showMessage('Preview failed: ' + error.message, 'error');
        }
    }

    /**
     * Show conversion statistics
     */
    showConversionStats(parsed) {
        const stats = {
            totalRows: parsed.totalRows,
            totalColumns: parsed.headers.length,
            headers: parsed.headers,
            delimiter: this.settings.delimiter === '\t' ? 'Tab' : this.settings.delimiter,
            dataTypes: this.settings.dataTypes
        };
        
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Rows:</span>
                    <span class="stat-value">${stats.totalRows}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Columns:</span>
                    <span class="stat-value">${stats.totalColumns}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Delimiter:</span>
                    <span class="stat-value">${stats.delimiter}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Data Types:</span>
                    <span class="stat-value">${stats.dataTypes}</span>
                </div>
            </div>
            <div class="headers-list">
                <strong>Headers:</strong> ${stats.headers.join(', ')}
            </div>
        `;
        
        document.getElementById('conversionStats').innerHTML = statsHTML;
    }

    /**
     * Copy JSON to clipboard
     */
    async copyJson() {
        try {
            const jsonContent = document.getElementById('jsonOutput').textContent;
            await navigator.clipboard.writeText(jsonContent);
            this.showMessage('JSON copied to clipboard!', 'success');
        } catch (error) {
            this.showMessage('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Download JSON file
     */
    downloadJson() {
        try {
            const jsonContent = document.getElementById('jsonOutput').textContent;
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted_data_${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('JSON file downloaded!', 'success');
        } catch (error) {
            this.showMessage('Download failed: ' + error.message, 'error');
        }
    }

    /**
     * Format JSON output
     */
    formatJson() {
        try {
            const jsonContent = document.getElementById('jsonOutput').textContent;
            const parsed = JSON.parse(jsonContent);
            const formatted = JSON.stringify(parsed, null, 2);
            document.getElementById('jsonOutput').textContent = formatted;
            this.showMessage('JSON formatted!', 'success');
        } catch (error) {
            this.showMessage('Failed to format JSON: ' + error.message, 'error');
        }
    }

    /**
     * Minify JSON output
     */
    minifyJson() {
        try {
            const jsonContent = document.getElementById('jsonOutput').textContent;
            const parsed = JSON.parse(jsonContent);
            const minified = JSON.stringify(parsed);
            document.getElementById('jsonOutput').textContent = minified;
            this.showMessage('JSON minified!', 'success');
        } catch (error) {
            this.showMessage('Failed to minify JSON: ' + error.message, 'error');
        }
    }

    /**
     * Clear all inputs and outputs
     */
    clearAll() {
        document.getElementById('csvTextInput').value = '';
        document.getElementById('csvFileInput').value = '';
        document.getElementById('outputSection').style.display = 'none';
        document.getElementById('previewSection').style.display = 'none';
        this.enableButtons(false);
        this.showMessage('Cleared all data', 'info');
    }

    /**
     * Enable/disable action buttons
     */
    enableButtons(enabled) {
        document.getElementById('convertBtn').disabled = !enabled;
        document.getElementById('previewBtn').disabled = !enabled;
    }

    /**
     * Toggle custom headers section
     */
    toggleCustomHeaders() {
        const section = document.getElementById('customHeadersSection');
        section.style.display = this.settings.hasHeaders ? 'none' : 'block';
    }

    /**
     * Add conversion to history
     */
    addToHistory(conversion) {
        this.conversionHistory.unshift(conversion);
        if (this.conversionHistory.length > 20) {
            this.conversionHistory = this.conversionHistory.slice(0, 20);
        }
        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const container = document.getElementById('historyContainer');
        if (!container) return;
        
        if (this.conversionHistory.length === 0) {
            container.innerHTML = '<p class="no-history">No conversion history yet</p>';
            return;
        }
        
        let historyHTML = '';
        this.conversionHistory.forEach((item, index) => {
            const date = new Date(item.timestamp).toLocaleString();
            historyHTML += `
                <div class="history-item">
                    <div class="history-info">
                        <strong>Conversion ${index + 1}</strong>
                        <span class="history-date">${date}</span>
                    </div>
                    <div class="history-details">
                        <span>Rows: ${item.rowCount}</span>
                        <span>Columns: ${item.headers.length}</span>
                        <span>Delimiter: ${item.settings.delimiter === '\t' ? 'Tab' : item.settings.delimiter}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = historyHTML;
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.converter-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageEl = document.createElement('div');
        messageEl.className = `converter-message ${type}`;
        messageEl.textContent = message;
        
        const container = document.querySelector('.csv-converter-interface');
        container.insertBefore(messageEl, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
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
     * Get CSS styles for the interface
     */
    getStyles() {
        return `
            <style>
                .csv-converter-interface {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .converter-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                }

                .converter-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 2.2em;
                }

                .converter-header p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1.1em;
                }

                .converter-main {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 30px;
                    margin-bottom: 30px;
                }

                .input-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .file-upload-area {
                    border: 2px dashed #ddd;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    background: #fafafa;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .file-upload-area:hover,
                .file-upload-area.drag-over {
                    border-color: #667eea;
                    background: #f0f4ff;
                }

                .upload-icon {
                    font-size: 3em;
                    margin-bottom: 15px;
                }

                .upload-btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 15px;
                    transition: background 0.3s ease;
                }

                .upload-btn:hover {
                    background: #5a6fd8;
                }

                .text-input-area {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .text-input-area h3 {
                    margin: 0 0 15px 0;
                    color: #333;
                }

                #csvTextInput {
                    width: 100%;
                    height: 200px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    resize: vertical;
                }

                .settings-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    height: fit-content;
                }

                .settings-section h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 10px;
                }

                .settings-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .setting-item label {
                    font-weight: 500;
                    color: #555;
                }

                .setting-item select,
                .setting-item input[type="text"] {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                }

                .setting-item input[type="checkbox"] {
                    margin-right: 8px;
                }

                .action-section {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin: 30px 0;
                }

                .convert-btn,
                .preview-btn,
                .clear-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .convert-btn {
                    background: #28a745;
                    color: white;
                }

                .convert-btn:hover:not(:disabled) {
                    background: #218838;
                }

                .convert-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .preview-btn {
                    background: #17a2b8;
                    color: white;
                }

                .preview-btn:hover:not(:disabled) {
                    background: #138496;
                }

                .preview-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .clear-btn {
                    background: #dc3545;
                    color: white;
                }

                .clear-btn:hover {
                    background: #c82333;
                }

                .output-section,
                .preview-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 30px;
                }

                .output-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 15px;
                }

                .output-actions {
                    display: flex;
                    gap: 10px;
                }

                .action-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .action-btn:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                }

                .json-output-container {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    max-height: 400px;
                    overflow: auto;
                }

                #jsonOutput {
                    margin: 0;
                    padding: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                .conversion-stats {
                    margin-top: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #28a745;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                }

                .stat-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }

                .headers-list {
                    font-size: 14px;
                    color: #555;
                }

                .preview-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                .preview-table th,
                .preview-table td {
                    border: 1px solid #ddd;
                    padding: 8px 12px;
                    text-align: left;
                }

                .preview-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #333;
                }

                .preview-table tr:nth-child(even) {
                    background: #f9f9f9;
                }

                .preview-note {
                    margin-top: 15px;
                    padding: 10px;
                    background: #e3f2fd;
                    border-radius: 6px;
                    color: #1976d2;
                    font-style: italic;
                }

                .history-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .history-section h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 10px;
                }

                .history-item {
                    padding: 15px;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    background: #fafafa;
                }

                .history-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .history-date {
                    font-size: 12px;
                    color: #666;
                }

                .history-details {
                    display: flex;
                    gap: 15px;
                    font-size: 14px;
                    color: #555;
                }

                .no-history {
                    text-align: center;
                    color: #666;
                    font-style: italic;
                    padding: 20px;
                }

                .converter-message {
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                .converter-message.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .converter-message.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                .converter-message.info {
                    background: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #bee5eb;
                }

                @media (max-width: 768px) {
                    .converter-main {
                        grid-template-columns: 1fr;
                    }
                    
                    .action-section {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .output-header {
                        flex-direction: column;
                        gap: 15px;
                        align-items: flex-start;
                    }
                    
                    .output-actions {
                        flex-wrap: wrap;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CsvToJsonUtility;
} else if (typeof window !== 'undefined') {
    window.CsvToJsonUtility = CsvToJsonUtility;
}