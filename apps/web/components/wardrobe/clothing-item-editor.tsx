"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, ZoomIn, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CategorySelect } from "@/components/shared/category-select";
import { ColourSelect } from "@/components/shared/colour-select";
import { SizeSelect } from "@/components/shared/size-select";
import { EnvironmentSelect } from "@/components/shared/environment-select";
import type { Item } from "@prisma/client";
import { ClothingImage } from "../shared/clothing-image";
import { ImageModal } from "../shared/image-modal";

import { deleteItem } from "@/lib/actions/delete-item"; // Assuming your server action is in this path

export function ClothingItemEditor({ item }: { item: Item }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_name: item.item_name,
    colour_id: item.colour_id,
    category_id: item.category_id,
    size_id: item.size_id,
    waterproof: item.waterproof ?? false,
    available: item.available ?? true,
    slot: item.slot,
    environment: item.environment,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(
      async () => {
        setIsSubmitting(true);
        const response = await fetch(`/api/item/${item.item_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update item");
        }

        setIsSubmitting(false);
        router.refresh();
        return response.json();
      },
      {
        loading: "Updating clothing item...",
        success: "Item updated successfully!",
        error: "Failed to update item. Please try again.",
      },
    );
  };

  const handleDelete = async () => {
    toast.promise(
      async () => {
        setIsDeleting(true);
        const result = await deleteItem(item.item_id);

        if (result.error) {
          throw new Error(result.error);
        }

        setIsDeleting(false);
        router.push("/items"); // Redirect after successful deletion
        router.refresh(); // Refresh the cache
        return result;
      },
      {
        loading: "Deleting clothing item...",
        success: "Item deleted successfully!",
        error: (error) => error.message,
      },
    );
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <div
                className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setIsImageModalOpen(true)}
              >
                <ClothingImage
                  src={item.item_url}
                  alt={item.item_name}
                  objectFit="cover"
                  rounded="lg"
                  hoverZoom
                  zoomScale={1.08}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item_name">Item Name</Label>
              <Input
                id="item_name"
                value={formData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <CategorySelect
                value={formData.category_id}
                onChange={(value) => handleChange("category_id", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colour">Color</Label>
              <ColourSelect
                value={formData.colour_id}
                onChange={(value) => handleChange("colour_id", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <SizeSelect
                value={formData.size_id}
                onChange={(value) => handleChange("size_id", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <EnvironmentSelect
                value={formData.environment}
                onChange={(value) => handleChange("environment", value)}
              />
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <Label htmlFor="waterproof" className="cursor-pointer">
                Waterproof
              </Label>
              <Switch
                id="waterproof"
                checked={formData.waterproof}
                onCheckedChange={(checked) => handleChange("waterproof", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="available" className="cursor-pointer">
                Available
              </Label>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => handleChange("available", checked)}
              />
            </div>

            <CardFooter className="flex justify-between gap-2 px-0 pt-4">
              <Button
                type="button"
                variant="destructive" // Using destructive variant for delete
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting} // Disable if submitting or already deleting
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting || isDeleting}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isDeleting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        src={item.item_url || "/placeholder.svg"}
        alt={item.item_name}
      />
    </>
  );
}
