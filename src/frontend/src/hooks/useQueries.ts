import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PublicUserProfile, UserProfile, Post, NFT, PortfolioContent, ChatThread, FriendRequest, Notification, LiveEvent, CreatorMonetizationDashboard, MonetizationConfig, ShoeProduct, ShoeCategory, ShoeDesignProject, DesignCustomization, DesignFileType, OLEDSettings, ShoeHealth, AirIntegrationSettings, AudioAttachment } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PublicUserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicUserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Audio Attachment Queries
export function useUploadAudioAttachment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (audio: AudioAttachment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadAudioAttachment(audio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioAttachments'] });
    },
  });
}

export function useGetAudioAttachment(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AudioAttachment | null>({
    queryKey: ['audioAttachment', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getAudioAttachment(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetAllAudioAttachments() {
  const { actor, isFetching } = useActor();

  return useQuery<AudioAttachment[]>({
    queryKey: ['audioAttachments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAudioAttachments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteAudioAttachment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAudioAttachment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioAttachments'] });
    },
  });
}

// Posts Queries
export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image }: { content: string; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

export function useCreatePostWithAudio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image, audioIds }: { content: string; image: ExternalBlob | null; audioIds: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPostWithAudio(content, image, audioIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

export function useGetUserPosts(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['userPosts', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserPosts(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

// NFT Queries
export function useGetUserNFTs(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<NFT[]>({
    queryKey: ['nfts', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserNFTs(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useCreateNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nft: NFT) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNFT(nft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
  });
}

// Portfolio Queries - Composite query that fetches posts and NFTs
export function useGetUserPortfolio(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioContent>({
    queryKey: ['portfolio', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) {
        return { posts: [], nfts: [], vrExperiences: [] };
      }
      // Fetch posts and NFTs separately since there's no getUserPortfolio method
      const [posts, nfts] = await Promise.all([
        actor.getUserPosts(principal),
        actor.getUserNFTs(principal),
      ]);
      return { posts, nfts, vrExperiences: [] };
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

// Follow/Unfollow Queries
export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.followUser(userPrincipal);
    },
    onSuccess: (_, userPrincipal) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userPrincipal.toString()] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', userPrincipal.toString()] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unfollowUser(userPrincipal);
    },
    onSuccess: (_, userPrincipal) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userPrincipal.toString()] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', userPrincipal.toString()] });
    },
  });
}

export function useGetFollowers(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['followers', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      return actor.getFollowers(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useGetFollowerCount(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['followerCount', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return BigInt(0);
      return actor.getFollowerCount(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

// Messaging Queries
export function useGetChatThreads() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatThread[]>({
    queryKey: ['chatThreads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatThreads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, content }: { threadId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(threadId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

export function useCreateChatThread() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participants: Principal[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createChatThread(participants);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatThreads'] });
    },
  });
}

// Friend Request Queries
export function useGetFriendRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<FriendRequest[]>({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFriendRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendFriendRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (to: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendFriendRequest(to);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
}

export function useAcceptFriendRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptFriendRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
}

export function useRejectFriendRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectFriendRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
}

// Notification Queries
export function useGetNotifications() {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Live Events Queries
export function useGetLiveEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<LiveEvent[]>({
    queryKey: ['liveEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLiveEvents();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
}

export function useCreateLiveEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, hostName, description, thumbnail }: { title: string; hostName: string; description: string; thumbnail: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLiveEvent(title, hostName, description, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveEvents'] });
    },
  });
}

export function useJoinLiveEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinLiveEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveEvents'] });
    },
  });
}

// Creator Monetization Queries
export function useGetCreatorDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<CreatorMonetizationDashboard | null>({
    queryKey: ['creatorDashboard'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCreatorDashboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMonetizationConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<MonetizationConfig | null>({
    queryKey: ['monetizationConfig'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonetizationConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMonetizationConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: MonetizationConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveMonetizationConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monetizationConfig'] });
      queryClient.invalidateQueries({ queryKey: ['creatorDashboard'] });
    },
  });
}

// Shoe Marketplace Queries
export function useGetAllShoeProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeProduct[]>({
    queryKey: ['shoeProducts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShoeProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetShoeProduct(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeProduct | null>({
    queryKey: ['shoeProduct', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getShoeProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetShoeProductsByCategory(category: ShoeCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeProduct[]>({
    queryKey: ['shoeProducts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShoeProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchShoeProducts(brand: string, creator: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeProduct[]>({
    queryKey: ['shoeProducts', 'search', brand, creator?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchShoeProducts(brand, creator);
    },
    enabled: !!actor && !isFetching && !!brand,
  });
}

export function useAddShoeProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ShoeProduct) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addShoeProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoeProducts'] });
    },
  });
}

// Shoe Designer Queries
export function useCreateDesignProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDesignProject(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designProjects'] });
    },
  });
}

export function useUploadDesignFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, fileType, blob, thumbnail }: { projectId: string; fileType: DesignFileType; blob: ExternalBlob; thumbnail: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDesignFile(projectId, fileType, blob, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designProjects'] });
    },
  });
}

export function useUpdateDesignCustomization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, customization }: { projectId: string; customization: DesignCustomization }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDesignCustomization(projectId, customization);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designProjects'] });
    },
  });
}

export function useGetDesignProject(projectId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeDesignProject | null>({
    queryKey: ['designProject', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      return actor.getDesignProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useGetUserDesignProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeDesignProject[]>({
    queryKey: ['designProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserDesignProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteDesignProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDesignProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designProjects'] });
    },
  });
}

export function useSaveOLEDSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: OLEDSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveOLEDSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oledSettings'] });
    },
  });
}

export function useGetOLEDSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<OLEDSettings | null>({
    queryKey: ['oledSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOLEDSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Shoe Health Tracker Queries
export function useGetUserShoeHealth() {
  const { actor, isFetching } = useActor();

  return useQuery<ShoeHealth[]>({
    queryKey: ['shoeHealth'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserShoeHealth();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateShoeHealth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shoe: ShoeHealth) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateShoeHealth(shoe);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoeHealth'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// AIR Integration Settings Queries
export function useGetAirIntegrationSettings(nftId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AirIntegrationSettings>({
    queryKey: ['airIntegrationSettings', nftId],
    queryFn: async () => {
      if (!actor || !nftId) {
        return {
          enabledShoeHealth: false,
          enabledShoeMusic: false,
          enabledOledSync: false,
        };
      }
      return actor.getAirIntegrationSettings(nftId);
    },
    enabled: !!actor && !isFetching && !!nftId,
  });
}

export function useUpdateAirIntegrationSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, settings }: { nftId: string; settings: AirIntegrationSettings }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAirIntegrationSettings(nftId, settings);
    },
    onSuccess: (_, { nftId }) => {
      queryClient.invalidateQueries({ queryKey: ['airIntegrationSettings', nftId] });
    },
  });
}
