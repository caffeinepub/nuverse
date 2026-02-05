import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    id: string;
    bio: string;
    username: string;
    avatar?: ExternalBlob;
}
export interface PortfolioContent {
    vrExperiences: Array<VRExperience>;
    nfts: Array<NFT>;
    posts: Array<Post>;
}
export interface NFT {
    id: string;
    owner: Principal;
    metadata: string;
    name: string;
    image: ExternalBlob;
}
export interface OLEDSettings {
    bluetoothPaired: boolean;
    displayMode: string;
    enabled: boolean;
}
export interface FriendRequest {
    id: bigint;
    to: Principal;
    status: RequestStatus;
    from: Principal;
    timestamp: bigint;
}
export interface PublicUserProfile {
    id: string;
    bio: string;
    username: string;
    avatar?: ExternalBlob;
}
export interface ChatThread {
    id: bigint;
    participants: Array<Principal>;
    messages: Array<Message>;
    lastMessage?: Message;
}
export interface Post {
    id: bigint;
    content: string;
    author: Principal;
    audioAttachments: Array<AudioAttachment>;
    image?: ExternalBlob;
}
export interface LiveEvent {
    id: bigint;
    title: string;
    participants: Array<Principal>;
    thumbnail?: ExternalBlob;
    votes: bigint;
    hostName: string;
    host: Principal;
    description: string;
    isActive: boolean;
    participantCount: bigint;
}
export interface AirIntegrationSettings {
    enabledOledSync: boolean;
    enabledShoeHealth: boolean;
    enabledShoeMusic: boolean;
}
export interface ShoeHealth {
    id: string;
    lastMaintained: bigint;
    wear: bigint;
    steps: bigint;
    style: string;
    performance: bigint;
    brand: string;
}
export interface ShoeDesignProject {
    id: string;
    owner: Principal;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    designFiles: Array<DesignFile>;
    customization: DesignCustomization;
}
export interface ShoeProduct {
    id: string;
    creator: Principal;
    style: string;
    details: string;
    category: ShoeCategory;
    brand: string;
    image: ExternalBlob;
    isNFT: boolean;
    price: bigint;
}
export interface DesignCustomization {
    effects: Array<string>;
    patterns: Array<string>;
    textures: Array<string>;
    colors: Array<string>;
}
export interface MonetizationConfig {
    theme: Theme;
    exclusiveContentEnabled: boolean;
    tipsEnabled: boolean;
    nftDropsEnabled: boolean;
    dashboardLayout: DashboardLayout;
}
export interface DashboardLayout {
    analyticsSection: string;
    postSection: string;
    nftSection: string;
    vrSection: string;
}
export interface VRExperience {
    id: string;
    title: string;
    owner: Principal;
    description: string;
}
export interface Notification {
    id: bigint;
    content: string;
    notificationType: NotificationType;
    user: Principal;
    isRead: boolean;
    timestamp: bigint;
}
export interface AudioAttachment {
    id: string;
    title: string;
    duration: bigint;
    usageContext: AudioUsageContext;
    owner: Principal;
    description: string;
    audioFile: ExternalBlob;
    audioType: AudioType;
}
export interface Message {
    id: bigint;
    content: string;
    sender: Principal;
    timestamp: bigint;
}
export interface DashboardMetrics {
    revenue: bigint;
    engagementRate: bigint;
    salesPerformance: bigint;
    followers: bigint;
}
export interface CreatorMonetizationDashboard {
    content: PortfolioContent;
    metrics: DashboardMetrics;
    userProfile: PublicUserProfile;
    config: MonetizationConfig;
}
export interface DesignFile {
    id: string;
    thumbnail?: ExternalBlob;
    blob: ExternalBlob;
    fileType: DesignFileType;
}
export enum AudioType {
    ambient = "ambient",
    music = "music",
    soundEffect = "soundEffect",
    voiceRecording = "voiceRecording",
    other = "other",
    podcast = "podcast",
    audiobook = "audiobook"
}
export enum AudioUsageContext {
    soundEffect = "soundEffect",
    vrExperience = "vrExperience",
    other = "other",
    post = "post",
    narration = "narration",
    xrExperience = "xrExperience",
    ambientSound = "ambientSound",
    backgroundMusic = "backgroundMusic",
    avatar = "avatar"
}
export enum DesignFileType {
    image2D = "image2D",
    model3D = "model3D"
}
export enum NotificationType {
    liveEvent = "liveEvent",
    like = "like",
    shoeHealthAlert = "shoeHealthAlert",
    comment = "comment",
    nftDrop = "nftDrop"
}
export enum RequestStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum ShoeCategory {
    sneakers = "sneakers",
    customDesigns = "customDesigns",
    sportsShoes = "sportsShoes"
}
export enum Theme {
    dark = "dark",
    neon = "neon",
    light = "light"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptFriendRequest(requestId: bigint): Promise<void>;
    addOrUpdateShoeHealth(shoe: ShoeHealth): Promise<void>;
    addShoeProduct(product: ShoeProduct): Promise<void>;
    addShoeStock(id: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatThread(participants: Array<Principal>): Promise<bigint>;
    createDesignProject(name: string): Promise<string>;
    createLiveEvent(title: string, hostName: string, description: string, thumbnail: ExternalBlob | null): Promise<bigint>;
    createNFT(nft: NFT): Promise<void>;
    createPost(content: string, image: ExternalBlob | null): Promise<bigint>;
    createPostWithAudio(content: string, image: ExternalBlob | null, audioIds: Array<string>): Promise<bigint>;
    deleteAudioAttachment(id: string): Promise<void>;
    deleteDesignProject(projectId: string): Promise<void>;
    followUser(user: Principal): Promise<void>;
    getAirIntegrationSettings(nftId: string): Promise<AirIntegrationSettings>;
    getAllAudioAttachments(): Promise<Array<AudioAttachment>>;
    getAllPostsAudioIds(): Promise<Array<[bigint, Array<string>]>>;
    getAllShoeProducts(): Promise<Array<ShoeProduct>>;
    getAudioAttachment(id: string): Promise<AudioAttachment | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatThreads(): Promise<Array<ChatThread>>;
    getCreatorDashboard(): Promise<CreatorMonetizationDashboard | null>;
    getDesignProject(projectId: string): Promise<ShoeDesignProject | null>;
    getFollowerCount(user: Principal): Promise<bigint>;
    getFollowers(user: Principal): Promise<Array<Principal>>;
    getFriendRequests(): Promise<Array<FriendRequest>>;
    getLiveEvents(): Promise<Array<LiveEvent>>;
    getMonetizationConfig(): Promise<MonetizationConfig | null>;
    getNotifications(): Promise<Array<Notification>>;
    getOLEDSettings(): Promise<OLEDSettings | null>;
    getPostAudioIds(postId: bigint): Promise<Array<string>>;
    getPosts(): Promise<Array<Post>>;
    getShoeProduct(id: string): Promise<ShoeProduct | null>;
    getShoeProductsByCategory(category: ShoeCategory): Promise<Array<ShoeProduct>>;
    getShoeStockCount(id: string): Promise<bigint>;
    getUserDesignProjects(): Promise<Array<ShoeDesignProject>>;
    getUserNFTs(user: Principal): Promise<Array<NFT>>;
    getUserPosts(user: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserShoeHealth(): Promise<Array<ShoeHealth>>;
    isCallerAdmin(): Promise<boolean>;
    joinLiveEvent(eventId: bigint): Promise<void>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    rejectFriendRequest(requestId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMonetizationConfig(config: MonetizationConfig): Promise<void>;
    saveOLEDSettings(settings: OLEDSettings): Promise<void>;
    searchShoeProducts(brand: string, creator: Principal | null): Promise<Array<ShoeProduct>>;
    sendFriendRequest(to: Principal): Promise<void>;
    sendMessage(threadId: bigint, content: string): Promise<void>;
    unfollowUser(user: Principal): Promise<void>;
    updateAirIntegrationSettings(nftId: string, settings: AirIntegrationSettings): Promise<void>;
    updateDesignCustomization(projectId: string, customization: DesignCustomization): Promise<void>;
    uploadAudioAttachment(audio: AudioAttachment): Promise<void>;
    uploadDesignFile(projectId: string, fileType: DesignFileType, blob: ExternalBlob, thumbnail: ExternalBlob | null): Promise<void>;
}
