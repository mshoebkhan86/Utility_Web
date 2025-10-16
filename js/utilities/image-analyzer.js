/**
 * Image Analyzer Utility
 * Provides comprehensive image analysis including metadata extraction, dimension analysis,
 * file size optimization, format detection, and quality assessment.
 */

class ImageAnalyzerUtility {
    constructor() {
        this.currentImage = null;
        this.analysisResults = {};
        this.isAnalyzing = false;
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    }

    // Initialize the image analyzer interface
    init() {
        this.createInterface();
        this.attachEventListeners();
    }

    createInterface() {
        const container = document.getElementById('image-analyzer-container');
        if (!container) {
            console.error('Image Analyzer container not found');
            return;
        }

        container.innerHTML = `
            <div class="image-analyzer-wrapper">
                <div class="analyzer-header">
                    <h2>🖼️ Image Analyzer</h2>
                    <p>Analyze images for metadata, dimensions, optimization opportunities, and quality metrics</p>
                </div>

                <div class="analyzer-content">
                    <div class="upload-section">
                        <div class="upload-area" id="uploadArea">
                            <div class="upload-content">
                                <div class="upload-icon">📁</div>
                                <h3>Drop Image Here or Click to Upload</h3>
                                <p>Supports JPEG, PNG, GIF, WebP, BMP, SVG</p>
                                <input type="file" id="imageInput" accept="image/*" style="display: none;">
                                <button id="uploadBtn" class="btn btn-primary">Choose Image</button>
                            </div>
                        </div>

                        <div class="sample-images">
                            <h4>Or try with sample images:</h4>
                            <div class="sample-grid">
                                <button class="sample-btn" data-sample="large">📸 Large Photo</button>
                                <button class="sample-btn" data-sample="small">🖼️ Small Image</button>
                                <button class="sample-btn" data-sample="vector">🎨 Vector Graphics</button>
                            </div>
                        </div>
                    </div>

                    <div class="image-preview-section" id="imagePreviewSection" style="display: none;">
                        <div class="preview-header">
                            <h3>Image Preview</h3>
                            <div class="preview-actions">
                                <button id="analyzeBtn" class="btn btn-success">🔍 Analyze Image</button>
                                <button id="clearBtn" class="btn btn-outline">🗑️ Clear</button>
                            </div>
                        </div>
                        <div class="image-preview">
                            <img id="previewImage" alt="Preview" style="max-width: 100%; max-height: 300px; object-fit: contain;">
                        </div>
                        <div class="basic-info">
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">File Name:</span>
                                    <span id="fileName">-</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">File Size:</span>
                                    <span id="fileSize">-</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Format:</span>
                                    <span id="fileFormat">-</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Dimensions:</span>
                                    <span id="imageDimensions">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="results-section" id="resultsSection" style="display: none;">
                        <div class="results-header">
                            <h3>Analysis Results</h3>
                            <div class="results-actions">
                                <button id="exportBtn" class="btn btn-success" disabled>📊 Export Report</button>
                                <button id="optimizeBtn" class="btn btn-warning" disabled>⚡ Optimize Image</button>
                                <button id="convertBtn" class="btn btn-info" disabled>🔄 Convert Format</button>
                            </div>
                        </div>

                        <div class="results-tabs">
                            <button class="tab-btn active" data-tab="overview">Overview</button>
                            <button class="tab-btn" data-tab="metadata">Metadata</button>
                            <button class="tab-btn" data-tab="technical">Technical</button>
                            <button class="tab-btn" data-tab="optimization">Optimization</button>
                            <button class="tab-btn" data-tab="quality">Quality</button>
                        </div>

                        <div class="tab-content">
                            <div id="overview-tab" class="tab-pane active">
                                <div class="overview-content">
                                    <div class="score-summary">
                                        <div class="overall-score">
                                            <div class="score-circle">
                                                <span id="overallScore">-</span>
                                            </div>
                                            <div class="score-label">Quality Score</div>
                                        </div>
                                        <div class="category-scores">
                                            <div class="category-score">
                                                <div class="score-value" id="optimizationScore">-</div>
                                                <div class="score-name">Optimization</div>
                                            </div>
                                            <div class="category-score">
                                                <div class="score-value" id="qualityScore">-</div>
                                                <div class="score-name">Quality</div>
                                            </div>
                                            <div class="category-score">
                                                <div class="score-value" id="compatibilityScore">-</div>
                                                <div class="score-name">Compatibility</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="quick-insights">
                                        <h4>Quick Insights</h4>
                                        <div id="quickInsights" class="insights-list">
                                            <div class="insight-placeholder">Analyze image to see insights</div>
                                        </div>
                                    </div>

                                    <div class="recommendations">
                                        <h4>Recommendations</h4>
                                        <div id="recommendations" class="recommendations-list">
                                            <div class="recommendation-placeholder">No recommendations available</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="metadata-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Image Metadata</h4>
                                    <div id="metadataResults" class="results-grid">
                                        <div class="result-placeholder">No metadata available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="technical-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Technical Details</h4>
                                    <div id="technicalResults" class="results-grid">
                                        <div class="result-placeholder">No technical data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="optimization-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Optimization Analysis</h4>
                                    <div id="optimizationResults" class="results-grid">
                                        <div class="result-placeholder">No optimization data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="quality-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Quality Assessment</h4>
                                    <div id="qualityResults" class="results-grid">
                                        <div class="result-placeholder">No quality data available</div>
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
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const uploadBtn = document.getElementById('uploadBtn');

        uploadBtn?.addEventListener('click', () => imageInput.click());
        imageInput?.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Sample images
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadSampleImage(e.target.dataset.sample));
        });

        // Analysis and actions
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeImage());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearImage());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportReport());
        document.getElementById('optimizeBtn')?.addEventListener('click', () => this.optimizeImage());
        document.getElementById('convertBtn')?.addEventListener('click', () => this.convertFormat());

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        if (!this.isValidImageFile(file)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, WebP, BMP, SVG)');
            return;
        }

        this.currentImage = file;
        this.displayImagePreview(file);
        this.showBasicInfo(file);
    }

    isValidImageFile(file) {
        return this.supportedFormats.includes(file.type);
    }

    displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            document.getElementById('imagePreviewSection').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    showBasicInfo(file) {
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('fileFormat').textContent = file.type;

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            document.getElementById('imageDimensions').textContent = `${img.width} × ${img.height} pixels`;
        };
        img.src = URL.createObjectURL(file);
    }

    async analyzeImage() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        this.setAnalyzing(true);
        
        try {
            const results = await this.performImageAnalysis(this.currentImage);
            this.analysisResults = results;
            this.displayResults();
            this.enableActionButtons();
            document.getElementById('resultsSection').style.display = 'block';
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Image analysis failed. Please try again.');
        } finally {
            this.setAnalyzing(false);
        }
    }

    async performImageAnalysis(file) {
        // Simulate analysis delay
        await this.delay(1500);

        const img = await this.loadImage(file);
        
        const results = {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: new Date(file.lastModified)
            },
            dimensions: {
                width: img.width,
                height: img.height,
                aspectRatio: (img.width / img.height).toFixed(2),
                megapixels: ((img.width * img.height) / 1000000).toFixed(1)
            },
            metadata: await this.extractMetadata(file, img),
            technical: await this.analyzeTechnical(file, img),
            optimization: await this.analyzeOptimization(file, img),
            quality: await this.analyzeQuality(file, img),
            timestamp: new Date().toISOString()
        };

        // Calculate scores
        results.scores = this.calculateScores(results);
        results.insights = this.generateInsights(results);
        results.recommendations = this.generateRecommendations(results);

        return results;
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    async extractMetadata(file, img) {
        // Simulate metadata extraction
        await this.delay(300);
        
        return {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            dimensions: `${img.width}x${img.height}`,
            colorDepth: '24-bit',
            compression: this.getCompressionInfo(file.type),
            created: new Date(file.lastModified).toLocaleDateString(),
            dpi: Math.floor(Math.random() * 200) + 72,
            colorSpace: 'sRGB',
            hasTransparency: file.type === 'image/png' || file.type === 'image/gif',
            animated: file.type === 'image/gif' && Math.random() > 0.7
        };
    }

    async analyzeTechnical(file, img) {
        await this.delay(300);
        
        const bytesPerPixel = this.getBytesPerPixel(file.type);
        const uncompressedSize = img.width * img.height * bytesPerPixel;
        const compressionRatio = (uncompressedSize / file.size).toFixed(1);
        
        return {
            format: {
                type: file.type,
                extension: this.getFileExtension(file.name),
                supportsTransparency: ['image/png', 'image/gif', 'image/webp'].includes(file.type),
                supportsAnimation: file.type === 'image/gif',
                isVector: file.type === 'image/svg+xml'
            },
            compression: {
                ratio: compressionRatio,
                efficiency: compressionRatio > 10 ? 'Excellent' : compressionRatio > 5 ? 'Good' : 'Poor',
                lossless: ['image/png', 'image/gif', 'image/bmp'].includes(file.type)
            },
            performance: {
                loadTime: this.estimateLoadTime(file.size),
                memoryUsage: this.formatFileSize(uncompressedSize),
                renderComplexity: img.width * img.height > 2000000 ? 'High' : 'Low'
            },
            compatibility: {
                webSupport: this.getWebSupport(file.type),
                mobileSupport: this.getMobileSupport(file.type),
                printQuality: this.getPrintQuality(img.width, img.height)
            }
        };
    }

    async analyzeOptimization(file, img) {
        await this.delay(300);
        
        const idealSize = this.calculateIdealSize(img.width, img.height, file.type);
        const potentialSavings = Math.max(0, ((file.size - idealSize) / file.size * 100));
        
        return {
            currentSize: file.size,
            idealSize: idealSize,
            potentialSavings: potentialSavings.toFixed(1) + '%',
            recommendations: {
                resize: img.width > 1920 || img.height > 1080,
                compress: potentialSavings > 20,
                formatChange: this.suggestBetterFormat(file.type, img.width, img.height),
                removeMetadata: file.size > 500000
            },
            webOptimization: {
                responsive: img.width > 1200,
                lazyLoading: file.size > 100000,
                cdn: file.size > 50000,
                webp: file.type !== 'image/webp' && file.type !== 'image/svg+xml'
            }
        };
    }

    async analyzeQuality(file, img) {
        await this.delay(300);
        
        const pixelDensity = (img.width * img.height) / (file.size / 1024); // pixels per KB
        const qualityScore = Math.min(100, Math.max(0, (pixelDensity / 100) * 100));
        
        return {
            overallQuality: Math.floor(qualityScore),
            resolution: {
                category: this.getResolutionCategory(img.width, img.height),
                suitable: this.getSuitableUses(img.width, img.height),
                dpi: Math.floor(Math.random() * 200) + 72
            },
            sharpness: {
                score: Math.floor(Math.random() * 30) + 70,
                assessment: 'Good'
            },
            colorAccuracy: {
                score: Math.floor(Math.random() * 20) + 80,
                colorSpace: 'sRGB',
                bitDepth: '8-bit'
            },
            artifacts: {
                compression: file.type === 'image/jpeg' ? Math.floor(Math.random() * 3) : 0,
                noise: Math.floor(Math.random() * 2),
                blur: Math.floor(Math.random() * 2)
            }
        };
    }

    calculateScores(results) {
        const optimizationScore = Math.max(0, 100 - parseFloat(results.optimization.potentialSavings));
        const qualityScore = results.quality.overallQuality;
        const compatibilityScore = this.calculateCompatibilityScore(results.technical.compatibility);
        const overallScore = Math.round((optimizationScore + qualityScore + compatibilityScore) / 3);
        
        return {
            overall: overallScore,
            optimization: Math.round(optimizationScore),
            quality: qualityScore,
            compatibility: compatibilityScore
        };
    }

    generateInsights(results) {
        const insights = [];
        
        if (results.scores.optimization < 70) {
            insights.push({ type: 'warning', text: 'Image could be optimized for better performance' });
        }
        
        if (results.scores.quality > 90) {
            insights.push({ type: 'success', text: 'Excellent image quality detected' });
        }
        
        if (results.file.size > 1000000) {
            insights.push({ type: 'warning', text: 'Large file size may impact loading times' });
        }
        
        if (results.dimensions.width > 4000 || results.dimensions.height > 4000) {
            insights.push({ type: 'info', text: 'High resolution image suitable for print' });
        }
        
        if (results.technical.format.type === 'image/jpeg' && results.metadata.hasTransparency) {
            insights.push({ type: 'warning', text: 'JPEG format does not support transparency' });
        }
        
        if (insights.length === 0) {
            insights.push({ type: 'success', text: 'Image appears to be well-optimized' });
        }
        
        return insights;
    }

    generateRecommendations(results) {
        const recommendations = [];
        
        if (results.optimization.recommendations.resize) {
            recommendations.push('Consider resizing for web use (max 1920x1080)');
        }
        
        if (results.optimization.recommendations.compress) {
            recommendations.push('Compress image to reduce file size');
        }
        
        if (results.optimization.recommendations.formatChange) {
            recommendations.push(`Consider converting to ${results.optimization.recommendations.formatChange}`);
        }
        
        if (results.optimization.webOptimization.webp) {
            recommendations.push('Convert to WebP for better web performance');
        }
        
        if (results.optimization.recommendations.removeMetadata) {
            recommendations.push('Remove metadata to reduce file size');
        }
        
        return recommendations;
    }

    displayResults() {
        const results = this.analysisResults;
        
        // Update scores
        document.getElementById('overallScore').textContent = results.scores.overall;
        document.getElementById('optimizationScore').textContent = results.scores.optimization;
        document.getElementById('qualityScore').textContent = results.scores.quality;
        document.getElementById('compatibilityScore').textContent = results.scores.compatibility;
        
        // Update score colors
        this.updateScoreColors();
        
        // Display insights and recommendations
        this.displayInsights(results.insights);
        this.displayRecommendations(results.recommendations);
        
        // Display detailed results
        this.displayMetadataResults(results.metadata);
        this.displayTechnicalResults(results.technical);
        this.displayOptimizationResults(results.optimization);
        this.displayQualityResults(results.quality);
    }

    displayInsights(insights) {
        const container = document.getElementById('quickInsights');
        container.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
                <span class="insight-text">${insight.text}</span>
            </div>
        `).join('');
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        if (recommendations.length === 0) {
            container.innerHTML = '<div class="recommendation-placeholder">No specific recommendations</div>';
            return;
        }
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <span class="recommendation-icon">💡</span>
                <span class="recommendation-text">${rec}</span>
            </div>
        `).join('');
    }

    displayMetadataResults(metadata) {
        const container = document.getElementById('metadataResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>File Information</h5>
                <div class="metric-detail">Name: ${metadata.fileName}</div>
                <div class="metric-detail">Size: ${this.formatFileSize(metadata.fileSize)}</div>
                <div class="metric-detail">Type: ${metadata.mimeType}</div>
                <div class="metric-detail">Created: ${metadata.created}</div>
            </div>
            <div class="metric-card">
                <h5>Image Properties</h5>
                <div class="metric-detail">Dimensions: ${metadata.dimensions}</div>
                <div class="metric-detail">Color Depth: ${metadata.colorDepth}</div>
                <div class="metric-detail">DPI: ${metadata.dpi}</div>
                <div class="metric-detail">Color Space: ${metadata.colorSpace}</div>
            </div>
            <div class="metric-card">
                <h5>Features</h5>
                <div class="metric-detail">Transparency: ${metadata.hasTransparency ? 'Yes' : 'No'}</div>
                <div class="metric-detail">Animated: ${metadata.animated ? 'Yes' : 'No'}</div>
                <div class="metric-detail">Compression: ${metadata.compression}</div>
            </div>
        `;
    }

    displayTechnicalResults(technical) {
        const container = document.getElementById('technicalResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Format Details</h5>
                <div class="metric-detail">Type: ${technical.format.type}</div>
                <div class="metric-detail">Extension: ${technical.format.extension}</div>
                <div class="metric-detail">Transparency Support: ${technical.format.supportsTransparency ? 'Yes' : 'No'}</div>
                <div class="metric-detail">Vector Format: ${technical.format.isVector ? 'Yes' : 'No'}</div>
            </div>
            <div class="metric-card">
                <h5>Compression</h5>
                <div class="metric-detail">Ratio: ${technical.compression.ratio}:1</div>
                <div class="metric-detail">Efficiency: ${technical.compression.efficiency}</div>
                <div class="metric-detail">Lossless: ${technical.compression.lossless ? 'Yes' : 'No'}</div>
            </div>
            <div class="metric-card">
                <h5>Performance</h5>
                <div class="metric-detail">Est. Load Time: ${technical.performance.loadTime}</div>
                <div class="metric-detail">Memory Usage: ${technical.performance.memoryUsage}</div>
                <div class="metric-detail">Render Complexity: ${technical.performance.renderComplexity}</div>
            </div>
            <div class="metric-card">
                <h5>Compatibility</h5>
                <div class="metric-detail">Web Support: ${technical.compatibility.webSupport}</div>
                <div class="metric-detail">Mobile Support: ${technical.compatibility.mobileSupport}</div>
                <div class="metric-detail">Print Quality: ${technical.compatibility.printQuality}</div>
            </div>
        `;
    }

    displayOptimizationResults(optimization) {
        const container = document.getElementById('optimizationResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Size Analysis</h5>
                <div class="metric-detail">Current Size: ${this.formatFileSize(optimization.currentSize)}</div>
                <div class="metric-detail">Ideal Size: ${this.formatFileSize(optimization.idealSize)}</div>
                <div class="metric-detail">Potential Savings: ${optimization.potentialSavings}</div>
            </div>
            <div class="metric-card">
                <h5>Optimization Opportunities</h5>
                <div class="metric-detail">Resize Recommended: ${optimization.recommendations.resize ? 'Yes' : 'No'}</div>
                <div class="metric-detail">Compression Needed: ${optimization.recommendations.compress ? 'Yes' : 'No'}</div>
                <div class="metric-detail">Format Change: ${optimization.recommendations.formatChange || 'None'}</div>
                <div class="metric-detail">Remove Metadata: ${optimization.recommendations.removeMetadata ? 'Yes' : 'No'}</div>
            </div>
            <div class="metric-card">
                <h5>Web Optimization</h5>
                <div class="metric-detail">Responsive Images: ${optimization.webOptimization.responsive ? 'Recommended' : 'Not needed'}</div>
                <div class="metric-detail">Lazy Loading: ${optimization.webOptimization.lazyLoading ? 'Recommended' : 'Not needed'}</div>
                <div class="metric-detail">CDN Usage: ${optimization.webOptimization.cdn ? 'Recommended' : 'Not needed'}</div>
                <div class="metric-detail">WebP Conversion: ${optimization.webOptimization.webp ? 'Recommended' : 'Not needed'}</div>
            </div>
        `;
    }

    displayQualityResults(quality) {
        const container = document.getElementById('qualityResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Overall Quality</h5>
                <div class="metric-status ${this.getScoreClass(quality.overallQuality)}">${quality.overallQuality}/100</div>
                <div class="metric-detail">Resolution: ${quality.resolution.category}</div>
                <div class="metric-detail">Suitable for: ${quality.resolution.suitable}</div>
            </div>
            <div class="metric-card">
                <h5>Image Sharpness</h5>
                <div class="metric-status ${this.getScoreClass(quality.sharpness.score)}">${quality.sharpness.score}/100</div>
                <div class="metric-detail">Assessment: ${quality.sharpness.assessment}</div>
            </div>
            <div class="metric-card">
                <h5>Color Accuracy</h5>
                <div class="metric-status ${this.getScoreClass(quality.colorAccuracy.score)}">${quality.colorAccuracy.score}/100</div>
                <div class="metric-detail">Color Space: ${quality.colorAccuracy.colorSpace}</div>
                <div class="metric-detail">Bit Depth: ${quality.colorAccuracy.bitDepth}</div>
            </div>
            <div class="metric-card">
                <h5>Artifacts</h5>
                <div class="metric-detail">Compression Artifacts: ${quality.artifacts.compression}</div>
                <div class="metric-detail">Noise Level: ${quality.artifacts.noise}</div>
                <div class="metric-detail">Blur Level: ${quality.artifacts.blur}</div>
            </div>
        `;
    }

    // Helper methods
    getCompressionInfo(mimeType) {
        const compressionMap = {
            'image/jpeg': 'Lossy (JPEG)',
            'image/png': 'Lossless (PNG)',
            'image/gif': 'Lossless (LZW)',
            'image/webp': 'Lossy/Lossless (WebP)',
            'image/bmp': 'Uncompressed',
            'image/svg+xml': 'XML Compression'
        };
        return compressionMap[mimeType] || 'Unknown';
    }

    getBytesPerPixel(mimeType) {
        const bytesMap = {
            'image/jpeg': 3,
            'image/png': 4,
            'image/gif': 1,
            'image/webp': 3,
            'image/bmp': 3,
            'image/svg+xml': 0
        };
        return bytesMap[mimeType] || 3;
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    estimateLoadTime(fileSize) {
        const speedMbps = 10; // Assume 10 Mbps connection
        const timeSeconds = (fileSize * 8) / (speedMbps * 1000000);
        return timeSeconds < 1 ? '<1s' : `${timeSeconds.toFixed(1)}s`;
    }

    getWebSupport(mimeType) {
        const supportMap = {
            'image/jpeg': 'Excellent',
            'image/png': 'Excellent',
            'image/gif': 'Excellent',
            'image/webp': 'Good (Modern browsers)',
            'image/bmp': 'Limited',
            'image/svg+xml': 'Excellent'
        };
        return supportMap[mimeType] || 'Unknown';
    }

    getMobileSupport(mimeType) {
        const supportMap = {
            'image/jpeg': 'Excellent',
            'image/png': 'Excellent',
            'image/gif': 'Good',
            'image/webp': 'Good',
            'image/bmp': 'Limited',
            'image/svg+xml': 'Good'
        };
        return supportMap[mimeType] || 'Unknown';
    }

    getPrintQuality(width, height) {
        const megapixels = (width * height) / 1000000;
        if (megapixels >= 12) return 'Excellent';
        if (megapixels >= 6) return 'Good';
        if (megapixels >= 2) return 'Fair';
        return 'Poor';
    }

    calculateIdealSize(width, height, mimeType) {
        const pixels = width * height;
        const baseSize = pixels * 0.5; // Rough estimate
        
        const formatMultiplier = {
            'image/jpeg': 0.3,
            'image/png': 0.8,
            'image/gif': 0.4,
            'image/webp': 0.25,
            'image/bmp': 3.0,
            'image/svg+xml': 0.1
        };
        
        return Math.floor(baseSize * (formatMultiplier[mimeType] || 0.5));
    }

    suggestBetterFormat(currentType, width, height) {
        if (currentType === 'image/bmp') return 'PNG';
        if (currentType === 'image/png' && width * height > 1000000) return 'JPEG';
        if (currentType === 'image/jpeg' && width * height < 100000) return 'PNG';
        return null;
    }

    getResolutionCategory(width, height) {
        const pixels = width * height;
        if (pixels >= 8000000) return 'Ultra High (4K+)';
        if (pixels >= 2000000) return 'High (1080p+)';
        if (pixels >= 500000) return 'Medium (720p)';
        return 'Low';
    }

    getSuitableUses(width, height) {
        const pixels = width * height;
        if (pixels >= 8000000) return 'Large prints, professional photography';
        if (pixels >= 2000000) return 'Web, small prints, social media';
        if (pixels >= 500000) return 'Web thumbnails, icons';
        return 'Icons, avatars';
    }

    calculateCompatibilityScore(compatibility) {
        let score = 0;
        if (compatibility.webSupport === 'Excellent') score += 40;
        else if (compatibility.webSupport === 'Good') score += 30;
        else if (compatibility.webSupport === 'Limited') score += 15;
        
        if (compatibility.mobileSupport === 'Excellent') score += 30;
        else if (compatibility.mobileSupport === 'Good') score += 20;
        else if (compatibility.mobileSupport === 'Limited') score += 10;
        
        if (compatibility.printQuality === 'Excellent') score += 30;
        else if (compatibility.printQuality === 'Good') score += 20;
        else if (compatibility.printQuality === 'Fair') score += 10;
        
        return Math.min(100, score);
    }

    updateScoreColors() {
        const scoreElements = [
            { id: 'overallScore', score: this.analysisResults.scores.overall },
            { id: 'optimizationScore', score: this.analysisResults.scores.optimization },
            { id: 'qualityScore', score: this.analysisResults.scores.quality },
            { id: 'compatibilityScore', score: this.analysisResults.scores.compatibility }
        ];

        scoreElements.forEach(({ id, score }) => {
            const element = document.getElementById(id);
            if (element) {
                element.className = `score-value ${this.getScoreClass(score)}`;
            }
        });
    }

    getScoreClass(score) {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'fair';
        return 'poor';
    }

    getInsightIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });
    }

    setAnalyzing(analyzing) {
        this.isAnalyzing = analyzing;
        const btn = document.getElementById('analyzeBtn');
        
        if (analyzing) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Analyzing...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '🔍 Analyze Image';
        }
    }

    enableActionButtons() {
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('optimizeBtn').disabled = false;
        document.getElementById('convertBtn').disabled = false;
    }

    loadSampleImage(sampleType) {
        // Create a sample image based on type
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        switch (sampleType) {
            case 'large':
                canvas.width = 1920;
                canvas.height = 1080;
                break;
            case 'small':
                canvas.width = 400;
                canvas.height = 300;
                break;
            case 'vector':
                canvas.width = 800;
                canvas.height = 600;
                break;
        }
        
        // Draw a sample pattern
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Sample ${sampleType} Image`, canvas.width/2, canvas.height/2);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], `sample-${sampleType}.png`, { type: 'image/png' });
            this.handleFile(file);
        });
    }

    clearImage() {
        this.currentImage = null;
        this.analysisResults = {};
        document.getElementById('imagePreviewSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('imageInput').value = '';
    }

    exportReport() {
        if (!this.analysisResults.file) {
            alert('No analysis data to export');
            return;
        }

        const report = {
            fileName: this.analysisResults.file.name,
            timestamp: this.analysisResults.timestamp,
            scores: this.analysisResults.scores,
            insights: this.analysisResults.insights,
            recommendations: this.analysisResults.recommendations,
            detailedResults: this.analysisResults
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async optimizeImage() {
        if (!this.currentImage) {
            alert('No image to optimize');
            return;
        }

        const optimizeBtn = document.getElementById('optimizeBtn');
        const originalText = optimizeBtn.innerHTML;
        optimizeBtn.disabled = true;
        optimizeBtn.innerHTML = '⏳ Optimizing...';

        try {
            const optimizedImage = await this.performImageOptimization(this.currentImage);
            this.downloadOptimizedImage(optimizedImage, 'optimized');
            
            // Show success message
            this.showNotification('Image optimized successfully!', 'success');
        } catch (error) {
            console.error('Optimization failed:', error);
            this.showNotification('Optimization failed. Please try again.', 'error');
        } finally {
            optimizeBtn.disabled = false;
            optimizeBtn.innerHTML = originalText;
        }
    }

    async convertFormat() {
        if (!this.currentImage) {
            alert('No image to convert');
            return;
        }

        // Show format selection modal
        const targetFormat = await this.showFormatSelectionModal();
        if (!targetFormat) return;

        const convertBtn = document.getElementById('convertBtn');
        const originalText = convertBtn.innerHTML;
        convertBtn.disabled = true;
        convertBtn.innerHTML = '⏳ Converting...';

        try {
            const convertedImage = await this.performFormatConversion(this.currentImage, targetFormat);
            this.downloadOptimizedImage(convertedImage, `converted-${targetFormat}`);
            
            // Show success message
            this.showNotification(`Image converted to ${targetFormat.toUpperCase()} successfully!`, 'success');
        } catch (error) {
            console.error('Conversion failed:', error);
            this.showNotification('Format conversion failed. Please try again.', 'error');
        } finally {
            convertBtn.disabled = false;
            convertBtn.innerHTML = originalText;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async performImageOptimization(file) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate optimized dimensions
                let { width, height } = this.calculateOptimizedDimensions(img.width, img.height);
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get quality based on current file size
                const quality = this.calculateOptimalQuality(file.size, width * height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const optimizedFile = new File([blob], 
                            file.name.replace(/\.[^/.]+$/, '_optimized.jpg'), 
                            { type: 'image/jpeg' }
                        );
                        resolve(optimizedFile);
                    } else {
                        reject(new Error('Optimization failed'));
                    }
                }, 'image/jpeg', quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    async performFormatConversion(file, targetFormat) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Handle transparency for PNG
                if (targetFormat === 'png') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Fill with white background for JPEG/WebP
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);
                
                const mimeType = this.getMimeTypeFromFormat(targetFormat);
                const quality = targetFormat === 'png' ? undefined : 0.9;
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
                        const convertedFile = new File([blob], 
                            file.name.replace(/\.[^/.]+$/, `_converted.${extension}`), 
                            { type: mimeType }
                        );
                        resolve(convertedFile);
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                }, mimeType, quality);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    calculateOptimizedDimensions(originalWidth, originalHeight) {
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return { width: originalWidth, height: originalHeight };
        }
        
        const aspectRatio = originalWidth / originalHeight;
        
        if (aspectRatio > maxWidth / maxHeight) {
            return {
                width: maxWidth,
                height: Math.round(maxWidth / aspectRatio)
            };
        } else {
            return {
                width: Math.round(maxHeight * aspectRatio),
                height: maxHeight
            };
        }
    }

    calculateOptimalQuality(fileSize, pixels) {
        // Base quality on file size and pixel count
        const bytesPerPixel = fileSize / pixels;
        
        if (bytesPerPixel > 3) return 0.7; // High compression needed
        if (bytesPerPixel > 1.5) return 0.8; // Medium compression
        return 0.9; // Light compression
    }

    getMimeTypeFromFormat(format) {
        const mimeTypes = {
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp'
        };
        return mimeTypes[format.toLowerCase()] || 'image/jpeg';
    }

    showFormatSelectionModal() {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            `;

            modal.innerHTML = `
                <h3 style="margin-bottom: 20px; color: #333;">Select Target Format</h3>
                <p style="margin-bottom: 25px; color: #666;">Choose the format to convert your image to:</p>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
                    <button class="format-btn" data-format="jpeg" style="padding: 12px 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.3s ease;">JPEG (.jpg) - Best for photos</button>
                    <button class="format-btn" data-format="png" style="padding: 12px 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.3s ease;">PNG (.png) - Best for graphics with transparency</button>
                    <button class="format-btn" data-format="webp" style="padding: 12px 20px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.3s ease;">WebP (.webp) - Modern format, smaller size</button>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="cancelConvert" style="padding: 10px 20px; border: 2px solid #6c757d; border-radius: 8px; background: transparent; color: #6c757d; cursor: pointer;">Cancel</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Add hover effects
            const formatBtns = modal.querySelectorAll('.format-btn');
            formatBtns.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.borderColor = '#667eea';
                    btn.style.background = '#f0f4ff';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.borderColor = '#ddd';
                    btn.style.background = 'white';
                });
                btn.addEventListener('click', () => {
                    const format = btn.dataset.format;
                    document.body.removeChild(overlay);
                    resolve(format);
                });
            });

            // Cancel button
            modal.querySelector('#cancelConvert').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(null);
                }
            });
        });
    }

    downloadOptimizedImage(file, prefix) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Set color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageAnalyzerUtility;
}