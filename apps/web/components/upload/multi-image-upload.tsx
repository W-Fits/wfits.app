"use client";

import type React from "react";
import { useCallback } from "react";
import { ImageUpload } from "./image-upload";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PhotoItem = File | string | 'placeholder';

export function MultiImageUpload({
  photos,
  onPhotosChange,
  maxPhotos = 5,
  className,
}: {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
  className?: string;
}) {

  const handlePhotoChange = useCallback(
    (index: number, file: File | null) => {
      const newPhotos = [...photos];
      if (file) {
        newPhotos[index] = file;
      } else {
        newPhotos.splice(index, 1);
      }
      onPhotosChange(newPhotos);
    },
    [photos, onPhotosChange],
  );

  const handleAddPhoto = useCallback(() => {
    const currentValidPhotosCount = photos.filter(item => item !== 'placeholder').length;
    if (currentValidPhotosCount < maxPhotos) {
      const newPhotos = [...photos, 'placeholder'];
      onPhotosChange(newPhotos);
    }
  }, [photos, onPhotosChange, maxPhotos]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {photos.map((photo, index) => {

        if (photo === 'placeholder') {
          return (
            <ImageUpload
              key={`placeholder-${index}`}
              value={null}
              onChange={(file) => handlePhotoChange(index, file)}
            />
          );
        }

        return (
          <ImageUpload
            key={`photo-${index}-${typeof photo === 'string' ? photo : photo.name || index}`}
            value={photo}
            onChange={(file) => handlePhotoChange(index, file)}
          />
        );
      })}
      {photos.filter(item => item !== 'placeholder').length < maxPhotos && (
        <div className="flex w-full items-center justify-center">
          <Button
            variant="outline"
            className="flex w-full items-center justify-center py-6 text-muted-foreground"
            onClick={handleAddPhoto}
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Photo
          </Button>
        </div>
      )}
    </div>
  );
}
