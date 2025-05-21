import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { textToSpeechService } from '../../services/tts/textToSpeechService';
import { preloadImage, getOptimizedImageUrl, isImageCached } from '../../utils/imageLoader';

interface AnimalCardProps {
  name: string;
  image: string;
  onClick?: () => void;
  speakOnClick?: boolean;
}

const Card = styled(motion.div)<{ $highContrast: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1vh, 12px);
  padding: clamp(12px, 2vh, 16px);
  background: ${props => props.$highContrast ? colors.highContrast.surface : 'white'};
  border-radius: 12px;
  box-shadow: ${props => props.$highContrast ? 'none' : '0 8px 16px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.$highContrast ? '2px solid white' : 'none'};
  cursor: pointer;
  aspect-ratio: 1;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  &:hover {
    box-shadow: ${props => props.$highContrast ? 'none' : '0 12px 24px rgba(0, 0, 0, 0.15)'};
  }

  &:focus {
    outline: ${props => props.$highContrast ? '2px solid white' : '2px solid #2196F3'};
    outline-offset: 4px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const AnimalImage = styled(motion.img)<{ $highContrast: boolean }>`
  width: 100%;
  height: auto;
  max-height: 75%;
  object-fit: contain;
  filter: ${props => props.$highContrast ? 'grayscale(1) invert(1) contrast(1000%)' : 'none'};
  transition: transform 0.3s ease;
`;

const AnimalName = styled(motion.h3)<{ $highContrast: boolean }>`
  margin: 0;
  font-size: clamp(1rem, 2vh, 1.2rem);
  color: ${props => props.$highContrast ? colors.highContrast.text : colors.normal.text};
  text-align: center;
  transition: color 0.3s ease;
`;

export const AnimalCard: React.FC<AnimalCardProps> = ({
  name,
  image,
  onClick,
  speakOnClick = true // Default to true for backward compatibility
}) => {
  const { highContrast } = useTheme();  // Use the getOptimizedImageUrl function from imageLoader utility directly
  // instead of reimplementing the same logic here
  const normalizeImagePath = (path: string): string => {
    // Use the standardized getOptimizedImageUrl function
    return getOptimizedImageUrl(path);
  };
  
  const normalizedImagePath = normalizeImagePath(image);
  
  // Always start with isLoaded=false to force image loading
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(normalizedImagePath);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Use Intersection Observer for better lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        // Once detected as visible, no need to observe anymore
        if (cardRef.current) {
          observer.unobserve(cardRef.current);
        }
      }
    }, { 
      threshold: 0.1, // Start loading when 10% of the element is visible
      rootMargin: '100px' // Start loading when element is 100px from viewport
    });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);  // Load the image only when it becomes visible
  useEffect(() => {
    // Only load when the image is visible
    if (!isVisible) {
      return;
    }
    
    // Always try to load the image using our improved preloadImage function
    // which already includes fallback mechanisms
    preloadImage(normalizedImagePath)
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        // Try one more specific fallback approach using the normalized animal name
        // This addresses cases where the filename doesn't match the expected pattern
        const animalName = name.toLowerCase().replace(/\s+/g, '-');
        
        // Get the PUBLIC_URL from environment variable or use empty string for local development
        const publicUrl = process.env.PUBLIC_URL || '';
        const fallbackPath = `${publicUrl}/images/animals/${animalName}.png`;
        
        preloadImage(fallbackPath)
          .then(() => {
            setImageSrc(fallbackPath);
            setIsLoaded(true);
          })
          .catch(() => {
            console.error(`Failed to load image for ${name}`);
            setError(true);
          });
      });
  }, [normalizedImagePath, isVisible, name]);
  const handleClick = async () => {
    if (speakOnClick) {
      try {
        await textToSpeechService.speak(name);
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
    onClick?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };  const handleImageError = () => {
    // Mark the error state but don't immediately give up
    setImageError(true);
    
    // Try a sequence of fallback strategies in order of likelihood to succeed
    
    // 1. Try with animal name as filename (most reliable)
    const animalName = name.toLowerCase().replace(/\s+/g, '-');
    const publicUrl = process.env.PUBLIC_URL || '';
    const filenameFallback = `${publicUrl}/images/animals/${animalName}.png`;
    
    if (imageSrc !== filenameFallback) {
      setImageSrc(filenameFallback);
      return;
    }
    
    // 2. If we end up with .jfif extension, try .png instead
    if (imageSrc.endsWith('.jfif')) {
      const newPath = imageSrc.replace('.jfif', '.png');
      setImageSrc(newPath);
      return;
    }
    
    // 3. Try with correct PUBLIC_URL prefix
    if (publicUrl && !imageSrc.includes(publicUrl)) {
      // Ensure the path starts with a slash before adding publicUrl
      const normalizedSrcPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
      const newPath = `${publicUrl}${normalizedSrcPath}`;
      setImageSrc(newPath);
      return;
    }
    
    // If we've exhausted all fallbacks, mark as error
    setError(true);
  };
  return (
    <Card
      ref={cardRef}
      whileHover={{ 
        scale: 1.05,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
      onClick={handleClick}
      onKeyPress={handleKeyPress}      $highContrast={highContrast}
      tabIndex={0}
      role="button"
      aria-label={`${name} - Click to hear pronunciation`}
    >{!isLoaded && !error && (
        <div style={{ 
          width: '100%', 
          height: '75%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: highContrast ? colors.highContrast.text : '#ccc'
        }}>
          Loading...
        </div>
      )}      {(isLoaded || error) && (
        <>          {error ? (
            <div style={{
              width: '100%',
              height: '75%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: highContrast ? colors.highContrast.text : '#2196F3'
            }}>
              {name.charAt(0).toUpperCase()} {/* Display first letter as placeholder */}
            </div>          ) : (            <AnimalImage              
              src={imageSrc}
              // Use the same optimized image path for consistency
              alt={name}              loading="lazy"
              decoding="async"
              onError={handleImageError}
              style={{ display: isLoaded ? 'block' : 'none' }}
              $highContrast={highContrast}
              animate={{ scale: 1 }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            />
          )}
        </>
      )}      <AnimalName 
        $highContrast={highContrast}
        whileHover={{ 
          scale: 1.05,
          color: colors.normal.primary
        }}
      >
        {name}
      </AnimalName>
    </Card>
  );
};