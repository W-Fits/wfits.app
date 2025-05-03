import { GridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="text-balance -mt-24 text-center z-10">
        <WordFadeIn
          className="z-10 whitespace-pre-wrap text-center text-6xl font-medium  text-black tracking-tighter"
          words="W Fits"
        />
        <WordFadeIn
          className="z-10 whitespace-pre-wrap text-center text-4xl font-medium/relaxed text-neutral-800 tracking-tighter"
          words="Your AI powered outfit planner."
          initialDelay={0.6}
        />
        <WordFadeIn
          className="z-10 whitespace-pre-wrap text-center text-4xl font-medium/relaxed text-neutral-500 tracking-tighter"
          words="Coming soon."
          initialDelay={1.6}
          shiny
        />
        {!session && (
          <FadeIn delay={2.6} className="z-10 mt-4">
            <Link href="/sign-in">
              <Button className="px-4 py-2 mt-4 text-sm font-medium text-white bg-black rounded-full shadow-sm">
                Sign In
              </Button>
            </Link>
          </FadeIn>
        )}
      </div>
      <GridPattern
        numSquares={40}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(100vh_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12",
        )}
      />
    </section>
  );
}