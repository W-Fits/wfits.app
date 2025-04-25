import type React from "react"
import BreadcrumbHeader from "@/components/shared/breadcrumb-header"

export default function WardrobeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbHeader />
      <div className="p-4 pt-20">
        {children}
      </div>
    </>
  );
}

