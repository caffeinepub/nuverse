import { useState } from 'react';
import { ArrowLeft, User, DollarSign, Lock, Sparkles, Settings, Package, CreditCard, Sun, Moon, Zap, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCreatorDashboard, useSaveMonetizationConfig } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { MonetizationConfig, Theme } from '../backend';
import { toast } from 'sonner';

interface AIRspaceMonetizationPageProps {
  onBack: () => void;
  onNavigateToProfile: () => void;
}

export default function AIRspaceMonetizationPage({ onBack, onNavigateToProfile }: AIRspaceMonetizationPageProps) {
  const { identity } = useInternetIdentity();
  
  const { data: dashboard, isLoading } = useGetCreatorDashboard();
  const saveConfig = useSaveMonetizationConfig();

  const [localConfig, setLocalConfig] = useState<MonetizationConfig | null>(dashboard?.config || null);

  const handleToggle = async (field: 'tipsEnabled' | 'exclusiveContentEnabled' | 'nftDropsEnabled', value: boolean) => {
    if (!localConfig) return;

    const updatedConfig = { ...localConfig, [field]: value };
    setLocalConfig(updatedConfig);

    try {
      await saveConfig.mutateAsync(updatedConfig);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
      setLocalConfig(localConfig);
    }
  };

  const handleThemeChange = async (theme: Theme) => {
    if (!localConfig) return;

    const updatedConfig = { ...localConfig, theme };
    setLocalConfig(updatedConfig);

    try {
      await saveConfig.mutateAsync(updatedConfig);
      toast.success(`Theme changed to ${theme}!`);
    } catch (error) {
      toast.error('Failed to change theme');
      setLocalConfig(localConfig);
    }
  };

  const handleNavigateToSettings = () => {
    toast.info('Creator Settings - Coming Soon!');
  };

  const handleNavigateToNFTManager = () => {
    toast.info('NFT Manager - Coming Soon!');
  };

  const handleNavigateToSubscriptions = () => {
    toast.info('Subscription Plans - Coming Soon!');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading monetization portal...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creator Monetization Portal
            </h1>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Set Up Your Creator Profile</CardTitle>
              <CardDescription>
                Complete your profile setup to access the monetization dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please ensure you have a complete user profile to access creator features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Set local config from dashboard if not set
  if (!localConfig && dashboard.config) {
    setLocalConfig(dashboard.config);
  }

  const config = localConfig || dashboard.config;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creator Monetization Portal
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onNavigateToProfile}>
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Monetization Options */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Monetization Options</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Tipping Card */}
            <Card className="group relative overflow-hidden border-primary/20 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <img 
                    src="/assets/generated/tipping-icon-transparent.dim_64x64.png" 
                    alt="Tipping" 
                    className="h-12 w-12"
                  />
                  <Switch
                    checked={config.tipsEnabled}
                    onCheckedChange={(checked) => handleToggle('tipsEnabled', checked)}
                  />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Enable Tipping
                </CardTitle>
                <CardDescription>
                  Allow fans to send you tips for your amazing content
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Exclusive Content Card */}
            <Card className="group relative overflow-hidden border-accent/20 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <img 
                    src="/assets/generated/exclusive-content-icon-transparent.dim_64x64.png" 
                    alt="Exclusive Content" 
                    className="h-12 w-12"
                  />
                  <Switch
                    checked={config.exclusiveContentEnabled}
                    onCheckedChange={(checked) => handleToggle('exclusiveContentEnabled', checked)}
                  />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  Exclusive Content
                </CardTitle>
                <CardDescription>
                  Offer premium content to your subscribers
                </CardDescription>
              </CardHeader>
            </Card>

            {/* NFT Drops Card */}
            <Card className="group relative overflow-hidden border-secondary/20 transition-all hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <img 
                    src="/assets/generated/nft-drop-icon-transparent.dim_64x64.png" 
                    alt="NFT Drops" 
                    className="h-12 w-12"
                  />
                  <Switch
                    checked={config.nftDropsEnabled}
                    onCheckedChange={(checked) => handleToggle('nftDropsEnabled', checked)}
                  />
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  NFT Drops
                </CardTitle>
                <CardDescription>
                  Release limited edition digital collectibles
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Analytics Dashboard</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Follower Engagement */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Follower Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">{dashboard.metrics.followers.toString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Followers</p>
                  </div>
                  <img 
                    src="/assets/generated/analytics-tile.dim_200x150.png" 
                    alt="Analytics" 
                    className="h-16 w-20 object-cover rounded"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Revenue Streams */}
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-accent">${dashboard.metrics.revenue.toString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Earnings</p>
                  </div>
                  <img 
                    src="/assets/generated/revenue-tile.dim_200x150.png" 
                    alt="Revenue" 
                    className="h-16 w-20 object-cover rounded"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sale Performance */}
            <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Sale Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-secondary">{dashboard.metrics.salesPerformance.toString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Items Sold</p>
                  </div>
                  <img 
                    src="/assets/generated/performance-tile.dim_200x150.png" 
                    alt="Performance" 
                    className="h-16 w-20 object-cover rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Links */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 border-primary/20 p-6 hover:border-primary/50 hover:bg-primary/5"
              onClick={handleNavigateToSettings}
            >
              <img 
                src="/assets/generated/creator-settings-icon-transparent.dim_48x48.png" 
                alt="Settings" 
                className="h-12 w-12"
              />
              <div className="text-center">
                <p className="font-semibold">Creator Settings</p>
                <p className="text-xs text-muted-foreground">Manage your creator profile</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 border-accent/20 p-6 hover:border-accent/50 hover:bg-accent/5"
              onClick={handleNavigateToNFTManager}
            >
              <img 
                src="/assets/generated/nft-manager-icon-transparent.dim_48x48.png" 
                alt="NFT Manager" 
                className="h-12 w-12"
              />
              <div className="text-center">
                <p className="font-semibold">NFT Manager</p>
                <p className="text-xs text-muted-foreground">Create and manage NFT drops</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 border-secondary/20 p-6 hover:border-secondary/50 hover:bg-secondary/5"
              onClick={handleNavigateToSubscriptions}
            >
              <img 
                src="/assets/generated/subscription-icon-transparent.dim_48x48.png" 
                alt="Subscriptions" 
                className="h-12 w-12"
              />
              <div className="text-center">
                <p className="font-semibold">Subscription Plans</p>
                <p className="text-xs text-muted-foreground">Set up membership tiers</p>
              </div>
            </Button>
          </div>
        </div>

        {/* UI Customization */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">UI Customization</h2>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Personalize Your Dashboard</CardTitle>
              <CardDescription>Customize the look and feel of your creator portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Switcher */}
              <div>
                <Label className="mb-3 block text-sm font-medium">Theme Mode</Label>
                <div className="flex gap-3">
                  <Button
                    variant={config.theme === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleThemeChange('light' as Theme)}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={config.theme === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleThemeChange('dark' as Theme)}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={config.theme === 'neon' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleThemeChange('neon' as Theme)}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Neon
                  </Button>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div>
                <Label className="mb-3 block text-sm font-medium">Dashboard Layout</Label>
                <Card className="border-muted bg-muted/20 p-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                    <span>Drag and drop sections to rearrange (Coming Soon)</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded border border-primary/20 bg-primary/5 p-3 text-center text-xs">
                      Posts
                    </div>
                    <div className="rounded border border-accent/20 bg-accent/5 p-3 text-center text-xs">
                      NFTs
                    </div>
                    <div className="rounded border border-secondary/20 bg-secondary/5 p-3 text-center text-xs">
                      Analytics
                    </div>
                    <div className="rounded border border-muted p-3 text-center text-xs">
                      VR/AR
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
