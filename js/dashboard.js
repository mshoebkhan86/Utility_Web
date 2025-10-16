// Utility Dashboard JavaScript

const CATEGORIES = {
    'document-converters': {
        title: 'Document Converters',
        icon: '📄',
        description: 'Convert between different document formats',
        subcategories: [
            { title: 'PDF Converter', icon: '📋', description: 'Convert documents to/from PDF format' },
            { title: 'Word Converter', icon: '📝', description: 'Convert Word documents to other formats' },
            { title: 'Excel Converter', icon: '📊', description: 'Convert Excel files to various formats' },
            { title: 'PowerPoint Converter', icon: '📈', description: 'Convert presentations to different formats' },
            { title: 'Text Converter', icon: '📃', description: 'Convert plain text to various formats' },
            { title: 'Image to Text', icon: '🖼️', description: 'Extract text from images using OCR' }
        ]
    },
    'document-editors': {
        title: 'Document Editors',
        icon: '✏️',
        description: 'Edit and modify various document types',
        subcategories: [
            { title: 'Document Editor Suite', icon: '📝', description: 'Comprehensive document editing with collaboration features', url: 'document-editors-demo.html' },
            { title: 'Rich Text Editor', icon: '📝', description: 'WYSIWYG text editor with formatting' },
            { title: 'Markdown Editor', icon: '📄', description: 'Edit Markdown files with live preview' },
            { title: 'Code Editor', icon: '💻', description: 'Syntax highlighting code editor' },
            { title: 'CSV Editor', icon: '📊', description: 'Edit CSV files in spreadsheet format' },
            { title: 'JSON Editor', icon: '🔧', description: 'Edit and validate JSON data' },
            { title: 'XML Editor', icon: '📋', description: 'Edit and validate XML documents' }
        ]
    },
    'calculation-analysis': {
        title: 'Calculation & Analysis',
        icon: '🧮',
        description: 'Mathematical calculations and data analysis',
        subcategories: [
            { title: 'Scientific Calculator', icon: '🔬', description: 'Advanced scientific calculations', url: 'scientific-calculator-demo.html' },
            { title: 'Statistics Calculator', icon: '📊', description: 'Statistical analysis and calculations' },
            { title: 'Unit Converter', icon: '⚖️', description: 'Convert between different units', url: 'unit-converter-demo.html' },
            { title: 'Percentage Calculator', icon: '💯', description: 'Calculate percentages and ratios' },
            { title: 'Date Calculator', icon: '📅', description: 'Calculate dates and time differences', url: 'date-calculator-demo.html' },
            { title: 'Matrix Calculator', icon: '🔢', description: 'Matrix operations and calculations' }
        ]
    },
    'project-management': {
        title: 'Project Management',
        icon: '📋',
        description: 'Tools for managing projects and tasks',
        subcategories: [
            { title: 'Task Manager', icon: '✅', description: 'Manage tasks and to-do lists' },
            { title: 'Gantt Chart', icon: '📊', description: 'Create project timelines and schedules' },
            { title: 'Kanban Board', icon: '📌', description: 'Visual project management board' },
            { title: 'Time Tracker', icon: '⏱️', description: 'Track time spent on tasks' },
            { title: 'Resource Planner', icon: '👥', description: 'Plan and allocate resources' },
            { title: 'Project Calendar', icon: '📅', description: 'Schedule and manage project events' }
        ]
    },
    'financial-calculators': {
        title: 'Financial Calculators',
        icon: '💰',
        description: 'Financial calculations and planning tools',
        subcategories: [
            { title: 'Loan Calculator', icon: '🏦', description: 'Calculate loan payments and interest', url: 'loan-calculator-demo.html' },
            { title: 'Mortgage Calculator', icon: '🏠', description: 'Calculate mortgage payments' },
            { title: 'Investment Calculator', icon: '📈', description: 'Calculate investment returns' },
            { title: 'Tax Calculator', icon: '💸', description: 'Calculate taxes and deductions' },
            { title: 'Currency Converter', icon: '💱', description: 'Convert between currencies' },
            { title: 'Budget Planner', icon: '📊', description: 'Plan and track budgets' }
        ]
    },
    'data-visualization': {
        title: 'Data Visualization',
        icon: '📊',
        description: 'Create charts and visualize data',
        subcategories: [
            { title: 'Chart Generator', icon: '📈', description: 'Create various types of charts', url: 'chart-generator-demo.html' },
            { title: 'Graph Maker', icon: '📉', description: 'Generate graphs from data' },
            { title: 'Infographic Creator', icon: '🎨', description: 'Create informational graphics' },
            { title: 'Dashboard Builder', icon: '📊', description: 'Build interactive dashboards' },
            { title: 'Data Table', icon: '📋', description: 'Display data in table format' },
            { title: 'Heat Map', icon: '🔥', description: 'Create heat map visualizations' }
        ]
    },
    'business-tools': {
        title: 'Business Tools',
        icon: '💼',
        description: 'Essential tools for business operations',
        subcategories: [
            { title: 'Invoice Generator', icon: '🧾', description: 'Create professional invoices', url: 'invoice-generator-demo.html' },
            { title: 'Receipt Maker', icon: '🧾', description: 'Generate receipts and bills' },
            { title: 'Business Card Designer', icon: '💳', description: 'Design professional business cards with templates and custom tools', url: 'business-card-designer-demo.html' },
            { title: 'Letterhead Creator', icon: '📄', description: 'Create company letterheads', url: 'letterhead-creator-demo.html' },
            { title: 'Contract Template', icon: '📋', description: 'Generate contract templates' },
            { title: 'Expense Tracker', icon: '💰', description: 'Track business expenses', url: 'expense-tracker-demo.html' }
        ]
    },
    'data-transformation': {
        title: 'Data Transformation',
        icon: '🔄',
        description: 'Transform and manipulate data formats',
        subcategories: [
            { title: 'JSON Formatter', icon: '🔧', description: 'Format and validate JSON data', url: 'json-formatter-demo.html' },
            { title: 'CSV to JSON', icon: '📊', description: 'Convert CSV files to JSON format', url: 'csv-to-json-demo.html' },
            { title: 'XML to JSON', icon: '📋', description: 'Convert XML to JSON format', url: 'xml-to-json-demo.html' },
            { title: 'Base64 Encoder', icon: '🔐', description: 'Encode/decode Base64 data', url: 'base64-encoder-demo.html' },
            { title: 'URL Encoder', icon: '🔗', description: 'Encode/decode URLs', url: 'url-encoder-demo.html' },
            { title: 'SQL Formatter', icon: '🗄️', description: 'Format and beautify SQL queries', url: 'sql-formatter-demo.html' }
        ]
    },
    'analysis-tools': {
        title: 'Analysis Tools',
        icon: '🔍',
        description: 'Analyze and examine various data types',
        subcategories: [
            { title: 'Text Analyzer', icon: '📝', description: 'Analyze text content and statistics', url: 'text-analyzer-demo.html' },
            { title: 'Website Analyzer', icon: '🌐', description: 'Analyze website performance', url: 'website-analyzer-demo.html' },
            { title: 'Image Analyzer', icon: '🖼️', description: 'Analyze image properties', url: 'image-analyzer-demo.html' },
            { title: 'File Analyzer', icon: '📁', description: 'Analyze file properties and metadata', url: 'file-analyzer-demo.html' },
            { title: 'Network Analyzer', icon: '🌐', description: 'Analyze network connections' },
            { title: 'Performance Monitor', icon: '⚡', description: 'Monitor system performance' }
        ]
    },
    'color-tools': {
        title: 'Color Tools',
        icon: '🎨',
        description: 'Work with colors and color schemes',
        subcategories: [
            { title: 'Color Picker', icon: '🎯', description: 'Pick and identify colors' },
            { title: 'Palette Generator', icon: '🎨', description: 'Generate color palettes' },
            { title: 'Color Converter', icon: '🔄', description: 'Convert between color formats' },
            { title: 'Gradient Generator', icon: '🌈', description: 'Create CSS gradients' },
            { title: 'Contrast Checker', icon: '👁️', description: 'Check color contrast ratios' },
            { title: 'Color Blindness Test', icon: '👀', description: 'Test for color accessibility' }
        ]
    },
    'design-tools': {
        title: 'Design Tools',
        icon: '🎨',
        description: 'Tools for graphic and web design',
        subcategories: [
            { title: 'Logo Maker', icon: '🏷️', description: 'Create logos and brand marks' },
            { title: 'Icon Generator', icon: '🔸', description: 'Generate icons and symbols' },
            { title: 'Banner Creator', icon: '🖼️', description: 'Create web banners and headers' },
            { title: 'Mockup Generator', icon: '📱', description: 'Create device mockups', url: 'mockup-generator-demo.html' },
            { title: 'CSS Generator', icon: '💻', description: 'Generate CSS code snippets' },
            { title: 'Font Pairing', icon: '🔤', description: 'Find perfect font combinations' }
        ]
    },
    'image-creation': {
        title: 'Image Creation',
        icon: '🖼️',
        description: 'Create and generate images',
        subcategories: [
            { title: 'QR Code Generator', icon: '📱', description: 'Generate QR codes', url: 'qr-code-generator-demo.html' },
            { title: 'Barcode Generator', icon: '📊', description: 'Generate various barcodes' },
            { title: 'Avatar Creator', icon: '👤', description: 'Create user avatars' },
            { title: 'Placeholder Generator', icon: '🖼️', description: 'Generate placeholder images' },
            { title: 'Pattern Generator', icon: '🔳', description: 'Create repeating patterns' },
            { title: 'Texture Generator', icon: '🎨', description: 'Generate textures and backgrounds' }
        ]
    },
    'encryption-tools': {
        title: 'Encryption Tools',
        icon: '🔐',
        description: 'Encrypt and secure your data',
        subcategories: [
            { title: 'Text Encryption', icon: '🔒', description: 'Encrypt and decrypt text' },
            { title: 'File Encryption', icon: '📁', description: 'Encrypt files and documents' },
            { title: 'Hash Generator', icon: '#️⃣', description: 'Generate MD5, SHA hashes' },
            { title: 'Digital Signature', icon: '✍️', description: 'Create digital signatures' },
            { title: 'Key Generator', icon: '🗝️', description: 'Generate encryption keys' },
            { title: 'Certificate Viewer', icon: '📜', description: 'View SSL certificates' }
        ]
    },
    'privacy-tools': {
        title: 'Privacy Tools',
        icon: '🛡️',
        description: 'Protect your privacy and data',
        subcategories: [
            { title: 'Password Generator', icon: '🔑', description: 'Generate secure passwords' },
            { title: 'Data Shredder', icon: '🗑️', description: 'Securely delete files' },
            { title: 'Privacy Checker', icon: '🔍', description: 'Check privacy settings' },
            { title: 'VPN Checker', icon: '🌐', description: 'Check VPN connection status' },
            { title: 'IP Lookup', icon: '🌍', description: 'Look up IP address information' },
            { title: 'DNS Checker', icon: '🔍', description: 'Check DNS records' }
        ]
    },
    'code-tools': {
        title: 'Code Tools',
        icon: '💻',
        description: 'Tools for developers and programmers',
        subcategories: [
            { title: 'All Code Formatter', icon: '📝', description: 'Format and beautify code for multiple languages (JavaScript, Python, HTML, CSS, XML, YAML, Markdown)', url: 'code-formatter-demo.html' },
            { title: 'Code Minifier', icon: '📦', description: 'Minify CSS, JS, HTML' },
            { title: 'Regex Tester', icon: '🔍', description: 'Test regular expressions' },
            { title: 'API Tester', icon: '🔌', description: 'Test REST APIs', url: 'api-tester-demo.html' },
            { title: 'Code Validator', icon: '✅', description: 'Validate code syntax' },
            { title: 'Diff Checker', icon: '📊', description: 'Compare code differences' }
        ]
    },
    'seo-analytics': {
        title: 'SEO & Analytics',
        icon: '📈',
        description: 'SEO optimization and analytics tools',
        subcategories: [
            { title: 'SEO Analyzer', icon: '🔍', description: 'Analyze website SEO' },
            { title: 'Keyword Density', icon: '🔤', description: 'Check keyword density' },
            { title: 'Meta Tag Generator', icon: '🏷️', description: 'Generate meta tags' },
            { title: 'Sitemap Generator', icon: '🗺️', description: 'Generate XML sitemaps' },
            { title: 'Robots.txt Generator', icon: '🤖', description: 'Generate robots.txt files' },
            { title: 'Page Speed Test', icon: '⚡', description: 'Test page loading speed' }
        ]
    },
    'browser-tools': {
        title: 'Browser Tools',
        icon: '🌐',
        description: 'Web browser utilities and tools',
        subcategories: [
            { title: 'User Agent Checker', icon: '🔍', description: 'Check browser user agent' },
            { title: 'Cookie Manager', icon: '🍪', description: 'Manage browser cookies' },
            { title: 'Cache Cleaner', icon: '🧹', description: 'Clear browser cache' },
            { title: 'Bookmark Manager', icon: '🔖', description: 'Manage bookmarks' },
            { title: 'Extension Manager', icon: '🧩', description: 'Manage browser extensions' },
            { title: 'Developer Tools', icon: '🔧', description: 'Browser developer utilities' }
        ]
    },
    'writing-aids': {
        title: 'Writing Aids',
        icon: '✍️',
        description: 'Tools to improve your writing',
        subcategories: [
            { title: 'Grammar Checker', icon: '📝', description: 'Check grammar and spelling' },
            { title: 'Word Counter', icon: '🔢', description: 'Count words and characters' },
            { title: 'Readability Test', icon: '📖', description: 'Test text readability' },
            { title: 'Plagiarism Checker', icon: '🔍', description: 'Check for plagiarism' },
            { title: 'Text Summarizer', icon: '📄', description: 'Summarize long texts' },
            { title: 'Citation Generator', icon: '📚', description: 'Generate citations' }
        ]
    },
    'formatting-tools': {
        title: 'Formatting Tools',
        icon: '📐',
        description: 'Format and style your content',
        subcategories: [
            { title: 'Text Formatter', icon: '📝', description: 'Format and style text' },
            { title: 'Case Converter', icon: '🔤', description: 'Convert text case' },
            { title: 'Line Break Remover', icon: '📄', description: 'Remove unwanted line breaks' },
            { title: 'Whitespace Cleaner', icon: '🧹', description: 'Clean extra whitespace' },
            { title: 'Text Replacer', icon: '🔄', description: 'Find and replace text' },
            { title: 'List Formatter', icon: '📋', description: 'Format lists and arrays' }
        ]
    }
};

// Dashboard Class
class Dashboard {
    constructor() {
        this.currentCategory = null;
        this.categoryGrid = document.getElementById('categoriesGrid');
        this.subcategoryGrid = document.getElementById('subcategoriesGrid');
    }

    init() {
        this.setupEventListeners();
        this.renderCategories();
    }

    setupEventListeners() {
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showCategories();
        });
    }

    renderCategories() {
        this.categoryGrid.innerHTML = '';
        Object.keys(CATEGORIES).forEach(key => {
            const category = CATEGORIES[key];
            const card = this.createCategoryCard(key, category);
            this.categoryGrid.appendChild(card);
        });
    }

    createCategoryCard(key, category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
        `;
        card.addEventListener('click', () => {
            this.showSubcategories(key, category);
        });
        return card;
    }

    showSubcategories(key, category) {
        this.currentCategory = key;
        document.getElementById('categoriesGrid').style.display = 'none';
        document.getElementById('subcategoriesView').style.display = 'block';
        document.getElementById('currentCategory').textContent = category.title;
        this.renderSubcategories(category.subcategories);
    }

    renderSubcategories(subcategories) {
        this.subcategoryGrid.innerHTML = '';
        subcategories.forEach(subcategory => {
            const card = this.createSubcategoryCard(subcategory);
            this.subcategoryGrid.appendChild(card);
        });
    }

    createSubcategoryCard(subcategory) {
        const card = document.createElement('div');
        card.className = 'subcategory-card';
        card.innerHTML = `
            <div class="subcategory-icon">${subcategory.icon}</div>
            <h4>${subcategory.title}</h4>
            <p>${subcategory.description}</p>
        `;
        card.addEventListener('click', () => {
            this.openTool(subcategory);
        });
        return card;
    }

    showCategories() {
        document.getElementById('subcategoriesView').style.display = 'none';
        document.getElementById('categoriesGrid').style.display = 'grid';
        this.currentCategory = null;
    }

    openTool(subcategory) {
        if (subcategory.url) {
            window.open(subcategory.url, '_blank');
        } else if (subcategory.title === 'PDF Converter') {
            this.openPdfConverter();
        } else if (subcategory.title === 'Word Converter') {
            this.openWordConverter();
        } else if (subcategory.title === 'Excel Converter') {
            this.openExcelConverter();
        } else if (subcategory.title === 'PowerPoint Converter') {
            this.openPowerPointConverter();
        } else if (subcategory.title === 'Text Converter') {
            this.openTextConverter();
        } else if (subcategory.title === 'Image to Text') {
            this.openImageToTextConverter();
        } else if (subcategory.title === 'API Tester') {
            window.open('api-tester-demo.html', '_blank');
        } else {
            alert(`${subcategory.title} is coming soon!`);
        }
    }

    openPdfConverter() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal modal-lg">
                <div class="modal-header">
                    <h2 class="modal-title">📋 PDF Converter</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="converter-section">
                        <h3>Convert PDF Documents</h3>
                        <div class="upload-area" id="pdfUploadArea">
                            <div class="upload-icon">📄</div>
                            <p>Drop your PDF file here or click to browse</p>
                            <input type="file" id="pdfFileInput" accept=".pdf" style="display: none;">
                            <button class="browse-btn" onclick="document.getElementById('pdfFileInput').click()">Browse Files</button>
                        </div>
                        <div class="conversion-options" id="pdfConversionOptions" style="display: none;">
                            <h4>Choose conversion format:</h4>
                            <div class="format-grid">
                                <button class="format-btn" data-format="txt">
                                    <span class="format-icon">📄</span>
                                    <span class="format-name">Text (.txt)</span>
                                </button>
                                <button class="format-btn" data-format="html">
                                    <span class="format-icon">🌐</span>
                                    <span class="format-name">HTML (.html)</span>
                                </button>
                                <button class="format-btn" data-format="md">
                                    <span class="format-icon">📝</span>
                                    <span class="format-name">Markdown (.md)</span>
                                </button>
                                <button class="format-btn" data-format="json">
                                    <span class="format-icon">🔧</span>
                                    <span class="format-name">JSON (.json)</span>
                                </button>
                            </div>
                        </div>
                        <div class="conversion-progress" id="pdfConversionProgress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                            <p>Converting your PDF...</p>
                        </div>
                        <div class="conversion-result" id="pdfConversionResult" style="display: none;">
                            <div class="result-info">
                                <span class="result-icon">✅</span>
                                <span class="result-text">Conversion completed!</span>
                            </div>
                            <button class="download-btn" id="pdfDownloadBtn">Download Converted File</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        this.setupPdfConverterEvents(modalOverlay);
    }

    setupPdfConverterEvents(modalOverlay) {
        const modal = modalOverlay.querySelector('.modal');
        const fileInput = modal.querySelector('#pdfFileInput');
        const uploadArea = modal.querySelector('#pdfUploadArea');
        const conversionOptions = modal.querySelector('#pdfConversionOptions');
        const progressEl = modal.querySelector('#pdfConversionProgress');
        const resultEl = modal.querySelector('#pdfConversionResult');
        const formatBtns = modal.querySelectorAll('.format-btn');

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });

        // Close modal with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadArea.innerHTML = `
                    <div class="file-selected">
                        <span class="file-icon">📄</span>
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                `;
                conversionOptions.style.display = 'block';
            }
        });

        formatBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const format = btn.dataset.format;
                const file = fileInput.files[0];
                if (file) {
                    conversionOptions.style.display = 'none';
                    progressEl.style.display = 'block';
                    await this.convertPdf(file, format, progressEl, resultEl);
                }
            });
        });
    }

    async convertPdf(file, format, progressEl, resultEl) {
        try {
            const text = await this.extractTextFromPdf(file);
            let convertedContent = '';
            let filename = file.name.replace('.pdf', '');
            let mimeType = 'text/plain';

            switch (format) {
                case 'txt':
                    convertedContent = text;
                    filename += '.txt';
                    break;
                case 'html':
                    convertedContent = `<!DOCTYPE html>\n<html>\n<head>\n<title>${filename}</title>\n</head>\n<body>\n<h1>${filename}</h1>\n${text.split('\n').map(line => `<p>${line}</p>`).join('\n')}\n</body>\n</html>`;
                    filename += '.html';
                    mimeType = 'text/html';
                    break;
                case 'md':
                    convertedContent = `# ${filename}\n\n${text}`;
                    filename += '.md';
                    break;
                case 'json':
                    convertedContent = JSON.stringify({ filename: filename, content: text.split('\n') }, null, 2);
                    filename += '.json';
                    mimeType = 'application/json';
                    break;
            }

            progressEl.style.display = 'none';
            resultEl.style.display = 'block';

            const downloadBtn = resultEl.querySelector('#pdfDownloadBtn');
            downloadBtn.onclick = () => {
                const blob = new Blob([convertedContent], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            };
        } catch (error) {
            progressEl.style.display = 'none';
            resultEl.innerHTML = `<div class="error">Error converting PDF: ${error.message}</div>`;
            resultEl.style.display = 'block';
        }
    }

    async extractTextFromPdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }

                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    openWordConverter() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal modal-lg">
                <div class="modal-header">
                    <h2 class="modal-title">Word Converter</h2>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="converter-section">
                        <h3>Upload Word Document</h3>
                        <div class="upload-area" id="wordUploadArea">
                            <div class="upload-content">
                                <div class="upload-icon">📄</div>
                                <p>Drag and drop your Word document here</p>
                                <p>or</p>
                                <button class="browse-btn" id="wordBrowseBtn">Browse Files</button>
                                <input type="file" id="wordFileInput" accept=".doc,.docx" style="display: none;">
                            </div>
                        </div>
                    </div>
                    
                    <div class="converter-section">
                        <h3>Convert To</h3>
                        <div class="format-grid">
                            <button class="format-btn" data-format="pdf">PDF</button>
                            <button class="format-btn" data-format="txt">Text</button>
                            <button class="format-btn" data-format="html">HTML</button>
                            <button class="format-btn" data-format="rtf">RTF</button>
                        </div>
                    </div>
                    
                    <div class="converter-section" id="wordProgress" style="display: none;">
                        <h3>Converting...</h3>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <p class="progress-text">Processing your document...</p>
                    </div>
                    
                    <div class="converter-section" id="wordResult" style="display: none;">
                        <h3>Conversion Complete</h3>
                        <div class="result-content">
                            <p>Your document has been converted successfully!</p>
                            <button class="download-btn" id="wordDownloadBtn">Download Converted File</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        this.setupWordConverterEvents(modalOverlay);
    }

    setupWordConverterEvents(modalOverlay) {
        const modal = modalOverlay.querySelector('.modal');
        const closeBtn = modalOverlay.querySelector('.modal-close');
        const uploadArea = modalOverlay.querySelector('#wordUploadArea');
        const browseBtn = modalOverlay.querySelector('#wordBrowseBtn');
        const fileInput = modalOverlay.querySelector('#wordFileInput');
        const formatBtns = modalOverlay.querySelectorAll('.format-btn');
        const progressEl = modalOverlay.querySelector('#wordProgress');
        const resultEl = modalOverlay.querySelector('#wordResult');
        
        let selectedFile = null;
        let selectedFormat = null;
        
        // Close modal events
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(modalOverlay)) {
                document.body.removeChild(modalOverlay);
            }
        });
        
        // File upload events
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                uploadArea.innerHTML = `
                    <div class="upload-content">
                        <div class="upload-icon">✅</div>
                        <p>File selected: ${selectedFile.name}</p>
                        <button class="browse-btn" id="wordBrowseBtn">Choose Different File</button>
                    </div>
                `;
                // Re-attach browse button event
                uploadArea.querySelector('#wordBrowseBtn').addEventListener('click', () => {
                    fileInput.click();
                });
            }
        });
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            
            if (e.dataTransfer.files.length > 0) {
                selectedFile = e.dataTransfer.files[0];
                uploadArea.innerHTML = `
                    <div class="upload-content">
                        <div class="upload-icon">✅</div>
                        <p>File selected: ${selectedFile.name}</p>
                        <button class="browse-btn" id="wordBrowseBtn">Choose Different File</button>
                    </div>
                `;
                // Re-attach browse button event
                uploadArea.querySelector('#wordBrowseBtn').addEventListener('click', () => {
                    fileInput.click();
                });
            }
        });
        
        // Format selection events
        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                formatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedFormat = btn.dataset.format;
                
                if (selectedFile && selectedFormat) {
                    this.convertWord(selectedFile, selectedFormat, progressEl, resultEl);
                }
            });
        });
     }

     async convertWord(file, format, progressEl, resultEl) {
         // Show progress
         progressEl.style.display = 'block';
         resultEl.style.display = 'none';
         
         const progressFill = progressEl.querySelector('.progress-fill');
         const progressText = progressEl.querySelector('.progress-text');
         
         try {
             // Simulate conversion progress
             progressFill.style.width = '30%';
             progressText.textContent = 'Reading Word document...';
             
             await new Promise(resolve => setTimeout(resolve, 1000));
             
             progressFill.style.width = '60%';
             progressText.textContent = `Converting to ${format.toUpperCase()}...`;
             
             await new Promise(resolve => setTimeout(resolve, 1500));
             
             progressFill.style.width = '90%';
             progressText.textContent = 'Finalizing conversion...';
             
             await new Promise(resolve => setTimeout(resolve, 800));
             
             progressFill.style.width = '100%';
             progressText.textContent = 'Conversion complete!';
             
             await new Promise(resolve => setTimeout(resolve, 500));
             
             // Hide progress and show result
             progressEl.style.display = 'none';
             resultEl.style.display = 'block';
             
             // Setup download functionality
             const downloadBtn = resultEl.querySelector('#wordDownloadBtn');
             downloadBtn.addEventListener('click', () => {
                 this.downloadConvertedWord(file, format);
             });
             
         } catch (error) {
             console.error('Word conversion error:', error);
             progressEl.style.display = 'none';
             resultEl.style.display = 'block';
             resultEl.innerHTML = `
                 <div class="converter-section">
                     <h3>Conversion Failed</h3>
                     <div class="result-content error">
                         <p>Sorry, there was an error converting your document. Please try again.</p>
                         <p class="error-details">${error.message}</p>
                     </div>
                 </div>
             `;
         }
     }

     downloadConvertedWord(originalFile, format) {
         // Create a simple converted file for demonstration
         const fileName = originalFile.name.replace(/\.[^/.]+$/, '');
         let content, mimeType, extension;
         
         switch (format) {
             case 'pdf':
                 content = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Converted from Word document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000207 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n301\n%%EOF';
                 mimeType = 'application/pdf';
                 extension = 'pdf';
                 break;
             case 'txt':
                 content = `This is a converted text file from: ${originalFile.name}\n\nOriginal Word document has been converted to plain text format.\n\nNote: This is a demo conversion. In a real implementation, the actual content of the Word document would be extracted and converted.`;
                 mimeType = 'text/plain';
                 extension = 'txt';
                 break;
             case 'html':
                 content = `<!DOCTYPE html>\n<html>\n<head>\n    <title>Converted from ${originalFile.name}</title>\n    <meta charset="UTF-8">\n</head>\n<body>\n    <h1>Converted Document</h1>\n    <p>This HTML file was converted from: <strong>${originalFile.name}</strong></p>\n    <p>Original Word document content would appear here in a real implementation.</p>\n    <p><em>This is a demo conversion showing the conversion capability.</em></p>\n</body>\n</html>`;
                 mimeType = 'text/html';
                 extension = 'html';
                 break;
             case 'rtf':
                 content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 Converted from ${originalFile.name}\\par\\par This RTF file was converted from a Word document.\\par\\par In a real implementation, the actual formatting and content would be preserved.\\par}`;
                 mimeType = 'application/rtf';
                 extension = 'rtf';
                 break;
             default:
                 throw new Error('Unsupported format');
         }
         
         // Create and download the file
         const blob = new Blob([content], { type: mimeType });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `${fileName}_converted.${extension}`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
     }

     openExcelConverter() {
        alert('Excel Converter is coming soon!');
    }

    setupExcelConverterEvents(modal) {
        // Excel converter events will be implemented here
    }

    openPowerPointConverter() {
        alert('PowerPoint Converter is coming soon!');
    }

    setupPowerPointConverterEvents(modal) {
        // PowerPoint converter events will be implemented here
    }

    openTextConverter() {
        alert('Text Converter is coming soon!');
    }

    setupTextConverterEvents(modal) {
        // Text converter events will be implemented here
    }

    openImageToTextConverter() {
        alert('Image to Text Converter is coming soon!');
    }

    setupImageToTextConverterEvents(modal) {
        // Image to Text converter events will be implemented here
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    dashboard.init();
});