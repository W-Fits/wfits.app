"use client";

import type { Item, Outfit } from "@prisma/client";
import { OutfitItem } from "./outfit-item";
import { Fragment, useEffect, useState, useTransition } from "react";
import { useOptionalState } from "@/lib/hooks/use-optional-state";
import { FolderIcon as Hanger, Trash2 } from "lucide-react"; // Import Trash2 icon
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import {
  AlertDialog, // Import AlertDialog components
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Import your server actions
import { updateOutfit } from "@/lib/actions/update-outfit";
import { deleteOutfit } from "@/lib/actions/delete-outfit";

export interface ExtendedItem extends Item {
  category_tag: {
    category_id: number;
    category_name: string;
  };
  colour_tag: {
    colour_id: number;
    colour_name: string;
    colour_value: string;
  };
  size_tag: {
    size_id: number;
    size_name: string;
  };
}

export interface OutfitWithItems extends Outfit {
  outfit_items: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[];
}

export interface DisplayOutfit {
  [key: string]: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[];
}

export function getDisplayOutfit(outfit: OutfitWithItems) {
  const displayOutfit: DisplayOutfit = {
    Coat: [],
    Pullover: [],
    Shirt: [],
    "T-shirt/top": [],
    Trouser: [],
    Sandal: [],
    Sneaker: [],
    "Ankle boot": [],
    Bag: [],
  };

  outfit.outfit_items.forEach((outfit_item) => {
    const categoryName = outfit_item.item.category_tag.category_name;
    if (displayOutfit[categoryName]) {
      displayOutfit[categoryName].push(outfit_item);
    }
  });

  return displayOutfit;
}

export function Outfit({
  initialOutfit,
  edit = false,
  outfit: outfitProp,
  setOutfit: setOutfitProp,
  className,
}: {
  initialOutfit: OutfitWithItems;
  edit?: boolean;
  outfit?: OutfitWithItems | null;
  setOutfit?: React.Dispatch<React.SetStateAction<OutfitWithItems | null>>;
  className?: string;
}) {
  const [outfit, setOutfit] = useOptionalState({
    initialValue: initialOutfit,
    value: outfitProp,
    setValue: setOutfitProp,
  });

  const [displayOutfit, setDisplayOutfit] = useState<DisplayOutfit>({
    Coat: [],
    Pullover: [],
    Shirt: [],
    "T-shirt/Top": [],
    Trouser: [],
    Sandal: [],
    Sneaker: [],
    "Ankle boot": [],
    Bag: [],
  });

  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition(); // Transition for delete

  useEffect(() => {
    if (!outfit) return;
    setDisplayOutfit(getDisplayOutfit(outfit));
  }, [outfit]);

  const handleSelectItem = async (oldItem: ExtendedItem, newItem: ExtendedItem) => {
    if (!outfit) return;

    const prevOutfit = outfit;
    const updatedOutfitItems = [
      ...outfit.outfit_items.filter(
        (item) => item.item.item_id !== oldItem.item_id,
      ),
      { item_id: newItem.item_id, outfit_id: outfit.outfit_id, item: newItem },
    ];

    const optimisticOutfit: OutfitWithItems = {
      ...outfit,
      outfit_items: updatedOutfitItems,
    };

    setOutfit(optimisticOutfit);
    setDisplayOutfit(getDisplayOutfit(optimisticOutfit));

    startTransition(async () => {
      const result = await updateOutfit(outfit.outfit_id, oldItem.item_id, newItem.item_id);

      if (result.error) {
        toast.error(result.error);
        setOutfit(prevOutfit);
        setDisplayOutfit(getDisplayOutfit(prevOutfit));
      } else {
        toast.success("Outfit updated successfully!");
      }
    });
  };

  const handleDeleteOutfit = async () => {
    if (!outfit) return;

    // Optimistic removal (optional, but provides immediate feedback)
    // If you're navigating away after deletion, this might not be necessary.
    // If deleting an outfit from a list without navigation, you'd remove it here.
    // For this example, we'll rely on success feedback and potential list refresh.

    startDeleteTransition(async () => {
      const result = await deleteOutfit(outfit.outfit_id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Outfit deleted successfully!");
        // You likely want to redirect or remove the outfit from a list here
        // based on how your application handles outfit deletion.
        // Example: If on an outfit detail page, redirect to a list page.
        // router.push('/outfits'); // Assuming you have a router
      }
    });
  };

  if (!outfit || outfit.outfit_items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed rounded-lg bg-muted/20">
        <Hanger className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No items in this outfit</h3>
        <p className="text-sm text-muted-foreground mt-1">Add items to create your outfit</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{outfit.outfit_name}</h1>
        <div className="flex items-center gap-2"> {/* Container for count and delete button */}
          <div className="text-sm text-muted-foreground">{outfit.outfit_items.length} items</div>

          {/* Delete Button with Confirmation */}
          {edit && ( // Only show delete button in edit mode
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={isDeleting}
                  aria-label="Delete Outfit"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your outfit and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOutfit} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        {Object.keys(displayOutfit).map((category) => (
          <Fragment key={category}>
            {displayOutfit[category].map((outfit_item) => (
              <OutfitItem
                key={outfit_item.item.item_id}
                className="mx-auto w-3/4"
                item={outfit_item.item}
                categoryName={outfit_item.item.category_tag.category_name}
                onSelectItem={!isPending && !isDeleting ? (newItem) => handleSelectItem(outfit_item.item, newItem) : undefined}
                edit={edit}
                isPending={isPending || isDeleting} // Disable item selection during delete
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
