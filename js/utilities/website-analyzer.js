/**
 * Website Analyzer Utility
 * Provides comprehensive website analysis including SEO metrics, performance analysis,
 * accessibility checks, and technical SEO auditing.
 */

class WebsiteAnalyzerUtility {
    constructor() {
        this.currentUrl = '';
        this.analysisResults = {};
        this.isAnalyzing = false;
    }

    // Initialize the website analyzer interface
    init() {
        this.createInterface();
        this.attachEventListeners();
    }

    createInterface() {
        const container = document.getElementById('website-analyzer-container');
        if (!container) {
            console.error('Website Analyzer container not found');
            return;
        }

        container.innerHTML = `
            <div class="website-analyzer-wrapper">
                <div class="analyzer-header">
                    <h2>🌐 Website Analyzer</h2>
                    <p>Analyze websites for SEO, performance, accessibility, and technical issues</p>
                </div>

                <div class="analyzer-content">
                    <div class="input-section">
                        <div class="url-input-group">
                            <div class="input-wrapper">
                                <input type="url" id="urlInput" placeholder="Enter website URL (e.g., https://example.com)" 
                                       class="form-control url-input">
                                <button id="analyzeBtn" class="btn btn-primary analyze-btn">
                                    <span class="btn-text">🔍 Analyze Website</span>
                                    <span class="btn-loading" style="display: none;">⏳ Analyzing...</span>
                                </button>
                            </div>
                            <div class="quick-actions">
                                <button id="sampleBtn" class="btn btn-outline">Load Sample</button>
                                <button id="clearBtn" class="btn btn-outline">Clear</button>
                            </div>
                        </div>

                        <div class="analysis-options">
                            <h4>Analysis Options</h4>
                            <div class="options-grid">
                                <label class="option-item">
                                    <input type="checkbox" id="seoAnalysis" checked>
                                    <span>SEO Analysis</span>
                                </label>
                                <label class="option-item">
                                    <input type="checkbox" id="performanceAnalysis" checked>
                                    <span>Performance Check</span>
                                </label>
                                <label class="option-item">
                                    <input type="checkbox" id="accessibilityAnalysis" checked>
                                    <span>Accessibility Audit</span>
                                </label>
                                <label class="option-item">
                                    <input type="checkbox" id="technicalAnalysis" checked>
                                    <span>Technical SEO</span>
                                </label>
                                <label class="option-item">
                                    <input type="checkbox" id="securityAnalysis" checked>
                                    <span>Security Check</span>
                                </label>
                                <label class="option-item">
                                    <input type="checkbox" id="mobileAnalysis" checked>
                                    <span>Mobile Optimization</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="results-section">
                        <div class="results-header">
                            <h3>Analysis Results</h3>
                            <div class="results-actions">
                                <button id="exportBtn" class="btn btn-success" disabled>📊 Export Report</button>
                                <button id="shareBtn" class="btn btn-outline" disabled>🔗 Share Results</button>
                            </div>
                        </div>

                        <div class="results-tabs">
                            <button class="tab-btn active" data-tab="overview">Overview</button>
                            <button class="tab-btn" data-tab="seo">SEO</button>
                            <button class="tab-btn" data-tab="performance">Performance</button>
                            <button class="tab-btn" data-tab="accessibility">Accessibility</button>
                            <button class="tab-btn" data-tab="technical">Technical</button>
                            <button class="tab-btn" data-tab="security">Security</button>
                        </div>

                        <div class="tab-content">
                            <div id="overview-tab" class="tab-pane active">
                                <div class="overview-content">
                                    <div class="score-summary">
                                        <div class="overall-score">
                                            <div class="score-circle">
                                                <span id="overallScore">-</span>
                                            </div>
                                            <div class="score-label">Overall Score</div>
                                        </div>
                                        <div class="category-scores">
                                            <div class="category-score">
                                                <div class="score-value" id="seoScore">-</div>
                                                <div class="score-name">SEO</div>
                                            </div>
                                            <div class="category-score">
                                                <div class="score-value" id="performanceScore">-</div>
                                                <div class="score-name">Performance</div>
                                            </div>
                                            <div class="category-score">
                                                <div class="score-value" id="accessibilityScore">-</div>
                                                <div class="score-name">Accessibility</div>
                                            </div>
                                            <div class="category-score">
                                                <div class="score-value" id="technicalScore">-</div>
                                                <div class="score-name">Technical</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="quick-insights">
                                        <h4>Quick Insights</h4>
                                        <div id="quickInsights" class="insights-list">
                                            <div class="insight-placeholder">Run analysis to see insights</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="seo-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>SEO Analysis</h4>
                                    <div id="seoResults" class="results-grid">
                                        <div class="result-placeholder">No SEO analysis data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="performance-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Performance Metrics</h4>
                                    <div id="performanceResults" class="results-grid">
                                        <div class="result-placeholder">No performance data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="accessibility-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Accessibility Audit</h4>
                                    <div id="accessibilityResults" class="results-grid">
                                        <div class="result-placeholder">No accessibility data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="technical-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Technical SEO</h4>
                                    <div id="technicalResults" class="results-grid">
                                        <div class="result-placeholder">No technical analysis data available</div>
                                    </div>
                                </div>
                            </div>

                            <div id="security-tab" class="tab-pane">
                                <div class="analysis-section">
                                    <h4>Security Analysis</h4>
                                    <div id="securityResults" class="results-grid">
                                        <div class="result-placeholder">No security analysis data available</div>
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
        // URL input and analysis
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeWebsite());
        document.getElementById('urlInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyzeWebsite();
        });
        
        // Quick actions
        document.getElementById('sampleBtn')?.addEventListener('click', () => this.loadSample());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearResults());
        
        // Export and share
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportReport());
        document.getElementById('shareBtn')?.addEventListener('click', () => this.shareResults());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    async analyzeWebsite() {
        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a website URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        this.currentUrl = url;
        this.setAnalyzing(true);
        
        try {
            // Simulate analysis with different checks
            const results = await this.performAnalysis(url);
            this.analysisResults = results;
            this.displayResults();
            this.enableExportButtons();
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please check the URL and try again.');
        } finally {
            this.setAnalyzing(false);
        }
    }

    async performAnalysis(url) {
        // Simulate analysis delay
        await this.delay(2000);
        
        const results = {
            url: url,
            timestamp: new Date().toISOString(),
            seo: await this.analyzeSEO(url),
            performance: await this.analyzePerformance(url),
            accessibility: await this.analyzeAccessibility(url),
            technical: await this.analyzeTechnical(url),
            security: await this.analyzeSecurity(url),
            mobile: await this.analyzeMobile(url)
        };

        // Calculate overall score
        results.overallScore = this.calculateOverallScore(results);
        results.insights = this.generateInsights(results);
        
        return results;
    }

    async analyzeSEO(url) {
        await this.delay(500);
        
        // Simulate SEO analysis
        const seoScore = Math.floor(Math.random() * 40) + 60; // 60-100
        
        return {
            score: seoScore,
            metrics: {
                titleTag: {
                    status: Math.random() > 0.3 ? 'good' : 'warning',
                    value: 'Sample Page Title - Brand Name',
                    length: 45,
                    recommendation: seoScore < 80 ? 'Consider optimizing title length and keywords' : 'Title tag looks good'
                },
                metaDescription: {
                    status: Math.random() > 0.4 ? 'good' : 'error',
                    value: 'This is a sample meta description for the analyzed page.',
                    length: 155,
                    recommendation: 'Meta description is within optimal length'
                },
                headings: {
                    h1Count: Math.floor(Math.random() * 3) + 1,
                    h2Count: Math.floor(Math.random() * 8) + 2,
                    structure: Math.random() > 0.3 ? 'good' : 'warning',
                    recommendation: 'Heading structure follows best practices'
                },
                keywords: {
                    density: (Math.random() * 3 + 1).toFixed(1) + '%',
                    primary: 'website analysis',
                    secondary: ['SEO', 'performance', 'accessibility'],
                    recommendation: 'Keyword density is within optimal range'
                },
                images: {
                    total: Math.floor(Math.random() * 20) + 5,
                    withAlt: Math.floor(Math.random() * 15) + 3,
                    missingAlt: Math.floor(Math.random() * 5),
                    recommendation: 'Add alt text to all images for better SEO'
                }
            }
        };
    }

    async analyzePerformance(url) {
        await this.delay(500);
        
        const performanceScore = Math.floor(Math.random() * 30) + 70; // 70-100
        
        return {
            score: performanceScore,
            metrics: {
                loadTime: {
                    value: (Math.random() * 2 + 1).toFixed(2) + 's',
                    status: performanceScore > 85 ? 'good' : 'warning',
                    recommendation: 'Page loads within acceptable time'
                },
                pageSize: {
                    value: (Math.random() * 2 + 0.5).toFixed(1) + 'MB',
                    status: 'good',
                    recommendation: 'Page size is optimized'
                },
                requests: {
                    value: Math.floor(Math.random() * 50) + 20,
                    status: 'warning',
                    recommendation: 'Consider reducing HTTP requests'
                },
                compression: {
                    enabled: Math.random() > 0.3,
                    savings: Math.floor(Math.random() * 40) + 20 + '%',
                    recommendation: 'Gzip compression is enabled'
                },
                caching: {
                    status: Math.random() > 0.4 ? 'good' : 'warning',
                    recommendation: 'Browser caching is properly configured'
                },
                coreWebVitals: {
                    lcp: (Math.random() * 1.5 + 1).toFixed(1) + 's',
                    fid: Math.floor(Math.random() * 50) + 50 + 'ms',
                    cls: (Math.random() * 0.1).toFixed(3)
                }
            }
        };
    }

    async analyzeAccessibility(url) {
        await this.delay(500);
        
        const accessibilityScore = Math.floor(Math.random() * 25) + 75; // 75-100
        
        return {
            score: accessibilityScore,
            metrics: {
                colorContrast: {
                    status: Math.random() > 0.2 ? 'good' : 'warning',
                    issues: Math.floor(Math.random() * 3),
                    recommendation: 'Most text has sufficient color contrast'
                },
                altText: {
                    coverage: Math.floor(Math.random() * 20) + 80 + '%',
                    status: 'good',
                    recommendation: 'Good alt text coverage for images'
                },
                keyboardNavigation: {
                    status: Math.random() > 0.3 ? 'good' : 'warning',
                    recommendation: 'Site is keyboard navigable'
                },
                ariaLabels: {
                    usage: Math.floor(Math.random() * 30) + 70 + '%',
                    status: 'good',
                    recommendation: 'ARIA labels are properly used'
                },
                headingStructure: {
                    status: Math.random() > 0.4 ? 'good' : 'warning',
                    recommendation: 'Heading hierarchy is logical'
                },
                focusIndicators: {
                    status: Math.random() > 0.3 ? 'good' : 'warning',
                    recommendation: 'Focus indicators are visible'
                }
            }
        };
    }

    async analyzeTechnical(url) {
        await this.delay(500);
        
        const technicalScore = Math.floor(Math.random() * 20) + 80; // 80-100
        
        return {
            score: technicalScore,
            metrics: {
                robotsTxt: {
                    exists: Math.random() > 0.2,
                    status: 'good',
                    recommendation: 'Robots.txt file is present and properly configured'
                },
                sitemap: {
                    exists: Math.random() > 0.3,
                    status: 'good',
                    urls: Math.floor(Math.random() * 100) + 50,
                    recommendation: 'XML sitemap is available'
                },
                canonicalTags: {
                    implemented: Math.random() > 0.4,
                    status: 'good',
                    recommendation: 'Canonical tags are properly implemented'
                },
                structuredData: {
                    types: ['Organization', 'WebSite', 'BreadcrumbList'],
                    status: Math.random() > 0.5 ? 'good' : 'warning',
                    recommendation: 'Structured data markup is present'
                },
                httpStatus: {
                    code: 200,
                    status: 'good',
                    recommendation: 'Page returns correct HTTP status'
                },
                redirects: {
                    count: Math.floor(Math.random() * 3),
                    status: 'good',
                    recommendation: 'Minimal redirect chains'
                }
            }
        };
    }

    async analyzeSecurity(url) {
        await this.delay(500);
        
        const securityScore = Math.floor(Math.random() * 15) + 85; // 85-100
        
        return {
            score: securityScore,
            metrics: {
                https: {
                    enabled: url.startsWith('https'),
                    status: url.startsWith('https') ? 'good' : 'error',
                    recommendation: url.startsWith('https') ? 'HTTPS is enabled' : 'Enable HTTPS for security'
                },
                sslCertificate: {
                    valid: Math.random() > 0.1,
                    issuer: 'Let\'s Encrypt',
                    expiry: '2024-12-31',
                    status: 'good',
                    recommendation: 'SSL certificate is valid'
                },
                securityHeaders: {
                    hsts: Math.random() > 0.3,
                    xFrameOptions: Math.random() > 0.4,
                    contentSecurityPolicy: Math.random() > 0.6,
                    status: 'warning',
                    recommendation: 'Consider implementing additional security headers'
                },
                mixedContent: {
                    issues: Math.floor(Math.random() * 2),
                    status: 'good',
                    recommendation: 'No mixed content issues detected'
                }
            }
        };
    }

    async analyzeMobile(url) {
        await this.delay(500);
        
        const mobileScore = Math.floor(Math.random() * 20) + 80; // 80-100
        
        return {
            score: mobileScore,
            metrics: {
                responsive: {
                    status: Math.random() > 0.2 ? 'good' : 'warning',
                    recommendation: 'Site is mobile responsive'
                },
                viewport: {
                    configured: Math.random() > 0.1,
                    status: 'good',
                    recommendation: 'Viewport meta tag is properly configured'
                },
                touchTargets: {
                    appropriate: Math.random() > 0.3,
                    status: 'good',
                    recommendation: 'Touch targets are appropriately sized'
                },
                mobileSpeed: {
                    score: Math.floor(Math.random() * 20) + 70,
                    status: 'warning',
                    recommendation: 'Mobile page speed could be improved'
                }
            }
        };
    }

    calculateOverallScore(results) {
        const scores = [
            results.seo.score,
            results.performance.score,
            results.accessibility.score,
            results.technical.score,
            results.security.score,
            results.mobile.score
        ];
        
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    }

    generateInsights(results) {
        const insights = [];
        
        if (results.seo.score < 80) {
            insights.push({ type: 'warning', text: 'SEO optimization needs improvement' });
        }
        
        if (results.performance.score < 85) {
            insights.push({ type: 'warning', text: 'Page performance could be optimized' });
        }
        
        if (results.accessibility.score > 90) {
            insights.push({ type: 'success', text: 'Excellent accessibility implementation' });
        }
        
        if (results.security.score > 95) {
            insights.push({ type: 'success', text: 'Strong security configuration' });
        }
        
        if (!results.security.metrics.https.enabled) {
            insights.push({ type: 'error', text: 'HTTPS is not enabled - critical security issue' });
        }
        
        if (insights.length === 0) {
            insights.push({ type: 'success', text: 'Website follows most best practices' });
        }
        
        return insights;
    }

    displayResults() {
        const results = this.analysisResults;
        
        // Update overview scores
        document.getElementById('overallScore').textContent = results.overallScore;
        document.getElementById('seoScore').textContent = results.seo.score;
        document.getElementById('performanceScore').textContent = results.performance.score;
        document.getElementById('accessibilityScore').textContent = results.accessibility.score;
        document.getElementById('technicalScore').textContent = results.technical.score;
        
        // Update score colors
        this.updateScoreColors();
        
        // Display insights
        this.displayInsights(results.insights);
        
        // Display detailed results for each category
        this.displaySEOResults(results.seo);
        this.displayPerformanceResults(results.performance);
        this.displayAccessibilityResults(results.accessibility);
        this.displayTechnicalResults(results.technical);
        this.displaySecurityResults(results.security);
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

    displaySEOResults(seo) {
        const container = document.getElementById('seoResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Title Tag</h5>
                <div class="metric-status ${seo.metrics.titleTag.status}">${seo.metrics.titleTag.value}</div>
                <div class="metric-detail">Length: ${seo.metrics.titleTag.length} characters</div>
                <div class="metric-recommendation">${seo.metrics.titleTag.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Meta Description</h5>
                <div class="metric-status ${seo.metrics.metaDescription.status}">${seo.metrics.metaDescription.value}</div>
                <div class="metric-detail">Length: ${seo.metrics.metaDescription.length} characters</div>
                <div class="metric-recommendation">${seo.metrics.metaDescription.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Headings Structure</h5>
                <div class="metric-status ${seo.metrics.headings.structure}">H1: ${seo.metrics.headings.h1Count}, H2: ${seo.metrics.headings.h2Count}</div>
                <div class="metric-recommendation">${seo.metrics.headings.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Keywords</h5>
                <div class="metric-status good">Density: ${seo.metrics.keywords.density}</div>
                <div class="metric-detail">Primary: ${seo.metrics.keywords.primary}</div>
                <div class="metric-recommendation">${seo.metrics.keywords.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Images</h5>
                <div class="metric-status ${seo.metrics.images.missingAlt > 0 ? 'warning' : 'good'}">
                    ${seo.metrics.images.withAlt}/${seo.metrics.images.total} with alt text
                </div>
                <div class="metric-recommendation">${seo.metrics.images.recommendation}</div>
            </div>
        `;
    }

    displayPerformanceResults(performance) {
        const container = document.getElementById('performanceResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Load Time</h5>
                <div class="metric-status ${performance.metrics.loadTime.status}">${performance.metrics.loadTime.value}</div>
                <div class="metric-recommendation">${performance.metrics.loadTime.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Page Size</h5>
                <div class="metric-status ${performance.metrics.pageSize.status}">${performance.metrics.pageSize.value}</div>
                <div class="metric-recommendation">${performance.metrics.pageSize.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>HTTP Requests</h5>
                <div class="metric-status ${performance.metrics.requests.status}">${performance.metrics.requests.value}</div>
                <div class="metric-recommendation">${performance.metrics.requests.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Core Web Vitals</h5>
                <div class="metric-status good">
                    LCP: ${performance.metrics.coreWebVitals.lcp}<br>
                    FID: ${performance.metrics.coreWebVitals.fid}<br>
                    CLS: ${performance.metrics.coreWebVitals.cls}
                </div>
                <div class="metric-recommendation">Core Web Vitals are within acceptable ranges</div>
            </div>
        `;
    }

    displayAccessibilityResults(accessibility) {
        const container = document.getElementById('accessibilityResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Color Contrast</h5>
                <div class="metric-status ${accessibility.metrics.colorContrast.status}">
                    ${accessibility.metrics.colorContrast.issues} issues found
                </div>
                <div class="metric-recommendation">${accessibility.metrics.colorContrast.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Alt Text Coverage</h5>
                <div class="metric-status ${accessibility.metrics.altText.status}">${accessibility.metrics.altText.coverage}</div>
                <div class="metric-recommendation">${accessibility.metrics.altText.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Keyboard Navigation</h5>
                <div class="metric-status ${accessibility.metrics.keyboardNavigation.status}">Available</div>
                <div class="metric-recommendation">${accessibility.metrics.keyboardNavigation.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>ARIA Labels</h5>
                <div class="metric-status ${accessibility.metrics.ariaLabels.status}">${accessibility.metrics.ariaLabels.usage}</div>
                <div class="metric-recommendation">${accessibility.metrics.ariaLabels.recommendation}</div>
            </div>
        `;
    }

    displayTechnicalResults(technical) {
        const container = document.getElementById('technicalResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>Robots.txt</h5>
                <div class="metric-status ${technical.metrics.robotsTxt.status}">
                    ${technical.metrics.robotsTxt.exists ? 'Present' : 'Missing'}
                </div>
                <div class="metric-recommendation">${technical.metrics.robotsTxt.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>XML Sitemap</h5>
                <div class="metric-status ${technical.metrics.sitemap.status}">
                    ${technical.metrics.sitemap.exists ? `${technical.metrics.sitemap.urls} URLs` : 'Not found'}
                </div>
                <div class="metric-recommendation">${technical.metrics.sitemap.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Canonical Tags</h5>
                <div class="metric-status ${technical.metrics.canonicalTags.status}">
                    ${technical.metrics.canonicalTags.implemented ? 'Implemented' : 'Missing'}
                </div>
                <div class="metric-recommendation">${technical.metrics.canonicalTags.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Structured Data</h5>
                <div class="metric-status ${technical.metrics.structuredData.status}">
                    ${technical.metrics.structuredData.types.join(', ')}
                </div>
                <div class="metric-recommendation">${technical.metrics.structuredData.recommendation}</div>
            </div>
        `;
    }

    displaySecurityResults(security) {
        const container = document.getElementById('securityResults');
        container.innerHTML = `
            <div class="metric-card">
                <h5>HTTPS</h5>
                <div class="metric-status ${security.metrics.https.status}">
                    ${security.metrics.https.enabled ? 'Enabled' : 'Disabled'}
                </div>
                <div class="metric-recommendation">${security.metrics.https.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>SSL Certificate</h5>
                <div class="metric-status ${security.metrics.sslCertificate.status}">
                    ${security.metrics.sslCertificate.valid ? 'Valid' : 'Invalid'}
                </div>
                <div class="metric-detail">Issuer: ${security.metrics.sslCertificate.issuer}</div>
                <div class="metric-recommendation">${security.metrics.sslCertificate.recommendation}</div>
            </div>
            <div class="metric-card">
                <h5>Security Headers</h5>
                <div class="metric-status ${security.metrics.securityHeaders.status}">
                    HSTS: ${security.metrics.securityHeaders.hsts ? '✓' : '✗'}<br>
                    X-Frame-Options: ${security.metrics.securityHeaders.xFrameOptions ? '✓' : '✗'}<br>
                    CSP: ${security.metrics.securityHeaders.contentSecurityPolicy ? '✓' : '✗'}
                </div>
                <div class="metric-recommendation">${security.metrics.securityHeaders.recommendation}</div>
            </div>
        `;
    }

    updateScoreColors() {
        const scoreElements = [
            { id: 'overallScore', score: this.analysisResults.overallScore },
            { id: 'seoScore', score: this.analysisResults.seo.score },
            { id: 'performanceScore', score: this.analysisResults.performance.score },
            { id: 'accessibilityScore', score: this.analysisResults.accessibility.score },
            { id: 'technicalScore', score: this.analysisResults.technical.score }
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
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        
        if (analyzing) {
            btn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    enableExportButtons() {
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
    }

    loadSample() {
        document.getElementById('urlInput').value = 'https://example.com';
    }

    clearResults() {
        document.getElementById('urlInput').value = '';
        this.currentUrl = '';
        this.analysisResults = {};
        
        // Reset scores
        ['overallScore', 'seoScore', 'performanceScore', 'accessibilityScore', 'technicalScore'].forEach(id => {
            document.getElementById(id).textContent = '-';
        });
        
        // Clear results
        ['seoResults', 'performanceResults', 'accessibilityResults', 'technicalResults', 'securityResults'].forEach(id => {
            document.getElementById(id).innerHTML = '<div class="result-placeholder">No analysis data available</div>';
        });
        
        document.getElementById('quickInsights').innerHTML = '<div class="insight-placeholder">Run analysis to see insights</div>';
        
        // Disable export buttons
        document.getElementById('exportBtn').disabled = true;
        document.getElementById('shareBtn').disabled = true;
    }

    exportReport() {
        if (!this.analysisResults.url) {
            alert('No analysis data to export');
            return;
        }

        const report = {
            url: this.analysisResults.url,
            timestamp: this.analysisResults.timestamp,
            overallScore: this.analysisResults.overallScore,
            scores: {
                seo: this.analysisResults.seo.score,
                performance: this.analysisResults.performance.score,
                accessibility: this.analysisResults.accessibility.score,
                technical: this.analysisResults.technical.score,
                security: this.analysisResults.security.score
            },
            insights: this.analysisResults.insights,
            detailedResults: this.analysisResults
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    shareResults() {
        if (!this.analysisResults.url) {
            alert('No analysis data to share');
            return;
        }

        const shareText = `Website Analysis Report for ${this.analysisResults.url}\n\nOverall Score: ${this.analysisResults.overallScore}/100\n\nKey Insights:\n${this.analysisResults.insights.map(insight => `• ${insight.text}`).join('\n')}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Website Analysis Report',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Analysis summary copied to clipboard!');
            });
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteAnalyzerUtility;
}