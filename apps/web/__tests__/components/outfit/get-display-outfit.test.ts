import { getDisplayOutfit, type DisplayOutfit, type OutfitWithItems } from "@/components/wardrobe/outfit";

const mockOutfit: OutfitWithItems = {
  "outfit_id": 7,
  "user_id": 4,
  "outfit_name": "Test Outfit",
  "created_at": new Date("2025-05-13T00:00:00.000Z"),
  "updated_at": new Date("2025-05-13T10:48:14.297Z"),
  "outfit_items": [
    {
      "outfit_id": 7,
      "item_id": 17,
      "item": {
        "item_id": 17,
        "colour_id": 3,
        "category_id": 7,
        "size_id": 3,
        "user_id": 4,
        "item_name": "Shoes",
        "item_url": "https://wfits-bucket.s3.amazonaws.com/44ab05c7-5c32-4cce-a0ab-efe71760630a.png",
        "waterproof": false,
        "available": true,
        "slot": 8,
        "environment": "Warm",
        "created_at": new Date("2025-05-13T10:43:57.859Z"),
        "updated_at": new Date("2025-05-13T10:54:25.373Z"),
        "category_tag": {
          "category_id": 7,
          "category_name": "Sneaker"
        },
        "colour_tag": {
          "colour_id": 3,
          "colour_name": "Navy",
          "colour_value": "#000080"
        },
        "size_tag": {
          "size_id": 3,
          "size_name": "l"
        }
      }
    },
    {
      "outfit_id": 7,
      "item_id": 18,
      "item": {
        "item_id": 18,
        "colour_id": 2,
        "category_id": 2,
        "size_id": 3,
        "user_id": 4,
        "item_name": "Hoodie",
        "item_url": "https://wfits-bucket.s3.amazonaws.com/5eb81ba0-1e8a-4dd7-874d-6da165dc1114.png",
        "waterproof": false,
        "available": true,
        "slot": 3,
        "environment": "Warm",
        "created_at": new Date("2025-05-13T10:45:16.635Z"),
        "updated_at": new Date("2025-05-13T11:04:24.270Z"),
        "category_tag": {
          "category_id": 2,
          "category_name": "Pullover"
        },
        "colour_tag": {
          "colour_id": 2,
          "colour_name": "Grey",
          "colour_value": "#808080"
        },
        "size_tag": {
          "size_id": 3,
          "size_name": "l"
        }
      }
    },
    {
      "outfit_id": 7,
      "item_id": 15,
      "item": {
        "item_id": 15,
        "colour_id": 3,
        "category_id": 0,
        "size_id": 3,
        "user_id": 4,
        "item_name": "Tshirt",
        "item_url": "https://wfits-bucket.s3.amazonaws.com/3661f260-6608-4b0d-a115-4ab6bde784d3.png",
        "waterproof": false,
        "available": true,
        "slot": 1,
        "environment": "Warm",
        "created_at": new Date("2025-05-13T10:29:47.035Z"),
        "updated_at": new Date("2025-05-13T11:04:12.074Z"),
        "category_tag": {
          "category_id": 0,
          "category_name": "T-shirt/top"
        },
        "colour_tag": {
          "colour_id": 3,
          "colour_name": "Navy",
          "colour_value": "#000080"
        },
        "size_tag": {
          "size_id": 3,
          "size_name": "l"
        }
      }
    }
  ]
};

describe("getDisplayOutfit", () => {
  it("should categorize outfit items by their category_name correctly", () => {
    const result: DisplayOutfit = getDisplayOutfit(mockOutfit);

    expect(result.Coat).toHaveLength(1);
    expect(result["T-shirt/top"]).toHaveLength(1);
    expect(result.Sneaker).toHaveLength(1);

    expect(result.Pullover[0].item.item_name).toBe("Hoodie");
    expect(result["T-shirt/top"][0].item.item_name).toBe("Tshirt");
    expect(result.Sneaker[0].item.item_name).toBe("Shoes");
  });

  it("should return empty arrays for unused categories", () => {
    const result = getDisplayOutfit(mockOutfit);

    expect(result.Shirt).toEqual([]);
    expect(result.Bag).toEqual([]);
    expect(result["Ankle boot"]).toEqual([]);
  });
});
