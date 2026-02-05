// TypeScript types for VR Space Builder

export type LayoutType = 'openWorld' | 'roomBased' | 'arena' | 'gallery';

export interface SceneObject {
  id: string;
  name: string;
  type: 'primitive' | 'model' | 'light' | 'effect';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  color: string;
  texture: string;
}

export interface VRSpaceRules {
  maxUsers: number;
  allowVoiceChat: boolean;
  allowObjectInteraction: boolean;
  moderationLevel: 'open' | 'moderate' | 'strict';
}

export interface EnvironmentSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  moodPreset: 'day' | 'night' | 'sunset' | 'neon' | 'custom';
}

export interface VRSpaceDraft {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'nightclub' | 'classroom' | 'custom';
  layout: LayoutType;
  sceneObjects: SceneObject[];
  rules: VRSpaceRules;
  environment: EnvironmentSettings;
  createdAt: number;
  updatedAt: number;
}

export interface PublishedVRSpace extends VRSpaceDraft {
  publishedAt: number;
  isLive: boolean;
  users: number;
}
