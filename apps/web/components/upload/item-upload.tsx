"use client";

import { ImageUpload } from "@/components/upload/image-upload";
import Image from "next/image";
import { Slideshow, Slide } from "@/components/ui/slideshow";
import { usePersistentState } from "@/lib/hooks/use-persistent-state";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClothingClass, ClothingClassSelect } from "@/components/shared/clothing-class-select";
import { Colour, ColourSelect } from "@/components/shared/colour-select";
import { Size, SizeSelect } from "@/components/shared/size-select";
import { EnvironmentSelect } from "@/components/shared/environment-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Session } from "next-auth";
import { getCategoryId, getColourId, getSizeId, getSlot } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EnvironmentEnum, Item } from "@prisma/client";

interface UploadData {
  file: File | null;
  imageURL: string | null;
  clothingClass: ClothingClass | null;
  colour: Colour | null;
  fileBase64: string | null;
  name: string | null;
  size: Size | null,
  environment: EnvironmentEnum | null,
  waterproof: boolean | null
}

export function ItemUpload({ session }: { session: Session }) {
  const [formData, setFormData, clearFormData] = usePersistentState<UploadData>("item-upload", {
    file: null,
    imageURL: null,
    clothingClass: null,
    colour: null,
    fileBase64: null,
    name: null,
    size: null,
    environment: null,
    waterproof: null
  });
  const [currentStep, setCurrentStep, clearCurrentStep] = usePersistentState<number>("image-upload-step", 0);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const handleComplete = async (data: UploadData) => {
    const createPromise = fetch('/api/item', {
      method: 'POST',
      headers: {
        "content-type": "text/JSON",
      },
      body: JSON.stringify({
        user_id: session.user.id,
        colour_id: getColourId(formData.colour!),
        category_id: getCategoryId(formData.clothingClass!),
        size_id: getSizeId(formData.size!),
        item_name: formData.name,
        item_url: formData.imageURL,
        waterproof: !!formData.waterproof,
        slot: getSlot(formData.clothingClass!),
        environment: formData.environment
      })
    });

    toast.promise(createPromise, {
      loading: "Creating item...",
      success: "Item created!",
      error: "Created item"
    });

    const response = await createPromise;

    if (response.ok) {
      const data = await response.json() as Item;
      router.push(`/wardrobe/clothes/item/${data.item_id}`);
      handleReset();
    }


  }

  const handleUpload = async (): Promise<boolean> => {
    if (!formData.file) {
      return false;
    }

    if (formData.imageURL) {
      return true;
    }

    setUploading(true);

    try {
      const tokenResponse = await fetch('/api/auth/token');
      if (!tokenResponse.ok) {
        throw new Error(`Failed to fetch token: ${tokenResponse.status}`);
      }
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      if (!token) {
        return false;
      }

      const postBody = new FormData();
      postBody.append("upload_file", formData.file);

      const response = await fetch(`http://127.0.0.1:8000/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: postBody,
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        imageURL: result.image_url,
        category: result.class,
        colour: result.colour
      }));

      return true;

    } catch (e: any) {
      console.error("Error uploading file:", e);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, file }));
  }

  const handleNameChange = (name: string | null) => {
    setFormData((prev) => ({ ...prev, name }));
  }


  const handleColourChange = (colour: Colour | null) => {
    setFormData((prev) => ({ ...prev, colour }));
  }

  const handleSizeChange = (size: Size | null) => {
    setFormData((prev) => ({ ...prev, size }));
  }

  const handleClassChange = (clothingClass: ClothingClass | null) => {
    setFormData((prev) => ({ ...prev, clothingClass }));
  }

  const handleEnvironmentChange = (environment: EnvironmentEnum | null) => {
    setFormData((prev) => ({ ...prev, environment }));
  }

  const handleWaterproofChange = (waterproof: boolean | null) => {
    setFormData((prev) => ({ ...prev, waterproof }));
  }

  const handleReset = () => {
    clearFormData();
    clearCurrentStep();
  }

  return (
    <div className="flex w-full flex-col">
      <header>
        <Button
          onClick={handleReset}
          variant="destructive"
        >
          Reset
        </Button>
      </header>
      <section className="container flex flex-col-reverse sm:flex-row gap-4 mt-[4dvh] mb-[8dvh] justify-center p-4">
        {formData.imageURL && (
          <Slideshow
            className="flex-1"
            onComplete={handleComplete}
            slideData={formData}
            setSlideData={setFormData}
          >
            <Slide className="flex h-full flex-col justify-between">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Give it a Name</h1>
              </div>
              <Input
                placeholder="Name"
                className="mt-2"
                onChange={(e) => handleNameChange(e.currentTarget.value)}
                value={formData.name ?? ''}
                type="text"
                name="name"
              />
            </Slide>
            <Slide className="flex h-full flex-col justify-between">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Size</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <SizeSelect
                  value={formData.size}
                  onChange={(value) => handleSizeChange(value)}
                />
              </div>
            </Slide>
            <Slide className="flex h-full flex-col justify-between">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Colour</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <ColourSelect
                  value={formData.colour}
                  onChange={(value) => handleColourChange(value)}
                />
              </div>
            </Slide>
            <Slide className="flex h-full flex-col justify-between">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Category</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <ClothingClassSelect
                  value={formData.clothingClass}
                  onChange={(value) => handleClassChange(value)}
                />
              </div>
            </Slide>
            <Slide className="flex h-full flex-col justify-between">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Weather</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <EnvironmentSelect
                  value={formData.environment}
                  onChange={(value) => handleEnvironmentChange(value)}
                />
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  {formData.environment ? (
                    <>
                      <Info className="h-3 w-3" />
                      {formData.environment === "Cold" ? (
                        "For cold weather"
                      ) : (
                        "For warm weather"
                      )}
                    </>
                  ) : (
                    <span className="opacity-0">hidden</span>
                  )}
                </span>
                <div className="flex items-center mt-2 space-x-2 ">
                  <Checkbox
                    id="waterproff"
                    checked={!!formData.waterproof}
                    onCheckedChange={(checked) => handleWaterproofChange(!!checked)}
                  />
                  <label
                    htmlFor="waterproof"
                    className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Waterproof
                  </label>
                </div>
              </div>
            </Slide>
          </Slideshow>
        )}
        {formData.imageURL ? (
          <div className="flex mx-auto flex-1 px-4 max-w-fit justify-center items-center bg-muted/50 rounded-lg">
            <Image
              className="w-full"
              src={formData.imageURL as string}
              alt="Clothing Item"
              width={300}
              height={300}
              priority
            />
          </div>
        ) : (
          <div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Image Upload</h1>
              <p className="text-muted-foreground">
                Upload an image by dragging & dropping or clicking to browse
              </p>
            </div>
            <ImageUpload
              className="mx-auto my-4"
              onChange={(f) => handleFileChange(f)}
              value={formData.file} maxSizeMB={5}
            />
            <Button
              onClick={handleUpload}
              disabled={!formData.file || uploading}
            >
              {uploading ? <Spinner /> : "Upload"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}