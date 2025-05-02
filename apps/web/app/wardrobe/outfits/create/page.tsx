"use client";

import { ColourSelect } from "@/components/shared/colour-select";
import { EnvironmentSelect } from "@/components/shared/environment-select";
import { Button } from "@/components/ui/button";
import { Outfit, OutfitWithItems } from "@/components/wardrobe/outfit";
import { EnvironmentEnum } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateOutfitPage() {
  const [colour, setColour] = useState<number | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentEnum | null>(null);
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [outfit, setOutfit] = useState<OutfitWithItems | null>(null);
  const router = useRouter();

  const handleGenerateOutfit = async () => {
    setGenerateLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulated outfit response
      const result = {
        "outfit_items": [
          {
            "item_id": 5,
            "colour_id": 16,
            "category_id": 4,
            "size_id": 2,
            "user_id": 1,
            "item_name": "Blue Jumper",
            "item_url": "https://wfits-bucket.s3.amazonaws.com/fbcc6237-6dab-4c1b-859e-9af7163a57c0.png",
            "waterproof": true,
            "available": true,
            "slot": 3,
            "environment": "Cold",
            "created_at": new Date("2025-03-25T13:41:10.478Z"),
            "updated_at": new Date("2025-03-29T13:05:28.207Z"),
            "category_tag": {
              "category_id": 4,
              "category_name": "Coat"
            },
            "colour_tag": {
              "colour_id": 16,
              "colour_name": "Mustard",
              "colour_value": "#FFDB58"
            },
            "size_tag": {
              "size_id": 2,
              "size_name": "m"
            }
          },
          {
            "item_id": 8,
            "colour_id": 15,
            "category_id": 0,
            "size_id": 0,
            "user_id": 1,
            "item_name": "Blue T-Shirt",
            "item_url": "https://wfits-bucket.s3.amazonaws.com/b02543f5-cf53-47f2-befc-61b93550bce4.png",
            "waterproof": false,
            "available": null,
            "slot": 3,
            "environment": "Warm",
            "created_at": new Date("2025-03-25T13:44:58.983Z"),
            "updated_at": new Date("2025-03-25T13:44:58.983Z"),
            "category_tag": {
              "category_id": 0,
              "category_name": "T-shirt/top"
            },
            "colour_tag": {
              "colour_id": 15,
              "colour_name": "Teal",
              "colour_value": "#008080"
            },
            "size_tag": {
              "size_id": 0,
              "size_name": "xs"
            }
          },
          {
            "item_id": 7,
            "colour_id": 3,
            "category_id": 1,
            "size_id": 2,
            "user_id": 1,
            "item_name": "Black Joggers",
            "item_url": "https://wfits-bucket.s3.amazonaws.com/5e5b454c-d58d-4cac-891c-a9fb87c2fcdf.png",
            "waterproof": false,
            "available": null,
            "slot": 2,
            "environment": null,
            "created_at": new Date("2025-03-25T13:43:08.863Z"),
            "updated_at": new Date("2025-03-25T13:43:08.863Z"),
            "category_tag": {
              "category_id": 1,
              "category_name": "Trouser"
            },
            "colour_tag": {
              "colour_id": 3,
              "colour_name": "Navy",
              "colour_value": "#000080"
            },
            "size_tag": {
              "size_id": 2,
              "size_name": "m"
            }
          },
          {
            "item_id": 10,
            "colour_id": 1,
            "category_id": 8,
            "size_id": 2,
            "user_id": 1,
            "item_name": "shoes",
            "item_url": "https://wfits-bucket.s3.amazonaws.com/f7defc0b-96e5-49b0-86e6-569e5287da49.png",
            "waterproof": false,
            "available": null,
            "slot": 8,
            "environment": "Warm",
            "created_at": new Date("2025-04-02T13:12:18.768Z"),
            "updated_at": new Date("2025-04-02T13:12:18.768Z"),
            "category_tag": {
              "category_id": 8,
              "category_name": "Bag"
            },
            "colour_tag": {
              "colour_id": 1,
              "colour_name": "White",
              "colour_value": "#FFFFFF"
            },
            "size_tag": {
              "size_id": 2,
              "size_name": "m"
            }
          }
        ]
      } as OutfitWithItems;

      setOutfit(result);
    } catch (error) {
      console.error("Error generating outfit:", error);
    } finally {
      setGenerateLoading(false);
    }
  };

  const saveOutfit = async (outfit: OutfitWithItems) => {
    setSaveLoading(true);
    try {
      const response = await fetch("/api/outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: outfit.outfit_items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save outfit");
      }

      const data = await response.json();

      setOutfit(null);
      router.push(`/wardrobe/outfits/${data.outfit_id}`);
    } catch (error) {
      console.error("Error saving outfit:", error);
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <div>
      {!outfit && (
        <>
          <ColourSelect
            value={colour}
            onChange={(value) => setColour(value)}
          />
          <EnvironmentSelect
            value={environment}
            onChange={(value) => setEnvironment(value)}
          />
          <Button
            className=""
            onClick={handleGenerateOutfit}
            disabled={!colour || !environment || generateLoading || saveLoading}
          >
            {generateLoading ? "Generating..." : "Generate Outfit"}
          </Button>
        </>
      )}
      {outfit && (
        <>
          <h2 className="text-2xl font-bold mb-4">Generated Outfit</h2>
          <Outfit
            initialOutfit={outfit}
            outfit={outfit}
            setOutfit={setOutfit}
            edit
          />
          <div className="felx justify-between mt-4">
            <Button
              variant="secondary"
              onClick={() => setOutfit(null)}
            >
              Clear
            </Button>
            <Button
              onClick={() => saveOutfit(outfit)}
            >
              Save Outfit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
