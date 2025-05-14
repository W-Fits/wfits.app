import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ClothingItemGrid } from "@/components/wardrobe/clothing-item-grid"
import { ExtendedItem } from "@/components/wardrobe/clothing-item-grid"

// Mock the items data
const mockItems: ExtendedItem[] = [
  {
    "item_id": 20,
    "colour_id": 3,
    "category_id": 0,
    "size_id": 2,
    "user_id": 4,
    "item_name": "Oasis T-Shirt",
    "item_url": "https://wfits-bucket.s3.amazonaws.com/60e96b7b-32b6-438f-811f-1c5026f80d8a.png",
    "waterproof": false,
    "available": true,
    "slot": 0,
    "environment": null,
    "created_at": new Date("2025-05-13T11:32:42.071Z"),
    "updated_at": new Date("2025-05-13T11:35:27.215Z"),
    "colour_tag": {
      "colour_id": 3,
      "colour_name": "Navy",
      "colour_value": "#000080"
    },
    "category_tag": {
      "category_id": 0,
      "category_name": "T-shirt/top"
    },
    "size_tag": {
      "size_id": 2,
      "size_name": "m"
    }
  },
  {
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
    "colour_tag": {
      "colour_id": 3,
      "colour_name": "Navy",
      "colour_value": "#000080"
    },
    "category_tag": {
      "category_id": 0,
      "category_name": "T-shirt/top"
    },
    "size_tag": {
      "size_id": 3,
      "size_name": "l"
    }
  }
]

describe("ClothingItemGrid", () => {
  it("should render the grid of clothing items", () => {
    render(<ClothingItemGrid items={mockItems} />)

    // Verify that all items are rendered initially
    expect(screen.getByText("Rain Jacket")).toBeInTheDocument()
    expect(screen.getByText("T-shirt")).toBeInTheDocument()
  })

  it("should filter items based on category", async () => {
    render(<ClothingItemGrid items={mockItems} />)

    // Open the category filter panel and select a category
    fireEvent.click(screen.getByText("Filters"))
    const categorySelect = screen.getByPlaceholderText("Select category")
    fireEvent.change(categorySelect, { target: { value: "Jackets" } })

    // Apply the category filter
    const filteredItems = await waitFor(() => screen.getByText("Rain Jacket"))

    // Verify that only the "Rain Jacket" is displayed
    expect(filteredItems).toBeInTheDocument()
    expect(screen.queryByText("T-shirt")).not.toBeInTheDocument()
  })

  it("should display all items when 'All categories' is selected", async () => {
    render(<ClothingItemGrid items={mockItems} />)

    // Open the category filter and select "All categories"
    fireEvent.click(screen.getByText("Filters"))
    const categorySelect = screen.getByPlaceholderText("Select category")
    fireEvent.change(categorySelect, { target: { value: "all" } })

    // Ensure all items are displayed again
    await waitFor(() => {
      expect(screen.getByText("Rain Jacket")).toBeInTheDocument()
      expect(screen.getByText("T-shirt")).toBeInTheDocument()
    })
  })

  it("should filter items based on search input", async () => {
    render(<ClothingItemGrid items={mockItems} />)

    // Locate the search input and type a query
    const searchInput = screen.getByPlaceholderText("Search your wardrobe") // Adjust placeholder text if needed
    fireEvent.change(searchInput, { target: { value: "Oasis" } })

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText("Oasis T-Shirt")).toBeInTheDocument()
    })

    // Ensure non-matching items are not shown
    expect(screen.queryByText("Tshirt")).not.toBeInTheDocument()
  })

  it("should render all items passed as props", () => {
    render(<ClothingItemGrid items={mockItems} />)

    // Check that each item's name appears in the document
    for (const item of mockItems) {
      expect(screen.getByText(item.item_name)).toBeInTheDocument()
    }
  })
})
