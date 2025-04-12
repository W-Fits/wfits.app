import type React from "react"
import BreadcrumbHeader from "@/components/shared/breadcrumb-header"

export default function WardrobeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl pb-12">
      <BreadcrumbHeader />
      {children}
    </div>
  );
}

