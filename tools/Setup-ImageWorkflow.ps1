# Story Image Workflow Setup
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Story Image Workflow Setup for Kids-Learn App" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host 

# Check if Python is installed
try {
    python --version | Out-Null
}
catch {
    Write-Host "ERROR: Python is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Python and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Setting up story image workflow..." -ForegroundColor Yellow
Write-Host "This will create a directory structure to organize your image generation process." -ForegroundColor Yellow
Write-Host

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Run the Python workflow script
try {
    python "$scriptPath\story_image_workflow.py"
    if ($LASTEXITCODE -ne 0) {
        throw "Python script exited with error code $LASTEXITCODE"
    }
}
catch {
    Write-Host "ERROR: Failed to set up workflow." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Workflow setup completed successfully!" -ForegroundColor Green
Write-Host
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Navigate to the workflow directory" -ForegroundColor Yellow
Write-Host "2. Open prompt_index.md to see all stories" -ForegroundColor Yellow
Write-Host "3. Choose a story and start generating images" -ForegroundColor Yellow
Write-Host "4. Place generated images in the 2_generated folder" -ForegroundColor Yellow
Write-Host "5. When finished, use Deploy-Images.ps1 to deploy" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Green

Read-Host "Press Enter to exit"
