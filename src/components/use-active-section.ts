"use client";

import { useEffect, useState } from "react";

const BAND_MARGIN = "-45% 0px -54% 0px";
const BOTTOM_TOLERANCE = 2;

export function useActiveSection(hrefs: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = hrefs.join("|");

  useEffect(() => {
    const ids = key.split("|").filter(Boolean);
    const elements = ids
      .map((href) => document.getElementById(href.replace(/^#/, "")))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const intersecting = new Set<string>();
    let atBottom = false;

    const update = () => {
      if (atBottom) {
        setActive(ids[ids.length - 1] ?? null);
        return;
      }
      setActive(ids.find((href) => intersecting.has(href)) ?? null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) intersecting.add(href);
          else intersecting.delete(href);
        }
        update();
      },
      { rootMargin: BAND_MARGIN },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const next =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - BOTTOM_TOLERANCE;
      if (next === atBottom) return;
      atBottom = next;
      update();
    };

    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}
