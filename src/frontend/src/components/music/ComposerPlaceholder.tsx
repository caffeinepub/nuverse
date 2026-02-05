import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { toast } from 'sonner';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'];

export default function ComposerPlaceholder() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const playNote = (note: string, frequency: number) => {
    if (typeof window === 'undefined' || !window.AudioContext) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      setActiveNotes(prev => new Set(prev).add(note));
      setTimeout(() => {
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 500);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const noteFrequencies: Record<string, number> = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.0,
    A: 440.0,
    B: 493.88,
    C2: 523.25,
  };

  const handlePlaySequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      toast.info('Playback stopped');
      return;
    }

    setIsPlaying(true);
    toast.success('Playing demo sequence...');

    const sequence = ['C', 'E', 'G', 'C2', 'G', 'E'];
    sequence.forEach((note, index) => {
      setTimeout(() => {
        playNote(note, noteFrequencies[note]);
        if (index === sequence.length - 1) {
          setTimeout(() => setIsPlaying(false), 500);
        }
      }, index * 400);
    });
  };

  return (
    <div className="space-y-4">
      {/* Tone Pads Grid */}
      <div className="grid grid-cols-4 gap-2">
        {notes.map((note) => (
          <button
            key={note}
            onClick={() => playNote(note, noteFrequencies[note])}
            className={`
              aspect-square rounded-lg border transition-all duration-200
              ${activeNotes.has(note)
                ? 'bg-primary/30 border-primary scale-95 shadow-lg shadow-primary/50'
                : 'bg-card/50 border-border/50 hover:bg-card hover:border-primary/30 hover:scale-105'
              }
            `}
          >
            <span className="text-xs font-medium">{note}</span>
          </button>
        ))}
      </div>

      {/* Play Demo Button */}
      <Button
        onClick={handlePlaySequence}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isPlaying ? (
          <>
            <Square className="mr-2 h-3 w-3" />
            Stop Demo
          </>
        ) : (
          <>
            <Play className="mr-2 h-3 w-3" />
            Play Demo
          </>
        )}
      </Button>
    </div>
  );
}
