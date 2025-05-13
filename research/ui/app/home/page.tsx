"use client";

import { useState } from "react";
import { Menu, Shirt, Camera, Archive, Bookmark, Settings, Cloud } from "lucide-react";
import Link from "next/link";

export default function WFitsDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { href: "/outfits", label: "Generate Outfit", icon: <Shirt size={20} /> },
    { href: "/camera", label: "Add Item", icon: <Camera size={20} /> },
    { href: "/saved", label: "Saved Outfits", icon: <Archive size={20} /> },
    { href: "/weather", label: "Weather", icon: <Cloud size={20} /> },
    { href: "/bookmark", label: "Bookmarks", icon: <Bookmark size={20} /> },
    { href: "/setting", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-black text-white w-64 p-4 space-y-4 ${menuOpen ? "block" : "hidden"} sm:block`}>
        <div className="text-xl font-bold flex items-center space-x-2">
          <span className="text-2xl">👚</span>
          <span>W-FITS</span>
        </div>
        <nav className="space-y-2">
          <div className="flex items-center space-x-2 p-2 rounded bg-gray-800">
            <span className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full">WF</span>
            <span>Account</span>
          </div>
          {nav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center space-x-2 p-2 w-full hover:bg-gray-800"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <header className="flex items-center justify-between bg-black text-white p-4">
          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
          <div className="text-xl font-bold flex items-center space-x-2">
            <span className="text-2xl">👚</span>
            <span>W-FITS</span>
          </div>
        </header>
        <section className="mt-4">
          <h2 className="text-lg font-bold bg-red-200 p-2">Your most recent fit:</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-300 w-full h-32 flex items-center justify-center">📷</div>
            <div className="bg-gray-300 w-full h-32 flex items-center justify-center">📷</div>
            <div className="bg-gray-300 w-full h-32 flex items-center justify-center">📷</div>
            <div className="bg-gray-300 w-full h-32 flex items-center justify-center">📷</div>
          </div>
        </section>
      </main>
    </div>
  );
}
