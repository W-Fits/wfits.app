"use client"

import { useEffect, useState } from "react"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Grid2X2, Layers } from "lucide-react"
import type { ExtendedItem } from "./outfit"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ClothingItem } from "@/components/wardrobe/clothing-item"
import { Category } from "@/components/shared/category-select"
import { Size } from "@/components/shared/size-select"
import { Colour } from "@/components/shared/colour-select"

export function OutfitItem({
  item,
  categoryName,
  onSelectItem,
  className,
  edit = false
}: {
  item: ExtendedItem;
  categoryName: string;
  onSelectItem: (newItem: ExtendedItem) => void;
  className?: string;
  edit?: boolean;
}) {
  const [categoryItems, setCategoryItems] = useState<ExtendedItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number>(item.item_id)

  useEffect(() => {
    fetchCategoryItems();
  }, [item]);

  const fetchCategoryItems = async () => {
    if (categoryItems.length > 0) return // Don't fetch if we already have items

    setIsLoading(true)
    try {
      const response = await fetch(`/api/item?category_id=${item.category_id}`)
      if (!response.ok) throw new Error("Failed to fetch items")

      const data = await response.json()
      setCategoryItems(data)
    } catch (error) {
      console.error("Error fetching category items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectItem = (newItem: ExtendedItem) => {
    setSelectedItemId(newItem.item_id)
    onSelectItem(newItem)
  }

  return (
    <Drawer>
      <DrawerTrigger disabled={!edit} asChild>
        <div className={cn("group relative flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-background", className)}>
          <ClothingItem
            src={item.item_url}
            name={item.item_name}
            category={item.category_tag.category_name as Category}
            alt="Name"
            size={item.size_tag.size_name as Size}
            colour={{ value: item.colour_tag.colour_value, name: item.colour_tag.colour_name } as Colour}
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh] top-[5vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <span>{categoryName} Options</span>
            <Badge variant="outline" className="ml-2">
              {categoryItems.length || 0} items
            </Badge>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="carousel" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="carousel" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Carousel</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
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
                            src={item.item_url}
                            name={item.item_name}
                            category={item.category_tag.category_name as Category}
                            alt="Name"
                            size={item.size_tag.size_name as Size}
                            colour={{ value: item.colour_tag.colour_value, name: item.colour_tag.colour_name } as Colour}
                          />
                          <DrawerClose asChild>
                            {selectedItemId == categoryItem.item_id ? (
                              <Button className="w-full opacity-50">
                                Selected
                              </Button>
                            ) : (
                              <Button
                                className="w-full"
                                onClick={() => handleSelectItem(categoryItem)}
                              >
                                {selectedItemId === categoryItem.item_id ? "Selected" : "Select"}
                              </Button>
                            )}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
                  {categoryItems.map((categoryItem) => (
                    <div
                      key={categoryItem.item_id}
                      className={cn(
                        "border rounded-lg p-3 flex flex-col items-center gap-2 transition-all",
                        selectedItemId === categoryItem.item_id
                          ? "border-primary border-2 shadow-sm"
                          : "hover:border-muted-foreground/20",
                      )}
                    >
                      <ClothingItem
                        src={item.item_url}
                        name={item.item_name}
                        category={item.category_tag.category_name as Category}
                        alt="Name"
                        size={item.size_tag.size_name as Size}
                        colour={{ value: item.colour_tag.colour_value, name: item.colour_tag.colour_name } as Colour}
                      />
                      <DrawerClose asChild>
                        <Button
                          variant={selectedItemId === categoryItem.item_id ? "secondary" : "default"}
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleSelectItem(categoryItem)}
                        >
                          {selectedItemId === categoryItem.item_id ? "Selected" : "Select"}
                        </Button>
                      </DrawerClose>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DrawerContent >
    </Drawer >
  )
}