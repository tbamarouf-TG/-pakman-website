import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

export function Intro({ onDone, tagline }: { onDone: () => void; tagline: string }) {
  const [stage, setStage] = useState(0); // 0 small logo, 1 full logo, 2 tagline, 3 fading out

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const done = setTimeout(onDone, 250);
      return () => clearTimeout(done);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const timing = isMobile
      ? { fullLogo: 280, tagline: 620, fade: 1450, done: 1900 }
      : { fullLogo: 420, tagline: 960, fade: 1980, done: 2500 };

    const t1 = setTimeout(() => setStage(1), timing.fullLogo);
    const t2 = setTimeout(() => setStage(2), timing.tagline);
    const t3 = setTimeout(() => setStage(3), timing.fade);
    const t4 = setTimeout(() => onDone(), timing.done);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      data-pakman-intro="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal text-canvas transition-opacity duration-500"
      style={{ opacity: stage === 3 ? 0 : 1, pointerEvents: stage === 3 ? "none" : "auto" }}
      aria-hidden="true"
    >
      <div className="flex w-full max-w-[min(78vw,560px)] flex-col items-center gap-6 px-6">
        <div
          className="relative flex min-h-24 items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: stage >= 0 ? 1 : 0 }}
        >
          <Logo
            className="logo-on-dark absolute h-24 w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: stage === 0 ? 1 : 0,
              transform: stage === 0 ? "scale(1)" : "scale(0.9)",
            }}
          />
          <Logo
            className="logo-on-dark h-36 w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-44"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "translateY(0) scale(1)" : "translateY(8px) scale(0.97)",
            }}
          />
        </div>
        <p
          className="text-center text-[10px] uppercase tracking-[0.34em] text-warm-gray transition-all duration-500"
          style={{
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {tagline}
        </p>
      </div>
    </div>
  );
}
