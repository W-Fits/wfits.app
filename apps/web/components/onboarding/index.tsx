"use client";

import { updateProfilePhoto } from "@/lib/actions/update-profile-photo";
import { useState } from "react";
import { ImageUpload } from "../upload/image-upload";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateName } from "@/lib/actions/update-name";
import { Home, PlusCircle, Search, Shirt, User, Check, Router } from "lucide-react";
import { UploadItemQuickAction } from "../wardrobe/upload-item-quick-action";
import { useRouter } from "next/navigation";

export function Welcome() {
  return <div>Welcome</div>;
}

function ProfilePhoto() {
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!photo) {
      toast.warning("Please select a profile photo.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.set("photo", photo);
      const response = await updateProfilePhoto(formData);
      if (response.success) {
        toast.success("Profile photo set successfully!");
      } else {
        throw new Error("Failed to set profile photo.");
      }
    } catch (error) {
      toast.warning(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center py-2 gap-4">
      <ImageUpload
        variant="pfp"
        onChange={setPhoto}
        value={photo}
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !photo}
      >
        Set Profile Photo
      </Button>
    </div>
  );
}

export function ProfileSetup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>();

  const handleSubmit = async () => {
    if (!name) {
      toast.warning("Please enter your name.");
      return;
    }

    try {
      setLoading(true);
      const response = await updateName(name);
      if (response.success) {
        toast.success("Name set successfully!");
      } else {
        throw new Error("Failed to set name.");
      }
    } catch (error) {
      toast.warning(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Label className="text-lg font-semibold">Choose a Profile Photo</Label>
      <ProfilePhoto />
      <Label className="text-lg font-semibold">What is your Preferred Name</Label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            disabled={loading}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !name}
          >
            Save
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">This is completely optional.</span>
      </div>

    </div>
  );
}

export function Tutorial() {
  const tabs = [
    { label: "Home", icon: <Home className="w-full h-full" />, description: "Here you will find outfits and post from accounts you follow." },
    { label: "Search", icon: <Search className="w-full h-full" />, description: "Use this page to search W Fits for people, outfits, and posts." },
    { label: "Create", icon: <PlusCircle className="w-full h-full" />, description: "Here are some quick actions for creating things like creating posts or outfits." },
    { label: "Wardrobe", icon: <Shirt className="w-full h-full" />, description: "Your virtual wardrobe. View all your items of clothes and outfits you have made." },
    { label: "Profile", icon: <User className="w-full h-full" />, description: "This is your profile page. View your posts, outfits, and likes. Your user settings can also be found here." }
  ];

  return (
    <div className="flex flex-col">
      <header className="flex flex-col">
        <Label className="text-lg font-semibold">Navigation</Label>
        <span className="text-sm text-muted-foreground">Here is where each of the tabs on the bottom of your screen will take you.</span>
      </header>
      <section className="flex flex-col gap-3 py-2">
        {tabs.map((tab) => (
          <div key={tab.label} className="flex gap-2">
            <div className="flex h-16 aspect-square p-2 rounded-lg shadow bg-muted items-center justify-center flex-shrink-0"> {/* Add flex-shrink-0 */}
              {tab.icon}
            </div>
            <div className="flex flex-col gap-1 flex-grow">
              <h2 className="text-md font-semibold">{tab.label}</h2>
              <span className="text-sm">{tab.description}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export function Completed() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <header className="flex flex-col items-center text-center">
        <Label className="text-2xl pt-20 font-bold">
          Completed
        </Label>
        <span className="text-balance text-muted-foreground">
          Your are all set.
          <br></br>
          You choose where to go next.
        </span>
      </header>
      <div className="px-6 space-y-4 mt-32">
        <UploadItemQuickAction />
        <Button
          className="w-full"
          onClick={() => router.push("/")}
          size="lg"
        >
          Home
        </Button>
      </div>
    </div >
  );
}
