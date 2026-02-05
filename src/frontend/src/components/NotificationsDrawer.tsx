import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: 'like',
    message: 'Alex liked your post',
    time: '2 hours ago',
    icon: Heart,
  },
  {
    id: 2,
    type: 'comment',
    message: 'Jordan commented on your design',
    time: '5 hours ago',
    icon: MessageCircle,
  },
  {
    id: 3,
    type: 'follow',
    message: 'Sam started following you',
    time: '1 day ago',
    icon: UserPlus,
  },
];

export default function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-2">
            {mockNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
