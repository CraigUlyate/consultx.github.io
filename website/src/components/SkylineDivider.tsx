import Image from "next/image";

export function SkylineDivider() {
  return (
    <div className="relative z-10 w-full overflow-hidden bg-white" aria-hidden="true">
      <Image
        src="/assets/johannesburg-skyline.png"
        alt=""
        width={1200}
        height={325}
        className="block h-28 w-full object-cover object-[center_65%] md:h-36"
        priority={false}
      />
    </div>
  );
}
