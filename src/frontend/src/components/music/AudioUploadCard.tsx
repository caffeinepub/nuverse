import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileAudio, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadAudioAttachment } from '../../hooks/useQueries';
import { ExternalBlob, AudioType, AudioUsageContext } from '../../backend';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AudioUploadCard() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const uploadAudio = useUploadAudioAttachment();
  const { identity } = useInternetIdentity();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      setAudioFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const removeFile = () => {
    setAudioFile(null);
    setTitle('');
  };

  const handleUpload = async () => {
    if (!audioFile || !title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    if (!identity) {
      toast.error('Please log in to upload audio');
      return;
    }

    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const audioBlob = ExternalBlob.fromBytes(uint8Array);

      const audioAttachment = {
        id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        owner: identity.getPrincipal(),
        audioFile: audioBlob,
        title: title.trim(),
        description: '',
        duration: BigInt(0),
        audioType: AudioType.music,
        usageContext: AudioUsageContext.other,
      };

      await uploadAudio.mutateAsync(audioAttachment);
      toast.success('Audio uploaded successfully!');
      removeFile();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio');
    }
  };

  return (
    <div className="space-y-4">
      {audioFile ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/30">
            <FileAudio className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{audioFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio-title">Title *</Label>
            <Input
              id="audio-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter audio title"
              disabled={uploadAudio.isPending}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploadAudio.isPending || !title.trim()}
            className="w-full"
            size="sm"
          >
            {uploadAudio.isPending ? 'Uploading...' : 'Upload & Attach'}
          </Button>
        </div>
      ) : (
        <div>
          <Input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('audio-file')?.click()}
            className="w-full"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Audio File
          </Button>
        </div>
      )}
    </div>
  );
}
