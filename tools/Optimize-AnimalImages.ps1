# Optimize-AnimalImages.ps1
# PowerShell script to optimize animal images for the Kids Learn app

param(
    [switch]$CopyExisting = $false,
    [int]$Size = 256,
    [string]$SourceDir = "..\src\resources\images\animals",
    [string]$OutputDir = "..\public\images\animals"
)

# Ensure Python is available
try {
    python --version | Out-Null
}
catch {
    Write-Host "Python is not installed or not available in PATH. Please install Python 3.x."
    exit 1
}

# Check if PIL/Pillow is installed
$modulesInstalled = $true
try {
    python -c "import PIL" | Out-Null
}
catch {
    Write-Host "Installing required Python modules..."
    python -m pip install Pillow | Out-Null
    $modulesInstalled = $false
}

if (-not $modulesInstalled) {
    Write-Host "Required modules installed successfully."
}

# Build the command
$command = "python optimize_animal_images.py --src `"$SourceDir`" --out `"$OutputDir`" --size $Size"

if ($CopyExisting) {
    $command += " --copy-existing"
}

# Run the optimization script
Write-Host "Starting image optimization process..."
Write-Host $command
Invoke-Expression $command

Write-Host "`nImage optimization complete."
Write-Host "Original images: $SourceDir"
Write-Host "Optimized images: $OutputDir"
