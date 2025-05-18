import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { InteractiveButton } from '../common/InteractiveButton';
import { bounceIn } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`;

const Canvas = styled.canvas<{ highContrast: boolean }>`
  border: ${props => props.highContrast ? '2px solid white' : '2px solid #2196F3'};
  border-radius: 8px;
  background-color: ${props => props.highContrast ? 'black' : 'white'};
  touch-action: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const LetterGuide = styled(motion.div)<{ highContrast: boolean }>`
  font-size: 120px;
  color: ${props => props.highContrast ? '#333' : '#e0e0e0'};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  font-family: 'Comic Sans MS', cursive;
  z-index: 1;
`;

const Instructions = styled.p<{ highContrast: boolean }>`
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.text};
  text-align: center;
  margin: 0;
`;

interface WritingPracticeProps {
  letter: string;
  onComplete?: () => void;
}

export const WritingPractice: React.FC<WritingPracticeProps> = ({
  letter,
  onComplete
}) => {
  const { highContrast } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = highContrast ? 'white' : '#2196F3';
        setContext(ctx);
      }
    }
  }, [highContrast]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    if (context) {
      context.beginPath();
      const point = getEventPoint(e);
      context.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const point = getEventPoint(e);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const getEventPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? e.touches[0] : e;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <Container role="application" aria-label="Letter Writing Practice">
      <Instructions highContrast={highContrast}>
        Practice writing the letter {letter} by tracing or drawing with your mouse or finger
      </Instructions>
      
      <CanvasContainer>
        <LetterGuide
          variants={bounceIn}
          initial="initial"
          animate="animate"
          exit="exit"
          highContrast={highContrast}
          aria-hidden="true"
        >
          {letter}
        </LetterGuide>
        <Canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          highContrast={highContrast}
          aria-label={`Drawing canvas for letter ${letter}`}
        />
      </CanvasContainer>

      <Controls>
        <InteractiveButton
          onClick={clearCanvas}
          variant="secondary"
          soundId="click"
          aria-label="Clear drawing"
        >
          Clear
        </InteractiveButton>
        <InteractiveButton
          onClick={onComplete}
          variant="primary"
          soundId="complete"
          aria-label="Finish writing practice"
        >
          Done
        </InteractiveButton>
      </Controls>
    </Container>
  );
};