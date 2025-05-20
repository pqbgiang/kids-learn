// Utility for optimizing image loading
import { animalImages } from '../resources/imageMapping';

// Cache for preloaded images
const imageCache: Record<string, HTMLImageElement> = {};
const IMAGE_CACHE_KEY = 'kids-learn-image-cache';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const DISABLE_CACHE = false; // Image caching is now re-enabled

// Initialize cache from localStorage if available
const initializeCache = () => {
  // If caching is disabled, clear localStorage cache and return
  if (DISABLE_CACHE) {
    try {
      localStorage.removeItem(IMAGE_CACHE_KEY);
    } catch (error) {
      console.warn('Error clearing image cache:', error);
    }
    return;
  }
  
  try {
    const cacheData = localStorage.getItem(IMAGE_CACHE_KEY);
    if (cacheData) {
      const { urls, timestamp } = JSON.parse(cacheData);
      
      // Check if cache is still valid (not older than MAX_CACHE_AGE)
      if (timestamp && Date.now() - timestamp < MAX_CACHE_AGE && Array.isArray(urls)) {
        // Mark these URLs as "cached" - we don't actually store the image data
        // but we'll know they've been loaded before
        urls.forEach(url => {
          const img = new Image();
          img.src = url;
          imageCache[url] = img;
        });
      } else {
        // Cache expired, clear it
        localStorage.removeItem(IMAGE_CACHE_KEY);
      }
    }
  } catch (error) {
    console.warn('Error initializing image cache:', error);
  }
};

// Save cache to localStorage
const updateCachedUrls = () => {
  // Skip saving if cache is disabled
  if (DISABLE_CACHE) {
    return;
  }
  
  try {
    const urls = Object.keys(imageCache);
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify({
      urls,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Error saving image cache:', error);
  }
};

/**
 * Preloads an image and stores it in cache
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Always load the image directly, ignoring cache completely
    const img = new Image();
    
    // Correctly process the image path - use a standardized approach
    let processedSrc = src;
    
    // Handle cases where the image path format is inconsistent
    // Step 1: Make sure path has /images/ prefix if needed
    if (processedSrc.includes('/animals/') && !processedSrc.includes('/images/')) {
      processedSrc = processedSrc.replace('/animals/', '/images/animals/');
    }
    
    // Step 2: Standardize GitHub Pages URL handling
    // Get the PUBLIC_URL from environment or default
    const publicUrl = process.env.PUBLIC_URL || '';
    
    // Only add the public URL if it's not empty and the path doesn't already include it
    if (publicUrl && processedSrc.startsWith('/') && !processedSrc.startsWith(publicUrl)) {
      processedSrc = `${publicUrl}${processedSrc}`;
    }
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = (err) => {
      // Only keep error logging for actual failures
      console.error(`Failed to load image: ${processedSrc}`);
      
      // Try fallbacks in sequence
      
      // Fallback 1: Try using just the filename with standardized path
      const filename = processedSrc.split('/').pop();
      let fallbackPath = `${publicUrl}/images/animals/${filename}`;
      
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        resolve(fallbackImg);
      };
      
      fallbackImg.onerror = () => {
        // Fallback 2: Try without PUBLIC_URL
        if (publicUrl) {
          fallbackPath = `/images/animals/${filename}`;
          
          fallbackImg.onload = () => {
            resolve(fallbackImg);
          };
          
          fallbackImg.onerror = () => {
            console.error(`All fallbacks failed for image: ${src}`);
            reject(err);
          };
          
          fallbackImg.src = fallbackPath;
        } else {
          console.error(`All fallbacks failed for image: ${src}`);
          reject(err);
        }
      };
      
      fallbackImg.src = fallbackPath;
    };
    
    // Set the image source to the processed path
    img.src = processedSrc;
  });
};

/**
 * Preload images for specific letter
 * @param letter Letter to preload images for
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImagesForLetter = async (letter: string): Promise<void> => {
  const images = animalImages[letter.toUpperCase()] || [];
  
  // Load images in parallel
  await Promise.allSettled(images.map(animal => preloadImage(animal.fileName)));
};

/**
 * Preload images for current and next letters
 * @param currentLetterIndex Current letter index
 * @param alphabet Array of all letters
 */
export const preloadAdjacentLetterImages = (currentLetterIndex: number, alphabet: string[]): void => {
  const currentLetter = alphabet[currentLetterIndex];
  // Load current letter immediately
  preloadImagesForLetter(currentLetter);
  
  // Preload next letter if available
  if (currentLetterIndex < alphabet.length - 1) {
    const nextLetter = alphabet[currentLetterIndex + 1];
    preloadImagesForLetter(nextLetter);
  }
  
  // Preload previous letter if available
  if (currentLetterIndex > 0) {
    const prevLetter = alphabet[currentLetterIndex - 1];
    preloadImagesForLetter(prevLetter);
  }
};

/**
 * Get full path to an image including any necessary URL prefixes
 * @param src Original image path
 * @returns Full image URL including any necessary path prefixes
 */
export const getFullImagePath = (src: string): string => {
  // Create a copy of the source so we don't modify the input directly
  let processedSrc = src;

  // Step 1: Fix paths that are missing the /images/ prefix
  if (processedSrc.startsWith('/animals/')) {
    processedSrc = `/images${processedSrc}`;
  } else if (!processedSrc.includes('/images/') && processedSrc.includes('/animals/')) {
    // If it already starts with a slash
    if (processedSrc.startsWith('/')) {
      processedSrc = `/images${processedSrc}`;
    } else {
      processedSrc = `/images/${processedSrc}`;
    }
  }

  // Step 2: Get the public URL from environment or empty string
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Step 3: Add PUBLIC_URL prefix for GitHub Pages if needed
  if (publicUrl && processedSrc.startsWith('/') && !processedSrc.startsWith(publicUrl)) {
    processedSrc = `${publicUrl}${processedSrc}`;
  }
  
  // Step 4: Ensure path starts with a slash if needed
  if (!processedSrc.startsWith('/') && !processedSrc.startsWith('http')) {
    processedSrc = `/${processedSrc}`;
  }
  
  return processedSrc;
};

/**
 * Get image URL with performance optimizations
 * @param src Original source URL
 * @param width Desired width
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (src: string, width: number = 300): string => {
  // Process the path directly
  let processedSrc = src;
  
  // Step 1: Make sure path has /images/ prefix if needed
  if (processedSrc.includes('/animals/') && !processedSrc.includes('/images/')) {
    processedSrc = processedSrc.replace('/animals/', '/images/animals/');
  }
  
  // Step 2: Get the PUBLIC_URL from environment or use empty string (for development)
  // Don't use hardcoded paths here
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Step 3: Add PUBLIC_URL prefix for GitHub Pages if needed (only if publicUrl is not empty)
  if (publicUrl && processedSrc.startsWith('/') && !processedSrc.startsWith(publicUrl)) {
    processedSrc = `${publicUrl}${processedSrc}`;
  }
  
  // Step 4: Ensure path starts with a slash if needed
  if (!processedSrc.startsWith('/') && !processedSrc.startsWith('http')) {
    processedSrc = `/${processedSrc}`;
  }
  
  // Future: Add WebP support and other optimizations when needed
  
  return processedSrc;
};

/**
 * Check if an image exists in the cache
 * @param src Image source URL
 * @returns boolean indicating if the image is cached
 */
export const isImageCached = (src: string): boolean => {
  // If caching is disabled, always return false
  if (DISABLE_CACHE) {
    return false;
  }
  return !!imageCache[src];
};
