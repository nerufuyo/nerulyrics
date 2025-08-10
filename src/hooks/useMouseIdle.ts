import { useState, useEffect } from 'react';

export const useMouseIdle = (timeout: number = 4000, isPlaying: boolean = false) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setIsIdle(false);
      return;
    }

    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    
    events.forEach(event => 
      document.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer(); // Start timer

    return () => {
      events.forEach(event => 
        document.removeEventListener(event, resetTimer)
      );
      clearTimeout(idleTimer);
    };
  }, [isPlaying, timeout]);

  return { isIdle, showUI: !isIdle || !isPlaying };
};
