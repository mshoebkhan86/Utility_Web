/**
 * File Analyzer Utility
 * Provides comprehensive file analysis including type detection, metadata extraction,
 * security scanning, hash generation, and file validation
 */
class FileAnalyzerUtility {
    constructor() {
        this.supportedFormats = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'],
            document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'pages'],
            spreadsheet: ['xls', 'xlsx', 'csv', 'ods', 'numbers'],
            presentation: ['ppt', 'pptx', 'odp', 'key'],
            archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
            video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
            audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
            code: ['js', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'],
            executable: ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'app'],
            data: ['json', 'xml', 'yaml', 'sql', 'db', 'sqlite']
        };
        
        this.mimeTypes = {
            'image/jpeg': 'JPEG Image',
            'image/png': 'PNG Image',
            'image/gif': 'GIF Image',
            'image/webp': 'WebP Image',
            'image/svg+xml': 'SVG Vector Image',
            'application/pdf': 'PDF Document',
            'text/plain': 'Plain Text',
            'text/html': 'HTML Document',
            'text/css': 'CSS Stylesheet',
            'application/javascript': 'JavaScript File',
            'application/json': 'JSON Data',
            'application/xml': 'XML Document',
            'application/zip': 'ZIP Archive',
            'video/mp4': 'MP4 Video',
            'audio/mpeg': 'MP3 Audio'
        };
        
        this.securityRisks = {
            high: ['exe', 'msi', 'bat', 'cmd', 'scr', 'com', 'pif', 'vbs', 'js', 'jar'],
            medium: ['zip', 'rar', '7z', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
            low: ['txt', 'jpg', 'png', 'gif', 'mp3', 'mp4', 'csv']
        };
    }

    init() {
        this.createInterface();
        this.attachEventListeners();
    }

    createInterface() {
        const container = document.getElementById('file-analyzer-container');
        if (!container) return;

        container.innerHTML = `
            <div class="file-analyzer-wrapper">
                <div class="upload-section">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon">📁</div>
                        <h3>Drop files here or click to browse</h3>
                        <p>Supports all file types for comprehensive analysis</p>
                        <input type="file" id="fileInput" multiple accept="*/*" style="display: none;">
                        <button class="browse-btn" id="browseBtn">Browse Files</button>
                    </div>
                </div>

                <div class="analysis-tabs">
                    <div class="tab-buttons">
                        <button class="tab-btn active" data-tab="overview">📊 Overview</button>
                        <button class="tab-btn" data-tab="metadata">🏷️ Metadata</button>
                        <button class="tab-btn" data-tab="security">🔒 Security</button>
                        <button class="tab-btn" data-tab="hashes">🔐 Hashes</button>
                        <button class="tab-btn" data-tab="validation">✅ Validation</button>
                    </div>

                    <div class="tab-content">
                        <div class="tab-pane active" id="overview-tab">
                            <div class="files-list" id="filesList"></div>
                        </div>
                        
                        <div class="tab-pane" id="metadata-tab">
                            <div class="metadata-content" id="metadataContent">
                                <p class="no-data">Select a file to view metadata</p>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="security-tab">
                            <div class="security-content" id="securityContent">
                                <p class="no-data">Select a file for security analysis</p>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="hashes-tab">
                            <div class="hashes-content" id="hashesContent">
                                <p class="no-data">Select a file to generate hashes</p>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="validation-tab">
                            <div class="validation-content" id="validationContent">
                                <p class="no-data">Select a file for validation</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="analysis-actions">
                    <button class="action-btn" id="exportBtn" disabled>
                        <span class="btn-icon">💾</span>
                        Export Report
                    </button>
                    <button class="action-btn" id="clearBtn" disabled>
                        <span class="btn-icon">🗑️</span>
                        Clear All
                    </button>
                    <button class="action-btn" id="compareBtn" disabled>
                        <span class="btn-icon">⚖️</span>
                        Compare Files
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');
        const tabButtons = document.querySelectorAll('.tab-btn');
        const exportBtn = document.getElementById('exportBtn');
        const clearBtn = document.getElementById('clearBtn');
        const compareBtn = document.getElementById('compareBtn');

        // File upload handlers
        uploadArea?.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea?.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea?.addEventListener('drop', this.handleDrop.bind(this));
        uploadArea?.addEventListener('click', (e) => {
            // Only trigger file input if NOT clicking on browse button
            if (e.target.id !== 'browseBtn' && !e.target.closest('#browseBtn')) {
                fileInput?.click();
            }
        });
        browseBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            fileInput?.click();
        });
        fileInput?.addEventListener('change', this.handleFileSelect.bind(this));

        // Tab navigation
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Action buttons
        exportBtn?.addEventListener('click', this.exportReport.bind(this));
        clearBtn?.addEventListener('click', this.clearAll.bind(this));
        compareBtn?.addEventListener('click', this.compareFiles.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    async processFiles(files) {
        if (!files.length) return;

        this.showLoading(true);
        this.analyzedFiles = this.analyzedFiles || [];

        for (const file of files) {
            try {
                const analysis = await this.analyzeFile(file);
                this.analyzedFiles.push(analysis);
            } catch (error) {
                console.error('Error analyzing file:', error);
                this.showNotification(`Error analyzing ${file.name}: ${error.message}`, 'error');
            }
        }

        this.updateInterface();
        this.showLoading(false);
        this.enableActionButtons();
    }

    async analyzeFile(file) {
        const analysis = {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            extension: this.getFileExtension(file.name),
            category: this.getFileCategory(file.name),
            mimeDescription: this.mimeTypes[file.type] || 'Unknown',
            timestamp: Date.now()
        };

        // Perform detailed analysis
        analysis.metadata = await this.extractMetadata(file);
        analysis.security = this.performSecurityAnalysis(file);
        analysis.hashes = await this.generateHashes(file);
        analysis.validation = this.validateFile(file);
        analysis.preview = await this.generatePreview(file);

        return analysis;
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    getFileCategory(filename) {
        const ext = this.getFileExtension(filename);
        for (const [category, extensions] of Object.entries(this.supportedFormats)) {
            if (extensions.includes(ext)) {
                return category;
            }
        }
        return 'unknown';
    }

    async extractMetadata(file) {
        const metadata = {
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
            fileSizeBytes: file.size,
            mimeType: file.type || 'Unknown',
            lastModified: file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown',
            extension: this.getFileExtension(file.name),
            category: this.getFileCategory(file.name)
        };

        // Add specific metadata based on file type
        if (file.type.startsWith('image/')) {
            metadata.imageData = await this.extractImageMetadata(file);
        } else if (file.type.startsWith('video/')) {
            metadata.videoData = await this.extractVideoMetadata(file);
        } else if (file.type.startsWith('audio/')) {
            metadata.audioData = await this.extractAudioMetadata(file);
        }

        return metadata;
    }

    async extractImageMetadata(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    aspectRatio: (img.width / img.height).toFixed(2),
                    megapixels: ((img.width * img.height) / 1000000).toFixed(2)
                });
            };
            img.onerror = () => resolve({ error: 'Could not load image' });
            img.src = URL.createObjectURL(file);
        });
    }

    async extractVideoMetadata(file) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                resolve({
                    duration: video.duration ? this.formatDuration(video.duration) : 'Unknown',
                    width: video.videoWidth || 'Unknown',
                    height: video.videoHeight || 'Unknown',
                    aspectRatio: video.videoWidth && video.videoHeight ? 
                        (video.videoWidth / video.videoHeight).toFixed(2) : 'Unknown'
                });
            };
            video.onerror = () => resolve({ error: 'Could not load video metadata' });
            video.src = URL.createObjectURL(file);
        });
    }

    async extractAudioMetadata(file) {
        return new Promise((resolve) => {
            const audio = document.createElement('audio');
            audio.onloadedmetadata = () => {
                resolve({
                    duration: audio.duration ? this.formatDuration(audio.duration) : 'Unknown',
                    channels: 'Unknown', // Would need Web Audio API for detailed info
                    sampleRate: 'Unknown'
                });
            };
            audio.onerror = () => resolve({ error: 'Could not load audio metadata' });
            audio.src = URL.createObjectURL(file);
        });
    }

    performSecurityAnalysis(file) {
        const ext = this.getFileExtension(file.name);
        let riskLevel = 'unknown';
        let riskFactors = [];
        let recommendations = [];

        // Determine risk level
        if (this.securityRisks.high.includes(ext)) {
            riskLevel = 'high';
            riskFactors.push('Executable file type');
            recommendations.push('Scan with antivirus before opening');
            recommendations.push('Verify file source and integrity');
        } else if (this.securityRisks.medium.includes(ext)) {
            riskLevel = 'medium';
            riskFactors.push('Can contain macros or embedded content');
            recommendations.push('Open in protected view');
        } else if (this.securityRisks.low.includes(ext)) {
            riskLevel = 'low';
            recommendations.push('Generally safe to open');
        }

        // Additional checks
        if (file.size > 100 * 1024 * 1024) { // > 100MB
            riskFactors.push('Large file size');
        }

        if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
            riskFactors.push('Suspicious filename characters');
            riskLevel = 'high';
        }

        return {
            riskLevel,
            riskFactors,
            recommendations,
            fileSize: this.formatFileSize(file.size),
            suspicious: riskLevel === 'high'
        };
    }

    async generateHashes(file) {
        const hashes = {};
        
        try {
            // Generate SHA-1 hash
            hashes.sha1 = await this.calculateHash(file, 'SHA-1');
            
            // Generate SHA-256 hash
            hashes.sha256 = await this.calculateHash(file, 'SHA-256');
            
            // Generate MD5 hash using alternative method
            hashes.md5 = await this.calculateMD5Hash(file);
            
        } catch (error) {
            console.error('Error generating hashes:', error);
            hashes.error = 'Could not generate hashes';
        }

        return hashes;
    }

    async calculateHash(file, algorithm) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async calculateMD5Hash(file) {
        // Simple MD5-like hash implementation since Web Crypto API doesn't support MD5
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        let hash = 0;
        
        for (let i = 0; i < uint8Array.length; i++) {
            hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
        }
        
        // Convert to hex string (this is a simple hash, not actual MD5)
        return Math.abs(hash).toString(16).padStart(8, '0') + 'simplified';
    }

    validateFile(file) {
        const validation = {
            isValid: true,
            issues: [],
            warnings: [],
            score: 100
        };

        // File name validation
        if (file.name.length > 255) {
            validation.issues.push('Filename too long (>255 characters)');
            validation.score -= 20;
        }

        if (!/^[a-zA-Z0-9._\-\s]+$/.test(file.name)) {
            validation.warnings.push('Filename contains special characters');
            validation.score -= 10;
        }

        // File size validation
        if (file.size === 0) {
            validation.issues.push('File is empty');
            validation.score -= 50;
        }

        if (file.size > 1024 * 1024 * 1024) { // > 1GB
            validation.warnings.push('Very large file size');
            validation.score -= 15;
        }

        // MIME type validation
        const expectedMime = this.getExpectedMimeType(file.name);
        if (expectedMime && file.type && file.type !== expectedMime) {
            validation.warnings.push('MIME type mismatch with file extension');
            validation.score -= 25;
        }

        validation.isValid = validation.issues.length === 0;
        validation.score = Math.max(0, validation.score);

        return validation;
    }

    getExpectedMimeType(filename) {
        const ext = this.getFileExtension(filename);
        const mimeMap = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'pdf': 'application/pdf',
            'txt': 'text/plain',
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'xml': 'application/xml',
            'zip': 'application/zip'
        };
        return mimeMap[ext];
    }

    async generatePreview(file) {
        if (file.type.startsWith('image/')) {
            return {
                type: 'image',
                url: URL.createObjectURL(file)
            };
        } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            try {
                const text = await file.text();
                return {
                    type: 'text',
                    content: text.substring(0, 500) + (text.length > 500 ? '...' : '')
                };
            } catch (error) {
                return { type: 'none', error: 'Could not read text content' };
            }
        }
        return { type: 'none' };
    }

    updateInterface() {
        this.updateOverviewTab();
        this.updateMetadataTab();
        this.updateSecurityTab();
        this.updateHashesTab();
        this.updateValidationTab();
    }

    updateOverviewTab() {
        const filesList = document.getElementById('filesList');
        if (!filesList || !this.analyzedFiles?.length) return;

        filesList.innerHTML = this.analyzedFiles.map((analysis, index) => `
            <div class="file-item" data-index="${index}">
                <div class="file-icon">${this.getFileIcon(analysis.category)}</div>
                <div class="file-info">
                    <div class="file-name">${analysis.name}</div>
                    <div class="file-details">
                        <span class="file-size">${this.formatFileSize(analysis.size)}</span>
                        <span class="file-type">${analysis.mimeDescription}</span>
                        <span class="security-badge ${analysis.security.riskLevel}">
                            ${analysis.security.riskLevel.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="action-btn small" onclick="fileAnalyzer.selectFile(${index})">
                        📋 Details
                    </button>
                    <button class="action-btn small" onclick="fileAnalyzer.removeFile(${index})">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateMetadataTab() {
        const content = document.getElementById('metadataContent');
        if (!content) return;

        if (!this.selectedFile) {
            content.innerHTML = '<p class="no-data">Select a file to view metadata</p>';
            return;
        }

        const metadata = this.selectedFile.metadata;
        let metadataHtml = `
            <div class="metadata-grid">
                <div class="metadata-item">
                    <label>File Name:</label>
                    <span>${metadata.fileName}</span>
                </div>
                <div class="metadata-item">
                    <label>File Size:</label>
                    <span>${metadata.fileSize} (${metadata.fileSizeBytes.toLocaleString()} bytes)</span>
                </div>
                <div class="metadata-item">
                    <label>MIME Type:</label>
                    <span>${metadata.mimeType}</span>
                </div>
                <div class="metadata-item">
                    <label>Last Modified:</label>
                    <span>${metadata.lastModified}</span>
                </div>
                <div class="metadata-item">
                    <label>Extension:</label>
                    <span>.${metadata.extension}</span>
                </div>
                <div class="metadata-item">
                    <label>Category:</label>
                    <span>${metadata.category}</span>
                </div>
        `;

        // Add specific metadata
        if (metadata.imageData) {
            metadataHtml += `
                <div class="metadata-section">
                    <h4>Image Properties</h4>
                    <div class="metadata-item">
                        <label>Dimensions:</label>
                        <span>${metadata.imageData.width} × ${metadata.imageData.height} pixels</span>
                    </div>
                    <div class="metadata-item">
                        <label>Aspect Ratio:</label>
                        <span>${metadata.imageData.aspectRatio}</span>
                    </div>
                    <div class="metadata-item">
                        <label>Megapixels:</label>
                        <span>${metadata.imageData.megapixels} MP</span>
                    </div>
                </div>
            `;
        }

        if (metadata.videoData) {
            metadataHtml += `
                <div class="metadata-section">
                    <h4>Video Properties</h4>
                    <div class="metadata-item">
                        <label>Duration:</label>
                        <span>${metadata.videoData.duration}</span>
                    </div>
                    <div class="metadata-item">
                        <label>Resolution:</label>
                        <span>${metadata.videoData.width} × ${metadata.videoData.height}</span>
                    </div>
                    <div class="metadata-item">
                        <label>Aspect Ratio:</label>
                        <span>${metadata.videoData.aspectRatio}</span>
                    </div>
                </div>
            `;
        }

        if (metadata.audioData) {
            metadataHtml += `
                <div class="metadata-section">
                    <h4>Audio Properties</h4>
                    <div class="metadata-item">
                        <label>Duration:</label>
                        <span>${metadata.audioData.duration}</span>
                    </div>
                </div>
            `;
        }

        metadataHtml += '</div>';
        content.innerHTML = metadataHtml;
    }

    updateSecurityTab() {
        const content = document.getElementById('securityContent');
        if (!content) return;

        if (!this.selectedFile) {
            content.innerHTML = '<p class="no-data">Select a file for security analysis</p>';
            return;
        }

        const security = this.selectedFile.security;
        content.innerHTML = `
            <div class="security-analysis">
                <div class="risk-level ${security.riskLevel}">
                    <h3>Risk Level: ${security.riskLevel.toUpperCase()}</h3>
                    <div class="risk-indicator">
                        <div class="risk-bar ${security.riskLevel}"></div>
                    </div>
                </div>

                ${security.riskFactors.length > 0 ? `
                    <div class="risk-factors">
                        <h4>Risk Factors:</h4>
                        <ul>
                            ${security.riskFactors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${security.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="security-details">
                    <div class="detail-item">
                        <label>File Size:</label>
                        <span>${security.fileSize}</span>
                    </div>
                    <div class="detail-item">
                        <label>Suspicious:</label>
                        <span class="${security.suspicious ? 'warning' : 'safe'}">
                            ${security.suspicious ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    updateHashesTab() {
        const content = document.getElementById('hashesContent');
        if (!content) return;

        if (!this.selectedFile) {
            content.innerHTML = '<p class="no-data">Select a file to generate hashes</p>';
            return;
        }

        const hashes = this.selectedFile.hashes;
        if (hashes.error) {
            content.innerHTML = `<p class="error">Error: ${hashes.error}</p>`;
            return;
        }

        content.innerHTML = `
            <div class="hashes-list">
                ${Object.entries(hashes).map(([algorithm, hash]) => `
                    <div class="hash-item">
                        <label>${algorithm.toUpperCase()}:</label>
                        <div class="hash-value">
                            <code>${hash}</code>
                            <button class="copy-btn" onclick="fileAnalyzer.copyToClipboard('${hash}')">
                                📋 Copy
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="hash-actions">
                <button class="action-btn" onclick="fileAnalyzer.verifyHash()">
                    🔍 Verify Hash
                </button>
                <button class="action-btn" onclick="fileAnalyzer.exportHashes()">
                    💾 Export Hashes
                </button>
            </div>
        `;
    }

    updateValidationTab() {
        const content = document.getElementById('validationContent');
        if (!content) return;

        if (!this.selectedFile) {
            content.innerHTML = '<p class="no-data">Select a file for validation</p>';
            return;
        }

        const validation = this.selectedFile.validation;
        content.innerHTML = `
            <div class="validation-results">
                <div class="validation-score">
                    <h3>Validation Score: ${validation.score}/100</h3>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${validation.score}%"></div>
                    </div>
                    <span class="score-status ${validation.isValid ? 'valid' : 'invalid'}">
                        ${validation.isValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                </div>

                ${validation.issues.length > 0 ? `
                    <div class="validation-issues">
                        <h4>Issues:</h4>
                        <ul class="issues-list">
                            ${validation.issues.map(issue => `<li class="issue">${issue}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${validation.warnings.length > 0 ? `
                    <div class="validation-warnings">
                        <h4>Warnings:</h4>
                        <ul class="warnings-list">
                            ${validation.warnings.map(warning => `<li class="warning">${warning}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${validation.isValid && validation.warnings.length === 0 ? `
                    <div class="validation-success">
                        <p>✅ File passed all validation checks!</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    selectFile(index) {
        if (!this.analyzedFiles || !this.analyzedFiles[index]) {
            this.showNotification('File not found', 'error');
            return;
        }
        this.selectedFile = this.analyzedFiles[index];
        this.updateInterface();
        this.showNotification(`Selected ${this.selectedFile.name}`, 'info');
    }

    removeFile(index) {
        if (!this.analyzedFiles || !this.analyzedFiles[index]) {
            this.showNotification('File not found', 'error');
            return;
        }
        
        const fileName = this.analyzedFiles[index].name;
        this.analyzedFiles.splice(index, 1);
        
        if (this.selectedFile && this.selectedFile.name === fileName) {
            this.selectedFile = null;
        }
        
        this.updateInterface();
        
        if (this.analyzedFiles.length === 0) {
            this.disableActionButtons();
        }
        
        this.showNotification(`Removed ${fileName}`, 'info');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async exportReport() {
        if (!this.analyzedFiles?.length) return;

        const report = {
            timestamp: new Date().toISOString(),
            totalFiles: this.analyzedFiles.length,
            files: this.analyzedFiles.map(analysis => ({
                name: analysis.name,
                size: analysis.size,
                type: analysis.type,
                category: analysis.category,
                security: analysis.security,
                validation: analysis.validation,
                hashes: analysis.hashes
            }))
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file-analysis-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Report exported successfully', 'success');
    }

    clearAll() {
        this.analyzedFiles = [];
        this.selectedFile = null;
        this.updateInterface();
        this.disableActionButtons();
        this.showNotification('All files cleared', 'info');
    }

    compareFiles() {
        if (!this.analyzedFiles || this.analyzedFiles.length < 2) {
            this.showNotification('Select at least 2 files to compare', 'warning');
            return;
        }

        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>File Comparison</h3>
                    <button class="close-btn" onclick="this.closest('.comparison-modal').remove()">&times;</button>
                </div>
                <div class="comparison-content">
                    ${this.generateComparisonTable()}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateComparisonTable() {
        const files = this.analyzedFiles.slice(0, 5); // Limit to 5 files for readability
        
        return `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        ${files.map(file => `<th>${file.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Size</td>
                        ${files.map(file => `<td>${this.formatFileSize(file.size)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>Type</td>
                        ${files.map(file => `<td>${file.mimeDescription}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>Security Risk</td>
                        ${files.map(file => `<td class="${file.security.riskLevel}">${file.security.riskLevel.toUpperCase()}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>Validation Score</td>
                        ${files.map(file => `<td>${file.validation.score}/100</td>`).join('')}
                    </tr>
                    <tr>
                        <td>SHA-256</td>
                        ${files.map(file => `<td><code class="hash-short">${file.hashes.sha256?.substring(0, 16)}...</code></td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success');
        } catch (error) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    verifyHash() {
        const input = prompt('Enter hash to verify against selected file:');
        if (!input || !this.selectedFile) return;

        const hashes = this.selectedFile.hashes;
        const inputHash = input.toLowerCase().trim();
        
        let match = false;
        let algorithm = '';
        
        for (const [algo, hash] of Object.entries(hashes)) {
            if (hash && hash.toLowerCase() === inputHash) {
                match = true;
                algorithm = algo.toUpperCase();
                break;
            }
        }

        if (match) {
            this.showNotification(`✅ Hash verified! Matches ${algorithm}`, 'success');
        } else {
            this.showNotification('❌ Hash does not match any generated hashes', 'error');
        }
    }

    exportHashes() {
        if (!this.selectedFile) return;

        const hashes = this.selectedFile.hashes;
        const content = Object.entries(hashes)
            .map(([algo, hash]) => `${algo.toUpperCase()}: ${hash}`)
            .join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedFile.name}_hashes.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Hashes exported successfully', 'success');
    }

    enableActionButtons() {
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('clearBtn').disabled = false;
        document.getElementById('compareBtn').disabled = false;
    }

    disableActionButtons() {
        document.getElementById('exportBtn').disabled = true;
        document.getElementById('clearBtn').disabled = true;
        document.getElementById('compareBtn').disabled = true;
    }

    showLoading(show) {
        const uploadArea = document.getElementById('uploadArea');
        if (show) {
            uploadArea?.classList.add('loading');
        } else {
            uploadArea?.classList.remove('loading');
        }
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

    getFileIcon(category) {
        const icons = {
            image: '🖼️',
            document: '📄',
            spreadsheet: '📊',
            presentation: '📽️',
            archive: '📦',
            video: '🎥',
            audio: '🎵',
            code: '💻',
            executable: '⚙️',
            data: '🗃️',
            unknown: '📁'
        };
        return icons[category] || icons.unknown;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// FileAnalyzerUtility class is available for external initialization
// Global instance should be created by the consuming HTML page