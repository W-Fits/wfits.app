"use client";

import Image from 'next/image';
import React from 'react'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomeHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex justify-between border-b p-4">
      {pathname === "/" ? (
        <span className="flex gap-1.5">
          <Image
            className="w-6 h-6"
            alt="icon"
            src="/icon"
            width="200"
            height="200"
          />
          <Label className="text-xl font-bold">
            W Fits
          </Label>
        </span>
      ) : (
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </Button>
      )}
      <Link className="" href="/search">
        <Search className="h-6 w-6 text-muted-foreground active:text-primary" />
      </Link>
    </header >
  );
}
