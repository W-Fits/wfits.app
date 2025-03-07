"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children, className }: {
  href: string
  children: React.ReactNode;
  className?: string
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors",
        "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
        isActive ? "text-primary" : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}