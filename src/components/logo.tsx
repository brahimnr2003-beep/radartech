import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-[9px] font-display text-[1.15rem] font-bold tracking-[0.02em]"
    >
      <span
        aria-hidden="true"
        className="size-[9px] rounded-full bg-orange shadow-[0_0_10px_var(--color-glow)] motion-safe:animate-blip"
      />
      RadarTech
    </Link>
  );
}
