import Image from "next/image";
import clsx from "clsx";

type LogoProps = {
  /** "light" = white wordmark for dark bands; "teal" = full-colour logo for bone/paper grounds. */
  variant?: "teal" | "light";
  className?: string;
};

/** The studio's official logo, trimmed from the client's logo docket
 * (assets/Studio Envelope_Logo Docket.zip). Files live in public/brand. */
export default function Logo({ variant = "teal", className }: LogoProps) {
  return (
    <Image
      src={variant === "light" ? "/brand/logo-on-dark.png" : "/brand/logo-color.png"}
      alt="Studio Envelope"
      width={1200}
      height={406}
      sizes="140px"
      priority
      className={clsx("h-10 w-auto sm:h-11", className)}
    />
  );
}
