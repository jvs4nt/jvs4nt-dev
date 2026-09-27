export function BrandMark({
  size = 32,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    // Native img keeps the PNG alpha; next/image was flattening it to black.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="JS"
      width={size}
      height={size}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={["select-none", className].filter(Boolean).join(" ")}
    />
  );
}
