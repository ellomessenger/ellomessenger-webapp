import React, { FC, memo } from 'react';
import { withGlobal } from '../../global';

import type { ApiUser, ApiTypingStatus } from '../../api/types';

import { selectUser } from '../../global/selectors';
import { getUserFirstOrLastName } from '../../global/helpers';
import renderText from './helpers/renderText';

import DotAnimation from './DotAnimation';

import './TypingStatus.scss';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  typingStatus: ApiTypingStatus;
};

type StateProps = {
  typingUser?: ApiUser;
};

const TypingStatus: FC<OwnProps & StateProps> = ({
  typingStatus,
  typingUser,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const typingUserName =
    typingUser && !typingUser.isSelf && getUserFirstOrLastName(typingUser);
  const content = t(typingStatus.action)
    // Fix for translation "{user} is typing"
    .replace('{user}', '')
    .replace('{emoji}', typingStatus.emoji || '')
    .trim();

  return (
    <p className='typing-status' dir={isRtl ? 'rtl' : 'auto'}>
      {typingUserName && (
        <span className='sender-name' dir='auto'>
          {renderText(typingUserName)}
        </span>
      )}
      <DotAnimation content={content} />
    </p>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { typingStatus }): StateProps => {
    if (!typingStatus.userId) {
      return {};
    }

    const typingUser = selectUser(global, typingStatus.userId);

    return { typingUser };
  })(TypingStatus)
);
