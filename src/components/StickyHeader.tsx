"use client";

import { useEffect, useRef } from "react";

// Known in-app browser webviews that mishandle position:fixed + viewport
// resizing when their own toolbar chrome shows/hides on scroll.
const IN_APP_BROWSER_PATTERN =
  /Telegram|Instagram|FBAN|FBAV|Line\/|MicroMessenger|TikTok|Twitter|Snapchat/i;

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  if (IN_APP_BROWSER_PATTERN.test(navigator.userAgent || "")) return true;
  // Telegram's iOS in-app browser injects this proxy even when the UA
  // string itself gives no indication it's Telegram.
  if ("TelegramWebviewProxy" in window || "TelegramWebviewProxyProto" in window) return true;
  return false;
}

/**
 * Wraps the site header in `position: fixed`, corrected with the
 * visualViewport API for browsers that support it well (Safari, Chrome).
 *
 * Known in-app browsers (Telegram, Instagram, etc.) handle fixed
 * positioning unreliably no matter what CSS/JS tricks are applied, because
 * their own toolbar chrome resizes the viewport in ways that don't map
 * cleanly onto visualViewport events. For those specifically, we drop back
 * to a normal, non-fixed header — it can't "float" or detach mid-scroll if
 * it was never taken out of the page's normal flow to begin with.
 */
export default function StickyHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isInAppBrowser()) {
      document.documentElement.classList.add("in-app-browser");
      return;
    }

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
