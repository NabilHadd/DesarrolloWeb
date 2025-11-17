import { useEffect, useState } from 'react';

export function useTypewriter(text = '', isActive = false, speed = 12, delay = 0) {
  const [rendered, setRendered] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setRendered(text);
      return undefined;
    }

    let index = 0;
    let intervalId;
    const timeoutId = setTimeout(() => {
      setRendered('');
      intervalId = setInterval(() => {
        index += 1;
        setRendered(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, isActive, speed, delay]);

  return isActive ? rendered : text;
}
