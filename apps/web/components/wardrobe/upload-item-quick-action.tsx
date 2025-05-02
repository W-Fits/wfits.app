import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function UploadItemQuickAction() {
  return (
    <Link href="/wardrobe/clothes/upload">
      <div className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer h-full bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
            <PlusCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium">Add New Item</h3>
            <p className="text-sm text-muted-foreground">Upload a new clothing item to your wardrobe</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
