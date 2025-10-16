/**
 * Invoice Generator Utility
 * Provides comprehensive invoice generation functionality including
 * invoice creation, editing, item management, and completion features
 */
class InvoiceGeneratorUtility {
    constructor() {
        this.container = null;
        this.currentInvoice = null;
        this.invoiceHistory = [];
        this.nextInvoiceNumber = 1;
        this.settings = {
            currency: 'USD',
            taxRate: 0,
            companyInfo: {
                name: '',
                address: '',
                phone: '',
                email: '',
                website: ''
            }
        };
        this.loadSettings();
        this.loadInvoiceHistory();
    }

    /**
     * Initialize the invoice generator
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Invoice Generator container not found');
            return;
        }

        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        this.createNewInvoice();
    }

    /**
     * Create the invoice generator interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="invoice-generator">
                <div class="generator-header">
                    <h2>🧾 Invoice Generator</h2>
                    <p>Create professional invoices with ease</p>
                    <div class="header-actions">
                        <button id="newInvoiceBtn" class="btn btn-primary">
                            <i class="fas fa-plus"></i> New Invoice
                        </button>
                        <button id="loadInvoiceBtn" class="btn btn-secondary">
                            <i class="fas fa-folder-open"></i> Load Invoice
                        </button>
                        <button id="settingsBtn" class="btn btn-outline">
                            <i class="fas fa-cog"></i> Settings
                        </button>
                    </div>
                </div>

                <div class="generator-content">
                    <div class="invoice-form">
                        <!-- Company Information -->
                        <div class="form-section">
                            <h3>Company Information</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="companyName">Company Name</label>
                                    <input type="text" id="companyName" placeholder="Your Company Name">
                                </div>
                                <div class="form-group">
                                    <label for="companyAddress">Address</label>
                                    <textarea id="companyAddress" placeholder="Company Address" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="companyPhone">Phone</label>
                                    <input type="tel" id="companyPhone" placeholder="(555) 123-4567">
                                </div>
                                <div class="form-group">
                                    <label for="companyEmail">Email</label>
                                    <input type="email" id="companyEmail" placeholder="contact@company.com">
                                </div>
                            </div>
                        </div>

                        <!-- Invoice Details -->
                        <div class="form-section">
                            <h3>Invoice Details</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="invoiceNumber">Invoice Number</label>
                                    <input type="text" id="invoiceNumber" placeholder="INV-001">
                                </div>
                                <div class="form-group">
                                    <label for="invoiceDate">Invoice Date</label>
                                    <input type="date" id="invoiceDate">
                                </div>
                                <div class="form-group">
                                    <label for="dueDate">Due Date</label>
                                    <input type="date" id="dueDate">
                                </div>
                                <div class="form-group">
                                    <label for="invoiceStatus">Status</label>
                                    <select id="invoiceStatus">
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Client Information -->
                        <div class="form-section">
                            <h3>Bill To</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="clientName">Client Name</label>
                                    <input type="text" id="clientName" placeholder="Client Name">
                                </div>
                                <div class="form-group">
                                    <label for="clientAddress">Address</label>
                                    <textarea id="clientAddress" placeholder="Client Address" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="clientPhone">Phone</label>
                                    <input type="tel" id="clientPhone" placeholder="(555) 123-4567">
                                </div>
                                <div class="form-group">
                                    <label for="clientEmail">Email</label>
                                    <input type="email" id="clientEmail" placeholder="client@email.com">
                                </div>
                            </div>
                        </div>

                        <!-- Invoice Items -->
                        <div class="form-section">
                            <h3>Invoice Items</h3>
                            <div class="items-header">
                                <button id="addItemBtn" class="btn btn-success">
                                    <i class="fas fa-plus"></i> Add Item
                                </button>
                            </div>
                            <div class="items-table">
                                <table id="itemsTable">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="itemsTableBody">
                                        <!-- Items will be added here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Invoice Totals -->
                        <div class="form-section">
                            <div class="totals-section">
                                <div class="totals-grid">
                                    <div class="total-row">
                                        <span>Subtotal:</span>
                                        <span id="subtotalAmount">$0.00</span>
                                    </div>
                                    <div class="total-row">
                                        <span>Tax (<span id="taxRateDisplay">0</span>%):</span>
                                        <span id="taxAmount">$0.00</span>
                                    </div>
                                    <div class="total-row total-final">
                                        <span>Total:</span>
                                        <span id="totalAmount">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="form-section">
                            <h3>Notes</h3>
                            <textarea id="invoiceNotes" placeholder="Additional notes or payment terms..." rows="4"></textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="form-section">
                            <div class="action-buttons">
                                <button id="saveInvoiceBtn" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Save Invoice
                                </button>
                                <button id="previewInvoiceBtn" class="btn btn-info">
                                    <i class="fas fa-eye"></i> Preview
                                </button>
                                <button id="completeInvoiceBtn" class="btn btn-success">
                                    <i class="fas fa-check-circle"></i> Complete Invoice
                                </button>
                                <button id="downloadInvoiceBtn" class="btn btn-warning">
                                    <i class="fas fa-download"></i> Download PDF
                                </button>
                                <button id="clearInvoiceBtn" class="btn btn-danger">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Invoice Preview -->
                    <div class="invoice-preview" id="invoicePreview" style="display: none;">
                        <div class="preview-header">
                            <h3>Invoice Preview</h3>
                            <button id="closePreviewBtn" class="btn btn-outline">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                        <div class="preview-content" id="previewContent">
                            <!-- Preview will be generated here -->
                        </div>
                    </div>
                </div>

                <!-- Settings Modal -->
                <div id="settingsModal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Invoice Settings</h3>
                            <button id="closeSettingsBtn" class="btn btn-outline">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="defaultCurrency">Default Currency</label>
                                <select id="defaultCurrency">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="CAD">CAD (C$)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="defaultTaxRate">Default Tax Rate (%)</label>
                                <input type="number" id="defaultTaxRate" min="0" max="100" step="0.01">
                            </div>
                            <div class="form-group">
                                <label for="nextInvoiceNumber">Next Invoice Number</label>
                                <input type="number" id="nextInvoiceNumber" min="1">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button id="saveSettingsBtn" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Settings
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Load Invoice Modal -->
                <div id="loadInvoiceModal" class="modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Load Invoice</h3>
                            <button id="closeLoadBtn" class="btn btn-outline">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div id="invoiceHistoryList" class="invoice-list">
                                <!-- Invoice history will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status Messages -->
                <div id="statusMessage" class="status-message" style="display: none;"></div>
            </div>
        `;
    }

    /**
     * Add CSS styles for the invoice generator
     */
    addStyles() {
        if (document.getElementById('invoiceGeneratorStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'invoiceGeneratorStyles';
        styles.textContent = `
            .invoice-generator {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f8f9fa;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .generator-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            
            .generator-header h2 {
                margin: 0 0 10px 0;
                font-size: 2.2em;
                font-weight: 300;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .generator-header p {
                margin: 0;
                font-size: 1.1em;
                opacity: 0.9;
            }
            
            .header-actions {
                margin-top: 20px;
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .generator-content {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .invoice-form {
                background: white;
                border-radius: 10px;
                padding: 25px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            
            .form-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                background: #fafbfc;
            }
            
            .form-section h3 {
                margin: 0 0 20px 0;
                color: #495057;
                font-size: 1.3em;
                font-weight: 600;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
            }
            
            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
            }
            
            .form-group label {
                margin-bottom: 8px;
                font-weight: 600;
                color: #495057;
                font-size: 0.95em;
            }
            
            .form-group input,
            .form-group textarea,
            .form-group select {
                padding: 12px 15px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                font-size: 1em;
                transition: all 0.3s ease;
                background: white;
            }
            
            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .form-group input:hover,
            .form-group textarea:hover,
            .form-group select:hover {
                border-color: #adb5bd;
            }
            
            .items-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .items-table {
                overflow-x: auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .items-table table {
                width: 100%;
                border-collapse: collapse;
                background: white;
            }
            
            .items-table th,
            .items-table td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #e9ecef;
            }
            
            .items-table th {
                background: #f8f9fa;
                font-weight: 600;
                color: #495057;
                border-bottom: 2px solid #dee2e6;
            }
            
            .items-table input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #e9ecef;
                border-radius: 4px;
                font-size: 0.95em;
            }
            
            .items-table input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
            }
            
            .item-amount {
                font-weight: 600;
                color: #28a745;
            }
            
            .totals-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .totals-grid {
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 300px;
                margin-left: auto;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            
            .total-final {
                font-weight: 700;
                font-size: 1.2em;
                color: #495057;
                border-bottom: 2px solid #667eea;
                padding-top: 15px;
            }
            
            .action-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 20px;
            }
            
            .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 6px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                min-width: 120px;
                justify-content: center;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                color: white;
            }
            
            .btn-success {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
            }
            
            .btn-info {
                background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                color: white;
            }
            
            .btn-warning {
                background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
                color: #212529;
            }
            
            .btn-danger {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
            }
            
            .btn-outline {
                background: transparent;
                border: 2px solid #667eea;
                color: #667eea;
            }
            
            .btn-outline:hover {
                background: #667eea;
                color: white;
            }
            
            .btn-sm {
                padding: 6px 12px;
                font-size: 0.875em;
                min-width: auto;
            }
            
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
                border-radius: 12px 12px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #495057;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                background: #f8f9fa;
                border-radius: 0 0 12px 12px;
            }
            
            .invoice-preview {
                background: white;
                border-radius: 10px;
                padding: 25px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                margin-top: 20px;
            }
            
            .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .preview-content {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
            }
            
            .status-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 600;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }
            
            .status-message.success {
                background: #28a745;
            }
            
            .status-message.error {
                background: #dc3545;
            }
            
            .status-message.info {
                background: #17a2b8;
            }
            
            .status-message.warning {
                background: #ffc107;
                color: #212529;
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
            
            .invoice-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .invoice-item {
                padding: 15px;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .invoice-item:hover {
                background: #f8f9fa;
                border-color: #667eea;
            }
            
            .invoice-item h4 {
                margin: 0 0 5px 0;
                color: #495057;
            }
            
            .invoice-item p {
                margin: 0;
                color: #6c757d;
                font-size: 0.9em;
            }
            
            @media (max-width: 768px) {
                .invoice-generator {
                    padding: 15px;
                }
                
                .generator-header {
                    padding: 20px;
                }
                
                .generator-header h2 {
                    font-size: 1.8em;
                }
                
                .form-grid {
                    grid-template-columns: 1fr;
                }
                
                .header-actions,
                .action-buttons {
                    flex-direction: column;
                    align-items: center;
                }
                
                .btn {
                    width: 100%;
                    max-width: 250px;
                }
                
                .totals-grid {
                    max-width: 100%;
                }
                
                .items-table {
                    font-size: 0.9em;
                }
                
                .modal-content {
                    width: 95%;
                    margin: 10px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Header buttons
        document.getElementById('newInvoiceBtn').addEventListener('click', () => this.createNewInvoice());
        document.getElementById('loadInvoiceBtn').addEventListener('click', () => this.showLoadInvoiceModal());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettingsModal());

        // Form inputs
        document.getElementById('companyName').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('companyAddress').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('companyPhone').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('companyEmail').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('invoiceDate').addEventListener('change', () => this.updateInvoiceData());
        document.getElementById('dueDate').addEventListener('change', () => this.updateInvoiceData());
        document.getElementById('invoiceStatus').addEventListener('change', () => this.updateInvoiceData());
        document.getElementById('clientName').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('clientAddress').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('clientPhone').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('clientEmail').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('invoiceNotes').addEventListener('input', () => this.updateInvoiceData());
        document.getElementById('invoiceNumber').addEventListener('input', () => this.updateInvoiceData());

        // Action buttons
        document.getElementById('addItemBtn').addEventListener('click', () => this.addInvoiceItem());
        document.getElementById('saveInvoiceBtn').addEventListener('click', () => this.saveInvoice());
        document.getElementById('previewInvoiceBtn').addEventListener('click', () => this.showPreview());
        document.getElementById('completeInvoiceBtn').addEventListener('click', () => this.completeInvoice());
        document.getElementById('downloadInvoiceBtn').addEventListener('click', () => this.downloadInvoice());
        document.getElementById('clearInvoiceBtn').addEventListener('click', () => this.clearInvoice());

        // Modal buttons
        document.getElementById('closePreviewBtn').addEventListener('click', () => this.hidePreview());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.hideSettingsModal());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('closeLoadBtn').addEventListener('click', () => this.hideLoadInvoiceModal());

        // Settings inputs
        document.getElementById('defaultTaxRate').addEventListener('input', () => this.updateTaxRate());
    }

    /**
     * Create a new invoice
     */
    createNewInvoice() {
        this.currentInvoice = {
            id: this.generateInvoiceId(),
            number: this.getNextInvoiceNumber(),
            date: new Date().toISOString().split('T')[0],
            dueDate: this.getDefaultDueDate(),
            status: 'draft',
            company: { ...this.settings.companyInfo },
            client: {
                name: '',
                address: '',
                phone: '',
                email: ''
            },
            items: [],
            notes: '',
            subtotal: 0,
            tax: 0,
            total: 0,
            taxRate: this.settings.taxRate,
            currency: this.settings.currency,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.loadInvoiceToForm();
        this.addInvoiceItem(); // Add one default item
        this.showMessage('New invoice created', 'success');
    }

    /**
     * Load invoice data to form
     */
    loadInvoiceToForm() {
        if (!this.currentInvoice) return;

        // Company info
        document.getElementById('companyName').value = this.currentInvoice.company.name || '';
        document.getElementById('companyAddress').value = this.currentInvoice.company.address || '';
        document.getElementById('companyPhone').value = this.currentInvoice.company.phone || '';
        document.getElementById('companyEmail').value = this.currentInvoice.company.email || '';

        // Invoice details
        document.getElementById('invoiceNumber').value = this.currentInvoice.number;
        document.getElementById('invoiceDate').value = this.currentInvoice.date;
        document.getElementById('dueDate').value = this.currentInvoice.dueDate;
        document.getElementById('invoiceStatus').value = this.currentInvoice.status;

        // Client info
        document.getElementById('clientName').value = this.currentInvoice.client.name || '';
        document.getElementById('clientAddress').value = this.currentInvoice.client.address || '';
        document.getElementById('clientPhone').value = this.currentInvoice.client.phone || '';
        document.getElementById('clientEmail').value = this.currentInvoice.client.email || '';

        // Notes
        document.getElementById('invoiceNotes').value = this.currentInvoice.notes || '';

        // Tax rate
        document.getElementById('taxRateDisplay').textContent = this.currentInvoice.taxRate;

        // Load items
        this.loadInvoiceItems();
        this.calculateTotals();
    }

    /**
     * Add invoice item
     */
    addInvoiceItem(itemData = null) {
        const item = itemData || {
            id: this.generateItemId(),
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0
        };

        if (!itemData) {
            this.currentInvoice.items.push(item);
        }

        const tbody = document.getElementById('itemsTableBody');
        const row = document.createElement('tr');
        row.dataset.itemId = item.id;
        row.innerHTML = `
            <td>
                <input type="text" class="item-description" value="${item.description}" placeholder="Item description">
            </td>
            <td>
                <input type="number" class="item-quantity" value="${item.quantity}" min="1" step="1">
            </td>
            <td>
                <input type="number" class="item-rate" value="${item.rate}" min="0" step="0.01" placeholder="0.00">
            </td>
            <td>
                <span class="item-amount">${this.formatCurrency(item.amount)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-danger remove-item" title="Remove Item">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);

        // Attach item event listeners
        this.attachItemEventListeners(row);
    }

    /**
     * Attach event listeners to item row
     */
    attachItemEventListeners(row) {
        const descInput = row.querySelector('.item-description');
        const qtyInput = row.querySelector('.item-quantity');
        const rateInput = row.querySelector('.item-rate');
        const removeBtn = row.querySelector('.remove-item');

        descInput.addEventListener('input', () => this.updateItemData(row));
        qtyInput.addEventListener('input', () => this.updateItemData(row));
        rateInput.addEventListener('input', () => this.updateItemData(row));
        removeBtn.addEventListener('click', () => this.removeInvoiceItem(row));
    }

    /**
     * Update item data
     */
    updateItemData(row) {
        const itemId = row.dataset.itemId;
        const item = this.currentInvoice.items.find(i => i.id === itemId);
        
        if (item) {
            item.description = row.querySelector('.item-description').value;
            item.quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            item.rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            item.amount = item.quantity * item.rate;

            // Update amount display
            row.querySelector('.item-amount').textContent = this.formatCurrency(item.amount);

            this.calculateTotals();
        }
    }

    /**
     * Remove invoice item
     */
    removeInvoiceItem(row) {
        const itemId = row.dataset.itemId;
        this.currentInvoice.items = this.currentInvoice.items.filter(i => i.id !== itemId);
        row.remove();
        this.calculateTotals();
    }

    /**
     * Load invoice items to table
     */
    loadInvoiceItems() {
        const tbody = document.getElementById('itemsTableBody');
        tbody.innerHTML = '';
        
        this.currentInvoice.items.forEach(item => {
            this.addInvoiceItem(item);
        });
    }

    /**
     * Calculate invoice totals
     */
    calculateTotals() {
        if (!this.currentInvoice) return;

        const subtotal = this.currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
        const tax = subtotal * (this.currentInvoice.taxRate / 100);
        const total = subtotal + tax;

        this.currentInvoice.subtotal = subtotal;
        this.currentInvoice.tax = tax;
        this.currentInvoice.total = total;

        // Update display
        document.getElementById('subtotalAmount').textContent = this.formatCurrency(subtotal);
        document.getElementById('taxAmount').textContent = this.formatCurrency(tax);
        document.getElementById('totalAmount').textContent = this.formatCurrency(total);
    }

    /**
     * Update invoice data from form
     */
    updateInvoiceData() {
        if (!this.currentInvoice) return;

        // Company info
        this.currentInvoice.company.name = document.getElementById('companyName').value;
        this.currentInvoice.company.address = document.getElementById('companyAddress').value;
        this.currentInvoice.company.phone = document.getElementById('companyPhone').value;
        this.currentInvoice.company.email = document.getElementById('companyEmail').value;

        // Invoice details
        this.currentInvoice.number = document.getElementById('invoiceNumber').value;
        this.currentInvoice.date = document.getElementById('invoiceDate').value;
        this.currentInvoice.dueDate = document.getElementById('dueDate').value;
        this.currentInvoice.status = document.getElementById('invoiceStatus').value;

        // Client info
        this.currentInvoice.client.name = document.getElementById('clientName').value;
        this.currentInvoice.client.address = document.getElementById('clientAddress').value;
        this.currentInvoice.client.phone = document.getElementById('clientPhone').value;
        this.currentInvoice.client.email = document.getElementById('clientEmail').value;

        // Notes
        this.currentInvoice.notes = document.getElementById('invoiceNotes').value;

        this.currentInvoice.updatedAt = new Date().toISOString();
    }

    /**
     * Complete Invoice - Main feature
     */
    completeInvoice() {
        if (!this.currentInvoice) {
            this.showMessage('No invoice to complete', 'error');
            return;
        }

        // Validate invoice data
        const validation = this.validateInvoice();
        if (!validation.isValid) {
            this.showMessage(`Cannot complete invoice: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        // Show confirmation dialog
        const confirmed = confirm(
            'Are you sure you want to complete this invoice?\n\n' +
            'Completing an invoice will:\n' +
            '• Change status to "Completed"\n' +
            '• Lock the invoice from further editing\n' +
            '• Save it to invoice history\n' +
            '• Generate a final PDF version'
        );

        if (!confirmed) return;

        // Update invoice data
        this.updateInvoiceData();
        
        // Set status to completed
        this.currentInvoice.status = 'completed';
        this.currentInvoice.completedAt = new Date().toISOString();
        this.currentInvoice.isCompleted = true;
        
        // Update form
        document.getElementById('invoiceStatus').value = 'completed';
        
        // Save to history
        this.saveInvoice();
        
        // Disable form editing
        this.disableFormEditing();
        
        // Show success message
        this.showMessage(
            `Invoice #${this.currentInvoice.number} has been completed successfully!`,
            'success'
        );
        
        // Auto-generate PDF
        setTimeout(() => {
            this.downloadInvoice();
        }, 1000);
    }

    /**
     * Validate invoice data
     */
    validateInvoice() {
        const errors = [];
        
        if (!this.currentInvoice.company.name.trim()) {
            errors.push('Company name is required');
        }
        
        if (!this.currentInvoice.client.name.trim()) {
            errors.push('Client name is required');
        }
        
        if (this.currentInvoice.items.length === 0) {
            errors.push('At least one item is required');
        }
        
        const hasValidItems = this.currentInvoice.items.some(item => 
            item.description.trim() && item.quantity > 0 && item.rate >= 0
        );
        
        if (!hasValidItems) {
            errors.push('At least one valid item with description, quantity, and rate is required');
        }
        
        if (!this.currentInvoice.date) {
            errors.push('Invoice date is required');
        }
        
        if (!this.currentInvoice.dueDate) {
            errors.push('Due date is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Disable form editing (after completion)
     */
    disableFormEditing() {
        const inputs = this.container.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.id !== 'invoiceStatus') {
                input.disabled = true;
            }
        });
        
        const buttons = this.container.querySelectorAll('.remove-item, #addItemBtn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        // Update complete button
        const completeBtn = document.getElementById('completeInvoiceBtn');
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        completeBtn.disabled = true;
        completeBtn.classList.add('completed');
    }

    /**
     * Enable form editing
     */
    enableFormEditing() {
        const inputs = this.container.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = false;
        });
        
        const buttons = this.container.querySelectorAll('.remove-item, #addItemBtn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        
        // Update complete button
        const completeBtn = document.getElementById('completeInvoiceBtn');
        completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Invoice';
        completeBtn.disabled = false;
        completeBtn.classList.remove('completed');
    }

    /**
     * Save current invoice to history
     */
    saveInvoice() {
        if (!this.validateInvoice()) {
            return;
        }

        this.updateInvoiceData();
        
        // Add to history if not already there
        const existingIndex = this.invoiceHistory.findIndex(inv => inv.id === this.currentInvoice.id);
        if (existingIndex >= 0) {
            this.invoiceHistory[existingIndex] = { ...this.currentInvoice };
        } else {
            this.invoiceHistory.push({ ...this.currentInvoice });
        }
        
        this.saveInvoiceHistory();
        this.showMessage('Invoice saved successfully!', 'success');
    }

    /**
     * Clear current invoice and create new one
     */
    clearInvoice() {
        if (confirm('Are you sure you want to clear the current invoice? Any unsaved changes will be lost.')) {
            this.createNewInvoice();
            this.showMessage('Invoice cleared. New invoice created.', 'info');
        }
    }

    /**
     * Download invoice as PDF
     */
    downloadInvoice() {
        this.updateInvoiceData();
        const validation = this.validateInvoice();
        
        if (!validation.isValid) {
            this.showMessage('Please fix the following errors: ' + validation.errors.join(', '), 'error');
            return;
        }
        
        // Create PDF content
        const pdfContent = this.generatePDFContent();
        
        // Create and download PDF
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${this.currentInvoice.number}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('Invoice downloaded successfully!', 'success');
    }

    /**
     * Generate PDF content for download
     */
    generatePDFContent() {
        const invoice = this.currentInvoice;
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoice.number}</title>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; }
        .print-container { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
        @media print { .print-container { padding: 20px; } }
    </style>
</head>
<body>
    <div class="print-container">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 2.5em;">INVOICE</h1>
            <p style="color: #666; margin: 0; font-size: 1.1em;">Invoice #${invoice.number}</p>
            <p style="color: ${invoice.status === 'completed' ? '#28a745' : '#007bff'}; font-weight: bold; margin: 10px 0 0 0;">Status: ${invoice.status.toUpperCase()}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
                <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">From:</h3>
                <p style="margin: 5px 0; font-weight: bold; font-size: 1.1em;">${invoice.company.name || 'Company Name'}</p>
                <p style="margin: 5px 0; white-space: pre-line; line-height: 1.4;">${invoice.company.address || 'Company Address'}</p>
                <p style="margin: 5px 0;">Phone: ${invoice.company.phone || 'N/A'}</p>
                <p style="margin: 5px 0;">Email: ${invoice.company.email || 'N/A'}</p>
            </div>
            <div>
                <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">To:</h3>
                <p style="margin: 5px 0; font-weight: bold; font-size: 1.1em;">${invoice.client.name || 'Client Name'}</p>
                <p style="margin: 5px 0; white-space: pre-line; line-height: 1.4;">${invoice.client.address || 'Client Address'}</p>
                <p style="margin: 5px 0;">Phone: ${invoice.client.phone || 'N/A'}</p>
                <p style="margin: 5px 0;">Email: ${invoice.client.email || 'N/A'}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 5px 0;"><strong>Invoice Date:</strong> ${invoice.date}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${invoice.dueDate}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>
                <tr style="background: #f8f9fa;">
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: bold;">Description</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">Quantity</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold;">Rate</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">${item.description}</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${item.quantity}</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${this.formatCurrency(item.rate)}</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${this.formatCurrency(item.amount)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="text-align: right; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 5px 0; font-size: 1.1em;"><strong>Subtotal: ${this.formatCurrency(invoice.subtotal)}</strong></p>
            <p style="margin: 5px 0; font-size: 1.1em;"><strong>Tax: ${this.formatCurrency(invoice.tax)}</strong></p>
            <p style="margin: 15px 0 0 0; font-size: 1.3em; color: #333; border-top: 2px solid #667eea; padding-top: 10px;"><strong>Total: ${this.formatCurrency(invoice.total)}</strong></p>
        </div>
        
        ${invoice.notes ? `<div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;"><h3 style="color: #333; margin-top: 0;">Notes:</h3><p style="white-space: pre-line; line-height: 1.5; margin-bottom: 0;">${invoice.notes}</p></div>` : ''}
    </div>
</body>
</html>`;
    }

    /**
     * Show status message
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('statusMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `status-message ${type}`;
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }
    }

    /**
     * Save invoice history to localStorage
     */
    saveInvoiceHistory() {
        localStorage.setItem('invoiceHistory', JSON.stringify(this.invoiceHistory));
    }

    /**
     * Load invoice history from localStorage
     */
    loadInvoiceHistory() {
        const saved = localStorage.getItem('invoiceHistory');
        if (saved) {
            this.invoiceHistory = JSON.parse(saved);
            // Update next invoice number
            if (this.invoiceHistory.length > 0) {
                const maxNumber = Math.max(...this.invoiceHistory.map(inv => parseInt(inv.invoiceNumber) || 0));
                this.nextInvoiceNumber = maxNumber + 1;
            }
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        // Get values from modal inputs
        const currency = document.getElementById('defaultCurrency').value;
        const taxRate = parseFloat(document.getElementById('defaultTaxRate').value) / 100 || 0;
        const nextInvoiceNumber = parseInt(document.getElementById('nextInvoiceNumber').value) || 1;
        
        // Update settings
        this.settings.currency = currency;
        this.settings.taxRate = taxRate;
        this.nextInvoiceNumber = nextInvoiceNumber;
        
        // Save to localStorage
        localStorage.setItem('invoiceSettings', JSON.stringify(this.settings));
        localStorage.setItem('nextInvoiceNumber', this.nextInvoiceNumber.toString());
        
        // Update current invoice if exists
        if (this.currentInvoice) {
            this.currentInvoice.taxRate = taxRate;
            this.calculateTotals();
        }
        
        // Update tax rate display
        document.getElementById('taxRateDisplay').textContent = (taxRate * 100).toFixed(1);
        
        // Hide modal and show success message
        this.hideSettingsModal();
        this.showMessage('Settings saved successfully!', 'success');
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('invoiceSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        const savedInvoiceNumber = localStorage.getItem('nextInvoiceNumber');
        if (savedInvoiceNumber) {
            this.nextInvoiceNumber = parseInt(savedInvoiceNumber) || 1;
        }
    }

    /**
     * Generate unique invoice ID
     */
    generateInvoiceId() {
        return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique item ID
     */
    generateItemId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get next invoice number
     */
    getNextInvoiceNumber() {
        return `INV-${String(this.nextInvoiceNumber).padStart(3, '0')}`;
    }

    /**
     * Get default due date (30 days from today)
     */
    getDefaultDueDate() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    }

    /**
     * Format currency value
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.settings.currency
        }).format(amount);
    }

    /**
     * Show invoice preview
     */
    showPreview() {
        this.updateInvoiceData();
        const validation = this.validateInvoice();
        
        if (!validation.isValid) {
            this.showMessage('Please fix the following errors: ' + validation.errors.join(', '), 'error');
            return;
        }

        const previewContent = this.generatePreviewContent();
        document.getElementById('previewContent').innerHTML = previewContent;
        document.getElementById('invoicePreview').style.display = 'block';
    }

    /**
     * Hide invoice preview
     */
    hidePreview() {
        document.getElementById('invoicePreview').style.display = 'none';
    }

    /**
     * Show settings modal
     */
    showSettingsModal() {
        // Load current settings into form
        document.getElementById('defaultCurrency').value = this.settings.currency;
        document.getElementById('defaultTaxRate').value = this.settings.taxRate * 100;
        document.getElementById('nextInvoiceNumber').value = this.nextInvoiceNumber;
        
        document.getElementById('settingsModal').style.display = 'flex';
    }

    /**
     * Hide settings modal
     */
    hideSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    /**
     * Show load invoice modal
     */
    showLoadInvoiceModal() {
        this.populateInvoiceHistory();
        document.getElementById('loadInvoiceModal').style.display = 'flex';
    }

    /**
     * Hide load invoice modal
     */
    hideLoadInvoiceModal() {
        document.getElementById('loadInvoiceModal').style.display = 'none';
    }

    /**
     * Generate preview content
     */
    generatePreviewContent() {
        const invoice = this.currentInvoice;
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin-bottom: 10px;">INVOICE</h1>
                    <p style="color: #666; margin: 0;">Invoice #${invoice.number}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div>
                        <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px;">From:</h3>
                        <p style="margin: 5px 0;"><strong>${invoice.company.name || 'Company Name'}</strong></p>
                        <p style="margin: 5px 0; white-space: pre-line;">${invoice.company.address || 'Company Address'}</p>
                        <p style="margin: 5px 0;">Phone: ${invoice.company.phone || 'N/A'}</p>
                        <p style="margin: 5px 0;">Email: ${invoice.company.email || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px;">To:</h3>
                        <p style="margin: 5px 0;"><strong>${invoice.client.name || 'Client Name'}</strong></p>
                        <p style="margin: 5px 0; white-space: pre-line;">${invoice.client.address || 'Client Address'}</p>
                        <p style="margin: 5px 0;">Phone: ${invoice.client.phone || 'N/A'}</p>
                        <p style="margin: 5px 0;">Email: ${invoice.client.email || 'N/A'}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <p style="margin: 5px 0;"><strong>Invoice Date:</strong> ${invoice.date}</p>
                    <p style="margin: 5px 0;"><strong>Due Date:</strong> ${invoice.dueDate}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${invoice.status === 'completed' ? '#28a745' : '#007bff'}; font-weight: bold;">${invoice.status.toUpperCase()}</span></p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Description</th>
                            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Quantity</th>
                            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Rate</th>
                            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td style="border: 1px solid #dee2e6; padding: 12px;">${item.description}</td>
                                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${item.quantity}</td>
                                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${this.formatCurrency(item.rate)}</td>
                                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${this.formatCurrency(item.amount)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-bottom: 30px;">
                    <p style="margin: 5px 0;"><strong>Subtotal: ${this.formatCurrency(invoice.subtotal)}</strong></p>
                    <p style="margin: 5px 0;"><strong>Tax: ${this.formatCurrency(invoice.tax)}</strong></p>
                    <p style="margin: 15px 0 0 0; font-size: 1.2em; color: #333;"><strong>Total: ${this.formatCurrency(invoice.total)}</strong></p>
                </div>
                
                ${invoice.notes ? `<div style="margin-top: 30px;"><h3 style="color: #333;">Notes:</h3><p style="white-space: pre-line;">${invoice.notes}</p></div>` : ''}
            </div>
        `;
    }

    /**
     * Populate invoice history in load modal
     */
    populateInvoiceHistory() {
        const historyList = document.getElementById('invoiceHistoryList');
        
        if (this.invoiceHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No saved invoices found.</p>';
            return;
        }
        
        historyList.innerHTML = this.invoiceHistory.map(invoice => `
            <div class="invoice-item" onclick="invoiceGenerator.loadInvoiceFromHistory('${invoice.id}')">
                <h4>Invoice #${invoice.number}</h4>
                <p>Client: ${invoice.client.name || 'N/A'}</p>
                <p>Date: ${invoice.date} | Status: ${invoice.status}</p>
                <p>Total: ${this.formatCurrency(invoice.total)}</p>
            </div>
        `).join('');
    }

    /**
     * Load invoice from history
     */
    loadInvoiceFromHistory(invoiceId) {
        const invoice = this.invoiceHistory.find(inv => inv.id === invoiceId);
        if (invoice) {
            this.currentInvoice = { ...invoice };
            this.loadInvoiceToForm();
            this.hideLoadInvoiceModal();
            this.showMessage('Invoice loaded successfully!', 'success');
        }
    }

    /**
     * Update tax rate from settings
     */
    updateTaxRate() {
        const taxRate = parseFloat(document.getElementById('defaultTaxRate').value) / 100 || 0;
        this.settings.taxRate = taxRate;
        if (this.currentInvoice) {
            this.currentInvoice.taxRate = taxRate;
            this.calculateTotals();
        }
    }
}