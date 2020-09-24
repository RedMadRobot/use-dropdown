import {useEffect} from 'react';

export const useEvent = <T extends EventListener>(
  elements: Array<HTMLElement>,
  event: string,
  callback: T,
  capture = false,
  enabled = true,
) => {
  return useEffect(() => {
    if (!enabled) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(event, callback, capture);
    }

    elements.forEach(el => {
      el.addEventListener(event, callback, capture);
    });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(event, callback, capture)
      }

      elements.forEach(el => {
        el.removeEventListener(event, callback, capture);
      })
    }

  }, [elements, event, callback, capture, enabled])
}
