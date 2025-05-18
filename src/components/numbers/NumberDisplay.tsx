import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveButton } from '../common/InteractiveButton';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MathGame } from './MathGame';

const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: ${props => props.active ? '#2196F3' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#333'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#1976D2' : '#d0d0d0'};
  }
`;

const NumberSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  min-height: 200px;
`;

const Number = styled(motion.div)`
  font-size: 120px;
  font-weight: bold;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const CountingObjects = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 24px;
  justify-items: center;
`;

const CountingObject = styled(motion.div)`
  width: 50px;
  height: 50px;
  background-color: #2196F3;
  border-radius: 50%;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
`;

type Mode = 'numbers' | 'math';

export const NumberDisplay: React.FC = () => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [mode, setMode] = useState<Mode>('numbers');
  const maxNumber = 10;

  const handleNext = () => {
    if (currentNumber < maxNumber) {
      setCurrentNumber(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentNumber > 1) {
      setCurrentNumber(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleNavigate = (e: Event) => {
      if (e.type === 'navigate-next') {
        handleNext();
      } else if (e.type === 'navigate-prev') {
        handlePrevious();
      }
    };

    window.addEventListener('navigate-next', handleNavigate);
    window.addEventListener('navigate-prev', handleNavigate);

    return () => {
      window.removeEventListener('navigate-next', handleNavigate);
      window.removeEventListener('navigate-prev', handleNavigate);
    };
  }, [currentNumber]);

  return (
    <Container>
      <TabContainer>
        <Tab 
          active={mode === 'numbers'} 
          onClick={() => setMode('numbers')}
        >
          Learn Numbers
        </Tab>
        <Tab 
          active={mode === 'math'} 
          onClick={() => setMode('math')}
        >
          Math Practice
        </Tab>
      </TabContainer>

      <AnimatePresence mode="wait">
        {mode === 'numbers' ? (
          <motion.div
            key="numbers"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ProgressIndicator 
              current={currentNumber} 
              total={maxNumber}
              showSteps={true}
            />
            
            <NumberSection>
              <Number
                key={currentNumber}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {currentNumber}
              </Number>
            </NumberSection>

            <CountingObjects>
              {Array.from({ length: currentNumber }, (_, i) => (
                <CountingObject
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </CountingObjects>

            <Controls>
              <InteractiveButton
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentNumber === 1}
                soundId="click"
              >
                Previous
              </InteractiveButton>
              <InteractiveButton
                variant="primary"
                onClick={handleNext}
                disabled={currentNumber === maxNumber}
                soundId="click"
              >
                Next
              </InteractiveButton>
            </Controls>
          </motion.div>
        ) : (
          <motion.div
            key="math"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MathGame />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};