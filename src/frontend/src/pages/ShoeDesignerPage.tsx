import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Save, Download, RotateCw, ZoomIn, ZoomOut, Move, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCreateDesignProject, useUploadDesignFile, useUpdateDesignCustomization, useGetUserDesignProjects } from '@/hooks/useQueries';
import { DesignFileType, ExternalBlob } from '@/backend';

interface DesignerPageProps {
  onBack: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToHealthTracker: () => void;
  onNavigateToNFT: () => void;
  onNavigateToBrandDashboard: () => void;
}

export default function ShoeDesignerPage({
  onBack,
  onNavigateToMarketplace,
  onNavigateToHealthTracker,
  onNavigateToNFT,
  onNavigateToBrandDashboard,
}: DesignerPageProps) {
  const [projectName, setProjectName] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; preview: string }>>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>(['#3B82F6', '#8B5CF6', '#EC4899']);
  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [canvasTransform, setCanvasTransform] = useState({ zoom: 1, rotation: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProjectMutation = useCreateDesignProject();
  const uploadFileMutation = useUploadDesignFile();
  const updateCustomizationMutation = useUpdateDesignCustomization();
  const { data: userProjects = [] } = useGetUserDesignProjects();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create project if not exists
    if (!currentProjectId) {
      const name = projectName || `Design ${new Date().toLocaleDateString()}`;
      try {
        const projectId = await createProjectMutation.mutateAsync(name);
        setCurrentProjectId(projectId);
        setProjectName(name);
      } catch (error) {
        toast.error('Failed to create project');
        return;
      }
    }

    // Process files
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setUploadedFiles((prev) => [
            ...prev,
            { name: file.name, type: file.type, preview: result },
          ]);

          // Upload to backend
          if (currentProjectId) {
            try {
              const arrayBuffer = await file.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              const blob = ExternalBlob.fromBytes(uint8Array);
              
              const fileType = file.type.startsWith('image/') 
                ? DesignFileType.image2D 
                : DesignFileType.model3D;

              await uploadFileMutation.mutateAsync({
                projectId: currentProjectId,
                fileType,
                blob,
                thumbnail: null,
              });

              toast.success(`${file.name} uploaded successfully`);
            } catch (error) {
              toast.error(`Failed to upload ${file.name}`);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleTextureSelect = (texture: string) => {
    setSelectedTextures((prev) =>
      prev.includes(texture) ? prev.filter((t) => t !== texture) : [...prev, texture]
    );
  };

  const handlePatternSelect = (pattern: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(pattern) ? prev.filter((p) => p !== pattern) : [...prev, pattern]
    );
  };

  const handleEffectSelect = (effect: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  };

  const handleSaveCustomization = async () => {
    if (!currentProjectId) {
      toast.error('Please create a project first');
      return;
    }

    try {
      await updateCustomizationMutation.mutateAsync({
        projectId: currentProjectId,
        customization: {
          colors: selectedColors,
          textures: selectedTextures,
          patterns: selectedPatterns,
          effects: selectedEffects,
        },
      });
      toast.success('Customization saved successfully');
    } catch (error) {
      toast.error('Failed to save customization');
    }
  };

  const handleOLEDSync = () => {
    toast.info('OLED Bluetooth sync feature coming soon!');
  };

  const colorPalette = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
    '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  ];

  const textures = ['Leather', 'Canvas', 'Mesh', 'Suede', 'Synthetic'];
  const patterns = ['Solid', 'Stripes', 'Dots', 'Geometric', 'Abstract'];
  const effects = ['Glossy', 'Matte', 'Metallic', 'Glow', 'Holographic'];

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
              Nutech Shoe Designer
            </h1>
            <p className="text-sm text-muted-foreground">Create and customize your dream footwear</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveCustomization} disabled={!currentProjectId}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Upload & Customization */}
        <div className="space-y-6 lg:col-span-1">
          {/* Project Name */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <Label htmlFor="projectName" className="mb-2 block text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="projectName"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Design Upload</h3>
              <div
                className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src="/assets/generated/upload-dropzone.dim_400x200.png"
                  alt="Upload"
                  className="mx-auto mb-4 h-24 w-auto opacity-50"
                />
                <p className="mb-2 text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground">Supports 2D images and 3D models</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.obj,.fbx,.gltf,.glb"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* File Previews */}
              {uploadedFiles.length > 0 && (
                <ScrollArea className="mt-4 h-32">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-primary/20 bg-card p-2"
                      >
                        <img
                          src="/assets/generated/file-preview-frame.dim_200x150.png"
                          alt="Preview"
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Customization Tabs */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
                  <TabsTrigger value="textures" className="text-xs">Textures</TabsTrigger>
                  <TabsTrigger value="patterns" className="text-xs">Patterns</TabsTrigger>
                  <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="mt-4">
                  <img
                    src="/assets/generated/color-palette-picker.dim_300x200.png"
                    alt="Color Palette"
                    className="mb-4 w-full rounded-lg"
                  />
                  <div className="grid grid-cols-5 gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`h-10 w-10 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedColors.includes(color)
                            ? 'border-primary shadow-lg shadow-primary/50'
                            : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="textures" className="mt-4">
                  <img
                    src="/assets/generated/texture-panel.dim_300x200.png"
                    alt="Textures"
                    className="mb-4 w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    {textures.map((texture) => (
                      <Button
                        key={texture}
                        variant={selectedTextures.includes(texture) ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handleTextureSelect(texture)}
                      >
                        {texture}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="patterns" className="mt-4">
                  <img
                    src="/assets/generated/pattern-overlay-panel.dim_300x200.png"
                    alt="Patterns"
                    className="mb-4 w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    {patterns.map((pattern) => (
                      <Button
                        key={pattern}
                        variant={selectedPatterns.includes(pattern) ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handlePatternSelect(pattern)}
                      >
                        {pattern}
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="mt-4">
                  <img
                    src="/assets/generated/effects-panel.dim_300x200.png"
                    alt="Effects"
                    className="mb-4 w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    {effects.map((effect) => (
                      <Button
                        key={effect}
                        variant={selectedEffects.includes(effect) ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handleEffectSelect(effect)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {effect}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Design Canvas */}
        <div className="space-y-6 lg:col-span-2">
          {/* Canvas Controls */}
          <Card className="border-primary/20">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCanvasTransform((prev) => ({ ...prev, rotation: prev.rotation - 45 }))}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCanvasTransform((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 3) }))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCanvasTransform((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Move className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary">
                Zoom: {Math.round(canvasTransform.zoom * 100)}%
              </Badge>
            </CardContent>
          </Card>

          {/* Main Canvas */}
          <Card className="border-primary/20">
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div
                  className="flex h-full items-center justify-center transition-transform duration-300"
                  style={{
                    transform: `scale(${canvasTransform.zoom}) rotate(${canvasTransform.rotation}deg)`,
                  }}
                >
                  {uploadedFiles.length > 0 ? (
                    <img
                      src={uploadedFiles[0].preview}
                      alt="Design Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <img
                        src="/assets/generated/canvas-controls.dim_200x150.png"
                        alt="Canvas"
                        className="mx-auto mb-4 h-32 w-auto opacity-30"
                      />
                      <p className="text-sm text-muted-foreground">Upload a design to get started</p>
                    </div>
                  )}
                </div>

                {/* Interaction Overlay */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge className="bg-primary/80 backdrop-blur-sm">
                    <Palette className="mr-1 h-3 w-3" />
                    {selectedColors.length} Colors
                  </Badge>
                  {selectedTextures.length > 0 && (
                    <Badge className="bg-accent/80 backdrop-blur-sm">
                      {selectedTextures.length} Textures
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AR Preview */}
          <Card className="border-dashed border-primary/30">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <img
                src="/assets/generated/ar-preview-placeholder.dim_300x200.png"
                alt="AR Preview"
                className="mb-4 h-32 w-auto opacity-50"
              />
              <h4 className="mb-2 font-semibold">AR Virtual Try-On</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Preview your design in augmented reality
              </p>
              <Button variant="outline" disabled>
                Launch AR Preview
              </Button>
            </CardContent>
          </Card>

          {/* OLED Integration */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Smart Shoe OLED Sync</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect via Bluetooth to sync your design
                  </p>
                </div>
              </div>
              <Button onClick={handleOLEDSync} className="shrink-0">
                <img
                  src="/assets/generated/oled-sync-button.dim_150x60.png"
                  alt="Sync"
                  className="h-6 w-auto"
                />
              </Button>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Separator className="my-6" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              onClick={onNavigateToHealthTracker}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <img
                  src="/assets/generated/health-tracker-icon-transparent.dim_64x64.png"
                  alt="Health Tracker"
                  className="mb-3 h-12 w-12"
                />
                <h3 className="font-semibold">Health Tracker</h3>
                <p className="text-xs text-muted-foreground">Track fitness</p>
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
                <p className="text-xs text-muted-foreground">Digital assets</p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer border-primary/20 transition-all hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              onClick={onNavigateToBrandDashboard}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <img
                  src="/assets/generated/brand-dashboard-icon.dim_64x64.png"
                  alt="Brand Dashboard"
                  className="mb-3 h-12 w-12"
                />
                <h3 className="font-semibold">Brand Dashboard</h3>
                <p className="text-xs text-muted-foreground">Manage brand</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
