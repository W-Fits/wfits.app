import Head from "next/head";

export default function Wardrobe() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Head>
        <title>Wardrobe</title>
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <button className="text-gray-600 dark:text-gray-300">☰</button>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-300">🖼️</span>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Wardrobe #1</h1>
        </div>
        <button className="text-gray-600 dark:text-gray-300">⬇️</button>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 my-4 rounded-md shadow-md flex items-center gap-2">
        <button className="text-gray-600 dark:text-gray-300">⚙️</button>
        <input
          type="text"
          placeholder="Search"
          className="flex-grow p-2 border rounded-md outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 dark:bg-gray-700 h-40 flex items-center justify-center rounded-md shadow-md"
          >
            <span className="text-gray-900 dark:text-white">🖼️</span>
          </div>
        ))}
      </div>
    </div>
  );
}
