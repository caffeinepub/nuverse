import { useState, useEffect } from 'react';
import { ArrowLeft, User as UserIcon, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useGetChatThreads,
  useGetFriendRequests,
  useGetNotifications,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useGetUserProfile,
} from '../hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';
import type { ChatThread, FriendRequest, Notification } from '../backend';

interface AIRspaceMessagingPageProps {
  onBack: () => void;
  onNavigateToProfile: () => void;
}

export default function AIRspaceMessagingPage({ onBack, onNavigateToProfile }: AIRspaceMessagingPageProps) {
  const { data: chatThreads, isLoading: threadsLoading } = useGetChatThreads();
  const { data: friendRequests, isLoading: requestsLoading } = useGetFriendRequests();
  const { data: notifications, isLoading: notificationsLoading } = useGetNotifications();
  const acceptRequestMutation = useAcceptFriendRequest();
  const rejectRequestMutation = useRejectFriendRequest();

  const handleAcceptRequest = async (requestId: bigint) => {
    try {
      await acceptRequestMutation.mutateAsync(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId: bigint) => {
    try {
      await rejectRequestMutation.mutateAsync(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'liveEvent':
        return '🎥';
      case 'nftDrop':
        return '🎨';
      default:
        return '🔔';
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case 'like':
        return 'Like';
      case 'comment':
        return 'Comment';
      case 'liveEvent':
        return 'Live Event';
      case 'nftDrop':
        return 'NFT Drop';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <img 
            src="/assets/generated/back-arrow-icon-transparent.dim_32x32.png" 
            alt="Back" 
            className="h-6 w-6"
          />
        </Button>
        <h1 className="text-lg font-bold">Messages & Notifications</h1>
        <Button variant="ghost" size="icon" onClick={onNavigateToProfile}>
          <img 
            src="/assets/generated/profile-icon.dim_64x64.png" 
            alt="Profile" 
            className="h-6 w-6"
          />
        </Button>
      </div>

      {/* Content Tabs */}
      <div className="px-4 py-6">
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">
              Messages
              {chatThreads && chatThreads.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {chatThreads.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {friendRequests && friendRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              {notifications && notifications.filter(n => !n.isRead).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.filter(n => !n.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-6">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {threadsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chatThreads && chatThreads.length > 0 ? (
                <div className="space-y-2">
                  {chatThreads.map((thread) => (
                    <ChatThreadCard key={thread.id.toString()} thread={thread} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <div className="mb-4 text-6xl">💬</div>
                  <h3 className="mb-2 text-lg font-semibold">No messages yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with your followers
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Friend Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {requestsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : friendRequests && friendRequests.length > 0 ? (
                <div className="space-y-2">
                  {friendRequests.map((request) => (
                    <FriendRequestCard
                      key={request.id.toString()}
                      request={request}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      isAccepting={acceptRequestMutation.isPending}
                      isRejecting={rejectRequestMutation.isPending}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <div className="mb-4 text-6xl">👥</div>
                  <h3 className="mb-2 text-lg font-semibold">No pending requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Friend requests will appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {notificationsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id.toString()}
                      notification={notification}
                      icon={getNotificationIcon(notification.notificationType)}
                      label={getNotificationLabel(notification.notificationType)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <div className="mb-4 text-6xl">🔔</div>
                  <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up!
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Chat Thread Card Component
function ChatThreadCard({ thread }: { thread: ChatThread }) {
  const otherParticipant = thread.participants[1]; // Assuming first is current user
  const { data: profile } = useGetUserProfile(otherParticipant);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.avatar) {
      profile.avatar.getBytes().then((bytes) => {
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      }).catch((error) => {
        console.error('Failed to load avatar:', error);
      });
    }
  }, [profile?.avatar]);

  const username = profile?.username || 'User';
  const initials = username.slice(0, 2).toUpperCase();
  const lastMessage = thread.lastMessage?.content || 'No messages yet';
  const hasARVRContent = lastMessage.includes('[AR]') || lastMessage.includes('[VR]');

  return (
    <Card className="cursor-pointer transition-colors hover:bg-accent/50">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={username} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{username}</h3>
            {hasARVRContent && (
              <Badge variant="outline" className="ml-2 text-xs">
                🥽 AR/VR
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {lastMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Friend Request Card Component
function FriendRequestCard({
  request,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: {
  request: FriendRequest;
  onAccept: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isAccepting: boolean;
  isRejecting: boolean;
}) {
  const { data: profile } = useGetUserProfile(request.from);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.avatar) {
      profile.avatar.getBytes().then((bytes) => {
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      }).catch((error) => {
        console.error('Failed to load avatar:', error);
      });
    }
  }, [profile?.avatar]);

  const username = profile?.username || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={username} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{username}</h3>
          <p className="text-sm text-muted-foreground">wants to connect with you</p>
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="default"
            onClick={() => onAccept(request.id)}
            disabled={isAccepting || isRejecting}
            className="h-10 w-10"
          >
            {isAccepting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onReject(request.id)}
            disabled={isAccepting || isRejecting}
            className="h-10 w-10"
          >
            {isRejecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Notification Card Component
function NotificationCard({
  notification,
  icon,
  label,
}: {
  notification: Notification;
  icon: string;
  label: string;
}) {
  return (
    <Card className={notification.isRead ? 'opacity-60' : ''}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-2xl">
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {label}
            </Badge>
            {!notification.isRead && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <p className="mt-2 text-sm">{notification.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">Just now</p>
        </div>
      </CardContent>
    </Card>
  );
}
