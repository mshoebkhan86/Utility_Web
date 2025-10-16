/**
 * SQL Formatter Utility
 * A comprehensive SQL formatting, validation, and beautification tool
 * Features: Format, minify, validate, syntax highlighting, query analysis
 */

class SqlFormatterUtility {
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
            keywordCase: 'upper', // 'upper', 'lower', 'preserve'
            identifierCase: 'preserve', // 'upper', 'lower', 'preserve'
            commaPosition: 'trailing', // 'leading', 'trailing'
            linesBetweenQueries: 1,
            maxLineLength: 120,
            insertSpaces: true,
            theme: 'light'
        };
        
        this.syntaxHighlighting = false;
        this.currentPlainOutput = ''; // Store plain text output
        
        // SQL Keywords for syntax highlighting and formatting
        this.keywords = {
            reserved: [
                'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
                'TABLE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'DATABASE', 'SCHEMA',
                'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON', 'USING',
                'GROUP', 'BY', 'ORDER', 'HAVING', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT',
                'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'EXISTS', 'BETWEEN', 'CASE',
                'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'WHILE', 'FOR', 'LOOP', 'BEGIN', 'COMMIT',
                'ROLLBACK', 'TRANSACTION', 'SAVEPOINT', 'GRANT', 'REVOKE', 'WITH', 'AS'
            ],
            functions: [
                'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'SUBSTRING', 'LENGTH', 'UPPER', 'LOWER',
                'TRIM', 'LTRIM', 'RTRIM', 'CONCAT', 'REPLACE', 'CAST', 'CONVERT', 'COALESCE',
                'ISNULL', 'NULLIF', 'DATEPART', 'DATEDIFF', 'GETDATE', 'NOW', 'CURRENT_TIMESTAMP'
            ],
            datatypes: [
                'INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT',
                'REAL', 'DOUBLE', 'CHAR', 'VARCHAR', 'NCHAR', 'NVARCHAR', 'TEXT', 'NTEXT',
                'DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'BOOLEAN', 'BIT', 'BINARY', 'VARBINARY'
            ]
        };
        
        this.loadSettings();
    }

    /**
     * Initialize the SQL formatter
     */
    init(container) {
        this.container = container;
        this.createInterface();
        this.attachEventListeners();
        this.updateDisplay();
        return this;
    }

    /**
     * Create the main interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="sql-formatter-container">
                <div class="formatter-header">
                    <div class="header-controls">
                        <div class="control-group">
                            <button id="formatBtn" class="btn btn-primary" title="Format SQL (Ctrl+F)">
                                <i class="fas fa-magic"></i> Format
                            </button>
                            <button id="minifyBtn" class="btn btn-secondary" title="Minify SQL (Ctrl+M)">
                                <i class="fas fa-compress-alt"></i> Minify
                            </button>
                            <button id="validateBtn" class="btn btn-info" title="Validate SQL (Ctrl+V)">
                                <i class="fas fa-check-circle"></i> Validate
                            </button>
                        </div>
                        <div class="control-group">
                            <button id="clearBtn" class="btn btn-outline" title="Clear All (Ctrl+Del)">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                            <button id="copyBtn" class="btn btn-outline" title="Copy Output (Ctrl+C)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button id="downloadBtn" class="btn btn-outline" title="Download SQL (Ctrl+S)">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                        <div class="control-group">
                            <button id="highlightBtn" class="btn btn-highlight" title="Toggle Syntax Highlighting">
                                <i class="fas fa-palette"></i> Highlight
                            </button>
                            <button id="settingsBtn" class="btn btn-outline" title="Settings">
                                <i class="fas fa-cog"></i>
                            </button>
                            <button id="historyBtn" class="btn btn-outline" title="History">
                                <i class="fas fa-history"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="formatter-main">
                    <div class="input-section">
                        <div class="section-header">
                            <h3><i class="fas fa-edit"></i> Input SQL</h3>
                            <div class="input-info">
                                <span id="inputInfo">0 characters, 0 lines</span>
                            </div>
                        </div>
                        <div class="input-container">
                            <textarea id="inputSql" placeholder="Enter your SQL query here...\n\nExample:\nselect * from users where age > 18 and status = 'active' order by created_at desc;"></textarea>
                            <div class="input-actions">
                                <button id="loadFileBtn" class="btn btn-sm btn-outline" title="Load SQL File">
                                    <i class="fas fa-file-upload"></i> Load File
                                </button>
                                <input type="file" id="fileInput" accept=".sql,.txt" style="display: none;">
                            </div>
                        </div>
                    </div>

                    <div class="output-section">
                        <div class="section-header">
                            <h3><i class="fas fa-code"></i> Formatted SQL</h3>
                            <div class="output-info">
                                <span id="outputInfo">Ready</span>
                            </div>
                        </div>
                        <div class="output-container">
                            <div id="outputSql" class="sql-output"></div>
                        </div>
                    </div>
                </div>

                <div class="formatter-footer">
                    <div id="statusDisplay" class="status-display"></div>
                    <div id="errorDisplay" class="error-display" style="display: none;"></div>
                </div>

                <!-- Settings Panel -->
                <div id="settingsPanel" class="settings-panel" style="display: none;">
                    <div class="panel-header">
                        <h3><i class="fas fa-cog"></i> Formatting Settings</h3>
                        <button id="closeSettings" class="btn btn-sm btn-outline">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="panel-content">
                        <div class="setting-group">
                            <label for="indentSize">Indent Size:</label>
                            <select id="indentSize">
                                <option value="2">2 spaces</option>
                                <option value="4">4 spaces</option>
                                <option value="8">8 spaces</option>
                                <option value="\t">Tab</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="keywordCase">Keyword Case:</label>
                            <select id="keywordCase">
                                <option value="upper">UPPERCASE</option>
                                <option value="lower">lowercase</option>
                                <option value="preserve">Preserve</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="identifierCase">Identifier Case:</label>
                            <select id="identifierCase">
                                <option value="preserve">Preserve</option>
                                <option value="upper">UPPERCASE</option>
                                <option value="lower">lowercase</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="commaPosition">Comma Position:</label>
                            <select id="commaPosition">
                                <option value="trailing">Trailing</option>
                                <option value="leading">Leading</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label for="maxLineLength">Max Line Length:</label>
                            <input type="number" id="maxLineLength" min="50" max="200" value="120">
                        </div>
                        <div class="setting-group">
                            <label for="linesBetweenQueries">Lines Between Queries:</label>
                            <input type="number" id="linesBetweenQueries" min="0" max="5" value="1">
                        </div>
                    </div>
                </div>

                <!-- History Panel -->
                <div id="historyPanel" class="history-panel" style="display: none;">
                    <div class="panel-header">
                        <h3><i class="fas fa-history"></i> Formatting History</h3>
                        <button id="closeHistory" class="btn btn-sm btn-outline">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="panel-content">
                        <div id="historyList" class="history-list">
                            <p class="empty-state">No formatting history yet</p>
                        </div>
                        <div class="history-actions">
                            <button id="clearHistory" class="btn btn-sm btn-outline">
                                <i class="fas fa-trash"></i> Clear History
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .sql-formatter-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .formatter-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1.5rem;
                }

                .header-controls {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    align-items: center;
                }

                .control-group {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .btn-primary:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.25);
                }

                .btn-info {
                    background: rgba(52, 152, 219, 0.2);
                    color: white;
                    border: 1px solid rgba(52, 152, 219, 0.3);
                }

                .btn-info:hover {
                    background: rgba(52, 152, 219, 0.3);
                }

                .btn-outline {
                    background: transparent;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Highlight button specific styles */
                .btn-highlight {
                    background: rgba(255, 193, 7, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    transition: all 0.3s ease;
                }

                .btn-highlight:hover {
                    background: rgba(255, 193, 7, 0.3);
                    transform: translateY(-2px);
                }

                .btn-highlight.active {
                    background: rgba(255, 193, 7, 0.4);
                    border-color: rgba(255, 193, 7, 0.6);
                    box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
                }

                .btn-highlight.active:hover {
                    background: rgba(255, 193, 7, 0.5);
                }

                .btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }

                .formatter-main {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1px;
                    background: #e9ecef;
                }

                .input-section, .output-section {
                    background: white;
                    display: flex;
                    flex-direction: column;
                }

                .section-header {
                    padding: 1rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .section-header h3 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .input-info, .output-info {
                    font-size: 0.8rem;
                    color: #666;
                }

                .input-container, .output-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                #inputSql {
                    flex: 1;
                    border: none;
                    padding: 1rem;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    resize: none;
                    outline: none;
                    background: white;
                    min-height: 400px;
                }

                .input-actions {
                    padding: 0.5rem 1rem;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                }

                .sql-output {
                    flex: 1;
                    padding: 1rem;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    background: #f8f9fa;
                    overflow-y: auto;
                    min-height: 400px;
                    white-space: pre-wrap;
                }

                .formatter-footer {
                    padding: 1rem;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                }

                .status-display {
                    font-size: 0.9rem;
                    color: #666;
                }

                .error-display {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 0.75rem;
                    border-radius: 6px;
                    border: 1px solid #f5c6cb;
                    margin-top: 0.5rem;
                }

                .settings-panel, .history-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .panel-header {
                    padding: 1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .panel-header h3 {
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .panel-content {
                    padding: 1.5rem;
                }

                .setting-group {
                    margin-bottom: 1rem;
                }

                .setting-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #2c3e50;
                }

                .setting-group select,
                .setting-group input {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.9rem;
                }

                .history-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .history-item {
                    padding: 0.75rem;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .history-item:hover {
                    background: #f8f9fa;
                    border-color: #667eea;
                }

                .history-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .history-item-time {
                    font-size: 0.8rem;
                    color: #666;
                }

                .history-item-preview {
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 0.8rem;
                    color: #333;
                    background: #f8f9fa;
                    padding: 0.5rem;
                    border-radius: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .history-actions {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e9ecef;
                }

                .empty-state {
                    text-align: center;
                    color: #666;
                    font-style: italic;
                    padding: 2rem;
                }

                /* SQL Syntax Highlighting */
                .sql-keyword {
                    color: #0066cc;
                    font-weight: bold;
                }

                .sql-function {
                    color: #cc6600;
                    font-weight: bold;
                }

                .sql-datatype {
                    color: #009900;
                    font-weight: bold;
                }

                .sql-string {
                    color: #cc0000;
                }

                .sql-number {
                    color: #ff6600;
                }

                .sql-comment {
                    color: #999999;
                    font-style: italic;
                }

                .sql-operator {
                    color: #666666;
                    font-weight: bold;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .formatter-main {
                        grid-template-columns: 1fr;
                    }

                    .header-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .control-group {
                        justify-content: center;
                    }

                    .settings-panel, .history-panel {
                        width: 95%;
                        max-height: 90vh;
                    }
                }
            </style>
        `;

        // Get references to DOM elements
        this.inputArea = document.getElementById('inputSql');
        this.outputArea = document.getElementById('outputSql');
        this.errorDisplay = document.getElementById('errorDisplay');
        this.statusDisplay = document.getElementById('statusDisplay');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Main action buttons
        document.getElementById('formatBtn').addEventListener('click', () => this.formatSql());
        document.getElementById('minifyBtn').addEventListener('click', () => this.minifySql());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateSql());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyOutput());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSql());

        // Panel toggles
        document.getElementById('highlightBtn').addEventListener('click', () => this.toggleSyntaxHighlighting());
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.toggleHistory());
        document.getElementById('closeSettings').addEventListener('click', () => this.toggleSettings());
        document.getElementById('closeHistory').addEventListener('click', () => this.toggleHistory());

        // File operations
        document.getElementById('loadFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        document.getElementById('fileInput').addEventListener('change', (e) => this.loadFile(e));

        // Input monitoring
        this.inputArea.addEventListener('input', () => this.updateInputInfo());
        this.inputArea.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Settings changes
        document.getElementById('indentSize').addEventListener('change', (e) => {
            this.settings.indentSize = e.target.value;
            this.saveSettings();
        });
        document.getElementById('keywordCase').addEventListener('change', (e) => {
            this.settings.keywordCase = e.target.value;
            this.saveSettings();
        });
        document.getElementById('identifierCase').addEventListener('change', (e) => {
            this.settings.identifierCase = e.target.value;
            this.saveSettings();
        });
        document.getElementById('commaPosition').addEventListener('change', (e) => {
            this.settings.commaPosition = e.target.value;
            this.saveSettings();
        });
        document.getElementById('maxLineLength').addEventListener('change', (e) => {
            this.settings.maxLineLength = parseInt(e.target.value);
            this.saveSettings();
        });
        document.getElementById('linesBetweenQueries').addEventListener('change', (e) => {
            this.settings.linesBetweenQueries = parseInt(e.target.value);
            this.saveSettings();
        });

        // History actions
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    }

    /**
     * Format SQL query
     */
    formatSql() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showMessage('Please enter SQL to format', 'warning');
            return;
        }

        try {
            const formatted = this.formatSqlQuery(input);
            this.displayOutput(formatted, this.syntaxHighlighting);
            this.addToHistory('format', input, formatted);
            this.showMessage('SQL formatted successfully', 'success');
        } catch (error) {
            this.showError('Formatting error: ' + error.message);
        }
    }

    /**
     * Minify SQL query
     */
    minifySql() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showMessage('Please enter SQL to minify', 'warning');
            return;
        }

        try {
            const minified = this.minifySqlQuery(input);
            this.displayOutput(minified, this.syntaxHighlighting);
            this.addToHistory('minify', input, minified);
            this.showMessage('SQL minified successfully', 'success');
        } catch (error) {
            this.showError('Minification error: ' + error.message);
        }
    }

    /**
     * Validate SQL query
     */
    validateSql() {
        const input = this.inputArea.value.trim();
        if (!input) {
            this.showMessage('Please enter SQL to validate', 'warning');
            return;
        }

        const validation = this.validateSqlQuery(input);
        if (validation.isValid) {
            this.showMessage('SQL is valid ✓', 'success');
            this.displayValidationResults(validation);
        } else {
            this.showError('SQL validation failed: ' + validation.errors.join(', '));
            this.displayValidationResults(validation);
        }
    }

    /**
     * Core SQL formatting logic
     */
    formatSqlQuery(sql) {
        // Remove extra whitespace and normalize
        sql = sql.replace(/\s+/g, ' ').trim();
        
        // Split into statements
        const statements = this.splitStatements(sql);
        
        return statements.map(statement => this.formatStatement(statement)).join('\n'.repeat(this.settings.linesBetweenQueries + 1));
    }

    /**
     * Format individual SQL statement
     */
    formatStatement(sql) {
        let formatted = sql;
        const indent = this.settings.indentSize === '\t' ? '\t' : ' '.repeat(parseInt(this.settings.indentSize));
        
        // Apply keyword casing
        formatted = this.applyCasing(formatted);
        
        // Format SELECT statements
        formatted = this.formatSelect(formatted, indent);
        
        // Format INSERT statements
        formatted = this.formatInsert(formatted, indent);
        
        // Format UPDATE statements
        formatted = this.formatUpdate(formatted, indent);
        
        // Format DELETE statements
        formatted = this.formatDelete(formatted, indent);
        
        // Format CREATE statements
        formatted = this.formatCreate(formatted, indent);
        
        // Format common clauses
        formatted = this.formatCommonClauses(formatted, indent);
        
        return formatted.trim();
    }

    /**
     * Apply keyword and identifier casing
     */
    applyCasing(sql) {
        let result = sql;
        
        // Apply keyword casing
        if (this.settings.keywordCase !== 'preserve') {
            this.keywords.reserved.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const replacement = this.settings.keywordCase === 'upper' ? keyword.toUpperCase() : keyword.toLowerCase();
                result = result.replace(regex, replacement);
            });
            
            this.keywords.functions.forEach(func => {
                const regex = new RegExp(`\\b${func}\\b`, 'gi');
                const replacement = this.settings.keywordCase === 'upper' ? func.toUpperCase() : func.toLowerCase();
                result = result.replace(regex, replacement);
            });
            
            this.keywords.datatypes.forEach(type => {
                const regex = new RegExp(`\\b${type}\\b`, 'gi');
                const replacement = this.settings.keywordCase === 'upper' ? type.toUpperCase() : type.toLowerCase();
                result = result.replace(regex, replacement);
            });
        }
        
        return result;
    }

    /**
     * Format SELECT statements
     */
    formatSelect(sql, indent) {
        // Handle SELECT clause
        sql = sql.replace(/\bSELECT\b/gi, '\nSELECT');
        
        // Handle column lists
        sql = sql.replace(/,\s*(?=\w)/g, this.settings.commaPosition === 'leading' ? '\n' + indent + ', ' : ',\n' + indent);
        
        // Handle FROM clause
        sql = sql.replace(/\bFROM\b/gi, '\nFROM');
        
        // Handle JOIN clauses
        sql = sql.replace(/\b(INNER|LEFT|RIGHT|FULL|CROSS)\s+JOIN\b/gi, '\n$1 JOIN');
        sql = sql.replace(/\bJOIN\b/gi, '\nJOIN');
        
        return sql;
    }

    /**
     * Format INSERT statements
     */
    formatInsert(sql, indent) {
        sql = sql.replace(/\bINSERT\s+INTO\b/gi, 'INSERT INTO');
        sql = sql.replace(/\bVALUES\b/gi, '\nVALUES');
        return sql;
    }

    /**
     * Format UPDATE statements
     */
    formatUpdate(sql, indent) {
        sql = sql.replace(/\bUPDATE\b/gi, 'UPDATE');
        sql = sql.replace(/\bSET\b/gi, '\nSET');
        return sql;
    }

    /**
     * Format DELETE statements
     */
    formatDelete(sql, indent) {
        sql = sql.replace(/\bDELETE\s+FROM\b/gi, 'DELETE FROM');
        return sql;
    }

    /**
     * Format CREATE statements
     */
    formatCreate(sql, indent) {
        sql = sql.replace(/\bCREATE\s+(TABLE|VIEW|INDEX|PROCEDURE|FUNCTION)\b/gi, 'CREATE $1');
        return sql;
    }

    /**
     * Format common clauses
     */
    formatCommonClauses(sql, indent) {
        // WHERE clause
        sql = sql.replace(/\bWHERE\b/gi, '\nWHERE');
        
        // GROUP BY clause
        sql = sql.replace(/\bGROUP\s+BY\b/gi, '\nGROUP BY');
        
        // HAVING clause
        sql = sql.replace(/\bHAVING\b/gi, '\nHAVING');
        
        // ORDER BY clause
        sql = sql.replace(/\bORDER\s+BY\b/gi, '\nORDER BY');
        
        // LIMIT clause
        sql = sql.replace(/\bLIMIT\b/gi, '\nLIMIT');
        
        // Handle logical operators
        sql = sql.replace(/\b(AND|OR)\b/gi, '\n' + indent + '$1');
        
        return sql;
    }

    /**
     * Minify SQL query
     */
    minifySqlQuery(sql) {
        return sql
            .replace(/\s+/g, ' ')
            .replace(/\s*([(),;])\s*/g, '$1')
            .replace(/\s*=\s*/g, '=')
            .replace(/\s*<\s*/g, '<')
            .replace(/\s*>\s*/g, '>')
            .trim();
    }

    /**
     * Validate SQL query
     */
    validateSqlQuery(sql) {
        const errors = [];
        const warnings = [];
        
        // Basic syntax checks
        const openParens = (sql.match(/\(/g) || []).length;
        const closeParens = (sql.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push('Mismatched parentheses');
        }
        
        const openQuotes = (sql.match(/'/g) || []).length;
        if (openQuotes % 2 !== 0) {
            errors.push('Unclosed string literal');
        }
        
        // Check for common issues
        if (sql.includes('SELECT *') && sql.toLowerCase().includes('join')) {
            warnings.push('Using SELECT * with JOINs may return unexpected results');
        }
        
        if (!sql.trim().endsWith(';') && !sql.trim().endsWith(')')) {
            warnings.push('Statement should end with semicolon');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            lineCount: sql.split('\n').length,
            characterCount: sql.length,
            wordCount: sql.split(/\s+/).length
        };
    }

    /**
     * Split SQL into individual statements
     */
    splitStatements(sql) {
        // Simple statement splitting (can be enhanced)
        return sql.split(';').filter(stmt => stmt.trim().length > 0);
    }

    /**
     * Display formatted output with syntax highlighting
     */
    displayOutput(sql, highlight = false) {
        // Store the plain text version
        this.currentPlainOutput = sql;
        
        if (highlight) {
            this.outputArea.innerHTML = this.applySyntaxHighlighting(sql);
        } else {
            this.outputArea.textContent = sql;
        }
        this.updateOutputInfo(sql);
    }

    /**
     * Apply syntax highlighting
     */
    applySyntaxHighlighting(sql) {
        let highlighted = this.escapeHtml(sql);
        
        // Highlight keywords
        this.keywords.reserved.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
        });
        
        // Highlight functions
        this.keywords.functions.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-function">${func}</span>`);
        });
        
        // Highlight data types
        this.keywords.datatypes.forEach(type => {
            const regex = new RegExp(`\\b${type}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-datatype">${type}</span>`);
        });
        
        // Highlight strings
        highlighted = highlighted.replace(/('([^'\\]|\\.)*')/g, '<span class="sql-string">$1</span>');
        
        // Highlight numbers
        highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, '<span class="sql-number">$&</span>');
        
        // Highlight comments
        highlighted = highlighted.replace(/--.*$/gm, '<span class="sql-comment">$&</span>');
        highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="sql-comment">$&</span>');
        
        // Highlight operators
        highlighted = highlighted.replace(/([=<>!]+|\bLIKE\b|\bIN\b|\bBETWEEN\b)/gi, '<span class="sql-operator">$1</span>');
        
        return highlighted;
    }

    /**
     * Display validation results
     */
    displayValidationResults(validation) {
        let output = `<div class="validation-results">\n`;
        output += `<h4>Validation Results</h4>\n`;
        output += `<p><strong>Status:</strong> ${validation.isValid ? '✅ Valid' : '❌ Invalid'}</p>\n`;
        output += `<p><strong>Lines:</strong> ${validation.lineCount}</p>\n`;
        output += `<p><strong>Characters:</strong> ${validation.characterCount}</p>\n`;
        output += `<p><strong>Words:</strong> ${validation.wordCount}</p>\n`;
        
        if (validation.errors.length > 0) {
            output += `<h5>Errors:</h5>\n<ul>\n`;
            validation.errors.forEach(error => {
                output += `<li style="color: #dc3545;">${error}</li>\n`;
            });
            output += `</ul>\n`;
        }
        
        if (validation.warnings.length > 0) {
            output += `<h5>Warnings:</h5>\n<ul>\n`;
            validation.warnings.forEach(warning => {
                output += `<li style="color: #ffc107;">${warning}</li>\n`;
            });
            output += `</ul>\n`;
        }
        
        output += `</div>`;
        
        this.outputArea.innerHTML = output;
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'f':
                    e.preventDefault();
                    this.formatSql();
                    break;
                case 'm':
                    e.preventDefault();
                    this.minifySql();
                    break;
                case 'v':
                    e.preventDefault();
                    this.validateSql();
                    break;
                case 'delete':
                    e.preventDefault();
                    this.clearAll();
                    break;
                case 's':
                    e.preventDefault();
                    this.downloadSql();
                    break;
                case 'c':
                    if (e.target === this.outputArea) {
                        e.preventDefault();
                        this.copyOutput();
                    }
                    break;
            }
        }
    }

    /**
     * Load SQL file
     */
    loadFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputArea.value = e.target.result;
            this.updateInputInfo();
            this.showMessage(`File "${file.name}" loaded successfully`, 'success');
        };
        reader.readAsText(file);
    }

    /**
     * Copy output to clipboard
     */
    async copyOutput() {
        const output = this.outputArea.textContent || this.outputArea.innerText;
        if (!output.trim()) {
            this.showMessage('No output to copy', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(output);
            this.showMessage('Output copied to clipboard', 'success');
        } catch (error) {
            this.showError('Failed to copy to clipboard');
        }
    }

    /**
     * Download SQL file
     */
    downloadSql() {
        const output = this.outputArea.textContent || this.outputArea.innerText;
        if (!output.trim()) {
            this.showMessage('No output to download', 'warning');
            return;
        }
        
        const blob = new Blob([output], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `formatted_sql_${new Date().getTime()}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('SQL file downloaded', 'success');
    }

    /**
     * Clear all content
     */
    clearAll() {
        this.inputArea.value = '';
        this.outputArea.innerHTML = '';
        this.hideError();
        this.updateInputInfo();
        this.updateOutputInfo('');
        this.showMessage('All content cleared', 'info');
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
     * Toggle history panel
     */
    toggleHistory() {
        const panel = document.getElementById('historyPanel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.updateHistoryDisplay();
        }
    }

    /**
     * Add operation to history
     */
    addToHistory(operation, input, output) {
        const historyItem = {
            id: Date.now(),
            operation,
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
            fullInput: input,
            fullOutput: output,
            timestamp: new Date().toLocaleString()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        this.saveHistory();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">No formatting history yet</p>';
            return;
        }
        
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="window.sqlFormatter.loadFromHistory('${item.id}')">
                <div class="history-item-header">
                    <strong>${item.operation.toUpperCase()}</strong>
                    <span class="history-item-time">${item.timestamp}</span>
                </div>
                <div class="history-item-preview">${item.input}</div>
            </div>
        `).join('');
    }

    /**
     * Load item from history
     */
    loadFromHistory(id) {
        const item = this.history.find(h => h.id == id);
        if (item) {
            this.inputArea.value = item.fullInput;
            this.displayOutput(item.fullOutput, this.syntaxHighlighting);
            this.updateInputInfo();
            this.toggleHistory();
            this.showMessage('History item loaded', 'success');
        }
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
        this.showMessage('History cleared', 'info');
    }

    /**
     * Update input information
     */
    updateInputInfo() {
        const text = this.inputArea.value;
        const chars = text.length;
        const lines = text.split('\n').length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        document.getElementById('inputInfo').textContent = `${chars} characters, ${lines} lines, ${words} words`;
    }

    /**
     * Update output information
     */
    updateOutputInfo(text) {
        if (!text) {
            document.getElementById('outputInfo').textContent = 'Ready';
            return;
        }
        
        const chars = text.length;
        const lines = text.split('\n').length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        document.getElementById('outputInfo').textContent = `${chars} characters, ${lines} lines, ${words} words`;
    }

    /**
     * Load settings to UI
     */
    loadSettingsToUI() {
        document.getElementById('indentSize').value = this.settings.indentSize;
        document.getElementById('keywordCase').value = this.settings.keywordCase;
        document.getElementById('identifierCase').value = this.settings.identifierCase;
        document.getElementById('commaPosition').value = this.settings.commaPosition;
        document.getElementById('maxLineLength').value = this.settings.maxLineLength;
        document.getElementById('linesBetweenQueries').value = this.settings.linesBetweenQueries;
    }

    /**
     * Update display
     */
    updateDisplay() {
        this.updateInputInfo();
        this.updateOutputInfo('');
    }

    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        this.statusDisplay.textContent = message;
        this.statusDisplay.style.color = colors[type] || colors.info;
        
        setTimeout(() => {
            this.statusDisplay.textContent = '';
        }, 3000);
    }

    /**
     * Show error
     */
    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
        
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    /**
     * Hide error
     */
    hideError() {
        this.errorDisplay.style.display = 'none';
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Save settings
     */
    saveSettings() {
        localStorage.setItem('sqlFormatterSettings', JSON.stringify(this.settings));
    }

    /**
     * Load settings
     */
    loadSettings() {
        const saved = localStorage.getItem('sqlFormatterSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    /**
     * Save history
     */
    saveHistory() {
        localStorage.setItem('sqlFormatterHistory', JSON.stringify(this.history));
    }

    /**
     * Load history
     */
    loadHistory() {
        const saved = localStorage.getItem('sqlFormatterHistory');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    /**
     * Toggle syntax highlighting
     */
    toggleSyntaxHighlighting() {
        this.syntaxHighlighting = !this.syntaxHighlighting;
        const btn = document.getElementById('highlightBtn');
        
        if (this.syntaxHighlighting) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        // Re-display current output using stored plain text
        if (this.currentPlainOutput && this.currentPlainOutput.trim()) {
            this.displayOutput(this.currentPlainOutput, this.syntaxHighlighting);
        }
        
        this.showMessage(`Syntax highlighting ${this.syntaxHighlighting ? 'enabled' : 'disabled'}`, 'info');
    }
}

// Global instance
window.sqlFormatter = new SqlFormatterUtility();

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('sqlFormatterContainer');
    if (container) {
        window.sqlFormatter.init(container);
    }
});