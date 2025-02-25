import { GridPattern } from "@/components/ui/animated-grid-pattern";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
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
    </main>
  );
}