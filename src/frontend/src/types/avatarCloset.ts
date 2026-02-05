// Avatar Closet wardrobe types

export type WardrobeCategory = 'shoes' | 'accessories' | 'outfits';

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  thumbnail?: string;
  color?: string;
}

export interface EquippedLook {
  shoes: string | null;
  accessories: string | null;
  outfits: string | null;
}

export const DEFAULT_EQUIPPED_LOOK: EquippedLook = {
  shoes: null,
  accessories: null,
  outfits: null,
};
