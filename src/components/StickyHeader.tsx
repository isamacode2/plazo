"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps the site header in `position: fixed`, but actively corrects its
 * position using the visualViewport API.
 *
 * Why: in-app browsers (Telegram, Instagram, etc.) show/hide their own
 * toolbar chrome as you scroll, which shifts the page's "layout viewport"
 * without the browser reporting it the way Safari/Chrome do. A plain
 * `position: fixed` header ends up drifting or getting scrolled over in
 * those webviews. Tracking `window.visualViewport` and nudging the header
 * with a transform keeps it pinned to the actual visible top of the screen.
 */
export default function StickyHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !ref.current) return;

    const el = ref.current;

    function update() {
      const offset = vv!.offsetTop;
      el.style.transform = offset ? `translateY(${offset}px)` : "";
    }

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-[100] border-b border-gray-200 bg-white [-webkit-transform:translate3d(0,0,0)] [will-change:transform]"
    >
      {children}
    </header>
  );
}
