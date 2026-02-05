import { useState } from 'react';
import { ArrowLeft, Monitor, Shirt, Zap, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AvatarPreview from '../components/AvatarPreview';
import { useAvatarConfig } from '../hooks/useAvatarConfig';
import { loadEquippedLook, getDefaultEquippedLook } from '../utils/avatarClosetStorage';

type Stance = 'idle' | 'action' | 'victory';

interface AvatarSmartCubePreviewPageProps {
  onBack: () => void;
  onNavigateToAvatarCloset: () => void;
  onNavigateToAIRPlayAnywhere: () => void;
}

export default function AvatarSmartCubePreviewPage({
  onBack,
  onNavigateToAvatarCloset,
  onNavigateToAIRPlayAnywhere,
}: AvatarSmartCubePreviewPageProps) {
  const { config, isLoading } = useAvatarConfig();
  const [equippedLook] = useState(() => loadEquippedLook() || getDefaultEquippedLook());
  const [currentStance, setCurrentStance] = useState<Stance>('idle');
  const [isSyncing, setIsSyncing] = useState(false);

  const stances: { value: Stance; label: string; icon: string }[] = [
    { value: 'idle', label: 'Idle', icon: '🧍' },
    { value: 'action', label: 'Action', icon: '🏃' },
    { value: 'victory', label: 'Victory', icon: '🎉' },
  ];

  const handleSyncToSmartCube = async () => {
    setIsSyncing(true);
    toast.info('Syncing avatar to SmartCube...', {
      description: 'Establishing connection...',
    });

    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Avatar synced to SmartCube!', {
        description: 'Your avatar is now ready for SmartCube sessions (simulation).',
        duration: 4000,
      });
    }, 2000);
  };

  const getStanceTransform = () => {
    switch (currentStance) {
      case 'action':
        return 'rotate(-5deg) scale(1.05)';
      case 'victory':
        return 'rotate(5deg) scale(1.1)';
      default:
        return 'rotate(0deg) scale(1)';
    }
  };

  const getStanceAnimation = () => {
    switch (currentStance) {
      case 'action':
        return 'animate-pulse';
      case 'victory':
        return 'animate-bounce';
      default:
        return '';
    }
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-foreground">Avatar SmartCube Preview</h1>
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
        {/* SmartCube Display Frame */}
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <CardContent className="p-0">
            {/* SmartCube Screen Container */}
            <div className="relative aspect-[16/10] bg-gradient-to-b from-primary/20 via-accent/10 to-background overflow-hidden">
              {/* SmartCube Frame Border */}
              <div className="absolute inset-0 border-8 border-primary/20 rounded-lg pointer-events-none" />
              
              {/* Tech Grid Background */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px),
                    linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Animated Scanlines */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(var(--accent)) 3px, oklch(var(--accent)) 6px)',
                  animation: 'scanline 10s linear infinite',
                }}
              />

              {/* Avatar Display with Stance */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div
                  className={`relative w-64 h-80 flex items-center justify-center transition-all duration-500 ${getStanceAnimation()}`}
                  style={{ transform: getStanceTransform() }}
                >
                  {/* Holographic Glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-accent/15 to-transparent blur-3xl" />
                  
                  {/* Avatar */}
                  <div className="relative z-10 w-full h-full">
                    <AvatarPreview config={config} equippedLook={equippedLook} />
                  </div>

                  {/* Platform Ring */}
                  <div className="absolute bottom-0 w-56 h-6 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-md" />
                </div>
              </div>

              {/* SmartCube Corner Indicators */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-accent/50 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-accent/50 rounded-br-lg" />

              {/* SmartCube Status Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-primary/40 shadow-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">SmartCube Display</span>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>

              {/* Current Stance Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-accent/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Stance:</span>
                  <span className="text-xs font-bold text-foreground">
                    {stances.find(s => s.value === currentStance)?.icon} {stances.find(s => s.value === currentStance)?.label}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stance/Animation Controls */}
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Avatar Stance</h2>
                <p className="text-sm text-muted-foreground">
                  Choose how your avatar appears on the SmartCube
                </p>
              </div>

              {/* Stance Selector */}
              <div className="grid grid-cols-3 gap-3">
                {stances.map((stance) => (
                  <button
                    key={stance.value}
                    onClick={() => setCurrentStance(stance.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                      currentStance === stance.value
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{stance.icon}</div>
                      <p className="text-sm font-medium text-foreground">{stance.label}</p>
                    </div>
                    {currentStance === stance.value && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">Active</Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipped Items Summary */}
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Equipped Items</h2>
                <p className="text-sm text-muted-foreground">
                  Items synced to your SmartCube avatar
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Shoes</p>
                  <p className="text-sm font-medium text-foreground">
                    {equippedLook.shoes ? '✓ Equipped' : 'None'}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Accessories</p>
                  <p className="text-sm font-medium text-foreground">
                    {equippedLook.accessories ? '✓ Equipped' : 'None'}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Outfit</p>
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
            onClick={handleSyncToSmartCube}
            disabled={isSyncing}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20"
          >
            {isSyncing ? (
              <>
                <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Syncing...
              </>
            ) : (
              <>
                <Zap className="h-6 w-6 mr-2" />
                Sync Avatar to SmartCube
              </>
            )}
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
            <Button
              variant="outline"
              onClick={onNavigateToAIRPlayAnywhere}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Box className="h-5 w-5 mr-2" />
              SmartCube Hub
            </Button>
          </div>
        </div>

        {/* Info Notice */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              SmartCube sync is a placeholder feature. Full hardware integration coming soon!
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
