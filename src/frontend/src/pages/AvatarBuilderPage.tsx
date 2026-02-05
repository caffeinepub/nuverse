import { useState } from 'react';
import { ArrowLeft, Save, RotateCcw, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAvatarConfig } from '../hooks/useAvatarConfig';
import AvatarPreview from '../components/AvatarPreview';
import {
  SKIN_TONES,
  FACE_TYPES,
  HAIR_TYPES,
  BODY_TYPES,
  SkinTone,
  FaceType,
  HairType,
  BodyType,
} from '../types/avatar';

interface AvatarBuilderPageProps {
  onBack: () => void;
  onNavigateToCloset?: () => void;
}

export default function AvatarBuilderPage({ onBack, onNavigateToCloset }: AvatarBuilderPageProps) {
  const {
    config,
    setConfig,
    save,
    revert,
    hasUnsavedChanges,
    isLoading,
    isSaving,
    hasSavedConfig,
  } = useAvatarConfig();

  const [activeSection, setActiveSection] = useState<'skinTone' | 'face' | 'hair' | 'body'>('skinTone');

  const handleSave = async () => {
    const success = await save();
    if (success) {
      toast.success('Avatar saved successfully!');
    } else {
      toast.error('Failed to save avatar. Please try again.');
    }
  };

  const handleRevert = () => {
    revert();
    toast.info('Changes reverted to last saved version');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading avatar...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Avatar Builder</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Preview Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              Your avatar updates in real-time as you customize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-xl bg-muted/30 p-8" style={{ minHeight: '320px' }}>
              <AvatarPreview config={config} />
            </div>
          </CardContent>
        </Card>

        {/* Customization Controls */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Customize Avatar</CardTitle>
            <CardDescription>
              Select options to personalize your avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'skinTone' as const, label: 'Skin Tone' },
                { id: 'face' as const, label: 'Face' },
                { id: 'hair' as const, label: 'Hair' },
                { id: 'body' as const, label: 'Body Type' },
              ].map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="whitespace-nowrap"
                >
                  {section.label}
                </Button>
              ))}
            </div>

            <Separator />

            {/* Skin Tone */}
            {activeSection === 'skinTone' && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Skin Tone</Label>
                <RadioGroup
                  value={config.skinTone}
                  onValueChange={(value) =>
                    setConfig({ ...config, skinTone: value as SkinTone })
                  }
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {SKIN_TONES.map((tone) => (
                    <div key={tone.value} className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value={tone.value} id={tone.value} />
                      <Label
                        htmlFor={tone.value}
                        className="flex flex-1 cursor-pointer items-center gap-3"
                      >
                        <div
                          className="h-8 w-8 rounded-full border-2 border-border shadow-sm"
                          style={{ backgroundColor: tone.color }}
                        />
                        <span className="font-medium">{tone.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Face Type */}
            {activeSection === 'face' && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Face Shape</Label>
                <RadioGroup
                  value={config.face}
                  onValueChange={(value) =>
                    setConfig({ ...config, face: value as FaceType })
                  }
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {FACE_TYPES.map((face) => (
                    <div key={face.value} className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value={face.value} id={face.value} />
                      <Label
                        htmlFor={face.value}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {face.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Hair Type */}
            {activeSection === 'hair' && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Hair Style</Label>
                <RadioGroup
                  value={config.hair}
                  onValueChange={(value) =>
                    setConfig({ ...config, hair: value as HairType })
                  }
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {HAIR_TYPES.map((hair) => (
                    <div key={hair.value} className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value={hair.value} id={hair.value} />
                      <Label
                        htmlFor={hair.value}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {hair.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Body Type */}
            {activeSection === 'body' && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Body Type</Label>
                <RadioGroup
                  value={config.bodyType}
                  onValueChange={(value) =>
                    setConfig({ ...config, bodyType: value as BodyType })
                  }
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {BODY_TYPES.map((body) => (
                    <div key={body.value} className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value={body.value} id={body.value} />
                      <Label
                        htmlFor={body.value}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {body.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasUnsavedChanges && (
            <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-center text-sm text-warning">
              You have unsaved changes
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="flex-1"
              size="lg"
            >
              <Save className="mr-2 h-5 w-5" />
              {isSaving ? 'Saving...' : 'Save Avatar'}
            </Button>

            {hasSavedConfig && hasUnsavedChanges && (
              <Button
                onClick={handleRevert}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Revert
              </Button>
            )}
          </div>

          {/* Navigate to Closet */}
          {onNavigateToCloset && (
            <Button
              onClick={onNavigateToCloset}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Shirt className="mr-2 h-5 w-5" />
              Open Avatar Closet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
