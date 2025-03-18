import { ClothingClass } from "@/components/shared/clothing-class-select";
import { Colour } from "@/components/shared/colour-select";

export type ImageResponse = {
  class: ClothingClass;
  colour: Colour;
  imageURL: string;
}

export function compress(
  image: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();


    reader.onload = (e: any) => {
      img.src = e.target.result;


      img.onload = () => {
        let width = img.width;
        let height = img.height;


        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }


        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }


        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;


        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }


        ctx.drawImage(img, 0, 0, width, height);


        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], image.name, {
                type: "image/jpeg",
                lastModified: image.lastModified,
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Could not create blob from canvas"));
            }
          },
          "image/jpeg",
          quality,
        );
      };
    };


    reader.onerror = (error) => {
      reject(error);
    };


    reader.readAsDataURL(image);
  });
};