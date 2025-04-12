"use client";

import { isNavHidden } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Route {
  href: string;
  label: string;
}

function NavItem({
  route,
  pathname,
  session,
}: {
  route: Route;
  pathname: string;
  session: Session | null;
}) {
  if (session && route.href === "/profile") {
    route.href += "/" + session.user.name;
  }

  return (
    <Link
      key={route.href}
      href={route.href}
      className={cn(
        "flex flex-col items-center px-2 py-1 min-w-16 rounded-3xl transition duration-100",
        (
          (pathname.startsWith("/" + route.href.split("/")[1]) && route.href !== "/") ||
          pathname === route.href
        ) && "text-background bg-primary",
      )}
      prefetch
    >
      <span className="text-sm">{route.label}</span>
    </Link>
  );
}

export function NavBar({
  routes,
  session
}: {
  routes: Route[],
  session: Session | null
}) {
  const pathname = usePathname();
  const showNavBar = !isNavHidden(pathname);

  return showNavBar && (
    <nav
      className={cn(
        "fixed bottom-5 mx-auto left-1/2 transform -translate-x-1/2 bg-background",
        "flex gap-3 items-center border px-2 py-2 rounded-full shadow-sm",
      )}
    >
      {routes.map((route) => (
        <NavItem
          key={route.href}
          route={route}
          pathname={pathname}
          session={session}
        />
      ))}
    </nav>
  )
}