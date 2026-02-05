import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Eye, Save, Upload, Briefcase, Headset, Sparkles, Palette, Sun, Moon, Sunset, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { VRSpaceDraft, SceneObject, LayoutType, EnvironmentSettings, VRSpaceRules } from '../types/vrSpaceBuilder';
import { vrSpaceStorage } from '../utils/vrSpaceStorage';

interface AIRVRSpaceCreationPageProps {
  onBackToVRHub: () => void;
  onNavigateToBrandDashboard: () => void;
}

// Asset library presets
const ASSET_LIBRARY = [
  { id: 'cube', name: 'Cube', type: 'primitive' as const },
  { id: 'sphere', name: 'Sphere', type: 'primitive' as const },
  { id: 'cylinder', name: 'Cylinder', type: 'primitive' as const },
  { id: 'plane', name: 'Plane', type: 'primitive' as const },
  { id: 'tree', name: 'Tree Model', type: 'model' as const },
  { id: 'building', name: 'Building Model', type: 'model' as const },
  { id: 'furniture', name: 'Furniture Set', type: 'model' as const },
  { id: 'pointLight', name: 'Point Light', type: 'light' as const },
  { id: 'spotLight', name: 'Spot Light', type: 'light' as const },
  { id: 'particles', name: 'Particle Effect', type: 'effect' as const },
];

const TEXTURE_PRESETS = ['None', 'Wood', 'Metal', 'Glass', 'Concrete', 'Fabric', 'Neon'];

export default function AIRVRSpaceCreationPage({
  onBackToVRHub,
  onNavigateToBrandDashboard,
}: AIRVRSpaceCreationPageProps) {
  // Space metadata
  const [spaceName, setSpaceName] = useState('My VR Space');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fantasy' | 'nightclub' | 'classroom' | 'custom'>('custom');
  
  // Layout
  const [layout, setLayout] = useState<LayoutType>('openWorld');
  
  // Scene objects
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  // Rules
  const [rules, setRules] = useState<VRSpaceRules>({
    maxUsers: 50,
    allowVoiceChat: true,
    allowObjectInteraction: true,
    moderationLevel: 'moderate',
  });
  
  // Environment
  const [environment, setEnvironment] = useState<EnvironmentSettings>({
    ambientIntensity: 0.5,
    directionalIntensity: 0.8,
    moodPreset: 'day',
  });

  const selectedObject = sceneObjects.find(obj => obj.id === selectedObjectId);

  const handleAddAsset = (assetId: string) => {
    const asset = ASSET_LIBRARY.find(a => a.id === assetId);
    if (!asset) return;

    const newObject: SceneObject = {
      id: `${assetId}-${Date.now()}`,
      name: asset.name,
      type: asset.type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
      color: '#ffffff',
      texture: 'None',
    };

    setSceneObjects([...sceneObjects, newObject]);
    setSelectedObjectId(newObject.id);
    toast.success(`Added ${asset.name} to scene`);
  };

  const handleRemoveObject = (id: string) => {
    setSceneObjects(sceneObjects.filter(obj => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
    toast.success('Object removed from scene');
  };

  const handleUpdateObject = (id: string, updates: Partial<SceneObject>) => {
    setSceneObjects(sceneObjects.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  const handleSaveDraft = () => {
    const draft: VRSpaceDraft = {
      id: `draft-${Date.now()}`,
      name: spaceName,
      description,
      category,
      layout,
      sceneObjects,
      rules,
      environment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    vrSpaceStorage.saveDraft(draft);
    toast.success('Draft Saved', {
      description: `"${spaceName}" has been saved locally.`,
    });
  };

  const handlePublish = () => {
    if (!spaceName.trim()) {
      toast.error('Please enter a space name');
      return;
    }

    const draft: VRSpaceDraft = {
      id: `space-${Date.now()}`,
      name: spaceName,
      description,
      category,
      layout,
      sceneObjects,
      rules,
      environment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    vrSpaceStorage.publishSpace(draft);
    
    toast.success('VR Space Published!', {
      description: `"${spaceName}" is now live in the VR Spaces Hub.`,
      duration: 4000,
    });
  };

  const getLayoutLabel = (layoutType: LayoutType) => {
    switch (layoutType) {
      case 'openWorld': return 'Open World';
      case 'roomBased': return 'Room-Based';
      case 'arena': return 'Arena';
      case 'gallery': return 'Gallery';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'day': return <Sun className="h-4 w-4" />;
      case 'night': return <Moon className="h-4 w-4" />;
      case 'sunset': return <Sunset className="h-4 w-4" />;
      case 'neon': return <Zap className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="air-gaming-portal mx-auto max-w-4xl px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToVRHub}
            className="-ml-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to VR Spaces Hub
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToBrandDashboard}
            className="air-gaming-button border-accent/30 hover:bg-accent/10"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Brand/Creator Slots
          </Button>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Headset className="h-8 w-8 text-accent" />
              A.I.R. VR Space Creation
            </h1>
            <p className="text-sm text-muted-foreground">
              Build custom VR worlds with layouts, assets, and interactive rules
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="air-gaming-button border-primary/30 hover:bg-primary/10"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          <Button
            onClick={handlePublish}
            className="air-gaming-button bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Live Preview Placeholder */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-accent" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-lg border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 flex flex-col items-center justify-center p-6">
            <Sparkles className="h-12 w-12 text-accent/50 mb-3" />
            <p className="text-sm font-semibold text-foreground mb-2">
              AR/VR Live Preview (Not Connected)
            </p>
            <p className="text-xs text-muted-foreground text-center mb-4">
              Real-time 3D rendering will be available in a future update
            </p>
            
            {/* Preview Summary */}
            <div className="w-full max-w-md space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-card/50">
                <span className="text-muted-foreground">Layout:</span>
                <Badge variant="outline" className="text-xs">{getLayoutLabel(layout)}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-card/50">
                <span className="text-muted-foreground">Objects:</span>
                <Badge variant="outline" className="text-xs">{sceneObjects.length} items</Badge>
              </div>
              {selectedObject && (
                <div className="flex justify-between items-center p-2 rounded bg-card/50">
                  <span className="text-muted-foreground">Selected:</span>
                  <Badge variant="outline" className="text-xs">{selectedObject.name}</Badge>
                </div>
              )}
              <div className="flex justify-between items-center p-2 rounded bg-card/50">
                <span className="text-muted-foreground">Lighting:</span>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {getMoodIcon(environment.moodPreset)}
                  {environment.moodPreset}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="spaceName">Space Name *</Label>
            <Input
              id="spaceName"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="Enter VR space name..."
              className="mt-1 bg-background/50 border-primary/20"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your VR space..."
              className="mt-1 bg-background/50 border-primary/20 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as any)}>
              <SelectTrigger className="mt-1 bg-background/50 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="nightclub">Nightclub</SelectItem>
                <SelectItem value="classroom">Classroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Layout Selection */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Layout Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {(['openWorld', 'roomBased', 'arena', 'gallery'] as LayoutType[]).map((layoutType) => (
              <button
                key={layoutType}
                onClick={() => setLayout(layoutType)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  layout === layoutType
                    ? 'border-accent bg-accent/10'
                    : 'border-primary/20 hover:border-primary/40 bg-card/50'
                }`}
              >
                <p className="font-semibold text-sm text-foreground">{getLayoutLabel(layoutType)}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Library & Scene Objects */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Scene Objects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Asset Library */}
          <div>
            <Label className="mb-2 block">Add Assets</Label>
            <ScrollArea className="h-32 rounded-lg border border-primary/20 bg-background/50 p-3">
              <div className="grid grid-cols-2 gap-2">
                {ASSET_LIBRARY.map((asset) => (
                  <Button
                    key={asset.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddAsset(asset.id)}
                    className="justify-start text-xs h-8 border-accent/20 hover:bg-accent/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {asset.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Scene Objects List */}
          <div>
            <Label className="mb-2 block">Objects in Scene ({sceneObjects.length})</Label>
            {sceneObjects.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-primary/20 rounded-lg">
                No objects added yet. Add assets from the library above.
              </div>
            ) : (
              <ScrollArea className="h-48 rounded-lg border border-primary/20 bg-background/50 p-3">
                <div className="space-y-2">
                  {sceneObjects.map((obj) => (
                    <div
                      key={obj.id}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedObjectId === obj.id
                          ? 'border-accent bg-accent/10'
                          : 'border-primary/20 hover:border-primary/40 bg-card/50'
                      }`}
                      onClick={() => setSelectedObjectId(obj.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{obj.name}</p>
                        <p className="text-xs text-muted-foreground">{obj.type}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveObject(obj.id);
                        }}
                        className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Object Inspector */}
      {selectedObject && (
        <Card className="air-gaming-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Object Inspector: {selectedObject.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transform */}
            <div>
              <Label className="mb-3 block font-semibold">Transform</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Position</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div key={axis}>
                        <Label className="text-xs">{axis.toUpperCase()}</Label>
                        <Input
                          type="number"
                          value={selectedObject.position[axis]}
                          onChange={(e) => handleUpdateObject(selectedObject.id, {
                            position: { ...selectedObject.position, [axis]: parseFloat(e.target.value) || 0 }
                          })}
                          className="mt-1 h-8 text-xs bg-background/50 border-primary/20"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Rotation</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div key={axis}>
                        <Label className="text-xs">{axis.toUpperCase()}</Label>
                        <Input
                          type="number"
                          value={selectedObject.rotation[axis]}
                          onChange={(e) => handleUpdateObject(selectedObject.id, {
                            rotation: { ...selectedObject.rotation, [axis]: parseFloat(e.target.value) || 0 }
                          })}
                          className="mt-1 h-8 text-xs bg-background/50 border-primary/20"
                          step="1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Scale</Label>
                  <Input
                    type="number"
                    value={selectedObject.scale}
                    onChange={(e) => handleUpdateObject(selectedObject.id, {
                      scale: parseFloat(e.target.value) || 1
                    })}
                    className="h-8 text-xs bg-background/50 border-primary/20"
                    step="0.1"
                    min="0.1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Material */}
            <div>
              <Label className="mb-3 block font-semibold">Material</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedObject.color}
                      onChange={(e) => handleUpdateObject(selectedObject.id, { color: e.target.value })}
                      className="h-10 w-20 p-1 bg-background/50 border-primary/20"
                    />
                    <Input
                      type="text"
                      value={selectedObject.color}
                      onChange={(e) => handleUpdateObject(selectedObject.id, { color: e.target.value })}
                      className="flex-1 h-10 text-xs bg-background/50 border-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Texture</Label>
                  <Select
                    value={selectedObject.texture}
                    onValueChange={(val) => handleUpdateObject(selectedObject.id, { texture: val })}
                  >
                    <SelectTrigger className="h-10 bg-background/50 border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXTURE_PRESETS.map((texture) => (
                        <SelectItem key={texture} value={texture}>{texture}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environment & Lighting */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent" />
            Environment & Lighting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Mood Preset</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['day', 'night', 'sunset', 'neon'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setEnvironment({ ...environment, moodPreset: mood })}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    environment.moodPreset === mood
                      ? 'border-accent bg-accent/10'
                      : 'border-primary/20 hover:border-primary/40 bg-card/50'
                  }`}
                >
                  {getMoodIcon(mood)}
                  <span className="text-sm font-medium capitalize">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Ambient Intensity</Label>
              <span className="text-xs text-muted-foreground">{environment.ambientIntensity.toFixed(2)}</span>
            </div>
            <Slider
              value={[environment.ambientIntensity]}
              onValueChange={([val]) => setEnvironment({ ...environment, ambientIntensity: val })}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Directional Intensity</Label>
              <span className="text-xs text-muted-foreground">{environment.directionalIntensity.toFixed(2)}</span>
            </div>
            <Slider
              value={[environment.directionalIntensity]}
              onValueChange={([val]) => setEnvironment({ ...environment, directionalIntensity: val })}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rules & Permissions */}
      <Card className="air-gaming-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Rules & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxUsers">Max Users</Label>
            <Select
              value={rules.maxUsers.toString()}
              onValueChange={(val) => setRules({ ...rules, maxUsers: parseInt(val) })}
            >
              <SelectTrigger className="mt-1 bg-background/50 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 users</SelectItem>
                <SelectItem value="25">25 users</SelectItem>
                <SelectItem value="50">50 users</SelectItem>
                <SelectItem value="100">100 users</SelectItem>
                <SelectItem value="500">500 users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Voice Chat</Label>
              <p className="text-xs text-muted-foreground">Enable voice communication</p>
            </div>
            <Switch
              checked={rules.allowVoiceChat}
              onCheckedChange={(checked) => setRules({ ...rules, allowVoiceChat: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Object Interaction</Label>
              <p className="text-xs text-muted-foreground">Users can move and interact with objects</p>
            </div>
            <Switch
              checked={rules.allowObjectInteraction}
              onCheckedChange={(checked) => setRules({ ...rules, allowObjectInteraction: checked })}
            />
          </div>

          <div>
            <Label htmlFor="moderationLevel">Moderation Level</Label>
            <Select
              value={rules.moderationLevel}
              onValueChange={(val) => setRules({ ...rules, moderationLevel: val as any })}
            >
              <SelectTrigger className="mt-1 bg-background/50 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open - Minimal moderation</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced moderation</SelectItem>
                <SelectItem value="strict">Strict - High moderation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
