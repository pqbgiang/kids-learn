import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveButton } from '../common/InteractiveButton';
import { animalImages } from '../../resources/imageMapping';
import { SoundButton } from '../common/SoundButton';
import { AnimalCard } from '../common/AnimalCard';
import { textToSpeechService } from '../../services/tts/textToSpeechService';
import { useTheme } from '../../context/ThemeContext';
import { useScreenReader } from '../../utils/screenReader';
import { preloadAdjacentLetterImages } from '../../utils/imageLoader';
import { Link } from 'react-router-dom';
import { colors } from '../../utils/theme';
import 'styled-components';

const BaseIconButton = styled(motion.button)`
  position: fixed;
  width: 50px;
  height: 50px;
  padding: 8px;
  border-radius: 4px;
  background: #2196F3; /* Blue to match home button */
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #1976D2;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// FloatingHomeButton component removed

interface ToggleButtonProps {
  isActive?: boolean;
}

const ToggleButton = styled(BaseIconButton)<ToggleButtonProps & { $highContrast?: boolean }>`
  top: 20px;
  left: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${props => props.$highContrast 
    ? colors.highContrast.surface 
    : '#2196F3'};  /* Changed to blue (#2196F3) to match home button */
  color: ${props => props.$highContrast 
    ? colors.highContrast.text 
    : colors.normal.background};
  transition: all 0.2s ease;
  opacity: ${props => props.isActive ? 0 : 1};  pointer-events: ${props => props.isActive ? 'none' : 'auto'};
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);  /* Updated shadow to match blue color */
  border: ${props => props.$highContrast ? '2px solid white' : 'none'};
  font-size: 1rem;
  font-weight: bold;
  
  &:hover {
    background: ${props => props.$highContrast 
      ? colors.highContrast.text 
      : '#1976D2'};  /* Darker blue on hover */
    color: ${props => props.$highContrast 
      ? colors.highContrast.surface 
      : colors.normal.background};
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.5);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    background: ${props => props.$highContrast 
      ? colors.highContrast.surface 
      : '#0D47A1'};  /* Even darker blue when active */
  }
`;

const getAnimalsForLetter = (letter: string | undefined) => {
  if (!letter) return [];
  return animalImages[letter.toUpperCase()] || [];
};

const Container = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 16px 0;
`;

const ContentWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0 auto;
  width: 100%;
`;

const LetterSection = styled.div`
  display: grid;
  grid-template-columns: auto minmax(300px, 1fr) auto;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  position: relative;
  margin: 0 auto;
  padding: 0 16px;
`;

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      text: string;
      surface: string;
    };
    highContrast: boolean;
  }
}

const NavigationButtonBase = styled(motion(InteractiveButton))`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: ${({ theme }) => theme.highContrast 
    ? colors.highContrast.surface 
    : '#2196F3'};  /* Changed to blue (#2196F3) to match home button */
  color: ${({ theme }) => theme.highContrast 
    ? colors.highContrast.text 
    : colors.normal.background};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);  /* Updated shadow to match blue */
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${colors.normal.textLight};
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.5);
    background: ${({ theme }) => theme.highContrast 
      ? colors.highContrast.surface 
      : '#1976D2'};  /* Darker blue on hover */
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    background: ${({ theme }) => theme.highContrast 
      ? colors.highContrast.surface 
      : '#0D47A1'};  /* Even darker blue when active */
  }
`;

const NavigationButtonLeft = styled(NavigationButtonBase)<{ isNav?: boolean }>`
  position: ${props => props.isNav ? 'relative' : 'absolute'};
  left: ${props => props.isNav ? '0' : '0'};
  top: ${props => props.isNav ? '0' : '50%'};
  transform: ${props => props.isNav ? 'none' : 'translateY(-50%)'};
  margin: ${props => props.isNav ? '8px 0' : '0'};
`;

const NavigationButtonRight = styled(NavigationButtonLeft)`
  left: auto;
  right: 0;
`;

const LetterDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0; // Reduced from 16px
  padding: 24px;
  grid-column: 2;
  position: relative;
`;

// Create a base div component with the $letterIndex prop
interface LetterProps {
  $letterIndex: number;
}

// Combine the LetterProps with motion.div props
const Letter = styled(motion.div)<LetterProps & { letterIndex?: never }>`
  font-size: clamp(160px, 18vh, 220px);
  font-weight: bold;
  color: ${props => getLetterColor(props.$letterIndex).main};
  text-align: center;
  line-height: 1;
  user-select: none;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  text-shadow: 2px 2px 0 ${props => getLetterColor(props.$letterIndex).shadow},
               4px 4px 0 ${props => getLetterColor(props.$letterIndex).main}33,
               -1px -1px 0 rgba(255, 255, 255, 0.7);
  position: relative;
  padding: 16px 16px 32px 16px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center,
      rgba(255, 87, 34, 0.1) 0%,
      rgba(255, 87, 34, 0) 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
    pointer-events: none;
  }

  &:hover {
    color: rgb(80, 67, 255);
    transform: translateY(-4px);
    text-shadow: 3px 3px 0 rgb(16, 7, 182),
                 6px 6px 0 rgba(244, 81, 30, 0.4),
                 -1px -1px 0 rgba(255, 255, 255, 0.9);

    &::before {
      opacity: 1;
    }
  }
`;

// Not needed anymore as we defined Letter directly

const SoundButtonWrapper = styled.div`
  position: relative;
  top: -40px; // Move up further to overlap with letter's space
  z-index: 2;
  margin-bottom: -30px; // Compensate for the negative top margin
`;

const AnimalContainer = styled(motion.div)`
  width: min(1200px, 100%);
  height: clamp(320px, 52vh, 520px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 90px;
  overflow: hidden;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 87, 34, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 24px;
  padding: 24px;
  box-shadow: inset 0 0 48px rgba(255, 87, 34, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }
`;

interface AnimalWrapperProps {
  position: 'current' | 'next';
}

const AnimalWrapper = styled(motion.div)<AnimalWrapperProps>`
  position: absolute;
  width: ${props => props.position === 'current' ? '240px' : '120px'};
  height: ${props => props.position === 'current' ? 'min(240px, 36vh)' : 'min(120px, 24vh)'};
  opacity: ${props => props.position === 'current' ? 1 : 0.85};  left: ${props => props.position === 'current' ? '50%' : '82%'};
  top: ${props => props.position === 'current' ? '50%' : '15%'};
  transform: ${props => props.position === 'current' 
    ? 'translate(-50%, -50%)' 
    : 'translate(-50%, 0) rotate(5deg)'};
  z-index: ${props => props.position === 'current' ? 3 : 2};
  cursor: pointer;
  transition: all 0.3s ease;
  filter: ${props => props.position === 'next' ? 'brightness(0.95) contrast(0.95)' : 'none'};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.8) 50%,
      transparent 100%
    );
    z-index: 5;
    transform: translateX(-100%) rotate(45deg);
    animation: flash 1s forwards;
    pointer-events: none;
  }

  @keyframes flash {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    50% {
      transform: translateX(100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
  
  ${props => props.position === 'next' && `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px;
    
    &::after {
      content: '→';
      position: absolute;
      left: -24px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #4CAF50;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    // Smaller flash effect for next animal
    &::before {
      background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 100%
      );
    }
  `}
  &:hover {
    transform: ${props => props.position === 'current'
      ? 'translate(-50%, -50%) scale(1.05)'
      : 'translate(-50%, 0) rotate(0deg) scale(1.2)'};
    opacity: 1;
    filter: none;
    z-index: ${props => props.position === 'current' ? 3 : 4};
  }
`;

const AlphabetNav = styled(motion.nav)`
  width: 120px;
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.95), rgba(214, 235, 255, 0.97));
  border-radius: 0 0 16px 16px;
  padding: 12px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: fixed;
  top: 70px;
  left: 20px;
  transform-origin: top center;
  box-shadow: 0 8px 32px rgba(33, 150, 243, 0.25),  /* Enhanced blue shadow */
              inset 0 0 0 2px rgba(33, 150, 243, 0.3);  /* Thicker blue border */
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);  /* White border for depth */
`;

const AlphabetList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;
  max-height: 320px;
  overflow: auto;
  scroll-behavior: smooth;
  padding: 6px 6px 6px 2px;
  margin: 0px 0;
  background: rgba(224, 242, 255, 0.3);
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #2196F3 rgba(187, 222, 251, 0.3); /* Firefox */

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(187, 222, 251, 0.3);
    border-radius: 3px;
    border: 1px solid rgba(144, 202, 249, 0.2);
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #64B5F6, #2196F3);
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #42A5F5, #1976D2);
  }
`;

const AlphabetButton = styled(motion.button)<{ active: boolean }>`
  width: 86px;
  height: 48px;
  min-height: 48px;
  border: 2px solid ${props => props.active ? '#2196F3' : 'rgba(33, 150, 243, 0.3)'};
  border-radius: 12px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #2196F3, #1976D2)'  /* Blue gradient for active */
    : 'linear-gradient(to bottom, rgba(240, 248, 255, 0.9), rgba(224, 242, 255, 0.95))'};  /* Light blue gradient */
  color: ${props => props.active ? 'white' : getLetterColor(alphabet.indexOf(props.children as string)).main};
  font-size: ${props => props.active ? '1.6rem' : '1.4rem'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.active 
    ? '0 4px 12px rgba(33, 150, 243, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.5)'  /* Enhanced blue shadow */
    : 'inset 0 1px 3px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.05)'};  /* Subtle shadow for inactive */
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #2196F3, #1976D2)'  /* Keep blue gradient on hover for active */
      : 'linear-gradient(to bottom, rgba(224, 242, 255, 0.9), rgba(187, 222, 251, 0.95))'};  /* Slightly darker blue gradient on hover */
    transform: translateY(-2px);
    box-shadow: ${props => props.active 
      ? '0 6px 16px rgba(33, 150, 243, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.5)'  /* Enhanced blue shadow for active hover */
      : '0 4px 12px rgba(33, 150, 243, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.5)'};  /* Enhanced shadow for inactive hover */
  }
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.active 
      ? '0 2px 8px rgba(33, 150, 243, 0.3)' /* Blue shadow to match the color scheme */
      : 'inset 0 1px 5px rgba(0, 0, 0, 0.1)'};  /* Subtle inset shadow for pressed inactive button */
  }
`;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getLetterColor = (index: number) => {
  // Create distinct color ranges for different parts of the alphabet
  const colors = [
    { r: 25, g: 118, b: 210 },    // Blue
    { r: 57, g: 73, b: 171 },     // Indigo
    { r: 123, g: 31, b: 162 },    // Purple
    { r: 3, g: 169, b: 244 },     // Light Blue
    { r: 0, g: 188, b: 212 },     // Cyan
    { r: 0, g: 150, b: 136 },     // Teal
    { r: 46, g: 125, b: 50 }      // Green
  ];

  // Divide alphabet into sections
  let section;
  if (index < 7) {               // A-G
    section = { start: 0, length: 2 };
  } else if (index < 16) {       // H-P
    section = { start: 2, length: 3 };
  } else {                       // Q-Z
    section = { start: 4, length: 3 };
  }
  
  const sectionProgress = (index % 7) / 7;
  const colorIndex = Math.min(section.start + Math.floor(sectionProgress * section.length), colors.length - 2);
  const step = (index % (7 / section.length)) / (7 / section.length);
  
  const c1 = colors[colorIndex];
  const c2 = colors[colorIndex + 1];
  
  return {
    main: `rgb(${
      Math.round(c1.r + (c2.r - c1.r) * step)}, ${
      Math.round(c1.g + (c2.g - c1.g) * step)}, ${
      Math.round(c1.b + (c2.b - c1.b) * step)
    })`,
    shadow: `rgb(${
      Math.round(c1.r + (c2.r - c1.r) * step) - 20}, ${
      Math.round(c1.g + (c2.g - c1.g) * step) - 20}, ${
      Math.round(c1.b + (c2.b - c1.b) * step) - 20
    })`
  };
};

export const AlphabetDisplay = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoCollapseTimer, setAutoCollapseTimer] = useState<NodeJS.Timeout | null>(null);
  const { highContrast } = useTheme();
  const { announce } = useScreenReader();

  const currentLetter = alphabet[currentLetterIndex];
  const animalsForCurrentLetter = getAnimalsForLetter(currentLetter);

  const startAutoCollapseTimer = () => {
    if (autoCollapseTimer) {
      clearTimeout(autoCollapseTimer);
    }
    if (!isInteracting) {
      const timer = setTimeout(() => {
        setIsNavVisible(false);
      }, 5000); // 5 seconds before auto-collapse
      setAutoCollapseTimer(timer);
    }
  };
  const handleNavInteraction = (type: 'enter' | 'leave') => {
    setIsInteracting(type === 'enter');
    if (type === 'leave') {
      setIsInteracting(false);
      startAutoCollapseTimer();
    } else {
      setIsInteracting(true);
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (autoCollapseTimer) {
        clearTimeout(autoCollapseTimer);
      }
    };
  }, [autoCollapseTimer]);

  useEffect(() => {
    if (isNavVisible && !isInteracting) {
      const timer = setTimeout(() => {
        setIsNavVisible(false);
      }, 5000);
      setAutoCollapseTimer(timer);
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [isNavVisible, isInteracting]);

  useEffect(() => {
    setCurrentAnimalIndex(0);
    setIsFirstLoad(false);
    if (!isFirstLoad) {
      textToSpeechService.speak(currentLetter).catch(error => {
        console.warn('Failed to speak letter:', error);
      });
    }
    preloadAdjacentLetterImages(currentLetterIndex, alphabet);
  }, [currentLetter, isFirstLoad, currentLetterIndex]);

  const handleNext = () => {
    if (currentLetterIndex < alphabet.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    }
  };

  const handleAnimalClick = () => {
    if (currentAnimalIndex < animalsForCurrentLetter.length - 1) {
      setCurrentAnimalIndex(prev => prev + 1);
    } else {
      setCurrentAnimalIndex(0);
    }
  };

  const slideInVariants = {
    currentInitial: {
      x: '100%',
      scale: 0.3,
      opacity: 0,
      y: '-50%',
      filter: 'brightness(1.2) contrast(0.8)'
    },
    currentAnimate: {
      x: '-50%',
      y: '-50%',
      scale: 1,
      opacity: 1,
      filter: 'brightness(1) contrast(1)',
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
        filter: {
          duration: 0.3,
          ease: 'easeOut'
        }
      }
    },
    currentExit: {
      x: '-150%',
      y: '-50%',
      scale: 0.3,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    nextInitial: {
      x: '120%',
      y: '0%',
      scale: 0.3,
      opacity: 0,
      filter: 'brightness(1.1) contrast(0.9)'
    },
    nextAnimate: {
      x: '-50%',
      y: '0%',
      scale: 1.05,
      opacity: 1,
      filter: 'brightness(1) contrast(0.98)',
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
        delay: 0.2,
        filter: {
          duration: 0.4,
          ease: 'easeOut'
        }
      }
    },
    nextExit: {
      x: '-50%',
      y: '-50%',
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToggleButton
        onClick={() => {
          setIsNavVisible(!isNavVisible);
          startAutoCollapseTimer();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        isActive={isNavVisible}
        $highContrast={highContrast}
        aria-label={isNavVisible ? "Hide alphabet menu" : "Show alphabet menu"}
        title={isNavVisible ? "Hide alphabet menu" : "Show alphabet menu"}
      >
        ABC
      </ToggleButton>
      <AnimatePresence>
        {isNavVisible && (
          <AlphabetNav
            initial={{ height: 0, opacity: 0, scaleY: 0 }}
            animate={{ height: "340px", opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25, duration: 0.3 }}
            onMouseEnter={() => handleNavInteraction('enter')}
            onMouseLeave={() => handleNavInteraction('leave')}
            onMouseMove={() => handleNavInteraction('enter')}
            onTouchStart={() => handleNavInteraction('enter')}
            onTouchEnd={() => handleNavInteraction('leave')}
            onScroll={() => handleNavInteraction('enter')}
          >
            <AlphabetList role="list">
              {alphabet.map((letter) => {
                const letterIndex = alphabet.indexOf(letter);
                return (
                  <AlphabetButton
                    key={letter}
                    active={letterIndex === currentLetterIndex}
                    onClick={() => {
                      setCurrentLetterIndex(letterIndex);
                      setIsNavVisible(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {letter}
                  </AlphabetButton>
                );
              })}
            </AlphabetList>
          </AlphabetNav>
        )}
      </AnimatePresence>

      <ContentWrapper>
        <LetterSection>
          <NavigationButtonLeft 
            onClick={handlePrevious} 
            disabled={currentLetterIndex === 0}
            aria-label="Previous letter"
            variant="secondary"
          >
            ⟨
          </NavigationButtonLeft>
          <LetterDisplay>
            <Letter
              key={currentLetter}
              $letterIndex={currentLetterIndex}
              initial={isFirstLoad ? { scale: 0, opacity: 0 } : { scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              {currentLetter}
            </Letter>
            <SoundButton 
              text={currentLetter}
              size="large"
            />
          </LetterDisplay>
          <NavigationButtonRight 
            onClick={handleNext} 
            disabled={currentLetterIndex === alphabet.length - 1}
            aria-label="Next letter"
            variant="primary"
            soundId="click"
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ›
          </NavigationButtonRight>
        </LetterSection>
        <AnimalContainer>
          <AnimatePresence mode="popLayout">
            {/* Current Animal */}
            {currentAnimalIndex < animalsForCurrentLetter.length && (
              <AnimalWrapper
                key={`current-${animalsForCurrentLetter[currentAnimalIndex].name}`}
                variants={slideInVariants}
                initial="currentInitial"
                animate="currentAnimate"
                exit="currentExit"
                position="current"
              >
                <AnimalCard
                  name={animalsForCurrentLetter[currentAnimalIndex].name}
                  image={animalsForCurrentLetter[currentAnimalIndex].fileName}
                  onClick={handleAnimalClick}
                />
              </AnimalWrapper>
            )}
            {/* Next Animal */}
            {animalsForCurrentLetter.length > 0 && (
              <AnimalWrapper
                key={`next-${animalsForCurrentLetter[
                  (currentAnimalIndex + 1) % animalsForCurrentLetter.length
                ].name}`}
                variants={slideInVariants}
                initial="nextInitial"
                animate="nextAnimate"
                exit="nextExit"
                position="next"
              >
                <AnimalCard
                  name={animalsForCurrentLetter[
                    (currentAnimalIndex + 1) % animalsForCurrentLetter.length
                  ].name}
                  image={animalsForCurrentLetter[
                    (currentAnimalIndex + 1) % animalsForCurrentLetter.length
                  ].fileName}
                  speakOnClick={false} // Don't speak when clicked in corner position
                  onClick={handleAnimalClick}
                />
              </AnimalWrapper>
            )}
          </AnimatePresence>
        </AnimalContainer>
      </ContentWrapper>
    </Container>
  );
};