import {useEffect} from 'react';

interface EventListenable {
  addEventListener: any;
  removeEventListener: any;
}

export const useEvent = <T extends EventListener>(
  elements: Array<EventListenable>,
  event: string,
  callback: T,
  capture = false,
  enabled = true,
) => {
  return useEffect(() => {
    if (!enabled) {
      return;
    }

    elements.forEach(el => {
      if (el) {
        el.addEventListener(event, callback, capture);
      }
    });

    return () => {
      elements.forEach(el => {
        if (el) {
          el.removeEventListener(event, callback, capture);
        }
      })
    }

  }, [elements, event, callback, capture])
}
