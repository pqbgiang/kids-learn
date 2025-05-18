import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const Announcer = ({ message }: { message: string }) => (
  <div 
    role="alert" 
    aria-live="polite" 
    style={{ 
      position: 'absolute', 
      width: '1px', 
      height: '1px', 
      padding: 0, 
      margin: '-1px', 
      overflow: 'hidden', 
      clip: 'rect(0, 0, 0, 0)', 
      whiteSpace: 'nowrap', 
      border: 0 
    }}
  >
    {message}
  </div>
);

class ScreenReaderManager {
  private static container: HTMLElement | null = null;
  private static root: ReturnType<typeof createRoot> | null = null;

  private static ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.setAttribute('id', 'screen-reader-announcements');
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
    }
    return this.container;
  }

  static announce(message: string, timeout: number = 1000) {
    this.ensureContainer();
    this.root?.render(<Announcer message={message} />);

    // Clear the announcement after timeout
    setTimeout(() => {
      this.root?.render(<Announcer message="" />);
    }, timeout);
  }

  // Achievement announcements
  static announceAchievement(achievement: string) {
    this.announce(`Achievement unlocked: ${achievement}! 🎉`);
  }

  // Progress announcements
  static announceProgress(current: number, total: number, type: string) {
    this.announce(`${type} progress: ${current} out of ${total} complete`);
  }

  // Error announcements
  static announceError(message: string) {
    this.announce(`Error: ${message}`);
  }
}

// React hook for components to use screen reader announcements
export const useScreenReader = () => {
  const [message, setMessage] = useState('');

  const announce = useCallback((newMessage: string, timeout: number = 1000) => {
    setMessage(newMessage);
    ScreenReaderManager.announce(newMessage, timeout);
  }, []);

  const announceAchievement = useCallback((achievement: string) => {
    ScreenReaderManager.announceAchievement(achievement);
  }, []);

  const announceProgress = useCallback((current: number, total: number, type: string) => {
    ScreenReaderManager.announceProgress(current, total, type);
  }, []);

  const announceError = useCallback((errorMessage: string) => {
    ScreenReaderManager.announceError(errorMessage);
  }, []);

  return {
    announce,
    announceAchievement,
    announceProgress,
    announceError,
    message
  };
};

export const screenReader = ScreenReaderManager;