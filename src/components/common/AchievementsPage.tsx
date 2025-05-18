import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { achievementService } from '../../services/achievements/achievementService';

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.text};
  text-align: center;
  margin-bottom: 32px;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const Achievement = styled(motion.div)<{ unlocked: boolean; highContrast: boolean }>`
  background: ${props => props.highContrast ? colors.highContrast.surface : 'white'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: ${props => props.highContrast ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.highContrast ? '2px solid white' : 'none'};
  opacity: ${props => props.unlocked ? 1 : 0.6};
  filter: ${props => props.unlocked ? 'none' : 'grayscale(1)'};
`;

const Icon = styled.div`
  font-size: 48px;
`;

const AchievementTitle = styled.h3<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.primary};
  margin: 0;
  text-align: center;
`;

const Description = styled.p<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.textLight};
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
`;

const UnlockDate = styled.span<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.textLight};
  font-size: 0.8rem;
  margin-top: auto;
`;

export const AchievementsPage: React.FC = () => {
  const { highContrast } = useTheme();
  const achievements = achievementService.getAchievements();

  return (
    <Container role="main" aria-label="Achievements Page">
      <Title highContrast={highContrast}>My Achievements</Title>
      <AchievementGrid>
        {achievements.map((achievement) => (
          <Achievement
            key={achievement.id}
            unlocked={achievement.unlocked}
            highContrast={highContrast}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="listitem"
            aria-label={`${achievement.title} - ${achievement.description}${
              achievement.unlocked ? ' - Unlocked' : ' - Locked'
            }`}
          >
            <Icon role="img" aria-hidden="true">
              {achievement.icon}
            </Icon>
            <AchievementTitle highContrast={highContrast}>
              {achievement.title}
            </AchievementTitle>
            <Description highContrast={highContrast}>
              {achievement.description}
            </Description>
            {achievement.unlocked && achievement.unlockedAt && (
              <UnlockDate highContrast={highContrast}>
                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </UnlockDate>
            )}
          </Achievement>
        ))}
      </AchievementGrid>
    </Container>
  );
};