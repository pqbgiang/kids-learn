#!/usr/bin/env python3
"""
Story Image Prompt Generator

This script generates detailed image generation prompts for each story and its scenes
based on the stories defined in the storyService.ts file.

Usage:
python story_image_prompt_helper.py

Output:
- Creates a story_image_prompts.md file with detailed prompts for each story
- Creates a story_images_required.md file with a list of required image files
"""

import os
import re
import json
from pathlib import Path

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
    base_style = CATEGORY_STYLES.get(story['category'], STYLE_CARTOON)
    age_style = AGE_STYLE_ELEMENTS.get(story['recommendedAge'], "")
    
    prompt = f"Create a cover illustration for '{story['title']}'. "
    prompt += f"The image should capture the essence of this story: {story['description']} "
    prompt += f"Style: {base_style}, {age_style}. "
    prompt += "The illustration should be appealing to young children and include the main character(s). "
    prompt += "Include space at the top for the title text. Composition should be centered and balanced."
    
    return prompt

def generate_page_prompt(story, page, page_number):
    """Generate a prompt for a story page illustration"""
    base_style = CATEGORY_STYLES.get(story['category'], STYLE_CARTOON)
    age_style = AGE_STYLE_ELEMENTS.get(story['recommendedAge'], "")
    
    prompt = f"Create an illustration for page {page_number} of '{story['title']}'. "
    prompt += f"This scene depicts: {page['text']} "
    prompt += f"Style: {base_style}, {age_style}. "
    prompt += "The illustration should clearly communicate the story text to young children. "
    prompt += "Include ample space for text placement either at the top or bottom. "
    prompt += "The characters should have friendly, appealing expressions appropriate for children."
    
    return prompt

def generate_all_prompts(stories, output_dir):
    """Generate all prompts and write to output files"""
    prompts_file = os.path.join(output_dir, 'story_image_prompts.md')
    required_file = os.path.join(output_dir, 'story_images_required.md')
    
    # Debug: Print file paths before writing
    print(f"Writing prompts to: {os.path.abspath(prompts_file)}")
    print(f"Writing required images list to: {os.path.abspath(required_file)}")
    
    try:
        with open(prompts_file, 'w', encoding='utf-8') as f_prompts:
            # Write header
            f_prompts.write("# Story Image Generation Prompts\n\n")
            f_prompts.write("Use these prompts with your preferred image generation tool.\n\n")
            
            # Process each story for prompts
            for story in stories:
                # Write story section
                f_prompts.write(f"## {story['title']} (ID: {story['id']})\n\n")
                
                if 'recommendedAge' in story and 'category' in story:
                    f_prompts.write(f"Age: {story['recommendedAge']}+, Category: {story['category']}\n\n")
                
                if 'description' in story:
                    f_prompts.write(f"Description: {story['description']}\n\n")
                
                # Cover image
                cover_prompt = generate_cover_prompt(story)
                cover_image_path = f"/images/stories/{story['id']}-cover.png"
                
                f_prompts.write("### Cover Image\n\n")
                f_prompts.write(f"**File:** `{cover_image_path}`\n\n")
                f_prompts.write(f"**Prompt:**\n\n{cover_prompt}\n\n")
                
                # Page images
                f_prompts.write("### Page Images\n\n")
                
                for i, page in enumerate(story['pages'], 1):
                    page_prompt = generate_page_prompt(story, page, i)
                    page_image_path = f"/images/stories/{story['id']}-{i}.png"
                    
                    f_prompts.write(f"#### Page {i}\n\n")
                    f_prompts.write(f"**Text:** \"{page['text']}\"\n\n")
                    f_prompts.write(f"**File:** `{page_image_path}`\n\n")
                    f_prompts.write(f"**Prompt:**\n\n{page_prompt}\n\n")
                
                f_prompts.write("\n---\n\n")
            
            # Ensure content is flushed to disk
            f_prompts.flush()
            print(f"Successfully wrote prompts to {os.path.abspath(prompts_file)}")
    
    except Exception as e:
        print(f"Error writing prompts file: {e}")
    
    try:
        with open(required_file, 'w', encoding='utf-8') as f_required:
            # Write header
            f_required.write("# Required Story Images\n\n")
            f_required.write("This file lists all the image files that need to be created.\n\n")
            
            # Process each story for required images
            for story in stories:
                # Add story to required images
                f_required.write(f"## {story['title']} (ID: {story['id']})\n\n")
                
                # Cover image requirement
                cover_image_path = f"/images/stories/{story['id']}-cover.png"
                f_required.write(f"- [ ] {cover_image_path}\n")
                
                # Page image requirements
                for i in range(1, len(story['pages'])+1):
                    page_image_path = f"/images/stories/{story['id']}-{i}.png"
                    f_required.write(f"- [ ] {page_image_path}\n")
                
                f_required.write("\n")
            
            # Ensure content is flushed to disk
            f_required.flush()
            print(f"Successfully wrote required images list to {os.path.abspath(required_file)}")
    
    except Exception as e:
        print(f"Error writing required images file: {e}")

def main():
    # Get the workspace root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    
    # Path to the story service file
    story_service_file = os.path.join(root_dir, 'src', 'services', 'story', 'storyService.ts')
    
    # Extract story data
    stories = extract_story_data(story_service_file)
    print(f"Extracted data for {len(stories)} stories")
    
    # Generate prompts
    generate_all_prompts(stories, script_dir)
    print(f"Generated prompts written to: {os.path.join(script_dir, 'story_image_prompts.md')}")
    print(f"Required images list written to: {os.path.join(script_dir, 'story_images_required.md')}")

if __name__ == "__main__":
    main()