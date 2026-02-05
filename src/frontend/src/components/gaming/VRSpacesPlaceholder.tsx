import { X, Headset, Users, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VRSpacesPlaceholderProps {
  onClose: () => void;
}

export default function VRSpacesPlaceholder({ onClose }: VRSpacesPlaceholderProps) {
  const vrSpaces = [
    {
      id: 'vr-1',
      name: 'Neon Arcade',
      description: 'Classic arcade games in a vibrant neon environment',
      users: 234,
      status: 'Live',
    },
    {
      id: 'vr-2',
      name: 'Space Station Alpha',
      description: 'Zero-gravity gaming hub with cosmic views',
      users: 156,
      status: 'Live',
    },
    {
      id: 'vr-3',
      name: 'Fantasy Arena',
      description: 'Medieval-themed battle arena for competitive play',
      users: 89,
      status: 'Beta',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="air-gaming-panel w-full max-w-2xl rounded-t-3xl bg-card border-t-2 border-accent/30 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2">
            <Headset className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-bold text-foreground">VR Spaces</h2>
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
        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-center">
            <Sparkles className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-sm text-foreground font-medium mb-1">VR Spaces Coming Soon</p>
            <p className="text-xs text-muted-foreground">
              Immersive virtual reality environments for social gaming experiences
            </p>
          </div>

          {/* Preview VR Spaces */}
          <div className="space-y-3">
            {vrSpaces.map((space) => (
              <Card key={space.id} className="air-gaming-card hover:border-accent/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{space.name}</h3>
                      <p className="text-xs text-muted-foreground">{space.description}</p>
                    </div>
                    <Badge
                      variant={space.status === 'Live' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {space.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{space.users} online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Virtual</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
