import React, { FC, useCallback } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiUser, ApiContact, ApiCountryCode } from '../../../api/types';
import type { AnimationLevel } from '../../../types';

import { selectUser } from '../../../global/selectors';

import Avatar from '../../common/Avatar';

import './Contact.scss';
import classNames from 'classnames';

type OwnProps = {
  contact: ApiContact;
};

type StateProps = {
  user?: ApiUser;
  phoneCodeList: ApiCountryCode[];
  animationLevel: AnimationLevel;
};

const UNREGISTERED_CONTACT_ID = '0';

const Contact: FC<OwnProps & StateProps> = ({ contact, user }) => {
  const { openChat, openChatByUsername } = getActions();

  const { firstName, lastName, phoneNumber, userId } = contact;
  const isRegistered = userId !== UNREGISTERED_CONTACT_ID;

  const handleClick = useCallback(() => {
    openChatByUsername({ username: phoneNumber.replace('@', '') });
  }, [openChat, phoneNumber]);

  return (
    <div
      className={classNames('Contact', { interactive: isRegistered })}
      onClick={isRegistered ? handleClick : undefined}
    >
      <Avatar size='jumbo' peer={user} text={firstName || lastName} withVideo />
      <div className='contact-info'>
        <div className='contact-name word-break'>{firstName}</div>
        {lastName && <div className='contact-phone word-break'>{lastName}</div>}
      </div>
    </div>
  );
};

export default withGlobal<OwnProps>((global, { contact }): StateProps => {
  const {
    countryList: { phoneCodes: phoneCodeList },
  } = global;
  return {
    user: selectUser(global, contact.userId),
    phoneCodeList,
    animationLevel: global.settings.byKey.animationLevel,
  };
})(Contact);
