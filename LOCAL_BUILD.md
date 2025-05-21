# Running the App Locally

This document explains how to build and run your React app locally to test the GitHub Pages deployment.

## Why Test Locally?

Testing your build locally is important because:

1. You can verify that all assets (images, sounds, etc.) are properly loaded with correct paths
2. You can check that client-side routing works correctly
3. You can ensure that the app behaves the same way as it would on GitHub Pages
4. It saves time by allowing you to catch issues before deploying

## Prerequisites

Before running the local build, make sure you have one of the following:

- Node.js with npm (required)
- One of these HTTP servers:
  - `serve` package (recommended): `npm install -g serve`
  - `http-server` package: `npm install -g http-server`
  - Python 3 (which includes a built-in HTTP server)

## Building and Running Locally

### Option 1: Using the npm script (Recommended)

We've added a script that handles the entire build and serving process:

```bash
npm run build:local
```

This will:
1. Create placeholder images for fallback scenarios
2. Verify all animal images referenced in the code actually exist
3. Create a build of your app with optimized assets
4. Start a local server (it will try ports 5000, 3000, 8080, or 9000)
5. Configure the server to handle SPA client-side routing

### Alternative Server Options

If the default server doesn't work, we've provided several alternatives:

```bash
# Using the Node.js custom server (recommended if other options fail)
npm run build:local:node

# Using bash script (for Linux/Mac/Git Bash)
npm run serve-local:bash

# Specify a different port with the Node.js server
npm run serve-node:3000  # Use port 3000
npm run serve-node:8080  # Use port 8080
```

If you prefer to run the steps separately:

```bash
# Create placeholder images
npm run create-placeholder

# Verify all animal images exist
npm run verify-images

# Build the app
npm run build

# Choose one of the server options:
npm run serve-local      # PowerShell server 
npm run serve-node       # Node.js server (port 5000)
npm run serve-node:3000  # Node.js server (port 3000)
```

### Option 2: Manual Process

If you prefer to run the commands manually:

```bash
# First, build the app
npm run build

# Then, serve the build directory using one of these options:
npx serve build -s -l 5000
# OR
npx http-server build -p 5000 -a localhost
# OR
cd build; python -m http.server 5000
```

## Common Issues and Troubleshooting

### Images Not Loading

If images don't load, check the browser console for errors:

1. **404 Not Found errors**: This means the path is incorrect. Make sure your paths are correctly prefixed with the base URL.
2. **CORS errors**: These shouldn't happen with local files, but if they do, make sure your server is correctly configured.

The app is designed to handle image loading failures:
- For animal images: It will first try to load from GitHub Pages URL, then fall back to a placeholder.
- For story illustrations: It will directly fall back to a placeholder image.

You can check if placeholder images exist in these locations:
- `public/images/animals/placeholder.png`
- `public/images/stories/placeholder.png`

If they don't exist, run `npm run create-placeholder` to create them.

### Port Issues

If you see "localhost:5000 does not work" or similar errors:

1. **Port already in use**: Try a different port with `npm run serve-node:3000` or `npm run serve-node:8080`
2. **Firewall blocking**: Make sure your firewall allows connections to the port
3. **Process conflicts**: Check if another application is using the same port
   - On Windows: `netstat -ano | findstr :5000`
   - On Mac/Linux: `lsof -i :5000`

Our Node.js server automatically tries to work around port conflicts.

### Routing Issues

If navigating between pages doesn't work:

1. Make sure you're using a server that supports SPA routing (`serve` with the `-s` flag)
2. Check that the `basename` is correctly set in your Router component
3. Verify that the local server is correctly handling paths
4. Try the custom Node.js server with `npm run serve-node` which fully supports SPA routing

### Testing Multiple Browsers

For thorough testing, try your app in different browsers:

1. Chrome
2. Firefox
3. Safari (if available)
4. Edge

This will help ensure your app works consistently across different environments.

## Help and Support

If you encounter issues not covered here, please:

1. Check the browser console for specific errors
2. Look at the network tab to see which requests are failing
3. Review the relevant sections of your code that might be causing the issue
