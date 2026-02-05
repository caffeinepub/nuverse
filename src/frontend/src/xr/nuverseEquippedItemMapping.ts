// Mapping from equipped item IDs to XR asset paths and attachment metadata

import { getBoneCandidates } from './xrAttachmentTargets';

export interface EquipmentAttachment {
  assetPath: string;
  attachmentNode: string;
  fallbackNodes?: string[];
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

// Map shoe item IDs to XR assets
const SHOE_ASSET_MAP: Record<string, EquipmentAttachment> = {
  'shoe-1': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'LeftFoot',
    fallbackNodes: getBoneCandidates('LeftFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
  'shoe-2': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'RightFoot',
    fallbackNodes: getBoneCandidates('RightFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
  'shoe-3': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'LeftFoot',
    fallbackNodes: getBoneCandidates('LeftFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
  'shoe-4': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'RightFoot',
    fallbackNodes: getBoneCandidates('RightFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
  'shoe-5': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'LeftFoot',
    fallbackNodes: getBoneCandidates('LeftFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
  'shoe-6': {
    assetPath: '/assets/xr/equipment/shoes/cyber-sneakers-01.glb',
    attachmentNode: 'RightFoot',
    fallbackNodes: getBoneCandidates('RightFoot'),
    scale: { x: 1, y: 1, z: 1 },
  },
};

// Map accessory item IDs to XR assets
const ACCESSORY_ASSET_MAP: Record<string, EquipmentAttachment> = {
  'accessory-1': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'Head',
    fallbackNodes: getBoneCandidates('Head'),
    position: { x: 0, y: 0.1, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  'accessory-2': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'LeftHand',
    fallbackNodes: getBoneCandidates('LeftHand'),
    scale: { x: 0.8, y: 0.8, z: 0.8 },
  },
  'accessory-3': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'RightHand',
    fallbackNodes: getBoneCandidates('RightHand'),
    scale: { x: 0.8, y: 0.8, z: 0.8 },
  },
  'accessory-4': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'Spine',
    fallbackNodes: getBoneCandidates('Back'),
    position: { x: 0, y: 0.2, z: -0.1 },
    scale: { x: 1.2, y: 1.2, z: 1.2 },
  },
  'accessory-5': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'Head',
    fallbackNodes: getBoneCandidates('Head'),
    position: { x: 0, y: 0.15, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  'accessory-6': {
    assetPath: '/assets/xr/equipment/accessories/cyber-accessory-01.glb',
    attachmentNode: 'LeftHand',
    fallbackNodes: getBoneCandidates('LeftHand'),
    scale: { x: 0.9, y: 0.9, z: 0.9 },
  },
};

export function getShoeAttachment(itemId: string | null): EquipmentAttachment | null {
  if (!itemId) return null;
  return SHOE_ASSET_MAP[itemId] || null;
}

export function getAccessoryAttachment(itemId: string | null): EquipmentAttachment | null {
  if (!itemId) return null;
  return ACCESSORY_ASSET_MAP[itemId] || null;
}

export function getAllEquippedAttachments(equippedLook: {
  shoes: string | null;
  accessories: string | null;
  outfits: string | null;
}): EquipmentAttachment[] {
  const attachments: EquipmentAttachment[] = [];

  const shoeAttachment = getShoeAttachment(equippedLook.shoes);
  if (shoeAttachment) {
    attachments.push(shoeAttachment);
  }

  const accessoryAttachment = getAccessoryAttachment(equippedLook.accessories);
  if (accessoryAttachment) {
    attachments.push(accessoryAttachment);
  }

  return attachments;
}
