"use client";

import { useState, useEffect } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [tempUnit, setTempUnit] = useState("C"); // Default: Celsius

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedTempUnit = localStorage.getItem("tempUnit") || "C";

    setDarkMode(savedDarkMode);
    setTempUnit(savedTempUnit);
  }, []);

  // Save preferences
  const handleSave = () => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("tempUnit", tempUnit);
    alert(`Saved: Dark Mode: ${darkMode}, Temperature Unit: ${tempUnit}`);
  };

  return (
    <div className={`min-h-screen p-45 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800 dark:text-white">

        {/* Dark Mode Toggle */}
        <label className="flex items-center mt-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="mr-2"
          />
          Enable Dark Mode
        </label>

        {/* Temperature Unit Toggle */}
        <label className="flex items-center mt-3">
          <span className="mr-2">Temperature Unit:</span>
          <select
            value={tempUnit}
            onChange={(e) => setTempUnit(e.target.value)}
            className="p-2 border rounded bg-gray-200 dark:bg-gray-700"
          >
            <option value="C">°C (UK)</option>
            <option value="F">°F (US)</option>
          </select>
        </label>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
