/**
 * Letterhead Creator Utility
 * Professional letterhead design tool with templates and customization options
 */
class LetterheadCreatorUtility {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.selectedElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeHandle = null;
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        // Letterhead dimensions (8.5" x 11" at 96 DPI)
        this.letterheadWidth = 816;
        this.letterheadHeight = 1056;
        
        // Current letterhead data
        this.letterhead = {
            elements: [],
            backgroundColor: '#ffffff',
            template: 'blank'
        };
        
        // Available fonts
        this.fonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
            'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
            'Courier New', 'Lucida Console', 'Palatino', 'Garamond'
        ];
        
        // Color palette
        this.colors = [
            '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
            '#ffa500', '#ffc0cb', '#a52a2a', '#dda0dd', '#98fb98', '#f0e68c'
        ];
        
        // Letterhead templates
        this.templates = {
            blank: {
                name: 'Blank',
                elements: []
            },
            corporate: {
                name: 'Corporate',
                backgroundColor: '#ffffff',
                elements: [
                    {
                        type: 'rectangle',
                        x: 0,
                        y: 0,
                        width: 816,
                        height: 120,
                        fillColor: '#2c3e50',
                        strokeColor: 'transparent'
                    },
                    {
                        type: 'text',
                        content: 'COMPANY NAME',
                        x: 50,
                        y: 45,
                        fontSize: 28,
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Your Business Tagline',
                        x: 50,
                        y: 75,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        color: '#ecf0f1'
                    },
                    {
                        type: 'line',
                        x1: 50,
                        y1: 140,
                        x2: 766,
                        y2: 140,
                        strokeColor: '#3498db',
                        strokeWidth: 3
                    }
                ]
            },
            modern: {
                name: 'Modern',
                backgroundColor: '#ffffff',
                elements: [
                    {
                        type: 'rectangle',
                        x: 0,
                        y: 0,
                        width: 10,
                        height: 1056,
                        fillColor: '#e74c3c',
                        strokeColor: 'transparent'
                    },
                    {
                        type: 'text',
                        content: 'COMPANY',
                        x: 30,
                        y: 50,
                        fontSize: 32,
                        fontFamily: 'Helvetica',
                        color: '#2c3e50',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Professional Services',
                        x: 30,
                        y: 80,
                        fontSize: 16,
                        fontFamily: 'Helvetica',
                        color: '#7f8c8d'
                    },
                    {
                        type: 'text',
                        content: '123 Business Street, City, State 12345',
                        x: 30,
                        y: 110,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        color: '#95a5a6'
                    },
                    {
                        type: 'text',
                        content: 'Phone: (555) 123-4567 | Email: info@company.com',
                        x: 30,
                        y: 130,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        color: '#95a5a6'
                    }
                ]
            },
            elegant: {
                name: 'Elegant',
                backgroundColor: '#ffffff',
                elements: [
                    {
                        type: 'text',
                        content: 'Company Name',
                        x: 408,
                        y: 60,
                        fontSize: 36,
                        fontFamily: 'Georgia',
                        color: '#2c3e50',
                        bold: true,
                        textAlign: 'center'
                    },
                    {
                        type: 'line',
                        x1: 200,
                        y1: 80,
                        x2: 616,
                        y2: 80,
                        strokeColor: '#d4af37',
                        strokeWidth: 2
                    },
                    {
                        type: 'text',
                        content: 'Excellence in Service',
                        x: 408,
                        y: 105,
                        fontSize: 16,
                        fontFamily: 'Georgia',
                        color: '#7f8c8d',
                        textAlign: 'center',
                        italic: true
                    },
                    {
                        type: 'text',
                        content: '456 Executive Boulevard | Suite 100 | Business City, BC 54321',
                        x: 408,
                        y: 130,
                        fontSize: 11,
                        fontFamily: 'Georgia',
                        color: '#95a5a6',
                        textAlign: 'center'
                    },
                    {
                        type: 'text',
                        content: 'Tel: (555) 987-6543 | Fax: (555) 987-6544 | www.company.com',
                        x: 408,
                        y: 150,
                        fontSize: 11,
                        fontFamily: 'Georgia',
                        color: '#95a5a6',
                        textAlign: 'center'
                    }
                ]
            },
            creative: {
                name: 'Creative',
                backgroundColor: '#f8f9fa',
                elements: [
                    {
                        type: 'circle',
                        x: 50,
                        y: 50,
                        radius: 40,
                        fillColor: '#e74c3c',
                        strokeColor: 'transparent'
                    },
                    {
                        type: 'text',
                        content: 'CREATIVE',
                        x: 120,
                        y: 45,
                        fontSize: 28,
                        fontFamily: 'Trebuchet MS',
                        color: '#2c3e50',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'STUDIO',
                        x: 120,
                        y: 75,
                        fontSize: 28,
                        fontFamily: 'Trebuchet MS',
                        color: '#e74c3c',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Design • Branding • Marketing',
                        x: 120,
                        y: 100,
                        fontSize: 14,
                        fontFamily: 'Trebuchet MS',
                        color: '#7f8c8d'
                    },
                    {
                        type: 'rectangle',
                        x: 0,
                        y: 1040,
                        width: 816,
                        height: 16,
                        fillColor: '#e74c3c',
                        strokeColor: 'transparent'
                    }
                ]
            }
        };
    }
    
    /**
     * Initialize the letterhead creator
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.createInterface();
        this.setupCanvas();
        this.setupEventListeners();
        this.loadTemplate('blank');
        this.saveState();
        
        console.log('Letterhead Creator initialized');
    }
    
    /**
     * Create the main interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="letterhead-creator">
                <div class="creator-header">
                    <h2>📄 Letterhead Creator</h2>
                    <p>Design professional letterheads with ease</p>
                    <div class="header-actions">
                        <button id="newLetterheadBtn" class="btn btn-primary">
                            <i class="fas fa-plus"></i> New
                        </button>
                        <button id="saveLetterheadBtn" class="btn btn-success">
                            <i class="fas fa-save"></i> Save
                        </button>
                        <button id="loadLetterheadBtn" class="btn btn-secondary">
                            <i class="fas fa-folder-open"></i> Load
                        </button>
                        <button id="exportLetterheadBtn" class="btn btn-info">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                
                <div class="creator-content">
                    <div class="creator-sidebar">
                        <div class="tool-section">
                            <h3>Templates</h3>
                            <div class="template-grid" id="templateGrid"></div>
                        </div>
                        
                        <div class="tool-section">
                            <h3>Design Tools</h3>
                            <div class="tool-buttons">
                                <button class="tool-btn" data-tool="text">
                                    <i class="fas fa-font"></i> Text
                                </button>
                                <button class="tool-btn" data-tool="image">
                                    <i class="fas fa-image"></i> Image
                                </button>
                                <button class="tool-btn" data-tool="rectangle">
                                    <i class="fas fa-square"></i> Rectangle
                                </button>
                                <button class="tool-btn" data-tool="circle">
                                    <i class="fas fa-circle"></i> Circle
                                </button>
                                <button class="tool-btn" data-tool="line">
                                    <i class="fas fa-minus"></i> Line
                                </button>
                            </div>
                            
                            <div class="company-tools">
                                <button class="tool-btn company-btn" onclick="window.letterheadCreator.addCompanyLogo()">
                                    <i class="fas fa-building"></i> Add Logo
                                </button>
                                <button class="tool-btn company-btn" onclick="window.letterheadCreator.addContactInfo()">
                                    <i class="fas fa-address-card"></i> Contact Info
                                </button>
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <h3>Text Properties</h3>
                            <div class="property-group">
                                <label>Font Family:</label>
                                <select id="fontFamily">
                                    ${this.fonts.map(font => `<option value="${font}">${font}</option>`).join('')}
                                </select>
                            </div>
                            <div class="property-group">
                                <label>Font Size:</label>
                                <input type="number" id="fontSize" min="8" max="72" value="16">
                            </div>
                            <div class="property-group">
                                <label>Text Color:</label>
                                <input type="color" id="textColor" value="#000000">
                            </div>
                            <div class="property-group">
                                <label>Text Style:</label>
                                <div class="style-buttons">
                                    <button class="style-btn" data-style="bold">
                                        <i class="fas fa-bold"></i>
                                    </button>
                                    <button class="style-btn" data-style="italic">
                                        <i class="fas fa-italic"></i>
                                    </button>
                                    <button class="style-btn" data-style="underline">
                                        <i class="fas fa-underline"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="property-group">
                                <label>Text Align:</label>
                                <div class="align-buttons">
                                    <button class="align-btn" data-align="left">
                                        <i class="fas fa-align-left"></i>
                                    </button>
                                    <button class="align-btn" data-align="center">
                                        <i class="fas fa-align-center"></i>
                                    </button>
                                    <button class="align-btn" data-align="right">
                                        <i class="fas fa-align-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <h3>Shape Properties</h3>
                            <div class="property-group">
                                <label>Fill Color:</label>
                                <input type="color" id="fillColor" value="#3498db">
                            </div>
                            <div class="property-group">
                                <label>Stroke Color:</label>
                                <input type="color" id="strokeColor" value="#2c3e50">
                            </div>
                            <div class="property-group">
                                <label>Stroke Width:</label>
                                <input type="number" id="strokeWidth" min="0" max="20" value="2">
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <h3>Background</h3>
                            <div class="property-group">
                                <label>Background Color:</label>
                                <input type="color" id="backgroundColor" value="#ffffff">
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <h3>Actions</h3>
                            <div class="action-buttons">
                                <button id="undoBtn" class="btn btn-outline">
                                    <i class="fas fa-undo"></i> Undo
                                </button>
                                <button id="redoBtn" class="btn btn-outline">
                                    <i class="fas fa-redo"></i> Redo
                                </button>
                                <button id="deleteBtn" class="btn btn-danger">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                                <button id="duplicateBtn" class="btn btn-outline">
                                    <i class="fas fa-copy"></i> Duplicate
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="creator-main">
                        <div class="canvas-toolbar">
                            <div class="zoom-controls">
                                <button id="zoomOutBtn" class="btn btn-sm">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <span id="zoomLevel">100%</span>
                                <button id="zoomInBtn" class="btn btn-sm">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button id="fitToScreenBtn" class="btn btn-sm">
                                    <i class="fas fa-expand-arrows-alt"></i> Fit
                                </button>
                            </div>
                            <div class="canvas-info">
                                <span>8.5" × 11" (Letter Size)</span>
                            </div>
                        </div>
                        
                        <div class="canvas-container">
                            <canvas id="letterheadCanvas" width="816" height="1056"></canvas>
                            <div class="canvas-overlay" id="canvasOverlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.createTemplateGrid();
    }
    
    /**
     * Create template grid
     */
    createTemplateGrid() {
        const templateGrid = document.getElementById('templateGrid');
        templateGrid.innerHTML = '';
        
        Object.keys(this.templates).forEach(templateKey => {
            const template = this.templates[templateKey];
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <div class="template-preview"></div>
                <div class="template-name">${template.name}</div>
            `;
            
            templateCard.addEventListener('click', () => {
                this.loadTemplate(templateKey);
            });
            
            templateGrid.appendChild(templateCard);
        });
    }
    
    /**
     * Setup canvas
     */
    setupCanvas() {
        this.canvas = document.getElementById('letterheadCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas style for better rendering
        this.canvas.style.border = '1px solid #ddd';
        this.canvas.style.backgroundColor = '#ffffff';
        this.canvas.style.cursor = 'default';
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Header actions
        document.getElementById('newLetterheadBtn').addEventListener('click', () => this.newLetterhead());
        document.getElementById('saveLetterheadBtn').addEventListener('click', () => this.saveLetterhead());
        document.getElementById('loadLetterheadBtn').addEventListener('click', () => this.loadLetterhead());
        document.getElementById('exportLetterheadBtn').addEventListener('click', () => this.exportLetterhead());
        
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.selectTool(tool);
            });
        });
        
        // Property controls
        document.getElementById('fontFamily').addEventListener('change', () => this.updateSelectedElement());
        document.getElementById('fontSize').addEventListener('input', () => this.updateSelectedElement());
        document.getElementById('textColor').addEventListener('change', () => this.updateSelectedElement());
        document.getElementById('fillColor').addEventListener('change', () => this.updateSelectedElement());
        document.getElementById('strokeColor').addEventListener('change', () => this.updateSelectedElement());
        document.getElementById('strokeWidth').addEventListener('input', () => this.updateSelectedElement());
        document.getElementById('backgroundColor').addEventListener('change', () => this.updateBackgroundColor());
        
        // Style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const style = e.currentTarget.dataset.style;
                this.toggleTextStyle(style);
            });
        });
        
        // Align buttons
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const align = e.currentTarget.dataset.align;
                this.setTextAlign(align);
            });
        });
        
        // Action buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelectedElement());
        document.getElementById('duplicateBtn').addEventListener('click', () => this.duplicateSelectedElement());
        
        // Zoom controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('fitToScreenBtn').addEventListener('click', () => this.fitToScreen());
        
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    /**
     * Load template
     */
    loadTemplate(templateKey) {
        if (!this.templates[templateKey]) return;
        
        const template = this.templates[templateKey];
        this.letterhead = {
            elements: JSON.parse(JSON.stringify(template.elements)),
            backgroundColor: template.backgroundColor || '#ffffff',
            template: templateKey
        };
        
        document.getElementById('backgroundColor').value = this.letterhead.backgroundColor;
        this.selectedElement = null;
        this.render();
        this.saveState();
    }
    
    /**
     * Select tool
     */
    selectTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        // Change cursor
        this.canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
    }
    
    /**
     * Handle mouse down
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        // Check if clicking on existing element
        const clickedElement = this.getElementAt(x, y);
        
        if (clickedElement) {
            this.selectedElement = clickedElement;
            this.isDragging = true;
            this.dragOffset = {
                x: x - clickedElement.x,
                y: y - clickedElement.y
            };
            this.updatePropertyPanel();
        } else if (this.currentTool) {
            // Create new element
            this.createElementAt(x, y);
        } else {
            this.selectedElement = null;
        }
        
        this.render();
    }
    
    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        if (!this.isDragging || !this.selectedElement) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        this.selectedElement.x = x - this.dragOffset.x;
        this.selectedElement.y = y - this.dragOffset.y;
        
        this.render();
    }
    
    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.saveState();
        }
    }
    
    /**
     * Handle double click
     */
    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        const clickedElement = this.getElementAt(x, y);
        
        if (clickedElement && clickedElement.type === 'text') {
            this.editText(clickedElement);
        }
    }
    
    /**
     * Handle key down
     */
    handleKeyDown(e) {
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
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 'd':
                    e.preventDefault();
                    this.duplicateSelectedElement();
                    break;
            }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            this.deleteSelectedElement();
        }
    }
    
    /**
     * Get element at position
     */
    getElementAt(x, y) {
        // Check elements in reverse order (top to bottom)
        for (let i = this.letterhead.elements.length - 1; i >= 0; i--) {
            const element = this.letterhead.elements[i];
            
            if (this.isPointInElement(x, y, element)) {
                return element;
            }
        }
        
        return null;
    }
    
    /**
     * Check if point is in element
     */
    isPointInElement(x, y, element) {
        switch (element.type) {
            case 'text':
                // Approximate text bounds
                const textWidth = this.ctx.measureText(element.content).width;
                const textHeight = element.fontSize;
                return x >= element.x && x <= element.x + textWidth &&
                       y >= element.y - textHeight && y <= element.y;
            
            case 'rectangle':
                return x >= element.x && x <= element.x + element.width &&
                       y >= element.y && y <= element.y + element.height;
            
            case 'circle':
                const dx = x - element.x;
                const dy = y - element.y;
                return Math.sqrt(dx * dx + dy * dy) <= element.radius;
            
            case 'line':
                // Simple line hit detection
                const lineThreshold = 5;
                const dist = this.distanceToLine(x, y, element.x1, element.y1, element.x2, element.y2);
                return dist <= lineThreshold;
            
            case 'image':
                return x >= element.x && x <= element.x + element.width &&
                       y >= element.y && y <= element.y + element.height;
        }
        
        return false;
    }
    
    /**
     * Distance to line
     */
    distanceToLine(x, y, x1, y1, x2, y2) {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        const param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Create element at position
     */
    createElementAt(x, y) {
        let element;
        
        switch (this.currentTool) {
            case 'text':
                element = {
                    type: 'text',
                    content: 'Double-click to edit',
                    x: x,
                    y: y,
                    fontSize: parseInt(document.getElementById('fontSize').value),
                    fontFamily: document.getElementById('fontFamily').value,
                    color: document.getElementById('textColor').value,
                    bold: false,
                    italic: false,
                    underline: false,
                    textAlign: 'left'
                };
                break;
            
            case 'rectangle':
                element = {
                    type: 'rectangle',
                    x: x,
                    y: y,
                    width: 100,
                    height: 60,
                    fillColor: document.getElementById('fillColor').value,
                    strokeColor: document.getElementById('strokeColor').value,
                    strokeWidth: parseInt(document.getElementById('strokeWidth').value)
                };
                break;
            
            case 'circle':
                element = {
                    type: 'circle',
                    x: x,
                    y: y,
                    radius: 30,
                    fillColor: document.getElementById('fillColor').value,
                    strokeColor: document.getElementById('strokeColor').value,
                    strokeWidth: parseInt(document.getElementById('strokeWidth').value)
                };
                break;
            
            case 'line':
                element = {
                    type: 'line',
                    x1: x,
                    y1: y,
                    x2: x + 100,
                    y2: y,
                    strokeColor: document.getElementById('strokeColor').value,
                    strokeWidth: parseInt(document.getElementById('strokeWidth').value)
                };
                break;
                
            case 'image':
                this.addImageElement(x, y);
                return;
        }
        
        if (element) {
            this.letterhead.elements.push(element);
            this.selectedElement = element;
            this.updatePropertyPanel();
            this.render();
            this.saveState();
        }
    }
    
    /**
     * Add image element
     */
    addImageElement(x = 50, y = 50) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const element = {
                            type: 'image',
                            x: x,
                            y: y,
                            width: Math.min(200, img.width),
                            height: Math.min(200, img.height),
                            imageData: event.target.result
                        };
                        this.letterhead.elements.push(element);
                        this.selectedElement = element;
                        this.updatePropertyPanel();
                        this.render();
                        this.saveState();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    /**
     * Add company logo
     */
    addCompanyLogo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        // Position logo in top-left corner with appropriate sizing
                        const logoSize = Math.min(120, img.width, img.height);
                        const element = {
                            type: 'image',
                            x: 30,
                            y: 30,
                            width: logoSize,
                            height: logoSize * (img.height / img.width),
                            imageData: event.target.result,
                            isLogo: true
                        };
                        this.letterhead.elements.push(element);
                        this.selectedElement = element;
                        this.updatePropertyPanel();
                        this.render();
                        this.saveState();
                        this.showNotification('Company logo added successfully', 'success');
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    /**
     * Add contact information
     */
    addContactInfo() {
        // Create a modal for contact information input
        const modal = document.createElement('div');
        modal.className = 'contact-info-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Contact Information</h3>
                    <button class="close-btn" onclick="this.closest('.contact-info-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Company Name:</label>
                        <input type="text" id="companyName" placeholder="Your Company Name">
                    </div>
                    <div class="form-group">
                        <label>Address:</label>
                        <textarea id="address" placeholder="123 Business Street\nCity, State 12345"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Phone:</label>
                        <input type="text" id="phone" placeholder="(555) 123-4567">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="email" placeholder="contact@company.com">
                    </div>
                    <div class="form-group">
                        <label>Website:</label>
                        <input type="text" id="website" placeholder="www.company.com">
                    </div>
                    <div class="form-group">
                        <label>Position:</label>
                        <select id="position">
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.contact-info-modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.letterheadCreator.createContactInfoBlock()">Add Contact Info</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .contact-info-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .contact-info-modal .modal-content {
                background: white;
                border-radius: 8px;
                padding: 0;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .contact-info-modal .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .contact-info-modal .modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            .contact-info-modal .close-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #6c757d;
                padding: 5px;
            }
            .contact-info-modal .modal-body {
                padding: 20px;
            }
            .contact-info-modal .form-group {
                margin-bottom: 15px;
            }
            .contact-info-modal label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #495057;
            }
            .contact-info-modal input,
            .contact-info-modal textarea,
            .contact-info-modal select {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }
            .contact-info-modal textarea {
                height: 60px;
                resize: vertical;
            }
            .contact-info-modal .modal-footer {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }
    
    /**
     * Create contact info block
     */
    createContactInfoBlock() {
        const companyName = document.getElementById('companyName').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const website = document.getElementById('website').value;
        const position = document.getElementById('position').value;
        
        if (!companyName && !address && !phone && !email && !website) {
            this.showNotification('Please fill in at least one contact field', 'error');
            return;
        }
        
        // Build contact info text
        let contactText = [];
        if (companyName) contactText.push(companyName);
        if (address) contactText.push(address);
        if (phone) contactText.push('Phone: ' + phone);
        if (email) contactText.push('Email: ' + email);
        if (website) contactText.push('Web: ' + website);
        
        // Determine position
        let x, y;
        const canvasWidth = this.letterheadWidth;
        const canvasHeight = this.letterheadHeight;
        const textWidth = 200; // Approximate width
        const textHeight = contactText.length * 20; // Approximate height
        
        switch (position) {
            case 'top-right':
                x = canvasWidth - textWidth - 30;
                y = 50;
                break;
            case 'top-left':
                x = 30;
                y = 50;
                break;
            case 'bottom-right':
                x = canvasWidth - textWidth - 30;
                y = canvasHeight - textHeight - 30;
                break;
            case 'bottom-left':
                x = 30;
                y = canvasHeight - textHeight - 30;
                break;
            default:
                x = canvasWidth - textWidth - 30;
                y = 50;
        }
        
        // Create text element for contact info
        const element = {
            type: 'text',
            content: contactText.join('\n'),
            x: x,
            y: y,
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#333333',
            textAlign: position.includes('right') ? 'right' : 'left',
            isContactInfo: true
        };
        
        this.letterhead.elements.push(element);
        this.selectedElement = element;
        this.updatePropertyPanel();
        this.render();
        this.saveState();
        
        // Close modal
        document.querySelector('.contact-info-modal').remove();
        
        this.showNotification('Contact information added successfully', 'success');
    }
    
    /**
     * Edit text
     */
    editText(element) {
        const newText = prompt('Enter text:', element.content);
        if (newText !== null) {
            element.content = newText;
            this.render();
            this.saveState();
        }
    }
    
    /**
     * Update selected element
     */
    updateSelectedElement() {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement;
        
        if (element.type === 'text') {
            element.fontFamily = document.getElementById('fontFamily').value;
            element.fontSize = parseInt(document.getElementById('fontSize').value);
            element.color = document.getElementById('textColor').value;
        }
        
        if (['rectangle', 'circle'].includes(element.type)) {
            element.fillColor = document.getElementById('fillColor').value;
            element.strokeColor = document.getElementById('strokeColor').value;
            element.strokeWidth = parseInt(document.getElementById('strokeWidth').value);
        }
        
        if (element.type === 'line') {
            element.strokeColor = document.getElementById('strokeColor').value;
            element.strokeWidth = parseInt(document.getElementById('strokeWidth').value);
        }
        
        this.render();
        this.saveState();
    }
    
    /**
     * Toggle text style
     */
    toggleTextStyle(style) {
        if (!this.selectedElement || this.selectedElement.type !== 'text') return;
        
        this.selectedElement[style] = !this.selectedElement[style];
        this.render();
        this.saveState();
    }
    
    /**
     * Set text align
     */
    setTextAlign(align) {
        if (!this.selectedElement || this.selectedElement.type !== 'text') return;
        
        this.selectedElement.textAlign = align;
        this.render();
        this.saveState();
    }
    
    /**
     * Update background color
     */
    updateBackgroundColor() {
        this.letterhead.backgroundColor = document.getElementById('backgroundColor').value;
        this.render();
        this.saveState();
    }
    
    /**
     * Update property panel
     */
    updatePropertyPanel() {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement;
        
        if (element.type === 'text') {
            document.getElementById('fontFamily').value = element.fontFamily || 'Arial';
            document.getElementById('fontSize').value = element.fontSize || 16;
            document.getElementById('textColor').value = element.color || '#000000';
        }
        
        if (['rectangle', 'circle'].includes(element.type)) {
            document.getElementById('fillColor').value = element.fillColor || '#3498db';
            document.getElementById('strokeColor').value = element.strokeColor || '#2c3e50';
            document.getElementById('strokeWidth').value = element.strokeWidth || 2;
        }
        
        if (element.type === 'line') {
            document.getElementById('strokeColor').value = element.strokeColor || '#2c3e50';
            document.getElementById('strokeWidth').value = element.strokeWidth || 2;
        }
    }
    
    /**
     * Delete selected element
     */
    deleteSelectedElement() {
        if (!this.selectedElement) return;
        
        const index = this.letterhead.elements.indexOf(this.selectedElement);
        if (index > -1) {
            this.letterhead.elements.splice(index, 1);
            this.selectedElement = null;
            this.render();
            this.saveState();
        }
    }
    
    /**
     * Duplicate selected element
     */
    duplicateSelectedElement() {
        if (!this.selectedElement) return;
        
        const duplicate = JSON.parse(JSON.stringify(this.selectedElement));
        duplicate.x += 20;
        duplicate.y += 20;
        
        this.letterhead.elements.push(duplicate);
        this.selectedElement = duplicate;
        this.render();
        this.saveState();
    }
    
    /**
     * Render letterhead
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set background
        this.ctx.fillStyle = this.letterhead.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render elements
        this.letterhead.elements.forEach(element => {
            this.renderElement(element);
        });
        
        // Render selection
        if (this.selectedElement) {
            this.renderSelection(this.selectedElement);
        }
    }
    
    /**
     * Render element
     */
    renderElement(element) {
        this.ctx.save();
        
        switch (element.type) {
            case 'text':
                this.renderText(element);
                break;
            case 'rectangle':
                this.renderRectangle(element);
                break;
            case 'circle':
                this.renderCircle(element);
                break;
            case 'line':
                this.renderLine(element);
                break;
            case 'image':
                this.renderImage(element);
                break;
        }
        
        this.ctx.restore();
    }
    
    /**
     * Render text
     */
    renderText(element) {
        let font = '';
        
        if (element.bold) font += 'bold ';
        if (element.italic) font += 'italic ';
        font += `${element.fontSize}px ${element.fontFamily}`;
        
        this.ctx.font = font;
        this.ctx.fillStyle = element.color;
        this.ctx.textAlign = element.textAlign || 'left';
        this.ctx.textBaseline = 'alphabetic';
        
        this.ctx.fillText(element.content, element.x, element.y);
        
        if (element.underline) {
            const textWidth = this.ctx.measureText(element.content).width;
            this.ctx.strokeStyle = element.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(element.x, element.y + 2);
            this.ctx.lineTo(element.x + textWidth, element.y + 2);
            this.ctx.stroke();
        }
    }
    
    /**
     * Render rectangle
     */
    renderRectangle(element) {
        // Fill
        if (element.fillColor && element.fillColor !== 'transparent') {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fillRect(element.x, element.y, element.width, element.height);
        }
        
        // Stroke
        if (element.strokeColor && element.strokeColor !== 'transparent' && element.strokeWidth > 0) {
            this.ctx.strokeStyle = element.strokeColor;
            this.ctx.lineWidth = element.strokeWidth;
            this.ctx.strokeRect(element.x, element.y, element.width, element.height);
        }
    }
    
    /**
     * Render circle
     */
    renderCircle(element) {
        this.ctx.beginPath();
        this.ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
        
        // Fill
        if (element.fillColor && element.fillColor !== 'transparent') {
            this.ctx.fillStyle = element.fillColor;
            this.ctx.fill();
        }
        
        // Stroke
        if (element.strokeColor && element.strokeColor !== 'transparent' && element.strokeWidth > 0) {
            this.ctx.strokeStyle = element.strokeColor;
            this.ctx.lineWidth = element.strokeWidth;
            this.ctx.stroke();
        }
    }
    
    /**
     * Render line
     */
    renderLine(element) {
        this.ctx.strokeStyle = element.strokeColor;
        this.ctx.lineWidth = element.strokeWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(element.x1, element.y1);
        this.ctx.lineTo(element.x2, element.y2);
        this.ctx.stroke();
    }
    
    /**
     * Render image
     */
    renderImage(element) {
        if (element.imageData) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, element.x, element.y, element.width, element.height);
            };
            img.src = element.imageData;
        }
    }
    
    /**
     * Render selection
     */
    renderSelection(element) {
        this.ctx.strokeStyle = '#007bff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        let bounds = this.getElementBounds(element);
        
        this.ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
        
        this.ctx.setLineDash([]);
    }
    
    /**
     * Get element bounds
     */
    getElementBounds(element) {
        switch (element.type) {
            case 'text':
                this.ctx.font = `${element.fontSize}px ${element.fontFamily}`;
                const textWidth = this.ctx.measureText(element.content).width;
                return {
                    x: element.x,
                    y: element.y - element.fontSize,
                    width: textWidth,
                    height: element.fontSize
                };
            
            case 'rectangle':
                return {
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height
                };
            
            case 'circle':
                return {
                    x: element.x - element.radius,
                    y: element.y - element.radius,
                    width: element.radius * 2,
                    height: element.radius * 2
                };
            
            case 'line':
                return {
                    x: Math.min(element.x1, element.x2),
                    y: Math.min(element.y1, element.y2),
                    width: Math.abs(element.x2 - element.x1),
                    height: Math.abs(element.y2 - element.y1)
                };
            
            case 'image':
                return {
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height
                };
        }
        
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3);
        this.updateZoom();
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.1);
        this.updateZoom();
    }
    
    /**
     * Fit to screen
     */
    fitToScreen() {
        const container = document.querySelector('.canvas-container');
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 40;
        
        const scaleX = containerWidth / this.letterheadWidth;
        const scaleY = containerHeight / this.letterheadHeight;
        
        this.zoom = Math.min(scaleX, scaleY, 1);
        this.updateZoom();
    }
    
    /**
     * Update zoom
     */
    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoom})`;
        this.canvas.style.transformOrigin = 'top left';
        
        document.getElementById('zoomLevel').textContent = Math.round(this.zoom * 100) + '%';
    }
    
    /**
     * Save state for undo/redo
     */
    saveState() {
        const state = JSON.stringify(this.letterhead);
        
        // Remove future states if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateUndoRedoButtons();
    }
    
    /**
     * Undo
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.letterhead = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }
    
    /**
     * Redo
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.letterhead = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.render();
            this.updateUndoRedoButtons();
        }
    }
    
    /**
     * Update undo/redo buttons
     */
    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.historyIndex <= 0;
        document.getElementById('redoBtn').disabled = this.historyIndex >= this.history.length - 1;
    }
    
    /**
     * New letterhead
     */
    newLetterhead() {
        if (confirm('Create a new letterhead? This will clear the current design.')) {
            this.loadTemplate('blank');
        }
    }
    
    /**
     * Save letterhead
     */
    saveLetterhead() {
        const data = {
            letterhead: this.letterhead,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'letterhead-design.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        this.showNotification('Letterhead saved successfully!', 'success');
    }
    
    /**
     * Load letterhead
     */
    loadLetterhead() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.letterhead) {
                        this.letterhead = data.letterhead;
                        this.selectedElement = null;
                        this.render();
                        this.saveState();
                        this.showNotification('Letterhead loaded successfully!', 'success');
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (error) {
                    this.showNotification('Error loading letterhead: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Export letterhead
     */
    exportLetterhead() {
        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.letterheadWidth;
        exportCanvas.height = this.letterheadHeight;
        const exportCtx = exportCanvas.getContext('2d');
        
        // Temporarily switch context
        const originalCtx = this.ctx;
        this.ctx = exportCtx;
        
        // Render without selection
        const originalSelected = this.selectedElement;
        this.selectedElement = null;
        
        this.render();
        
        // Restore
        this.selectedElement = originalSelected;
        this.ctx = originalCtx;
        
        // Export as PNG
        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'letterhead.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Letterhead exported successfully!', 'success');
        }, 'image/png');
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 4px;
            padding: 12px 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded
if (typeof window !== 'undefined') {
    window.LetterheadCreatorUtility = LetterheadCreatorUtility;
    
    // Global reference for modal callbacks
    window.letterheadCreator = null;
    
    // Set global reference when initialized
    const originalInit = LetterheadCreatorUtility.prototype.init;
    LetterheadCreatorUtility.prototype.init = function(containerId) {
        window.letterheadCreator = this;
        return originalInit.call(this, containerId);
    };
}