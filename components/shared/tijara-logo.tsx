import Image from "next/image";
import { cn } from "@/lib/utils";

type TijaraLogoProps = {
  className?: string;
  priority?: boolean;
  /** Stronger depth shadow — best on the hero background */
  enhanced?: boolean;
};

const LOGO_3D =
  "drop-shadow-[0_1px_0_rgba(255,255,255,0.22)] drop-shadow-[0_2px_1px_rgba(11,61,36,0.85)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]";

const LOGO_3D_SUBTLE =
  "drop-shadow-[0_1px_0_rgba(255,255,255,0.14)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.32)]";

export function TijaraLogo({
  className,
  priority,
  enhanced = false,
}: TijaraLogoProps) {
  return (
    <Image
      src="/pictures/logo.png"
      alt="TIJARA"
      width={849}
      height={271}
      unoptimized
      className={cn(
        "h-auto w-auto",
        enhanced ? LOGO_3D : LOGO_3D_SUBTLE,
        className
      )}
      priority={priority}
    />
  );
}
