/**
 * Expense Tracker Utility
 * Comprehensive expense management system with categories, receipts, reporting, and analytics
 */
class ExpenseTrackerUtility {
    constructor() {
        this.container = null;
        this.expenses = [];
        this.categories = [
            { id: 'office', name: 'Office Supplies', color: '#007bff', icon: 'fas fa-briefcase' },
            { id: 'travel', name: 'Travel & Transportation', color: '#28a745', icon: 'fas fa-plane' },
            { id: 'meals', name: 'Meals & Entertainment', color: '#ffc107', icon: 'fas fa-utensils' },
            { id: 'equipment', name: 'Equipment & Software', color: '#17a2b8', icon: 'fas fa-laptop' },
            { id: 'marketing', name: 'Marketing & Advertising', color: '#dc3545', icon: 'fas fa-bullhorn' },
            { id: 'utilities', name: 'Utilities & Services', color: '#6f42c1', icon: 'fas fa-bolt' },
            { id: 'professional', name: 'Professional Services', color: '#fd7e14', icon: 'fas fa-user-tie' },
            { id: 'other', name: 'Other', color: '#6c757d', icon: 'fas fa-ellipsis-h' }
        ];
        this.budgets = {};
        this.settings = {
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            defaultCategory: 'other',
            receiptStorage: true,
            notifications: true
        };
        this.currentView = 'dashboard';
        this.selectedExpense = null;
        this.filters = {
            category: 'all',
            dateRange: 'all',
            startDate: null,
            endDate: null,
            minAmount: null,
            maxAmount: null
        };
        
        this.loadData();
    }
    
    /**
     * Initialize the expense tracker
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container element not found');
        }
        
        this.createInterface();
        this.attachEventListeners();
        this.showDashboard();
        this.showNotification('Expense Tracker loaded successfully', 'success');
    }
    
    /**
     * Create the main interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="expense-tracker">
                <!-- Header -->
                <div class="expense-header">
                    <div class="header-content">
                        <div class="header-left">
                            <h1><i class="fas fa-receipt"></i> Expense Tracker</h1>
                            <p>Manage your business expenses efficiently</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-primary" id="addExpenseBtn">
                                <i class="fas fa-plus"></i> Add Expense
                            </button>
                            <button class="btn btn-secondary" id="importBtn">
                                <i class="fas fa-upload"></i> Import
                            </button>
                            <button class="btn btn-info" id="exportBtn">
                                <i class="fas fa-download"></i> Export
                            </button>
                            <button class="btn btn-outline" id="settingsBtn">
                                <i class="fas fa-cog"></i> Settings
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="expense-nav">
                    <button class="nav-btn active" data-view="dashboard">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </button>
                    <button class="nav-btn" data-view="expenses">
                        <i class="fas fa-list"></i> Expenses
                    </button>
                    <button class="nav-btn" data-view="categories">
                        <i class="fas fa-tags"></i> Categories
                    </button>
                    <button class="nav-btn" data-view="reports">
                        <i class="fas fa-chart-bar"></i> Reports
                    </button>
                    <button class="nav-btn" data-view="budgets">
                        <i class="fas fa-piggy-bank"></i> Budgets
                    </button>
                </div>
                
                <!-- Main Content -->
                <div class="expense-content">
                    <!-- Dashboard View -->
                    <div class="view-content" id="dashboardView">
                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="stat-info">
                                    <h3 id="totalExpenses">$0.00</h3>
                                    <p>Total Expenses</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-month"></i>
                                </div>
                                <div class="stat-info">
                                    <h3 id="monthlyExpenses">$0.00</h3>
                                    <p>This Month</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-receipt"></i>
                                </div>
                                <div class="stat-info">
                                    <h3 id="expenseCount">0</h3>
                                    <p>Total Records</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="stat-info">
                                    <h3 id="avgExpense">$0.00</h3>
                                    <p>Average Expense</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dashboard-charts">
                            <div class="chart-container">
                                <h3>Expenses by Category</h3>
                                <canvas id="categoryChart"></canvas>
                            </div>
                            <div class="chart-container">
                                <h3>Monthly Trend</h3>
                                <canvas id="trendChart"></canvas>
                            </div>
                        </div>
                        
                        <div class="recent-expenses">
                            <h3>Recent Expenses</h3>
                            <div id="recentExpensesList"></div>
                        </div>
                    </div>
                    
                    <!-- Expenses View -->
                    <div class="view-content" id="expensesView" style="display: none;">
                        <div class="expenses-toolbar">
                            <div class="filters">
                                <select id="categoryFilter">
                                    <option value="all">All Categories</option>
                                </select>
                                <select id="dateRangeFilter">
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="quarter">This Quarter</option>
                                    <option value="year">This Year</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                                <div class="date-range" id="customDateRange" style="display: none;">
                                    <input type="date" id="startDate" placeholder="Start Date">
                                    <input type="date" id="endDate" placeholder="End Date">
                                </div>
                                <button class="btn btn-secondary" id="clearFiltersBtn">
                                    <i class="fas fa-times"></i> Clear Filters
                                </button>
                            </div>
                            <div class="search-box">
                                <input type="text" id="searchExpenses" placeholder="Search expenses...">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                        
                        <div class="expenses-list" id="expensesList"></div>
                    </div>
                    
                    <!-- Categories View -->
                    <div class="view-content" id="categoriesView" style="display: none;">
                        <div class="categories-header">
                            <h3>Expense Categories</h3>
                            <button class="btn btn-primary" id="addCategoryBtn">
                                <i class="fas fa-plus"></i> Add Category
                            </button>
                        </div>
                        <div class="categories-grid" id="categoriesGrid"></div>
                    </div>
                    
                    <!-- Reports View -->
                    <div class="view-content" id="reportsView" style="display: none;">
                        <div class="reports-toolbar">
                            <select id="reportType">
                                <option value="summary">Expense Summary</option>
                                <option value="category">Category Breakdown</option>
                                <option value="monthly">Monthly Report</option>
                                <option value="yearly">Yearly Report</option>
                                <option value="tax">Tax Report</option>
                            </select>
                            <select id="reportPeriod">
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Period</option>
                            </select>
                            <button class="btn btn-primary" id="generateReportBtn">
                                <i class="fas fa-chart-bar"></i> Generate Report
                            </button>
                            <button class="btn btn-secondary" id="exportReportBtn">
                                <i class="fas fa-file-pdf"></i> Export PDF
                            </button>
                        </div>
                        <div class="report-content" id="reportContent"></div>
                    </div>
                    
                    <!-- Budgets View -->
                    <div class="view-content" id="budgetsView" style="display: none;">
                        <div class="budgets-header">
                            <h3>Budget Management</h3>
                            <button class="btn btn-primary" id="addBudgetBtn">
                                <i class="fas fa-plus"></i> Set Budget
                            </button>
                        </div>
                        <div class="budgets-grid" id="budgetsGrid"></div>
                    </div>
                </div>
            </div>
            
            <!-- Add Expense Modal -->
            <div class="modal" id="addExpenseModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="expenseModalTitle">Add New Expense</h3>
                        <button class="close-btn" id="closeExpenseModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="expenseForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expenseDescription">Description *</label>
                                    <input type="text" id="expenseDescription" required placeholder="Enter expense description">
                                </div>
                                <div class="form-group">
                                    <label for="expenseAmount">Amount *</label>
                                    <input type="number" id="expenseAmount" required step="0.01" min="0" placeholder="0.00">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expenseCategory">Category *</label>
                                    <select id="expenseCategory" required></select>
                                </div>
                                <div class="form-group">
                                    <label for="expenseDate">Date *</label>
                                    <input type="date" id="expenseDate" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expenseVendor">Vendor/Merchant</label>
                                    <input type="text" id="expenseVendor" placeholder="Enter vendor name">
                                </div>
                                <div class="form-group">
                                    <label for="expensePayment">Payment Method</label>
                                    <select id="expensePayment">
                                        <option value="cash">Cash</option>
                                        <option value="credit">Credit Card</option>
                                        <option value="debit">Debit Card</option>
                                        <option value="check">Check</option>
                                        <option value="transfer">Bank Transfer</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="expenseNotes">Notes</label>
                                <textarea id="expenseNotes" rows="3" placeholder="Additional notes or details"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="expenseReceipt">Receipt</label>
                                <input type="file" id="expenseReceipt" accept="image/*,.pdf">
                                <div class="receipt-preview" id="receiptPreview"></div>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="expenseReimbursable">
                                    <span class="checkmark"></span>
                                    Reimbursable expense
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelExpenseBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="saveExpenseBtn">Save Expense</button>
                    </div>
                </div>
            </div>
            
            <!-- Settings Modal -->
            <div class="modal" id="settingsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Settings</h3>
                        <button class="close-btn" id="closeSettingsModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="settings-section">
                            <h4>General Settings</h4>
                            <div class="form-group">
                                <label for="settingsCurrency">Currency</label>
                                <select id="settingsCurrency">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="CAD">CAD ($)</option>
                                    <option value="AUD">AUD ($)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="settingsDateFormat">Date Format</label>
                                <select id="settingsDateFormat">
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="settingsNotifications">
                                    <span class="checkmark"></span>
                                    Enable notifications
                                </label>
                            </div>
                        </div>
                        <div class="settings-section">
                            <h4>Data Management</h4>
                            <button class="btn btn-secondary" id="exportDataBtn">
                                <i class="fas fa-download"></i> Export All Data
                            </button>
                            <button class="btn btn-danger" id="clearDataBtn">
                                <i class="fas fa-trash"></i> Clear All Data
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelSettingsBtn">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveSettingsBtn">Save Settings</button>
                    </div>
                </div>
            </div>
            
            <!-- Notifications -->
            <div class="notifications" id="notifications"></div>
        `;
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-btn').dataset.view;
                this.switchView(view);
            });
        });
        
        // Header actions
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.showAddExpenseModal());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettingsModal());
        
        // Expense form
        document.getElementById('saveExpenseBtn').addEventListener('click', () => this.saveExpense());
        document.getElementById('cancelExpenseBtn').addEventListener('click', () => this.hideAddExpenseModal());
        document.getElementById('closeExpenseModal').addEventListener('click', () => this.hideAddExpenseModal());
        
        // Settings
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.hideSettingsModal());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.hideSettingsModal());
        
        // Filters
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('dateRangeFilter').addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                document.getElementById('customDateRange').style.display = 'flex';
            } else {
                document.getElementById('customDateRange').style.display = 'none';
                this.applyFilters();
            }
        });
        document.getElementById('startDate').addEventListener('change', () => this.applyFilters());
        document.getElementById('endDate').addEventListener('change', () => this.applyFilters());
        document.getElementById('clearFiltersBtn').addEventListener('click', () => this.clearFilters());
        document.getElementById('searchExpenses').addEventListener('input', () => this.applyFilters());
        
        // Receipt upload
        document.getElementById('expenseReceipt').addEventListener('change', (e) => this.handleReceiptUpload(e));
        
        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
    
    /**
     * Switch between views
     */
    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Hide all views
        document.querySelectorAll('.view-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected view
        document.getElementById(`${view}View`).style.display = 'block';
        this.currentView = view;
        
        // Load view-specific data
        switch (view) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'expenses':
                this.showExpenses();
                break;
            case 'categories':
                this.showCategories();
                break;
            case 'reports':
                this.showReports();
                break;
            case 'budgets':
                this.showBudgets();
                break;
        }
    }
    
    /**
     * Show dashboard
     */
    showDashboard() {
        this.updateDashboardStats();
        this.renderCharts();
        this.showRecentExpenses();
    }
    
    /**
     * Update dashboard statistics
     */
    updateDashboardStats() {
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const avgExpense = this.expenses.length > 0 ? total / this.expenses.length : 0;
        
        document.getElementById('totalExpenses').textContent = this.formatCurrency(total);
        document.getElementById('monthlyExpenses').textContent = this.formatCurrency(monthlyTotal);
        document.getElementById('expenseCount').textContent = this.expenses.length;
        document.getElementById('avgExpense').textContent = this.formatCurrency(avgExpense);
    }
    
    /**
     * Render charts
     */
    renderCharts() {
        this.renderCategoryChart();
        this.renderTrendChart();
    }
    
    /**
     * Render category chart
     */
    renderCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) {
            console.warn('Category chart canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        
        // Calculate category totals
        const categoryTotals = {};
        this.categories.forEach(cat => {
            categoryTotals[cat.id] = 0;
        });
        
        this.expenses.forEach(expense => {
            if (categoryTotals.hasOwnProperty(expense.category)) {
                categoryTotals[expense.category] += expense.amount;
            }
        });
        
        // Create simple pie chart
        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        if (total === 0) {
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No expenses to display', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        let currentAngle = 0;
        
        this.categories.forEach(category => {
            const amount = categoryTotals[category.id];
            if (amount > 0) {
                const sliceAngle = (amount / total) * 2 * Math.PI;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = category.color;
                ctx.fill();
                
                currentAngle += sliceAngle;
            }
        });
    }
    
    /**
     * Render trend chart
     */
    renderTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) {
            console.warn('Trend chart canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        
        // Get last 6 months data
        const monthlyData = this.getMonthlyExpenseData(6);
        
        if (monthlyData.length === 0) {
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No expense data to display', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const maxAmount = Math.max(...monthlyData.map(d => d.amount));
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw line chart
        if (monthlyData.length > 1) {
            ctx.strokeStyle = '#007bff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            monthlyData.forEach((data, index) => {
                const x = padding + (index / (monthlyData.length - 1)) * chartWidth;
                const y = canvas.height - padding - (data.amount / maxAmount) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
    }
    
    /**
     * Get monthly expense data
     */
    getMonthlyExpenseData(months) {
        const data = [];
        const now = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthExpenses = this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === date.getMonth() && 
                       expenseDate.getFullYear() === date.getFullYear();
            });
            
            const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            data.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                amount: total
            });
        }
        
        return data;
    }
    
    /**
     * Show recent expenses
     */
    showRecentExpenses() {
        const container = document.getElementById('recentExpensesList');
        const recentExpenses = this.expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recentExpenses.length === 0) {
            container.innerHTML = '<p class="no-data">No expenses recorded yet.</p>';
            return;
        }
        
        container.innerHTML = recentExpenses.map(expense => {
            const category = this.categories.find(cat => cat.id === expense.category);
            return `
                <div class="expense-item">
                    <div class="expense-icon" style="background-color: ${category?.color || '#6c757d'}">
                        <i class="${category?.icon || 'fas fa-receipt'}"></i>
                    </div>
                    <div class="expense-details">
                        <h4>${expense.description}</h4>
                        <p>${category?.name || 'Other'} • ${this.formatDate(expense.date)}</p>
                    </div>
                    <div class="expense-amount">
                        ${this.formatCurrency(expense.amount)}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Show expenses list
     */
    showExpenses() {
        this.populateFilters();
        this.renderExpensesList();
    }
    
    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    /**
     * Render expenses list
     */
    renderExpensesList() {
        const container = document.getElementById('expensesList');
        const filteredExpenses = this.getFilteredExpenses();
        
        if (filteredExpenses.length === 0) {
            container.innerHTML = '<p class="no-data">No expenses match your filters.</p>';
            return;
        }
        
        container.innerHTML = filteredExpenses.map(expense => {
            const category = this.categories.find(cat => cat.id === expense.category);
            return `
                <div class="expense-card" data-expense-id="${expense.id}">
                    <div class="expense-header">
                        <div class="expense-icon" style="background-color: ${category?.color || '#6c757d'}">
                            <i class="${category?.icon || 'fas fa-receipt'}"></i>
                        </div>
                        <div class="expense-info">
                            <h4>${expense.description}</h4>
                            <p>${category?.name || 'Other'} • ${this.formatDate(expense.date)}</p>
                            ${expense.vendor ? `<p class="vendor">Vendor: ${expense.vendor}</p>` : ''}
                        </div>
                        <div class="expense-amount">
                            ${this.formatCurrency(expense.amount)}
                            ${expense.reimbursable ? '<span class="reimbursable-badge">Reimbursable</span>' : ''}
                        </div>
                        <div class="expense-actions">
                            <button class="btn btn-sm btn-secondary" onclick="expenseTracker.editExpense('${expense.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="expenseTracker.deleteExpense('${expense.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    ${expense.notes ? `<div class="expense-notes">${expense.notes}</div>` : ''}
                    ${expense.receipt ? `<div class="expense-receipt"><i class="fas fa-paperclip"></i> Receipt attached</div>` : ''}
                </div>
            `;
        }).join('');
    }
    
    /**
     * Get filtered expenses
     */
    getFilteredExpenses() {
        let filtered = [...this.expenses];
        
        // Category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(expense => expense.category === this.filters.category);
        }
        
        // Date range filter
        const now = new Date();
        switch (this.filters.dateRange) {
            case 'today':
                const today = now.toDateString();
                filtered = filtered.filter(expense => new Date(expense.date).toDateString() === today);
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(expense => new Date(expense.date) >= weekAgo);
                break;
            case 'month':
                filtered = filtered.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === now.getMonth() && 
                           expenseDate.getFullYear() === now.getFullYear();
                });
                break;
            case 'quarter':
                const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                filtered = filtered.filter(expense => new Date(expense.date) >= quarterStart);
                break;
            case 'year':
                filtered = filtered.filter(expense => new Date(expense.date).getFullYear() === now.getFullYear());
                break;
            case 'custom':
                if (this.filters.startDate) {
                    filtered = filtered.filter(expense => new Date(expense.date) >= new Date(this.filters.startDate));
                }
                if (this.filters.endDate) {
                    filtered = filtered.filter(expense => new Date(expense.date) <= new Date(this.filters.endDate));
                }
                break;
        }
        
        // Search filter
        const searchTerm = document.getElementById('searchExpenses')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.vendor?.toLowerCase().includes(searchTerm) ||
                expense.notes?.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    /**
     * Apply filters
     */
    applyFilters() {
        this.filters.category = document.getElementById('categoryFilter').value;
        this.filters.dateRange = document.getElementById('dateRangeFilter').value;
        this.filters.startDate = document.getElementById('startDate').value;
        this.filters.endDate = document.getElementById('endDate').value;
        
        if (this.currentView === 'expenses') {
            this.renderExpensesList();
        }
    }
    
    /**
     * Clear filters
     */
    clearFilters() {
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('dateRangeFilter').value = 'all';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('searchExpenses').value = '';
        document.getElementById('customDateRange').style.display = 'none';
        
        this.filters = {
            category: 'all',
            dateRange: 'all',
            startDate: null,
            endDate: null,
            minAmount: null,
            maxAmount: null
        };
        
        if (this.currentView === 'expenses') {
            this.renderExpensesList();
        }
    }
    
    /**
     * Show add expense modal
     */
    showAddExpenseModal(expense = null) {
        const modal = document.getElementById('addExpenseModal');
        const title = document.getElementById('expenseModalTitle');
        const form = document.getElementById('expenseForm');
        
        // Populate categories
        const categorySelect = document.getElementById('expenseCategory');
        categorySelect.innerHTML = '';
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
        if (expense) {
            // Edit mode
            title.textContent = 'Edit Expense';
            document.getElementById('expenseDescription').value = expense.description;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseVendor').value = expense.vendor || '';
            document.getElementById('expensePayment').value = expense.paymentMethod || 'cash';
            document.getElementById('expenseNotes').value = expense.notes || '';
            document.getElementById('expenseReimbursable').checked = expense.reimbursable || false;
            this.selectedExpense = expense;
        } else {
            // Add mode
            title.textContent = 'Add New Expense';
            form.reset();
            document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('expenseCategory').value = this.settings.defaultCategory;
            this.selectedExpense = null;
        }
        
        modal.style.display = 'flex';
    }
    
    /**
     * Hide add expense modal
     */
    hideAddExpenseModal() {
        document.getElementById('addExpenseModal').style.display = 'none';
        document.getElementById('expenseForm').reset();
        document.getElementById('receiptPreview').innerHTML = '';
        this.selectedExpense = null;
    }
    
    /**
     * Save expense
     */
    saveExpense() {
        const form = document.getElementById('expenseForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const expenseData = {
            id: this.selectedExpense?.id || this.generateId(),
            description: document.getElementById('expenseDescription').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value,
            vendor: document.getElementById('expenseVendor').value,
            paymentMethod: document.getElementById('expensePayment').value,
            notes: document.getElementById('expenseNotes').value,
            reimbursable: document.getElementById('expenseReimbursable').checked,
            receipt: this.selectedExpense?.receipt || null,
            createdAt: this.selectedExpense?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.selectedExpense) {
            // Update existing expense
            const index = this.expenses.findIndex(exp => exp.id === this.selectedExpense.id);
            if (index !== -1) {
                this.expenses[index] = expenseData;
                this.showNotification('Expense updated successfully', 'success');
            }
        } else {
            // Add new expense
            this.expenses.push(expenseData);
            this.showNotification('Expense added successfully', 'success');
        }
        
        this.saveData();
        this.hideAddExpenseModal();
        
        // Refresh current view
        if (this.currentView === 'dashboard') {
            this.showDashboard();
        } else if (this.currentView === 'expenses') {
            this.renderExpensesList();
        }
    }
    
    /**
     * Edit expense
     */
    editExpense(expenseId) {
        const expense = this.expenses.find(exp => exp.id === expenseId);
        if (expense) {
            this.showAddExpenseModal(expense);
        }
    }
    
    /**
     * Delete expense
     */
    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
            this.saveData();
            this.showNotification('Expense deleted successfully', 'success');
            
            // Refresh current view
            if (this.currentView === 'dashboard') {
                this.showDashboard();
            } else if (this.currentView === 'expenses') {
                this.renderExpensesList();
            }
        }
    }
    
    /**
     * Handle receipt upload
     */
    handleReceiptUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('receiptPreview');
            if (file.type.startsWith('image/')) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Receipt preview" style="max-width: 200px; max-height: 200px;">`;
            } else {
                preview.innerHTML = `<p><i class="fas fa-file-pdf"></i> ${file.name}</p>`;
            }
            
            if (this.selectedExpense) {
                this.selectedExpense.receipt = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * Show categories
     */
    showCategories() {
        const container = document.getElementById('categoriesGrid');
        
        container.innerHTML = this.categories.map(category => {
            const categoryExpenses = this.expenses.filter(exp => exp.category === category.id);
            const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            
            return `
                <div class="category-card" style="border-left: 4px solid ${category.color}">
                    <div class="category-header">
                        <div class="category-icon" style="background-color: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-info">
                            <h4>${category.name}</h4>
                            <p>${categoryExpenses.length} expenses</p>
                        </div>
                        <div class="category-total">
                            ${this.formatCurrency(total)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Show reports
     */
    showReports() {
        this.generateReport();
    }
    
    /**
     * Generate report
     */
    generateReport() {
        const reportType = document.getElementById('reportType')?.value || 'summary';
        const reportPeriod = document.getElementById('reportPeriod')?.value || 'month';
        const container = document.getElementById('reportContent');
        
        switch (reportType) {
            case 'summary':
                container.innerHTML = this.generateSummaryReport(reportPeriod);
                break;
            case 'category':
                container.innerHTML = this.generateCategoryReport(reportPeriod);
                break;
            case 'monthly':
                container.innerHTML = this.generateMonthlyReport();
                break;
            case 'yearly':
                container.innerHTML = this.generateYearlyReport();
                break;
            case 'tax':
                container.innerHTML = this.generateTaxReport(reportPeriod);
                break;
        }
    }
    
    /**
     * Generate summary report
     */
    generateSummaryReport(period) {
        const expenses = this.getExpensesByPeriod(period);
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const avgExpense = expenses.length > 0 ? total / expenses.length : 0;
        
        return `
            <div class="report-summary">
                <h3>Expense Summary</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <label>Total Expenses:</label>
                        <span>${this.formatCurrency(total)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Number of Expenses:</label>
                        <span>${expenses.length}</span>
                    </div>
                    <div class="stat-item">
                        <label>Average Expense:</label>
                        <span>${this.formatCurrency(avgExpense)}</span>
                    </div>
                </div>
                
                <div class="expense-breakdown">
                    <h4>Recent Expenses</h4>
                    ${expenses.slice(0, 10).map(expense => {
                        const category = this.categories.find(cat => cat.id === expense.category);
                        return `
                            <div class="report-expense-item">
                                <span class="expense-desc">${expense.description}</span>
                                <span class="expense-cat">${category?.name || 'Other'}</span>
                                <span class="expense-date">${this.formatDate(expense.date)}</span>
                                <span class="expense-amt">${this.formatCurrency(expense.amount)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate category report
     */
    generateCategoryReport(period) {
        const expenses = this.getExpensesByPeriod(period);
        const categoryTotals = {};
        
        this.categories.forEach(cat => {
            categoryTotals[cat.id] = {
                name: cat.name,
                color: cat.color,
                total: 0,
                count: 0
            };
        });
        
        expenses.forEach(expense => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category].total += expense.amount;
                categoryTotals[expense.category].count++;
            }
        });
        
        const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.total, 0);
        
        return `
            <div class="category-report">
                <h3>Category Breakdown</h3>
                <div class="category-breakdown">
                    ${Object.entries(categoryTotals).map(([id, data]) => {
                        const percentage = total > 0 ? (data.total / total * 100).toFixed(1) : 0;
                        return `
                            <div class="category-report-item">
                                <div class="category-bar">
                                    <div class="category-fill" style="width: ${percentage}%; background-color: ${data.color}"></div>
                                </div>
                                <div class="category-details">
                                    <span class="category-name">${data.name}</span>
                                    <span class="category-stats">${data.count} expenses • ${percentage}%</span>
                                    <span class="category-amount">${this.formatCurrency(data.total)}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate monthly report
     */
    generateMonthlyReport() {
        const monthlyData = this.getMonthlyExpenseData(12);
        
        return `
            <div class="monthly-report">
                <h3>Monthly Expense Report</h3>
                <div class="monthly-breakdown">
                    ${monthlyData.map(data => `
                        <div class="monthly-item">
                            <span class="month-name">${data.month}</span>
                            <span class="month-amount">${this.formatCurrency(data.amount)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate yearly report
     */
    generateYearlyReport() {
        const currentYear = new Date().getFullYear();
        const years = [...new Set(this.expenses.map(exp => new Date(exp.date).getFullYear()))].sort((a, b) => b - a);
        
        return `
            <div class="yearly-report">
                <h3>Yearly Expense Report</h3>
                <div class="yearly-breakdown">
                    ${years.map(year => {
                        const yearExpenses = this.expenses.filter(exp => new Date(exp.date).getFullYear() === year);
                        const total = yearExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                        return `
                            <div class="yearly-item">
                                <span class="year-name">${year}</span>
                                <span class="year-count">${yearExpenses.length} expenses</span>
                                <span class="year-amount">${this.formatCurrency(total)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate tax report
     */
    generateTaxReport(period) {
        const expenses = this.getExpensesByPeriod(period);
        const deductibleExpenses = expenses.filter(exp => this.isDeductibleCategory(exp.category));
        const total = deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        return `
            <div class="tax-report">
                <h3>Tax Deductible Expenses</h3>
                <div class="tax-summary">
                    <div class="stat-item">
                        <label>Total Deductible:</label>
                        <span>${this.formatCurrency(total)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Number of Expenses:</label>
                        <span>${deductibleExpenses.length}</span>
                    </div>
                </div>
                
                <div class="deductible-expenses">
                    <h4>Deductible Expenses</h4>
                    ${deductibleExpenses.map(expense => {
                        const category = this.categories.find(cat => cat.id === expense.category);
                        return `
                            <div class="tax-expense-item">
                                <span class="expense-desc">${expense.description}</span>
                                <span class="expense-cat">${category?.name || 'Other'}</span>
                                <span class="expense-date">${this.formatDate(expense.date)}</span>
                                <span class="expense-amt">${this.formatCurrency(expense.amount)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Get expenses by period
     */
    getExpensesByPeriod(period) {
        const now = new Date();
        
        switch (period) {
            case 'month':
                return this.expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === now.getMonth() && 
                           expenseDate.getFullYear() === now.getFullYear();
                });
            case 'quarter':
                const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                return this.expenses.filter(expense => new Date(expense.date) >= quarterStart);
            case 'year':
                return this.expenses.filter(expense => new Date(expense.date).getFullYear() === now.getFullYear());
            default:
                return this.expenses;
        }
    }
    
    /**
     * Check if category is tax deductible
     */
    isDeductibleCategory(categoryId) {
        const deductibleCategories = ['office', 'travel', 'equipment', 'professional', 'marketing'];
        return deductibleCategories.includes(categoryId);
    }
    
    /**
     * Show budgets
     */
    showBudgets() {
        const container = document.getElementById('budgetsGrid');
        
        if (Object.keys(this.budgets).length === 0) {
            container.innerHTML = '<p class="no-data">No budgets set. Click "Set Budget" to create your first budget.</p>';
            return;
        }
        
        container.innerHTML = Object.entries(this.budgets).map(([categoryId, budget]) => {
            const category = this.categories.find(cat => cat.id === categoryId);
            const spent = this.expenses
                .filter(exp => exp.category === categoryId)
                .reduce((sum, exp) => sum + exp.amount, 0);
            const percentage = budget.amount > 0 ? (spent / budget.amount * 100) : 0;
            const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';
            
            return `
                <div class="budget-card ${status}">
                    <div class="budget-header">
                        <div class="budget-icon" style="background-color: ${category?.color || '#6c757d'}">
                            <i class="${category?.icon || 'fas fa-tag'}"></i>
                        </div>
                        <div class="budget-info">
                            <h4>${category?.name || 'Unknown Category'}</h4>
                            <p>Budget: ${this.formatCurrency(budget.amount)}</p>
                        </div>
                        <div class="budget-actions">
                            <button class="btn btn-sm btn-secondary" onclick="expenseTracker.editBudget('${categoryId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="expenseTracker.deleteBudget('${categoryId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="budget-stats">
                            <span>Spent: ${this.formatCurrency(spent)}</span>
                            <span>Remaining: ${this.formatCurrency(Math.max(0, budget.amount - spent))}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Show settings modal
     */
    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        
        // Load current settings
        document.getElementById('settingsCurrency').value = this.settings.currency;
        document.getElementById('settingsDateFormat').value = this.settings.dateFormat;
        document.getElementById('settingsNotifications').checked = this.settings.notifications;
        
        modal.style.display = 'flex';
    }
    
    /**
     * Hide settings modal
     */
    hideSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }
    
    /**
     * Save settings
     */
    saveSettings() {
        this.settings.currency = document.getElementById('settingsCurrency').value;
        this.settings.dateFormat = document.getElementById('settingsDateFormat').value;
        this.settings.notifications = document.getElementById('settingsNotifications').checked;
        
        this.saveData();
        this.hideSettingsModal();
        this.showNotification('Settings saved successfully', 'success');
    }
    
    /**
     * Import data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        let data;
                        if (file.name.endsWith('.json')) {
                            data = JSON.parse(event.target.result);
                            if (data.expenses) {
                                const importedExpenses = data.expenses;
                                this.expenses = [...this.expenses, ...importedExpenses];
                                this.saveData();
                                this.showNotification(`Imported ${importedExpenses.length} expenses`, 'success');
                                this.showDashboard();
                            }
                        }
                    } catch (error) {
                        this.showNotification('Error importing data: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    /**
     * Export data
     */
    exportData() {
        const data = {
            expenses: this.expenses,
            categories: this.categories,
            budgets: this.budgets,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }
    
    /**
     * Format currency
     */
    formatCurrency(amount) {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
            CAD: '$',
            AUD: '$'
        };
        
        const symbol = symbols[this.settings.currency] || '$';
        return `${symbol}${amount.toFixed(2)}`;
    }
    
    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const formats = {
            'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
            'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
            'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' }
        };
        
        const format = formats[this.settings.dateFormat] || formats['MM/DD/YYYY'];
        return date.toLocaleDateString('en-US', format);
    }
    
    /**
     * Generate unique ID
     */
    generateId() {
        return 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (!this.settings.notifications) return;
        
        const container = document.getElementById('notifications');
        if (!container) {
            console.warn('Notifications container not found');
            return;
        }
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
    
    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    /**
     * Save data to localStorage
     */
    saveData() {
        const data = {
            expenses: this.expenses,
            budgets: this.budgets,
            settings: this.settings
        };
        localStorage.setItem('expenseTrackerData', JSON.stringify(data));
    }
    
    /**
     * Load data from localStorage
     */
    loadData() {
        try {
            const data = localStorage.getItem('expenseTrackerData');
            if (data) {
                const parsed = JSON.parse(data);
                this.expenses = parsed.expenses || [];
                this.budgets = parsed.budgets || {};
                this.settings = { ...this.settings, ...parsed.settings };
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
}

// Make the class globally available
window.ExpenseTrackerUtility = ExpenseTrackerUtility;

// Global instance for easy access
let expenseTracker = null;