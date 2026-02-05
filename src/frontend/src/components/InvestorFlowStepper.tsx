import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'avatarXR' | 'nftShoewear' | 'airspace' | 'walletProfile' | 'music';

interface InvestorFlowStepperProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const flowSequence: Tab[] = ['avatarXR', 'nftShoewear', 'airspace', 'walletProfile', 'music'];

const tabLabels: Record<Tab, string> = {
  avatarXR: 'Avatar/XR',
  nftShoewear: 'NFT/Shoewear',
  airspace: 'AIRspace',
  walletProfile: 'Wallet/Profile',
  music: 'Music',
};

export default function InvestorFlowStepper({ activeTab, onTabChange }: InvestorFlowStepperProps) {
  const currentIndex = flowSequence.indexOf(activeTab);
  const nextTab = currentIndex < flowSequence.length - 1 ? flowSequence[currentIndex + 1] : null;

  if (!nextTab) return null;

  return (
    <div className="pitch-stepper fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
      <Button
        size="sm"
        variant="secondary"
        className="gap-2 shadow-lg backdrop-blur-sm"
        onClick={() => onTabChange(nextTab)}
      >
        <span className="text-xs">Next: {tabLabels[nextTab]}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
