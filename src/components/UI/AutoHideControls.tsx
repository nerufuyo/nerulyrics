import React from 'react';
import { useMouseIdle } from '../../hooks/useMouseIdle';

interface AutoHideControlsProps {
  isPlaying: boolean;
  children: React.ReactNode;
  timeout?: number;
  className?: string;
}

export const AutoHideControls: React.FC<AutoHideControlsProps> = ({
  isPlaying,
  children,
  timeout = 4000,
  className = '',
}) => {
  const { showUI } = useMouseIdle(timeout, isPlaying);

  return (
    <div
      className={`ui-transition ${
        showUI ? 'ui-visible' : 'ui-hidden'
      } ${className}`}
    >
      {children}
    </div>
  );
};
