import {useCallback, useRef, useState} from 'react';

export const useThrottle = (callback, delay) => {
  const lastCall = useRef<number>(0);

  return useCallback((...args) => {
    if (lastCall.current + delay < Date.now()) {
      callback(...args);
      lastCall.current = Date.now();
    }
  }, []);
}
