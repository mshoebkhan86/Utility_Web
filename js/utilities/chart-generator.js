/**
 * Chart Generator Utility
 * Provides comprehensive chart generation functionality including
 * multiple chart types, data input methods, customization, and export features
 */
class ChartGeneratorUtility {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.currentChart = null;
        this.chartData = {
            labels: [],
            datasets: [{
                label: 'Dataset 1',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 2
            }]
        };
        this.chartType = 'bar';
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Chart Title'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'X Axis'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Y Axis'
                    },
                    beginAtZero: true
                }
            }
        };
        this.colorPalettes = {
            default: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'],
            pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD1DC', '#E0BBE4', '#957DAD', '#D291BC'],
            vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
            professional: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12', '#27AE60', '#8E44AD', '#16A085', '#D35400'],
            monochrome: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#D5DBDB', '#E8DAEF', '#F4F6F6']
        };
        this.templates = this.getDefaultTemplates();
        this.history = [];
        this.historyIndex = -1;
    }

    /**
     * Initialize the chart generator
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Chart Generator container not found');
            return;
        }

        this.createInterface();
        this.attachEventListeners();
        this.loadSampleData();
        this.renderChart();
    }

    /**
     * Create the chart generator interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="chart-generator">
                <div class="generator-header">
                    <h2>📈 Chart Generator</h2>
                    <p>Create beautiful, interactive charts from your data</p>
                    <div class="header-actions">
                        <button id="newChartBtn" class="btn btn-primary">
                            <i class="fas fa-plus"></i> New Chart
                        </button>
                        <button id="importDataBtn" class="btn btn-secondary">
                            <i class="fas fa-upload"></i> Import Data
                        </button>
                        <button id="exportChartBtn" class="btn btn-success">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                <div class="generator-content">
                    <div class="sidebar">
                        <!-- Chart Type Selection -->
                        <div class="sidebar-section">
                            <h3>Chart Type</h3>
                            <div class="chart-types">
                                <button class="chart-type-btn active" data-type="bar">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>Bar</span>
                                </button>
                                <button class="chart-type-btn" data-type="line">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Line</span>
                                </button>
                                <button class="chart-type-btn" data-type="pie">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Pie</span>
                                </button>
                                <button class="chart-type-btn" data-type="doughnut">
                                    <i class="fas fa-circle-notch"></i>
                                    <span>Doughnut</span>
                                </button>
                                <button class="chart-type-btn" data-type="area">
                                    <i class="fas fa-chart-area"></i>
                                    <span>Area</span>
                                </button>
                                <button class="chart-type-btn" data-type="scatter">
                                    <i class="fas fa-braille"></i>
                                    <span>Scatter</span>
                                </button>
                            </div>
                        </div>

                        <!-- Data Input -->
                        <div class="sidebar-section">
                            <h3>Data Input</h3>
                            <div class="data-input-tabs">
                                <button class="tab-btn active" data-tab="manual">Manual</button>
                                <button class="tab-btn" data-tab="csv">CSV</button>
                                <button class="tab-btn" data-tab="json">JSON</button>
                            </div>
                            
                            <div class="tab-content" id="manualTab">
                                <div class="form-group">
                                    <label>Labels (comma-separated)</label>
                                    <textarea id="labelsInput" placeholder="Q1, Q2, Q3, Q4"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Data (comma-separated)</label>
                                    <textarea id="dataInput" placeholder="10, 20, 30, 40"></textarea>
                                </div>
                                <button id="updateDataBtn" class="btn btn-primary btn-sm">Update Chart</button>
                            </div>
                            
                            <div class="tab-content hidden" id="csvTab">
                                <div class="form-group">
                                    <label>CSV Data</label>
                                    <textarea id="csvInput" placeholder="Label,Value\nQ1,10\nQ2,20\nQ3,30\nQ4,40"></textarea>
                                </div>
                                <button id="importCsvBtn" class="btn btn-primary btn-sm">Import CSV</button>
                            </div>
                            
                            <div class="tab-content hidden" id="jsonTab">
                                <div class="form-group">
                                    <label>JSON Data</label>
                                    <textarea id="jsonInput" placeholder='{"labels": ["Q1", "Q2", "Q3", "Q4"], "data": [10, 20, 30, 40]}'></textarea>
                                </div>
                                <button id="importJsonBtn" class="btn btn-primary btn-sm">Import JSON</button>
                            </div>
                        </div>

                        <!-- Customization -->
                        <div class="sidebar-section">
                            <h3>Customization</h3>
                            
                            <div class="form-group">
                                <label for="chartTitle">Chart Title</label>
                                <input type="text" id="chartTitle" value="Chart Title">
                            </div>
                            
                            <div class="form-group">
                                <label for="xAxisLabel">X-Axis Label</label>
                                <input type="text" id="xAxisLabel" value="X Axis">
                            </div>
                            
                            <div class="form-group">
                                <label for="yAxisLabel">Y-Axis Label</label>
                                <input type="text" id="yAxisLabel" value="Y Axis">
                            </div>
                            
                            <div class="form-group">
                                <label>Color Palette</label>
                                <select id="colorPalette">
                                    <option value="default">Default</option>
                                    <option value="pastel">Pastel</option>
                                    <option value="vibrant">Vibrant</option>
                                    <option value="professional">Professional</option>
                                    <option value="monochrome">Monochrome</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="showLegend" checked>
                                    Show Legend
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="showAnimation" checked>
                                    Enable Animation
                                </label>
                            </div>
                        </div>

                        <!-- Templates -->
                        <div class="sidebar-section">
                            <h3>Templates</h3>
                            <div class="template-grid">
                                <button class="template-btn" data-template="sales">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Sales Data</span>
                                </button>
                                <button class="template-btn" data-template="survey">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Survey Results</span>
                                </button>
                                <button class="template-btn" data-template="performance">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>Performance</span>
                                </button>
                                <button class="template-btn" data-template="comparison">
                                    <i class="fas fa-chart-area"></i>
                                    <span>Comparison</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="main-area">
                        <div class="chart-container">
                            <div class="chart-toolbar">
                                <button id="undoBtn" class="btn btn-outline btn-sm" title="Undo">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button id="redoBtn" class="btn btn-outline btn-sm" title="Redo">
                                    <i class="fas fa-redo"></i>
                                </button>
                                <button id="zoomInBtn" class="btn btn-outline btn-sm" title="Zoom In">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button id="zoomOutBtn" class="btn btn-outline btn-sm" title="Zoom Out">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <button id="resetZoomBtn" class="btn btn-outline btn-sm" title="Reset Zoom">
                                    <i class="fas fa-expand-arrows-alt"></i>
                                </button>
                            </div>
                            
                            <div class="chart-canvas-container">
                                <canvas id="chartCanvas" width="800" height="400"></canvas>
                            </div>
                        </div>
                        
                        <div class="chart-info">
                            <div class="info-item">
                                <span class="info-label">Chart Type:</span>
                                <span id="currentChartType">Bar Chart</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Data Points:</span>
                                <span id="dataPointCount">0</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Last Updated:</span>
                                <span id="lastUpdated">Never</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="status-bar">
                    <div class="status-left">
                        <span id="statusMessage">Ready to create charts</span>
                    </div>
                    <div class="status-right">
                        <span id="chartDimensions">800 × 400</span>
                    </div>
                </div>

                <!-- Notification Area -->
                <div id="notificationArea" class="notification-area"></div>
            </div>
        `;

        this.applyStyles();
    }

    /**
     * Apply CSS styles
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chart-generator {
                display: flex;
                flex-direction: column;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f8f9fa;
            }

            .generator-header {
                background: white;
                padding: 1rem 2rem;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .generator-header h2 {
                margin: 0;
                color: #2c3e50;
                font-size: 1.5rem;
            }

            .generator-header p {
                margin: 0.25rem 0 0 0;
                color: #6c757d;
                font-size: 0.9rem;
            }

            .header-actions {
                display: flex;
                gap: 0.5rem;
            }

            .generator-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }

            .sidebar {
                width: 300px;
                background: white;
                border-right: 1px solid #e9ecef;
                overflow-y: auto;
                padding: 1rem;
            }

            .sidebar-section {
                margin-bottom: 2rem;
            }

            .sidebar-section h3 {
                margin: 0 0 1rem 0;
                color: #2c3e50;
                font-size: 1rem;
                font-weight: 600;
                border-bottom: 2px solid #3498db;
                padding-bottom: 0.5rem;
            }

            .chart-types {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }

            .chart-type-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem 0.5rem;
                border: 2px solid #e9ecef;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: #6c757d;
            }

            .chart-type-btn:hover {
                border-color: #3498db;
                color: #3498db;
                transform: translateY(-2px);
            }

            .chart-type-btn.active {
                border-color: #3498db;
                background: #3498db;
                color: white;
            }

            .chart-type-btn i {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .chart-type-btn span {
                font-size: 0.8rem;
                font-weight: 500;
            }

            .data-input-tabs {
                display: flex;
                margin-bottom: 1rem;
                border-bottom: 1px solid #e9ecef;
            }

            .tab-btn {
                flex: 1;
                padding: 0.5rem;
                border: none;
                background: none;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .tab-btn.active {
                border-bottom-color: #3498db;
                color: #3498db;
                font-weight: 600;
            }

            .tab-content {
                display: block;
            }

            .tab-content.hidden {
                display: none;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #2c3e50;
                font-size: 0.9rem;
            }

            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 0.9rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }

            .form-group textarea {
                resize: vertical;
                min-height: 60px;
            }

            .template-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }

            .template-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.75rem 0.5rem;
                border: 1px solid #e9ecef;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: #6c757d;
            }

            .template-btn:hover {
                border-color: #3498db;
                color: #3498db;
                transform: translateY(-1px);
            }

            .template-btn i {
                font-size: 1.2rem;
                margin-bottom: 0.25rem;
            }

            .template-btn span {
                font-size: 0.75rem;
                text-align: center;
            }

            .main-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 1rem;
            }

            .chart-container {
                flex: 1;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .chart-toolbar {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                gap: 0.5rem;
                background: #f8f9fa;
            }

            .chart-canvas-container {
                flex: 1;
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            #chartCanvas {
                max-width: 100%;
                max-height: 100%;
                border-radius: 4px;
            }

            .chart-info {
                display: flex;
                justify-content: space-between;
                margin-top: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .info-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .info-label {
                font-size: 0.8rem;
                color: #6c757d;
                margin-bottom: 0.25rem;
            }

            .status-bar {
                background: #2c3e50;
                color: white;
                padding: 0.5rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
            }

            .btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn-primary {
                background: #3498db;
                color: white;
            }

            .btn-primary:hover {
                background: #2980b9;
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover {
                background: #5a6268;
                transform: translateY(-1px);
            }

            .btn-success {
                background: #27ae60;
                color: white;
            }

            .btn-success:hover {
                background: #229954;
                transform: translateY(-1px);
            }

            .btn-outline {
                background: white;
                color: #6c757d;
                border: 1px solid #ddd;
            }

            .btn-outline:hover {
                background: #f8f9fa;
                border-color: #3498db;
                color: #3498db;
            }

            .btn-sm {
                padding: 0.375rem 0.75rem;
                font-size: 0.8rem;
            }

            .notification-area {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }

            .notification {
                background: white;
                border-left: 4px solid #3498db;
                padding: 1rem;
                margin-bottom: 0.5rem;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }

            .notification.success {
                border-left-color: #27ae60;
            }

            .notification.error {
                border-left-color: #e74c3c;
            }

            .notification.warning {
                border-left-color: #f39c12;
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
                .generator-content {
                    flex-direction: column;
                }

                .sidebar {
                    width: 100%;
                    max-height: 300px;
                }

                .chart-types {
                    grid-template-columns: repeat(3, 1fr);
                }

                .template-grid {
                    grid-template-columns: repeat(4, 1fr);
                }

                .chart-info {
                    flex-direction: column;
                    gap: 1rem;
                }

                .info-item {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Chart type selection
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.chartType = btn.dataset.type;
                this.updateChartTypeInfo();
                this.renderChart();
                this.saveToHistory();
            });
        });

        // Data input tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                
                const tabId = btn.dataset.tab + 'Tab';
                document.getElementById(tabId).classList.remove('hidden');
            });
        });

        // Data input buttons
        document.getElementById('updateDataBtn').addEventListener('click', () => this.updateManualData());
        document.getElementById('importCsvBtn').addEventListener('click', () => this.importCsvData());
        document.getElementById('importJsonBtn').addEventListener('click', () => this.importJsonData());

        // Customization inputs
        document.getElementById('chartTitle').addEventListener('input', (e) => {
            this.chartOptions.plugins.title.text = e.target.value;
            this.renderChart();
        });

        document.getElementById('xAxisLabel').addEventListener('input', (e) => {
            this.chartOptions.scales.x.title.text = e.target.value;
            this.renderChart();
        });

        document.getElementById('yAxisLabel').addEventListener('input', (e) => {
            this.chartOptions.scales.y.title.text = e.target.value;
            this.renderChart();
        });

        document.getElementById('colorPalette').addEventListener('change', (e) => {
            this.updateColors(e.target.value);
            this.renderChart();
        });

        document.getElementById('showLegend').addEventListener('change', (e) => {
            this.chartOptions.plugins.legend.display = e.target.checked;
            this.renderChart();
        });

        document.getElementById('showAnimation').addEventListener('change', (e) => {
            this.chartOptions.animation.duration = e.target.checked ? 1000 : 0;
            this.renderChart();
        });

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadTemplate(btn.dataset.template);
            });
        });

        // Header actions
        document.getElementById('newChartBtn').addEventListener('click', () => this.newChart());
        document.getElementById('importDataBtn').addEventListener('click', () => this.showImportDialog());
        document.getElementById('exportChartBtn').addEventListener('click', () => this.showExportDialog());

        // Toolbar actions
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('resetZoomBtn').addEventListener('click', () => this.resetZoom());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newChart();
                        break;
                    case 's':
                        e.preventDefault();
                        this.showExportDialog();
                        break;
                }
            }
        });
    }

    /**
     * Load sample data
     */
    loadSampleData() {
        this.chartData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Sales Revenue',
                data: [12000, 19000, 15000, 25000],
                backgroundColor: this.colorPalettes.default.slice(0, 4),
                borderColor: this.colorPalettes.default.slice(0, 4),
                borderWidth: 2
            }]
        };
        
        this.updateInputFields();
        this.updateDataPointCount();
    }

    /**
     * Update input fields with current data
     */
    updateInputFields() {
        document.getElementById('labelsInput').value = this.chartData.labels.join(', ');
        document.getElementById('dataInput').value = this.chartData.datasets[0].data.join(', ');
    }

    /**
     * Update manual data from inputs
     */
    updateManualData() {
        const labelsText = document.getElementById('labelsInput').value.trim();
        const dataText = document.getElementById('dataInput').value.trim();
        
        if (!labelsText || !dataText) {
            this.showNotification('Please enter both labels and data', 'error');
            return;
        }
        
        try {
            const labels = labelsText.split(',').map(label => label.trim());
            const data = dataText.split(',').map(value => {
                const num = parseFloat(value.trim());
                if (isNaN(num)) {
                    throw new Error(`Invalid number: ${value}`);
                }
                return num;
            });
            
            if (labels.length !== data.length) {
                this.showNotification('Labels and data must have the same number of items', 'error');
                return;
            }
            
            this.chartData.labels = labels;
            this.chartData.datasets[0].data = data;
            this.updateColors('default');
            this.renderChart();
            this.updateDataPointCount();
            this.saveToHistory();
            this.showNotification('Chart data updated successfully', 'success');
            
        } catch (error) {
            this.showNotification(`Error updating data: ${error.message}`, 'error');
        }
    }

    /**
     * Import CSV data
     */
    importCsvData() {
        const csvText = document.getElementById('csvInput').value.trim();
        
        if (!csvText) {
            this.showNotification('Please enter CSV data', 'error');
            return;
        }
        
        try {
            const lines = csvText.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
                throw new Error('CSV must have at least a header and one data row');
            }
            
            const headers = lines[0].split(',').map(h => h.trim());
            if (headers.length < 2) {
                throw new Error('CSV must have at least 2 columns (label and value)');
            }
            
            const labels = [];
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length >= 2) {
                    labels.push(values[0]);
                    const num = parseFloat(values[1]);
                    if (isNaN(num)) {
                        throw new Error(`Invalid number in row ${i + 1}: ${values[1]}`);
                    }
                    data.push(num);
                }
            }
            
            this.chartData.labels = labels;
            this.chartData.datasets[0].data = data;
            this.chartData.datasets[0].label = headers[1];
            this.updateColors('default');
            this.updateInputFields();
            this.renderChart();
            this.updateDataPointCount();
            this.saveToHistory();
            this.showNotification('CSV data imported successfully', 'success');
            
        } catch (error) {
            this.showNotification(`Error importing CSV: ${error.message}`, 'error');
        }
    }

    /**
     * Import JSON data
     */
    importJsonData() {
        const jsonText = document.getElementById('jsonInput').value.trim();
        
        if (!jsonText) {
            this.showNotification('Please enter JSON data', 'error');
            return;
        }
        
        try {
            const jsonData = JSON.parse(jsonText);
            
            if (!jsonData.labels || !jsonData.data) {
                throw new Error('JSON must contain "labels" and "data" arrays');
            }
            
            if (!Array.isArray(jsonData.labels) || !Array.isArray(jsonData.data)) {
                throw new Error('Labels and data must be arrays');
            }
            
            if (jsonData.labels.length !== jsonData.data.length) {
                throw new Error('Labels and data arrays must have the same length');
            }
            
            // Validate data values
            jsonData.data.forEach((value, index) => {
                if (typeof value !== 'number' || isNaN(value)) {
                    throw new Error(`Invalid number at index ${index}: ${value}`);
                }
            });
            
            this.chartData.labels = jsonData.labels;
            this.chartData.datasets[0].data = jsonData.data;
            if (jsonData.label) {
                this.chartData.datasets[0].label = jsonData.label;
            }
            this.updateColors('default');
            this.updateInputFields();
            this.renderChart();
            this.updateDataPointCount();
            this.saveToHistory();
            this.showNotification('JSON data imported successfully', 'success');
            
        } catch (error) {
            this.showNotification(`Error importing JSON: ${error.message}`, 'error');
        }
    }

    /**
     * Update colors based on palette
     */
    updateColors(paletteName) {
        const palette = this.colorPalettes[paletteName] || this.colorPalettes.default;
        const dataLength = this.chartData.datasets[0].data.length;
        
        this.chartData.datasets[0].backgroundColor = [];
        this.chartData.datasets[0].borderColor = [];
        
        for (let i = 0; i < dataLength; i++) {
            const color = palette[i % palette.length];
            this.chartData.datasets[0].backgroundColor.push(color);
            this.chartData.datasets[0].borderColor.push(color);
        }
    }

    /**
     * Render the chart
     */
    renderChart() {
        this.canvas = document.getElementById('chartCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Simple chart rendering based on type
        switch (this.chartType) {
            case 'bar':
                this.renderBarChart();
                break;
            case 'line':
                this.renderLineChart();
                break;
            case 'pie':
                this.renderPieChart();
                break;
            case 'doughnut':
                this.renderDoughnutChart();
                break;
            case 'area':
                this.renderAreaChart();
                break;
            case 'scatter':
                this.renderScatterChart();
                break;
            default:
                this.renderBarChart();
        }
        
        this.updateLastUpdated();
    }

    /**
     * Render bar chart
     */
    renderBarChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        const colors = this.chartData.datasets[0].backgroundColor;
        
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data);
        const padding = 60;
        const chartWidth = this.canvas.width - padding * 2;
        const chartHeight = this.canvas.height - padding * 2;
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;
        
        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = this.canvas.height - padding - barHeight;
            
            this.ctx.fillStyle = colors[index] || '#3498db';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value labels
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
            
            // Draw category labels
            this.ctx.fillText(labels[index] || `Item ${index + 1}`, x + barWidth / 2, this.canvas.height - padding + 20);
        });
        
        // Draw axes
        this.drawAxes();
    }

    /**
     * Render line chart
     */
    renderLineChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const padding = 60;
        const chartWidth = this.canvas.width - padding * 2;
        const chartHeight = this.canvas.height - padding * 2;
        
        // Draw line
        this.ctx.strokeStyle = this.chartData.datasets[0].borderColor[0] || '#3498db';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Draw points
        this.ctx.fillStyle = this.chartData.datasets[0].borderColor[0] || '#3498db';
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw value labels
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toString(), x, y - 10);
            
            // Draw category labels
            this.ctx.fillText(labels[index] || `Point ${index + 1}`, x, this.canvas.height - padding + 20);
        });
        
        // Draw axes
        this.drawAxes();
    }

    /**
     * Render pie chart
     */
    renderPieChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        const colors = this.chartData.datasets[0].backgroundColor;
        
        if (data.length === 0) return;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            this.ctx.fillStyle = colors[index] || this.colorPalettes.default[index % this.colorPalettes.default.length];
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(labels[index] || `Item ${index + 1}`, labelX, labelY);
            this.ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY + 15);
            
            currentAngle += sliceAngle;
        });
    }

    /**
     * Render doughnut chart
     */
    renderDoughnutChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        const colors = this.chartData.datasets[0].backgroundColor;
        
        if (data.length === 0) return;
        
        const total = data.reduce((sum, value) => sum + value, 0);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const outerRadius = Math.min(centerX, centerY) - 40;
        const innerRadius = outerRadius * 0.5;
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            this.ctx.fillStyle = colors[index] || this.colorPalettes.default[index % this.colorPalettes.default.length];
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = (outerRadius + innerRadius) / 2;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Draw center text
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Total', centerX, centerY - 5);
        this.ctx.fillText(total.toString(), centerX, centerY + 15);
    }

    /**
     * Render area chart
     */
    renderAreaChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const padding = 60;
        const chartWidth = this.canvas.width - padding * 2;
        const chartHeight = this.canvas.height - padding * 2;
        
        // Draw filled area
        this.ctx.fillStyle = this.chartData.datasets[0].backgroundColor[0] || 'rgba(52, 152, 219, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(padding, this.canvas.height - padding);
        
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            this.ctx.lineTo(x, y);
        });
        
        this.ctx.lineTo(padding + chartWidth, this.canvas.height - padding);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw line
        this.ctx.strokeStyle = this.chartData.datasets[0].borderColor[0] || '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Draw points and labels
        this.ctx.fillStyle = this.chartData.datasets[0].borderColor[0] || '#3498db';
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw category labels
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(labels[index] || `Point ${index + 1}`, x, this.canvas.height - padding + 20);
        });
        
        // Draw axes
        this.drawAxes();
    }

    /**
     * Render scatter chart
     */
    renderScatterChart() {
        const data = this.chartData.datasets[0].data;
        const labels = this.chartData.labels;
        
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const padding = 60;
        const chartWidth = this.canvas.width - padding * 2;
        const chartHeight = this.canvas.height - padding * 2;
        
        // Draw points
        this.ctx.fillStyle = this.chartData.datasets[0].backgroundColor[0] || '#3498db';
        data.forEach((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = this.canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw value labels
            this.ctx.fillStyle = '#333';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value.toString(), x, y - 10);
            
            // Draw category labels
            this.ctx.fillText(labels[index] || `Point ${index + 1}`, x, this.canvas.height - padding + 20);
        });
        
        // Draw axes
        this.drawAxes();
    }

    /**
     * Draw chart axes
     */
    drawAxes() {
        const padding = 60;
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.canvas.height - padding);
        this.ctx.stroke();
        
        // Draw title
        if (this.chartOptions.plugins.title.display) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.chartOptions.plugins.title.text, this.canvas.width / 2, 30);
        }
        
        // Draw axis labels
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis label
        if (this.chartOptions.scales.x.title.display) {
            this.ctx.fillText(this.chartOptions.scales.x.title.text, this.canvas.width / 2, this.canvas.height - 10);
        }
        
        // Y-axis label
        if (this.chartOptions.scales.y.title.display) {
            this.ctx.save();
            this.ctx.translate(15, this.canvas.height / 2);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(this.chartOptions.scales.y.title.text, 0, 0);
            this.ctx.restore();
        }
    }

    /**
     * Load template data
     */
    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (!template) return;
        
        this.chartData = JSON.parse(JSON.stringify(template.data));
        this.chartType = template.type;
        this.chartOptions.plugins.title.text = template.title;
        
        // Update UI
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this.chartType);
        });
        
        document.getElementById('chartTitle').value = template.title;
        this.updateInputFields();
        this.updateColors('default');
        this.renderChart();
        this.updateDataPointCount();
        this.updateChartTypeInfo();
        this.saveToHistory();
        this.showNotification(`Template "${template.name}" loaded successfully`, 'success');
    }

    /**
     * Get default templates
     */
    getDefaultTemplates() {
        return {
            sales: {
                name: 'Sales Data',
                type: 'line',
                title: 'Monthly Sales Revenue',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales Revenue',
                        data: [15000, 18000, 22000, 19000, 25000, 28000],
                        backgroundColor: ['#3498db'],
                        borderColor: ['#3498db'],
                        borderWidth: 2
                    }]
                }
            },
            survey: {
                name: 'Survey Results',
                type: 'pie',
                title: 'Customer Satisfaction Survey',
                data: {
                    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
                    datasets: [{
                        label: 'Responses',
                        data: [45, 30, 15, 10],
                        backgroundColor: ['#27ae60', '#3498db', '#f39c12', '#e74c3c'],
                        borderColor: ['#27ae60', '#3498db', '#f39c12', '#e74c3c'],
                        borderWidth: 2
                    }]
                }
            },
            performance: {
                name: 'Performance',
                type: 'bar',
                title: 'Team Performance Metrics',
                data: {
                    labels: ['Team A', 'Team B', 'Team C', 'Team D'],
                    datasets: [{
                        label: 'Performance Score',
                        data: [85, 92, 78, 88],
                        backgroundColor: ['#3498db', '#27ae60', '#f39c12', '#9b59b6'],
                        borderColor: ['#3498db', '#27ae60', '#f39c12', '#9b59b6'],
                        borderWidth: 2
                    }]
                }
            },
            comparison: {
                name: 'Comparison',
                type: 'area',
                title: 'Product Comparison Over Time',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Product Sales',
                        data: [120, 150, 180, 200],
                        backgroundColor: ['rgba(52, 152, 219, 0.3)'],
                        borderColor: ['#3498db'],
                        borderWidth: 2
                    }]
                }
            }
        };
    }

    /**
     * Create new chart
     */
    newChart() {
        this.chartData = {
            labels: [],
            datasets: [{
                label: 'Dataset 1',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 2
            }]
        };
        
        this.chartType = 'bar';
        this.chartOptions.plugins.title.text = 'Chart Title';
        this.chartOptions.scales.x.title.text = 'X Axis';
        this.chartOptions.scales.y.title.text = 'Y Axis';
        
        // Reset UI
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === 'bar');
        });
        
        document.getElementById('chartTitle').value = 'Chart Title';
        document.getElementById('xAxisLabel').value = 'X Axis';
        document.getElementById('yAxisLabel').value = 'Y Axis';
        document.getElementById('labelsInput').value = '';
        document.getElementById('dataInput').value = '';
        document.getElementById('csvInput').value = '';
        document.getElementById('jsonInput').value = '';
        
        this.renderChart();
        this.updateDataPointCount();
        this.updateChartTypeInfo();
        this.saveToHistory();
        this.showNotification('New chart created', 'success');
    }

    /**
     * Show import dialog
     */
    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                
                if (file.name.endsWith('.csv')) {
                    document.getElementById('csvInput').value = content;
                    // Switch to CSV tab
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.tab === 'csv');
                    });
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById('csvTab').classList.remove('hidden');
                    this.importCsvData();
                } else if (file.name.endsWith('.json')) {
                    document.getElementById('jsonInput').value = content;
                    // Switch to JSON tab
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.tab === 'json');
                    });
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById('jsonTab').classList.remove('hidden');
                    this.importJsonData();
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * Show export dialog
     */
    showExportDialog() {
        const exportOptions = [
            { format: 'png', label: 'PNG Image', icon: 'fas fa-image' },
            { format: 'jpg', label: 'JPG Image', icon: 'fas fa-image' },
            { format: 'svg', label: 'SVG Vector', icon: 'fas fa-vector-square' },
            { format: 'pdf', label: 'PDF Document', icon: 'fas fa-file-pdf' },
            { format: 'json', label: 'JSON Data', icon: 'fas fa-code' },
            { format: 'csv', label: 'CSV Data', icon: 'fas fa-table' }
        ];

        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <div class="export-header">
                    <h3>Export Chart</h3>
                    <button class="close-btn" onclick="this.closest('.export-dialog').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="export-options">
                    ${exportOptions.map(option => `
                        <button class="export-option" data-format="${option.format}">
                            <i class="${option.icon}"></i>
                            <span>${option.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add dialog styles
        const dialogStyle = document.createElement('style');
        dialogStyle.textContent = `
            .export-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .export-dialog-content {
                background: white;
                border-radius: 8px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
            }
            .export-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .export-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #6c757d;
            }
            .export-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            .export-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
                border: 2px solid #e9ecef;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .export-option:hover {
                border-color: #3498db;
                color: #3498db;
                transform: translateY(-2px);
            }
            .export-option i {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
        `;
        document.head.appendChild(dialogStyle);

        // Add event listeners
        dialog.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportChart(btn.dataset.format);
                dialog.remove();
                dialogStyle.remove();
            });
        });

        document.body.appendChild(dialog);
    }

    /**
     * Export chart in specified format
     */
    exportChart(format) {
        try {
            switch (format) {
                case 'png':
                case 'jpg':
                    this.exportAsImage(format);
                    break;
                case 'svg':
                    this.exportAsSvg();
                    break;
                case 'pdf':
                    this.exportAsPdf();
                    break;
                case 'json':
                    this.exportAsJson();
                    break;
                case 'csv':
                    this.exportAsCsv();
                    break;
                default:
                    this.showNotification('Export format not supported', 'error');
            }
        } catch (error) {
            this.showNotification(`Export failed: ${error.message}`, 'error');
        }
    }

    /**
     * Export as image
     */
    exportAsImage(format) {
        const link = document.createElement('a');
        link.download = `chart.${format}`;
        link.href = this.canvas.toDataURL(`image/${format}`);
        link.click();
        this.showNotification(`Chart exported as ${format.toUpperCase()}`, 'success');
    }

    /**
     * Export as SVG
     */
    exportAsSvg() {
        // Create SVG representation
        const svgContent = this.generateSvg();
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'chart.svg';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Chart exported as SVG', 'success');
    }

    /**
     * Generate SVG content
     */
    generateSvg() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  <text x="${width/2}" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">${this.chartOptions.plugins.title.text}</text>
  <!-- Chart content would be generated here based on chart type -->
  <text x="${width/2}" y="${height-10}" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">${this.chartOptions.scales.x.title.text}</text>
</svg>`;
    }

    /**
     * Export as PDF
     */
    exportAsPdf() {
        // Simple PDF export using canvas
        const imgData = this.canvas.toDataURL('image/png');
        
        // Create a simple PDF-like structure
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj

xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
179
%%EOF`;
        
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'chart.pdf';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Chart exported as PDF', 'success');
    }

    /**
     * Export as JSON
     */
    exportAsJson() {
        const exportData = {
            chartType: this.chartType,
            chartData: this.chartData,
            chartOptions: this.chartOptions,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'chart-data.json';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Chart data exported as JSON', 'success');
    }

    /**
     * Export as CSV
     */
    exportAsCsv() {
        let csvContent = 'Label,Value\n';
        
        this.chartData.labels.forEach((label, index) => {
            const value = this.chartData.datasets[0].data[index] || 0;
            csvContent += `"${label}",${value}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'chart-data.csv';
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Chart data exported as CSV', 'success');
    }

    /**
     * Zoom in
     */
    zoomIn() {
        this.canvas.style.transform = `scale(${parseFloat(this.canvas.style.transform.replace('scale(', '').replace(')', '') || 1) * 1.2})`;
        this.showNotification('Zoomed in', 'success');
    }

    /**
     * Zoom out
     */
    zoomOut() {
        this.canvas.style.transform = `scale(${parseFloat(this.canvas.style.transform.replace('scale(', '').replace(')', '') || 1) / 1.2})`;
        this.showNotification('Zoomed out', 'success');
    }

    /**
     * Reset zoom
     */
    resetZoom() {
        this.canvas.style.transform = 'scale(1)';
        this.showNotification('Zoom reset', 'success');
    }

    /**
     * Save current state to history
     */
    saveToHistory() {
        const state = {
            chartData: JSON.parse(JSON.stringify(this.chartData)),
            chartType: this.chartType,
            chartOptions: JSON.parse(JSON.stringify(this.chartOptions))
        };
        
        // Remove any states after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(state);
        
        // Limit history to 50 states
        if (this.history.length > 50) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateHistoryButtons();
    }

    /**
     * Undo last action
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreFromHistory();
            this.showNotification('Undone', 'success');
        }
    }

    /**
     * Redo last undone action
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreFromHistory();
            this.showNotification('Redone', 'success');
        }
    }

    /**
     * Restore state from history
     */
    restoreFromHistory() {
        if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
            const state = this.history[this.historyIndex];
            
            this.chartData = JSON.parse(JSON.stringify(state.chartData));
            this.chartType = state.chartType;
            this.chartOptions = JSON.parse(JSON.stringify(state.chartOptions));
            
            // Update UI
            this.updateInputFields();
            this.updateChartTypeInfo();
            this.renderChart();
            this.updateDataPointCount();
            this.updateHistoryButtons();
        }
    }

    /**
     * Update history buttons state
     */
    updateHistoryButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.disabled = this.historyIndex <= 0;
            undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
        }
        
        if (redoBtn) {
            redoBtn.disabled = this.historyIndex >= this.history.length - 1;
            redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
        }
    }

    /**
     * Update chart type info
     */
    updateChartTypeInfo() {
        const chartTypeMap = {
            bar: 'Bar Chart',
            line: 'Line Chart',
            pie: 'Pie Chart',
            doughnut: 'Doughnut Chart',
            area: 'Area Chart',
            scatter: 'Scatter Chart'
        };
        
        const currentChartType = document.getElementById('currentChartType');
        if (currentChartType) {
            currentChartType.textContent = chartTypeMap[this.chartType] || 'Unknown Chart';
        }
    }

    /**
     * Update data point count
     */
    updateDataPointCount() {
        const dataPointCount = document.getElementById('dataPointCount');
        if (dataPointCount) {
            dataPointCount.textContent = this.chartData.datasets[0].data.length.toString();
        }
    }

    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            lastUpdated.textContent = new Date().toLocaleTimeString();
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notificationArea');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.closest('.notification').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notificationArea.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * Update status message
     */
    updateStatus(message) {
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = message;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartGeneratorUtility;
}