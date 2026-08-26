import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageBackdropProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

export default function ImageBackdrop({
  src,
  alt,
  className,
  imageClassName,
  children,
}: ImageBackdropProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={cn("object-cover", imageClassName)}
      />
      {children}
    </div>
  );
}