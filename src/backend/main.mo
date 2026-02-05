import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type NFT = {
    id : Text;
    name : Text;
    metadata : Text;
    owner : Principal;
    image : Storage.ExternalBlob;
  };

  type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    image : ?Storage.ExternalBlob;
    audioAttachments : [AudioAttachment];
  };

  type VRExperience = {
    id : Text;
    title : Text;
    description : Text;
    owner : Principal;
  };

  type FollowerStatus = {
    #following;
    #notFollowing;
  };

  type Message = {
    id : Nat;
    sender : Principal;
    content : Text;
    timestamp : Int;
  };

  type ChatThread = {
    id : Nat;
    participants : [Principal];
    messages : [Message];
    lastMessage : ?Message;
  };

  type FriendRequest = {
    id : Nat;
    from : Principal;
    to : Principal;
    status : RequestStatus;
    timestamp : Int;
  };

  type RequestStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  type NotificationType = {
    #like;
    #comment;
    #liveEvent;
    #nftDrop;
    #shoeHealthAlert;
  };

  type Notification = {
    id : Nat;
    user : Principal;
    notificationType : NotificationType;
    content : Text;
    timestamp : Int;
    isRead : Bool;
  };

  public type ShoeHealth = {
    id : Text;
    brand : Text;
    style : Text;
    wear : Nat;
    steps : Nat;
    performance : Nat;
    lastMaintained : Nat;
  };

  public type LiveEvent = {
    id : Nat;
    title : Text;
    host : Principal;
    hostName : Text;
    description : Text;
    participants : [Principal];
    participantCount : Nat;
    votes : Nat;
    thumbnail : ?Storage.ExternalBlob;
    isActive : Bool;
  };

  var nextLiveEventId = 0;
  let liveEvents = Map.empty<Nat, LiveEvent>();
  var posts = List.empty<Post>();
  let chatThreads = Map.empty<Nat, ChatThread>();
  let friendRequests = Map.empty<Nat, FriendRequest>();

  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type UserProfile = {
    id : Text;
    username : Text;
    avatar : ?Storage.ExternalBlob;
    bio : Text;
  };

  public type Theme = {
    #light;
    #dark;
    #neon;
  };

  public type MonetizationConfig = {
    tipsEnabled : Bool;
    exclusiveContentEnabled : Bool;
    nftDropsEnabled : Bool;
    dashboardLayout : DashboardLayout;
    theme : Theme;
  };

  public type DashboardLayout = {
    postSection : Text;
    nftSection : Text;
    analyticsSection : Text;
    vrSection : Text;
  };

  public type DashboardMetrics = {
    followers : Nat;
    engagementRate : Nat;
    revenue : Nat;
    salesPerformance : Nat;
  };

  public type PortfolioContent = {
    posts : [Post];
    nfts : [NFT];
    vrExperiences : [VRExperience];
  };

  public type PublicUserProfile = {
    id : Text;
    username : Text;
    avatar : ?Storage.ExternalBlob;
    bio : Text;
  };

  public type PublicProfileWithMonetization = {
    id : Text;
    username : Text;
    avatar : ?Storage.ExternalBlob;
    bio : Text;
    hasMonetization : Bool;
  };

  public type CreatorMonetizationDashboard = {
    userProfile : PublicUserProfile;
    config : MonetizationConfig;
    metrics : DashboardMetrics;
    content : PortfolioContent;
  };

  type ShoeProduct = {
    id : Text;
    brand : Text;
    creator : Principal;
    style : Text;
    category : ShoeCategory;
    price : Nat;
    isNFT : Bool;
    image : Storage.ExternalBlob;
    details : Text;
  };

  type ShoeCategory = {
    #sneakers;
    #sportsShoes;
    #customDesigns;
  };

  type DesignFileType = {
    #image2D;
    #model3D;
  };

  type ShoeDesignProject = {
    id : Text;
    owner : Principal;
    name : Text;
    designFiles : [DesignFile];
    customization : DesignCustomization;
    createdAt : Int;
    updatedAt : Int;
  };

  type DesignFile = {
    id : Text;
    fileType : DesignFileType;
    blob : Storage.ExternalBlob;
    thumbnail : ?Storage.ExternalBlob;
  };

  type DesignCustomization = {
    colors : [Text];
    textures : [Text];
    patterns : [Text];
    effects : [Text];
  };

  type OLEDSettings = {
    enabled : Bool;
    bluetoothPaired : Bool;
    displayMode : Text;
  };

  let nfts = Map.empty<Text, NFT>();
  let vrExperiences = Map.empty<Text, VRExperience>();
  let followers = Map.empty<Principal, List.List<Principal>>();
  var nextPostId = 0;
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextThreadId = 0;
  var nextRequestId = 0;
  let notifications = Map.empty<Nat, Notification>();
  var nextNotificationId = 0;
  let monetizationConfigs = Map.empty<Principal, MonetizationConfig>();
  let shoeProducts = Map.empty<Text, ShoeProduct>();
  let shoeDesignProjects = Map.empty<Text, ShoeDesignProject>();
  let oledSettings = Map.empty<Principal, OLEDSettings>();
  let shoeSpecifications = Map.empty<Text, ShoeSpecification>();

  type ShoeSpecification = {
    brand : Text;
    model : Text;
    category : Text;
    color : Text;
    size : Float;
    features : [Text];
  };

  // NEW FIELDS FOR SHOE HEALTH
  let shoeHealth = Map.empty<Principal, List.List<ShoeHealth>>();

  // NEW AUDIO ATTACHMENT TYPES
  public type AudioType = {
    #music;
    #soundEffect;
    #voiceRecording;
    #podcast;
    #audiobook;
    #ambient;
    #other;
  };

  public type AudioAttachment = {
    id : Text;
    owner : Principal;
    audioFile : Storage.ExternalBlob;
    title : Text;
    description : Text;
    duration : Nat;
    audioType : AudioType;
    usageContext : AudioUsageContext;
  };

  public type AudioUsageContext = {
    #post;
    #avatar;
    #vrExperience;
    #xrExperience;
    #backgroundMusic;
    #ambientSound;
    #soundEffect;
    #narration;
    #other;
  };

  // Audio attachment store
  let audioAttachments = Map.empty<Text, AudioAttachment>();

  // AIR INTEGRATION SETTINGS
  public type AirIntegrationSettings = {
    enabledShoeHealth : Bool;
    enabledShoeMusic : Bool;
    enabledOledSync : Bool;
  };

  let airIntegrationSettings = Map.empty<Text, AirIntegrationSettings>();

  // Legacy code
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // AIR INTEGRATION FUNCTIONS
  public query ({ caller }) func getAirIntegrationSettings(nftId : Text) : async AirIntegrationSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view AIR integration settings");
    };

    let nft = nfts.get(nftId);
    switch (nft) {
      case (null) {
        Runtime.trap("NFT not found");
      };
      case (?n) {
        if (not Principal.equal(caller, n.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the NFT owner or admin can view AIR integration settings");
        };

        let settings = airIntegrationSettings.get(nftId);
        switch (settings) {
          case (null) {
            {
              enabledShoeHealth = false;
              enabledShoeMusic = false;
              enabledOledSync = false;
            };
          };
          case (?s) { s };
        };
      };
    };
  };

  public shared ({ caller }) func updateAirIntegrationSettings(nftId : Text, settings : AirIntegrationSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update AIR integration settings");
    };

    let nft = nfts.get(nftId);
    switch (nft) {
      case (null) {
        Runtime.trap("NFT not found");
      };
      case (?n) {
        if (not Principal.equal(caller, n.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the NFT owner or admin can update AIR integration settings");
        };

        airIntegrationSettings.add(nftId, settings);
      };
    };
  };

  // --- AUDIO ATTACHMENT FUNCTIONS --- //

  public shared ({ caller }) func uploadAudioAttachment(audio : AudioAttachment) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload audio attachments");
    };

    // Verify ownership: caller must be the owner
    if (not Principal.equal(caller, audio.owner)) {
      Runtime.trap("Unauthorized: You can only upload audio as yourself");
    };

    // Check if audio ID already exists
    let existing = audioAttachments.get(audio.id);
    switch (existing) {
      case (?existingAudio) {
        // Only allow overwrite if caller owns the existing audio or is admin
        if (not Principal.equal(caller, existingAudio.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Audio ID already exists and is owned by another user");
        };
      };
      case (null) {};
    };

    audioAttachments.add(audio.id, audio);
  };

  public query ({ caller }) func getAudioAttachment(id : Text) : async ?AudioAttachment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access audio");
    };
    audioAttachments.get(id);
  };

  public query ({ caller }) func getAllAudioAttachments() : async [AudioAttachment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access audio files");
    };
    audioAttachments.values().toArray();
  };

  public shared ({ caller }) func deleteAudioAttachment(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete audio attachments");
    };

    let audio = audioAttachments.get(id);
    switch (audio) {
      case (null) {
        Runtime.trap("Audio attachment not found");
      };
      case (?a) {
        // Only owner or admin can delete
        if (not Principal.equal(caller, a.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only delete your own audio attachments");
        };
        audioAttachments.remove(id);
      };
    };
  };

  // --- POST CREATION WITH AUDIO --- //

  public shared ({ caller }) func createPostWithAudio(content : Text, image : ?Storage.ExternalBlob, audioIds : [Text]) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let filteredAudioIds = await filterExistingAudioAttachments(audioIds);

    let post : Post = {
      id = postId;
      author = caller;
      content = content;
      image = image;
      audioAttachments = filteredAudioIds;
    };

    posts.add(post);
    postId;
  };

  func filterExistingAudioAttachments(audioIds : [Text]) : async [AudioAttachment] {
    let validAttachments = List.empty<AudioAttachment>();
    for (id in audioIds.values()) {
      let audio = audioAttachments.get(id);
      switch (audio) {
        case (?a) {
          validAttachments.add(a);
        };
        case (null) {};
      };
    };
    validAttachments.toArray();
  };

  // New query to fetch all audio IDs for a post
  public query ({ caller }) func getPostAudioIds(postId : Nat) : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access posts");
    };

    let foundIndex = posts.toArray().findIndex(func(post) { post.id == postId });
    switch (foundIndex) {
      case (?index) {
        let postsArray = posts.toArray();
        if (index < postsArray.size()) {
          let p = postsArray[index];
          let audioIds = p.audioAttachments.map(func(attachment) { attachment.id });
          return audioIds;
        };
      };
      case (null) {};
    };
    [];
  };

  // New query to fetch audio IDs for all posts
  public query ({ caller }) func getAllPostsAudioIds() : async [(Nat, [Text])] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access posts");
    };

    posts.toArray().map(func(p) { (p.id, p.audioAttachments.map(func(attachment) { attachment.id })) });
  };

  // Shoe Marketplace Functions
  public shared ({ caller }) func addShoeProduct(product : ShoeProduct) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add products");
    };

    if (not Principal.equal(caller, product.creator)) {
      Runtime.trap("Unauthorized: You can only add products as yourself");
    };

    shoeProducts.add(product.id, product);
  };

  public query ({ caller }) func getShoeProduct(id : Text) : async ?ShoeProduct {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    shoeProducts.get(id);
  };

  public query ({ caller }) func getAllShoeProducts() : async [ShoeProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    shoeProducts.values().toArray();
  };

  public query ({ caller }) func getShoeProductsByCategory(category : ShoeCategory) : async [ShoeProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view products");
    };
    shoeProducts.values().toArray().filter(func(product) { product.category == category });
  };

  public query ({ caller }) func searchShoeProducts(brand : Text, creator : ?Principal) : async [ShoeProduct] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search products");
    };

    let allProducts = shoeProducts.values().toArray();
    allProducts.filter(
      func(product) {
        let brandMatches = Text.equal(product.brand, brand);
        let creatorMatches = switch (creator) {
          case (null) { true };
          case (?c) { Principal.equal(product.creator, c) };
        };
        brandMatches and creatorMatches;
      }
    );
  };

  public query ({ caller }) func getShoeStockCount(id : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view stock");
    };
    0;
  };

  public shared ({ caller }) func addShoeStock(id : Text, quantity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add stock");
    };

    let product = shoeProducts.get(id);
    switch (product) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?p) {
        if (not Principal.equal(caller, p.creator) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only product creator or admin can add stock");
        };
      };
    };
  };

  // Shoe Designer Functions
  public shared ({ caller }) func createDesignProject(name : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create design projects");
    };

    let projectId = caller.toText() # "-" # Time.now().toText();

    let project : ShoeDesignProject = {
      id = projectId;
      owner = caller;
      name = name;
      designFiles = [];
      customization = {
        colors = [];
        textures = [];
        patterns = [];
        effects = [];
      };
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    shoeDesignProjects.add(projectId, project);
    projectId;
  };

  public shared ({ caller }) func uploadDesignFile(projectId : Text, fileType : DesignFileType, blob : Storage.ExternalBlob, thumbnail : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload design files");
    };

    let project = shoeDesignProjects.get(projectId);
    switch (project) {
      case (null) {
        Runtime.trap("Design project not found");
      };
      case (?p) {
        if (not Principal.equal(caller, p.owner)) {
          Runtime.trap("Unauthorized: You can only upload files to your own projects");
        };

        let fileId = projectId # "-file-" # Time.now().toText();
        let newFile : DesignFile = {
          id = fileId;
          fileType = fileType;
          blob = blob;
          thumbnail = thumbnail;
        };

        let updatedProject : ShoeDesignProject = {
          id = p.id;
          owner = p.owner;
          name = p.name;
          designFiles = p.designFiles.concat([newFile]);
          customization = p.customization;
          createdAt = p.createdAt;
          updatedAt = Time.now();
        };

        shoeDesignProjects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func updateDesignCustomization(projectId : Text, customization : DesignCustomization) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update design customization");
    };

    let project = shoeDesignProjects.get(projectId);
    switch (project) {
      case (null) {
        Runtime.trap("Design project not found");
      };
      case (?p) {
        if (not Principal.equal(caller, p.owner)) {
          Runtime.trap("Unauthorized: You can only update your own projects");
        };

        let updatedProject : ShoeDesignProject = {
          id = p.id;
          owner = p.owner;
          name = p.name;
          designFiles = p.designFiles;
          customization = customization;
          createdAt = p.createdAt;
          updatedAt = Time.now();
        };

        shoeDesignProjects.add(projectId, updatedProject);
      };
    };
  };

  public query ({ caller }) func getDesignProject(projectId : Text) : async ?ShoeDesignProject {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view design projects");
    };

    let project = shoeDesignProjects.get(projectId);
    switch (project) {
      case (null) { null };
      case (?p) {
        if (not Principal.equal(caller, p.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own design projects");
        };
        ?p;
      };
    };
  };

  public query ({ caller }) func getUserDesignProjects() : async [ShoeDesignProject] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view design projects");
    };

    shoeDesignProjects.values().toArray().filter(
      func(project) {
        Principal.equal(project.owner, caller);
      }
    );
  };

  public shared ({ caller }) func deleteDesignProject(projectId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete design projects");
    };

    let project = shoeDesignProjects.get(projectId);
    switch (project) {
      case (null) {
        Runtime.trap("Design project not found");
      };
      case (?p) {
        if (not Principal.equal(caller, p.owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only delete your own projects");
        };

        shoeDesignProjects.remove(projectId);
      };
    };
  };

  public shared ({ caller }) func saveOLEDSettings(settings : OLEDSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save OLED settings");
    };

    oledSettings.add(caller, settings);
  };

  public query ({ caller }) func getOLEDSettings() : async ?OLEDSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view OLED settings");
    };

    oledSettings.get(caller);
  };

  public query ({ caller }) func getUserNFTs(user : Principal) : async [NFT] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view NFTs");
    };

    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own NFTs");
    };

    nfts.values().toArray().filter(func(nft) { Principal.equal(nft.owner, user) });
  };

  public shared ({ caller }) func createNFT(nft : NFT) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create NFTs");
    };

    if (not Principal.equal(caller, nft.owner)) {
      Runtime.trap("Unauthorized: Can only create NFTs for yourself");
    };

    nfts.add(nft.id, nft);
  };

  public shared ({ caller }) func createPost(content : Text, image : ?Storage.ExternalBlob) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let post : Post = {
      id = postId;
      author = caller;
      content = content;
      image = image;
      audioAttachments = [];
    };

    posts.add(post);
    postId;
  };

  public query ({ caller }) func getPosts() : async [Post] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.toArray();
  };

  public query ({ caller }) func getUserPosts(user : Principal) : async [Post] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.toArray().filter(func(post) { Principal.equal(post.author, user) });
  };

  public shared ({ caller }) func followUser(user : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };

    if (Principal.equal(caller, user)) {
      Runtime.trap("Cannot follow yourself");
    };

    let currentFollowers = followers.get(user).get(List.empty<Principal>());

    let alreadyFollowing = currentFollowers.toArray().find(func(p : Principal) : Bool { Principal.equal(p, caller) });
    switch (alreadyFollowing) {
      case (null) {};
      case (nonNull) {
        Runtime.trap("Already following this user");
      };
    };

    currentFollowers.add(caller);
    followers.add(user, currentFollowers);
  };

  public shared ({ caller }) func unfollowUser(user : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };

    let currentFollowers = followers.get(user).get(List.empty<Principal>());
    let updatedFollowers = currentFollowers.filter(func(p : Principal) : Bool { not Principal.equal(p, caller) });
    followers.add(user, updatedFollowers);
  };

  public query ({ caller }) func getFollowers(user : Principal) : async [Principal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view followers");
    };

    let followerList = followers.get(user).get(List.empty<Principal>());
    followerList.toArray();
  };

  public query ({ caller }) func getFollowerCount(user : Principal) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view follower count");
    };

    let followerList = followers.get(user).get(List.empty<Principal>());
    followerList.size();
  };

  public shared ({ caller }) func createChatThread(participants : [Principal]) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat threads");
    };

    let callerInParticipants = participants.find(func(p : Principal) : Bool { Principal.equal(p, caller) });
    if (callerInParticipants == null) {
      Runtime.trap("Unauthorized: You must be a participant in the chat");
    };

    let threadId = nextThreadId;
    nextThreadId += 1;

    let thread : ChatThread = {
      id = threadId;
      participants = participants;
      messages = [];
      lastMessage = null;
    };

    chatThreads.add(threadId, thread);
    threadId;
  };

  public shared ({ caller }) func sendMessage(threadId : Nat, content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let thread = chatThreads.get(threadId);
    switch (thread) {
      case (null) {
        Runtime.trap("Chat thread not found");
      };
      case (?t) {
        let isParticipant = t.participants.find(func(p : Principal) : Bool { Principal.equal(p, caller) });
        if (isParticipant == null) {
          Runtime.trap("Unauthorized: You are not a participant in this chat");
        };

        let message : Message = {
          id = t.messages.size();
          sender = caller;
          content = content;
          timestamp = Time.now();
        };

        let updatedMessages = t.messages.concat([message]);
        let updatedThread : ChatThread = {
          id = t.id;
          participants = t.participants;
          messages = updatedMessages;
          lastMessage = ?message;
        };

        chatThreads.add(threadId, updatedThread);
      };
    };
  };

  public query ({ caller }) func getChatThreads() : async [ChatThread] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat threads");
    };

    chatThreads.values().toArray().filter(
      func(thread) {
        let isParticipant = thread.participants.find(func(p : Principal) : Bool { Principal.equal(p, caller) });
        isParticipant != null;
      }
    );
  };

  public shared ({ caller }) func sendFriendRequest(to : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send friend requests");
    };

    if (Principal.equal(caller, to)) {
      Runtime.trap("Cannot send friend request to yourself");
    };

    let requestId = nextRequestId;
    nextRequestId += 1;

    let request : FriendRequest = {
      id = requestId;
      from = caller;
      to = to;
      status = #pending;
      timestamp = Time.now();
    };

    friendRequests.add(requestId, request);
  };

  public shared ({ caller }) func acceptFriendRequest(requestId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can accept friend requests");
    };

    let request = friendRequests.get(requestId);
    switch (request) {
      case (null) {
        Runtime.trap("Friend request not found");
      };
      case (?r) {
        if (not Principal.equal(caller, r.to)) {
          Runtime.trap("Unauthorized: You can only accept requests sent to you");
        };

        let updatedRequest : FriendRequest = {
          id = r.id;
          from = r.from;
          to = r.to;
          status = #accepted;
          timestamp = r.timestamp;
        };

        friendRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectFriendRequest(requestId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can reject friend requests");
    };

    let request = friendRequests.get(requestId);
    switch (request) {
      case (null) {
        Runtime.trap("Friend request not found");
      };
      case (?r) {
        if (not Principal.equal(caller, r.to)) {
          Runtime.trap("Unauthorized: You can only reject requests sent to you");
        };

        let updatedRequest : FriendRequest = {
          id = r.id;
          from = r.from;
          to = r.to;
          status = #rejected;
          timestamp = r.timestamp;
        };

        friendRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getFriendRequests() : async [FriendRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view friend requests");
    };

    friendRequests.values().toArray().filter(
      func(request) {
        Principal.equal(request.to, caller) and request.status == #pending;
      }
    );
  };

  // Internal function to create notifications (used by system logic)
  func createNotificationInternal(user : Principal, notificationType : NotificationType, content : Text) {
    let notificationId = nextNotificationId;
    nextNotificationId += 1;

    let notification : Notification = {
      id = notificationId;
      user = user;
      notificationType = notificationType;
      content = content;
      timestamp = Time.now();
      isRead = false;
    };

    notifications.add(notificationId, notification);
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    notifications.values().toArray().filter(
      func(notification) {
        Principal.equal(notification.user, caller);
      }
    );
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    let notification = notifications.get(notificationId);
    switch (notification) {
      case (null) {
        Runtime.trap("Notification not found");
      };
      case (?n) {
        if (not Principal.equal(caller, n.user)) {
          Runtime.trap("Unauthorized: You can only mark your own notifications as read");
        };

        let updatedNotification : Notification = {
          id = n.id;
          user = n.user;
          notificationType = n.notificationType;
          content = n.content;
          timestamp = n.timestamp;
          isRead = true;
        };

        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public shared ({ caller }) func createLiveEvent(title : Text, hostName : Text, description : Text, thumbnail : ?Storage.ExternalBlob) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create live events");
    };

    let eventId = nextLiveEventId;
    nextLiveEventId += 1;

    let event : LiveEvent = {
      id = eventId;
      title = title;
      host = caller;
      hostName = hostName;
      description = description;
      participants = [];
      participantCount = 0;
      votes = 0;
      thumbnail = thumbnail;
      isActive = true;
    };

    liveEvents.add(eventId, event);
    eventId;
  };

  public query ({ caller }) func getLiveEvents() : async [LiveEvent] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view live events");
    };
    liveEvents.values().toArray();
  };

  public shared ({ caller }) func joinLiveEvent(eventId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can join live events");
    };

    let event = liveEvents.get(eventId);
    switch (event) {
      case (null) {
        Runtime.trap("Live event not found");
      };
      case (?e) {
        let alreadyParticipant = e.participants.find(func(p : Principal) : Bool { Principal.equal(p, caller) });
        if (alreadyParticipant != null) {
          Runtime.trap("Already participating in this event");
        };

        let updatedEvent : LiveEvent = {
          id = e.id;
          title = e.title;
          host = e.host;
          hostName = e.hostName;
          description = e.description;
          participants = e.participants.concat([caller]);
          participantCount = e.participantCount + 1;
          votes = e.votes;
          thumbnail = e.thumbnail;
          isActive = e.isActive;
        };

        liveEvents.add(eventId, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func saveMonetizationConfig(config : MonetizationConfig) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save monetization config");
    };
    monetizationConfigs.add(caller, config);
  };

  public query ({ caller }) func getMonetizationConfig() : async ?MonetizationConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view monetization config");
    };
    monetizationConfigs.get(caller);
  };

  public query ({ caller }) func getCreatorDashboard() : async ?CreatorMonetizationDashboard {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view creator dashboard");
    };

    let profile = userProfiles.get(caller);
    switch (profile) {
      case (null) { null };
      case (?p) {
        let config = monetizationConfigs.get(caller).get({
          tipsEnabled = false;
          exclusiveContentEnabled = false;
          nftDropsEnabled = false;
          dashboardLayout = {
            postSection = "top-left";
            nftSection = "top-right";
            analyticsSection = "bottom-left";
            vrSection = "bottom-right";
          };
          theme = #neon;
        });

        let followerCount = followers.get(caller).get(List.empty<Principal>()).size();

        let metrics : DashboardMetrics = {
          followers = followerCount;
          engagementRate = 0;
          revenue = 0;
          salesPerformance = 0;
        };

        let content = getPortfolioContent(caller);

        ?{
          userProfile = {
            id = p.id;
            username = p.username;
            avatar = p.avatar;
            bio = p.bio;
          };
          config = config;
          metrics = metrics;
          content = content;
        };
      };
    };
  };

  func getPortfolioContent(user : Principal) : PortfolioContent {
    {
      posts = posts.toArray().filter(func(post) { Principal.equal(post.author, user) });
      nfts = nfts.values().toArray().filter(func(nft) { Principal.equal(nft.owner, user) });
      vrExperiences = vrExperiences.values().toArray().filter(func(vrExp) { Principal.equal(vrExp.owner, user) });
    };
  };

  // Shoe Health Functions
  public shared ({ caller }) func addOrUpdateShoeHealth(shoe : ShoeHealth) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add/update shoe health");
    };

    let currentShoes = shoeHealth.get(caller).get(List.empty<ShoeHealth>());
    let updatedShoes = currentShoes.filter(func(s) { s.id != shoe.id });
    updatedShoes.add(shoe);
    shoeHealth.add(caller, updatedShoes);

    // Check thresholds and create notifications if needed
    checkShoeHealthThresholds(caller, shoe);
  };

  public query ({ caller }) func getUserShoeHealth() : async [ShoeHealth] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view shoe health");
    };
    shoeHealth.get(caller).get(List.empty<ShoeHealth>()).toArray();
  };

  // Internal function to check shoe health thresholds and create notifications
  func checkShoeHealthThresholds(user : Principal, shoe : ShoeHealth) {
    // High wear threshold (e.g., > 80%)
    if (shoe.wear > 80) {
      createNotificationInternal(
        user,
        #shoeHealthAlert,
        "High wear detected on " # shoe.brand # " " # shoe.style # ". Consider replacement."
      );
    };

    // Low performance threshold (e.g., < 30%)
    if (shoe.performance < 30) {
      createNotificationInternal(
        user,
        #shoeHealthAlert,
        "Low performance on " # shoe.brand # " " # shoe.style # ". Maintenance recommended."
      );
    };

    // Maintenance due (e.g., > 90 days since last maintenance)
    let daysSinceMaintenance = (Time.now() - shoe.lastMaintained) / (24 * 60 * 60 * 1000000000);
    if (daysSinceMaintenance > 90) {
      createNotificationInternal(
        user,
        #shoeHealthAlert,
        "Maintenance due for " # shoe.brand # " " # shoe.style # "."
      );
    };
  };
};
