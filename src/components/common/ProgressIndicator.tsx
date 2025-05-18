import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showSteps?: boolean;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: -4px;
`;

const ProgressBar = styled.div<{ highContrast: boolean }>`
  width: 100%;
  height: 8px;
  background-color: ${props => props.highContrast ? '#333' : '#e0e0e0'};
  border-radius: 4px;
  overflow: hidden;
  border: ${props => props.highContrast ? '1px solid white' : 'none'};
`;

const Progress = styled(motion.div)<{ progress: number; highContrast: boolean }>`
  height: 100%;
  background-color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.primary};
  width: ${props => props.progress}%;
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Step = styled.div<{ active: boolean; highContrast: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.highContrast) {
      return props.active ? colors.highContrast.text : colors.highContrast.surface;
    }
    return props.active ? colors.normal.primary : '#e0e0e0';
  }};
  border: ${props => props.highContrast ? '2px solid white' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    if (props.highContrast) {
      return props.active ? colors.highContrast.surface : colors.highContrast.text;
    }
    return 'white';
  }};
  font-size: 0.9rem;
  position: relative;

  &:focus {
    outline: ${props => props.highContrast ? '2px solid white' : '2px solid #2196F3'};
    outline-offset: 2px;
  }
`;

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  showSteps = false
}) => {
  const { highContrast } = useTheme();
  const progress = (current / total) * 100;

  return (
    <Container role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <ProgressBar highContrast={highContrast}>
        <Progress 
          progress={progress}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          highContrast={highContrast}
        />
      </ProgressBar>
      {showSteps && (
        <Steps role="tablist">
          {Array.from({ length: total }, (_, i) => (
            <Step 
              key={i} 
              active={i < current}
              highContrast={highContrast}
              role="tab"
              aria-selected={i < current}
              tabIndex={0}
              aria-label={`Step ${i + 1} of ${total}${i < current ? ' - Completed' : ''}`}
            >
              {i + 1}
            </Step>
          ))}
        </Steps>
      )}
    </Container>
  );
};