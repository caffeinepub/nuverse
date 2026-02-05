import { useState } from 'react';
import { useGetAllAudioAttachments } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Play, Check } from 'lucide-react';
import type { AudioAttachment } from '../../backend';

interface AudioAssetPickerProps {
  selectedAudioId?: string | null;
  onSelect: (audio: AudioAttachment | null) => void;
}

export default function AudioAssetPicker({ selectedAudioId, onSelect }: AudioAssetPickerProps) {
  const { data: audioList = [], isLoading } = useGetAllAudioAttachments();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (audio: AudioAttachment) => {
    if (playingId === audio.id) {
      setPlayingId(null);
      return;
    }

    try {
      const audioUrl = audio.audioFile.getDirectURL();
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      setPlayingId(audio.id);

      audioElement.onended = () => {
        setPlayingId(null);
      };
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading audio...</p>;
  }

  if (audioList.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No audio files available</p>
        <p className="text-xs text-muted-foreground mt-1">Upload audio in the Music module</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Select Audio</p>
        {selectedAudioId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(null)}
          >
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2 pr-4">
          {audioList.map((audio) => {
            const isSelected = audio.id === selectedAudioId;
            const isPlaying = playingId === audio.id;

            return (
              <div
                key={audio.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50'
                  }
                `}
                onClick={() => onSelect(audio)}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(audio);
                  }}
                >
                  <Play className={`h-4 w-4 ${isPlaying ? 'text-primary' : ''}`} />
                </Button>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{audio.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {audio.audioType}
                  </p>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
