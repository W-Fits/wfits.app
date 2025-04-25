"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

function formatBreadcrumbLabel(label: string): string {
  return label
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  const paths = pathname.split("/").filter(Boolean);

  let href = "";
  for (let i = 0; i < paths.length; i++) {
    href += "/" + paths[i];
    breadcrumbs.push({
      label: formatBreadcrumbLabel(paths[i]),
      href: href,
      isCurrentPage: i === paths.length - 1,
    });
  }

  return breadcrumbs;
}

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => generateBreadcrumbs(pathname),
    [pathname],
  );

  return (
    <header className="fixed w-full bg-background z-50 border-b p-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only ">Home</span>
            </Link>
          </li>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              <ChevronRight
                className="h-4 w-4 text-muted-foreground mx-1"
                aria-hidden="true"
              />
              {breadcrumb.isCurrentPage ? (
                <span className="text-lg font-semibold" aria-current="page">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    index === breadcrumbs.length - 1 &&
                    "text-foreground font-medium",
                  )}
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
