import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Headset, Users, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { vrSpaceStorage } from '../utils/vrSpaceStorage';
import { PublishedVRSpace } from '../types/vrSpaceBuilder';

interface VRWorld {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'nightclub' | 'classroom' | 'custom';
  users: number;
  thumbnail: string;
  isLive: boolean;
}

interface AIRVRSpacesHubPageProps {
  onBackToGamingPortal: () => void;
  onNavigateToBrandDashboard: () => void;
  onNavigateToVRSpaceCreation: () => void;
  onNavigateToVRWorldDetail: (world: VRWorld) => void;
}

const mockVRWorlds: VRWorld[] = [
  {
    id: 'vr-1',
    name: 'Candy Land Paradise',
    description: 'A whimsical world of sweets and treats. Explore candy mountains, chocolate rivers, and gummy forests.',
    category: 'fantasy',
    users: 342,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-2',
    name: 'Neon Nightclub',
    description: 'Dance the night away in this futuristic club with pulsing beats and stunning light shows.',
    category: 'nightclub',
    users: 567,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-3',
    name: 'Virtual Classroom',
    description: 'Interactive learning space with 3D models, whiteboards, and collaborative tools.',
    category: 'classroom',
    users: 89,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-4',
    name: 'Cyber Lounge',
    description: 'A custom-built social space with cyberpunk aesthetics and chill vibes.',
    category: 'custom',
    users: 234,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-5',
    name: 'Midnight Club',
    description: 'Exclusive nightclub experience with VIP areas and live DJ performances.',
    category: 'nightclub',
    users: 445,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-6',
    name: 'Fantasy Arena',
    description: 'Medieval-themed world with castles, dragons, and epic quests.',
    category: 'fantasy',
    users: 198,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: false,
  },
  {
    id: 'vr-7',
    name: 'Study Hall Pro',
    description: 'Professional learning environment with advanced presentation tools.',
    category: 'classroom',
    users: 67,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
  {
    id: 'vr-8',
    name: 'Zen Garden',
    description: 'A peaceful custom world for meditation and relaxation.',
    category: 'custom',
    users: 123,
    thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
    isLive: true,
  },
];

export default function AIRVRSpacesHubPage({
  onBackToGamingPortal,
  onNavigateToBrandDashboard,
  onNavigateToVRSpaceCreation,
  onNavigateToVRWorldDetail,
}: AIRVRSpacesHubPageProps) {
  const [publishedSpaces, setPublishedSpaces] = useState<PublishedVRSpace[]>([]);

  useEffect(() => {
    // Load published spaces from local storage
    const spaces = vrSpaceStorage.getAllPublished();
    setPublishedSpaces(spaces);
  }, []);

  // Merge published spaces with mock worlds
  const allWorlds: VRWorld[] = [
    ...mockVRWorlds,
    ...publishedSpaces.map(space => ({
      id: space.id,
      name: space.name,
      description: space.description,
      category: space.category,
      users: space.users,
      thumbnail: '/assets/generated/gaming-icon.dim_64x64.png',
      isLive: space.isLive,
    })),
  ];

  const getCategoryIcon = (category: VRWorld['category']) => {
    switch (category) {
      case 'fantasy':
        return <Sparkles className="h-4 w-4" />;
      case 'nightclub':
        return <Users className="h-4 w-4" />;
      case 'classroom':
        return <Briefcase className="h-4 w-4" />;
      case 'custom':
        return <Headset className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: VRWorld['category']) => {
    switch (category) {
      case 'fantasy':
        return 'Fantasy';
      case 'nightclub':
        return 'Nightclub';
      case 'classroom':
        return 'Classroom';
      case 'custom':
        return 'Custom';
    }
  };

  return (
    <div className="air-gaming-portal mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToGamingPortal}
          className="mb-4 -ml-2 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gaming Portal
        </Button>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Headset className="h-8 w-8 text-accent" />
              A.I.R. VR Spaces Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Explore immersive virtual worlds and create your own VR experiences
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onNavigateToVRSpaceCreation}
            className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New VR Space
          </Button>

          <Button
            onClick={onNavigateToBrandDashboard}
            variant="outline"
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Brand/Creator Slots
          </Button>
        </div>
      </div>

      {/* VR Worlds Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Available VR Worlds</h2>
          <p className="text-sm text-muted-foreground">{allWorlds.length} worlds</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {allWorlds.map((world) => (
            <Card
              key={world.id}
              className="air-gaming-card cursor-pointer hover:border-accent/50 transition-all group"
              onClick={() => onNavigateToVRWorldDetail(world)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-primary/10 flex-shrink-0 group-hover:border-accent/40 transition-colors">
                    <img
                      src={world.thumbnail}
                      alt={world.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {world.isLive && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-accent text-accent-foreground text-xs px-2 py-0.5">
                          Live
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Users className="h-3 w-3" />
                        <span className="font-medium">{world.users}</span>
                      </div>
                    </div>
                  </div>

                  {/* World Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                        {world.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/5 text-xs flex-shrink-0 flex items-center gap-1"
                      >
                        {getCategoryIcon(world.category)}
                        {getCategoryLabel(world.category)}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {world.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToVRWorldDetail(world);
                        }}
                        className="air-gaming-button bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3"
                      >
                        <Headset className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {world.users} users online
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
