import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function CreateOutfitQuickAction() {
  return (
    <Link href="/wardrobe/outfits/create">
      <div className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer h-full bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
            <PlusCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium">Create New Outfit</h3>
            <p className="text-sm text-muted-foreground">Combine your items into a new outfit</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
