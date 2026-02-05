import { useState } from 'react';
import { Search, Filter, Grid3x3, List, ArrowLeft, ShoppingCart, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useGetAllShoeProducts, useGetShoeProductsByCategory } from '@/hooks/useQueries';
import { ShoeCategory, type ShoeProduct } from '@/backend';
import NFTCard from '@/components/nft/NFTCard';
import { placeholderNFTs, type PlaceholderNFT } from '@/mock/nftPortalPlaceholders';

type ViewMode = 'grid' | 'carousel';
type FilterState = {
  brand: string;
  creator: string;
  style: string;
  nftStatus: 'all' | 'nft' | 'non-nft';
};

type NFTFilterState = {
  rarity: string;
  creator: string;
  collection: string;
};

type MarketplaceCategory = ShoeCategory | 'shoeNFTs';

interface ShoewearPageProps {
  onNavigateToDesigner?: () => void;
  onNavigateToHealthTracker?: () => void;
  onNavigateToNFTDetail?: (nft: PlaceholderNFT) => void;
  onNavigateToAccessories?: () => void;
}

export default function ShoewearPage({ onNavigateToDesigner, onNavigateToHealthTracker, onNavigateToNFTDetail, onNavigateToAccessories }: ShoewearPageProps) {
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>(ShoeCategory.sneakers);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<ShoeProduct | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    brand: 'all',
    creator: 'all',
    style: 'all',
    nftStatus: 'all',
  });
  const [nftFilters, setNftFilters] = useState<NFTFilterState>({
    rarity: 'all',
    creator: 'all',
    collection: 'all',
  });

  const { data: allProducts = [], isLoading } = useGetAllShoeProducts();
  const { data: categoryProducts = [] } = useGetShoeProductsByCategory(activeCategory as ShoeCategory);

  // Filter products based on search and filters
  const filteredProducts = (categoryProducts.length > 0 ? categoryProducts : allProducts).filter((product) => {
    const matchesSearch = product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.style.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filters.brand === 'all' || product.brand === filters.brand;
    const matchesStyle = filters.style === 'all' || product.style === filters.style;
    const matchesNFT = filters.nftStatus === 'all' || 
                      (filters.nftStatus === 'nft' && product.isNFT) ||
                      (filters.nftStatus === 'non-nft' && !product.isNFT);
    
    return matchesSearch && matchesBrand && matchesStyle && matchesNFT;
  });

  // Filter NFTs based on search and filters
  const filteredNFTs = placeholderNFTs.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = nftFilters.rarity === 'all' || nft.rarity === nftFilters.rarity;
    const matchesCreator = nftFilters.creator === 'all' || nft.creator === nftFilters.creator;
    const matchesCollection = nftFilters.collection === 'all' || nft.collection === nftFilters.collection;
    
    return matchesSearch && matchesRarity && matchesCreator && matchesCollection;
  });

  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand)));
  const uniqueStyles = Array.from(new Set(allProducts.map(p => p.style)));

  // NFT filter options
  const uniqueRarities = Array.from(new Set(placeholderNFTs.map(nft => nft.rarity)));
  const uniqueCreators = Array.from(new Set(placeholderNFTs.map(nft => nft.creator)));
  const uniqueCollections = Array.from(new Set(placeholderNFTs.map(nft => nft.collection)));

  const handleNavigateToSection = (section: string) => {
    if (section === 'designer' && onNavigateToDesigner) {
      onNavigateToDesigner();
    } else if (section === 'health' && onNavigateToHealthTracker) {
      onNavigateToHealthTracker();
    } else if (section === 'accessories' && onNavigateToAccessories) {
      onNavigateToAccessories();
    } else {
      console.log(`Navigate to ${section}`);
    }
  };

  const handleNFTClick = (nft: PlaceholderNFT) => {
    if (onNavigateToNFTDetail) {
      onNavigateToNFTDetail(nft);
    }
  };

  const handleClearNFTFilters = () => {
    setNftFilters({
      rarity: 'all',
      creator: 'all',
      collection: 'all',
    });
  };

  const isNFTCategory = activeCategory === 'shoeNFTs';

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Nutech Shoewear Marketplace
        </h1>
        <p className="text-sm text-muted-foreground">
          {isNFTCategory ? 'Browse exclusive Shoe NFT collectibles' : 'Discover exclusive digital footwear from creators and brands'}
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isNFTCategory ? "Search NFTs, creators, collections..." : "Search shoes, brands, creators..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="shrink-0"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'carousel' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('carousel')}
            className="shrink-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters - Shoe Products */}
      {showFilters && !isNFTCategory && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Brand</label>
                <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Style</label>
                <Select value={filters.style} onValueChange={(value) => setFilters({ ...filters, style: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Styles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {uniqueStyles.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">NFT Status</label>
                <Select value={filters.nftStatus} onValueChange={(value) => setFilters({ ...filters, nftStatus: value as FilterState['nftStatus'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="nft">NFT Only</SelectItem>
                    <SelectItem value="non-nft">Non-NFT Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({ brand: 'all', creator: 'all', style: 'all', nftStatus: 'all' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters - NFTs */}
      {showFilters && isNFTCategory && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Rarity</label>
                <Select value={nftFilters.rarity} onValueChange={(value) => setNftFilters({ ...nftFilters, rarity: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Rarities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    {uniqueRarities.map((rarity) => (
                      <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Creator</label>
                <Select value={nftFilters.creator} onValueChange={(value) => setNftFilters({ ...nftFilters, creator: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Creators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Creators</SelectItem>
                    {uniqueCreators.map((creator) => (
                      <SelectItem key={creator} value={creator}>{creator}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Collection</label>
                <Select value={nftFilters.collection} onValueChange={(value) => setNftFilters({ ...nftFilters, collection: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Collections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    {uniqueCollections.map((collection) => (
                      <SelectItem key={collection} value={collection}>{collection}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearNFTFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as MarketplaceCategory)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value={ShoeCategory.sneakers} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Sneakers
          </TabsTrigger>
          <TabsTrigger value={ShoeCategory.sportsShoes} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Sports Shoes
          </TabsTrigger>
          <TabsTrigger value={ShoeCategory.customDesigns} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Custom Designs
          </TabsTrigger>
          <TabsTrigger value="shoeNFTs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Shoe NFTs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* NFT Grid View */}
      {isNFTCategory ? (
        filteredNFTs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No NFTs found matching your criteria</p>
              <Button variant="link" onClick={() => {
                setSearchQuery('');
                handleClearNFTFilters();
              }}>
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                image={nft.image}
                rarity={nft.rarity}
                onClick={() => handleNFTClick(nft)}
              />
            ))}
          </div>
        )
      ) : (
        /* Products Grid/Carousel */
        isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 animate-pulse bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-2" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No shoes found matching your criteria</p>
              <Button variant="link" onClick={() => {
                setSearchQuery('');
                setFilters({ brand: 'all', creator: 'all', style: 'all', nftStatus: 'all' });
              }}>
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden border-primary/10 transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                onClick={() => setSelectedShoe(product)}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={product.image.getDirectURL()}
                    alt={product.brand}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  {product.isNFT && (
                    <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
                      <img src="/assets/generated/nft-badge-transparent.dim_48x48.png" alt="NFT" className="mr-1 h-3 w-3" />
                      NFT
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold text-foreground">{product.brand}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{product.style}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${Number(product.price)}</span>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer overflow-hidden border-primary/10 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                  onClick={() => setSelectedShoe(product)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 sm:h-auto sm:w-48">
                      <img
                        src={product.image.getDirectURL()}
                        alt={product.brand}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      {product.isNFT && (
                        <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
                          <img src="/assets/generated/nft-badge-transparent.dim_48x48.png" alt="NFT" className="mr-1 h-3 w-3" />
                          NFT
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold text-foreground">{product.brand}</h3>
                        <p className="mb-2 text-sm text-muted-foreground">{product.style}</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{product.details}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${Number(product.price)}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )
      )}

      {/* Navigation to Related Sections */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigateToSection('designer')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img src="/assets/generated/designer-icon-transparent.dim_64x64.png" alt="Designer" className="mb-3 h-12 w-12" />
            <h3 className="font-semibold">Designer</h3>
            <p className="text-xs text-muted-foreground">Create custom shoes</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigateToSection('health')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img src="/assets/generated/health-tracker-icon-transparent.dim_64x64.png" alt="Health Tracker" className="mb-3 h-12 w-12" />
            <h3 className="font-semibold">Health Tracker</h3>
            <p className="text-xs text-muted-foreground">Track your fitness</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigateToSection('nft')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img src="/assets/generated/nft-badge-transparent.dim_48x48.png" alt="NFT" className="mb-3 h-12 w-12" />
            <h3 className="font-semibold">NFT Gallery</h3>
            <p className="text-xs text-muted-foreground">Digital collectibles</p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          onClick={() => handleNavigateToSection('accessories')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <img src="/assets/generated/accessories-icon-transparent.dim_64x64.png" alt="Accessories" className="mb-3 h-12 w-12" />
            <h3 className="font-semibold">Accessories</h3>
            <p className="text-xs text-muted-foreground">Complete your look</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Shoe View Dialog */}
      <Dialog open={!!selectedShoe} onOpenChange={(open) => !open && setSelectedShoe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedShoe && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedShoe.brand}</DialogTitle>
                    <DialogDescription className="text-base">{selectedShoe.style}</DialogDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedShoe(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
                    <img
                      src={selectedShoe.image.getDirectURL()}
                      alt={selectedShoe.brand}
                      className="h-full w-full object-cover"
                    />
                    {selectedShoe.isNFT && (
                      <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground">
                        <img src="/assets/generated/nft-badge-transparent.dim_48x48.png" alt="NFT" className="mr-1 h-4 w-4" />
                        NFT Available
                      </Badge>
                    )}
                  </div>
                  
                  {/* AR Preview Placeholder */}
                  <Card className="border-dashed border-primary/30">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <img src="/assets/generated/ar-preview-placeholder.dim_300x200.png" alt="AR Preview" className="mb-4 h-32 w-auto opacity-50" />
                      <h4 className="mb-2 font-semibold">AR Virtual Try-On</h4>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Experience these shoes in augmented reality
                      </p>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-3xl font-bold text-primary">${Number(selectedShoe.price)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Category: {selectedShoe.category === ShoeCategory.sneakers ? 'Sneakers' : 
                                selectedShoe.category === ShoeCategory.sportsShoes ? 'Sports Shoes' : 
                                'Custom Designs'}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 font-semibold">Product Details</h4>
                    <p className="text-sm text-muted-foreground">{selectedShoe.details}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 font-semibold">Creator Information</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <p className="text-sm font-medium">Creator ID</p>
                        <p className="text-xs text-muted-foreground">{selectedShoe.creator.toString().slice(0, 20)}...</p>
                      </div>
                    </div>
                  </div>

                  {selectedShoe.isNFT && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="mb-2 font-semibold">NFT Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blockchain:</span>
                            <span className="font-medium">Internet Computer</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
