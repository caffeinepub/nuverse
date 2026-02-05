// Utility to programmatically generate a rigged anime-style avatar with animations
// This file generates the avatar model that should be exported to /assets/xr/nuverse-avatar-anime-futuristic.glb

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Anime-style proportions
const ANIME_PROPORTIONS = {
  headScale: 1.3, // Larger head for anime aesthetic
  bodyHeight: 1.5,
  legLength: 0.9,
  armLength: 0.7,
};

// Bone structure matching XR attachment targets
const BONE_NAMES = {
  hips: 'Hips',
  spine: 'Spine',
  spine1: 'Spine1',
  spine2: 'Spine2',
  chest: 'Chest',
  neck: 'Neck',
  head: 'Head',
  leftShoulder: 'LeftShoulder',
  leftArm: 'LeftArm',
  leftForeArm: 'LeftForeArm',
  leftHand: 'LeftHand',
  rightShoulder: 'RightShoulder',
  rightArm: 'RightArm',
  rightForeArm: 'RightForeArm',
  rightHand: 'RightHand',
  leftUpLeg: 'LeftUpLeg',
  leftLeg: 'LeftLeg',
  leftFoot: 'LeftFoot',
  rightUpLeg: 'RightUpLeg',
  rightLeg: 'RightLeg',
  rightFoot: 'RightFoot',
};

export class AnimeAvatarGenerator {
  private scene: THREE.Scene;
  private skeleton: THREE.Skeleton;
  private bones: Map<string, THREE.Bone>;
  private skinnedMesh: THREE.SkinnedMesh;

  constructor() {
    this.scene = new THREE.Scene();
    this.bones = new Map();
    this.skeleton = null as any;
    this.skinnedMesh = null as any;
  }

  // Create the complete rigged avatar
  generate(): THREE.Group {
    const avatarGroup = new THREE.Group();
    avatarGroup.name = 'NuVerseAvatar';

    // Create skeleton
    this.createSkeleton();

    // Create mesh geometry
    const geometry = this.createAnimeBodyGeometry();

    // Create cyber-streetwear material
    const material = this.createCyberMaterial();

    // Create skinned mesh
    this.skinnedMesh = new THREE.SkinnedMesh(geometry, material);
    this.skinnedMesh.name = 'AvatarBody';

    // Bind skeleton to mesh
    const rootBone = this.bones.get(BONE_NAMES.hips)!;
    this.skeleton = new THREE.Skeleton(Array.from(this.bones.values()));
    this.skinnedMesh.bind(this.skeleton);

    // Add bones to group
    avatarGroup.add(rootBone);
    avatarGroup.add(this.skinnedMesh);

    // Create animations
    const animations = this.createAnimations();
    (avatarGroup as any).animations = animations;

    return avatarGroup;
  }

  // Create humanoid skeleton with anime proportions
  private createSkeleton(): void {
    // Root bone (Hips)
    const hips = new THREE.Bone();
    hips.name = BONE_NAMES.hips;
    hips.position.set(0, 1.0, 0);
    this.bones.set(BONE_NAMES.hips, hips);

    // Spine chain
    const spine = new THREE.Bone();
    spine.name = BONE_NAMES.spine;
    spine.position.set(0, 0.1, 0);
    hips.add(spine);
    this.bones.set(BONE_NAMES.spine, spine);

    const spine1 = new THREE.Bone();
    spine1.name = BONE_NAMES.spine1;
    spine1.position.set(0, 0.15, 0);
    spine.add(spine1);
    this.bones.set(BONE_NAMES.spine1, spine1);

    const spine2 = new THREE.Bone();
    spine2.name = BONE_NAMES.spine2;
    spine2.position.set(0, 0.15, 0);
    spine1.add(spine2);
    this.bones.set(BONE_NAMES.spine2, spine2);

    const chest = new THREE.Bone();
    chest.name = BONE_NAMES.chest;
    chest.position.set(0, 0.15, 0);
    spine2.add(chest);
    this.bones.set(BONE_NAMES.chest, chest);

    // Neck and Head
    const neck = new THREE.Bone();
    neck.name = BONE_NAMES.neck;
    neck.position.set(0, 0.15, 0);
    chest.add(neck);
    this.bones.set(BONE_NAMES.neck, neck);

    const head = new THREE.Bone();
    head.name = BONE_NAMES.head;
    head.position.set(0, 0.1, 0);
    neck.add(head);
    this.bones.set(BONE_NAMES.head, head);

    // Left arm chain
    const leftShoulder = new THREE.Bone();
    leftShoulder.name = BONE_NAMES.leftShoulder;
    leftShoulder.position.set(0.15, 0.1, 0);
    chest.add(leftShoulder);
    this.bones.set(BONE_NAMES.leftShoulder, leftShoulder);

    const leftArm = new THREE.Bone();
    leftArm.name = BONE_NAMES.leftArm;
    leftArm.position.set(0.15, 0, 0);
    leftShoulder.add(leftArm);
    this.bones.set(BONE_NAMES.leftArm, leftArm);

    const leftForeArm = new THREE.Bone();
    leftForeArm.name = BONE_NAMES.leftForeArm;
    leftForeArm.position.set(0.25, 0, 0);
    leftArm.add(leftForeArm);
    this.bones.set(BONE_NAMES.leftForeArm, leftForeArm);

    const leftHand = new THREE.Bone();
    leftHand.name = BONE_NAMES.leftHand;
    leftHand.position.set(0.2, 0, 0);
    leftForeArm.add(leftHand);
    this.bones.set(BONE_NAMES.leftHand, leftHand);

    // Right arm chain (mirrored)
    const rightShoulder = new THREE.Bone();
    rightShoulder.name = BONE_NAMES.rightShoulder;
    rightShoulder.position.set(-0.15, 0.1, 0);
    chest.add(rightShoulder);
    this.bones.set(BONE_NAMES.rightShoulder, rightShoulder);

    const rightArm = new THREE.Bone();
    rightArm.name = BONE_NAMES.rightArm;
    rightArm.position.set(-0.15, 0, 0);
    rightShoulder.add(rightArm);
    this.bones.set(BONE_NAMES.rightArm, rightArm);

    const rightForeArm = new THREE.Bone();
    rightForeArm.name = BONE_NAMES.rightForeArm;
    rightForeArm.position.set(-0.25, 0, 0);
    rightArm.add(rightForeArm);
    this.bones.set(BONE_NAMES.rightForeArm, rightForeArm);

    const rightHand = new THREE.Bone();
    rightHand.name = BONE_NAMES.rightHand;
    rightHand.position.set(-0.2, 0, 0);
    rightForeArm.add(rightHand);
    this.bones.set(BONE_NAMES.rightHand, rightHand);

    // Left leg chain
    const leftUpLeg = new THREE.Bone();
    leftUpLeg.name = BONE_NAMES.leftUpLeg;
    leftUpLeg.position.set(0.1, -0.05, 0);
    hips.add(leftUpLeg);
    this.bones.set(BONE_NAMES.leftUpLeg, leftUpLeg);

    const leftLeg = new THREE.Bone();
    leftLeg.name = BONE_NAMES.leftLeg;
    leftLeg.position.set(0, -0.45, 0);
    leftUpLeg.add(leftLeg);
    this.bones.set(BONE_NAMES.leftLeg, leftLeg);

    const leftFoot = new THREE.Bone();
    leftFoot.name = BONE_NAMES.leftFoot;
    leftFoot.position.set(0, -0.45, 0);
    leftLeg.add(leftFoot);
    this.bones.set(BONE_NAMES.leftFoot, leftFoot);

    // Right leg chain (mirrored)
    const rightUpLeg = new THREE.Bone();
    rightUpLeg.name = BONE_NAMES.rightUpLeg;
    rightUpLeg.position.set(-0.1, -0.05, 0);
    hips.add(rightUpLeg);
    this.bones.set(BONE_NAMES.rightUpLeg, rightUpLeg);

    const rightLeg = new THREE.Bone();
    rightLeg.name = BONE_NAMES.rightLeg;
    rightLeg.position.set(0, -0.45, 0);
    rightUpLeg.add(rightLeg);
    this.bones.set(BONE_NAMES.rightLeg, rightLeg);

    const rightFoot = new THREE.Bone();
    rightFoot.name = BONE_NAMES.rightFoot;
    rightFoot.position.set(0, -0.45, 0);
    rightLeg.add(rightFoot);
    this.bones.set(BONE_NAMES.rightFoot, rightFoot);
  }

  // Create anime-proportioned body geometry
  private createAnimeBodyGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // Simplified humanoid mesh with anime proportions
    const vertices: number[] = [];
    const indices: number[] = [];
    const skinIndices: number[] = [];
    const skinWeights: number[] = [];
    const uvs: number[] = [];

    // Helper to add a vertex with skinning
    const addVertex = (
      x: number,
      y: number,
      z: number,
      boneIndices: number[],
      weights: number[],
      u: number,
      v: number
    ) => {
      vertices.push(x, y, z);
      skinIndices.push(...boneIndices);
      skinWeights.push(...weights);
      uvs.push(u, v);
    };

    // Get bone indices
    const boneArray = Array.from(this.bones.values());
    const getBoneIndex = (name: string) => boneArray.findIndex((b) => b.name === name);

    const headIdx = getBoneIndex(BONE_NAMES.head);
    const chestIdx = getBoneIndex(BONE_NAMES.chest);
    const hipsIdx = getBoneIndex(BONE_NAMES.hips);
    const leftArmIdx = getBoneIndex(BONE_NAMES.leftArm);
    const rightArmIdx = getBoneIndex(BONE_NAMES.rightArm);
    const leftLegIdx = getBoneIndex(BONE_NAMES.leftLeg);
    const rightLegIdx = getBoneIndex(BONE_NAMES.rightLeg);

    // Head (larger for anime style)
    const headSize = 0.25 * ANIME_PROPORTIONS.headScale;
    const headY = 1.85;
    addVertex(0, headY, 0, [headIdx, 0, 0, 0], [1, 0, 0, 0], 0.5, 1.0); // top
    addVertex(headSize, headY - headSize, 0, [headIdx, 0, 0, 0], [1, 0, 0, 0], 0.75, 0.75);
    addVertex(-headSize, headY - headSize, 0, [headIdx, 0, 0, 0], [1, 0, 0, 0], 0.25, 0.75);
    addVertex(0, headY - headSize, headSize, [headIdx, 0, 0, 0], [1, 0, 0, 0], 0.5, 0.75);
    addVertex(0, headY - headSize, -headSize, [headIdx, 0, 0, 0], [1, 0, 0, 0], 0.5, 0.75);

    // Torso
    const torsoTop = 1.55;
    const torsoBottom = 1.0;
    const torsoWidth = 0.25;
    addVertex(torsoWidth, torsoTop, 0, [chestIdx, 0, 0, 0], [1, 0, 0, 0], 0.75, 0.6);
    addVertex(-torsoWidth, torsoTop, 0, [chestIdx, 0, 0, 0], [1, 0, 0, 0], 0.25, 0.6);
    addVertex(torsoWidth, torsoBottom, 0, [hipsIdx, 0, 0, 0], [1, 0, 0, 0], 0.75, 0.4);
    addVertex(-torsoWidth, torsoBottom, 0, [hipsIdx, 0, 0, 0], [1, 0, 0, 0], 0.25, 0.4);

    // Arms (simplified)
    const armY = 1.5;
    addVertex(0.4, armY, 0, [leftArmIdx, 0, 0, 0], [1, 0, 0, 0], 0.9, 0.5);
    addVertex(0.8, armY - 0.6, 0, [leftArmIdx, 0, 0, 0], [1, 0, 0, 0], 1.0, 0.3);
    addVertex(-0.4, armY, 0, [rightArmIdx, 0, 0, 0], [1, 0, 0, 0], 0.1, 0.5);
    addVertex(-0.8, armY - 0.6, 0, [rightArmIdx, 0, 0, 0], [1, 0, 0, 0], 0.0, 0.3);

    // Legs
    const legTop = 0.95;
    const legBottom = 0.05;
    addVertex(0.12, legTop, 0, [hipsIdx, 0, 0, 0], [1, 0, 0, 0], 0.6, 0.35);
    addVertex(0.12, legBottom, 0, [leftLegIdx, 0, 0, 0], [1, 0, 0, 0], 0.6, 0.0);
    addVertex(-0.12, legTop, 0, [hipsIdx, 0, 0, 0], [1, 0, 0, 0], 0.4, 0.35);
    addVertex(-0.12, legBottom, 0, [rightLegIdx, 0, 0, 0], [1, 0, 0, 0], 0.4, 0.0);

    // Simple triangulation (placeholder - real model would have proper topology)
    const triIndices = [
      0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, // head
      5, 6, 7, 6, 8, 7, // torso
      5, 9, 10, 6, 11, 12, // arms
      13, 14, 15, 15, 16, 13, // legs
    ];
    indices.push(...triIndices);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  // Create cyber-streetwear material
  private createCyberMaterial(): THREE.Material {
    return new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
  }

  // Create animation clips
  private createAnimations(): THREE.AnimationClip[] {
    const clips: THREE.AnimationClip[] = [];

    // Idle animation
    clips.push(this.createIdleAnimation());

    // Action animation
    clips.push(this.createActionAnimation());

    // Victory animation
    clips.push(this.createVictoryAnimation());

    return clips;
  }

  private createIdleAnimation(): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = [];
    const duration = 2.0;

    // Gentle breathing motion - chest
    const chestBone = this.bones.get(BONE_NAMES.chest)!;
    const chestTrack = new THREE.QuaternionKeyframeTrack(
      `${BONE_NAMES.chest}.quaternion`,
      [0, 1, 2],
      [
        0, 0, 0, 1, // neutral
        0.02, 0, 0, 0.9998, // slight forward
        0, 0, 0, 1, // back to neutral
      ]
    );
    tracks.push(chestTrack);

    return new THREE.AnimationClip('Idle', duration, tracks);
  }

  private createActionAnimation(): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = [];
    const duration = 1.0;

    // Punching motion - right arm
    const rightArmTrack = new THREE.QuaternionKeyframeTrack(
      `${BONE_NAMES.rightArm}.quaternion`,
      [0, 0.3, 0.6, 1.0],
      [
        0, 0, 0, 1, // neutral
        0.5, 0, 0, 0.866, // wind up
        -0.7, 0, 0, 0.714, // punch forward
        0, 0, 0, 1, // return
      ]
    );
    tracks.push(rightArmTrack);

    // Body rotation
    const hipsTrack = new THREE.QuaternionKeyframeTrack(
      `${BONE_NAMES.hips}.quaternion`,
      [0, 0.3, 0.6, 1.0],
      [
        0, 0, 0, 1,
        0, 0.1, 0, 0.995,
        0, -0.1, 0, 0.995,
        0, 0, 0, 1,
      ]
    );
    tracks.push(hipsTrack);

    return new THREE.AnimationClip('Action', duration, tracks);
  }

  private createVictoryAnimation(): THREE.AnimationClip {
    const tracks: THREE.KeyframeTrack[] = [];
    const duration = 2.0;

    // Both arms up
    const leftArmTrack = new THREE.QuaternionKeyframeTrack(
      `${BONE_NAMES.leftArm}.quaternion`,
      [0, 0.5, 1.0, 1.5, 2.0],
      [
        0, 0, 0, 1,
        0.7, 0, 0, 0.714, // arm up
        0.7, 0, 0, 0.714,
        0.65, 0, 0, 0.76, // slight wave
        0.7, 0, 0, 0.714,
      ]
    );
    tracks.push(leftArmTrack);

    const rightArmTrack = new THREE.QuaternionKeyframeTrack(
      `${BONE_NAMES.rightArm}.quaternion`,
      [0, 0.5, 1.0, 1.5, 2.0],
      [
        0, 0, 0, 1,
        -0.7, 0, 0, 0.714,
        -0.7, 0, 0, 0.714,
        -0.65, 0, 0, 0.76,
        -0.7, 0, 0, 0.714,
      ]
    );
    tracks.push(rightArmTrack);

    // Happy bounce
    const hipsPositionTrack = new THREE.VectorKeyframeTrack(
      `${BONE_NAMES.hips}.position`,
      [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
      [
        0, 1.0, 0,
        0, 1.1, 0,
        0, 1.0, 0,
        0, 1.1, 0,
        0, 1.0, 0,
        0, 1.1, 0,
        0, 1.0, 0,
        0, 1.1, 0,
        0, 1.0, 0,
      ]
    );
    tracks.push(hipsPositionTrack);

    return new THREE.AnimationClip('Victory', duration, tracks);
  }

  // Export to GLB
  async exportGLB(): Promise<ArrayBuffer> {
    const avatarGroup = this.generate();
    const exporter = new GLTFExporter();

    return new Promise((resolve, reject) => {
      exporter.parse(
        avatarGroup,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result);
          } else {
            reject(new Error('Expected ArrayBuffer from GLTFExporter'));
          }
        },
        (error) => {
          reject(error);
        },
        { binary: true }
      );
    });
  }
}

// Utility function to generate and download the avatar GLB
export async function generateAndDownloadAvatar() {
  const generator = new AnimeAvatarGenerator();
  const glbData = await generator.exportGLB();
  
  const blob = new Blob([glbData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nuverse-avatar-anime-futuristic.glb';
  link.click();
  
  URL.revokeObjectURL(url);
}
