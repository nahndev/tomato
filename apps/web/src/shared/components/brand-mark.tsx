import Image from "next/image";

export function BrandMark({ size = 36 }: { size?: number }) {
  return <Image src="/logo.svg" alt="" width={size} height={size} priority />;
}
