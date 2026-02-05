import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Principal } from '@dfinity/principal';
import {
  useGetUserProfile,
  useGetUserPortfolio,
  useGetFollowers,
  useGetFollowerCount,
  useFollowUser,
  useUnfollowUser,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface AIRspaceProfilePageProps {
  userPrincipal: Principal;
  onBack: () => void;
  onMessage?: () => void;
}

export default function AIRspaceProfilePage({ userPrincipal, onBack, onMessage }: AIRspaceProfilePageProps) {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(userPrincipal);
  const { data: portfolio, isLoading: portfolioLoading } = useGetUserPortfolio(userPrincipal);
  const { data: followers } = useGetFollowers(userPrincipal);
  const { data: followerCount } = useGetFollowerCount(userPrincipal);
  
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [postImageUrls, setPostImageUrls] = useState<Map<string, string>>(new Map());
  const [nftImageUrls, setNftImageUrls] = useState<Map<string, string>>(new Map());

  const isOwnProfile = identity?.getPrincipal().toString() === userPrincipal.toString();
  
  // Check if current user is following by checking if their principal is in the followers list
  const currentUserPrincipal = identity?.getPrincipal();
  const isFollowing = currentUserPrincipal && followers 
    ? followers.some(f => f.toString() === currentUserPrincipal.toString())
    : false;

  // Load avatar
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

  // Load post images
  useEffect(() => {
    if (portfolio?.posts) {
      portfolio.posts.forEach((post) => {
        if (post.image && !postImageUrls.has(post.id.toString())) {
          post.image.getBytes().then((bytes) => {
            const blob = new Blob([bytes], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setPostImageUrls((prev) => new Map(prev).set(post.id.toString(), url));
          }).catch((error) => {
            console.error('Failed to load post image:', error);
          });
        }
      });
    }
  }, [portfolio?.posts]);

  // Load NFT images
  useEffect(() => {
    if (portfolio?.nfts) {
      portfolio.nfts.forEach((nft) => {
        if (nft.image && !nftImageUrls.has(nft.id)) {
          nft.image.getBytes().then((bytes) => {
            const blob = new Blob([bytes], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setNftImageUrls((prev) => new Map(prev).set(nft.id, url));
          }).catch((error) => {
            console.error('Failed to load NFT image:', error);
          });
        }
      });
    }
  }, [portfolio?.nfts]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(userPrincipal);
        toast.success('Unfollowed successfully');
      } else {
        await followMutation.mutateAsync(userPrincipal);
        toast.success('Following successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const username = profile.username || 'Anonymous';
  const initials = username.slice(0, 2).toUpperCase();

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
        <h1 className="text-lg font-bold">Profile</h1>
        <Button variant="ghost" size="icon" onClick={onMessage}>
          <img 
            src="/assets/generated/message-icon-transparent.dim_32x32.png" 
            alt="Message" 
            className="h-6 w-6"
          />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="border-b px-4 py-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{profile.bio || 'No bio yet'}</p>
            
            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-xl font-bold">{followerCount?.toString() || '0'}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-xl font-bold">{followers?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>

            {!isOwnProfile && (
              <Button
                className="mt-4 w-full sm:w-auto"
                variant={isFollowing ? 'outline' : 'default'}
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
              >
                {followMutation.isPending || unfollowMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="px-4 py-6">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="ar-vr">AR/VR</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {portfolioLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : portfolio?.posts && portfolio.posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {portfolio.posts.map((post) => {
                  const imageUrl = postImageUrls.get(post.id.toString());
                  return (
                    <Card key={post.id.toString()} className="overflow-hidden">
                      <CardContent className="p-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Post"
                            className="aspect-square w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center bg-muted">
                            <p className="p-2 text-center text-xs text-muted-foreground line-clamp-3">
                              {post.content}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ar-vr" className="mt-6">
            {portfolioLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : portfolio?.vrExperiences && portfolio.vrExperiences.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {portfolio.vrExperiences.map((vr) => (
                  <Card key={vr.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="mb-2 flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                        <span className="text-4xl">🥽</span>
                      </div>
                      <h3 className="font-semibold line-clamp-1">{vr.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{vr.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">No AR/VR experiences yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            {portfolioLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : portfolio?.nfts && portfolio.nfts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {portfolio.nfts.map((nft) => {
                  const imageUrl = nftImageUrls.get(nft.id);
                  return (
                    <Card key={nft.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={nft.name}
                            className="aspect-square w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center bg-muted">
                            <span className="text-4xl">🖼️</span>
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="font-semibold line-clamp-1">{nft.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{nft.metadata}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <p className="text-muted-foreground">No NFTs yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
