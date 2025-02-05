import React, { FC, memo, useCallback, useState } from 'react';

import buildClassName from '../../../util/buildClassName';

import CodeOverlay from './CodeOverlay';

type OwnProps = {
  text: string;
  noCopy?: boolean;
};

const PreBlock: FC<OwnProps> = ({ text, noCopy }) => {
  const [isWordWrap, setWordWrap] = useState(true);

  const handleWordWrapToggle = useCallback(
    (wrap: boolean | ((prevState: boolean) => boolean)) => {
      setWordWrap(wrap);
    },
    []
  );

  const blockClass = buildClassName(
    'text-entity-pre',
    !isWordWrap && 'no-word-wrap'
  );

  return (
    <pre className={blockClass}>
      <div className='pre-code custom-scroll-x'>{text}</div>
      <CodeOverlay
        text={text}
        className='code-overlay'
        onWordWrapToggle={handleWordWrapToggle}
        noCopy={noCopy}
      />
    </pre>
  );
};

export default memo(PreBlock);
