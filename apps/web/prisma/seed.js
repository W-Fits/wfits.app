const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clothingClass = [
  "T-shirt/top",
  "Trouser",
  "Pullover",
  "Dress",
  "Coat",
  "Sandal",
  "Shirt",
  "Sneaker",
  "Bag",
  "Ankle boot",
];

const colours = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Grey", value: "#808080" },
  { name: "Navy", value: "#000080" },
  { name: "Beige", value: "#F5F5DC" },
  { name: "Brown", value: "#8B4513" },
  { name: "Red", value: "#FF0000" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Green", value: "#008000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Purple", value: "#800080" },
  { name: "Cream", value: "#FFFDD0" },
  { name: "Khaki", value: "#C3B091" },
  { name: "Teal", value: "#008080" },
  { name: "Mustard", value: "#FFDB58" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Olive", value: "#808000" },
  { name: "Maroon", value: "#800000" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Magenta", value: "#FF00FF" },
];

const sizes = ["xs", "s", "m", "l", "xl"];

async function main() {
  try {
    console.log("Starting seed process...");
    if (await prisma.sizeTag.count() === 0) {
      await prisma.sizeTag.createMany({
        data: sizes.map((size, index) => ({ size_id: index, size_name: size }))
      });
    }

    if (await prisma.colourTag.count() === 0) {
      await prisma.colourTag.createMany({
        data: colours.map(({ name, value }, index) => ({ colour_id: index, colour_name: name, colour_value: value }))
      });
    }

    if (await prisma.categoryTag.count() === 0) {
      await prisma.categoryTag.createMany({
        data: clothingClass.map((category, index) => ({ category_id: index, category_name: category }))
      });
    }

    console.log("Seed process completed!");
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main();