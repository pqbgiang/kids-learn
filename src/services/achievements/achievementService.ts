import { screenReader } from '../../utils/screenReader';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

class AchievementService {
  private achievements: Achievement[] = [
    {
      id: 'first-letter',
      title: 'Letter Explorer',
      description: 'Learn your first letter',
      icon: '📝',
      unlocked: false
    },
    {
      id: 'alphabet-master',
      title: 'Alphabet Master',
      description: 'Complete the entire alphabet',
      icon: '🎓',
      unlocked: false
    },
    {
      id: 'math-whiz',
      title: 'Math Whiz',
      description: 'Get 5 math answers correct in a row',
      icon: '🔢',
      unlocked: false
    },
    {
      id: 'story-reader',
      title: 'Story Explorer',
      description: 'Complete your first story',
      icon: '📚',
      unlocked: false
    },
    {
      id: 'writing-pro',
      title: 'Writing Pro',
      description: 'Practice writing 10 different letters',
      icon: '✍️',
      unlocked: false
    }
  ];

  private listeners: ((achievement: Achievement) => void)[] = [];

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  unlockAchievement(id: string): void {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      
      // Announce the achievement
      screenReader.announceAchievement(achievement.title);
      
      // Notify listeners
      this.listeners.forEach(listener => listener(achievement));
      
      // Store in localStorage
      this.saveAchievements();
    }
  }

  addListener(listener: (achievement: Achievement) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private saveAchievements(): void {
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  loadAchievements(): void {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.achievements = this.achievements.map(achievement => ({
        ...achievement,
        unlocked: parsed.find((p: Achievement) => p.id === achievement.id)?.unlocked || false,
        unlockedAt: parsed.find((p: Achievement) => p.id === achievement.id)?.unlockedAt
      }));
    }
  }

  // Achievement check methods
  checkLetterProgress(letterIndex: number, totalLetters: number): void {
    if (letterIndex === 0) {
      this.unlockAchievement('first-letter');
    }
    if (letterIndex === totalLetters - 1) {
      this.unlockAchievement('alphabet-master');
    }
  }

  checkMathStreak(streak: number): void {
    if (streak === 5) {
      this.unlockAchievement('math-whiz');
    }
  }

  checkStoryCompletion(): void {
    this.unlockAchievement('story-reader');
  }

  checkWritingPractice(uniqueLetters: number): void {
    if (uniqueLetters === 10) {
      this.unlockAchievement('writing-pro');
    }
  }
}

export const achievementService = new AchievementService();