// Mock data for A.I.R. Gaming Portal

export type GameType = 'classic' | 'aaa' | 'userCreated';
export type GamePlatform = 'VR' | 'AR' | 'Mobile' | 'Desktop' | 'Console';

export interface Game {
  id: string;
  title: string;
  description: string;
  creator: string;
  type: GameType;
  platforms: GamePlatform[];
  rating: number;
  popularity: number;
  image: string;
  isVRCompatible: boolean;
}

export const mockGames: Game[] = [
  {
    id: 'game-1',
    title: 'Pac-Man',
    description: 'The classic arcade game where you navigate mazes, eat dots, and avoid ghosts. Experience the nostalgia in AR/VR mode.',
    creator: 'Bandai Namco',
    type: 'classic',
    platforms: ['Mobile', 'Desktop', 'VR', 'AR'],
    rating: 4.8,
    popularity: 95,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
  {
    id: 'game-2',
    title: 'NBA Blitz',
    description: 'Fast-paced arcade basketball with over-the-top dunks and no fouls. Play in immersive VR courts.',
    creator: 'Midway Games',
    type: 'classic',
    platforms: ['Console', 'Desktop', 'VR'],
    rating: 4.6,
    popularity: 88,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
  {
    id: 'game-3',
    title: 'GTA: Vice City',
    description: 'Open-world action-adventure set in the 1980s. Explore the city, complete missions, and build your criminal empire.',
    creator: 'Rockstar Games',
    type: 'aaa',
    platforms: ['Console', 'Desktop', 'Mobile'],
    rating: 4.9,
    popularity: 98,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: false,
  },
  {
    id: 'game-4',
    title: 'Neon Runner',
    description: 'A user-created endless runner through cyberpunk cityscapes. Dodge obstacles and collect power-ups in stunning VR.',
    creator: 'CyberDev_42',
    type: 'userCreated',
    platforms: ['VR', 'AR', 'Mobile'],
    rating: 4.3,
    popularity: 72,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
  {
    id: 'game-5',
    title: 'Space Odyssey VR',
    description: 'Explore the cosmos in this user-created space exploration game. Visit planets, mine resources, and build your fleet.',
    creator: 'StarGazer_99',
    type: 'userCreated',
    platforms: ['VR', 'Desktop'],
    rating: 4.5,
    popularity: 81,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
  {
    id: 'game-6',
    title: 'Puzzle Dimension',
    description: 'Mind-bending 3D puzzles created by the community. Solve challenges in AR and compete for the fastest times.',
    creator: 'PuzzleMaster_X',
    type: 'userCreated',
    platforms: ['AR', 'Mobile', 'Desktop'],
    rating: 4.4,
    popularity: 68,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
  {
    id: 'game-7',
    title: 'Street Fighter II',
    description: 'The legendary fighting game that defined a genre. Battle opponents in classic 2D combat.',
    creator: 'Capcom',
    type: 'classic',
    platforms: ['Console', 'Desktop', 'Mobile'],
    rating: 4.7,
    popularity: 90,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: false,
  },
  {
    id: 'game-8',
    title: 'Rhythm Arena',
    description: 'User-created rhythm game where you battle opponents with music. Full VR support with motion tracking.',
    creator: 'BeatMaker_Studio',
    type: 'userCreated',
    platforms: ['VR', 'Desktop'],
    rating: 4.6,
    popularity: 85,
    image: '/assets/generated/gaming-icon.dim_64x64.png',
    isVRCompatible: true,
  },
];
