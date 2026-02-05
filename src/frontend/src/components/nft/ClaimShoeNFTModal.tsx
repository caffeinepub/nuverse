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
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ShoeDesign {
  id: string;
  name: string;
  image: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  creator: string;
}

// Placeholder shoe designs for selection
const SHOE_DESIGNS: ShoeDesign[] = [
  {
    id: 'design-1',
    name: 'Neon Runner Pro',
    image: '/assets/generated/sneaker-neon-blue.dim_400x300.png',
    rarity: 'Legendary',
    creator: 'NuTech Studios',
  },
  {
    id: 'design-2',
    name: 'LED Sports Elite',
    image: '/assets/generated/led-sports-shoe.dim_400x300.png',
    rarity: 'Epic',
    creator: 'Digital Footwear Co.',
  },
  {
    id: 'design-3',
    name: 'Holographic Custom',
    image: '/assets/generated/custom-holographic-sneaker.dim_400x300.png',
    rarity: 'Rare',
    creator: 'CustomKicks DAO',
  },
  {
    id: 'design-4',
    name: 'Red Runner Classic',
    image: '/assets/generated/running-shoe-red.dim_400x300.png',
    rarity: 'Common',
    creator: 'NuVerse Collective',
  },
  {
    id: 'design-5',
    name: 'Cyber Sprint X',
    image: '/assets/generated/sneaker-neon-blue.dim_400x300.png',
    rarity: 'Epic',
    creator: 'FutureFoot Labs',
  },
  {
    id: 'design-6',
    name: 'Quantum Leap',
    image: '/assets/generated/led-sports-shoe.dim_400x300.png',
    rarity: 'Legendary',
    creator: 'Quantum Designs',
  },
];

interface ClaimShoeNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;
type Direction = 'forward' | 'backward';

export default function ClaimShoeNFTModal({ isOpen, onClose }: ClaimShoeNFTModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedDesign, setSelectedDesign] = useState<ShoeDesign | null>(null);
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [direction, setDirection] = useState<Direction>('forward');
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow exit animation
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setSelectedDesign(null);
        setOwnershipConfirmed(false);
        setDirection('forward');
        setIsGenerating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNext = () => {
    setDirection('forward');
    setCurrentStep((prev) => Math.min(4, prev + 1) as Step);
  };

  const handleBack = () => {
    setDirection('backward');
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
  };

  const handleGenerateNFT = async () => {
    setIsGenerating(true);
    
    // Simulate NFT generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    
    toast.success('NFT Generated Successfully!', {
      description: `${selectedDesign?.name} has been added to your collection.`,
    });

    // Close modal after success
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const canProceedFromStep1 = selectedDesign !== null;
  const canProceedFromStep2 = ownershipConfirmed;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Claim Shoe NFT Flow
          </DialogTitle>
          <DialogDescription>
            Follow the steps to claim your exclusive shoe NFT
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-4 py-6">
          {[1, 2, 3, 4].map((step, index) => (
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
                  {step === 1 && 'Select'}
                  {step === 2 && 'Confirm'}
                  {step === 3 && 'Review'}
                  {step === 4 && 'Generate'}
                </span>
              </div>
              {index < 3 && (
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
        <div className="relative min-h-[300px] overflow-hidden">
          {/* Step 1: Select Shoe Design */}
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Your Shoe Design</h3>
                <p className="text-sm text-muted-foreground">
                  Choose one design from our exclusive collection
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {SHOE_DESIGNS.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedDesign?.id === design.id
                          ? 'border-primary shadow-lg shadow-primary/30'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={design.image}
                        alt={design.name}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-semibold text-foreground">{design.name}</p>
                        <span
                          className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${getRarityColor(
                            design.rarity
                          )}`}
                        >
                          {design.rarity}
                        </span>
                      </div>
                      {selectedDesign?.id === design.id && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Confirm Ownership */}
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
                <h3 className="text-lg font-semibold text-foreground">Confirm Ownership</h3>
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <img
                      src={selectedDesign?.image}
                      alt={selectedDesign?.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-lg font-bold text-foreground">{selectedDesign?.name}</p>
                      <span
                        className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${getRarityColor(
                          selectedDesign?.rarity || 'Common'
                        )}`}
                      >
                        {selectedDesign?.rarity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-6">
                  <h4 className="mb-3 font-semibold text-foreground">Terms & Conditions</h4>
                  <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>I confirm that I have the right to claim this NFT design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>I understand this action will mint a unique NFT to my wallet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>I agree to the NuVerse platform terms of service</span>
                    </li>
                  </ul>

                  <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                    <Checkbox
                      id="ownership"
                      checked={ownershipConfirmed}
                      onCheckedChange={(checked) => setOwnershipConfirmed(checked === true)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="ownership"
                      className="cursor-pointer text-sm font-medium leading-relaxed text-foreground"
                    >
                      I confirm ownership and agree to all terms and conditions
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Review NFT Info */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 3
                ? 'opacity-100 translate-x-0'
                : currentStep < 3
                ? 'opacity-0 translate-x-full absolute inset-0'
                : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Review NFT Information</h3>
                
                <div className="overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                  <img
                    src={selectedDesign?.image}
                    alt={selectedDesign?.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">NFT Name</p>
                      <p className="text-xl font-bold text-foreground">{selectedDesign?.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rarity</p>
                        <span
                          className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getRarityColor(
                            selectedDesign?.rarity || 'Common'
                          )}`}
                        >
                          {selectedDesign?.rarity}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Creator</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {selectedDesign?.creator}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Collection</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        NuVerse Exclusive Collection
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        This exclusive {selectedDesign?.rarity.toLowerCase()} shoe NFT features unique design elements
                        and will be permanently recorded on the blockchain. Once generated, it will be added to your
                        digital collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Generate NFT */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 4
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Ready to Generate</h3>
                
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/20 p-6">
                    <Sparkles className="h-16 w-16 text-primary" />
                  </div>
                  <h4 className="mb-2 text-2xl font-bold text-foreground">
                    {selectedDesign?.name}
                  </h4>
                  <span
                    className={`mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${getRarityColor(
                      selectedDesign?.rarity || 'Common'
                    )}`}
                  >
                    {selectedDesign?.rarity}
                  </span>
                  <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Click the button below to generate your NFT. This will create a unique digital asset that will be
                    added to your collection.
                  </p>
                  <Button
                    onClick={handleGenerateNFT}
                    disabled={isGenerating}
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-6 text-lg font-bold shadow-lg shadow-primary/30"
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Generating NFT...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate NFT
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep < 4 && (
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
