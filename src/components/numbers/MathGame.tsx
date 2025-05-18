import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveButton } from '../common/InteractiveButton';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { soundManager } from '../../utils/sound';
import { useScreenReader } from '../../utils/screenReader';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { achievementService } from '../../services/achievements/achievementService';

const Container = styled.div`
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

const Problem = styled(motion.div)<{ highContrast: boolean }>`
  font-size: 48px;
  text-align: center;
  margin: 32px 0;
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: ${props => props.highContrast ? colors.highContrast.surface : 'transparent'};
  padding: 16px;
  border-radius: 8px;
  border: ${props => props.highContrast ? '2px solid white' : 'none'};
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 32px;
`;

const Score = styled.div<{ highContrast: boolean }>`
  text-align: center;
  font-size: 24px;
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.primary};
  margin-top: 24px;
`;

const FeedbackText = styled(motion.div)<{ isCorrect: boolean; highContrast: boolean }>`
  text-align: center;
  font-size: 32px;
  color: ${props => {
    if (props.highContrast) return colors.highContrast.text;
    return props.isCorrect ? colors.normal.primary : colors.normal.error;
  }};
  margin-top: 16px;
`;

const generateProblem = (maxNum: number = 10) => {
  const num1 = Math.floor(Math.random() * maxNum) + 1;
  const num2 = Math.floor(Math.random() * (maxNum - num1)) + 1;
  const correct = num1 + num2;
  
  const wrongAnswers = new Set<number>();
  while (wrongAnswers.size < 3) {
    const wrong = correct + Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? 1 : -1);
    if (wrong > 0 && wrong !== correct) {
      wrongAnswers.add(wrong);
    }
  }
  
  const answers = Array.from(wrongAnswers).concat(correct).sort(() => Math.random() - 0.5);
  
  return {
    num1,
    num2,
    correct,
    answers
  };
};

export const MathGame: React.FC = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { announce, announceProgress } = useScreenReader();
  const { highContrast } = useTheme();

  useEffect(() => {
    announce('Math practice game started. Select the correct answer for each addition problem.');
  }, []);

  useEffect(() => {
    // Check for streak achievements
    achievementService.checkMathStreak(streak);
  }, [streak]);

  const handleAnswer = (answer: number) => {
    const correct = answer === problem.correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      soundManager.play('correct');
      announce('Correct answer! Great job!');
    } else {
      setStreak(0);
      soundManager.play('wrong');
      announce(`Incorrect. The correct answer was ${problem.correct}`);
    }
    
    setTotalQuestions(t => t + 1);
    announceProgress(totalQuestions + 1, 10, 'Math Practice');
    
    setTimeout(() => {
      const newProblem = generateProblem();
      setProblem(newProblem);
      setIsCorrect(null);
      announce(`What is ${newProblem.num1} plus ${newProblem.num2}?`);
    }, 2000);
  };

  return (
    <Container role="main" aria-label="Math Practice Game">
      <ProgressIndicator
        current={score}
        total={10}
        showSteps={false}
      />
      
      <AnimatePresence mode="wait">
        <Problem
          key={`${problem.num1}-${problem.num2}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          highContrast={highContrast}
          role="math"
          aria-label={`What is ${problem.num1} plus ${problem.num2}?`}
        >
          <span>{problem.num1}</span>
          <span>+</span>
          <span>{problem.num2}</span>
          <span>=</span>
          <span>?</span>
        </Problem>
      </AnimatePresence>

      {isCorrect !== null && (
        <FeedbackText
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          isCorrect={isCorrect}
          highContrast={highContrast}
          role="alert"
        >
          {isCorrect ? '✨ Correct! ✨' : '❌ Try Again!'}
        </FeedbackText>
      )}

      <Options role="radiogroup" aria-label="Answer choices">
        {problem.answers.map((answer, index) => (
          <InteractiveButton
            key={`${answer}-${index}`}
            onClick={() => handleAnswer(answer)}
            variant={isCorrect === null ? 'primary' : 
              (isCorrect && answer === problem.correct ? 'primary' : 'secondary')}
            disabled={isCorrect !== null}
            soundId="click"
            aria-label={`Answer ${answer}`}
          >
            {answer}
          </InteractiveButton>
        ))}
      </Options>

      <Score highContrast={highContrast}>
        Score: {score} / {totalQuestions}
      </Score>
    </Container>
  );
};