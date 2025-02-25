"use client";

import { motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "./animated-shiny-text";

interface WordFadeInProps {
  words: string;
  className?: string;
  delay?: number;
  variants?: Variants;
  initialDelay?: number;
  shiny?: boolean;
}

export function WordFadeIn({
  words,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: { delay: initialDelay + i * delay },
    }),
  },
  className,
  initialDelay = 0,
  shiny,
}: WordFadeInProps) {
  const _words = words.split(" ");

  return (
    <motion.h1
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm",
        className,
      )}
    >
      {_words.map((word, i) => (
        <motion.span key={word} variants={variants} custom={i}>
          {shiny ? (
            <AnimatedShinyText className="inline-flex">
              {word}{" "}
            </AnimatedShinyText>
          ) : (
            word + " "
          )}
        </motion.span>
      ))}
    </motion.h1>
  );
}
