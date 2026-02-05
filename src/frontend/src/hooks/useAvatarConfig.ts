import { useState, useEffect, useCallback } from 'react';
import { AvatarConfig } from '../types/avatar';
import { 
  saveAvatarConfig, 
  loadAvatarConfig, 
  getDefaultConfig 
} from '../utils/avatarConfigStorage';

export function useAvatarConfig() {
  const [config, setConfig] = useState<AvatarConfig>(getDefaultConfig());
  const [lastSavedConfig, setLastSavedConfig] = useState<AvatarConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved config on mount
  useEffect(() => {
    const loaded = loadAvatarConfig();
    if (loaded) {
      setConfig(loaded);
      setLastSavedConfig(loaded);
    }
    setIsLoading(false);
  }, []);

  // Check if current config differs from saved
  const hasUnsavedChanges = useCallback(() => {
    if (!lastSavedConfig) return true;
    return JSON.stringify(config) !== JSON.stringify(lastSavedConfig);
  }, [config, lastSavedConfig]);

  // Save current config
  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      saveAvatarConfig(config);
      setLastSavedConfig(config);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  // Revert to last saved config
  const revert = useCallback(() => {
    if (lastSavedConfig) {
      setConfig(lastSavedConfig);
    }
  }, [lastSavedConfig]);

  return {
    config,
    setConfig,
    save,
    revert,
    hasUnsavedChanges: hasUnsavedChanges(),
    isLoading,
    isSaving,
    hasSavedConfig: lastSavedConfig !== null,
  };
}
