import { ApiPeerStories, ApiTypeStory } from '../../api/types';
import { getCurrentTabId } from '../../util/establishMultitabRole';
import { GlobalState, TabArgs } from '../types';
import { selectTabState } from './tabs';

export function selectCurrentViewedStory<T extends GlobalState>(
  global: T,
  ...[tabId = getCurrentTabId()]: TabArgs<T>
) {
  const {
    storyViewer: { peerId, storyId },
  } = selectTabState(global, tabId);

  return { peerId, storyId };
}

export function selectPeerStories<T extends GlobalState>(
  global: T,
  peerId: string
): ApiPeerStories | undefined {
  return global.stories.byPeerId[peerId];
}

export function selectPeerStory<T extends GlobalState>(
  global: T,
  peerId: string,
  storyId: number
): ApiTypeStory | undefined {
  return selectPeerStories(global, peerId)?.byId[storyId];
}
