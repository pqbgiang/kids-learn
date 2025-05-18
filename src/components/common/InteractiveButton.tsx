import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { soundManager } from '../../utils/sound';

interface InteractiveButtonProps {
  onClick?: () => void;
  soundId?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

const StyledButton = styled(motion.button)<{ 
  variant: 'primary' | 'secondary';
  highContrast: boolean;
  disabled?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  border: ${props => props.highContrast ? '2px solid white' : 'none'};
  font-size: 1.2rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => {
    if (props.highContrast) {
      return colors.highContrast.surface;
    }
    return props.variant === 'primary' ? colors.normal.primary : colors.normal.secondary;
  }};
  color: ${props => props.highContrast ? colors.highContrast.text : 'white'};
  box-shadow: ${props => props.highContrast ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    filter: ${props => props.disabled ? 'none' : props.highContrast ? 'invert(1)' : 'brightness(1.1)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.98)'};
  }

  &:focus {
    outline: ${props => props.highContrast ? '2px solid white' : '2px solid #2196F3'};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  onClick,
  soundId,
  children,
  variant = 'primary',
  disabled = false,
  title,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  ...restProps
}) => {
  const { highContrast } = useTheme();

  const handleClick = () => {
    if (disabled) return;
    if (soundId) {
      soundManager.play(soundId);
    }
    onClick?.();
  };
  return (
    <StyledButton
      variant={variant}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}      disabled={disabled}
      highContrast={highContrast}
      aria-disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};