import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../assets/logos/SENZ8Logo.png";
import { cn } from "@workspace/ui/lib/utils";

const BrandLogo = ({
  className,
  imageClassName,
}: {
  className?: string;
  imageClassName?: string;
}) => {
  return (
    <Link href="/" className={cn("relative block w-fit group", className)}>
      <Image
        src={Logo}
        alt="Logo"
        width={100}
        height={100}
        className={cn(
          "w-full h-auto object-contain group-hover:scale-105 transition-transform",
          imageClassName
        )}
      />
    </Link>
  );
};

export default BrandLogo;
