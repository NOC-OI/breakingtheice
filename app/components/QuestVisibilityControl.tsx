import Image from 'next/image';
import { ASSETS } from './assets';

type QuestVisibilityControlProps = {
  onClick: () => void;
};

export function QuestVisibilityControl({ onClick }: QuestVisibilityControlProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-6 top-6 z-40 rounded-[10px] bg-[#0d3352] p-3 shadow-[4px_4px_4px_rgba(255,255,255,0.1)]"
      aria-label="Minimize quest and return to map"
    >
      <span className="flex h-5 w-6 items-center justify-center rounded-xs bg-[#faf7f5] px-1 py-1.5">
        <Image
          src={ASSETS.visibilityHideIcon}
          alt=""
          width={14}
          height={10}
          aria-hidden
          className="h-2.5 w-3.5"
        />
      </span>
    </button>
  );
}
