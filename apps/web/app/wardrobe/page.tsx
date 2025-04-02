import Link from "next/link";

export default function WardrobePage() {
  // https://v0.dev/chat/next-js-wardrobe-ui-KQ6Zi7PuMvn
  return (
    <section>
      <header className="pt-12">
        <h1 className="text-3xl font-bold tracking-tight">My Wardrobe</h1>
      </header>
      <div className="flex flex-col gap-1">
        <Link
          className="px-2 py-1 w-fit rounded-md bg-primary text-background"
          href="/wardrobe/clothes"
        >
          Clothes
        </Link>
        <Link
          className="px-2 py-1 w-fit rounded-md bg-primary text-background"
          href="/wardrobe/outfits"
        >
          Outfits
        </Link>
      </div>
    </section>
  );
}