# Prime Influencer - Project Verification

Write-Host "Verifying Prime Influencer Monorepo Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (Test-Path "pnpm-workspace.yaml") {
    Write-Host "[OK] Found pnpm-workspace.yaml" -ForegroundColor Green
} else {
    Write-Host "[ERROR] pnpm-workspace.yaml not found!" -ForegroundColor Red
    exit 1
}

# Check apps
Write-Host ""
Write-Host "Checking Apps..." -ForegroundColor Yellow
if (Test-Path "apps/web/package.json") {
    Write-Host "  [OK] apps/web (Frontend - Next.js)" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] apps/web not found!" -ForegroundColor Red
}

if (Test-Path "apps/api/package.json") {
    Write-Host "  [OK] apps/api (Backend - Express.js)" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] apps/api not found!" -ForegroundColor Red
}

# Check packages
Write-Host ""
Write-Host "Checking Shared Packages..." -ForegroundColor Yellow
if (Test-Path "packages/typescript-config/package.json") {
    Write-Host "  [OK] packages/typescript-config" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] packages/typescript-config not found!" -ForegroundColor Red
}

# Check if pnpm is installed
Write-Host ""
Write-Host "Checking Tools..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "  [OK] pnpm v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] pnpm not installed!" -ForegroundColor Red
    Write-Host "  Run: npm install -g pnpm" -ForegroundColor Yellow
}

# Check if dependencies are installed
Write-Host ""
Write-Host "Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  [OK] Root dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] Root dependencies not installed" -ForegroundColor Yellow
    Write-Host "  Run: pnpm install" -ForegroundColor Cyan
}

if (Test-Path "apps/web/node_modules") {
    Write-Host "  [OK] Web dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] Web dependencies not installed" -ForegroundColor Yellow
}

if (Test-Path "apps/api/node_modules") {
    Write-Host "  [OK] API dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] API dependencies not installed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Verification Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Start development: pnpm dev" -ForegroundColor White
Write-Host "  2. Or start separately:" -ForegroundColor White
Write-Host "     - Backend: pnpm dev:api (Port 5000)" -ForegroundColor White
Write-Host "     - Frontend: pnpm dev:web (Port 3000)" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - See SETUP.md for detailed instructions" -ForegroundColor White
Write-Host "  - See README.md for project overview" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
