import Link from "next/link";

type ConsultXLogoProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function ConsultXLogo({ className = "", variant = "dark" }: ConsultXLogoProps) {
  const word = variant === "light" ? "text-white" : "text-consultx-black";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="ConsultX home">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <path d="M8 8 L17 17 L8 26" stroke="#111111" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M26 8 L17 17 L26 26" stroke="#72C600" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M22 6 L28 4 L26 10" fill="#72C600" />
      </svg>
      <span className={`text-[1.35rem] font-extrabold tracking-tight ${word}`}>
        CONSULT<span className="text-consultx-green">.X</span>
      </span>
    </Link>
  );
}
