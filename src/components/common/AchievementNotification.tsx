import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../../services/achievements/achievementService';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';

const NotificationContainer = styled(motion.div)<{ highContrast: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.highContrast ? colors.highContrast.surface : 'white'};
  border: ${props => props.highContrast ? '2px solid white' : '1px solid #e0e0e0'};
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: ${props => props.highContrast ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  z-index: 1000;
`;

const Icon = styled.span`
  font-size: 32px;
`;

const Content = styled.div<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.text};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const Description = styled.p<{ highContrast: boolean }>`
  margin: 4px 0 0;
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.textLight};
  font-size: 0.9rem;
`;

interface AchievementNotificationProps {
  achievement: Achievement | null;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement
}) => {
  const { highContrast } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <NotificationContainer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          highContrast={highContrast}
          role="alert"
          aria-live="polite"
        >
          <Icon role="img" aria-label={achievement.title}>
            {achievement.icon}
          </Icon>
          <Content highContrast={highContrast}>
            <Title>{achievement.title}</Title>
            <Description highContrast={highContrast}>
              {achievement.description}
            </Description>
          </Content>
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
};