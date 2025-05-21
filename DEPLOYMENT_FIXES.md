# GitHub Pages Deployment Fixes

This document outlines the fixes implemented to address image loading issues when deploying the Kids Learn app to GitHub Pages.

## Problem Summary

When deploying to GitHub Pages, animal images were failing to load with 404 errors, while story images worked correctly. This was due to inconsistent path handling between local development and GitHub Pages deployment.

## Path Normalization Fix (May 20, 2025)

A path inconsistency was found where some image paths were missing the '/images' prefix:
- Incorrect path: `/animals/ant.png`
- Correct path: `/images/animals/ant.png`

Fixed by adding path normalization in the AnimalCard component:

```typescript
// Ensure path always has /images prefix
const normalizedImagePath = image.startsWith('/images/') 
  ? image 
  : image.startsWith('/') 
    ? `/images${image}` 
    : `/images/${image}`;
```

## Environment-Specific Path Fix (May 20, 2025)

A second issue was discovered where the app was incorrectly applying the GitHub Pages base URL (`/kids-learn`) when running on localhost:

- Incorrect localhost path: `http://localhost:3000/kids-learn/images/animals/ant.png`
- Correct localhost path: `http://localhost:3000/images/animals/ant.png`

Fixed by updating the `getFullImagePath` function to detect localhost environments:

```typescript
export const getFullImagePath = (src: string): string => {
  if (src && src.startsWith('/')) {
    // Check if we're running on localhost
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    // For localhost, don't add the baseUrl prefix
    if (isLocalhost) {
      return src;
    }
    
    // For GitHub Pages deployment
    const baseUrl = process.env.PUBLIC_URL || 'https://pqbgiang.github.io/kids-learn';
    return `${baseUrl}${src}`;
  }
  return src;
}
```

Similar changes were made to the error handler in AnimalCard.tsx to ensure placeholders also use environment-specific paths.

## Fixes Implemented

### 1. Image Path Handling

- **Added `getFullImagePath` helper function** in `imageLoader.ts`:
  ```typescript
  export const getFullImagePath = (src: string): string => {
    if (src && src.startsWith('/')) {
      const baseUrl = process.env.PUBLIC_URL || 'https://pqbgiang.github.io/kids-learn';
      return `${baseUrl}${src}`;
    }
    return src;
  };
  ```

- **Updated `AnimalCard` component** to use consistent GitHub Pages URL patterns:
  - Now using `getFullImagePath` for all image sources
  - Added direct fallback to placeholder for error handling

- **Enhanced `preloadImagesForLetter` function** to use correct GitHub Pages paths:
  ```typescript
  export const preloadImagesForLetter = async (letter: string): Promise<void> => {
    const images = animalImages[letter.toUpperCase()] || [];
    const baseUrl = process.env.PUBLIC_URL || 'https://pqbgiang.github.io/kids-learn';
    
    // Load images with proper paths
    await Promise.allSettled(images.map(animal => {
      const imagePath = animal.fileName.startsWith('/') ? 
        `${baseUrl}${animal.fileName}` : animal.fileName;
      return preloadImage(imagePath);
    }));
  };
  ```

### 2. Improved Local Testing

- **Enhanced testing scripts** with PowerShell, Bash, and Node.js options:
  - Added multi-port support to handle port conflicts
  - Created Node.js custom server (`tools/server.js`) as a reliable alternative

- **Created image verification script** that checks:
  - If all referenced images exist in the project
  - If paths are formatted correctly for GitHub Pages
  - If placeholder images are in place for fallback

### 3. Error Handling

- **Added robust fallback mechanism** for image loading failures:
  - Images now properly fall back to placeholder images
  - Added warning logging for image loading failures
  - Ensured placeholder images are created during build

## Testing Your Deployment

### Local Testing

To test your deployment locally:

```bash
npm run build:local
```

This will:
1. Create placeholder images for fallback scenarios
2. Verify all animal images exist and have correct paths
3. Build the app with production settings
4. Start a local server for testing

### Verifying Image Paths

Run the verification tool to check all image paths:

```bash
npm run verify-images
```

This will alert you to any issues with image paths or missing images.

### GitHub Pages Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

After deployment, verify that all images load correctly at:
https://pqbgiang.github.io/kids-learn

## Common Issues

### Case Sensitivity

GitHub Pages is case-sensitive. Ensure all file references match the exact case of the actual files:

- Correct: `/images/animals/elephant.png`
- Wrong: `/images/animals/Elephant.png` (if file is named `elephant.png`)

### Path Format

Always use relative paths from the root of your project:

- Correct: `/images/animals/cat.png` (with `getFullImagePath` handling)
- Wrong: `images/animals/cat.png` (missing leading slash)

### Missing Placeholder Images

Ensure placeholder images exist for fallback:

- `/images/animals/placeholder.png`
- `/images/stories/placeholder.png`

Run `npm run create-placeholder` to create them if missing.
