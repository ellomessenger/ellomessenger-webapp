import React, { FC, memo, useCallback, useState } from 'react';

import { ApiMessageEntityTypes } from '../../../api/types';
import classNames from 'classnames';
import useAsync from '../../../hooks/useAsync';

import PreBlock from './PreBlock';
import CodeOverlay from './CodeOverlay';

import './CodeBlock.scss';

export type OwnProps = {
  text: string;
  language?: string;
  noCopy?: boolean;
};

const CodeBlock: FC<OwnProps> = ({ text, language, noCopy }) => {
  const [isWordWrap, setWordWrap] = useState(true);

  const { result: highlighted } = useAsync(() => {
    if (!language) return Promise.resolve(undefined);
    return import('../../../util/highlightCode').then((lib) =>
      lib.default(text, language)
    );
  }, [language, text]);

  const handleWordWrapToggle = useCallback(
    (wrap: boolean | ((prevState: boolean) => boolean)) => {
      setWordWrap(wrap);
    },
    []
  );

  if (!highlighted) {
    return <PreBlock text={text} noCopy={noCopy} />;
  }

  const blockClass = classNames('code-block', { 'no-word-wrap': !isWordWrap });

  return (
    <pre
      className={blockClass}
      data-entity-type={ApiMessageEntityTypes.Pre}
      data-language={language}
    >
      {highlighted}
      <CodeOverlay
        text={text}
        className='code-overlay'
        onWordWrapToggle={handleWordWrapToggle}
        noCopy={noCopy}
      />
    </pre>
  );
};

export default memo(CodeBlock);
