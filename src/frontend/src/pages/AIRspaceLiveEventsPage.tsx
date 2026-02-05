import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Users, ThumbsUp, MessageCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useGetLiveEvents,
  useJoinLiveEvent,
  useGetUserProfile,
} from '../hooks/useQueries';
import type { LiveEvent } from '../backend';
import { toast } from 'sonner';

interface AIRspaceLiveEventsPageProps {
  onBack: () => void;
  onNavigateToProfile: () => void;
}

export default function AIRspaceLiveEventsPage({ onBack, onNavigateToProfile }: AIRspaceLiveEventsPageProps) {
  const { data: events, isLoading } = useGetLiveEvents();
  const joinEventMutation = useJoinLiveEvent();

  const handleJoinEvent = async (eventId: bigint) => {
    try {
      await joinEventMutation.mutateAsync(eventId);
      toast.success('Successfully joined the event!');
    } catch (error: any) {
      if (error.message?.includes('Already participating')) {
        toast.info('You have already joined this event');
      } else {
        toast.error('Failed to join event');
      }
    }
  };

  const handleVoteEvent = (eventId: bigint) => {
    toast.info('Voting feature coming soon!');
  };

  const handleCommentEvent = (eventId: bigint) => {
    toast.info('Comment feature coming soon!');
  };

  // Filter for active events only
  const activeEvents = events?.filter(event => event.isActive) || [];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <img 
            src="/assets/generated/back-arrow-icon-transparent.dim_32x32.png" 
            alt="Back" 
            className="h-6 w-6"
          />
        </Button>
        <h1 className="text-lg font-bold">Live Events & Challenges</h1>
        <Button variant="ghost" size="icon" onClick={onNavigateToProfile}>
          <img 
            src="/assets/generated/profile-icon.dim_64x64.png" 
            alt="Profile" 
            className="h-6 w-6"
          />
        </Button>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 px-4 py-8">
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-destructive shadow-lg shadow-destructive/50" />
            <Badge variant="destructive" className="font-semibold">
              LIVE NOW
            </Badge>
          </div>
          <h2 className="mb-2 text-2xl font-bold">Live Events & Challenges</h2>
          <p className="text-sm text-muted-foreground">
            Join creator-hosted live streams, AR/VR competitions, and creative challenges
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <img 
            src="/assets/generated/event-glow-overlay-transparent.dim_400x400.png" 
            alt="" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 py-6">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeEvents.length > 0 ? (
            <div className="space-y-4">
              {activeEvents.map((event) => (
                <LiveEventCard
                  key={event.id.toString()}
                  event={event}
                  onJoin={handleJoinEvent}
                  onVote={handleVoteEvent}
                  onComment={handleCommentEvent}
                  isJoining={joinEventMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-12 text-center">
              <div className="mb-4 text-6xl">🎥</div>
              <h3 className="mb-2 text-lg font-semibold">No active events</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for new live events and challenges
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

// Live Event Card Component
function LiveEventCard({
  event,
  onJoin,
  onVote,
  onComment,
  isJoining,
}: {
  event: LiveEvent;
  onJoin: (eventId: bigint) => void;
  onVote: (eventId: bigint) => void;
  onComment: (eventId: bigint) => void;
  isJoining: boolean;
}) {
  const { data: hostProfile } = useGetUserProfile(event.host);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [hostAvatarUrl, setHostAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (event.thumbnail) {
      event.thumbnail.getBytes().then((bytes) => {
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setThumbnailUrl(url);
      }).catch((error) => {
        console.error('Failed to load thumbnail:', error);
      });
    }
  }, [event.thumbnail]);

  useEffect(() => {
    if (hostProfile?.avatar) {
      hostProfile.avatar.getBytes().then((bytes) => {
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setHostAvatarUrl(url);
      }).catch((error) => {
        console.error('Failed to load host avatar:', error);
      });
    }
  }, [hostProfile?.avatar]);

  const hostInitials = event.hostName.slice(0, 2).toUpperCase();
  const isPopular = Number(event.participantCount) > 10;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20">
      {/* Glow effect for popular events */}
      {isPopular && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      )}
      
      <CardContent className="relative p-0">
        {/* Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={event.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play className="h-16 w-16 text-primary/40" />
            </div>
          )}
          
          {/* Live Badge */}
          {event.isActive && (
            <div className="absolute left-3 top-3">
              <Badge variant="destructive" className="animate-pulse font-semibold shadow-lg">
                🔴 LIVE
              </Badge>
            </div>
          )}

          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute right-3 top-3">
              <Badge className="bg-accent font-semibold shadow-lg">
                🔥 POPULAR
              </Badge>
            </div>
          )}

          {/* Challenge Badge */}
          <div className="absolute bottom-3 right-3">
            <img 
              src="/assets/generated/creative-challenge-badge-transparent.dim_64x64.png" 
              alt="Challenge" 
              className="h-10 w-10 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Host Info */}
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              {hostAvatarUrl ? (
                <AvatarImage src={hostAvatarUrl} alt={event.hostName} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold">
                {hostInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{event.hostName}</p>
              <p className="text-xs text-muted-foreground">Host</p>
            </div>
          </div>

          {/* Event Title & Description */}
          <h3 className="mb-2 text-lg font-bold line-clamp-1">{event.title}</h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>

          {/* Stats */}
          <div className="mb-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-medium">{event.participantCount.toString()}</span>
              <span className="text-xs">participants</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{event.votes.toString()}</span>
              <span className="text-xs">votes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => onJoin(event.id)}
              disabled={isJoining}
              className="flex-1 bg-gradient-to-r from-primary to-accent font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              {isJoining ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Join
            </Button>
            <Button
              onClick={() => onVote(event.id)}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onComment(event.id)}
              variant="outline"
              className="border-accent/30 hover:bg-accent/10"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
