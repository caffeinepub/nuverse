// XR Avatar Asset Manifest
// Static asset paths for the futuristic anime-styled NuVerse avatar

export interface AvatarAssetPaths {
  baseModel: string;
  animations: {
    idle: string;
    action: string;
    victory: string;
  };
}

export const NUVERSE_AVATAR_ASSETS: AvatarAssetPaths = {
  baseModel: '/assets/xr/nuverse-avatar-anime-futuristic.glb',
  animations: {
    idle: '/assets/xr/nuverse-avatar-anime-futuristic.glb',
    action: '/assets/xr/nuverse-avatar-anime-futuristic.glb',
    victory: '/assets/xr/nuverse-avatar-anime-futuristic.glb',
  },
};

export function getAvatarAssetPath(): string {
  return NUVERSE_AVATAR_ASSETS.baseModel;
}

export function getAnimationClipName(stance: 'idle' | 'action' | 'victory'): string {
  // Animation clip names embedded in the GLB file
  const clipNames = {
    idle: 'Idle',
    action: 'Action',
    victory: 'Victory',
  };
  return clipNames[stance];
}
