import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import type { Post } from '../backend';
import { useGetUserProfile } from '../hooks/useQueries';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  onViewProfile?: (principal: any) => void;
}

export default function PostCard({ post, onViewProfile }: PostCardProps) {
  const { data: authorProfile } = useGetUserProfile(post.author);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const avatarUrl = authorProfile?.avatar?.getDirectURL();
  const imageUrl = post.image?.getDirectURL();

  const handlePlayAudio = (audioId: string, audioUrl: string) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
      return;
    }

    try {
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      setPlayingAudioId(audioId);

      audioElement.onended = () => {
        setPlayingAudioId(null);
      };
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  return (
    <div className="pitch-surface rounded-lg p-4 space-y-3">
      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Avatar 
          className="h-10 w-10 cursor-pointer" 
          onClick={() => onViewProfile?.(post.author)}
        >
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={authorProfile?.username || 'User'} />
          ) : (
            <AvatarFallback className="bg-primary/10">
              {authorProfile?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <p 
            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
            onClick={() => onViewProfile?.(post.author)}
          >
            {authorProfile?.username || 'Anonymous'}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm">{post.content}</p>

      {/* Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Post" 
          className="w-full rounded-lg object-cover max-h-96"
        />
      )}

      {/* Audio Attachments */}
      {post.audioAttachments && post.audioAttachments.length > 0 && (
        <div className="space-y-2">
          {post.audioAttachments.map((audio) => {
            const audioUrl = audio.audioFile.getDirectURL();
            const isPlaying = playingAudioId === audio.id;

            return (
              <div
                key={audio.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/30"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayAudio(audio.id, audioUrl)}
                  className="flex-shrink-0"
                >
                  <Play className={`h-4 w-4 ${isPlaying ? 'text-primary' : ''}`} />
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{audio.title}</p>
                  <p className="text-xs text-muted-foreground">{audio.audioType}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
          <span className="text-xs">Like</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Comment</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </div>
    </div>
  );
}
