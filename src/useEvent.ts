import {useEffect} from 'react';
import {useThrottle} from './useThrottle';

export const useEvent = <T extends EventListener>(
  elements: Array<HTMLElement>,
  event: string,
  callback: T,
  capture = false,
  enabled = true,
) => {
  const throttled = useThrottle(callback, 10  );

  useEffect(() => {
    if (!enabled) {
      return;
    }


    if (typeof window !== 'undefined') {
      window.addEventListener(event, throttled, capture);
    }

    elements.forEach(el => {
      el.addEventListener(event, throttled, capture);
    });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(event, throttled, capture)
      }

      elements.forEach(el => {
        el.removeEventListener(event, throttled, capture);
      })
    }

  }, [elements, event, callback, capture, enabled])
}
