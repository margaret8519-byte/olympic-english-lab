"use client";

import { useEffect } from "react";

const selector = "img[src],audio[src],video[src],source[src]";

export default function BasePathAssetFix() {
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    if (!basePath) return;

    const fix = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const src = element.getAttribute("src");
        if (src && src.startsWith("/") && !src.startsWith(`${basePath}/`) && !src.startsWith("//")) {
          element.setAttribute("src", `${basePath}${src}`);
        }
      });
    };

    fix(document);
    const observer = new MutationObserver(() => fix(document));
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
