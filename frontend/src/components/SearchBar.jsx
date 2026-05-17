import { Search } from 'lucide-react';
import { useState } from 'react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche:", query);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-4">
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des produits..."
          className="w-full pl-4 pr-12 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-r-md transition-colors flex items-center justify-center"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
