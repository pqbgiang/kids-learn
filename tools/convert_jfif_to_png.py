from PIL import Image
import os

# Define the input and output folder
input_folder = "d:/Workspace/kids-learn/public/images/animals"
output_folder = "d:/Workspace/kids-learn/public/images/animals"

# Iterate through all files in the input folder
for filename in os.listdir(input_folder):
    if filename.endswith(".jfif") and filename.lower().startswith('l'):
        # Open the .jfif file
        img = Image.open(os.path.join(input_folder, filename))
        # Convert the filename to .png
        png_filename = os.path.splitext(filename)[0] + ".png"
        # Save the image as .png
        img.save(os.path.join(output_folder, png_filename), "PNG")
        print(f"Converted {filename} to {png_filename}")