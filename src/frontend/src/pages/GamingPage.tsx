import { useState } from 'react';
import { Search, Filter, Grid3x3, Users, Box, User, Boxes } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockGames, Game } from '../mock/gamingPortalPlaceholders';

interface GamingPageProps {
  onNavigateToBrandDashboard: () => void;
  onNavigateToVRSpacesHub: () => void;
  onNavigateToGameDetail: (game: Game) => void;
  onNavigateToAvatarGamePreview: () => void;
  onNavigateToAvatarSmartCubePreview?: () => void;
  onNavigateToXRWorldBuilder?: () => void;
}

export default function GamingPage({
  onNavigateToBrandDashboard,
  onNavigateToVRSpacesHub,
  onNavigateToGameDetail,
  onNavigateToAvatarGamePreview,
  onNavigateToAvatarSmartCubePreview,
  onNavigateToXRWorldBuilder,
}: GamingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vr' | 'mobile' | 'console'>('all');

  const filteredGames = mockGames.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'vr' && game.isVRCompatible) ||
      game.platforms.some(p => p.toLowerCase() === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="air-gaming-portal mx-auto max-w-4xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">A.I.R. Gaming Portal</h1>
        <p className="text-sm text-muted-foreground">
          Discover games, VR spaces, and immersive experiences
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 air-gaming-input"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="air-gaming-button"
          >
            <Filter className="mr-2 h-4 w-4" />
            All
          </Button>
          <Button
            variant={selectedFilter === 'vr' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('vr')}
            className="air-gaming-button"
          >
            VR Compatible
          </Button>
          <Button
            variant={selectedFilter === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('mobile')}
            className="air-gaming-button"
          >
            Mobile
          </Button>
          <Button
            variant={selectedFilter === 'console' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('console')}
            className="air-gaming-button"
          >
            Console
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="air-gaming-card cursor-pointer transition-all hover:scale-105"
          onClick={onNavigateToVRSpacesHub}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Box className="mb-3 h-10 w-10 text-accent" />
            <h3 className="font-semibold text-foreground">VR Spaces Hub</h3>
            <p className="mt-1 text-xs text-muted-foreground">Explore virtual worlds</p>
          </CardContent>
        </Card>

        <Card
          className="air-gaming-card cursor-pointer transition-all hover:scale-105"
          onClick={onNavigateToBrandDashboard}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Users className="mb-3 h-10 w-10 text-primary" />
            <h3 className="font-semibold text-foreground">Brand/Creator Slots</h3>
            <p className="mt-1 text-xs text-muted-foreground">Manage your uploads</p>
          </CardContent>
        </Card>

        <Card
          className="air-gaming-card cursor-pointer transition-all hover:scale-105"
          onClick={onNavigateToAvatarGamePreview}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <User className="mb-3 h-10 w-10 text-primary" />
            <h3 className="font-semibold text-foreground">Avatar Game Preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">Preview your avatar</p>
          </CardContent>
        </Card>

        {onNavigateToAvatarSmartCubePreview && (
          <Card
            className="air-gaming-card cursor-pointer transition-all hover:scale-105"
            onClick={onNavigateToAvatarSmartCubePreview}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Grid3x3 className="mb-3 h-10 w-10 text-accent" />
              <h3 className="font-semibold text-foreground">SmartCube Preview</h3>
              <p className="mt-1 text-xs text-muted-foreground">Sync to SmartCube</p>
            </CardContent>
          </Card>
        )}

        {onNavigateToXRWorldBuilder && (
          <Card
            className="air-gaming-card cursor-pointer transition-all hover:scale-105"
            onClick={onNavigateToXRWorldBuilder}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Boxes className="mb-3 h-10 w-10 text-accent" />
              <h3 className="font-semibold text-foreground">NuTech XR World Builder</h3>
              <p className="mt-1 text-xs text-muted-foreground">Build XR worlds</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Games Grid */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Available Games</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="air-gaming-card cursor-pointer transition-all hover:scale-105"
              onClick={() => onNavigateToGameDetail(game)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{game.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {game.type === 'classic' ? 'Classic Game' : game.type === 'aaa' ? 'AAA Game' : 'User Created'}
                    </CardDescription>
                  </div>
                  {game.isVRCompatible && (
                    <Badge variant="outline" className="border-accent/30 text-accent">
                      VR
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Rating: {game.rating}/5</span>
                  <span className="capitalize">{game.platforms.slice(0, 2).join(', ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No games found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
