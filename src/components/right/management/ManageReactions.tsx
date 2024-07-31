import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import type {
  ApiAvailableReaction,
  ApiChat,
  ApiChatReactions,
  ApiReaction,
} from '../../../api/types';

import { isChatChannel, isSameReaction } from '../../../global/helpers';
import { selectChat } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';

import ReactionStaticEmoji from '../../common/ReactionStaticEmoji';
import Checkbox from '../../ui/Checkbox';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Spinner from '../../ui/Spinner';
import RadioGroup from '../../ui/RadioGroup';
import { useTranslation } from 'react-i18next';
import Switcher from '../../ui/Switcher';

type OwnProps = {
  chatId: string;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat?: ApiChat;
  availableReactions?: ApiAvailableReaction[];
  enabledReactions?: ApiChatReactions;
  isChannel?: boolean;
};

const ManageReactions: FC<OwnProps & StateProps> = ({
  availableReactions,
  enabledReactions,
  chat,
  isActive,
  onClose,
  isChannel,
}) => {
  const { setChatEnabledReactions, loadAvailableReactions } = getActions();

  const { t } = useTranslation();
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localEnabledReactions, setLocalEnabledReactions] = useState<
    ApiChatReactions | undefined
  >(enabledReactions);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const reactionsOptions = useMemo(
    () => [
      {
        value: 'all',
        label: t('Reactions.AllReactions'),
      },
      {
        value: 'some',
        label: t('Reactions.Some'),
      },
      {
        value: 'none',
        label: t('Reactions.No'),
      },
    ],
    []
  );

  const handleSaveReactions = useCallback(() => {
    if (!chat) return;
    setIsLoading(true);

    setChatEnabledReactions({
      chatId: chat.id,
      enabledReactions: localEnabledReactions,
    });
  }, [chat, localEnabledReactions, setChatEnabledReactions]);

  useEffect(() => {
    setIsLoading(false);
    setIsTouched(false);
    setLocalEnabledReactions(enabledReactions);
  }, [enabledReactions]);

  const availableActiveReactions = useMemo<ApiAvailableReaction[] | undefined>(
    () => availableReactions?.filter(({ isInactive }) => !isInactive),
    [availableReactions]
  );

  const handleReactionsOptionChange = useCallback(
    (value: string) => {
      if (value === 'all') {
        setLocalEnabledReactions({ type: 'all' });
      } else if (value === 'some') {
        setLocalEnabledReactions({
          type: 'some',
          allowed:
            enabledReactions?.type === 'some' ? enabledReactions.allowed : [],
        });
      } else {
        setLocalEnabledReactions(undefined);
      }
      setIsTouched(true);
    },
    [enabledReactions]
  );

  const handleReactionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!chat || !availableActiveReactions) return;

      const { name, checked } = e.currentTarget;
      if (localEnabledReactions?.type === 'some') {
        const reaction = { emoticon: name } as ApiReaction;
        if (checked) {
          setLocalEnabledReactions({
            type: 'some',
            allowed: [...localEnabledReactions.allowed, reaction],
          });
        } else {
          setLocalEnabledReactions({
            type: 'some',
            allowed: localEnabledReactions.allowed.filter(
              (local) => !isSameReaction(local, reaction)
            ),
          });
        }
      }
      setIsTouched(true);
    },
    [availableActiveReactions, chat, localEnabledReactions]
  );

  const handleToggleReactions = useCallback(() => {
    if (localEnabledReactions?.type === 'some') {
      if (localEnabledReactions?.allowed.length > 0) {
        setLocalEnabledReactions({
          type: 'some',
          allowed: [],
        });
      } else {
        const newArr: ApiReaction[] = [];
        availableActiveReactions?.map(({ reaction }) =>
          newArr.push({ emoticon: reaction.emoticon })
        );
        setLocalEnabledReactions({
          type: 'some',
          allowed: newArr,
        });
      }
    }
    setIsTouched(true);
  }, [localEnabledReactions, availableActiveReactions]);

  useEffect(() => {
    if (isChannel) {
      setLocalEnabledReactions({
        type: 'some',
        allowed:
          enabledReactions?.type === 'some' ? enabledReactions.allowed : [],
      });
    }
  }, [isChannel]);

  useEffect(() => {
    loadAvailableReactions();
  }, []);

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section permission-list'>
          {isChannel ? (
            <div className='row'>
              <span className='label'>{t('Reactions.Enable')}</span>
              <div className='switcher-wrap' role='button'>
                <Switcher
                  name='reactions'
                  label={t('Reactions.Enable')}
                  color='reverse'
                  has_icon
                  checked={
                    localEnabledReactions?.type === 'some' &&
                    !!localEnabledReactions?.allowed.length
                  }
                  onChange={handleToggleReactions}
                />
              </div>
            </div>
          ) : (
            <>
              <h4 className='section-heading'>{t('Reactions.Available')}</h4>
              <RadioGroup
                selected={localEnabledReactions?.type || 'none'}
                name='reactions'
                options={reactionsOptions}
                onChange={handleReactionsOptionChange}
                size='smaller'
                className='underline radio-right'
              />
            </>
          )}
        </div>
        <p className='section-info'>
          {!isChannel &&
            localEnabledReactions?.type === 'all' &&
            t('Reactions.AllInfo')}
          {!isChannel &&
            localEnabledReactions?.type === 'some' &&
            t('Reactions.SomeInfo')}
          {!isChannel && !localEnabledReactions && t('Reactions.NoInfo')}
          {isChannel && t('Reactions.ChannelInfo')}
        </p>
        {localEnabledReactions?.type === 'some' && (
          <div className='section permission-list'>
            {!isChannel && (
              <h3 className='section-heading'>{t('Reactions.Available')}</h3>
            )}
            {availableActiveReactions?.map(({ reaction, title }) => (
              <div className='row row-not-wrap'>
                <span className='label'>
                  <ReactionStaticEmoji
                    reaction={reaction}
                    availableReactions={availableReactions}
                  />
                  {title}
                </span>
                <div className='switcher-wrap' role='button'>
                  <Switcher
                    name={reaction.emoticon}
                    label={title}
                    color='reverse'
                    has_icon
                    checked={localEnabledReactions?.allowed.some((r) =>
                      isSameReaction(reaction, r)
                    )}
                    onChange={handleReactionChange}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingActionButton
        isShown={isTouched}
        onClick={handleSaveReactions}
        ariaLabel={String(t('Save'))}
        disabled={isLoading}
      >
        {isLoading ? <Spinner color='white' /> : <i className='icon-check' />}
      </FloatingActionButton>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId)!;
    const isChannel = isChatChannel(chat);
    return {
      isChannel,
      enabledReactions: chat.fullInfo?.enabledReactions,
      availableReactions: global.availableReactions,
      chat,
    };
  })(ManageReactions)
);
