# Animal Image Optimization Workflow

This document explains how to use the image optimization tools for the Kids Learn application to reduce loading latency.

## Overview

The workflow consists of:

1. Storing original, high-quality animal images in `src/resources/images/animals/`
2. Using the optimization script to generate web-optimized 256x256px PNG images
3. Outputting optimized images to `public/images/animals/` for use in the application

## Instructions

### First-Time Setup

1. If you don't already have Python 3.x installed, download and install it from [python.org](https://www.python.org/downloads/)

2. Create the source images directory (if it doesn't exist):
   ```
   mkdir -p src/resources/images/animals
   ```

3. Copy existing animal images to the source directory:
   ```powershell
   cd tools
   .\Optimize-AnimalImages.ps1 -CopyExisting
   ```

### Adding New Animal Images

1. Place new full-quality animal images in `src/resources/images/animals/`
   - Acceptable formats: PNG, JPG, JPEG, JFIF
   - Images should have descriptive filenames like `gorilla.png` or `vampire-bat.jpg`

2. Run the optimization script:
   ```powershell
   cd tools
   .\Optimize-AnimalImages.ps1
   ```

3. The optimized images will be available in `public/images/animals/` and automatically converted to PNG format

### Advanced Options

The optimization script supports several options:

- Change image size:
  ```powershell
  .\Optimize-AnimalImages.ps1 -Size 512
  ```

- Specify custom source or output directories:
  ```powershell
  .\Optimize-AnimalImages.ps1 -SourceDir "path\to\source" -OutputDir "path\to\output"
  ```

## Benefits

- **Reduced file sizes**: Optimized PNGs reduce loading times
- **Consistent dimensions**: All images are exactly 256x256 pixels
- **Format consistency**: All images are converted to PNG format
- **Preserved transparency**: Transparency is maintained for PNGs with alpha channels
- **Automated workflow**: Simple one-step process to optimize all images

## Technical Details

The optimization process:
1. Resizes images to 256x256 pixels while maintaining aspect ratio
2. Centers images on a transparent background if aspect ratio requires padding
3. Applies PNG optimization to reduce file size
4. Preserves transparency where applicable
5. Converts non-PNG formats to optimized PNGs
