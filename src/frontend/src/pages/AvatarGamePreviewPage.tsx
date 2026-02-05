import { useState } from 'react';
import { ArrowLeft, Gamepad2, Shirt, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import AvatarPreview from '../components/AvatarPreview';
import { useAvatarConfig } from '../hooks/useAvatarConfig';
import { loadEquippedLook, getDefaultEquippedLook } from '../utils/avatarClosetStorage';

interface AvatarGamePreviewPageProps {
  onBackToGamingPortal: () => void;
  onNavigateToAvatarCloset: () => void;
  onNavigateToSmartCubePreview?: () => void;
}

export default function AvatarGamePreviewPage({
  onBackToGamingPortal,
  onNavigateToAvatarCloset,
  onNavigateToSmartCubePreview,
}: AvatarGamePreviewPageProps) {
  const { config, isLoading } = useAvatarConfig();
  const [equippedLook] = useState(() => loadEquippedLook() || getDefaultEquippedLook());

  const handleEnterGame = () => {
    toast.success('Launching game with your avatar...', {
      description: 'VR/Game integration coming soon!',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToGamingPortal}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gaming Portal
          </Button>
          <h1 className="text-lg font-bold text-foreground">Avatar Game Preview</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToAvatarCloset}
            className="hover:bg-accent/10"
          >
            <Shirt className="h-4 w-4 mr-2" />
            Closet
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* VR/Game Scene Container */}
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardContent className="p-0">
            {/* Futuristic Scene Background */}
            <div className="relative aspect-[4/3] bg-gradient-to-b from-primary/10 via-accent/5 to-background overflow-hidden">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px),
                    linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Scanline effect */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(var(--accent)) 2px, oklch(var(--accent)) 4px)',
                  animation: 'scanline 8s linear infinite',
                }}
              />

              {/* Avatar Preview in Scene */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-80 flex items-center justify-center">
                  {/* Glow effect behind avatar */}
                  <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-accent/10 to-transparent blur-2xl" />
                  
                  {/* Avatar */}
                  <div className="relative z-10 w-full h-full">
                    <AvatarPreview config={config} equippedLook={equippedLook} />
                  </div>

                  {/* Holographic ring */}
                  <div className="absolute bottom-0 w-48 h-4 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" />
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary/40" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/40" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-accent/40" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent/40" />

              {/* Status indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-foreground">VR Space Ready</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Info Card */}
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Your Avatar</h2>
                <p className="text-sm text-muted-foreground">
                  Ready to enter games and VR spaces with your customized look
                </p>
              </div>

              {/* Equipped Items Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Shoes</p>
                  <p className="text-sm font-medium text-foreground">
                    {equippedLook.shoes ? '✓ Equipped' : 'None'}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Accessories</p>
                  <p className="text-sm font-medium text-foreground">
                    {equippedLook.accessories ? '✓ Equipped' : 'None'}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Outfit</p>
                  <p className="text-sm font-medium text-foreground">
                    {equippedLook.outfits ? '✓ Equipped' : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleEnterGame}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20"
          >
            <Gamepad2 className="h-6 w-6 mr-2" />
            Enter Game
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onNavigateToAvatarCloset}
              className="border-accent/30 hover:bg-accent/10"
            >
              <Shirt className="h-5 w-5 mr-2" />
              Avatar Closet
            </Button>
            {onNavigateToSmartCubePreview && (
              <Button
                variant="outline"
                onClick={onNavigateToSmartCubePreview}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Monitor className="h-5 w-5 mr-2" />
                SmartCube
              </Button>
            )}
          </div>
        </div>

        {/* Info Notice */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              Your avatar appearance syncs automatically with equipped items from your closet
            </p>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}
