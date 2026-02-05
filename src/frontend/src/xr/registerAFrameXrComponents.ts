// Register custom A-Frame components for avatar animation control

export function registerAvatarAnimationComponent() {
  if (!window.AFRAME) {
    console.warn('A-Frame not loaded, cannot register components');
    return;
  }

  // Check if already registered
  if (window.AFRAME.components['avatar-animation-controller']) {
    return;
  }

  window.AFRAME.registerComponent('avatar-animation-controller', {
    schema: {
      stance: { type: 'string', default: 'idle' },
    },

    init: function () {
      this.model = null;
      this.mixer = null;
      this.currentAction = null;
      this.clips = {};

      // Wait for model to load
      this.el.addEventListener('model-loaded', () => {
        this.setupAnimations();
      });
    },

    setupAnimations: function () {
      const model = this.el.getObject3D('mesh');
      if (!model) return;

      this.model = model;

      // Find animations in the model
      const animations = model.animations || [];
      if (animations.length === 0) {
        console.warn('No animations found in avatar model');
        return;
      }

      // Create animation mixer - safely access THREE
      if (!window.AFRAME) return;
      const THREE = window.AFRAME.THREE;
      this.mixer = new THREE.AnimationMixer(model);

      // Store animation clips by name
      animations.forEach((clip: any) => {
        const clipName = clip.name.toLowerCase();
        this.clips[clipName] = clip;
      });

      // Play initial stance
      this.playStance(this.data.stance);
    },

    playStance: function (stanceName: string) {
      if (!this.mixer || !this.clips) return;

      const clipName = stanceName.toLowerCase();
      const clip = this.clips[clipName];

      if (!clip) {
        console.warn(`Animation clip "${stanceName}" not found`);
        return;
      }

      // Stop current action
      if (this.currentAction) {
        this.currentAction.fadeOut(0.3);
      }

      // Play new action - safely access THREE
      if (!window.AFRAME) return;
      const THREE = window.AFRAME.THREE;
      this.currentAction = this.mixer.clipAction(clip);
      this.currentAction.reset().fadeIn(0.3).play();
    },

    update: function (oldData: any) {
      if (oldData.stance !== this.data.stance) {
        this.playStance(this.data.stance);
      }
    },

    tick: function (time: number, deltaTime: number) {
      if (this.mixer) {
        this.mixer.update(deltaTime / 1000);
      }
    },
  });
}
