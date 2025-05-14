import { render, screen } from "@testing-library/react";
import { OutfitGrid } from "@/components/wardrobe/outfit-grid";
import type { OutfitWithItems } from "@/components/wardrobe/outfit";
import "@testing-library/jest-dom";

// Mock the OutfitGridItem since it may contain complex logic or external dependencies
jest.mock('@/components/wardrobe/outfit-grid-item', () => ({
  OutfitGridItem: ({ outfit }: { outfit: OutfitWithItems }) => (
    <div data-testid="outfit-grid-item">{outfit.outfit_id}</div>
  ),
}));

// Mock next/link since it requires Next.js context
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe("OutfitGrid", () => {
  it("renders all user outfits", () => {
    const mockOutfits: OutfitWithItems[] = [
      {
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
      },
    ];

    render(<OutfitGrid outfits={mockOutfits} />);

    const renderedOutfits = screen.getAllByTestId("outfit-grid-item");
    expect(renderedOutfits).toHaveLength(mockOutfits.length);

    mockOutfits.forEach((outfit) => {
      expect(screen.getByText(outfit.outfit_id)).toBeInTheDocument();
    });
  });
});
