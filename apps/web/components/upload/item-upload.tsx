"use client";

import { ImageUpload } from "@/components/upload/image-upload";
import Image from "next/image";
import { Slideshow, Slide } from "@/components/ui/slideshow";
import { usePersistentState } from "@/lib/hooks/use-persistent-state";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category, categoryIdMapping, CategorySelect } from "@/components/shared/category-select";
import { colourIdMapping, ColourSelect } from "@/components/shared/colour-select";
import { SizeSelect } from "@/components/shared/size-select";
import { EnvironmentSelect } from "@/components/shared/environment-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { EnvironmentEnum, Item } from "@prisma/client";

interface UploadData {
  file: File | null;
  imageURL: string | null;
  category: number | null;
  colour: number | null;
  fileBase64: string | null;
  name: string | null;
  size: number | null,
  environment: EnvironmentEnum | null,
  waterproof: boolean | null
}

// Define a type for the data structure used by the slideshow
interface SlideshowFormData {
  // Each slide's data will be stored under its step number
  [key: number]: UploadData;
}


export function ItemUpload({ session }: { session: Session }) {
  // Use the new SlideshowFormData type for persistent state
  const [formData, setFormData, clearFormData] = usePersistentState<SlideshowFormData>("item-upload", {
    0: { // Initialize data for the first slide (step 0)
      file: null,
      imageURL: null,
      category: null,
      colour: null,
      fileBase64: null,
      name: null,
      size: null,
      environment: null,
      waterproof: null
    }
  });
  const [currentStep, setCurrentStep, clearCurrentStep] = usePersistentState<number>("image-upload-step", 0);
  console.log(currentStep);
  console.log(setCurrentStep);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const handleComplete = async (data: Record<number, UploadData>): Promise<boolean> => {
    // Access the data for the last slide (assuming it's the data needed for completion)
    const finalSlideData = data[Object.keys(data).length - 1]; // Get data from the last step

    if (!finalSlideData) {
      console.error("No data found for the final step.");
      return false;
    }

    const createPromise = fetch('/api/item', {
      method: 'POST',
      headers: {
        "content-type": "text/JSON",
      },
      body: JSON.stringify({
        user_id: session.user.id,
        colour_id: finalSlideData.colour,
        category_id: finalSlideData.category,
        size_id: finalSlideData.size,
        item_name: finalSlideData.name,
        item_url: finalSlideData.imageURL,
        waterproof: !!finalSlideData.waterproof,
        slot: finalSlideData.category, // Assuming slot is the same as category
        environment: finalSlideData.environment
      })
    });

    toast.promise(createPromise, {
      loading: "Creating item...",
      success: "Item created!",
      error: "Error creating item"
    });

    const response = await createPromise;

    if (response.ok) {
      const data = await response.json() as Item;
      router.push(`/wardrobe/clothes/item/${data.item_id}`);
      handleReset();
      return true;
    }

    return false;
  }

  const handleUpload = async (): Promise<boolean> => {
    const currentSlideData = formData[currentStep];
    if (!currentSlideData || !currentSlideData.file) {
      return false;
    }

    if (currentSlideData.imageURL) {
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
      postBody.append("upload_file", currentSlideData.file);

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
        [currentStep]: {
          ...prev[currentStep],
          imageURL: result.image_url,
          category: categoryIdMapping[result.class as Category],
          colour: colourIdMapping[result.colour.name]
        }
      }));

      return true;

    } catch (e) {
      console.error("Error uploading file:", e);
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Helper function to update data for the current slide
  const updateCurrentSlideData = (newData: Partial<UploadData>) => {
    setFormData((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        ...newData,
      },
    }));
  };


  const handleFileChange = (file: File | null) => {
    updateCurrentSlideData({ file });
  }

  const handleNameChange = (name: string | null) => {
    updateCurrentSlideData({ name });
  }


  const handleColourChange = (colour: number | null) => {
    updateCurrentSlideData({ colour });
  }

  const handleSizeChange = (size: number | null) => {
    updateCurrentSlideData({ size });
  }

  const handleCategoryChange = (category: number | null) => {
    updateCurrentSlideData({ category });
  }

  const handleEnvironmentChange = (environment: EnvironmentEnum | null) => {
    updateCurrentSlideData({ environment });
  }

  const handleWaterproofChange = (waterproof: boolean | null) => {
    updateCurrentSlideData({ waterproof });
  }

  const handleReset = () => {
    clearFormData();
    clearCurrentStep();
  }

  // Get current slide data for rendering forms
  const currentSlideData = formData[currentStep] || {};


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
        {formData[0]?.imageURL ? ( // Check for imageURL on the first slide
          <Slideshow<UploadData> // Specify the type for the Slideshow
            className="flex-1"
            onComplete={handleComplete}
            slideData={formData} // Pass the entire formData
            setSlideData={setFormData} // Pass the setFormData
          >
            <Slide<UploadData> // Specify the type for each Slide
              className="flex h-full flex-col justify-between"
              initialData={formData[0]} // Pass initial data for this slide
              onDataChange={(data) => setFormData(prev => ({ ...prev, 0: data }))} // Update formData for slide 0
            >
              <div></div>
            </Slide>
            {/* Name Slide */}
            <Slide<UploadData>
              className="flex h-full flex-col justify-between"
              initialData={formData[1] || { name: '' }} // Initialize with empty name if no data
              onDataChange={(data) => setFormData(prev => ({ ...prev, 1: data }))} // Update formData for slide 1
              required={['name']}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Give it a Name</h1>
              </div>
              <Input
                placeholder="Name"
                className="mt-2"
                onChange={(e) => handleNameChange(e.currentTarget.value)}
                value={currentSlideData.name ?? ''}
                type="text"
                name="name"
              />
            </Slide>
            {/* Size Slide */}
            <Slide<UploadData>
              className="flex h-full flex-col justify-between"
              initialData={formData[2] || { size: null }}
              onDataChange={(data) => setFormData(prev => ({ ...prev, 2: data }))}
              required={['size']}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Size</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <SizeSelect
                  value={currentSlideData.size}
                  onChange={(value) => handleSizeChange(value)}
                />
              </div>
            </Slide>
            {/* Colour Slide */}
            <Slide<UploadData>
              className="flex h-full flex-col justify-between"
              initialData={formData[3] || { colour: null }}
              onDataChange={(data) => setFormData(prev => ({ ...prev, 3: data }))}
              required={['colour']}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Colour</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <ColourSelect
                  value={currentSlideData.colour}
                  onChange={(value) => handleColourChange(value)}
                />
              </div>
            </Slide>
            {/* Category Slide */}
            <Slide<UploadData>
              className="flex h-full flex-col justify-between"
              initialData={formData[4] || { category: null }}
              onDataChange={(data) => setFormData(prev => ({ ...prev, 4: data }))}
              required={['category']}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Category</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <CategorySelect
                  value={currentSlideData.category}
                  onChange={(value) => handleCategoryChange(value)}
                />
              </div>
            </Slide>
            {/* Weather Slide */}
            <Slide<UploadData>
              className="flex h-full flex-col justify-between"
              initialData={formData[5] || { environment: null, waterproof: false }}
              onDataChange={(data) => setFormData(prev => ({ ...prev, 5: data }))}
              required={['environment']}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Weather</h1>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <EnvironmentSelect
                  value={currentSlideData.environment}
                  onChange={(value) => handleEnvironmentChange(value)}
                />
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  {currentSlideData.environment ? (
                    <>
                      <Info className="h-3 w-3" />
                      {currentSlideData.environment === "Cold" ? (
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
                    checked={!!currentSlideData.waterproof}
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
              value={formData[0]?.file || null} // Access file from the first slide's data
              maxSizeMB={5}
            />
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!formData[0]?.file || uploading} // Check file from the first slide's data
            >
              {uploading ? <Spinner /> : "Upload"}
            </Button>
          </div>
        )}
        {formData[0]?.imageURL && ( // Only show image if imageURL exists on the first slide
          <div className="flex mx-auto flex-1 px-4 max-w-fit justify-center items-center bg-muted/50 rounded-lg">
            <Image
              className=""
              src={formData[0].imageURL as string} // Access imageURL from the first slide's data
              width={200}
              height={200}
              alt={"Clothing Image"}
            />
          </div>
        )}
      </section>
    </div>
  );
}
