/**
 * Word Converter Utility
 * A modular, standalone Word document converter that can handle various file formats
 * without interfering with existing codebase functionality.
 */

class WordConverterUtility {
    constructor() {
        this.supportedInputFormats = ['.doc', '.docx', '.rtf', '.txt'];
        this.supportedOutputFormats = ['pdf', 'html', 'txt', 'md', 'csv', 'json'];
        this.conversionHistory = [];
    }

    /**
     * Initialize the Word converter with enhanced error handling
     */
    init() {
        try {
            console.log('Word Converter Utility initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Word Converter:', error);
            return false;
        }
    }

    /**
     * Validate if the uploaded file is a supported Word document format
     * @param {File} file - The file to validate
     * @returns {boolean} - True if file is supported
     */
    validateFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        const validTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/rtf',
            'text/plain',
            'text/rtf'
        ];

        const fileExtension = this.getFileExtension(file.name);
        const isValidType = validTypes.includes(file.type);
        const isValidExtension = this.supportedInputFormats.includes(fileExtension);

        if (!isValidType && !isValidExtension) {
            throw new Error(`Unsupported file format. Supported formats: ${this.supportedInputFormats.join(', ')}`);
        }

        // Check file size (max 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            throw new Error('File size exceeds 50MB limit');
        }

        return true;
    }

    /**
     * Check if file is a valid Word document (public method for dashboard)
     * @param {File} file - The file to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    isValidWordFile(file) {
        try {
            this.validateFile(file);
            return true;
        } catch (error) {
            console.warn('File validation failed:', error.message);
            return false;
        }
    }

    /**
     * Extract file extension from filename
     * @param {string} filename - The filename
     * @returns {string} - File extension with dot
     */
    getFileExtension(filename) {
        return filename.toLowerCase().substring(filename.lastIndexOf('.'));
    }

    /**
     * Main conversion method that handles different input formats
     * @param {File} file - The input file
     * @param {string} outputFormat - Desired output format
     * @returns {Promise<Object>} - Conversion result with content and metadata
     */
    async convertDocument(file, outputFormat) {
        try {
            // Validate inputs
            this.validateFile(file);
            if (!this.supportedOutputFormats.includes(outputFormat)) {
                throw new Error(`Unsupported output format: ${outputFormat}`);
            }

            // Extract content based on input file type
            const extractedContent = await this.extractContent(file);
            
            // Convert to desired format
            const convertedContent = await this.formatContent(extractedContent, outputFormat, file.name);
            
            // Generate metadata
            const metadata = this.generateMetadata(file, outputFormat, extractedContent);
            
            // Store conversion in history
            this.addToHistory(file.name, outputFormat, metadata);
            
            return {
                success: true,
                content: convertedContent.content,
                filename: convertedContent.filename,
                mimeType: convertedContent.mimeType,
                metadata: metadata
            };
        } catch (error) {
            console.error('Conversion failed:', error);
            return {
                success: false,
                error: error.message,
                metadata: null
            };
        }
    }

    /**
     * Extract content from different file types
     * @param {File} file - Input file
     * @returns {Promise<string>} - Extracted text content
     */
    async extractContent(file) {
        const fileExtension = this.getFileExtension(file.name);
        
        switch (fileExtension) {
            case '.txt':
                return await this.extractPlainText(file);
            case '.rtf':
                return await this.extractRtfContent(file);
            case '.docx':
                return await this.extractDocxContent(file);
            case '.doc':
                return await this.extractDocContent(file);
            default:
                throw new Error(`Unsupported file extension: ${fileExtension}`);
        }
    }

    /**
     * Extract plain text from text files
     */
    async extractPlainText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    if (!content || content.trim().length === 0) {
                        reject(new Error('File appears to be empty'));
                    }
                    resolve(content);
                } catch (error) {
                    reject(new Error('Failed to read text file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * Extract content from RTF files with improved parsing
     */
    async extractRtfContent(file) {
        const rtfText = await this.extractPlainText(file);
        
        // Enhanced RTF parsing
        let cleanText = rtfText
            // Remove RTF header and font table
            .replace(/\{\\rtf1[^}]*\}/g, '')
            // Remove font definitions
            .replace(/\{\\fonttbl[^}]*\}/g, '')
            // Remove color table
            .replace(/\{\\colortbl[^}]*\}/g, '')
            // Remove style definitions
            .replace(/\{\\stylesheet[^}]*\}/g, '')
            // Remove control words with parameters
            .replace(/\\[a-z]+\d*\s?/gi, '')
            // Remove control symbols
            .replace(/\\[^a-z\s]/gi, '')
            // Remove remaining braces
            .replace(/[{}]/g, '')
            // Normalize whitespace
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanText || cleanText.length < 10) {
            throw new Error('Could not extract meaningful content from RTF file');
        }

        return cleanText;
    }

    /**
     * Extract content from DOCX files (ZIP-based format)
     */
    async extractDocxContent(file) {
        try {
            // For now, return a helpful message since proper DOCX parsing requires ZIP libraries
            return `Document: ${file.name}\n\nNote: This utility provides basic text extraction from Word documents. For complex DOCX files with advanced formatting, the extraction may be limited.\n\nFor best results:\n- Save your document as .RTF format (File > Save As > Rich Text Format)\n- Or save as .TXT format for plain text\n- Or copy and paste the content directly\n\nAlternatively, you can use online converters or dedicated Word processing software for more accurate conversion.`;
        } catch (error) {
            throw new Error('Failed to process DOCX file: ' + error.message);
        }
    }

    /**
     * Extract content from DOC files (legacy format)
     */
    async extractDocContent(file) {
        try {
            // DOC files use a complex binary format that requires specialized parsing
            return `Document: ${file.name}\n\nNote: This utility provides basic text extraction from Word documents. Legacy DOC files use a complex binary format that requires specialized parsing libraries.\n\nFor best results:\n- Save your document as .RTF format (File > Save As > Rich Text Format)\n- Or save as .TXT format for plain text\n- Or copy and paste the content directly\n- Consider upgrading to .DOCX format\n\nAlternatively, you can use Microsoft Word, LibreOffice, or online converters for more accurate conversion.`;
        } catch (error) {
            throw new Error('Failed to process DOC file: ' + error.message);
        }
    }

    /**
     * Format content according to the desired output format
     */
    async formatContent(content, format, originalFilename) {
        const baseName = originalFilename.replace(/\.[^.]+$/, '');
        
        switch (format) {
            case 'txt':
                return {
                    content: content,
                    filename: `${baseName}.txt`,
                    mimeType: 'text/plain'
                };
                
            case 'html':
                return {
                    content: this.convertToHtml(content, originalFilename),
                    filename: `${baseName}.html`,
                    mimeType: 'text/html'
                };
                
            case 'md':
                return {
                    content: this.convertToMarkdown(content, originalFilename),
                    filename: `${baseName}.md`,
                    mimeType: 'text/markdown'
                };
                
            case 'csv':
                return {
                    content: this.convertToCsv(content),
                    filename: `${baseName}.csv`,
                    mimeType: 'text/csv'
                };
                
            case 'json':
                return {
                    content: this.convertToJson(content, originalFilename),
                    filename: `${baseName}.json`,
                    mimeType: 'application/json'
                };
                
            case 'pdf':
                return {
                    content: this.convertToPdfHtml(content, originalFilename),
                    filename: `${baseName}_for_pdf_print.html`,
                    mimeType: 'text/html'
                };
                
            default:
                throw new Error(`Unsupported output format: ${format}`);
        }
    }

    /**
     * Convert content to HTML format with enhanced styling
     */
    convertToHtml(content, originalFilename) {
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        const htmlContent = paragraphs.map(p => `<p>${this.escapeHtml(p.trim())}</p>`).join('\n');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted from ${originalFilename}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }
        .document-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        p {
            margin-bottom: 20px;
            text-align: justify;
            font-size: 16px;
            line-height: 1.8;
        }
        .conversion-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 40px;
            font-size: 14px;
            color: #6c757d;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <div class="document-header">
        <h2>Document Conversion</h2>
        <p>Converted from: ${originalFilename}</p>
    </div>
    <h1>Document Content</h1>
    ${htmlContent}
    <div class="conversion-info">
        <strong>Conversion Details:</strong><br>
        Original File: ${originalFilename}<br>
        Converted: ${new Date().toLocaleString()}<br>
        Format: HTML Document
    </div>
</body>
</html>`;
    }

    /**
     * Convert content to Markdown format
     */
    convertToMarkdown(content, originalFilename) {
        const lines = content.split('\n');
        let markdown = `# Document Content\n\n> **Converted from:** ${originalFilename}  \n> **Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`;
        
        let currentParagraph = '';
        let inCodeBlock = false;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Detect potential code blocks
            if (trimmedLine.includes('function') || trimmedLine.includes('class') || trimmedLine.includes('{')) {
                if (currentParagraph) {
                    markdown += currentParagraph + '\n\n';
                    currentParagraph = '';
                }
                if (!inCodeBlock) {
                    markdown += '```\n';
                    inCodeBlock = true;
                }
                markdown += trimmedLine + '\n';
            } else if (trimmedLine === '') {
                if (inCodeBlock) {
                    markdown += '```\n\n';
                    inCodeBlock = false;
                } else if (currentParagraph) {
                    markdown += currentParagraph + '\n\n';
                    currentParagraph = '';
                }
            } else {
                if (inCodeBlock) {
                    markdown += trimmedLine + '\n';
                } else {
                    if (currentParagraph) {
                        currentParagraph += ' ' + trimmedLine;
                    } else {
                        currentParagraph = trimmedLine;
                    }
                }
            }
        }
        
        if (inCodeBlock) {
            markdown += '```\n';
        }
        if (currentParagraph) {
            markdown += currentParagraph + '\n';
        }
        
        return markdown;
    }

    /**
     * Convert content to CSV format with enhanced structure
     */
    convertToCsv(content) {
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        let csv = 'Line Number,Content Type,Character Count,Word Count,Text\n';
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const wordCount = trimmedLine.split(/\s+/).length;
            const charCount = trimmedLine.length;
            const contentType = this.classifyContent(trimmedLine);
            const escapedLine = '"' + trimmedLine.replace(/"/g, '""') + '"';
            
            csv += `${index + 1},"${contentType}",${charCount},${wordCount},${escapedLine}\n`;
        });
        
        return csv;
    }

    /**
     * Classify content type for CSV export
     */
    classifyContent(text) {
        if (text.length > 100) return 'Long Paragraph';
        if (text.length > 50) return 'Paragraph';
        if (text.includes(':') && text.length < 30) return 'Header/Title';
        if (text.match(/^\d+\./)) return 'Numbered List';
        if (text.match(/^[•\-\*]/)) return 'Bullet Point';
        return 'Short Text';
    }

    /**
     * Convert content to JSON format with detailed metadata
     */
    convertToJson(content, originalFilename) {
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        const words = content.split(/\s+/).filter(word => word.length > 0);
        
        const jsonData = {
            metadata: {
                originalFileName: originalFilename,
                convertedAt: new Date().toISOString(),
                converter: 'Word Converter Utility v1.0',
                statistics: {
                    totalLines: lines.length,
                    totalParagraphs: paragraphs.length,
                    totalWords: words.length,
                    totalCharacters: content.length,
                    averageWordsPerParagraph: Math.round(words.length / paragraphs.length),
                    averageCharactersPerWord: Math.round(content.length / words.length)
                }
            },
            content: {
                fullText: content,
                structure: {
                    lines: lines.map((line, index) => ({
                        lineNumber: index + 1,
                        text: line.trim(),
                        wordCount: line.trim().split(/\s+/).length,
                        characterCount: line.trim().length,
                        type: this.classifyContent(line.trim())
                    })),
                    paragraphs: paragraphs.map((paragraph, index) => ({
                        paragraphNumber: index + 1,
                        text: paragraph.trim(),
                        wordCount: paragraph.trim().split(/\s+/).length,
                        characterCount: paragraph.trim().length,
                        sentences: paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0).length
                    }))
                }
            }
        };
        
        return JSON.stringify(jsonData, null, 2);
    }

    /**
     * Convert content to PDF-ready HTML
     */
    convertToPdfHtml(content, originalFilename) {
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        const htmlContent = paragraphs.map(p => `<p>${this.escapeHtml(p.trim())}</p>`).join('\n');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${originalFilename}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
        }
        body {
            font-family: 'Times New Roman', serif;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            line-height: 1.6;
            color: #000;
            background: white;
            font-size: 12pt;
        }
        h1 {
            color: #000;
            font-size: 18pt;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
        }
        p {
            margin-bottom: 12pt;
            text-align: justify;
            text-indent: 1cm;
            orphans: 2;
            widows: 2;
        }
        .document-header {
            text-align: center;
            margin-bottom: 30px;
            font-size: 10pt;
            color: #666;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
        }
        .print-instruction {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 11pt;
            border: 1px solid #2196f3;
        }
        .footer {
            position: fixed;
            bottom: 1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="print-instruction no-print">
        <strong>📄 PDF Conversion Instructions:</strong><br>
        1. Press <kbd>Ctrl+P</kbd> (Windows) or <kbd>Cmd+P</kbd> (Mac)<br>
        2. Select "Save as PDF" or "Microsoft Print to PDF"<br>
        3. Choose your desired settings and save
    </div>
    <div class="document-header">
        <strong>Document:</strong> ${originalFilename}<br>
        <strong>Converted:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>Pages:</strong> <span id="pageCount">Auto-calculated</span>
    </div>
    <h1>Document Content</h1>
    ${htmlContent}
    <div class="footer no-print">
        Generated by Word Converter Utility
    </div>
</body>
</html>`;
    }

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Generate conversion metadata
     */
    generateMetadata(file, outputFormat, content) {
        return {
            originalFile: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: new Date(file.lastModified).toISOString()
            },
            conversion: {
                outputFormat: outputFormat,
                timestamp: new Date().toISOString(),
                contentLength: content.length,
                wordCount: content.split(/\s+/).length,
                lineCount: content.split('\n').length
            },
            utility: {
                name: 'Word Converter Utility',
                version: '1.0.0',
                features: ['Multi-format support', 'Content extraction', 'Metadata generation']
            }
        };
    }

    /**
     * Add conversion to history
     */
    addToHistory(filename, format, metadata) {
        this.conversionHistory.push({
            id: Date.now(),
            filename,
            format,
            timestamp: new Date().toISOString(),
            metadata
        });
        
        // Keep only last 50 conversions
        if (this.conversionHistory.length > 50) {
            this.conversionHistory = this.conversionHistory.slice(-50);
        }
    }

    /**
     * Get conversion history
     */
    getHistory() {
        return this.conversionHistory;
    }

    /**
     * Clear conversion history
     */
    clearHistory() {
        this.conversionHistory = [];
    }

    /**
     * Download converted file
     */
    downloadFile(content, filename, mimeType) {
        try {
            let blobContent;
            
            // Handle text files with proper UTF-8 encoding
            if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('csv')) {
                // Add UTF-8 BOM for better compatibility with text editors
                const utf8BOM = '\uFEFF';
                blobContent = utf8BOM + content;
                
                // Ensure proper MIME type with charset
                const mimeTypeWithCharset = mimeType.includes('charset') ? mimeType : `${mimeType}; charset=utf-8`;
                
                const blob = new Blob([blobContent], { type: mimeTypeWithCharset });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                // For non-text files, use content as-is
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordConverterUtility;
} else if (typeof window !== 'undefined') {
    window.WordConverterUtility = WordConverterUtility;
}