import { useState } from 'react';
import { ArrowLeft, Smartphone, Tv, Monitor, Gamepad2, Wifi, WifiOff, CheckCircle2, XCircle, Loader2, Play, Headset, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Game } from '../mock/gamingPortalPlaceholders';

interface VRWorld {
  id: string;
  name: string;
  description: string;
  category: string;
  users: number;
  thumbnail: string;
  isLive: boolean;
}

type PlatformStatus = 'Connected' | 'Available' | 'Not available';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: PlatformStatus;
  description: string;
  hasPreview?: boolean;
}

interface AIRPlayAnywherePageProps {
  game?: Game;
  vrWorld?: VRWorld;
  onBack: () => void;
  onNavigateToGamingPortal: () => void;
  onNavigateToVRSpacesHub: () => void;
  onNavigateToBrandCreatorSlots: () => void;
}

export default function AIRPlayAnywherePage({
  game,
  vrWorld,
  onBack,
  onNavigateToGamingPortal,
  onNavigateToVRSpacesHub,
  onNavigateToBrandCreatorSlots,
}: AIRPlayAnywherePageProps) {
  const contentName = game?.title || vrWorld?.name || 'Unknown';
  const contentType = game ? 'Game' : 'VR Space';

  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'mobile',
      name: 'Mobile (In-App)',
      icon: <Smartphone className="h-6 w-6" />,
      status: 'Available',
      description: 'Play directly in the NuVerse app',
    },
    {
      id: 'smartcubes',
      name: 'SmartCubes',
      icon: <Monitor className="h-6 w-6" />,
      status: 'Available',
      description: 'NuTech hardware with live preview',
      hasPreview: true,
    },
    {
      id: 'tv',
      name: 'TV (Wireless Cast)',
      icon: <Tv className="h-6 w-6" />,
      status: 'Available',
      description: 'Cast from NuVerse/A.I.R. app',
    },
    {
      id: 'console',
      name: 'NuTech AIR Console',
      icon: <Gamepad2 className="h-6 w-6" />,
      status: 'Not available',
      description: 'Official console connection',
    },
  ]);

  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform || platform.status === 'Not available') return;

    if (platform.status === 'Connected') {
      // Disconnect
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId ? { ...p, status: 'Available' as PlatformStatus } : p
        )
      );
      toast.success(`Disconnected from ${platform.name}`);
      return;
    }

    // Connect simulation
    setConnectingPlatform(platformId);
    toast.info(`Connecting to ${platform.name}...`);

    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId ? { ...p, status: 'Connected' as PlatformStatus } : p
        )
      );
      setConnectingPlatform(null);
      toast.success(`Connected to ${platform.name}`);
    }, 1500);
  };

  const handleLaunch = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform || platform.status !== 'Connected') return;

    toast.info(`Launching ${contentName} on ${platform.name}`, {
      description: 'Launch simulation - full integration coming soon.',
      duration: 3000,
    });
  };

  const handleUnavailableClick = (platformName: string) => {
    toast.info(`${platformName} Not Available`, {
      description: 'This platform is not yet supported. Check back soon!',
      duration: 3000,
    });
  };

  const getStatusIcon = (status: PlatformStatus) => {
    switch (status) {
      case 'Connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'Available':
        return <Wifi className="h-5 w-5 text-primary" />;
      case 'Not available':
        return <WifiOff className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: PlatformStatus) => {
    switch (status) {
      case 'Connected':
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            Connected
          </Badge>
        );
      case 'Available':
        return (
          <Badge variant="outline" className="border-primary/30 text-primary">
            Available
          </Badge>
        );
      case 'Not available':
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            Not available
          </Badge>
        );
    }
  };

  return (
    <div className="air-gaming-portal mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">A.I.R. Play Anywhere</h1>
          <p className="text-sm text-muted-foreground">
            Connect and sync your gaming session to any supported NuTech platform
          </p>
        </div>

        {/* Currently Controlled Item */}
        <Card className="air-gaming-card mb-4">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Currently Controlling</p>
            <div className="flex items-center gap-3">
              {game ? (
                <Gamepad2 className="h-8 w-8 text-primary" />
              ) : (
                <Headset className="h-8 w-8 text-accent" />
              )}
              <div>
                <p className="font-semibold text-foreground">{contentName}</p>
                <p className="text-xs text-muted-foreground">{contentType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={onNavigateToGamingPortal}
            variant="outline"
            size="sm"
            className="air-gaming-button border-primary/30 hover:bg-primary/10"
          >
            <Gamepad2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Gaming Portal</span>
          </Button>
          <Button
            onClick={onNavigateToVRSpacesHub}
            variant="outline"
            size="sm"
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Headset className="h-4 w-4 mr-1" />
            <span className="text-xs">VR Spaces</span>
          </Button>
          <Button
            onClick={onNavigateToBrandCreatorSlots}
            variant="outline"
            size="sm"
            className="air-gaming-button border-primary/30 hover:bg-primary/10"
          >
            <Users className="h-4 w-4 mr-1" />
            <span className="text-xs">Creator Slots</span>
          </Button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Available Platforms</h2>

        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={`air-gaming-card ${
              platform.status === 'Not available' ? 'opacity-60' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      platform.status === 'Connected'
                        ? 'bg-green-500/20'
                        : platform.status === 'Available'
                        ? 'bg-primary/20'
                        : 'bg-muted/20'
                    }`}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(platform.status)}
                  {getStatusBadge(platform.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* SmartCubes Live Preview Placeholder */}
              {platform.hasPreview && platform.status !== 'Not available' && (
                <div className="mb-3 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-primary mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">Live Preview</p>
                    <p className="text-xs text-muted-foreground">
                      {platform.status === 'Connected' ? 'Streaming...' : 'Not connected'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {platform.status === 'Not available' ? (
                  <Button
                    onClick={() => handleUnavailableClick(platform.name)}
                    disabled
                    variant="outline"
                    className="flex-1 border-muted-foreground/30"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Unavailable
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={connectingPlatform === platform.id}
                      variant={platform.status === 'Connected' ? 'outline' : 'default'}
                      className={`flex-1 ${
                        platform.status === 'Connected'
                          ? 'border-green-500/30 hover:bg-green-500/10'
                          : 'air-gaming-button bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {connectingPlatform === platform.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : platform.status === 'Connected' ? (
                        <>
                          <WifiOff className="h-4 w-4 mr-2" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Wifi className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                    {platform.status === 'Connected' && (
                      <Button
                        onClick={() => handleLaunch(platform.id)}
                        className="flex-1 air-gaming-button bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Launch
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Integration Features</h2>

        {/* AR/VR Integration Placeholder */}
        <Card className="air-gaming-card border-accent/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Headset className="h-5 w-5 text-accent" />
              AR/VR Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Immersive augmented and virtual reality experiences for supported content.
            </p>
            <Badge variant="outline" className="border-accent/30 text-accent">
              Coming soon
            </Badge>
          </CardContent>
        </Card>

        {/* SmartCube Interaction Placeholder */}
        <Card className="air-gaming-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              SmartCube Interaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Advanced hardware controls and real-time synchronization with NuTech SmartCubes.
            </p>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Not yet connected
            </Badge>
          </CardContent>
        </Card>

        {/* TV Casting Placeholder */}
        <Card className="air-gaming-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tv className="h-5 w-5 text-primary" />
              TV Casting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Wireless casting to compatible smart TVs and displays from your NuVerse app.
            </p>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Coming soon
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
