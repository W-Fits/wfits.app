"use client";

import { isNavHidden } from "@/lib/paths";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  const showNavbar = isNavHidden(pathname);

  const tabs = [
    { href: "/", label: "Home" },
    { href: "/wardrobe", label: "Wardrobe" },
    { href: "/profile", label: "Profile" }
  ];

  return showNavbar && (
    <nav
      className={cn(
        "fixed bottom-5 mx-auto left-1/2 transform -translate-x-1/2 bg-background",
        "flex gap-3 items-center border px-2 py-2 rounded-full shadow-sm",
      )}
    >
      {tabs.map((tab, index) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex flex-col items-center px-2 py-1 min-w-16 rounded-3xl transition duration-100",
            (
              (pathname.startsWith("/" + tab.href.split("/")[1]) && tab.href !== "/") ||
              pathname === tab.href
            ) && "text-background bg-primary",
          )}
          prefetch
        >
          <span className="text-sm">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}