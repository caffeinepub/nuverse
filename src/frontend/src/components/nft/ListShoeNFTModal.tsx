import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronLeft, ChevronRight, DollarSign, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ListShoeNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    id: string;
    name: string;
    image: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    creator?: string;
    collection?: string;
  };
}

type Step = 1 | 2 | 3;
type Direction = 'forward' | 'backward';

const DURATION_OPTIONS = [
  { value: '1', label: '1 Day' },
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
];

export default function ListShoeNFTModal({ isOpen, onClose, nft }: ListShoeNFTModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [direction, setDirection] = useState<Direction>('forward');
  const [isListing, setIsListing] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setPrice('');
        setDuration('');
        setDirection('forward');
        setIsListing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNext = () => {
    setDirection('forward');
    setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
  };

  const handleBack = () => {
    setDirection('backward');
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
  };

  const handleListOnMarketplace = async () => {
    setIsListing(true);

    // Simulate listing process
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsListing(false);

    toast.success('NFT Listed Successfully!', {
      description: `${nft.name} is now available on the marketplace.`,
    });

    // Close modal after success
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const canProceedFromStep1 = price.trim() !== '' && parseFloat(price) > 0;
  const canProceedFromStep2 = duration !== '';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Epic':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'Rare':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDurationLabel = (value: string) => {
    const option = DURATION_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-primary" />
            List Shoe NFT
          </DialogTitle>
          <DialogDescription>
            Set your price and duration to list your NFT on the marketplace
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between px-4 py-6">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                    step < currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : step === currentStep
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-muted bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step === 1 && 'Set Price'}
                  {step === 2 && 'Duration'}
                  {step === 3 && 'Review'}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content with Animation */}
        <div className="relative min-h-[320px] overflow-hidden">
          {/* Step 1: Set Price */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 1
                ? 'opacity-100 translate-x-0'
                : direction === 'forward'
                ? 'opacity-0 -translate-x-full absolute inset-0'
                : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Set Your Price</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the listing price for your NFT
                  </p>
                </div>

                {/* NFT Preview Card */}
                <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{nft.name}</p>
                      <Badge
                        className={`mt-1 ${getRarityColor(nft.rarity)} border text-xs px-2 py-0.5 font-medium`}
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Price Input */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-base font-semibold text-foreground">
                    Listing Price
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-10 text-lg font-semibold h-14 rounded-xl border-2 border-primary/30 bg-background focus:border-primary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set a competitive price to attract buyers
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Choose Duration */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 2
                ? 'opacity-100 translate-x-0'
                : currentStep < 2
                ? 'opacity-0 translate-x-full absolute inset-0'
                : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Choose Duration</h3>
                  <p className="text-sm text-muted-foreground">
                    Select how long your NFT will be listed on the marketplace
                  </p>
                </div>

                {/* NFT Preview Card */}
                <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{nft.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Price: <span className="font-bold text-primary">${price}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Select */}
                <div className="space-y-3">
                  <Label htmlFor="duration" className="text-base font-semibold text-foreground">
                    Listing Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger
                      id="duration"
                      className="h-14 rounded-xl border-2 border-primary/30 bg-background text-lg font-semibold focus:border-primary"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <SelectValue placeholder="Select duration" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-base font-medium"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Your listing will automatically expire after this period
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Review Listing Preview */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 3
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Review Listing Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Confirm your listing details before publishing
                  </p>
                </div>

                {/* NFT Preview Card - Full Detail */}
                <div className="overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        NFT Name
                      </p>
                      <p className="text-xl font-bold text-foreground mt-1">{nft.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Rarity
                        </p>
                        <Badge
                          className={`mt-1 ${getRarityColor(nft.rarity)} border text-sm px-3 py-1 font-semibold`}
                        >
                          {nft.rarity}
                        </Badge>
                      </div>
                      {nft.creator && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Creator
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {nft.creator}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Listing Price
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-primary">${price}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-accent/10 p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-accent" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Duration
                          </span>
                        </div>
                        <span className="text-lg font-bold text-accent">
                          {getDurationLabel(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Preview Notice */}
                    <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm leading-relaxed text-foreground/90">
                        Your NFT will appear on the marketplace with these details. Buyers will be able to
                        purchase it at the listed price during the selected duration.
                      </p>
                    </div>
                  </div>
                </div>

                {/* List on Marketplace Button */}
                <Button
                  onClick={handleListOnMarketplace}
                  disabled={isListing}
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-6 text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                  {isListing ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Listing NFT...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-5 w-5" />
                      List on Marketplace
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep < 3 && (
          <DialogFooter className="gap-2 sm:gap-0">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="rounded-xl"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedFromStep1) ||
                (currentStep === 2 && !canProceedFromStep2)
              }
              className="rounded-xl bg-gradient-to-r from-primary to-accent font-semibold shadow-lg shadow-primary/30"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
