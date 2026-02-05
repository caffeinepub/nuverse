import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserNFTs } from '../hooks/useQueries';
import { Wallet, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface WalletPageProps {
  onNavigateToNFTPortal?: () => void;
}

export default function WalletPage({ onNavigateToNFTPortal }: WalletPageProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() || null;
  const { data: nfts, isLoading } = useGetUserNFTs(principal);
  const [nftImages, setNftImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (nfts) {
      nfts.forEach(async (nft) => {
        try {
          const bytes = await nft.image.getBytes();
          const blob = new Blob([bytes], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          setNftImages((prev) => ({ ...prev, [nft.id]: url }));
        } catch (error) {
          console.error('Failed to load NFT image:', error);
        }
      });
    }
  }, [nfts]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Wallet & NFTs</h2>
        <p className="text-sm text-muted-foreground">Manage your digital assets</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Principal ID</span>
              <span className="text-sm font-mono">
                {principal?.toString().slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">NFTs Owned</span>
              <span className="text-sm font-semibold">{nfts?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Portal Access Card */}
      <Card className="mb-6 overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-bold text-foreground">Nutech Shoe NFT Portal</h3>
              <p className="text-sm text-muted-foreground">
                Explore and manage your digital shoe collectibles
              </p>
            </div>
          </div>
          <Button
            onClick={onNavigateToNFTPortal}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-accent py-6 font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
          >
            Open NFT Portal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Your NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!nfts || nfts.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No NFTs yet. Create your first NFT!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {nfts.map((nft) => (
                <div key={nft.id} className="overflow-hidden rounded-lg border bg-card">
                  {nftImages[nft.id] ? (
                    <img 
                      src={nftImages[nft.id]} 
                      alt={nft.name}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="p-3">
                    <p className="truncate font-semibold">{nft.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{nft.metadata}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
