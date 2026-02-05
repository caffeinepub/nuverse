import { Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetNotifications } from '../hooks/useQueries';

interface HeaderProps {
  onNavigateToMessaging: () => void;
  onNavigateToLiveEvents?: () => void;
}

export default function Header({ onNavigateToMessaging, onNavigateToLiveEvents }: HeaderProps) {
  const { data: notifications } = useGetNotifications();
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/assets/generated/nuverse-logo-transparent.dim_200x200.png" 
            alt="NuVerse" 
            className="h-10 w-10"
          />
          <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
            NuVerse
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {onNavigateToLiveEvents && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onNavigateToLiveEvents}
            >
              <Zap className="h-5 w-5 text-accent" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onNavigateToMessaging}
          >
            <img 
              src="/assets/generated/notification-bell.dim_32x32.png" 
              alt="Notifications" 
              className="h-6 w-6"
            />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 h-5 min-w-[1.25rem] px-1 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
