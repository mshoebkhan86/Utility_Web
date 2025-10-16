/**
 * Logo Maker Utility
 * Professional logo design tool with templates and export options
 */
class LogoMakerUtility {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.selectedElement = null;
        this.currentTool = 'select';
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        // Logo dimensions
        this.logoWidth = 400;
        this.logoHeight = 400;
        
        // Current logo data
        this.logo = {
            elements: [],
            backgroundColor: '#ffffff',
            name: 'Untitled Logo'
        };
        
        // Available fonts
        this.fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Impact', 'Roboto'];
        
        // Color palette
        this.colors = [
            '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'
        ];
        
        // Templates
        this.templates = {
            blank: { name: 'Blank', elements: [] },
            text: {
                name: 'Text Logo',
                elements: [{
                    type: 'text',
                    content: 'Your Logo',
                    x: 200, y: 200,
                    fontSize: 32,
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: 'bold'
                }]
            },
            badge: {
                name: 'Badge',
                elements: [{
                    type: 'circle',
                    x: 200, y: 200,
                    radius: 80,
                    fillColor: '#1f77b4',
                    strokeColor: '#ffffff',
                    strokeWidth: 3
                }, {
                    type: 'text',
                    content: 'LOGO',
                    x: 200, y: 200,
                    fontSize: 24,
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontWeight: 'bold'
                }]
            }
        };
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Logo Maker container not found');
            return;
        }

        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        this.loadTemplate('blank');
        this.render();
        this.showNotification('Logo Maker ready! Start creating your logo.', 'success');
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="logo-maker">
                <div class="maker-header">
                    <div class="header-left">
                        <h1><i class="fas fa-palette"></i> Logo Maker</h1>
                        <input type="text" id="logoName" value="${this.logo.name}" placeholder="Logo Name">
                    </div>
                    <div class="header-right">
                        <button class="btn btn-secondary" onclick="window.logoMaker.newLogo()">
                            <i class="fas fa-file"></i> New
                        </button>
                        <button class="btn btn-primary" onclick="window.logoMaker.exportLogo()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                
                <div class="maker-content">
                    <div class="maker-sidebar">
                        <div class="sidebar-section">
                            <h3>Templates</h3>
                            <div class="template-grid">
                                ${Object.keys(this.templates).map(key => `
                                    <div class="template-item" data-template="${key}">
                                        <div class="template-preview"></div>
                                        <span>${this.templates[key].name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Tools</h3>
                            <div class="tool-buttons">
                                <button class="tool-btn active" data-tool="select">
                                    <i class="fas fa-mouse-pointer"></i> Select
                                </button>
                                <button class="tool-btn" data-tool="text">
                                    <i class="fas fa-font"></i> Text
                                </button>
                                <button class="tool-btn" data-tool="circle">
                                    <i class="fas fa-circle"></i> Circle
                                </button>
                                <button class="tool-btn" data-tool="rectangle">
                                    <i class="fas fa-square"></i> Rectangle
                                </button>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Colors</h3>
                            <div class="color-palette">
                                ${this.colors.map(color => 
                                    `<div class="color-item" style="background: ${color}" data-color="${color}"></div>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Properties</h3>
                            <div id="propertiesPanel">
                                <p class="no-selection">Select an element to edit properties</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="maker-main">
                        <div class="canvas-toolbar">
                            <button class="btn btn-sm" onclick="window.logoMaker.undo()" title="Undo">
                                <i class="fas fa-undo"></i>
                            </button>
                            <button class="btn btn-sm" onclick="window.logoMaker.redo()" title="Redo">
                                <i class="fas fa-redo"></i>
                            </button>
                            <div class="separator"></div>
                            <button class="btn btn-sm" onclick="window.logoMaker.deleteElement()" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                            <div class="zoom-controls">
                                <button class="btn btn-sm" onclick="window.logoMaker.zoomOut()">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <span class="zoom-level">${Math.round(this.zoom * 100)}%</span>
                                <button class="btn btn-sm" onclick="window.logoMaker.zoomIn()">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="canvas-container">
                            <canvas id="logoCanvas" width="${this.logoWidth}" height="${this.logoHeight}"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="status-bar">
                    <span id="statusMessage">Ready</span>
                    <span id="elementCount">0 elements</span>
                </div>
                
                <div class="notification" id="notification"></div>
            </div>
        `;

        this.canvas = document.getElementById('logoCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
    }

    attachEventListeners() {
        // Template selection
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.template-item')) {
                const template = e.target.closest('.template-item').dataset.template;
                this.loadTemplate(template);
            }
        });

        // Tool selection
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.tool-btn')) {
                const tool = e.target.closest('.tool-btn').dataset.tool;
                this.selectTool(tool);
            }
        });

        // Color selection
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-item')) {
                const color = e.target.dataset.color;
                this.applyColor(color);
            }
        });

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        // Logo name change
        const logoNameInput = document.getElementById('logoName');
        if (logoNameInput) {
            logoNameInput.addEventListener('change', (e) => {
                this.logo.name = e.target.value;
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            } else if (e.key === 'Delete') {
                this.deleteElement();
            }
        });
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        this.container.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.container.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        this.showStatus(`${tool} tool selected`);
    }

    loadTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;
        
        this.logo.elements = JSON.parse(JSON.stringify(template.elements));
        this.selectedElement = null;
        this.render();
        this.updateElementCount();
        this.saveState();
        this.showNotification(`Template "${template.name}" loaded`, 'success');
    }

    onCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;

        if (this.currentTool === 'select') {
            this.selectElementAt(x, y);
        } else if (this.currentTool === 'text') {
            this.addText(x, y);
        } else if (this.currentTool === 'circle') {
            this.addCircle(x, y);
        } else if (this.currentTool === 'rectangle') {
            this.addRectangle(x, y);
        }
    }

    onCanvasMouseDown(e) {
        if (this.currentTool !== 'select') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        const element = this.getElementAt(x, y);
        if (element) {
            this.selectedElement = element;
            this.isDragging = true;
            this.dragOffset = { x: x - element.x, y: y - element.y };
            this.updatePropertyPanel();
        }
    }

    onCanvasMouseMove(e) {
        if (!this.isDragging || !this.selectedElement) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        
        this.selectedElement.x = x - this.dragOffset.x;
        this.selectedElement.y = y - this.dragOffset.y;
        
        this.render();
    }

    onCanvasMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.saveState();
        }
    }

    addText(x, y) {
        const element = {
            type: 'text',
            content: 'Text',
            x: x,
            y: y,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#000000',
            fontWeight: 'normal'
        };
        
        this.logo.elements.push(element);
        this.selectedElement = element;
        this.render();
        this.updateElementCount();
        this.updatePropertyPanel();
        this.saveState();
    }

    addCircle(x, y) {
        const element = {
            type: 'circle',
            x: x,
            y: y,
            radius: 30,
            fillColor: '#1f77b4',
            strokeColor: '#000000',
            strokeWidth: 2
        };
        
        this.logo.elements.push(element);
        this.selectedElement = element;
        this.render();
        this.updateElementCount();
        this.updatePropertyPanel();
        this.saveState();
    }

    addRectangle(x, y) {
        const element = {
            type: 'rectangle',
            x: x - 25,
            y: y - 25,
            width: 50,
            height: 50,
            fillColor: '#ff7f0e',
            strokeColor: '#000000',
            strokeWidth: 2
        };
        
        this.logo.elements.push(element);
        this.selectedElement = element;
        this.render();
        this.updateElementCount();
        this.updatePropertyPanel();
        this.saveState();
    }

    selectElementAt(x, y) {
        this.selectedElement = this.getElementAt(x, y);
        this.updatePropertyPanel();
        this.render();
    }

    getElementAt(x, y) {
        for (let i = this.logo.elements.length - 1; i >= 0; i--) {
            const element = this.logo.elements[i];
            
            if (element.type === 'text') {
                this.ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
                const metrics = this.ctx.measureText(element.content);
                const textWidth = metrics.width;
                const textHeight = element.fontSize;
                
                if (x >= element.x - textWidth/2 && x <= element.x + textWidth/2 &&
                    y >= element.y - textHeight/2 && y <= element.y + textHeight/2) {
                    return element;
                }
            } else if (element.type === 'circle') {
                const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
                if (distance <= element.radius) {
                    return element;
                }
            } else if (element.type === 'rectangle') {
                if (x >= element.x && x <= element.x + element.width &&
                    y >= element.y && y <= element.y + element.height) {
                    return element;
                }
            }
        }
        return null;
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.logoWidth, this.logoHeight);
        
        // Draw background
        if (this.logo.backgroundColor !== 'transparent') {
            this.ctx.fillStyle = this.logo.backgroundColor;
            this.ctx.fillRect(0, 0, this.logoWidth, this.logoHeight);
        }
        
        // Draw elements
        this.logo.elements.forEach(element => {
            this.drawElement(element);
        });
        
        // Draw selection
        if (this.selectedElement) {
            this.drawSelection(this.selectedElement);
        }
    }

    drawElement(element) {
        this.ctx.save();
        
        if (element.type === 'text') {
            this.ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
            this.ctx.fillStyle = element.color;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(element.content, element.x, element.y);
        } else if (element.type === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
            
            if (element.fillColor) {
                this.ctx.fillStyle = element.fillColor;
                this.ctx.fill();
            }
            
            if (element.strokeColor && element.strokeWidth > 0) {
                this.ctx.strokeStyle = element.strokeColor;
                this.ctx.lineWidth = element.strokeWidth;
                this.ctx.stroke();
            }
        } else if (element.type === 'rectangle') {
            if (element.fillColor) {
                this.ctx.fillStyle = element.fillColor;
                this.ctx.fillRect(element.x, element.y, element.width, element.height);
            }
            
            if (element.strokeColor && element.strokeWidth > 0) {
                this.ctx.strokeStyle = element.strokeColor;
                this.ctx.lineWidth = element.strokeWidth;
                this.ctx.strokeRect(element.x, element.y, element.width, element.height);
            }
        }
        
        this.ctx.restore();
    }

    drawSelection(element) {
        this.ctx.save();
        this.ctx.strokeStyle = '#007bff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        if (element.type === 'text') {
            this.ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
            const metrics = this.ctx.measureText(element.content);
            const textWidth = metrics.width;
            const textHeight = element.fontSize;
            
            this.ctx.strokeRect(
                element.x - textWidth/2 - 5,
                element.y - textHeight/2 - 5,
                textWidth + 10,
                textHeight + 10
            );
        } else if (element.type === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.radius + 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        } else if (element.type === 'rectangle') {
            this.ctx.strokeRect(
                element.x - 5,
                element.y - 5,
                element.width + 10,
                element.height + 10
            );
        }
        
        this.ctx.restore();
    }

    updatePropertyPanel() {
        const panel = document.getElementById('propertiesPanel');
        if (!this.selectedElement) {
            panel.innerHTML = '<p class="no-selection">Select an element to edit properties</p>';
            return;
        }
        
        const element = this.selectedElement;
        let html = '';
        
        if (element.type === 'text') {
            html = `
                <div class="property-group">
                    <label>Text:</label>
                    <input type="text" id="textContent" value="${element.content}">
                </div>
                <div class="property-group">
                    <label>Font Size:</label>
                    <input type="number" id="fontSize" value="${element.fontSize}" min="8" max="72">
                </div>
                <div class="property-group">
                    <label>Font:</label>
                    <select id="fontFamily">
                        ${this.fonts.map(font => 
                            `<option value="${font}" ${font === element.fontFamily ? 'selected' : ''}>${font}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="property-group">
                    <label>Color:</label>
                    <input type="color" id="textColor" value="${element.color}">
                </div>
            `;
        } else if (element.type === 'circle') {
            html = `
                <div class="property-group">
                    <label>Radius:</label>
                    <input type="number" id="circleRadius" value="${element.radius}" min="5" max="150">
                </div>
                <div class="property-group">
                    <label>Fill Color:</label>
                    <input type="color" id="fillColor" value="${element.fillColor}">
                </div>
                <div class="property-group">
                    <label>Stroke Color:</label>
                    <input type="color" id="strokeColor" value="${element.strokeColor}">
                </div>
                <div class="property-group">
                    <label>Stroke Width:</label>
                    <input type="number" id="strokeWidth" value="${element.strokeWidth}" min="0" max="10">
                </div>
            `;
        } else if (element.type === 'rectangle') {
            html = `
                <div class="property-group">
                    <label>Width:</label>
                    <input type="number" id="rectWidth" value="${element.width}" min="10" max="300">
                </div>
                <div class="property-group">
                    <label>Height:</label>
                    <input type="number" id="rectHeight" value="${element.height}" min="10" max="300">
                </div>
                <div class="property-group">
                    <label>Fill Color:</label>
                    <input type="color" id="fillColor" value="${element.fillColor}">
                </div>
                <div class="property-group">
                    <label>Stroke Color:</label>
                    <input type="color" id="strokeColor" value="${element.strokeColor}">
                </div>
                <div class="property-group">
                    <label>Stroke Width:</label>
                    <input type="number" id="strokeWidth" value="${element.strokeWidth}" min="0" max="10">
                </div>
            `;
        }
        
        panel.innerHTML = html;
        
        // Attach property change listeners
        this.attachPropertyListeners();
    }

    attachPropertyListeners() {
        const panel = document.getElementById('propertiesPanel');
        
        panel.addEventListener('input', (e) => {
            if (!this.selectedElement) return;
            
            const element = this.selectedElement;
            
            switch (e.target.id) {
                case 'textContent':
                    element.content = e.target.value;
                    break;
                case 'fontSize':
                    element.fontSize = parseInt(e.target.value);
                    break;
                case 'fontFamily':
                    element.fontFamily = e.target.value;
                    break;
                case 'textColor':
                    element.color = e.target.value;
                    break;
                case 'circleRadius':
                    element.radius = parseInt(e.target.value);
                    break;
                case 'rectWidth':
                    element.width = parseInt(e.target.value);
                    break;
                case 'rectHeight':
                    element.height = parseInt(e.target.value);
                    break;
                case 'fillColor':
                    element.fillColor = e.target.value;
                    break;
                case 'strokeColor':
                    element.strokeColor = e.target.value;
                    break;
                case 'strokeWidth':
                    element.strokeWidth = parseInt(e.target.value);
                    break;
            }
            
            this.render();
        });
        
        panel.addEventListener('change', () => {
            this.saveState();
        });
    }

    applyColor(color) {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement;
        
        if (element.type === 'text') {
            element.color = color;
        } else {
            element.fillColor = color;
        }
        
        this.render();
        this.updatePropertyPanel();
        this.saveState();
    }

    deleteElement() {
        if (!this.selectedElement) return;
        
        const index = this.logo.elements.indexOf(this.selectedElement);
        if (index > -1) {
            this.logo.elements.splice(index, 1);
            this.selectedElement = null;
            this.render();
            this.updateElementCount();
            this.updatePropertyPanel();
            this.saveState();
            this.showNotification('Element deleted', 'info');
        }
    }

    newLogo() {
        this.logo.elements = [];
        this.logo.name = 'Untitled Logo';
        this.selectedElement = null;
        document.getElementById('logoName').value = this.logo.name;
        this.render();
        this.updateElementCount();
        this.updatePropertyPanel();
        this.saveState();
        this.showNotification('New logo created', 'success');
    }

    exportLogo() {
        const link = document.createElement('a');
        link.download = `${this.logo.name}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        this.showNotification('Logo exported successfully', 'success');
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3);
        this.updateZoomDisplay();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.5);
        this.updateZoomDisplay();
    }

    updateZoomDisplay() {
        const zoomLevel = this.container.querySelector('.zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(this.zoom * 100)}%`;
        }
        
        this.canvas.style.transform = `scale(${this.zoom})`;
        this.canvas.style.transformOrigin = 'top left';
    }

    saveState() {
        const state = JSON.stringify(this.logo);
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.logo = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.render();
            this.updateElementCount();
            this.updatePropertyPanel();
            this.showNotification('Undo', 'info');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.logo = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.render();
            this.updateElementCount();
            this.updatePropertyPanel();
            this.showNotification('Redo', 'info');
        }
    }

    updateElementCount() {
        const counter = document.getElementById('elementCount');
        if (counter) {
            counter.textContent = `${this.logo.elements.length} elements`;
        }
    }

    showStatus(message) {
        const status = document.getElementById('statusMessage');
        if (status) {
            status.textContent = message;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    addStyles() {
        if (document.getElementById('logoMakerStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'logoMakerStyles';
        styles.textContent = `
            .logo-maker {
                display: flex;
                flex-direction: column;
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f8f9fa;
            }
            
            .maker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background: white;
                border-bottom: 1px solid #e9ecef;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .maker-header h1 {
                margin: 0;
                font-size: 1.5rem;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .header-left {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            #logoName {
                padding: 0.5rem;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 0.9rem;
            }
            
            .maker-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .maker-sidebar {
                width: 280px;
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
                font-size: 1rem;
                color: #495057;
                font-weight: 600;
            }
            
            .template-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }
            
            .template-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .template-item:hover {
                border-color: #007bff;
                background: #f8f9ff;
            }
            
            .template-preview {
                width: 40px;
                height: 40px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                margin-bottom: 0.5rem;
            }
            
            .template-item span {
                font-size: 0.8rem;
                color: #6c757d;
                text-align: center;
            }
            
            .tool-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }
            
            .tool-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.8rem;
                color: #495057;
            }
            
            .tool-btn:hover {
                border-color: #007bff;
                background: #f8f9ff;
            }
            
            .tool-btn.active {
                border-color: #007bff;
                background: #007bff;
                color: white;
            }
            
            .tool-btn i {
                font-size: 1.2rem;
                margin-bottom: 0.25rem;
            }
            
            .color-palette {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 0.25rem;
            }
            
            .color-item {
                width: 30px;
                height: 30px;
                border-radius: 4px;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 0 0 1px #dee2e6;
                transition: transform 0.2s;
            }
            
            .color-item:hover {
                transform: scale(1.1);
                box-shadow: 0 0 0 2px #007bff;
            }
            
            .property-group {
                margin-bottom: 1rem;
            }
            
            .property-group label {
                display: block;
                margin-bottom: 0.25rem;
                font-size: 0.9rem;
                font-weight: 500;
                color: #495057;
            }
            
            .property-group input,
            .property-group select {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 0.9rem;
            }
            
            .no-selection {
                color: #6c757d;
                font-style: italic;
                text-align: center;
                margin: 2rem 0;
            }
            
            .maker-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: #f8f9fa;
            }
            
            .canvas-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 1rem;
                background: white;
                border-bottom: 1px solid #e9ecef;
            }
            
            .zoom-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .zoom-level {
                min-width: 50px;
                text-align: center;
                font-size: 0.9rem;
                color: #495057;
            }
            
            .separator {
                width: 1px;
                height: 20px;
                background: #dee2e6;
                margin: 0 0.5rem;
            }
            
            .canvas-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                overflow: auto;
            }
            
            #logoCanvas {
                border: 1px solid #dee2e6;
                border-radius: 8px;
                background: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                cursor: crosshair;
            }
            
            .status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 1rem;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                font-size: 0.8rem;
                color: #6c757d;
            }
            
            .btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-primary {
                background: #007bff;
                color: white;
            }
            
            .btn-primary:hover {
                background: #0056b3;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #545b62;
            }
            
            .btn-sm {
                padding: 0.375rem 0.75rem;
                font-size: 0.8rem;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                transform: translateX(100%);
                transition: transform 0.3s;
                z-index: 1000;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                background: #28a745;
            }
            
            .notification.info {
                background: #17a2b8;
            }
            
            .notification.warning {
                background: #ffc107;
                color: #212529;
            }
            
            .notification.error {
                background: #dc3545;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Global instance
window.logoMaker = null;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('logoMakerContainer');
    if (container) {
        window.logoMaker = new LogoMakerUtility();
        window.logoMaker.init('logoMakerContainer');
    }
});