import React, {
  FC,
  useCallback,
  UIEvent,
  RefObject,
  useRef,
  useMemo,
} from 'react';
import { debounce } from '../../util/schedulers';

type OwnProps = {
  elRef?: RefObject<HTMLDivElement>;
  className?: string;
  children: React.ReactNode;
  offset?: number;
  onLoadMore?: () => void;
};

const Pagination: FC<OwnProps> = ({
  children,
  className,
  elRef,
  offset = 0,
  onLoadMore,
}) => {
  let containerRef = useRef<HTMLDivElement>(null);
  if (elRef) {
    containerRef = elRef;
  }

  const loadMoreBackwards = useMemo(() => {
    if (!onLoadMore) {
      return;
    }

    return debounce(
      () => {
        onLoadMore();
      },
      1000,
      true,
      false
    );
  }, [onLoadMore]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const container = containerRef.current!;

      const { scrollTop, scrollHeight, offsetHeight } = container;

      const bottom = scrollHeight - scrollTop <= offsetHeight + offset;

      if (bottom && loadMoreBackwards) {
        loadMoreBackwards();
      }
    },
    [containerRef]
  );

  return (
    <div ref={containerRef} className={className} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export default Pagination;
