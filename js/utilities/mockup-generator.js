// Mockup Generator Utility
class MockupGeneratorUtility {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.selectedDevice = 'iphone14';
        this.uploadedImage = null;
        this.imagePosition = { x: 0, y: 0 };
        this.imageScale = 1;
        this.imageRotation = 0;
        this.background = { type: 'color', value: '#f0f0f0' };
        this.textOverlay = { text: '', x: 50, y: 50, size: 16, color: '#000000', font: 'Arial' };
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        // Device templates with accurate dimensions
        this.devices = {
            iphone14: {
                name: 'iPhone 14',
                category: 'mobile',
                width: 390,
                height: 844,
                screenX: 20,
                screenY: 60,
                screenWidth: 350,
                screenHeight: 724,
                bezelColor: '#1a1a1a',
                hasNotch: true
            },
            iphone14pro: {
                name: 'iPhone 14 Pro',
                category: 'mobile',
                width: 393,
                height: 852,
                screenX: 20,
                screenY: 60,
                screenWidth: 353,
                screenHeight: 732,
                bezelColor: '#2a2a2a',
                hasNotch: true
            },
            ipadpro: {
                name: 'iPad Pro',
                category: 'tablet',
                width: 834,
                height: 1194,
                screenX: 40,
                screenY: 80,
                screenWidth: 754,
                screenHeight: 1034,
                bezelColor: '#e0e0e0',
                hasNotch: false
            },
            macbookpro: {
                name: 'MacBook Pro',
                category: 'laptop',
                width: 1200,
                height: 800,
                screenX: 100,
                screenY: 50,
                screenWidth: 1000,
                screenHeight: 625,
                bezelColor: '#2a2a2a',
                hasKeyboard: true
            },
            imac: {
                name: 'iMac',
                category: 'desktop',
                width: 1200,
                height: 900,
                screenX: 100,
                screenY: 80,
                screenWidth: 1000,
                screenHeight: 625,
                bezelColor: '#e0e0e0',
                hasStand: true
            },
            android: {
                name: 'Android Phone',
                category: 'mobile',
                width: 360,
                height: 800,
                screenX: 15,
                screenY: 50,
                screenWidth: 330,
                screenHeight: 700,
                bezelColor: '#333333',
                hasNotch: false
            },
            samsungtab: {
                name: 'Samsung Tablet',
                category: 'tablet',
                width: 800,
                height: 1200,
                screenX: 35,
                screenY: 70,
                screenWidth: 730,
                screenHeight: 1060,
                bezelColor: '#1a1a1a',
                hasNotch: false
            }
        };
        
        this.backgroundOptions = {
            colors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#333333', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
            gradients: [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            ]
        };
    }
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.createInterface();
        this.attachEventListeners();
        this.applyStyles();
        this.renderMockup();
        this.saveState();
        this.showStatus('Mockup Generator initialized');
    }
    
    createInterface() {
        this.container.innerHTML = `
            <div class="mockup-generator">
                <div class="mockup-header">
                    <div class="mockup-logo">
                        <span class="mockup-icon">📱</span>
                        <h2>Mockup Generator</h2>
                    </div>
                    <div class="mockup-actions">
                        <button class="btn-primary" onclick="mockupGenerator.newMockup()">New</button>
                        <button class="btn-secondary" onclick="mockupGenerator.exportMockup()">Export PNG</button>
                    </div>
                </div>
                
                <div class="mockup-content">
                    <div class="mockup-sidebar">
                        <div class="sidebar-section">
                            <h3>Devices</h3>
                            <div class="device-filter">
                                <button class="filter-btn active" data-filter="all">All</button>
                                <button class="filter-btn" data-filter="mobile">Mobile</button>
                                <button class="filter-btn" data-filter="tablet">Tablet</button>
                                <button class="filter-btn" data-filter="laptop">Laptop</button>
                                <button class="filter-btn" data-filter="desktop">Desktop</button>
                            </div>
                            <div class="device-grid" id="deviceGrid"></div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Background</h3>
                            <div class="background-types">
                                <button class="bg-type-btn active" data-type="color">Color</button>
                                <button class="bg-type-btn" data-type="gradient">Gradient</button>
                                <button class="bg-type-btn" data-type="image">Image</button>
                            </div>
                            <div class="background-options" id="backgroundOptions"></div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Image Upload</h3>
                            <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                            <button class="btn-secondary" onclick="document.getElementById('imageUpload').click()">Upload Image</button>
                            <div class="image-controls" id="imageControls" style="display: none;">
                                <label>Position X: <input type="range" id="positionX" min="-200" max="200" value="0"></label>
                                <label>Position Y: <input type="range" id="positionY" min="-200" max="200" value="0"></label>
                                <label>Scale: <input type="range" id="imageScale" min="0.1" max="3" step="0.1" value="1"></label>
                                <label>Rotation: <input type="range" id="imageRotation" min="0" max="360" value="0"></label>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Text Overlay</h3>
                            <input type="text" id="textInput" placeholder="Enter text..." value="">
                            <label>Font Size: <input type="range" id="textSize" min="8" max="72" value="16"></label>
                            <label>Color: <input type="color" id="textColor" value="#000000"></label>
                            <select id="textFont">
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mockup-main">
                        <div class="mockup-toolbar">
                            <button onclick="mockupGenerator.undo()" title="Undo">↶</button>
                            <button onclick="mockupGenerator.redo()" title="Redo">↷</button>
                            <span class="separator">|</span>
                            <button onclick="mockupGenerator.zoomOut()" title="Zoom Out">-</button>
                            <span class="zoom-level" id="zoomLevel">100%</span>
                            <button onclick="mockupGenerator.zoomIn()" title="Zoom In">+</button>
                            <button onclick="mockupGenerator.fitToScreen()" title="Fit to Screen">⌂</button>
                            <span class="separator">|</span>
                            <span class="device-info" id="deviceInfo">iPhone 14</span>
                        </div>
                        
                        <div class="canvas-container">
                            <canvas id="mockupCanvas" width="800" height="600"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="mockup-status">
                    <span id="statusText">Ready</span>
                    <span class="element-count" id="elementCount">Device: iPhone 14</span>
                </div>
                
                <div class="notification" id="notification"></div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Device selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('device-item')) {
                this.selectDevice(e.target.dataset.device);
            }
            if (e.target.classList.contains('filter-btn')) {
                this.filterDevices(e.target.dataset.filter);
            }
            if (e.target.classList.contains('bg-type-btn')) {
                this.showBackgroundOptions(e.target.dataset.type);
            }
            if (e.target.classList.contains('bg-option')) {
                this.setBackground(e.target.dataset.type, e.target.dataset.value);
            }
        });
        
        // Image upload
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => this.loadImage(e.target.files[0]));
        }
        
        // Image controls
        ['positionX', 'positionY', 'imageScale', 'imageRotation'].forEach(id => {
            const control = document.getElementById(id);
            if (control) {
                control.addEventListener('input', () => this.updateImagePosition());
            }
        });
        
        // Text controls
        ['textInput', 'textSize', 'textColor', 'textFont'].forEach(id => {
            const control = document.getElementById(id);
            if (control) {
                control.addEventListener('input', () => this.updateTextOverlay());
            }
        });
        
        // Canvas setup
        this.canvas = document.getElementById('mockupCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
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
                        this.newMockup();
                        break;
                    case 's':
                        e.preventDefault();
                        this.exportMockup();
                        break;
                }
            }
        });
        
        this.populateDeviceGrid();
        this.showBackgroundOptions('color');
    }
    
    selectDevice(deviceKey) {
        this.selectedDevice = deviceKey;
        document.querySelectorAll('.device-item').forEach(item => {
            item.classList.toggle('active', item.dataset.device === deviceKey);
        });
        
        const device = this.devices[deviceKey];
        document.getElementById('deviceInfo').textContent = device.name;
        
        this.renderMockup();
        this.saveState();
        this.showStatus(`Selected ${device.name}`);
    }
    
    filterDevices(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
        
        document.querySelectorAll('.device-item').forEach(item => {
            const device = this.devices[item.dataset.device];
            const show = category === 'all' || device.category === category;
            item.style.display = show ? 'block' : 'none';
        });
    }
    
    populateDeviceGrid() {
        const grid = document.getElementById('deviceGrid');
        grid.innerHTML = Object.entries(this.devices).map(([key, device]) => `
            <div class="device-item ${key === this.selectedDevice ? 'active' : ''}" data-device="${key}">
                <div class="device-preview">
                    <div class="device-icon">📱</div>
                </div>
                <span class="device-name">${device.name}</span>
            </div>
        `).join('');
    }
    
    showBackgroundOptions(type) {
        document.querySelectorAll('.bg-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        const container = document.getElementById('backgroundOptions');
        
        if (type === 'color') {
            container.innerHTML = this.backgroundOptions.colors.map(color => `
                <div class="bg-option color-option" data-type="color" data-value="${color}" style="background-color: ${color}"></div>
            `).join('');
        } else if (type === 'gradient') {
            container.innerHTML = this.backgroundOptions.gradients.map(gradient => `
                <div class="bg-option gradient-option" data-type="gradient" data-value="${gradient}" style="background: ${gradient}"></div>
            `).join('');
        } else if (type === 'image') {
            container.innerHTML = `
                <input type="file" id="bgImageUpload" accept="image/*" style="display: none;">
                <button class="btn-secondary" onclick="document.getElementById('bgImageUpload').click()">Upload Background</button>
            `;
            
            document.getElementById('bgImageUpload').addEventListener('change', (e) => {
                this.loadBackgroundImage(e.target.files[0]);
            });
        }
    }
    
    setBackground(type, value) {
        this.background = { type, value };
        this.renderMockup();
        this.saveState();
        this.showStatus(`Background updated`);
    }
    
    loadImage(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.imagePosition = { x: 0, y: 0 };
                this.imageScale = 1;
                this.imageRotation = 0;
                
                document.getElementById('imageControls').style.display = 'block';
                document.getElementById('positionX').value = 0;
                document.getElementById('positionY').value = 0;
                document.getElementById('imageScale').value = 1;
                document.getElementById('imageRotation').value = 0;
                
                this.renderMockup();
                this.saveState();
                this.showStatus('Image uploaded successfully');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    loadBackgroundImage(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setBackground('image', e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    updateImagePosition() {
        if (!this.uploadedImage) return;
        
        this.imagePosition.x = parseInt(document.getElementById('positionX').value);
        this.imagePosition.y = parseInt(document.getElementById('positionY').value);
        this.imageScale = parseFloat(document.getElementById('imageScale').value);
        this.imageRotation = parseInt(document.getElementById('imageRotation').value);
        
        this.renderMockup();
    }
    
    updateTextOverlay() {
        this.textOverlay.text = document.getElementById('textInput').value;
        this.textOverlay.size = parseInt(document.getElementById('textSize').value);
        this.textOverlay.color = document.getElementById('textColor').value;
        this.textOverlay.font = document.getElementById('textFont').value;
        
        this.renderMockup();
    }
    
    renderMockup() {
        if (!this.ctx) return;
        
        const device = this.devices[this.selectedDevice];
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Calculate device position (centered)
        const deviceX = (this.canvas.width - device.width) / 2;
        const deviceY = (this.canvas.height - device.height) / 2;
        
        // Draw device
        this.drawDevice(device, deviceX, deviceY);
        
        // Draw uploaded image on device screen
        if (this.uploadedImage) {
            this.drawImageOnDevice(device, deviceX, deviceY);
        }
        
        // Draw text overlay
        if (this.textOverlay.text) {
            this.drawTextOverlay();
        }
        
        this.updateElementCount();
    }
    
    drawBackground() {
        if (this.background.type === 'color') {
            this.ctx.fillStyle = this.background.value;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.background.type === 'gradient') {
            // Create gradient (simplified)
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.background.type === 'image' && this.background.value) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                this.renderMockup(); // Re-render to draw device on top
            };
            img.src = this.background.value;
            return;
        }
    }
    
    drawDevice(device, x, y) {
        // Draw device body
        this.ctx.fillStyle = device.bezelColor;
        this.ctx.fillRect(x, y, device.width, device.height);
        
        // Draw screen
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + device.screenX, y + device.screenY, device.screenWidth, device.screenHeight);
        
        // Draw device-specific elements
        if (device.hasNotch) {
            this.drawNotch(device, x, y);
        }
        
        if (device.hasKeyboard) {
            this.drawKeyboard(device, x, y);
        }
        
        if (device.hasStand) {
            this.drawStand(device, x, y);
        }
        
        // Add subtle shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
    }
    
    drawNotch(device, x, y) {
        const notchWidth = 120;
        const notchHeight = 25;
        const notchX = x + (device.width - notchWidth) / 2;
        const notchY = y + 10;
        
        this.ctx.fillStyle = device.bezelColor;
        this.ctx.fillRect(notchX, notchY, notchWidth, notchHeight);
    }
    
    drawKeyboard(device, x, y) {
        const keyboardHeight = 100;
        const keyboardY = y + device.height - keyboardHeight;
        
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x + 20, keyboardY, device.width - 40, keyboardHeight - 20);
    }
    
    drawStand(device, x, y) {
        const standWidth = 200;
        const standHeight = 50;
        const standX = x + (device.width - standWidth) / 2;
        const standY = y + device.height;
        
        this.ctx.fillStyle = '#cccccc';
        this.ctx.fillRect(standX, standY, standWidth, standHeight);
    }
    
    drawImageOnDevice(device, deviceX, deviceY) {
        const screenX = deviceX + device.screenX;
        const screenY = deviceY + device.screenY;
        
        this.ctx.save();
        
        // Clip to screen area
        this.ctx.beginPath();
        this.ctx.rect(screenX, screenY, device.screenWidth, device.screenHeight);
        this.ctx.clip();
        
        // Calculate image dimensions
        const imgWidth = this.uploadedImage.width * this.imageScale;
        const imgHeight = this.uploadedImage.height * this.imageScale;
        
        // Calculate position
        const imgX = screenX + (device.screenWidth - imgWidth) / 2 + this.imagePosition.x;
        const imgY = screenY + (device.screenHeight - imgHeight) / 2 + this.imagePosition.y;
        
        // Apply rotation
        if (this.imageRotation !== 0) {
            this.ctx.translate(imgX + imgWidth / 2, imgY + imgHeight / 2);
            this.ctx.rotate((this.imageRotation * Math.PI) / 180);
            this.ctx.translate(-imgWidth / 2, -imgHeight / 2);
            this.ctx.drawImage(this.uploadedImage, 0, 0, imgWidth, imgHeight);
        } else {
            this.ctx.drawImage(this.uploadedImage, imgX, imgY, imgWidth, imgHeight);
        }
        
        this.ctx.restore();
    }
    
    drawTextOverlay() {
        this.ctx.save();
        this.ctx.font = `${this.textOverlay.size}px ${this.textOverlay.font}`;
        this.ctx.fillStyle = this.textOverlay.color;
        this.ctx.fillText(this.textOverlay.text, this.textOverlay.x, this.textOverlay.y);
        this.ctx.restore();
    }
    
    newMockup() {
        this.uploadedImage = null;
        this.imagePosition = { x: 0, y: 0 };
        this.imageScale = 1;
        this.imageRotation = 0;
        this.textOverlay.text = '';
        this.background = { type: 'color', value: '#f0f0f0' };
        
        document.getElementById('imageControls').style.display = 'none';
        document.getElementById('textInput').value = '';
        
        this.renderMockup();
        this.saveState();
        this.showStatus('New mockup created');
    }
    
    exportMockup() {
        const device = this.devices[this.selectedDevice];
        const link = document.createElement('a');
        link.download = `mockup-${device.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        
        this.showStatus('Mockup exported successfully');
    }
    
    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 3);
        this.applyZoom();
    }
    
    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.3);
        this.applyZoom();
    }
    
    fitToScreen() {
        this.zoom = 1;
        this.applyZoom();
    }
    
    applyZoom() {
        this.canvas.style.transform = `scale(${this.zoom})`;
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoom * 100)}%`;
    }
    
    saveState() {
        const state = {
            selectedDevice: this.selectedDevice,
            uploadedImage: this.uploadedImage ? this.uploadedImage.src : null,
            imagePosition: { ...this.imagePosition },
            imageScale: this.imageScale,
            imageRotation: this.imageRotation,
            background: { ...this.background },
            textOverlay: { ...this.textOverlay }
        };
        
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(state));
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(JSON.parse(this.history[this.historyIndex]));
            this.showStatus('Undo');
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(JSON.parse(this.history[this.historyIndex]));
            this.showStatus('Redo');
        }
    }
    
    loadState(state) {
        this.selectedDevice = state.selectedDevice;
        this.imagePosition = state.imagePosition;
        this.imageScale = state.imageScale;
        this.imageRotation = state.imageRotation;
        this.background = state.background;
        this.textOverlay = state.textOverlay;
        
        if (state.uploadedImage) {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.renderMockup();
            };
            img.src = state.uploadedImage;
        } else {
            this.uploadedImage = null;
            this.renderMockup();
        }
        
        // Update UI
        this.selectDevice(this.selectedDevice);
        document.getElementById('textInput').value = this.textOverlay.text;
    }
    
    updateElementCount() {
        const device = this.devices[this.selectedDevice];
        let count = `Device: ${device.name}`;
        if (this.uploadedImage) count += ', Image: 1';
        if (this.textOverlay.text) count += ', Text: 1';
        
        document.getElementById('elementCount').textContent = count;
    }
    
    showStatus(message) {
        const statusEl = document.getElementById('statusText');
        if (statusEl) {
            statusEl.textContent = message;
            setTimeout(() => {
                statusEl.textContent = 'Ready';
            }, 3000);
        }
        
        // Show notification
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    applyStyles() {
        const styles = `
            <style>
            .mockup-generator {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f8f9fa;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .mockup-header {
                background: white;
                padding: 1rem 2rem;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .mockup-logo {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .mockup-icon {
                font-size: 2rem;
            }
            
            .mockup-logo h2 {
                margin: 0;
                color: #333;
                font-weight: 600;
            }
            
            .mockup-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .btn-primary, .btn-secondary {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
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
            
            .mockup-content {
                display: flex;
                flex: 1;
                gap: 1rem;
                padding: 1rem;
            }
            
            .mockup-sidebar {
                width: 300px;
                background: white;
                border-radius: 8px;
                padding: 1rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                height: fit-content;
                max-height: calc(100vh - 200px);
                overflow-y: auto;
            }
            
            .sidebar-section {
                margin-bottom: 2rem;
            }
            
            .sidebar-section h3 {
                margin: 0 0 1rem 0;
                color: #333;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .device-filter {
                display: flex;
                gap: 0.25rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 0.25rem 0.5rem;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s;
            }
            
            .filter-btn.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .device-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
            }
            
            .device-item {
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
                background: white;
            }
            
            .device-item:hover {
                border-color: #007bff;
                transform: translateY(-2px);
            }
            
            .device-item.active {
                border-color: #007bff;
                background: #f8f9ff;
            }
            
            .device-icon {
                font-size: 1.5rem;
                margin-bottom: 0.25rem;
            }
            
            .device-name {
                font-size: 0.8rem;
                color: #666;
                font-weight: 500;
            }
            
            .background-types {
                display: flex;
                gap: 0.25rem;
                margin-bottom: 1rem;
            }
            
            .bg-type-btn {
                padding: 0.5rem;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                flex: 1;
                transition: all 0.2s;
            }
            
            .bg-type-btn.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .background-options {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 0.5rem;
            }
            
            .bg-option {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                cursor: pointer;
                border: 2px solid #e9ecef;
                transition: all 0.2s;
            }
            
            .bg-option:hover {
                border-color: #007bff;
                transform: scale(1.1);
            }
            
            .image-controls {
                margin-top: 1rem;
            }
            
            .image-controls label {
                display: block;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                color: #666;
            }
            
            .image-controls input[type="range"] {
                width: 100%;
                margin-top: 0.25rem;
            }
            
            #textInput, #textFont {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                margin-bottom: 0.5rem;
            }
            
            .mockup-main {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .mockup-toolbar {
                background: white;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .mockup-toolbar button {
                padding: 0.5rem;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 36px;
            }
            
            .mockup-toolbar button:hover {
                background: #f8f9fa;
                border-color: #007bff;
            }
            
            .separator {
                color: #dee2e6;
                margin: 0 0.5rem;
            }
            
            .zoom-level {
                font-weight: 500;
                color: #666;
                min-width: 50px;
                text-align: center;
            }
            
            .device-info {
                margin-left: auto;
                font-weight: 500;
                color: #666;
            }
            
            .canvas-container {
                flex: 1;
                background: white;
                border-radius: 8px;
                padding: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: auto;
            }
            
            #mockupCanvas {
                border: 1px solid #e9ecef;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: transform 0.2s;
            }
            
            .mockup-status {
                background: white;
                padding: 0.75rem 2rem;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
                color: #666;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(400px);
                transition: transform 0.3s;
                z-index: 1000;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            @media (max-width: 768px) {
                .mockup-content {
                    flex-direction: column;
                }
                
                .mockup-sidebar {
                    width: 100%;
                    max-height: none;
                }
                
                .device-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                
                .mockup-header {
                    padding: 1rem;
                    flex-direction: column;
                    gap: 1rem;
                }
            }
            </style>
        `;
        
        if (!document.querySelector('#mockup-generator-styles')) {
            const styleEl = document.createElement('div');
            styleEl.id = 'mockup-generator-styles';
            styleEl.innerHTML = styles;
            document.head.appendChild(styleEl);
        }
    }
}

// Global instance
let mockupGenerator;

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('mockupGeneratorContainer')) {
            mockupGenerator = new MockupGeneratorUtility();
            mockupGenerator.init('mockupGeneratorContainer');
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockupGeneratorUtility;
}