import React from 'react';
import styled from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../utils/sound';

// Define the props interface for the FloatingBackButton
interface FloatingBackButtonProps {
  $highContrast?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
  title?: string;
  soundId?: string;
}

// Create a motion.button element with styled-components
const FloatingButtonBase = styled(motion.button)<{ $isHighContrast: boolean }>`
  position: fixed;
  top: 16px;
  left: 16px;
  padding: 8px;
  min-width: auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    font-size: 24px;
  }
`;

// Functional component wrapper to handle high contrast via props
export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  $highContrast,
  children,
  onClick,
  soundId,
  ...props
}) => {
  const { highContrast: themeHighContrast } = useTheme();
  const isHighContrast = $highContrast ?? themeHighContrast;
  
  // Handle click with sound
  const handleClick = () => {
    if (soundId) {
      soundManager.play(soundId);
    }
    if (onClick) {
      onClick();
    }
  };
  
  return (    <FloatingButtonBase
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      $isHighContrast={isHighContrast}
      style={{
        backgroundColor: isHighContrast ? 'black' : 'rgba(255, 255, 255, 0.9)',
        border: isHighContrast ? '2px solid white' : '2px solid rgba(33, 150, 243, 0.3)'
      }}
      {...props}
    >
      <span style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: isHighContrast ? 'white' : '#2196F3'
      }}>
        {children}
      </span>
    </FloatingButtonBase>
  );
};
