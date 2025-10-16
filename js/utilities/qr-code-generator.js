/**
 * QR Code Generator Utility
 * A comprehensive utility for generating QR codes with various data types and customization options
 */

class QRCodeGeneratorUtility {
    constructor(containerId = 'qrCodeGenerator') {
        this.container = document.getElementById(containerId);
        this.currentQRCode = null;
        this.history = JSON.parse(localStorage.getItem('qrCodeHistory') || '[]');
        this.presets = {
            wifi: { ssid: '', password: '', security: 'WPA' },
            contact: { name: '', phone: '', email: '', organization: '' },
            email: { to: '', subject: '', body: '' },
            sms: { number: '', message: '' }
        };
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.loadHistory();
    }

    render() {
        this.container.innerHTML = `
            <div class="qr-generator-container">
                <div class="qr-generator-header">
                    <h2>🚀 QR Code Generator</h2>
                    <p>Create professional QR codes for various purposes</p>
                </div>

                <div class="qr-generator-content">
                    <div class="qr-input-section">
                        <div class="data-type-selector">
                            <label>Data Type:</label>
                            <select id="dataType" class="form-control">
                                <option value="text">📝 Text</option>
                                <option value="url">🔗 URL</option>
                                <option value="wifi">📶 WiFi</option>
                                <option value="contact">👤 Contact</option>
                                <option value="email">📧 Email</option>
                                <option value="sms">💬 SMS</option>
                            </select>
                        </div>

                        <div class="input-forms">
                            <div id="textForm" class="input-form active">
                                <label>Text Content:</label>
                                <textarea id="textInput" class="form-control" placeholder="Enter your text here..." rows="4"></textarea>
                            </div>

                            <div id="urlForm" class="input-form">
                                <label>URL:</label>
                                <input type="url" id="urlInput" class="form-control" placeholder="https://example.com">
                            </div>

                            <div id="wifiForm" class="input-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Network Name (SSID):</label>
                                        <input type="text" id="wifiSSID" class="form-control" placeholder="WiFi Network Name">
                                    </div>
                                    <div class="form-group">
                                        <label>Password:</label>
                                        <input type="password" id="wifiPassword" class="form-control" placeholder="WiFi Password">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Security Type:</label>
                                    <select id="wifiSecurity" class="form-control">
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">Open Network</option>
                                    </select>
                                </div>
                            </div>

                            <div id="contactForm" class="input-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Full Name:</label>
                                        <input type="text" id="contactName" class="form-control" placeholder="John Doe">
                                    </div>
                                    <div class="form-group">
                                        <label>Phone:</label>
                                        <input type="tel" id="contactPhone" class="form-control" placeholder="+1234567890">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Email:</label>
                                        <input type="email" id="contactEmail" class="form-control" placeholder="john@example.com">
                                    </div>
                                    <div class="form-group">
                                        <label>Organization:</label>
                                        <input type="text" id="contactOrg" class="form-control" placeholder="Company Name">
                                    </div>
                                </div>
                            </div>

                            <div id="emailForm" class="input-form">
                                <div class="form-group">
                                    <label>To:</label>
                                    <input type="email" id="emailTo" class="form-control" placeholder="recipient@example.com">
                                </div>
                                <div class="form-group">
                                    <label>Subject:</label>
                                    <input type="text" id="emailSubject" class="form-control" placeholder="Email Subject">
                                </div>
                                <div class="form-group">
                                    <label>Message:</label>
                                    <textarea id="emailBody" class="form-control" placeholder="Email message..." rows="3"></textarea>
                                </div>
                            </div>

                            <div id="smsForm" class="input-form">
                                <div class="form-group">
                                    <label>Phone Number:</label>
                                    <input type="tel" id="smsNumber" class="form-control" placeholder="+1234567890">
                                </div>
                                <div class="form-group">
                                    <label>Message:</label>
                                    <textarea id="smsMessage" class="form-control" placeholder="SMS message..." rows="3"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="customization-section">
                            <h3>🎨 Customization</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Size:</label>
                                    <select id="qrSize" class="form-control">
                                        <option value="200">Small (200x200)</option>
                                        <option value="300" selected>Medium (300x300)</option>
                                        <option value="400">Large (400x400)</option>
                                        <option value="500">Extra Large (500x500)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Error Correction:</label>
                                    <select id="errorCorrection" class="form-control">
                                        <option value="L">Low (7%)</option>
                                        <option value="M" selected>Medium (15%)</option>
                                        <option value="Q">Quartile (25%)</option>
                                        <option value="H">High (30%)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button id="generateBtn" class="btn btn-primary">🎯 Generate QR Code</button>
                            <button id="clearBtn" class="btn btn-secondary">🧹 Clear</button>
                        </div>
                    </div>

                    <div class="qr-output-section">
                        <div class="qr-preview">
                            <h3>📱 Preview</h3>
                            <div id="qrCodeDisplay" class="qr-display">
                                <div class="qr-placeholder">
                                    <div class="placeholder-icon">📱</div>
                                    <p>Your QR code will appear here</p>
                                </div>
                            </div>
                        </div>

                        <div class="qr-actions" id="qrActions" style="display: none;">
                            <button id="downloadPNG" class="btn btn-success">📥 Download PNG</button>
                            <button id="downloadSVG" class="btn btn-info">📥 Download SVG</button>
                            <button id="copyToClipboard" class="btn btn-warning">📋 Copy to Clipboard</button>
                        </div>

                        <div class="qr-info" id="qrInfo" style="display: none;">
                            <h4>ℹ️ QR Code Information</h4>
                            <div id="qrDetails"></div>
                        </div>
                    </div>
                </div>

                <div class="qr-history-section">
                    <h3>📚 Recent QR Codes</h3>
                    <div id="qrHistory" class="qr-history-grid"></div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('qrGeneratorStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'qrGeneratorStyles';
        styles.textContent = `
            .qr-generator-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .qr-generator-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }

            .qr-generator-header h2 {
                margin: 0 0 10px 0;
                font-size: 2.2em;
                font-weight: 600;
            }

            .qr-generator-header p {
                margin: 0;
                font-size: 1.1em;
                opacity: 0.9;
            }

            .qr-generator-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 30px;
            }

            .qr-input-section {
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }

            .qr-output-section {
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }

            .data-type-selector {
                margin-bottom: 20px;
            }

            .data-type-selector label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }

            .form-control {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .form-control:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .input-form {
                display: none;
                margin-bottom: 20px;
            }

            .input-form.active {
                display: block;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }

            .form-group {
                margin-bottom: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #555;
            }

            .customization-section {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                border: 1px solid #e9ecef;
            }

            .customization-section h3 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 1.3em;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }

            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }

            .btn-success {
                background: #28a745;
                color: white;
            }

            .btn-success:hover {
                background: #218838;
                transform: translateY(-2px);
            }

            .btn-info {
                background: #17a2b8;
                color: white;
            }

            .btn-info:hover {
                background: #138496;
                transform: translateY(-2px);
            }

            .btn-warning {
                background: #ffc107;
                color: #212529;
            }

            .btn-warning:hover {
                background: #e0a800;
                transform: translateY(-2px);
            }

            .qr-preview h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.3em;
            }

            .qr-display {
                min-height: 300px;
                border: 2px dashed #e0e0e0;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                background: #fafafa;
            }

            .qr-placeholder {
                text-align: center;
                color: #999;
            }

            .placeholder-icon {
                font-size: 3em;
                margin-bottom: 10px;
            }

            .qr-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }

            .qr-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }

            .qr-info h4 {
                margin: 0 0 10px 0;
                color: #333;
            }

            .qr-history-section {
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }

            .qr-history-section h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.3em;
            }

            .qr-history-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }

            .history-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid #e9ecef;
            }

            .history-item:hover {
                background: #e9ecef;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            .history-item img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                margin-bottom: 8px;
            }

            .history-item .item-type {
                font-size: 0.85em;
                color: #666;
                font-weight: 500;
            }

            .history-item .item-date {
                font-size: 0.75em;
                color: #999;
                margin-top: 5px;
            }

            @media (max-width: 768px) {
                .qr-generator-content {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }

                .form-row {
                    grid-template-columns: 1fr;
                }

                .action-buttons {
                    flex-direction: column;
                }

                .qr-actions {
                    flex-direction: column;
                }

                .qr-history-grid {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        const dataTypeSelect = document.getElementById('dataType');
        const generateBtn = document.getElementById('generateBtn');
        const clearBtn = document.getElementById('clearBtn');
        const downloadPNG = document.getElementById('downloadPNG');
        const downloadSVG = document.getElementById('downloadSVG');
        const copyToClipboard = document.getElementById('copyToClipboard');

        dataTypeSelect.addEventListener('change', (e) => {
            this.switchDataType(e.target.value);
        });

        generateBtn.addEventListener('click', () => {
            this.generateQRCode();
        });

        clearBtn.addEventListener('click', () => {
            this.clearForm();
        });

        downloadPNG.addEventListener('click', () => {
            this.downloadQRCode('png');
        });

        downloadSVG.addEventListener('click', () => {
            this.downloadQRCode('svg');
        });

        copyToClipboard.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Auto-generate on input change
        this.container.addEventListener('input', () => {
            if (this.currentQRCode) {
                setTimeout(() => this.generateQRCode(), 300);
            }
        });
    }

    switchDataType(type) {
        // Hide all forms
        document.querySelectorAll('.input-form').forEach(form => {
            form.classList.remove('active');
        });

        // Show selected form
        const targetForm = document.getElementById(`${type}Form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    }

    generateQRCode() {
        const dataType = document.getElementById('dataType').value;
        const size = parseInt(document.getElementById('qrSize').value);
        const errorCorrection = document.getElementById('errorCorrection').value;

        let data = this.getDataForType(dataType);
        
        if (!data) {
            this.showError('Please enter valid data for the QR code.');
            return;
        }

        try {
            // Create QR code using a simple implementation
            const qrCodeData = this.createQRCodeData(data, size, errorCorrection);
            this.displayQRCode(qrCodeData, dataType, data);
            this.saveToHistory(dataType, data, qrCodeData);
        } catch (error) {
            this.showError('Error generating QR code: ' + error.message);
        }
    }

    getDataForType(type) {
        switch (type) {
            case 'text':
                return document.getElementById('textInput').value.trim();
            
            case 'url':
                const url = document.getElementById('urlInput').value.trim();
                return url && this.isValidURL(url) ? url : null;
            
            case 'wifi':
                const ssid = document.getElementById('wifiSSID').value.trim();
                const password = document.getElementById('wifiPassword').value;
                const security = document.getElementById('wifiSecurity').value;
                
                if (!ssid) return null;
                
                return `WIFI:T:${security};S:${ssid};P:${password};;`;
            
            case 'contact':
                const name = document.getElementById('contactName').value.trim();
                const phone = document.getElementById('contactPhone').value.trim();
                const email = document.getElementById('contactEmail').value.trim();
                const org = document.getElementById('contactOrg').value.trim();
                
                if (!name && !phone && !email) return null;
                
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nEND:VCARD`;
            
            case 'email':
                const to = document.getElementById('emailTo').value.trim();
                const subject = document.getElementById('emailSubject').value.trim();
                const body = document.getElementById('emailBody').value.trim();
                
                if (!to) return null;
                
                return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            case 'sms':
                const number = document.getElementById('smsNumber').value.trim();
                const message = document.getElementById('smsMessage').value.trim();
                
                if (!number) return null;
                
                return `sms:${number}?body=${encodeURIComponent(message)}`;
            
            default:
                return null;
        }
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    createQRCodeData(data, size, errorCorrection) {
        // Simple QR code generation using Google Charts API
        const encodedData = encodeURIComponent(data);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&ecc=${errorCorrection}`;
        
        return {
            url: qrUrl,
            data: data,
            size: size,
            errorCorrection: errorCorrection
        };
    }

    displayQRCode(qrCodeData, type, originalData) {
        const display = document.getElementById('qrCodeDisplay');
        const actions = document.getElementById('qrActions');
        const info = document.getElementById('qrInfo');
        const details = document.getElementById('qrDetails');

        display.innerHTML = `
            <img src="${qrCodeData.url}" alt="QR Code" style="max-width: 100%; height: auto; border-radius: 8px;">
        `;

        actions.style.display = 'flex';
        info.style.display = 'block';

        details.innerHTML = `
            <div><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div><strong>Size:</strong> ${qrCodeData.size}x${qrCodeData.size}px</div>
            <div><strong>Error Correction:</strong> ${qrCodeData.errorCorrection}</div>
            <div><strong>Data Length:</strong> ${originalData.length} characters</div>
        `;

        this.currentQRCode = qrCodeData;
    }

    downloadQRCode(format) {
        if (!this.currentQRCode) return;

        const link = document.createElement('a');
        link.href = this.currentQRCode.url;
        link.download = `qrcode_${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async copyToClipboard() {
        if (!this.currentQRCode) return;

        try {
            const response = await fetch(this.currentQRCode.url);
            const blob = await response.blob();
            
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            
            this.showSuccess('QR code copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy QR code to clipboard.');
        }
    }

    saveToHistory(type, data, qrCodeData) {
        const historyItem = {
            id: Date.now(),
            type: type,
            data: data,
            qrCodeData: qrCodeData,
            timestamp: new Date().toISOString()
        };

        this.history.unshift(historyItem);
        this.history = this.history.slice(0, 10); // Keep only last 10 items
        
        localStorage.setItem('qrCodeHistory', JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        const historyContainer = document.getElementById('qrHistory');
        
        if (this.history.length === 0) {
            historyContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No recent QR codes</p>';
            return;
        }

        historyContainer.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="qrGenerator.loadFromHistory('${item.id}')">
                <img src="${item.qrCodeData.url}" alt="QR Code">
                <div class="item-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                <div class="item-date">${new Date(item.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    loadFromHistory(id) {
        const item = this.history.find(h => h.id == id);
        if (!item) return;

        // Switch to the correct data type
        document.getElementById('dataType').value = item.type;
        this.switchDataType(item.type);

        // Fill in the form data based on type
        this.fillFormFromData(item.type, item.data);

        // Display the QR code
        this.displayQRCode(item.qrCodeData, item.type, item.data);
        this.currentQRCode = item.qrCodeData;
    }

    fillFormFromData(type, data) {
        switch (type) {
            case 'text':
                document.getElementById('textInput').value = data;
                break;
            case 'url':
                document.getElementById('urlInput').value = data;
                break;
            // Add more cases as needed
        }
    }

    clearForm() {
        // Clear all input fields
        document.querySelectorAll('.form-control').forEach(input => {
            input.value = '';
        });

        // Hide QR code display
        document.getElementById('qrCodeDisplay').innerHTML = `
            <div class="qr-placeholder">
                <div class="placeholder-icon">📱</div>
                <p>Your QR code will appear here</p>
            </div>
        `;

        document.getElementById('qrActions').style.display = 'none';
        document.getElementById('qrInfo').style.display = 'none';
        
        this.currentQRCode = null;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('qrCodeGenerator')) {
        window.qrGenerator = new QRCodeGeneratorUtility();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRCodeGeneratorUtility;
}

// Make available globally
window.QRCodeGeneratorUtility = QRCodeGeneratorUtility;