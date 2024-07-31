import type {
  ApiAppConfig,
  ApiAttachBot,
  ApiAttachment,
  ApiAvailableReaction,
  ApiBoostsStatus,
  ApiChannelStatistics,
  ApiChat,
  ApiChatAdminRights,
  ApiChatBannedRights,
  ApiChatFolder,
  ApiChatFullInfo,
  ApiChatReactions,
  ApiChatType,
  ApiChatValue,
  ApiChatlistExportedInvite,
  ApiConfig,
  ApiConfirm,
  ApiContact,
  ApiCountry,
  ApiCountryCode,
  ApiError,
  ApiExportedInvite,
  ApiFormattedText,
  ApiGlobalMessageSearchType,
  ApiGroupCall,
  ApiGroupStatistics,
  ApiInputInvoice,
  ApiInputMessageReplyInfo,
  ApiInviteInfo,
  ApiInvoice,
  ApiKeyboardButton,
  ApiMessage,
  ApiMessageEntity,
  ApiMessageStatistics,
  ApiNewPoll,
  ApiNotification,
  ApiPaymentCredentials,
  ApiPaymentFormNativeParams,
  ApiPaymentSavedInfo,
  ApiPeerStories,
  ApiPhoneCall,
  ApiPhoto,
  ApiPremiumPromo,
  ApiReaction,
  ApiReceipt,
  ApiReportReason,
  ApiSendMessageAction,
  ApiSession,
  ApiSessionData,
  ApiSponsoredMessage,
  ApiStealthMode,
  ApiSticker,
  ApiStickerSet,
  ApiStickerSetInfo,
  ApiStoryView,
  ApiThemeParameters,
  ApiThreadInfo,
  ApiTranscription,
  ApiTypingStatus,
  ApiUpdate,
  ApiUpdateAuthorizationStateType,
  ApiUpdateConnectionStateType,
  ApiUser,
  ApiUserFullInfo,
  ApiUserStatus,
  ApiVideo,
  ApiWallpaper,
  ApiWebPage,
  ApiWebSession,
} from '../api/types';
import type {
  ApiInvoiceContainer,
  ApiPrivacyKey,
  ApiPrivacySettings,
  AudioOrigin,
  ChatCreationProgress,
  ConfirmEmailType,
  EmojiKeywords,
  FocusDirection,
  GlobalSearchContent,
  IAnchorPosition,
  InlineBotSettings,
  ISettings,
  IThemeSettings,
  LangCode,
  LeftColumnContent,
  LoadMoreDirection,
  ManagementProgress,
  ManagementScreens,
  ManagementState,
  MediaViewerOrigin,
  MiddleColumnContent,
  NewChatMembersProgress,
  NotifyException,
  PaymentStep,
  PerformanceType,
  PrivacyVisibility,
  ProfileEditProgress,
  SettingsScreens,
  SharedMediaType,
  ShippingOption,
  StoryViewerOrigin,
  ThemeKey,
  ThreadId,
} from '../types';
import type { P2pMessage } from '../lib/secret-sauce';
import type { ApiCredentials } from '../components/payment/PaymentModal';

import { ChannelType, CourseType } from '../components/left/newChat/NewChat';

import { AiPurchaseType } from '../components/payment/PaymentAi';
import { ProfileType } from '../components/auth/Auth';

export type MessageListType = 'thread' | 'pinned' | 'scheduled';

export interface MessageList {
  chatId: string;
  threadId: ThreadId;
  type: MessageListType;
}

export interface IFeedHistoryItem {
  peer_id: number;
  peer_type?: number;
  max_id?: number;
}

export interface ActiveEmojiInteraction {
  id: number;
  x: number;
  y: number;
  messageId?: number;
  startSize?: number;
  animatedEffect?: string;
  isReversed?: boolean;
}

export interface SignUpPayload {
  username: string;
  password: string;
  gender?: string;
  date_of_birth?: string;
  email: string;
  phone?: string;
  country_code: string;
  kind: string; // or "private"
  type: ProfileType; // or "business"
  code?: string;
}

export interface IRequestMakePayment {
  payment_system: string;
  asset_id: number;
  wallet_id: string | number;
  currency?: string;
  message?: string;
  number: string;
  exp_month: number;
  exp_year: number;
  csv: number;
  holder?: string;
  amount: number;
}

export interface IResponseDepositePayPal {
  amount: number;
  currency: string;
  link: string;
  payment_id: number;
  status: string;
}

export interface IRequestWalletPayments {
  payment_method: string;
  payment_type: string;
  asset_id: number;
  wallet_id: number;
  limit: number;
  offset: number;
}

export interface IRequestPaymentLink {
  asset_id: number;
  wallet_id: number;
  currency?: string;
  message?: number;
  amount?: number;
  coins?: number;
}

export interface IWithdrawCreatePayment {
  asset_id: number;
  wallet_id: number;
  currency: string;
  paypal_email?: string;
  payment_id?: string;
  bank_withdraw_requisites_id?: number;
  amount: number;
  withdraw_system?: string;
  initial_amount?: number;
}

export interface IAsset {
  id: number;
  asset_name: string;
  asset_symbol: string;
}

export interface IWithdrawCancelPayment {
  wallet_id: number;
  payment_id: string;
}

export interface IWithdrawApprovePayment {
  wallet_id: number;
  approve_code: string;
  paypal_email: string;
  payment_id: string;
  bank_withdraw_requisites_id: string;
}

export interface IEreateBankWithdrawRequisites {
  is_template: false;
  recipient_type?: string;
  business_id_number?: string;
  personal_first_name: string;
  personal_last_name: string;
  personal_phone_number: string;
  personal_email: string;
  message?: string;
  currency?: string;
  bank_country: string;
  bank_routing_number: string;
  bank_name: string;
  bank_street: string;
  bank_city: string;
  bank_state: string;
  bank_swift: string;
  bank_address: string;
  bank_postal_code?: string;
  bank_zip_code?: string;
  bank_recipient_account_number: string;
  user_address_address: string;
  user_address_street: string;
  user_address_city: string;
  user_address_state: string;
  user_address_region: string;
  user_address_zip_code: string;
  user_address_postal_code: string;
}

export interface IWithdrawTemplate {
  amount?: number;
  amount_fiat?: number;
  initial_amount?: number;
  fee?: number;
  withdraw_max?: number;
  withdraw_min?: number;
  transfer_max?: number;
  transfer_min?: number;
  status?: 'automatic_processing' | 'need_admin_approve';
  payment_id?: string;
  paypal_email?: string;
  bank_withdraw_requisites_id?: number;
  payment_system_fee?: number;
}

export interface IGetStatisticGraphic {
  wallet_id: number;
  period?: 'week' | 'year' | 'month';
  type?: TransferType;
  limit: number;
  page: number;
}

export interface IGetLastMonthActivityGraphic {
  wallet_id: number;
  limit: number;
  page: number;
}

export interface IRequestTransactions {
  asset_id: ASSET_ID;
  wallet_id: number;
  payment_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export enum EPeerType {
  ChannelsSubscription,
  CourseChannel,
  Payments,
  MediaSale,
  AiSubscription,
  AiPacks,
  Transfer,
  AiTextPack,
  AiImagePack,
  AiTextSubscription,
  AiImageSubscription,
  LoyaltyPartner,
  Loyalty,
  AiTextAndImageSubscription,
}

export enum ASSET_ID {
  USD,
}

export type TransferType = 'transfer' | 'deposit' | 'withdraw' | 'all';

export interface ITransactionWallet {
  id?: number;
  uuid?: string;
  status?: string;
  peer_type: EPeerType;
  peer_id: number;
  amount?: number;
  fee?: number;
  currency?: string;
  description?: string;
  type?: TransferType;
  payment_method?: string;
  created_at?: number;
  created_at_formatted?: string;
  from_wallet_id: number;
  to_wallet_id: number;
  operation_balance: number;
  payment_system_fee: string;
  referral?: ILoyaltyUser;
}

export interface IHistoryPayment {
  id?: number;
  asset_name?: string;
  asset_symbol?: string;
  amount?: number;
  fee?: number;
  status?: string;
  type?: string;
  created_at?: number;
  wallet_id?: number;
  currency?: string;
  payment_method?: string;
  to?: string;
  payment_service_fee: number;
}

export interface ITransactions {
  transaction: ITransactionWallet;
  service_image: string;
  service_name: string;
  payment?: IHistoryPayment;
}

export interface IChannelsEarnStatistics {
  peer_type: EPeerType;
  country_code?: string;
  category?: string;
  currency?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IEarnItem {
  peer_id: number;
  reward: number;
  last_month_reward: number;
  cost: number;
  participants_count: number;
  service_name: string;
  service_photo: string;
  start_date: string;
  end_date: string;
}

export interface IMakeTransfer {
  from_wallet_id: number;
  to_wallet_id: number;
  currency: string;
  message: string;
  amount: number;
}

export interface ISearchUserWallet {
  user_id: number;
  email: string;
  username: string;
}

export type ApiPaymentStatus = 'paid' | 'failed' | 'pending' | 'cancelled';

export interface ActiveReaction {
  messageId?: number;
  reaction?: ApiReaction;
}

export interface TabThread {
  scrollOffset?: number;
  replyStack?: number[];
  viewportIds?: number[];
}

export interface Thread {
  lastScrollOffset?: number;
  lastViewportIds?: number[];
  listedIds?: number[];
  outlyingLists?: number[][];
  pinnedIds?: number[];
  scheduledIds?: number[];
  editingId?: number;
  replyingToId?: number;
  editingScheduledId?: number;
  editingDraft?: ApiFormattedText;
  editingScheduledDraft?: ApiFormattedText;
  draft?: ApiDraft;
  noWebPage?: boolean;
  threadInfo?: ApiThreadInfo;
  firstMessageId?: number;
  typingStatus?: ApiTypingStatus;
}

export interface ServiceNotification {
  id: number;
  message: ApiMessage;
  version?: string;
  isUnread?: boolean;
  isDeleted?: boolean;
}

export type WalletType = 'main' | 'earning';

export interface IWallet {
  id: number;
  asset_name: string;
  asset_symbol: string;
  type: WalletType;
  amount: number;
  freeze_amount: number;
  available_balance?: number;
}

export interface IWalletSystemLimit {
  bank_deposit_check: boolean;
  bank_deposit_min: number;
  bank_deposit_max: number;
  bank_withdraw_check: boolean;
  bank_withdraw_max: number;
  bank_withdraw_min: number;
  paypal_deposit_check: boolean;
  paypal_min_deposit_amount: number;
  paypal_max_deposit_amount: number;
  paypal_withdraw_check: boolean;
  paypal_min_withdraw_amount: number;
  paypal_max_withdraw_amount: number;
  stripe_deposit_check: boolean;
  stripe_min_deposit_amount: number;
  stripe_max_deposit_amount: number;
  stripe_withdraw_check: boolean;
  stripe_min_withdraw_amount: number;
  stripe_max_withdraw_amount: number;
  pack_buy_fee: number;
}

export interface IPaymentSystem {
  type: string;
  value: number;
  on_off_deposit: boolean;
  min_deposit: number;
  max_deposit: number;
  on_off_withdrawals: boolean;
  min_withdrawals: number;
  max_withdrawals: number;
}

export interface IGenre {
  id: string;
  genre: string;
}

export type ApiLimitType =
  | 'uploadMaxFileparts'
  | 'stickersFaved'
  | 'savedGifs'
  | 'dialogFiltersChats'
  | 'dialogFilters'
  | 'dialogFolderPinned'
  | 'captionLength'
  | 'channels'
  | 'channelsPublic'
  | 'aboutLength';

export type ApiLimitTypeWithModal = Exclude<
  ApiLimitType,
  'captionLength' | 'aboutLength' | 'stickersFaved' | 'savedGifs'
>;

export type TranslatedMessage = {
  isPending?: boolean;
  text?: ApiFormattedText;
};

export type ChatTranslatedMessages = {
  byLangCode: Record<string, Record<number, TranslatedMessage>>;
};

export type ChatRequestedTranslations = {
  toLanguage?: string;
  manualMessages?: Record<number, string>;
};

export type TabState = {
  id: number;
  isBlurred?: boolean;
  isMasterTab: boolean;
  isInactive?: boolean;
  inviteHash?: string;
  canInstall?: boolean;
  isChatInfoShown: boolean;
  isMenuShown: boolean;
  isCertificateShown: boolean;
  isCreateSaleShown?: boolean;
  isStatisticsShown?: boolean;
  isLeftColumnShown: boolean;
  newChatMembersProgress?: NewChatMembersProgress;
  uiReadyState: 0 | 1 | 2;
  shouldInit: boolean;
  shouldSkipHistoryAnimations?: boolean;

  gifSearch: {
    query?: string;
    offset?: string;
    results?: ApiVideo[];
  };

  stickerSearch: {
    query?: string;
    hash?: string;
    resultIds?: string[];
  };

  nextSettingsScreen?: SettingsScreens;
  middleScreen: MiddleColumnContent;
  leftScreen: LeftColumnContent;

  isCallPanelVisible?: boolean;
  multitabNextAction?: CallbackAction;
  ratingPhoneCall?: ApiPhoneCall;

  messageLists: MessageList[];

  contentToBeScheduled?: {
    gif?: ApiVideo;
    sticker?: ApiSticker;
    poll?: ApiNewPoll;
    isSilent?: boolean;
    sendGrouped?: boolean;
    sendCompressed?: boolean;
  };

  activeChatFolder: number;
  tabThreads: Record<string, Record<number, TabThread>>;
  forumPanelChatId?: string;

  focusedMessage?: {
    chatId?: string;
    threadId?: ThreadId;
    messageId?: number;
    direction?: FocusDirection;
    noHighlight?: boolean;
    isResizingContainer?: boolean;
  };

  selectedMessages?: {
    chatId: string;
    messageIds: number[];
  };

  seenByModal?: {
    chatId: string;
    messageId: number;
  };

  reactorModal?: {
    chatId: string;
    messageId: number;
  };

  reactionPicker?: {
    chatId?: string;
    messageId?: number;
    position?: IAnchorPosition;
  };

  inlineBots: {
    isLoading: boolean;
    byUsername: Record<string, false | InlineBotSettings>;
  };

  globalSearch: {
    query?: string;
    filter?: ISearchQuery;
    date?: number;
    currentContent?: GlobalSearchContent;
    chatId?: string;
    foundTopicIds?: number[];
    fetchingStatus?: {
      chats?: boolean;
      messages?: boolean;
    };
    isClosing?: boolean;
    localResults?: {
      chatIds?: string[];
      userIds?: string[];
    };
    globalResults?: {
      chatIds?: string[];
      userIds?: string[];
    };
    resultsByType?: Partial<
      Record<
        ApiGlobalMessageSearchType,
        {
          totalCount?: number;
          nextOffsetId: number;
          foundIds: string[];
        }
      >
    >;
  };

  userSearch: {
    query?: string;
    fetchingStatus?: boolean;
    localUserIds?: string[];
    globalUserIds?: string[];
  };

  activeEmojiInteractions?: ActiveEmojiInteraction[];
  activeReactions: Record<string, ActiveReaction[]>;

  localTextSearch: {
    byChatThreadKey: Record<
      string,
      {
        isActive: boolean;
        query?: string;
        results?: {
          totalCount?: number;
          nextOffsetId?: number;
          foundIds?: number[];
        };
      }
    >;
  };

  localMediaSearch: {
    byChatThreadKey: Record<
      string,
      {
        currentType?: SharedMediaType;
        resultsByType?: Partial<
          Record<
            SharedMediaType,
            {
              totalCount?: number;
              nextOffsetId: number;
              foundIds: number[];
            }
          >
        >;
      }
    >;
  };

  management: {
    progress?: ManagementProgress;
    byChatId: Record<string, ManagementState>;
  };

  storyViewer: {
    isRibbonShown?: boolean;
    isArchivedRibbonShown?: boolean;
    peerId?: string;
    storyId?: number;
    isMuted: boolean;
    isSinglePeer?: boolean;
    isSingleStory?: boolean;
    isPrivate?: boolean;
    isArchive?: boolean;
    // Last viewed story id in current view session.
    // Used for better switch animation between peers.
    lastViewedByPeerIds?: Record<string, number>;
    isPrivacyModalOpen?: boolean;
    isStealthModalOpen?: boolean;
    viewModal?: {
      storyId: number;
      viewsById?: Record<string, ApiStoryView>;
      nextOffset?: string;
      isLoading?: boolean;
    };
    origin?: StoryViewerOrigin;
  };

  mediaViewer: {
    chatId?: string;
    threadId?: ThreadId;
    mediaId?: number;
    avatarOwnerId?: string;
    profilePhotoIndex?: number;
    origin?: MediaViewerOrigin;
    volume: number;
    playbackRate: number;
    isMuted: boolean;
    isHidden?: boolean;
  };

  audioPlayer: {
    chatId?: string;
    messageId?: number;
    threadId?: ThreadId;
    origin?: AudioOrigin;
    volume: number;
    playbackRate: number;
    isPlaybackRateActive?: boolean;
    isMuted: boolean;
  };

  webPagePreview?: ApiWebPage;

  forwardMessages: {
    isModalShown?: boolean;
    fromChatId?: string;
    messageIds?: number[];
    toChatId?: string;
    toThreadId?: number;
    withMyScore?: boolean;
    noAuthors?: boolean;
    noCaptions?: boolean;
    contactId?: string;
    refCode?: string;
    link?: string;
  };

  pollResults: {
    chatId?: string;
    messageId?: number;
    voters?: Record<string, string[]>; // TODO Rename to `voterIds`
    offsets?: Record<string, string>;
  };

  payment: {
    inputInvoice?: ApiInputInvoice;
    step?: PaymentStep;
    status?: ApiPaymentStatus;
    shippingOptions?: ShippingOption[];
    formId?: string;
    requestId?: string;
    savedInfo?: ApiPaymentSavedInfo;
    canSaveCredentials?: boolean;
    invoice?: ApiInvoice;
    invoiceContainer?: Omit<ApiInvoiceContainer, 'receiptMsgId'>;
    nativeProvider?: string;
    providerId?: string;
    nativeParams?: ApiPaymentFormNativeParams;
    stripeCredentials?: {
      type: string;
      id: string;
    };
    smartGlocalCredentials?: {
      type: string;
      token: string;
    };
    passwordMissing?: boolean;
    savedCredentials?: ApiPaymentCredentials[];
    receipt?: ApiReceipt;
    error?: {
      field?: string;
      message?: string;
      description?: string;
    };
    isPaymentModalOpen?: boolean;
    isExtendedMedia?: boolean;
    confirmPaymentUrl?: string;
    temporaryPassword?: {
      value: string;
      validUntil: number;
    };
  };

  chatCreation?: {
    progress: ChatCreationProgress;
    error?: string;
  };

  profileEdit?: {
    progress: ProfileEditProgress;
    checkedUsername?: string;
    isUsernameAvailable?: boolean;
    error?: string;
  };

  notifications: ApiNotification[];
  dialogs: (ApiError | ApiInviteInfo | ApiContact | ApiConfirm)[];

  safeLinkModalUrl?: string;
  historyCalendarSelectedAt?: number;
  openedStickerSetShortName?: string;
  openedCustomEmojiSetIds?: string[];

  activeDownloads: {
    byChatId: {
      [chatId: string]: {
        [x: string]: any;
        ids?: number[];
        scheduledIds?: number[];
      };
    };
  };

  statistics: {
    byChatId: Record<string, ApiChannelStatistics | ApiGroupStatistics>;
    currentMessage?: ApiMessageStatistics;
    currentMessageId?: number;
  };

  newContact?: {
    userId?: string;
    isByPhoneNumber?: boolean;
  };

  openedGame?: {
    url: string;
    chatId: string;
    messageId: number;
  };

  requestedDraft?: {
    chatId?: string;
    text: string;
    files?: File[];
  };

  pollModal: {
    isOpen: boolean;
    isQuiz?: boolean;
  };

  webApp?: {
    url: string;
    botId: string;
    buttonText: string;
    queryId?: string;
    slug?: string;
    replyToMsgId?: number;
    threadId?: number;
  };

  botTrustRequest?: {
    botId: string;
    type: 'game' | 'webApp';
    onConfirm?: CallbackAction;
  };
  requestedAttachBotInstall?: {
    bot: ApiAttachBot;
    onConfirm?: CallbackAction;
  };
  requestedAttachBotInChat?: {
    bot: ApiAttachBot;
    filter: ApiChatType[];
    startParam?: string;
  };

  confetti?: {
    lastConfettiTime?: number;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };

  urlAuth?: {
    button?: {
      chatId: string;
      messageId: number;
      buttonId: number;
    };
    request?: {
      domain: string;
      botId: string;
      shouldRequestWriteAccess?: boolean;
    };
    url: string;
  };

  premiumModal?: {
    isOpen?: boolean;
    isClosing?: boolean;
    promo: ApiPremiumPromo;
    initialSection?: string;
    fromUserId?: string;
    toUserId?: string;
    isGift?: boolean;
    monthsAmount?: number;
    isSuccess?: boolean;
  };

  giftPremiumModal?: {
    isOpen?: boolean;
    forUserId?: string;
    monthlyCurrency?: string;
    monthlyAmount?: string;
  };

  limitReachedModal?: {
    limit: ApiLimitTypeWithModal;
  };

  deleteFolderDialogModal?: number;

  createTopicPanel?: {
    chatId: string;
    isLoading?: boolean;
  };

  editTopicPanel?: {
    chatId: string;
    topicId: number;
    isLoading?: boolean;
  };

  loadingThread?: {
    loadingChatId: string;
    loadingMessageId: number;
  };

  boostStatistics?: {
    chatId: string;
    boosters?: Record<string, number>;
    boosterIds?: string[];
    boostStatus?: ApiBoostsStatus;
    isLoadingBoosters?: boolean;
    nextOffset?: string;
    count?: number;
  };

  requestedTranslations: {
    byChatId: Record<string, ChatRequestedTranslations>;
  };
  messageLanguageModal?: {
    chatId: string;
    messageId: number;
    activeLanguage?: string;
  };
};

export interface IBankRequisites {
  user_id: number;
  requisites_id: number;
  requisites_uuid: string;
  status: string;
  person_info: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  bank_info: {
    country: string;
    routing_number: string;
    name: string;
    street: string;
    city: string;
    state: string;
    swift: string;
    address: string;
    postal_code: string;
    zip_code: string;
    recipient_account_number: string;
  };
  address_info: {
    address: string;
    street: string;
    city: string;
    state: string;
    region: string;
    zip_code: string;
    postal_code: string;
  };
  recipient_type: string;
  business_id_number: string;
  currency?: string;
}

export interface IChartData {
  date: string;
  type: string;
  amount: number;
  period: string;
  date_from: string;
  date_to: string;
}
export interface IGraphicData {
  amount?: number;
  total?: number;
  period?: string;
  data: IChartData[] | null;
}

export interface IReferral {
  user: any;
  sum: any;
  commission: any;
}

export interface ILoyaltyUser {
  id: number;
  first_name: string;
  last_name?: string;
  username: string;
  photo_access_hash?: string;
  access_hash?: string;
  sum?: number;
  commission?: number;
}

export interface ILoyalty {
  code?: string;
  referrals?: IReferral[];
  percent?: number;
  percent_owner?: number;
  bonus?: number;
  is_business?: boolean;
  is_default?: boolean;
  name?: string;
  desc?: string;
  count_users?: number;
  sum?: number;
  total?: number;
  users?: { user: ILoyaltyUser; commission: number; sum: number }[];
}

export type GlobalState = {
  config?: ApiConfig;
  appConfig?: ApiAppConfig;
  hasWebAuthTokenFailed?: boolean;
  hasWebAuthTokenPasswordRequired?: true;
  connectionState?: ApiUpdateConnectionStateType;
  currentUserId?: string;
  isSyncing?: boolean;
  isUpdateAvailable?: boolean;
  isElectronUpdateAvailable?: boolean;
  lastSyncTime?: number;
  leftColumnWidth?: number;
  lastIsChatInfoShown?: boolean;
  initialUnreadNotifications?: number;
  shouldShowContextMenuHint?: boolean;

  audioPlayer: {
    lastPlaybackRate: number;
    isLastPlaybackRateActive?: boolean;
  };

  mediaViewer: {
    lastPlaybackRate: number;
  };

  recentlyFoundChatIds?: string[];

  twoFaSettings: {
    hint?: string;
    isLoading?: boolean;
    error?: string;
    waitingEmailCodeLength?: number;
  };

  attachmentSettings: {
    shouldCompress: boolean;
    shouldSendGrouped: boolean;
  };

  attachMenu: {
    hash?: string;
    bots: Record<string, ApiAttachBot>;
  };

  passcode: {
    isScreenLocked?: boolean;
    hasPasscode?: boolean;
    error?: string;
    timeoutUntil?: number;
    invalidAttemptsCount?: number;
    invalidAttemptError?: string;
    isLoading?: boolean;
  };

  // TODO Move to `auth`.
  isLoggingOut?: boolean;
  authState?: ApiUpdateAuthorizationStateType;
  authPhoneNumber?: string;
  authIsLoading?: boolean;
  authIsLoadingQrCode?: boolean;
  authError?: string;
  authErrorAvailable?: { email?: boolean; username?: boolean };
  authRememberMe?: boolean;
  authNearestCountry?: string;
  authIsCodeViaApp?: boolean;
  authHint?: string;
  authQrCode?: {
    token: string;
    expires: number;
  };
  authRefCode?: string;
  countryList: {
    phoneCodes: ApiCountryCode[];
    general: ApiCountry[];
  };
  channelCategories: string[];
  channelGenres: IGenre[];
  confirmData?: {
    type?: ConfirmEmailType;
    expire?: number;
    email?: string;
    username?: string;
    password?: string;
    newPassword?: string;
    error?: string;
    payment_id?: string;
    wallet_id?: number;
    bank_withdraw_id?: number;
    params?: any;
  };

  contactList?: {
    userIds: string[];
  };

  blocked: {
    ids: string[];
    totalCount: number;
  };

  users: {
    byId: Record<string, ApiUser>;
    statusesById: Record<string, ApiUserStatus>;
    // Obtained from GetFullUser / UserFullInfo
    fullInfoById: Record<string, ApiUserFullInfo>;
  };

  chats: {
    // TODO Replace with `Partial<Record>` to properly handle missing keys
    byId: Record<string, ApiChat>;
    listIds: {
      active?: string[];
      archived?: string[];
      feed?: string[];
      bots?: string[];
    };
    orderedPinnedIds: {
      active?: string[];
      archived?: string[];
      feed?: string[];
    };
    totalCount: {
      all?: number;
      archived?: number;
    };
    isFullyLoaded: {
      active?: boolean;
      archived?: boolean;
    };
    forDiscussionIds?: string[];
    // Obtained from GetFullChat / GetFullChannel
    fullInfoById: Record<string, ApiChatFullInfo>;
  };

  messages: {
    byChatId: Record<
      string,
      {
        byId: Record<number, ApiMessage>;
        threadsById: Record<number, Thread>;
      }
    >;
    unreadFeedMessage: ApiMessage[];
    sponsoredByChatId: Record<string, ApiSponsoredMessage>;
    inFeed: {
      byId?: Record<string, ApiMessage>;
      page: number;
    };
    inExplore: {
      byId?: Record<string, ApiMessage>;
      page: number;
    };
  };

  stories: {
    byPeerId: Record<string, ApiPeerStories>;
    hasNext?: boolean;
    stateHash?: string;
    hasNextInArchive?: boolean;
    archiveStateHash?: string;
    orderedPeerIds: {
      active: string[];
      archived: string[];
    };
    stealthMode: ApiStealthMode;
  };

  groupCalls: {
    byId: Record<string, ApiGroupCall>;
    activeGroupCallId?: string;
  };

  scheduledMessages: {
    byChatId: Record<
      string,
      {
        byId: Record<number, ApiMessage>;
      }
    >;
  };

  chatFolders: {
    orderedIds?: number[];
    byId: Record<number, ApiChatFolder>;
    invites: Record<number, ApiChatlistExportedInvite[]>;
    recommended?: ApiChatFolder[];
  };

  phoneCall?: ApiPhoneCall;

  fileUploads: {
    byMessageLocalId: Record<
      string,
      {
        progress: number;
      }
    >;
  };

  recentEmojis: string[];
  recentCustomEmojis: string[];
  topReactions: ApiReaction[];
  recentReactions: ApiReaction[];

  stickers: {
    setsById: Record<string, ApiStickerSet>;
    added: {
      hash?: string;
      setIds?: string[];
    };
    recent: {
      hash?: string;
      stickers: ApiSticker[];
    };
    favorite: {
      hash?: string;
      stickers: ApiSticker[];
    };
    greeting: {
      hash?: string;
      stickers: ApiSticker[];
    };
    premium: {
      hash?: string;
      stickers: ApiSticker[];
    };
    premiumSet: {
      hash?: string;
      stickers: ApiSticker[];
    };
    featured: {
      hash?: string;
      setIds?: string[];
    };
    forEmoji: {
      emoji?: string;
      stickers?: ApiSticker[];
      hash?: string;
    };
  };

  customEmojis: {
    added: {
      hash?: string;
      setIds?: string[];
    };
    lastRendered: string[];
    byId: Record<string, ApiSticker>;
    forEmoji: {
      emoji?: string;
      stickers?: ApiSticker[];
    };
    featuredIds?: string[];
    statusRecent: {
      hash?: string;
      emojis?: ApiSticker[];
    };
  };

  animatedEmojis?: ApiStickerSet;
  animatedEmojiEffects?: ApiStickerSet;
  genericEmojiEffects?: ApiStickerSet;
  defaultTopicIconsId?: string;
  defaultStatusIconsId?: string;
  premiumGifts?: ApiStickerSet;
  emojiKeywords: Partial<Record<LangCode, EmojiKeywords>>;

  gifs: {
    saved: {
      hash?: string;
      gifs?: ApiVideo[];
    };
  };

  availableReactions?: ApiAvailableReaction[];

  topPeers: {
    userIds?: string[];
    lastRequestedAt?: number;
  };

  topInlineBots: {
    userIds?: string[];
    lastRequestedAt?: number;
  };

  activeSessions: {
    byHash: Record<string, ApiSession>;
    orderedHashes: string[];
    ttlDays?: number;
  };

  activeWebSessions: {
    byHash: Record<string, ApiWebSession>;
    orderedHashes: string[];
  };

  settings: {
    byKey: ISettings;
    performance: PerformanceType;
    loadedWallpapers?: ApiWallpaper[];
    themes: Partial<Record<ThemeKey, IThemeSettings>>;
    privacy: Partial<Record<ApiPrivacyKey, ApiPrivacySettings>>;
    notifyExceptions?: Record<number, NotifyException>;
  };

  push?: {
    deviceToken: string;
    subscribedAt: number;
  };

  transcriptions: Record<string, ApiTranscription>;
  trustedBotIds: string[];

  serviceNotifications: ServiceNotification[];

  byTabId: Record<number, TabState>;

  archiveSettings: {
    isMinimized: boolean;
    isHidden: boolean;
  };

  translations: {
    byChatId: Record<string, ChatTranslatedMessages>;
  };

  //!-//-//-//--///-////  Wallets
  wallets: Array<IWallet>;
  assets: IAsset[];
  walletLoading?: boolean;
  depositPayPal: IResponseDepositePayPal;
  transactionsHistory: ITransactions[] | undefined;
  payment: IPayment | undefined;
  withdrawTemplate: IWithdrawTemplate | undefined;
  bankWithdrawsRequisites:
    | {
        current?: IBankRequisites;
        templates?: IBankRequisites[];
      }
    | undefined;
  earnStatistics:
    | {
        reward: number;
        last_month_reward: number;
        data: IEarnItem[];
      }
    | undefined;
  statistic:
    | {
        lastMonth: IGraphicData;
        transfer: IGraphicData[];
      }
    | undefined;
  limitsAndFee: IWalletSystemLimit | undefined;
  availablePaymentSystem: IPaymentSystem[] | undefined;
  //Settings
  subscriptionsList: ISubsriptionItem[];
  feedFilter:
    | {
        all?: string[];
        hidden?: string[];
        pinned?: string[];
        customBg?: { default: string };
        show_recommended?: boolean;
        show_only_subs?: boolean;
        show_adult?: boolean;
        scrollOffset?: number;
      }
    | undefined;
  aiPurchases: IAiPurchases | undefined;
  loyalty: ILoyalty | undefined;
  accountDeleteInfo?: IDeleteInfo;
};

export enum AiState {
  all,
  text,
  image,
}

export interface IAiPurchases {
  easy_mode: boolean;
  text_total: number;
  text_expire_at?: number;
  text_sub_active?: boolean;
  img_total: number;
  img_expire_at?: number;
  img_sub_active?: boolean;
  user_id: number;
  state: AiState;
  qtyText?: string;
}

export interface IDeleteInfo {
  message: string;
  wallets: {
    wallets: IWallet[];
  };
  paid_channels_owner: {
    chats: ISubsriptionItem[];
  };
  paid_channels_subscribe: {
    chats: ISubsriptionItem[];
  };
  ai_sub_info: AiSubInfo;
}

export interface AiSubInfo {
  easy_mode: boolean;
  text_total: number;
  img_total: number;
  user_id: number;
}

export interface ISubsriptionItem {
  id: string;
  title: string;
  username: string;
  peer_id?: number;
  peer_type?: number;
  amount?: number;
  currency?: string;
  expire_at?: number;
  is_active?: boolean;
}

export interface IPayment {
  payment_id?: number;
  status: string;
  amount?: string;
  payment_method?: string;
  payment_type?: string;
  currency?: string;
  link?: string;
  date?: string;
  time?: string;
  to?: string;
}

export type CallSound =
  | 'join'
  | 'allowTalk'
  | 'leave'
  | 'connecting'
  | 'incoming'
  | 'end'
  | 'connect'
  | 'busy'
  | 'ringing';

export interface RequiredActionPayloads {
  apiUpdate: ApiUpdate;
}

type Values<T> = T[keyof T];
export type CallbackAction = Values<{
  [ActionName in keyof ActionPayloads]: {
    action: ActionName;
    payload: ActionPayloads[ActionName];
  };
}>;

export type ApiDraft = ApiFormattedText & {
  isLocal?: boolean;
  shouldForce?: boolean;
};

type WithTabId = { tabId?: number };

export interface IInternalWithdraw {
  from_wallet_id: number;
  to_wallet_id: number;
  currency?: string;
  message?: string;
  amount: number;
}

export interface ISearchQuery {
  q?: string;
  limit?: number;
  isRecommended?: true;
  isNew?: true;
  isPaid?: true;
  isCourse?: true;
  isPublic?: true;
  country?: string;
  category?: string;
  genre?: string;
  page?: number;
}

export interface ActionPayloads {
  // system
  init:
    | ({
        isMasterTab?: boolean;
      } & WithTabId)
    | undefined;
  reset: undefined;
  disconnect: undefined;
  initApi: undefined;
  initMain: undefined;
  sync: undefined;
  saveSession: {
    sessionData?: ApiSessionData;
  };

  // auth
  setAuthPhoneNumber: { phoneNumber: string };
  setAuthCode: { code: string; email?: string };
  setRegistrationCode: { code: string; email: string };
  setAuthPassword: { password: string; username: string };
  setAuthUsernameAndPassword: { username: string; password: string };
  requestForgotPassword: { email: string; password: string };
  resendConfirmationCode: { username_or_email: string; type: ConfirmEmailType };
  confirmForgotPassword: {
    email: string;
    code: string;
    new_pass: string;
  };
  confirmEmail: {
    email: string;
    code: string;
  };
  signUp: SignUpPayload;
  returnToAuthPhoneNumber: undefined;
  returnToAuthPassword: undefined;
  setAuthRememberMe: boolean;
  clearAuthError: undefined;
  uploadProfilePhoto: {
    file: File;
    isFallback?: boolean;
    videoTs?: number;
    isVideo?: boolean;
  };
  goToAuthQrCode: undefined;
  goToRegistration: undefined;
  goToResetPassword: undefined;
  addReferralCode: { code?: string };

  //wallets
  createWallet: {
    asset_id: number;
  };
  getAssetsList: undefined;
  getLimitsAndFees: undefined;
  getAvailablePaymentSystem: undefined;
  getUserWallet: {
    asset_id: string;
  };
  getUserWallets: { asset_id: string };
  makePayment: IRequestMakePayment;
  getWalletPayments: IRequestWalletPayments;
  getWallets: { asset_id: number };
  getWalletEarn: { wallet_id: number };
  getPayPalPaymentLink: IRequestPaymentLink;
  getStripePaymentLink: IRequestPaymentLink;
  getWalletPaymentById: { payment_id: number; wallet_id: number };
  createWithdrawTemplate: IWithdrawCreatePayment;
  getFeeForInternalTransaction: IInternalWithdraw;
  withdrawApprovePayment: IWithdrawApprovePayment;
  earnStatistic: { wallet_id: number };
  getEarnStatisticGraphic: { wallet_id: number; period: string };
  ereateBankWithdrawRequisites: {
    data: IEreateBankWithdrawRequisites;
  };
  editBankWithdrawRequisites: {
    template_id: number;
    data: IEreateBankWithdrawRequisites;
  };
  getBankWithdrawRequisites: { requisite_id: number };
  getBankWithdrawsRequisites:
    | {
        limit?: number;
        offset?: number;
        is_template?: boolean;
      }
    | undefined;
  getTransferGraphic: IGetStatisticGraphic;
  getLastMonthActivityGraphic: IGetLastMonthActivityGraphic;
  getWalletTransaction: { transaction_id: number; transaction_uuid: string };
  getWalletTransactions: IRequestTransactions;
  withdrawSendApproveCode: {};
  channelsEarnStatistics: IChannelsEarnStatistics;
  makeTransfer: IMakeTransfer;
  searchUserWallet: ISearchUserWallet;
  clearPayment: undefined;

  // stickers & GIFs
  setStickerSearchQuery: { query?: string } & WithTabId;
  saveGif: {
    gif: ApiVideo;
    shouldUnsave?: boolean;
  } & WithTabId;
  setGifSearchQuery: { query?: string } & WithTabId;
  searchMoreGifs: WithTabId | undefined;
  faveSticker: { sticker: ApiSticker } & WithTabId;
  unfaveSticker: { sticker: ApiSticker };
  toggleStickerSet: { stickerSetId: string };
  loadEmojiKeywords: { language: LangCode };

  // groups
  togglePreHistoryHidden: {
    chatId: string;
    isEnabled: boolean;
  } & WithTabId;
  updateChatDefaultBannedRights: {
    chatId: string;
    bannedRights: ApiChatBannedRights;
  };
  updateChatMemberBannedRights: {
    chatId: string;
    userId: string;
    bannedRights: ApiChatBannedRights;
  } & WithTabId;
  updateChatAdmin: {
    chatId: string;
    userId: string;
    adminRights: ApiChatAdminRights;
    customTitle?: string;
  } & WithTabId;
  acceptInviteConfirmation: { hash: string } & WithTabId;
  updateCreator: {
    chatId: string;
    userId: string;
  } & WithTabId;

  // settings
  setSettingOption: Partial<ISettings> | undefined;
  loadPasswordInfo: undefined;
  clearTwoFaError: undefined;
  updatePassword: {
    currentPassword: string;
    password: string;
    hint?: string;
    email?: string;
    onSuccess: VoidFunction;
  };
  updateRecoveryEmail: {
    currentPassword: string;
    email: string;
    onSuccess: VoidFunction;
  };
  clearPassword: {
    currentPassword: string;
    onSuccess: VoidFunction;
  };
  provideTwoFaEmailCode: {
    code: string;
  };
  checkPassword: {
    currentPassword: string;
    onSuccess: VoidFunction;
  };
  loadBlockedContacts: undefined;
  blockContact: {
    contactId: string;
    accessHash: string;
  };
  unblockContact: {
    contactId: string;
  };

  loadNotificationSettings: undefined;
  updateContactSignUpNotification: {
    isSilent: boolean;
  };
  updateNotificationSettings: {
    peerType: 'contact' | 'group' | 'broadcast';
    isSilent?: boolean;
    shouldShowPreviews?: boolean;
  };

  updateWebNotificationSettings: {
    hasWebNotifications?: boolean;
    hasPushNotifications?: boolean;
    notificationSoundVolume?: number;
  };
  loadLanguages: undefined;
  loadPrivacySettings: undefined;
  setPrivacyVisibility: {
    privacyKey: ApiPrivacyKey;
    visibility: PrivacyVisibility;
  };

  setPrivacySettings: {
    privacyKey: ApiPrivacyKey;
    isAllowList: boolean;
    contactsIds: string[];
  };
  loadNotificationExceptions: undefined;
  setThemeSettings: { theme: ThemeKey } & Partial<IThemeSettings>;
  updateIsOnline: boolean;

  loadContentSettings: undefined;
  updateContentSettings: boolean;

  loadCountryList: {
    langCode?: string | LangCode;
  };
  getCategoriesForChannel: undefined;
  getGenresForChannel: undefined;
  ensureTimeFormat: WithTabId | undefined;

  // misc
  loadWebPagePreview: {
    text: string;
  } & WithTabId;
  clearWebPagePreview: WithTabId | undefined;
  loadWallpapers: undefined;
  uploadWallpaper: File;
  setDeviceToken: string;
  deleteDeviceToken: undefined;
  checkVersionNotification: undefined;
  setIsElectronUpdateAvailable: boolean;
  createServiceNotification: {
    message: ApiMessage;
    version?: string;
  };

  // message search
  openLocalTextSearch: WithTabId | undefined;
  closeLocalTextSearch: WithTabId | undefined;
  setLocalTextSearchQuery: {
    query?: string;
  } & WithTabId;
  setLocalMediaSearchType: {
    mediaType: SharedMediaType;
  } & WithTabId;
  searchTextMessagesLocal: WithTabId | undefined;
  searchMediaMessagesLocal: WithTabId | undefined;
  searchMessagesByDate: {
    timestamp: number;
  } & WithTabId;

  toggleChatInfo: ({ force?: boolean } & WithTabId) | undefined;
  setIsUiReady: {
    uiReadyState: 0 | 1 | 2;
  } & WithTabId;
  toggleLeftColumn: WithTabId | undefined;
  setMenuShow: boolean & WithTabId;

  addChatMembers: {
    chatId: string;
    memberIds: string[];
  } & WithTabId;
  deleteChatMember: {
    chatId: string;
    userId: string;
  } & WithTabId;
  openPreviousChat: WithTabId | undefined;
  editChatFolders: {
    chatId: string;
    idsToRemove: number[];
    idsToAdd: number[];
  } & WithTabId;
  toggleIsProtected: {
    chatId: string;
    isProtected: boolean;
  };
  preloadTopChatMessages: undefined;
  loadAllChats: {
    listType: 'active' | 'archived';
    onReplace?: VoidFunction;
    shouldReplace?: boolean;
  };
  openChatWithInfo: ActionPayloads['openChat'] & WithTabId;
  openLinkedChat: { id: string } & WithTabId;
  loadMoreMembers: WithTabId | undefined;
  setActiveChatFolder: {
    activeChatFolder: number;
  } & WithTabId;
  openNextChat: {
    orderedIds: string[];
    targetIndexDelta: number;
  } & WithTabId;
  joinChannel: {
    chatId: string;
  } & WithTabId;
  leaveChannel: { chatId: string } & WithTabId;
  deleteChannel: { chatId: string } & WithTabId;
  toggleChatPinned: {
    id: string;
    folderId: number;
  } & WithTabId;
  toggleChatArchived: {
    id: string;
  };
  toggleFeedChatPinned: { chatId: string };
  toggleFeedChatHidden: { chatId: string };
  toggleChatUnread: { id: string };
  loadChatFolders: undefined;
  loadRecommendedChatFolders: undefined;
  editChatFolder: {
    id: number;
    folderUpdate: Omit<ApiChatFolder, 'id' | 'description' | 'emoticon'>;
  };
  addChatFolder: {
    folder: ApiChatFolder;
  } & WithTabId;
  deleteChatFolder: {
    id: number;
  };
  openSupportChat: WithTabId | undefined;
  openChatBot: { id: string } & WithTabId;
  focusMessageInComments: {
    chatId: string;
    threadId: ThreadId;
    messageId: number;
  } & WithTabId;
  openChatByPhoneNumber: {
    phoneNumber: string;
    startAttach?: string | boolean;
    attach?: string;
  } & WithTabId;
  openChatByInvite: {
    hash: string;
  } & WithTabId;

  // global search
  setGlobalSearchQuery: {
    query?: string;
  } & WithTabId;
  searchChannelsGlobal: { clean?: boolean; filter?: ISearchQuery } & WithTabId;

  searchMessagesGlobal: {
    type: ApiGlobalMessageSearchType;
  } & WithTabId;
  addRecentlyFoundChatId: {
    id: string;
  };
  clearRecentlyFoundChats: undefined;
  setGlobalSearchContent: {
    content?: GlobalSearchContent;
  } & WithTabId;
  setGlobalSearchChatId: {
    id?: string;
  } & WithTabId;
  setGlobalSearchDate: {
    date?: number;
  } & WithTabId;

  // scheduled messages
  loadScheduledHistory: {
    chatId: string;
  };
  sendScheduledMessages: {
    chatId: string;
    id: number;
  };
  rescheduleMessage: {
    chatId: string;
    messageId: number;
    scheduledAt: number;
  };
  deleteScheduledMessages: { messageIds: number[] } & WithTabId;
  // Message
  loadViewportMessages: {
    direction?: LoadMoreDirection;
    isBudgetPreload?: boolean;
    chatId?: string;
    threadId?: ThreadId;
    shouldForceRender?: boolean;
    onLoaded?: NoneToVoidFunction;
    onError?: NoneToVoidFunction;
  } & WithTabId;
  sendMessage: {
    text?: string;
    entities?: ApiMessageEntity[];
    attachments?: ApiAttachment[];
    sticker?: ApiSticker;
    isSilent?: boolean;
    scheduledAt?: number;
    gif?: ApiVideo;
    poll?: ApiNewPoll;
    contact?: Partial<ApiContact>;
    shouldUpdateStickerSetOrder?: boolean;
    shouldGroupMessages?: boolean;
    messageList: MessageList;
  } & WithTabId;
  cancelSendingMessage: {
    chatId: string;
    messageId: number;
  };
  pinMessage: {
    messageId: number;
    isUnpin: boolean;
    isOneSide?: boolean;
    isSilent?: boolean;
  } & WithTabId;
  deleteMessages: {
    messageIds: number[];
    shouldDeleteForAll?: boolean;
  } & WithTabId;
  deleteMessagesOutChat: {
    messageIds: number[];
    shouldDeleteForAll?: boolean;
  } & WithTabId;
  markMessageListRead: {
    maxId: number;
  } & WithTabId;
  markMessagesRead: {
    messageIds: number[];
  } & WithTabId;
  loadMessage: {
    chatId: string;
    messageId: number;
    replyOriginForId?: number;
    threadUpdate?: {
      lastMessageId: number;
      isDeleting?: boolean;
    };
  };
  editMessage: {
    text: string;
    entities?: ApiMessageEntity[];
  } & WithTabId;
  deleteHistory: {
    chatId: string;
    shouldDeleteForAll?: boolean;
    isClear?: boolean;
  } & WithTabId;
  loadSponsoredMessages: {
    chatId: string;
  };
  viewSponsoredMessage: {
    chatId: string;
  };
  loadSendAs: {
    chatId: string;
  };
  saveDefaultSendAs: {
    chatId: string;
    sendAsId: string;
  };
  stopActiveEmojiInteraction: {
    id: number;
  } & WithTabId;
  interactWithAnimatedEmoji: {
    emoji: string;
    x: number;
    y: number;
    startSize: number;
    isReversed?: boolean;
  } & WithTabId;
  loadReactors: {
    chatId: string;
    messageId: number;
    reaction?: ApiReaction;
  };
  sendEmojiInteraction: {
    messageId: number;
    chatId: string;
    emoji: string;
    interactions: number[];
  };
  sendWatchingEmojiInteraction: {
    chatId: string;
    id: number;
    emoticon: string;
    x: number;
    y: number;
    startSize: number;
    isReversed?: boolean;
  } & WithTabId;
  reportMessages: {
    messageIds: number[];
    reason: ApiReportReason;
    description: string;
  } & WithTabId;
  sendMessageAction: {
    action: ApiSendMessageAction;
    chatId: string;
    threadId: ThreadId;
  };

  loadSeenBy: {
    chatId: string;
    messageId: number;
  };
  openElloLink: {
    url: string;
  } & WithTabId;
  openChatByUsername: {
    username: string;
    threadId?: number;
    messageId?: number;
    commentId?: number;
    startParam?: string;
    startAttach?: string | boolean;
    attach?: string;
    startApp?: string;
    originalParts?: string[];
  } & WithTabId;
  requestThreadInfoUpdate: {
    chatId: string;
    threadId: ThreadId;
  };
  setScrollOffset: {
    chatId: string;
    threadId: ThreadId;
    scrollOffset: number;
  } & WithTabId;
  setFeedScrollOffset: {
    scrollOffset: number;
  } & WithTabId;
  unpinAllMessages: {
    chatId: string;
    threadId: ThreadId;
  };
  setEditingId: {
    messageId?: number;
  } & WithTabId;
  editLastMessage: WithTabId | undefined;
  saveDraft: {
    chatId: string;
    threadId: ThreadId;
    draft: ApiDraft;
    shouldForce?: boolean;
  };
  clearUnreadFeed: undefined;
  loadFeedMessages:
    | { page?: number; limit?: number; isExplore?: true }
    | undefined;
  clearDraft: {
    chatId: string;
    threadId?: number;
    localOnly?: boolean;
    shouldForce?: boolean;
  };
  loadPinnedMessages: {
    chatId: string;
    threadId: ThreadId;
  };
  toggleMessageWebPage: {
    chatId: string;
    threadId: ThreadId;
    noWebPage?: boolean;
  };
  replyToNextMessage: {
    targetIndexDelta: number;
  } & WithTabId;
  deleteChatUser: { chatId: string; userId: string } & WithTabId;
  deleteChat: { chatId: string } & WithTabId;

  // chat creation
  createChannel: {
    title: string;
    about?: string;
    photo?: File;
    broadcast?: boolean;
    megagroup?: true | undefined;
    payType?: number;
    cost?: string;
    startDate?: any;
    endDate?: any;
    category?: string;
    country?: string;
    adult?: true | undefined; //18+
    channelType?: ChannelType | CourseType;
    memberIds: string[];
    forChannelId?: string;
    genre?: string;
    subGenre?: string;
  } & WithTabId;
  createGroupChat: {
    title: string;
    memberIds: string[];
    photo?: File;
  } & WithTabId;
  resetChatCreation: WithTabId | undefined;

  // payment
  closePaymentModal: WithTabId | undefined;
  addPaymentError: {
    error: TabState['payment']['error'];
  } & WithTabId;
  validateRequestedInfo: {
    requestInfo: any;
    saveInfo?: boolean;
  } & WithTabId;
  setPaymentStep: {
    step?: PaymentStep;
  } & WithTabId;
  sendPaymentForm: {
    shippingOptionId?: string;
    saveCredentials?: any;
    savedCredentialId?: string;
    tipAmount?: number;
  } & WithTabId;
  getReceipt: {
    receiptMessageId: number;
    chatId: string;
    messageId: number;
  } & WithTabId;
  sendCredentialsInfo: {
    credentials: ApiCredentials;
  } & WithTabId;
  clearPaymentError: WithTabId | undefined;
  clearReceipt: WithTabId | undefined;

  // stats
  toggleStatistics: WithTabId | undefined;
  toggleMessageStatistics:
    | ({
        messageId?: number;
      } & WithTabId)
    | undefined;
  loadStatistics: {
    chatId: string;
    isGroup: boolean;
  } & WithTabId;
  loadMessageStatistics: {
    chatId: string;
    messageId: number;
  } & WithTabId;
  loadStatisticsAsyncGraph: {
    chatId: string;
    token: string;
    name: string;
    isPercentage?: boolean;
  } & WithTabId;

  // ui
  dismissDialog: WithTabId | undefined;
  setNewChatMembersDialogState: {
    newChatMembersProgress?: NewChatMembersProgress;
  } & WithTabId;
  disableHistoryAnimations: WithTabId | undefined;
  setLeftColumnWidth: {
    leftColumnWidth: number;
  };
  resetLeftColumnWidth: undefined;

  copySelectedMessages: WithTabId | undefined;
  copyMessagesByIds: {
    messageIds?: number[];
  } & WithTabId;
  openSeenByModal: {
    chatId: string;
    messageId: number;
  } & WithTabId;
  closeSeenByModal: WithTabId | undefined;
  closeReactorListModal: WithTabId | undefined;
  openReactorListModal: {
    chatId: string;
    messageId: number;
  } & WithTabId;
  enterMessageSelectMode:
    | ({
        messageId: number;
      } & WithTabId)
    | undefined;
  toggleMessageSelection: {
    messageId: number;
    groupedId?: string;
    childMessageIds?: number[];
    withShift?: boolean;
  } & WithTabId;
  exitMessageSelectMode: WithTabId | undefined;
  openHistoryCalendar: {
    selectedAt?: number;
  } & WithTabId;
  closeHistoryCalendar: WithTabId | undefined;
  disableContextMenuHint: undefined;
  focusNextReply: WithTabId | undefined;

  openMessageLanguageModal: {
    chatId: string;
    id: number;
  } & WithTabId;
  closeMessageLanguageModal: WithTabId | undefined;

  // poll result
  openPollResults: {
    chatId: string;
    messageId: number;
  } & WithTabId;
  closePollResults: WithTabId | undefined;
  loadPollOptionResults: {
    chat: ApiChat;
    messageId: number;
    option: string;
    offset: string;
    limit: number;
    shouldResetVoters?: boolean;
  } & WithTabId;

  // management
  setEditingExportedInvite: {
    chatId: string;
    invite?: ApiExportedInvite;
  } & WithTabId;
  loadExportedChatInvites: {
    chatId: string;
    adminId?: string;
    isRevoked?: boolean;
    limit?: number;
  } & WithTabId;
  editExportedChatInvite: {
    chatId: string;
    link: string;
    isRevoked?: boolean;
    expireDate?: number;
    usageLimit?: number;
    isRequestNeeded?: boolean;
    title?: string;
  } & WithTabId;
  exportChatInvite: {
    chatId: string;
    expireDate?: number;
    usageLimit?: number;
    isRequestNeeded?: boolean;
    title?: string;
  } & WithTabId;
  deleteExportedChatInvite: {
    chatId: string;
    link: string;
  } & WithTabId;
  deleteRevokedExportedChatInvites: {
    chatId: string;
    adminId?: string;
  } & WithTabId;
  setOpenedInviteInfo: {
    chatId: string;
    invite?: ApiExportedInvite;
  } & WithTabId;
  loadChatInviteImporters: {
    chatId: string;
    link?: string;
    offsetDate?: number;
    offsetUserId?: string;
    limit?: number;
  } & WithTabId;
  hideChatJoinRequest: {
    chatId: string;
    userId: string;
    isApproved: boolean;
  };
  hideAllChatJoinRequests: {
    chatId: string;
    isApproved: boolean;
    link?: string;
  };
  loadChatInviteRequesters: {
    chatId: string;
    link?: string;
    offsetDate?: number;
    offsetUserId?: string;
    limit?: number;
  } & WithTabId;
  hideChatReportPanel: {
    chatId: string;
  };
  toggleManagement: ({ localChatId?: string } & WithTabId) | undefined;
  requestNextManagementScreen:
    | ({
        screen?: ManagementScreens;
      } & WithTabId)
    | undefined;
  closeManagement: WithTabId | undefined;
  checkPublicLink: { username: string } & WithTabId;
  checkNewPublicLink: { username: string } & WithTabId;
  updatePublicLink: { username: string } & WithTabId;
  updatePrivateLink: WithTabId | undefined;

  requestChatUpdate: { chatId: string };
  loadChatJoinRequests: {
    chatId: string;
    offsetDate?: number;
    offsetUserId?: string;
    limit?: number;
  };
  loadTopChats: undefined;
  showDialog: {
    data: TabState['dialogs'][number];
  } & WithTabId;
  focusMessage: {
    chatId: string;
    threadId?: ThreadId;
    messageListType?: MessageListType;
    messageId: number;
    noHighlight?: boolean;
    groupedId?: string;
    groupedChatId?: string;
    replyMessageId?: number;
    isResizingContainer?: boolean;
    shouldReplaceHistory?: boolean;
    noForumTopicPanel?: boolean;
    fromFeed?: boolean;
  } & WithTabId;

  focusLastMessage: WithTabId | undefined;
  setReplyingToId: {
    messageId?: number;
  } & WithTabId;
  closeWebApp: WithTabId | undefined;

  // Multitab
  destroyConnection: undefined;
  initShared: { force?: boolean } | undefined;
  switchMultitabRole: {
    isMasterTab: boolean;
  } & WithTabId;
  openChatInNewTab: {
    chatId: string;
    threadId?: number;
  };
  onTabFocusChange: {
    isBlurred: boolean;
  } & WithTabId;
  onSomeTabSwitchedMultitabRole: undefined;
  afterHangUp: undefined;
  requestMasterAndCallAction: CallbackAction & WithTabId;
  clearMultitabNextAction: WithTabId | undefined;
  requestMasterAndJoinGroupCall: ActionPayloads['joinGroupCall'];
  requestMasterAndRequestCall: ActionPayloads['requestCall'];
  requestMasterAndAcceptCall: WithTabId | undefined;

  // Initial
  signOut: { forceInitApi?: boolean } | undefined;

  // Misc
  setInstallPrompt: { canInstall: boolean } & WithTabId;
  openLimitReachedModal: { limit: ApiLimitTypeWithModal } & WithTabId;
  closeLimitReachedModal: WithTabId | undefined;
  checkAppVersion: undefined;
  setGlobalSearchClosing:
    | ({
        isClosing?: boolean;
      } & WithTabId)
    | undefined;

  // Accounts
  reportPeer: {
    chatId?: string;
    reason: ApiReportReason;
    description: string;
  } & WithTabId;
  reportProfilePhoto: {
    chatId?: string;
    reason: ApiReportReason;
    description: string;
    photo?: ApiPhoto;
  } & WithTabId;
  changeSessionSettings: {
    hash: string;
    areCallsEnabled?: boolean;
    areSecretChatsEnabled?: boolean;
  };
  changeSessionTtl: {
    days: number;
  };

  // Chats
  loadChatSettings: {
    chatId: string;
  };
  updateChatMutedState: {
    chatId: string;
    isMuted: boolean;
  };

  updateChat: {
    chatId: string;
    title: string;
    about: string;
    photo?: File;
  } & WithTabId;
  toggleSignatures: {
    chatId: string;
    isEnabled: boolean;
  };
  loadGroupsForDiscussion: undefined;
  linkDiscussionGroup: {
    channelId: string;
    chatId: string;
  } & WithTabId;
  unlinkDiscussionGroup: {
    channelId: string;
  } & WithTabId;

  openChat: {
    id: string | undefined;
    threadId?: ThreadId;
    type?: MessageListType;
    shouldReplaceHistory?: boolean;
    shouldReplaceLast?: boolean;
    noForumTopicPanel?: boolean;
    noRequestThreadInfoUpdate?: boolean;
    fromFeed?: boolean;
  } & WithTabId;

  openComments: {
    chatId: string;
    threadId: ThreadId;
    originChannelId?: string;
  } & WithTabId;

  openThread: {
    type?: MessageListType;
    shouldReplaceHistory?: boolean;
    shouldReplaceLast?: boolean;
    noForumTopicPanel?: boolean;
    focusMessageId?: number;
  } & (
    | {
        isComments: true;
        chatId?: string;
        originMessageId: number;
        originChannelId: string;
      }
    | {
        isComments?: false;
        chatId: string;
        threadId: ThreadId;
      }
  ) &
    WithTabId;
  processOpenChatOrThread: {
    chatId: string | undefined;
    threadId: ThreadId;
    type?: MessageListType;
    shouldReplaceHistory?: boolean;
    shouldReplaceLast?: boolean;
    noForumTopicPanel?: boolean;
    isComments?: boolean;
  } & WithTabId;
  loadFullChat: {
    chatId: string;
    withPhotos?: boolean;
    force?: boolean;
  } & WithTabId;
  updateChatPhoto: {
    chatId: string;
    photo: ApiPhoto;
  } & WithTabId;
  deleteChatPhoto: {
    chatId: string;
    photo: ApiPhoto;
  } & WithTabId;
  openChatWithDraft: {
    chatId?: string;
    threadId?: number;
    text: string;
    files?: File[];
  } & WithTabId;
  resetOpenChatWithDraft: WithTabId | undefined;
  toggleJoinToSend: {
    chatId: string;
    isEnabled: boolean;
  };
  toggleJoinRequest: {
    chatId: string;
    isEnabled: boolean;
  };

  openForumPanel: {
    chatId: string;
  } & WithTabId;
  closeForumPanel: WithTabId | undefined;

  toggleParticipantsHidden: {
    chatId: string;
    isEnabled: boolean;
  };

  // Messages
  setEditingDraft: {
    text?: ApiFormattedText;
    chatId: string;
    threadId: ThreadId;
    type: MessageListType;
  };
  fetchUnreadMentions: {
    chatId: string;
    offsetId?: number;
  };
  fetchUnreadReactions: {
    chatId: string;
    offsetId?: number;
  };
  loadMessageViews: {
    chatId: string;
    ids: number[];
    shouldIncrement?: boolean;
  };
  setLike: {
    user_id: number;
    msg_id: number;
    isLiked: boolean;
    chatId: string;
    likes: number;
  };
  getFeedFilter: undefined;
  setFeedFilter: {
    hidden?: string[] | undefined;
    pinned?: string[] | undefined;
    show_recommended?: boolean;
    show_only_subs?: boolean;
    show_adult?: boolean;
  };
  setFeedBackground: { defaultBg?: string };
  animateUnreadReaction: {
    messageIds: number[];
  } & WithTabId;
  focusNextReaction: WithTabId | undefined;
  focusNextMention: WithTabId | undefined;
  readAllReactions: WithTabId | undefined;
  readAllMentions: WithTabId | undefined;
  markMentionsRead: {
    messageIds: number[];
  } & WithTabId;

  sendPollVote: {
    chatId: string;
    messageId: number;
    options: string[];
  };
  cancelPollVote: {
    chatId: string;
    messageId: number;
  };
  closePoll: {
    chatId: string;
    messageId: number;
  };

  loadExtendedMedia: {
    chatId: string;
    ids: number[];
  };

  requestMessageTranslation: {
    chatId: string;
    id: number;
    toLanguageCode?: string;
  } & WithTabId;

  showOriginalMessage: {
    chatId: string;
    id: number;
  } & WithTabId;

  translateMessages: {
    chatId: string;
    messageIds: number[];
    toLanguageCode?: string;
  };

  // Reactions
  loadTopReactions: undefined;
  loadRecentReactions: undefined;
  loadAvailableReactions: undefined;
  clearRecentReactions: undefined;

  loadMessageReactions: {
    chatId: string;
    ids: number[];
  };

  toggleReaction: {
    chatId: string;
    messageId: number;
    reaction: ApiReaction;
    shouldAddToRecent?: boolean;
  } & WithTabId;

  setDefaultReaction: {
    reaction: ApiReaction;
  };
  sendDefaultReaction: {
    chatId: string;
    messageId: number;
  } & WithTabId;

  setChatEnabledReactions: {
    chatId: string;
    enabledReactions?: ApiChatReactions;
  } & WithTabId;

  stopActiveReaction: {
    containerId: string;
    reaction: ApiReaction;
  } & WithTabId;

  openReactionPicker: {
    chatId: string;
    messageId: number;
    position: IAnchorPosition;
  } & WithTabId;
  closeReactionPicker: WithTabId | undefined;

  // Media Viewer & Audio Player
  openMediaViewer: {
    chatId?: string;
    threadId?: number;
    mediaId?: number;
    avatarOwnerId?: string;
    profilePhotoIndex?: number;
    origin: MediaViewerOrigin;
    volume?: number;
    playbackRate?: number;
    isMuted?: boolean;
  } & WithTabId;
  closeMediaViewer: WithTabId | undefined;
  setMediaViewerVolume: {
    volume: number;
  } & WithTabId;
  setMediaViewerPlaybackRate: {
    playbackRate: number;
  } & WithTabId;
  setMediaViewerMuted: {
    isMuted: boolean;
  } & WithTabId;
  setMediaViewerHidden: {
    isHidden: boolean;
  } & WithTabId;
  openAudioPlayer: {
    chatId: string;
    threadId?: number;
    messageId: number;
    origin?: AudioOrigin;
    volume?: number;
    playbackRate?: number;
    isMuted?: boolean;
  } & WithTabId;
  closeAudioPlayer: WithTabId | undefined;
  setAudioPlayerVolume: {
    volume: number;
  } & WithTabId;
  setAudioPlayerPlaybackRate: {
    playbackRate: number;
    isPlaybackRateActive?: boolean;
  } & WithTabId;
  setAudioPlayerMuted: {
    isMuted: boolean;
  } & WithTabId;
  setAudioPlayerOrigin: {
    origin: AudioOrigin;
  } & WithTabId;

  // Downloads
  downloadSelectedMessages: WithTabId | undefined;
  downloadMessageMedia: {
    message: ApiMessage;
  } & WithTabId;
  cancelMessageMediaDownload: {
    message: ApiMessage;
  } & WithTabId;
  cancelMessagesMediaDownload: {
    messages: ApiMessage[];
  } & WithTabId;

  // Users
  loadNearestCountry: undefined;
  loadTopUsers: undefined;
  loadContactList: undefined;

  loadCurrentUser: undefined;
  updateProfile: {
    photo?: File;
    //firstName?: string;
    //lastName?: string;
    username: string;
    first_name: string;
    last_name?: string;
    bio?: string;
    gender: string;
    birthday?: string;
    country_code: string;
  } & WithTabId;
  checkUsername: {
    username: string;
  } & WithTabId;
  checkUsernameInRegister: {
    username: string;
  };
  checkEmailInRegister: {
    email: string;
  };
  deleteContact: { userId: string };
  loadUser: { userId: string };
  fetchUserByUsername: { username: string };
  setUserSearchQuery: { query?: string } & WithTabId;
  loadCommonChats: WithTabId | undefined;
  reportSpam: { chatId: string };
  loadFullUser: { userId: string; withPhotos?: boolean };
  openAddContactDialog: { userId?: string } & WithTabId;
  openNewContactDialog: WithTabId | undefined;
  closeNewContactDialog: WithTabId | undefined;
  importContact: {
    phoneNumber: string;
    firstName: string;
    lastName?: string;
  } & WithTabId;
  updateContact: {
    userId: string;
    firstName: string;
    lastName?: string;
    isMuted?: boolean;
    shouldSharePhoneNumber?: boolean;
  } & WithTabId;
  loadProfilePhotos: {
    profileId: string;
  };
  deleteProfilePhoto: {
    photo: ApiPhoto;
  };
  updateProfilePhoto: {
    photo: ApiPhoto;
    isFallback?: boolean;
  };

  // Forwards
  openForwardMenu: {
    fromChatId: string;
    messageIds?: number[];
    groupedId?: string;
    withMyScore?: boolean;
    contactId?: string;
    refCode?: string;
    link?: string;
  } & WithTabId;
  openForwardMenuForSelectedMessages: WithTabId | undefined;
  setForwardChatOrTopic: {
    chatId: string;
    topicId?: number;
  } & WithTabId;
  forwardContact: {
    chatId: string;
    contactRequest: ApiContact;
  } & WithTabId;
  forwardReferralCode: {
    chatId: string;
    refCode: string;
  } & WithTabId;
  forwardLink: {
    chatId: string;
    link: string;
  } & WithTabId;
  forwardMessages: {
    isSilent?: boolean;
    scheduledAt?: number;
  } & WithTabId;
  setForwardNoAuthors: {
    noAuthors: boolean;
  } & WithTabId;
  setForwardNoCaptions: {
    noCaptions: boolean;
  } & WithTabId;
  exitForwardMode: WithTabId | undefined;
  changeForwardRecipient: WithTabId | undefined;
  forwardToSavedMessages: WithTabId | undefined;

  // GIFs
  loadSavedGifs: undefined;

  // Stickers
  loadStickers: {
    stickerSetInfo: ApiStickerSetInfo;
  } & WithTabId;
  loadAnimatedEmojis: undefined;
  loadGreetingStickers: undefined;
  loadGenericEmojiEffects: undefined;

  addRecentSticker: {
    sticker: ApiSticker;
  };

  removeRecentSticker: {
    sticker: ApiSticker;
  };

  clearRecentStickers: undefined;

  loadStickerSets: undefined;
  loadAddedStickers: WithTabId | undefined;
  loadRecentStickers: undefined;
  loadFavoriteStickers: undefined;
  loadFeaturedStickers: undefined;

  reorderStickerSets: {
    isCustomEmoji?: boolean;
    order: string[];
  };

  addNewStickerSet: {
    stickerSet: ApiStickerSet;
  };

  openStickerSet: { stickerSetInfo: ApiStickerSetInfo } & WithTabId;
  closeStickerSetModal: WithTabId | undefined;

  loadStickersForEmoji: {
    emoji: string;
  };
  clearStickersForEmoji: undefined;

  loadCustomEmojiForEmoji: {
    emoji: string;
  };
  clearCustomEmojiForEmoji: undefined;

  addRecentEmoji: {
    emoji: string;
  };

  loadCustomEmojis: {
    ids: string[];
    ignoreCache?: boolean;
  };
  updateLastRenderedCustomEmojis: {
    ids: string[];
  };
  openCustomEmojiSets: {
    setIds: string[];
  } & WithTabId;
  closeCustomEmojiSets: WithTabId | undefined;
  addRecentCustomEmoji: {
    documentId: string;
  };
  clearRecentCustomEmoji: undefined;
  loadFeaturedEmojiStickers: undefined;
  loadDefaultStatusIcons: undefined;
  loadRecentEmojiStatuses: undefined;

  // Bots
  sendBotCommand: {
    command: string;
    chatId?: string;
  } & WithTabId;
  loadTopInlineBots: undefined;
  queryInlineBot: {
    chatId: string;
    username: string;
    query: string;
    offset?: string;
  } & WithTabId;
  sendInlineBotResult: {
    id: string;
    queryId: string;
    messageList: MessageList;
    isSilent?: boolean;
    scheduledAt?: number;
  } & WithTabId;
  resetInlineBot: {
    username: string;
    force?: boolean;
  } & WithTabId;
  resetAllInlineBots: WithTabId | undefined;
  startBot: {
    botId: string;
    param?: string;
  };
  restartBot: {
    chatId: string;
  } & WithTabId;

  clickBotInlineButton: {
    messageId: number;
    button: ApiKeyboardButton;
  } & WithTabId;

  switchBotInline: {
    messageId: number;
    query: string;
    isSamePeer?: boolean;
  } & WithTabId;

  openGame: {
    url: string;
    chatId: string;
    messageId: number;
  } & WithTabId;
  closeGame: WithTabId | undefined;

  requestWebView: {
    url?: string;
    botId: string;
    peerId: string;
    theme?: ApiThemeParameters;
    isSilent?: boolean;
    buttonText: string;
    isFromBotMenu?: boolean;
    startParam?: string;
  } & WithTabId;
  prolongWebView: {
    botId: string;
    peerId: string;
    queryId: string;
    isSilent?: boolean;
    replyToMsgId?: number;
    threadId?: number;
  } & WithTabId;
  requestSimpleWebView: {
    url: string;
    botId: string;
    buttonText: string;
    theme?: ApiThemeParameters;
  } & WithTabId;
  requestAppWebView: {
    botId: string;
    appName: string;
    theme?: ApiThemeParameters;
    startApp?: string;
    isWriteAllowed?: boolean;
  } & WithTabId;
  setWebAppPaymentSlug: {
    slug?: string;
  } & WithTabId;

  cancelBotTrustRequest: WithTabId | undefined;
  markBotTrusted: {
    botId: string;
  } & WithTabId;

  cancelAttachBotInstall: WithTabId | undefined;
  confirmAttachBotInstall: {
    isWriteAllowed: boolean;
  } & WithTabId;

  processAttachBotParameters: {
    username: string;
    filter: ApiChatType[];
    startParam?: string;
  } & WithTabId;
  requestAttachBotInChat: {
    bot: ApiAttachBot;
    filter: ApiChatType[];
    startParam?: string;
  } & WithTabId;
  cancelAttachBotInChat: WithTabId | undefined;

  sendWebViewData: {
    bot: ApiUser;
    data: string;
    buttonText: string;
  };

  loadAttachBots:
    | {
        hash?: string;
      }
    | undefined;

  toggleAttachBot: {
    botId: string;
    isWriteAllowed?: boolean;
    isEnabled: boolean;
  };

  callAttachBot: {
    chatId: string;
    threadId?: ThreadId;
    bot?: ApiAttachBot;
    url?: string;
    startParam?: string;
  } & WithTabId;

  requestBotUrlAuth: {
    chatId: string;
    messageId: number;
    buttonId: number;
    url: string;
  } & WithTabId;

  acceptBotUrlAuth: {
    isWriteAllowed?: boolean;
  } & WithTabId;

  requestLinkUrlAuth: {
    url: string;
  } & WithTabId;

  acceptLinkUrlAuth: {
    isWriteAllowed?: boolean;
  } & WithTabId;

  openCertificateInfo: ActionPayloads['openCertificate'] & WithTabId;
  closeCertificateInfo: WithTabId | undefined;
  openCertificate: {
    id: string;
  };

  openCreateSale: WithTabId | undefined;
  closeCreateSale: WithTabId | undefined;
  getBotList: undefined;
  // Settings
  loadAuthorizations: undefined;
  terminateAuthorization: {
    hash: string;
  };
  terminateAllAuthorizations: undefined;

  loadWebAuthorizations: undefined;
  terminateWebAuthorization: {
    hash: string;
  };
  terminateAllWebAuthorizations: undefined;
  toggleUsername: {
    username: string;
    isActive: boolean;
  };
  sortUsernames: {
    usernames: string[];
  };
  toggleChatUsername: {
    chatId: string;
    username: string;
    isActive: boolean;
  } & WithTabId;
  sortChatUsernames: {
    chatId: string;
    usernames: string[];
  };

  //Loyalty
  getReferralCode: undefined;
  checkReferralCode: undefined;
  saveReferralCode: undefined;
  getReferralUsers: { pagination?: { page: number; per_page: number } };
  activateReferralCode: undefined;
  getUserReferralProgram: undefined;
  getLoyaltyBonusDataWithSum: undefined;
  // Misc
  openPollModal:
    | ({
        isQuiz?: boolean;
      } & WithTabId)
    | undefined;
  closePollModal: WithTabId | undefined;
  requestConfetti:
    | ({
        top: number;
        left: number;
        width: number;
        height: number;
      } & WithTabId)
    | undefined;

  updateAttachmentSettings: {
    shouldCompress?: boolean;
    shouldSendGrouped?: boolean;
  };

  updateArchiveSettings: {
    isMinimized?: boolean;
    isHidden?: boolean;
  };

  openUrl: {
    url: string;
    shouldSkipModal?: boolean;
  } & WithTabId;
  toggleSafeLinkModal: {
    url?: string;
  } & WithTabId;
  closeUrlAuthModal: WithTabId | undefined;
  showNotification: {
    type?: 'error' | 'success' | 'info';
    localId?: string;
    title?: string;
    message: string;
    className?: string;
    actionText?: string;
    action?: CallbackAction;
  } & WithTabId;
  showAllowedMessageTypesNotification: {
    chatId: string;
  } & WithTabId;
  dismissNotification: { localId: string } & WithTabId;

  updatePageTitle: WithTabId | undefined;

  // Calls
  joinGroupCall: {
    chatId?: string;
    id?: string;
    accessHash?: string;
    inviteHash?: string;
  } & WithTabId;
  toggleGroupCallMute:
    | {
        participantId: string;
        value: boolean;
      }
    | undefined;
  toggleGroupCallPresentation:
    | {
        value?: boolean;
      }
    | undefined;
  leaveGroupCall:
    | ({
        isFromLibrary?: boolean;
        shouldDiscard?: boolean;
        shouldRemove?: boolean;
        rejoin?: ActionPayloads['joinGroupCall'];
      } & WithTabId)
    | undefined;

  toggleGroupCallVideo: undefined;
  requestToSpeak:
    | {
        value: boolean;
      }
    | undefined;
  setGroupCallParticipantVolume: {
    participantId: string;
    volume: number;
  };
  toggleGroupCallPanel: ({ force?: boolean } & WithTabId) | undefined;

  createGroupCall: {
    chatId: string;
  } & WithTabId;
  joinVoiceChatByLink: {
    username: string;
    inviteHash: string;
  } & WithTabId;
  subscribeToGroupCallUpdates: {
    subscribed: boolean;
    id: string;
  };
  createGroupCallInviteLink: WithTabId | undefined;

  loadMoreGroupCallParticipants: undefined;
  connectToActiveGroupCall: WithTabId | undefined;

  requestCall: {
    userId: string;
    isVideo?: boolean;
  } & WithTabId;
  sendSignalingData: P2pMessage;
  hangUp: WithTabId | undefined;
  acceptCall: undefined;
  setCallRating: {
    rating: number;
    comment: string;
  } & WithTabId;
  closeCallRatingModal: WithTabId | undefined;
  playGroupCallSound: {
    sound: CallSound;
  };
  connectToActivePhoneCall: undefined;

  // Passcode
  setPasscode: { passcode: string };
  clearPasscode: undefined;
  lockScreen: undefined;
  decryptSession: { passcode: string };
  unlockScreen: { sessionJson: string; globalJson: string };
  softSignIn: undefined;
  logInvalidUnlockAttempt: undefined;
  resetInvalidUnlockAttempts: undefined;
  setPasscodeError: { error: string };
  clearPasscodeError: undefined;
  skipLockOnUnload: undefined;

  // Settings
  loadConfig: undefined;
  loadAppConfig:
    | {
        hash: number;
      }
    | undefined;
  requestNextSettingsScreen: {
    screen?: SettingsScreens;
  } & WithTabId;
  setMiddleScreen: { screen?: MiddleColumnContent } & WithTabId;
  setLeftScreen: { screen?: LeftColumnContent } & WithTabId;
  sortChatFolders: { folderIds: number[] };
  closeDeleteChatFolderModal: WithTabId | undefined;
  openDeleteChatFolderModal: { folderId: number } & WithTabId;
  loadGlobalPrivacySettings: undefined;
  updateGlobalPrivacySettings: { shouldArchiveAndMuteNewNonContact: boolean };
  getPaidSubscriptions: number | undefined;
  getConfirmCodeFromChangeEmail: {
    email: string;
    password?: string;
    newPassword?: string;
  };
  getConfirmCodeFromDeleteAccount: { email: string; password: string };
  changeEmail: { new_email?: string; code: string };
  changePassword: { prev_pass: string; new_pass: string; code: string };
  clearConfirmEmail: undefined;
  setAiPurchases: undefined;
  deleteAccount: {
    code: string;
    reason?: string;
    skipAi?: boolean;
    skipAll?: boolean;
  };
  getInfoBeforeDeletion: undefined;
  // Premium
  openPremiumModal:
    | ({
        initialSection?: string;
        fromUserId?: string;
        toUserId?: string;
        isSuccess?: boolean;
        isGift?: boolean;
        monthsAmount?: number;
      } & WithTabId)
    | undefined;
  closePremiumModal:
    | ({
        isClosed?: boolean;
      } & WithTabId)
    | undefined;

  transcribeAudio: {
    chatId: string;
    messageId: number;
  };

  loadPremiumGifts: undefined;
  loadDefaultTopicIcons: undefined;
  loadPremiumStickers: undefined;
  loadPremiumSetStickers:
    | {
        hash?: string;
      }
    | undefined;

  openGiftPremiumModal:
    | ({
        forUserId?: string;
      } & WithTabId)
    | undefined;

  closeGiftPremiumModal: WithTabId | undefined;
  setEmojiStatus: {
    emojiStatus: ApiSticker;
    expires?: number;
  };

  // Invoice
  openInvoice: ApiInputInvoice & WithTabId;

  // Payment
  validatePaymentPassword: {
    password: string;
  } & WithTabId;
  getConfirmCodeFromWithdraw: {
    payment_id: string;
    wallet_id: number;
    email?: string;
    bank_requisites_id?: number;
  };
  clearWithdrawTemplate: { wallet_id: number; payment_id: string };
  approveWithdraw: {
    wallet_id: number;
    payment_id: string;
    approve_code: string;
    paypal_email?: string;
    bank_withdraw_requisites_id?: number;
    initial_amount?: number;
  };
  withdrawalToWallet: IInternalWithdraw;
  getAiPurchases: undefined;
  subscribeAi: {
    sub_type: AiPurchaseType;
    quantity?: number;
  };
  // Forums
  toggleForum: {
    chatId: string;
    isEnabled: boolean;
  } & WithTabId;
  createTopic: {
    chatId: string;
    title: string;
    iconColor?: number;
    iconEmojiId?: string;
  } & WithTabId;
  loadTopics: {
    chatId: string;
    force?: boolean;
  };
  loadTopicById:
    | {
        chatId: string;
        topicId: number;
      }
    | ({
        chatId: string;
        topicId: number;
        shouldCloseChatOnError?: boolean;
      } & WithTabId);

  deleteTopic: {
    chatId: string;
    topicId: number;
  };

  editTopic: {
    chatId: string;
    topicId: number;
    title?: string;
    iconEmojiId?: string;
    isClosed?: boolean;
    isHidden?: boolean;
  } & WithTabId;

  toggleTopicPinned: {
    chatId: string;
    topicId: number;
    isPinned: boolean;
  } & WithTabId;

  markTopicRead: {
    chatId: string;
    topicId: number;
  };

  updateTopicMutedState: {
    chatId: string;
    topicId: number;
    isMuted: boolean;
  };

  openCreateTopicPanel: {
    chatId: string;
  } & WithTabId;
  closeCreateTopicPanel: WithTabId | undefined;

  openEditTopicPanel: {
    chatId: string;
    topicId: number;
  } & WithTabId;
  closeEditTopicPanel: WithTabId | undefined;

  uploadContactProfilePhoto: {
    userId: string;
    file?: File;
    isSuggest?: boolean;
  } & WithTabId;
}

export enum PaymentStatus {
  connecting,
  processing,
  completed,
  canceled,
}

export type RequiredGlobalState = GlobalState & { _: never };
export type ActionReturnType = GlobalState | void | Promise<void>;
export type TabArgs<T> = T extends RequiredGlobalState
  ? [tabId: number]
  : [tabId?: number | undefined];
