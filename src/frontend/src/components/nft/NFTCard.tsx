import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  onClick: () => void;
}

const rarityColors = {
  Common: 'bg-muted text-muted-foreground',
  Rare: 'bg-primary/20 text-primary border-primary/30',
  Epic: 'bg-accent/20 text-accent border-accent/30',
  Legendary: 'bg-gradient-to-r from-primary/30 to-accent/30 text-foreground border-primary/50',
};

export default function NFTCard({ name, image, rarity, onClick }: NFTCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-border/50 bg-card transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <h3 className="mb-2 truncate font-semibold text-foreground">{name}</h3>
        <Badge className={`${rarityColors[rarity]} border`}>{rarity}</Badge>
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
           style={{ boxShadow: '0 0 20px rgba(var(--primary), 0.3)' }} />
    </Card>
  );
}
