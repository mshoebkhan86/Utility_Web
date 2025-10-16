/**
 * Business Card Designer Utility
 * Provides comprehensive business card design functionality including
 * templates, custom design tools, text editing, and export features
 */
class BusinessCardDesignerUtility {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.currentCard = null;
        this.selectedElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.history = [];
        this.historyIndex = -1;
        this.zoom = 1;
        this.cardWidth = 350; // 3.5 inches at 100 DPI
        this.cardHeight = 200; // 2 inches at 100 DPI
        this.templates = this.getDefaultTemplates();
        this.fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'];
        this.colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    }

    init() {
        this.createInterface();
        this.attachEventListeners();
        this.loadTemplate('professional');
    }

    createInterface() {
        const container = document.getElementById('business-card-designer-container');
        if (!container) return;

        container.innerHTML = `
            <div class="business-card-designer-wrapper">
                <div class="designer-header">
                    <h2>💳 Business Card Designer</h2>
                    <div class="header-actions">
                        <button class="action-btn" id="newCardBtn">🆕 New Card</button>
                        <button class="action-btn" id="saveCardBtn">💾 Save</button>
                        <button class="action-btn" id="loadCardBtn">📁 Load</button>
                        <button class="action-btn" id="exportCardBtn">📤 Export</button>
                    </div>
                </div>

                <div class="designer-main">
                    <div class="designer-sidebar">
                        <div class="sidebar-section">
                            <h3>📋 Templates</h3>
                            <div class="template-grid" id="templateGrid">
                                <!-- Templates will be populated here -->
                            </div>
                        </div>

                        <div class="sidebar-section">
                            <h3>🎨 Design Tools</h3>
                            <div class="tool-group">
                                <label>Background Color:</label>
                                <input type="color" id="bgColorPicker" value="#ffffff">
                            </div>
                            <div class="tool-group">
                                <label>Background Image:</label>
                                <input type="file" id="bgImageInput" accept="image/*">
                            </div>
                        </div>

                        <div class="sidebar-section">
                            <h3>📝 Text Tools</h3>
                            <div class="tool-group">
                                <button class="tool-btn" id="addTextBtn">➕ Add Text</button>
                            </div>
                            <div class="tool-group" id="textControls" style="display: none;">
                                <label>Font:</label>
                                <select id="fontSelect">
                                    ${this.fonts.map(font => `<option value="${font}">${font}</option>`).join('')}
                                </select>
                                <label>Size:</label>
                                <input type="range" id="fontSizeSlider" min="8" max="72" value="16">
                                <span id="fontSizeValue">16px</span>
                                <label>Color:</label>
                                <input type="color" id="textColorPicker" value="#000000">
                                <div class="text-style-buttons">
                                    <button class="style-btn" id="boldBtn">B</button>
                                    <button class="style-btn" id="italicBtn">I</button>
                                    <button class="style-btn" id="underlineBtn">U</button>
                                </div>
                                <label>Text:</label>
                                <textarea id="textContent" placeholder="Enter text..."></textarea>
                            </div>
                        </div>

                        <div class="sidebar-section">
                            <h3>🖼️ Image Tools</h3>
                            <div class="tool-group">
                                <button class="tool-btn" id="addImageBtn">🖼️ Add Image</button>
                                <input type="file" id="imageInput" accept="image/*" style="display: none;">
                            </div>
                        </div>

                        <div class="sidebar-section">
                            <h3>📐 Layout</h3>
                            <div class="tool-group">
                                <button class="tool-btn" id="alignLeftBtn">⬅️ Left</button>
                                <button class="tool-btn" id="alignCenterBtn">↔️ Center</button>
                                <button class="tool-btn" id="alignRightBtn">➡️ Right</button>
                            </div>
                            <div class="tool-group">
                                <button class="tool-btn" id="bringForwardBtn">⬆️ Forward</button>
                                <button class="tool-btn" id="sendBackwardBtn">⬇️ Backward</button>
                            </div>
                            <div class="tool-group">
                                <button class="tool-btn" id="deleteElementBtn">🗑️ Delete</button>
                            </div>
                        </div>
                    </div>

                    <div class="designer-canvas-area">
                        <div class="canvas-toolbar">
                            <button class="toolbar-btn" id="undoBtn">↶ Undo</button>
                            <button class="toolbar-btn" id="redoBtn">↷ Redo</button>
                            <div class="zoom-controls">
                                <button class="toolbar-btn" id="zoomOutBtn">🔍-</button>
                                <span id="zoomLevel">100%</span>
                                <button class="toolbar-btn" id="zoomInBtn">🔍+</button>
                            </div>
                        </div>
                        <div class="canvas-container">
                            <canvas id="businessCardCanvas" width="350" height="200"></canvas>
                        </div>
                        <div class="canvas-info">
                            <span>Size: 3.5" × 2" (Standard Business Card)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('businessCardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.populateTemplates();
    }

    getDefaultTemplates() {
        return {
            professional: {
                name: 'Professional',
                backgroundColor: '#ffffff',
                elements: [
                    {
                        type: 'text',
                        content: 'John Doe',
                        x: 20,
                        y: 40,
                        fontSize: 24,
                        fontFamily: 'Arial',
                        color: '#000000',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Senior Developer',
                        x: 20,
                        y: 65,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        color: '#666666'
                    },
                    {
                        type: 'text',
                        content: 'john.doe@company.com',
                        x: 20,
                        y: 120,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000'
                    },
                    {
                        type: 'text',
                        content: '+1 (555) 123-4567',
                        x: 20,
                        y: 140,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#000000'
                    },
                    {
                        type: 'text',
                        content: 'www.company.com',
                        x: 20,
                        y: 160,
                        fontSize: 12,
                        fontFamily: 'Arial',
                        color: '#0066cc'
                    }
                ]
            },
            modern: {
                name: 'Modern',
                backgroundColor: '#2c3e50',
                elements: [
                    {
                        type: 'text',
                        content: 'Jane Smith',
                        x: 30,
                        y: 50,
                        fontSize: 22,
                        fontFamily: 'Helvetica',
                        color: '#ffffff',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Creative Director',
                        x: 30,
                        y: 75,
                        fontSize: 14,
                        fontFamily: 'Helvetica',
                        color: '#ecf0f1'
                    },
                    {
                        type: 'text',
                        content: 'jane@creative.studio',
                        x: 30,
                        y: 130,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        color: '#3498db'
                    },
                    {
                        type: 'text',
                        content: '(555) 987-6543',
                        x: 30,
                        y: 150,
                        fontSize: 12,
                        fontFamily: 'Helvetica',
                        color: '#ffffff'
                    }
                ]
            },
            creative: {
                name: 'Creative',
                backgroundColor: '#f39c12',
                elements: [
                    {
                        type: 'text',
                        content: 'Alex Johnson',
                        x: 25,
                        y: 45,
                        fontSize: 20,
                        fontFamily: 'Trebuchet MS',
                        color: '#ffffff',
                        bold: true
                    },
                    {
                        type: 'text',
                        content: 'Graphic Designer',
                        x: 25,
                        y: 70,
                        fontSize: 14,
                        fontFamily: 'Trebuchet MS',
                        color: '#2c3e50'
                    },
                    {
                        type: 'text',
                        content: '📧 alex@design.co',
                        x: 25,
                        y: 125,
                        fontSize: 11,
                        fontFamily: 'Trebuchet MS',
                        color: '#2c3e50'
                    },
                    {
                        type: 'text',
                        content: '📱 +1-555-DESIGN',
                        x: 25,
                        y: 145,
                        fontSize: 11,
                        fontFamily: 'Trebuchet MS',
                        color: '#2c3e50'
                    },
                    {
                        type: 'text',
                        content: '🌐 designstudio.com',
                        x: 25,
                        y: 165,
                        fontSize: 11,
                        fontFamily: 'Trebuchet MS',
                        color: '#2c3e50'
                    }
                ]
            },
            minimal: {
                name: 'Minimal',
                backgroundColor: '#ffffff',
                elements: [
                    {
                        type: 'text',
                        content: 'Sarah Wilson',
                        x: 175,
                        y: 80,
                        fontSize: 18,
                        fontFamily: 'Georgia',
                        color: '#333333',
                        textAlign: 'center'
                    },
                    {
                        type: 'text',
                        content: 'Consultant',
                        x: 175,
                        y: 105,
                        fontSize: 12,
                        fontFamily: 'Georgia',
                        color: '#666666',
                        textAlign: 'center'
                    },
                    {
                        type: 'text',
                        content: 'sarah.wilson@consulting.com',
                        x: 175,
                        y: 140,
                        fontSize: 10,
                        fontFamily: 'Georgia',
                        color: '#333333',
                        textAlign: 'center'
                    }
                ]
            }
        };
    }

    populateTemplates() {
        const templateGrid = document.getElementById('templateGrid');
        templateGrid.innerHTML = '';

        Object.entries(this.templates).forEach(([key, template]) => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <div class="template-preview">
                    <div class="template-name">${template.name}</div>
                </div>
            `;
            templateCard.addEventListener('click', () => this.loadTemplate(key));
            templateGrid.appendChild(templateCard);
        });
    }

    attachEventListeners() {
        // Header actions
        document.getElementById('newCardBtn').addEventListener('click', () => this.newCard());
        document.getElementById('saveCardBtn').addEventListener('click', () => this.saveCard());
        document.getElementById('loadCardBtn').addEventListener('click', () => this.loadCard());
        document.getElementById('exportCardBtn').addEventListener('click', () => this.exportCard());

        // Design tools
        document.getElementById('bgColorPicker').addEventListener('change', (e) => this.changeBackgroundColor(e.target.value));
        document.getElementById('bgImageInput').addEventListener('change', (e) => this.changeBackgroundImage(e));

        // Text tools
        document.getElementById('addTextBtn').addEventListener('click', () => this.addTextElement());
        document.getElementById('fontSelect').addEventListener('change', () => this.updateSelectedText());
        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            this.updateSelectedText();
        });
        document.getElementById('textColorPicker').addEventListener('change', () => this.updateSelectedText());
        document.getElementById('boldBtn').addEventListener('click', () => this.toggleTextStyle('bold'));
        document.getElementById('italicBtn').addEventListener('click', () => this.toggleTextStyle('italic'));
        document.getElementById('underlineBtn').addEventListener('click', () => this.toggleTextStyle('underline'));
        document.getElementById('textContent').addEventListener('input', () => this.updateSelectedText());

        // Image tools
        document.getElementById('addImageBtn').addEventListener('click', () => document.getElementById('imageInput').click());
        document.getElementById('imageInput').addEventListener('change', (e) => this.addImageElement(e));

        // Layout tools
        document.getElementById('alignLeftBtn').addEventListener('click', () => this.alignElement('left'));
        document.getElementById('alignCenterBtn').addEventListener('click', () => this.alignElement('center'));
        document.getElementById('alignRightBtn').addEventListener('click', () => this.alignElement('right'));
        document.getElementById('bringForwardBtn').addEventListener('click', () => this.bringForward());
        document.getElementById('sendBackwardBtn').addEventListener('click', () => this.sendBackward());
        document.getElementById('deleteElementBtn').addEventListener('click', () => this.deleteElement());

        // Canvas toolbar
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    loadTemplate(templateKey) {
        const template = this.templates[templateKey];
        if (!template) return;

        this.currentCard = {
            backgroundColor: template.backgroundColor,
            backgroundImage: null,
            elements: JSON.parse(JSON.stringify(template.elements))
        };

        this.selectedElement = null;
        this.hideTextControls();
        this.saveToHistory();
        this.render();
        this.showNotification(`Loaded ${template.name} template`, 'success');
    }

    newCard() {
        this.currentCard = {
            backgroundColor: '#ffffff',
            backgroundImage: null,
            elements: []
        };
        this.selectedElement = null;
        this.hideTextControls();
        this.saveToHistory();
        this.render();
        this.showNotification('New card created', 'success');
    }

    render() {
        if (!this.currentCard) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.cardWidth, this.cardHeight);

        // Draw background
        this.ctx.fillStyle = this.currentCard.backgroundColor;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);

        // Draw background image if exists
        if (this.currentCard.backgroundImage) {
            this.ctx.drawImage(this.currentCard.backgroundImage, 0, 0, this.cardWidth, this.cardHeight);
        }

        // Draw elements
        this.currentCard.elements.forEach((element, index) => {
            this.drawElement(element, index === this.selectedElement);
        });
    }

    drawElement(element, isSelected = false) {
        this.ctx.save();

        if (element.type === 'text') {
            this.drawTextElement(element, isSelected);
        } else if (element.type === 'image') {
            this.drawImageElement(element, isSelected);
        }

        this.ctx.restore();
    }

    drawTextElement(element, isSelected) {
        // Set font
        let fontStyle = '';
        if (element.bold) fontStyle += 'bold ';
        if (element.italic) fontStyle += 'italic ';
        this.ctx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;
        this.ctx.fillStyle = element.color;
        this.ctx.textAlign = element.textAlign || 'left';
        this.ctx.textBaseline = 'top';

        // Draw text
        const lines = element.content.split('\n');
        lines.forEach((line, index) => {
            const y = element.y + (index * element.fontSize * 1.2);
            this.ctx.fillText(line, element.x, y);
            
            // Draw underline if needed
            if (element.underline) {
                const textWidth = this.ctx.measureText(line).width;
                this.ctx.beginPath();
                this.ctx.moveTo(element.x, y + element.fontSize);
                this.ctx.lineTo(element.x + textWidth, y + element.fontSize);
                this.ctx.strokeStyle = element.color;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });

        // Draw selection border
        if (isSelected) {
            this.drawSelectionBorder(element);
        }
    }

    drawImageElement(element, isSelected) {
        if (element.image) {
            this.ctx.drawImage(element.image, element.x, element.y, element.width, element.height);
            
            if (isSelected) {
                this.drawSelectionBorder(element);
            }
        }
    }

    drawSelectionBorder(element) {
        const bounds = this.getElementBounds(element);
        this.ctx.strokeStyle = '#007bff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
        this.ctx.setLineDash([]);
    }

    getElementBounds(element) {
        if (element.type === 'text') {
            this.ctx.font = `${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${element.fontSize}px ${element.fontFamily}`;
            const lines = element.content.split('\n');
            const maxWidth = Math.max(...lines.map(line => this.ctx.measureText(line).width));
            const height = lines.length * element.fontSize * 1.2;
            return {
                x: element.x,
                y: element.y,
                width: maxWidth,
                height: height
            };
        } else if (element.type === 'image') {
            return {
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height
            };
        }
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked element
        let clickedElement = -1;
        for (let i = this.currentCard.elements.length - 1; i >= 0; i--) {
            const bounds = this.getElementBounds(this.currentCard.elements[i]);
            if (x >= bounds.x && x <= bounds.x + bounds.width &&
                y >= bounds.y && y <= bounds.y + bounds.height) {
                clickedElement = i;
                break;
            }
        }

        if (clickedElement !== -1) {
            this.selectElement(clickedElement);
        } else {
            this.deselectElement();
        }
    }

    selectElement(index) {
        this.selectedElement = index;
        const element = this.currentCard.elements[index];
        
        if (element.type === 'text') {
            this.showTextControls(element);
        } else {
            this.hideTextControls();
        }
        
        this.render();
    }

    deselectElement() {
        this.selectedElement = null;
        this.hideTextControls();
        this.render();
    }

    showTextControls(element) {
        const controls = document.getElementById('textControls');
        controls.style.display = 'block';
        
        // Populate controls with element values
        document.getElementById('fontSelect').value = element.fontFamily;
        document.getElementById('fontSizeSlider').value = element.fontSize;
        document.getElementById('fontSizeValue').textContent = element.fontSize + 'px';
        document.getElementById('textColorPicker').value = element.color;
        document.getElementById('textContent').value = element.content;
        
        // Update style buttons
        document.getElementById('boldBtn').classList.toggle('active', element.bold);
        document.getElementById('italicBtn').classList.toggle('active', element.italic);
        document.getElementById('underlineBtn').classList.toggle('active', element.underline);
    }

    hideTextControls() {
        document.getElementById('textControls').style.display = 'none';
    }

    addTextElement() {
        const newText = {
            type: 'text',
            content: 'New Text',
            x: 50,
            y: 50,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#000000',
            bold: false,
            italic: false,
            underline: false
        };
        
        this.currentCard.elements.push(newText);
        this.selectElement(this.currentCard.elements.length - 1);
        this.saveToHistory();
        this.render();
        this.showNotification('Text element added', 'success');
    }

    updateSelectedText() {
        if (this.selectedElement === null) return;
        
        const element = this.currentCard.elements[this.selectedElement];
        if (element.type !== 'text') return;
        
        element.fontFamily = document.getElementById('fontSelect').value;
        element.fontSize = parseInt(document.getElementById('fontSizeSlider').value);
        element.color = document.getElementById('textColorPicker').value;
        element.content = document.getElementById('textContent').value;
        
        this.render();
    }

    toggleTextStyle(style) {
        if (this.selectedElement === null) return;
        
        const element = this.currentCard.elements[this.selectedElement];
        if (element.type !== 'text') return;
        
        element[style] = !element[style];
        
        // Update button state
        const btn = document.getElementById(style + 'Btn');
        btn.classList.toggle('active', element[style]);
        
        this.render();
        this.saveToHistory();
    }

    addImageElement(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 100;
                const maxHeight = 100;
                let width = img.width;
                let height = img.height;
                
                // Scale image to fit
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                const newImage = {
                    type: 'image',
                    image: img,
                    x: 50,
                    y: 50,
                    width: width,
                    height: height
                };
                
                this.currentCard.elements.push(newImage);
                this.selectElement(this.currentCard.elements.length - 1);
                this.saveToHistory();
                this.render();
                this.showNotification('Image added', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    changeBackgroundColor(color) {
        this.currentCard.backgroundColor = color;
        this.render();
        this.saveToHistory();
    }

    changeBackgroundImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.currentCard.backgroundImage = img;
                this.render();
                this.saveToHistory();
                this.showNotification('Background image updated', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    alignElement(alignment) {
        if (this.selectedElement === null) return;
        
        const element = this.currentCard.elements[this.selectedElement];
        const bounds = this.getElementBounds(element);
        
        switch (alignment) {
            case 'left':
                element.x = 10;
                break;
            case 'center':
                element.x = (this.cardWidth - bounds.width) / 2;
                break;
            case 'right':
                element.x = this.cardWidth - bounds.width - 10;
                break;
        }
        
        this.render();
        this.saveToHistory();
    }

    bringForward() {
        if (this.selectedElement === null || this.selectedElement >= this.currentCard.elements.length - 1) return;
        
        const element = this.currentCard.elements[this.selectedElement];
        this.currentCard.elements.splice(this.selectedElement, 1);
        this.currentCard.elements.splice(this.selectedElement + 1, 0, element);
        this.selectedElement++;
        
        this.render();
        this.saveToHistory();
    }

    sendBackward() {
        if (this.selectedElement === null || this.selectedElement <= 0) return;
        
        const element = this.currentCard.elements[this.selectedElement];
        this.currentCard.elements.splice(this.selectedElement, 1);
        this.currentCard.elements.splice(this.selectedElement - 1, 0, element);
        this.selectedElement--;
        
        this.render();
        this.saveToHistory();
    }

    deleteElement() {
        if (this.selectedElement === null) return;
        
        this.currentCard.elements.splice(this.selectedElement, 1);
        this.deselectElement();
        this.render();
        this.saveToHistory();
        this.showNotification('Element deleted', 'info');
    }

    handleMouseDown(e) {
        if (this.selectedElement === null) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const element = this.currentCard.elements[this.selectedElement];
        const bounds = this.getElementBounds(element);
        
        if (x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height) {
            this.isDragging = true;
            this.dragOffset = {
                x: x - element.x,
                y: y - element.y
            };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const element = this.currentCard.elements[this.selectedElement];
        element.x = x - this.dragOffset.x;
        element.y = y - this.dragOffset.y;
        
        // Keep element within bounds
        element.x = Math.max(0, Math.min(element.x, this.cardWidth - 10));
        element.y = Math.max(0, Math.min(element.y, this.cardHeight - 10));
        
        this.render();
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'default';
            this.saveToHistory();
        }
    }

    handleKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key) {
            case 'Delete':
            case 'Backspace':
                this.deleteElement();
                break;
            case 'z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.undo();
                }
                break;
            case 'y':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.redo();
                }
                break;
        }
    }

    saveToHistory() {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        this.history.push(JSON.parse(JSON.stringify(this.currentCard)));
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentCard = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.deselectElement();
            this.render();
            this.showNotification('Undone', 'info');
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentCard = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.deselectElement();
            this.render();
            this.showNotification('Redone', 'info');
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3);
        this.updateZoom();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.5);
        this.updateZoom();
    }

    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoom})`;
        document.getElementById('zoomLevel').textContent = Math.round(this.zoom * 100) + '%';
    }

    saveCard() {
        const cardData = JSON.stringify(this.currentCard);
        const blob = new Blob([cardData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-card.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Card saved', 'success');
    }

    loadCard() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.currentCard = JSON.parse(event.target.result);
                    this.deselectElement();
                    this.saveToHistory();
                    this.render();
                    this.showNotification('Card loaded', 'success');
                } catch (error) {
                    this.showNotification('Error loading card', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    exportCard() {
        // Create a high-resolution canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        const scale = 3; // 300 DPI
        
        exportCanvas.width = this.cardWidth * scale;
        exportCanvas.height = this.cardHeight * scale;
        exportCtx.scale(scale, scale);
        
        // Draw background
        exportCtx.fillStyle = this.currentCard.backgroundColor;
        exportCtx.fillRect(0, 0, this.cardWidth, this.cardHeight);
        
        // Draw background image if exists
        if (this.currentCard.backgroundImage) {
            exportCtx.drawImage(this.currentCard.backgroundImage, 0, 0, this.cardWidth, this.cardHeight);
        }
        
        // Draw elements
        this.currentCard.elements.forEach(element => {
            if (element.type === 'text') {
                let fontStyle = '';
                if (element.bold) fontStyle += 'bold ';
                if (element.italic) fontStyle += 'italic ';
                exportCtx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;
                exportCtx.fillStyle = element.color;
                exportCtx.textAlign = element.textAlign || 'left';
                exportCtx.textBaseline = 'top';
                
                const lines = element.content.split('\n');
                lines.forEach((line, index) => {
                    const y = element.y + (index * element.fontSize * 1.2);
                    exportCtx.fillText(line, element.x, y);
                    
                    if (element.underline) {
                        const textWidth = exportCtx.measureText(line).width;
                        exportCtx.beginPath();
                        exportCtx.moveTo(element.x, y + element.fontSize);
                        exportCtx.lineTo(element.x + textWidth, y + element.fontSize);
                        exportCtx.strokeStyle = element.color;
                        exportCtx.lineWidth = 1;
                        exportCtx.stroke();
                    }
                });
            } else if (element.type === 'image' && element.image) {
                exportCtx.drawImage(element.image, element.x, element.y, element.width, element.height);
            }
        });
        
        // Download the image
        exportCanvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'business-card.png';
            a.click();
            URL.revokeObjectURL(url);
            this.showNotification('Card exported', 'success');
        }, 'image/png');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BusinessCardDesignerUtility;
}