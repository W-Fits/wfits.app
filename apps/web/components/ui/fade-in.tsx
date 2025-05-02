"use client";

import { motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { Children } from "react";

interface FadeInProps {
  className?: string;
  delay?: number;
  variants?: Variants;
  children: React.ReactNode;
}

export function FadeIn({
  className,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: { delay },
    }),
  },
  children
}: FadeInProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
