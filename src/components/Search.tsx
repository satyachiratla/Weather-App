import { FormEvent, RefObject } from "react";
import { FiSearch } from "react-icons/fi";

type SearchProps = {
  onSearch: (event: FormEvent) => void;
  searchRef: RefObject<HTMLInputElement>;
};

export default function Search({ onSearch, searchRef }: SearchProps) {
  return (
    <form onSubmit={onSearch} className="py-6 flex gap-2 justify-center">
      <input
        type="text"
        ref={searchRef}
        placeholder="Search City"
        className="py-3 pl-6 pr-3 w-[70%] rounded-full bg-sky-200 outline-none"
      />
      <button
        type="submit"
        className="bg-sky-200 rounded-full w-12 h-12 flex justify-center items-center"
      >
        <FiSearch />
      </button>
    </form>
  );
}
