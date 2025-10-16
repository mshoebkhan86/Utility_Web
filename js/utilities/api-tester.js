/**
 * API Tester Utility
 * Comprehensive REST API testing tool with support for various HTTP methods,
 * authentication, headers management, request/response handling, and testing features.
 */

class APITesterUtility {
    constructor() {
        this.currentRequest = {
            url: '',
            method: 'GET',
            headers: {},
            body: '',
            auth: {
                type: 'none',
                credentials: {}
            }
        };
        this.requestHistory = [];
        this.collections = [];
        this.environments = {
            current: 'default',
            variables: {
                default: {}
            }
        };
        this.isLoading = false;
    }

    // Initialize the API tester interface
    init() {
        this.createInterface();
        this.attachEventListeners();
        this.loadFromStorage();
        this.initializeDefaults();
    }
    
    initializeDefaults() {
        // Set default HTTP method
        const methodSelect = document.getElementById('httpMethod');
        if (methodSelect && !methodSelect.value) {
            methodSelect.value = 'GET';
        }
        
        // Set default auth type
        const authSelect = document.getElementById('authType');
        if (authSelect && !authSelect.value) {
            authSelect.value = 'none';
            this.updateAuthFields('none');
        }
        
        // Set default body type
        const bodySelect = document.getElementById('bodyType');
        if (bodySelect && !bodySelect.value) {
            bodySelect.value = 'none';
            this.updateBodyFields('none');
        }
        
        // Add initial empty header and parameter rows
        this.addHeaderRow();
        this.addParameterRow();
    }

    createInterface() {
        const container = document.getElementById('api-tester-container');
        if (!container) {
            console.error('API Tester container not found');
            return;
        }

        container.innerHTML = `
            <div class="api-tester-wrapper">
                <div class="api-tester-header">
                    <h2>🔌 API Tester</h2>
                    <p>Test REST APIs with comprehensive request/response handling</p>
                </div>

                <div class="api-tester-content">
                    <div class="main-content">
                        <!-- Request Configuration -->
                        <div class="request-section">
                        <div class="section-header">
                            <h3>📤 Request Configuration</h3>
                            <div class="request-actions">
                                <button id="saveRequestBtn" class="btn btn-outline">💾 Save</button>
                                <button id="loadRequestBtn" class="btn btn-outline">📁 Load</button>
                                <button id="clearRequestBtn" class="btn btn-outline">🗑️ Clear</button>
                            </div>
                        </div>

                        <!-- URL and Method -->
                        <div class="url-method-section">
                            <div class="method-selector">
                                <select id="httpMethod" class="form-control method-select">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="PATCH">PATCH</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="HEAD">HEAD</option>
                                    <option value="OPTIONS">OPTIONS</option>
                                </select>
                            </div>
                            <div class="url-input-wrapper">
                                <input type="url" id="apiUrl" placeholder="Enter API endpoint URL (e.g., https://api.example.com/users)" 
                                       class="form-control url-input">
                                <button id="sendRequestBtn" class="btn btn-primary send-btn">
                                    <span class="btn-text">🚀 Send Request</span>
                                    <span class="btn-loading" style="display: none;">⏳ Sending...</span>
                                </button>
                            </div>
                        </div>

                        <!-- Request Tabs -->
                        <div class="request-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="headers">📋 Headers</button>
                                <button class="tab-btn" data-tab="auth">🔐 Auth</button>
                                <button class="tab-btn" data-tab="body">📝 Body</button>
                                <button class="tab-btn" data-tab="params">🔧 Params</button>
                            </div>

                            <!-- Headers Tab -->
                            <div id="headers-tab" class="tab-content active">
                                <div class="headers-section">
                                    <div class="headers-controls">
                                        <button id="addHeaderBtn" class="btn btn-outline">➕ Add Header</button>
                                        <button id="addCommonHeadersBtn" class="btn btn-outline">📋 Common Headers</button>
                                    </div>
                                    <div id="headersList" class="headers-list">
                                        <div class="header-item">
                                            <input type="text" placeholder="Header name" class="form-control header-key">
                                            <input type="text" placeholder="Header value" class="form-control header-value">
                                            <button class="btn btn-danger remove-header">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Authentication Tab -->
                            <div id="auth-tab" class="tab-content">
                                <div class="auth-section">
                                    <div class="auth-type-selector">
                                        <label>Authentication Type:</label>
                                        <select id="authType" class="form-control">
                                            <option value="none">No Auth</option>
                                            <option value="basic">Basic Auth</option>
                                            <option value="bearer">Bearer Token</option>
                                            <option value="apikey">API Key</option>
                                            <option value="oauth2">OAuth 2.0</option>
                                        </select>
                                    </div>
                                    <div id="authCredentials" class="auth-credentials">
                                        <!-- Auth fields will be populated based on type -->
                                    </div>
                                </div>
                            </div>

                            <!-- Body Tab -->
                            <div id="body-tab" class="tab-content">
                                <div class="body-section">
                                    <div class="body-type-selector">
                                        <label>Body Type:</label>
                                        <select id="bodyType" class="form-control">
                                            <option value="none">None</option>
                                            <option value="json">JSON</option>
                                            <option value="xml">XML</option>
                                            <option value="form">Form Data</option>
                                            <option value="raw">Raw Text</option>
                                        </select>
                                    </div>
                                    <div id="bodyContent" class="body-content">
                                        <textarea id="bodyTextarea" class="form-control body-textarea" 
                                                  placeholder="Enter request body..." rows="8"></textarea>
                                    </div>
                                    <div class="body-actions">
                                        <button id="formatBodyBtn" class="btn btn-outline">🎨 Format</button>
                                        <button id="validateBodyBtn" class="btn btn-outline">✅ Validate</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Parameters Tab -->
                            <div id="params-tab" class="tab-content">
                                <div class="params-section">
                                    <div class="params-controls">
                                        <button id="addParamBtn" class="btn btn-outline">➕ Add Parameter</button>
                                    </div>
                                    <div id="paramsList" class="params-list">
                                        <div class="param-item">
                                            <input type="text" placeholder="Parameter name" class="form-control param-key">
                                            <input type="text" placeholder="Parameter value" class="form-control param-value">
                                            <button class="btn btn-danger remove-param">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Response Section -->
                    <div class="response-section">
                        <div class="section-header">
                            <h3>📥 Response</h3>
                            <div class="response-actions">
                                <button id="copyResponseBtn" class="btn btn-outline" disabled>📋 Copy</button>
                                <button id="downloadResponseBtn" class="btn btn-outline" disabled>💾 Download</button>
                                <button id="saveToCollectionBtn" class="btn btn-outline" disabled>📚 Save to Collection</button>
                            </div>
                        </div>

                        <div id="responseContainer" class="response-container">
                            <div class="response-placeholder">
                                <div class="placeholder-icon">🔌</div>
                                <p>Send a request to see the response here</p>
                            </div>
                        </div>
                        </div>
                    </div>

                    <!-- History and Collections -->
                    <div class="sidebar-section">
                        <div class="sidebar-tabs">
                            <button class="sidebar-tab-btn active" data-tab="history">📜 History</button>
                            <button class="sidebar-tab-btn" data-tab="collections">📚 Collections</button>
                            <button class="sidebar-tab-btn" data-tab="environments">🌍 Environments</button>
                        </div>

                        <div id="history-sidebar" class="sidebar-content active">
                            <div class="sidebar-header">
                                <h4>Request History</h4>
                                <button id="clearHistoryBtn" class="btn btn-outline btn-sm">🗑️ Clear</button>
                            </div>
                            <div id="historyList" class="history-list">
                                <div class="empty-state">No requests yet</div>
                            </div>
                        </div>

                        <div id="collections-sidebar" class="sidebar-content">
                            <div class="sidebar-header">
                                <h4>Collections</h4>
                                <button id="createCollectionBtn" class="btn btn-outline btn-sm">➕ New</button>
                            </div>
                            <div id="collectionsList" class="collections-list">
                                <div class="empty-state">No collections yet</div>
                            </div>
                        </div>

                        <div id="environments-sidebar" class="sidebar-content">
                            <div class="sidebar-header">
                                <h4>Environments</h4>
                                <button id="createEnvironmentBtn" class="btn btn-outline btn-sm">➕ New</button>
                            </div>
                            <div id="environmentsList" class="environments-list">
                                <div class="environment-item active">
                                    <div class="environment-name">Default</div>
                                    <div class="environment-actions">
                                        <button class="btn btn-outline btn-xs">✏️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Send request button
        document.getElementById('sendRequestBtn').addEventListener('click', () => {
            this.sendRequest();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Sidebar tabs
        document.querySelectorAll('.sidebar-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSidebarTab(e.target.dataset.tab);
            });
        });

        // Headers management
        document.getElementById('addHeaderBtn').addEventListener('click', () => {
            this.addHeaderRow();
        });

        document.getElementById('addCommonHeadersBtn').addEventListener('click', () => {
            this.showCommonHeadersMenu();
        });

        // Parameters management
        document.getElementById('addParamBtn').addEventListener('click', () => {
            this.addParameterRow();
        });

        // Authentication type change
        document.getElementById('authType').addEventListener('change', (e) => {
            this.updateAuthFields(e.target.value);
        });

        // Body type change
        document.getElementById('bodyType').addEventListener('change', (e) => {
            this.updateBodyFields(e.target.value);
        });

        // Body formatting and validation
        document.getElementById('formatBodyBtn').addEventListener('click', () => {
            this.formatRequestBody();
        });

        document.getElementById('validateBodyBtn').addEventListener('click', () => {
            this.validateRequestBody();
        });

        // Response actions
        document.getElementById('copyResponseBtn').addEventListener('click', () => {
            this.copyResponse();
        });

        document.getElementById('downloadResponseBtn').addEventListener('click', () => {
            this.downloadResponse();
        });

        // Request actions
        document.getElementById('saveRequestBtn').addEventListener('click', () => {
            this.saveRequest();
        });

        document.getElementById('loadRequestBtn').addEventListener('click', () => {
            this.showLoadRequestDialog();
        });

        document.getElementById('clearRequestBtn').addEventListener('click', () => {
            this.clearRequest();
        });

        // History management
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // URL input enter key
        document.getElementById('apiUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendRequest();
            }
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    switchSidebarTab(tabName) {
        // Remove active class from all sidebar tabs
        document.querySelectorAll('.sidebar-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.sidebar-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-sidebar`).classList.add('active');
    }

    addHeaderRow(key = '', value = '') {
        const headersList = document.getElementById('headersList');
        const headerItem = document.createElement('div');
        headerItem.className = 'header-item';
        headerItem.innerHTML = `
            <input type="text" placeholder="Header name" class="form-control header-key" value="${key}">
            <input type="text" placeholder="Header value" class="form-control header-value" value="${value}">
            <button class="btn btn-danger remove-header">✕</button>
        `;

        // Add remove functionality
        headerItem.querySelector('.remove-header').addEventListener('click', () => {
            headerItem.remove();
        });

        headersList.appendChild(headerItem);
    }

    addParameterRow(key = '', value = '') {
        const paramsList = document.getElementById('paramsList');
        const paramItem = document.createElement('div');
        paramItem.className = 'param-item';
        paramItem.innerHTML = `
            <input type="text" placeholder="Parameter name" class="form-control param-key" value="${key}">
            <input type="text" placeholder="Parameter value" class="form-control param-value" value="${value}">
            <button class="btn btn-danger remove-param">✕</button>
        `;

        // Add remove functionality
        paramItem.querySelector('.remove-param').addEventListener('click', () => {
            paramItem.remove();
        });

        paramsList.appendChild(paramItem);
    }

    showCommonHeadersMenu() {
        const commonHeaders = [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Accept', value: 'application/json' },
            { name: 'User-Agent', value: 'API-Tester/1.0' },
            { name: 'Cache-Control', value: 'no-cache' },
            { name: 'Accept-Encoding', value: 'gzip, deflate' },
            { name: 'Connection', value: 'keep-alive' }
        ];

        const menu = document.createElement('div');
        menu.className = 'common-headers-menu';
        menu.innerHTML = `
            <div class="menu-header">Common Headers</div>
            ${commonHeaders.map(header => `
                <div class="menu-item" data-name="${header.name}" data-value="${header.value}">
                    <strong>${header.name}:</strong> ${header.value}
                </div>
            `).join('')}
        `;

        // Position and show menu
        const btn = document.getElementById('addCommonHeadersBtn');
        const rect = btn.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = rect.bottom + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.zIndex = '1000';

        document.body.appendChild(menu);

        // Add click handlers
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addHeaderRow(item.dataset.name, item.dataset.value);
                document.body.removeChild(menu);
            });
        });

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    if (document.body.contains(menu)) {
                        document.body.removeChild(menu);
                    }
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    updateAuthFields(authType) {
        const authCredentials = document.getElementById('authCredentials');
        
        switch (authType) {
            case 'none':
                authCredentials.innerHTML = '<div class="auth-none">No authentication required</div>';
                break;
            case 'basic':
                authCredentials.innerHTML = `
                    <div class="auth-field">
                        <label>Username:</label>
                        <input type="text" id="basicUsername" class="form-control" placeholder="Enter username">
                    </div>
                    <div class="auth-field">
                        <label>Password:</label>
                        <input type="password" id="basicPassword" class="form-control" placeholder="Enter password">
                    </div>
                `;
                break;
            case 'bearer':
                authCredentials.innerHTML = `
                    <div class="auth-field">
                        <label>Bearer Token:</label>
                        <input type="text" id="bearerToken" class="form-control" placeholder="Enter bearer token">
                    </div>
                `;
                break;
            case 'apikey':
                authCredentials.innerHTML = `
                    <div class="auth-field">
                        <label>Key Name:</label>
                        <input type="text" id="apiKeyName" class="form-control" placeholder="e.g., X-API-Key" value="X-API-Key">
                    </div>
                    <div class="auth-field">
                        <label>Key Value:</label>
                        <input type="text" id="apiKeyValue" class="form-control" placeholder="Enter API key">
                    </div>
                    <div class="auth-field">
                        <label>Add to:</label>
                        <select id="apiKeyLocation" class="form-control">
                            <option value="header">Header</option>
                            <option value="query">Query Parameter</option>
                        </select>
                    </div>
                `;
                break;
            case 'oauth2':
                authCredentials.innerHTML = `
                    <div class="auth-field">
                        <label>Access Token:</label>
                        <input type="text" id="oauth2Token" class="form-control" placeholder="Enter OAuth 2.0 access token">
                    </div>
                    <div class="auth-field">
                        <label>Token Type:</label>
                        <select id="oauth2TokenType" class="form-control">
                            <option value="Bearer">Bearer</option>
                            <option value="MAC">MAC</option>
                        </select>
                    </div>
                `;
                break;
        }
    }

    updateBodyFields(bodyType) {
        const bodyContent = document.getElementById('bodyContent');
        const bodyTextarea = document.getElementById('bodyTextarea');
        
        switch (bodyType) {
            case 'none':
                bodyContent.innerHTML = '<div class="body-none">No request body</div>';
                break;
            case 'json':
                bodyContent.innerHTML = `
                    <textarea id="bodyTextarea" class="form-control body-textarea" 
                              placeholder="{\n  \"key\": \"value\"\n}" rows="8"></textarea>
                `;
                break;
            case 'xml':
                bodyContent.innerHTML = `
                    <textarea id="bodyTextarea" class="form-control body-textarea" 
                              placeholder="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>\n  <element>value</element>\n</root>" rows="8"></textarea>
                `;
                break;
            case 'form':
                bodyContent.innerHTML = `
                    <div class="form-data-section">
                        <div class="form-data-controls">
                            <button id="addFormFieldBtn" class="btn btn-outline">➕ Add Field</button>
                        </div>
                        <div id="formDataList" class="form-data-list">
                            <div class="form-data-item">
                                <input type="text" placeholder="Field name" class="form-control form-key">
                                <input type="text" placeholder="Field value" class="form-control form-value">
                                <button class="btn btn-danger remove-form-field">✕</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add form field functionality
                document.getElementById('addFormFieldBtn').addEventListener('click', () => {
                    this.addFormDataField();
                });
                break;
            case 'raw':
                bodyContent.innerHTML = `
                    <textarea id="bodyTextarea" class="form-control body-textarea" 
                              placeholder="Enter raw text data..." rows="8"></textarea>
                `;
                break;
        }
    }

    addFormDataField(key = '', value = '') {
        const formDataList = document.getElementById('formDataList');
        const formDataItem = document.createElement('div');
        formDataItem.className = 'form-data-item';
        formDataItem.innerHTML = `
            <input type="text" placeholder="Field name" class="form-control form-key" value="${key}">
            <input type="text" placeholder="Field value" class="form-control form-value" value="${value}">
            <button class="btn btn-danger remove-form-field">✕</button>
        `;

        // Add remove functionality
        formDataItem.querySelector('.remove-form-field').addEventListener('click', () => {
            formDataItem.remove();
        });

        formDataList.appendChild(formDataItem);
    }

    formatRequestBody() {
        const bodyType = document.getElementById('bodyType').value;
        const bodyTextarea = document.getElementById('bodyTextarea');
        
        if (!bodyTextarea) return;
        
        try {
            if (bodyType === 'json') {
                const parsed = JSON.parse(bodyTextarea.value);
                bodyTextarea.value = JSON.stringify(parsed, null, 2);
                this.showNotification('JSON formatted successfully', 'success');
            } else if (bodyType === 'xml') {
                // Basic XML formatting (simplified)
                const formatted = this.formatXML(bodyTextarea.value);
                bodyTextarea.value = formatted;
                this.showNotification('XML formatted successfully', 'success');
            }
        } catch (error) {
            this.showNotification('Error formatting: ' + error.message, 'error');
        }
    }

    validateRequestBody() {
        const bodyType = document.getElementById('bodyType').value;
        const bodyTextarea = document.getElementById('bodyTextarea');
        
        if (!bodyTextarea) return;
        
        try {
            if (bodyType === 'json') {
                JSON.parse(bodyTextarea.value);
                this.showNotification('Valid JSON', 'success');
            } else if (bodyType === 'xml') {
                // Basic XML validation
                const parser = new DOMParser();
                const doc = parser.parseFromString(bodyTextarea.value, 'text/xml');
                const errors = doc.getElementsByTagName('parsererror');
                if (errors.length > 0) {
                    throw new Error('Invalid XML');
                }
                this.showNotification('Valid XML', 'success');
            }
        } catch (error) {
            this.showNotification('Validation error: ' + error.message, 'error');
        }
    }

    formatXML(xml) {
        const PADDING = ' '.repeat(2);
        const reg = /(>)(<)(\/*)/g;
        let formatted = xml.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        
        formatted = formatted.split('\r\n').map(line => {
            let indent = 0;
            if (line.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (line.match(/^<\/\w/) && pad > 0) {
                pad -= 1;
            } else if (line.match(/^<\w[^>]*[^/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }
            
            const padding = PADDING.repeat(pad);
            pad += indent;
            return padding + line;
        }).join('\r\n');
        
        return formatted;
    }

    async sendRequest() {
        if (this.isLoading) return;
        
        const url = document.getElementById('apiUrl').value.trim();
        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        this.setLoading(true);
        
        try {
            // Collect request data
            const requestData = this.collectRequestData();
            
            // Add to history
            this.addToHistory(requestData);
            
            // Send the request
            const response = await this.makeRequest(requestData);
            
            // Display response
            this.displayResponse(response);
            
        } catch (error) {
            this.displayError(error);
        } finally {
            this.setLoading(false);
        }
    }

    collectRequestData() {
        const url = document.getElementById('apiUrl').value.trim();
        const method = document.getElementById('httpMethod').value;
        
        // Collect headers
        const headers = {};
        document.querySelectorAll('.header-item').forEach(item => {
            const key = item.querySelector('.header-key').value.trim();
            const value = item.querySelector('.header-value').value.trim();
            if (key && value) {
                headers[key] = value;
            }
        });

        // Collect parameters
        const params = {};
        document.querySelectorAll('.param-item').forEach(item => {
            const key = item.querySelector('.param-key').value.trim();
            const value = item.querySelector('.param-value').value.trim();
            if (key && value) {
                params[key] = value;
            }
        });

        // Collect authentication
        const authType = document.getElementById('authType').value;
        const auth = this.collectAuthData(authType);

        // Collect body
        const bodyType = document.getElementById('bodyType').value;
        const body = this.collectBodyData(bodyType);

        return {
            url,
            method,
            headers,
            params,
            auth,
            body,
            timestamp: new Date().toISOString()
        };
    }

    collectAuthData(authType) {
        const auth = { type: authType };
        
        switch (authType) {
            case 'basic':
                const username = document.getElementById('basicUsername')?.value || '';
                const password = document.getElementById('basicPassword')?.value || '';
                auth.credentials = { username, password };
                break;
            case 'bearer':
                const token = document.getElementById('bearerToken')?.value || '';
                auth.credentials = { token };
                break;
            case 'apikey':
                const keyName = document.getElementById('apiKeyName')?.value || '';
                const keyValue = document.getElementById('apiKeyValue')?.value || '';
                const location = document.getElementById('apiKeyLocation')?.value || 'header';
                auth.credentials = { keyName, keyValue, location };
                break;
            case 'oauth2':
                const oauth2Token = document.getElementById('oauth2Token')?.value || '';
                const tokenType = document.getElementById('oauth2TokenType')?.value || 'Bearer';
                auth.credentials = { token: oauth2Token, tokenType };
                break;
        }
        
        return auth;
    }

    collectBodyData(bodyType) {
        const body = { type: bodyType };
        
        switch (bodyType) {
            case 'json':
            case 'xml':
            case 'raw':
                const textarea = document.getElementById('bodyTextarea');
                body.content = textarea ? textarea.value : '';
                break;
            case 'form':
                const formData = {};
                document.querySelectorAll('.form-data-item').forEach(item => {
                    const key = item.querySelector('.form-key').value.trim();
                    const value = item.querySelector('.form-value').value.trim();
                    if (key && value) {
                        formData[key] = value;
                    }
                });
                body.content = formData;
                break;
            default:
                body.content = '';
        }
        
        return body;
    }

    async makeRequest(requestData) {
        const startTime = performance.now();
        
        // Build URL with parameters
        let requestUrl = requestData.url;
        if (Object.keys(requestData.params).length > 0) {
            const urlParams = new URLSearchParams(requestData.params);
            requestUrl += (requestUrl.includes('?') ? '&' : '?') + urlParams.toString();
        }

        // Prepare headers
        const headers = { ...requestData.headers };
        
        // Add authentication headers
        if (requestData.auth.type === 'basic') {
            const { username, password } = requestData.auth.credentials;
            headers['Authorization'] = 'Basic ' + btoa(username + ':' + password);
        } else if (requestData.auth.type === 'bearer') {
            headers['Authorization'] = 'Bearer ' + requestData.auth.credentials.token;
        } else if (requestData.auth.type === 'apikey' && requestData.auth.credentials.location === 'header') {
            headers[requestData.auth.credentials.keyName] = requestData.auth.credentials.keyValue;
        } else if (requestData.auth.type === 'oauth2') {
            const { token, tokenType } = requestData.auth.credentials;
            headers['Authorization'] = `${tokenType} ${token}`;
        }

        // Prepare body
        let body = null;
        if (['POST', 'PUT', 'PATCH'].includes(requestData.method) && requestData.body.type !== 'none') {
            if (requestData.body.type === 'json') {
                body = requestData.body.content;
                headers['Content-Type'] = headers['Content-Type'] || 'application/json';
            } else if (requestData.body.type === 'xml') {
                body = requestData.body.content;
                headers['Content-Type'] = headers['Content-Type'] || 'application/xml';
            } else if (requestData.body.type === 'form') {
                const formData = new FormData();
                Object.entries(requestData.body.content).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                body = formData;
            } else if (requestData.body.type === 'raw') {
                body = requestData.body.content;
                headers['Content-Type'] = headers['Content-Type'] || 'text/plain';
            }
        }

        // Make the request
        try {
            const response = await fetch(requestUrl, {
                method: requestData.method,
                headers: headers,
                body: body,
                mode: 'cors'
            });

            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            // Get response headers
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            // Get response body
            let responseBody;
            const contentType = response.headers.get('content-type') || '';
            
            if (contentType.includes('application/json')) {
                try {
                    responseBody = await response.json();
                } catch {
                    responseBody = await response.text();
                }
            } else {
                responseBody = await response.text();
            }

            return {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body: responseBody,
                responseTime,
                size: new Blob([JSON.stringify(responseBody)]).size,
                url: requestUrl,
                request: requestData
            };

        } catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            throw {
                error: error.message,
                responseTime,
                request: requestData
            };
        }
    }

    displayResponse(response) {
        const container = document.getElementById('responseContainer');
        
        // Determine status color
        let statusColor = 'success';
        if (response.status >= 400) statusColor = 'error';
        else if (response.status >= 300) statusColor = 'warning';

        // Format response body
        let formattedBody = response.body;
        let bodyType = 'text';
        
        if (typeof response.body === 'object') {
            formattedBody = JSON.stringify(response.body, null, 2);
            bodyType = 'json';
        } else if (typeof response.body === 'string') {
            try {
                const parsed = JSON.parse(response.body);
                formattedBody = JSON.stringify(parsed, null, 2);
                bodyType = 'json';
            } catch {
                // Keep as text
            }
        }

        container.innerHTML = `
            <div class="response-content">
                <div class="response-status">
                    <div class="status-info ${statusColor}">
                        <span class="status-code">${response.status}</span>
                        <span class="status-text">${response.statusText}</span>
                        <span class="response-time">${response.responseTime}ms</span>
                        <span class="response-size">${this.formatBytes(response.size)}</span>
                    </div>
                </div>

                <div class="response-tabs">
                    <div class="response-tab-nav">
                        <button class="response-tab-btn active" data-tab="body">📄 Body</button>
                        <button class="response-tab-btn" data-tab="headers">📋 Headers</button>
                        <button class="response-tab-btn" data-tab="cookies">🍪 Cookies</button>
                    </div>

                    <div id="response-body-tab" class="response-tab-content active">
                        <div class="response-body-controls">
                            <span class="body-type-indicator">${bodyType.toUpperCase()}</span>
                            <button id="copyBodyBtn" class="btn btn-outline btn-sm">📋 Copy</button>
                            <button id="downloadBodyBtn" class="btn btn-outline btn-sm">💾 Download</button>
                        </div>
                        <pre class="response-body"><code class="${bodyType}">${this.escapeHtml(formattedBody)}</code></pre>
                    </div>

                    <div id="response-headers-tab" class="response-tab-content">
                        <div class="headers-table">
                            ${Object.entries(response.headers).map(([key, value]) => `
                                <div class="header-row">
                                    <div class="header-name">${key}</div>
                                    <div class="header-value">${value}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="response-cookies-tab" class="response-tab-content">
                        <div class="cookies-info">
                            <p>Cookie information would be displayed here</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add response tab functionality
        container.querySelectorAll('.response-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.response-tab-btn').forEach(b => b.classList.remove('active'));
                container.querySelectorAll('.response-tab-content').forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                container.querySelector(`#response-${e.target.dataset.tab}-tab`).classList.add('active');
            });
        });

        // Add copy body functionality
        container.querySelector('#copyBodyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(formattedBody).then(() => {
                this.showNotification('Response body copied to clipboard', 'success');
            });
        });

        // Add download body functionality
        container.querySelector('#downloadBodyBtn').addEventListener('click', () => {
            this.downloadResponseBody(formattedBody, bodyType);
        });

        // Enable response action buttons
        document.getElementById('copyResponseBtn').disabled = false;
        document.getElementById('downloadResponseBtn').disabled = false;
        document.getElementById('saveToCollectionBtn').disabled = false;
    }

    displayError(error) {
        const container = document.getElementById('responseContainer');
        
        container.innerHTML = `
            <div class="response-error">
                <div class="error-icon">❌</div>
                <div class="error-message">
                    <h4>Request Failed</h4>
                    <p>${error.error || error.message}</p>
                    ${error.responseTime ? `<p class="error-time">Failed after ${error.responseTime}ms</p>` : ''}
                </div>
            </div>
        `;
    }

    addToHistory(requestData) {
        const historyItem = {
            id: Date.now(),
            ...requestData,
            timestamp: new Date().toISOString()
        };
        
        this.requestHistory.unshift(historyItem);
        
        // Limit history to 50 items
        if (this.requestHistory.length > 50) {
            this.requestHistory = this.requestHistory.slice(0, 50);
        }
        
        this.updateHistoryDisplay();
        this.saveToStorage();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.requestHistory.length === 0) {
            historyList.innerHTML = '<div class="empty-state">No requests yet</div>';
            return;
        }
        
        historyList.innerHTML = this.requestHistory.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-method ${item.method.toLowerCase()}">${item.method}</div>
                <div class="history-url" title="${item.url}">${this.truncateUrl(item.url)}</div>
                <div class="history-time">${this.formatTime(item.timestamp)}</div>
                <div class="history-actions">
                    <button class="btn btn-outline btn-xs load-history" data-id="${item.id}">📁</button>
                    <button class="btn btn-danger btn-xs remove-history" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        historyList.querySelectorAll('.load-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.loadFromHistory(id);
            });
        });
        
        historyList.querySelectorAll('.remove-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.removeFromHistory(id);
            });
        });
    }

    loadFromHistory(id) {
        const item = this.requestHistory.find(h => h.id === id);
        if (!item) return;
        
        // Load URL and method
        document.getElementById('apiUrl').value = item.url;
        document.getElementById('httpMethod').value = item.method;
        
        // Load headers
        const headersList = document.getElementById('headersList');
        headersList.innerHTML = '';
        Object.entries(item.headers).forEach(([key, value]) => {
            this.addHeaderRow(key, value);
        });
        
        // Load parameters
        const paramsList = document.getElementById('paramsList');
        paramsList.innerHTML = '';
        Object.entries(item.params).forEach(([key, value]) => {
            this.addParameterRow(key, value);
        });
        
        // Load auth
        document.getElementById('authType').value = item.auth.type;
        this.updateAuthFields(item.auth.type);
        
        // Set auth credentials
        setTimeout(() => {
            if (item.auth.type === 'basic') {
                document.getElementById('basicUsername').value = item.auth.credentials.username || '';
                document.getElementById('basicPassword').value = item.auth.credentials.password || '';
            } else if (item.auth.type === 'bearer') {
                document.getElementById('bearerToken').value = item.auth.credentials.token || '';
            }
            // Add other auth types as needed
        }, 100);
        
        // Load body
        document.getElementById('bodyType').value = item.body.type;
        this.updateBodyFields(item.body.type);
        
        setTimeout(() => {
            if (item.body.type === 'json' || item.body.type === 'xml' || item.body.type === 'raw') {
                const textarea = document.getElementById('bodyTextarea');
                if (textarea) {
                    textarea.value = item.body.content;
                }
            }
        }, 100);
        
        this.showNotification('Request loaded from history', 'success');
    }

    removeFromHistory(id) {
        this.requestHistory = this.requestHistory.filter(h => h.id !== id);
        this.updateHistoryDisplay();
        this.saveToStorage();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all request history?')) {
            this.requestHistory = [];
            this.updateHistoryDisplay();
            this.saveToStorage();
            this.showNotification('History cleared', 'success');
        }
    }

    saveRequest() {
        const requestData = this.collectRequestData();
        const name = prompt('Enter a name for this request:');
        
        if (name) {
            const savedRequest = {
                id: Date.now(),
                name,
                ...requestData
            };
            
            // Add to default collection or create one
            if (this.collections.length === 0) {
                this.collections.push({
                    id: Date.now(),
                    name: 'Default Collection',
                    requests: []
                });
            }
            
            this.collections[0].requests.push(savedRequest);
            this.saveToStorage();
            this.showNotification('Request saved successfully', 'success');
        }
    }

    clearRequest() {
        if (confirm('Are you sure you want to clear the current request?')) {
            document.getElementById('apiUrl').value = '';
            document.getElementById('httpMethod').value = 'GET';
            document.getElementById('headersList').innerHTML = '<div class="header-item"><input type="text" placeholder="Header name" class="form-control header-key"><input type="text" placeholder="Header value" class="form-control header-value"><button class="btn btn-danger remove-header">✕</button></div>';
            document.getElementById('paramsList').innerHTML = '<div class="param-item"><input type="text" placeholder="Parameter name" class="form-control param-key"><input type="text" placeholder="Parameter value" class="form-control param-value"><button class="btn btn-danger remove-param">✕</button></div>';
            document.getElementById('authType').value = 'none';
            this.updateAuthFields('none');
            document.getElementById('bodyType').value = 'none';
            this.updateBodyFields('none');
            
            this.showNotification('Request cleared', 'success');
        }
    }

    copyResponse() {
        const responseBody = document.querySelector('.response-body code');
        if (responseBody) {
            navigator.clipboard.writeText(responseBody.textContent).then(() => {
                this.showNotification('Response copied to clipboard', 'success');
            });
        }
    }

    downloadResponse() {
        const responseBody = document.querySelector('.response-body code');
        if (responseBody) {
            this.downloadResponseBody(responseBody.textContent, 'json');
        }
    }

    downloadResponseBody(content, type) {
        const blob = new Blob([content], { type: `application/${type}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-response.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setLoading(loading) {
        this.isLoading = loading;
        const btn = document.getElementById('sendRequestBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            btn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            btn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    truncateUrl(url) {
        return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        try {
            localStorage.setItem('apiTesterHistory', JSON.stringify(this.requestHistory));
            localStorage.setItem('apiTesterCollections', JSON.stringify(this.collections));
            localStorage.setItem('apiTesterEnvironments', JSON.stringify(this.environments));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const history = localStorage.getItem('apiTesterHistory');
            if (history) {
                this.requestHistory = JSON.parse(history);
                this.updateHistoryDisplay();
            }
            
            const collections = localStorage.getItem('apiTesterCollections');
            if (collections) {
                this.collections = JSON.parse(collections);
            }
            
            const environments = localStorage.getItem('apiTesterEnvironments');
            if (environments) {
                this.environments = JSON.parse(environments);
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }
}

// Global instance
let apiTester = null;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('api-tester-container');
    if (container) {
        apiTester = new APITesterUtility();
        apiTester.init();
        
        // Make apiTester globally available
        window.apiTester = apiTester;
        
        // Dispatch custom event to notify that API Tester is ready
        window.dispatchEvent(new CustomEvent('apiTesterReady', { detail: apiTester }));
    }
});