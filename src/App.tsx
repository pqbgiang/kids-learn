import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { InteractiveButton } from './components/common/InteractiveButton';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { colors } from './utils/theme';
import { AlphabetDisplay } from './components/letters/AlphabetDisplay';
import { NumberDisplay } from './components/numbers/NumberDisplay';
import { StoryList } from './components/stories/StoryList';

const AppContainer = styled.div<{ highContrast: boolean }>`
  min-height: 100vh;
  background: ${props => props.highContrast 
    ? colors.highContrast.background 
    : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #B2DFDB 100%)'};
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.text};
  overflow-x: hidden;
  padding: 8px;
  padding-bottom: 100px; /* Increased to make room for bottom navigation */
  border-radius: 4px;
`;

const Navigation = styled.nav<{ highContrast: boolean }>`
  background: ${props => props.highContrast 
    ? colors.highContrast.surface
    : 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)'};
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 15px rgba(33, 150, 243, 0.3), 0 -2px 10px rgba(76, 175, 80, 0.3);
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 32px;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const NavItem = styled(motion.li)<{ highContrast?: boolean }>`
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${props => props.highContrast ? colors.highContrast.text : 'white'};
    text-decoration: none;
    font-size: 0.9rem;
    padding: 8px 16px;
    transition: all 0.3s ease;
    opacity: 0.8;

    span[role="img"] {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }

    &:hover {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
`;

const MainContentContainer = styled.div`
  min-height: calc(100vh - 100px);
  padding: 16px;
  padding-bottom: 100px; /* Increased to make room for bottom navigation */
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main<{ highContrast: boolean }>`
  width: 100%;
  color: ${props => props.highContrast ? colors.highContrast.text : colors.normal.text};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContrastToggleButton = styled(motion.button)<{ highContrast?: boolean }>`
  width: 44px;
  height: 44px;
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: ${props => props.highContrast 
    ? colors.highContrast.surface 
    : '#2196F3'};  /* Changed to blue (#2196F3) to match the home button */
  color: ${props => props.highContrast 
    ? colors.highContrast.text 
    : colors.normal.background};
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);  /* Updated shadow to match blue color */
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.5);
    background: ${props => props.highContrast 
      ? colors.highContrast.surface 
      : '#1976D2'};  /* Slightly darker blue on hover */
  }

  &:active {
    transform: translateY(0);
    background: ${props => props.highContrast 
      ? colors.highContrast.surface 
      : '#0D47A1'};  /* Even darker blue when active */
  }
`;

const App = () => {
  const { highContrast, toggleHighContrast } = useTheme();

  return (
    <Router>
      <AppContainer highContrast={highContrast}>
        <ContrastToggleButton
          onClick={toggleHighContrast}
          highContrast={highContrast}
          aria-pressed={highContrast}
          aria-label={highContrast ? 'Switch to normal mode' : 'Switch to high contrast mode'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {highContrast ? '☀️' : '🌙'}
        </ContrastToggleButton>

        <MainContentContainer>
          <Routes>
            <Route path="/letters" element={<AlphabetDisplay />} />
            <Route path="/numbers" element={<NumberDisplay />} />
            <Route path="/stories" element={<StoryList />} />
            <Route path="/" element={<AlphabetDisplay />} />
          </Routes>
        </MainContentContainer>

        <Navigation highContrast={highContrast}>
          <NavList>
            <NavItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} highContrast={highContrast}>
              <Link to="/letters">
                <span role="img" aria-label="Letters icon">📚</span>
                Letters
              </Link>
            </NavItem>
            <NavItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} highContrast={highContrast}>
              <Link to="/numbers">
                <span role="img" aria-label="Numbers icon">🔢</span>
                Numbers
              </Link>
            </NavItem>
            <NavItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} highContrast={highContrast}>
              <Link to="/stories">
                <span role="img" aria-label="Stories icon">📖</span>
                Stories
              </Link>
            </NavItem>
          </NavList>
        </Navigation>
      </AppContainer>
    </Router>
  );
};

export default App;