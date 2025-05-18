# Instructions to Update StoryViewer with Floating Back Button

1. First, create the FloatingBackButton.tsx file (already done):
```tsx
// FloatingBackButton.tsx
import { styled } from 'styled-components';
import { InteractiveButton } from '../common/InteractiveButton';
import { colors } from '../../utils/theme';

// A floating back button for the StoryViewer
export const FloatingBackButton = styled(InteractiveButton)`
  position: fixed;
  top: 16px;
  left: 16px;
  padding: 8px;
  min-width: auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-shadow: ${props => props.variant === 'high-contrast' ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  background-color: ${props => props.variant === 'high-contrast' ? 'black' : 'rgba(255, 255, 255, 0.9)'};
  border: ${props => props.variant === 'high-contrast' ? '2px solid white' : '2px solid rgba(33, 150, 243, 0.2)'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'high-contrast' ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.15)'};
    background-color: ${props => props.variant === 'high-contrast' ? '#333' : 'white'};
  }
  
  svg {
    color: ${props => props.variant === 'high-contrast' ? 'white' : '#2196F3'};
    font-size: 20px;
  }
`;
```

2. In StoryViewer.tsx, make the following changes:

a) Add the import at the top of the file:
```tsx
import { FloatingBackButton } from './FloatingBackButton';
```

b) Replace the existing BackButton styled component definition with a comment:
```tsx
// BackButton replaced with FloatingBackButton
```

c) Replace all instances of BackButton in the JSX with FloatingBackButton:

For the main component:
```tsx
<FloatingBackButton
  onClick={() => {
    soundManager.play('click'); 
    onComplete?.();
  }}
  whileTap={{ scale: 0.9 }}
  aria-label="Return to story list"
  title="Go back to story list"
  variant={highContrast ? 'high-contrast' : 'secondary'}
>
  <Home />
</FloatingBackButton>
```

For the "Story Not Found" section:
```tsx
<FloatingBackButton 
  onClick={() => {
    soundManager.play('click');
    onComplete?.();
  }}
  whileTap={{ scale: 0.9 }}
  aria-label="Return to story list"
  title="Go back to story list"
  variant="secondary"
>
  <Home />
</FloatingBackButton>
```

Since the file appears to have some syntax issues, it might be better to manually apply these changes to ensure the code works properly.
