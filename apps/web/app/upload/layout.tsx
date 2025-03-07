import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "W Fits | Upload",
  description: "Your AI powered outfit planner.",
};

export default function UploadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex mx-auto md:min-w-4xl pt-14 px-4 py-2">
      {children}
    </main>
  );
}
