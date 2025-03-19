/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, FormEvent, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (address: string) => void;
  placeholder: string;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [address, setAddress] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(address);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto my-4">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={placeholder}
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
