/**
 * Scientific Calculator Utility
 * Provides comprehensive scientific calculation functionality including
 * basic arithmetic, trigonometry, logarithms, exponentials, and advanced operations
 */
class ScientificCalculatorUtility {
    constructor() {
        this.container = null;
        this.display = null;
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.memory = 0;
        this.history = [];
        this.angleMode = 'deg'; // 'deg' or 'rad'
        this.lastResult = 0;
    }

    /**
     * Initialize the scientific calculator
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }

        this.createInterface();
        this.attachEventListeners();
        this.addStyles();
        this.updateDisplay();
    }

    /**
     * Create the calculator interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="scientific-calculator">
                <div class="calculator-header">
                    <h2>🔬 Scientific Calculator</h2>
                    <p>Advanced mathematical calculations and scientific functions</p>
                </div>
                
                <div class="calculator-body">
                    <div class="display-section">
                        <div class="display-info">
                            <span class="angle-mode" id="angleMode">DEG</span>
                            <span class="memory-indicator" id="memoryIndicator">M</span>
                        </div>
                        <div class="display" id="calculatorDisplay">0</div>
                        <div class="expression" id="expressionDisplay"></div>
                    </div>
                    
                    <div class="buttons-section">
                        <!-- Row 1: Memory and Mode Functions -->
                        <div class="button-row">
                            <button class="btn btn-memory" data-action="mc">MC</button>
                            <button class="btn btn-memory" data-action="mr">MR</button>
                            <button class="btn btn-memory" data-action="m+">M+</button>
                            <button class="btn btn-memory" data-action="m-">M-</button>
                            <button class="btn btn-mode" data-action="deg-rad">DEG</button>
                        </div>
                        
                        <!-- Row 2: Advanced Functions -->
                        <button class="btn btn-function" data-action="sin">sin</button>
                        <button class="btn btn-function" data-action="cos">cos</button>
                        <button class="btn btn-function" data-action="tan">tan</button>
                        <button class="btn btn-function" data-action="ln">ln</button>
                        <button class="btn btn-function" data-action="log">log</button>
                        
                        <!-- Row 3: More Advanced Functions -->
                        <button class="btn btn-function" data-action="asin">sin⁻¹</button>
                        <button class="btn btn-function" data-action="acos">cos⁻¹</button>
                        <button class="btn btn-function" data-action="atan">tan⁻¹</button>
                        <button class="btn btn-function" data-action="exp">eˣ</button>
                        <button class="btn btn-function" data-action="pow10">10ˣ</button>
                        
                        <!-- Row 4: Power and Root Functions -->
                        <button class="btn btn-function" data-action="square">x²</button>
                        <button class="btn btn-function" data-action="cube">x³</button>
                        <button class="btn btn-function" data-action="power">xʸ</button>
                        <button class="btn btn-function" data-action="sqrt">√</button>
                        <button class="btn btn-function" data-action="cbrt">∛</button>
                        
                        <!-- Row 5: Constants and Special Functions -->
                        <button class="btn btn-constant" data-action="pi">π</button>
                        <button class="btn btn-constant" data-action="e">e</button>
                        <button class="btn btn-function" data-action="factorial">n!</button>
                        <button class="btn btn-function" data-action="abs">|x|</button>
                        <button class="btn btn-function" data-action="reciprocal">1/x</button>
                        
                        <!-- Row 6: Basic Operations -->
                        <button class="btn btn-clear" data-action="clear">C</button>
                        <button class="btn btn-clear" data-action="ce">CE</button>
                        <button class="btn btn-operation" data-action="backspace">⌫</button>
                        <button class="btn btn-operation" data-action="divide">÷</button>
                        <button class="btn btn-operation" data-action="multiply">×</button>
                        
                        <!-- Row 7: Numbers and Operations -->
                        <button class="btn btn-number" data-number="7">7</button>
                        <button class="btn btn-number" data-number="8">8</button>
                        <button class="btn btn-number" data-number="9">9</button>
                        <button class="btn btn-operation" data-action="subtract">−</button>
                        <button class="btn btn-operation" data-action="percent">%</button>
                        
                        <!-- Row 8: Numbers and Operations -->
                        <button class="btn btn-number" data-number="4">4</button>
                        <button class="btn btn-number" data-number="5">5</button>
                        <button class="btn btn-number" data-number="6">6</button>
                        <button class="btn btn-operation" data-action="add">+</button>
                        <button class="btn btn-operation" data-action="negate">±</button>
                        
                        <!-- Row 9: Numbers and Operations -->
                        <button class="btn btn-number" data-number="1">1</button>
                        <button class="btn btn-number" data-number="2">2</button>
                        <button class="btn btn-number" data-number="3">3</button>
                        <button class="btn btn-equals" data-action="equals" rowspan="2">=</button>
                        <button class="btn btn-operation" data-action="random">Rnd</button>
                        
                        <!-- Row 10: Zero and Decimal -->
                        <button class="btn btn-number btn-zero" data-number="0">0</button>
                        <button class="btn btn-operation" data-action="decimal">.</button>
                        <button class="btn btn-operation" data-action="parentheses">()</button>
                        <button class="btn btn-operation" data-action="history">Hist</button>
                    </div>
                    
                    <div class="history-section" id="historySection">
                        <div class="history-header">
                            <h3>Calculation History</h3>
                            <button class="btn btn-small" id="clearHistory">Clear</button>
                        </div>
                        <div class="history-list" id="historyList"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const buttonsSection = this.container.querySelector('.buttons-section');
        
        buttonsSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                this.handleButtonClick(e.target);
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // History clear button
        const clearHistoryBtn = this.container.querySelector('#clearHistory');
        clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
    }

    /**
     * Handle button clicks
     */
    handleButtonClick(button) {
        const action = button.dataset.action;
        const number = button.dataset.number;

        if (number !== undefined) {
            this.inputNumber(number);
        } else if (action) {
            this.performAction(action);
        }

        this.updateDisplay();
    }

    /**
     * Handle keyboard input
     */
    handleKeyPress(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else {
            switch (key) {
                case '+':
                    this.performAction('add');
                    break;
                case '-':
                    this.performAction('subtract');
                    break;
                case '*':
                    this.performAction('multiply');
                    break;
                case '/':
                    e.preventDefault();
                    this.performAction('divide');
                    break;
                case 'Enter':
                case '=':
                    this.performAction('equals');
                    break;
                case 'Escape':
                case 'c':
                case 'C':
                    this.performAction('clear');
                    break;
                case 'Backspace':
                    this.performAction('backspace');
                    break;
                case '.':
                    this.performAction('decimal');
                    break;
                case '%':
                    this.performAction('percent');
                    break;
            }
        }
        
        this.updateDisplay();
    }

    /**
     * Input a number
     */
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
    }

    /**
     * Perform calculator actions
     */
    performAction(action) {
        const current = parseFloat(this.currentInput);
        
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'ce':
                this.currentInput = '0';
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'negate':
                this.currentInput = String(-current);
                break;
            case 'percent':
                this.currentInput = String(current / 100);
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'power':
                this.performBasicOperation(action);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'sin':
                this.currentInput = String(this.sin(current));
                this.addToHistory(`sin(${current})`, this.currentInput);
                break;
            case 'cos':
                this.currentInput = String(this.cos(current));
                this.addToHistory(`cos(${current})`, this.currentInput);
                break;
            case 'tan':
                this.currentInput = String(this.tan(current));
                this.addToHistory(`tan(${current})`, this.currentInput);
                break;
            case 'asin':
                this.currentInput = String(this.asin(current));
                this.addToHistory(`sin⁻¹(${current})`, this.currentInput);
                break;
            case 'acos':
                this.currentInput = String(this.acos(current));
                this.addToHistory(`cos⁻¹(${current})`, this.currentInput);
                break;
            case 'atan':
                this.currentInput = String(this.atan(current));
                this.addToHistory(`tan⁻¹(${current})`, this.currentInput);
                break;
            case 'ln':
                this.currentInput = String(Math.log(current));
                this.addToHistory(`ln(${current})`, this.currentInput);
                break;
            case 'log':
                this.currentInput = String(Math.log10(current));
                this.addToHistory(`log(${current})`, this.currentInput);
                break;
            case 'exp':
                this.currentInput = String(Math.exp(current));
                this.addToHistory(`e^${current}`, this.currentInput);
                break;
            case 'pow10':
                this.currentInput = String(Math.pow(10, current));
                this.addToHistory(`10^${current}`, this.currentInput);
                break;
            case 'square':
                this.currentInput = String(Math.pow(current, 2));
                this.addToHistory(`${current}²`, this.currentInput);
                break;
            case 'cube':
                this.currentInput = String(Math.pow(current, 3));
                this.addToHistory(`${current}³`, this.currentInput);
                break;
            case 'sqrt':
                this.currentInput = String(Math.sqrt(current));
                this.addToHistory(`√${current}`, this.currentInput);
                break;
            case 'cbrt':
                this.currentInput = String(Math.cbrt(current));
                this.addToHistory(`∛${current}`, this.currentInput);
                break;
            case 'factorial':
                this.currentInput = String(this.factorial(current));
                this.addToHistory(`${current}!`, this.currentInput);
                break;
            case 'abs':
                this.currentInput = String(Math.abs(current));
                this.addToHistory(`|${current}|`, this.currentInput);
                break;
            case 'reciprocal':
                this.currentInput = String(1 / current);
                this.addToHistory(`1/${current}`, this.currentInput);
                break;
            case 'pi':
                this.currentInput = String(Math.PI);
                break;
            case 'e':
                this.currentInput = String(Math.E);
                break;
            case 'random':
                this.currentInput = String(Math.random());
                break;
            case 'deg-rad':
                this.toggleAngleMode();
                break;
            case 'mc':
                this.memory = 0;
                this.updateMemoryIndicator();
                break;
            case 'mr':
                this.currentInput = String(this.memory);
                break;
            case 'm+':
                this.memory += current;
                this.updateMemoryIndicator();
                break;
            case 'm-':
                this.memory -= current;
                this.updateMemoryIndicator();
                break;
            case 'history':
                this.toggleHistory();
                break;
        }
    }

    /**
     * Perform basic arithmetic operations
     */
    performBasicOperation(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === null) {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(this.operator, currentValue, inputValue);

            this.currentInput = String(newValue);
            this.previousInput = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    /**
     * Perform calculation
     */
    performCalculation(operator, firstOperand, secondOperand) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return secondOperand !== 0 ? firstOperand / secondOperand : 0;
            case 'power':
                return Math.pow(firstOperand, secondOperand);
            default:
                return secondOperand;
        }
    }

    /**
     * Calculate final result
     */
    calculate() {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== null && this.operator) {
            const newValue = this.performCalculation(this.operator, this.previousInput, inputValue);
            const expression = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${inputValue}`;
            
            this.addToHistory(expression, String(newValue));
            this.currentInput = String(newValue);
            this.lastResult = newValue;
            this.previousInput = null;
            this.operator = null;
            this.waitingForOperand = true;
        }
    }

    /**
     * Get operator symbol for display
     */
    getOperatorSymbol(operator) {
        switch (operator) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'power': return '^';
            default: return operator;
        }
    }

    /**
     * Trigonometric functions (handle angle mode)
     */
    sin(value) {
        return Math.sin(this.angleMode === 'deg' ? this.degToRad(value) : value);
    }

    cos(value) {
        return Math.cos(this.angleMode === 'deg' ? this.degToRad(value) : value);
    }

    tan(value) {
        return Math.tan(this.angleMode === 'deg' ? this.degToRad(value) : value);
    }

    asin(value) {
        const result = Math.asin(value);
        return this.angleMode === 'deg' ? this.radToDeg(result) : result;
    }

    acos(value) {
        const result = Math.acos(value);
        return this.angleMode === 'deg' ? this.radToDeg(result) : result;
    }

    atan(value) {
        const result = Math.atan(value);
        return this.angleMode === 'deg' ? this.radToDeg(result) : result;
    }

    /**
     * Angle conversion utilities
     */
    degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Factorial function
     */
    factorial(n) {
        if (n < 0 || n !== Math.floor(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Clear calculator
     */
    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForOperand = false;
    }

    /**
     * Backspace function
     */
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }

    /**
     * Input decimal point
     */
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
    }

    /**
     * Toggle angle mode
     */
    toggleAngleMode() {
        this.angleMode = this.angleMode === 'deg' ? 'rad' : 'deg';
        const angleModeElement = this.container.querySelector('#angleMode');
        const toggleButton = this.container.querySelector('[data-action="deg-rad"]');
        
        angleModeElement.textContent = this.angleMode.toUpperCase();
        toggleButton.textContent = this.angleMode.toUpperCase();
    }

    /**
     * Update display
     */
    updateDisplay() {
        const display = this.container.querySelector('#calculatorDisplay');
        const expressionDisplay = this.container.querySelector('#expressionDisplay');
        
        display.textContent = this.formatNumber(this.currentInput);
        
        if (this.operator && this.previousInput !== null) {
            expressionDisplay.textContent = `${this.formatNumber(this.previousInput)} ${this.getOperatorSymbol(this.operator)}`;
        } else {
            expressionDisplay.textContent = '';
        }
    }

    /**
     * Format number for display
     */
    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        
        // Handle very large or very small numbers
        if (Math.abs(number) >= 1e15 || (Math.abs(number) < 1e-10 && number !== 0)) {
            return number.toExponential(10);
        }
        
        // Format with appropriate decimal places
        return number.toString();
    }

    /**
     * Add calculation to history
     */
    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 50 calculations
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyList = this.container.querySelector('#historyList');
        
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="calculator.useHistoryResult('${item.result}')">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${this.formatNumber(item.result)}</div>
                <div class="history-time">${item.timestamp}</div>
            </div>
        `).join('');
    }

    /**
     * Use result from history
     */
    useHistoryResult(result) {
        this.currentInput = result;
        this.updateDisplay();
        this.toggleHistory(); // Close history panel
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    /**
     * Toggle history panel
     */
    toggleHistory() {
        const historySection = this.container.querySelector('#historySection');
        historySection.classList.toggle('visible');
    }

    /**
     * Update memory indicator
     */
    updateMemoryIndicator() {
        const memoryIndicator = this.container.querySelector('#memoryIndicator');
        memoryIndicator.style.opacity = this.memory !== 0 ? '1' : '0.3';
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('scientificCalculatorStyles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'scientificCalculatorStyles';
        styles.textContent = `
            .scientific-calculator {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f8f9fa;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .calculator-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px;
            }
            
            .calculator-header h2 {
                margin: 0 0 10px 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            
            .calculator-header p {
                margin: 0;
                opacity: 0.9;
                font-size: 1.1em;
            }
            
            .calculator-body {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 20px;
            }
            
            .display-section {
                background: #1a1a1a;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                grid-column: 1 / -1;
            }
            
            .display-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 0.9em;
                opacity: 0.7;
            }
            
            .memory-indicator {
                opacity: 0.3;
                transition: opacity 0.3s ease;
            }
            
            .display {
                font-size: 3em;
                font-weight: 300;
                text-align: right;
                margin-bottom: 5px;
                min-height: 1.2em;
                word-break: break-all;
            }
            
            .expression {
                font-size: 1.2em;
                text-align: right;
                opacity: 0.6;
                min-height: 1.5em;
            }
            
            .buttons-section {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
            }
            
            .button-row {
                display: contents;
            }
            
            .btn {
                padding: 15px 10px;
                border: none;
                border-radius: 6px;
                font-size: 1.1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                background: white;
                color: #333;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            .btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .btn-number {
                background: #e9ecef;
                color: #333;
            }
            
            .btn-number:hover {
                background: #dee2e6;
            }
            
            .btn-operation {
                background: #6c757d;
                color: white;
            }
            
            .btn-operation:hover {
                background: #5a6268;
            }
            
            .btn-function {
                background: #007bff;
                color: white;
                font-size: 0.9em;
            }
            
            .btn-function:hover {
                background: #0056b3;
            }
            
            .btn-constant {
                background: #28a745;
                color: white;
            }
            
            .btn-constant:hover {
                background: #1e7e34;
            }
            
            .btn-memory {
                background: #ffc107;
                color: #333;
            }
            
            .btn-memory:hover {
                background: #e0a800;
            }
            
            .btn-mode {
                background: #17a2b8;
                color: white;
            }
            
            .btn-mode:hover {
                background: #117a8b;
            }
            
            .btn-clear {
                background: #dc3545;
                color: white;
            }
            
            .btn-clear:hover {
                background: #c82333;
            }
            
            .btn-equals {
                background: #28a745;
                color: white;
                grid-row: span 2;
            }
            
            .btn-equals:hover {
                background: #1e7e34;
            }
            
            .btn-zero {
                grid-column: span 2;
            }
            
            .history-section {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-height: 500px;
                overflow-y: auto;
                display: none;
            }
            
            .history-section.visible {
                display: block;
            }
            
            .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .history-header h3 {
                margin: 0;
                font-size: 1.2em;
                color: #333;
            }
            
            .btn-small {
                padding: 5px 10px;
                font-size: 0.8em;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .btn-small:hover {
                background: #5a6268;
            }
            
            .history-item {
                padding: 10px;
                margin-bottom: 8px;
                background: #f8f9fa;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .history-item:hover {
                background: #e9ecef;
            }
            
            .history-expression {
                font-size: 0.9em;
                color: #6c757d;
                margin-bottom: 2px;
            }
            
            .history-result {
                font-size: 1.1em;
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
            }
            
            .history-time {
                font-size: 0.8em;
                color: #adb5bd;
            }
            
            @media (max-width: 768px) {
                .calculator-body {
                    grid-template-columns: 1fr;
                }
                
                .buttons-section {
                    grid-template-columns: repeat(4, 1fr);
                }
                
                .btn {
                    padding: 12px 8px;
                    font-size: 1em;
                }
                
                .display {
                    font-size: 2.5em;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Make calculator available globally for history item clicks
let calculator;