/**
 * Date Calculator Utility
 * Provides comprehensive date calculation functionality including
 * date differences, date arithmetic, age calculations, and business day calculations
 */
class DateCalculatorUtility {
    constructor() {
        this.container = null;
        this.popup = null;
        this.isPopupOpen = false;
    }

    /**
     * Initialize the date calculator
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Date Calculator container not found');
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
            <div class="date-calculator">
                <div class="calculator-header">
                    <h2>📅 Date Calculator</h2>
                    <p>Calculate dates, time differences, and perform date arithmetic</p>
                </div>
                
                <div class="calculator-content">
                    <div class="feature-grid">
                        <div class="feature-card" data-feature="difference">
                            <div class="feature-icon">⏰</div>
                            <h3>Date Difference</h3>
                            <p>Calculate the difference between two dates</p>
                        </div>
                        
                        <div class="feature-card" data-feature="arithmetic">
                            <div class="feature-icon">➕</div>
                            <h3>Date Arithmetic</h3>
                            <p>Add or subtract days, months, years from a date</p>
                        </div>
                        
                        <div class="feature-card" data-feature="age">
                            <div class="feature-icon">🎂</div>
                            <h3>Age Calculator</h3>
                            <p>Calculate exact age and time lived</p>
                        </div>
                        
                        <div class="feature-card" data-feature="business">
                            <div class="feature-icon">💼</div>
                            <h3>Business Days</h3>
                            <p>Calculate business days between dates</p>
                        </div>
                        
                        <div class="feature-card" data-feature="weekday">
                            <div class="feature-icon">📆</div>
                            <h3>Weekday Finder</h3>
                            <p>Find what day of the week a date falls on</p>
                        </div>
                        
                        <div class="feature-card" data-feature="timezone">
                            <div class="feature-icon">🌍</div>
                            <h3>Timezone Converter</h3>
                            <p>Convert dates between different timezones</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Popup Modal -->
            <div class="date-popup-overlay" id="datePopupOverlay">
                <div class="date-popup" id="datePopup">
                    <div class="popup-header">
                        <h3 id="popupTitle">Date Calculator</h3>
                        <button class="close-btn" id="closePopup">×</button>
                    </div>
                    <div class="popup-content" id="popupContent">
                        <!-- Dynamic content will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Feature card clicks
        const featureCards = this.container.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.openFeaturePopup(feature);
            });
        });

        // Popup close events
        const overlay = this.container.querySelector('#datePopupOverlay');
        const closeBtn = this.container.querySelector('#closePopup');
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePopup();
            }
        });
        
        closeBtn.addEventListener('click', () => {
            this.closePopup();
        });

        // Escape key to close popup
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupOpen) {
                this.closePopup();
            }
        });
    }

    /**
     * Open feature popup
     */
    openFeaturePopup(feature) {
        const popup = this.container.querySelector('#datePopup');
        const overlay = this.container.querySelector('#datePopupOverlay');
        const title = this.container.querySelector('#popupTitle');
        const content = this.container.querySelector('#popupContent');

        // Set title and content based on feature
        switch (feature) {
            case 'difference':
                title.textContent = '⏰ Date Difference Calculator';
                content.innerHTML = this.createDateDifferenceContent();
                break;
            case 'arithmetic':
                title.textContent = '➕ Date Arithmetic Calculator';
                content.innerHTML = this.createDateArithmeticContent();
                break;
            case 'age':
                title.textContent = '🎂 Age Calculator';
                content.innerHTML = this.createAgeCalculatorContent();
                break;
            case 'business':
                title.textContent = '💼 Business Days Calculator';
                content.innerHTML = this.createBusinessDaysContent();
                break;
            case 'weekday':
                title.textContent = '📆 Weekday Finder';
                content.innerHTML = this.createWeekdayFinderContent();
                break;
            case 'timezone':
                title.textContent = '🌍 Timezone Converter';
                content.innerHTML = this.createTimezoneConverterContent();
                break;
        }

        // Show popup
        overlay.style.display = 'flex';
        this.isPopupOpen = true;
        
        // Attach feature-specific event listeners
        this.attachFeatureListeners(feature);
        
        // Set default values
        this.setDefaultValues(feature);
    }

    /**
     * Close popup
     */
    closePopup() {
        const overlay = this.container.querySelector('#datePopupOverlay');
        overlay.style.display = 'none';
        this.isPopupOpen = false;
    }

    /**
     * Create date difference content
     */
    createDateDifferenceContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="startDate">Start Date:</label>
                    <input type="date" id="startDate" class="date-input">
                </div>
                
                <div class="input-group">
                    <label for="endDate">End Date:</label>
                    <input type="date" id="endDate" class="date-input">
                </div>
                
                <button class="calculate-btn" id="calculateDifference">Calculate Difference</button>
                
                <div class="result-section" id="differenceResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Create date arithmetic content
     */
    createDateArithmeticContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="baseDate">Base Date:</label>
                    <input type="date" id="baseDate" class="date-input">
                </div>
                
                <div class="input-group">
                    <label for="operation">Operation:</label>
                    <select id="operation" class="select-input">
                        <option value="add">Add</option>
                        <option value="subtract">Subtract</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" class="number-input" min="0" placeholder="1">
                </div>
                
                <div class="input-group">
                    <label for="unit">Unit:</label>
                    <select id="unit" class="select-input">
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </div>
                
                <button class="calculate-btn" id="calculateArithmetic">Calculate Result</button>
                
                <div class="result-section" id="arithmeticResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Create age calculator content
     */
    createAgeCalculatorContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="birthDate">Birth Date:</label>
                    <input type="date" id="birthDate" class="date-input">
                </div>
                
                <div class="input-group">
                    <label for="currentDate">Current Date:</label>
                    <input type="date" id="currentDate" class="date-input">
                </div>
                
                <button class="calculate-btn" id="calculateAge">Calculate Age</button>
                
                <div class="result-section" id="ageResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Create business days content
     */
    createBusinessDaysContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="businessStartDate">Start Date:</label>
                    <input type="date" id="businessStartDate" class="date-input">
                </div>
                
                <div class="input-group">
                    <label for="businessEndDate">End Date:</label>
                    <input type="date" id="businessEndDate" class="date-input">
                </div>
                
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" id="excludeHolidays"> Exclude common holidays
                    </label>
                </div>
                
                <button class="calculate-btn" id="calculateBusinessDays">Calculate Business Days</button>
                
                <div class="result-section" id="businessResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Create weekday finder content
     */
    createWeekdayFinderContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="targetDate">Date:</label>
                    <input type="date" id="targetDate" class="date-input">
                </div>
                
                <button class="calculate-btn" id="findWeekday">Find Weekday</button>
                
                <div class="result-section" id="weekdayResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Create timezone converter content
     */
    createTimezoneConverterContent() {
        return `
            <div class="popup-form">
                <div class="input-group">
                    <label for="sourceDateTime">Date & Time:</label>
                    <input type="datetime-local" id="sourceDateTime" class="datetime-input">
                </div>
                
                <div class="input-group">
                    <label for="sourceTimezone">From Timezone:</label>
                    <select id="sourceTimezone" class="select-input">
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                        <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="targetTimezone">To Timezone:</label>
                    <select id="targetTimezone" class="select-input">
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                        <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                </div>
                
                <button class="calculate-btn" id="convertTimezone">Convert Timezone</button>
                
                <div class="result-section" id="timezoneResult">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
    }

    /**
     * Attach feature-specific event listeners
     */
    attachFeatureListeners(feature) {
        switch (feature) {
            case 'difference':
                document.getElementById('calculateDifference').addEventListener('click', () => {
                    this.calculateDateDifference();
                });
                break;
            case 'arithmetic':
                document.getElementById('calculateArithmetic').addEventListener('click', () => {
                    this.calculateDateArithmetic();
                });
                break;
            case 'age':
                document.getElementById('calculateAge').addEventListener('click', () => {
                    this.calculateAge();
                });
                break;
            case 'business':
                document.getElementById('calculateBusinessDays').addEventListener('click', () => {
                    this.calculateBusinessDays();
                });
                break;
            case 'weekday':
                document.getElementById('findWeekday').addEventListener('click', () => {
                    this.findWeekday();
                });
                break;
            case 'timezone':
                document.getElementById('convertTimezone').addEventListener('click', () => {
                    this.convertTimezone();
                });
                break;
        }
    }

    /**
     * Set default values
     */
    setDefaultValues(feature) {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString().slice(0, 16);
        
        switch (feature) {
            case 'difference':
                document.getElementById('startDate').value = today;
                document.getElementById('endDate').value = today;
                break;
            case 'arithmetic':
                document.getElementById('baseDate').value = today;
                document.getElementById('amount').value = '1';
                break;
            case 'age':
                document.getElementById('currentDate').value = today;
                break;
            case 'business':
                document.getElementById('businessStartDate').value = today;
                document.getElementById('businessEndDate').value = today;
                break;
            case 'weekday':
                document.getElementById('targetDate').value = today;
                break;
            case 'timezone':
                document.getElementById('sourceDateTime').value = now;
                break;
        }
    }

    /**
     * Calculate date difference
     */
    calculateDateDifference() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const resultDiv = document.getElementById('differenceResult');

        if (!startDate || !endDate) {
            resultDiv.innerHTML = '<div class="error">Please select both dates</div>';
            return;
        }

        const timeDiff = Math.abs(endDate - startDate);
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const weeksDiff = Math.floor(daysDiff / 7);
        const monthsDiff = this.getMonthsDifference(startDate, endDate);
        const yearsDiff = Math.floor(monthsDiff / 12);

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor(timeDiff / 1000);

        resultDiv.innerHTML = `
            <div class="result-card">
                <h4>Time Difference</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-value">${yearsDiff}</span>
                        <span class="result-label">Years</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${monthsDiff}</span>
                        <span class="result-label">Months</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${weeksDiff}</span>
                        <span class="result-label">Weeks</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${daysDiff}</span>
                        <span class="result-label">Days</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${hours.toLocaleString()}</span>
                        <span class="result-label">Hours</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${minutes.toLocaleString()}</span>
                        <span class="result-label">Minutes</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Calculate date arithmetic
     */
    calculateDateArithmetic() {
        const baseDate = new Date(document.getElementById('baseDate').value);
        const operation = document.getElementById('operation').value;
        const amount = parseInt(document.getElementById('amount').value);
        const unit = document.getElementById('unit').value;
        const resultDiv = document.getElementById('arithmeticResult');

        if (!baseDate || !amount) {
            resultDiv.innerHTML = '<div class="error">Please fill in all fields</div>';
            return;
        }

        const resultDate = new Date(baseDate);
        const multiplier = operation === 'add' ? 1 : -1;
        const adjustedAmount = amount * multiplier;

        switch (unit) {
            case 'days':
                resultDate.setDate(resultDate.getDate() + adjustedAmount);
                break;
            case 'weeks':
                resultDate.setDate(resultDate.getDate() + (adjustedAmount * 7));
                break;
            case 'months':
                resultDate.setMonth(resultDate.getMonth() + adjustedAmount);
                break;
            case 'years':
                resultDate.setFullYear(resultDate.getFullYear() + adjustedAmount);
                break;
        }

        const operationText = operation === 'add' ? 'Adding' : 'Subtracting';
        const unitText = amount === 1 ? unit.slice(0, -1) : unit;

        resultDiv.innerHTML = `
            <div class="result-card">
                <h4>Calculation Result</h4>
                <div class="calculation-summary">
                    <p><strong>Base Date:</strong> ${this.formatDate(baseDate)}</p>
                    <p><strong>Operation:</strong> ${operationText} ${amount} ${unitText}</p>
                    <p><strong>Result Date:</strong> ${this.formatDate(resultDate)}</p>
                </div>
                <div class="result-highlight">
                    <span class="result-date">${resultDate.toDateString()}</span>
                </div>
            </div>
        `;
    }

    /**
     * Calculate age
     */
    calculateAge() {
        const birthDate = new Date(document.getElementById('birthDate').value);
        const currentDate = new Date(document.getElementById('currentDate').value);
        const resultDiv = document.getElementById('ageResult');

        if (!birthDate || !currentDate) {
            resultDiv.innerHTML = '<div class="error">Please select both dates</div>';
            return;
        }

        if (birthDate > currentDate) {
            resultDiv.innerHTML = '<div class="error">Birth date cannot be in the future</div>';
            return;
        }

        const ageData = this.calculateDetailedAge(birthDate, currentDate);
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((currentDate - birthDate) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((currentDate - birthDate) / (1000 * 60));

        resultDiv.innerHTML = `
            <div class="result-card">
                <h4>Age Calculation</h4>
                <div class="age-summary">
                    <div class="main-age">
                        <span class="age-number">${ageData.years}</span>
                        <span class="age-label">Years Old</span>
                    </div>
                </div>
                <div class="detailed-age">
                    <p><strong>Exact Age:</strong> ${ageData.years} years, ${ageData.months} months, ${ageData.days} days</p>
                    <p><strong>Total Days Lived:</strong> ${totalDays.toLocaleString()} days</p>
                    <p><strong>Total Hours Lived:</strong> ${totalHours.toLocaleString()} hours</p>
                    <p><strong>Total Minutes Lived:</strong> ${totalMinutes.toLocaleString()} minutes</p>
                </div>
                <div class="next-birthday">
                    <p><strong>Next Birthday:</strong> ${this.getNextBirthday(birthDate, currentDate)}</p>
                </div>
            </div>
        `;
    }

    /**
     * Calculate business days
     */
    calculateBusinessDays() {
        const startDate = new Date(document.getElementById('businessStartDate').value);
        const endDate = new Date(document.getElementById('businessEndDate').value);
        const excludeHolidays = document.getElementById('excludeHolidays').checked;
        const resultDiv = document.getElementById('businessResult');

        if (!startDate || !endDate) {
            resultDiv.innerHTML = '<div class="error">Please select both dates</div>';
            return;
        }

        const businessDays = this.countBusinessDays(startDate, endDate, excludeHolidays);
        const totalDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
        const weekendDays = totalDays - businessDays;

        resultDiv.innerHTML = `
            <div class="result-card">
                <h4>Business Days Calculation</h4>
                <div class="business-summary">
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="result-value">${businessDays}</span>
                            <span class="result-label">Business Days</span>
                        </div>
                        <div class="result-item">
                            <span class="result-value">${weekendDays}</span>
                            <span class="result-label">Weekend Days</span>
                        </div>
                        <div class="result-item">
                            <span class="result-value">${totalDays}</span>
                            <span class="result-label">Total Days</span>
                        </div>
                    </div>
                </div>
                ${excludeHolidays ? '<p class="note">* Excluding common holidays</p>' : ''}
            </div>
        `;
    }

    /**
     * Find weekday
     */
    findWeekday() {
        const targetDate = new Date(document.getElementById('targetDate').value);
        const resultDiv = document.getElementById('weekdayResult');

        if (!targetDate) {
            resultDiv.innerHTML = '<div class="error">Please select a date</div>';
            return;
        }

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekday = weekdays[targetDate.getDay()];
        const dayOfYear = this.getDayOfYear(targetDate);
        const weekOfYear = this.getWeekOfYear(targetDate);

        resultDiv.innerHTML = `
            <div class="result-card">
                <h4>Date Information</h4>
                <div class="weekday-info">
                    <div class="main-weekday">
                        <span class="weekday-name">${weekday}</span>
                    </div>
                    <div class="date-details">
                        <p><strong>Full Date:</strong> ${targetDate.toDateString()}</p>
                        <p><strong>Day of Year:</strong> ${dayOfYear}</p>
                        <p><strong>Week of Year:</strong> ${weekOfYear}</p>
                        <p><strong>Quarter:</strong> Q${Math.ceil((targetDate.getMonth() + 1) / 3)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Convert timezone
     */
    convertTimezone() {
        const sourceDateTime = document.getElementById('sourceDateTime').value;
        const sourceTimezone = document.getElementById('sourceTimezone').value;
        const targetTimezone = document.getElementById('targetTimezone').value;
        const resultDiv = document.getElementById('timezoneResult');

        if (!sourceDateTime) {
            resultDiv.innerHTML = '<div class="error">Please select a date and time</div>';
            return;
        }

        try {
            const sourceDate = new Date(sourceDateTime);
            
            // Format for different timezones
            const sourceFormatted = this.formatDateTimeInTimezone(sourceDate, sourceTimezone);
            const targetFormatted = this.formatDateTimeInTimezone(sourceDate, targetTimezone);

            resultDiv.innerHTML = `
                <div class="result-card">
                    <h4>Timezone Conversion</h4>
                    <div class="timezone-conversion">
                        <div class="timezone-item">
                            <h5>From: ${this.getTimezoneDisplayName(sourceTimezone)}</h5>
                            <p class="datetime-display">${sourceFormatted}</p>
                        </div>
                        <div class="conversion-arrow">→</div>
                        <div class="timezone-item">
                            <h5>To: ${this.getTimezoneDisplayName(targetTimezone)}</h5>
                            <p class="datetime-display">${targetFormatted}</p>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            resultDiv.innerHTML = '<div class="error">Error converting timezone</div>';
        }
    }

    // Utility functions
    getMonthsDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()));
    }

    calculateDetailedAge(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    getNextBirthday(birthDate, currentDate) {
        const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        return nextBirthday.toDateString();
    }

    countBusinessDays(startDate, endDate, excludeHolidays = false) {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
                if (!excludeHolidays || !this.isHoliday(current)) {
                    count++;
                }
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    isHoliday(date) {
        // Simple holiday check for common US holidays
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // New Year's Day
        if (month === 1 && day === 1) return true;
        // Independence Day
        if (month === 7 && day === 4) return true;
        // Christmas
        if (month === 12 && day === 25) return true;
        
        return false;
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    getWeekOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTimeInTimezone(date, timezone) {
        return date.toLocaleString('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    }

    getTimezoneDisplayName(timezone) {
        const names = {
            'UTC': 'UTC',
            'America/New_York': 'Eastern Time',
            'America/Chicago': 'Central Time',
            'America/Denver': 'Mountain Time',
            'America/Los_Angeles': 'Pacific Time',
            'Europe/London': 'London Time',
            'Europe/Paris': 'Paris Time',
            'Asia/Tokyo': 'Tokyo Time',
            'Asia/Shanghai': 'Shanghai Time',
            'Australia/Sydney': 'Sydney Time'
        };
        return names[timezone] || timezone;
    }

    /**
     * Add CSS styles
     */
    addStyles() {
        if (document.getElementById('dateCalculatorStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'dateCalculatorStyles';
        styles.textContent = `
            .date-calculator {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .calculator-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
            }
            
            .calculator-header h2 {
                margin: 0 0 10px 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            
            .calculator-header p {
                margin: 0;
                font-size: 1.1em;
                opacity: 0.9;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .feature-card {
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border-color: #667eea;
            }
            
            .feature-icon {
                font-size: 3em;
                text-align: center;
                margin-bottom: 15px;
            }
            
            .feature-card h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.3em;
                text-align: center;
            }
            
            .feature-card p {
                margin: 0;
                color: #666;
                text-align: center;
                line-height: 1.5;
            }
            
            /* Popup Styles */
            .date-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .date-popup {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                animation: popupSlideIn 0.3s ease;
            }
            
            @keyframes popupSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                border-bottom: 1px solid #eee;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 16px 16px 0 0;
            }
            
            .popup-header h3 {
                margin: 0;
                font-size: 1.4em;
                font-weight: 500;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5em;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .popup-content {
                padding: 25px;
            }
            
            .popup-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .input-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .input-group label {
                font-weight: 500;
                color: #333;
                font-size: 0.95em;
            }
            
            .date-input, .datetime-input, .number-input, .select-input {
                padding: 12px 15px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 1em;
                transition: border-color 0.2s;
                background: white;
            }
            
            .date-input:focus, .datetime-input:focus, .number-input:focus, .select-input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .checkbox-group input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #667eea;
            }
            
            .calculate-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 1.1em;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            
            .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            
            .result-section {
                margin-top: 20px;
            }
            
            .result-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                border-left: 4px solid #667eea;
            }
            
            .result-card h4 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 1.2em;
            }
            
            .result-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .result-item {
                text-align: center;
                background: white;
                padding: 15px 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .result-value {
                display: block;
                font-size: 1.5em;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
            }
            
            .result-label {
                font-size: 0.9em;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .calculation-summary, .age-summary, .business-summary {
                margin-bottom: 15px;
            }
            
            .calculation-summary p, .detailed-age p, .next-birthday p {
                margin: 8px 0;
                line-height: 1.5;
            }
            
            .result-highlight {
                text-align: center;
                margin-top: 15px;
            }
            
            .result-date {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 500;
                font-size: 1.1em;
            }
            
            .main-age {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .age-number {
                display: block;
                font-size: 3em;
                font-weight: bold;
                color: #667eea;
                line-height: 1;
            }
            
            .age-label {
                font-size: 1.2em;
                color: #666;
                margin-top: 5px;
            }
            
            .main-weekday {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .weekday-name {
                display: block;
                font-size: 2.5em;
                font-weight: bold;
                color: #667eea;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .timezone-conversion {
                display: flex;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            .timezone-item {
                flex: 1;
                min-width: 200px;
                text-align: center;
            }
            
            .timezone-item h5 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.1em;
            }
            
            .datetime-display {
                background: white;
                padding: 15px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 1.1em;
                color: #333;
                border: 2px solid #e1e5e9;
                margin: 0;
            }
            
            .conversion-arrow {
                font-size: 2em;
                color: #667eea;
                font-weight: bold;
            }
            
            .error {
                background: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #f5c6cb;
                text-align: center;
            }
            
            .note {
                font-style: italic;
                color: #666;
                font-size: 0.9em;
                margin-top: 10px;
            }
            
            @media (max-width: 768px) {
                .feature-grid {
                    grid-template-columns: 1fr;
                }
                
                .date-popup {
                    width: 95%;
                    margin: 10px;
                }
                
                .popup-content {
                    padding: 20px;
                }
                
                .result-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .timezone-conversion {
                    flex-direction: column;
                }
                
                .conversion-arrow {
                    transform: rotate(90deg);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Make calculator available globally
let dateCalculator;