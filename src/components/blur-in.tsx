"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

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
  const Component = Tag as ElementType;
  const style = {
    "--blur-in-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <Component className={["blur-in", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </Component>
  );
}
