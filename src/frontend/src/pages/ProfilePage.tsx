import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Palette, Boxes, FileText, Wrench, Music, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface ProfilePageProps {
  onLogout: () => void;
  onNavigateToAvatarBuilder: () => void;
  onNavigateToMonetization: () => void;
  onNavigateToShoeNFTPortal: () => void;
  onNavigateToAvatarGLBGenerator: () => void;
  onNavigateToBrandCreatorDashboard: () => void;
  onNavigateToVRSpaceCreation: () => void;
  showDashboardCreate: boolean;
  onCloseDashboardCreate: () => void;
}

export default function ProfilePage({
  onLogout,
  onNavigateToAvatarBuilder,
  onNavigateToMonetization,
  onNavigateToShoeNFTPortal,
  onNavigateToAvatarGLBGenerator,
  onNavigateToBrandCreatorDashboard,
  onNavigateToVRSpaceCreation,
  showDashboardCreate,
  onCloseDashboardCreate,
}: ProfilePageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await queryClient.clear();
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const avatarUrl = userProfile?.avatar?.getDirectURL();

  return (
    <div className="h-full overflow-y-auto p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Dashboard Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Brand/Creator Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Your central hub for creation and innovation</p>
        </div>

        {/* Role Sections Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Designer Role */}
          <Card className="pitch-surface pitch-role-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Palette className="h-5 w-5" />
                Designer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Create shoes, skins, and custom designs</p>
              <div className="space-y-2">
                <Button 
                  onClick={onNavigateToShoeNFTPortal} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Shoe NFT Portal</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onNavigateToBrandCreatorDashboard} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Brand Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Creator Role */}
          <Card className="pitch-surface pitch-role-card border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Boxes className="h-5 w-5" />
                Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Build VR spaces and immersive experiences</p>
              <div className="space-y-2">
                <Button 
                  onClick={onNavigateToVRSpaceCreation} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>VR Space Studio</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onNavigateToAvatarBuilder} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Avatar Builder</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Author Role */}
          <Card className="pitch-surface pitch-role-card border-chart-3/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-3">
                <FileText className="h-5 w-5" />
                Author
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Publish VR content and monetize creations</p>
              <div className="space-y-2">
                <Button 
                  onClick={onNavigateToMonetization} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Monetization Portal</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={onNavigateToVRSpaceCreation} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Publish VR Space</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Engineer Role */}
          <Card className="pitch-surface pitch-role-card border-chart-4/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-4">
                <Wrench className="h-5 w-5" />
                Engineer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Gaming tools and XR development</p>
              <div className="space-y-2">
                <Button 
                  onClick={onNavigateToAvatarGLBGenerator} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Avatar GLB Generator</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => toast.info('XR Dev Tools coming soon')} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>XR Dev Tools</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Music Role */}
          <Card className="pitch-surface pitch-role-card border-chart-5/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-chart-5">
                <Music className="h-5 w-5" />
                Music
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Sound & music creation hub</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => toast.info('Navigate to Music module via bottom nav')} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Music Module</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => toast.info('Audio library coming soon')} 
                  className="w-full justify-between" 
                  variant="outline"
                  size="sm"
                >
                  <span>Audio Library</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Section */}
        <Card className="pitch-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userProfile?.username || 'User'} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-xl">
                    {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{userProfile?.username || 'Anonymous'}</h3>
                <p className="text-xs text-muted-foreground break-all">{identity?.getPrincipal().toString()}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="w-full" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Create Sheet */}
      <Sheet open={showDashboardCreate} onOpenChange={onCloseDashboardCreate}>
        <SheetContent side="bottom" className="pitch-surface">
          <SheetHeader>
            <SheetTitle>Create New</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 py-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                onCloseDashboardCreate();
                onNavigateToShoeNFTPortal();
              }}
            >
              <Palette className="mr-2 h-4 w-4" />
              Design Shoe/Skin
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                onCloseDashboardCreate();
                onNavigateToVRSpaceCreation();
              }}
            >
              <Boxes className="mr-2 h-4 w-4" />
              Create VR Space
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                onCloseDashboardCreate();
                onNavigateToMonetization();
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Publish Content
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                onCloseDashboardCreate();
                toast.info('Navigate to Music module via bottom nav');
              }}
            >
              <Music className="mr-2 h-4 w-4" />
              Create Audio
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
