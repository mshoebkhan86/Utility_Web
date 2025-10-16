/**
 * Loan Calculator Utility
 * Provides comprehensive loan calculation functionality including monthly payments,
 * total interest, amortization schedules, and various loan scenarios
 */
class LoanCalculatorUtility {
    constructor() {
        this.container = null;
        this.currentLoan = null;
        this.amortizationSchedule = [];
        this.chartInstance = null;
    }

    /**
     * Initialize the loan calculator
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
    }

    /**
     * Create the calculator interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="loan-calculator">
                <div class="calculator-header">
                    <h2>💰 Loan Calculator</h2>
                    <p>Calculate loan payments, interest, and amortization schedules</p>
                </div>
                
                <div class="calculator-content">
                    <div class="input-section">
                        <div class="loan-inputs">
                            <div class="input-group">
                                <label for="loanAmount">Loan Amount ($)</label>
                                <input type="number" id="loanAmount" placeholder="250000" min="1" step="1000">
                            </div>
                            
                            <div class="input-group">
                                <label for="interestRate">Annual Interest Rate (%)</label>
                                <input type="number" id="interestRate" placeholder="5.5" min="0" max="50" step="0.01">
                            </div>
                            
                            <div class="input-group">
                                <label for="loanTerm">Loan Term</label>
                                <div class="term-inputs">
                                    <input type="number" id="loanTermYears" placeholder="30" min="1" max="50">
                                    <span>years</span>
                                    <input type="number" id="loanTermMonths" placeholder="0" min="0" max="11">
                                    <span>months</span>
                                </div>
                            </div>
                            
                            <div class="input-group">
                                <label for="downPayment">Down Payment ($)</label>
                                <input type="number" id="downPayment" placeholder="50000" min="0" step="1000">
                            </div>
                            
                            <div class="input-group">
                                <label for="startDate">Start Date</label>
                                <input type="date" id="startDate">
                            </div>
                            
                            <div class="input-group">
                                <label for="extraPayment">Extra Monthly Payment ($)</label>
                                <input type="number" id="extraPayment" placeholder="0" min="0" step="100">
                            </div>
                        </div>
                        
                        <div class="calculation-buttons">
                            <button class="btn-primary" id="calculateBtn">Calculate Loan</button>
                            <button class="btn-secondary" id="resetBtn">Reset</button>
                            <button class="btn-secondary" id="compareBtn">Compare Loans</button>
                        </div>
                    </div>
                    
                    <div class="results-section">
                        <div class="loan-summary" id="loanSummary" style="display: none;">
                            <h3>Loan Summary</h3>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <span class="label">Monthly Payment:</span>
                                    <span class="value" id="monthlyPayment">$0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Total Interest:</span>
                                    <span class="value" id="totalInterest">$0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Total Amount:</span>
                                    <span class="value" id="totalAmount">$0</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Payoff Date:</span>
                                    <span class="value" id="payoffDate">-</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="chart-container" id="chartContainer" style="display: none;">
                            <h3>Payment Breakdown</h3>
                            <canvas id="paymentChart" width="400" height="200"></canvas>
                        </div>
                        
                        <div class="amortization-section" id="amortizationSection" style="display: none;">
                            <div class="section-header">
                                <h3>Amortization Schedule</h3>
                                <div class="schedule-controls">
                                    <button class="btn-secondary" id="exportScheduleBtn">Export CSV</button>
                                    <button class="btn-secondary" id="printScheduleBtn">Print</button>
                                </div>
                            </div>
                            <div class="schedule-table-container">
                                <table class="amortization-table" id="amortizationTable">
                                    <thead>
                                        <tr>
                                            <th>Payment #</th>
                                            <th>Date</th>
                                            <th>Payment</th>
                                            <th>Principal</th>
                                            <th>Interest</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody id="scheduleBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-modal" id="comparisonModal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Loan Comparison</h3>
                            <button class="close-btn" id="closeComparisonBtn">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="comparison-inputs">
                                <div class="loan-option">
                                    <h4>Loan Option 1</h4>
                                    <div class="input-group">
                                        <label>Amount ($)</label>
                                        <input type="number" id="loan1Amount" placeholder="250000">
                                    </div>
                                    <div class="input-group">
                                        <label>Rate (%)</label>
                                        <input type="number" id="loan1Rate" placeholder="5.5" step="0.01">
                                    </div>
                                    <div class="input-group">
                                        <label>Term (years)</label>
                                        <input type="number" id="loan1Term" placeholder="30">
                                    </div>
                                </div>
                                
                                <div class="loan-option">
                                    <h4>Loan Option 2</h4>
                                    <div class="input-group">
                                        <label>Amount ($)</label>
                                        <input type="number" id="loan2Amount" placeholder="250000">
                                    </div>
                                    <div class="input-group">
                                        <label>Rate (%)</label>
                                        <input type="number" id="loan2Rate" placeholder="6.0" step="0.01">
                                    </div>
                                    <div class="input-group">
                                        <label>Term (years)</label>
                                        <input type="number" id="loan2Term" placeholder="15">
                                    </div>
                                </div>
                            </div>
                            
                            <button class="btn-primary" id="compareLoansBtn">Compare</button>
                            
                            <div class="comparison-results" id="comparisonResults" style="display: none;">
                                <table class="comparison-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Loan Option 1</th>
                                            <th>Loan Option 2</th>
                                            <th>Difference</th>
                                        </tr>
                                    </thead>
                                    <tbody id="comparisonBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set default start date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculateLoan());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCalculator());
        document.getElementById('compareBtn').addEventListener('click', () => this.showComparisonModal());
        document.getElementById('closeComparisonBtn').addEventListener('click', () => this.hideComparisonModal());
        document.getElementById('compareLoansBtn').addEventListener('click', () => this.compareLoans());
        document.getElementById('exportScheduleBtn').addEventListener('click', () => this.exportSchedule());
        document.getElementById('printScheduleBtn').addEventListener('click', () => this.printSchedule());
        
        // Auto-calculate on input change
        const inputs = ['loanAmount', 'interestRate', 'loanTermYears', 'loanTermMonths', 'downPayment', 'extraPayment'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    if (this.hasValidInputs()) {
                        this.calculateLoan();
                    }
                });
            }
        });
    }

    /**
     * Check if inputs are valid for calculation
     */
    hasValidInputs() {
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const years = parseInt(document.getElementById('loanTermYears').value) || 0;
        const months = parseInt(document.getElementById('loanTermMonths').value) || 0;
        
        return amount > 0 && rate >= 0 && (years > 0 || months > 0);
    }

    /**
     * Calculate loan payments and details
     */
    calculateLoan() {
        try {
            const loanData = this.getLoanData();
            if (!this.validateLoanData(loanData)) {
                return;
            }

            const calculations = this.performCalculations(loanData);
            this.currentLoan = { ...loanData, ...calculations };
            
            this.displayResults(calculations);
            this.generateAmortizationSchedule(loanData, calculations);
            this.createPaymentChart(calculations);
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showNotification('Error calculating loan. Please check your inputs.', 'error');
        }
    }

    /**
     * Get loan data from inputs
     */
    getLoanData() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const principalAmount = loanAmount - downPayment;
        
        return {
            loanAmount,
            principalAmount,
            downPayment,
            annualRate: parseFloat(document.getElementById('interestRate').value) || 0,
            termYears: parseInt(document.getElementById('loanTermYears').value) || 0,
            termMonths: parseInt(document.getElementById('loanTermMonths').value) || 0,
            extraPayment: parseFloat(document.getElementById('extraPayment').value) || 0,
            startDate: new Date(document.getElementById('startDate').value)
        };
    }

    /**
     * Validate loan data
     */
    validateLoanData(data) {
        if (data.loanAmount <= 0) {
            this.showNotification('Please enter a valid loan amount.', 'error');
            return false;
        }
        
        if (data.principalAmount <= 0) {
            this.showNotification('Principal amount must be greater than 0.', 'error');
            return false;
        }
        
        if (data.annualRate < 0 || data.annualRate > 50) {
            this.showNotification('Please enter a valid interest rate (0-50%).', 'error');
            return false;
        }
        
        if (data.termYears === 0 && data.termMonths === 0) {
            this.showNotification('Please enter a valid loan term.', 'error');
            return false;
        }
        
        return true;
    }

    /**
     * Perform loan calculations
     */
    performCalculations(data) {
        const totalMonths = (data.termYears * 12) + data.termMonths;
        const monthlyRate = data.annualRate / 100 / 12;
        
        // Calculate monthly payment using standard loan formula
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = data.principalAmount / totalMonths;
        } else {
            monthlyPayment = data.principalAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        
        // Calculate totals without extra payments
        const totalPayments = monthlyPayment * totalMonths;
        const totalInterest = totalPayments - data.principalAmount;
        
        // Calculate with extra payments
        const extraResults = this.calculateWithExtraPayments(data, monthlyPayment, monthlyRate);
        
        return {
            monthlyPayment,
            totalPayments,
            totalInterest,
            totalMonths,
            monthlyRate,
            ...extraResults
        };
    }

    /**
     * Calculate loan with extra payments
     */
    calculateWithExtraPayments(data, monthlyPayment, monthlyRate) {
        if (data.extraPayment === 0) {
            const payoffDate = new Date(data.startDate);
            payoffDate.setMonth(payoffDate.getMonth() + (data.termYears * 12) + data.termMonths);
            
            return {
                actualMonthlyPayment: monthlyPayment,
                actualTotalInterest: monthlyPayment * ((data.termYears * 12) + data.termMonths) - data.principalAmount,
                actualPayoffDate: payoffDate,
                interestSaved: 0,
                timeSaved: 0
            };
        }
        
        let balance = data.principalAmount;
        let totalInterestPaid = 0;
        let paymentCount = 0;
        const actualMonthlyPayment = monthlyPayment + data.extraPayment;
        
        while (balance > 0.01 && paymentCount < 600) { // Max 50 years
            const interestPayment = balance * monthlyRate;
            const principalPayment = Math.min(actualMonthlyPayment - interestPayment, balance);
            
            balance -= principalPayment;
            totalInterestPaid += interestPayment;
            paymentCount++;
        }
        
        const actualPayoffDate = new Date(data.startDate);
        actualPayoffDate.setMonth(actualPayoffDate.getMonth() + paymentCount);
        
        const originalTotalInterest = monthlyPayment * ((data.termYears * 12) + data.termMonths) - data.principalAmount;
        const interestSaved = originalTotalInterest - totalInterestPaid;
        const timeSaved = ((data.termYears * 12) + data.termMonths) - paymentCount;
        
        return {
            actualMonthlyPayment,
            actualTotalInterest: totalInterestPaid,
            actualPayoffDate,
            interestSaved,
            timeSaved
        };
    }

    /**
     * Display calculation results
     */
    displayResults(calculations) {
        document.getElementById('monthlyPayment').textContent = this.formatCurrency(calculations.actualMonthlyPayment || calculations.monthlyPayment);
        document.getElementById('totalInterest').textContent = this.formatCurrency(calculations.actualTotalInterest || calculations.totalInterest);
        document.getElementById('totalAmount').textContent = this.formatCurrency(
            this.currentLoan.principalAmount + (calculations.actualTotalInterest || calculations.totalInterest)
        );
        document.getElementById('payoffDate').textContent = (calculations.actualPayoffDate || new Date()).toLocaleDateString();
        
        document.getElementById('loanSummary').style.display = 'block';
    }

    /**
     * Generate amortization schedule
     */
    generateAmortizationSchedule(loanData, calculations) {
        this.amortizationSchedule = [];
        let balance = loanData.principalAmount;
        let currentDate = new Date(loanData.startDate);
        const monthlyPayment = calculations.actualMonthlyPayment || calculations.monthlyPayment;
        
        for (let i = 1; balance > 0.01 && i <= 600; i++) {
            const interestPayment = balance * calculations.monthlyRate;
            const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
            balance -= principalPayment;
            
            this.amortizationSchedule.push({
                paymentNumber: i,
                date: new Date(currentDate),
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
            
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        this.displayAmortizationSchedule();
    }

    /**
     * Display amortization schedule
     */
    displayAmortizationSchedule() {
        const tbody = document.getElementById('scheduleBody');
        tbody.innerHTML = '';
        
        // Show first 12 payments and last 12 payments if schedule is long
        const schedule = this.amortizationSchedule;
        const showAll = schedule.length <= 24;
        
        const paymentsToShow = showAll ? schedule : [
            ...schedule.slice(0, 12),
            { paymentNumber: '...', date: null, payment: '...', principal: '...', interest: '...', balance: '...' },
            ...schedule.slice(-12)
        ];
        
        paymentsToShow.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.paymentNumber}</td>
                <td>${payment.date ? payment.date.toLocaleDateString() : '...'}</td>
                <td>${typeof payment.payment === 'number' ? this.formatCurrency(payment.payment) : payment.payment}</td>
                <td>${typeof payment.principal === 'number' ? this.formatCurrency(payment.principal) : payment.principal}</td>
                <td>${typeof payment.interest === 'number' ? this.formatCurrency(payment.interest) : payment.interest}</td>
                <td>${typeof payment.balance === 'number' ? this.formatCurrency(payment.balance) : payment.balance}</td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('amortizationSection').style.display = 'block';
    }

    /**
     * Create payment breakdown chart
     */
    createPaymentChart(calculations) {
        const canvas = document.getElementById('paymentChart');
        const ctx = canvas.getContext('2d');
        
        // Clear previous chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const totalInterest = calculations.actualTotalInterest || calculations.totalInterest;
        const principal = this.currentLoan.principalAmount;
        const total = principal + totalInterest;
        
        // Draw pie chart
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const principalAngle = (principal / total) * 2 * Math.PI;
        const interestAngle = (totalInterest / total) * 2 * Math.PI;
        
        // Draw principal slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, principalAngle);
        ctx.closePath();
        ctx.fillStyle = '#3498db';
        ctx.fill();
        
        // Draw interest slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, principalAngle, principalAngle + interestAngle);
        ctx.closePath();
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        
        // Add labels
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        // Principal label
        const principalLabelAngle = principalAngle / 2;
        const principalLabelX = centerX + Math.cos(principalLabelAngle) * (radius * 0.7);
        const principalLabelY = centerY + Math.sin(principalLabelAngle) * (radius * 0.7);
        ctx.fillText('Principal', principalLabelX, principalLabelY);
        ctx.fillText(this.formatCurrency(principal), principalLabelX, principalLabelY + 16);
        
        // Interest label
        const interestLabelAngle = principalAngle + (interestAngle / 2);
        const interestLabelX = centerX + Math.cos(interestLabelAngle) * (radius * 0.7);
        const interestLabelY = centerY + Math.sin(interestLabelAngle) * (radius * 0.7);
        ctx.fillText('Interest', interestLabelX, interestLabelY);
        ctx.fillText(this.formatCurrency(totalInterest), interestLabelX, interestLabelY + 16);
        
        document.getElementById('chartContainer').style.display = 'block';
    }

    /**
     * Show comparison modal
     */
    showComparisonModal() {
        document.getElementById('comparisonModal').style.display = 'flex';
    }

    /**
     * Hide comparison modal
     */
    hideComparisonModal() {
        document.getElementById('comparisonModal').style.display = 'none';
    }

    /**
     * Compare two loans
     */
    compareLoans() {
        const loan1 = {
            amount: parseFloat(document.getElementById('loan1Amount').value) || 0,
            rate: parseFloat(document.getElementById('loan1Rate').value) || 0,
            term: parseInt(document.getElementById('loan1Term').value) || 0
        };
        
        const loan2 = {
            amount: parseFloat(document.getElementById('loan2Amount').value) || 0,
            rate: parseFloat(document.getElementById('loan2Rate').value) || 0,
            term: parseInt(document.getElementById('loan2Term').value) || 0
        };
        
        if (!this.validateComparisonInputs(loan1, loan2)) {
            return;
        }
        
        const calc1 = this.calculateLoanDetails(loan1.amount, loan1.rate, loan1.term);
        const calc2 = this.calculateLoanDetails(loan2.amount, loan2.rate, loan2.term);
        
        this.displayComparison(calc1, calc2);
    }

    /**
     * Validate comparison inputs
     */
    validateComparisonInputs(loan1, loan2) {
        if (loan1.amount <= 0 || loan2.amount <= 0) {
            this.showNotification('Please enter valid loan amounts for both loans.', 'error');
            return false;
        }
        
        if (loan1.rate < 0 || loan2.rate < 0 || loan1.rate > 50 || loan2.rate > 50) {
            this.showNotification('Please enter valid interest rates (0-50%).', 'error');
            return false;
        }
        
        if (loan1.term <= 0 || loan2.term <= 0) {
            this.showNotification('Please enter valid loan terms.', 'error');
            return false;
        }
        
        return true;
    }

    /**
     * Calculate loan details for comparison
     */
    calculateLoanDetails(amount, rate, termYears) {
        const totalMonths = termYears * 12;
        const monthlyRate = rate / 100 / 12;
        
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = amount / totalMonths;
        } else {
            monthlyPayment = amount * 
                (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        
        const totalPayments = monthlyPayment * totalMonths;
        const totalInterest = totalPayments - amount;
        
        return {
            monthlyPayment,
            totalPayments,
            totalInterest,
            amount
        };
    }

    /**
     * Display loan comparison
     */
    displayComparison(calc1, calc2) {
        const tbody = document.getElementById('comparisonBody');
        tbody.innerHTML = `
            <tr>
                <td><strong>Monthly Payment</strong></td>
                <td>${this.formatCurrency(calc1.monthlyPayment)}</td>
                <td>${this.formatCurrency(calc2.monthlyPayment)}</td>
                <td class="${calc1.monthlyPayment < calc2.monthlyPayment ? 'better' : 'worse'}">
                    ${this.formatCurrency(Math.abs(calc1.monthlyPayment - calc2.monthlyPayment))}
                </td>
            </tr>
            <tr>
                <td><strong>Total Interest</strong></td>
                <td>${this.formatCurrency(calc1.totalInterest)}</td>
                <td>${this.formatCurrency(calc2.totalInterest)}</td>
                <td class="${calc1.totalInterest < calc2.totalInterest ? 'better' : 'worse'}">
                    ${this.formatCurrency(Math.abs(calc1.totalInterest - calc2.totalInterest))}
                </td>
            </tr>
            <tr>
                <td><strong>Total Amount</strong></td>
                <td>${this.formatCurrency(calc1.totalPayments)}</td>
                <td>${this.formatCurrency(calc2.totalPayments)}</td>
                <td class="${calc1.totalPayments < calc2.totalPayments ? 'better' : 'worse'}">
                    ${this.formatCurrency(Math.abs(calc1.totalPayments - calc2.totalPayments))}
                </td>
            </tr>
        `;
        
        document.getElementById('comparisonResults').style.display = 'block';
    }

    /**
     * Export amortization schedule to CSV
     */
    exportSchedule() {
        if (!this.amortizationSchedule.length) {
            this.showNotification('No schedule to export. Please calculate a loan first.', 'error');
            return;
        }
        
        let csv = 'Payment #,Date,Payment Amount,Principal,Interest,Remaining Balance\n';
        
        this.amortizationSchedule.forEach(payment => {
            csv += `${payment.paymentNumber},${payment.date.toLocaleDateString()},${payment.payment.toFixed(2)},${payment.principal.toFixed(2)},${payment.interest.toFixed(2)},${payment.balance.toFixed(2)}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'loan_amortization_schedule.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Schedule exported successfully!', 'success');
    }

    /**
     * Print amortization schedule
     */
    printSchedule() {
        if (!this.amortizationSchedule.length) {
            this.showNotification('No schedule to print. Please calculate a loan first.', 'error');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Loan Amortization Schedule</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        .header { text-align: center; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Loan Amortization Schedule</h1>
                        <p>Loan Amount: ${this.formatCurrency(this.currentLoan.principalAmount)}</p>
                        <p>Interest Rate: ${this.currentLoan.annualRate}%</p>
                        <p>Monthly Payment: ${this.formatCurrency(this.currentLoan.actualMonthlyPayment || this.currentLoan.monthlyPayment)}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Payment #</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.amortizationSchedule.map(payment => `
                                <tr>
                                    <td>${payment.paymentNumber}</td>
                                    <td>${payment.date.toLocaleDateString()}</td>
                                    <td>${this.formatCurrency(payment.payment)}</td>
                                    <td>${this.formatCurrency(payment.principal)}</td>
                                    <td>${this.formatCurrency(payment.interest)}</td>
                                    <td>${this.formatCurrency(payment.balance)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Reset calculator
     */
    resetCalculator() {
        document.getElementById('loanAmount').value = '';
        document.getElementById('interestRate').value = '';
        document.getElementById('loanTermYears').value = '';
        document.getElementById('loanTermMonths').value = '';
        document.getElementById('downPayment').value = '';
        document.getElementById('extraPayment').value = '';
        
        document.getElementById('loanSummary').style.display = 'none';
        document.getElementById('chartContainer').style.display = 'none';
        document.getElementById('amortizationSection').style.display = 'none';
        
        this.currentLoan = null;
        this.amortizationSchedule = [];
    }

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Show notification
     */
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
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('loanCalculatorStyles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'loanCalculatorStyles';
        styles.textContent = `
            .loan-calculator {
                max-width: 1200px;
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
            
            .calculator-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 20px;
            }
            
            .input-section {
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .loan-inputs {
                display: grid;
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .input-group {
                display: flex;
                flex-direction: column;
            }
            
            .input-group label {
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
                font-size: 0.95em;
            }
            
            .input-group input {
                padding: 12px;
                border: 2px solid #e1e5e9;
                border-radius: 6px;
                font-size: 1em;
                transition: border-color 0.3s ease;
            }
            
            .input-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .term-inputs {
                display: grid;
                grid-template-columns: 1fr auto 1fr auto;
                gap: 10px;
                align-items: center;
            }
            
            .term-inputs span {
                font-size: 0.9em;
                color: #666;
                font-weight: 500;
            }
            
            .calculation-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
            }
            
            .btn-primary, .btn-secondary {
                padding: 12px 20px;
                border: none;
                border-radius: 6px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
            }
            
            .btn-secondary {
                background: #f8f9fa;
                color: #333;
                border: 2px solid #e1e5e9;
            }
            
            .btn-secondary:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }
            
            .results-section {
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .loan-summary {
                margin-bottom: 25px;
            }
            
            .loan-summary h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.4em;
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            
            .summary-item .label {
                font-weight: 600;
                color: #333;
            }
            
            .summary-item .value {
                font-weight: 700;
                color: #667eea;
                font-size: 1.1em;
            }
            
            .chart-container {
                margin-bottom: 25px;
                text-align: center;
            }
            
            .chart-container h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.4em;
            }
            
            .amortization-section h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 1.4em;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .schedule-controls {
                display: flex;
                gap: 10px;
            }
            
            .schedule-table-container {
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #e1e5e9;
                border-radius: 6px;
            }
            
            .amortization-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.9em;
            }
            
            .amortization-table th {
                background: #f8f9fa;
                padding: 12px 8px;
                text-align: right;
                font-weight: 600;
                color: #333;
                border-bottom: 2px solid #e1e5e9;
                position: sticky;
                top: 0;
            }
            
            .amortization-table td {
                padding: 10px 8px;
                text-align: right;
                border-bottom: 1px solid #f1f3f4;
            }
            
            .amortization-table tr:hover {
                background: #f8f9fa;
            }
            
            .comparison-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 800px;
                width: 90%;
                max-height: 90%;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f1f3f4;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.5em;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                color: #666;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                background: #f1f3f4;
                color: #333;
            }
            
            .comparison-inputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 25px;
            }
            
            .loan-option {
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 2px solid #e1e5e9;
            }
            
            .loan-option h4 {
                margin: 0 0 15px 0;
                color: #333;
                text-align: center;
            }
            
            .comparison-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            
            .comparison-table th,
            .comparison-table td {
                padding: 12px;
                text-align: right;
                border: 1px solid #e1e5e9;
            }
            
            .comparison-table th {
                background: #f8f9fa;
                font-weight: 600;
                color: #333;
            }
            
            .comparison-table .better {
                color: #28a745;
                font-weight: 600;
            }
            
            .comparison-table .worse {
                color: #dc3545;
                font-weight: 600;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 600;
                z-index: 1001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                background: #28a745;
            }
            
            .notification.error {
                background: #dc3545;
            }
            
            .notification.info {
                background: #17a2b8;
            }
            
            @media (max-width: 768px) {
                .calculator-content {
                    grid-template-columns: 1fr;
                }
                
                .summary-grid {
                    grid-template-columns: 1fr;
                }
                
                .calculation-buttons {
                    grid-template-columns: 1fr;
                }
                
                .comparison-inputs {
                    grid-template-columns: 1fr;
                }
                
                .term-inputs {
                    grid-template-columns: 1fr;
                }
                
                .section-header {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculatorUtility;
} else if (typeof window !== 'undefined') {
    window.LoanCalculatorUtility = LoanCalculatorUtility;
}