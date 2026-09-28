"use client";

import { createElement, type CSSProperties, type ReactNode } from "react";

type BlurInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "p" | "span";
};

export function BlurIn({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: BlurInProps) {
  const style = {
    "--blur-in-delay": `${delay}s`,
  } as CSSProperties;

  return createElement(
    Tag,
    {
      className: ["blur-in", className].filter(Boolean).join(" "),
      style,
    },
    children,
  );
}
