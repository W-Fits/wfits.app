"use client"

import { useState } from "react"
import Image from "next/image"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Check, Grid2X2, Layers } from "lucide-react"
import { ExtendedItem } from "./outfit"

interface OutfitItemProps {
  item: ExtendedItem
  categoryName: string
  onSelectItem: (newItem: ExtendedItem) => void
}

export function OutfitItem({ item, categoryName, onSelectItem }: OutfitItemProps) {
  const [categoryItems, setCategoryItems] = useState<ExtendedItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number>(item.item_id)

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
      <DrawerTrigger asChild>
        <div
          className="border w-fit p-2 m-2 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={fetchCategoryItems}
        >
          <Image
            src={item.item_url || "/placeholder.svg"}
            alt={item.item_name}
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] top-[10vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold">{categoryName} Options</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="carousel" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="carousel" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Carousel</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center gap-1">
                    <Grid2X2 className="h-4 w-4" />
                    <span>Grid</span>
                  </TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">{categoryItems.length} items</div>
              </div>

              <TabsContent value="carousel" className="mt-0">
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {categoryItems.map((categoryItem) => (
                      <CarouselItem key={categoryItem.item_id}>
                        <div className="p-1">
                          <div
                            className={`flex flex-col items-center p-2 border rounded-lg ${selectedItemId === categoryItem.item_id ? "border-primary border-2" : ""
                              }`}
                          >
                            <div className="relative w-full">
                              <Image
                                src={categoryItem.item_url || "/placeholder.svg"}
                                alt={categoryItem.item_name}
                                width={200}
                                height={200}
                                className="object-cover rounded-md mx-auto"
                              />
                              {selectedItemId === categoryItem.item_id && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <h3 className="font-medium">{categoryItem.item_name}</h3>
                              <DrawerClose asChild>
                                <Button
                                  variant={selectedItemId === categoryItem.item_id ? "secondary" : "default"}
                                  className="mt-2 w-full"
                                  onClick={() => handleSelectItem(categoryItem)}
                                >
                                  {selectedItemId === categoryItem.item_id ? "Selected" : "Select"}
                                </Button>
                              </DrawerClose>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </TabsContent>

              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                  {categoryItems.map((categoryItem) => (
                    <div
                      key={categoryItem.item_id}
                      className={`border rounded-lg p-2 flex flex-col items-center ${selectedItemId === categoryItem.item_id ? "border-primary border-2" : ""
                        }`}
                    >
                      <div className="relative w-full">
                        <Image
                          src={categoryItem.item_url || "/placeholder.svg"}
                          alt={categoryItem.item_name}
                          width={100}
                          height={100}
                          className="object-cover rounded-md mx-auto"
                        />
                        {selectedItemId === categoryItem.item_id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-center w-full">
                        <h3 className="text-sm font-medium truncate max-w-full">{categoryItem.item_name}</h3>
                        <DrawerClose asChild>
                          <Button
                            variant={selectedItemId === categoryItem.item_id ? "secondary" : "default"}
                            size="sm"
                            className="mt-2 w-full text-xs"
                            onClick={() => handleSelectItem(categoryItem)}
                          >
                            {selectedItemId === categoryItem.item_id ? "Selected" : "Select"}
                          </Button>
                        </DrawerClose>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
