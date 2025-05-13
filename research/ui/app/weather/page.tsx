"use client";  // 👈 Ensures client-side rendering for hooks

import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [weather, setWeather] = useState(null);
  const CITY = "London";
  const API_KEY = "d385f3d968ad4b01ae2112304250104"; //  Replace with the WeatherAPI key

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&aqi=no`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen p-4 transition-all duration-300`}>
      <Head>
        <title>Outfit App</title>
      </Head>

      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 shadow-md flex justify-between items-center rounded-md`}>
        <button onClick={() => setDarkMode(!darkMode)} className="text-lg">
          {darkMode ? "🌙" : "☀️"}
        </button>
        <h1 className="text-lg font-bold">OUTFIT TITLE</h1>
        <button className="bg-red-500 hover:bg-red-600 p-2 rounded-md">⬆️</button>
      </header>

      {/* Weather/Temp Section */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 my-4 rounded-md shadow-md`}>
        <div className="flex justify-between">
          <span>🌤️ {weather ? `${weather.current.temp_c}°C` : "Loading..."}</span>
          <span>⏰</span>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm mt-2`}>
          {weather ? `Condition: ${weather.current.condition.text}` : "Fetching weather..."}
        </p>
      </div>

      {/* Outfit Items */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-md shadow-md transition`}
          >
            <div className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} w-full h-32 flex items-center justify-center rounded-md`}>
              <span>📷</span>
            </div>
            <h2 className="mt-2 font-bold">ITEM TITLE</h2>
            <div className="flex gap-2 mt-2">
              <span className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-sm rounded-full px-2`}>
                Jumper
              </span>
              <span className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-sm rounded-full px-2`}>
                Warm
              </span>
              <span className={`${darkMode ? "bg-gray-700" : "bg-gray-200"} text-sm rounded-full px-2`}>
                Red
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 mt-4 flex justify-around shadow-md rounded-md`}>
        <button>👁️</button>
        <button>➕</button>
        <button>✏️</button>
      </footer>
    </div>
  );
}
