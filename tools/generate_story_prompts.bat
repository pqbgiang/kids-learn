@echo off
echo ===================================================
echo Story Image Prompt Generator for Kids-Learn App
echo ===================================================
echo.
echo This script will generate detailed image generation prompts
echo for all stories in the kids-learn application.
echo.

rem Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python and try again.
    pause
    exit /b 1
)

echo Generating story image prompts...
echo.

rem Run the Python script
python "%~dp0\story_image_prompt_helper.py"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate prompts.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Prompt generation completed successfully!
echo.
echo You can find the generated files at:
echo - %~dp0\story_image_prompts.md
echo - %~dp0\story_images_required.md
echo.
echo Open these files in a Markdown viewer for best results.
echo ===================================================

pause
