export interface StoryPage {
  text: string;
  image?: string;
  soundUrl?: string;
  choices?: {
    text: string;
    nextPage: number;
  }[];
}

export interface Story {
  id: string;
  title: string;
  coverImage: string;
  pages: StoryPage[];
  recommendedAge: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  featured?: boolean;
  description?: string;
}