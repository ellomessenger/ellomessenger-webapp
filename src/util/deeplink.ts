import { getActions } from '../global';

import type { ApiChatType } from '../api/types';

import { API_CHAT_TYPES } from '../config';
import { IS_SAFARI } from './windowEnvironment';

type DeepLinkMethod =
  | 'resolve'
  | 'login'
  | 'passport'
  | 'settings'
  | 'join'
  | 'addstickers'
  | 'addemoji'
  | 'setlanguage'
  | 'addtheme'
  | 'confirmphone'
  | 'socks'
  | 'proxy'
  | 'privatepost'
  | 'bg'
  | 'share'
  | 'msg'
  | 'msg_url'
  | 'invoice'
  | 'referral';

export const processDeepLink = (url: string, isAuth?: boolean) => {
  const { protocol, searchParams, pathname, hostname, search } = new URL(url); //.replace(/&+/g, '')

  if (protocol !== 'ello:') return;

  const {
    openChatByInvite,
    openChatByUsername,
    openChatByPhoneNumber,
    openStickerSet,
    focusMessage,
    joinVoiceChatByLink,
    openInvoice,
    processAttachBotParameters,
    openChatWithDraft,
    addReferralCode,
  } = getActions();

  // Safari thinks the path in tg://path links is hostname for some reason
  const method = (IS_SAFARI ? hostname : pathname).replace(
    /^\/\//,
    ''
  ) as DeepLinkMethod;
  const params = Object.fromEntries(searchParams);

  if (method === 'referral') {
    const { code } = params;
    addReferralCode({ code });
  }

  if (!isAuth) return;

  switch (method) {
    case 'resolve': {
      const {
        domain,
        phone,
        post,
        comment,
        voicechat,
        livestream,
        start,
        startattach,
        attach,
        thread,
        topic,
        code,
      } = params;

      const startAttach =
        params.hasOwnProperty('startattach') && !startattach
          ? true
          : startattach;
      const choose = parseChooseParameter(params.choose);
      const threadId = Number(thread) || Number(topic) || undefined;

      if (domain !== 'telegrampassport') {
        if (startAttach && choose) {
          processAttachBotParameters({
            username: domain,
            filter: choose,
            ...(typeof startAttach === 'string' && { startParam: startAttach }),
          });
        } else if (
          params.hasOwnProperty('voicechat') ||
          params.hasOwnProperty('livestream')
        ) {
          joinVoiceChatByLink({
            username: domain,
            inviteHash: voicechat || livestream,
          });
        } else if (phone) {
          openChatByPhoneNumber({ phoneNumber: phone, startAttach, attach });
        } else {
          const convertDomain = domain.replace('/', '').split('/');

          openChatByUsername({
            username: convertDomain[0],
            messageId: convertDomain[1] ? Number(convertDomain[1]) : undefined,
            commentId: comment ? Number(comment) : undefined,
            startParam: start,
            startAttach,
            attach,
            threadId,
          });
        }
      }
      break;
    }
    case 'privatepost': {
      const { post, channel } = params;

      focusMessage({
        chatId: `-${channel}`,
        messageId: Number(post),
      });
      break;
    }
    case 'bg': {
      // const {
      //   slug, color, rotation, mode, intensity, bg_color: bgColor, gradient,
      // } = params;
      break;
    }
    case 'join': {
      const { invite } = params;
      openChatByInvite({
        hash: search.split('+')[1],
      });
      break;
    }
    case 'addemoji':
    case 'addstickers': {
      const { set } = params;

      openStickerSet({
        stickerSetInfo: {
          shortName: set,
        },
      });
      break;
    }
    case 'share':
    case 'msg':
    case 'msg_url': {
      const { url: urlParam, text } = params;
      openChatWithDraft({ text: formatShareText(urlParam, text) });
      break;
    }
    case 'login': {
      // const { code, token } = params;
      break;
    }

    case 'invoice': {
      const { slug } = params;
      openInvoice({ slug });
      break;
    }
    default:
      // Unsupported deeplink

      break;
  }
};

export function parseChooseParameter(choose?: string) {
  if (!choose) return undefined;
  const types = choose.toLowerCase().split(' ');
  return types.filter((type): type is ApiChatType =>
    API_CHAT_TYPES.includes(type as ApiChatType)
  );
}

export function formatShareText(
  url?: string,
  text?: string,
  title?: string
): string {
  return [url, title, text].filter(Boolean).join('\n');
}
