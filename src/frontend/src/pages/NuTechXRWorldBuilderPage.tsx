import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadEquippedLook } from '@/utils/avatarClosetStorage';
import { getAvatarAssetPath } from '@/xr/nuverseAvatarAssets';
import { getAllEquippedAttachments } from '@/xr/nuverseEquippedItemMapping';
import { registerAvatarAnimationComponent } from '@/xr/registerAFrameXrComponents';
import { registerEquipmentAttachmentComponent } from '@/xr/registerAFrameAttachmentComponents';
import { toast } from 'sonner';

interface NuTechXRWorldBuilderPageProps {
  onBack: () => void;
}

interface DiagnosticInfo {
  modelLoaded: boolean;
  orientation: { x: number; y: number; z: number } | null;
  scale: { x: number; y: number; z: number } | null;
  animationClips: string[];
  detectedBones: string[];
}

export default function NuTechXRWorldBuilderPage({ onBack }: NuTechXRWorldBuilderPageProps) {
  const [isAFrameLoaded, setIsAFrameLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentStance, setCurrentStance] = useState<'idle' | 'action' | 'victory'>('idle');
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo>({
    modelLoaded: false,
    orientation: null,
    scale: null,
    animationClips: [],
    detectedBones: [],
  });
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const avatarEntityRef = useRef<any>(null);

  useEffect(() => {
    // Check if A-Frame is already loaded
    if (window.AFRAME) {
      setIsAFrameLoaded(true);
      return;
    }

    // Load A-Frame script
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.5.0/aframe.min.js';
    script.async = true;

    script.onload = () => {
      // Verify version
      if (window.AFRAME && window.AFRAME.version === '1.5.0') {
        setIsAFrameLoaded(true);
      } else {
        setLoadError('A-Frame version mismatch');
      }
    };

    script.onerror = () => {
      setLoadError('Failed to load A-Frame library');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAFrameLoaded || !sceneContainerRef.current) return;

    // Register custom A-Frame components
    registerAvatarAnimationComponent();
    registerEquipmentAttachmentComponent();

    // Load equipped look from storage
    const equippedLook = loadEquippedLook() || { shoes: null, accessories: null, outfits: null };
    const equippedAttachments = getAllEquippedAttachments(equippedLook);

    // Create A-Frame scene programmatically after library is loaded
    const sceneEl = document.createElement('a-scene');
    sceneEl.setAttribute('embedded', '');
    sceneEl.setAttribute('vr-mode-ui', 'enabled: true');

    // Assets
    const assets = document.createElement('a-assets');
    
    // Avatar model asset
    const avatarAsset = document.createElement('a-asset-item');
    avatarAsset.setAttribute('id', 'avatar-model');
    avatarAsset.setAttribute('src', getAvatarAssetPath());
    assets.appendChild(avatarAsset);

    // Equipment assets
    equippedAttachments.forEach((attachment, index) => {
      const equipAsset = document.createElement('a-asset-item');
      equipAsset.setAttribute('id', `equipment-${index}`);
      equipAsset.setAttribute('src', attachment.assetPath);
      assets.appendChild(equipAsset);
    });

    sceneEl.appendChild(assets);

    // Sky
    const sky = document.createElement('a-sky');
    sky.setAttribute('color', '#0a0a1a');
    sceneEl.appendChild(sky);

    // Ground with grid
    const ground = document.createElement('a-plane');
    ground.setAttribute('position', '0 0 0');
    ground.setAttribute('rotation', '-90 0 0');
    ground.setAttribute('width', '50');
    ground.setAttribute('height', '50');
    ground.setAttribute('color', '#1a1a2e');
    ground.setAttribute('material', 'shader: flat');
    sceneEl.appendChild(ground);

    // Ambient light
    const ambientLight = document.createElement('a-light');
    ambientLight.setAttribute('type', 'ambient');
    ambientLight.setAttribute('intensity', '0.7');
    ambientLight.setAttribute('color', '#b8c5ff');
    sceneEl.appendChild(ambientLight);

    // Directional light (key light)
    const directionalLight = document.createElement('a-light');
    directionalLight.setAttribute('type', 'directional');
    directionalLight.setAttribute('position', '3 5 2');
    directionalLight.setAttribute('intensity', '1.2');
    directionalLight.setAttribute('color', '#ffffff');
    sceneEl.appendChild(directionalLight);

    // Rim light (for anime-style edge lighting)
    const rimLight = document.createElement('a-light');
    rimLight.setAttribute('type', 'directional');
    rimLight.setAttribute('position', '-2 3 -3');
    rimLight.setAttribute('intensity', '0.6');
    rimLight.setAttribute('color', '#7aa3ff');
    sceneEl.appendChild(rimLight);

    // Avatar entity with futuristic anime model
    const avatar = document.createElement('a-entity');
    avatar.setAttribute('id', 'nuverse-avatar');
    avatar.setAttribute('position', '0 0 0');
    avatar.setAttribute('rotation', '0 0 0');
    avatar.setAttribute('scale', '1 1 1');
    avatar.setAttribute('gltf-model', '#avatar-model');
    avatar.setAttribute('avatar-animation-controller', `stance: ${currentStance}`);
    avatarEntityRef.current = avatar;

    // Listen for model-loaded event to extract diagnostics
    avatar.addEventListener('model-loaded', () => {
      const model = (avatar as any).getObject3D('mesh');
      if (model) {
        const rotationAttr = avatar.getAttribute('rotation') as any;
        const scaleAttr = avatar.getAttribute('scale') as any;
        const animations = model.animations || [];
        const bones: string[] = [];

        model.traverse((child: any) => {
          if (child.isBone) {
            bones.push(child.name);
          }
        });

        setDiagnostics({
          modelLoaded: true,
          orientation: rotationAttr ? { x: rotationAttr.x, y: rotationAttr.y, z: rotationAttr.z } : null,
          scale: scaleAttr ? { x: scaleAttr.x, y: scaleAttr.y, z: scaleAttr.z } : null,
          animationClips: animations.map((clip: any) => clip.name),
          detectedBones: bones,
        });

        toast.success('Avatar model loaded successfully', {
          description: `Found ${animations.length} animations and ${bones.length} bones`,
        });
      }
    });

    // Add equipped items as children of avatar with fallback bone support
    equippedAttachments.forEach((attachment, index) => {
      const equipment = document.createElement('a-entity');
      equipment.setAttribute('gltf-model', `#equipment-${index}`);
      
      // Build fallback bones array string for A-Frame schema
      const fallbackBonesStr = attachment.fallbackNodes
        ? attachment.fallbackNodes.join(',')
        : '';
      
      equipment.setAttribute('equipment-attachment', `
        targetBone: ${attachment.attachmentNode};
        fallbackBones: ${fallbackBonesStr};
        offsetX: ${attachment.position?.x || 0};
        offsetY: ${attachment.position?.y || 0};
        offsetZ: ${attachment.position?.z || 0};
      `);
      if (attachment.scale) {
        equipment.setAttribute('scale', `${attachment.scale.x} ${attachment.scale.y} ${attachment.scale.z}`);
      }
      avatar.appendChild(equipment);
    });

    sceneEl.appendChild(avatar);

    // Platform under avatar
    const platform = document.createElement('a-cylinder');
    platform.setAttribute('position', '0 0.05 0');
    platform.setAttribute('radius', '1.5');
    platform.setAttribute('height', '0.1');
    platform.setAttribute('color', '#2d3561');
    platform.setAttribute('metalness', '0.8');
    platform.setAttribute('roughness', '0.2');
    sceneEl.appendChild(platform);

    // Accent lights around avatar (cyber aesthetic)
    const accentPositions = [
      { x: 2, y: 0.5, z: 2, color: '#00ffff' },
      { x: -2, y: 0.5, z: 2, color: '#ff00ff' },
      { x: 2, y: 0.5, z: -2, color: '#ffff00' },
      { x: -2, y: 0.5, z: -2, color: '#00ff00' },
    ];

    accentPositions.forEach((pos) => {
      const accentLight = document.createElement('a-light');
      accentLight.setAttribute('type', 'point');
      accentLight.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
      accentLight.setAttribute('intensity', '0.3');
      accentLight.setAttribute('color', pos.color);
      accentLight.setAttribute('distance', '5');
      sceneEl.appendChild(accentLight);

      // Visual marker for accent lights
      const marker = document.createElement('a-sphere');
      marker.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
      marker.setAttribute('radius', '0.1');
      marker.setAttribute('color', pos.color);
      marker.setAttribute('material', 'emissive: ' + pos.color + '; emissiveIntensity: 0.8');
      sceneEl.appendChild(marker);
    });

    // Camera rig
    const rig = document.createElement('a-entity');
    rig.setAttribute('id', 'rig');
    rig.setAttribute('position', '0 1.6 5');

    const camera = document.createElement('a-camera');
    camera.setAttribute('look-controls', '');
    camera.setAttribute('wasd-controls', '');
    rig.appendChild(camera);

    sceneEl.appendChild(rig);

    // Append scene to container
    sceneContainerRef.current.appendChild(sceneEl);

    return () => {
      // Cleanup scene on unmount
      if (sceneContainerRef.current && sceneEl.parentNode) {
        sceneContainerRef.current.removeChild(sceneEl);
      }
    };
  }, [isAFrameLoaded, currentStance]);

  const changeStance = (stance: 'idle' | 'action' | 'victory') => {
    setCurrentStance(stance);
    if (avatarEntityRef.current) {
      avatarEntityRef.current.setAttribute('avatar-animation-controller', `stance: ${stance}`);
    }
  };

  const addBox = () => {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    const p = randomPos();
    const box = document.createElement('a-box');
    box.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
    box.setAttribute('depth', '1');
    box.setAttribute('height', '1');
    box.setAttribute('width', '1');
    box.setAttribute('color', '#4CC3D9');
    scene.appendChild(box);
  };

  const addSphere = () => {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    const p = randomPos();
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
    sphere.setAttribute('radius', '0.6');
    sphere.setAttribute('color', '#EF2D5E');
    scene.appendChild(sphere);
  };

  const addPlatform = () => {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    const p = randomPos();
    const plat = document.createElement('a-box');
    plat.setAttribute('position', `${p.x} 0.5 ${p.z}`);
    plat.setAttribute('width', '3');
    plat.setAttribute('height', '0.3');
    plat.setAttribute('depth', '3');
    plat.setAttribute('color', '#7BC8A4');
    scene.appendChild(plat);
  };

  const randomPos = () => {
    return {
      x: Math.random() * 6 - 3,
      y: 1,
      z: Math.random() * -6,
    };
  };

  if (loadError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-destructive">Error Loading XR World Builder</h2>
          <p className="mb-4 text-sm text-muted-foreground">{loadError}</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!isAFrameLoaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Loading XR World Builder...</h2>
          <p className="text-sm text-muted-foreground">Initializing A-Frame 1.5.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="xr-world-builder-container relative h-full w-full">
      {/* Overlay UI */}
      <div className="xr-world-builder-ui absolute left-4 top-4 z-[999] space-y-3 rounded-xl bg-black/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <strong className="text-base font-bold text-white">NuTech World Builder</strong>
        </div>
        
        {/* Avatar Stance Controls */}
        <div className="border-t border-white/20 pt-3">
          <p className="mb-2 text-xs font-semibold text-white/80">Avatar Stance</p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => changeStance('idle')}
              className={`${
                currentStance === 'idle'
                  ? 'bg-cyan-500 hover:bg-cyan-600'
                  : 'bg-cyan-500/40 hover:bg-cyan-500/60'
              } text-white`}
              size="sm"
            >
              Idle
            </Button>
            <Button
              onClick={() => changeStance('action')}
              className={`${
                currentStance === 'action'
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-purple-500/40 hover:bg-purple-500/60'
              } text-white`}
              size="sm"
            >
              Action
            </Button>
            <Button
              onClick={() => changeStance('victory')}
              className={`${
                currentStance === 'victory'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-yellow-500/40 hover:bg-yellow-500/60'
              } text-white`}
              size="sm"
            >
              Victory
            </Button>
          </div>
        </div>

        {/* World Building Controls */}
        <div className="border-t border-white/20 pt-3">
          <p className="mb-2 text-xs font-semibold text-white/80">Add Objects</p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={addBox}
              className="bg-[#4CC3D9] hover:bg-[#4CC3D9]/80 text-white"
              size="sm"
            >
              Add Block
            </Button>
            <Button
              onClick={addSphere}
              className="bg-[#EF2D5E] hover:bg-[#EF2D5E]/80 text-white"
              size="sm"
            >
              Add Sphere
            </Button>
            <Button
              onClick={addPlatform}
              className="bg-[#7BC8A4] hover:bg-[#7BC8A4]/80 text-white"
              size="sm"
            >
              Add Platform
            </Button>
          </div>
        </div>

        {/* Diagnostics Toggle */}
        <div className="border-t border-white/20 pt-3">
          <Button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full bg-white/10 hover:bg-white/20 text-white"
            size="sm"
          >
            <Info className="mr-2 h-4 w-4" />
            {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
          </Button>
        </div>
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && (
        <div className="xr-world-builder-ui absolute right-4 top-4 z-[999] max-h-[80vh] w-80 space-y-2 overflow-y-auto rounded-xl bg-black/80 p-4 text-xs text-white backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-bold">Avatar Diagnostics</h3>
          
          <div className="space-y-1">
            <p className="font-semibold">Model Status:</p>
            <p className={diagnostics.modelLoaded ? 'text-green-400' : 'text-red-400'}>
              {diagnostics.modelLoaded ? '✓ Loaded' : '✗ Not Loaded'}
            </p>
          </div>

          {diagnostics.orientation && (
            <div className="space-y-1">
              <p className="font-semibold">Orientation (deg):</p>
              <p>X: {diagnostics.orientation.x.toFixed(1)}°</p>
              <p>Y: {diagnostics.orientation.y.toFixed(1)}°</p>
              <p>Z: {diagnostics.orientation.z.toFixed(1)}°</p>
            </div>
          )}

          {diagnostics.scale && (
            <div className="space-y-1">
              <p className="font-semibold">Scale:</p>
              <p>X: {diagnostics.scale.x.toFixed(2)}</p>
              <p>Y: {diagnostics.scale.y.toFixed(2)}</p>
              <p>Z: {diagnostics.scale.z.toFixed(2)}</p>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-semibold">Animation Clips ({diagnostics.animationClips.length}):</p>
            {diagnostics.animationClips.length > 0 ? (
              <ul className="list-inside list-disc">
                {diagnostics.animationClips.map((clip, i) => (
                  <li key={i}>{clip}</li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-400">No animations found</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Detected Bones ({diagnostics.detectedBones.length}):</p>
            {diagnostics.detectedBones.length > 0 ? (
              <div className="max-h-40 overflow-y-auto">
                <ul className="list-inside list-disc">
                  {diagnostics.detectedBones.map((bone, i) => (
                    <li key={i}>{bone}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-yellow-400">No bones found</p>
            )}
          </div>

          <div className="mt-3 rounded bg-yellow-500/20 p-2 text-yellow-200">
            <p className="font-semibold">Expected Bones:</p>
            <p className="text-[10px]">
              Head, LeftHand, RightHand, Spine, Chest, LeftFoot, RightFoot, LeftLeg, RightLeg
            </p>
          </div>
        </div>
      )}

      {/* A-Frame Scene Container */}
      <div ref={sceneContainerRef} className="h-full w-full" />
    </div>
  );
}
