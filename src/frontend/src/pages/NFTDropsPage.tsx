import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NFTDropsPageProps {
  onBack: () => void;
}

interface DropData {
  id: string;
  name: string;
  image: string;
  editionSize: number;
  editionNumber: number;
  releaseTime: Date;
  creator: string;
  description: string;
}

// Placeholder drop data with future release times
const placeholderDrops: DropData[] = [
  {
    id: 'drop-1',
    name: 'Cyber Runner Elite',
    image: '/assets/generated/nft-drop-shoe-01.dim_800x800.png',
    editionSize: 500,
    editionNumber: 1,
    releaseTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    creator: 'NuTech Labs',
    description: 'Limited edition cyber-enhanced running shoes with holographic accents',
  },
  {
    id: 'drop-2',
    name: 'Neon Pulse Sneakers',
    image: '/assets/generated/nft-drop-shoe-02.dim_800x800.png',
    editionSize: 250,
    editionNumber: 1,
    releaseTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    creator: 'Digital Footwear Co.',
    description: 'Exclusive neon-themed sneakers with reactive LED patterns',
  },
  {
    id: 'drop-3',
    name: 'Quantum Stride',
    image: '/assets/generated/nft-drop-shoe-03.dim_800x800.png',
    editionSize: 1000,
    editionNumber: 1,
    releaseTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    creator: 'Future Kicks',
    description: 'Revolutionary quantum-inspired design with adaptive comfort technology',
  },
];

interface CountdownProps {
  targetDate: Date;
}

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isLive: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isLive: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isLive) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2">
        <Sparkles className="h-4 w-4 animate-pulse text-primary-foreground" />
        <span className="text-sm font-bold text-primary-foreground">Live Now</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-primary" />
      <div className="flex gap-1 text-sm font-mono font-semibold">
        {timeLeft.days > 0 && (
          <>
            <span className="rounded bg-primary/20 px-2 py-1 text-primary">{timeLeft.days}d</span>
          </>
        )}
        <span className="rounded bg-primary/20 px-2 py-1 text-primary">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="rounded bg-primary/20 px-2 py-1 text-primary">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="rounded bg-primary/20 px-2 py-1 text-primary">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}

interface DropCardProps {
  drop: DropData;
}

function DropCard({ drop }: DropCardProps) {
  const handleJoinDrop = () => {
    // UI-only placeholder action
    console.log('Join drop:', drop.id);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <img
          src={drop.image}
          alt={drop.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {/* Edition Badge */}
        <div className="absolute right-3 top-3">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
            <Users className="mr-1 h-3 w-3" />
            {drop.editionNumber} of {drop.editionSize}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3 p-4">
        {/* Title and Creator */}
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {drop.name}
          </h3>
          <p className="text-sm text-muted-foreground">by {drop.creator}</p>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {drop.description}
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <Countdown targetDate={drop.releaseTime} />
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoinDrop}
          className="w-full rounded-xl bg-gradient-to-r from-primary to-accent font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-95"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Join Drop
        </Button>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export default function NFTDropsPage({ onBack }: NFTDropsPageProps) {
  return (
    <div className="animate-in fade-in duration-300 relative min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/nft-drops-hero.dim_1200x600.png"
          alt="NFT Drops Hero"
          className="h-56 w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Header Title */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/30">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground drop-shadow-lg">
                Limited Shoe Drops
              </h1>
              <p className="text-sm text-muted-foreground">Exclusive NFT releases • Limited editions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 pb-24">
        {/* Stats Bar */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{placeholderDrops.length}</p>
            <p className="text-xs text-muted-foreground">Active Drops</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {placeholderDrops.reduce((sum, drop) => sum + drop.editionSize, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total NFTs</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{placeholderDrops.length}</p>
            <p className="text-xs text-muted-foreground">Creators</p>
          </div>
        </div>

        {/* Drop Cards Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Upcoming Drops</h2>
            <Badge variant="outline" className="border-primary/50 text-primary">
              <Clock className="mr-1 h-3 w-3" />
              Live Updates
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-foreground">How NFT Drops Work</h3>
              <p className="text-sm text-muted-foreground">
                Join exclusive drops to secure limited edition shoe NFTs. Each drop has a countdown timer showing when it goes live. 
                Click "Join Drop" to participate when the timer reaches zero. Limited quantities available!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
