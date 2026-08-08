import Image from "next/image";

export function SkylineDivider() {
  return (
    <div className="relative z-10 -mb-6 w-full overflow-hidden bg-white md:-mb-8" aria-hidden="true">
      <Image
        src="/assets/johannesburg-skyline.png"
        alt=""
        width={1200}
        height={305}
        className="block h-20 w-full object-cover object-bottom md:h-28"
        priority={false}
      />
    </div>
  );
}
