# Story Illustration Generator

This tool automatically creates illustrations for the stories in the kids-learn app.

## Features

- Generates cover images for all stories
- Creates page illustrations for each story page
- Uses existing animal images from the app
- Adds colorful backgrounds and text overlays
- Matches illustrations to story themes

## Usage

Run the script from the project root directory:

```bash
python tools/generate_story_illustrations.py
```

## How It Works

1. The script extracts story data from `storyService.ts`
2. For each story, it creates a cover image with the story title
3. For each page in the story, it creates an illustration based on story themes
4. Images are saved to `public/images/stories/` directory

## Customization

You can customize the illustrations by modifying the `STORY_THEMES` dictionary in the script. Each story can have multiple theme keywords that are used to select appropriate animal images.

## Adding New Stories

When you add new stories to `storyService.ts`, simply run this script again to generate illustrations for the new stories. Existing illustrations won't be overwritten.

## Requirements

- Python 3
- PIL (Pillow) library: `pip install Pillow`
