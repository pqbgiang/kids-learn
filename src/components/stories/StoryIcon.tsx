import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BookOutlined, 
  MenuBookOutlined, 
  AutoStories, 
  PetsOutlined, 
  ChildCareOutlined,
  EmojiNatureOutlined, 
  LocalFloristOutlined
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';

interface StoryIconProps {
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  category: string;
  active?: boolean;
  title?: string;
}

const IconContainer = styled(motion.button)<{ 
  size: string; 
  highContrast: boolean;
  active?: boolean;
}>`
  background: ${props => props.highContrast 
    ? colors.highContrast.surface 
    : props.active 
      ? '#1976D2' 
      : 'rgba(255, 255, 255, 0.8)'};
  border: ${props => props.highContrast ? '2px solid white' : '2px solid rgba(33, 150, 243, 0.3)'};
  border-radius: 50%;
  width: ${props => {
    switch (props.size) {
      case 'small': return '34px';
      case 'large': return '56px';
      default: return '44px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '34px';
      case 'large': return '56px';
      default: return '44px';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => props.highContrast 
      ? 'rgba(255, 255, 255, 0.2)'
      : props.active
        ? '#1565C0'
        : 'rgba(255, 255, 255, 0.95)'};
  }

  svg {
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '20px';
        case 'large': return '32px';
        default: return '26px';
      }
    }};
    color: ${props => props.highContrast 
      ? '#FFFFFF' 
      : props.active
        ? '#FFFFFF'
        : '#2196F3'};
  }
`;

const getCategoryIcon = (category: string): React.ReactElement<SvgIconProps> => {
  switch (category.toLowerCase()) {
    case 'fairy-tale':
      return <AutoStories />;
    case 'rhymes':
      return <MenuBookOutlined />;
    case 'animals':
      return <PetsOutlined />;
    case 'fable':
      return <ChildCareOutlined />;
    case 'nature':
      return <EmojiNatureOutlined />;
    case 'adventure':
      return <LocalFloristOutlined />;
    default:
      return <BookOutlined />;
  }
};

export const StoryIcon: React.FC<StoryIconProps> = ({ 
  onClick, 
  size = 'medium', 
  category,
  active = false,
  title
}) => {
  const { highContrast } = useTheme();
  const icon = getCategoryIcon(category);

  return (
    <IconContainer
      onClick={onClick}
      size={size}
      highContrast={highContrast}
      active={active}
      whileTap={{ scale: 0.95 }}
      title={title}
      aria-label={title}
      role="button"
    >
      {icon}
    </IconContainer>
  );
};
