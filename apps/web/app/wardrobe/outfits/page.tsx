import Link from "next/link";

export default function OutfitsPage() {
  return (
    <section>
      <header className="pt-12">
        <h1 className="text-3xl font-bold tracking-tight">My Outfits</h1>
      </header>
      <div className="flex flex-col gap-1">
        <Link
          className="px-2 py-1 w-fit rounded-md bg-primary text-background"
          href="/wardrobe/outfits/create"
        >
          Create Outfit
        </Link>
      </div>
    </section>
  );
}