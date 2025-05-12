import type React from "react"
import { BreadcrumbHeader } from "@/components/shared/breadcrumb-header"

export default function WardrobeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbHeader />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}

