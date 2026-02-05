import { WardrobeItem } from '../types/avatarCloset';

export const WARDROBE_SHOES: WardrobeItem[] = [
  { id: 'shoe-1', name: 'Neon Runners', category: 'shoes', color: '#00FFFF' },
  { id: 'shoe-2', name: 'Classic Sneakers', category: 'shoes', color: '#FFFFFF' },
  { id: 'shoe-3', name: 'Sport Kicks', category: 'shoes', color: '#FF4500' },
  { id: 'shoe-4', name: 'Urban Boots', category: 'shoes', color: '#1a1a1a' },
  { id: 'shoe-5', name: 'Glow Trainers', category: 'shoes', color: '#FF00FF' },
  { id: 'shoe-6', name: 'Street Style', category: 'shoes', color: '#FFD700' },
];

export const WARDROBE_ACCESSORIES: WardrobeItem[] = [
  { id: 'acc-1', name: 'Smart Watch', category: 'accessories', color: '#4169E1' },
  { id: 'acc-2', name: 'Neon Bracelet', category: 'accessories', color: '#00FF00' },
  { id: 'acc-3', name: 'AR Glasses', category: 'accessories', color: '#FF1493' },
  { id: 'acc-4', name: 'LED Headband', category: 'accessories', color: '#FFD700' },
  { id: 'acc-5', name: 'Holo Badge', category: 'accessories', color: '#00FFFF' },
  { id: 'acc-6', name: 'Tech Gloves', category: 'accessories', color: '#9370DB' },
];

export const WARDROBE_OUTFITS: WardrobeItem[] = [
  { id: 'outfit-1', name: 'Cyber Jacket', category: 'outfits', color: '#1E90FF' },
  { id: 'outfit-2', name: 'Street Hoodie', category: 'outfits', color: '#FF6347' },
  { id: 'outfit-3', name: 'Tech Suit', category: 'outfits', color: '#2F4F4F' },
  { id: 'outfit-4', name: 'Neon Vest', category: 'outfits', color: '#FF00FF' },
  { id: 'outfit-5', name: 'Urban Coat', category: 'outfits', color: '#696969' },
  { id: 'outfit-6', name: 'Sport Jersey', category: 'outfits', color: '#32CD32' },
];

export function getItemsByCategory(category: 'shoes' | 'accessories' | 'outfits'): WardrobeItem[] {
  switch (category) {
    case 'shoes':
      return WARDROBE_SHOES;
    case 'accessories':
      return WARDROBE_ACCESSORIES;
    case 'outfits':
      return WARDROBE_OUTFITS;
    default:
      return [];
  }
}

export function getItemById(id: string): WardrobeItem | undefined {
  return [...WARDROBE_SHOES, ...WARDROBE_ACCESSORIES, ...WARDROBE_OUTFITS].find(
    (item) => item.id === id
  );
}
