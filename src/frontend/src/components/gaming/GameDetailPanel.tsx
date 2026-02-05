import { X, Play, Eye, Headset, Star, Monitor, Smartphone, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Game, GamePlatform } from '../../mock/gamingPortalPlaceholders';
import { useState } from 'react';

interface GameDetailPanelProps {
  game: Game;
  onClose: () => void;
}

export default function GameDetailPanel({ game, onClose }: GameDetailPanelProps) {
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handlePlay = () => {
    setActionStatus('Launching game... (Placeholder)');
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handlePreview = () => {
    setActionStatus('Loading preview... (Placeholder)');
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleEnterVR = () => {
    setActionStatus('AR/VR integration not yet connected. This feature will enable immersive gameplay experiences.');
    setTimeout(() => setActionStatus(null), 4000);
  };

  const getPlatformIcon = (platform: GamePlatform) => {
    switch (platform) {
      case 'VR':
      case 'AR':
        return <Headset className="h-4 w-4" />;
      case 'Mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'Desktop':
        return <Monitor className="h-4 w-4" />;
      case 'Console':
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="air-gaming-panel w-full max-w-2xl rounded-t-3xl bg-card border-t-2 border-primary/30 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-sm p-4">
          <h2 className="text-xl font-bold text-foreground">{game.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-primary/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Game Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">
                {game.type === 'classic' ? 'Classic' : game.type === 'aaa' ? 'AAA' : 'User Created'}
              </Badge>
              {game.isVRCompatible && (
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
                  <Headset className="h-3 w-3 mr-1" />
                  VR Ready
                </Badge>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="air-gaming-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Creator</p>
                <p className="font-semibold text-foreground">{game.creator}</p>
              </CardContent>
            </Card>

            <Card className="air-gaming-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <p className="font-semibold text-foreground">{game.rating.toFixed(1)}</p>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="air-gaming-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{game.description}</p>
            </CardContent>
          </Card>

          {/* Platforms */}
          <Card className="air-gaming-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Platform Compatibility</p>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="border-primary/30 bg-primary/5 text-foreground"
                  >
                    {getPlatformIcon(platform)}
                    <span className="ml-1">{platform}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Status */}
          {actionStatus && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-foreground animate-in fade-in slide-in-from-top-2 duration-300">
              {actionStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Button
              onClick={handlePlay}
              className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              className="air-gaming-button border-primary/30 hover:bg-primary/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleEnterVR}
              variant="outline"
              className="air-gaming-button border-accent/30 hover:bg-accent/10"
              disabled={!game.isVRCompatible}
            >
              <Headset className="h-4 w-4 mr-2" />
              VR Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
