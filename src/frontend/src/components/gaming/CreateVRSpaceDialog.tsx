import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateVRSpaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVRSpaceDialog({ isOpen, onClose }: CreateVRSpaceDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="air-gaming-panel w-full max-w-2xl rounded-t-3xl bg-card border-t-2 border-primary/30 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-sm p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">VR Space Creation</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-primary/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Redirect Notice */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium mb-2">
              This dialog is deprecated
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Please use the "Create New VR Space" button on the VR Spaces Hub to access the full creation screen.
            </p>
            <Button
              onClick={onClose}
              className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
