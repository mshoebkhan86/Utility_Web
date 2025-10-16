# PowerShell script to add navbar to all demo pages

# Define the navbar HTML structure
$navbarHTML = @'
    <!-- Top Navigation Bar -->
    <nav class="top-navbar">
        <div class="navbar-container">
            <!-- Logo Section -->
            <div class="navbar-brand">
                <div class="logo">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="8" fill="url(#logoGradient)"/>
                        <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h12v2H12v-2z" fill="white"/>
                        <circle cx="30" cy="12" r="3" fill="#10b981"/>
                        <defs>
                            <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#3b82f6"/>
                                <stop offset="1" stop-color="#6366f1"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <span class="brand-text">UtilityHub</span>
                </div>
            </div>

            <!-- Navigation Links -->
            <div class="navbar-nav">
                <a href="index.html" class="nav-link">Dashboard</a>
                <a href="#" class="nav-link active">Tools</a>
                <a href="#" class="nav-link">About</a>
                <a href="#" class="nav-link">Help</a>
            </div>

            <!-- User Profile Section -->
            <div class="navbar-user">
                <div class="user-actions">
                    <button class="btn-icon notification-btn" title="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span class="notification-badge">3</span>
                    </button>
                    
                    <div class="user-profile-dropdown">
                        <button class="user-profile-btn">
                            <div class="user-avatar">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%236366f1'/%3E%3Cpath d='M16 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 8v2h16v-2c0-5.33-2.67-8-8-8z' fill='white'/%3E%3C/svg%3E" alt="User Avatar">
                            </div>
                            <span class="user-name">John Doe</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </button>
                        
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Profile
                            </a>
                            <a href="#" class="dropdown-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                Settings
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item text-red">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16,17 21,12 16,7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </a>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary login-btn" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10,17 15,12 10,7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Login
                    </button>
                </div>
            </div>
        </div>
    </nav>
'@

# Get all demo HTML files (excluding the ones already updated)
$demoFiles = Get-ChildItem -Path "." -Name "*-demo.html" | Where-Object { $_ -notin @("api-tester-demo.html", "business-card-designer-demo.html") }

Write-Host "Found $($demoFiles.Count) demo files to update:"
$demoFiles | ForEach-Object { Write-Host "  - $_" }

foreach ($file in $demoFiles) {
    Write-Host "`nProcessing: $file"
    
    try {
        # Read the file content
        $content = Get-Content -Path $file -Raw -Encoding UTF8
        
        # Add padding-top to body
        if ($content -match 'padding:\s*0') {
            $content = $content -replace '(padding:\s*)0', '${1}70px 0 0 0'
            Write-Host "  Updated body padding"
        } else {
            $content = $content -replace '(body\s*\{[^}]*)(})','${1}padding-top: 70px; $2'
            Write-Host "  Added body padding-top"
        }
        
        # Replace existing headers
        $patterns = @(
            '<header[^>]*class="[^"]*demo-header[^"]*"[^>]*>[\s\S]*?</header>',
            '<header[^>]*class="[^"]*page-header[^"]*"[^>]*>[\s\S]*?</header>',
            '<div[^>]*class="[^"]*demo-header[^"]*"[^>]*>[\s\S]*?</div>',
            '<div[^>]*class="[^"]*page-header[^"]*"[^>]*>[\s\S]*?</div>'
        )
        
        $headerReplaced = $false
        foreach ($pattern in $patterns) {
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $navbarHTML
                $headerReplaced = $true
                Write-Host "  Replaced existing header with navbar"
                break
            }
        }
        
        # If no header found, add navbar after body tag
        if (-not $headerReplaced) {
            $content = $content -replace '(<body[^>]*>)', "`$1`n$navbarHTML"
            Write-Host "  Added navbar after body tag"
        }
        
        # Add navbar.js script
        if ($content -notmatch 'navbar\.js') {
            $content = $content -replace '(\s*</body>)', "`n    <script src=`"js/navbar.js`"></script>`$1"
            Write-Host "  Added navbar.js script"
        }
        
        # Write back to file
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "  Successfully updated $file"
        
    } catch {
        Write-Host "  Error updating $file : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nNavbar update process completed!"
Write-Host "Updated files: $($demoFiles.Count)"