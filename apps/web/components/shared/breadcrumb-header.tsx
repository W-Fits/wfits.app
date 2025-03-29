"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage: boolean
}

export default function BreadcrumbHeader() {
  const pathname = usePathname()

  // Generate breadcrumb items based on the current path
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>

            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" aria-hidden="true" />
                {breadcrumb.isCurrentPage ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-colors",
                      index === breadcrumbs.length - 1 && "text-foreground font-medium",
                    )}
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove trailing slash and split the path into segments
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean)

  // Initialize breadcrumbs array
  const breadcrumbs: BreadcrumbItem[] = []

  // Build up breadcrumb items
  let currentPath = ""

  segments.forEach((segment, index) => {
    // Build the href for this segment
    currentPath += `/${segment}`

    // Check if this is a dynamic segment (e.g., [id])
    const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]")

    // Generate a readable label
    let label = segment

    // Handle dynamic segments
    if (isDynamicSegment) {
      // Remove brackets and capitalize
      label = segment.slice(1, -1)

      // Special case for [id]
      if (label === "id") {
        // Determine context based on previous segment
        const prevSegment = segments[index - 1]
        if (prevSegment === "item") {
          label = "Item Details"
        } else if (prevSegment === "outfit") {
          label = "Outfit Details"
        } else {
          label = "Details"
        }
      }
    }

    // Format the label to be more readable
    label = formatBreadcrumbLabel(label)

    // Add to breadcrumbs
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: currentPath === pathname,
    })
  })

  return breadcrumbs
}

function formatBreadcrumbLabel(label: string): string {
  // Handle special cases
  switch (label.toLowerCase()) {
    case "wardrobe":
      return "Wardrobe"
    case "clothes":
      return "Clothes"
    case "outfit":
      return "Outfits"
    case "item":
      return "Item"
    case "upload":
      return "Upload"
    case "generate":
      return "Generate"
    default:
      // Capitalize first letter of each word
      return label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  }
}

