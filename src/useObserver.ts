import { RefObject, useEffect, useRef } from 'react';

type Props = {
  callback: () => void;
  element: RefObject<HTMLDivElement>;
  ResizeObserver?: typeof ResizeObserver;
};

export const useObserver = ({
  callback,
  element,
  ResizeObserver = window.ResizeObserver,
}: Props) => {
  const current = element && element.current;

  const observer = useRef(null);

  const observe = () => {
    if (element && element.current && observer.current) {
      observer.current.observe(element.current);
    }
  };

  useEffect(() => {
    if (observer && observer.current && current) {
      observer.current.unobserve(current);
    }

    observer.current = new ResizeObserver(callback);
    observe();

    return () => {
      if (observer && observer.current && element && element.current) {
        observer.current.unobserve(element.current);
      }
    };
  }, [current]);
};
