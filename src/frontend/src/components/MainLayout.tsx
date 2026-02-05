import { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import CreateButton from './CreateButton';
import InvestorFlowStepper from './InvestorFlowStepper';
import AIRspacePage from '../pages/AIRspacePage';
import ShoewearPage from '../pages/ShoewearPage';
import GamingPage from '../pages/GamingPage';
import WalletPage from '../pages/WalletPage';
import ProfilePage from '../pages/ProfilePage';
import MusicModulePage from '../pages/MusicModulePage';
import AIRspaceProfilePage from '../pages/AIRspaceProfilePage';
import AIRspaceMessagingPage from '../pages/AIRspaceMessagingPage';
import AIRspaceLiveEventsPage from '../pages/AIRspaceLiveEventsPage';
import AIRspaceMonetizationPage from '../pages/AIRspaceMonetizationPage';
import ShoeDesignerPage from '../pages/ShoeDesignerPage';
import NutechShoeHealthTrackerPage from '../pages/NutechShoeHealthTrackerPage';
import NutechShoeNFTPortalPage from '../pages/NutechShoeNFTPortalPage';
import NutechShoeNFTDetailPage from '../pages/NutechShoeNFTDetailPage';
import ScanShoeToNFTPage from '../pages/ScanShoeToNFTPage';
import NFTDropsPage from '../pages/NFTDropsPage';
import NutechShoeAccessoriesMarketplacePage from '../pages/NutechShoeAccessoriesMarketplacePage';
import NutechBrandCreatorDashboardPage from '../pages/NutechBrandCreatorDashboardPage';
import AIRVRSpacesHubPage from '../pages/AIRVRSpacesHubPage';
import AIRVRSpaceCreationPage from '../pages/AIRVRSpaceCreationPage';
import AIRBrandCreatorSlotsPage from '../pages/AIRBrandCreatorSlotsPage';
import AIRGameVRDetailPage from '../pages/AIRGameVRDetailPage';
import AIRPlayAnywherePage from '../pages/AIRPlayAnywherePage';
import AvatarBuilderPage from '../pages/AvatarBuilderPage';
import AvatarClosetPage from '../pages/AvatarClosetPage';
import AvatarGamePreviewPage from '../pages/AvatarGamePreviewPage';
import AvatarSmartCubePreviewPage from '../pages/AvatarSmartCubePreviewPage';
import NuTechXRWorldBuilderPage from '../pages/NuTechXRWorldBuilderPage';
import AvatarGLBGeneratorPage from '../pages/AvatarGLBGeneratorPage';
import { Principal } from '@dfinity/principal';
import type { PlaceholderNFT } from '../mock/nftPortalPlaceholders';
import type { Game } from '../mock/gamingPortalPlaceholders';

type Tab = 'avatarXR' | 'nftShoewear' | 'airspace' | 'walletProfile' | 'music';

type View =
  | 'main'
  | 'profile'
  | 'messaging'
  | 'liveEvents'
  | 'monetization'
  | 'shoeDesigner'
  | 'shoeHealthTracker'
  | 'shoeNFTPortal'
  | 'shoeNFTDetail'
  | 'scanShoeToNFT'
  | 'nftDrops'
  | 'accessoriesMarketplace'
  | 'brandCreatorDashboard'
  | 'vrSpacesHub'
  | 'vrSpaceCreation'
  | 'brandCreatorSlots'
  | 'gameVRDetail'
  | 'playAnywhere'
  | 'avatarBuilder'
  | 'avatarCloset'
  | 'avatarGamePreview'
  | 'avatarSmartCubePreview'
  | 'xrWorldBuilder'
  | 'avatarGLBGenerator';

interface MainLayoutProps {
  onLogout: () => void;
}

export default function MainLayout({ onLogout }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>('avatarXR');
  const [currentView, setCurrentView] = useState<View>('main');
  const [selectedNFT, setSelectedNFT] = useState<PlaceholderNFT | null>(null);
  const [selectedGameOrVRId, setSelectedGameOrVRId] = useState<string | null>(null);
  const [selectedGameOrVRMode, setSelectedGameOrVRMode] = useState<'game' | 'vrSpace'>('game');
  const [selectedUserPrincipal, setSelectedUserPrincipal] = useState<Principal | null>(null);
  const [showDashboardCreate, setShowDashboardCreate] = useState(false);

  const handleNavigateToProfile = (principal?: Principal) => {
    if (principal) {
      setSelectedUserPrincipal(principal);
    }
    setCurrentView('profile');
  };

  const handleNavigateToMessaging = () => {
    setCurrentView('messaging');
  };

  const handleNavigateToLiveEvents = () => {
    setCurrentView('liveEvents');
  };

  const handleNavigateToMonetization = () => {
    setCurrentView('monetization');
  };

  const handleNavigateToShoeDesigner = () => {
    setCurrentView('shoeDesigner');
  };

  const handleNavigateToShoeHealthTracker = () => {
    setCurrentView('shoeHealthTracker');
  };

  const handleNavigateToShoeNFTPortal = () => {
    setCurrentView('shoeNFTPortal');
  };

  const handleNavigateToShoeNFTDetail = (nft: PlaceholderNFT) => {
    setSelectedNFT(nft);
    setCurrentView('shoeNFTDetail');
  };

  const handleNavigateToScanShoeToNFT = () => {
    setCurrentView('scanShoeToNFT');
  };

  const handleNavigateToNFTDrops = () => {
    setCurrentView('nftDrops');
  };

  const handleNavigateToAccessoriesMarketplace = () => {
    setCurrentView('accessoriesMarketplace');
  };

  const handleNavigateToBrandCreatorDashboard = () => {
    setCurrentView('brandCreatorDashboard');
  };

  const handleNavigateToVRSpacesHub = () => {
    setCurrentView('vrSpacesHub');
  };

  const handleNavigateToVRSpaceCreation = () => {
    setCurrentView('vrSpaceCreation');
  };

  const handleNavigateToBrandCreatorSlots = () => {
    setCurrentView('brandCreatorSlots');
  };

  const handleNavigateToGameVRDetail = (item: Game | any) => {
    setSelectedGameOrVRId(item.id);
    setSelectedGameOrVRMode('type' in item ? 'game' : 'vrSpace');
    setCurrentView('gameVRDetail');
  };

  const handleNavigateToPlayAnywhere = () => {
    setCurrentView('playAnywhere');
  };

  const handleNavigateToAvatarBuilder = () => {
    setCurrentView('avatarBuilder');
  };

  const handleNavigateToAvatarCloset = () => {
    setCurrentView('avatarCloset');
  };

  const handleNavigateToAvatarGamePreview = () => {
    setCurrentView('avatarGamePreview');
  };

  const handleNavigateToAvatarSmartCubePreview = () => {
    setCurrentView('avatarSmartCubePreview');
  };

  const handleNavigateToXRWorldBuilder = () => {
    setCurrentView('xrWorldBuilder');
  };

  const handleNavigateToAvatarGLBGenerator = () => {
    setCurrentView('avatarGLBGenerator');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedNFT(null);
    setSelectedGameOrVRId(null);
    setSelectedUserPrincipal(null);
  };

  const handleBackToGaming = () => {
    setActiveTab('avatarXR');
    setCurrentView('main');
  };

  const handleBackToVRSpacesHub = () => {
    setCurrentView('vrSpacesHub');
  };

  const renderContent = () => {
    if (currentView === 'profile' && selectedUserPrincipal) {
      return <AIRspaceProfilePage userPrincipal={selectedUserPrincipal} onBack={handleBackToMain} />;
    }

    if (currentView === 'messaging') {
      return <AIRspaceMessagingPage onBack={handleBackToMain} onNavigateToProfile={handleNavigateToProfile} />;
    }

    if (currentView === 'liveEvents') {
      return (
        <AIRspaceLiveEventsPage
          onBack={handleBackToMain}
          onNavigateToProfile={handleNavigateToProfile}
        />
      );
    }

    if (currentView === 'monetization') {
      return <AIRspaceMonetizationPage onBack={handleBackToMain} onNavigateToProfile={handleNavigateToProfile} />;
    }

    if (currentView === 'shoeDesigner') {
      return (
        <ShoeDesignerPage
          onBack={handleBackToMain}
          onNavigateToMarketplace={() => {
            setActiveTab('nftShoewear');
            setCurrentView('main');
          }}
          onNavigateToHealthTracker={handleNavigateToShoeHealthTracker}
          onNavigateToNFT={handleNavigateToShoeNFTPortal}
          onNavigateToBrandDashboard={handleNavigateToBrandCreatorDashboard}
        />
      );
    }

    if (currentView === 'shoeHealthTracker') {
      return (
        <NutechShoeHealthTrackerPage
          onBack={handleBackToMain}
          onNavigateToMarketplace={() => {
            setActiveTab('nftShoewear');
            setCurrentView('main');
          }}
          onNavigateToDesigner={handleNavigateToShoeDesigner}
          onNavigateToNFT={handleNavigateToShoeNFTPortal}
        />
      );
    }

    if (currentView === 'shoeNFTPortal') {
      return (
        <NutechShoeNFTPortalPage
          onBack={handleBackToMain}
          onNavigateToNFTDetail={handleNavigateToShoeNFTDetail}
          onNavigateToScanShoeToNFT={handleNavigateToScanShoeToNFT}
          onNavigateToNFTDrops={handleNavigateToNFTDrops}
        />
      );
    }

    if (currentView === 'shoeNFTDetail' && selectedNFT) {
      return (
        <NutechShoeNFTDetailPage
          nft={selectedNFT}
          onBack={() => setCurrentView('shoeNFTPortal')}
          onShowcaseOnProfile={() => {}}
          onListOnMarketplace={() => {}}
        />
      );
    }

    if (currentView === 'scanShoeToNFT') {
      return <ScanShoeToNFTPage onBack={() => setCurrentView('shoeNFTPortal')} />;
    }

    if (currentView === 'nftDrops') {
      return <NFTDropsPage onBack={() => setCurrentView('shoeNFTPortal')} />;
    }

    if (currentView === 'accessoriesMarketplace') {
      return (
        <NutechShoeAccessoriesMarketplacePage
          onBack={handleBackToMain}
          onNavigateToDesigner={handleNavigateToShoeDesigner}
          onNavigateToMarketplace={() => {
            setActiveTab('nftShoewear');
            setCurrentView('main');
          }}
          onNavigateToHealthTracker={handleNavigateToShoeHealthTracker}
        />
      );
    }

    if (currentView === 'brandCreatorDashboard') {
      return (
        <NutechBrandCreatorDashboardPage
          onBack={handleBackToMain}
          onNavigateToMarketplace={() => {
            setActiveTab('nftShoewear');
            setCurrentView('main');
          }}
          onNavigateToDesigner={handleNavigateToShoeDesigner}
          onNavigateToAccessories={handleNavigateToAccessoriesMarketplace}
        />
      );
    }

    if (currentView === 'vrSpacesHub') {
      return (
        <AIRVRSpacesHubPage
          onBackToGamingPortal={handleBackToGaming}
          onNavigateToBrandDashboard={handleNavigateToBrandCreatorSlots}
          onNavigateToVRSpaceCreation={handleNavigateToVRSpaceCreation}
          onNavigateToVRWorldDetail={handleNavigateToGameVRDetail}
        />
      );
    }

    if (currentView === 'vrSpaceCreation') {
      return <AIRVRSpaceCreationPage onBackToVRHub={handleBackToVRSpacesHub} onNavigateToBrandDashboard={handleNavigateToBrandCreatorSlots} />;
    }

    if (currentView === 'brandCreatorSlots') {
      return (
        <AIRBrandCreatorSlotsPage
          onBackToGamingPortal={handleBackToGaming}
          onNavigateToVRSpacesHub={handleNavigateToVRSpacesHub}
        />
      );
    }

    if (currentView === 'gameVRDetail' && selectedGameOrVRId) {
      return (
        <AIRGameVRDetailPage
          mode={selectedGameOrVRMode}
          game={undefined}
          vrWorld={undefined}
          onBack={selectedGameOrVRMode === 'game' ? handleBackToGaming : handleBackToVRSpacesHub}
          onNavigateToGamingPortal={handleBackToGaming}
          onNavigateToVRSpacesHub={handleNavigateToVRSpacesHub}
          onNavigateToPlayAnywhere={handleNavigateToPlayAnywhere}
        />
      );
    }

    if (currentView === 'playAnywhere') {
      return (
        <AIRPlayAnywherePage
          onBack={handleBackToGaming}
          onNavigateToGamingPortal={handleBackToGaming}
          onNavigateToVRSpacesHub={handleNavigateToVRSpacesHub}
          onNavigateToBrandCreatorSlots={handleNavigateToBrandCreatorSlots}
        />
      );
    }

    if (currentView === 'avatarBuilder') {
      return (
        <AvatarBuilderPage onBack={handleBackToMain} onNavigateToCloset={handleNavigateToAvatarCloset} />
      );
    }

    if (currentView === 'avatarCloset') {
      return <AvatarClosetPage onBack={() => setCurrentView('avatarBuilder')} />;
    }

    if (currentView === 'avatarGamePreview') {
      return (
        <AvatarGamePreviewPage
          onBackToGamingPortal={handleBackToGaming}
          onNavigateToAvatarCloset={handleNavigateToAvatarCloset}
          onNavigateToSmartCubePreview={handleNavigateToAvatarSmartCubePreview}
        />
      );
    }

    if (currentView === 'avatarSmartCubePreview') {
      return (
        <AvatarSmartCubePreviewPage
          onBack={handleBackToGaming}
          onNavigateToAvatarCloset={handleNavigateToAvatarCloset}
          onNavigateToAIRPlayAnywhere={handleNavigateToPlayAnywhere}
        />
      );
    }

    if (currentView === 'xrWorldBuilder') {
      return <NuTechXRWorldBuilderPage onBack={handleBackToGaming} />;
    }

    if (currentView === 'avatarGLBGenerator') {
      return <AvatarGLBGeneratorPage onBack={handleBackToMain} />;
    }

    switch (activeTab) {
      case 'avatarXR':
        return (
          <GamingPage
            onNavigateToVRSpacesHub={handleNavigateToVRSpacesHub}
            onNavigateToBrandDashboard={handleNavigateToBrandCreatorSlots}
            onNavigateToGameDetail={handleNavigateToGameVRDetail}
            onNavigateToAvatarGamePreview={handleNavigateToAvatarGamePreview}
            onNavigateToAvatarSmartCubePreview={handleNavigateToAvatarSmartCubePreview}
            onNavigateToXRWorldBuilder={handleNavigateToXRWorldBuilder}
          />
        );
      case 'nftShoewear':
        return (
          <ShoewearPage
            onNavigateToDesigner={handleNavigateToShoeDesigner}
            onNavigateToHealthTracker={handleNavigateToShoeHealthTracker}
            onNavigateToNFTDetail={handleNavigateToShoeNFTDetail}
            onNavigateToAccessories={handleNavigateToAccessoriesMarketplace}
          />
        );
      case 'airspace':
        return (
          <AIRspacePage
            onViewProfile={handleNavigateToProfile}
          />
        );
      case 'walletProfile':
        return (
          <ProfilePage
            onLogout={onLogout}
            onNavigateToAvatarBuilder={handleNavigateToAvatarBuilder}
            onNavigateToMonetization={handleNavigateToMonetization}
            onNavigateToShoeNFTPortal={handleNavigateToShoeNFTPortal}
            onNavigateToAvatarGLBGenerator={handleNavigateToAvatarGLBGenerator}
            onNavigateToBrandCreatorDashboard={handleNavigateToBrandCreatorDashboard}
            onNavigateToVRSpaceCreation={handleNavigateToVRSpaceCreation}
            showDashboardCreate={showDashboardCreate}
            onCloseDashboardCreate={() => setShowDashboardCreate(false)}
          />
        );
      case 'music':
        return <MusicModulePage />;
      default:
        return null;
    }
  };

  const showBottomNav = currentView === 'main';
  const suppressCreateButton = 
    currentView === 'shoeDesigner' || 
    currentView === 'vrSpaceCreation' || 
    currentView === 'xrWorldBuilder';

  const showCreateButton = !suppressCreateButton;

  const getActiveModule = (): Tab => {
    if (currentView !== 'main') {
      if (['shoeDesigner', 'shoeHealthTracker', 'shoeNFTPortal', 'shoeNFTDetail', 'scanShoeToNFT', 'nftDrops', 'accessoriesMarketplace', 'brandCreatorDashboard'].includes(currentView)) {
        return 'nftShoewear';
      }
      if (['vrSpacesHub', 'vrSpaceCreation', 'brandCreatorSlots', 'gameVRDetail', 'playAnywhere', 'avatarGamePreview', 'avatarSmartCubePreview', 'xrWorldBuilder'].includes(currentView)) {
        return 'avatarXR';
      }
      if (['profile', 'messaging', 'liveEvents', 'monetization'].includes(currentView)) {
        return 'airspace';
      }
      if (['avatarBuilder', 'avatarCloset', 'avatarGLBGenerator'].includes(currentView)) {
        return 'walletProfile';
      }
    }
    return activeTab;
  };

  const handleCreateAction = () => {
    const module = getActiveModule();
    if (module === 'walletProfile') {
      setShowDashboardCreate(true);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {currentView === 'main' && (
        <Header onNavigateToLiveEvents={handleNavigateToLiveEvents} onNavigateToMessaging={handleNavigateToMessaging} />
      )}
      <main className="flex-1 overflow-y-auto pb-16">{renderContent()}</main>
      {showBottomNav && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
      {currentView === 'main' && <InvestorFlowStepper activeTab={activeTab} onTabChange={setActiveTab} />}
      {showCreateButton && (
        <CreateButton 
          activeModule={getActiveModule()} 
          onCreateAction={handleCreateAction}
        />
      )}
    </div>
  );
}
