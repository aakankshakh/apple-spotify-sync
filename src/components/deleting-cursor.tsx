import { useRef } from "react";

const DELETE_AFTER_MS = 3250;

export default function DeletingCursor() {
  const cursorRef = useRef<HTMLHeadingElement>(null);
  setTimeout(() => {
    if (cursorRef.current) {
      cursorRef.current.remove();
    }
  }, DELETE_AFTER_MS);

  return (
    <h1
      className="text-6xl inline-flex h-[40px] leading-[36px] font-bold animate-[pulse_0.5s_ease-in-out_infinite]"
      ref={cursorRef}
    >
      |
    </h1>
  );
}
