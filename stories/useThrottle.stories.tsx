import React, {useCallback, useState} from 'react';
import {useThrottle} from '../src/useThrottle';

export default {
  component: useThrottle,
  title: 'Throttle'
}

export const basic = () => {
  const [value, setValue] = useState();
  const handleInput = useCallback((ev) => {
    setValue(ev.target.value);
  }, []);
  const throttled = useThrottle(handleInput, 5000);

  return <>
    <div>throttle: <input type="text" onChange={throttled} /></div>
    <div>Value: {value}</div>
  </>
}
