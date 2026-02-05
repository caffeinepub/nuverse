import { Sparkles, ShoppingBag, Zap, Wallet, Music } from 'lucide-react';

type Tab = 'avatarXR' | 'nftShoewear' | 'airspace' | 'walletProfile' | 'music';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'avatarXR' as const, label: 'Avatar/XR', icon: Sparkles },
  { id: 'nftShoewear' as const, label: 'NFT/Shoewear', icon: ShoppingBag },
  { id: 'airspace' as const, label: 'AIRspace', icon: Zap },
  { id: 'walletProfile' as const, label: 'Wallet/Profile', icon: Wallet },
  { id: 'music' as const, label: 'Music', icon: Music },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="pitch-nav fixed bottom-0 left-0 right-0 z-50">
      <div className="flex h-16 items-center justify-around px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition-all duration-200 ${
                isActive 
                  ? 'text-primary scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:scale-102'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'drop-shadow-glow' : ''}`} />
              <span className="text-[10px] font-medium leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
