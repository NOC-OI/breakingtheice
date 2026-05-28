'use client';

import { useEffect, useRef, useState } from 'react';
import { FiEye } from 'react-icons/fi';

type QuestVisibilityControlProps = {
  onClick: () => void;
};

export function QuestVisibilityControl({ onClick }: QuestVisibilityControlProps) {
  const hideButtonTimerRef = useRef<number | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    return () => {
      if (hideButtonTimerRef.current) {
        window.clearTimeout(hideButtonTimerRef.current);
      }
    };
  }, []);

  function handleHideClick() {
    if (hideButtonTimerRef.current) {
      window.clearTimeout(hideButtonTimerRef.current);
    }

    setIsPressing(true);
    hideButtonTimerRef.current = window.setTimeout(() => {
      onClick();
      setIsPressing(false);
    }, 140);
  }

  return (
    <button
      type="button"
      onClick={handleHideClick}
      className={`cursor-pointer absolute right-6 top-6 z-40 rounded-[10px] bg-[#0d3352] hover:bg-[#0b2a44] p-4 shadow-[4px_4px_4px_rgba(255,255,255,0.1)] transition-transform duration-200 active:scale-[0.98] ${
        isPressing ? 'scale-105' : 'scale-100'
      }`}
      aria-label="Minimize quest and return to map"
      title="Minimize quest and return to map"
    >
      <span className="flex h-5 w-6 items-center justify-center rounded-xs bg-[#faf7f5] text-[#0d3352]">
        <FiEye aria-hidden className="h-4 w-4" />
      </span>
    </button>
  );
}
