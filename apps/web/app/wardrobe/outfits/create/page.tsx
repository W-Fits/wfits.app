"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Step, StepForm, StepFormRef } from "@/components/ui/step-form";
import { NewOutfit } from "@/components/wardrobe/new-outfit";
import { OutfitWithItems } from "@/components/wardrobe/outfit";
import { CreatedOutfit, createOutfit } from "@/lib/actions/create-outfit";
import { GeneratedOutfit, generateOutfit } from "@/lib/actions/generate-outfit";
import { useUserLocation } from "@/lib/hooks/use-user-location";
import { cn } from "@/lib/utils";
import { EnvironmentEnum } from "@prisma/client";
import { CheckCircle, MapPin, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function StartGeneration({
  stepFormRef,
  generatedOutfit,
  setGeneratedOutfit
}: {
  stepFormRef: React.RefObject<StepFormRef | null>;
  generatedOutfit: GeneratedOutfit | null;
  setGeneratedOutfit: React.Dispatch<SetStateAction<GeneratedOutfit | null>>;
}) {
  const [colour, setColour] = useState<number | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentEnum | null>(null);
  const { latitude, longitude, error, loading: locationLoading } = useUserLocation();
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);

  useEffect(() => {
    if (generatedOutfit) {
      stepFormRef.current?.nextStep();
    }
  }, [generatedOutfit]);

  const handleGenerateOutfit = async () => {
    setGenerateLoading(true);
    try {
      const formData = new FormData();
      formData.set("longitude", String(longitude));
      formData.set("latitude", String(latitude));

      const result = await generateOutfit(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setGeneratedOutfit(result.outfit);

      toast.success("Outfit generated!");
    } catch (error) {
      toast.warning(String(error));
    } finally {
      setGenerateLoading(false);
    }
  };


  const isLoading = locationLoading || generateLoading;

  return (
    <div className="flex flex-col gap-2 space-y-4">
      {/* <ColourSelect
        value={colour}
        onChange={(value) => setColour(value)}
      />
      <EnvironmentSelect
        value={environment}
        onChange={(value) => setEnvironment(value)}
      /> */}
      <div className="flex h-full flex-col gap-2 text-center">
        <div className="relative w-1/2 aspect-square rounded-full bg-muted p-8 mx-auto overflow-hidden">
          <MapPin className="w-full h-full stroke-primary/90" />

          {isLoading && (
            <div className="absolute inset-0 rounded-full border-4 border-t-4 border-t-primary/90 border-transparent animate-spin-slow"></div>
          )}
        </div>
        <span className="text-muted-foreground mt-2 text-balance">
          We use your location{"*"} to calculate an outfit that best fits the weather today.
        </span>
        <span className="text-xs text-muted-foreground text-right">
          <sup className="text-xs">{"*"}</sup>With your consent.
        </span>
      </div>
      <Button
        className="w-full"
        onClick={handleGenerateOutfit}
        disabled={isLoading}
      >
        {generateLoading ? "Generating..." : locationLoading ? "Getting Location..." : "Generate Outfit"}
      </Button>
    </div>
  );
}

function OutfitItems({
  generatedOutfit,
  setGeneratedOutfit,
  stepFormRef
}: {
  generatedOutfit: GeneratedOutfit | null;
  setGeneratedOutfit: React.Dispatch<SetStateAction<GeneratedOutfit | null>>;
  stepFormRef: React.RefObject<StepFormRef | null>;
}) {
  return (
    <div className="flex w-full justify-center">
      <NewOutfit outfit={generatedOutfit} setOutfit={setGeneratedOutfit} />
    </div>
  );
}

function OutfitDetails({
  outfitName,
  setOutfitName,
}: {
  outfitName: string | null
  setOutfitName: React.Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div className="w-full">
      <Label htmlFor="outfit-name" className="text-md font-semibold">
        Outfit Name
      </Label>
      <Input
        name="outfit-name"
        className="w-full"
        value={outfitName ?? ""}
        onChange={(e) => setOutfitName(e.currentTarget.value)}
      />
      <span className="text-sm text-muted-foreground">
        This will be visible to anyone.
      </span>
    </div>
  );
}

function Review({
  generatedOutfit,
  outfitName,
  stepFormRef,
  clear
}: {
  generatedOutfit: GeneratedOutfit | null;
  outfitName: string | null;
  stepFormRef: React.RefObject<StepFormRef | null>;
  clear: () => void;
}) {

  const goToName = () => {
    if (stepFormRef.current) {
      stepFormRef.current.goToStep(2);
    }
  }

  const goToOutfitItems = () => {
    if (stepFormRef.current) {
      stepFormRef.current.goToStep(1);
    }
  }

  const goToOutfitGeneration = () => {
    clear();
    if (stepFormRef.current) {
      stepFormRef.current.goToStep(0);
    }
  }

  const items = Object.values(generatedOutfit ?? {});
  return (
    <div className="w-full space-y-4">
      <div className="w-full p-6 rounded-lg bg-muted">
        <header className="flex items-center gap-1">
          <h1 className="text-lg font-semibold">
            {outfitName}
          </h1>
          <button
            className="flex p-1 items-center justify-center"
            onClick={goToName}
          >
            <Pencil className="h-4 w-4 inline" />
          </button>
        </header>
        <section className="relative w-full p-4 rounded-md bg-background">
          <button
            className="absolute top-4 right-4"
            onClick={goToOutfitItems}
          >
            <Pencil className="h-5 w-5 inline" />
          </button>
          <div className={cn(
            "grid grid-cols-2",
            items.length >= 9 && "grid-cols-3"
          )}>
            {items && items.map((item) => (
              <div key={item.item_id} className="flex">
                <Image
                  src={item.item_url}
                  className="w-full object-scale-down"
                  width={200}
                  height={200}
                  alt={item.item_name}
                  priority
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <Button
        className="w-full"
        variant="destructive"
        onClick={goToOutfitGeneration}
      >
        New Generation
        <Trash />
      </Button>
    </div>
  );
}

function Completed({
  saveLoading,
  createdOutfit,
  stepFormRef,
  clear,
}: {
  saveLoading: boolean
  createdOutfit: CreatedOutfit | null
  stepFormRef: React.RefObject<StepFormRef | null>
  clear: () => void
}) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const newOutfit = () => {
    clear()
    if (stepFormRef.current) {
      stepFormRef.current.goToStep(0)
    }
  }

  const handleShare = () => {
    if (!createdOutfit) return null;

    const shareUrl = `${window.location.origin}/profile/${createdOutfit.user.username}/outfit/${createdOutfit.outfit_id}`

    if (navigator.share) {
      navigator
        .share({
          title: "Check out my outfit!",
          text: "I created a new outfit. Take a look!",
          url: shareUrl,
        })
        .then(() => setShareStatus("Shared successfully!"))
        .catch((error) => {
          console.error("Error sharing:", error)
          setShareStatus("Error sharing")
        })
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setShareStatus("Link copied to clipboard!")
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error)
          prompt("Copy this link to share your outfit:", shareUrl)
        })
    }
  }

  if (!createdOutfit) return (
    <div className="w-full">
      <div>
        Error creating outfit
      </div>
    </div>
  );

  return saveLoading ? (
    <div className="w-full flex items-center justify-center p-8">
      <div className="animate-pulse text-lg font-medium">Saving...</div>
    </div>
  ) : (
    <div className="w-full flex flex-col items-center">
      <header className="flex flex-col text-center mt-8 mb-10">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <Label className="text-3xl font-bold mb-2">Outfit Created!</Label>
        <span className="text-md/relaxed text-muted-foreground">Choose what to do now.</span>
      </header>

      <main className="w-full max-w-md space-y-4 px-4">
        <div className="grid grid-cols-1 gap-4">
          <Link
            href={`/wardrobe/outfits/${createdOutfit.outfit_id}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary/10 px-6 py-3 text-center font-medium text-primary ring-offset-background transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View outfit in wardrobe
          </Link>

          <Link
            href={`/create/post?outfit_id=${createdOutfit.outfit_id}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary/10 px-6 py-3 text-center font-medium text-primary ring-offset-background transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create a post about the outfit
          </Link>

          <Button
            variant="outline"
            className="h-11"
            onClick={handleShare}
          >
            Share outfit
          </Button>

          <Button onClick={newOutfit} className="h-11">
            Create New Outfit
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function CreateOutfitPage() {
  const stepFormRef = useRef<StepFormRef | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);
  const [outfitName, setOutfitName] = useState<string | null>(null);
  const [createdOutfit, setCreatedOutfit] = useState<CreatedOutfit | null>(null);

  const saveOutfit = async () => {
    setSaveLoading(true);
    try {
      const formData = new FormData();

      if (!outfitName || !generatedOutfit) {
        throw new Error("Please provide all required inupts.");
      }

      formData.set("outfit_name", outfitName);
      formData.set("outfit_items", JSON.stringify(Object.values(generatedOutfit)));

      const result = await createOutfit(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setCreatedOutfit(result.outfit);

      toast.success("Outfit created sucessfully.");
    } catch (error) {
      toast.warning(String(error));
    } finally {
      setSaveLoading(false);
    }
  }

  const clear = () => {
    setGeneratedOutfit(null);
    setOutfitName(null);
  };

  const startGenerationProps = {
    stepFormRef,
    generatedOutfit,
    setGeneratedOutfit
  };

  const outfitItemsProps = {
    generatedOutfit,
    setGeneratedOutfit,
    stepFormRef
  }

  const outfitDetailsProps = {
    outfitName,
    setOutfitName,
  }

  const reviewProps = {
    generatedOutfit,
    outfitName,
    stepFormRef,
    clear
  }

  const completedProps = {
    createdOutfit,
    saveLoading,
    stepFormRef,
    clear
  }

  const steps: Step[] = [
    {
      title: "Start Generation",
      description: "Start the outfit generation process by inputing some context for your outfit.",
      content: <StartGeneration {...startGenerationProps} />,
      isNextDisabled: !generatedOutfit,
    },
    {
      title: "Outfit Items",
      description: "Here's the outfit we generated for you. Now you can alter it however you like or leave it how it is.",
      content: <OutfitItems {...outfitItemsProps} />,
      onPrevious: () => setGeneratedOutfit(null),
    },
    {
      title: "Outfit Details",
      description: "Name your outfit.",
      content: <OutfitDetails {...outfitDetailsProps} />,
      isNextDisabled: !outfitName
    },
    {
      title: "Review",
      description: "Make sure everything is correct before saving.",
      content: <Review {...reviewProps} />
    }
  ];

  return (
    <StepForm
      ref={stepFormRef}
      steps={steps}
      onComplete={saveOutfit}
      completedContent={<Completed {...completedProps} />}
      headerTop="top-[3.75rem]"
    />
  );
}
