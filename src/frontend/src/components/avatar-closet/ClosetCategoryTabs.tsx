import { Button } from '@/components/ui/button';
import { WardrobeCategory } from '../../types/avatarCloset';

interface ClosetCategoryTabsProps {
  activeCategory: WardrobeCategory;
  onCategoryChange: (category: WardrobeCategory) => void;
}

const CATEGORIES: { value: WardrobeCategory; label: string }[] = [
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'outfits', label: 'Outfits' },
];

export default function ClosetCategoryTabs({
  activeCategory,
  onCategoryChange,
}: ClosetCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className="whitespace-nowrap"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
