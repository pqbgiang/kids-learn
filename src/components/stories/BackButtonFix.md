# How to Update the BackButton in StoryViewer.tsx

Follow these steps to update the back button in StoryViewer.tsx to a floating style:

1. Import the new `FloatingBackButton` component at the top of the file:

```tsx
import { FloatingBackButton } from './FloatingBackButton';
```

2. Replace the current `BackButton` usage in the main return statement with:

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

3. Replace the current `BackButton` usage in the "Story Not Found" section with:

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

4. Remove the old `BackButton` styled component definition from the file.

This approach ensures the back button is fixed in the top left corner of the screen, floating over the content, and maintains all interactive features.
