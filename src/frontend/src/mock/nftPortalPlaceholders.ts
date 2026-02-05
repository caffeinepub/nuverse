// Placeholder data for NFT Portal
export interface PlaceholderNFT {
  id: string;
  name: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  creator: string;
  collection: string;
  description: string;
}

export const SHOW_EMPTY_STATE = false; // Toggle to test empty state

export const placeholderNFTs: PlaceholderNFT[] = [
  {
    id: 'nft-1',
    name: 'Neon Runner Pro',
    image: '/assets/generated/sneaker-neon-blue.dim_400x300.png',
    rarity: 'Legendary',
    creator: 'NuTech Studios',
    collection: 'Elite Runners',
    description: 'A legendary shoe NFT with holographic effects and premium performance tracking. Limited edition with only 100 minted worldwide.',
  },
  {
    id: 'nft-2',
    name: 'LED Sports Elite',
    image: '/assets/generated/led-sports-shoe.dim_400x300.png',
    rarity: 'Epic',
    creator: 'Digital Footwear Co.',
    collection: 'Sports Collection',
    description: 'Epic-tier sports shoe with integrated LED display and real-time performance metrics. Syncs with your OLED devices.',
  },
  {
    id: 'nft-3',
    name: 'Holographic Custom',
    image: '/assets/generated/custom-holographic-sneaker.dim_400x300.png',
    rarity: 'Rare',
    creator: 'CustomKicks DAO',
    collection: 'Custom Designs',
    description: 'Rare custom design featuring holographic patterns and unique color schemes. Fully customizable in the Designer studio.',
  },
  {
    id: 'nft-4',
    name: 'Red Runner Classic',
    image: '/assets/generated/running-shoe-red.dim_400x300.png',
    rarity: 'Common',
    creator: 'NuVerse Collective',
    collection: 'Classic Series',
    description: 'A classic running shoe NFT with timeless design. Perfect for everyday wear and casual gaming.',
  },
  {
    id: 'nft-5',
    name: 'Cyber Sprint X',
    image: '/assets/generated/sneaker-neon-blue.dim_400x300.png',
    rarity: 'Epic',
    creator: 'FutureFoot Labs',
    collection: 'Cyber Collection',
    description: 'Epic cyber-themed sneaker with advanced motion tracking and AR integration. Exclusive to NuVerse platform.',
  },
  {
    id: 'nft-6',
    name: 'Quantum Leap',
    image: '/assets/generated/led-sports-shoe.dim_400x300.png',
    rarity: 'Legendary',
    creator: 'Quantum Designs',
    collection: 'Quantum Series',
    description: 'Legendary quantum-inspired design with particle effects and next-gen performance analytics. Ultra-rare collectible.',
  },
];
