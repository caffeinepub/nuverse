import { useState } from 'react';
import { Search, Filter, X, ShoppingCart, Heart, ArrowLeft, Package, DollarSign, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  accessoriesPlaceholderData,
  accessoryTypeLabels,
  uniqueBrands,
  uniqueCreators,
  uniqueTypes,
  type AccessoryItem,
  type AccessoryType,
} from '@/mock/accessoriesMarketplacePlaceholders';

interface NutechShoeAccessoriesMarketplacePageProps {
  onBack?: () => void;
  onNavigateToDesigner?: () => void;
  onNavigateToMarketplace?: () => void;
  onNavigateToHealthTracker?: () => void;
}

type ActionType = 'buy' | 'sell' | 'trade' | null;

export default function NutechShoeAccessoriesMarketplacePage({
  onBack,
  onNavigateToDesigner,
  onNavigateToMarketplace,
  onNavigateToHealthTracker,
}: NutechShoeAccessoriesMarketplacePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryItem | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [creatorFilter, setCreatorFilter] = useState<string>('all');

  // Action form states
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  // Filter accessories
  const filteredAccessories = accessoriesPlaceholderData.filter((accessory) => {
    const matchesSearch =
      accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accessory.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accessory.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accessory.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || accessory.type === typeFilter;
    const matchesBrand = brandFilter === 'all' || accessory.brand === brandFilter;
    const matchesCreator = creatorFilter === 'all' || accessory.creator === creatorFilter;

    return matchesSearch && matchesType && matchesBrand && matchesCreator;
  });

  const handleClearFilters = () => {
    setTypeFilter('all');
    setBrandFilter('all');
    setCreatorFilter('all');
    setSearchQuery('');
  };

  const handleAccessoryClick = (accessory: AccessoryItem) => {
    setSelectedAccessory(accessory);
  };

  const handleCloseDetail = () => {
    setSelectedAccessory(null);
    setActiveAction(null);
    resetActionForm();
  };

  const resetActionForm = () => {
    setQuantity('1');
    setPrice('');
    setNotes('');
  };

  const handleActionSubmit = () => {
    if (!selectedAccessory || !activeAction) return;

    const actionLabels = {
      buy: 'Purchase',
      sell: 'Listing',
      trade: 'Trade Offer',
    };

    toast.success(`${actionLabels[activeAction]} Confirmed!`, {
      description: `${selectedAccessory.name} - ${actionLabels[activeAction].toLowerCase()} has been processed successfully.`,
    });

    setActiveAction(null);
    resetActionForm();
  };

  const handleNavigate = (destination: string) => {
    if (destination === 'designer' && onNavigateToDesigner) {
      onNavigateToDesigner();
    } else if (destination === 'marketplace' && onNavigateToMarketplace) {
      onNavigateToMarketplace();
    } else if (destination === 'health' && onNavigateToHealthTracker) {
      onNavigateToHealthTracker();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header with Hero Banner */}
      <div className="mb-6 overflow-hidden rounded-xl">
        <div className="relative h-48 w-full">
          <img
            src="/assets/generated/accessories-marketplace-hero.dim_1200x600.png"
            alt="Accessories Marketplace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Nutech Shoe Accessories Marketplace
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse, buy, sell, and trade exclusive shoe accessories
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accessories, brands, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-primary/20 focus:border-primary"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {accessoryTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Brand</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Creator</label>
                <Select value={creatorFilter} onValueChange={setCreatorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Creators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Creators</SelectItem>
                    {uniqueCreators.map((creator) => (
                      <SelectItem key={creator} value={creator}>
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      {filteredAccessories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-semibold">No accessories found</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button variant="link" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAccessories.map((accessory) => (
            <Card
              key={accessory.id}
              className="group cursor-pointer overflow-hidden border-primary/10 transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              onClick={() => handleAccessoryClick(accessory)}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-4">
                <img
                  src={accessory.image}
                  alt={accessory.name}
                  className="h-full w-full object-contain transition-transform group-hover:scale-110"
                />
                {!accessory.inStock && (
                  <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {accessoryTypeLabels[accessory.type]}
                </Badge>
                <h3 className="mb-1 font-semibold text-foreground">{accessory.name}</h3>
                <p className="mb-2 text-xs text-muted-foreground">{accessory.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${accessory.price}</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation Shortcuts */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigate('designer')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img
              src="/assets/generated/designer-icon-transparent.dim_64x64.png"
              alt="Designer"
              className="mb-3 h-12 w-12"
            />
            <h3 className="font-semibold">Shoe Designer</h3>
            <p className="text-xs text-muted-foreground">Create custom designs</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigate('marketplace')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img
              src="/assets/generated/shoewear-icon.dim_64x64.png"
              alt="Marketplace"
              className="mb-3 h-12 w-12"
            />
            <h3 className="font-semibold">Shoewear Marketplace</h3>
            <p className="text-xs text-muted-foreground">Browse shoes</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigate('health')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img
              src="/assets/generated/health-tracker-icon-transparent.dim_64x64.png"
              alt="Health Tracker"
              className="mb-3 h-12 w-12"
            />
            <h3 className="font-semibold">Health Tracker</h3>
            <p className="text-xs text-muted-foreground">Track your fitness</p>
          </CardContent>
        </Card>
      </div>

      {/* Accessory Detail Dialog */}
      <Dialog open={!!selectedAccessory} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAccessory && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedAccessory.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedAccessory.brand} • {selectedAccessory.creator}
                    </DialogDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCloseDetail}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Image and AR Preview Section */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 p-8">
                    <img
                      src={selectedAccessory.image}
                      alt={selectedAccessory.name}
                      className="h-64 w-full object-contain"
                    />
                    {!selectedAccessory.inStock && (
                      <Badge className="absolute right-4 top-4 bg-destructive text-destructive-foreground">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* AR Preview Placeholder */}
                  <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <img
                        src="/assets/generated/accessories-ar-preview-placeholder.dim_600x400.png"
                        alt="AR Preview"
                        className="mb-4 h-32 w-auto rounded-lg opacity-70"
                      />
                      <h4 className="mb-2 font-semibold text-primary">AR Preview</h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        See how this accessory looks on your shoes or sneaker avatars in augmented
                        reality
                      </p>
                      <Button variant="outline" disabled className="border-primary/50">
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-3xl font-bold text-primary">
                      ${selectedAccessory.price}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {accessoryTypeLabels[selectedAccessory.type]}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{selectedAccessory.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-3 font-semibold">Features</h4>
                    <ul className="space-y-2">
                      {selectedAccessory.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 font-semibold">Creator</h4>
                    <p className="text-sm text-muted-foreground">{selectedAccessory.creator}</p>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setActiveAction('buy')}
                      disabled={!selectedAccessory.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setActiveAction('sell')}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Sell
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveAction('trade')}
                      >
                        <Repeat className="mr-2 h-4 w-4" />
                        Trade
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Buy/Sell/Trade Action Dialog */}
      <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeAction === 'buy' && 'Purchase Accessory'}
              {activeAction === 'sell' && 'List Accessory for Sale'}
              {activeAction === 'trade' && 'Propose Trade'}
            </DialogTitle>
            <DialogDescription>
              {activeAction === 'buy' && 'Complete your purchase details'}
              {activeAction === 'sell' && 'Set your listing details'}
              {activeAction === 'trade' && 'Describe your trade offer'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1"
              />
            </div>

            {(activeAction === 'sell' || activeAction === 'trade') && (
              <div>
                <Label htmlFor="price">
                  {activeAction === 'sell' ? 'Asking Price ($)' : 'Trade Value ($)'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">
                {activeAction === 'buy' && 'Delivery Notes (Optional)'}
                {activeAction === 'sell' && 'Item Condition & Notes'}
                {activeAction === 'trade' && 'Trade Details'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  activeAction === 'buy'
                    ? 'Add any special delivery instructions...'
                    : activeAction === 'sell'
                    ? 'Describe the condition and any additional details...'
                    : 'What are you offering in trade?'
                }
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleActionSubmit}>
              {activeAction === 'buy' && 'Confirm Purchase'}
              {activeAction === 'sell' && 'List Item'}
              {activeAction === 'trade' && 'Send Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
