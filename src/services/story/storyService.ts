import { Story } from '../../types/story';

// Collection of curated public domain stories for children
const sampleStories: Story[] = [  {
    id: 'red-riding-hood',
    title: 'Little Red Riding Hood',
    coverImage: '/images/stories/red-riding-hood-cover.png',
    recommendedAge: 5,
    difficulty: 'easy',
    category: 'fairy-tale',
    featured: true,
    description: 'The classic tale of a little girl in a red hood who meets a wolf on her way to grandmother\'s house.',
    pages: [
      {
        text: 'Once upon a time, there was a little girl who lived in a village near the forest. She always wore a red riding hood, so everyone called her Little Red Riding Hood.',
        image: '/images/stories/red-riding-hood-1.png',
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3'
      },
      {
        text: 'One day, her mother asked her to take some food to her sick grandmother who lived on the other side of the forest.',
        image: '/images/stories/red-riding-hood-2.png',
        soundUrl: '/sounds/stories/red-riding-hood-2.mp3',
        choices: [
          {
            text: 'Take the short path through the forest',
            nextPage: 2
          },
          {
            text: 'Take the long path around the forest',
            nextPage: 3
          }
        ]
      },
      {
        text: 'Little Red Riding Hood took the short path through the forest. While walking, she met a big, bad wolf. The wolf asked her where she was going.',
        image: '/images/stories/red-riding-hood-1.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'Tell the wolf where she is going',
            nextPage: 4
          },
          {
            text: 'Don\'t tell the wolf and continue walking',
            nextPage: 5
          }
        ]
      },
      {
        text: 'Little Red Riding Hood took the long path around the forest. It was a longer walk, but safer. She enjoyed the scenery and picked some flowers for her grandmother.',
        image: '/images/stories/red-riding-hood-2.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-2.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'Continue to grandmother\'s house',
            nextPage: 6
          }
        ]
      },
      {
        text: 'Little Red Riding Hood told the wolf she was going to her grandmother\'s house. The wolf ran ahead to the grandmother\'s house and pretended to be Little Red Riding Hood.',
        image: '/images/stories/red-riding-hood-1.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'Continue to grandmother\'s house',
            nextPage: 7
          }
        ]
      },
      {
        text: 'Little Red Riding Hood didn\'t tell the wolf where she was going. She continued walking and arrived safely at her grandmother\'s house.',
        image: '/images/stories/red-riding-hood-2.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-2.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'Knock on the door',
            nextPage: 8
          }
        ]
      },
      {
        text: 'Little Red Riding Hood arrived at her grandmother\'s house with the flowers she picked. Her grandmother was very happy to see her and loved the flowers.',
        image: '/images/stories/red-riding-hood-1.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'The End',
            nextPage: 9
          }
        ]
      },
      {
        text: 'When Little Red Riding Hood arrived at her grandmother\'s house, she found the wolf in disguise, pretending to be her grandmother.',
        image: '/images/stories/red-riding-hood-2.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-2.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'Ask "Why do you have such big eyes?"',
            nextPage: 10
          }
        ]
      },
      {
        text: 'Little Red Riding Hood knocked on the door, and her real grandmother opened it. They had a wonderful visit, and Little Red Riding Hood safely returned home.',
        image: '/images/stories/red-riding-hood-1.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'The End',
            nextPage: 9
          }
        ]
      },
      {
        text: 'THE END. You have completed this interactive story!',
        image: '/images/stories/red-riding-hood-2.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-2.mp3' // Reusing a sound temporarily
      },
      {
        text: 'Little Red Riding Hood asked, "Grandmother, why do you have such big eyes?" The wolf replied, "All the better to see you with!" Just then, a woodcutter passing by heard the strange conversation and rushed in to save Little Red Riding Hood.',
        image: '/images/stories/red-riding-hood-1.png', // Reusing an image temporarily
        soundUrl: '/sounds/stories/red-riding-hood-1.mp3', // Reusing a sound temporarily
        choices: [
          {
            text: 'The End',
            nextPage: 9
          }
        ]
      }
    ]
  },  {
    id: 'three-little-pigs',
    title: 'The Three Little Pigs',
    coverImage: '/images/stories/three-little-pigs-cover.png',
    recommendedAge: 4,
    difficulty: 'easy',
    category: 'fairy-tale',
    featured: true,
    description: 'Three little pigs build houses of different materials, but which one will protect them from the big bad wolf?',
    pages: [
      {
        text: 'Once upon a time, there were three little pigs who lived with their mother. When they grew up, it was time for them to build their own houses and live on their own.',        image: '/images/stories/three-little-pigs-1.png',
        soundUrl: '/sounds/stories/three-little-pigs-1.mp3'
      },
      {
        text: 'The first little pig built a house of straw because it was the easiest thing to do. The second little pig built a house of sticks. The third little pig worked hard to build a house of bricks.',
        image: '/images/stories/three-little-pigs-2.png',
        soundUrl: '/sounds/stories/three-little-pigs-2.mp3'
      }
      // Full story would have more pages
    ]
  },  {
    id: 'tortoise-and-hare',
    title: 'The Tortoise and the Hare',
    coverImage: '/images/stories/tortoise-and-hare-cover.png',
    recommendedAge: 4,
    difficulty: 'easy',
    category: 'fable',
    featured: false,
    description: 'A classic Aesop\'s fable about a race between a tortoise and a hare that teaches the value of persistence.',
    pages: [
      {
        text: 'Once upon a time, a tortoise and a hare lived in the forest. The hare always made fun of the tortoise for being so slow.',
        image: '/images/stories/tortoise-and-hare-1.png',
        soundUrl: '/sounds/stories/tortoise-and-hare-1.mp3'
      },
      {
        text: '"Why don\'t we have a race?" said the tortoise one day. "That\'s a great joke!" laughed the hare. "You are too slow!"',
        image: '/images/stories/tortoise-and-hare-2.png',
        soundUrl: '/sounds/stories/tortoise-and-hare-2.mp3'
      }
      // Full story would have more pages
    ]
  },  {
    id: 'gingerbread-man',
    title: 'The Gingerbread Man',
    coverImage: '/images/stories/gingerbread-man-cover.png',
    recommendedAge: 3,
    difficulty: 'easy',
    category: 'fairy-tale',
    featured: false,
    description: 'A freshly baked gingerbread man jumps out of the oven and runs away from everyone trying to eat him!',
    pages: [
      {
        text: 'Once upon a time, there was an old woman who loved to bake. One day, she made a gingerbread man cookie.',
        image: '/images/stories/gingerbread-man-1.png',
        soundUrl: '/sounds/stories/gingerbread-man-1.mp3'
      },
      {
        text: 'When she opened the oven, the gingerbread man jumped out and ran away, saying, "Run, run, as fast as you can! You can\'t catch me, I\'m the gingerbread man!"',
        image: '/images/stories/gingerbread-man-2.png',
        soundUrl: '/sounds/stories/gingerbread-man-2.mp3'      }
      // Full story would have more pages
    ]
  },
  {
    id: 'brown-bear',
    title: 'Brown Bear, Brown Bear',
    coverImage: '/images/stories/brown-bear-cover.png',
    recommendedAge: 3,
    difficulty: 'easy',
    category: 'animals',
    featured: true,
    description: 'A simple, colorful story about a brown bear and the other animals it sees.',
    pages: [
      {
        text: 'Brown bear, brown bear, what do you see? I see a red bird looking at me!',
        image: '/images/stories/brown-bear-1.png',
        soundUrl: '/sounds/stories/brown-bear-1.mp3'
      },
      {
        text: 'Red bird, red bird, what do you see? I see a yellow duck looking at me!',
        image: '/images/stories/brown-bear-2.png',
        soundUrl: '/sounds/stories/brown-bear-2.mp3'
      },
      {
        text: 'Yellow duck, yellow duck, what do you see? I see a blue horse looking at me!',
        image: '/images/stories/brown-bear-3.png',
        soundUrl: '/sounds/stories/brown-bear-3.mp3'
      }
      // Full story would have more pages
    ]
  },
  {    id: 'five-little-monkeys',
    title: 'Five Little Monkeys',
    coverImage: '/images/stories/five-little-monkeys-cover.png',
    recommendedAge: 3,
    difficulty: 'easy',
    category: 'rhymes',
    featured: false,
    description: 'Five little monkeys jumping on the bed, one falls off and bumps his head!',
    pages: [
      {
        text: 'Five little monkeys jumping on the bed. One fell off and bumped his head!',
        image: '/images/stories/five-little-monkeys-1.png',
        soundUrl: '/sounds/stories/five-little-monkeys-1.mp3'
      },
      {
        text: 'Mama called the doctor and the doctor said, "No more monkeys jumping on the bed!"',
        image: '/images/stories/five-little-monkeys-2.png',
        soundUrl: '/sounds/stories/five-little-monkeys-2.mp3'
      },
      {
        text: 'Four little monkeys jumping on the bed. One fell off and bumped his head!',
        image: '/images/stories/five-little-monkeys-3.png',
        soundUrl: '/sounds/stories/five-little-monkeys-3.mp3'
      }
      // Full story would have more pages
    ]
  },  {
    id: 'hungry-caterpillar',
    title: 'The Very Hungry Caterpillar',
    coverImage: '/images/stories/hungry-caterpillar-cover.png',
    recommendedAge: 3,
    difficulty: 'easy',
    category: 'animals',
    featured: true,
    description: 'Follow the journey of a hungry caterpillar as it eats through different foods and transforms into a butterfly.',
    pages: [
      {
        text: 'In the light of the moon, a little egg lay on a leaf. One Sunday morning, a tiny caterpillar hatched out of the egg.',
        image: '/images/stories/hungry-caterpillar-1.png',
        soundUrl: '/sounds/stories/hungry-caterpillar-1.mp3'
      },
      {
        text: 'He was very hungry! On Monday, he ate through one apple, but he was still hungry.',
        image: '/images/stories/hungry-caterpillar-2.png',
        soundUrl: '/sounds/stories/hungry-caterpillar-2.mp3'
      },
      {
        text: 'On Tuesday, he ate through two pears, but he was still hungry.',
        image: '/images/stories/hungry-caterpillar-3.png',
        soundUrl: '/sounds/stories/hungry-caterpillar-3.mp3'
      }
      // Full story would have more pages
    ]
  },
  {
    id: 'goldilocks',
    title: 'Goldilocks and the Three Bears',
    coverImage: '/images/stories/goldilocks-cover.png',
    recommendedAge: 4,
    difficulty: 'easy',
    category: 'fairy-tale',
    featured: false,
    description: 'Goldilocks enters the home of three bears and tries their porridge, chairs, and beds.',
    pages: [
      {
        text: 'Once upon a time, there were three bears who lived in a house in the forest: Papa Bear, Mama Bear, and Baby Bear.',
        image: '/images/stories/goldilocks-1.png',
        soundUrl: '/sounds/stories/goldilocks-1.mp3'
      },
      {
        text: 'One day, they made porridge for breakfast, but it was too hot. They decided to go for a walk while it cooled down.',
        image: '/images/stories/goldilocks-2.png',
        soundUrl: '/sounds/stories/goldilocks-2.mp3'
      },
      {
        text: 'While they were gone, a girl named Goldilocks came to their house. She was curious and went inside even though no one was home.',
        image: '/images/stories/goldilocks-3.png',
        soundUrl: '/sounds/stories/goldilocks-3.mp3'
      }
      // Full story would have more pages
    ]
  },  {
    id: 'itsy-bitsy-spider',
    title: 'The Itsy Bitsy Spider',
    coverImage: '/images/stories/itsy-bitsy-spider-cover.png',
    recommendedAge: 3,
    difficulty: 'easy',
    category: 'rhymes',
    featured: false,
    description: 'The classic nursery rhyme about a determined spider climbing up the water spout.',
    pages: [
      {
        text: 'The itsy bitsy spider went up the water spout.',
        image: '/images/stories/itsy-bitsy-spider-1.png',
        soundUrl: '/sounds/stories/itsy-bitsy-spider-1.mp3'
      },
      {
        text: 'Down came the rain and washed the spider out.',
        image: '/images/stories/itsy-bitsy-spider-2.png',
        soundUrl: '/sounds/stories/itsy-bitsy-spider-2.mp3'
      },
      {
        text: 'Out came the sunshine and dried up all the rain. And the itsy bitsy spider went up the spout again!',
        image: '/images/stories/itsy-bitsy-spider-3.png',
        soundUrl: '/sounds/stories/itsy-bitsy-spider-3.mp3'
      }
      // Full story would have more pages
    ]
  },
  {    id: 'three-billy-goats',
    title: 'Three Billy Goats Gruff',
    coverImage: '/images/stories/three-billy-goats-cover.png',
    recommendedAge: 4,
    difficulty: 'medium',
    category: 'fairy-tale',
    featured: false,
    description: 'Three goats must cross a bridge guarded by a mean troll to reach greener pastures.',
    pages: [
      {
        text: 'Once upon a time, there were three billy goats who wanted to cross a bridge to eat the sweet green grass on the other side.',
        image: '/images/stories/three-billy-goats-1.png',
        soundUrl: '/sounds/stories/billy-goats-1.mp3'
      },
      {
        text: 'But under the bridge lived a scary troll who didn\'t let anyone cross.',
        image: '/images/stories/three-billy-goats-2.png',
        soundUrl: '/sounds/stories/billy-goats-2.mp3'
      },
      {
        text: 'The smallest billy goat went first. "Trip, trap, trip, trap" went his hooves on the bridge.',
        image: '/images/stories/three-billy-goats-3.png',
        soundUrl: '/sounds/stories/billy-goats-3.mp3'
      }
      // Full story would have more pages
    ]
  },
  {
    id: 'ugly-duckling',
    title: 'The Ugly Duckling',
    coverImage: '/images/stories/ugly-duckling-cover.png',
    recommendedAge: 5,
    difficulty: 'medium',
    category: 'fairy-tale',
    featured: true,
    description: 'Hans Christian Andersen\'s touching tale about accepting differences and finding where you belong.',
    pages: [
      {
        text: 'In a sunny meadow, Mother Duck was sitting on her nest, waiting for her eggs to hatch. Finally, the eggs began to crack open, one by one.',
        image: '/images/stories/ugly-duckling-1.png',
        soundUrl: '/sounds/stories/ugly-duckling-1.mp3'
      },
      {
        text: 'Out came four perfect little yellow ducklings. But the fifth egg took longer to hatch. When it finally cracked open, out came a duckling that looked different - he was larger, grayish, and not as cute as the others.',
        image: '/images/stories/ugly-duckling-2.png',
        soundUrl: '/sounds/stories/ugly-duckling-2.mp3'
      }
      // Full story would have more pages
    ]
  },
  {    id: 'boy-who-cried-wolf',
    title: 'The Boy Who Cried Wolf',
    coverImage: '/images/stories/boy-who-cried-wolf-cover.png',
    recommendedAge: 6,
    difficulty: 'medium',
    category: 'fable',
    featured: false,
    description: 'Aesop\'s cautionary tale about the consequences of telling lies and losing trust.',
    pages: [
      {
        text: 'There was once a shepherd boy who liked to play tricks. He would cry out, "Wolf! Wolf!" when there was no wolf in sight.',
        image: '/images/stories/boy-who-cried-wolf-1.png',
        soundUrl: '/sounds/stories/crying-wolf-1.mp3'
      },
      {
        text: 'The villagers would come running to help him, only to find that there was no wolf. The boy would laugh at the sight of their angry faces.',
        image: '/images/stories/boy-who-cried-wolf-2.png',
        soundUrl: '/sounds/stories/crying-wolf-2.mp3'
      }
      // Full story would have more pages
    ]
  }
];

export const storyService = {
  getAllStories: (): Story[] => {
    return sampleStories;
  },

  getStoryById: (id: string): Story | undefined => {
    return sampleStories.find(story => story.id === id);
  },

  getStoriesByAge: (age: number): Story[] => {
    return sampleStories.filter(story => story.recommendedAge <= age);
  },

  getStoriesByDifficulty: (difficulty: Story['difficulty']): Story[] => {
    return sampleStories.filter(story => story.difficulty === difficulty);
  },

  getStoriesByCategory: (category: string): Story[] => {
    return sampleStories.filter(story => story.category === category);
  },

  getFeaturedStories: (): Story[] => {
    return sampleStories.filter(story => story.featured);
  },

  searchStories: (query: string): Story[] => {
    const lowercaseQuery = query.toLowerCase();
    return sampleStories.filter(story => {
      return (
        story.title.toLowerCase().includes(lowercaseQuery) ||
        story.description?.toLowerCase().includes(lowercaseQuery) ||
        story.category.toLowerCase().includes(lowercaseQuery)
      );
    });
  },

  getAllCategories: (): string[] => {
    const categories = new Set(sampleStories.map(story => story.category));
    return Array.from(categories);
  }
};