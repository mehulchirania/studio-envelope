import Image from "next/image";
import clsx from "clsx";
import { site } from "@/lib/site";

type LogoProps = { wordmark?: boolean; size?: "sm" | "md" | "lg"; className?: string; inverse?: boolean };
const sizes = { sm: 72, md: 88, lg: 120 };
export default function Logo({ size = "md", className }: LogoProps) {
  const dimension = sizes[size];
  return <Image src={site.logo} alt="Studio Envelope" width={dimension} height={dimension} className={clsx("studio-official-logo", className)} priority={size === "sm"} />;
}
