"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
  type ICloud,
  type SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.05, -0.05],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.015,
    minSpeed: 0.006,
    decel: 0.98,
  },
};

export const renderCustomIcon = (icon: SimpleIcon) =>
  renderSimpleIcon({
    icon,
    bgHex: "#07070b",
    fallbackHex: "#ffffff",
    minContrastRatio: 2,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: { preventDefault(): void }) => e.preventDefault(),
    },
  });

export type DynamicCloudProps = {
  iconSlugs: string[];
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const id = useId();
  const [data, setData] = useState<IconData | null>(null);

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;
    return Object.values(data.simpleIcons).map(renderCustomIcon);
  }, [data]);

  return (
    <Cloud {...cloudProps} id={id}>
      <>{renderedIcons}</>
    </Cloud>
  );
}
