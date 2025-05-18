# Story Image Generation Guide

This guide explains how to generate custom illustrations for the stories in the kids-learn application.

## Overview

The kids-learn app includes several children's stories that need illustrations for:
1. Story cover images
2. Individual story page images

To create consistent, high-quality images, we've developed a system to:
- Generate specific prompts for each story and scene
- Track which images need to be created
- Ensure images are appropriate for each story's target age group

## Files and Tools

- `story_image_prompt_helper.py`: Python script that generates detailed prompts
- `story_image_prompts.md`: Contains image generation prompts for each story and page
- `story_images_required.md`: Checklist of images that need to be created

## How to Generate Prompts

1. Make sure you have Python installed
2. Run the prompt generator script:

```powershell
cd d:\Workspace\kids-learn
python tools\story_image_prompt_helper.py
```

This will create/update:
- `tools/story_image_prompts.md`: Detailed prompts for image generation
- `tools/story_images_required.md`: Checklist of required images

## Image Generation Guidelines

### Style Guidelines

The prompts automatically apply different styles based on:
- **Story Category**:
  - Fairy tales: Watercolor illustration style
  - Fables: Cartoon style
  - Animal stories: Cute, simple style
  - Rhymes: Claymation-like style

- **Age Appropriateness**:
  - 3+ years: Very simple, bright primary colors, ultra child-friendly
  - 4+ years: Simple but more detailed, cheerful colors
  - 5+ years: Moderate detail, balanced colors
  - 6+ years: More intricate details, varied color palette

### Image Requirements

- **File Format**: All images should be in PNG format
- **Cover Images**: 
  - Resolution: 600 x 400 pixels
  - Include space at top for title text
  - Main characters should be prominently featured

- **Page Images**: 
  - Resolution: 800 x 500 pixels
  - Include space for text at top or bottom
  - Clearly illustrate the story text
  - Characters should have friendly, appealing expressions

## Workflow for Creating Images

1. Run the prompt generator script to create updated prompt files
2. Use the prompts in `story_image_prompts.md` with:
   - AI image generation tools (DALL-E, Midjourney, Stable Diffusion)
   - Or as references for manually created illustrations
3. Save the generated images in the appropriate location:
   - Dev environment: `public/images/stories/`
   - Production: `build/images/stories/`
4. Mark off completed images in the `story_images_required.md` checklist
5. Test the images in the application

## Best Practices

1. Keep illustrations consistent within a single story
2. Ensure all content is appropriate for the target age group
3. Test the images with actual children for feedback
4. Make sure text remains readable when overlaid on images
5. Consider cultural diversity and inclusivity in illustrations

## Troubleshooting

- If the prompt generator fails to extract story data correctly, check for changes in the `storyService.ts` file format
- Ensure image files are saved with the exact filenames specified in the prompts
- Test images with different screen sizes to ensure they display correctly