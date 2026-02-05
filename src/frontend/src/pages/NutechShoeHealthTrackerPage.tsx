import { useState } from 'react';
import { ArrowLeft, Plus, Activity, TrendingUp, AlertTriangle, CheckCircle, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGetUserShoeHealth, useAddOrUpdateShoeHealth, useGetNotifications, useMarkNotificationAsRead } from '@/hooks/useQueries';
import type { ShoeHealth, Notification, NotificationType } from '@/backend';

interface HealthTrackerPageProps {
  onBack: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDesigner: () => void;
  onNavigateToNFT: () => void;
}

export default function NutechShoeHealthTrackerPage({
  onBack,
  onNavigateToMarketplace,
  onNavigateToDesigner,
  onNavigateToNFT,
}: HealthTrackerPageProps) {
  const [selectedShoe, setSelectedShoe] = useState<ShoeHealth | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newShoe, setNewShoe] = useState({
    brand: '',
    style: '',
    wear: 0,
    steps: 0,
    performance: 100,
  });

  const { data: shoes = [], isLoading, isFetched } = useGetUserShoeHealth();
  const { data: allNotifications = [] } = useGetNotifications();
  const addOrUpdateMutation = useAddOrUpdateShoeHealth();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Filter shoe health notifications
  const shoeHealthNotifications = allNotifications.filter(
    (n) => n.notificationType === 'shoeHealthAlert' as NotificationType
  );

  const handleAddShoe = async () => {
    if (!newShoe.brand || !newShoe.style) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const shoeData: ShoeHealth = {
        id: `${Date.now()}-${newShoe.brand}-${newShoe.style}`,
        brand: newShoe.brand,
        style: newShoe.style,
        wear: BigInt(newShoe.wear),
        steps: BigInt(newShoe.steps),
        performance: BigInt(newShoe.performance),
        lastMaintained: BigInt(Date.now()),
      };

      await addOrUpdateMutation.mutateAsync(shoeData);
      toast.success('Shoe added successfully');
      setShowAddDialog(false);
      setNewShoe({ brand: '', style: '', wear: 0, steps: 0, performance: 100 });
    } catch (error) {
      toast.error('Failed to add shoe');
    }
  };

  const handleUpdateMetrics = async (shoe: ShoeHealth, updates: Partial<ShoeHealth>) => {
    try {
      const updatedShoe: ShoeHealth = {
        ...shoe,
        ...updates,
      };
      await addOrUpdateMutation.mutateAsync(updatedShoe);
      toast.success('Metrics updated successfully');
    } catch (error) {
      toast.error('Failed to update metrics');
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: bigint) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getHealthStatus = (shoe: ShoeHealth) => {
    const wear = Number(shoe.wear);
    const performance = Number(shoe.performance);
    
    if (wear > 80 || performance < 30) {
      return { status: 'critical', color: 'text-destructive', bgColor: 'bg-destructive/10' };
    } else if (wear > 60 || performance < 50) {
      return { status: 'warning', color: 'text-warning', bgColor: 'bg-warning/10' };
    }
    return { status: 'good', color: 'text-success', bgColor: 'bg-success/10' };
  };

  const formatNumber = (value: bigint | number) => {
    return Number(value).toLocaleString();
  };

  const unreadNotifications = shoeHealthNotifications.filter((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Nutech Shoe Health Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Monitor wear, steps, and performance for all your shoes</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Track Shoe
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Overview & Notifications */}
        <div className="space-y-6 lg:col-span-1">
          {/* Stats Summary */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Shoes</span>
                <span className="text-2xl font-bold text-primary">{shoes.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Alerts</span>
                <Badge variant="destructive" className="text-sm">
                  {unreadNotifications.length}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Steps</span>
                <span className="text-lg font-semibold">
                  {formatNumber(shoes.reduce((sum, shoe) => sum + Number(shoe.steps), 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Panel */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Maintenance Alerts</span>
                {unreadNotifications.length > 0 && (
                  <Badge variant="destructive">{unreadNotifications.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {shoeHealthNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="mb-2 h-12 w-12 text-success opacity-50" />
                    <p className="text-sm text-muted-foreground">All shoes are in good condition</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shoeHealthNotifications.map((notification) => (
                      <Card
                        key={Number(notification.id)}
                        className={`cursor-pointer border transition-all hover:border-primary/50 ${
                          notification.isRead ? 'opacity-60' : 'border-primary/30'
                        }`}
                        onClick={() => handleMarkNotificationAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0">
                              {notification.isRead ? (
                                <BellOff className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Bell className="h-5 w-5 text-destructive" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.content}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(Number(notification.timestamp) / 1000000).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Shoe List & Detail */}
        <div className="space-y-6 lg:col-span-2">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted mb-4" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted mb-2" />
                    <div className="h-2 w-full animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : shoes.length === 0 && isFetched ? (
            <Card className="border-dashed border-primary/30">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                <h3 className="mb-2 text-xl font-semibold">No Shoes Tracked Yet</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Start tracking your shoes to monitor wear, steps, and performance
                </p>
                <Button onClick={() => setShowAddDialog(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Track Your First Shoe
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Shoe Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {shoes.map((shoe) => {
                  const healthStatus = getHealthStatus(shoe);
                  const isSelected = selectedShoe?.id === shoe.id;

                  return (
                    <Card
                      key={shoe.id}
                      className={`cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 ${
                        isSelected ? 'border-primary shadow-lg shadow-primary/30' : ''
                      }`}
                      onClick={() => setSelectedShoe(shoe)}
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{shoe.brand}</h3>
                            <p className="text-sm text-muted-foreground">{shoe.style}</p>
                          </div>
                          <Badge className={healthStatus.bgColor}>
                            <span className={healthStatus.color}>
                              {healthStatus.status === 'critical' ? (
                                <AlertTriangle className="mr-1 inline h-3 w-3" />
                              ) : healthStatus.status === 'warning' ? (
                                <TrendingUp className="mr-1 inline h-3 w-3" />
                              ) : (
                                <CheckCircle className="mr-1 inline h-3 w-3" />
                              )}
                              {healthStatus.status}
                            </span>
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Wear</span>
                              <span className="font-medium">{Number(shoe.wear)}%</span>
                            </div>
                            <Progress value={Number(shoe.wear)} className="h-2" />
                          </div>

                          <div>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Performance</span>
                              <span className="font-medium">{Number(shoe.performance)}%</span>
                            </div>
                            <Progress value={Number(shoe.performance)} className="h-2" />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Steps</span>
                            <span className="font-semibold text-primary">{formatNumber(shoe.steps)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed View */}
              {selectedShoe && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {selectedShoe.brand} - {selectedShoe.style}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="metrics" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                      </TabsList>

                      <TabsContent value="metrics" className="mt-6 space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Card>
                            <CardContent className="pt-6 text-center">
                              <div className="mb-2 text-3xl font-bold text-primary">
                                {Number(selectedShoe.wear)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Wear Level</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6 text-center">
                              <div className="mb-2 text-3xl font-bold text-accent">
                                {formatNumber(selectedShoe.steps)}
                              </div>
                              <p className="text-sm text-muted-foreground">Total Steps</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-6 text-center">
                              <div className="mb-2 text-3xl font-bold text-success">
                                {Number(selectedShoe.performance)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Performance</p>
                            </CardContent>
                          </Card>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="mb-4 font-semibold">Maintenance Status</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                              <span className="text-sm">Last Maintained</span>
                              <span className="text-sm font-medium">
                                {new Date(Number(selectedShoe.lastMaintained)).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                              <span className="text-sm">Days Since Maintenance</span>
                              <span className="text-sm font-medium">
                                {Math.floor((Date.now() - Number(selectedShoe.lastMaintained)) / (1000 * 60 * 60 * 24))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() =>
                            handleUpdateMetrics(selectedShoe, {
                              lastMaintained: BigInt(Date.now()),
                            })
                          }
                        >
                          Mark as Maintained
                        </Button>
                      </TabsContent>

                      <TabsContent value="history" className="mt-6">
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="mb-4 flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold">Performance Trend</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Current performance: {Number(selectedShoe.performance)}%
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                Performance tracking helps you understand when your shoes need replacement or maintenance.
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6">
                              <div className="mb-4 flex items-center gap-3">
                                <Activity className="h-5 w-5 text-accent" />
                                <h4 className="font-semibold">Activity Summary</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total Steps:</span>
                                  <span className="font-medium">{formatNumber(selectedShoe.steps)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Estimated Distance:</span>
                                  <span className="font-medium">
                                    {(Number(selectedShoe.steps) * 0.0008).toFixed(2)} km
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Navigation Cards */}
          <Separator className="my-6" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Card
              className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              onClick={onNavigateToMarketplace}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <img
                  src="/assets/generated/shoewear-icon.dim_64x64.png"
                  alt="Marketplace"
                  className="mb-3 h-12 w-12"
                />
                <h3 className="font-semibold">Marketplace</h3>
                <p className="text-xs text-muted-foreground">Browse shoes</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              onClick={onNavigateToDesigner}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <img
                  src="/assets/generated/designer-icon-transparent.dim_64x64.png"
                  alt="Designer"
                  className="mb-3 h-12 w-12"
                />
                <h3 className="font-semibold">Designer</h3>
                <p className="text-xs text-muted-foreground">Create custom shoes</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              onClick={onNavigateToNFT}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <img
                  src="/assets/generated/nft-badge-transparent.dim_48x48.png"
                  alt="NFT"
                  className="mb-3 h-12 w-12"
                />
                <h3 className="font-semibold">NFT Gallery</h3>
                <p className="text-xs text-muted-foreground">Digital collectibles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Shoe Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track New Shoe</DialogTitle>
            <DialogDescription>Add a shoe to start tracking its health metrics</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                placeholder="e.g., Nike, Adidas"
                value={newShoe.brand}
                onChange={(e) => setNewShoe({ ...newShoe, brand: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="style">Style *</Label>
              <Input
                id="style"
                placeholder="e.g., Air Max, Ultraboost"
                value={newShoe.style}
                onChange={(e) => setNewShoe({ ...newShoe, style: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="wear">Initial Wear Level (%)</Label>
              <Input
                id="wear"
                type="number"
                min="0"
                max="100"
                value={newShoe.wear}
                onChange={(e) => setNewShoe({ ...newShoe, wear: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="steps">Initial Steps</Label>
              <Input
                id="steps"
                type="number"
                min="0"
                value={newShoe.steps}
                onChange={(e) => setNewShoe({ ...newShoe, steps: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShoe} disabled={addOrUpdateMutation.isPending}>
              {addOrUpdateMutation.isPending ? 'Adding...' : 'Add Shoe'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
