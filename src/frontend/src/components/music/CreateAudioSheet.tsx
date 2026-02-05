import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music, Upload } from 'lucide-react';
import { toast } from 'sonner';
import AudioUploadCard from './AudioUploadCard';
import ComposerPlaceholder from './ComposerPlaceholder';

interface CreateAudioSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateAudioSheet({ open, onClose }: CreateAudioSheetProps) {
  const [mode, setMode] = useState<'menu' | 'compose' | 'upload'>('menu');

  const handleClose = () => {
    setMode('menu');
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="pitch-surface">
        <SheetHeader>
          <SheetTitle>
            {mode === 'menu' && 'Create Audio'}
            {mode === 'compose' && 'Composer'}
            {mode === 'upload' && 'Upload Audio'}
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          {mode === 'menu' && (
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setMode('compose')}
              >
                <Music className="mr-2 h-4 w-4" />
                Open Composer
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setMode('upload')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Audio File
              </Button>
            </div>
          )}

          {mode === 'compose' && (
            <div className="space-y-4">
              <ComposerPlaceholder />
              <Button
                variant="outline"
                onClick={() => setMode('menu')}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}

          {mode === 'upload' && (
            <div className="space-y-4">
              <AudioUploadCard />
              <Button
                variant="outline"
                onClick={() => setMode('menu')}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
