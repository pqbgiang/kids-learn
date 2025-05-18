#!/usr/bin/env python3
"""
Image Optimizer for Kids Learn App

This script optimizes animal images by:
1. Resizing to 256x256 pixels
2. Optimizing PNG compression
3. Preserving transparency
4. Ensuring all images are in PNG format

Usage:
python optimize_animal_images.py
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
import shutil
import argparse

# Default paths - using absolute paths for clarity
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
SRC_DIR = PROJECT_ROOT / "src" / "resources" / "images" / "animals"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "animals"
TARGET_SIZE = (256, 256)


def optimize_image(image_path, output_path, size=TARGET_SIZE):
    """
    Optimize a single image
    """
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Convert JFIF to PNG or maintain existing format
        if img.format == "JPEG" or image_path.suffix.lower() in [".jfif", ".jpg", ".jpeg"]:
            # Create a white background for JPEG images
            background = Image.new("RGBA", img.size, (255, 255, 255, 255))
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[3] if len(img.split()) > 3 else None)
            img = background.convert("RGB")
        
        # Resize the image while maintaining aspect ratio
        img = ImageOps.contain(img, size)
        
        # If the image isn't exactly the target size, paste it onto a blank background
        if img.size != size:
            background = Image.new(img.mode, size, (255, 255, 255, 0) if img.mode == "RGBA" else (255, 255, 255))
            offset = ((size[0] - img.size[0]) // 2, (size[1] - img.size[1]) // 2)
            background.paste(img, offset)
            img = background
            
        # Save the optimized image
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save with optimal compression
        img.save(output_path, "PNG", optimize=True, quality=90)
        print(f"Optimized: {image_path} -> {output_path}")
        return True
    
    except Exception as e:
        print(f"Error processing {image_path}: {e}", file=sys.stderr)
        return False


def batch_optimize(source_dir, output_dir, size=TARGET_SIZE):
    """
    Process all images in the source directory
    """
    source_path = Path(source_dir).resolve()
    output_path = Path(output_dir).resolve()
    
    if not source_path.exists():
        print(f"Source directory not found: {source_path}", file=sys.stderr)
        return False
        
    # Create output directory if it doesn't exist
    os.makedirs(output_path, exist_ok=True)
    
    # Get only PNG image files
    image_files = []
    for ext in [".png"]:
        image_files.extend(list(source_path.glob(f"*{ext}")))
        image_files.extend(list(source_path.glob(f"*{ext.upper()}")))
    
    if not image_files:
        print(f"No PNG image files found in {source_path}")
        return False
    
    # Process each image
    success_count = 0
    for img_file in image_files:
        # Create output file path with .png extension
        output_file = output_path / f"{img_file.stem}.png"
        if optimize_image(img_file, output_file, size):
            success_count += 1
    
    print(f"\nOptimization complete: {success_count}/{len(image_files)} images processed successfully")
    return True


def main():
    parser = argparse.ArgumentParser(description="Optimize animal images for the Kids Learn App")
    parser.add_argument("--src", default=SRC_DIR, help="Source directory with original images")
    parser.add_argument("--out", default=OUTPUT_DIR, help="Output directory for optimized images")
    parser.add_argument("--size", default=256, type=int, help="Target image size (square)")
    parser.add_argument("--copy-existing", action="store_true", 
                        help="Copy existing images from build/images/animals to source directory")
    
    args = parser.parse_args()
    
    # Convert to Path objects
    src_dir = Path(args.src)
    output_dir = Path(args.out)
    target_size = (args.size, args.size)
    
    # Copy existing images if requested
    if args.copy_existing:
        existing_dir = Path("../build/images/animals")
        if existing_dir.exists():
            print(f"Copying existing images from {existing_dir} to {src_dir}...")
            os.makedirs(src_dir, exist_ok=True)
            
            for img_file in existing_dir.glob("*.*"):
                if img_file.suffix.lower() in [".png", ".jpg", ".jpeg", ".jfif"]:
                    dest_file = src_dir / img_file.name
                    if not dest_file.exists():
                        shutil.copy2(img_file, dest_file)
                        print(f"Copied: {img_file.name}")
    
    # Run the optimization
    batch_optimize(src_dir, output_dir, target_size)


if __name__ == "__main__":
    main()
