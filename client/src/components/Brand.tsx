import { Link } from "wouter";
import { useState } from "react";

type BrandProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  variant?: "default" | "light";
};

const sizeMap = {
  sm: { box: "w-10 h-10", img: "w-10 h-10", title: "text-base" },
  md: { box: "w-12 h-12", img: "w-12 h-12", title: "text-lg" },
  lg: { box: "w-14 h-14", img: "w-14 h-14", title: "text-xl" },
} as const;

export function Brand({ size = "md", showText = true, href = "/", variant = "default" }: BrandProps) {
  const [error, setError] = useState(false);
  const chosen = sizeMap[size];
  
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-foreground";
  const subtitleColor = isLight ? "text-white/80" : "text-muted-foreground";

  const logo = (
    <div className="flex items-center gap-3">
      <div
        className={`${chosen.box} rounded-full bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden`}
      >
        {!error ? (
          <img
            src="/logo.png"
            alt="DS PROMOTORA - Correspondente Bancário"
            className={`${chosen.img} object-contain`}
            onError={() => setError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-primary font-bold">DS</span>
        )}
      </div>
      {showText && (
        <div className="hidden sm:block leading-tight">
          <span className={`${chosen.title} font-bold ${textColor} block`}>DS PROMOTORA</span>
          <span className={`text-xs ${subtitleColor} block`}>Correspondente Bancário</span>
        </div>
      )}
    </div>
  );

  if (!href) return logo;
  return (
    <Link href={href} className="flex items-center gap-3">
      {logo}
    </Link>
  );
}

