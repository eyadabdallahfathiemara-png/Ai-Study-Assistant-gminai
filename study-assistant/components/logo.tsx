import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Logo({ name, href = "/", hideName = false }: { name: string; href?: string; hideName?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight" aria-label={name}>
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      <span className={hideName ? "sr-only" : "text-lg"}>{name}</span>
    </Link>
  );
}
