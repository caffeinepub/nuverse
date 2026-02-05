import { X, Headset, Users, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface VRWorld {
  id: string;
  name: string;
  description: string;
  category: string;
  users: number;
  thumbnail: string;
  isLive: boolean;
}

interface EnterVRSpaceDialogProps {
  world: VRWorld;
  onClose: () => void;
}

export default function EnterVRSpaceDialog({ world, onClose }: EnterVRSpaceDialogProps) {
  const handleEnterVR = () => {
    toast.info('AR/VR Integration Coming Soon', {
      description: `The VR experience for "${world.name}" is not yet connected. Full AR/VR integration will be available in a future update.`,
      duration: 4000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="air-gaming-panel w-full max-w-2xl rounded-t-3xl bg-card border-t-2 border-accent/30 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2">
            <Headset className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Enter VR Space</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-accent/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* World Preview */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-primary/10">
            <img
              src={world.thumbnail}
              alt={world.name}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{world.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-accent/90 text-accent-foreground">
                      {world.isLive ? 'Live' : 'Offline'}
                    </Badge>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{world.users} online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* World Details */}
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">About This World</h4>
                  <p className="text-sm text-muted-foreground">{world.description}</p>
                </div>
              </div>
            </div>

            {/* Placeholder Notice */}
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-center">
              <Sparkles className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium mb-1">
                AR/VR Integration Not Connected
              </p>
              <p className="text-xs text-muted-foreground">
                Full immersive VR experiences will be available in a future update. Stay tuned for WebXR integration!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleEnterVR}
              className="flex-1 air-gaming-button bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Headset className="h-4 w-4 mr-2" />
              Enter VR Space
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 air-gaming-button border-primary/30 hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
