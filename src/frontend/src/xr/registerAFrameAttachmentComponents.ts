// Register A-Frame components for attaching equipment to avatar bones with fallback resolution

export function registerEquipmentAttachmentComponent() {
  if (!window.AFRAME) {
    console.warn('A-Frame not loaded, cannot register components');
    return;
  }

  // Check if already registered
  if (window.AFRAME.components['equipment-attachment']) {
    return;
  }

  window.AFRAME.registerComponent('equipment-attachment', {
    schema: {
      targetBone: { type: 'string', default: '' },
      fallbackBones: { type: 'array', default: [] },
      offsetX: { type: 'number', default: 0 },
      offsetY: { type: 'number', default: 0 },
      offsetZ: { type: 'number', default: 0 },
    },

    init: function () {
      this.targetObject = null;
      this.attached = false;
      this.resolvedBoneName = null;
      this.warnedBones = new Set();

      // Wait for both this model and parent avatar to load
      this.el.addEventListener('model-loaded', () => {
        this.tryAttach();
      });
    },

    tryAttach: function () {
      if (this.attached) return;

      const parentAvatar = this.el.parentElement;
      if (!parentAvatar) return;

      const avatarModel = parentAvatar.getObject3D('mesh');
      if (!avatarModel) {
        // Avatar not loaded yet, try again later
        setTimeout(() => this.tryAttach(), 100);
        return;
      }

      // Try to resolve target bone with fallback mechanism
      const targetBone = this.resolveBone(avatarModel);

      if (!targetBone) {
        // Only warn once per unique target to avoid console spam
        const targetKey = this.data.targetBone;
        if (!this.warnedBones.has(targetKey)) {
          console.warn(
            `Could not resolve bone "${this.data.targetBone}" or any fallbacks in avatar skeleton`
          );
          this.warnedBones.add(targetKey);
        }
        return;
      }

      // Attach this entity's object to the bone
      const equipmentModel = this.el.getObject3D('mesh');
      if (!equipmentModel) return;

      // Apply offset
      equipmentModel.position.set(this.data.offsetX, this.data.offsetY, this.data.offsetZ);

      // Type assertion for Three.js Object3D methods
      (targetBone as any).add(equipmentModel);
      this.attached = true;
      this.targetObject = targetBone;
      this.resolvedBoneName = targetBone.name;
    },

    resolveBone: function (avatarModel: any): any {
      // Build list of bone names to try: primary + fallbacks
      const boneCandidates = [this.data.targetBone, ...(this.data.fallbackBones || [])];

      // Try each candidate in order
      for (const boneName of boneCandidates) {
        if (!boneName) continue;

        let foundBone: any = null;
        avatarModel.traverse((child: any) => {
          if (child.isBone && child.name === boneName) {
            foundBone = child;
          }
        });

        if (foundBone) {
          // Successfully resolved
          if (boneName !== this.data.targetBone) {
            console.log(
              `Resolved bone "${this.data.targetBone}" to fallback "${boneName}" for equipment attachment`
            );
          }
          return foundBone;
        }
      }

      // No bone found
      return null;
    },

    remove: function () {
      if (this.attached && this.targetObject) {
        const equipmentModel = this.el.getObject3D('mesh');
        if (equipmentModel) {
          (this.targetObject as any).remove(equipmentModel);
        }
      }
    },
  });
}
