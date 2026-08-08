import Image from "next/image";
import Link from "next/link";

type ConsultXLogoProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function ConsultXLogo({ className = "", variant = "dark" }: ConsultXLogoProps) {
  const src =
    variant === "light" ? "/assets/consultx-logo-white.png" : "/assets/consultx-logo.png";

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="ConsultX home"
    >
      <Image
        src={src}
        alt="ConsultX"
        width={300}
        height={148}
        className="h-10 w-auto object-contain md:h-12"
        priority
      />
    </Link>
  );
}
