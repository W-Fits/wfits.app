"use client";

import { OutfitItem } from "./outfit-item";
import { useEffect, useState } from "react";
import {
  FolderIcon as Hanger,
  PlusCircle,
  Grid2X2,
  Layers,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedItem } from "./outfit";
import { GeneratedOutfit } from "@/lib/actions/generate-outfit";
import {
  Category,
  CategorySelect,
  categoryIdMapping,
  categoryMapping,
} from "../shared/category-select"; // Import mappings
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ClothingItem } from "@/components/wardrobe/clothing-item";
import { Size } from "../shared/size-select";
import { Colour } from "../shared/colour-select";

const displayOrder: Category[] = [
  "Coat",
  "Pullover",
  "Shirt",
  "T-shirt/top",
  "Trouser",
  "Sandal",
  "Sneaker",
  "Ankle boot",
  "Bag",
];

// Keep sortOutfit as is, it uses category names
export function sortOutfit(outfit: GeneratedOutfit): GeneratedOutfit {
  const displayOutfit: GeneratedOutfit = {};

  for (const category of displayOrder) {
    if (outfit[category]) {
      displayOutfit[category] = outfit[category];
    }
  }

  // Add any categories not in the displayOrder but present in the outfit
  Object.keys(outfit).forEach((key) => {
    if (!displayOrder.includes(key as Category)) {
      displayOutfit[key as Category] = outfit[key as Category];
    }
  });

  return displayOutfit;
}

function AddItem({
  outfit,
  setOutfit,
}: {
  outfit: GeneratedOutfit | null;
  setOutfit: React.Dispatch<React.SetStateAction<GeneratedOutfit | null>>;
}) {
  // Identify missing categories by name
  const missingCategoryNames = displayOrder.filter((categoryName) =>
    outfit ? !outfit[categoryName] : true,
  );

  // Map missing category names to their IDs for the select component
  const missingCategoryIds = missingCategoryNames
    .map((categoryName) => categoryIdMapping[categoryName])
    .filter((categoryId) => categoryId !== undefined); // Filter out any undefined IDs

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  ); // State for category ID
  const [categoryItems, setCategoryItems] = useState<ExtendedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      // Check for null
      fetchCategoryItems(selectedCategoryId);
    } else {
      setCategoryItems([]);
    }
  }, [selectedCategoryId]);

  const fetchCategoryItems = async (categoryId: number) => {
    // Expect category ID
    setIsLoading(true);
    try {
      const response = await fetch(`/api/item?category_id=${categoryId}`); // Use category ID in API call
      if (!response.ok) throw new Error("Failed to fetch items");

      const data = await response.json();
      setCategoryItems(data);
    } catch (error) {
      console.error("Error fetching category items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (newItem: ExtendedItem) => {
    setOutfit((prev) => {
      if (!prev)
        return { [newItem.category_tag.category_name]: newItem } as GeneratedOutfit;
      return {
        ...prev,
        [newItem.category_tag.category_name]: newItem,
      };
    });
    setDrawerOpen(false); // Close drawer after selecting
    setSelectedCategoryId(null); // Reset selected category ID
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full">
          Add Item
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh] top-[5vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <span>Add Item to Outfit</span>
            {selectedCategoryId !== null && (
              <Badge variant="outline" className="ml-2">
                {categoryItems.length || 0} items
              </Badge>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 overflow-y-auto">
          <div className="mb-4">
            <CategorySelect
              categories={missingCategoryIds}
              value={selectedCategoryId}
              onChange={(value) => setSelectedCategoryId(value)}
            />
          </div>

          {selectedCategoryId !== null &&
            (isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : categoryItems.length === 0 ? (
              <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
                No items found for this category.
              </div>
            ) : (
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger
                      value="carousel"
                      className="flex items-center gap-1"
                    >
                      <Layers className="h-4 w-4" />
                      <span>Carousel</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-1"
                    >
                      <Grid2X2 className="h-4 w-4" />
                      <span>Grid</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="carousel" className="mt-0">
                  <Carousel className="w-full max-w-md mx-auto">
                    <CarouselContent>
                      {categoryItems.map((categoryItem) => (
                        <CarouselItem key={categoryItem.item_id}>
                          <div className="space-y-4 p-1">
                            <ClothingItem
                              src={categoryItem.item_url}
                              name={categoryItem.item_name}
                              category={
                                categoryItem.category_tag.category_name as Category
                              }
                              alt={categoryItem.item_name}
                              size={categoryItem.size_tag.size_name as Size}
                              colour={
                                {
                                  value: categoryItem.colour_tag.colour_value,
                                  name: categoryItem.colour_tag.colour_name,
                                } as Colour
                              }
                            />
                            <DrawerClose asChild>
                              <Button
                                className="w-full"
                                onClick={() => handleAddItem(categoryItem)}
                              >
                                Select
                              </Button>
                            </DrawerClose>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-center mt-4">
                      <CarouselPrevious className="static translate-y-0 mr-2" />
                      <CarouselNext className="static translate-y-0 ml-2" />
                    </div>
                  </Carousel>
                </TabsContent>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[40vh] overflow-y-auto p-1">
                    {categoryItems.map((categoryItem) => (
                      <div
                        key={categoryItem.item_id}
                        className={cn(
                          "border rounded-lg p-3 flex flex-col items-center gap-2 transition-all hover:border-muted-foreground/20 cursor-pointer",
                        )}
                        onClick={() => handleAddItem(categoryItem)}
                      >
                        <ClothingItem
                          src={categoryItem.item_url}
                          name={categoryItem.item_name}
                          category={
                            categoryItem.category_tag.category_name as Category
                          }
                          alt={categoryItem.item_name}
                          size={categoryItem.size_tag.size_name as Size}
                          colour={
                            {
                              value: categoryItem.colour_tag.colour_value,
                              name: categoryItem.colour_tag.colour_name,
                            } as Colour
                          }
                        />
                        <div className="text-center text-xs text-muted-foreground">
                          {categoryItem.item_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// NewOutfit component remains the same as in the previous response
export function NewOutfit({
  outfit,
  setOutfit,
  className,
}: {
  outfit: GeneratedOutfit | null;
  setOutfit: React.Dispatch<React.SetStateAction<GeneratedOutfit | null>>;
  className?: string;
}) {
  const [displayOutfit, setDisplayOutfit] = useState<GeneratedOutfit | null>(
    null,
  );

  useEffect(() => {
    if (!outfit) {
      setDisplayOutfit(null);
      return;
    }

    setDisplayOutfit(sortOutfit(outfit));
  }, [outfit, setOutfit]);

  const handleSelectItem = (key: Category, newItem: ExtendedItem) => {
    if (!outfit) return;

    setOutfit((prev) => ({
      ...prev,
      [key]: newItem,
    }));
  };

  const handleDeleteItem = (categoryName: Category) => {
    if (!outfit) return;

    setOutfit((prev) => {
      if (!prev) return null;
      const newOutfit = { ...prev };
      delete newOutfit[categoryName];
      return newOutfit;
    });
  };

  // Check if outfit is empty (no items in displayOrder or other categories)
  const isOutfitEmpty = !outfit || Object.keys(sortOutfit(outfit)).length === 0;

  if (isOutfitEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed rounded-lg bg-muted/20">
        <Hanger className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No items in this outfit</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add items to create your outfit
        </p>
        <div className="mt-4">
          <AddItem outfit={outfit} setOutfit={setOutfit} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4">
        {displayOutfit &&
          Object.keys(displayOutfit).map((key) => {
            const item = displayOutfit[key as Category];
            return (
              item && (
                <div key={item.item_id} className="relative">
                  <OutfitItem
                    className="mx-auto w-3/4"
                    item={item}
                    categoryName={item.category_tag.category_name}
                    onSelectItem={(newItem) =>
                      handleSelectItem(key as Category, newItem)
                    }
                    edit={true}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 right-4 rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-900/50"
                    onClick={() =>
                      handleDeleteItem(item.category_tag.category_name as Category)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )
            );
          })}
      </div>
      <AddItem outfit={outfit} setOutfit={setOutfit} />
    </div>
  );
}
