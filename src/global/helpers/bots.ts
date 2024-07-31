import type { ApiPhoto } from '../../api/types';
import { GlobalState } from '../types';

export function getBotCoverMediaHash(photo: ApiPhoto) {
  return `photo${photo.id}?size=x`;
}

export function isBotSpace(global: GlobalState, chatId: string) {
  return global.chats.listIds.bots?.includes(chatId);
}
