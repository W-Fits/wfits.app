"use client";

import { ImageUpload } from "@/components/upload/image-upload";
import Image from "next/image";
import { Slideshow, Slide, SlideshowNextButton, SlideshowNavigation } from "@/components/ui/slideshow";
import { usePersistentState } from "@/lib/hooks/use-persistent-state";
import { ImageIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClothingClass, ClothingClassSelect } from "@/components/shared/clothing-class-select";
import { Colour, ColourSelect } from "@/components/shared/colour-select";
import { Size, SizeSelect } from "@/components/shared/size-select";
import { Environment, EnvironmentSelect } from "@/components/shared/environment-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// import { getAccessToken } from "@auth0/nextjs-auth0";

interface UploadData {
  file: File | null;
  imageURL: string | null;
  clothingClass: ClothingClass | null;
  colour: Colour | null;
  fileBase64: string | null;
  name: string | null;
  size: Size | null,
  environment: Environment | null,
  waterproof: boolean | null
}

export default function UploadPage() {
  const [formData, setFormData, clearData] = usePersistentState<UploadData>("item-upload", {
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

  const handleComplete = (data: Record<number, any>) => {
    console.log("All steps completed with data:", data);
    // Here you would typically save the data to your backend
  }

  const handleUpload = async (): Promise<boolean> => {
    if (!formData.file) return false;

    if (formData.imageURL) return true;

    // Simulate successful upload during development
    return new Promise((resolve) => {
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          class: "T-shirt/top",
          colour: { name: "Grey", value: "#808080" },
          imageURL: "https://wfits-bucket.s3.amazonaws.com/c2c21399-88f6-470d-a4fc-1b7bb0dbf0ca.png"
        }));
        resolve(true);
      }, 1000);
    });

    /*
    const token = await getAccessToken();
    
    
    if (!token) return console.log("No token supplied");
    
    
    const formData = new FormData();
    formData.append("upload_file", file);
    
    
    const response = await fetch(`http://127.0.0.1:8000/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        },
        body: formData,
        });
        
        
        if (!response.ok) return console.error(`Error: ${response.status}`);
        
        
        return console.log(await response.json());
        */
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

  const handleEnvironmentChange = (environment: Environment | null) => {
    setFormData((prev) => ({ ...prev, environment }));
  }

  const handleWaterproofChange = (waterproof: boolean | null) => {
    setFormData((prev) => ({ ...prev, waterproof }));
  }


  return (
    <section className="container flex flex-col-reverse sm:flex-row gap-4 mt-[12dvh] justify-center p-4">
      <Button
        onClick={() => clearData()}
        variant="destructive"
      >
        Clear
      </Button>
      <Slideshow
        className="flex-1"
        onComplete={handleComplete}
        showDefaultNavigation={false}
      >
        <Slide className="flex h-full flex-col justify-between" initialData={{ file: formData.file }}>
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
          <SlideshowNextButton
            className="ml-auto mt-auto"
            onBeforeNext={handleUpload}
            disabled={!formData.file}
            showIcon={!!formData.imageURL}
          >
            {!formData.imageURL ? "Upload Image" : "Next"}
          </SlideshowNextButton>
        </Slide>
        <Slide className="flex h-full flex-col justify-between" initialData={{ class: formData.name }}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Give it a Name</h1>
            <p className="text-muted-foreground">
              Name it something memorable to make it easier to find.
            </p>
          </div>
          <Input
            placeholder="Name"
            className="mt-4"
            onChange={(e) => handleNameChange(e.currentTarget.value)}
            value={formData.name ?? undefined}
            type="text"
            name="name"
          />
          <SlideshowNavigation className="mt-auto" />
        </Slide>
        <Slide className="flex h-full flex-col justify-between" initialData={{ class: formData.name }}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Attributes</h1>
            <p className="text-muted-foreground">
              Help us classify this item.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <ColourSelect
              value={formData.colour}
              onChange={(value) => handleColourChange(value)}
            />
            <SizeSelect
              value={formData.size}
              onChange={(value) => handleSizeChange(value)}
            />
            <ClothingClassSelect
              value={formData.clothingClass}
              onChange={(value) => handleClassChange(value)}
            />
            <EnvironmentSelect
              value={formData.environment}
              onChange={(value) => handleEnvironmentChange(value)}
            />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              {formData.environment && (
                <>
                  <Info className="h-3 w-3" />
                  {formData.environment === "Cold" ? (
                    "For cold weather"
                  ) : (
                    "For warm weather"
                  )}
                </>
              )}
            </span>
            <div className="flex items-center mt-2 space-x-2 ">
              <Checkbox
                id="waterproff"
                onChange={(e) => console.log(e.currentTarget.value)}
              />
              <label
                htmlFor="waterproof"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Waterproof
              </label>
            </div>
          </div>
          <SlideshowNavigation className="mt-auto" />
        </Slide>
      </Slideshow>
      <div className="flex flex-1 px-4 max-w-fit justify-center items-center bg-muted/50 rounded-lg">
        {formData.imageURL ? (
          <Image
            className="w-full"
            src={formData.imageURL as string}
            alt="Clothing Item"
            width={300}
            height={300}
            priority
          />
        ) : (
          <ImageIcon className="text-muted-foreground w-14 h-14" />
        )}
      </div>
    </section >
  );
}