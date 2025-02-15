import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(address);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto my-4">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter wallet address (0x...)"
        className="flex-1 p-2 border border-gray-300 bg-white rounded-lg"
      />
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
      >
        <Search size={20} />
        Search
      </button>
    </form>
  );
};

export default SearchBar;
