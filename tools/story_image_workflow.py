#!/usr/bin/env python3
"""
Story Image Workflow Organizer

This script helps organize the workflow for creating story images by:
1. Generating prompts for all required images
2. Creating a directory structure for organizing generated images
3. Preparing template files for tracking progress

Usage:
python story_image_workflow.py
"""

import os
import sys
import shutil
import re
from pathlib import Path
from datetime import datetime

# Add parent directory to path so we can import the prompt helper
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

# Try to import the prompt helper, but provide fallbacks if it fails
try:
    import story_image_prompt_helper as prompt_helper
except ImportError:
    print("Warning: Could not import story_image_prompt_helper. Using built-in prompt generators.")
    # Define the same style constants and functions as in the prompt helper
    
    # Define image style constants
    STYLE_CUTE = "cute, children's book illustration style, bright colors, simple shapes, friendly"
    STYLE_WATERCOLOR = "watercolor illustration, soft edges, gentle colors, dreamy, children's book style" 
    STYLE_CARTOON = "cartoon style, vibrant colors, clean lines, friendly characters, appealing to children"
    STYLE_CLAYMATION = "claymation style, 3D-like, textured, colorful, child-friendly, rounded shapes"

    # Map story categories to appropriate styles
    CATEGORY_STYLES = {
        'fairy-tale': STYLE_WATERCOLOR,
        'fable': STYLE_CARTOON,
        'animals': STYLE_CUTE,
        'rhymes': STYLE_CLAYMATION
    }

    # Additional style elements based on age appropriateness
    AGE_STYLE_ELEMENTS = {
        3: "extra simple shapes, very bright primary colors, round friendly faces, ultra-safe for toddlers",
        4: "simple but more detailed, cheerful colors, friendly characters, safe for preschoolers",
        5: "moderate detail, balanced colors, approachable characters, kindergarten-appropriate",
        6: "more intricate details, varied color palette, engaging expressions, early elementary-appropriate"
    }
    
    # Define our own version of the prompt helper functions
    def extract_story_data(typescript_file):
        """Extract story data from the TypeScript file"""
        with open(typescript_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the sampleStories array
        match = re.search(r'const\s+sampleStories\s*:\s*Story\[\]\s*=\s*\[(.*?)\];', content, re.DOTALL)
        if not match:
            print("Could not find sampleStories array in the file!")
            return []
        
        stories_content = match.group(1)
        
        # Extract individual story objects
        story_objects = []
        bracket_count = 0
        start_index = None
        
        for i, char in enumerate(stories_content):
            if char == '{' and bracket_count == 0:
                start_index = i
                bracket_count += 1
            elif char == '{':
                bracket_count += 1
            elif char == '}':
                bracket_count -= 1
                if bracket_count == 0 and start_index is not None:
                    story_objects.append(stories_content[start_index:i+1])
                    start_index = None
        
        # Parse each story object
        stories = []
        for story_obj in story_objects:
            story = {}
            
            # Extract story ID
            id_match = re.search(r"id:\s*'([^']*)'", story_obj)
            if id_match:
                story['id'] = id_match.group(1)
            else:
                continue  # Skip if no ID found
            
            # Extract story title
            title_match = re.search(r"title:\s*'([^']*)'", story_obj)
            if title_match:
                story['title'] = title_match.group(1)
            else:
                continue  # Skip if no title found
            
            # Extract recommended age
            age_match = re.search(r"recommendedAge:\s*(\d+)", story_obj)
            if age_match:
                story['recommendedAge'] = int(age_match.group(1))
            
            # Extract category
            category_match = re.search(r"category:\s*'([^']*)'", story_obj)
            if category_match:
                story['category'] = category_match.group(1)
            
            # Extract description
            desc_match = re.search(r"description:\s*'(.*?)',", story_obj, re.DOTALL)
            if desc_match:
                # Clean up any newlines and extra whitespace
                desc = desc_match.group(1).replace('\n', ' ').strip()
                # Remove extra whitespace
                desc = re.sub(r'\s+', ' ', desc)
                story['description'] = desc
            
            # Extract pages
            pages = []
            # Look for text entries
            text_matches = re.finditer(r"text:\s*'(.*?)'(?=,|\s*})", story_obj, re.DOTALL)
            image_matches = re.finditer(r"image:\s*'([^']*)'", story_obj)
            
            # Convert to lists for easier access
            texts = [m.group(1).replace('\n', ' ').strip() for m in text_matches]
            images = [m.group(1) for m in image_matches]
            
            for i, text in enumerate(texts):
                if i < len(images):
                    pages.append({
                        'text': text,
                        'image_path': images[i]
                    })
            
            story['pages'] = pages
            stories.append(story)
            
        return stories
    
    def generate_cover_prompt(story):
        """Generate a prompt for a story cover image"""
        base_style = CATEGORY_STYLES.get(story.get('category', 'fairy-tale'), STYLE_CARTOON)
        age_style = AGE_STYLE_ELEMENTS.get(story.get('recommendedAge', 5), "")
        
        prompt = f"Create a cover illustration for '{story['title']}'. "
        prompt += f"The image should capture the essence of this story: {story.get('description', 'A children\\'s story')} "
        prompt += f"Style: {base_style}, {age_style}. "
        prompt += "The illustration should be appealing to young children and include the main character(s). "
        prompt += "Include space at the top for the title text. Composition should be centered and balanced."
        
        return prompt

    def generate_page_prompt(story, page, page_number):
        """Generate a prompt for a story page illustration"""
        base_style = CATEGORY_STYLES.get(story.get('category', 'fairy-tale'), STYLE_CARTOON)
        age_style = AGE_STYLE_ELEMENTS.get(story.get('recommendedAge', 5), "")
        
        prompt = f"Create an illustration for page {page_number} of '{story['title']}'. "
        prompt += f"This scene depicts: {page['text']} "
        prompt += f"Style: {base_style}, {age_style}. "
        prompt += "The illustration should clearly communicate the story text to young children. "
        prompt += "Include ample space for text placement either at the top or bottom. "
        prompt += "The characters should have friendly, appealing expressions appropriate for children."
        
        return prompt
        
    # Make the prompt_helper namespace contain our functions
    prompt_helper = sys.modules[__name__]

def create_workflow_directories(root_dir):
    """Create a directory structure for organizing image generation workflow"""
    # Create workflow directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    workflow_dir = os.path.join(root_dir, f"story_images_workflow_{timestamp}")
    os.makedirs(workflow_dir, exist_ok=True)
    
    # Create subdirectories for each workflow stage
    prompts_dir = os.path.join(workflow_dir, "1_prompts")
    generated_dir = os.path.join(workflow_dir, "2_generated")
    processed_dir = os.path.join(workflow_dir, "3_processed")
    final_dir = os.path.join(workflow_dir, "4_final")
    
    os.makedirs(prompts_dir, exist_ok=True)
    os.makedirs(generated_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(final_dir, exist_ok=True)
    
    return {
        "root": workflow_dir,
        "prompts": prompts_dir,
        "generated": generated_dir,
        "processed": processed_dir,
        "final": final_dir
    }

def organize_prompts_by_story(stories, workflow_dirs):
    """Organize prompts by story in the workflow directory"""
    prompts_dir = workflow_dirs["prompts"]
    
    # Generate main prompt index
    index_path = os.path.join(workflow_dirs["root"], "prompt_index.md")
    with open(index_path, "w", encoding="utf-8") as index_file:
        index_file.write("# Story Image Generation Index\n\n")
        index_file.write("This file contains links to prompt files organized by story.\n\n")
        
        for story in stories:
            # Create directory for each story
            story_dir = os.path.join(prompts_dir, f"{story['id']}")
            os.makedirs(story_dir, exist_ok=True)
            
            # Add to index
            index_file.write(f"## [{story['title']}](1_prompts/{story['id']}/prompts.md)\n\n")
            index_file.write(f"- Age: {story.get('recommendedAge', 'N/A')}+\n")
            index_file.write(f"- Category: {story.get('category', 'N/A')}\n")
            index_file.write(f"- Images needed: {len(story['pages']) + 1} (cover + {len(story['pages'])} pages)\n\n")
            
            # Generate story-specific prompt file
            story_prompts_path = os.path.join(story_dir, "prompts.md")
            with open(story_prompts_path, "w", encoding="utf-8") as story_file:
                story_file.write(f"# {story['title']} Image Prompts\n\n")
                
                if 'description' in story:
                    story_file.write(f"**Description**: {story['description']}\n\n")
                
                # Cover image
                cover_prompt = prompt_helper.generate_cover_prompt(story)
                cover_image_path = f"/images/stories/{story['id']}-cover.png"
                
                story_file.write("## Cover Image\n\n")
                story_file.write(f"**File**: `{cover_image_path}`\n\n")
                story_file.write(f"**Prompt**:\n\n{cover_prompt}\n\n")
                story_file.write("- [ ] Generated\n")
                story_file.write("- [ ] Processed\n")
                story_file.write("- [ ] Finalized\n\n")
                
                # Create an individual prompt file for the cover
                cover_prompt_file = os.path.join(story_dir, "cover.txt")
                with open(cover_prompt_file, "w", encoding="utf-8") as cover_file:
                    cover_file.write(cover_prompt)
                
                # Page images
                for i, page in enumerate(story['pages'], 1):
                    page_prompt = prompt_helper.generate_page_prompt(story, page, i)
                    page_image_path = f"/images/stories/{story['id']}-{i}.png"
                    
                    story_file.write(f"## Page {i}\n\n")
                    story_file.write(f"**Text**: \"{page['text']}\"\n\n")
                    story_file.write(f"**File**: `{page_image_path}`\n\n")
                    story_file.write(f"**Prompt**:\n\n{page_prompt}\n\n")
                    story_file.write("- [ ] Generated\n")
                    story_file.write("- [ ] Processed\n")
                    story_file.write("- [ ] Finalized\n\n")
                    
                    # Create an individual prompt file for each page
                    page_prompt_file = os.path.join(story_dir, f"page_{i}.txt")
                    with open(page_prompt_file, "w", encoding="utf-8") as page_file:
                        page_file.write(page_prompt)
    
    return index_path

def create_workflow_readme(workflow_dirs):
    """Create a README file explaining the workflow"""
    readme_path = os.path.join(workflow_dirs["root"], "README.md")
    
    with open(readme_path, "w", encoding="utf-8") as readme_file:
        readme_file.write("# Story Image Generation Workflow\n\n")
        readme_file.write("This directory contains all the resources needed to generate images for the kids-learn app stories.\n\n")
        
        readme_file.write("## Workflow Steps\n\n")
        readme_file.write("1. **Prompts** (1_prompts directory):\n")
        readme_file.write("   - Contains story-specific directories with prompts for each image\n")
        readme_file.write("   - Use the `.txt` files as direct input to image generation tools\n")
        readme_file.write("   - Track progress in the `prompts.md` file in each story directory\n\n")
        
        readme_file.write("2. **Generated Images** (2_generated directory):\n")
        readme_file.write("   - Place raw generated images here\n")
        readme_file.write("   - Create a subdirectory for each story\n")
        readme_file.write("   - Name files according to their intended final name\n\n")
        
        readme_file.write("3. **Processed Images** (3_processed directory):\n")
        readme_file.write("   - Place edited/processed images here\n")
        readme_file.write("   - Use this for images that need additional editing\n\n")
        
        readme_file.write("4. **Final Images** (4_final directory):\n")
        readme_file.write("   - Place final, ready-to-use images here\n")
        readme_file.write("   - These will be copied to the app's image directory\n\n")
        
        readme_file.write("## Quick Start\n\n")
        readme_file.write("1. Open `prompt_index.md` to see all stories that need images\n")
        readme_file.write("2. Navigate to a specific story's prompt directory\n")
        readme_file.write("3. Use the `.txt` files as input to your image generation tool\n")
        readme_file.write("4. Save generated images to the appropriate directory\n")
        readme_file.write("5. Track your progress in the story's `prompts.md` file\n")
    
    return readme_path

def create_deployment_script(workflow_dirs, project_dir):
    """Create a script to copy final images to the project directory"""
    # Create PowerShell version
    ps_script_path = os.path.join(workflow_dirs["root"], "Deploy-Images.ps1")
    
    with open(ps_script_path, "w", encoding="utf-8") as ps_file:
        ps_file.write("# Story Images Deployment Script\n")
        ps_file.write("# This script copies finalized images to the project's image directory\n\n")
        
        ps_file.write("$sourceDir = Join-Path $PSScriptRoot \"4_final\"\n")
        ps_file.write(f"$targetDir = \"{os.path.join(project_dir, 'public', 'images', 'stories')}\"\n\n")
        
        ps_file.write("# Create target directory if it doesn't exist\n")
        ps_file.write("if (-not (Test-Path $targetDir)) {\n")
        ps_file.write("    New-Item -Path $targetDir -ItemType Directory -Force | Out-Null\n")
        ps_file.write("}\n\n")
        
        ps_file.write("# Count files to copy\n")
        ps_file.write("$files = Get-ChildItem -Path $sourceDir -File -Recurse\n")
        ps_file.write("$fileCount = $files.Count\n\n")
        
        ps_file.write("if ($fileCount -eq 0) {\n")
        ps_file.write("    Write-Host \"No files found in the final directory. Nothing to deploy.\" -ForegroundColor Yellow\n")
        ps_file.write("    exit\n")
        ps_file.write("}\n\n")
        
        ps_file.write("Write-Host \"Found $fileCount images to deploy. Copying to project...\" -ForegroundColor Cyan\n\n")
        
        ps_file.write("# Copy all files from the final directory to the project\n")
        ps_file.write("foreach ($file in $files) {\n")
        ps_file.write("    $relativePath = $file.FullName.Substring($sourceDir.Length + 1)\n")
        ps_file.write("    $destination = Join-Path $targetDir $relativePath\n")
        ps_file.write("    \n")
        ps_file.write("    # Create parent directory if it doesn't exist\n")
        ps_file.write("    $destinationParent = Split-Path -Parent $destination\n")
        ps_file.write("    if (-not (Test-Path $destinationParent)) {\n")
        ps_file.write("        New-Item -Path $destinationParent -ItemType Directory -Force | Out-Null\n")
        ps_file.write("    }\n")
        ps_file.write("    \n")
        ps_file.write("    # Copy the file\n")
        ps_file.write("    Copy-Item -Path $file.FullName -Destination $destination -Force\n")
        ps_file.write("    Write-Host \"Copied: $relativePath\" -ForegroundColor Green\n")
        ps_file.write("}\n\n")
        
        ps_file.write("Write-Host \"Deployment complete! $fileCount images copied to $targetDir\" -ForegroundColor Green\n")
    
    # Create batch version
    bat_script_path = os.path.join(workflow_dirs["root"], "deploy_images.bat")
    
    with open(bat_script_path, "w", encoding="utf-8") as bat_file:
        bat_file.write("@echo off\n")
        bat_file.write("echo Story Images Deployment Script\n")
        bat_file.write("echo This script copies finalized images to the project's image directory\n\n")
        
        bat_file.write("set SOURCE_DIR=%~dp0\\4_final\n")
        bat_file.write(f"set TARGET_DIR={os.path.join(project_dir, 'public', 'images', 'stories')}\n\n")
        
        bat_file.write("rem Create target directory if it doesn't exist\n")
        bat_file.write("if not exist \"%TARGET_DIR%\" mkdir \"%TARGET_DIR%\"\n\n")
        
        bat_file.write("rem Copy all files from the final directory to the project\n")
        bat_file.write("echo Copying images to project...\n")
        bat_file.write("xcopy \"%SOURCE_DIR%\\*.*\" \"%TARGET_DIR%\" /E /Y\n\n")
        
        bat_file.write("echo Deployment complete!\n")
        bat_file.write("echo Images copied to %TARGET_DIR%\n")
        bat_file.write("pause\n")
    
    return {
        "powershell": ps_script_path,
        "batch": bat_script_path
    }

def main():
    # Get the workspace root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    
    # Path to the story service file
    story_service_file = os.path.join(root_dir, 'src', 'services', 'story', 'storyService.ts')
    
    print("Creating story image workflow directories...")
    workflow_dirs = create_workflow_directories(script_dir)
    print(f"Created workflow directory: {workflow_dirs['root']}")
    
    # Extract story data
    stories = prompt_helper.extract_story_data(story_service_file)
    print(f"Extracted data for {len(stories)} stories")
    
    # Organize prompts by story
    index_path = organize_prompts_by_story(stories, workflow_dirs)
    print(f"Generated story prompts and index: {index_path}")
    
    # Create workflow readme
    readme_path = create_workflow_readme(workflow_dirs)
    print(f"Created workflow README: {readme_path}")
    
    # Create deployment script
    script_paths = create_deployment_script(workflow_dirs, root_dir)
    print(f"Created deployment scripts: {script_paths['powershell']} and {script_paths['batch']}")
    
    print("\nWorkflow setup complete!")
    print(f"You can now start generating images using the prompts in: {workflow_dirs['prompts']}")
    print(f"Open {index_path} to begin.")

if __name__ == "__main__":
    main()
