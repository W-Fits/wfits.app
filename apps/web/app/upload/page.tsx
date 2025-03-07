"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/upload/image-upload"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return
    console.log("Uploading file:", file.name);
  }

  return (
    <section className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Image Upload</h1>
          <p className="text-muted-foreground">Upload an image by dragging & dropping or clicking to browse</p>
        </div>

        <ImageUpload onChange={setFile} value={file} maxSizeMB={5} />

        <button
          onClick={handleUpload}
          disabled={!file}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Upload Image
        </button>
      </div>
    </section>
  )
}