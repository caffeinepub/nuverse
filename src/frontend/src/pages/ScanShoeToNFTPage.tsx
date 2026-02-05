import { useState } from 'react';
import { ArrowLeft, Camera, Scan, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ScanShoeToNFTPageProps {
  onBack: () => void;
}

export default function ScanShoeToNFTPage({ onBack }: ScanShoeToNFTPageProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2000);
  };

  const handleCreateDigitalTwin = () => {
    // UI-only placeholder action
    console.log('Create Digital Twin clicked (UI only)');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scan Shoe to NFT</h1>
            <p className="text-sm text-muted-foreground">Link physical to digital</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Instruction Text */}
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-foreground">
            Scan your NuTech shoe to generate its digital twin.
          </p>
        </div>

        {/* Scanner Area */}
        <div className="relative mx-auto mb-6 max-w-md">
          <Card className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card/50 to-primary/5 p-0 shadow-2xl shadow-primary/20">
            {/* Camera Placeholder with Grid Overlay */}
            <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-background/80 to-primary/10">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px),
                      linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* Shoe Outline Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/assets/generated/shoe-outline-overlay.dim_800x800.png"
                  alt="Shoe outline guide"
                  className={`h-3/4 w-3/4 object-contain transition-all duration-500 ${
                    isScanning ? 'animate-pulse opacity-60' : 'opacity-40'
                  }`}
                />
              </div>

              {/* Scanning Animation */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-1 w-full animate-scan bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <Scan className="h-16 w-16 animate-pulse text-primary" />
                </div>
              )}

              {/* Scan Complete Indicator */}
              {hasScanned && !isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-16 w-16 text-primary animate-in zoom-in duration-300" />
                    <span className="text-sm font-semibold text-primary">Scan Complete</span>
                  </div>
                </div>
              )}

              {/* Corner Brackets */}
              <div className="pointer-events-none absolute inset-0">
                {/* Top-left */}
                <div className="absolute left-4 top-4 h-12 w-12 border-l-4 border-t-4 border-primary" />
                {/* Top-right */}
                <div className="absolute right-4 top-4 h-12 w-12 border-r-4 border-t-4 border-primary" />
                {/* Bottom-left */}
                <div className="absolute bottom-4 left-4 h-12 w-12 border-b-4 border-l-4 border-primary" />
                {/* Bottom-right */}
                <div className="absolute bottom-4 right-4 h-12 w-12 border-b-4 border-r-4 border-primary" />
              </div>

              {/* Glow Effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
            </div>

            {/* Camera Button */}
            {!hasScanned && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  size="lg"
                  className="rounded-full bg-primary px-8 py-6 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {isScanning ? 'Scanning...' : 'Start Scan'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Preview Panel */}
        {hasScanned && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden rounded-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
              <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Scanned Shoe Result
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                      src="/assets/generated/sneaker-neon-blue.dim_400x300.png"
                      alt="Scanned shoe"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground">NuTech Neon Runner</h4>
                    <p className="text-sm text-muted-foreground">Model: NTR-2026-BLU</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                        Verified Authentic
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl bg-background/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="font-semibold text-foreground">NuTech</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-semibold text-foreground">Performance Sneaker</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="font-semibold text-foreground">Neon Blue</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-semibold text-foreground">US 10</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Create Digital Twin Button */}
        {hasScanned && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button
              onClick={handleCreateDigitalTwin}
              size="lg"
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent py-6 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Create Digital Twin
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
