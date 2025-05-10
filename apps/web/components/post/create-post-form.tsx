"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/actions/create-post";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { MultiImageUpload } from "@/components/upload/multi-image-upload";
import { ExtendedOutfit } from "@/app/profile/[username]/page";
import { Session } from "next-auth";
import { OutfitSelector } from "@/components/wardrobe/outfit-selector";

type FormData = {
  user_id: number;
  post_title: string;
  post_text: string;
  photos: File[];
  outfits: ExtendedOutfit[];
};

export function CreatePostForm({ session, outfits }: { session: Session, outfits: ExtendedOutfit[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user_id: session.user.id,
    post_title: "",
    post_text: "",
    photos: [],
    outfits: [],
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = useCallback(
    (field: keyof FormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormData],
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("post_title", formData.post_title);
      formDataToSend.append("post_text", formData.post_text);
      formDataToSend.append("user_id", formData.user_id.toString()); // Ensure user_id is included

      formData.photos.forEach((photo, index) => {
        formDataToSend.append(`photos`, photo, photo.name); // Include file name
      });

      formDataToSend.append("outfits", JSON.stringify(formData.outfits));

      const result = await createPost(formDataToSend);

      if (result?.success && result.post) {
        router.push(`/profile/${result.post.user.username}/posts/${result.post.post_id}`);
      } else {
        console.error("Failed to create post:", result?.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.post_title.trim().length > 0;
      case 2:
        return formData.post_text.trim().length > 0;
      case 3:
        return true;
      case 4:
        return formData.outfits.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{getStepName(currentStep)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post_title">Post Title</Label>
                <Input
                  id="post_title"
                  placeholder="Enter a title for your post"
                  value={formData.post_title}
                  onChange={(e) => updateFormData("post_title", e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post_text">Post Content</Label>
                <Textarea
                  id="post_text"
                  placeholder="Write your post content here..."
                  rows={8}
                  value={formData.post_text}
                  onChange={(e) => updateFormData("post_text", e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <MultiImageUpload
                photos={formData.photos}
                onPhotosChange={(photos) => updateFormData("photos", photos)}
                maxPhotos={5}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <OutfitSelector
                availableOutfits={outfits}
                onOutfitsChange={(outfits) => updateFormData("outfits", outfits)}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Your Post</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
                  <p className="mt-1">{formData.post_title}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Content</h4>
                  <p className="mt-1 whitespace-pre-wrap">{formData.post_text}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Photos</h4>
                  <p className="mt-1">{formData.photos.length} photo(s) selected</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Outfits</h4>
                  <p className="mt-1">{formData.outfits.length} outfit(s) selected</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="w-full fixed bg-background bottom-16 left-0">
        <div className="flex justify-between p-4 pb-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!isStepValid() || isSubmitting}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Post
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function getStepName(step: number): string {
  switch (step) {
    case 1:
      return "Title";
    case 2:
      return "Content";
    case 3:
      return "Photos";
    case 4:
      return "Outfits";
    case 5:
      return "Review";
    default:
      return "";
  }
}
