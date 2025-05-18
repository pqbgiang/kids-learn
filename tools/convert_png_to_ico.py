"""
Tool to convert PNG images to ICO format with multiple sizes.
Requires Pillow library: pip install Pillow
"""
from PIL import Image
import os

def convert_png_to_ico(png_path, ico_path, sizes=None):
    """
    Convert a PNG file to ICO format with specified sizes.
    
    Args:
        png_path (str): Path to the source PNG file
        ico_path (str): Path where the ICO file should be saved
        sizes (list): List of sizes for the ICO file. Default is [16, 32]
    """
    if sizes is None:
        sizes = [16, 32]  # Default sizes for favicon
        
    try:
        # Open the PNG image
        img = Image.open(png_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode == 'RGBA':
            # Create a white background image
            background = Image.new('RGB', img.size, (255, 255, 255))
            # Paste the image on the background using alpha channel as mask
            background.paste(img, mask=img.split()[3])
            img = background
        
        # Create images in all required sizes
        icon_sizes = []
        for size in sizes:
            resized_img = img.resize((size, size), Image.ANTIALIAS)
            icon_sizes.append(resized_img)
            
        # Save the ICO file with all sizes
        icon_sizes[0].save(
            ico_path,
            format='ICO',
            sizes=[(size, size) for size in sizes],
            append_images=icon_sizes[1:]
        )
        print(f"Successfully converted {png_path} to {ico_path}")
        
    except Exception as e:
        print(f"Error converting {png_path}: {str(e)}")

def batch_convert_pngs(input_dir, output_dir=None, sizes=None):
    """
    Convert multiple PNG files to ICO format.
    
    Args:
        input_dir (str): Directory containing PNG files
        output_dir (str): Directory where ICO files should be saved (default: same as input)
        sizes (list): List of sizes for the ICO files. Default is [16, 32]
    """
    if output_dir is None:
        output_dir = input_dir
        
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for filename in os.listdir(input_dir):
        if filename.lower().endswith('.png'):
            png_path = os.path.join(input_dir, filename)
            ico_path = os.path.join(output_dir, filename[:-4] + '.ico')
            convert_png_to_ico(png_path, ico_path, sizes)

def main():
    # Get the project root directory (2 levels up from this script)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Define paths
    logo_path = os.path.join(project_root, 'public', 'logo512.png')
    favicon_path = os.path.join(project_root, 'public', 'favicon.ico')
    
    # Convert logo to favicon
    if os.path.exists(logo_path):
        convert_png_to_ico(logo_path, favicon_path)
    else:
        print(f"Error: Could not find logo file at {logo_path}")

if __name__ == "__main__":
    main()
