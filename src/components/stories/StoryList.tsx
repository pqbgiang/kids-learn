import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '../../types/story';
import { storyService } from '../../services/story/storyService';
import { StoryViewer } from './StoryViewer';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../utils/theme';
import { InteractiveButton } from '../common/InteractiveButton';
import { soundManager } from '../../utils/sound';
import { getOptimizedImageUrl } from '../../utils/imageLoader';

const Container = styled.div`
  padding: 24px;
  min-height: calc(100vh - 120px);
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #FF5722, #FF9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 24px auto;
  line-height: 1.5;
`;

// Search components removed

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const FilterLabel = styled.h3`
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 8px 0;
  text-align: center;
`;

// CategoryContainer replaced by FilterGroup

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 50px;
  border: none;
  background: ${props => props.active ? '#2196F3' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#333'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.active ? '#1976D2' : '#d0d0d0'};
  }
`;

// Category Button removed

// Enhanced AgeButton with different colors and improved visual design based on age
const AgeButton = styled(FilterButton)<{ age?: number }>`
  background: ${props => {
    if (!props.active) return '#f5f5f5';
    
    // Different colors for different ages
    switch(props.age) {
      case 3: return '#4CAF50'; // Green for youngest
      case 4: return '#2196F3'; // Blue
      case 5: return '#9C27B0'; // Purple
      case 6: return '#FF5722'; // Orange
      case 7: return '#F44336'; // Red
      case 8: return '#FF9800'; // Amber
      case 9: return '#009688'; // Teal
      default: return 'linear-gradient(to right, #FF9800, #FF5722)'; // Gradient for "all"
    }
  }};
  
  color: ${props => props.active ? 'white' : '#555'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'};
  padding: ${props => props.active ? '10px 18px' : '8px 16px'};
  
  &:hover {
    background: ${props => {
      if (!props.active) return '#e9e9e9';
      
      // Darker hover variants
      switch(props.age) {
        case 3: return '#388E3C'; // Darker Green
        case 4: return '#1976D2'; // Darker Blue
        case 5: return '#7B1FA2'; // Darker Purple
        case 6: return '#E64A19'; // Darker Orange
        case 7: return '#D32F2F'; // Darker Red
        case 8: return '#F57C00'; // Darker Amber
        case 9: return '#00796B'; // Darker Teal
        default: return 'linear-gradient(to right, #F57C00, #E64A19)'; // Darker gradient
      }
    }};
  }
`;

const FeaturedSection = styled(motion.div)`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 24px 0;
  color: #333;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    margin-left: 16px;
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const StoryCard = styled(motion.div)<{ $highContrast?: boolean }>`
  background: ${props => props.$highContrast ? colors.highContrast.surface : 'white'};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const FeaturedFlag = styled.div`
  position: absolute;
  top: 16px;
  right: -30px;
  background: #FF5722;
  color: white;
  transform: rotate(45deg);
  padding: 8px 32px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CoverImage = styled.img<{ $highContrast?: boolean }>`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: all 0.5s ease;
  filter: ${props => props.$highContrast ? 'grayscale(1) contrast(1.5)' : 'none'};
  
  ${StoryCard}:hover & {
    transform: scale(1.05);
  }
`;

const StoryInfo = styled.div<{ $highContrast?: boolean }>`
  padding: 20px;
  position: relative;
  background: ${props => props.$highContrast ? colors.highContrast.surface : 'white'};
  color: ${props => props.$highContrast ? colors.highContrast.text : 'inherit'};
`;

const StoryTitle = styled.h3`
  margin: 0;
  color: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StoryDescription = styled.p`
  margin: 8px 0 16px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const AgeBadge = styled.span<{ $highContrast?: boolean, age?: number }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  background-color: ${props => {
    if (props.$highContrast) return colors.highContrast.primary;
    
    // Different colors for different ages
    switch(props.age) {
      case 3: return '#4CAF50'; // Green for youngest
      case 4: return '#2196F3'; // Blue
      case 5: return '#9C27B0'; // Purple
      case 6: return '#FF5722'; // Orange
      case 7: return '#F44336'; // Red
      case 8: return '#FF9800'; // Amber
      case 9: return '#009688'; // Teal
      default: return '#FF9800'; // Default orange
    }
  }};
  color: ${props => props.$highContrast ? 'black' : 'white'};
  
  ${StoryCard}:hover & {
    transform: scale(1.05);
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }
  
  & span[role="img"] {
    font-size: 1.1em;
  }
`;

const DifficultyBadge = styled.span<{ difficulty: Story['difficulty'], $highContrast?: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.$highContrast) return colors.highContrast.secondary;
    switch (props.difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#F44336';
      default: return '#4CAF50';
    }
  }};
  color: ${props => props.$highContrast ? 'black' : 'white'};
`;

const NoResults = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 1.2rem;
  color: #666;
`;

const CategoryBadge = styled.span`
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  background-color: #E1F5FE;
  color: #0288D1;
  margin-right: 8px;
`;

export const StoryList: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedAge, setSelectedAge] = useState<number | 'all'>('all');
  const { highContrast } = useTheme();
  const allStories = storyService.getAllStories();
  const featuredStories = storyService.getFeaturedStories();
  
  // Get available ages from the stories
  const ages = Array.from(new Set(allStories.map(story => story.recommendedAge))).sort((a, b) => a - b);
    // Filter stories based only on age (removed search and category filters)
  const filteredStories = allStories.filter(story => {
    const matchesAge = selectedAge === 'all' || story.recommendedAge === selectedAge;
    return matchesAge;
  });
  
  const handleStoryComplete = () => {
    setSelectedStory(null);
    // Play a completion sound
    soundManager.play('success');
  };
  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    // Play a selection sound
    soundManager.play('click');
  };
  
  const handleAgeSelect = (age: number | 'all') => {
    setSelectedAge(age);
    // Play a filter sound
    soundManager.play('tap');
  };

  useEffect(() => {
    // Preload sounds
    soundManager.loadSound('click', '/sounds/common/click.mp3');
    soundManager.loadSound('tap', '/sounds/common/tap.mp3');
    soundManager.loadSound('success', '/sounds/common/success.mp3');
  }, []);

  if (selectedStory) {
    return <StoryViewer story={selectedStory} onComplete={handleStoryComplete} />;
  }  return (
    <Container>
      <Header>
        <Title>Magical Story Time</Title>
        <Description>Choose a story perfect for your child's age. Each story is designed with age-appropriate content and reading level.</Description>
      </Header>
      <FiltersSection>
        <FilterGroup>
          <FilterLabel>Age Group</FilterLabel>
          <div>
            <AgeButton
              active={selectedAge === 'all'}
              onClick={() => handleAgeSelect('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={selectedAge === 'all'}
            >
              All Ages
            </AgeButton>
            {ages.map((age) => (
              <AgeButton
                key={age}
                age={age}
                active={selectedAge === age}
                onClick={() => handleAgeSelect(age)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={selectedAge === age}
              >
                {age}+ years
              </AgeButton>
            ))}
          </div>
        </FilterGroup>
      </FiltersSection>
        <AnimatePresence>
        {featuredStories.length > 0 && selectedAge === 'all' && (
          <FeaturedSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle>
              <span role="img" aria-hidden="true" style={{ marginRight: '8px' }}>✨</span> 
              Featured Stories
            </SectionTitle>
            <FeaturedGrid>
              {featuredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  $highContrast={highContrast}
                >
                  <FeaturedFlag>Featured</FeaturedFlag>
                  <CoverImage 
                    src={getOptimizedImageUrl(story.coverImage)} 
                    alt={story.title} 
                    $highContrast={highContrast} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `${process.env.PUBLIC_URL || '/kids-learn'}/images/stories/placeholder.png`;
                    }}
                  />                  <StoryInfo $highContrast={highContrast}>
                    <StoryTitle>{story.title}</StoryTitle>
                    <StoryDescription>{story.description}</StoryDescription>
                    <Details>
                      <AgeBadge $highContrast={highContrast} age={story.recommendedAge}>
                        <span role="img" aria-hidden="true">👶</span> {story.recommendedAge}+
                      </AgeBadge>
                      <DifficultyBadge difficulty={story.difficulty} $highContrast={highContrast}>
                        {story.difficulty}
                      </DifficultyBadge>
                    </Details>
                  </StoryInfo>
                </StoryCard>
              ))}
            </FeaturedGrid>
          </FeaturedSection>
        )}
      </AnimatePresence>      <SectionTitle>
        {selectedAge !== 'all' 
          ? `Stories for Ages ${selectedAge}+`
          : 'All Stories'}
      </SectionTitle>
      
      {filteredStories.length > 0 ? (
        <Grid>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              onClick={() => handleStoryClick(story)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
              $highContrast={highContrast}
            >
              <CoverImage 
                src={getOptimizedImageUrl(story.coverImage)} 
                alt={story.title} 
                $highContrast={highContrast}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `${process.env.PUBLIC_URL || '/kids-learn'}/images/stories/placeholder.png`;
                }}
              />              <StoryInfo $highContrast={highContrast}>
                <StoryTitle>{story.title}</StoryTitle>
                <Details>
                  <AgeBadge $highContrast={highContrast} age={story.recommendedAge}>
                    <span role="img" aria-hidden="true">👶</span> {story.recommendedAge}+
                  </AgeBadge>
                  <DifficultyBadge difficulty={story.difficulty} $highContrast={highContrast}>
                    {story.difficulty}
                  </DifficultyBadge>
                </Details>
              </StoryInfo>
            </StoryCard>
          ))}
        </Grid>      ) : (        <NoResults>
          <h3>No stories found</h3>
          <p>Try a different age group</p>
          <InteractiveButton
            onClick={() => {
              setSelectedAge('all');
            }}
            variant="secondary"
            soundId="click"
          >
            Show All Ages
          </InteractiveButton>
        </NoResults>
      )}
    </Container>
  );
};