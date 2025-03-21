import { clothingClass, ClothingClass, slots } from "@/components/shared/clothing-class-select";
import { Colour, colours } from "@/components/shared/colour-select";
import { Size, sizes } from "@/components/shared/size-select";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColourId(colour: Colour): number {
  return colours.findIndex((item) => item.name === colour.name);
}

export function getCategoryId(c: ClothingClass): number {
  return clothingClass.findIndex((item) => item === c);
}

export function getSizeId(size: Size) {
  return sizes.findIndex((item) => item === size);
}

export function getColourById(id: number): Colour | null {
  return colours[id] ?? null;
}

export function getCategoryById(id: number): ClothingClass | null {
  return clothingClass[id] ?? null;
}

export function getSizeById(id: number): Size | null {
  return sizes[id] ?? null;
}

export function getSlot(c: ClothingClass): Number {
  return slots.findIndex((item) => item.includes(c));
}