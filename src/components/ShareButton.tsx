"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    // On phones/tablets this opens the native share sheet (WhatsApp, Messages,
    // Mail, etc. all show up there automatically). Desktop browsers mostly
    // don't support it, so fall back to a small menu with direct links.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // User closed the share sheet — nothing to do.
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — ignore, the menu links still work.
    }
  }

  function shareLinks() {
    const url = window.location.href;
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title)}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    };
  }

  return (
    <div className="relative">
      <button type="button" onClick={handleClick} className="btn-secondary w-full">
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            <a
              href={shareLinks().whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              WhatsApp
            </a>
            <a
              href={shareLinks().facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Facebook
            </a>
            <a
              href={shareLinks().x}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              X / Twitter
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {copied ? "Link copied!" : "Copy link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
