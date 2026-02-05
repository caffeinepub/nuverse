import { WardrobeItem } from '../../types/avatarCloset';
import { Check } from 'lucide-react';

interface WardrobeItemCardProps {
  item: WardrobeItem;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
}

export default function WardrobeItemCard({
  item,
  isSelected,
  onSelect,
}: WardrobeItemCardProps) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      {/* Item visual representation */}
      <div
        className="h-16 w-16 rounded-full border-2 border-border shadow-md"
        style={{
          backgroundColor: item.color || '#888',
          boxShadow: isSelected ? `0 0 20px ${item.color || '#888'}40` : undefined,
        }}
      />
      
      {/* Item name */}
      <span className="text-center text-sm font-medium">{item.name}</span>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}
