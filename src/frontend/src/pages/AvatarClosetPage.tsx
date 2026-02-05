import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import AvatarPreview from '../components/AvatarPreview';
import ClosetCategoryTabs from '../components/avatar-closet/ClosetCategoryTabs';
import WardrobeItemGrid from '../components/avatar-closet/WardrobeItemGrid';
import { useAvatarConfig } from '../hooks/useAvatarConfig';
import { WardrobeCategory, EquippedLook } from '../types/avatarCloset';
import { getItemsByCategory } from '../mock/avatarClosetPlaceholders';
import {
  saveEquippedLook,
  loadEquippedLook,
  getDefaultEquippedLook,
} from '../utils/avatarClosetStorage';

interface AvatarClosetPageProps {
  onBack: () => void;
}

export default function AvatarClosetPage({ onBack }: AvatarClosetPageProps) {
  const { config } = useAvatarConfig();
  const [activeCategory, setActiveCategory] = useState<WardrobeCategory>('shoes');
  const [equippedLook, setEquippedLook] = useState<EquippedLook>(getDefaultEquippedLook());
  const [lastSavedLook, setLastSavedLook] = useState<EquippedLook | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved look on mount
  useEffect(() => {
    const loaded = loadEquippedLook();
    if (loaded) {
      setEquippedLook(loaded);
      setLastSavedLook(loaded);
    }
  }, []);

  // Check if there are unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(equippedLook) !== JSON.stringify(lastSavedLook);

  // Handle item selection
  const handleSelectItem = (itemId: string) => {
    setEquippedLook((prev) => {
      const currentlyEquipped = prev[activeCategory];
      
      // If clicking the same item, unequip it
      if (currentlyEquipped === itemId) {
        return {
          ...prev,
          [activeCategory]: null,
        };
      }
      
      // Otherwise, equip the new item
      return {
        ...prev,
        [activeCategory]: itemId,
      };
    });
  };

  // Save equipped look
  const handleSaveLook = async () => {
    setIsSaving(true);
    try {
      saveEquippedLook(equippedLook);
      setLastSavedLook(equippedLook);
      toast.success('Look saved successfully!');
    } catch (error) {
      console.error('Failed to save look:', error);
      toast.error('Failed to save look. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentItems = getItemsByCategory(activeCategory);
  const selectedItemId = equippedLook[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Avatar Closet</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Avatar Preview Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Avatar Preview</CardTitle>
            <CardDescription>
              See your equipped items in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="flex items-center justify-center rounded-xl bg-muted/30 p-8"
              style={{ minHeight: '320px' }}
            >
              <AvatarPreview config={config} equippedLook={equippedLook} />
            </div>
          </CardContent>
        </Card>

        {/* Wardrobe Controls */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Wardrobe</CardTitle>
            <CardDescription>
              Select items to equip on your avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Tabs */}
            <ClosetCategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <Separator />

            {/* Item Grid */}
            <WardrobeItemGrid
              items={currentItems}
              selectedItemId={selectedItemId}
              onSelectItem={handleSelectItem}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="space-y-3">
          {hasUnsavedChanges && (
            <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-center text-sm text-warning">
              You have unsaved changes
            </div>
          )}

          <Button
            onClick={handleSaveLook}
            disabled={!hasUnsavedChanges || isSaving}
            className="w-full"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? 'Saving...' : 'Save Look'}
          </Button>
        </div>
      </div>
    </div>
  );
}
