import React, { useState } from 'react';
import styled from 'styled-components';
import { VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { textToSpeechService } from '../../services/tts/textToSpeechService';

interface SoundButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
}

const IconButton = styled(motion.button)<{ size: string; highContrast: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  svg {
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '20px';
        case 'large': return '36px';
        default: return '24px';
      }
    }};
    color: ${props => props.highContrast ? '#FFFFFF' : '#FF5722'};
  }

  &:hover:not(:disabled) {
    background-color: ${props => props.highContrast ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 87, 34, 0.1)'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const SoundButton: React.FC<SoundButtonProps> = ({ 
  text, 
  size = 'medium' 
}) => {
  const { highContrast } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await textToSpeechService.speak(text);
    } catch (error) {
      console.error('Failed to play speech:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      size={size}
      highContrast={highContrast}
      disabled={isPlaying}
      aria-label={isPlaying ? "Playing..." : `Pronounce ${text}`}
    >
      <VolumeUp />
    </IconButton>
  );
};