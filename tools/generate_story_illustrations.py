#!/usr/bin/env python3
"""
Story Illustration Generator

This script creates illustrations for the stories in the kids-learn app by:
1. Generating cover images for each story
2. Creating illustrations for individual story pages
3. Utilizing existing animal images with text overlays and backgrounds

Requirements:
- PIL (Pillow) library: pip install Pillow
"""

import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import json
import random
import shutil
from pathlib import Path

# Constants
FONT_SIZE_TITLE = 65
FONT_SIZE_SUBTITLE = 35
FONT_SIZE_PAGE = 40
COVER_WIDTH = 600
COVER_HEIGHT = 400
PAGE_WIDTH = 800
PAGE_HEIGHT = 500
BACKGROUND_COLORS = [
    (255, 223, 186),  # Peach
    (200, 230, 255),  # Light Blue
    (255, 200, 200),  # Light Pink
    (200, 255, 200),  # Light Green
    (230, 230, 255),  # Lavender
    (255, 255, 200),  # Light Yellow
    (200, 255, 230),  # Mint
]
STORY_THEMES = {
    'red-riding-hood': ['forest', 'girl', 'wolf'],
    'three-little-pigs': ['pig', 'wolf', 'house'],
    'tortoise-and-hare': ['turtle', 'rabbit', 'race'],
    'gingerbread-man': ['cookie', 'fox', 'run'],
    'brown-bear': ['bear', 'bird', 'duck'],
    'five-little-monkeys': ['monkey', 'bed', 'doctor'],
    'hungry-caterpillar': ['butterfly', 'fruit', 'leaf'],
    'goldilocks': ['bear', 'girl', 'house'],
    'itsy-bitsy-spider': ['spider', 'rain', 'sun'],
    'three-billy-goats': ['goat', 'bridge', 'troll'],
    'ugly-duckling': ['duck', 'swan', 'pond'],
    'boy-who-cried-wolf': ['wolf', 'sheep', 'boy'],
}

class StoryIllustrationGenerator:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.stories_dir = os.path.join(root_dir, 'public', 'images', 'stories')
        self.animals_dir = os.path.join(root_dir, 'public', 'images', 'animals')
        self.story_data_path = os.path.join(root_dir, 'src', 'services', 'story', 'storyService.ts')
        self.animal_images = {}
        
        # Create stories directory if it doesn't exist
        Path(self.stories_dir).mkdir(parents=True, exist_ok=True)
        
        # Load available animal images
        self._load_animal_images()
        
    def _load_animal_images(self):
        """Load available animal images (.png files only)"""
        for file in os.listdir(self.animals_dir):
            if file.endswith('.png'):
                animal_name = file.split('.')[0].lower()
                self.animal_images[animal_name] = os.path.join(self.animals_dir, file)
        print(f"Loaded {len(self.animal_images)} animal images")
    
    def _find_matching_animal(self, keyword):
        """Find an animal image that matches the keyword"""
        # Direct match
        if keyword in self.animal_images:
            return self.animal_images[keyword]
        
        # Try partial match
        for animal_name, image_path in self.animal_images.items():
            if keyword in animal_name or animal_name in keyword:
                return image_path
        
        # Return a random animal if no match
        return random.choice(list(self.animal_images.values()))    def _create_background(self, width, height, theme=None):
        """Create a colorful background for illustrations with kid-friendly patterns"""
        # Create base image with background color
        bg_color = random.choice(BACKGROUND_COLORS)
        img = Image.new('RGBA', (width, height), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Select a pattern type for this background
        pattern_type = random.choice(['circles', 'stars', 'polka_dots', 'gradient', 'stripes'])
        
        if pattern_type == 'circles':
            # Add colorful, overlapping circles
            for _ in range(15):
                x = random.randint(-50, width+50)
                y = random.randint(-50, height+50)
                radius = random.randint(40, 120)
                
                # Create a more vibrant, pastel color palette
                r = random.randint(180, 255)
                g = random.randint(180, 255)
                b = random.randint(180, 255)
                alpha = random.randint(30, 90)  # Semi-transparent
                
                color = (r, g, b, alpha)
                draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
                
        elif pattern_type == 'stars':
            # Draw star shapes
            for _ in range(20):
                x = random.randint(0, width)
                y = random.randint(0, height)
                size = random.randint(15, 50)
                
                # Bright star colors
                color_options = [
                    (255, 223, 0, 100),    # Yellow
                    (255, 120, 180, 100),  # Pink
                    (100, 200, 255, 100),  # Light blue
                    (180, 255, 140, 100)   # Light green
                ]
                
                color = random.choice(color_options)
                
                # Draw a simple star (5 points)
                self._draw_star(draw, x, y, size, color)
                
        elif pattern_type == 'polka_dots':
            # Create a polka dot pattern
            dot_size = random.randint(8, 15)
            spacing = dot_size * 3
            
            for x in range(0, width + spacing, spacing):
                offset = 0 if (x // spacing) % 2 == 0 else spacing // 2
                for y in range(offset, height + spacing, spacing):
                    # Alternate colors for dots
                    color_options = [
                        (255, 255, 255, 120),  # White
                        (255, 220, 100, 120),  # Yellow
                        (255, 150, 150, 120),  # Pink
                        (150, 220, 255, 120)   # Blue
                    ]
                    color = random.choice(color_options)
                    
                    draw.ellipse((x - dot_size, y - dot_size, 
                                 x + dot_size, y + dot_size), 
                                fill=color)
        
        elif pattern_type == 'gradient':
            # Create a new image for the gradient
            gradient = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            gradient_draw = ImageDraw.Draw(gradient)
            
            # Choose direction and colors
            direction = random.choice(['horizontal', 'vertical', 'diagonal'])
            color1 = random.choice(BACKGROUND_COLORS)
            color2 = random.choice(BACKGROUND_COLORS)
            
            # Convert to RGBA
            color1 = (*color1, 255)
            color2 = (*color2, 255)
            
            # Create gradient
            if direction == 'horizontal':
                for x in range(width):
                    # Calculate color for this column
                    r = int(color1[0] + (color2[0] - color1[0]) * x / width)
                    g = int(color1[1] + (color2[1] - color1[1]) * x / width)
                    b = int(color1[2] + (color2[2] - color1[2]) * x / width)
                    a = int(color1[3] + (color2[3] - color1[3]) * x / width)
                    
                    gradient_draw.line([(x, 0), (x, height)], fill=(r, g, b, a))
                    
            elif direction == 'vertical':
                for y in range(height):
                    r = int(color1[0] + (color2[0] - color1[0]) * y / height)
                    g = int(color1[1] + (color2[1] - color1[1]) * y / height)
                    b = int(color1[2] + (color2[2] - color1[2]) * y / height)
                    a = int(color1[3] + (color2[3] - color1[3]) * y / height)
                    
                    gradient_draw.line([(0, y), (width, y)], fill=(r, g, b, a))
            
            else:  # diagonal
                for i in range(width + height):
                    # Diagonal line from top-left to bottom-right
                    r = int(color1[0] + (color2[0] - color1[0]) * i / (width + height))
                    g = int(color1[1] + (color2[1] - color1[1]) * i / (width + height))
                    b = int(color1[2] + (color2[2] - color1[2]) * i / (width + height))
                    a = int(color1[3] + (color2[3] - color1[3]) * i / (width + height))
                    
                    # Draw line segment for this diagonal
                    points = []
                    if i < height:
                        # Start from left edge
                        points.append((0, i))
                    else:
                        # Start from top edge
                        points.append((i - height, height))
                        
                    if i < width:
                        # End at top edge
                        points.append((i, 0))
                    else:
                        # End at right edge
                        points.append((width, i - width))
                        
                    gradient_draw.line(points, fill=(r, g, b, a))
            
            # Composite the gradient onto the base image
            img = Image.alpha_composite(img, gradient)
            
        elif pattern_type == 'stripes':
            # Create colorful stripes
            stripe_width = random.randint(20, 40)
            angle = random.choice([0, 45, 90, 135])
            
            # Create a new image for the stripes
            stripes = Image.new('RGBA', (width * 2, height * 2), (0, 0, 0, 0))
            stripes_draw = ImageDraw.Draw(stripes)
            
            # Create stripe pattern
            colors = [(255, 255, 255, 60), (255, 220, 100, 60), (150, 220, 255, 60), (255, 150, 150, 60)]
            
            # Draw stripes on a larger canvas then rotate
            max_dim = max(width, height) * 2
            stripes = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
            stripes_draw = ImageDraw.Draw(stripes)
            
            for i in range(-max_dim, max_dim, stripe_width):
                color = colors[i // stripe_width % len(colors)]
                stripes_draw.rectangle([i, -max_dim, i + stripe_width//2, max_dim*2], fill=color)
            
            # Rotate the stripes
            stripes = stripes.rotate(angle, expand=True)
            
            # Center and crop to original size
            stripes_w, stripes_h = stripes.size
            left = (stripes_w - width) // 2
            top = (stripes_h - height) // 2
            stripes = stripes.crop((left, top, left + width, top + height))
            
            # Composite the stripes onto the base image
            img = Image.alpha_composite(img, stripes)
        
        # Enhance the background image
        img = ImageEnhance.Brightness(img.convert('RGB')).enhance(1.1)
        img = ImageEnhance.Contrast(img.convert('RGB')).enhance(1.05)
        
        return img
    
    def _draw_star(self, draw, x, y, size, color):
        """Helper method to draw a star shape"""
        # Calculate the points of a 5-pointed star
        points = []
        outer_radius = size
        inner_radius = size // 2
        
        for i in range(10):
            # Alternate between outer and inner radius
            radius = outer_radius if i % 2 == 0 else inner_radius
            angle = math.pi * i / 5
            
            # Calculate point coordinates
            point_x = x + radius * math.sin(angle)
            point_y = y - radius * math.cos(angle)
            
            points.append((point_x, point_y))
        
        # Draw the star
        draw.polygon(points, fill=color)
    
    def _add_animal_to_image(self, base_img, animal_path, position='center', scale=0.7):
        """Add an animal image to the base image"""
        try:
            animal = Image.open(animal_path)
            
            # Calculate dimensions to maintain aspect ratio
            w, h = animal.size
            max_dim = min(base_img.width, base_img.height) * scale
            scale_factor = min(max_dim / w, max_dim / h)
            new_size = (int(w * scale_factor), int(h * scale_factor))
            
            # Resize animal image
            animal = animal.resize(new_size, Image.LANCZOS)
            
            # Calculate position
            if position == 'center':
                pos_x = (base_img.width - animal.width) // 2
                pos_y = (base_img.height - animal.height) // 2
            elif position == 'left':
                pos_x = base_img.width // 5 - animal.width // 2
                pos_y = (base_img.height - animal.height) // 2
            elif position == 'right':
                pos_x = base_img.width * 4 // 5 - animal.width // 2
                pos_y = (base_img.height - animal.height) // 2
            elif position == 'top':
                pos_x = (base_img.width - animal.width) // 2
                pos_y = base_img.height // 5 - animal.height // 2
            elif position == 'bottom':
                pos_x = (base_img.width - animal.width) // 2
                pos_y = base_img.height * 4 // 5 - animal.height // 2
            
            # Create a new image for transparent paste
            if animal.mode == 'RGBA':
                # Create a mask
                r, g, b, a = animal.split()
                base_img.paste(animal, (pos_x, pos_y), mask=a)
            else:
                # Just paste the image
                base_img.paste(animal, (pos_x, pos_y))
                
            return base_img
        except Exception as e:
            print(f"Error adding animal image: {e}")
            return base_img    def _add_text_to_image(self, img, text, position='bottom', font_size=FONT_SIZE_PAGE):
        """Add text to the image with enhanced design"""
        try:
            # Create a draw object
            draw = ImageDraw.Draw(img)
            
            # Try to load a font, use default if not available
            try:
                # Try to load a more kid-friendly font first if available
                font = ImageFont.truetype("Comic Sans MS.ttf", font_size)
            except IOError:
                try:
                    font = ImageFont.truetype("arial.ttf", font_size)
                except IOError:
                    try:
                        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
                    except IOError:
                        font = ImageFont.load_default()
            
            # Break text into multiple lines if it's too long
            max_width = img.width * 0.8  # Use 80% of image width
            lines = []
            
            if not text:
                return img
                
            words = text.split()
            if not words:
                return img
                
            current_line = words[0]
            
            for word in words[1:]:
                test_line = current_line + " " + word
                # Check if adding this word exceeds the max width
                test_width = draw.textbbox((0, 0), test_line, font=font)[2]
                if test_width <= max_width:
                    current_line = test_line
                else:
                    lines.append(current_line)
                    current_line = word
            lines.append(current_line)  # Add the last line
            
            # Calculate total text height with line spacing
            line_spacing = font_size * 0.3
            total_text_height = 0
            line_heights = []
            
            for line in lines:
                line_bbox = draw.textbbox((0, 0), line, font=font)
                line_width, line_height = line_bbox[2], line_bbox[3]
                line_heights.append(line_height)
                total_text_height += line_height + line_spacing
            
            # Adjust total height (remove extra line spacing from last line)
            if line_heights:
                total_text_height -= line_spacing
            
            # Determine position with improved vertical spacing
            if position == 'bottom':
                text_x = (img.width - max_width) // 2
                text_y = img.height - total_text_height - 80  # More padding at bottom
            elif position == 'top':
                text_x = (img.width - max_width) // 2
                text_y = 40  # More padding at top
            elif position == 'center':
                text_x = (img.width - max_width) // 2
                text_y = (img.height - total_text_height) // 2
            
            # Draw a more attractive text background with rounded corners
            padding = 25
            margin = 10  # Margin from edges
            
            # Create a new RGBA image for the text background with same size as original
            overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
            overlay_draw = ImageDraw.Draw(overlay)
            
            # Calculate text box boundaries
            left = max(text_x - padding, margin)
            top = max(text_y - padding, margin)
            right = min(text_x + max_width + padding, img.width - margin)
            bottom = min(text_y + total_text_height + padding, img.height - margin)
            
            # Draw rounded rectangle with border
            rectangle_radius = 20
            border_width = 2
            
            # Draw white background with rounded corners and slight transparency
            overlay_draw.rounded_rectangle(
                (left, top, right, bottom), 
                radius=rectangle_radius,
                fill=(255, 255, 255, 220)  # White with 86% opacity
            )
            
            # Draw colored border around the text box
            border_color = (0, 153, 204, 255)  # Light blue border
            overlay_draw.rounded_rectangle(
                (left, top, right, bottom),
                radius=rectangle_radius,
                fill=None,
                outline=border_color,
                width=border_width
            )
            
            # Composite the overlay with the original image
            img = Image.alpha_composite(img.convert('RGBA'), overlay)
            draw = ImageDraw.Draw(img)
            
            # Draw each line of text
            y_offset = text_y
            text_color = (0, 0, 0, 255)  # Black text
            
            for i, line in enumerate(lines):
                line_width = draw.textbbox((0, 0), line, font=font)[2]
                # Center each line within the text box
                x_position = text_x + (max_width - line_width) // 2
                draw.text((x_position, y_offset), line, fill=text_color, font=font)
                y_offset += line_heights[i] + line_spacing
            
            return img.convert('RGB')  # Convert back to RGB for saving
        except Exception as e:
            print(f"Error adding text: {e}")
            return img
      def create_cover_image(self, story_id, title):
        """Create a cover image for a story"""
        output_path = os.path.join(self.stories_dir, f"{story_id}-cover.png")
        
        # Skip if file exists
        if os.path.exists(output_path):
            print(f"Cover image for '{story_id}' already exists. Skipping.")
            return output_path
        
        # Create background
        img = self._create_background(COVER_WIDTH, COVER_HEIGHT)
        
        # First create a layout that separates the title area from the animal area
        # Use top 30% for title, bottom 70% for animal
        title_height = int(COVER_HEIGHT * 0.25)  # Title gets 25% of height
        animal_y_start = title_height
        animal_height = COVER_HEIGHT - title_height
        
        # Add title at the top with clear separation
        img = self._add_text_to_image(img, title, position='top', font_size=FONT_SIZE_TITLE)
        
        # Add animal in the bottom part
        theme_keywords = STORY_THEMES.get(story_id, ['animal'])
        animal_img_path = self._find_matching_animal(theme_keywords[0])
        
        try:
            # Open animal image
            animal = Image.open(animal_img_path)
            
            # Calculate dimensions to maintain aspect ratio and keep in bottom section
            w, h = animal.size
            max_dim = min(COVER_WIDTH, animal_height) * 0.8
            scale_factor = min(max_dim / w, max_dim / h)
            new_size = (int(w * scale_factor), int(h * scale_factor))
            
            # Resize animal image
            animal = animal.resize(new_size, Image.LANCZOS)
            
            # Place in the center of the bottom section
            pos_x = (COVER_WIDTH - animal.width) // 2
            pos_y = title_height + (animal_height - animal.height) // 2
            
            # Paste with transparency if available
            if animal.mode == 'RGBA':
                r, g, b, a = animal.split()
                img.paste(animal, (pos_x, pos_y), mask=a)
            else:
                img.paste(animal, (pos_x, pos_y))
        except Exception as e:
            print(f"Error adding animal image to cover: {e}")
        
        # Save the image
        img.save(output_path)
        print(f"Created cover image: {output_path}")
        return output_path
      def create_page_image(self, story_id, page_num, page_text=""):
        """Create an image for a story page"""
        output_path = os.path.join(self.stories_dir, f"{story_id}-{page_num}.png")
        
        # Skip if file exists
        if os.path.exists(output_path):
            print(f"Page image '{story_id}-{page_num}' already exists. Skipping.")
            return output_path
        
        # Create background
        img = self._create_background(PAGE_WIDTH, PAGE_HEIGHT)
        
        # Split the image into zones to prevent overlapping
        text_position = 'bottom' if page_num % 2 == 0 else 'top'  # Alternate between top and bottom
        
        # Define the image layout - text gets 35% of height, animal gets 65%
        text_height = int(PAGE_HEIGHT * 0.35)
        animal_height = PAGE_HEIGHT - text_height
        
        # Calculate animal position based on text position
        animal_y = 0 if text_position == 'bottom' else text_height
        
        # Add animal related to story theme
        theme_keywords = STORY_THEMES.get(story_id, ['animal'])
        # Use different animals for different pages
        keyword_index = page_num % len(theme_keywords)
        animal_img_path = self._find_matching_animal(theme_keywords[keyword_index])
        
        try:
            # Open animal image
            animal = Image.open(animal_img_path)
            
            # Calculate dimensions to maintain aspect ratio
            w, h = animal.size
            max_dim = min(PAGE_WIDTH, animal_height) * 0.75
            scale_factor = min(max_dim / w, max_dim / h)
            new_size = (int(w * scale_factor), int(h * scale_factor))
            
            # Resize animal image
            animal = animal.resize(new_size, Image.LANCZOS)
            
            # Position in the animal zone (either top or bottom zone)
            pos_x = random.randint(50, PAGE_WIDTH - animal.width - 50)  # Random horizontal position with margins
            
            if text_position == 'bottom':
                # Animal in top zone
                pos_y = animal_y + (animal_height - animal.height) // 2
            else:
                # Animal in bottom zone
                pos_y = animal_y + (animal_height - animal.height) // 2
            
            # Paste with transparency if available
            if animal.mode == 'RGBA':
                r, g, b, a = animal.split()
                img.paste(animal, (pos_x, pos_y), mask=a)
            else:
                img.paste(animal, (pos_x, pos_y))
        except Exception as e:
            print(f"Error adding animal image to page: {e}")
        
        # Add text in the appropriate zone
        if page_text:
            # Use more of the text, but still keep it reasonable
            max_length = 120
            short_text = page_text[:max_length] + ('...' if len(page_text) > max_length else '')
            img = self._add_text_to_image(img, short_text, position=text_position)
        
        # Save the image
        img.save(output_path)
        print(f"Created page image: {output_path}")
        return output_path
    
    def extract_story_data(self):
        """Extract story data from storyService.ts file"""
        try:
            with open(self.story_data_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # This is a very simplified parser for the TypeScript file
            # A more robust solution would use a proper TS parser
            stories = []
            current_story = None
            
            for line in content.split('\n'):
                line = line.strip()
                
                # Start of a story
                if line.startswith('id:'):
                    if current_story:
                        stories.append(current_story)
                    current_story = {'pages': []}
                    current_story['id'] = line.split("'")[1]
                
                # Story title
                elif line.startswith('title:') and current_story:
                    current_story['title'] = line.split("'")[1]
                
                # Page text
                elif line.startswith('text:') and current_story:
                    text = line.split("'")[1]
                    if len(text) < 3:  # Handle multi-line text
                        text = line.split('`')[1] if '`' in line else ''
                    current_story['pages'].append({'text': text})
            
            # Add the last story
            if current_story:
                stories.append(current_story)
                
            return stories
        except Exception as e:
            print(f"Error extracting story data: {e}")
            return []
    
    def generate_all_illustrations(self):
        """Generate illustrations for all stories"""
        stories = self.extract_story_data()
        
        for story in stories:
            # Generate cover image
            self.create_cover_image(story['id'], story['title'])
            
            # Generate page images
            for i, page in enumerate(story['pages'], 1):
                self.create_page_image(story['id'], i, page.get('text', ''))

if __name__ == "__main__":
    # Get the workspace root directory
    if len(sys.argv) > 1:
        root_dir = sys.argv[1]
    else:
        # Assume script is in the tools directory
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    generator = StoryIllustrationGenerator(root_dir)
    generator.generate_all_illustrations()
    print("Illustration generation complete!")
