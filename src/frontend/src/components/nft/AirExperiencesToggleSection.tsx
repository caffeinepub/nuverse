import { Gamepad2, Eye, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ToggleConfig {
  key: 'enabledShoeHealth' | 'enabledShoeMusic' | 'enabledOledSync';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface AirExperiencesToggleSectionProps {
  values: {
    enabledShoeHealth: boolean;
    enabledShoeMusic: boolean;
    enabledOledSync: boolean;
  };
  onChange: (key: 'enabledShoeHealth' | 'enabledShoeMusic' | 'enabledOledSync', value: boolean) => void;
  isLoading?: boolean;
}

const toggleConfigs: ToggleConfig[] = [
  {
    key: 'enabledShoeHealth',
    label: 'Equip in Game',
    description: 'Wear your NFT shoes in compatible AIR games.',
    icon: <Gamepad2 className="h-5 w-5" />,
  },
  {
    key: 'enabledShoeMusic',
    label: 'Display in VR Space',
    description: 'Showcase your shoes in VR galleries and social spaces.',
    icon: <Eye className="h-5 w-5" />,
  },
  {
    key: 'enabledOledSync',
    label: 'Sync with Avatar',
    description: 'Automatically attach shoes to your AIR avatar across worlds.',
    icon: <User className="h-5 w-5" />,
  },
];

export default function AirExperiencesToggleSection({
  values,
  onChange,
  isLoading = false,
}: AirExperiencesToggleSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Use in AIR Experiences</h3>
        <p className="text-sm text-muted-foreground">
          Your shoe becomes a wearable in AIR worlds.
        </p>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-3">
        {toggleConfigs.map((config) => {
          const isActive = values[config.key];
          
          return (
            <Card
              key={config.key}
              className={`
                border-2 transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? 'border-primary/60 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20'
                    : 'border-border/50 bg-card/50 hover:border-primary/30'
                }
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={() => !isLoading && onChange(config.key, !isActive)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                {/* Icon */}
                <div
                  className={`
                    rounded-full p-3 transition-all duration-300
                    ${
                      isActive
                        ? 'bg-primary/20 text-primary ring-2 ring-primary/40 shadow-lg shadow-primary/30'
                        : 'bg-muted/50 text-muted-foreground'
                    }
                  `}
                >
                  {config.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-1">
                  <p
                    className={`
                      text-base font-bold transition-colors
                      ${isActive ? 'text-primary' : 'text-foreground'}
                    `}
                  >
                    {config.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {config.description}
                  </p>
                </div>

                {/* Switch */}
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => onChange(config.key, checked)}
                  disabled={isLoading}
                  className={`
                    transition-all duration-300
                    ${isActive ? 'shadow-lg shadow-primary/30' : ''}
                  `}
                  onClick={(e) => e.stopPropagation()}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
