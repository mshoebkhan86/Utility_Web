/**
 * Text Analyzer Utility
 * Provides comprehensive text analysis including word count, character count,
 * readability analysis, keyword density, and various text statistics.
 */

class TextAnalyzerUtility {
    constructor() {
        this.currentText = '';
        this.analysisResults = {};
        this.stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'would', 'you', 'your', 'have', 'had',
            'this', 'they', 'we', 'or', 'but', 'not', 'can', 'could', 'should',
            'may', 'might', 'must', 'shall', 'do', 'does', 'did', 'been', 'being'
        ]);
    }

    // Initialize the text analyzer interface
    init() {
        this.createInterface();
        this.attachEventListeners();
        this.loadSampleText();
    }

    createInterface() {
        const container = document.getElementById('text-analyzer-container');
        if (!container) {
            console.error('Text Analyzer container not found');
            return;
        }

        container.innerHTML = `
            <div class="text-analyzer-wrapper">
                <div class="analyzer-header">
                    <h2>📝 Text Analyzer</h2>
                    <p>Analyze your text for word count, readability, keyword density, and more</p>
                </div>

                <div class="analyzer-content">
                    <div class="input-section">
                        <div class="input-controls">
                            <button id="loadSampleBtn" class="btn btn-secondary">Load Sample Text</button>
                            <button id="clearTextBtn" class="btn btn-outline">Clear Text</button>
                            <input type="file" id="fileInput" accept=".txt,.md,.html" style="display: none;">
                            <button id="loadFileBtn" class="btn btn-outline">Load File</button>
                        </div>
                        
                        <div class="text-input-area">
                            <textarea id="textInput" placeholder="Enter or paste your text here for analysis..." 
                                     rows="12" class="form-control"></textarea>
                        </div>
                        
                        <div class="analysis-controls">
                            <button id="analyzeBtn" class="btn btn-primary">🔍 Analyze Text</button>
                            <button id="exportBtn" class="btn btn-success" disabled>📊 Export Results</button>
                        </div>
                    </div>

                    <div class="results-section">
                        <div class="results-tabs">
                            <button class="tab-btn active" data-tab="overview">Overview</button>
                            <button class="tab-btn" data-tab="readability">Readability</button>
                            <button class="tab-btn" data-tab="keywords">Keywords</button>
                            <button class="tab-btn" data-tab="detailed">Detailed Stats</button>
                        </div>

                        <div class="tab-content">
                            <div id="overview-tab" class="tab-pane active">
                                <div class="stats-grid">
                                    <div class="stat-card">
                                        <div class="stat-value" id="wordCount">0</div>
                                        <div class="stat-label">Words</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-value" id="charCount">0</div>
                                        <div class="stat-label">Characters</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-value" id="charCountNoSpaces">0</div>
                                        <div class="stat-label">Characters (no spaces)</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-value" id="sentenceCount">0</div>
                                        <div class="stat-label">Sentences</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-value" id="paragraphCount">0</div>
                                        <div class="stat-label">Paragraphs</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-value" id="readingTime">0</div>
                                        <div class="stat-label">Reading Time (min)</div>
                                    </div>
                                </div>
                            </div>

                            <div id="readability-tab" class="tab-pane">
                                <div class="readability-scores">
                                    <div class="score-card">
                                        <h4>Flesch Reading Ease</h4>
                                        <div class="score-value" id="fleschScore">-</div>
                                        <div class="score-description" id="fleschDescription">-</div>
                                    </div>
                                    <div class="score-card">
                                        <h4>Flesch-Kincaid Grade Level</h4>
                                        <div class="score-value" id="gradeLevel">-</div>
                                        <div class="score-description">Grade Level</div>
                                    </div>
                                    <div class="score-card">
                                        <h4>Average Sentence Length</h4>
                                        <div class="score-value" id="avgSentenceLength">-</div>
                                        <div class="score-description">Words per sentence</div>
                                    </div>
                                </div>
                            </div>

                            <div id="keywords-tab" class="tab-pane">
                                <div class="keywords-section">
                                    <div class="keywords-controls">
                                        <label>
                                            <input type="checkbox" id="excludeStopWords" checked>
                                            Exclude common stop words
                                        </label>
                                        <label>
                                            Min word length: 
                                            <input type="number" id="minWordLength" value="3" min="1" max="10">
                                        </label>
                                    </div>
                                    <div id="keywordsList" class="keywords-list"></div>
                                </div>
                            </div>

                            <div id="detailed-tab" class="tab-pane">
                                <div class="detailed-stats">
                                    <div class="stat-group">
                                        <h4>Word Statistics</h4>
                                        <div class="stat-row">
                                            <span>Average word length:</span>
                                            <span id="avgWordLength">-</span>
                                        </div>
                                        <div class="stat-row">
                                            <span>Longest word:</span>
                                            <span id="longestWord">-</span>
                                        </div>
                                        <div class="stat-row">
                                            <span>Unique words:</span>
                                            <span id="uniqueWords">-</span>
                                        </div>
                                        <div class="stat-row">
                                            <span>Lexical diversity:</span>
                                            <span id="lexicalDiversity">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-group">
                                        <h4>Structure Analysis</h4>
                                        <div class="stat-row">
                                            <span>Average paragraph length:</span>
                                            <span id="avgParagraphLength">-</span>
                                        </div>
                                        <div class="stat-row">
                                            <span>Complex sentences:</span>
                                            <span id="complexSentences">-</span>
                                        </div>
                                        <div class="stat-row">
                                            <span>Passive voice instances:</span>
                                            <span id="passiveVoice">-</span>
                                        </div>
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
        // Text input events
        const textInput = document.getElementById('textInput');
        textInput?.addEventListener('input', () => {
            this.currentText = textInput.value;
            this.updateBasicStats();
        });

        // Button events
        document.getElementById('analyzeBtn')?.addEventListener('click', () => this.analyzeText());
        document.getElementById('clearTextBtn')?.addEventListener('click', () => this.clearText());
        document.getElementById('loadSampleBtn')?.addEventListener('click', () => this.loadSampleText());
        document.getElementById('loadFileBtn')?.addEventListener('click', () => this.loadFile());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportResults());
        
        // File input
        document.getElementById('fileInput')?.addEventListener('change', (e) => this.handleFileLoad(e));
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Keywords controls
        document.getElementById('excludeStopWords')?.addEventListener('change', () => this.updateKeywords());
        document.getElementById('minWordLength')?.addEventListener('change', () => this.updateKeywords());
    }

    updateBasicStats() {
        const text = this.currentText;
        
        // Basic counts
        const wordCount = this.countWords(text);
        const charCount = text.length;
        const charCountNoSpaces = text.replace(/\s/g, '').length;
        const sentenceCount = this.countSentences(text);
        const paragraphCount = this.countParagraphs(text);
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed

        // Update display
        document.getElementById('wordCount').textContent = wordCount.toLocaleString();
        document.getElementById('charCount').textContent = charCount.toLocaleString();
        document.getElementById('charCountNoSpaces').textContent = charCountNoSpaces.toLocaleString();
        document.getElementById('sentenceCount').textContent = sentenceCount.toLocaleString();
        document.getElementById('paragraphCount').textContent = paragraphCount.toLocaleString();
        document.getElementById('readingTime').textContent = readingTime;
    }

    analyzeText() {
        if (!this.currentText.trim()) {
            alert('Please enter some text to analyze.');
            return;
        }

        this.analysisResults = this.performFullAnalysis(this.currentText);
        this.displayResults();
        document.getElementById('exportBtn').disabled = false;
    }

    performFullAnalysis(text) {
        const words = this.getWords(text);
        const sentences = this.getSentences(text);
        const paragraphs = this.getParagraphs(text);

        return {
            basic: {
                wordCount: words.length,
                charCount: text.length,
                charCountNoSpaces: text.replace(/\s/g, '').length,
                sentenceCount: sentences.length,
                paragraphCount: paragraphs.length,
                readingTime: Math.ceil(words.length / 200)
            },
            readability: this.calculateReadability(text, words, sentences),
            keywords: this.analyzeKeywords(words),
            detailed: this.getDetailedStats(text, words, sentences, paragraphs)
        };
    }

    calculateReadability(text, words, sentences) {
        if (sentences.length === 0 || words.length === 0) {
            return { fleschScore: 0, gradeLevel: 0, avgSentenceLength: 0 };
        }

        const avgSentenceLength = words.length / sentences.length;
        const avgSyllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length;

        // Flesch Reading Ease Score
        const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllables);
        
        // Flesch-Kincaid Grade Level
        const gradeLevel = (0.39 * avgSentenceLength) + (11.8 * avgSyllables) - 15.59;

        return {
            fleschScore: Math.max(0, Math.min(100, fleschScore)),
            gradeLevel: Math.max(0, gradeLevel),
            avgSentenceLength
        };
    }

    analyzeKeywords(words) {
        const excludeStopWords = document.getElementById('excludeStopWords')?.checked ?? true;
        const minLength = parseInt(document.getElementById('minWordLength')?.value) || 3;
        
        const filteredWords = words
            .map(word => word.toLowerCase())
            .filter(word => {
                if (word.length < minLength) return false;
                if (excludeStopWords && this.stopWords.has(word)) return false;
                return /^[a-zA-Z]+$/.test(word);
            });

        const frequency = {};
        filteredWords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([word, count]) => ({
                word,
                count,
                density: ((count / words.length) * 100).toFixed(2)
            }));
    }

    getDetailedStats(text, words, sentences, paragraphs) {
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const longestWord = words.reduce((longest, word) => 
            word.length > longest.length ? word : longest, '');
        const lexicalDiversity = (uniqueWords / words.length * 100).toFixed(1);
        const avgParagraphLength = words.length / paragraphs.length;
        const complexSentences = sentences.filter(s => this.getWords(s).length > 20).length;
        const passiveVoice = this.detectPassiveVoice(sentences);

        return {
            uniqueWords,
            avgWordLength: avgWordLength.toFixed(1),
            longestWord,
            lexicalDiversity,
            avgParagraphLength: avgParagraphLength.toFixed(1),
            complexSentences,
            passiveVoice
        };
    }

    displayResults() {
        const { basic, readability, keywords, detailed } = this.analysisResults;

        // Update readability scores
        document.getElementById('fleschScore').textContent = readability.fleschScore.toFixed(1);
        document.getElementById('fleschDescription').textContent = this.getFleschDescription(readability.fleschScore);
        document.getElementById('gradeLevel').textContent = readability.gradeLevel.toFixed(1);
        document.getElementById('avgSentenceLength').textContent = readability.avgSentenceLength.toFixed(1);

        // Update detailed stats
        document.getElementById('avgWordLength').textContent = detailed.avgWordLength;
        document.getElementById('longestWord').textContent = detailed.longestWord;
        document.getElementById('uniqueWords').textContent = detailed.uniqueWords.toLocaleString();
        document.getElementById('lexicalDiversity').textContent = detailed.lexicalDiversity + '%';
        document.getElementById('avgParagraphLength').textContent = detailed.avgParagraphLength;
        document.getElementById('complexSentences').textContent = detailed.complexSentences;
        document.getElementById('passiveVoice').textContent = detailed.passiveVoice;

        this.updateKeywords();
    }

    updateKeywords() {
        if (!this.analysisResults.keywords) return;
        
        const keywords = this.analyzeKeywords(this.getWords(this.currentText));
        const keywordsList = document.getElementById('keywordsList');
        
        keywordsList.innerHTML = keywords.map(({ word, count, density }) => `
            <div class="keyword-item">
                <span class="keyword-word">${word}</span>
                <span class="keyword-count">${count}</span>
                <span class="keyword-density">${density}%</span>
            </div>
        `).join('');
    }

    // Utility methods
    countWords(text) {
        return this.getWords(text).length;
    }

    countSentences(text) {
        return this.getSentences(text).length;
    }

    countParagraphs(text) {
        return this.getParagraphs(text).length;
    }

    getWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0);
    }

    getSentences(text) {
        return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    }

    getParagraphs(text) {
        return text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    }

    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    detectPassiveVoice(sentences) {
        const passiveIndicators = /\b(was|were|been|being)\s+\w+ed\b/gi;
        return sentences.filter(sentence => passiveIndicators.test(sentence)).length;
    }

    getFleschDescription(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
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

    clearText() {
        document.getElementById('textInput').value = '';
        this.currentText = '';
        this.updateBasicStats();
        document.getElementById('exportBtn').disabled = true;
    }

    loadSampleText() {
        const sampleText = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. It has been used for decades to test typewriters, keyboards, and fonts.

Text analysis is a powerful tool for understanding written content. It can reveal insights about readability, complexity, and keyword usage. Modern text analyzers can process large volumes of text quickly and accurately.

Readability scores help determine how easy or difficult a text is to read. The Flesch Reading Ease score ranges from 0 to 100, with higher scores indicating easier readability. The Flesch-Kincaid Grade Level indicates the education level needed to understand the text.

Keyword density analysis shows which words appear most frequently in a text. This information is valuable for SEO optimization, content analysis, and understanding the main themes of a document.`;
        
        document.getElementById('textInput').value = sampleText;
        this.currentText = sampleText;
        this.updateBasicStats();
    }

    loadFile() {
        document.getElementById('fileInput').click();
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            document.getElementById('textInput').value = text;
            this.currentText = text;
            this.updateBasicStats();
        };
        reader.readAsText(file);
    }

    exportResults() {
        if (!this.analysisResults) {
            alert('Please analyze text first.');
            return;
        }

        const results = {
            timestamp: new Date().toISOString(),
            textSample: this.currentText.substring(0, 100) + '...',
            analysis: this.analysisResults
        };

        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextAnalyzerUtility;
}