import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimeAvatarGenerator } from '@/utils/generateAvatarGLB';

interface AvatarGLBGeneratorPageProps {
  onBack: () => void;
}

export default function AvatarGLBGeneratorPage({ onBack }: AvatarGLBGeneratorPageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStatus('idle');
    setErrorMessage('');

    try {
      const generator = new AnimeAvatarGenerator();
      const glbData = await generator.exportGLB();

      // Create download
      const blob = new Blob([glbData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'nuverse-avatar-anime-futuristic.glb';
      link.click();

      URL.revokeObjectURL(url);

      setGenerationStatus('success');
    } catch (error: any) {
      console.error('Avatar generation failed:', error);
      setErrorMessage(error.message || 'Unknown error occurred');
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Avatar GLB Generator</h1>
            <p className="text-sm text-muted-foreground">
              Generate the NuVerse futuristic anime avatar model
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-border/40 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold text-foreground">Generate Avatar GLB</h2>
            <p className="text-sm text-muted-foreground">
              This tool generates a fully rigged anime-style humanoid avatar with:
            </p>
          </div>

          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
              <div className="text-sm">
                <strong className="text-foreground">Futuristic anime proportions</strong>
                <p className="text-muted-foreground">Large expressive head, smooth body geometry</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
              <div className="text-sm">
                <strong className="text-foreground">Cyber-streetwear aesthetic</strong>
                <p className="text-muted-foreground">Neon-accented material with metallic finish</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
              <div className="text-sm">
                <strong className="text-foreground">Complete skeleton rig</strong>
                <p className="text-muted-foreground">
                  Head, Chest, Spine, LeftHand, RightHand, LeftFoot, RightFoot, LeftLeg, RightLeg
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
              <div className="text-sm">
                <strong className="text-foreground">Three animation clips</strong>
                <p className="text-muted-foreground">Idle, Action, Victory (embedded in GLB)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Avatar...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate & Download GLB
                </>
              )}
            </Button>

            {generationStatus === 'success' && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <div className="text-sm">
                  <strong>Success!</strong> Avatar GLB downloaded. Place it at{' '}
                  <code className="rounded bg-black/20 px-1 py-0.5 text-xs">
                    frontend/public/assets/xr/nuverse-avatar-anime-futuristic.glb
                  </code>
                </div>
              </div>
            )}

            {generationStatus === 'error' && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div className="text-sm">
                  <strong>Error:</strong> {errorMessage}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Installation Instructions</h3>
            <ol className="space-y-1 text-xs text-muted-foreground">
              <li>1. Click "Generate & Download GLB" above</li>
              <li>2. Save the downloaded file to your project</li>
              <li>
                3. Place it at{' '}
                <code className="rounded bg-black/20 px-1 py-0.5">
                  frontend/public/assets/xr/nuverse-avatar-anime-futuristic.glb
                </code>
              </li>
              <li>4. Restart the dev server if needed</li>
              <li>5. Navigate to NuTech XR World Builder to test</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
