import { CreatePostQuickAction } from '@/components/post/create-post-quick-action';
import { CreateOutfitQuickAction } from '@/components/wardrobe/create-outit-quick-action';
import { UploadItemQuickAction } from '@/components/wardrobe/upload-item-quick-action';
import { PlusCircle } from 'lucide-react';
import React from 'react'

export default function CreatePage() {
  return (
    <div>
      <header className="p-4 flex gap-2 items-center border-b">
        <PlusCircle className="w-5 h-5" />
        <span className="text-xl font-semibold">
          Create
        </span>
      </header>
      <main className="flex-1 grid grid-rows-3 p-4 gap-2">
        <CreatePostQuickAction className="flex-1" />
        <CreateOutfitQuickAction className="flex-1" />
        <UploadItemQuickAction className="flex-1" />
      </main>
    </div>
  );
}
