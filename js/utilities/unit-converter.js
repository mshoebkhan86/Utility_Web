/**
 * Unit Converter Utility
 * A comprehensive unit conversion tool supporting multiple categories
 * Features: Length, Weight, Temperature, Volume, Area, Time, Speed, Energy, Power, Pressure
 */

class UnitConverterUtility {
    constructor() {
        this.container = null;
        this.currentCategory = 'length';
        this.fromUnit = null;
        this.toUnit = null;
        this.inputValue = 0;
        this.history = [];
        this.favorites = JSON.parse(localStorage.getItem('unitConverterFavorites') || '[]');
        this.maxHistorySize = 50;
        
        // Unit definitions with conversion factors to base units
        this.units = {
            length: {
                name: 'Length',
                icon: '📏',
                baseUnit: 'meter',
                units: {
                    // Metric
                    nanometer: { name: 'Nanometer', symbol: 'nm', factor: 1e-9, category: 'metric' },
                    micrometer: { name: 'Micrometer', symbol: 'μm', factor: 1e-6, category: 'metric' },
                    millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001, category: 'metric' },
                    centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01, category: 'metric' },
                    meter: { name: 'Meter', symbol: 'm', factor: 1, category: 'metric' },
                    kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000, category: 'metric' },
                    // Imperial
                    inch: { name: 'Inch', symbol: 'in', factor: 0.0254, category: 'imperial' },
                    foot: { name: 'Foot', symbol: 'ft', factor: 0.3048, category: 'imperial' },
                    yard: { name: 'Yard', symbol: 'yd', factor: 0.9144, category: 'imperial' },
                    mile: { name: 'Mile', symbol: 'mi', factor: 1609.344, category: 'imperial' },
                    // Nautical
                    nauticalMile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852, category: 'nautical' },
                    // Other
                    lightYear: { name: 'Light Year', symbol: 'ly', factor: 9.461e15, category: 'astronomical' },
                    astronomicalUnit: { name: 'Astronomical Unit', symbol: 'AU', factor: 1.496e11, category: 'astronomical' }
                }
            },
            weight: {
                name: 'Weight/Mass',
                icon: '⚖️',
                baseUnit: 'kilogram',
                units: {
                    // Metric
                    milligram: { name: 'Milligram', symbol: 'mg', factor: 1e-6, category: 'metric' },
                    gram: { name: 'Gram', symbol: 'g', factor: 0.001, category: 'metric' },
                    kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1, category: 'metric' },
                    tonne: { name: 'Tonne', symbol: 't', factor: 1000, category: 'metric' },
                    // Imperial
                    ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495, category: 'imperial' },
                    pound: { name: 'Pound', symbol: 'lb', factor: 0.453592, category: 'imperial' },
                    stone: { name: 'Stone', symbol: 'st', factor: 6.35029, category: 'imperial' },
                    ton: { name: 'Ton (US)', symbol: 'ton', factor: 907.185, category: 'imperial' },
                    // Troy
                    troyOunce: { name: 'Troy Ounce', symbol: 'oz t', factor: 0.0311035, category: 'troy' },
                    troyPound: { name: 'Troy Pound', symbol: 'lb t', factor: 0.373242, category: 'troy' }
                }
            },
            temperature: {
                name: 'Temperature',
                icon: '🌡️',
                baseUnit: 'celsius',
                units: {
                    celsius: { name: 'Celsius', symbol: '°C', factor: 1, category: 'metric' },
                    fahrenheit: { name: 'Fahrenheit', symbol: '°F', factor: 1, category: 'imperial' },
                    kelvin: { name: 'Kelvin', symbol: 'K', factor: 1, category: 'scientific' },
                    rankine: { name: 'Rankine', symbol: '°R', factor: 1, category: 'scientific' }
                }
            },
            volume: {
                name: 'Volume',
                icon: '🥤',
                baseUnit: 'liter',
                units: {
                    // Metric
                    milliliter: { name: 'Milliliter', symbol: 'ml', factor: 0.001, category: 'metric' },
                    liter: { name: 'Liter', symbol: 'l', factor: 1, category: 'metric' },
                    cubicMeter: { name: 'Cubic Meter', symbol: 'm³', factor: 1000, category: 'metric' },
                    // Imperial
                    fluidOunce: { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735, category: 'imperial' },
                    cup: { name: 'Cup (US)', symbol: 'cup', factor: 0.236588, category: 'imperial' },
                    pint: { name: 'Pint (US)', symbol: 'pt', factor: 0.473176, category: 'imperial' },
                    quart: { name: 'Quart (US)', symbol: 'qt', factor: 0.946353, category: 'imperial' },
                    gallon: { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541, category: 'imperial' },
                    // Imperial UK
                    fluidOunceUK: { name: 'Fluid Ounce (UK)', symbol: 'fl oz (UK)', factor: 0.0284131, category: 'imperial' },
                    pintUK: { name: 'Pint (UK)', symbol: 'pt (UK)', factor: 0.568261, category: 'imperial' },
                    gallonUK: { name: 'Gallon (UK)', symbol: 'gal (UK)', factor: 4.54609, category: 'imperial' },
                    // Cooking
                    tablespoon: { name: 'Tablespoon', symbol: 'tbsp', factor: 0.0147868, category: 'cooking' },
                    teaspoon: { name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892, category: 'cooking' }
                }
            },
            area: {
                name: 'Area',
                icon: '📐',
                baseUnit: 'squareMeter',
                units: {
                    // Metric
                    squareMillimeter: { name: 'Square Millimeter', symbol: 'mm²', factor: 1e-6, category: 'metric' },
                    squareCentimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 1e-4, category: 'metric' },
                    squareMeter: { name: 'Square Meter', symbol: 'm²', factor: 1, category: 'metric' },
                    hectare: { name: 'Hectare', symbol: 'ha', factor: 10000, category: 'metric' },
                    squareKilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1e6, category: 'metric' },
                    // Imperial
                    squareInch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516, category: 'imperial' },
                    squareFoot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903, category: 'imperial' },
                    squareYard: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127, category: 'imperial' },
                    acre: { name: 'Acre', symbol: 'ac', factor: 4046.86, category: 'imperial' },
                    squareMile: { name: 'Square Mile', symbol: 'mi²', factor: 2.59e6, category: 'imperial' }
                }
            },
            time: {
                name: 'Time',
                icon: '⏰',
                baseUnit: 'second',
                units: {
                    nanosecond: { name: 'Nanosecond', symbol: 'ns', factor: 1e-9, category: 'small' },
                    microsecond: { name: 'Microsecond', symbol: 'μs', factor: 1e-6, category: 'small' },
                    millisecond: { name: 'Millisecond', symbol: 'ms', factor: 0.001, category: 'small' },
                    second: { name: 'Second', symbol: 's', factor: 1, category: 'basic' },
                    minute: { name: 'Minute', symbol: 'min', factor: 60, category: 'basic' },
                    hour: { name: 'Hour', symbol: 'h', factor: 3600, category: 'basic' },
                    day: { name: 'Day', symbol: 'd', factor: 86400, category: 'basic' },
                    week: { name: 'Week', symbol: 'wk', factor: 604800, category: 'extended' },
                    month: { name: 'Month', symbol: 'mo', factor: 2629746, category: 'extended' },
                    year: { name: 'Year', symbol: 'yr', factor: 31556952, category: 'extended' },
                    decade: { name: 'Decade', symbol: 'dec', factor: 315569520, category: 'extended' },
                    century: { name: 'Century', symbol: 'cent', factor: 3155695200, category: 'extended' }
                }
            },
            speed: {
                name: 'Speed',
                icon: '🏃',
                baseUnit: 'meterPerSecond',
                units: {
                    meterPerSecond: { name: 'Meter per Second', symbol: 'm/s', factor: 1, category: 'metric' },
                    kilometerPerHour: { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778, category: 'metric' },
                    milePerHour: { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704, category: 'imperial' },
                    footPerSecond: { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048, category: 'imperial' },
                    knot: { name: 'Knot', symbol: 'kn', factor: 0.514444, category: 'nautical' },
                    mach: { name: 'Mach', symbol: 'Ma', factor: 343, category: 'aviation' },
                    speedOfLight: { name: 'Speed of Light', symbol: 'c', factor: 299792458, category: 'physics' }
                }
            },
            energy: {
                name: 'Energy',
                icon: '⚡',
                baseUnit: 'joule',
                units: {
                    joule: { name: 'Joule', symbol: 'J', factor: 1, category: 'metric' },
                    kilojoule: { name: 'Kilojoule', symbol: 'kJ', factor: 1000, category: 'metric' },
                    calorie: { name: 'Calorie', symbol: 'cal', factor: 4.184, category: 'thermal' },
                    kilocalorie: { name: 'Kilocalorie', symbol: 'kcal', factor: 4184, category: 'thermal' },
                    wattHour: { name: 'Watt Hour', symbol: 'Wh', factor: 3600, category: 'electrical' },
                    kilowattHour: { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3.6e6, category: 'electrical' },
                    btu: { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06, category: 'imperial' },
                    footPound: { name: 'Foot-Pound', symbol: 'ft⋅lb', factor: 1.35582, category: 'imperial' },
                    electronVolt: { name: 'Electron Volt', symbol: 'eV', factor: 1.602e-19, category: 'atomic' },
                    therm: { name: 'Therm', symbol: 'thm', factor: 1.055e8, category: 'gas' }
                }
            },
            power: {
                name: 'Power',
                icon: '🔌',
                baseUnit: 'watt',
                units: {
                    watt: { name: 'Watt', symbol: 'W', factor: 1, category: 'metric' },
                    kilowatt: { name: 'Kilowatt', symbol: 'kW', factor: 1000, category: 'metric' },
                    megawatt: { name: 'Megawatt', symbol: 'MW', factor: 1e6, category: 'metric' },
                    horsepower: { name: 'Horsepower', symbol: 'hp', factor: 745.7, category: 'imperial' },
                    metricHorsepower: { name: 'Metric Horsepower', symbol: 'PS', factor: 735.5, category: 'metric' },
                    btuPerHour: { name: 'BTU per Hour', symbol: 'BTU/h', factor: 0.293071, category: 'thermal' },
                    footPoundPerSecond: { name: 'Foot-Pound per Second', symbol: 'ft⋅lb/s', factor: 1.35582, category: 'imperial' }
                }
            },
            pressure: {
                name: 'Pressure',
                icon: '🌪️',
                baseUnit: 'pascal',
                units: {
                    pascal: { name: 'Pascal', symbol: 'Pa', factor: 1, category: 'metric' },
                    kilopascal: { name: 'Kilopascal', symbol: 'kPa', factor: 1000, category: 'metric' },
                    megapascal: { name: 'Megapascal', symbol: 'MPa', factor: 1e6, category: 'metric' },
                    bar: { name: 'Bar', symbol: 'bar', factor: 100000, category: 'metric' },
                    atmosphere: { name: 'Atmosphere', symbol: 'atm', factor: 101325, category: 'standard' },
                    psi: { name: 'Pounds per Square Inch', symbol: 'psi', factor: 6894.76, category: 'imperial' },
                    torr: { name: 'Torr', symbol: 'Torr', factor: 133.322, category: 'mercury' },
                    mmHg: { name: 'Millimeter of Mercury', symbol: 'mmHg', factor: 133.322, category: 'mercury' },
                    inHg: { name: 'Inch of Mercury', symbol: 'inHg', factor: 3386.39, category: 'mercury' }
                }
            }
        };
        
        // Common conversions for quick access
        this.commonConversions = [
            { category: 'length', from: 'meter', to: 'foot', label: 'Meters to Feet' },
            { category: 'length', from: 'kilometer', to: 'mile', label: 'Kilometers to Miles' },
            { category: 'length', from: 'inch', to: 'centimeter', label: 'Inches to Centimeters' },
            { category: 'weight', from: 'kilogram', to: 'pound', label: 'Kilograms to Pounds' },
            { category: 'weight', from: 'gram', to: 'ounce', label: 'Grams to Ounces' },
            { category: 'temperature', from: 'celsius', to: 'fahrenheit', label: 'Celsius to Fahrenheit' },
            { category: 'temperature', from: 'fahrenheit', to: 'celsius', label: 'Fahrenheit to Celsius' },
            { category: 'volume', from: 'liter', to: 'gallon', label: 'Liters to Gallons' },
            { category: 'volume', from: 'milliliter', to: 'fluidOunce', label: 'Milliliters to Fluid Ounces' },
            { category: 'speed', from: 'kilometerPerHour', to: 'milePerHour', label: 'KM/H to MPH' },
            { category: 'area', from: 'squareMeter', to: 'squareFoot', label: 'Square Meters to Square Feet' },
            { category: 'energy', from: 'kilocalorie', to: 'kilojoule', label: 'Calories to Kilojoules' }
        ];
    }
    
    /**
     * Initialize the unit converter
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Unit Converter container not found');
            return false;
        }
        
        this.createInterface();
        this.attachEventListeners();
        this.applyStyles();
        this.loadDefaults();
        
        return true;
    }
    
    /**
     * Create the user interface
     */
    createInterface() {
        this.container.innerHTML = `
            <div class="unit-converter">
                <div class="converter-header">
                    <h2>⚖️ Unit Converter</h2>
                    <p>Convert between different units of measurement with precision and ease</p>
                </div>
                
                <div class="converter-body">
                    <!-- Category Selection -->
                    <div class="category-section">
                        <h3>📋 Select Category</h3>
                        <div class="category-grid" id="categoryGrid">
                            ${this.createCategoryButtons()}
                        </div>
                    </div>
                    
                    <!-- Conversion Interface -->
                    <div class="conversion-section">
                        <div class="conversion-header">
                            <h3 id="categoryTitle">📏 Length Conversion</h3>
                            <button class="btn-swap" id="swapUnits" title="Swap units">
                                <i class="fas fa-exchange-alt"></i>
                            </button>
                        </div>
                        
                        <div class="conversion-interface">
                            <div class="input-group">
                                <label>From:</label>
                                <div class="input-row">
                                    <input type="number" id="fromValue" placeholder="Enter value" step="any">
                                    <select id="fromUnit">
                                        ${this.createUnitOptions('length')}
                                    </select>
                                </div>
                            </div>
                            
                            <div class="conversion-arrow">
                                <i class="fas fa-arrow-down"></i>
                            </div>
                            
                            <div class="input-group">
                                <label>To:</label>
                                <div class="input-row">
                                    <input type="number" id="toValue" placeholder="Result" readonly>
                                    <select id="toUnit">
                                        ${this.createUnitOptions('length')}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="conversion-actions">
                            <button class="btn-action" id="clearAll">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                            <button class="btn-action" id="addToFavorites">
                                <i class="fas fa-star"></i> Add to Favorites
                            </button>
                            <button class="btn-action" id="copyResult">
                                <i class="fas fa-copy"></i> Copy Result
                            </button>
                        </div>
                    </div>
                    
                    <!-- Quick Conversions -->
                    <div class="quick-section">
                        <h3>⚡ Quick Conversions</h3>
                        <div class="quick-grid" id="quickGrid">
                            ${this.createQuickConversions()}
                        </div>
                    </div>
                    
                    <!-- Favorites -->
                    <div class="favorites-section" id="favoritesSection">
                        <h3>⭐ Favorites</h3>
                        <div class="favorites-list" id="favoritesList">
                            ${this.createFavoritesList()}
                        </div>
                    </div>
                    
                    <!-- History -->
                    <div class="history-section">
                        <h3>📜 Recent Conversions</h3>
                        <div class="history-list" id="historyList">
                            <div class="no-history">No conversions yet</div>
                        </div>
                    </div>
                </div>
                
                <!-- Status Bar -->
                <div class="status-bar">
                    <div class="status-info">
                        <span id="conversionInfo">Select units to start converting</span>
                    </div>
                    <div class="status-actions">
                        <button class="btn-status" id="clearHistory" title="Clear History">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn-status" id="exportData" title="Export Data">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-status" id="importData" title="Import Data">
                            <i class="fas fa-upload"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Notification Area -->
                <div class="notification-area" id="notificationArea"></div>
            </div>
        `;
    }
    
    /**
     * Create category buttons
     */
    createCategoryButtons() {
        return Object.keys(this.units).map(category => {
            const unit = this.units[category];
            return `
                <button class="category-btn ${category === this.currentCategory ? 'active' : ''}" 
                        data-category="${category}">
                    <span class="category-icon">${unit.icon}</span>
                    <span class="category-name">${unit.name}</span>
                </button>
            `;
        }).join('');
    }
    
    /**
     * Create unit options for select dropdown
     */
    createUnitOptions(category) {
        const units = this.units[category].units;
        const categories = {};
        
        // Group units by category
        Object.keys(units).forEach(key => {
            const unit = units[key];
            if (!categories[unit.category]) {
                categories[unit.category] = [];
            }
            categories[unit.category].push({ key, ...unit });
        });
        
        let html = '';
        Object.keys(categories).forEach(cat => {
            html += `<optgroup label="${cat.charAt(0).toUpperCase() + cat.slice(1)}">`;
            categories[cat].forEach(unit => {
                html += `<option value="${unit.key}">${unit.name} (${unit.symbol})</option>`;
            });
            html += '</optgroup>';
        });
        
        return html;
    }
    
    /**
     * Create quick conversion buttons
     */
    createQuickConversions() {
        return this.commonConversions.map(conv => `
            <button class="quick-btn" 
                    data-category="${conv.category}" 
                    data-from="${conv.from}" 
                    data-to="${conv.to}">
                <span class="quick-label">${conv.label}</span>
                <span class="quick-units">${this.units[conv.category].units[conv.from].symbol} → ${this.units[conv.category].units[conv.to].symbol}</span>
            </button>
        `).join('');
    }
    
    /**
     * Create favorites list
     */
    createFavoritesList() {
        if (this.favorites.length === 0) {
            return '<div class="no-favorites">No favorites yet</div>';
        }
        
        return this.favorites.map((fav, index) => `
            <div class="favorite-item" data-index="${index}">
                <div class="favorite-info">
                    <span class="favorite-label">${fav.label}</span>
                    <span class="favorite-units">${fav.fromSymbol} → ${fav.toSymbol}</span>
                </div>
                <div class="favorite-actions">
                    <button class="btn-fav-use" title="Use this conversion">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-fav-remove" title="Remove from favorites">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCategory(e.target.closest('.category-btn').dataset.category);
            });
        });
        
        // Unit selection and input
        document.getElementById('fromValue').addEventListener('input', () => this.performConversion());
        document.getElementById('fromUnit').addEventListener('change', () => this.performConversion());
        document.getElementById('toUnit').addEventListener('change', () => this.performConversion());
        
        // Swap units
        document.getElementById('swapUnits').addEventListener('click', () => this.swapUnits());
        
        // Actions
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        document.getElementById('addToFavorites').addEventListener('click', () => this.addToFavorites());
        document.getElementById('copyResult').addEventListener('click', () => this.copyResult());
        
        // Quick conversions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('.quick-btn');
                this.useQuickConversion(button.dataset.category, button.dataset.from, button.dataset.to);
            });
        });
        
        // Status actions
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => this.importData());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Favorites actions
        this.attachFavoritesListeners();
    }
    
    /**
     * Attach favorites event listeners
     */
    attachFavoritesListeners() {
        document.querySelectorAll('.btn-fav-use').forEach((btn, index) => {
            btn.addEventListener('click', () => this.useFavorite(index));
        });
        
        document.querySelectorAll('.btn-fav-remove').forEach((btn, index) => {
            btn.addEventListener('click', () => this.removeFavorite(index));
        });
    }
    
    /**
     * Select category
     */
    selectCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        // Update category title
        const unit = this.units[category];
        document.getElementById('categoryTitle').innerHTML = `${unit.icon} ${unit.name} Conversion`;
        
        // Update unit dropdowns
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        
        const options = this.createUnitOptions(category);
        fromUnit.innerHTML = options;
        toUnit.innerHTML = options;
        
        // Set default units
        const unitKeys = Object.keys(this.units[category].units);
        fromUnit.value = unitKeys[0];
        toUnit.value = unitKeys[1] || unitKeys[0];
        
        // Clear values and perform conversion
        document.getElementById('fromValue').value = '';
        document.getElementById('toValue').value = '';
        this.updateConversionInfo();
    }
    
    /**
     * Perform unit conversion
     */
    performConversion() {
        const fromValue = parseFloat(document.getElementById('fromValue').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        
        if (isNaN(fromValue) || fromValue === '') {
            document.getElementById('toValue').value = '';
            this.updateConversionInfo();
            return;
        }
        
        let result;
        
        if (this.currentCategory === 'temperature') {
            result = this.convertTemperature(fromValue, fromUnit, toUnit);
        } else {
            result = this.convertStandard(fromValue, fromUnit, toUnit);
        }
        
        // Format result
        const formattedResult = this.formatNumber(result);
        document.getElementById('toValue').value = formattedResult;
        
        // Add to history
        this.addToHistory(fromValue, fromUnit, result, toUnit);
        
        // Update info
        this.updateConversionInfo();
    }
    
    /**
     * Convert standard units (non-temperature)
     */
    convertStandard(value, fromUnit, toUnit) {
        const units = this.units[this.currentCategory].units;
        const fromFactor = units[fromUnit].factor;
        const toFactor = units[toUnit].factor;
        
        // Convert to base unit, then to target unit
        const baseValue = value * fromFactor;
        return baseValue / toFactor;
    }
    
    /**
     * Convert temperature units
     */
    convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        
        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            case 'rankine':
                celsius = (value - 491.67) * 5/9;
                break;
        }
        
        // Convert from Celsius to target
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9/5 + 32;
            case 'kelvin':
                return celsius + 273.15;
            case 'rankine':
                return (celsius + 273.15) * 9/5;
        }
    }
    
    /**
     * Format number for display
     */
    formatNumber(num) {
        if (Math.abs(num) >= 1e15) {
            return num.toExponential(6);
        } else if (Math.abs(num) >= 1000000) {
            return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
        } else if (Math.abs(num) >= 1) {
            return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
        } else if (Math.abs(num) >= 0.001) {
            return num.toFixed(6).replace(/\.?0+$/, '');
        } else if (num === 0) {
            return '0';
        } else {
            return num.toExponential(6);
        }
    }
    
    /**
     * Swap units
     */
    swapUnits() {
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        const fromValue = document.getElementById('fromValue');
        const toValue = document.getElementById('toValue');
        
        // Swap unit selections
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        
        // Swap values
        const tempValue = fromValue.value;
        fromValue.value = toValue.value;
        toValue.value = '';
        
        // Perform conversion
        this.performConversion();
        
        this.showNotification('Units swapped successfully', 'success');
    }
    
    /**
     * Clear all inputs
     */
    clearAll() {
        document.getElementById('fromValue').value = '';
        document.getElementById('toValue').value = '';
        this.updateConversionInfo();
        this.showNotification('Inputs cleared', 'info');
    }
    
    /**
     * Add current conversion to favorites
     */
    addToFavorites() {
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        
        if (!fromUnit || !toUnit) {
            this.showNotification('Please select units first', 'warning');
            return;
        }
        
        const units = this.units[this.currentCategory].units;
        const favorite = {
            category: this.currentCategory,
            fromUnit,
            toUnit,
            fromSymbol: units[fromUnit].symbol,
            toSymbol: units[toUnit].symbol,
            label: `${units[fromUnit].name} to ${units[toUnit].name}`,
            timestamp: Date.now()
        };
        
        // Check if already exists
        const exists = this.favorites.some(fav => 
            fav.category === favorite.category && 
            fav.fromUnit === favorite.fromUnit && 
            fav.toUnit === favorite.toUnit
        );
        
        if (exists) {
            this.showNotification('This conversion is already in favorites', 'warning');
            return;
        }
        
        this.favorites.push(favorite);
        this.saveFavorites();
        this.updateFavoritesList();
        this.showNotification('Added to favorites', 'success');
    }
    
    /**
     * Copy result to clipboard
     */
    async copyResult() {
        const result = document.getElementById('toValue').value;
        
        if (!result) {
            this.showNotification('No result to copy', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(result);
            this.showNotification('Result copied to clipboard', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = result;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Result copied to clipboard', 'success');
        }
    }
    
    /**
     * Use quick conversion
     */
    useQuickConversion(category, fromUnit, toUnit) {
        this.selectCategory(category);
        
        setTimeout(() => {
            document.getElementById('fromUnit').value = fromUnit;
            document.getElementById('toUnit').value = toUnit;
            document.getElementById('fromValue').focus();
            this.updateConversionInfo();
        }, 100);
        
        this.showNotification(`Quick conversion: ${this.units[category].units[fromUnit].name} to ${this.units[category].units[toUnit].name}`, 'info');
    }
    
    /**
     * Add conversion to history
     */
    addToHistory(fromValue, fromUnit, toValue, toUnit) {
        const units = this.units[this.currentCategory].units;
        
        const historyItem = {
            timestamp: Date.now(),
            category: this.currentCategory,
            fromValue,
            fromUnit,
            fromSymbol: units[fromUnit].symbol,
            fromName: units[fromUnit].name,
            toValue,
            toUnit,
            toSymbol: units[toUnit].symbol,
            toName: units[toUnit].name
        };
        
        // Add to beginning of history
        this.history.unshift(historyItem);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        this.updateHistoryDisplay();
    }
    
    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<div class="no-history">No conversions yet</div>';
            return;
        }
        
        historyList.innerHTML = this.history.slice(0, 10).map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-conversion">
                    <span class="history-from">${this.formatNumber(item.fromValue)} ${item.fromSymbol}</span>
                    <span class="history-arrow">→</span>
                    <span class="history-to">${this.formatNumber(item.toValue)} ${item.toSymbol}</span>
                </div>
                <div class="history-meta">
                    <span class="history-category">${this.units[item.category].icon} ${this.units[item.category].name}</span>
                    <span class="history-time">${this.formatTime(item.timestamp)}</span>
                </div>
                <button class="btn-history-use" title="Use this conversion">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `).join('');
        
        // Attach history item listeners
        document.querySelectorAll('.btn-history-use').forEach((btn, index) => {
            btn.addEventListener('click', () => this.useHistoryItem(index));
        });
    }
    
    /**
     * Use history item
     */
    useHistoryItem(index) {
        const item = this.history[index];
        
        this.selectCategory(item.category);
        
        setTimeout(() => {
            document.getElementById('fromUnit').value = item.fromUnit;
            document.getElementById('toUnit').value = item.toUnit;
            document.getElementById('fromValue').value = item.fromValue;
            this.performConversion();
        }, 100);
        
        this.showNotification('Conversion loaded from history', 'info');
    }
    
    /**
     * Update conversion info
     */
    updateConversionInfo() {
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        const fromValue = document.getElementById('fromValue').value;
        
        if (!fromUnit || !toUnit) {
            document.getElementById('conversionInfo').textContent = 'Select units to start converting';
            return;
        }
        
        const units = this.units[this.currentCategory].units;
        const fromName = units[fromUnit].name;
        const toName = units[toUnit].name;
        
        if (fromValue) {
            document.getElementById('conversionInfo').textContent = 
                `Converting ${fromName} to ${toName}`;
        } else {
            document.getElementById('conversionInfo').textContent = 
                `Ready to convert ${fromName} to ${toName}`;
        }
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    this.performConversion();
                    break;
                case 'Delete':
                    e.preventDefault();
                    this.clearAll();
                    break;
                case 's':
                    e.preventDefault();
                    this.addToFavorites();
                    break;
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.copyResult();
                    }
                    break;
            }
        } else if (e.key === 'Tab' && e.shiftKey) {
            // Swap units with Shift+Tab
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.id === 'fromValue' || activeElement.id === 'toValue')) {
                e.preventDefault();
                this.swapUnits();
            }
        }
    }
    
    /**
     * Update favorites list
     */
    updateFavoritesList() {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = this.createFavoritesList();
        this.attachFavoritesListeners();
        
        // Show/hide favorites section
        const favoritesSection = document.getElementById('favoritesSection');
        favoritesSection.style.display = this.favorites.length > 0 ? 'block' : 'none';
    }
    
    /**
     * Use favorite conversion
     */
    useFavorite(index) {
        const favorite = this.favorites[index];
        
        this.selectCategory(favorite.category);
        
        setTimeout(() => {
            document.getElementById('fromUnit').value = favorite.fromUnit;
            document.getElementById('toUnit').value = favorite.toUnit;
            document.getElementById('fromValue').focus();
            this.updateConversionInfo();
        }, 100);
        
        this.showNotification(`Using favorite: ${favorite.label}`, 'info');
    }
    
    /**
     * Remove favorite
     */
    removeFavorite(index) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.updateFavoritesList();
        this.showNotification('Removed from favorites', 'info');
    }
    
    /**
     * Clear history
     */
    clearHistory() {
        if (this.history.length === 0) {
            this.showNotification('History is already empty', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to clear all conversion history?')) {
            this.history = [];
            this.updateHistoryDisplay();
            this.showNotification('History cleared', 'info');
        }
    }
    
    /**
     * Export data
     */
    exportData() {
        const data = {
            favorites: this.favorites,
            history: this.history,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `unit-converter-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully', 'success');
    }
    
    /**
     * Import data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.favorites && Array.isArray(data.favorites)) {
                        this.favorites = data.favorites;
                        this.saveFavorites();
                        this.updateFavoritesList();
                    }
                    
                    if (data.history && Array.isArray(data.history)) {
                        this.history = data.history;
                        this.updateHistoryDisplay();
                    }
                    
                    this.showNotification('Data imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing data: Invalid file format', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    /**
     * Save favorites to localStorage
     */
    saveFavorites() {
        localStorage.setItem('unitConverterFavorites', JSON.stringify(this.favorites));
    }
    
    /**
     * Load default settings
     */
    loadDefaults() {
        this.selectCategory('length');
        this.updateFavoritesList();
        this.updateHistoryDisplay();
    }
    
    /**
     * Format timestamp
     */
    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) {
            return 'Just now';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}h ago`;
        } else {
            return new Date(timestamp).toLocaleDateString();
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notificationArea');
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notificationArea.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
             notification.remove();
         });
     }

    /**
     * Apply CSS styles
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Unit Converter Styles */
            .unit-converter {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }

            .converter-header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .converter-header h2 {
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0 0 10px 0;
                text-align: center;
            }

            .converter-header p {
                color: #666;
                text-align: center;
                font-size: 1.1rem;
                margin: 0;
            }

            .converter-body {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .category-section,
            .conversion-section,
            .quick-section,
            .favorites-section,
            .history-section {
                margin-bottom: 30px;
            }

            .category-section h3,
            .conversion-section h3,
            .quick-section h3,
            .favorites-section h3,
            .history-section h3 {
                font-size: 1.3rem;
                font-weight: 600;
                margin: 0 0 20px 0;
                color: #333;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .category-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            }

            .category-btn {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                font-weight: 500;
                color: #495057;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .category-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                border-color: #667eea;
            }

            .category-btn.active {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .category-icon {
                font-size: 1.5rem;
            }

            .conversion-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .btn-swap {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .btn-swap:hover {
                transform: rotate(180deg) scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .conversion-interface {
                background: #f8f9fa;
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 25px;
                border: 1px solid #e9ecef;
            }

            .input-group {
                margin-bottom: 20px;
            }

            .input-group label {
                font-weight: 600;
                color: #495057;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                display: block;
            }

            .input-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }

            .input-row input,
            .input-row select {
                padding: 15px;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                background: white;
            }

            .input-row input:focus,
            .input-row select:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .conversion-arrow {
                text-align: center;
                font-size: 1.5rem;
                color: #667eea;
                margin: 10px 0;
            }

            .conversion-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }

            .btn-action {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border: 2px solid #dee2e6;
                border-radius: 12px;
                padding: 12px 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #495057;
            }

            .btn-action:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                border-color: transparent;
            }

            .quick-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
            }

            .quick-btn {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                color: #495057;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .quick-btn:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                transform: translateY(-2px);
                border-color: transparent;
            }

            .quick-label {
                font-weight: 500;
                font-size: 0.9rem;
            }

            .quick-units {
                font-size: 0.8rem;
                opacity: 0.7;
            }

            .favorites-list,
            .history-list {
                max-height: 300px;
                overflow-y: auto;
            }

            .favorite-item,
            .history-item {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .favorite-item:hover,
            .history-item:hover {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                transform: translateX(5px);
                border-color: transparent;
            }

            .favorite-info,
            .history-conversion {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .favorite-label,
            .history-from {
                font-weight: 500;
            }

            .favorite-units,
            .history-meta {
                font-size: 0.8rem;
                opacity: 0.7;
            }

            .favorite-actions {
                display: flex;
                gap: 5px;
            }

            .btn-fav-use,
            .btn-fav-remove,
            .btn-history-use {
                background: transparent;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                width: 30px;
                height: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            }

            .btn-fav-use:hover,
            .btn-history-use:hover {
                background: #28a745;
                color: white;
                border-color: #28a745;
            }

            .btn-fav-remove:hover {
                background: #dc3545;
                color: white;
                border-color: #dc3545;
            }

            .no-favorites,
            .no-history {
                text-align: center;
                color: #6c757d;
                font-style: italic;
                padding: 20px;
            }

            .status-bar {
                background: rgba(248, 249, 250, 0.9);
                border-radius: 12px;
                padding: 15px 20px;
                margin-top: 20px;
                border: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
                color: #6c757d;
            }

            .status-actions {
                display: flex;
                gap: 10px;
            }

            .btn-status {
                background: transparent;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                width: 35px;
                height: 35px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                color: #6c757d;
            }

            .btn-status:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .notification-area {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            }

            .notification {
                padding: 15px 20px;
                border-radius: 12px;
                color: white;
                font-weight: 500;
                margin-bottom: 10px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                animation: slideIn 0.3s ease;
            }

            .notification-success {
                background: linear-gradient(135deg, #28a745, #20c997);
            }

            .notification-error {
                background: linear-gradient(135deg, #dc3545, #e74c3c);
            }

            .notification-info {
                background: linear-gradient(135deg, #007bff, #6610f2);
            }

            .notification-warning {
                background: linear-gradient(135deg, #ffc107, #fd7e14);
            }

            .notification-close {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                opacity: 0.7;
            }

            /* Animations */
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .unit-converter {
                    padding: 10px;
                }

                .converter-header,
                .converter-body {
                    padding: 20px;
                }

                .category-grid {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 10px;
                }

                .input-row {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }

                .conversion-actions {
                    justify-content: center;
                }

                .quick-grid {
                    grid-template-columns: 1fr;
                }

                .status-bar {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }
            }

            /* Scrollbar Styling */
            .favorites-list::-webkit-scrollbar,
            .history-list::-webkit-scrollbar {
                width: 6px;
            }

            .favorites-list::-webkit-scrollbar-track,
            .history-list::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .favorites-list::-webkit-scrollbar-thumb,
            .history-list::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }

            .favorites-list::-webkit-scrollbar-thumb:hover,
            .history-list::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnitConverterUtility;
}