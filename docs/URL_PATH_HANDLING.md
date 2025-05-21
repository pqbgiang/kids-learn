# URL Path Handling in Kids Learn App

## Overview

This document explains how image URLs are handled in the Kids Learn app, particularly with respect to different deployment environments (local development vs GitHub Pages).

## Base URL Configuration

The app uses React's `process.env.PUBLIC_URL` to handle base URLs correctly:

- **In development (localhost)**: `PUBLIC_URL` is empty or '/'
- **In production (GitHub Pages)**: `PUBLIC_URL` is set to '/kids-learn'

## Router Configuration

The Router component is set up with the correct basename for GitHub Pages:

```typescript
// App.tsx
<Router basename="/kids-learn">
  {/* App routes */}
</Router>
```

## Image Path Structure

All image paths should follow this pattern:

1. Start with `/images/`
2. Include category subdirectory: `/images/animals/` or `/images/stories/`
3. End with the image filename: `/images/animals/elephant.png`

## Path Handling Functions

### getFullImagePath

```typescript
export const getFullImagePath = (src: string): string => {
  if (src && src.startsWith('/')) {
    const baseUrl = process.env.PUBLIC_URL || '';
    return `${baseUrl}${src}`;
  }
  return src;
};
```

This function:
- Takes a path that starts with `/` (like `/images/animals/cat.png`)
- Prepends the appropriate base URL based on the environment

### Path Normalization in Components

Before using `getFullImagePath`, we ensure paths have the correct format:

```typescript
// In AnimalCard.tsx
const normalizedImagePath = image.startsWith('/images/') 
  ? image 
  : image.startsWith('/') 
    ? `/images${image}` 
    : `/images/${image}`;
  
const fullImagePath = getFullImagePath(normalizedImagePath);
```

This ensures that:
1. Paths without `/images/` prefix get normalized
2. The correct base URL is applied for the current environment

## Testing Path Handling

To test path handling in different environments:

1. **Development server (localhost:3000)**: Images should load from `/images/...` paths
2. **Production build (localhost:5000)**: Images should load from `/images/...` paths
3. **GitHub Pages**: Images should load from `/kids-learn/images/...` paths

## Cache Management

To prevent caching issues during development, we've implemented several features:

### Disabled Cache Option

```typescript
// imageLoader.ts
const DISABLE_CACHE = true; // Set to false for production
```

This prevents image caching during development to ensure we always get fresh images.


### Debug Helpers

- **Keyboard shortcut**: Press `Ctrl+Shift+C` to clear cache and reload
- **Debug indicator**: Shows cache status in development environment
- **Click to refresh**: The debug indicator can be clicked to clear cache and reload

## Troubleshooting

If images fail to load:

1. Check the console for error messages
2. Verify the correct path structure in `imageMapping.ts`
3. Ensure `PUBLIC_URL` is set correctly in your environment
4. Check that files exist in both the `public` and `build` directories
5. Try clearing the cache with the debug button or `Ctrl+Shift+C`
6. Verify that `basename="/kids-learn"` is set on the Router component
7. Run the path verification tool: `npm run check-paths`
