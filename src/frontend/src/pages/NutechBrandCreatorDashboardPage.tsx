import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Package, TrendingUp, Award, Settings as SettingsIcon, ShoppingBag, Palette, Layers, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useGetUserDesignProjects, useDeleteDesignProject, useGetOLEDSettings, useSaveOLEDSettings } from '@/hooks/useQueries';

interface AccessoryListing {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  description: string;
  imagePreview?: string;
}

interface DashboardPageProps {
  onBack: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDesigner: () => void;
  onNavigateToAccessories: () => void;
}

export default function NutechBrandCreatorDashboardPage({
  onBack,
  onNavigateToMarketplace,
  onNavigateToDesigner,
  onNavigateToAccessories,
}: DashboardPageProps) {
  // Design Projects
  const { data: designProjects = [], isLoading: projectsLoading } = useGetUserDesignProjects();
  const deleteProjectMutation = useDeleteDesignProject();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Accessory Listings (local state only)
  const [accessories, setAccessories] = useState<AccessoryListing[]>([]);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<AccessoryListing | null>(null);
  const [accessoryForm, setAccessoryForm] = useState<Partial<AccessoryListing>>({
    name: '',
    type: 'Charger',
    price: 0,
    stock: 0,
    description: '',
  });
  const [accessoryImageFile, setAccessoryImageFile] = useState<File | null>(null);

  // Settings
  const { data: oledSettings, isLoading: oledLoading } = useGetOLEDSettings();
  const saveOLEDMutation = useSaveOLEDSettings();
  const [arIntegration, setArIntegration] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [oledEnabled, setOledEnabled] = useState(false);

  // Initialize OLED settings when loaded
  useState(() => {
    if (oledSettings) {
      setOledEnabled(oledSettings.enabled);
    }
  });

  // Design Project Handlers
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      toast.success('Design project deleted successfully');
      setProjectToDelete(null);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  // Accessory Handlers
  const handleOpenAccessoryModal = (accessory?: AccessoryListing) => {
    if (accessory) {
      setEditingAccessory(accessory);
      setAccessoryForm(accessory);
    } else {
      setEditingAccessory(null);
      setAccessoryForm({
        name: '',
        type: 'Charger',
        price: 0,
        stock: 0,
        description: '',
      });
      setAccessoryImageFile(null);
    }
    setIsAccessoryModalOpen(true);
  };

  const handleSaveAccessory = () => {
    if (!accessoryForm.name || !accessoryForm.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAccessory: AccessoryListing = {
      id: editingAccessory?.id || `acc-${Date.now()}`,
      name: accessoryForm.name || '',
      type: accessoryForm.type || 'Charger',
      price: accessoryForm.price || 0,
      stock: accessoryForm.stock || 0,
      description: accessoryForm.description || '',
      imagePreview: accessoryImageFile ? URL.createObjectURL(accessoryImageFile) : editingAccessory?.imagePreview,
    };

    if (editingAccessory) {
      setAccessories((prev) => prev.map((a) => (a.id === editingAccessory.id ? newAccessory : a)));
      toast.success('Accessory updated successfully');
    } else {
      setAccessories((prev) => [...prev, newAccessory]);
      toast.success('Accessory added successfully');
    }

    setIsAccessoryModalOpen(false);
    setEditingAccessory(null);
    setAccessoryForm({});
    setAccessoryImageFile(null);
  };

  const handleDeleteAccessory = (id: string) => {
    setAccessories((prev) => prev.filter((a) => a.id !== id));
    toast.success('Accessory removed');
  };

  const handleAccessoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAccessoryImageFile(file);
    }
  };

  // Settings Handlers
  const handleOLEDToggle = async (enabled: boolean) => {
    setOledEnabled(enabled);
    try {
      await saveOLEDMutation.mutateAsync({
        enabled,
        bluetoothPaired: oledSettings?.bluetoothPaired || false,
        displayMode: oledSettings?.displayMode || 'default',
      });
      toast.success(`OLED integration ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update OLED settings');
      setOledEnabled(!enabled);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero Banner */}
      <div
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-8"
        style={{
          backgroundImage: 'url(/assets/generated/brand-creator-dashboard-hero.dim_1200x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="mb-4 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Nutech Brand/Creator Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your designs, accessories, and brand presence</p>
        </div>
      </div>

      {/* Tile Strip */}
      <div className="mb-8">
        <img
          src="/assets/generated/brand-dashboard-tiles.dim_600x200.png"
          alt="Dashboard Tiles"
          className="w-full rounded-lg opacity-60"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Design Slots Management */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Manage Design Slots
                  </CardTitle>
                  <CardDescription>Your shoe design projects</CardDescription>
                </div>
                <Button onClick={onNavigateToDesigner} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Design
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading projects...</div>
              ) : designProjects.length === 0 ? (
                <div className="py-12 text-center">
                  <Palette className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="mb-4 text-muted-foreground">No design projects yet</p>
                  <Button onClick={onNavigateToDesigner} variant="outline">
                    Create Your First Design
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {designProjects.map((project) => (
                      <Card key={project.id} className="border-primary/10">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{project.name}</h4>
                            <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {project.designFiles.length} files
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {project.customization.colors.length} colors
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={onNavigateToDesigner}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setProjectToDelete(project.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Accessory Listings */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-accent" />
                    Accessory Listings
                  </CardTitle>
                  <CardDescription>Manage your accessory inventory</CardDescription>
                </div>
                <Button onClick={() => handleOpenAccessoryModal()} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Accessory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {accessories.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="mb-4 text-muted-foreground">No accessories listed yet</p>
                  <Button onClick={() => handleOpenAccessoryModal()} variant="outline">
                    Add Your First Accessory
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {accessories.map((accessory) => (
                      <Card key={accessory.id} className="border-primary/10">
                        <CardContent className="flex items-center gap-4 p-4">
                          {accessory.imagePreview && (
                            <img
                              src={accessory.imagePreview}
                              alt={accessory.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{accessory.name}</h4>
                            <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary">{accessory.type}</Badge>
                              <span>${accessory.price}</span>
                              <span>Stock: {accessory.stock}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenAccessoryModal(accessory)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAccessory(accessory.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="cursor-pointer border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                  <CardContent className="p-6 text-center">
                    <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <h4 className="mb-1 text-2xl font-bold">$0</h4>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <Badge variant="outline" className="mt-2 text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/20">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-accent" />
                    <h4 className="mb-1 text-2xl font-bold">0</h4>
                    <p className="text-xs text-muted-foreground">Popularity Score</p>
                    <Badge variant="outline" className="mt-2 text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                  <CardContent className="p-6 text-center">
                    <Package className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <h4 className="mb-1 text-2xl font-bold">0</h4>
                    <p className="text-xs text-muted-foreground">NFT Claims</p>
                    <Badge variant="outline" className="mt-2 text-xs">Coming soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Settings */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>Configure your brand preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AR Integration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ar-integration" className="cursor-pointer">
                    AR Integration
                  </Label>
                  <Switch
                    id="ar-integration"
                    checked={arIntegration}
                    onCheckedChange={setArIntegration}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enable augmented reality features for your designs
                </p>
              </div>

              <Separator />

              {/* OLED Integration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="oled-integration" className="cursor-pointer">
                    OLED Integration
                  </Label>
                  <Switch
                    id="oled-integration"
                    checked={oledEnabled}
                    onCheckedChange={handleOLEDToggle}
                    disabled={oledLoading || saveOLEDMutation.isPending}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sync designs with smart shoe OLED displays via Bluetooth
                </p>
                {saveOLEDMutation.isPending && (
                  <p className="text-xs text-primary">Saving...</p>
                )}
              </div>

              <Separator />

              {/* Public Visibility */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-visibility" className="cursor-pointer">
                    Public Visibility
                  </Label>
                  <Switch
                    id="public-visibility"
                    checked={publicVisibility}
                    onCheckedChange={setPublicVisibility}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Make your brand profile and designs visible to all users
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shortcuts */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate to key sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onNavigateToMarketplace}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Marketplace
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onNavigateToDesigner}
              >
                <Palette className="mr-2 h-4 w-4" />
                Designer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onNavigateToAccessories}
              >
                <Layers className="mr-2 h-4 w-4" />
                Accessories
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your design project and all associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Accessory Modal */}
      <Dialog open={isAccessoryModalOpen} onOpenChange={setIsAccessoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}</DialogTitle>
            <DialogDescription>
              {editingAccessory ? 'Update accessory details' : 'Create a new accessory listing'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="acc-name">Name *</Label>
              <Input
                id="acc-name"
                value={accessoryForm.name || ''}
                onChange={(e) => setAccessoryForm({ ...accessoryForm, name: e.target.value })}
                placeholder="e.g., Wireless Charger"
              />
            </div>
            <div>
              <Label htmlFor="acc-type">Type *</Label>
              <Input
                id="acc-type"
                value={accessoryForm.type || ''}
                onChange={(e) => setAccessoryForm({ ...accessoryForm, type: e.target.value })}
                placeholder="e.g., Charger, Tag, Laces"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="acc-price">Price ($)</Label>
                <Input
                  id="acc-price"
                  type="number"
                  value={accessoryForm.price || 0}
                  onChange={(e) =>
                    setAccessoryForm({ ...accessoryForm, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="acc-stock">Stock</Label>
                <Input
                  id="acc-stock"
                  type="number"
                  value={accessoryForm.stock || 0}
                  onChange={(e) =>
                    setAccessoryForm({ ...accessoryForm, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="acc-description">Description</Label>
              <Textarea
                id="acc-description"
                value={accessoryForm.description || ''}
                onChange={(e) => setAccessoryForm({ ...accessoryForm, description: e.target.value })}
                placeholder="Describe your accessory..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="acc-image">Image</Label>
              <div className="mt-2">
                {(accessoryImageFile || editingAccessory?.imagePreview) && (
                  <div className="relative mb-2 inline-block">
                    <img
                      src={
                        accessoryImageFile
                          ? URL.createObjectURL(accessoryImageFile)
                          : editingAccessory?.imagePreview
                      }
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6"
                      onClick={() => setAccessoryImageFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="acc-image"
                  type="file"
                  accept="image/*"
                  onChange={handleAccessoryImageUpload}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccessoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccessory}>
              {editingAccessory ? 'Update' : 'Add'} Accessory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
