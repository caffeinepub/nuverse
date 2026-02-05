import { useState } from 'react';
import { ArrowLeft, Sparkles, ShoppingBag, Palette, Activity, User, Scan, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NFTCard from '../components/nft/NFTCard';
import ClaimShoeNFTModal from '../components/nft/ClaimShoeNFTModal';
import { placeholderNFTs, SHOW_EMPTY_STATE, PlaceholderNFT } from '../mock/nftPortalPlaceholders';

interface NutechShoeNFTPortalPageProps {
  onBack: () => void;
  onNavigateToMarketplace?: () => void;
  onNavigateToDesigner?: () => void;
  onNavigateToHealthTracker?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNFTDetail?: (nft: PlaceholderNFT) => void;
  onNavigateToScanShoeToNFT?: () => void;
  onNavigateToNFTDrops?: () => void;
}

export default function NutechShoeNFTPortalPage({
  onBack,
  onNavigateToMarketplace,
  onNavigateToDesigner,
  onNavigateToHealthTracker,
  onNavigateToProfile,
  onNavigateToNFTDetail,
  onNavigateToScanShoeToNFT,
  onNavigateToNFTDrops,
}: NutechShoeNFTPortalPageProps) {
  const displayNFTs = SHOW_EMPTY_STATE ? [] : placeholderNFTs;
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const handleNFTClick = (nft: PlaceholderNFT) => {
    if (onNavigateToNFTDetail) {
      onNavigateToNFTDetail(nft);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 relative min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/nutech-nft-portal-hero.dim_1200x600.png"
          alt="NFT Portal Hero"
          className="h-48 w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
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
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/nft-chip-icon.dim_256x256.png"
              alt="NFT Icon"
              className="h-12 w-12 drop-shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground drop-shadow-lg">NFT Portal</h1>
              <p className="text-sm text-muted-foreground">Manage your digital shoe collectibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* NFT Drops Banner */}
        {onNavigateToNFTDrops && (
          <div 
            onClick={onNavigateToNFTDrops}
            className="mb-6 cursor-pointer overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/20 to-accent/20 p-6 backdrop-blur-sm transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3 shadow-lg">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Limited Shoe Drops</h3>
                  <p className="text-sm text-muted-foreground">Exclusive NFT releases • Join now</p>
                </div>
              </div>
              <Sparkles className="h-6 w-6 animate-pulse text-primary" />
            </div>
          </div>
        )}

        {displayNFTs.length === 0 ? (
          // Empty State
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/50 bg-card/50 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 rounded-full bg-primary/10 p-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">No NFTs Yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              You don't own any shoe NFTs yet. Start collecting unique digital footwear from the marketplace or claim your first NFT!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={onNavigateToMarketplace}
                className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/30"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Marketplace
              </Button>
              <Button
                onClick={() => setIsClaimModalOpen(true)}
                variant="outline"
                className="rounded-xl border-2 border-primary px-8 py-6 text-lg font-semibold hover:bg-primary/10"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Claim NFT
              </Button>
              <Button
                onClick={onNavigateToScanShoeToNFT}
                variant="outline"
                className="rounded-xl border-2 border-accent px-8 py-6 text-lg font-semibold hover:bg-accent/10"
              >
                <Scan className="mr-2 h-5 w-5" />
                Scan Shoe
              </Button>
            </div>
          </div>
        ) : (
          // NFT Grid
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Your Collection</h2>
              <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                {displayNFTs.length} NFTs
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {displayNFTs.map((nft) => (
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
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border/50 bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-3">
          <button
            onClick={onNavigateToMarketplace}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all hover:bg-primary/10 active:scale-95"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-foreground">Marketplace</span>
          </button>
          <button
            onClick={onNavigateToDesigner}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all hover:bg-accent/10 active:scale-95"
          >
            <Palette className="h-6 w-6 text-accent" />
            <span className="text-xs font-medium text-foreground">Designer</span>
          </button>
          <button
            onClick={onNavigateToScanShoeToNFT}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all hover:bg-primary/10 active:scale-95"
          >
            <Scan className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-foreground">Scan</span>
          </button>
          <button
            onClick={onNavigateToHealthTracker}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all hover:bg-primary/10 active:scale-95"
          >
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-foreground">Health</span>
          </button>
          <button
            onClick={onNavigateToProfile}
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all hover:bg-accent/10 active:scale-95"
          >
            <User className="h-6 w-6 text-accent" />
            <span className="text-xs font-medium text-foreground">Profile</span>
          </button>
        </div>
      </div>

      {/* Claim NFT Modal */}
      <ClaimShoeNFTModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </div>
  );
}
