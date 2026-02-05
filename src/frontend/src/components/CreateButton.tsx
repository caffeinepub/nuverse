import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreatePostDialog from './CreatePostDialog';
import CreateAudioSheet from './music/CreateAudioSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';

type Tab = 'avatarXR' | 'nftShoewear' | 'airspace' | 'walletProfile' | 'music';

interface CreateButtonProps {
  activeModule: Tab;
  onCreateAction?: () => void;
}

export default function CreateButton({ activeModule, onCreateAction }: CreateButtonProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showShoeCreateSheet, setShowShoeCreateSheet] = useState(false);
  const [showMusicCreateSheet, setShowMusicCreateSheet] = useState(false);

  const handleClick = () => {
    if (activeModule === 'airspace') {
      setShowCreateDialog(true);
    } else if (activeModule === 'nftShoewear') {
      setShowShoeCreateSheet(true);
    } else if (activeModule === 'music') {
      setShowMusicCreateSheet(true);
    } else if (activeModule === 'walletProfile') {
      onCreateAction?.();
    } else if (activeModule === 'avatarXR') {
      toast.info('XR creation tools coming soon');
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="pitch-create-fab fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        onClick={handleClick}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreatePostDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        context="airspace"
      />

      <Sheet open={showShoeCreateSheet} onOpenChange={setShowShoeCreateSheet}>
        <SheetContent side="bottom" className="pitch-surface">
          <SheetHeader>
            <SheetTitle>Create Shoe/Skin</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                setShowShoeCreateSheet(false);
                toast.info('Opening Shoe Designer...');
              }}
            >
              Design New Shoe
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                setShowShoeCreateSheet(false);
                toast.info('Opening Scan to NFT...');
              }}
            >
              Scan Shoe to NFT
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                setShowShoeCreateSheet(false);
                toast.info('Creating Custom Skin...');
              }}
            >
              Create Custom Skin
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <CreateAudioSheet 
        open={showMusicCreateSheet} 
        onClose={() => setShowMusicCreateSheet(false)}
      />
    </>
  );
}
