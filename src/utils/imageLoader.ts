// Utility for optimizing image loading
import { animalImages } from '../resources/imageMapping';

// Cache for preloaded images
const imageCache: Record<string, HTMLImageElement> = {};
const IMAGE_CACHE_KEY = 'kids-learn-image-cache';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Initialize cache from localStorage if available
const initializeCache = () => {
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
        console.log(`Restored ${urls.length} cached image URLs`);
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

// Initialize cache when this module loads
initializeCache();

/**
 * Preloads an image and stores it in cache
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // If already cached, return immediately
    if (imageCache[src]) {
      resolve(imageCache[src]);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      // Update localStorage cache
      updateCachedUrls();
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    
    // Start loading the image
    img.src = src;
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
 * Get image URL with performance optimizations
 * @param src Original source URL
 * @param width Desired width
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (src: string, width: number = 300): string => {
  // Prefer WebP format if available (to be implemented)
  // For local files, we'd check if a WebP version exists
  
  // WebP fallback logic - if we have WebP images
  // This checks if we're in a browser that supports WebP
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      // Firefox, Chrome, Opera, Safari 9+
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };
  
  // If we support WebP, try to use it for better performance
  if (supportsWebP() && src.match(/\.(png|jpe?g|jfif)$/i)) {
    // Check if WebP version might exist (for external hosted images or our own)
    const webpVersion = src.replace(/\.(png|jpe?g|jfif)$/i, '.webp');
    // We would need to check if the WebP file exists
    // For now, we'll just return the original since we haven't created WebP versions yet
  }
  
  // For demonstration purposes, this is how you would integrate with an 
  // image CDN like Cloudinary, Imgix, etc. for responsive images
  if (src.includes('cloudinary.com')) {
    // Example: Transform Cloudinary URLs to request optimized versions
    return src.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  
  // For now, just return the original source
  return src;
};

/**
 * Check if an image exists in the cache
 * @param src Image source URL
 * @returns boolean indicating if the image is cached
 */
export const isImageCached = (src: string): boolean => {
  return !!imageCache[src];
};
