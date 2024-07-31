import { ReactElement } from 'react';
import type {
  ApiBotInlineMediaResult,
  ApiBotInlineResult,
  ApiBotInlineSwitchPm,
  ApiBotInlineSwitchWebview,
  ApiChatInviteImporter,
  ApiExportedInvite,
  ApiLanguage,
  ApiMessage,
  ApiReaction,
  ApiStickerSet,
} from '../api/types';

// Compatibility with JSX types
export type TeactNode = ReactElement | string | number | boolean | TeactNode[];

export type TextPart = TeactNode;

export enum LoadMoreDirection {
  Backwards,
  Forwards,
  Around,
}

export enum EGender {
  man = 'Man',
  woman = 'Woman',
  'non-binary' = 'Non binary',
  'prefer_not_to_say' = 'Prefer not to say',
}

export enum EVisibility {
  everybody = 'Everybody',
  contacts = 'Contacts',
  nobody = 'Nobody',
}

export enum EVisibilityGroup {
  everybody = 'Everybody',
  contacts = 'Contacts',
}

export enum ECategoryChannel {
  nonprofit = 'Nonprofit & Activism',
  music = 'Music',
  podcasts = 'Podcasts',
  film = 'Film',
  animation = 'Animation',
  autos = 'Autos',
  vehicles = 'Vehicles',
  pets = 'Home pets',
  animals = 'Animals',
  sports = 'Sports',
  travel = 'Travel',
  gaming = 'Gaming',
  people = 'People & Blogs',
  masterclass = 'Masterclass',
  comedy = 'Comedy',
  health = 'Health & Beauty',
  entertainment = 'Entertainment',
  news = 'News & Politics',
  style = 'How to & Style',
  fashion = 'Fashion',
  education = 'Education',
  science = 'Science & Technology',
}

export enum FocusDirection {
  Up,
  Down,
  Static,
}

export enum ConfirmEmailType {
  empty,
  forgotPassword,
  changePassword,
  confirmEmail,
  confirmAuth,
  confirmUnauthorized,
  confirmChangeEmail,
  DeleteAccount,
  confirmWithdrawal,
}

export interface IAlbum {
  albumId: string;
  messages: ApiMessage[];
  mainMessage: ApiMessage;
}

export type ThreadId = string | number;

export type ThemeKey = 'light' | 'dark';
export type AnimationLevel = 0 | 1 | 2;
export type PerformanceTypeKey =
  | 'pageTransitions'
  | 'messageSendingAnimations'
  | 'mediaViewerAnimations'
  | 'messageComposerAnimations'
  | 'contextMenuAnimations'
  | 'contextMenuBlur'
  | 'rightColumnAnimations'
  | 'animatedEmoji'
  | 'loopAnimatedStickers'
  | 'reactionEffects'
  | 'stickerEffects'
  | 'autoplayGifs'
  | 'autoplayVideos';
export type PerformanceType = {
  [key in PerformanceTypeKey]: boolean;
};

export interface IThemeSettings {
  background?: string;
  backgroundColor?: string;
  patternColor?: string;
  isBlurred?: boolean;
  backgroundFeed?: string;
}

export type NotifySettings = {
  hasPrivateChatsNotifications?: boolean;
  hasPrivateChatsMessagePreview?: boolean;
  hasGroupNotifications?: boolean;
  hasGroupMessagePreview?: boolean;
  hasBroadcastNotifications?: boolean;
  hasBroadcastMessagePreview?: boolean;
  hasContactJoinedNotifications?: boolean;
  hasWebNotifications: boolean;
  hasPushNotifications: boolean;
  notificationSoundVolume: number;
};

export type LangCode =
  | 'en'
  | 'ar'
  | 'be'
  | 'ca'
  | 'nl'
  | 'fr'
  | 'de'
  | 'id'
  | 'it'
  | 'ko'
  | 'ms'
  | 'fa'
  | 'pl'
  | 'pt-br'
  | 'ru'
  | 'es'
  | 'tr'
  | 'uk'
  | 'uz';

export type TimeFormat = '24h' | '12h';

export interface ISettings extends NotifySettings, Record<string, any> {
  theme: ThemeKey;
  shouldUseSystemTheme: boolean;
  messageTextSize: number;
  animationLevel: AnimationLevel;
  messageSendKeyCombo: 'enter' | 'ctrl-enter';
  canAutoLoadPhotoFromContacts: boolean;
  canAutoLoadPhotoInPrivateChats: boolean;
  canAutoLoadPhotoInGroups: boolean;
  canAutoLoadPhotoInChannels: boolean;
  canAutoLoadVideoFromContacts: boolean;
  canAutoLoadVideoInPrivateChats: boolean;
  canAutoLoadVideoInGroups: boolean;
  canAutoLoadVideoInChannels: boolean;
  canAutoLoadFileFromContacts: boolean;
  canAutoLoadFileInPrivateChats: boolean;
  canAutoLoadFileInGroups: boolean;
  canAutoLoadFileInChannels: boolean;
  autoLoadFileMaxSizeMb: number;
  shouldSuggestStickers: boolean;
  shouldSuggestCustomEmoji: boolean;
  shouldUpdateStickerSetOrder: boolean;
  hasPassword?: boolean;
  languages?: ApiLanguage[];
  language: LangCode;
  isSensitiveEnabled?: boolean;
  canChangeSensitive?: boolean;
  timeFormat: TimeFormat;
  wasTimeFormatSetManually: boolean;
  isConnectionStatusMinimized: boolean;
  shouldArchiveAndMuteNewNonContact?: boolean;
  canTranslate: boolean;
  doNotTranslate: string[];
  canDisplayChatInTitle: boolean;
  shouldShowLoginCodeInChatList?: boolean;
}
export interface ApiPrivacySettings {
  visibility: PrivacyVisibility;
  allowUserIds: string[];
  allowChatIds: string[];
  blockUserIds: string[];
  blockChatIds: string[];
}

export interface InputPrivacyContact {
  id: string;
  accessHash?: string;
}

export interface InputPrivacyRules {
  visibility: PrivacyVisibility;
  allowedUsers?: InputPrivacyContact[];
  allowedChats?: InputPrivacyContact[];
  blockedUsers?: InputPrivacyContact[];
  blockedChats?: InputPrivacyContact[];
}

export type IAnchorPosition = {
  x: number;
  y: number;
};

export interface ShippingOption {
  id: string;
  title: string;
  amount: number;
  prices: Price[];
}

export interface Price {
  label: string;
  amount: number;
}

export interface ApiInvoiceContainer {
  isTest?: boolean;
  isNameRequested?: boolean;
  isPhoneRequested?: boolean;
  isEmailRequested?: boolean;
  isShippingAddressRequested?: boolean;
  isFlexible?: boolean;
  shouldSendPhoneToProvider?: boolean;
  shouldSendEmailToProvider?: boolean;
  currency?: string;
  prices?: Price[];
}

export enum WalletScreens {
  Main,
  Welcome,
}

export enum SettingsScreens {
  Main,
  EditProfile,
  Notifications,
  DataStorage,
  Language,
  ActiveSessions,
  General,
  GeneralChatBackground,
  GeneralChatTheme,
  GeneralChatBackgroundColor,
  Privacy,
  PrivacyBlockedUsers,
  Folders,
  FoldersCreateFolder,
  FoldersEditFolder,
  FoldersEditFolderFromChatList,
  FoldersIncludedChats,
  FoldersIncludedChatsFromChatList,
  FoldersExcludedChats,
  FoldersExcludedChatsFromChatList,
  TwoFaDisabled,
  DeleteUserInfo,
  BeforeDeletingUser,
  TwoFaNewPasswordConfirm,
  TwoFaNewPasswordHint,
  TwoFaNewPasswordEmail,
  TwoFaNewPasswordEmailCode,
  TwoFaEnabled,
  TwoFaChangePasswordCurrent,
  TwoFaChangePasswordNew,
  TwoFaChangePasswordConfirm,
  TwoFaChangePasswordHint,
  TwoFaTurnOff,
  TwoFaRecoveryEmailCurrentPassword,
  TwoFaRecoveryEmail,
  TwoFaRecoveryEmailCode,
  TwoFaCongratulations,
  ActiveWebsites,
  PasscodeDisabled,
  PasscodeNewPasscode,
  PasscodeNewPasscodeConfirm,
  PasscodeEnabled,
  PasscodeChangePasscodeCurrent,
  PasscodeChangePasscodeNew,
  PasscodeChangePasscodeConfirm,
  PasscodeTurnOff,
  PasscodeCongratulations,
  Experimental,
  Stickers,
  QuickReaction,
  CustomEmoji,
  DoNotTranslate,
  //New
  Wallet,
  Purchases,
  Subscriptions,
  InvitationLink,
  CreateLink,
  InfoCard,
  WalletSettings,
  WalletCard,
  DetailsChannel,
  EarnStatistic,
  Transfer,
  PayPal,
  BankCard,
  Support,
  FinancialActivity,
  MyBalance,
  Information,
  BanksRequisitsList,
  BankRequisits,
  BankRequest,
  DetailedTransactionsHistory,
  LoyaltyProgram,
  aiSpace,
}

export enum StoryViewerOrigin {
  StoryRibbon,
  MiddleHeaderAvatar,
  ChatList,
  SearchResult,
}

export type StickerSetOrReactionsSetOrRecent = Pick<
  ApiStickerSet,
  | 'id'
  | 'accessHash'
  | 'title'
  | 'count'
  | 'stickers'
  | 'hasThumbnail'
  | 'isLottie'
  | 'isVideos'
  | 'isEmoji'
  | 'installedDate'
  | 'isArchived'
> & { reactions?: ApiReaction[] };

export type StickerSetOrRecent = Pick<
  ApiStickerSet,
  | 'id'
  | 'accessHash'
  | 'title'
  | 'count'
  | 'stickers'
  | 'hasThumbnail'
  | 'isLottie'
  | 'isVideos'
  | 'isEmoji'
  | 'installedDate'
  | 'isArchived'
>;

export enum MiddleColumnContent {
  null,
  Calls,
  Settings,
  Messages,
  PaymentAi,
  MediaSale,
  Feed,
  Information,
  Statistics,
  MessageStatistics,
  ChatBot,
  QuickLinks,
}

export enum FeedScreens {
  Main,
  Channel,
  Settings,
}

export enum LeftColumnContent {
  null,
  ChatList,
  GlobalSearch,
  Settings,
  Contacts,
  Archived,
  Feed,
  Calls,
  NewChannelSelect,
  NewCoursSelect,
  NewChannelTypeInfo,
  NewCourseTypeInfo,
  NewMediaSaleInfo,
  NewChannelStep1,
  NewChannelStep2,
  NewGroupStep1,
  NewGroupStep2,
  NewCourseStep1,
  NewCourseStep2,
  AgeRestriction,
  AgeRestrictionForCourse,
}

export enum GlobalSearchContent {
  ChatList,
  Media,
  Links,
  Files,
  Music,
  Voice,
}

export enum RightColumnContent {
  ChatInfo,
  Search,
  Management,
  StickerSearch,
  GifSearch,
  PollResults,
  AddingMembers,
  CreateTopic,
  EditTopic,
  Certificate,
  CreateSale,
}

export enum MediaViewerOrigin {
  Inline,
  ScheduledInline,
  SharedMedia,
  ProfileAvatar,
  SettingsAvatar,
  MiddleHeaderAvatar,
  Album,
  ScheduledAlbum,
  SearchResult,
  SuggestedAvatar,
}

export enum AudioOrigin {
  Inline,
  SharedMedia,
  Search,
}

export enum ChatCreationProgress {
  Idle,
  InProgress,
  Complete,
  Error,
}

export enum ProfileEditProgress {
  Idle,
  InProgress,
  Complete,
  Error,
}

export enum ManagementProgress {
  Idle,
  InProgress,
  Complete,
  Error,
}

export interface ManagementState {
  isActive: boolean;
  nextScreen?: ManagementScreens;
  checkedUsername?: string;
  isUsernameAvailable?: boolean;
  error?: string;
  invites?: ApiExportedInvite[];
  revokedInvites?: ApiExportedInvite[];
  editingInvite?: ApiExportedInvite;
  inviteInfo?: {
    invite: ApiExportedInvite;
    importers?: ApiChatInviteImporter[];
    requesters?: ApiChatInviteImporter[];
  };
}

export enum NewChatMembersProgress {
  Closed,
  InProgress,
  Loading,
}

export enum CreateSaleScreen {
  Initial,
  AddTime,
}

export type ProfileTabType =
  | 'members'
  | 'commonChats'
  | 'media'
  | 'documents'
  | 'links'
  | 'audio'
  | 'voice';
export type SharedMediaType =
  | 'media'
  | 'documents'
  | 'links'
  | 'audio'
  | 'voice';
export type ApiPrivacyKey =
  | 'phoneNumber'
  | 'lastSeen'
  | 'profilePhoto'
  | 'voiceMessages'
  | 'forwards'
  | 'chatInvite'
  | 'phoneCall'
  | 'phoneP2P';
export type PrivacyVisibility =
  | 'everybody'
  | 'contacts'
  | 'nonContacts'
  | 'nobody';

export enum ProfileState {
  Profile,
  SharedMedia,
  MemberList,
}

export enum PaymentStep {
  Checkout,
  SavedPayments,
  ConfirmPassword,
  PaymentInfo,
  ShippingInfo,
  Shipping,
  ConfirmPayment,
}

export const UPLOADING_WALLPAPER_SLUG = 'UPLOADING_WALLPAPER_SLUG';

export enum ManagementScreens {
  Initial,
  ChatPrivacyType,
  Discussion,
  ChannelSubscribers,
  GroupType,
  GroupPermissions,
  GroupRemovedUsers,
  ChannelRemovedUsers,
  GroupUserPermissionsCreate,
  GroupUserPermissions,
  ChatAdministrators,
  GroupRecentActions,
  ChatAdminRights,
  ChatNewAdminRights,
  GroupMembers,
  GroupAddAdmins,
  Invites,
  EditInvite,
  Reactions,
  InviteInfo,
  JoinRequests,
  AddMembers,
  NewGroup,
  ChatHistory,
  MembersSearch,
}

export type ManagementType = 'user' | 'group' | 'channel';

export type NotifyException = {
  isMuted: boolean;
  isSilent?: boolean;
  shouldShowPreviews?: boolean;
};

export type EmojiKeywords = {
  isLoading?: boolean;
  version: number;
  keywords: Record<string, string[]>;
};

export type InlineBotSettings = {
  id: string;
  help?: string;
  query?: string;
  offset?: string;
  canLoadMore?: boolean;
  results?: (ApiBotInlineResult | ApiBotInlineMediaResult)[];
  isGallery?: boolean;
  switchPm?: ApiBotInlineSwitchPm;
  switchWebview?: ApiBotInlineSwitchWebview;
  cacheTime: number;
};
