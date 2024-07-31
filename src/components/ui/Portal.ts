import { FC, ReactNode, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

type OwnProps = {
  containerId?: string;
  className?: string;
  children: ReactNode;
};

const Portal: FC<OwnProps> = ({ containerId, className, children }) => {
  const elementRef = useRef<HTMLDivElement>();
  if (!elementRef.current) {
    elementRef.current = document.createElement('div');
  }

  useLayoutEffect(() => {
    const container = document.querySelector<HTMLDivElement>(
      containerId || '#portals'
    );
    if (!container) {
      return undefined;
    }

    const element = elementRef.current!;
    if (className) {
      element.classList.add(className);
    }

    container.appendChild(element);

    return () => {
      ReactDOM.createPortal(undefined, element);
      container.removeChild(element);
    };
  }, [className, containerId]);

  return ReactDOM.createPortal(children, elementRef.current);
};

export default Portal;
