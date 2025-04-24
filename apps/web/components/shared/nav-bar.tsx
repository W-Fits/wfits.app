"use client";

import { isNavHidden } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Route {
  href: string;
  label: string;
  icon: React.ReactNode
}

function NavItem({
  route,
  pathname,
  session,
}: {
  route: Route;
  pathname: string;
  session: Session;
}) {
  if (route.href === "/profile") {
    route.href += "/" + session.user.name;
  }

  const active = (
    (pathname.startsWith("/" + route.href.split("/")[1]) && route.href !== "/") ||
    pathname === route.href
  );

  return (
    <Link
      key={route.href}
      href={route.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-primary",
      )}
      prefetch
    >
      {route.icon}
      <span className="text-sm">{route.label}</span>
    </Link>
  );
}

export function NavBar({
  routes,
  session
}: {
  routes: Route[],
  session: Session
}) {
  const pathname = usePathname();
  const showNavBar = !isNavHidden(pathname);

  return showNavBar && (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background">
      <div className="grid h-16 grid-cols-3">
        {routes.map((route) => (
          <NavItem
            key={route.href}
            route={route}
            pathname={pathname}
            session={session}
          />
        ))}
      </div>
    </nav>
  )
}