interface AnimalImage {
  id: string;
  name: string;
  fileName: string;
  sound: string;
  letter: string;
  funFact?: string;
}

export const animalImages: Record<string, AnimalImage[]> = {
  'A': [
    {
      id: 'alligator',
      name: 'Alligator',
      fileName: '/images/animals/alligator.png',
      sound: '/sounds/animals/alligator.mp3',
      letter: 'A',
      funFact: 'Alligators have been around for 37 million years!'
    },
    {
      id: 'ant',
      name: 'Ant',
      fileName: '/images/animals/ant.png',
      sound: '/sounds/animals/ant.mp3',
      letter: 'A',
      funFact: 'Ants can lift 50 times their own body weight!'
    },
    {
      id: 'antelope',
      name: 'Antelope',
      fileName: '/images/animals/antelope.png',
      sound: '/sounds/animals/antelope.mp3',
      letter: 'A',
      funFact: 'Antelopes can run up to 60 miles per hour!'
    }
  ],
  'B': [
    {
      id: 'bear',
      name: 'Bear',
      fileName: '/images/animals/bear.png',
      sound: '/sounds/animals/bear.mp3',
      letter: 'B',
      funFact: 'Bears have excellent senses of smell!'
    },
    {
      id: 'butterfly',
      name: 'Butterfly',
      fileName: '/images/animals/butterfly.png',
      sound: '/sounds/animals/butterfly.mp3',
      letter: 'B',
      funFact: 'Butterflies taste with their feet!'
    },
    {
      id: 'bird',
      name: 'Bird',
      fileName: '/images/animals/bird.png',
      sound: '/sounds/animals/blue-bird.mp3',
      letter: 'B',
      funFact: 'Birds have hollow bones to help them fly!'
    }
  ],
  'C': [
    {
      id: 'cat',
      name: 'Cat',
      fileName: '/images/animals/cat.png',
      sound: '/sounds/animals/cat.mp3',
      letter: 'C',
      funFact: 'Cats spend 70% of their lives sleeping!'
    },
    {
      id: 'cheetah',
      name: 'Cheetah',
      fileName: '/images/animals/cheetah.png',
      sound: '/sounds/animals/cheetah.mp3',
      letter: 'C',
      funFact: 'Cheetahs are the fastest land animal!'
    },
    {
      id: 'cow',
      name: 'Cow',
      fileName: '/images/animals/cow.png',
      sound: '/sounds/animals/cow.mp3',
      letter: 'C',
      funFact: 'Cows have best friends and get stressed when separated!'
    }
  ],
  'D': [
    {
      id: 'dog',
      name: 'Dog',
      fileName: '/images/animals/dog.png',
      sound: '/sounds/animals/dog.mp3',
      letter: 'D',
      funFact: 'A dog\'s sense of smell is 40 times better than ours!'
    },
    {
      id: 'dolphin',
      name: 'Dolphin',
      fileName: '/images/animals/dolphin.png',
      sound: '/sounds/animals/dolphin.mp3',
      letter: 'D',
      funFact: 'Dolphins sleep with one half of their brain at a time!'
    },
    {
      id: 'duck',
      name: 'Duck',
      fileName: '/images/animals/duck.png',
      sound: '/sounds/animals/duck.mp3',
      letter: 'D',
      funFact: 'Ducks have waterproof feathers!'
    }
  ],
  'E': [
    {
      id: 'eagle',
      name: 'Eagle',
      fileName: '/images/animals/eagle.png',
      sound: '/sounds/animals/eagle.mp3',
      letter: 'E',
      funFact: 'Eagles can see their prey from 2 miles away!'
    },
    {
      id: 'elephant',
      name: 'Elephant',
      fileName: '/images/animals/elephant.png',
      sound: '/sounds/animals/elephant.mp3',
      letter: 'E',
      funFact: 'Elephants are the only animals that cannot jump!'
    },
    {
      id: 'ermine',
      name: 'Ermine',
      fileName: '/images/animals/ermine.png',
      sound: '/sounds/animals/ermine.mp3',
      letter: 'E',
      funFact: 'In their winter coat, ermines turn completely white, except for the tip of their tail which stays black'
    }
  ],
  'F': [
    {
      id: 'fox',
      name: 'Fox',
      fileName: '/images/animals/fox.png',
      sound: '/sounds/animals/fox.mp3',
      letter: 'F',
      funFact: 'Foxes use the Earth\'s magnetic field to hunt!'
    },
    {
      id: 'frog',
      name: 'Frog',
      fileName: '/images/animals/frog.png',
      sound: '/sounds/animals/frog.mp3',
      letter: 'F',
      funFact: 'Some frogs can jump 20 times their body length!'
    },
    {
      id: 'fish',
      name: 'Fish',
      fileName: '/images/animals/fish.png',
      sound: '/sounds/animals/fish.mp3',
      letter: 'F',
      funFact: 'Fish can feel pressure changes through their lateral line!'
    }
  ],
  'G': [
    {
      id: 'giraffe',
      name: 'Giraffe',
      fileName: '/images/animals/giraffe.png',
      sound: '/sounds/animals/giraffe.mp3',
      letter: 'G',
      funFact: 'Giraffes have the same number of neck vertebrae as humans!'
    },
    {
      id: 'goat',
      name: 'Goat',
      fileName: '/images/animals/goat.png',
      sound: '/sounds/animals/goat.mp3',
      letter: 'G',
      funFact: 'Goats have rectangular pupils that help them see in the dark!'
    },
    {
      id: 'gorilla',
      name: 'Gorilla',
      fileName: '/images/animals/gorilla.png',
      sound: '/sounds/animals/gorilla.mp3',
      letter: 'G',
      funFact: 'Gorillas share 98% of their DNA with humans!'
    }
  ],
  'H': [
    {
      id: 'hippo',
      name: 'Hippo',
      fileName: '/images/animals/hippo.png',
      sound: '/sounds/animals/hippo.mp3',
      letter: 'H',
      funFact: 'Hippos secrete a natural sunscreen that\'s red!'
    },
    {
      id: 'horse',
      name: 'Horse',
      fileName: '/images/animals/horse.png',
      sound: '/sounds/animals/horse.mp3',
      letter: 'H',
      funFact: 'Horses can sleep standing up!'
    },
    {
      id: 'hamster',
      name: 'Hamster',
      fileName: '/images/animals/hamster.png',
      sound: '/sounds/animals/hamster.mp3',
      letter: 'H',
      funFact: 'Hamsters can store food in their cheek pouches!'
    }
  ],
  'I': [
    {
      id: 'iguana',
      name: 'Iguana',
      fileName: '/images/animals/iguana.png',
      sound: '/sounds/animals/iguana.mp3',
      letter: 'I',
      funFact: 'Iguanas can swim underwater for up to 30 minutes!'
    },    {
      id: 'insect',
      name: 'Insect',
      fileName: '/images/animals/insect.png',
      sound: '/sounds/animals/insect.mp3',
      letter: 'I',
      funFact: 'Insects have been around for more than 400 million years!'
    },
    {
      id: 'ibis',
      name: 'Ibis',
      fileName: '/images/animals/ibis.png',
      sound: '/sounds/animals/ibis.mp3',
      letter: 'I',
      funFact: 'Ibises use their curved beaks to find food in mud!'
    }
  ],
  'J': [
    {
      id: 'jaguar',
      name: 'Jaguar',
      fileName: '/images/animals/jaguar.png',
      sound: '/sounds/animals/jaguar.mp3',
      letter: 'J',
      funFact: 'Jaguars have the strongest bite of any big cat!'
    },
    {
      id: 'jellyfish',
      name: 'Jellyfish',
      fileName: '/images/animals/jellyfish.png',
      sound: '/sounds/animals/jellyfish.mp3',
      letter: 'J',
      funFact: 'Some jellyfish are immortal!'
    },
    {
      id: 'jay',
      name: 'Blue Jay',
      fileName: '/images/animals/jay.png',
      sound: '/sounds/animals/jay.mp3',
      letter: 'J',
      funFact: 'Blue jays can mimic hawk calls!'
    }
  ],
  'K': [
    {
      id: 'kangaroo',
      name: 'Kangaroo',
      fileName: '/images/animals/kangaroo.png',
      sound: '/sounds/animals/kangaroo.mp3',
      letter: 'K',
      funFact: 'Kangaroos cannot walk backwards!'
    },
    {
      id: 'koala',
      name: 'Koala',
      fileName: '/images/animals/koala.png',
      sound: '/sounds/animals/koala.mp3',
      letter: 'K',
      funFact: 'Koalas sleep up to 22 hours a day!'
    },
    {
      id: 'kingfisher',
      name: 'Kingfisher',
      fileName: '/images/animals/kingfisher.png',
      sound: '/sounds/animals/kingfisher.mp3',
      letter: 'K',
      funFact: 'Kingfishers dive at speeds of 25 mph to catch fish!'
    }
  ],
  'L': [
    {
      id: 'lion',
      name: 'Lion',
      fileName: '/images/animals/lion.png',
      sound: '/sounds/animals/lion.mp3',
      letter: 'L',
      funFact: 'A lion\'s roar can be heard from 5 miles away!'
    },
    {
      id: 'leopard',
      name: 'Leopard',
      fileName: '/images/animals/leopard.png',
      sound: '/sounds/animals/leopard.mp3',
      letter: 'L',
      funFact: 'Leopards can carry prey twice their own body weight up trees!'
    },
    {
      id: 'llama',
      name: 'Llama',
      fileName: '/images/animals/llama.png',
      sound: '/sounds/animals/llama.mp3',
      letter: 'L',
      funFact: 'Llamas use humming to communicate with each other!'
    }
  ],
  'M': [
    {
      id: 'monkey',
      name: 'Monkey',
      fileName: '/images/animals/monkey.png',
      sound: '/sounds/animals/monkey.mp3',
      letter: 'M',
      funFact: 'Some monkeys use tools like sticks to find food!'
    },
    {
      id: 'mouse',
      name: 'Mouse',
      fileName: '/images/animals/mouse.png',
      sound: '/sounds/animals/mouse.mp3',
      letter: 'M',
      funFact: 'Mice sing ultrasonic songs to attract mates!'
    },
    {
      id: 'moose',
      name: 'Moose',
      fileName: '/images/animals/moose.png',
      sound: '/sounds/animals/moose.mp3',
      letter: 'M',
      funFact: 'Moose can dive up to 20 feet underwater!'
    }
  ],
  'N': [
    {
      id: 'narwhal',
      name: 'Narwhal',
      fileName: '/images/animals/narwhal.png',
      sound: '/sounds/animals/narwhal.mp3',
      letter: 'N',
      funFact: 'A narwhal\'s tusk is actually a tooth that grows through its lip!'
    },
    {
      id: 'newt',
      name: 'Newt',
      fileName: '/images/animals/newt.png',
      sound: '/sounds/animals/newt.mp3',
      letter: 'N',
      funFact: 'Newts can regrow lost limbs!'
    },
    {
      id: 'nightingale',
      name: 'Nightingale',
      fileName: '/images/animals/nightingale.png',
      sound: '/sounds/animals/nightingale.mp3',
      letter: 'N',
      funFact: 'Nightingales can sing over 1000 different songs!'
    }
  ],
  'O': [
    {
      id: 'octopus',
      name: 'Octopus',
      fileName: '/images/animals/octopus.png',
      sound: '/sounds/animals/octopus.mp3',
      letter: 'O',
      funFact: 'Octopuses have three hearts!'
    },
    {
      id: 'owl',
      name: 'Owl',
      fileName: '/images/animals/owl.png',
      sound: '/sounds/animals/owl.mp3',
      letter: 'O',
      funFact: 'Owls can turn their heads almost all the way around!'
    },
    {
      id: 'otter',
      name: 'Otter',
      fileName: '/images/animals/otter.png',
      sound: '/sounds/animals/otter.mp3',
      letter: 'O',
      funFact: 'Otters hold hands while sleeping to avoid drifting apart!'
    }
  ],
  'P': [
    {
      id: 'penguin',
      name: 'Penguin',
      fileName: '/images/animals/penguin.png',
      sound: '/sounds/animals/penguin.mp3',
      letter: 'P',
      funFact: 'Emperor penguins can dive up to 1800 feet deep!'
    },
    {
      id: 'parrot',
      name: 'Parrot',
      fileName: '/images/animals/parrot.png',
      sound: '/sounds/animals/parrot.mp3',
      letter: 'P',
      funFact: 'Some parrots can live for over 80 years!'
    },
    {
      id: 'panda',
      name: 'Panda',
      fileName: '/images/animals/panda.png',
      sound: '/sounds/animals/panda.mp3',
      letter: 'P',
      funFact: 'Giant pandas eat up to 40 pounds of bamboo every day!'
    }
  ],
  'Q': [
    {
      id: 'quail',
      name: 'Quail',
      fileName: '/images/animals/quail.png',
      sound: '/sounds/animals/quail.mp3',
      letter: 'Q',
      funFact: 'Baby quails can run as soon as they hatch!'
    },
    {
      id: 'quokka',
      name: 'Quokka',
      fileName: '/images/animals/quokka.png',
      sound: '/sounds/animals/quokka.mp3',
      letter: 'Q',
      funFact: 'Quokkas are known as the happiest animals on Earth!'
    },
    {
      id: 'queen-bee',
      name: 'Queen Bee',
      fileName: '/images/animals/queen-bee.png',
      sound: '/sounds/animals/queen-bee.mp3',
      letter: 'Q',
      funFact: 'A queen bee can lay up to 2000 eggs per day!'
    }
  ],
  'R': [
    {
      id: 'rabbit',
      name: 'Rabbit',
      fileName: '/images/animals/rabbit.png',
      sound: '/sounds/animals/rabbit.mp3',
      letter: 'R',
      funFact: 'Rabbits can see behind themselves without turning their heads!'
    },
    {
      id: 'raccoon',
      name: 'Raccoon',
      fileName: '/images/animals/raccoon.png',
      sound: '/sounds/animals/raccoon.mp3',
      letter: 'R',
      funFact: 'Raccoons can remember solutions to problems for up to 3 years!'
    },
    {
      id: 'rhino',
      name: 'Rhino',
      fileName: '/images/animals/rhino.png',
      sound: '/sounds/animals/rhino.mp3',
      letter: 'R',
      funFact: 'A group of rhinos is called a crash!'
    }
  ],
  'S': [
    {
      id: 'snake',
      name: 'Snake',
      fileName: '/images/animals/snake.png',
      sound: '/sounds/animals/snake.mp3',
      letter: 'S',
      funFact: 'Snakes smell with their tongues!'
    },
    {
      id: 'sheep',
      name: 'Sheep',
      fileName: '/images/animals/sheep.png',
      sound: '/sounds/animals/sheep.mp3',
      letter: 'S',
      funFact: 'Sheep have rectangular pupils like goats!'
    },
    {
      id: 'squirrel',
      name: 'Squirrel',
      fileName: '/images/animals/squirrel.png',
      sound: '/sounds/animals/squirrel.mp3',
      letter: 'S',
      funFact: 'Squirrels plant thousands of trees by forgetting where they put their acorns!'
    }
  ],
  'T': [
    {
      id: 'tiger',
      name: 'Tiger',
      fileName: '/images/animals/tiger.png',
      sound: '/sounds/animals/tiger.mp3',
      letter: 'T',
      funFact: 'Every tiger has its own unique stripe pattern!'
    },
    {
      id: 'turtle',
      name: 'Turtle',
      fileName: '/images/animals/turtle.png',
      sound: '/sounds/animals/turtle.mp3',
      letter: 'T',
      funFact: 'Some turtles can breathe through their bottoms!'
    },
    {
      id: 'turkey',
      name: 'Turkey',
      fileName: '/images/animals/turkey.png',
      sound: '/sounds/animals/turkey.mp3',
      letter: 'T',
      funFact: 'Wild turkeys can fly up to 55 mph!'
    }
  ],
  'U': [
    {
      id: 'unicorn',
      name: 'Unicorn',
      fileName: '/images/animals/unicorn.png',
      sound: '/sounds/animals/unicorn.mp3',
      letter: 'U',
      funFact: 'Unicorns are magical creatures from ancient myths!'
    },
    {
      id: 'umbrella-bird',
      name: 'Umbrella Bird',
      fileName: '/images/animals/umbrella-bird.png',
      sound: '/sounds/animals/umbrella-bird.mp3',
      letter: 'U',
      funFact: 'Umbrella birds have a crest that looks like an umbrella!'
    },
    {
      id: 'uakari',
      name: 'Uakari',
      fileName: '/images/animals/uakari.png',
      sound: '/sounds/animals/uakari.mp3',
      letter: 'U',
      funFact: 'Uakaris have bright red faces!'
    }
  ],
  'V': [
    {
      id: 'vulture',
      name: 'Vulture',
      fileName: '/images/animals/vulture.png',
      sound: '/sounds/animals/vulture.mp3',
      letter: 'V',
      funFact: 'Vultures have excellent immune systems!'
    },
    {
      id: 'viper',
      name: 'Viper',
      fileName: '/images/animals/viper.png',
      sound: '/sounds/animals/viper.mp3',
      letter: 'V',
      funFact: 'Vipers can sense heat from their prey!'
    },    {
      id: 'vampire-bat',
      name: 'Vampire Bat',
      fileName: '/images/animals/vampire-bat.png',
      sound: '/sounds/animals/vampire-bat.mp3',
      letter: 'V',
      funFact: 'Vampire bats share food with other bats who didn\'t find a meal!'
    }
  ],
  'W': [
    {
      id: 'wolf',
      name: 'Wolf',
      fileName: '/images/animals/wolf.png',
      sound: '/sounds/animals/wolf.mp3',
      letter: 'W',
      funFact: 'Wolves can hear up to 6 miles away in the forest!'
    },
    {
      id: 'whale',
      name: 'Whale',
      fileName: '/images/animals/whale.png',
      sound: '/sounds/animals/whale.mp3',
      letter: 'W',
      funFact: 'Blue whales are the largest animals that have ever lived!'
    },
    {
      id: 'wombat',
      name: 'Wombat',
      fileName: '/images/animals/wombat.png',
      sound: '/sounds/animals/wombat.mp3',
      letter: 'W',
      funFact: 'Wombat poop is cube-shaped!'
    }
  ],
  'X': [
    {
      id: 'x-ray-fish',
      name: 'X-Ray Fish',
      fileName: '/images/animals/x-ray-fish.png',
      sound: '/sounds/animals/x-ray-fish.mp3',
      letter: 'X',
      funFact: 'X-ray fish are see-through!'
    },
    {
      id: 'xenops',
      name: 'Xenops',
      fileName: '/images/animals/xenops.png',
      sound: '/sounds/animals/xenops.mp3',
      letter: 'X',
      funFact: 'Xenops climb trees like woodpeckers!'
    },
    {
      id: 'xerus',
      name: 'Xerus',
      fileName: '/images/animals/xerus.png',
      sound: '/sounds/animals/xerus.mp3',
      letter: 'X',
      funFact: 'Xerus are ground squirrels that live in Africa!'
    }
  ],
  'Y': [
    {
      id: 'yak',
      name: 'Yak',
      fileName: '/images/animals/yak.png',
      sound: '/sounds/animals/yak.mp3',
      letter: 'Y',
      funFact: 'Yaks can survive at altitudes of over 20,000 feet!'
    },
    {
      id: 'yellow-bird',
      name: 'Yellow Bird',
      fileName: '/images/animals/yellow-bird.png',
      sound: '/sounds/animals/yellow-bird.mp3',
      letter: 'Y',
      funFact: 'Yellow birds use bright colors to attract mates!'
    },
    {
      id: 'yellow-fish',
      name: 'Yellow Fish',
      fileName: '/images/animals/yellow-fish.png',
      sound: '/sounds/animals/yellow-fish.mp3',
      letter: 'Y',
      funFact: 'Yellow fish use their bright color to blend in with coral reefs!'
    }
  ],
  'Z': [
    {
      id: 'zebra',
      name: 'Zebra',
      fileName: '/images/animals/zebra.png',
      sound: '/sounds/animals/zebra.mp3',
      letter: 'Z',
      funFact: 'Each zebra has a unique stripe pattern, like fingerprints!'
    },
    {
      id: 'zoo-snake',
      name: 'Zoo Snake',
      fileName: '/images/animals/zoo-snake.png',
      sound: '/sounds/animals/zoo-snake.mp3',
      letter: 'Z',
      funFact: 'Zoo snakes help control rodent populations!'
    },
    {
      id: 'zebrafish',
      name: 'Zebrafish',
      fileName: '/images/animals/zebrafish.png',
      sound: '/sounds/animals/zebrafish.mp3',
      letter: 'Z',
      funFact: 'Zebrafish can regenerate their fins, skin, and heart tissue!'
    }
  ]
};

export const getAnimalsForLetter = (letter: string): AnimalImage[] => {
  return animalImages[letter.toUpperCase()] || [];
};

export const getAllAnimals = (): AnimalImage[] => {
  return Object.values(animalImages).flat();
};

// Helper function to check if images are loaded
export const preloadImages = async () => {
  const animals = getAllAnimals();
  const imagePromises = animals.map(animal => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = 'kids-learn/' + animal.fileName;
    });
  });
  
  try {
    await Promise.all(imagePromises);
    return true;
  } catch (error) {
    console.error('Failed to preload some images:', error);
    return false;
  }
};