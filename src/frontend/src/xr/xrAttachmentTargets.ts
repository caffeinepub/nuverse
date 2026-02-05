// Centralized XR Attachment Target Registry
// Defines supported attachment categories and their prioritized bone name equivalents

export type AttachmentCategory = 'feet' | 'legs' | 'torso' | 'hands' | 'head' | 'back';

export interface AttachmentTarget {
  category: AttachmentCategory;
  primaryBone: string;
  fallbackBones: string[];
  description: string;
}

// Registry of all supported attachment targets with fallback bone names
// Updated to match the generated avatar skeleton bone names
export const XR_ATTACHMENT_TARGETS: Record<string, AttachmentTarget> = {
  // Feet attachments
  LeftFoot: {
    category: 'feet',
    primaryBone: 'LeftFoot',
    fallbackBones: ['Left_Foot', 'leftFoot', 'foot_L', 'Foot_L', 'L_Foot', 'LeftLeg'],
    description: 'Left foot attachment point for shoes and footwear',
  },
  RightFoot: {
    category: 'feet',
    primaryBone: 'RightFoot',
    fallbackBones: ['Right_Foot', 'rightFoot', 'foot_R', 'Foot_R', 'R_Foot', 'RightLeg'],
    description: 'Right foot attachment point for shoes and footwear',
  },

  // Leg attachments
  LeftLeg: {
    category: 'legs',
    primaryBone: 'LeftLeg',
    fallbackBones: ['Left_Leg', 'leftLeg', 'leg_L', 'Leg_L', 'L_Leg', 'LeftLowerLeg', 'LeftUpLeg'],
    description: 'Left leg attachment point for leg accessories',
  },
  RightLeg: {
    category: 'legs',
    primaryBone: 'RightLeg',
    fallbackBones: ['Right_Leg', 'rightLeg', 'leg_R', 'Leg_R', 'R_Leg', 'RightLowerLeg', 'RightUpLeg'],
    description: 'Right leg attachment point for leg accessories',
  },

  // Torso attachments
  Spine: {
    category: 'torso',
    primaryBone: 'Spine',
    fallbackBones: ['spine', 'Spine1', 'Spine2', 'Chest', 'chest', 'Torso', 'torso', 'Hips'],
    description: 'Spine/torso attachment point for back accessories and chest items',
  },
  Chest: {
    category: 'torso',
    primaryBone: 'Chest',
    fallbackBones: ['chest', 'Spine2', 'UpperChest', 'upperChest', 'Spine1', 'Spine'],
    description: 'Chest attachment point for torso accessories',
  },

  // Hand attachments
  LeftHand: {
    category: 'hands',
    primaryBone: 'LeftHand',
    fallbackBones: ['Left_Hand', 'leftHand', 'hand_L', 'Hand_L', 'L_Hand', 'LeftWrist', 'LeftForeArm'],
    description: 'Left hand attachment point for held items and hand accessories',
  },
  RightHand: {
    category: 'hands',
    primaryBone: 'RightHand',
    fallbackBones: ['Right_Hand', 'rightHand', 'hand_R', 'Hand_R', 'R_Hand', 'RightWrist', 'RightForeArm'],
    description: 'Right hand attachment point for held items and hand accessories',
  },

  // Head attachments
  Head: {
    category: 'head',
    primaryBone: 'Head',
    fallbackBones: ['head', 'HEAD', 'Neck', 'neck'],
    description: 'Head attachment point for headwear and head accessories',
  },

  // Back attachments
  Back: {
    category: 'back',
    primaryBone: 'Spine',
    fallbackBones: ['spine', 'Spine1', 'Spine2', 'back', 'Back', 'Chest'],
    description: 'Back attachment point for backpacks and back accessories',
  },
};

// Helper function to get all bone name candidates for a target
export function getBoneCandidates(targetName: string): string[] {
  const target = XR_ATTACHMENT_TARGETS[targetName];
  if (!target) {
    // If target not in registry, return the name itself
    return [targetName];
  }
  return [target.primaryBone, ...target.fallbackBones];
}

// Helper function to get attachment target by category
export function getAttachmentTargetsByCategory(category: AttachmentCategory): AttachmentTarget[] {
  return Object.values(XR_ATTACHMENT_TARGETS).filter((target) => target.category === category);
}

// Helper function to validate if a bone name is a known target
export function isKnownAttachmentTarget(boneName: string): boolean {
  return boneName in XR_ATTACHMENT_TARGETS;
}
