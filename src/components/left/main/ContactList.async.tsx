import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';
import type { OwnProps } from './ContactList';

import useModuleLoader from '../../../hooks/useModuleLoader';
import Loading from '../../ui/Loading';
import ContactList from './ContactList';

const ContactListAsync: FC<OwnProps> = (props) => {
  const ContactListModule = useModuleLoader(Bundles.Extra, 'ContactList');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ContactListModule ? <ContactList {...props} /> : <Loading />;
};

export default memo(ContactListAsync);
