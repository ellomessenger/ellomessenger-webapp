import { ApiPrivacySettings } from '../../types';
import {
  ApiGeoPoint,
  ApiReaction,
  ApiReactionCount,
  ApiStoryForwardInfo,
  MediaContent,
} from './messages';

export type ApiMessageStoryData = {
  id: number;
  peerId: string;
  isMention?: boolean;
};

export interface ApiStory {
  '@type'?: 'story';
  id: number;
  peerId: string;
  date: number;
  expireDate: number;
  content: MediaContent;
  isPinned?: boolean;
  isEdited?: boolean;
  isForCloseFriends?: boolean;
  isForContacts?: boolean;
  isForSelectedContacts?: boolean;
  isPublic?: boolean;
  isOut?: true;
  noForwards?: boolean;
  views?: ApiStoryViews;
  visibility?: ApiPrivacySettings;
  sentReaction?: ApiReaction;
  mediaAreas?: ApiMediaArea[];
  forwardInfo?: ApiStoryForwardInfo;
}

export interface ApiStorySkipped {
  '@type'?: 'storySkipped';
  id: number;
  peerId: string;
  isForCloseFriends?: boolean;
  date: number;
  expireDate: number;
}

export type ApiStoryView = {
  userId: string;
  date: number;
  reaction?: ApiReaction;
  isUserBlocked?: true;
  areStoriesBlocked?: true;
};

export interface ApiStoryViews {
  viewsCount?: number;
  forwardsCount?: number;
  reactionsCount?: number;
  reactions?: ApiReactionCount[];
  recentViewerIds?: string[];
}

export type ApiMediaAreaCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type ApiWebPageStoryData = {
  id: number;
  peerId: string;
};

export type ApiMediaAreaVenue = {
  type: 'venue';
  coordinates: ApiMediaAreaCoordinates;
  geo: ApiGeoPoint;
  title: string;
};

export type ApiMediaAreaGeoPoint = {
  type: 'geoPoint';
  coordinates: ApiMediaAreaCoordinates;
  geo: ApiGeoPoint;
};

export type ApiMediaAreaSuggestedReaction = {
  type: 'suggestedReaction';
  coordinates: ApiMediaAreaCoordinates;
  reaction: ApiReaction;
  isDark?: boolean;
  isFlipped?: boolean;
};

export type ApiStealthMode = {
  activeUntil?: number;
  cooldownUntil?: number;
};

export type ApiMediaArea =
  | ApiMediaAreaVenue
  | ApiMediaAreaGeoPoint
  | ApiMediaAreaSuggestedReaction;

export interface ApiStoryDeleted {
  '@type'?: 'storyDeleted';
  id: number;
  peerId: string;
  isDeleted: true;
}

export type ApiTypeStory = ApiStory | ApiStorySkipped | ApiStoryDeleted;

export type ApiPeerStories = {
  byId: Record<number, ApiTypeStory>;
  orderedIds: number[]; // Actual peer stories
  pinnedIds: number[]; // Profile Shared Media: Pinned Stories tab
  archiveIds?: number[]; // Profile Shared Media: Archive Stories tab
  lastUpdatedAt?: number;
  lastReadId?: number;
};
