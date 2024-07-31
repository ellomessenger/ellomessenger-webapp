import React, { FC, memo } from 'react';
import type { OwnProps } from './Certificate';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';
import Certificate from './Certificate';

const CertificateAsync: FC<OwnProps> = (props) => {
  const CreateCertificate = useModuleLoader(Bundles.Extra, 'Certificate');

  return CreateCertificate ? <Certificate {...props} /> : <Loading />;
};

export default memo(CertificateAsync);
