"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ExtendedOutfit } from "@/app/profile/[username]/page";
import { SmallOutfit } from "@/components/wardrobe/small-outfit";

export default function OutfitSelector({
  availableOutfits,
  onOutfitsChange,
}: {
  availableOutfits: ExtendedOutfit[];
  onOutfitsChange: (selectedOutfits: ExtendedOutfit[]) => void;
}) {
  const [selectedOutfits, setSelectedOutfits] = useState<ExtendedOutfit[]>([]);
  const [open, setOpen] = useState(false);

  const toggleOutfit = (outfit: ExtendedOutfit) => {
    setSelectedOutfits((prev) => {
      const alreadySelected = prev.find((o) => o.outfit_id === outfit.outfit_id);
      return alreadySelected
        ? prev.filter((o) => o.outfit_id !== outfit.outfit_id)
        : [...prev, outfit];
    });
  };

  const handleClose = () => {
    onOutfitsChange(selectedOutfits);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2>Selected Outfits</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
          {selectedOutfits.map((outfit) => (
            <SmallOutfit key={outfit.outfit_id} outfit={outfit} />
          ))}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Select Outfits</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Outfits</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {availableOutfits.map((outfit) => (
              <div
                key={outfit.outfit_id}
                className={`cursor-pointer border rounded-xl p-2 transition ${selectedOutfits.find((o) => o.outfit_id === outfit.outfit_id)
                  ? "border-blue-500"
                  : "border-muted"
                  }`}
                onClick={() => toggleOutfit(outfit)}
              >
                <SmallOutfit outfit={outfit} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}