"use client"

import Image from "next/image"
import React from "react"
import { cn } from "@/lib/utils"

export type ObjectFitType = "cover" | "contain" | "fill" | "none" | "scale-down"
export type LoadingType = "eager" | "lazy"

export interface ClothingImageProps {
  src: string
  alt?: string
  className?: string
  /** Optional width in pixels. If provided, 'fill' will be disabled */
  width?: number
  /** Optional height in pixels. If provided, 'fill' will be disabled */
  height?: number
  /** Object fit property for the image. Default is 'cover' */
  objectFit?: ObjectFitType
  /** Image quality (1-100). Default is 75 */
  quality?: number
  /** Loading behavior. Default is 'priority' (eager) */
  loading?: LoadingType
  /** Enable blur-up placeholder effect */
  blurDataURL?: string
  /** Enable hover zoom effect */
  hoverZoom?: boolean
  /** Zoom scale factor when hovering. Default is 1.05 */
  zoomScale?: number
  /** Make the image rounded */
  rounded?: boolean | "sm" | "md" | "lg" | "full"
  /** Add a border to the image */
  bordered?: boolean
  /** Fallback image to display on error */
  fallbackSrc?: string
  /** Optional onClick handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>
  /** Optional onLoad handler */
  onLoad?: () => void
  /** Optional onError handler */
  onError?: () => void
}

export function ClothingImage({
  src,
  alt = "Clothing Image",
  className,
  width,
  height,
  objectFit = "cover",
  quality = 75,
  loading = "eager",
  blurDataURL,
  hoverZoom = false,
  zoomScale = 1.05,
  rounded = false,
  bordered = false,
  fallbackSrc,
  onClick,
  onLoad,
  onError,
}: ClothingImageProps) {
  const [imgSrc, setImgSrc] = React.useState(src)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Handle image error
  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
    onError?.()
  }

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // Determine rounded class based on the rounded prop
  const getRoundedClass = () => {
    if (rounded === true) return "rounded-md"
    if (rounded === "sm") return "rounded-sm"
    if (rounded === "md") return "rounded-md"
    if (rounded === "lg") return "rounded-lg"
    if (rounded === "full") return "rounded-full"
    return ""
  }

  // Determine if we should use fill or explicit dimensions
  const useFill = width === undefined || height === undefined

  // If using fill, we need to ensure the parent has position: relative and defined dimensions
  if (useFill) {
    return (
      <div className={cn("relative w-full h-full", className)}>
        <div
          className={cn(
            "relative overflow-hidden w-full h-full",
            getRoundedClass(),
            bordered && "border border-border",
            onClick && "cursor-pointer",
          )}
          onClick={onClick}
        >
          <Image
            className={cn(
              "transition-all duration-300",
              hoverZoom && "group-hover:scale-[var(--zoom-scale)]",
              hoverZoom && "hover:scale-[var(--zoom-scale)]",
              !isLoaded && "opacity-0",
              isLoaded && "opacity-100",
            )}
            style={
              {
                "--zoom-scale": zoomScale,
                objectFit,
              } as React.CSSProperties
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={imgSrc || "/placeholder.svg"}
            alt={alt}
            fill={true}
            priority={loading === "eager"}
            loading={loading}
            quality={quality}
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
            onError={handleError}
            onLoad={handleLoad}
          />
        </div>
      </div>
    )
  }

  // If using explicit dimensions
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        getRoundedClass(),
        bordered && "border border-border",
        onClick && "cursor-pointer",
        className,
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      <Image
        className={cn(
          "transition-all duration-300",
          hoverZoom && "group-hover:scale-[var(--zoom-scale)]",
          hoverZoom && "hover:scale-[var(--zoom-scale)]",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100",
        )}
        style={
          {
            "--zoom-scale": zoomScale,
            objectFit,
          } as React.CSSProperties
        }
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={loading === "eager"}
        loading={loading}
        quality={quality}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}

