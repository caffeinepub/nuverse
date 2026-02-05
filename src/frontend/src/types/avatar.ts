// Avatar configuration types and constants

export interface AvatarConfig {
  skinTone: SkinTone;
  face: FaceType;
  hair: HairType;
  bodyType: BodyType;
}

export type SkinTone = 'light' | 'medium' | 'tan' | 'brown' | 'dark';
export type FaceType = 'round' | 'oval' | 'square' | 'heart' | 'diamond';
export type HairType = 'short' | 'medium' | 'long' | 'curly' | 'bald' | 'braids';
export type BodyType = 'slim' | 'athletic' | 'average' | 'muscular' | 'plus';

export const SKIN_TONES: { value: SkinTone; label: string; color: string }[] = [
  { value: 'light', label: 'Light', color: '#FFE0BD' },
  { value: 'medium', label: 'Medium', color: '#F1C27D' },
  { value: 'tan', label: 'Tan', color: '#C68642' },
  { value: 'brown', label: 'Brown', color: '#8D5524' },
  { value: 'dark', label: 'Dark', color: '#5C3317' },
];

export const FACE_TYPES: { value: FaceType; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'oval', label: 'Oval' },
  { value: 'square', label: 'Square' },
  { value: 'heart', label: 'Heart' },
  { value: 'diamond', label: 'Diamond' },
];

export const HAIR_TYPES: { value: HairType; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Curly' },
  { value: 'bald', label: 'Bald' },
  { value: 'braids', label: 'Braids' },
];

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'slim', label: 'Slim' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'average', label: 'Average' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'plus', label: 'Plus' },
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: 'medium',
  face: 'oval',
  hair: 'short',
  bodyType: 'average',
};
