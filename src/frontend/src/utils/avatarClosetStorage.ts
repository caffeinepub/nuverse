import { EquippedLook, DEFAULT_EQUIPPED_LOOK } from '../types/avatarCloset';

const STORAGE_KEY = 'nuverse_avatar_closet_v1';

export function saveEquippedLook(look: EquippedLook): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(look));
  } catch (error) {
    console.error('Failed to save equipped look:', error);
    throw new Error('Failed to save equipped look');
  }
}

export function loadEquippedLook(): EquippedLook | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Basic validation
    if (
      parsed &&
      typeof parsed === 'object' &&
      'shoes' in parsed &&
      'accessories' in parsed &&
      'outfits' in parsed
    ) {
      return parsed as EquippedLook;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load equipped look:', error);
    return null;
  }
}

export function clearEquippedLook(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear equipped look:', error);
  }
}

export function getDefaultEquippedLook(): EquippedLook {
  return { ...DEFAULT_EQUIPPED_LOOK };
}
