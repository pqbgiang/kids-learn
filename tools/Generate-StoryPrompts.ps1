# Story Image Prompt Generator for Kids-Learn App
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Story Image Prompt Generator for Kids-Learn App" -ForegroundColor Cyan
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

Write-Host "Generating story image prompts..." -ForegroundColor Yellow
Write-Host

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Run the Python script
try {
    python "$scriptPath\story_image_prompt_helper.py"
    if ($LASTEXITCODE -ne 0) {
        throw "Python script exited with error code $LASTEXITCODE"
    }
}
catch {
    Write-Host "ERROR: Failed to generate prompts." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Prompt generation completed successfully!" -ForegroundColor Green
Write-Host
Write-Host "You can find the generated files at:"
Write-Host "- $scriptPath\story_image_prompts.md" -ForegroundColor Yellow
Write-Host "- $scriptPath\story_images_required.md" -ForegroundColor Yellow
Write-Host
Write-Host "Open these files in a Markdown viewer for best results."
Write-Host "===================================================" -ForegroundColor Green

Read-Host "Press Enter to exit"
