import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Eye, Headset, Star, Heart, Share2, MessageCircle, Gamepad2, Users, Sparkles, Monitor, Smartphone, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Game, GamePlatform } from '../mock/gamingPortalPlaceholders';

type DetailMode = 'game' | 'vrSpace';

interface VRWorld {
  id: string;
  name: string;
  description: string;
  category: string;
  users: number;
  thumbnail: string;
  isLive: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

interface AIRGameVRDetailPageProps {
  mode: DetailMode;
  game?: Game;
  vrWorld?: VRWorld;
  onBack: () => void;
  onNavigateToGamingPortal: () => void;
  onNavigateToVRSpacesHub: () => void;
  onNavigateToPlayAnywhere: () => void;
}

export default function AIRGameVRDetailPage({
  mode,
  game,
  vrWorld,
  onBack,
  onNavigateToGamingPortal,
  onNavigateToVRSpacesHub,
  onNavigateToPlayAnywhere,
}: AIRGameVRDetailPageProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const itemId = mode === 'game' ? game?.id : vrWorld?.id;
  const itemName = mode === 'game' ? game?.title : vrWorld?.name;

  // Load favorites and ratings from localStorage
  useEffect(() => {
    if (!itemId) return;
    
    const favKey = `air-favorite-${mode}-${itemId}`;
    const ratingKey = `air-rating-${mode}-${itemId}`;
    const commentsKey = `air-comments-${mode}-${itemId}`;

    const savedFav = localStorage.getItem(favKey);
    const savedRating = localStorage.getItem(ratingKey);
    const savedComments = localStorage.getItem(commentsKey);

    if (savedFav) setIsFavorited(JSON.parse(savedFav));
    if (savedRating) setUserRating(parseInt(savedRating, 10));
    if (savedComments) setComments(JSON.parse(savedComments));
  }, [itemId, mode]);

  const handleToggleFavorite = () => {
    if (!itemId) return;
    const newFavState = !isFavorited;
    setIsFavorited(newFavState);
    localStorage.setItem(`air-favorite-${mode}-${itemId}`, JSON.stringify(newFavState));
    toast.success(newFavState ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleShare = () => {
    toast.info('Share feature', {
      description: `Share link for "${itemName}" copied to clipboard (placeholder)`,
      duration: 3000,
    });
  };

  const handleRating = (rating: number) => {
    if (!itemId) return;
    setUserRating(rating);
    localStorage.setItem(`air-rating-${mode}-${itemId}`, rating.toString());
    toast.success(`Rated ${rating} stars`);
  };

  const handleAddComment = () => {
    if (!itemId || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment.trim(),
      timestamp: Date.now(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`air-comments-${mode}-${itemId}`, JSON.stringify(updatedComments));
    setNewComment('');
    toast.success('Comment added');
  };

  const handlePlayGame = () => {
    toast.info('Launching game...', {
      description: 'Game launch is a placeholder. Full integration coming soon.',
      duration: 3000,
    });
  };

  const handleEnterVRSpace = () => {
    toast.info('AR/VR Integration Coming Soon', {
      description: 'The VR experience is not yet connected. Full AR/VR integration will be available in a future update.',
      duration: 4000,
    });
  };

  const handlePreviewAR = () => {
    toast.info('AR Preview', {
      description: 'AR/VR integration not yet connected. This feature will enable immersive preview experiences.',
      duration: 4000,
    });
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

  if (!game && !vrWorld) {
    return (
      <div className="air-gaming-portal mx-auto max-w-4xl px-4 py-6">
        <p className="text-center text-muted-foreground">No content to display</p>
      </div>
    );
  }

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

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {mode === 'game' ? (
                <Gamepad2 className="h-8 w-8 text-primary" />
              ) : (
                <Headset className="h-8 w-8 text-accent" />
              )}
              <h1 className="text-3xl font-bold text-foreground">
                {mode === 'game' ? 'Game Detail' : 'VR Space Detail'}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {mode === 'game' ? 'Explore game information and play' : 'Explore VR world details and enter'}
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onNavigateToGamingPortal}
            variant="outline"
            className="air-gaming-button border-primary/30 hover:bg-primary/10"
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Gaming Portal
          </Button>
          <Button
            onClick={onNavigateToVRSpacesHub}
            variant="outline"
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Headset className="h-4 w-4 mr-2" />
            VR Spaces Hub
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Hero Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <img
            src={mode === 'game' ? game?.image : vrWorld?.thumbnail}
            alt={itemName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">{itemName}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {mode === 'game' && game && (
                <>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">
                    {game.type === 'classic' ? 'Classic' : game.type === 'aaa' ? 'AAA' : 'User Created'}
                  </Badge>
                  {game.isVRCompatible && (
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
                      <Headset className="h-3 w-3 mr-1" />
                      VR Ready
                    </Badge>
                  )}
                </>
              )}
              {mode === 'vrSpace' && vrWorld && (
                <>
                  <Badge variant="default" className="bg-accent/90 text-accent-foreground">
                    {vrWorld.isLive ? 'Live' : 'Offline'}
                  </Badge>
                  <div className="flex items-center gap-1 text-white text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{vrWorld.users} online</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="air-gaming-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Creator</p>
              <p className="font-semibold text-foreground">
                {mode === 'game' ? game?.creator : 'Community'}
              </p>
            </CardContent>
          </Card>

          <Card className="air-gaming-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <p className="font-semibold text-foreground">
                  {mode === 'game' ? game?.rating.toFixed(1) : '4.5'}
                </p>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="air-gaming-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Description</p>
            <p className="text-sm text-foreground leading-relaxed">
              {mode === 'game' ? game?.description : vrWorld?.description}
            </p>
          </CardContent>
        </Card>

        {/* Platform Compatibility (Game only) */}
        {mode === 'game' && game && (
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
        )}

        {/* Rules (placeholder) */}
        <Card className="air-gaming-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Rules & Guidelines</p>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>Respect all players and community members</li>
              <li>No cheating or exploiting game mechanics</li>
              <li>Follow content guidelines and age restrictions</li>
              {mode === 'vrSpace' && <li>Use VR equipment safely and responsibly</li>}
            </ul>
          </CardContent>
        </Card>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {mode === 'game' && (
            <Button
              onClick={handlePlayGame}
              className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="h-4 w-4 mr-2" />
              Play Game
            </Button>
          )}
          {mode === 'vrSpace' && (
            <Button
              onClick={handleEnterVRSpace}
              className="air-gaming-button bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Headset className="h-4 w-4 mr-2" />
              Enter VR
            </Button>
          )}
          <Button
            onClick={handlePreviewAR}
            variant="outline"
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview AR
          </Button>
        </div>

        {/* Play Anywhere Button */}
        <Button
          onClick={onNavigateToPlayAnywhere}
          className="w-full air-gaming-button bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
        >
          <Radio className="h-4 w-4 mr-2" />
          Play Anywhere
        </Button>

        {/* Interactive Options */}
        <Card className="air-gaming-card">
          <CardContent className="p-4 space-y-4">
            <p className="text-xs text-muted-foreground mb-3">Interactive Options</p>

            {/* Favorite & Share */}
            <div className="flex gap-3">
              <Button
                onClick={handleToggleFavorite}
                variant={isFavorited ? 'default' : 'outline'}
                className={`flex-1 ${isFavorited ? 'bg-primary hover:bg-primary/90' : 'border-primary/30 hover:bg-primary/10'}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= userRating
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="air-gaming-card">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Comments ({comments.length})</p>
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MessageCircle className="h-3 w-3 mr-2" />
                Add Comment
              </Button>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-3 pt-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-primary/10 bg-background/50 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-foreground">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
