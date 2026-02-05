import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCreatePostWithAudio } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Image, X, Music } from 'lucide-react';
import type { ExternalBlob, AudioAttachment } from '../backend';
import AudioAssetPicker from './audio/AudioAssetPicker';

type Context = 'airspace' | 'nftShoewear' | 'avatarXR' | 'walletProfile';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  context: Context;
}

export default function CreatePostDialog({ open, onClose, context }: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioAttachment | null>(null);
  const [showAudioPicker, setShowAudioPicker] = useState(false);
  const createPost = useCreatePostWithAudio();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      let imageBlob: ExternalBlob | null = null;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const { ExternalBlob } = await import('../backend');
        imageBlob = ExternalBlob.fromBytes(uint8Array);
      }

      const audioIds = selectedAudio ? [selectedAudio.id] : [];

      await createPost.mutateAsync({ content: content.trim(), image: imageBlob, audioIds });
      toast.success('Post created successfully!');
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      setSelectedAudio(null);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  const selectedAudioId = selectedAudio ? selectedAudio.id : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg pitch-surface">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              disabled={createPost.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-48 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={createPost.isPending}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  disabled={createPost.isPending}
                  className="w-full"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Audio (optional)</Label>
            {selectedAudio ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/30">
                <Music className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedAudio.title}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAudio(null)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAudioPicker(!showAudioPicker)}
                disabled={createPost.isPending}
                className="w-full"
              >
                <Music className="mr-2 h-4 w-4" />
                Attach Audio
              </Button>
            )}

            {showAudioPicker && !selectedAudio && (
              <div className="border border-border/50 rounded-lg p-4 bg-card/30">
                <AudioAssetPicker
                  selectedAudioId={selectedAudioId}
                  onSelect={(audio) => {
                    setSelectedAudio(audio);
                    setShowAudioPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createPost.isPending} className="flex-1">
              {createPost.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
