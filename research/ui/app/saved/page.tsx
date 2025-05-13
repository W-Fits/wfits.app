"use client";  // 👈 Add this at the top

import Head from "next/head";
import { useState } from "react";

export default function Saved() {
  const [darkMode, setDarkMode] = useState(true);

  const outfits = [
    { id: 1, name: "Outfit name #1" },
    { id: 2, name: "Outfit name #2" },
  ];

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} min-h-screen p-4 transition-all duration-300`}>
      <Head>
        <title>Saved Outfits</title>
      </Head>

      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} p-4 shadow-md flex justify-between items-center rounded-md`}>
        <button onClick={toggleDarkMode} className="text-lg">
          {darkMode ? "🌙" : "☀️"}
        </button>
        <h1 className="text-lg font-bold">Saved</h1>
        <button className="bg-red-500 hover:bg-red-600 p-2 rounded-md">⬇️</button>
      </header>

      {/* Saved Outfits */}
      {outfits.map((outfit) => (
        <div key={outfit.id} className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} my-4 rounded-md shadow-md p-4 transition`}>
          {/* Outfit Name */}
          <div className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} p-2 rounded-md text-center font-bold`}>
            {outfit.name}
          </div>

          {/* Outfit Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-300 hover:bg-gray-200"} h-32 flex items-center justify-center rounded-md shadow-md transition`}
              >
                <span>🖼️</span>
              </div>
            ))}
          </div>

          {/* Edit and Shirt Icons */}
          <div className="flex gap-2 mt-2">
            <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-200"} p-2 rounded-md`}>✏️</button>
            <button className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-200"} p-2 rounded-md`}>👕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
