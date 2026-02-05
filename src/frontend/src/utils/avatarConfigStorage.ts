import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types/avatar';

const STORAGE_KEY = 'nuverse_avatar_config_v1';

export function saveAvatarConfig(config: AvatarConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save avatar config:', error);
    throw new Error('Failed to save avatar configuration');
  }
}

export function loadAvatarConfig(): AvatarConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Basic validation
    if (
      parsed &&
      typeof parsed === 'object' &&
      'skinTone' in parsed &&
      'face' in parsed &&
      'hair' in parsed &&
      'bodyType' in parsed
    ) {
      return parsed as AvatarConfig;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load avatar config:', error);
    return null;
  }
}

export function clearAvatarConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear avatar config:', error);
  }
}

export function getDefaultConfig(): AvatarConfig {
  return { ...DEFAULT_AVATAR_CONFIG };
}
