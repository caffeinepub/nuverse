import { WardrobeItem } from '../../types/avatarCloset';
import WardrobeItemCard from './WardrobeItemCard';

interface WardrobeItemGridProps {
  items: WardrobeItem[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
}

export default function WardrobeItemGrid({
  items,
  selectedItemId,
  onSelectItem,
}: WardrobeItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">No items available in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <WardrobeItemCard
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
}
