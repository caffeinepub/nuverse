import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Upload, Store } from 'lucide-react';
import ComposerPlaceholder from '../components/music/ComposerPlaceholder';
import AudioUploadCard from '../components/music/AudioUploadCard';
import { SiApplemusic, SiSpotify } from 'react-icons/si';

export default function MusicModulePage() {
  return (
    <div className="h-full overflow-y-auto p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Music & Audio Hub
          </h1>
          <p className="text-sm text-muted-foreground">Create, upload, and discover sounds for your NuVerse experiences</p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Producer/Composer Card */}
          <Card className="pitch-surface pitch-role-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Music className="h-5 w-5" />
                Producer/Composer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Create sounds and music in-app</p>
              <ComposerPlaceholder />
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card className="pitch-surface pitch-role-card border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Upload className="h-5 w-5" />
                Upload Audio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Upload your audio files</p>
              <AudioUploadCard />
            </CardContent>
          </Card>

          {/* Marketplace Card */}
          <Card className="pitch-surface pitch-role-card border-chart-3/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-3">
                <Store className="h-5 w-5" />
                Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Discover music from brands and artists</p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border/50 bg-card/30">
                  <p className="text-xs font-medium mb-2">Record Labels</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-card/30">
                  <p className="text-xs font-medium mb-2">Independent Artists</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-card/30">
                  <p className="text-xs font-medium mb-2 flex items-center gap-2">
                    Streaming Services
                    <SiApplemusic className="h-3 w-3" />
                    <SiSpotify className="h-3 w-3" />
                  </p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
