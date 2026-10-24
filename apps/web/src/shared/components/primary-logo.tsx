import Image from "next/image";
import { BrandMark } from "./brand-mark";

export function PrimaryLogo() {
  return (
    <>
      <BrandMark />
      <Image src="/logo-bar.svg" alt="" width={134} height={36} priority />
    </>
  );
}
