import type { CSSProperties } from "react";

export const pakmanLogoSrc = "/assets/brand/pakman-logo.png";

export function Logo({
  className = "h-8 w-auto",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img src={pakmanLogoSrc} alt="Pakman Packaging Solutions" className={className} style={style} />
  );
}
