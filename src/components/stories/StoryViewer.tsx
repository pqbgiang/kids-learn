import React, { useState, useEffect, useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Story, StoryPage } from '../../types/story';
import { InteractiveButton } from '../common/InteractiveButton';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { soundManager } from '../../utils/sound';
import { useScreenReader } from '../../utils/screenReader';
import { getOptimizedImageUrl } from '../../utils/imageLoader';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { StoryIcon } from './StoryIcon';
import { FloatingBackButton } from './FloatingBackButton';
import { 
  ArrowBack, 
  ArrowForward,
  Home,
  VolumeUp,
  VolumeMute,
  TextIncrease,
  TextDecrease,
  Celebration,
  TextFields
} from '@mui/icons-material';

const Container = styled.div`
  padding: 20px;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const StoryTitle = styled.h1<{ $highContrast: boolean }>`
  margin: 0;
  font-size: 1.3rem;
  color: ${props => props.$highContrast ? colors.highContrast.text : '#333'};
  flex: 1;
  line-height: 1.3;
`;

// BackButton replaced with FloatingBackButton

const StoryContent = styled(motion.div)<{ $highContrast: boolean }>`
  background: ${props => props.$highContrast ? colors.highContrast.surface : 'white'};
  border-radius: 20px;
  padding: 20px;
  padding-top: 16px;
  box-shadow: ${props => props.$highContrast ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.15)'};
  border: ${props => props.$highContrast ? '2px solid white' : 'none'};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const BackgroundDecoration = styled.div<{ $highContrast: boolean }>`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${props => props.$highContrast ? 'transparent' : 'rgba(33, 150, 243, 0.1)'};
  z-index: 0;
`;

const StoryImageContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  max-height: 50vh;
  display: flex;
  justify-content: center;
`;

const StoryImage = styled(motion.img)<{ $highContrast: boolean }>`
  width: 100%;
  height: auto;
  max-height: 50vh;
  object-fit: contain;
  border-radius: 12px;
  filter: ${props => props.$highContrast ? 'grayscale(1) contrast(1.5)' : 'none'};
`;

const ImageOverlay = styled.div<{ $highContrast: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: ${props => props.$highContrast 
    ? 'linear-gradient(to bottom, transparent, black)' 
    : 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7))'};
  opacity: ${props => props.$highContrast ? 0.8 : 0.5};
  pointer-events: none;
`;

// Update the TextContainer interface and styling
interface TextContainerProps {
  $simplified?: boolean;
  $highContrast: boolean;
  $mode?: 'light' | 'dark';
}

const TextContainer = styled(motion.div)<TextContainerProps>`
  position: relative;
  z-index: 1;
  background: ${props => props.$mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};
  padding: 16px;
  border-radius: 12px;
  border-left: ${props => props.$simplified ? `4px solid ${props.$highContrast ? colors.highContrast.primary : '#42A5F5'}` : 'none'};
  max-height: 38vh;
  overflow-y: auto;
  margin-bottom: 12px;
`;

const StoryText = styled(motion.p)<{ $highContrast: boolean; $fontSize: string }>`
  font-size: ${props => props.$fontSize};
  line-height: 1.7;
  color: ${props => props.$highContrast ? colors.highContrast.text : colors.normal.text};
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease-in-out;
`;

const TextModeIndicator = styled(motion.span)<{ $highContrast: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.$highContrast ? colors.highContrast.primary : '#42A5F5'};
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${props => props.$highContrast ? 'rgba(0, 0, 0, 0.3)' : 'rgba(33, 150, 243, 0.08)'};
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  position: relative;
  z-index: 1;
`;

const ChoiceOptionContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
`;

const ChoiceNumber = styled.div<{ $highContrast: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$highContrast ? colors.highContrast.secondary : '#2196F3'};
  color: ${props => props.$highContrast ? 'black' : 'white'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-shrink: 0;
`;

const ChoiceButton = styled(InteractiveButton)`
  flex: 1;
  text-align: left;
  padding: 16px;
  font-size: 1.1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 16px;
`;

const NavigationButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const IconButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const IconLabel = styled.span<{ $highContrast: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.$highContrast ? colors.highContrast.text : '#666'};
  text-align: center;
`;

const SettingsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const FontSizeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled(motion.button)<{ 
  active: boolean;
  $highContrast: boolean;
}>`
  background: ${props => props.$highContrast 
    ? colors.highContrast.surface 
    : props.active 
      ? '#2196F3' 
      : 'rgba(255, 255, 255, 0.8)'};
  border: ${props => props.$highContrast ? '2px solid white' : '2px solid rgba(33, 150, 243, 0.2)'};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 4px rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background: ${props => props.$highContrast 
      ? 'rgba(255, 255, 255, 0.2)'
      : props.active
        ? '#1976D2'
        : 'rgba(255, 255, 255, 0.95)'};
  }

  svg {
    font-size: 20px;
    color: ${props => props.$highContrast 
      ? '#FFFFFF' 
      : props.active
        ? '#FFFFFF'
        : '#2196F3'};
  }
`;

const FontSizeButton = styled(IconButton)<{ active: boolean; buttonSize?: 'small' | 'medium' | 'large' }>`
  width: 36px;
  height: 36px;
  font-size: ${props => props.buttonSize === 'large' ? '20px' : props.buttonSize === 'small' ? '14px' : '16px'};
  font-weight: bold;
`;

const ReadAloudButton = styled(IconButton)<{ active: boolean; $highContrast: boolean }>`
  background: ${props => props.active 
    ? props.$highContrast ? colors.highContrast.primary : '#4CAF50' 
    : props.$highContrast ? colors.highContrast.surface : 'rgba(255, 255, 255, 0.8)'};
  border-color: ${props => props.active ? '#2E7D32' : 'rgba(33, 150, 243, 0.2)'};
  
  svg {
    color: ${props => props.$highContrast 
      ? '#FFFFFF' 
      : props.active
        ? '#FFFFFF'
        : '#4CAF50'};
  }
`;

// Add interface for the component props
interface StoryViewerProps {
  story: Story;
  onComplete?: () => void;
  theme?: DefaultTheme;
  mode?: 'light' | 'dark';
}

// Add interface for the container props
interface StoryViewerContainerProps {
  $mode?: 'light' | 'dark';
  theme?: DefaultTheme;
}

// Update the styled component to use the $mode prop instead of theme comparison
const StoryViewerContainer = styled.div<StoryViewerContainerProps>`
  position: relative;
  z-index: 1;
  background: ${props => props.$mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};
  padding: 16px;
`;

// Update the component usage
export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  onComplete,
  mode = 'light'
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageHistory, setPageHistory] = useState<number[]>([0]);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isReading, setIsReading] = useState(false);
  const [useSimplifiedText, setUseSimplifiedText] = useState(false);
  const { highContrast } = useTheme();
  const { announce, announceProgress } = useScreenReader();
  const textToSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Safely get current page with fallback for invalid state
  const getCurrentPage = () => {
    if (!story || !story.pages || story.pages.length === 0) {
      return null;
    }
    return story.pages[currentPageIndex] || { text: "Story page not found." };
  };
  
  const currentPage = getCurrentPage();
  
  // Effect for page changes
  useEffect(() => {
    // Skip if no valid story
    if (!story || !story.pages || story.pages.length === 0) return;
    
    const currentPage = getCurrentPage();
    if (currentPage) {
      // Load and play page-specific sound
      if (currentPage.soundUrl) {
        soundManager.loadSound(`page-${currentPageIndex}`, currentPage.soundUrl);
        soundManager.play(`page-${currentPageIndex}`);
      }
      
      // Cancel any ongoing speech when page changes
      if (textToSpeechRef.current && isReading && currentPage) {
        speechSynthesis.cancel();
        readPageText(currentPage.text);
      }
      
      // Announce the current page text for screen readers
      if (currentPage) {
        announce(currentPage.text);
        announceProgress(currentPageIndex + 1, story.pages.length, 'Story');
      }
    }
  }, [currentPageIndex, story, isReading, announce, announceProgress]);

  // Effect for initial setup
  useEffect(() => {
    // Skip if no valid story
    if (!story || !story.pages || story.pages.length === 0) return;
    
    // Initial story announcement
    announce(`Starting story: ${story.title}. Use arrow keys to navigate between pages.`);

    // Cleanup speech synthesis when unmounting
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [story, announce]);
  // Preload sounds
  useEffect(() => {
    soundManager.loadSound('page-turn', '/sounds/common/page-turn.mp3');
    soundManager.loadSound('page-turn-back', '/sounds/common/page-turn-back.mp3');
    soundManager.loadSound('choice', '/sounds/common/choice.mp3');
    soundManager.loadSound('complete', '/sounds/common/success.mp3');
    soundManager.loadSound('click', '/sounds/common/click.mp3');
  }, []);
  
  // Handle case where story might be undefined or null
  if (!story || !story.pages || story.pages.length === 0) {    return (      <Container>        <FloatingBackButton 
          onClick={() => {
            onComplete?.();
          }}
          aria-label="Return to story list"
          title="Go back to story list"
          $highContrast={false}
          soundId="click"
        >
          <Home />        </FloatingBackButton>
        <Header>
          <StoryTitle $highContrast={false}>
            Story Not Found
          </StoryTitle>
        </Header>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Sorry, we couldn't find this story. Please try another one.</p>
          <InteractiveButton onClick={onComplete} variant="primary" soundId="click">
            Go Back
          </InteractiveButton>
        </div>
      </Container>
    );
  }
  // We're already using getCurrentPage() defined above for the current page
  
  const fontSizeMap = {
    small: '1rem',
    medium: '1.2rem',
    large: '1.5rem'
  };
  // Function to simplify text while preserving meaning
  const getSimplifiedText = (text: string): string => {
    // If text is already short, don't simplify
    if (text.length < 70) return text;
    
    // Replace common verbose patterns with shorter forms
    let simplified = text
      // Remove common story starters
      .replace(/Once upon a time,\s+/i, '')
      .replace(/there was\s+/i, '')
      .replace(/there were\s+/i, '')
      .replace(/One day,\s+/i, '')
      .replace(/Long ago,\s+/i, '')
      .replace(/In the olden days,\s+/i, '')
      .replace(/A long time ago,\s+/i, '')
      
      // Simplify character descriptions
      .replace(/that looked different/i, 'different')
      .replace(/looking at me/i, 'watches me')
      .replace(/The itsy bitsy spider/i, 'Itsy spider')
      .replace(/very hungry/i, 'hungry')
      .replace(/Little Red Riding Hood/i, 'Red Hood')
      .replace(/There was once/i, 'Once')
      
      // Simplify complex expressions
      .replace(/in order to/i, 'to')
      .replace(/as a result of/i, 'because of')
      .replace(/due to the fact that/i, 'because')
      .replace(/at this point in time/i, 'now')
      .replace(/for the purpose of/i, 'to')
      .replace(/in the event that/i, 'if')
      
      // Simplify common story phrases
      .replace(/lived happily ever after/i, 'lived happily')
      .replace(/as quick as lightning/i, 'very quickly')
      .replace(/bright as the sun/i, 'very bright')
      .replace(/suddenly realized/i, 'realized')
      
      // Remove redundant adjectives and adverbs
      .replace(/\b(very|really|extremely|absolutely)\s+/ig, '')
      
      // Simplify some long sentences by splitting them
      .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
      
      .trim();
      
    // If the text is still long, try to shorten sentences further
    if (simplified.length > 150) {
      simplified = simplified
        .replace(/\b(however|nevertheless|furthermore|consequently|additionally|moreover)\b/ig, '')
        .replace(/\b(that is to say|in other words)\b/ig, '');
    }
    
    return simplified;
  };

  const displayText = useSimplifiedText 
    ? getSimplifiedText(currentPage?.text || '')
    : currentPage?.text || '';
      
  const toggleTextMode = () => {
    // Play a subtle sound when toggling
    soundManager.play('click');
    
    setUseSimplifiedText(!useSimplifiedText);
    
    // Announce the mode change for screen readers
    announce(useSimplifiedText ? 'Showing full text' : 'Showing simplified text');
    
    // Always read the full text even if display is simplified
    if (isReading && currentPage) {
      readPageText(currentPage.text);
    }
  };

  const readPageText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch
      utterance.onend = () => {
        if (isReading) {
          // Delay a bit before showing read-completed state
          setTimeout(() => {
            setIsReading(false);
          }, 500);
        }
      };
      textToSpeechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleReadAloud = () => {
    if (!isReading) {
      setIsReading(true);
      if (currentPage) {
        readPageText(currentPage.text);
      }
    } else {
      setIsReading(false);
      speechSynthesis.cancel();
    }
  };

  const handleStoryComplete = () => {
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    // Play completion sound
    soundManager.play('complete');
    
    onComplete?.();
    announce('Story complete! Great job reading!');
  };

  const handleNext = () => {
    if (currentPageIndex < story.pages.length - 1) {
      const nextIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextIndex);
      setPageHistory([...pageHistory, nextIndex]);
      soundManager.play('page-turn');
    } else {
      handleStoryComplete();
    }
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const previousIndex = newHistory[newHistory.length - 1];
      setCurrentPageIndex(previousIndex);
      setPageHistory(newHistory);
      announce('Going back to previous page');
      soundManager.play('page-turn-back');
    }
  };
  
  const handleChoice = (choice: { text: string; nextPage: number }) => {
    // Check if the target page exists
    if (choice.nextPage >= 0 && choice.nextPage < story.pages.length) {
      setCurrentPageIndex(choice.nextPage);
      setPageHistory([...pageHistory, choice.nextPage]);
      announce(`Selected: ${choice.text}`);
      soundManager.play('choice');
    } else {      // Handle missing page
      announce("Sorry, that part of the story is not available yet.");
      soundManager.play('click');
      console.error(`Story page ${choice.nextPage} not found in story "${story.title}"`);
    }
  };
  
  return (
    <Container 
      role="article" 
      aria-label={`Story: ${story.title}`}
    >      <FloatingBackButton
        onClick={() => {
          onComplete?.();
        }}
        aria-label="Return to story list"
        title="Go back to story list"
        $highContrast={highContrast}
        soundId="click"
      >
        <Home />
      </FloatingBackButton>
      
      <Header>
        <StoryTitle $highContrast={highContrast}>
          {story.title}
        </StoryTitle>
      </Header>
      <ProgressIndicator
        current={currentPageIndex + 1}
        total={story.pages.length}
        showSteps={true}
      />
      
      <StoryViewerContainer $mode={mode}>
        <StoryContent 
          $highContrast={highContrast}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackgroundDecoration $highContrast={highContrast} />
            {currentPage && currentPage.image && (
            <StoryImageContainer>
              <StoryImage 
                src={getOptimizedImageUrl(currentPage.image)}
                alt={`Illustration for page ${currentPageIndex + 1}`}
                $highContrast={highContrast}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `${process.env.PUBLIC_URL || '/kids-learn'}/images/stories/placeholder.png`;
                }}
              />
              <ImageOverlay $highContrast={highContrast} />
            </StoryImageContainer>
          )}<AnimatePresence mode="wait">
            <TextContainer 
              $simplified={useSimplifiedText}
              $highContrast={highContrast}
              $mode={mode}
            >
              <StoryText
                key={currentPageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                $highContrast={highContrast}
                $fontSize={fontSizeMap[fontSize]}
              >                {useSimplifiedText && (
                  <TextModeIndicator
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    $highContrast={highContrast}
                  >
                    Simplified Text
                  </TextModeIndicator>
                )}
                {displayText}
              </StoryText>
            </TextContainer>
          </AnimatePresence>

          {currentPage && currentPage.choices ? (
            <Choices role="menu" aria-label="Story choices">
              {currentPage.choices.map((choice, index) => (
                <ChoiceOptionContainer key={index}>
                  <ChoiceNumber $highContrast={highContrast}>{index + 1}</ChoiceNumber>
                  <ChoiceButton
                    onClick={() => handleChoice(choice)}
                    variant="secondary"
                    soundId="choice"
                    aria-label={`Choice ${index + 1}: ${choice.text}`}
                  >
                    {choice.text}
                  </ChoiceButton>
                </ChoiceOptionContainer>
              ))}
            </Choices>
          ) : (
            <ControlsContainer>
              <NavigationButtonsContainer>
                {pageHistory.length > 1 && (
                  <IconLabelContainer>
                    <IconButton                      onClick={handleBack}
                      active={false}
                      $highContrast={highContrast}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Go back to previous page"
                      title="Previous page"
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconLabel $highContrast={highContrast}>Back</IconLabel>
                  </IconLabelContainer>
                )}
              </NavigationButtonsContainer>
              
              <NavigationButtonsContainer>
                <StoryIcon 
                  category={story.category} 
                  size="medium"
                  title={`${story.title} (${story.category})`}
                />

                {currentPageIndex < story.pages.length - 1 && (
                  <IconLabelContainer>                    <IconButton
                      onClick={handleNext}
                      active={true}
                      $highContrast={highContrast}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Continue to next page"
                      title="Next page"
                    >
                      <ArrowForward />
                    </IconButton>
                    <IconLabel $highContrast={highContrast}>Next</IconLabel>
                  </IconLabelContainer>
                )}
                
                {currentPageIndex === story.pages.length - 1 && (
                  <IconLabelContainer>                    <IconButton
                      onClick={handleStoryComplete}
                      active={true}
                      $highContrast={highContrast}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Finish reading the story"
                      title="Finish Story"
                    >
                      <Celebration />
                    </IconButton>
                    <IconLabel $highContrast={highContrast}>Finish</IconLabel>
                  </IconLabelContainer>
                )}
              </NavigationButtonsContainer>
            </ControlsContainer>
          )}

          <SettingsContainer>
            <FontSizeControl>
              <IconLabelContainer>                <FontSizeButton
                  onClick={() => setFontSize('small')}
                  active={fontSize === 'small'}
                  $highContrast={highContrast}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Small text size"
                  title="Small text size"
                  buttonSize="small"
                >
                  <TextFields style={{ fontSize: '14px' }} />
                </FontSizeButton>
                <IconLabel $highContrast={highContrast}>Small</IconLabel>
              </IconLabelContainer>
              
              <IconLabelContainer>                <FontSizeButton
                  onClick={() => setFontSize('medium')}
                  active={fontSize === 'medium'}
                  $highContrast={highContrast}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Medium text size"
                  title="Medium text size"
                  buttonSize="medium"
                >
                  <TextFields />
                </FontSizeButton>
                <IconLabel $highContrast={highContrast}>Medium</IconLabel>
              </IconLabelContainer>
              
              <IconLabelContainer>                <FontSizeButton
                  onClick={() => setFontSize('large')}
                  active={fontSize === 'large'}
                  $highContrast={highContrast}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Large text size"
                  title="Large text size"
                  buttonSize="large"
                >
                  <TextFields style={{ fontSize: '22px' }} />
                </FontSizeButton>
                <IconLabel $highContrast={highContrast}>Large</IconLabel>
              </IconLabelContainer>
            </FontSizeControl>
            
            <IconLabelContainer>              <ReadAloudButton
                onClick={toggleReadAloud}
                active={isReading}
                $highContrast={highContrast}
                whileTap={{ scale: 0.9 }}
                aria-label={isReading ? "Stop reading aloud" : "Read aloud"}
                title={isReading ? "Stop reading aloud" : "Read aloud"}
              >
                {isReading ? <VolumeMute /> : <VolumeUp />}
              </ReadAloudButton>
              <IconLabel $highContrast={highContrast}>{isReading ? 'Stop' : 'Read'}</IconLabel>
            </IconLabelContainer>

            <IconLabelContainer>              <IconButton
                onClick={toggleTextMode}
                active={useSimplifiedText}
                $highContrast={highContrast}
                whileTap={{ scale: 0.9 }}
                aria-label={useSimplifiedText ? "Show full text" : "Show simplified text"}
                title={useSimplifiedText ? "Show full text" : "Show simplified text"}
              >
                {useSimplifiedText ? <TextIncrease /> : <TextDecrease />}
              </IconButton>
              <IconLabel $highContrast={highContrast}>{useSimplifiedText ? 'Full' : 'Simple'}</IconLabel>            </IconLabelContainer>
          </SettingsContainer>
        </StoryContent>
      </StoryViewerContainer>
    </Container>
  );
};
