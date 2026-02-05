import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Gamepad2, Headset, Trash2, Edit, TrendingUp, Star, Users, Upload, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { creatorSlotsStorage } from '../utils/creatorSlotsStorage';
import { CreatorSlot, ContentType, SlotStatus } from '../types/creatorSlots';
import { toast } from 'sonner';

interface AIRBrandCreatorSlotsPageProps {
  onBackToGamingPortal: () => void;
  onNavigateToVRSpacesHub: () => void;
}

export default function AIRBrandCreatorSlotsPage({
  onBackToGamingPortal,
  onNavigateToVRSpacesHub,
}: AIRBrandCreatorSlotsPageProps) {
  const [slots, setSlots] = useState<CreatorSlot[]>([]);
  const [capacity, setCapacity] = useState({ used: 0, total: 10 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<CreatorSlot | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'game' as ContentType,
    version: '',
    thumbnailUrl: '',
  });

  // Load slots on mount
  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = () => {
    const allSlots = creatorSlotsStorage.getAllSlots();
    const capacityInfo = creatorSlotsStorage.getCapacity();
    setSlots(allSlots);
    setCapacity(capacityInfo);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      contentType: 'game',
      version: '',
      thumbnailUrl: '',
    });
    setThumbnailPreview('');
  };

  const handleCreateSlot = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newSlot: CreatorSlot = {
      id: `slot-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType,
      status: 'reserved',
      thumbnailUrl: formData.thumbnailUrl || undefined,
      version: formData.version || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      analytics: {
        plays: 0,
        rating: 0,
        popularity: 0,
      },
    };

    creatorSlotsStorage.addSlot(newSlot);
    loadSlots();
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Slot reserved successfully!');
  };

  const handleEditSlot = () => {
    if (!selectedSlot || !formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    creatorSlotsStorage.updateSlot(selectedSlot.id, {
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType,
      version: formData.version || undefined,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      status: 'updating',
    });

    loadSlots();
    setIsEditDialogOpen(false);
    setSelectedSlot(null);
    resetForm();
    toast.success('Slot updated successfully!');
  };

  const handleDeleteSlot = () => {
    if (!selectedSlot) return;

    creatorSlotsStorage.deleteSlot(selectedSlot.id);
    loadSlots();
    setIsDeleteDialogOpen(false);
    setSelectedSlot(null);
    toast.success('Slot deleted successfully!');
  };

  const openEditDialog = (slot: CreatorSlot) => {
    setSelectedSlot(slot);
    setFormData({
      title: slot.title,
      description: slot.description,
      contentType: slot.contentType,
      version: slot.version || '',
      thumbnailUrl: slot.thumbnailUrl || '',
    });
    setThumbnailPreview(slot.thumbnailUrl || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (slot: CreatorSlot) => {
    setSelectedSlot(slot);
    setIsDeleteDialogOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        setFormData({ ...formData, thumbnailUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: SlotStatus) => {
    switch (status) {
      case 'reserved':
        return <Badge variant="outline" className="border-primary/30 bg-primary/5">Reserved</Badge>;
      case 'uploaded':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Uploaded</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'updating':
        return <Badge variant="outline" className="border-accent/30 bg-accent/5">Updating</Badge>;
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    return type === 'game' ? <Gamepad2 className="h-4 w-4" /> : <Headset className="h-4 w-4" />;
  };

  return (
    <div className="air-gaming-portal mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToGamingPortal}
          className="mb-4 -ml-2 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gaming Portal
        </Button>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              A.I.R. Brand/Creator Slots
            </h1>
            <p className="text-sm text-muted-foreground">
              Reserve slots to upload and manage your games and VR space creations
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={onBackToGamingPortal}
            variant="outline"
            className="air-gaming-button border-primary/30 hover:bg-primary/10"
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Gaming Portal
          </Button>

          <Button
            onClick={onNavigateToVRSpacesHub}
            variant="outline"
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Headset className="h-4 w-4 mr-2" />
            VR Spaces Hub
          </Button>
        </div>

        {/* Capacity Card */}
        <Card className="air-gaming-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Slot Capacity</p>
                <p className="text-xs text-muted-foreground">
                  {capacity.used} of {capacity.total} slots used
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{capacity.used}</p>
                  <p className="text-xs text-muted-foreground">/ {capacity.total}</p>
                </div>
                <Upload className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(capacity.used / capacity.total) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Summary (Placeholder) */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analytics Overview
            <Badge variant="outline" className="ml-auto text-xs">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">---</p>
              </div>
              <p className="text-xs text-muted-foreground">Total Plays</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">---</p>
              </div>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">---</p>
              </div>
              <p className="text-xs text-muted-foreground">Popularity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slots Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Slots</h2>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
            disabled={capacity.used >= capacity.total}
            className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Reserve Slot
          </Button>
        </div>

        {/* Empty State */}
        {slots.length === 0 ? (
          <Card className="air-gaming-card">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Slots Reserved</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Reserve your first slot to start uploading games or VR spaces
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
                className="air-gaming-button bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Reserve Your First Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {slots.map((slot) => (
              <Card key={slot.id} className="air-gaming-card">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 flex-shrink-0">
                      {slot.thumbnailUrl ? (
                        <img
                          src={slot.thumbnailUrl}
                          alt={slot.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getContentTypeIcon(slot.contentType)}
                        </div>
                      )}
                    </div>

                    {/* Slot Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground truncate">{slot.title}</h3>
                          {slot.version && (
                            <p className="text-xs text-muted-foreground">v{slot.version}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(slot.status)}
                          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs flex items-center gap-1">
                            {getContentTypeIcon(slot.contentType)}
                            {slot.contentType === 'game' ? 'Game' : 'VR Space'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {slot.description || 'No description provided'}
                      </p>

                      {/* Analytics (Placeholder) */}
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{slot.analytics.plays} plays</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{slot.analytics.rating.toFixed(1)} rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{slot.analytics.popularity}% popularity</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(slot)}
                          className="air-gaming-button text-xs h-7 px-3"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteDialog(slot)}
                          className="air-gaming-button text-xs h-7 px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Reserve Slot Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve New Slot</DialogTitle>
            <DialogDescription>
              Create a new slot for your game or VR space content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter content title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your content"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value as ContentType })}
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="game">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Game
                    </div>
                  </SelectItem>
                  <SelectItem value="vrSpace">
                    <div className="flex items-center gap-2">
                      <Headset className="h-4 w-4" />
                      VR Space
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version (optional)</Label>
              <Input
                id="version"
                placeholder="e.g., 1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image (optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg border border-primary/20"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSlot} className="bg-primary hover:bg-primary/90">
              Reserve Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Slot</DialogTitle>
            <DialogDescription>
              Update your slot information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter content title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your content"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contentType">Content Type *</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value as ContentType })}
              >
                <SelectTrigger id="edit-contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="game">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4" />
                      Game
                    </div>
                  </SelectItem>
                  <SelectItem value="vrSpace">
                    <div className="flex items-center gap-2">
                      <Headset className="h-4 w-4" />
                      VR Space
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-version">Version (optional)</Label>
              <Input
                id="edit-version"
                placeholder="e.g., 1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail Image (optional)</Label>
              <Input
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg border border-primary/20"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedSlot(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSlot} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSlot?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSlot(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlot}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
