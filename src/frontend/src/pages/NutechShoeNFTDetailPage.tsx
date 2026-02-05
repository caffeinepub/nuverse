import { ArrowLeft, User, Layers, Hash, FileText, Sparkles, TrendingUp, DollarSign, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AirExperiencesToggleSection from '@/components/nft/AirExperiencesToggleSection';
import { useGetAirIntegrationSettings, useUpdateAirIntegrationSettings } from '@/hooks/useQueries';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { AirIntegrationSettings } from '../backend';

interface NutechShoeNFTDetailPageProps {
  nft: {
    id: string;
    name: string;
    image: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    creator: string;
    collection: string;
    description: string;
  };
  onBack: () => void;
  onShowcaseOnProfile: () => void;
  onListOnMarketplace: () => void;
}

const rarityColors = {
  Common: 'bg-muted text-muted-foreground border-muted',
  Rare: 'bg-primary/20 text-primary border-primary/50',
  Epic: 'bg-accent/20 text-accent border-accent/50',
  Legendary: 'bg-gradient-to-r from-primary/30 to-accent/30 text-foreground border-primary/60',
};

const rarityGlow = {
  Common: 'shadow-md',
  Rare: 'shadow-lg shadow-primary/20',
  Epic: 'shadow-xl shadow-accent/30',
  Legendary: 'shadow-2xl shadow-primary/40',
};

export default function NutechShoeNFTDetailPage({ 
  nft, 
  onBack, 
  onShowcaseOnProfile, 
  onListOnMarketplace 
}: NutechShoeNFTDetailPageProps) {
  const { data: airSettings, isLoading: isLoadingSettings } = useGetAirIntegrationSettings(nft.id);
  const updateAirSettings = useUpdateAirIntegrationSettings();

  const [localSettings, setLocalSettings] = useState<AirIntegrationSettings>({
    enabledShoeHealth: false,
    enabledShoeMusic: false,
    enabledOledSync: false,
  });

  // Sync local state with fetched settings
  useEffect(() => {
    if (airSettings) {
      setLocalSettings(airSettings);
    }
  }, [airSettings]);

  const handleToggleChange = async (
    key: 'enabledShoeHealth' | 'enabledShoeMusic' | 'enabledOledSync',
    value: boolean
  ) => {
    // Optimistically update local state
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);

    try {
      await updateAirSettings.mutateAsync({
        nftId: nft.id,
        settings: newSettings,
      });
      toast.success('AIR settings updated successfully');
    } catch (error: any) {
      // Revert on error
      setLocalSettings(localSettings);
      console.error('Failed to update AIR settings:', error);
      
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to modify these settings');
      } else if (error.message?.includes('NFT not found')) {
        toast.error('NFT not found');
      } else {
        toast.error('Failed to update AIR settings');
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Shoe NFT Detail</h1>
            <p className="text-sm text-muted-foreground">View and manage your NFT</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Large Hero Image */}
          <Card className={`overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur-sm ${rarityGlow[nft.rarity]}`}>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="aspect-square w-full object-cover"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" 
                />
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    boxShadow: 'inset 0 0 60px rgba(var(--primary-rgb), 0.15), inset 0 -40px 40px rgba(var(--background-rgb), 0.3)' 
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          {/* NFT Name and Rarity Badge */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{nft.name}</h2>
            <Badge className={`${rarityColors[nft.rarity]} border-2 text-base px-4 py-1.5 font-semibold`}>
              <Sparkles className="mr-2 h-4 w-4" />
              {nft.rarity}
            </Badge>
          </div>

          {/* Info Sections - Card-based Layout */}
          <div className="grid gap-4">
            {/* Creator */}
            <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Creator</p>
                  <p className="text-lg font-bold text-foreground">{nft.creator}</p>
                </div>
              </CardContent>
            </Card>

            {/* Collection */}
            <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-full bg-accent/10 p-3">
                  <Layers className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Collection</p>
                  <p className="text-lg font-bold text-foreground">{nft.collection}</p>
                </div>
              </CardContent>
            </Card>

            {/* Token ID (Placeholder) */}
            <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-full bg-primary/10 p-3">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Token ID</p>
                  <p className="text-lg font-bold text-foreground font-mono">{nft.id.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-full bg-accent/10 p-3">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                  <p className="text-base leading-relaxed text-foreground/90">{nft.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AIR Integration Section */}
          <AirExperiencesToggleSection
            values={localSettings}
            onChange={handleToggleChange}
            isLoading={isLoadingSettings || updateAirSettings.isPending}
          />

          {/* Creator Economy Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <h3 className="text-xl font-bold text-foreground">Creator Economy</h3>
            </div>

            <div className="grid gap-4">
              {/* Royalty Percentage */}
              <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-500/10 backdrop-blur-sm hover:border-amber-500/50 transition-all shadow-lg shadow-amber-500/10">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="rounded-full bg-amber-500/20 p-3 ring-2 ring-amber-500/30">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Royalty Percentage</p>
                    <p className="text-2xl font-bold text-amber-500">5% per resale</p>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Tracker */}
              <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-500/10 backdrop-blur-sm hover:border-amber-500/50 transition-all shadow-lg shadow-amber-500/10">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-amber-500/20 p-3 ring-2 ring-amber-500/30">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Earnings Tracker</p>
                      <p className="text-2xl font-bold text-amber-500">$0.00</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-500/20">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Resales</p>
                      <p className="text-lg font-bold text-foreground">0</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Lifetime Earnings</p>
                      <p className="text-lg font-bold text-amber-500">$0.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Badge & Profile Link */}
              <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border-primary/50 border text-sm px-3 py-1 font-semibold">
                          Verified Creator
                        </Badge>
                      </div>
                      <button 
                        className="text-lg font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
                        onClick={() => {
                          // Placeholder for navigation to creator profile
                          console.log('Navigate to creator profile:', nft.creator);
                        }}
                      >
                        {nft.creator}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Economy Statement */}
              <Card className="border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent backdrop-blur-sm">
                <CardContent className="p-5">
                  <p className="text-center text-base font-medium text-foreground/90 leading-relaxed">
                    Creators earn on every resale.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onShowcaseOnProfile}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 py-6 text-lg font-bold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]"
            >
              Showcase on Profile
            </Button>

            <Button
              onClick={onListOnMarketplace}
              className="w-full rounded-xl bg-gradient-to-r from-accent to-accent/80 py-6 text-lg font-bold shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02]"
            >
              List on Marketplace
            </Button>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full rounded-xl border-2 border-primary/30 py-6 text-lg font-bold hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              Back to Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
